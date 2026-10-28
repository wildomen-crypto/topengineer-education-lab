# Compact calculator — variant 23

The calculator uses shorter rows, a smaller heading and total, inline duration metadata and less repeated copy. Book quantity and its subtotal appear only when books are selected. The 1–5-person pricing rule remains visible; full pricing/calendar conditions are in a native keyboard-accessible disclosure. Date errors remain outside that disclosure. The approved page width, shared shell, other sections and other variants are unchanged.

## Comparable measurements

Baseline and result both use the basic course, two days, one participant, no books and closed conditions. Heights include the whole calculator section.

| Viewport width | Before | After | Reduction |
|---|---:|---:|---:|
| 2560 px | 1523 px | 846 px | 44% |
| 1440 px | 1517 px | 882 px | 42% |
| 1024 px | 1831 px | 1061 px | 42% |
| 390 px | 2722 px | 1451 px | 47% |
| 320 px | 2834 px | 1509 px | 47% |

Selecting more courses or opening conditions naturally adds content. Four five-day courses and books occupy about 952 px at 1440 px; mobile selected courses use labelled cards.

## Validation

- `npm run check` passed: production build (60 modules), nine pricing tests and four hosting tests. The final CSS refinements were rebuilt. No pricing data or calculation algorithms changed.
- All courses selected plus three books: 904,000 ₽, 20 days and 160 hours. The enquiry retains all four names, one actual participant per course, 220,000 ₽ per course and the book subtotal of 24,000 ₽. No message was sent.
- Books alone, two sets: 16,000 ₽. Empty selection disables the enquiry. Book quantity is hidden when unchecked; checking again preserves the chosen quantity.
- Conditions open and close with Enter. An invalid end date still shows its alert outside closed conditions and disables the enquiry. Starting 7 November 2026 on a five-day course ends 11 November, inclusively.
- All four courses and books checked at widths 2560, 1440, 1200, 1199, 1024, 768, 701, 700, 600, 390 and 320 px: no horizontal overflow; fields remain inside their cells. Controls are at least 40 px high, or 44 px on phones.
- Desktop, phone cards and phone book/total layout were visually inspected. Temporary viewport overrides were reset; default basic-course selection restored and calculator anchor left available.

Evidence is in `qa/2026-10-28-compact-calculator/`: before/after measurements and screenshots, interaction checks, responsive measurements and a phone screenshot. Full-page captures can vary by a scrollbar width; height comparisons use the independent viewport measurements.

Result: **passed**.
