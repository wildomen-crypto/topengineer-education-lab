# Flat group price for 1–5 people — variant 23

The user's latest clarification replaces the former minimum-three rule and the missing onsite small-group tariffs. For every supported course lasting five or ten days, one through five actual participants pay the existing five-person group price:

| Format | 5 days / 40 hours | 10 days / 80 hours |
|---|---:|---:|
| Online / Moscow office | 220,000 ₽ | 440,000 ₽ |
| Onsite | 280,000 ₽ | 560,000 ₽ |

From six participants, the published group totals are unchanged. All two-day online/office rates and the unknown two-day onsite rate are retained. The actual number of students remains in the calculator, enquiry and prepared email; per-person prices divide the group total by that actual number. Book prices and course-day/date calculations are unchanged.

The price dialog now lists the 1–5-person prices, marks those five rows and states the flat group total above the table. Calculator notes, individual fee notes, enquiry and email explain the same rule. The historical screenshot fixture stays unchanged; the old online 3/4-person screenshot fees are explicitly superseded by the new instruction.

Validation:

- `npm run check` passed: nine pricing tests, four hosting tests and the production build (59 modules). Independent tests cover all flat prices, actual group sizes, the sixth-person boundary, 52 unaffected screenshot rows, 720 combinations using the original billing algorithm with updated rates, mixed orders, books and inclusive dates.
- Browser calculator: online five-day price remains 220,000 ₽ for 1/2/3/4/5 people and becomes 240,000 ₽ for six; onsite five days for one = 280,000 ₽; onsite ten days for one or five = 560,000 ₽.
- All four visible 5/10-day price tables list the same expected group fee in their first five rows. The sixth row uses the next published rate.
- Enquiry and prepared email correctly state one actual participant, ten days, 80 hours, 560,000 ₽ onsite and the flat-group explanation. No email was sent.
- The final phone price table fits at both 390 and 320 px (305/305 and 235/235 client/scroll width). A global inherited no-wrap rule on the long online table caption was overridden so the last price column stays visible. The “1–5” badge stays together on a line.
- Desktop and 320px final screenshots were visually inspected. Temporary viewport overrides were reset, the original basic-course calculator selection restored, and the five-day price dialog left open for review.

Evidence: `qa/2026-10-28-flat-group/calculator-and-quote.json`, `price-tables.json`, `responsive.json`, `price-online-five-days.png`, `flat-group-proof.png` and phone screenshots. Earlier dated reports remain historical records of the previous pricing rule.

Result: **passed**.
