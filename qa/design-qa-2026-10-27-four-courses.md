# Design QA — four current courses in variant 23

Working page: http://127.0.0.1:4173/education-centr/tekla-23-site-style/#course-descriptions

## Verified source and scope

The user explicitly identified the updated live reference at http://127.0.0.1:8774/ and requested four courses. The live page was opened; all four cards and all four programme tabs were inspected. This is a replacement of variant 23's earlier three-level catalogue, rather than an unrelated fourth card appended to it.

| ID | Current course, Russian adaptation | Topics | Parts |
| --- | --- | ---: | --- |
| 1 | Базовый курс | 88 | 44 + 44 |
| 2 | Пользовательские компоненты | 88 | 44 + 44 |
| 3 | Продвинутая работа в Tekla Structures | 88 | 44 + 44 |
| 4 | Настройка системы и создание шаблонов | 88 | 44 + 44 |

The 352 source topics were translated with their original numbering and section boundaries. Course 1's overview note referring learners to course 2 is retained. Prerequisites now state that courses 2–4 follow the basic course and may be taken in any order; the numbered sequence is recommended.

The saved Russian ruble price list remains in use for each course. This update does not import the reference's euro business data or new duration tariffs. The approved shared shell and book/certificate galleries remain in place. Earlier variants keep their existing three-level content. The source programmes were captured from each rendered tab in `source-programmes.json`; `content-coverage.json` confirms matching source numbers, per-part totals and section boundaries.

## Implementation and visual review

The four courses share one local catalogue, consumed by their cards, calculator rows, programme tabs and enquiry. Topic badges are derived from the actual programme content. Per-course participant/date state initializes from the complete catalogue, including course 4. The summary uses correct Russian plural forms for four programmes, eight days and 64 hours.

Cards use four columns from 1800px, two columns at intermediate widths and one column at 850px and below. Programme tabs use the same wide-screen arrangement and stack on smaller screens. Full programmes have two parallel parts on desktop and sequential parts on phones, with searchable topics and expandable sections.

No open P0/P1/P2 findings remain in this scope.

- Fixed: the old three-level catalogue omitted the fourth course and misrepresented the current second/third courses. All four now match the source taxonomy and programme contents.
- Fixed: the new long part heading was squeezed beside its topic count on a 320px phone. Its header now places the count below the description and preserves useful text width.
- Fixed: inherited programme styles left content too close to panel edges and combined bullets with topic numbers. Panels now have internal padding, aligned numbered columns and hanging text indentation.
- Improved: full programme tabs use 14px text, wrap long titles and support Left/Right/Home/End with focus following selection.

## Evidence and checks

Folder: `qa/2026-10-27-four-courses/`.

- `source-full.png`, `source-courses.png`, `source-geometry.json`: current reference.
- `23-{2560,1440,768,390,320}-full.png`: final implementation captures.
- Focused cards, fourth-card details and programme regions are cropped by `scripts/compare-four-courses.mjs`.
- `four-courses-comparison.jpg`: source cards at their native 1280px on the left; implementation's 2560px four-column view uniformly reduced to 1280px on the right. This compares course composition, not equal-viewport pixel fidelity; no stretching is used.
- Visually inspected the wide four-column cards, 1440px two-row cards, source comparison, 320px fourth card, desktop programme, and final phone programme detail including the repaired part header and topic indentation.
- `responsive.json`: ten verified widths — 2560, 1800, 1799, 1440, 1024, 851, 850, 768, 390 and 320. Every width reports four cards, four calculator course rows, four programme tabs, 88 topics in the selected programme and no horizontal page overflow.
- `capture-geometry.json` retains section/card bounds. Full captures avoid unreliable nonzero screenshot clipping. Focused phone crops are programme details rather than assertions about the complete page viewport.

`interactions.json` records:

1. Selecting course 4 in its card checks its calculator row; five participants and a start date are retained. The combined base + course 4 amount is 130,000 ₽.
2. Selecting all four courses, with five participants in course 4 and one in each other course, gives 210,000 ₽ and «4 программы · 8 дней · 64 часа».
3. The enquiry and prepared mail link contain all four correct titles, participants, dates and prices. No mail was sent.
4. More than 20 participants in course 4 switches the total to «По согласованию».
5. Course 4's full-programme card button opens its correct tab. Search for GetValue returns the one expected topic, 1.41. Collapse/expand works for all nine sections in that course.
6. Every programme tab renders exactly 88 topics in two parts of 44, ending at 2.44. Left/Right/Home/End tab controls preserve focused/selected agreement.

`earlier-variant-regression.json` confirms variant 1 still renders its three tabs and 65-topic basic programme. `app-console.json` contains no local page errors or warnings. Temporary viewport overrides were reset and the updated course catalogue was left open for the user.

`npm run build` passed with 51 modules and a separate reference-page bundle. The existing shared programme implementation and saved price data were not modified.

Earlier full-page and gallery QA remains archived in `qa/design-qa-2026-10-27.md` and `qa/design-qa-2026-10-27-stacks.md`.

Final result: **passed**.
