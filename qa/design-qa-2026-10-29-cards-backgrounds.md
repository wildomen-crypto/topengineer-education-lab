# Course card feedback and alternating backgrounds — variant 23

The whole course-description card now toggles selection when its body or empty space is clicked. The handler excludes native controls, labels and links, and skips toggling while text is selected. It focuses the existing checkbox without scrolling. Checkbox Space operation remains native; the programme button keeps its separate navigation action. Pointer hover adds a 2px inset movement, border and inset shadow; pressing deepens it. Whole-card keyboard focus is visible. Reduced-motion styling removes movement while retaining static feedback.

All ten content blocks alternate white and the existing light-grey token in actual DOM order, including the final programme wrapper. The sequence is: intro white, courses grey, calculator white, learning process grey, books white, duration grey, locations white, preparation grey, certificates white, full programme grey. Grey sections use the darker existing muted text colour. Approved header/footer and the other 22 variants are unchanged.

Validation:

- Production build passed with 61 modules; `git diff --check` passed. No pricing algorithms or tariff files changed; no redundant unit tests were added for this visual update.
- Body headings and descriptions select/deselect courses and synchronize the calculator. Adding a second two-day course changes the total from 40,000 ₽ to 80,000 ₽. Deselecting the only course disables the empty enquiry.
- The programme button opens course 3 while leaving its selection intact. Header labels toggle once. Space toggles the native checkbox and produces the whole-card focus outline. Phone body clicks also update both the card and calculator.
- Actual hover after a body click was observed: pointer cursor, transform matrix with a 2px vertical shift, yellow border glow and inset shadow. Pressed and reduced-motion rules were inspected in source; no operating-system preference was changed.
- Widths 2560, 1800, 1799, 1440, 1200, 851, 850, 390 and 320 px: no page or card horizontal overflow; correct 4/2/1-column transitions; all ten section backgrounds retain the alternating sequence.
- Desktop cards, phone keyboard focus, and the books/duration boundary were visually inspected. The three book covers load correctly on entering the section. Viewport overrides reset; default basic-course selection retained.

Evidence: `qa/2026-10-29-cards-backgrounds/` contains before/after backgrounds, responsive measurements, interaction checks, full-page captures and cropped desktop/phone views. Some offscreen lazy images are absent from the first full-page capture; the separate books capture was taken after entering that section and shows all three covers.

Result: **passed**.
