# Design QA — photo mock 11 / working variant 12

Selected target: `C:/Taran/COMPONNT EDITOR/artifacts/tekla-design-mockups-2026-10-14/individual-12/11-team-class.body.png`, **11 — Обучение команды в классе**.

Working route: `http://127.0.0.1:4173/education-centr/tekla-12-team-class/`. The original ten pages and working variant 11 (photo mock 09) are preserved. Approved shared header/menu/footer retain their styling.

## Evidence and normalization

- Source: 1190 × 1322 px, desktop overview with no shared chrome.
- Browser: Chrome via CUA; retained from the previous turn after the in-app browser was unavailable. CSS desktop viewport 1440 × 1000, density 1. Screenshot content width 1425 px excludes the 15 px scrollbar.
- Implementation: `qa/12-team-class-desktop-final.png`, 1425 × 2630 px, includes approved header/footer.
- Content crop: `qa/12-team-class-body-final.png`, 1425 × 1622 px, starts at y176 (below shared navigation).
- Full comparison: `qa/12-team-class-comparison-final.jpg`, source scaled uniformly to 1425 × 1583 px on the left; implementation content crop on the right. No stretch. The additional local variant navigation accounts for the extra bottom area.
- Focused first-screen comparison: `qa/12-team-class-hero-comparison.jpg`, 2850 × 414 px. Confirms title wrapping, actions, information row and photo framing.
- Mobile: 390 × 844 CSS viewport; `qa/12-team-class-mobile.png` and `qa/12-team-class-mobile-program.png`.
- Tablet: 768 × 1024 CSS viewport; `qa/12-team-class-tablet-final.png`.
- Native wide viewport: 2560 × 1223; `qa/12-team-class-wide.png`. Temporary viewport overrides were reset.
- User preview: `qa/12-team-class-preview.png`.

Source, full comparison, focused comparison and all responsive captures were opened and visually inspected. State: overview; separate capture for the open program dialog.

## Findings and comparison history

No actionable P0/P1/P2 findings remain.

1. **[P2, fixed] Title and section typography drift.** Initial `qa/12-team-class-desktop-v1.png` and `qa/12-team-class-comparison-v1.jpg` showed three title lines and an approximately 483 px hero instead of the reference's two lines and 414 px hero. Shared heading styles overrode some page declarations. Added page-scoped specificity and adjusted the display title to 58 px maximum. Final capture has two title lines, 116 px title height and 414 px hero height. The focused final comparison verifies the result.
2. **[P2, fixed] Unused navy area in the tablet photo.** `qa/12-team-class-tablet.png` showed the desktop text reserve occupying much of the photo above the tablet's separate text block. Adjusted the image crop at the tablet breakpoint while retaining the working phone crop. `qa/12-team-class-tablet-final.png` shows the instructor and class clearly without the large empty area.

## Required fidelity surfaces

- **Fonts/typography:** existing local Roboto with heavier display headings; title/subtitle, section titles, step labels and budget hierarchy match the reference. Native font rendering and exact glyph widths differ slightly (P3). Text is readable, without clipping; the phone heading wraps into three lines as an intentional responsive adaptation.
- **Spacing/layout:** rounded photographic hero, four organization steps, approximately 64/36 practice/budget split, three format columns and navy concluding action band match the target. Desktop hero 414 px, budget approximately 507 px. Phone uses one column; tablet uses two organization columns and places the photograph above hero text. Content container stays bounded on wide screens.
- **Colors/tokens:** navy #162633 / ink #142334, white page, pale step badges and yellow #ffca4a preserve the target's contrast and balance. Budget uses a flat yellow surface; the reference's subtle tonal variation is residual P3.
- **Images:** two separately generated, inspected photographs; matching female teacher, adult students, PCs and steel BIM models, cool daylight. Hero PNG 2171 × 724, practice PNG 1661 × 947; quality-92 JPG copies are used on the page. No screenshot-as-page, fabricated staff names or endorsements. Classroom poster wording and exact poses differ slightly (P3).
- **Copy/content:** overview follows the selected mock; the source course program remains available at all three levels. Budget uses saved source prices: 5 participants 90 000 ₽ total / 18 000 ₽ per person, 1 participant 40 000 ₽, 3 participants 70 000 ₽. Onsite enquiries explicitly require manager agreement. Generated people are labelled as an illustration.
- **Icons:** reused native Font Awesome / site arrow font. The group glyph is filled rather than outlined in the reference (P3); consistent sizing, no custom SVG or CSS artwork substitutes.

## Interactions and accessibility

- Gallery contains 12 cards; new card opens `/education-centr/tekla-12-team-class/`.
- Mobile menu expands «Учебный центр → Tekla Structures — 12 вариантов → Tekla — 12. Обучение команды в классе» and loads the page.
- Previous page is the retained intensive; its new «Следующий вариант» link returns to the classroom page.
- Header «Заказать» and main actions open the correct enquiry/program dialog.
- Professional level selection and empty topic search tested; program → enquiry retains level and defaults to five participants.
- Five participants online prepare 90 000 ₽. Selecting the onsite format card opens an enquiry with «На базе заказчика» selected and «по согласованию с менеджером» in the draft. The mailto content was inspected; nothing was sent.
- Close button and Escape close the modal, release body scroll and restore focus to the opener. Native dialog manages focus containment. Inputs use labels; photographs have alt text; controls have visible focus states.
- Mobile dialog width/scrollWidth 355/355 px, program choices 325 px each; no horizontal scrolling. All tested overview widths have no horizontal page overflow; both main photographs load.
- Console checked after interactions: no new application error for the classroom route. Three pre-existing asynchronous message-channel notices remain from the earlier intensive route; no React exception or failed app request was observed.
- Latest `npm run build` passes. Hosting/build infrastructure remains intact. No publication was requested.

## Follow-up polish

Only P3 differences remain: optical font rendering, precise photo poses/poster text, flat yellow shading and the native group icon. No further pass is required for these. Real staff photographs may replace the illustrative images later.

## Implementation checklist

- [x] Additional page, gallery card, shared menu entry and adjacent-page links.
- [x] Existing pages and approved chrome preserved.
- [x] Both photographic assets placed and originals retained.
- [x] Program, enquiry, chosen format, empty search and keyboard close verified.
- [x] Full and focused normalized comparisons inspected.
- [x] Desktop, phone, tablet and native wide screen verified.
- [x] Build completed; preview stays running.

Previous QA retained in `qa/design-qa-intensive.md` and `qa/design-qa-ten-variants.md`.

final result: passed
