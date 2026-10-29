# Latest verification — isolated live test

The photographic course body is published at https://dev.topengineer.ru/test/ inside Shadow DOM. The live Bitrix header/footer and their PHP wrappers are preserved. See [the deployment QA report](qa/design-qa-2026-10-29-isolated-test.md) and [administrator instructions](BITRIX-TEST.md). Functional, isolation, phone and 2560 px checks passed; the existing host menu overflow at 1280 px is unchanged. The original photographic-design comparison follows below.

# Photographic introduction — design QA

**Findings**

No remaining actionable P0/P1/P2 findings. The new route `/education-centr/tekla-photo-hero/` uses the reference classroom photograph across the first screen, with editable course text on the left and the complete overview on a dark panel on the right. The approved shell remains intact. The original `/education-centr/tekla-23-site-style/` still uses its separate photograph and original introduction.

**Visual truth and comparison setup**

- Source: the user's `codex-clipboard-b5130196-9a25-4944-99fa-d3f71818d3a4.png`, 1922 × 902 px. Its top 75 px of browser chrome/bookmarks were removed. The resulting site content is saved as `qa/2026-10-29-photo-hero/source-page.png`.
- Implementation: `qa/2026-10-29-photo-hero/photo-desktop.png`, captured in the in-app browser at a 1922 × 827 CSS viewport. The screenshot backend returned 1907 × 821 px. Source content was normalized to that exact pixel area; source CSS density was not provided, so no claim of exact source CSS-pixel equivalence is made. The comparison is grounded in the supplied composition and the existing approved design system.
- State: initial course, one participant, two days, overview visible, introduction disclosure closed. No modal or mobile menu open.
- Full-view combined input: `comparison-final.png`, with source on the left and implementation on the right. Both halves are 960 px wide. Earlier combined input: `comparison-v1.png`.
- Focused comparison: `headline-comparison.png` puts both actual headline crops in one image at the same pixel scale. `table-detail.png` verifies the added overview at native capture size. The source has no right-hand overview; the user explicitly requested that addition, so the table is reviewed against the existing course information and site tokens rather than treated as a source mismatch.

**Comparison history**

1. Initial side-by-side pass (`photo-desktop-v1.png`, `comparison-v1.png`, `pass-1.md`) found three P2 issues: centre cropping cut the teacher's head, the photograph began under the floating desktop menu, and vertical padding pushed the image caption below the first screen. Initial result: blocked.
2. Fixed the crop to `center top`, cleared the approved menu's 40 px overhang, reduced vertical padding, and reduced the introductory eyebrow to 12 px. No shell styling was changed.
3. Recaptured at the same CSS viewport and compared again (`photo-desktop.png`, `comparison-final.png`, `headline-comparison.png`). The teacher's head is visible; the hero starts at y=176 and ends at y=827. The complete table ends at y=797.9 and its image caption ends at y=817, within the first screen. All earlier P2 findings are resolved.

**Required fidelity surfaces**

- Fonts and typography: existing Archivo headings/buttons and Roboto body retained. The white headline has the reference's three-line hierarchy, approximately 65 px at the comparison width; the table remains readable at 14 px/1.45 without truncation. The focused comparison confirms similar visual weight and wrapping. Native icons and approved button styling are reused.
- Spacing and layout rhythm: full-width image and shared site content insets; text and overview do not overlap. The table has consistent row dividers and padding. Its dark panel is an intentional addition requested by the user. Below 851 px the two blocks stack over the same photograph. The hero grows naturally when the longer introductory copy is expanded.
- Colors and tokens: approved navy `#16222d`, yellow `#ffc34e`, white foregrounds and a dark translucent overview surface. The real background image and a simple dark scrim provide readable text. Keyboard focus is visibly yellow on the photo. No decorative gradients or fabricated assets are used.
- Image quality and asset fidelity: the exact existing `/assets/intensive/hero.jpg` matches the supplied scene. Top anchoring keeps the teacher's head visible. No stretching, placeholder imagery, CSS drawings or replacement logos were introduced. Wide and phone captures were inspected.
- Copy and content: the reference's obsolete two-day-only/three-level information was intentionally replaced by the current 2/5/10-day durations, qualified starting price, four courses and all thirteen overview rows. Both original introductory paragraphs remain in a native keyboard-accessible disclosure. Course languages and current Russian-first book languages are preserved. All ten subsequent content blocks are text-identical to the main route before interaction.

**Functional and responsive checks**

- `npm run check` passed: build, 9 pricing/date tests and 4 hosting tests. The final build passed again after the scoped crop/layout and route-normalization changes (51 modules). Protected hosting files were not edited.
- Widths 320, 390, 768, 850, 851, 1024, 1199, 1200, 1440, 1922 and 2560 px: no page overflow, no clipped overview cells, thirteen rows present, image width equals available viewport width. Evidence: `responsive.json`, `photo-mobile.png`, `photo-mobile-table.png`, `photo-2560.png`.
- Hero links open the calculator and course choices. Five days onsite for one participant calculate to 280000 ₽ and carry the same format/duration/price into the enquiry. No message was sent. Enter opens/closes the full introductory copy. Tab reaches the next CTA with the yellow focus ring. Evidence: `interactions.json`.
- New mobile menu link opens the photo route and closes the mobile menu. Direct links with and without the trailing slash resolve to the photo variant. Evidence: `mobile-menu.json`, `final-route.json`.
- Original route retains its original title and separate photo; later content is identical between the two layouts. Evidence: `regression.json`.
- Browser console errors checked: none. Temporary viewport override reset; preview server remains running and the photo route remains open.

**Open Questions**

None blocking. The source did not include a mobile design or the newly requested table, so those views follow the existing site system and verified responsive behavior.

**Implementation Checklist**

- [x] Exact source photograph and full-width hero.
- [x] Complete overview and current course data.
- [x] Working CTAs, keyboard disclosure, menu and enquiry.
- [x] Original introduction and subsequent blocks retained.
- [x] Desktop/phone inspection and combined visual comparisons.
- [x] All P0/P1/P2 findings resolved.

**Follow-up Polish**

No additional P3 changes required for this handoff.

final result: passed
