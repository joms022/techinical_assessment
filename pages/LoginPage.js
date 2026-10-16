const BasePage = require('./BasePage');
const $ = require('./CommonLocator');
const uiText = require('../test/data/ui-text.json');

class LoginPage extends BasePage {
  // Login fields are exposed as native EditText controls on Android. Replace
  // the iOS placeholders with inspected accessibility identifiers.
  get mobileEmailField() {
    return $({ android: 'android=new UiSelector().resourceId("login_input_email_or_phone")', ios: '~TODO_ios_login_identifier_field' });
  }

  get passwordField() {
    return $({ android: 'android=new UiSelector().resourceId("login_input_password")', ios: '~TODO_ios_login_password_field' });
  }

  get forgotPasswordLink() { return $.text(uiText.login.forgotPassword); }
  get loginButton() {
    return $({ android: 'android=new UiSelector().resourceId("btn_log_in")', ios: '~TODO_ios_login_submit_button' });
  }
  get signUpLink() { return $.text('Sign Up'); }

  async enterIdentifier(value) { await this.enter(this.mobileEmailField, value); }
  async enterPassword(value) { await this.enter(this.passwordField, value); }

  async login(identifier, password) {
    await this.enterIdentifier(identifier);
    await this.enterPassword(password);
    await this.submit();
  }

  async submit() { await this.tap(this.loginButton); }
  async openForgotPassword() { await this.tap(this.forgotPasswordLink); }
  async openSignUp() { await this.tap(this.signUpLink); }

}

module.exports = new LoginPage();
