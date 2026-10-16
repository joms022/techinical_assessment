const SignUpPage = require('../../pages/SignUpPage');
const HomePage = require('../../pages/HomePage');
const LoginPage = require('../../pages/LoginPage');
const testData = require('../data/test-data');
const uiText = require('../data/ui-text.json');
const $ = require('../../pages/CommonLocator');

const UI_TIMEOUT = 15000;
const NETWORK_TIMEOUT = 30000;

async function waitDisplayed(element, timeout = UI_TIMEOUT) {
  await element.waitForDisplayed({ timeout });
}

async function openMobileVerification() {
  await waitDisplayed(SignUpPage.signUpButton);
  await SignUpPage.enableConsent();
  await SignUpPage.enterDetails(testData.validFormatMobile, testData.validFormatEmail);
  await SignUpPage.submit();
  await waitDisplayed(SignUpPage.mobileVerificationStep, NETWORK_TIMEOUT);
}

describe('Sign Up', function () {
  beforeEach(async function () {
    await SignUpPage.restartApp();
    await HomePage.prepareApp();

    if (await SignUpPage.isDisplayed(SignUpPage.mobileVerificationStep)) {
      await browser.back();
    }

    if (!(await SignUpPage.isDisplayed($.text(uiText.common.signupTitle)))) {
      if (await SignUpPage.isDisplayed(HomePage.signUpButton)) {
        await HomePage.openSignUp();
      } else if (await SignUpPage.isDisplayed(LoginPage.signUpLink)) {
        await LoginPage.openSignUp();
      } else {
        await HomePage.openLogin();
        await LoginPage.openSignUp();
      }
    }

    await waitDisplayed($.text(uiText.common.signupTitle), NETWORK_TIMEOUT);
    await waitDisplayed(SignUpPage.signUpButton, NETWORK_TIMEOUT);
  });

  it('SGN-001 - displays sign-up fields and links', async function () {
    await expect($.text(uiText.common.signupTitle)).toBeDisplayed();
    await expect(SignUpPage.mobileNumberField).toBeDisplayed();
    await expect(SignUpPage.emailField).toBeDisplayed();
    await expect(SignUpPage.consentCheckbox).toBeDisplayed();
    await expect($.text(uiText.signUp.consentText)).toBeDisplayed();
    await expect(SignUpPage.privacyPolicyLink).toBeDisplayed();
    await expect(SignUpPage.termsLink).toBeDisplayed();
    await expect(SignUpPage.signUpButton).toBeDisplayed();
  });

  it('SGN-002 - requires consent before sign-up', async function () {
    await SignUpPage.enterDetails(testData.validFormatMobile, testData.validFormatEmail);
    await SignUpPage.disableConsent();
    await SignUpPage.submit();
    await waitDisplayed($.text(uiText.signUp.consentRequired));
  });

  it('SGN-003 - submits synthetic data and opens mobile verification', async function () {
    await openMobileVerification();
  });

  it('SGN-004 - displays mobile verification and OTP controls', async function () {
    await openMobileVerification();
    for (const digit of SignUpPage.otpDigits) await waitDisplayed(digit);
    await waitDisplayed($.text(uiText.signUp.changeMobileNumber));
    await waitDisplayed($.textContains(uiText.signUp.resendCountdownPrefix));
  });

  it('SGN-005 - accepts only four numeric OTP digits', async function () {
    await openMobileVerification();
    for (const digit of SignUpPage.otpDigits) await waitDisplayed(digit);

    for (const value of ['12', '12345', '12a4', '12!4']) {
      await SignUpPage.enterOtp(value);
      expect(await SignUpPage.readOtp()).not.toBe(value);
    }

    const otp = testData.generateTestOtp(4);
    await SignUpPage.enterOtp(otp);
    expect(await SignUpPage.readOtp()).toBe(otp);
  });

  it('SGN-006 - handles invalid or expired OTP', async function () {
    await openMobileVerification();
    await SignUpPage.enterOtp(testData.invalidOtp);
    await waitDisplayed($.text(uiText.signUp.invalidOtp), NETWORK_TIMEOUT);
    await waitDisplayed(SignUpPage.mobileVerificationStep);
  });
});
