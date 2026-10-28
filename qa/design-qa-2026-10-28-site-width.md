# Source-site content width — variant 23

Source inspected in the browser: https://dev.topengineer.ru/izgotovlenie-metalloconstrukciy/izgotovlenie-jelezobetonnih-metallokonstrukciy/

The current source uses a centred `.container.wide-container`, rather than unbounded article content. Its CSSOM rules and actual bounding rectangles were read from the live page. The course now matches those content boundaries while retaining full-width section backgrounds. The approved shell and variants 1–22 are untouched.

| Viewport range | Maximum outer container | Inner horizontal padding |
|---|---:|---:|
| Up to 768 px | Available width | 15 px |
| 769–1200 px | Available width | 30 px |
| 1201–1366 px | 1276 px | 30 px |
| 1367–1599 px | 1300 px | 50 px |
| 1600–1919 px | 1520 px | 50 px |
| 1920–2559 px | 1820 px | 60 px |
| 2560–2999 px | 2400 px | 80 px |
| From 3000 px | 2800 px | 80 px |

`site-width.css` computes one shared section inset from those widths and padding. This avoids adding nested margins or changing the section backgrounds. The hero, catalogue, calculator, training process, books, durations, formats, preparation, certificates, full programme and local design navigation use the same boundaries.

The narrower hero also has a minimum label width to prevent “Длительность” splitting, and its intermediate-screen photo focus preserves the teacher's face. At 601–768 px the hero becomes a single column; at 601–850 px course facts use two columns. This prevents the long heading from intruding into the image at 601 px.

## Evidence

- `qa/2026-10-28-site-width/source-widths.json`: nine actual source measurements, including 1440/1920/2560/3000 px. `source-2560.png` records the reference page.
- `local-widths.json` and `comparison.json`: 17 course widths, 320–3000 px, including 1200/1201, 1366/1367 and 991/992 boundaries. Every main content grid matches the source's expected left/right boundaries. The course itself has no horizontal overflow, including with all four courses selected.
- The same four-course example remained 295,000 ₽, 11 days, 88 hours at all measured sizes. Calculation data and functions were not changed.
- `final-hero-checks.json`: after the text/photo adjustments, 11 widths pass both course and heading overflow checks, including 600/601 and 768/769 px.
- Desktop 1440 and 2560 px hero captures, 1440 px book and certificate galleries and the phone layout were visually inspected. Galleries keep their overlap and height distribution.
- At exactly 1201 px the unchanged shared shell reports 1220 px page scroll width; course scroll width remains 1186 px, equal to its available width. No course element or control extends beyond the viewport. This existing shell edge case is recorded separately from content-width validation; no approved header/footer rule was edited.

Production build passed with 59 modules. No new unit tests were added for CSS sizing changes. The user's original basic-course selection was restored, viewport overrides reset, and the updated page left open. Earlier price, catalogue, gallery and duration checks remain in their dated reports.

Result: **course width and responsive layout passed**.
