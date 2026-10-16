// Selectors are supplied by each page object for both platforms. Replace
// TODO accessibility IDs after inspecting the app on that platform.
function locator(locators, options) {
  const { android = '', ios = '' } = locators;
  const platform = String(browser.capabilities.platformName).toLowerCase();
  const selector = platform === 'ios' ? ios : android;

  if (!selector) {
    throw new Error(`Missing ${platform} locator for element mapped by Android selector "${android}".`);
  }
  if (selector.startsWith('~TODO_')) {
    throw new Error(`Replace the ${platform} locator placeholder "${selector}" with an inspected accessibility ID.`);
  }

  return global.$(selector, options);
}

locator.text = function text(value) {
  const quotedText = JSON.stringify(String(value));

  return locator({
    android: `android=new UiSelector().text(${quotedText})`,
    ios: `-ios predicate string:label == ${quotedText} OR name == ${quotedText} OR value == ${quotedText}`
  });
};

// Some screens render the same label more than once (for example, a header
// and a button). Use only when the assertion is about visibility, not identity.
locator.textVisible = function textVisible(value) {
  const quotedText = JSON.stringify(String(value));

  return locator({
    android: `android=new UiSelector().text(${quotedText})`,
    ios: `-ios predicate string:label == ${quotedText} OR name == ${quotedText} OR value == ${quotedText}`
  }, { strict: false });
};

locator.textStartsWith = function textStartsWith(value) {
  const quotedText = JSON.stringify(String(value));

  return locator({
    android: `android=new UiSelector().textStartsWith(${quotedText})`,
    ios: `-ios predicate string:label BEGINSWITH ${quotedText} OR name BEGINSWITH ${quotedText} OR value BEGINSWITH ${quotedText}`
  });
};

locator.textContains = function textContains(value) {
  const quotedText = JSON.stringify(String(value));

  return locator({
    android: `android=new UiSelector().textContains(${quotedText})`,
    ios: `-ios predicate string:label CONTAINS ${quotedText} OR name CONTAINS ${quotedText} OR value CONTAINS ${quotedText}`
  });
};

module.exports = locator;
