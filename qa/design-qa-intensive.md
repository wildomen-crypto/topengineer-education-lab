# Design QA — Практический интенсив

Date: 2026-10-14.

Source visual truth: `C:/Taran/COMPONNT EDITOR/artifacts/tekla-design-mockups-2026-10-14/individual-12/09-intensive.body.png`.

Implementation: `http://127.0.0.1:4173/education-centr/tekla-11-intensive/`.

## Capture and normalization

- Reference: 1190 × 1322 image pixels. Scaled to the actual desktop content width, 1425 pixels; resulting body height is 1583 pixels.
- Desktop browser: 1440 × 1000 CSS pixels, 1× capture density. Approved header occupies the first 176 pixels; the content crop is 1425 × 1605. State: initial overview, no dialog, page at top.
- Browser-rendered full page: `qa/11-intensive-desktop-final.png`; first screen: `qa/11-intensive-preview.png`.
- Full-view comparison: `qa/11-intensive-comparison-final.jpg`, reference left and implementation right, equal scale.
- Focused hero comparison: `qa/11-intensive-hero-comparison.jpg`; used to assess text hierarchy, photograph placement, primary actions and image sharpness. The full-view comparison also makes the process captions, instructor section and price labels readable.
- Mobile: 390 × 844 CSS pixels. Overview: `qa/11-intensive-mobile-full.png`; program dialog: `qa/11-intensive-mobile-program-final.png`.
- Tablet: 768 × 1024 CSS pixels, `qa/11-intensive-tablet-final.png`.
- Wide desktop: native 2560 × 1223, `qa/11-intensive-wide-final.png`.
- Browser choice: the in-app browser timed out; verification used the available Chrome connection through CUA. Temporary viewport overrides were reset and the live page was kept open.

## Findings and fixes

No actionable P0/P1/P2 findings remain.

1. [P2, fixed] The first implementation had smaller actions/prices and captions aligned to the step number instead of the photograph. Evidence: `qa/11-intensive-comparison-v1.jpg`. Increased action width and type size, enlarged price figures and instructor heading, aligned captions below photographs. Rechecked in the final full-view comparison.
2. [P2, fixed] Hidden dropdown lists produced horizontal document overflow. Hidden desktop lists now participate in layout only when opened by hover or keyboard focus; the appended course list opens within the viewport. Header appearance, original links, branding and footer were preserved. Desktop/mobile/wide checks report no horizontal overflow.
3. [P2, fixed] The mobile program used a scrolling row of level choices and retained a negative margin from the shared component. In this page's dialog, the three choices are stacked and the negative margin is removed. Final observed dialog client/scroll widths are 355/355; level list widths are 325/325. Evidence: `qa/11-intensive-mobile-program-final.png`.
4. [P2, fixed] At tablet width the photograph interfered with white copy. The photograph is placed above the navy content area on narrow screens. Evidence: `qa/11-intensive-tablet.png` and `qa/11-intensive-tablet-final.png`.
5. [P2, fixed] On the native wide viewport, central image cropping cut off the instructor's face and the copy reached a bright part of the photograph. Adjusted the image focal point and widened the aligned content container at 1600 pixels and above. Evidence: `qa/11-intensive-wide-before.png` and `qa/11-intensive-wide-final.png`.

## Required fidelity surfaces

- **Fonts/typography:** editable Roboto headings and body copy match the reference's plain bold Cyrillic treatment. Course title retains the same three lines. Hierarchy, price prominence and mobile wrapping were checked. Raster lettering cannot be reproduced pixel for pixel; minor optical differences are P3.
- **Spacing/layout rhythm:** retained the photographic hero, three numbered stages, instructor section and yellow price strip in the same order. Hero height is 653 pixels at desktop width. The implemented body is about 22 pixels taller than the normalized reference, an acceptable variation from real text wrapping. Program and enquiry details open on demand to preserve the compact overview.
- **Colors/tokens:** navy, white and the approved warm yellow are retained; copy remains readable against the background. The exact generated image has small color variations; the working page uses the existing brand yellow `#ffc64b` consistently.
- **Image quality:** five standalone images were generated from the selected reference, preserving the instructor/classroom direction. No screenshot sprite crops, fake avatars or CSS illustrations are used. Original PNGs and optimized JPGs are under `public/assets/intensive/`; all five loaded successfully in the browser. Focal points preserve faces at responsive widths.
- **Copy/content:** title, 2 days/16 hours, three experience levels, minimum six years of teacher experience, process descriptions and 40 000 / 70 000 / 90 000 ₽ prices are preserved. The 5-person price is 18 000 ₽ per person. Online/Moscow and separately agreed onsite conditions are explicit. Full 65/43/37-topic programs remain available. No teacher names or testimonials were invented.
- **Icons:** existing Font Awesome and native template icons are used. Small shape/stroke differences from generated reference icons, including the arrow glyph, are P3; no handcrafted SVG or CSS art substitutes were added.

## Interactions verified

- Gallery contains 11 pages and opens the additional route. The existing ten route entries remain present.
- Mobile menu opens «Учебный центр → Tekla Structures — 11 вариантов → Tekla — 11. Практический интенсив» and loads the new page.
- Hero level links open the corresponding program. Switching levels, filtering real topics and the empty search state work.
- Program → enquiry retains the selected level; returning to program retains it too.
- Header «Заказать» opens this page's enquiry dialog. Primary and secondary actions open enquiry/program respectively.
- Conditions → «Обсудить внедрение» opens the enquiry inside the existing dialog; verified after the final build.
- Five participants online generate a draft with 90 000 ₽. Five participants onsite generate «по согласованию с менеджером». The prepared `mailto:` body was inspected; no message was sent.
- Close button and Escape close the dialog, restore scrolling and return focus to the opener. The native dialog traps focus.
- Mobile program and enquiry fit the viewport without horizontal scrolling. Touch targets, readable text and all three level choices were checked.
- No broken main-content images or horizontal page overflow at tested widths.
- Console was checked: an earlier clean capture showed no errors. Later, Chrome logged three asynchronous message-channel notices characteristic of an extension connection; no component exception or failed application request was observed. Core interactions remained functional.

## Follow-up polish

Only P3 differences remain: optical font rendering, exact photograph framing and native icon shapes. No additional pass is required for them. Actual staff photographs can replace the generated illustrative photos later.

## Implementation checklist

- [x] Additional page, gallery card and menu link.
- [x] Approved header/footer and existing pages preserved.
- [x] All five photographic assets placed.
- [x] Program, enquiry, search and keyboard closure verified.
- [x] Desktop/mobile/tablet/wide captures and comparisons inspected.
- [x] Production build completed.

Earlier verification of the ten original pages is retained at `qa/design-qa-ten-variants.md`.

final result: passed
