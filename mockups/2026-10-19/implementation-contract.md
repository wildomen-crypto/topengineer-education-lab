# Implementation contract after critic approval of all ten PNGs

Root owns shared state, the App routing/menu/gallery, common overlay panels, printing infrastructure and shared data. Design implementers work only in their isolated family JSX/CSS files. They must not begin implementation until root explicitly sends the critic's all-ten approval.

Family A: `src/next/FamilyA.jsx` and `src/next/family-a.css`, export default `function FamilyA({course})` for variants13–17.

Family B: `src/next/FamilyB.jsx` and `src/next/family-b.css`, export default `function FamilyB({course})` for variants18–22.

Root wraps output in `<main className="course-site next-course nc-{slug} variant-{id}">`, a small shared variant-navigation strip, and a `.next-body` div. Families render only the design body and import their own CSS. Use classes prefixed `na-` or `nb-` to avoid cross-family or existing-page style changes. Shared approved header/footer are outside this wrapper.

`course` API supplied by root:

- `variant`: `{id,slug,name,...}`.
- `level` number1–3; `setLevel(number)`; `people` number1–21, `setPeople(number)`; `format` online/office/onsite, `setFormat(string)`.
- `programs`: array of three enriched source programs. Each has `id`, `name`, `short`, `experience`, `text`, `result`, `count`, `topics` (flat string[]), `modules` (`{id,title,day,topics:string[]}`[]) and `days` (two arrays of those module objects). `program` is currently selected program.
- `prices`: complete original array for1–20participants. `price`: selected entry `{people,total,perPerson,...}`, or null when onsite or people21. Never show a fixed total when `price` is null.
- `formats`: `{online:'Онлайн',office:'В Москве',onsite:'На базе заказчика'}`.
- `open(panel,event?,selectedLevel?)`: opens shared accessible dialog. Panels: `program`, `enroll`, `conditions`, `price`. Optional third parameter selects a level before opening its full program. Always use this for full program / enquiry rather than adding duplicate forms. The event is the React click event so opener focus can be restored.
- `money(number)`: Russian price string with ₽.
- `Icon`: native Font Awesome component, use `<course.Icon name="search" />` or destructure `const Icon=course.Icon`.
- `assets`: `classroom` (female instructor practice photo), `instructor` (male instructor portrait), `group` (classroom photo), `model` (actual steel engineering model JPG), `modelOverview` (second actual project image if available). Use these real existing assets rather than cropping a whole UI screenshot or drawing artwork.
- `print()`: prints complete selected program and price using root's print-only document (primarily for22). Native browser print opens only when user activates its button.

Families own their distinctive native buttons, tabs, stepper, lists, filters, and accessible in-page state. Root supplies no repeated sales hero or generic cards. Native elements and existing icon fonts; no handcrafted SVG, CSS/div art or gradients as image substitutes. Real photos may be object-fit cropped thoughtfully; preserve project geometry in19. Text is real source, not ImageGen's invented subtopics. Main UI must work with keyboard. No invented backend submission/success. Program and enquiry are available from every core state.

Target real CSS viewport2560×1440, readable useful columns to edge with24–40px inside gutters, body generally18–22px, paragraphs60–70ch. At390px, one-column meaningful reading order,44px controls, no hidden persistent actions/sideways page scroll. At1280px (including200%zoom equivalent), gracefully collapse multi-column layouts. The10 PNGs are native1586×992 at the requested2560×1600 aspect, and therefore need density normalization in QA rather than arbitrary page stretch.
