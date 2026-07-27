---
title: 视频
date: 2026-06-27 02:55:00
type: videos
---

<div class="media-page video-hub-page">
  <section class="media-hero">
    <p class="media-kicker">Video / Bangumi</p>
    <h2>视频与 B站追番</h2>
    <p>这里用于展示作品视频、B站主页入口和追番列表。页面会优先尝试读取 B站公开追番数据；如果公开接口不可用，就读取站内 <code>bangumi.json</code>。</p>
  </section>

  <section class="video-player-card">
    <video controls preload="metadata" poster="/img/lifeatlas-bg.png" src="/media/showcase.mp4">
      当前浏览器不支持 video 标签。
    </video>
    <div class="media-info">
      <span>Showcase</span>
      <h3>个人作品 / App 展示视频</h3>
      <p>把视频文件放到 <code>source/media/showcase.mp4</code> 后即可播放。后续也可以替换成项目演示、App 录屏或游戏玩法视频。</p>
      <a class="media-link-btn" href="https://space.bilibili.com/438242508" target="_blank" rel="noopener">前往 B站主页</a>
    </div>
  </section>

  <section class="bangumi-panel" data-bangumi-page data-bilibili-uid="438242508">
    <div class="bangumi-panel-head">
      <div>
        <p class="media-kicker">Bilibili Bangumi</p>
        <h3>我的追番</h3>
        <p>显示番剧名称、封面、追番状态、进度和跳转入口。若你的 B站追番列表不是公开状态，页面会显示本地维护的列表。</p>
      </div>
      <a class="project-secondary-link" href="https://space.bilibili.com/438242508/bangumi" target="_blank" rel="noopener">
        打开 B站追番
      </a>
    </div>

    <div class="bangumi-sync-note">
      <span id="bangumi-source-label">数据源检测中</span>
      <p id="bangumi-source-desc">正在尝试读取公开追番数据。公开接口不可用时，会自动使用站内 bangumi.json。</p>
    </div>

    <div class="bangumi-toolbar">
      <button type="button" data-bangumi-filter="all" class="active">全部</button>
      <button type="button" data-bangumi-filter="watching">正在追</button>
      <button type="button" data-bangumi-filter="watched">已看过</button>
      <button type="button" data-bangumi-filter="planned">想看</button>
    </div>

    <div class="bangumi-grid" id="bangumi-list">
      <article class="bangumi-card bangumi-loading">
        <div class="bangumi-cover"></div>
        <div>
          <span>Loading</span>
          <h4>正在加载追番列表</h4>
          <p>如果 B站公开接口不可用，会自动切换到本地数据。</p>
        </div>
      </article>
    </div>
  </section>
</div>
