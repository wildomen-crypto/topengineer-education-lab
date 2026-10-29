# Photo hero — first visual pass

Source: `source-page.png` (user screenshot, browser chrome removed). Implementation: `photo-desktop-v1.png`. Combined input: `comparison-v1.png`. CSS viewport: 1922 × 827; captures normalized to the same 1907 × 821 pixel area and compared side by side.

- [P2] Centre cropping cuts the teacher's head at the top. Fix: anchor the image to the top, as in the reference.
- [P2] The background begins behind the floating navigation. Fix: clear the existing desktop menu's 40 px overhang without changing the approved shell.
- [P2] Generous vertical padding pushes the photo caption below the first screen. Fix: reduce hero padding while keeping the complete overview and readable body text.

The added right-hand overview is intentional: the user explicitly requested a table over the image. Current 2/5/10-day durations and four-course content must replace the obsolete two-day-only copy in the screenshot.

final result: blocked
