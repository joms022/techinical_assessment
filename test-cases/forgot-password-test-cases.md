# Forgot Password and account recovery: prioritized test cases

This document lists the high-priority recovery cases selected for the 48-hour assessment. The recovery flow spans several screens, so the priority is to cover its main path, required validation, and ID capture entry points. Less common field permutations and adapter-dependent failure simulations are deferred.

The **No.** column numbers this prioritized list continuously. **Test ID** matches the executable spec; FGP, OID, and NID IDs are numbered independently by flow.

| No. | Test ID | Scenario | Expected result | Priority |
|---:|---|---|---|---|
| 1 | FGP-001 | Open Forgot Password from Login. | Recovery introduction opens. | High |
| 2 | FGP-002 | Open account information and inspect required fields. | Account information form is displayed with expected controls. | High |
| 3 | FGP-003 | Continue with account information empty. | Required-field feedback is shown and progression is blocked. | High |
| 4 | FGP-004 | Continue with an unregistered email and valid-format mobile number. | Recovery proceeds to the residential address form. | High |
| 5 | FGP-005 | Continue with a synthetic residential address. | Address is accepted and recovery proceeds to ID selection. | High |
| 6 | FGP-006 | Change the selected province after selecting a city. | City selection is refreshed for the new province. | High |
| 7 | OID-001 | Complete Other ID personal information with synthetic values. | The flow proceeds to the ID entry screen. | High |
| 8 | OID-002 | Exercise camera permission allow and deny outcomes. | Camera opens when allowed; denial is handled with an error message. | High |
| 9 | NID-001 | Enter National ID capture guidance. | Guidance and capture entry point are displayed. | High |
| 10 | NID-002 | Check sensitive National ID data handling. | Photos and case data are not exposed in evidence. | High |

Use synthetic identity and address data. Deferred: full ID-type permutations, every camera quality/retry outcome, and extended network/processing failure cases.
