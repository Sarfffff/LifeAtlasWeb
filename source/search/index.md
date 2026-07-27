---
title: 搜索
date: 2026-06-27 06:10:00
type: search
---

<div class="search-workbench" data-search-page>
  <section class="media-hero search-hero">
    <p class="media-kicker">Search</p>
    <h2>文章搜索</h2>
    <p>按标题、分类、标签和正文摘要快速定位笔记。结果卡片支持缩放，适合在长列表中快速扫读。</p>
    <div class="search-mainbar">
      <i class="fas fa-magnifying-glass"></i>
      <input id="portfolio-search-input" type="search" placeholder="搜索 Unity、算法、面试题、热更新..." autocomplete="off">
      <button id="portfolio-search-clear" type="button">清空</button>
    </div>
    <div class="search-tools">
      <label>
        <span>缩放</span>
        <input id="portfolio-search-zoom" type="range" min="86" max="124" value="100">
      </label>
      <div class="search-mode-tabs" role="tablist">
        <button type="button" class="active" data-density="comfortable">舒展</button>
        <button type="button" data-density="compact">紧凑</button>
      </div>
    </div>
  </section>

  <section class="search-filter-panel">
    <div>
      <span>分类</span>
      <div id="portfolio-search-categories" class="search-chip-row"></div>
    </div>
    <div class="search-count" id="portfolio-search-count">正在载入...</div>
  </section>

  <section id="portfolio-search-results" class="search-result-grid"></section>
</div>
