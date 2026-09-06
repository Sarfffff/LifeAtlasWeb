(() => {
  const desktopQuery = window.matchMedia("(min-width: 1440px)");

  const restoreToc = (layout) => {
    const outline = layout && layout.querySelector(":scope > .article-outline-panel");
    const marker = layout && layout.querySelector("[data-article-toc-origin]");
    const toc = outline && outline.querySelector("#card-toc");

    if (toc && marker && marker.parentNode) {
      marker.insertAdjacentElement("afterend", toc);
    }

    if (outline) outline.remove();
    if (layout) layout.classList.remove("reading-three-column");
  };

  const mountToc = () => {
    const layout = document.querySelector("#body-wrap.post #content-inner");
    if (!layout) return;

    if (!desktopQuery.matches) {
      restoreToc(layout);
      return;
    }

    if (layout.querySelector(":scope > .article-outline-panel")) return;

    const aside = layout.querySelector(":scope > #aside-content");
    const toc = aside && aside.querySelector("#card-toc");
    if (!toc) return;

    let origin = aside.querySelector("[data-article-toc-origin]");
    if (!origin) {
      origin = document.createElement("span");
      origin.hidden = true;
      origin.dataset.articleTocOrigin = "";
      toc.insertAdjacentElement("beforebegin", origin);
    }

    const outline = document.createElement("aside");
    outline.className = "article-outline-panel";
    outline.setAttribute("aria-label", "文章目录");

    const sticky = document.createElement("div");
    sticky.className = "article-outline-sticky";
    sticky.append(toc);
    outline.append(sticky);

    layout.prepend(outline);
    layout.classList.add("reading-three-column");
  };

  let resizeTimer;
  const scheduleMount = () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(mountToc, 80);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountToc);
  } else {
    mountToc();
  }

  window.addEventListener("resize", scheduleMount, { passive: true });
  document.addEventListener("pjax:complete", mountToc);
})();
