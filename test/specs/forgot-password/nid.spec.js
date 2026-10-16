const ForgotPasswordPage = require('../../../pages/ForgotPasswordPage');
const LoginPage = require('../../../pages/LoginPage');
const HomePage = require('../../../pages/HomePage');
const testData = require('../../data/test-data');
const uiText = require('../../data/ui-text.json');
const $ = require('../../../pages/CommonLocator');

const NETWORK_TIMEOUT = 30000;

async function waitDisplayed(element, timeout = 15000) {
  await element.waitForDisplayed({ timeout });
}

async function openAddressScreen() {
  await ForgotPasswordPage.continueFromAccountRecovery();
  await ForgotPasswordPage.submitAccountInformation(testData.unregisteredEmail, testData.validFormatMobile);
  await waitDisplayed($.text(uiText.accountRecovery.residentialAddress), NETWORK_TIMEOUT);
}

async function fillValidAddress() {
  await ForgotPasswordPage.enterResidentialAddress(testData.syntheticStreet, testData.validPostalCode);
  await ForgotPasswordPage.chooseProvince(
    $.text(uiText.accountRecovery.chooseProvince),
    $.text(uiText.accountRecovery.provinceMetroManila)
  );
  await ForgotPasswordPage.chooseCity(
    $.text(uiText.accountRecovery.chooseCity),
    $.text(uiText.accountRecovery.cityManila)
  );
}

async function openNationalIdGuidance() {
  await openAddressScreen();
  await fillValidAddress();
  await ForgotPasswordPage.continue();
  await waitDisplayed($.text(uiText.accountRecovery.selectIdType));
  await ForgotPasswordPage.tap($.text(uiText.nationalId.nationalIdOption));
  await waitDisplayed(ForgotPasswordPage.nationalIdGuidanceScreen);
}

async function captureNationalIdFront(image) {
  const mocks = require('../../../test/data/app-mocks');
  await mocks.camera({ flow: 'national-id', side: 'front', outcome: 'available', image });
  await ForgotPasswordPage.tap(ForgotPasswordPage.nationalIdFrontPhotoButton);
  await waitDisplayed(ForgotPasswordPage.cameraPreview, NETWORK_TIMEOUT);
  await waitDisplayed($.text(uiText.nationalId.frontCapture));
  await mocks.camera({ flow: 'national-id', side: 'front', capture: image });
  await ForgotPasswordPage.tap(ForgotPasswordPage.nationalIdShutterButton);
  await waitDisplayed($.text(uiText.nationalId.photoClear), NETWORK_TIMEOUT);
}

async function captureNationalIdBack(image) {
  const mocks = require('../../../test/data/app-mocks');
  await mocks.camera({ flow: 'national-id', side: 'back', outcome: 'available', image });
  await ForgotPasswordPage.tap(ForgotPasswordPage.nationalIdTakeBackPhotoButton);
  await waitDisplayed(ForgotPasswordPage.cameraPreview, NETWORK_TIMEOUT);
  await waitDisplayed($.text(uiText.nationalId.backCapture));
  await mocks.camera({ flow: 'national-id', side: 'back', capture: image });
  await ForgotPasswordPage.tap(ForgotPasswordPage.nationalIdShutterButton);
  await waitDisplayed($.text(uiText.nationalId.photoClear), NETWORK_TIMEOUT);
}

describe('Forgot Password and Account Recovery', function () {
  beforeEach(async function () {
    await ForgotPasswordPage.restartApp();
    await HomePage.prepareApp();
    await HomePage.openLogin();
    await LoginPage.openForgotPassword();
    await ForgotPasswordPage.submitIdentifier(testData.validFormatEmail);
    await waitDisplayed($.text(uiText.accountRecovery.title), NETWORK_TIMEOUT);
  });

  describe('NID - National ID', function () {
    it('NID-001 - opens National ID capture guidance', async function () {
      await openAddressScreen();
      await fillValidAddress();
      await ForgotPasswordPage.continue();
      await ForgotPasswordPage.tap($.text(uiText.nationalId.nationalIdOption));
      await waitDisplayed(ForgotPasswordPage.nationalIdGuidanceScreen);
    });

    it('NID-002 - protects National ID photos and case data', async function () {
      await openNationalIdGuidance();
      await captureNationalIdFront('MOCK-NID-FRONT');
      await captureNationalIdBack('MOCK-NID-BACK');
      const caseId = await ForgotPasswordPage.nationalIdCaseId.getText();
      const evidence = await require('../../../test/data/app-mocks').collectSensitiveEvidence({
        nationalIdFrontImage: 'MOCK-NID-FRONT',
        nationalIdBackImage: 'MOCK-NID-BACK',
        caseId,
        screenshot: true,
        logs: true,
        storedImages: true
      });

      expect(JSON.stringify(evidence)).not.toContain('MOCK-NID-FRONT');
      expect(JSON.stringify(evidence)).not.toContain('MOCK-NID-BACK');
      expect(JSON.stringify(evidence)).not.toContain(caseId);
      expect(evidence.screenshotRedacted).toBe(true);
      expect(evidence.logsRedacted).toBe(true);
      expect(evidence.imagesStored).toBe(false);
    });
  });
});
