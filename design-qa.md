# Course-specific location column — variant 23

“Где будете заниматься” is now a column inside the calculator, independently selectable for each active course. The global selector was removed. Each course's chosen format determines its own rate and is retained in the enquiry and prepared email. The onsite travel note appears when any selected course uses onsite training. Informational location cards link to the calculator without changing every course. All current ruble rates remain unchanged.

The seven-column desktop table retains the compact layout. Below 1200 px, location becomes a labelled field within each course card; on phones it spans that card's width. Date and price layout uses named cell classes instead of old column positions. Inactive rows and books span the correct number of columns.

Validation:

- `npm run check` passed: production build, nine pricing tests and four hosting tests.
- Mixed order: online two days/one person = 40,000 ₽; onsite five days/three people = 280,000 ₽; office ten days/six people = 480,000 ₽; two book sets = 16,000 ₽. Total = 816,000 ₽. The enquiry and prepared email keep each course's exact location, duration, participants and price. No email was sent.
- Changing only the onsite course to online changes the total to 756,000 ₽ and leaves other formats intact. Two-day onsite remains “По согласованию”, with a known subtotal of 536,000 ₽ for the other positions.
- Clear removes active course fields and disables the empty enquiry. A books-only order has no stale course location or travel note. An onsite first course opens the price dialog at onsite/five-day rates.
- All four courses and books selected at widths 2560, 1440, 1280, 1200, 1199, 1024, 701, 700, 600, 390 and 320 px: no horizontal overflow and no fields outside their cells. Controls are at least 40 px high, or 44 px on phones.
- Desktop and phone screenshots visually inspected. Viewport override reset; basic two-day online default restored. The calculator remains available at its anchor.

Evidence: `qa/2026-10-28-course-location/` contains interaction results, responsive measurements and screenshots. Earlier compact-calculator measurements describe the layout before the additional location column.

Result: **passed**.
