(function () {
  const DATA_URL = "/music-playlist.json?v=20260628a";
  let tracks = [];

  const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));

  const normalize = (value) => String(value || "").toLowerCase().trim();

  const render = (query) => {
    const list = document.getElementById("music-track-list");
    const count = document.getElementById("music-library-count");
    if (!list || !count) return;

    const words = normalize(query).split(/\s+/).filter(Boolean);
    const filtered = tracks.filter((track) => {
      if (!words.length) return true;
      const haystack = normalize(`${track.name} ${track.artists} ${track.album}`);
      return words.every((word) => haystack.includes(word));
    });

    count.textContent = `${filtered.length} / ${tracks.length} 首`;
    list.innerHTML = filtered.slice(0, 120).map((track, index) => `
      <a class="music-track-item" href="${escapeHtml(track.url)}" target="_blank" rel="noopener">
        <span class="music-track-index">${index + 1}</span>
        <img src="${escapeHtml(track.cover || "/img/lifeatlas-bg.png")}" alt="">
        <span class="music-track-main">
          <strong>${escapeHtml(track.name)}</strong>
          <em>${escapeHtml(track.artists || "未知歌手")}</em>
        </span>
        <span class="music-track-album">${escapeHtml(track.album || "未知专辑")}</span>
      </a>
    `).join("");
  };

  const init = async () => {
    const root = document.querySelector("[data-music-library]");
    if (!root) return;

    const input = document.getElementById("music-library-input");
    const count = document.getElementById("music-library-count");
    const list = document.getElementById("music-track-list");

    try {
      const response = await fetch(DATA_URL, { cache: "no-store" });
      if (!response.ok) throw new Error("playlist data failed");
      const data = await response.json();
      tracks = data.tracks || [];
      render("");
    } catch (error) {
      if (count) count.textContent = "加载失败";
      if (list) {
        list.innerHTML = '<div class="music-track-empty">歌单目录加载失败，请稍后刷新页面。</div>';
      }
    }

    if (input) {
      input.addEventListener("input", () => render(input.value));
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  document.addEventListener("pjax:complete", init);
})();
