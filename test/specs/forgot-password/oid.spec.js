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

async function openOtherIdInformationScreen() {
  await openAddressScreen();
  await fillValidAddress();
  await ForgotPasswordPage.continue();
  await ForgotPasswordPage.tap(ForgotPasswordPage.otherIdOption);
  await waitDisplayed($.text(uiText.accountRecovery.idInformation));
}

async function fillValidOtherIdInformation() {
  await ForgotPasswordPage.enterOtherIdDetails({
    firstName: 'QAFirst',
    middleName: 'Test',
    lastName: 'QALast',
    dateOfBirthField: $.text(uiText.accountRecovery.dateOfBirth),
    dateOfBirthOption: $.text(uiText.accountRecovery.dateOfBirthOption),
    genderSelector: $.text(uiText.accountRecovery.gender),
    genderOption: $.text(uiText.accountRecovery.male)
  });
}

async function prepareIdPhotoStep() {
  await openOtherIdInformationScreen();
  await fillValidOtherIdInformation();
  await ForgotPasswordPage.continue();
  await waitDisplayed(ForgotPasswordPage.idInformationScreen, NETWORK_TIMEOUT);
  await ForgotPasswordPage.selectIdType(ForgotPasswordPage.idTypeSelector, $.text(uiText.idTypes.passport));
  await ForgotPasswordPage.enter(ForgotPasswordPage.idNumberField, '123456789');
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

  describe('OID - Other ID', function () {
    it('OID-001 - proceeds with synthetic Other ID details', async function () {
      await openOtherIdInformationScreen();
      await fillValidOtherIdInformation();
      await ForgotPasswordPage.continue();
      await waitDisplayed(ForgotPasswordPage.idInformationScreen, NETWORK_TIMEOUT);
    });

    it('OID-002 - handles camera permission allow and deny responses', async function () {
      const mocks = require('../../../test/data/app-mocks');
      await mocks.camera({ permission: 'allow' });
      await prepareIdPhotoStep();
      await ForgotPasswordPage.tap(ForgotPasswordPage.takePhotoButton);
      await waitDisplayed(ForgotPasswordPage.cameraPreview);

      await mocks.camera({ permission: 'deny' });
      await ForgotPasswordPage.tap(ForgotPasswordPage.takePhotoButton);
      await waitDisplayed($.text(uiText.accountRecovery.processingError));
    });
  });
});
