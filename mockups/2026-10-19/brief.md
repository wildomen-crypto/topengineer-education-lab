# Ten new full-width directions — 19 October 2026

User requested 10 distinct image mockups, critic approval BEFORE implementation, then 10 working pages. All twelve existing pages also become full-width, including 2560 × 1440. Shared approved header/menu/footer keep their design. This brief and each named PNG, rather than the generation order, bind the implementation target. The user explicitly delegates approval to the critic; no additional user selection is required.

## Shared content and constraints

Russian desktop course pages for Topengineer. Individual Tekla Structures training. Two days / 16 hours; beginner, experienced (6+ months), professional (4+ years). Price independent of level: 1 participant 40 000 ₽, 3 participants 70 000 ₽, 5 participants 90 000 ₽ total / 18 000 ₽ per person. Online or Moscow office; customer premises by agreement, travel/accommodation separate. Teacher experience 6+ years. Program topics from `src/data/programs.json` (65 + 43 + 37 = 145), prices from `src/data/prices.json`. No invented dates, schedules, qualifications, testimonials, teacher names or offers.

Existing brand: white, deep navy #16222d, yellow #ffc64b, cool muted gray; Roboto/Archivo, native icon fonts. Variation may use editorial cream, charcoal, muted blue/teal as secondary page accents while the shared site chrome stays approved. Each direction must visibly differ in information hierarchy, composition and interaction, not simply color. Full-width surfaces, internal 24–40px gutters at 2K, prose typically 60–70 characters/line. Extra space supports useful columns and comparison. Main body only in generated mocks; no replacement site header/footer. Target desktop content frame 2560 × 1600, natural unwarped layout. One image per direction, not a collage.

References already exist in `qa/` and approved local photographs under `public/assets/intensive/` and `public/assets/team-class/`. Inspect actual images and attach them to ImageGen; use as brand/asset grounding, not as a layout to repeat. Main source `qa/12-team-class-desktop-final.png`. Existing numbered page ideas in `src/App.jsx`.

## Directions and acceptance criteria

13 `task-workspace` / **Рабочая задача**: direct three-column workspace, no marketing hero. Narrow task navigation (model / connections / drawings), broad central exact-source module content, compact right facts/price/action. A visitor's selected task changes the real program modules. Clearly unlike existing tab page 7 or article page 8.

14 `engineering-journal` / **Инженерный журнал**: editorial issue, oversized typographic introduction and asymmetric columns, short narrative lead, chapter numbers and pull-out source facts. No sticky contents sidebar or app dashboard. Warm paper/ink, selective yellow, restrained classroom photograph.

15 `curriculum-compare` / **Программы рядом**: genuine parallel comparison of all three levels, aligned category rows and expandable exact topic groups. Common duration and cost strip. Three curriculum columns, not three sales cards followed by tabs. No false implication that a higher level is a more expensive tier.

16 `two-day-planner` / **Два дня в работе**: directly opens two large day columns and a docked detail panel showing chosen source topics. Day/module selection is the main interaction. No invented fixed hour slots. Compact top level selector; no marketing hero or decorative road map.

17 `topic-library` / **Каталог тем**: starts with prominent full-program search and filters, then readable topic results with level/module context. All 145 topics accessible and count grounded. No lead sales photo or three program cards. Distinct knowledge-base anatomy.

18 `course-composer` / **Соберите свой курс**: one step at a time (level → format → participants → review), large focused choice area and always editable summary. Program accessible from every step. No mandatory personal data before seeing cost. Distinct guided workflow, no fake success/backend.

19 `project-explorer` / **От модели к документации**: large actual engineering model/result image as main surface with three vertical stage controls and associated real curriculum topics. Model → connections → drawings/reports. Focus on work output, not teacher biography. Source assets should be reused where available.

20 `reading-modes` / **Коротко или подробно**: typographic full-width reading surface, global brief/detailed control changes content depth across sections while keeping full source available. Monochrome/navy, generous type and semantic horizontal bands. No sticky TOC, wizard or ordinary accordion-only behavior.

21 `format-studio` / **Где вам удобно учиться**: format choice IS the screen composition, three large zones for online / Moscow / customer's premises. Choosing one changes applicable logistics, price context and enquiry. Not the old corporate price page with a small format section.

22 `print-syllabus` / **Программа на столе**: document-style syllabus first, without sales hero. Toolbar for level / contents / print; two day columns and exact topics. A real print stylesheet produces the full selected curriculum and pricing without navigation or collapsed content loss. Visually a precise document, not an article with a sidebar.

## Critic gate

Initial critic confirmed these distinctions and required them in each mock. Actual PNGs must be visually reviewed and accepted individually before any of the new pages is implemented. Record verdict, P0–P2 fixes and implementation constraints in `qa/design-critic-2026-10-19.md`. Root handles existing-page width changes independently of this gate.
