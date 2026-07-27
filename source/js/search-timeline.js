(function () {
  const DATA_URL = "/search-data.json?v=20260706c";
  let postsCache = null;

  const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));

  const normalize = (value) => String(value || "").toLowerCase().trim();

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const loadPosts = async () => {
    if (postsCache) return postsCache;
    const response = await fetch(DATA_URL, { cache: "no-store" });
    postsCache = await response.json();
    return postsCache;
  };

  const matchPost = (post, query, category) => {
    const inCategory = !category || category === "全部" || post.category === category;
    if (!inCategory) return false;
    if (!query) return true;
    const haystack = normalize([
      post.title,
      post.category,
      (post.tags || []).join(" "),
      post.excerpt
    ].join(" "));
    return query.split(/\s+/).every((word) => haystack.includes(word));
  };

  const renderResults = (posts, state) => {
    const list = document.getElementById("portfolio-search-results");
    const count = document.getElementById("portfolio-search-count");
    if (!list || !count) return;

    const query = normalize(state.query);
    const filtered = posts.filter((post) => matchPost(post, query, state.category));
    list.style.setProperty("--result-scale", String(state.zoom / 100));
    list.classList.toggle("compact", state.density === "compact");
    count.textContent = `找到 ${filtered.length} 篇文章`;

    if (!filtered.length) {
      list.innerHTML = '<article class="search-result-card"><h3>没有匹配结果</h3><p>换一个关键词，或者切换到“全部”分类再试。</p></article>';
      return;
    }

    list.innerHTML = filtered.slice(0, 80).map((post) => `
      <article class="search-result-card">
        <h3><a href="${post.url}">${escapeHtml(post.title)}</a></h3>
        <div class="search-result-meta">
          <span><i class="far fa-calendar-alt"></i> ${formatDate(post.date)}</span>
          <span><i class="fas fa-folder"></i> ${escapeHtml(post.category || "未分类")}</span>
        </div>
        <p>${escapeHtml(post.excerpt || "这篇文章暂时没有摘要。")}</p>
      </article>
    `).join("");
  };

  const initSearchPage = async () => {
    const root = document.querySelector("[data-search-page]");
    if (!root) return;

    const posts = await loadPosts();
    const params = new URLSearchParams(window.location.search);
    const state = {
      query: params.get("q") || "",
      category: "全部",
      zoom: 100,
      density: "comfortable"
    };

    const input = document.getElementById("portfolio-search-input");
    const clear = document.getElementById("portfolio-search-clear");
    const zoom = document.getElementById("portfolio-search-zoom");
    const chips = document.getElementById("portfolio-search-categories");
    const categories = ["全部", ...Array.from(new Set(posts.map((post) => post.category || "未分类"))).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"))];

    input.value = state.query;
    chips.innerHTML = categories.map((category) => `<button type="button" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("");

    const syncChips = () => {
      chips.querySelectorAll("button").forEach((button) => {
        button.classList.toggle("active", button.dataset.category === state.category);
      });
    };

    input.addEventListener("input", () => {
      state.query = input.value;
      renderResults(posts, state);
    });

    clear.addEventListener("click", () => {
      input.value = "";
      state.query = "";
      input.focus();
      renderResults(posts, state);
    });

    zoom.addEventListener("input", () => {
      state.zoom = Number(zoom.value);
      renderResults(posts, state);
    });

    document.querySelectorAll("[data-density]").forEach((button) => {
      button.addEventListener("click", () => {
        state.density = button.dataset.density;
        document.querySelectorAll("[data-density]").forEach((item) => item.classList.toggle("active", item === button));
        renderResults(posts, state);
      });
    });

    chips.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-category]");
      if (!button) return;
      state.category = button.dataset.category;
      syncChips();
      renderResults(posts, state);
    });

    syncChips();
    renderResults(posts, state);
  };

  const initNavSearch = () => {
    const nav = document.querySelector("#nav");
    const blogInfo = document.querySelector("#nav #blog-info");
    if (!nav || !blogInfo || nav.querySelector(".nav-search-form")) return;

    const form = document.createElement("form");
    form.className = "nav-search-form";
    form.action = "/search/";
    form.setAttribute("role", "search");
    form.innerHTML = `
      <i class="fas fa-magnifying-glass" aria-hidden="true"></i>
      <input type="search" name="q" placeholder="搜索笔记" autocomplete="off" aria-label="搜索笔记">
    `;

    const params = new URLSearchParams(window.location.search);
    const input = form.querySelector("input");
    if (window.location.pathname.replace(/\/+$/, "") === "/search" && params.get("q")) {
      input.value = params.get("q");
    }

    const goSearch = () => {
      const query = input.value.trim();
      window.location.href = query ? `/search/?q=${encodeURIComponent(query)}` : "/search/";
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      goSearch();
    });

    input.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      goSearch();
    });

    form.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 768px)").matches) {
        window.location.href = "/search/";
      }
    });

    blogInfo.insertAdjacentElement("afterend", form);
  };

  const initArticleLinkFallback = () => {
    if (document.documentElement.dataset.articleLinkFallbackReady) return;
    document.documentElement.dataset.articleLinkFallbackReady = "true";

    document.addEventListener("click", (event) => {
      const link = event.target.closest([
        "#recent-posts .article-title",
        ".search-result-card h3 a",
        ".note-card a",
        ".timeline-card a",
        "#aside-content .card-recent-post a.title"
      ].join(","));
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || link.target === "_blank") return;
      event.preventDefault();
      window.location.href = href;
    }, true);
  };

  const initEmptyArticleNotice = () => {
    const article = document.getElementById("article-container");
    if (!article || article.dataset.emptyNoticeReady) return;
    article.dataset.emptyNoticeReady = "true";

    const hasMeaningfulContent = article.textContent.trim() || article.querySelector("img, video, iframe, table, pre, figure");
    if (hasMeaningfulContent) return;

    const title = document.querySelector(".post-title")?.textContent.trim() || "这篇笔记";
    article.innerHTML = `
      <section class="empty-note-notice">
        <h2>${escapeHtml(title)}：内容待补充</h2>
        <p>这篇笔记的标题、分类和标签已经导入，但原始正文为空。后续补齐 Markdown 源文件后，这里会自动显示完整内容。</p>
      </section>
    `;
  };

  const initHomeSearch = () => {
    const recent = document.querySelector("#recent-posts .recent-post-items");
    if (!recent || document.querySelector(".home-search-panel")) return;

    const panel = document.createElement("section");
    panel.className = "home-search-panel";
    panel.innerHTML = `
      <div class="home-search-box">
        <i class="fas fa-magnifying-glass"></i>
        <input type="search" placeholder="在首页文章中搜索，回车进入完整搜索页" autocomplete="off">
      </div>
      <p class="home-search-hint">输入关键词会先过滤当前首页文章，按回车可进入完整搜索页。</p>
    `;
    recent.parentNode.insertBefore(panel, recent);

    const input = panel.querySelector("input");
    const cards = Array.from(recent.querySelectorAll(".recent-post-item"));
    input.addEventListener("input", () => {
      const query = normalize(input.value);
      cards.forEach((card) => {
        card.classList.toggle("search-hidden", query && !normalize(card.textContent).includes(query));
      });
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const q = encodeURIComponent(input.value.trim());
        window.location.href = q ? `/search/?q=${q}` : "/search/";
      }
    });
  };

  const initTimelinePage = async () => {
    const root = document.querySelector("[data-timeline-page]");
    const list = document.getElementById("portfolio-timeline");
    if (!root || !list) return;

    const posts = (await loadPosts()).slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    const total = document.getElementById("timeline-total");
    if (total) total.textContent = `文章总览 - ${posts.length}`;

    const groups = new Map();
    posts.forEach((post) => {
      const date = formatDate(post.date);
      const year = date.slice(0, 4) || "未记录";
      if (!groups.has(year)) groups.set(year, []);
      groups.get(year).push(post);
    });

    let index = 0;
    list.innerHTML = Array.from(groups.entries()).map(([year, items]) => `
      <h3 class="timeline-year">${year}</h3>
      ${items.map((post) => {
        const delay = Math.min(index++ * 28, 760);
        return `
          <article class="timeline-entry" style="--delay:${delay}ms">
            <div class="timeline-date"><i class="far fa-calendar-alt"></i> ${formatDate(post.date)}</div>
            <div class="timeline-card">
              <a href="${post.url}">${escapeHtml(post.title)}</a>
              <p>${escapeHtml(post.category || "未分类")} · ${escapeHtml((post.excerpt || "").slice(0, 96))}</p>
            </div>
          </article>
        `;
      }).join("")}
    `).join("");
  };

  const initNotesLibrary = () => {
    const root = document.querySelector(".notes-library");
    if (!root || document.querySelector(".notes-control-panel")) return;

    const categories = Array.from(root.querySelectorAll(".notes-category"));
    if (!categories.length) return;

    const panel = document.createElement("section");
    panel.className = "notes-control-panel";
    panel.innerHTML = `
      <div class="notes-control-head">
        <span>Notes Library</span>
        <strong>折叠式知识库</strong>
      </div>
      <div class="notes-control-search">
        <i class="fas fa-magnifying-glass"></i>
        <input type="search" placeholder="搜索标题或来源，例如 Unity、算法、面试、Shader..." autocomplete="off">
      </div>
      <div class="notes-category-rail"></div>
      <div class="notes-control-actions">
        <div>
          <button type="button" data-notes-action="expand">展开全部</button>
          <button type="button" data-notes-action="collapse">收起全部</button>
        </div>
        <span class="notes-control-count"></span>
      </div>
    `;

    const hero = root.querySelector(".media-hero");
    if (hero && hero.nextSibling) {
      root.insertBefore(panel, hero.nextSibling);
    } else {
      root.insertBefore(panel, root.firstChild);
    }

    const input = panel.querySelector("input");
    const count = panel.querySelector(".notes-control-count");
    const rail = panel.querySelector(".notes-category-rail");
    const cards = Array.from(root.querySelectorAll(".note-card"));

    categories.forEach((category, index) => {
      const title = category.querySelector("h2");
      const categoryCards = Array.from(category.querySelectorAll(".note-card"));
      title.dataset.count = `${categoryCards.length} 篇`;
      category.id = category.id || `notes-category-${index}`;
      category.classList.toggle("open", index === 0);
      category.classList.toggle("collapsed", index !== 0);
      title.addEventListener("click", () => {
        category.classList.toggle("collapsed");
        category.classList.toggle("open", !category.classList.contains("collapsed"));
      });
    });

    rail.innerHTML = categories.map((category, index) => {
      const title = category.querySelector("h2")?.textContent.trim() || `分类 ${index + 1}`;
      const size = category.querySelectorAll(".note-card").length;
      return `<button type="button" data-category-index="${index}">${escapeHtml(title)}<span>${size}</span></button>`;
    }).join("");

    const setAll = (open) => {
      categories.forEach((category) => {
        category.classList.toggle("collapsed", !open);
        category.classList.toggle("open", open);
      });
    };

    const applyFilter = () => {
      const query = normalize(input.value);
      let visible = 0;
      categories.forEach((category) => {
        let categoryVisible = 0;
        category.querySelectorAll(".note-card").forEach((card) => {
          const matched = !query || normalize(card.textContent).includes(query);
          card.classList.toggle("search-hidden", !matched);
          if (matched) {
            visible += 1;
            categoryVisible += 1;
          }
        });
        category.classList.toggle("search-empty", categoryVisible === 0);
        if (query && categoryVisible > 0) {
          category.classList.remove("collapsed");
          category.classList.add("open");
        }
      });
      count.textContent = query ? `找到 ${visible} 篇` : `共 ${cards.length} 篇`;
    };

    panel.addEventListener("click", (event) => {
      const button = event.target.closest("[data-notes-action]");
      const categoryButton = event.target.closest("[data-category-index]");
      if (button) {
        setAll(button.dataset.notesAction === "expand");
        return;
      }
      if (categoryButton) {
        const category = categories[Number(categoryButton.dataset.categoryIndex)];
        if (!category) return;
        setAll(false);
        category.classList.remove("collapsed");
        category.classList.add("open");
        category.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    input.addEventListener("input", applyFilter);
    applyFilter();
  };

  const initProfessionalAside = () => {
    const cardInfo = document.querySelector("#aside-content .card-info");
    if (!cardInfo || document.querySelector(".card-dev-focus")) return;

    const card = document.createElement("div");
    card.className = "card-widget card-dev-focus";
    card.innerHTML = `
      <div class="item-headline"><i class="fas fa-code"></i><span>开发方向</span></div>
      <div class="dev-focus-list">
        <div><span>当前方向</span><strong>Unity 客户端 / C# / 移动端</strong></div>
        <div><span>内容重点</span><strong>项目复盘、面试笔记、工具链</strong></div>
        <div><span>近期状态</span><strong>整理作品集与岁迹记录</strong></div>
      </div>
      <div class="dev-stack-row">
        <b>Unity</b><b>C#</b><b>UGUI</b><b>FSM</b><b>Android</b>
      </div>
    `;
    cardInfo.insertAdjacentElement("afterend", card);
  };

  const weatherText = (code) => {
    const map = {
      0: "晴",
      1: "少云",
      2: "多云",
      3: "阴",
      45: "雾",
      48: "雾",
      51: "小雨",
      53: "小雨",
      55: "中雨",
      61: "小雨",
      63: "中雨",
      65: "大雨",
      80: "阵雨",
      81: "阵雨",
      82: "强阵雨",
      95: "雷雨"
    };
    return map[code] || "多云";
  };

  const initDesktopWidget = () => {
    const announcement = document.querySelector("#aside-content .card-announcement");
    if (!announcement || document.querySelector(".desktop-widget")) return;

    const widget = document.createElement("aside");
    widget.className = "desktop-widget aside-weather-widget card-widget";
    widget.innerHTML = `
      <div class="desktop-widget-top">
        <span data-widget-date></span>
        <span class="weather-status"><i class="fas fa-cloud-sun"></i> <b data-widget-weather>多云</b></span>
        <span><b data-widget-temp>--</b>°C</span>
        <span><i class="fas fa-droplet"></i> <b data-widget-humidity>--</b>%</span>
      </div>
      <div class="desktop-widget-time" data-widget-time>--:--:--</div>
      <div class="desktop-widget-bottom">
        <span><i class="fas fa-location-arrow"></i> 武汉</span>
        <span>湖北省</span>
        <span data-widget-period>AM</span>
      </div>
    `;
    announcement.insertAdjacentElement("afterend", widget);

    const dateEl = widget.querySelector("[data-widget-date]");
    const timeEl = widget.querySelector("[data-widget-time]");
    const periodEl = widget.querySelector("[data-widget-period]");
    const weatherEl = widget.querySelector("[data-widget-weather]");
    const tempEl = widget.querySelector("[data-widget-temp]");
    const humidityEl = widget.querySelector("[data-widget-humidity]");

    const syncTime = () => {
      const now = new Date();
      const weekday = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][now.getDay()];
      dateEl.textContent = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${weekday}`;
      timeEl.textContent = now.toLocaleTimeString("zh-CN", { hour12: false });
      periodEl.textContent = now.getHours() < 12 ? "AM" : "PM";
    };

    const syncWeather = async () => {
      try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=30.59&longitude=114.30&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia%2FShanghai", { cache: "no-store" });
        if (!response.ok) throw new Error("weather request failed");
        const data = await response.json();
        const current = data.current || {};
        weatherEl.textContent = weatherText(current.weather_code);
        tempEl.textContent = Math.round(current.temperature_2m);
        humidityEl.textContent = Math.round(current.relative_humidity_2m);
      } catch (error) {
        weatherEl.textContent = "多云";
        tempEl.textContent = "35";
        humidityEl.textContent = "47";
      }
    };

    syncTime();
    syncWeather();
    let timer = window.setInterval(syncTime, 1000);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.clearInterval(timer);
      } else {
        syncTime();
        timer = window.setInterval(syncTime, 1000);
      }
    });
  };

  const boot = () => {
    initNavSearch();
    initArticleLinkFallback();
    initHomeSearch();
    initSearchPage();
    initTimelinePage();
    initNotesLibrary();
    initProfessionalAside();
    initDesktopWidget();
    initEmptyArticleNotice();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  document.addEventListener("pjax:complete", boot);
})();
