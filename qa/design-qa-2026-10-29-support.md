# Support after training — variant 23

Added `#after-training-support` after certificates and before the course programmes. The complete support content was translated from the supplied reference's saved screenshot: direct instructor contacts and agreed messaging channels, free answers to quick questions, and paid hourly support for involved work with the task/rate agreed before work starts. No hourly amount or response deadline was invented. `source-support.png` is a crop of the existing `qa/2026-10-27/reference-desktop-full.png`, using the saved section coordinates.

The old brief forum/implementation note was moved from preparation to this section. The page contains exactly one full support block. Desktop uses two cards with the existing fonts, colours and icons; narrow screens stack the cards. The eleven content blocks still alternate white and the shared light-grey token, with support grey and the following programme white. Header/footer and other variants are unchanged.

Validation:

- Production build passed with 62 modules; `git diff --check` passed. This is a content/layout addition; pricing data and calculation logic were not edited.
- Browser text matches the source's conditions. The section has a unique heading/landmark and appears between `course-certificate` and `program`.
- At widths 2560, 1440, 1024, 992, 991, 701, 700, 390 and 320 px there is no horizontal page/card overflow. Two cards become one column at 700 px. Background alternation is correct for all eleven blocks at every checked width.
- The former preparation stub is absent; the existing forum link remains `https://topengineer.ru/forum`. No external message or form was submitted.
- Desktop and phone screenshots were visually inspected. Viewport override reset and the new support section left open.

Evidence: `qa/2026-10-29-support/` contains the reference crop, responsive measurements and desktop/phone screenshots.

Result: **passed**.
