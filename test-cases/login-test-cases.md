# Login: prioritized test cases

This document lists the high-priority login cases selected for the 48-hour assessment. Broader input combinations and lower-risk UI checks are deferred.

| No. | Test ID | Scenario | Expected result | Priority |
|---:|---|---|---|---|
| 1 | LGN-001 | Open Login and inspect the identifier, password, and submit controls. | Login form and primary controls are visible. | High |
| 2 | LGN-002 | Submit with both fields empty. | Submission is blocked and required-field feedback is shown. | High |
| 3 | LGN-003 | Submit with the identifier missing. | Identifier validation is shown and the form remains usable. | High |
| 4 | LGN-004 | Submit with the password missing. | Password validation is shown and the form remains usable. | High |
| 5 | LGN-005 | Submit an unregistered identifier with a password. | Login is rejected with invalid-credentials feedback. | High |
| 6 | LGN-006 | Open Forgot Password from Login. | Account recovery opens successfully. | High |

Deferred: exhaustive malformed-input permutations, keyboard layout variations, and secondary navigation checks.
