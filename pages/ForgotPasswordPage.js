const BasePage = require('./BasePage');
const $ = require('./CommonLocator');
const uiText = require('../test/data/ui-text.json');

// Android resource IDs captured from the recovery flow. Compose fields that
// expose no resource ID are selected by their visible text or field order.
class ForgotPasswordPage extends BasePage {
  get identifierField() { return $({ android: `android=new UiSelector().resourceId("text_field_contact_to_reset")`, ios: `~TODO_ios_recovery_identifier_field` }); }
  get resetButton() { return $({ android: `android=new UiSelector().resourceId("btn_reset")`, ios: `~TODO_ios_reset_button` }); }
  get accountInfoContinueButton() { return $({ android: `android=new UiSelector().resourceId("ComposeHost_AccountInfoScreen_btn_continue")`, ios: `~TODO_ios_recovery_continue_button` }); }
  get accountRecoveryContinueButton() { return $({ android: `android=new UiSelector().resourceId("ComposeHost_WelcomeScreen_userEmail_btn_continue")`, ios: `~TODO_ios_recovery_welcome_continue_button` }); }
  get continueButton() { return $({ android: `android=new UiSelector().resourceIdMatches(".*(btn_continue|_btn_continue)")`, ios: `~TODO_ios_recovery_continue_button` }); }
  get cancelButton() { return $({ android: `android=new UiSelector().resourceIdMatches(".*(btn_cancel|_btn_cancel)")`, ios: `~TODO_ios_recovery_cancel_button` }); }
  get postalCodeField() { return $({ android: `android=new UiSelector().className("android.widget.EditText").instance(1)`, ios: `~TODO_ios_postal_code_field` }); }
  get idTypeSelector() { return $({ android: `android=new UiSelector().resourceId("id_type_selector")`, ios: `~TODO_ios_id_type_selector` }); }
  get takePhotoButton() { return $({ android: `android=new UiSelector().resourceId("btn_take_photo")`, ios: `~TODO_ios_take_photo_button` }); }
  get idInformationScreen() { return $({ android: `android=new UiSelector().resourceId("ComposeHost_SelectGovIdType_title")`, ios: `~TODO_ios_id_information_screen` }); }
  get otherIdOption() { return $({ android: `android=new UiSelector().resourceId("other_id_button")`, ios: `~TODO_ios_other_id_option` }); }
  get idNumberField() { return $({ android: `android=new UiSelector().resourceId("id_number_input")`, ios: `~TODO_ios_id_number_field` }); }
  get mobileField() { return $({ android: `android=new UiSelector().className("android.widget.EditText").instance(1)`, ios: `~TODO_ios_mobile_field` }); }
  get emailField() { return $({ android: `android=new UiSelector().className("android.widget.EditText").instance(0)`, ios: `~TODO_ios_email_field` }); }
  get firstNameField() { return $({ android: `android=new UiSelector().className("android.widget.EditText").instance(0)`, ios: `~TODO_ios_first_name_field` }); }
  get middleNameField() { return $({ android: `android=new UiSelector().className("android.widget.EditText").instance(1)`, ios: `~TODO_ios_middle_name_field` }); }
  get lastNameField() { return $({ android: `android=new UiSelector().className("android.widget.EditText").instance(2)`, ios: `~TODO_ios_last_name_field` }); }
  get houseUnitField() { return $({ android: `android=new UiSelector().className("android.widget.EditText").instance(0)`, ios: `~TODO_ios_house_unit_field` }); }
  // Live camera view and controls observed with a synthetic ID value.
  get cameraPreview() { return $({ android: `android=new UiSelector().className("android.view.SurfaceView")`, ios: `~TODO_ios_camera_preview` }); }
  // National ID selectors confirmed from the live Android hierarchy.
  get nationalIdGuidanceScreen() { return $({ android: `android=new UiSelector().resourceId("btn_take_front_photo")`, ios: `~TODO_ios_national_id_guidance_screen` }); }
  get nationalIdFrontPhotoButton() { return $({ android: `android=new UiSelector().resourceId("btn_take_front_photo")`, ios: `~TODO_ios_national_id_front_photo_button` }); }
  get nationalIdShutterButton() { return $({ android: `android=new UiSelector().resourceId("btn_capture")`, ios: `~TODO_ios_national_id_shutter_button` }); }
  get nationalIdTakeBackPhotoButton() { return $({ android: `android=new UiSelector().resourceIdMatches(".*(btn_capture_back|btn_take_back_photo)")`, ios: `~TODO_ios_national_id_take_back_photo_button` }); }
  get nationalIdCaseId() { return $.textStartsWith(uiText.accountRecovery.caseIdPrefix); }

  async submitIdentifier(identifier) {
    await this.enter(this.identifierField, identifier);
    await this.tap(this.resetButton);
  }

  async submitAccountInformation(email, mobile) {
    await this.enter(this.emailField, email);
    await this.enter(this.mobileField, mobile);
    await this.tap(this.accountInfoContinueButton);
  }

  async submitEmptyForm() { await this.tap(this.accountInfoContinueButton); }
  async continue() { await this.tap(this.continueButton); }
  async continueFromAccountRecovery() { await this.tap(this.accountRecoveryContinueButton); }

  async enterResidentialAddress(street, postalCode) {
    await this.enter(this.houseUnitField, street);
    await this.enter(this.postalCodeField, postalCode);
  }

  async chooseProvince(selector, option) { await this.tap(selector); await this.tap(option); }
  async chooseCity(selector, option) { await this.tap(selector); await this.tap(option); }

  async enterOtherIdDetails({ firstName, middleName = '', lastName, dateOfBirthField, dateOfBirthOption, genderSelector, genderOption }) {
    await this.enter(this.firstNameField, firstName);
    await this.enter(this.middleNameField, middleName);
    await this.enter(this.lastNameField, lastName);
    await this.chooseDateOfBirth(dateOfBirthField, dateOfBirthOption);
    await this.chooseGender(genderSelector, genderOption);
  }

  async chooseDateOfBirth(field, option) { await this.tap(field); await this.tap(option); }
  async chooseGender(selector, option) { await this.tap(selector); await this.tap(option); }
  async selectIdType(selector, option) { await this.tap(selector); await this.tap(option); }
}

module.exports = new ForgotPasswordPage();
