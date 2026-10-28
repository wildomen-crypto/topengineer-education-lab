# Design QA — responsive books and certificate samples, variant 23

Working page: http://127.0.0.1:4173/education-centr/tekla-23-site-style/

## Scope and source

The user's latest instruction explicitly restores the reference's three certificate images and asks for the same responsive overlap and height-sharing behaviour for both certificates and books. This supersedes the earlier omission of certificates. Source: http://127.0.0.1:8774/#training-books and #course-certificate, inspected and captured before implementation. The existing approved site header, footer, colours and typography remain in place.

Six original artwork files were visually inspected and copied locally: three JPG book covers and three PNG certificate samples, with existing WebP certificate previews. No generated replacement images or screenshot-as-page implementation. The exact reference book-cover silhouette is retained with its original CSS mask. The English edition cover caption and demonstration/sample certificate labels make their status explicit. The Russian source programme, ruble prices and two-day course calculator remain unchanged. The 5/10-day artwork does not create new course tariffs.

## Implementation and visual findings

Both galleries use separate clickable image buttons. In two-column layouts, their artwork area stretches with the adjacent copy and distributes the three images over its usable height. Images preserve their aspect ratios and useful minimum sizes; narrower galleries create more overlap and vertical separation. On phones, artwork and copy flow in one column. Native image dialogues provide previous/next, arrow keys, Escape, body scroll locking and focus restoration.

No open P0/P1/P2 issues remain in this scope.

- Fixed: a flat book thumbnail could not rearrange its individual covers; replaced with the exact three source images.
- Fixed: certificate layering initially concealed the 5/10-day badges on phones. The final order matches the source: later sheets are above earlier sheets. All three duration badges remain visible; separate duration buttons also open each sheet.
- Fixed: redundant visible book labels consumed space needed by the height-sharing artwork. Labels remain accessible on the image buttons; the visible layout follows the source.
- Deliberate adaptation: certificate artwork also shares the taller Russian copy height on desktop, rather than remaining a fixed horizontal row. This follows the user's explicit height-compensation request.

## Evidence inspected

Folder: `qa/2026-10-27-stacks/`.

- Source captures: `source-{1440,1024,768,390}-full.png` and `source-geometry.json`.
- Final captures: `23-{2560,1440,1280,1200,1199,1024,768,390,320}-full.png` and `final-geometry.json`.
- Focused sections: `23-<width>-books.png` and `23-<width>-certificates.png`.
- Side-by-side comparisons at 1440, 1024, 768 and 390: source left, implementation right; both retain the same width and natural proportions, padded below without stretching.
- Visually reviewed: desktop book/certificate comparisons, 768px book comparison, corrected 390px certificate comparison, 320px book/certificate sections, 2560px certificate section, desktop certificate viewer and phone book viewer. The responsive contact sheet was also opened and inspected.
- Reproducible crops and comparisons: `scripts/compare-media-galleries.mjs`. Full captures use explicit full-width clips; sections are cropped from post-capture document coordinates. The initial 2560px capture occurred before lazy content mounted and was replaced after full load.

Measured examples (rounded pixels):

| Viewport | Gallery | Artwork + captions | Adjacent copy | Image top positions |
| --- | --- | ---: | ---: | --- |
| 2560 | Books | 444 | 410 | 0 / 0 / 0 |
| 1440 | Books | 410 | 410 | 0 / 41 / 81 |
| 1280 | Books | 446 | 446 | 0 / 59 / 117 |
| 768 | Books | 588 | 588 | 0 / 138 / 276 |
| 1440 | Certificates | 452 | 452 | 0 / 64 / 127 |
| 1200 | Certificates | 508 | 508 | 0 / 92 / 183 |
| 390 | Certificates, single column | 478 | 467 | 0 / 62 / 123 |
| 320 | Certificates, single column | 454 | 546 | 0 / 68 / 136 |

All nine viewports have no horizontal page overflow and all six gallery images loaded. Exact values are retained in `final-geometry.json`.

## Behaviour verified

`interactions.json` records certificate opening, next image, keyboard navigation, Escape dismissal, restored opener focus and unlocked body scroll. Book volume 2 opens with Enter and switches to volume 3. The phone viewer fits its width without horizontal scrolling. Certificate duration buttons open the correct covered sheet. Desktop and mobile viewer captures were opened and inspected.

Adding the book through the section button checks the calculator's book option and displays the selected state while the existing training total remains 40,000 ₽. The book option was reset after testing. The local page has no captured errors or warnings (`app-console.json`); historical reference-page errors from port 8774 are outside this page.

`npm run build` passed: 48 modules, separate reference-page bundle, final hosting artifacts generated. No automated pixel-mirroring tests were added for this visual change. The earlier broader route, calculator and programme checks remain archived in `qa/design-qa-2026-10-27.md`.

Final result: **passed**.
