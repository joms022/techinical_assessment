const crypto = require('crypto');

function randomDigits(length) {
  let result = '';

  for (let index = 0; index < length; index += 1) {
    result += crypto.randomInt(0, 10).toString();
  }

  return result;
}

function randomToken(length = 8) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

function generateTestEmail(prefix = 'qa.user') {
  // example.com is reserved for examples and must not represent a real inbox.
  return `${prefix}.${Date.now()}.${randomToken(6)}@example.com`;
}

function generateTestMobile(prefix = '0900') {
  // Use only in a sandbox or when the app does not send a real SMS.
  // The prefix can be overridden if the test environment requires another format.
  return `${prefix}${randomDigits(11 - prefix.length)}`;
}

function generateTestPassword(prefix = 'QaTest') {
  return `${prefix}!${randomToken(8)}1`;
}

function generateTestOtp(length = 4) {
  return randomDigits(length);
}

function generateTestUser() {
  const token = randomToken(6);

  return {
    firstName: `QA${token}`,
    middleName: `Test${token}`,
    lastName: `User${token}`,
    email: generateTestEmail(),
    mobile: generateTestMobile(),
    password: generateTestPassword(),
    otp: generateTestOtp()
  };
}

module.exports = {
  // Existing fixed values used by the current negative tests.
  invalidEmail: 'invalid-email',
  invalidEmails: ['invalid-email', 'qa.user@', 'qa.user.example.com', 'qa user@example.com'],
  unregisteredEmail: 'qa.unregistered@example.com',
  invalidPassword: 'invalid-password',
  validFormatMobile: '09170000000',
  invalidMobile: '123',
  invalidMobiles: ['abc', '123', '091700000000000'],
  validFormatEmail: 'qa.user@example.com',
  alternateEmail: 'qa.replacement@example.com',
  alternateMobile: '09171112222',
  syntheticStreet: 'QA Test Street 123',
  validPostalCode: '1000',
  invalidOtp: '0000',
  validFirstName: 'QA',
  validLastName: 'Tester',

  // Reusable synthetic test-data generators.
  randomDigits,
  randomToken,
  generateTestEmail,
  generateTestMobile,
  generateTestPassword,
  generateTestOtp,
  generateTestUser
};
