# BillEase Mobile Automation Assessment

Mobile test automation project for the BillEase technical assessment.

The project uses Appium with JavaScript and the Page Object Model (POM). WebdriverIO is used as the JavaScript WebDriver client and test runner for communicating with Appium.

## Assessment scope

The assessment covers these mobile-app areas:

- Login
- Forgot Password and account recovery
- Sign Up and mobile verification

### Test case prioritization

The assessment had a 48-hour time limit, so I could not cover every test case (TC). I prioritized the high-priority TCs for the main user journeys, critical validation, and key recovery paths. The remaining TCs were not covered within the available time and are outside the current automation scope. The prioritized cases are listed in [`test-cases/`](./test-cases).

This README documents setup, platform selection, locator handling, startup behavior, and current automation coverage.

## Requirements

### Common requirements

- Node.js and npm
- Java JDK
- Appium 2
- Appium Inspector
- Git
- BillEase application installed on the target device or emulator
- Synthetic or approved sandbox test data

Verify the Node.js and Java installations:

```powershell
node --version
npm --version
java -version
```

### Android requirements

- Android Studio
- Android SDK and platform tools
- An Android Virtual Device or physical Android device
- `adb` available on `PATH`
- Appium UiAutomator2 driver

Verify the Android device connection:

```powershell
adb devices
```

The device should appear with the status `device`.

Verify the Appium driver:

```powershell
appium driver list --installed
```

Install UiAutomator2 if it is not listed:

```powershell
appium driver install uiautomator2
```

### iOS requirements

iOS execution requires a macOS machine because Appium's XCUITest driver requires Xcode. The iOS tests can be authored on Windows, but they must be executed on a Mac, a connected Mac build machine, or an Appium-compatible cloud device provider.

The Mac execution environment requires:

- macOS
- Xcode and Xcode Command Line Tools
- An iOS Simulator or physical iPhone
- Appium XCUITest driver

Install the driver on macOS with:

```bash
appium driver install xcuitest
```

## Install the project dependencies

From the project root:

```powershell
npm install
```

The project dependencies include:

- `webdriverio` for the JavaScript Appium client
- `@wdio/cli` and `@wdio/local-runner` for executing tests
- `@wdio/mocha-framework` for the Mocha test framework
- `@wdio/appium-service` for starting or connecting to Appium
- `@wdio/spec-reporter` for console test results
- `dotenv` for local configuration values

## Project structure

The tree below is a high-level overview. Shared feature specs are under `test/specs/`, shared test data is under `test/data/`, and platform-aware page objects (including the locator resolver) are under `pages/`.

```text
technical_assessment/
├── config/
│   ├── wdio.android.conf.js
│   └── wdio.ios.conf.js
├── pages/
│   ├── BasePage.js
│   ├── HomePage.js
│   ├── LoginPage.js
│   ├── ForgotPasswordPage.js
│   ├── SignUpPage.js
│   └── CommonLocator.js
├── test/
│   ├── data/
│   └── specs/
├── test-cases/
│   ├── login-test-cases.md
│   ├── forgot-password-test-cases.md
│   └── signup-test-cases.md
├── .env                  # local configuration (ignored by Git)
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

Responsibilities:

- `config/`: platform-specific Appium capabilities and test configuration
- `pages/`: page objects, element locators, and page actions
- `test/`: executable test scenarios and synthetic test data; keep locator details out of test files
- `test-cases/`: selected high-priority cases for the 48-hour assessment scope

## Appium Inspector and locators

Start the Appium server before creating an Inspector session:

```powershell
appium
```

Use Appium Inspector to identify stable locators for fields, buttons, links, validation messages, and navigation controls.

Use locators in this order where possible:

1. Accessibility ID
2. Android resource ID or iOS accessibility identifier
3. Stable text or platform attribute
4. XPath only when no stable locator is available

Avoid coordinate-based actions and fragile XPath expressions.

### Start an Appium Inspector session

Appium Inspector does not read `.env` automatically. Copy the desired capabilities into its JSON editor. The current Android emulator uses:

```json
{
  "platformName": "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "emulator-5554",
  "appium:udid": "emulator-5554",
  "appium:platformVersion": "16",
  "appium:appPackage": "ph.billeasev2.mobile",
  "appium:appActivity": ".CloneAppAlias",
  "appium:noReset": true,
  "appium:autoGrantPermissions": true
}
```

Set Inspector’s server host to `127.0.0.1`, port to `4723`, and path to `/`. Start Appium with `appium` before starting the Inspector session.

The emulator reports Android release `16` and SDK `36`; WebdriverIO’s `ANDROID_PLATFORM_VERSION` uses the release. Check device details with:

```powershell
adb devices -l
adb shell getprop ro.build.version.release
adb shell getprop ro.build.version.sdk
```

Resolve the launcher activity with:

```powershell
adb shell cmd package resolve-activity --brief -a android.intent.action.MAIN -c android.intent.category.LAUNCHER -p ph.billeasev2.mobile
```

The package name is `ph.billeasev2.mobile` without a `package:` prefix. The current launcher component is `ph.billeasev2.mobile/.CloneAppAlias`.

## Platform capabilities

Android capabilities should include:

```javascript
{
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': process.env.ANDROID_DEVICE_NAME,
  'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION,
  'appium:appPackage': process.env.ANDROID_APP_PACKAGE,
  'appium:appActivity': process.env.ANDROID_APP_ACTIVITY,
  'appium:autoGrantPermissions': true
}
```

iOS capabilities should include:

```javascript
{
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': process.env.IOS_DEVICE_NAME,
  'appium:platformVersion': process.env.IOS_PLATFORM_VERSION,
  'appium:bundleId': process.env.IOS_BUNDLE_ID
}
```

Keep machine-specific values in `.env`. Do not commit `.env`, passwords, real credentials, or personal information.

Example `.env` values:

```text
ANDROID_DEVICE_NAME=emulator-5554
ANDROID_PLATFORM_VERSION=16
ANDROID_APP_PACKAGE=ph.billeasev2.mobile
ANDROID_APP_ACTIVITY=.CloneAppAlias

IOS_DEVICE_NAME=iPhone 16
IOS_PLATFORM_VERSION=18.0
IOS_BUNDLE_ID=com.example.app
```

The Android values above match the current local emulator setup. Copy `.env.example` to `.env` and adjust device, app, and platform values for your machine. Keep `.env` local; it is ignored by Git. Replace the iOS placeholders with values from the target simulator or device before running iOS tests.

## Page Object Model

Page objects should contain locators and user actions. Test files should contain the business scenario and assertions.

Example:

```javascript
const $ = require('./CommonLocator');

class LoginPage {
  get emailField() {
    return $.by('login', 'emailField');
  }

  get passwordField() {
    return $.by('login', 'passwordField');
  }

  get loginButton() {
    return $.by('login', 'loginButton');
  }

  async login(email, password) {
    await this.emailField.setValue(email);
    await this.passwordField.setValue(password);
    await this.loginButton.click();
  }
}

module.exports = new LoginPage();
```

Static UI text used in selectors and assertions lives in `test/data/ui-text.json`, grouped by feature. Update a value there when the app's visible copy changes. Keep Android and iOS element selectors in the page objects, where `CommonLocator` chooses the selector for the active platform.

## Execute Android tests on Windows

1. Start the Android emulator.
2. Confirm the emulator is connected:

   ```powershell
   adb devices
   ```

3. Start Appium in a separate terminal:

   ```powershell
   appium
   ```

4. Run the Android feature specs:

   ```powershell
   npm run test:android
   ```

   After the run, open `test-results/android/report.html` for the generated HTML report. The JSON reporter stores failure screenshots under `test-results/android/screenshots/`; the `afterTest` hook saves additional failure screenshots under `screenshots/`.

`npm test` also selects Android.

## Execute iOS tests on macOS

1. Start the iOS Simulator or connect the test iPhone.
2. Install project dependencies:

   ```bash
   npm install
   ```

3. Install the XCUITest driver if required:

   ```bash
   appium driver install xcuitest
   ```

4. Start Appium:

   ```bash
   appium
   ```

5. Run the shared iOS feature specs:

   ```bash
   npm run test:ios
   ```

   After the run, open `test-results/ios/report.html` for the generated HTML report. The JSON reporter stores failure screenshots under `test-results/ios/screenshots/`; the `afterTest` hook saves additional failure screenshots under `screenshots/`.

Both configs point to the same feature specs. The page objects select locators from the active platform capability. The iOS selectors are currently `TODO_` placeholders, so iOS execution is not ready until inspected iOS selectors are supplied. Running iOS requires macOS/Xcode (or a supported cloud device).

## App startup behavior

Before each feature test, setup restarts the app using the Android package or iOS bundle ID. On Android, it dismisses a notification permission prompt if one appears, then taps **Get started** only when the first-run onboarding screen is present. The onboarding screen appears only after a fresh install, so subsequent app launches skip that step. The Android `appium:autoGrantPermissions` capability is also enabled.

## Test-data and safety rules

Use only synthetic data or approved sandbox data.

- Do not create a real account.
- Do not use real phone numbers, email addresses, credentials, OTPs, or government IDs.
- Do not store passwords or personal information in the repository.
- Redact sensitive values from logs, screenshots, and recordings.
- Do not submit real identity documents.

Camera, OTP, network, timer, and identity-verification behavior may need to be mocked for safe automation.

## Test execution and deliverables

Record the following for each test case and platform:

- Test case ID
- Execution date and platform
- Steps and expected result
- Actual result
- Pass or fail status
- Defect ID, if applicable
- Evidence such as screenshots or recording

The final submission should contain:

- Appium JavaScript automation source code
- Page Object Model implementation
- Test cases and execution results for Android and iOS
- Bug reports with affected platform
- README setup and execution instructions
- Screen recordings of automated tests on each available platform

## Known limitations

### iOS execution from Windows

iOS automation cannot be executed locally on Windows. XCUITest requires macOS and Xcode. The project can be developed and configured on Windows, but iOS tests must be run on macOS or an approved cloud device service.

### Account creation and successful authentication

The assessment rules prohibit real accounts and real credentials. Therefore, complete successful login, successful sign-up, real OTP verification, and completed account recovery cannot be safely validated unless approved sandbox accounts or mocked responses are provided.

These limitations should be recorded in the test results and README rather than bypassed with real user data.

### Identity verification and camera flows

Government-ID submission and real identity verification must not be performed with real documents. Coverage should focus on navigation, validation, error handling, mocked camera behavior, and mocked processing responses.

## Current repository status

The current specs define 22 test scenarios across the three assessment areas:

- Login: LGN-001–006.
- Sign Up: SGN-001–006.
- Account recovery: FGP-001–006, OID-001–002, and NID-001–002.
- Shared synthetic test data is in `test/data/test-data.js`; static UI text is in `test/data/ui-text.json`.
- `test/data/app-mocks.js` wraps the camera and sensitive-evidence hooks used by the recovery tests. The test environment must provide them through `global.__APP_TEST_MOCKS__`.
- Android and iOS configs use the same feature specs. `pages/CommonLocator.js` selects platform locators and throws for missing or placeholder selectors. Many iOS selectors remain placeholders.

### Assessment execution status

Android execution artifacts are present under `test-results/android/`, including timestamped JSON reports and screenshots. They are historical runs from an earlier spec revision: the latest stored JSON report is dated 16 Oct 2026 and contains 25 results (8 passed, 17 failed), with test names that do not match all current specs. Treat these as historical evidence, not results for the current 22 scenarios. No iOS execution artifacts are present. Record current case and platform results only after running the current specs; use `Not Run` when a required device, app build, locator, or mock adapter is unavailable. No confirmed defect log or screen recordings are present in the repository.

The PDF assessment prohibits creating a real account, completing sign-up, or using real personal information or credentials. Successful account creation and real identity verification therefore remain out of scope unless a safe sandbox is provided. iOS execution requires macOS/Xcode; this repository was prepared on Windows and has not been run on iOS.

### Locator placeholders and automation readiness

Platform-specific `TODO_` accessibility IDs in `pages/` are placeholders until replaced with inspected selectors. Using a placeholder raises an error naming it. Several test cases also depend on network, timer, camera, OTP, and identity-verification mocks that are not provided in this repository. A case marked `Automated` in a test-case table describes suitability, not proof that it has passed. Each test restarts the app; setup taps **Get started** only when that text is visible, and Android setup attempts to dismiss a notification permission prompt if present. Historical Android runs exist, but they do not verify the current spec revision; iOS has not been run.

The local `.env` contains the current Android emulator and app values; `.env.example` is the template to copy for a new setup. Update its Android values for a different device or app build, and replace the iOS placeholders before an iOS run.
