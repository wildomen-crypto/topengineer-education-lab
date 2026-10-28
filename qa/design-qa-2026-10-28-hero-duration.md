# Hero duration clarification — variant 23

The highlighted first-screen summary now explicitly lists 2 days / 16 hours, 5 days / 40 hours and 10 days / 80 hours. Labels are derived from the same duration data as the full descriptions. The starting price is on a separate, quieter line and explicitly applies to a group taking two days online or in our office. Calculation and tariffs are unchanged.

Production build passed. Browser checks at desktop width 1418px and phone widths 390px and 320px show identical complete information without horizontal overflow or clipped duration groups. Visually inspected desktop and phone captures. The yellow accent and existing typography are retained. Temporary viewport overrides were reset and the corrected first screen was left open.

Evidence: `qa/2026-10-28-hero-duration/responsive.json`, `hero-desktop.png` and `hero-390.png`. No new unit tests were needed for this small content and wrapping change.

Result: **passed**.
