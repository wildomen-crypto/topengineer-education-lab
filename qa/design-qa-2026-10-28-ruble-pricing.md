# QA — ruble pricing and source calculation, variant 23

Page: http://127.0.0.1:4173/education-centr/tekla-23-site-style/#training-calculator

Only variant 23 uses this updated calculator. Earlier variants retain their saved prices. The approved header/footer, four-course catalogue, 352 programme topics, image behaviour and duration descriptions are retained.

## Authority and calculation

The user's three screenshots replace the reference site's historical EUR rates. All 54 published rows are transferred exactly: 20 two-day online/office rows, 18 five-day online/office rows and 16 five-day onsite rows. Their rounded per-person figures are reproduced from the exact group totals. The online jump from nine people (300,000 ₽) to ten (400,000 ₽) and the lower onsite prices for groups 10–20 are deliberately retained.

The source site's algorithm is preserved: independent course durations of 2/5/10 days, eight hours/day, actual groups 1–20, minimum billing for three people on five-/ten-day online/office courses, additive totals without a package discount and inclusive calendar dates. Online ten-day rates double five-day rates. The user explicitly confirmed the same double-price rule for ten-day onsite training and a price of 8,000 ₽ per electronic three-volume English book set. Book quantities 1–20 can be included with training or requested independently.

Onsite two-day training and onsite groups 1–4 have no published rate. They remain by agreement; no five-person minimum or zero fee is invented. The calculator clearly separates known subtotal from an unconfirmed final total. Travel and lodging are separate.

## Automated and browser evidence

- `npm run test:pricing`: eight meaningful tests pass. They cover all 54 published rows, 720 combinations against the unmodified original calculation function supplied with the current ruble tables, the minimum charge, the price jump, derived ten-day fees, independent mixed courses, book-only requests, unknown rates, invalid input and inclusive date arithmetic against the original date function.
- `qa/2026-10-28-ruble-pricing/visible-price-tables.json`: all 54 actual rendered rows match the screenshot totals and rounded per-person figures.
- `interactions.json`: basic two-day course = 40,000 ₽; online five-day single participant = 175,000 ₽ with minimum fee explained; ten participants online five days = 400,000 ₽; onsite five/ten days for ten = 370,000/740,000 ₽. Three mixed courses plus two books = 631,000 ₽, 17 days, 136 hours. The quote and prepared email contain identical selections and totals. Three book sets alone = 24,000 ₽. Unknown onsite rates and invalid end dates behave correctly. Clearing selection disables the empty enquiry.
- `responsive.json`: all four active rows at 2560, 1440, 1200, 1199, 1024, 768, 390 and 320 px retain the same total, all duration/participant controls and no horizontal page overflow.
- `price-dialog-responsive-final.json`: the final price popup also fits at 390 and 320 px without horizontal overflow (table/scroll widths 305/305 and 235/235). Compact headings and “По запросу” keep unknown rates legible. Desktop calculator and final 320/390 popup screenshots were visually inspected; amounts and headings are not clipped.
- `source-online-2-days.png`, `source-online-5-days.png`, `source-onsite-5-days.png` preserve the user's price screenshots. Historical source JSON is retained only for provenance; it is not imported by the app.

Production build passed with 58 modules. No message was sent and no checkout or payment flow was added. Temporary viewport overrides were reset after checking. Earlier validation remains in the dated reports.

Result: **passed**.
