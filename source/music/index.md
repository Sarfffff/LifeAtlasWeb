---
title: 音乐
date: 2026-06-27 02:55:00
type: music
aplayer: true
---

<div class="media-page music-cloud-page">
  <section class="media-hero">
    <p class="media-kicker">NetEase Cloud Music</p>
    <h2>网易云音乐</h2>
    <p>已接入你的网易云公开歌单。网页不会登录你的账号，也不会读取私密“我喜欢的音乐”；这种方式更安全，也更适合部署到公开网站。</p>
  </section>

  <section class="media-player-card netease-card">
    <div class="media-cover"></div>
    <div class="media-info">
      <span>APlayer / MetingJS</span>
      <h3>站内歌单播放器</h3>
      <p>歌单 ID：<code>1997863776</code>。默认不自动播放，进入页面后需要用户主动点击播放。</p>
      <meting-js
        server="netease"
        type="playlist"
        id="1997863776"
        mutex="true"
        preload="none"
        list-folded="false"
        list-max-height="360px">
      </meting-js>
    </div>
  </section>

  <section class="netease-iframe-card">
    <div class="media-info">
      <span>Official Outchain</span>
      <h3>网易云官方外链播放器</h3>
      <p>如果站内播放器因为接口或版权限制加载失败，可以使用下面的官方外链播放器作为备用方案。</p>
    </div>
    <iframe
      title="网易云音乐播放器"
      frameborder="no"
      border="0"
      marginwidth="0"
      marginheight="0"
      width="100%"
      height="450"
      src="//music.163.com/outchain/player?type=0&id=1997863776&auto=0&height=430">
    </iframe>
  </section>

  <section class="music-library-panel" data-music-library>
    <div class="bangumi-panel-head">
      <div>
        <p class="media-kicker">Playlist Catalog</p>
        <h3>完整歌单目录</h3>
        <p>播放器可能因为版权、VIP、地区或外链接口限制只显示少量可播放歌曲；这里直接读取公开歌单详情，展示完整目录并跳转到网易云。</p>
      </div>
      <a class="project-secondary-link" href="https://music.163.com/#/playlist?id=1997863776" target="_blank" rel="noopener">打开网易云歌单</a>
    </div>
    <div class="music-library-search">
      <i class="fas fa-magnifying-glass"></i>
      <input id="music-library-input" type="search" placeholder="搜索歌曲、歌手或专辑" autocomplete="off">
      <span id="music-library-count">加载中</span>
    </div>
    <div class="music-track-list" id="music-track-list"></div>
  </section>
</div>
