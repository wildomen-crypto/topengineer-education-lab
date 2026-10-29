# Balanced duration descriptions — variant 23

Replaced the long always-visible duration descriptions with similar-length overviews. All cards use the same header/title/plan/overview structure. The popular badge sits beside hours, and the 95% note is below the comparison. The ten-day 5+5 split stays visible. Shared desktop grid rows align the contents without clipping text or reducing body font size. Phone cards retain natural heights.

All nine original descriptive paragraphs remain unchanged in `durations.js` and are rendered in a native disclosure beneath the cards. The original pilot-project split and popularity sentence also remain. Opening the full-width details does not stretch the comparison cards.

Validation:

- Production build passed (62 modules), and `git diff --check` passed. No pricing, programme or enquiry logic changed.
- At 1440 px each comparison card reduced from 955 px to 507 px (47%). The complete section, including the new disclosure/notes, reduced from 1343 px to 1010 px. At 1024 px the cards reduced from 1063 px to 534 px.
- Widths 2560, 1440, 1200, 1199, 1024, 992, 991, 390 and 320 px: no page/card horizontal overflow. At every tested width of 992 px or more, card heights and title/plan/description start positions match within one pixel. At 991 px and below cards stack naturally.
- Enter opens/closes details on desktop; Space opens/closes them on a phone-sized viewport. All three detailed descriptions are visible when open. All 11 original paragraph strings (including the split and popularity note) are present in the section.
- Desktop and phone captures visually inspected. Body text stays 17 px on desktop and 16 px on phones. Temporary viewport overrides reset; details left closed and the duration section open for review.

Evidence: `qa/2026-10-29-compact-duration/` contains before/after dimensions, responsive checks, disclosure checks and screenshots.

Result: **passed**.
