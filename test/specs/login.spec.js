const LoginPage = require('../../pages/LoginPage');
const HomePage = require('../../pages/HomePage');
const testData = require('../data/test-data');
const uiText = require('../data/ui-text.json');
const $ = require('../../pages/CommonLocator');

describe('Login', function () {
  beforeEach(async function () {
    await LoginPage.restartApp();
    await HomePage.prepareApp();
    await HomePage.openLogin();
  });

  it('LGN-001 - displays the login form', async function () {
    await expect($.textVisible(uiText.common.loginTitle)).toBeDisplayed();
    await expect(LoginPage.mobileEmailField).toBeDisplayed();
    await expect(LoginPage.passwordField).toBeDisplayed();
    await expect(LoginPage.forgotPasswordLink).toBeDisplayed();
    await expect(LoginPage.loginButton).toBeDisplayed();
    await expect(LoginPage.signUpLink).toBeDisplayed();
  });

  it('LGN-002 - blocks submission when both fields are empty', async function () {
    await LoginPage.submit();
    await expect($.text(uiText.login.fieldRequired)).toBeDisplayed();
  });

  it('LGN-003 - validates a missing identifier', async function () {
    await LoginPage.enterPassword(testData.invalidPassword);
    await LoginPage.submit();
    await expect($.text(uiText.login.fieldRequired)).toBeDisplayed();
  });

  it('LGN-004 - validates a missing password', async function () {
    await LoginPage.enterIdentifier(testData.validFormatEmail);
    await LoginPage.submit();
    await expect($.text(uiText.login.fieldRequired)).toBeDisplayed();
  });

  it('LGN-005 - rejects an unregistered identifier', async function () {
    await LoginPage.login(testData.unregisteredEmail, testData.invalidPassword);
    await expect($.text(uiText.login.invalidCredentials)).toBeDisplayed();
  });

  it('LGN-006 - opens Forgot Password', async function () {
    await LoginPage.openForgotPassword();
    await expect($.text(uiText.accountRecovery.title)).toBeDisplayed();
  });
});
