import React, {useEffect, useRef, useState} from "react";
import shell from "./data/shell.json";

const ReferenceCourse = React.lazy(() => import("./reference/ReferenceCourse.jsx"));
const courseUrl = "/education-centr/tekla-23-site-style/";
const photoCourseUrl = "/education-centr/tekla-photo-hero/";
const courseSections = [
  {id:"course-descriptions",name:"Курсы Tekla Structures",keywords:"базовый компоненты продвинутая настройка шаблоны"},
  {id:"training-calculator",name:"Стоимость и расчёт обучения",keywords:"калькулятор цена прайс рубли группа участники"},
  {id:"how-training-works",name:"Как проходит обучение",keywords:"занятия преподаватель практика"},
  {id:"training-books",name:"Руководство Tekla Structures",keywords:"книги комплект учебник"},
  {id:"training-duration",name:"Длительность обучения",keywords:"дни часы 2 5 10 пилотный проект"},
  {id:"training-formats",name:"Где будете заниматься",keywords:"онлайн офис Москва выезд заказчик"},
  {id:"before-training",name:"Подготовка к обучению",keywords:"компьютер связь даты"},
  {id:"course-certificate",name:"Сертификат после курса",keywords:"документ образцы"},
  {id:"after-training-support",name:"Поддержка после обучения",keywords:"преподаватель помощь вопросы"},
  {id:"program",name:"Полные программы курсов",keywords:"темы моделирование чертежи компоненты"},
];

// Keep the approved shell; both introductions use the same course content.
const headerDocument = new DOMParser().parseFromString(shell.header, "text/html");
headerDocument.querySelectorAll('header a[href="/education-centr/"]').forEach((link) => {
  if (link.textContent.trim() !== "Учебный центр") return;
  const menu = link.parentElement.querySelector(":scope > ul");
  if (!menu) return;
  const articles = [[courseUrl,"Обучение Tekla Structures"],[photoCourseUrl,"Tekla Structures — с фотографией"]];
  const items = articles.map(([url,name]) => {
    const item = document.createElement("li");
    const article = document.createElement("a");
    article.href = url;
    const label = document.createElement("span");
    label.className = "pbmit-span-wrapper";
    label.textContent = name;
    article.append(label);
    item.append(article);
    return item;
  });
  menu.prepend(...items);
});
const header = headerDocument.body.innerHTML;
function Arrow() { return <i aria-hidden="true" className="pbmit-base-icon-next" />; }

function SiteShell({ children }) {
  const headerRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const el = headerRef.current;
    function click(e) {
      if (e.target.closest(".nav-menu-toggle")) {
        e.preventDefault();
        const opened = !document.body.classList.contains(
          "pbmit-mobile-menu-active",
        );
        document.body.classList.toggle("pbmit-mobile-menu-active", opened);
        el.querySelectorAll(".pbmit-navbar > div").forEach((panel) =>
          panel.classList.toggle("active", opened),
        );
        e.target
          .closest(".nav-menu-toggle")
          .setAttribute("aria-expanded", String(opened));
        return;
      }
      if (
        e.target.closest(
          ".closepanel,.pbmit-nav-menu-close,.pbmit-mobile-menu-bg",
        )
      ) {
        document.body.classList.remove("pbmit-mobile-menu-active");
        el.querySelectorAll(".pbmit-navbar > div").forEach((panel) =>
          panel.classList.remove("active"),
        );
        return;
      }
      const link = e.target.closest("a");
      if (link?.getAttribute("aria-label") === "Поиск по сайту") {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (e.target.closest(".pbmit-btn") && !link) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("tekla-intensive-enroll", {
          detail: { opener: e.target.closest(".pbmit-btn") },
        }));
        return;
      }
      const icon = e.target.closest(".righticon");
      if (icon) {
        e.preventDefault();
        icon.parentElement.classList.toggle("local-menu-expanded");
        return;
      }
      if (
        link &&
        link.closest(".navigation") &&
        link.parentElement.querySelector(":scope > ul") &&
        window.innerWidth < 1200
      ) {
        e.preventDefault();
        link.parentElement.classList.toggle("local-menu-expanded");
      }
    }
    function key(e) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        document.body.classList.remove("pbmit-mobile-menu-active");
        el.querySelectorAll(".pbmit-navbar > div").forEach((panel) =>
          panel.classList.remove("active"),
        );
      }
    }
    el.addEventListener("click", click);
    window.addEventListener("keydown", key);
    return () => {
      el.removeEventListener("click", click);
      window.removeEventListener("keydown", key);
    };
  }, []);
  return (
    <>
      <div ref={headerRef} dangerouslySetInnerHTML={{ __html: header }} />
      {children}
      <div dangerouslySetInnerHTML={{ __html: shell.footer }} />
      {searchOpen && (
        <dialog open className="local-search">
          <div className="course-site">
            <button
              className="search-close"
              onClick={() => setSearchOpen(false)}
              aria-label="Закрыть поиск"
            >
              Закрыть
            </button>
            <h2>Поиск по странице обучения</h2>
            <label>
              Название или тема
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Например: программа, стоимость"
              />
            </label>
            <div className="search-results">
              {courseSections
                .filter((section) => (section.name + " " + section.keywords)
                  .toLowerCase().includes(search.trim().toLowerCase()))
                .map((section) => (
                  <a key={section.id} href={"#" + section.id} onClick={() => setSearchOpen(false)}>
                    {section.name}<Arrow />
                  </a>
                ))}
              {!courseSections.some((section) => (section.name + " " + section.keywords)
                .toLowerCase().includes(search.trim().toLowerCase())) && <p>Ничего не найдено. Попробуйте другое слово.</p>}
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
export function App() {
  const photoHero = location.pathname === photoCourseUrl || location.pathname === photoCourseUrl.slice(0,-1);
  useEffect(() => {
    document.title = "Обучение Tekla Structures | Топинженер";
    const canonicalUrl = photoHero ? photoCourseUrl : courseUrl;
    if (location.pathname !== canonicalUrl) {
      // Old comparison links now lead to the retained course, keeping useful anchors.
      const hash = location.hash === "#designs" ? "#course-descriptions"
        : location.hash === "#enroll" ? "#training-calculator" : location.hash;
      history.replaceState(null, "", canonicalUrl + hash);
    }
  }, []);
  return (
    <SiteShell>
      <React.Suspense fallback={<main className="course-site nc-loading" role="status">Загрузка страницы курса…</main>}>
        <ReferenceCourse photoHero={photoHero}/>
      </React.Suspense>
    </SiteShell>
  );
}
