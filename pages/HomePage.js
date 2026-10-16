const BasePage = require('./BasePage');
const $ = require('./CommonLocator');
const uiText = require('../test/data/ui-text.json');

class HomePage extends BasePage {
  // Replace TODO selectors with Appium Inspector values for the inspected app.
  get loginButton() { return $({ android: `android=new UiSelector().resourceId("btn_log_in")`, ios: `~TODO_ios_home_login_button` }); }
  // Appium exposes two nodes with this ID; use the first matching action node.
  get signUpButton() { return $({ android: `android=new UiSelector().resourceId("sign_up").instance(0)`, ios: `~TODO_ios_home_signup_button` }); }
  get notificationDenyButtons() {
    return [
      $({ android: `android=new UiSelector().resourceId("com.android.permissioncontroller:id/permission_deny_button")`, ios: `~TODO_ios_permission_deny_button` }),
      $({ android: `android=new UiSelector().resourceId("com.android.permissioncontroller:id/permission_deny_and_dont_ask_again_button")`, ios: `~TODO_ios_permission_deny_and_dont_ask_again_button` }),
      $({ android: `android=new UiSelector().resourceId("com.android.packageinstaller:id/permission_deny_button")`, ios: `~TODO_ios_legacy_permission_deny_button` }),
      $.text(uiText.home.denyPermission)
    ];
  }

  async prepareApp() {
    // Android may show the notification permission dialog before first-run onboarding.
    await this.dismissNotificationPermissionIfShown();
    const getStartedButton = $.text(uiText.home.getStarted);
    // App activation can return before the first screen has finished rendering.
    // Wait briefly for onboarding, but keep it optional for later launches and
    // tests that start directly on another screen.
    let getStartedIsDisplayed = false;
    try {
      await getStartedButton.waitForDisplayed({ timeout: 5000 });
      getStartedIsDisplayed = true;
    } catch (_error) {
      // The onboarding screen is only shown on a fresh install.
    }

    if (getStartedIsDisplayed) {
      await this.tap(getStartedButton);
    }
  }

  async dismissNotificationPermissionIfShown() {
    if (this.isIOS) return;

    for (const button of this.notificationDenyButtons) {
      if (await this.isDisplayed(button)) {
        await button.click();
        return;
      }
    }
  }

  async openLogin() {
    await this.tap(this.loginButton);
  }

  async openSignUp() {
    await this.tap(this.signUpButton);
  }
}

module.exports = new HomePage();
