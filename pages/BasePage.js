class BasePage {
  get isIOS() {
    return String(browser.capabilities.platformName).toLowerCase() === 'ios';
  }

  async restartApp() {
    const appId = this.isIOS ? process.env.IOS_BUNDLE_ID : process.env.ANDROID_APP_PACKAGE;
    if (!appId) return;

    await browser.terminateApp(appId).catch(() => false);
    await browser.activateApp(appId);
  }

  async tap(element) {
    await element.waitForDisplayed();
    await element.click();
  }

  async enter(element, value) {
    await element.waitForDisplayed();
    await element.waitForEnabled();
    await element.click();
    await element.clearValue();

    if (!this.isIOS && await this.readValue(element)) {
      // Some Compose-backed Android fields accept clearValue without clearing
      // the text. Select the full value and delete it before entering a
      // replacement so setValue cannot append to the previous value.
      await browser.keys(['Control', 'a']);
      await browser.keys('Backspace');
    }

    await element.setValue(value);
  }

  async isDisplayed(element) {
    return element.isDisplayed().catch(() => false);
  }

  async readValue(element) {
    // UiAutomator2 can reject the legacy element/value endpoint on newer
    // Android drivers. Reading the native text attribute works for EditText.
    if (!this.isIOS) return element.getAttribute('text');
    return element.getValue();
  }

}

module.exports = BasePage;
