# Design QA — training-duration descriptions, variant 23

Working page: http://127.0.0.1:4173/education-centr/tekla-23-site-style/#training-duration

The user explicitly requests the original page's course-duration descriptions. Source content was read from the supplied reference project's `outputs/consulting-card-selection-version/index.html`, section `#training-formats`. The complete meaning of its three descriptions is retained in Russian: 2 days / 16 hours with minimum practice; 5 days / 40 hours with more guided practice, repetition and feedback; 10 days / 80 hours combining five days of training and five days on the customer's real pilot project. The source's popular marker and approximately 95% pilot-project statement are transferred from that source, not invented.

The new section sits after the books and before the existing training-location section. The approved site typography, colours, small internal gutters and card styling are reused. Three columns switch to one below 992px. The 10-day card has a yellow border and an explicit 5 + 5 split. Days, hours and explanatory paragraphs remain ordinary accessible text.

The overview duration now reads «2, 5 или 10 дней». The hero's 40,000 ₽ starting offer and calculator are explicitly labelled as the two-day format. Existing Russian price data and calculation logic are unchanged; the new section says that five- and ten-day fees are agreed separately. This is an informational duration block, not a new duration selector or invented tariff table.

Validation evidence in `qa/2026-10-28-duration/`:

- `responsive.json`: eight widths, 2560, 1440, 1024, 992, 991, 768, 390 and 320. All have three duration cards, the four existing courses and no horizontal overflow. The grid changes from three columns at 992px to one at 991px.
- `duration-<width>-page.png`: page captures through the new section at 2560, 1440 and 390px. `duration-<width>.png` crops the section from those captures using its recorded post-capture bounds; `duration-390-top.png` shows the phone heading and first card.
- Visually inspected the complete desktop section at 1440px and the phone layout at 390px. Text fits its cards, the day/hour hierarchy is clear and the pilot-project emphasis is visible. Small text on the light section surface uses the existing darker grey for contrast.
- `interactions.json`: the section is between books and training locations; its return link navigates to `#training-calculator`; the basic-course total is still 40,000 ₽. Four course cards and 88 topics in the selected programme remain available. No local console errors or warnings were captured.

`npm run build` passed with 53 modules. Temporary viewport overrides were reset; the new section was left open for the user. No implementation-mirroring unit tests were added for this content/layout change.

Earlier catalogue, image and gallery validation remains in the dated reports. No open P0/P1/P2 findings in this scope.

Final result: **passed**.
