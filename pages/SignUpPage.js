const BasePage = require('./BasePage');
const $ = require('./CommonLocator');
const uiText = require('../test/data/ui-text.json');

class SignUpPage extends BasePage {
  // Android resource IDs read from the live Sign Up screen.
  get mobileNumberField() { return $({ android: `android=new UiSelector().resourceId("sign_up_mobile_text")`, ios: `~TODO_ios_signup_mobile_number_field` }); }
  get emailField() { return $({ android: `android=new UiSelector().resourceId("signup_email_text")`, ios: `~TODO_ios_signup_email_field` }); }
  get consentCheckbox() { return $({ android: `android=new UiSelector().resourceId("checkBox").instance(1)`, ios: `~TODO_ios_signup_consent_checkbox` }); }
  // Appium exposes duplicate nodes for this ID; select the first signup action.
  get signUpButton() { return $({ android: `android=new UiSelector().resourceId("sign_up").instance(0)`, ios: `~TODO_ios_signup_button` }); }
  // These links are exposed by their visible labels in the native Android UI.
  get privacyPolicyLink() { return $.text(uiText.signUp.privacyPolicy); }
  get termsLink() { return $.text(uiText.signUp.terms); }
  get mobileVerificationStep() { return $({ android: `android=new UiSelector().resourceId("ComposeHost_MobileVerification_title")`, ios: `~TODO_ios_mobile_verification_screen` }); }
  get otpDigits() { return [0, 1, 2, 3].map(index => $({ android: `android=new UiSelector().resourceId("four_digit_pin_digit${index}")`, ios: `~TODO_ios_otp_digit_${index}` })); }
  get otpInput() { return $({ android: `android=new UiSelector().className("android.widget.EditText")`, ios: `~TODO_ios_otp_input` }); }

  async enterDetails(mobileNumber, email) {
    await this.enter(this.mobileNumberField, mobileNumber);
    await this.enter(this.emailField, email);
  }

  async submit() {
    await this.tap(this.signUpButton);
  }

  async enableConsent() {
    // Appium reports checked=false for the Compose checkbox, even after it is ticked.
    await this.tap(this.consentCheckbox);
  }

  async disableConsent() {
    if (await this.consentCheckbox.isSelected()) {
      await this.tap(this.consentCheckbox);
    }
  }

  async enterOtp(value) { await this.enter(this.otpInput, String(value)); }
  async readOtp() { return this.readValue(this.otpInput); }
}

module.exports = new SignUpPage();
