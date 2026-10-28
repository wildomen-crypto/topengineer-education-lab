# Design QA — responsive training-process image, variant 23

Working page: http://127.0.0.1:4173/education-centr/tekla-23-site-style/#how-training-works

The user requests the «Как проходит обучение» image to adapt in both height and width like the original site. The source was verified in the supplied reference project's `outputs/consulting-card-selection-version/index.html` and `assets/table-calculator.css`, lines 6–10. It stretches the media container beside the text from 992px, fills it with `object-fit:cover`, and uses `object-position:100% 25%`. Below that breakpoint, the source stacks the columns and displays the natural image proportions.

The same behaviour is now scoped to variant 23. Its grid stretches both columns and the image fills the resulting text height on desktop. Below 992px the image sits above the steps, at full width and its original 3:2 aspect ratio. The existing artwork, caption, four steps and other page sections are retained. No asset generation or image editing was needed.

At 1440px, the old intrinsic image height was 433.08px beside 427.69px of text. The corrected image and text both measure 427.69px. At 1024px, both measure 506.86px; at 992px, both measure 559.64px. At 991px and below, the measured image ratio is 1.5 and the text follows below it.

Evidence: `qa/2026-10-28-how-image/`.

- `responsive.json`: before measurement and eight final widths — 2560, 1440, 1024, 992, 991, 768, 390 and 320. Every image is loaded, each desktop height matches its copy, each smaller image retains 3:2 proportions above the copy, and no horizontal page overflow occurs.
- `how-<width>-full.png`: final complete captures at 2560, 1440, 991 and 390px.
- `how-<width>.png`: focused sections cropped from those captures using the recorded post-capture section bounds. All four were opened and visually inspected. Desktop framing retains the monitors/instructor; phone/tablet views show the full image and readable steps.
- `app-console.json`: no captured local errors or warnings.

The initial automation wrapper failed while controlling the viewport; the documented browser runtime restored control. Temporary viewport overrides were reset. The user's four selected courses were preserved across the reload, and the updated block was left open.

`npm run build` passed with 51 modules. No implementation-mirroring unit tests were added for this small CSS change. Earlier catalogue and gallery QA remains archived in the dated reports.

No open P0/P1/P2 visual findings in this scope.

Final result: **passed**.
