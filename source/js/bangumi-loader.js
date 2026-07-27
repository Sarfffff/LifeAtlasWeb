(function () {
  const LOCAL_DATA = "/bangumi.json?v=20260628c";
  const BILI_UID = "438242508";
  const PAGE_SIZE = 20;

  const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));

  const normalizeStatus = (value) => {
    const text = String(value || "").toLowerCase();
    if (["watched", "看过", "已看", "完成"].some((word) => text.includes(word))) return "watched";
    if (["planned", "想看", "计划", "追漫"].some((word) => text.includes(word))) return "planned";
    return "watching";
  };

  const statusText = (status) => ({
    watching: "正在追",
    watched: "已看过",
    planned: "想看"
  }[status] || "追番");

  const toBiliUrl = (item) => {
    if (item.url) return item.url;
    if (item.season_id) return `https://www.bilibili.com/bangumi/play/ss${item.season_id}`;
    if (item.media_id) return `https://www.bilibili.com/bangumi/media/md${item.media_id}`;
    return `https://space.bilibili.com/${BILI_UID}/bangumi`;
  };

  const normalizeBiliStatus = (item) => {
    if (item.follow_status === 2) return "watched";
    if (item.follow_status === 1) return "planned";
    return "watching";
  };

  const mapBiliItem = (item, group) => ({
    title: item.title || item.season_title || item.name || "未命名条目",
    status: normalizeBiliStatus(item),
    type: item.season_type_name || group || item.badge || "番剧",
    group: group || "追番",
    progress: item.progress || item.new_ep?.index_show || item.index_show || item.follow_status_name || "查看详情",
    cover: item.cover || item.square_cover || "",
    url: toBiliUrl(item),
    desc: item.evaluate || item.subtitle || item.new_ep?.long_title || ""
  });

  const fetchBiliPage = async (uid, type, page) => {
    const api = `https://api.bilibili.com/x/space/bangumi/follow/list?type=${type}&vmid=${encodeURIComponent(uid)}&pn=${page}&ps=${PAGE_SIZE}`;
    const response = await fetch(api, { credentials: "omit", cache: "no-store" });
    if (!response.ok) throw new Error("B站公开追番接口请求失败");
    const data = await response.json();
    if (data.code !== 0) throw new Error(data.message || "B站公开追番接口不可用");
    return data.data || {};
  };

  const fetchBiliType = async (uid, type, group) => {
    const first = await fetchBiliPage(uid, type, 1);
    const total = Number(first.total || first.list?.length || 0);
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const list = [...(first.list || [])];

    for (let page = 2; page <= pages; page += 1) {
      const data = await fetchBiliPage(uid, type, page);
      list.push(...(data.list || []));
    }

    return list.map((item) => mapBiliItem(item, group));
  };

  const fetchBili = async (uid) => {
    const [bangumi, cinema] = await Promise.all([
      fetchBiliType(uid, 1, "追番"),
      fetchBiliType(uid, 2, "影视")
    ]);
    return [...bangumi, ...cinema];
  };

  const fetchLocal = async () => {
    const response = await fetch(LOCAL_DATA, { cache: "no-store" });
    if (!response.ok) throw new Error("站内追番数据读取失败");
    const data = await response.json();
    return [...(data.items || []), ...(data.mangaItems || [])].map((item) => ({
      ...item,
      status: normalizeStatus(item.status),
      url: item.url || `https://space.bilibili.com/${BILI_UID}/bangumi`
    }));
  };

  const mergeMangaFallback = async (items) => {
    try {
      const local = await fetchLocal();
      const manga = local.filter((item) => item.group === "追漫" || item.type === "追漫");
      return [...items, ...manga];
    } catch (error) {
      return items;
    }
  };

  const render = (items, filter) => {
    const list = document.getElementById("bangumi-list");
    if (!list) return;

    const filtered = filter === "all" ? items : items.filter((item) => item.status === filter);
    if (!filtered.length) {
      list.innerHTML = `
        <article class="bangumi-card bangumi-empty">
          <div class="bangumi-cover"></div>
          <div>
            <span>Empty</span>
            <h4>暂无匹配条目</h4>
            <p>可以切换筛选，或在 bangumi.json 中补充追番、追漫条目。</p>
          </div>
        </article>
      `;
      return;
    }

    list.innerHTML = filtered.map((item) => `
      <article class="bangumi-card" data-status="${escapeHtml(item.status)}">
        <a class="bangumi-cover" href="${escapeHtml(item.url)}" target="_blank" rel="noopener" style="--bangumi-cover: url('${escapeHtml(item.cover || "/img/bangumi-fallback.svg")}')"></a>
        <div>
          <span>${escapeHtml(statusText(item.status))} · ${escapeHtml(item.group || item.type || "番剧")}</span>
          <h4>${escapeHtml(item.title)}</h4>
          <p>${escapeHtml(item.progress || item.desc || "点击查看详情")}</p>
          <a class="bangumi-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">跳转观看</a>
        </div>
      </article>
    `).join("");
  };

  const initBangumi = async () => {
    const root = document.querySelector("[data-bangumi-page]");
    if (!root) return;

    const uid = root.dataset.bilibiliUid || BILI_UID;
    const label = document.getElementById("bangumi-source-label");
    const desc = document.getElementById("bangumi-source-desc");
    let items = [];

    try {
      items = await mergeMangaFallback(await fetchBili(uid));
      if (label) label.textContent = "B站公开追番同步";
      if (desc) desc.textContent = "已从 B站公开接口读取追番和影视列表；追漫接口需要登录态，当前保留为跳转入口。";
    } catch (error) {
      items = await fetchLocal();
      if (label) label.textContent = "站内追番/追漫数据";
      if (desc) desc.textContent = `${error.message}。当前显示 bangumi.json 中维护的条目。`;
    }

    let filter = "all";
    render(items, filter);

    root.querySelectorAll("[data-bangumi-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        filter = button.dataset.bangumiFilter;
        root.querySelectorAll("[data-bangumi-filter]").forEach((item) => item.classList.toggle("active", item === button));
        render(items, filter);
      });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBangumi);
  } else {
    initBangumi();
  }
  document.addEventListener("pjax:complete", initBangumi);
})();
