# Sign Up: prioritized test cases

This document lists the high-priority sign-up cases selected for the 48-hour assessment. Less critical field permutations and extended OTP edge cases are deferred.

| No. | Test ID | Scenario | Expected result | Priority |
|---:|---|---|---|---|
| 1 | SGN-001 | Open Sign Up and inspect the mobile, email, consent, and legal controls. | Required controls and links are visible. | High |
| 2 | SGN-002 | Enter valid-format details without accepting consent and submit. | Sign-up is blocked until consent is accepted. | High |
| 3 | SGN-003 | Submit synthetic sign-up details with consent accepted. | Sign-up proceeds to mobile verification. | High |
| 4 | SGN-004 | Inspect the mobile verification screen. | OTP entry and verification actions are available. | High |
| 5 | SGN-005 | Enter non-numeric or excess OTP characters. | OTP input accepts only four numeric digits. | High |
| 6 | SGN-006 | Submit an invalid or expired OTP. | Verification fails and the user remains on the OTP step. | High |

Use synthetic data only. Deferred: broad email/mobile format matrices, resend timing variations, and secondary edit-flow cases.
