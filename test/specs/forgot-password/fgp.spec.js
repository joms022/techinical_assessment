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

describe('Forgot Password and Account Recovery', function () {
  beforeEach(async function () {
    await ForgotPasswordPage.restartApp();
    await HomePage.prepareApp();
    await HomePage.openLogin();
    await LoginPage.openForgotPassword();
    await ForgotPasswordPage.submitIdentifier(testData.validFormatEmail);

    try {
      await waitDisplayed($.text(uiText.accountRecovery.title), NETWORK_TIMEOUT);
    } catch (error) {
      const currentScreen = await browser.getPageSource().catch(() => '');
      if (/captcha|recaptcha|verify.{0,20}human|i am not a robot|robot verification/i.test(currentScreen)) {
        this.skip('CAPTCHA challenge blocked Forgot Password setup');
      }
      throw error;
    }
  });

  describe('FGP - Forgot Password and Account Recovery', function () {
    it('FGP-001 - opens account recovery', async function () {
      await waitDisplayed($.text(uiText.accountRecovery.title));
    });

    it('FGP-002 - displays account information fields', async function () {
      await ForgotPasswordPage.continueFromAccountRecovery();
      await waitDisplayed($.text(uiText.accountRecovery.yourInformation));
      await waitDisplayed(ForgotPasswordPage.emailField);
      await waitDisplayed(ForgotPasswordPage.mobileField);
      await waitDisplayed(ForgotPasswordPage.accountInfoContinueButton);
      await waitDisplayed(ForgotPasswordPage.cancelButton);
    });

    it('FGP-003 - blocks empty account information', async function () {
      await ForgotPasswordPage.continueFromAccountRecovery();
      await ForgotPasswordPage.submitEmptyForm();
      await waitDisplayed($.text(uiText.login.fieldRequired));
    });

    it('FGP-004 - proceeds with an unregistered email', async function () {
      await ForgotPasswordPage.continueFromAccountRecovery();
      await ForgotPasswordPage.submitAccountInformation(testData.unregisteredEmail, testData.validFormatMobile);
      await waitDisplayed($.text(uiText.accountRecovery.residentialAddress), NETWORK_TIMEOUT);
    });

    it('FGP-005 - continues with a synthetic residential address', async function () {
      await openAddressScreen();
      await fillValidAddress();
      await ForgotPasswordPage.continue();
      await waitDisplayed($.text(uiText.accountRecovery.selectIdType));
    });

    it('FGP-006 - refreshes the city when the province changes', async function () {
      await openAddressScreen();
      await ForgotPasswordPage.chooseProvince(
        $.text(uiText.accountRecovery.chooseProvince),
        $.text(uiText.accountRecovery.provinceMetroManila)
      );
      await ForgotPasswordPage.chooseCity(
        $.text(uiText.accountRecovery.chooseCity),
        $.text(uiText.accountRecovery.cityManila)
      );
      await ForgotPasswordPage.chooseProvince(
        $.text(uiText.accountRecovery.chooseProvince),
        $.text(uiText.accountRecovery.provinceAbra)
      );
      await waitDisplayed($.text(uiText.accountRecovery.provinceAbra));
      await waitDisplayed($.text(uiText.accountRecovery.chooseCity));
    });
  });
});
