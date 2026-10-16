// The test environment must provide camera and collectSensitiveEvidence.
async function call(name, ...args) {
  const fn = global.__APP_TEST_MOCKS__?.[name];
  if (typeof fn !== 'function') {
    throw new Error(`Configure global.__APP_TEST_MOCKS__.${name} to run this test.`);
  }
  return fn(...args);
}

module.exports = {
  camera: (...args) => call('camera', ...args),
  collectSensitiveEvidence: (...args) => call('collectSensitiveEvidence', ...args)
};
