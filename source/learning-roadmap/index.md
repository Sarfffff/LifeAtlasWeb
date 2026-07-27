---
title: 学习路线
date: 2026-07-19 20:00:00
type: learning-roadmap
comments: false
aside: true
---

<style>
.learning-roadmap-page{--accent:#39c5bb;--ink:#172235;--muted:#657086;display:grid;gap:24px}
.roadmap-hero,.roadmap-track,.roadmap-method{padding:clamp(28px,4vw,52px);border:1px solid rgba(125,143,165,.2);border-radius:8px;background:rgba(255,255,255,.92);box-shadow:0 18px 48px rgba(20,32,50,.08);backdrop-filter:blur(16px)}
.roadmap-hero{color:#fff;background:linear-gradient(105deg,rgba(11,21,38,.98),rgba(18,65,68,.9))}
.roadmap-kicker,.track-heading p{margin:0 0 8px;color:var(--accent);font-size:12px;font-weight:800}
.roadmap-hero h2{margin:0;color:#fff;font-size:clamp(30px,4vw,52px)}
.roadmap-hero>p:not(.roadmap-kicker){max-width:720px;margin:18px 0 28px;color:rgba(255,255,255,.74);line-height:1.9}
.roadmap-summary{display:flex;gap:42px}.roadmap-summary div{display:grid;gap:2px}.roadmap-summary strong{color:#fff;font-size:26px}.roadmap-summary span{color:rgba(255,255,255,.6);font-size:13px}
.roadmap-tabs{position:sticky;z-index:5;top:76px;display:grid;grid-template-columns:repeat(4,1fr);overflow:hidden;border:1px solid rgba(125,143,165,.2);border-radius:8px;background:rgba(255,255,255,.95);box-shadow:0 10px 30px rgba(20,32,50,.08);backdrop-filter:blur(14px)}
.roadmap-tabs a{padding:16px 10px;color:var(--ink);text-align:center;transition:.2s}.roadmap-tabs a+a{border-left:1px solid rgba(125,143,165,.16)}.roadmap-tabs a:hover{color:#fff;background:#172235}.roadmap-tabs i{margin-right:7px;color:var(--accent)}
.roadmap-track{scroll-margin-top:150px}.track-heading{display:flex;gap:22px;margin-bottom:28px}.track-index{color:var(--accent);font-size:42px;font-weight:800;line-height:1}.track-heading h3,.roadmap-method h3{margin:0 0 8px;color:var(--ink);font-size:27px}.track-heading div>span{color:var(--muted)}
.stage-grid,.project-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.stage-grid article,.project-grid article{min-height:220px;padding:24px;border:1px solid rgba(125,143,165,.2);border-radius:6px;background:#f7f9fb;transition:.2s}.stage-grid article:hover,.project-grid article:hover{transform:translateY(-4px);border-color:rgba(57,197,187,.55);box-shadow:0 14px 32px rgba(20,32,50,.09)}
.stage-grid b,.project-grid article>span{color:#0e8f88;font-size:12px}.stage-grid h4,.project-grid h4{margin:12px 0 10px;color:var(--ink);font-size:19px}.stage-grid p,.project-grid p{color:var(--muted);font-size:14px;line-height:1.8}.stage-grid small{display:block;margin-top:16px;color:#334158;font-weight:600}
.roadmap-link,.project-grid a{display:inline-flex;align-items:center;gap:9px;margin-top:24px;color:#0e8f88;font-weight:700}.project-grid a{margin-top:10px}
.roadmap-method>div{display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1fr;align-items:center;gap:12px;margin-top:26px}.roadmap-method span{display:flex;align-items:center;gap:10px;color:var(--ink);font-weight:700}.roadmap-method b{color:var(--accent);font-size:20px}.roadmap-method i{color:#a9b2c0}
[data-theme=dark] .learning-roadmap-page{--ink:#edf4ff;--muted:#a8b5c7}[data-theme=dark] .roadmap-track,[data-theme=dark] .roadmap-method,[data-theme=dark] .roadmap-tabs{border-color:rgba(255,255,255,.1);background:rgba(20,27,40,.94)}[data-theme=dark] .stage-grid article,[data-theme=dark] .project-grid article{border-color:rgba(255,255,255,.1);background:#192233}[data-theme=dark] .stage-grid small{color:#d4deeb}
@media(max-width:900px){.stage-grid,.project-grid{grid-template-columns:1fr}.stage-grid article,.project-grid article{min-height:auto}.roadmap-method>div{grid-template-columns:1fr}.roadmap-method i{transform:rotate(90deg);justify-self:center}}
@media(max-width:640px){.roadmap-summary{gap:22px}.roadmap-tabs{top:60px;grid-template-columns:repeat(2,1fr)}.roadmap-tabs a:nth-child(3){border-left:0}.track-heading{gap:14px}.track-index{font-size:30px}}
</style>

<div class="learning-roadmap-page">
  <section class="roadmap-hero">
    <p class="roadmap-kicker">GAME CLIENT ROADMAP</p>
    <h2>游戏客户端开发学习路线</h2>
    <p>把算法、Unity、Unreal Engine 和项目实战整理成可执行的阶段计划。这里仅记录学习方向与成果，不提供第三方课程文件下载。</p>
    <div class="roadmap-summary">
      <div><strong>4</strong><span>学习方向</span></div>
      <div><strong>12</strong><span>核心阶段</span></div>
      <div><strong>2+</strong><span>完整项目</span></div>
    </div>
  </section>

  <nav class="roadmap-tabs" aria-label="学习路线快速导航">
    <a href="#algorithm"><i class="fas fa-code"></i>算法基础</a>
    <a href="#unity"><i class="fab fa-unity"></i>Unity</a>
    <a href="#unreal"><i class="fas fa-cube"></i>UE5</a>
    <a href="#practice"><i class="fas fa-gamepad"></i>项目实战</a>
  </nav>

  <section class="roadmap-track" id="algorithm">
    <div class="track-heading"><span class="track-index">01</span><div><p>FOUNDATION</p><h3>算法与数据结构</h3><span>建立分析复杂度、拆解问题和编写可靠代码的基础能力。</span></div></div>
    <div class="stage-grid">
      <article><b>阶段一</b><h4>数据结构基础</h4><p>数组、链表、栈、队列、哈希表、树与图，掌握常见操作及其复杂度。</p><small>产出：手写核心结构与测试用例</small></article>
      <article><b>阶段二</b><h4>常用算法模型</h4><p>排序、二分、递归、贪心、回溯、动态规划，以及 BFS、DFS 等搜索方法。</p><small>产出：按题型整理模板与错题复盘</small></article>
      <article><b>阶段三</b><h4>工程中的算法</h4><p>把寻路、状态搜索、资源调度和空间划分应用到游戏客户端场景中。</p><small>产出：A* 寻路或地图生成演示</small></article>
    </div>
    <a class="roadmap-link" href="/notes-import-summary.html">查看算法笔记 <i class="fas fa-arrow-right"></i></a>
  </section>

  <section class="roadmap-track" id="unity">
    <div class="track-heading"><span class="track-index">02</span><div><p>PRIMARY STACK</p><h3>Unity 客户端开发</h3><span>从 C# 与引擎基础，逐步进入系统设计、性能优化和移动端发布。</span></div></div>
    <div class="stage-grid">
      <article><b>阶段一</b><h4>C# 与 Unity 基础</h4><p>组件生命周期、输入、物理、动画、UI、协程与异步，形成稳定的编码习惯。</p><small>产出：可交互的小型玩法原型</small></article>
      <article><b>阶段二</b><h4>客户端系统设计</h4><p>状态机、事件系统、对象池、背包、存档、场景管理和数据驱动配置。</p><small>产出：可复用的系统模块</small></article>
      <article><b>阶段三</b><h4>性能与发布</h4><p>Profiler、GC、Draw Call、资源加载、安卓构建、适配与线上问题定位。</p><small>产出：移动端安装包与性能报告</small></article>
    </div>
    <a class="roadmap-link" href="/notes-import-summary.html">查看 Unity 笔记 <i class="fas fa-arrow-right"></i></a>
  </section>

  <section class="roadmap-track" id="unreal">
    <div class="track-heading"><span class="track-index">03</span><div><p>ENGINE EXPANSION</p><h3>Unreal Engine 5</h3><span>以 C++ 为支点，理解 UE 的对象体系、玩法框架与资源工作流。</span></div></div>
    <div class="stage-grid">
      <article><b>阶段一</b><h4>编辑器与蓝图</h4><p>熟悉关卡、Actor、组件、输入系统、蓝图通信和常见调试工具。</p><small>产出：蓝图交互场景</small></article>
      <article><b>阶段二</b><h4>UE C++ 编程</h4><p>反射宏、UObject、Actor 生命周期、委托、接口和 C++ 与蓝图协作。</p><small>产出：C++ 玩法组件</small></article>
      <article><b>阶段三</b><h4>完整玩法框架</h4><p>GameMode、Controller、Character、动画系统、AI、UI 与资源管理。</p><small>产出：第三人称玩法原型</small></article>
    </div>
    <a class="roadmap-link" href="/notes-import-summary.html">查看 UE 与 C++ 笔记 <i class="fas fa-arrow-right"></i></a>
  </section>

  <section class="roadmap-track" id="practice">
    <div class="track-heading"><span class="track-index">04</span><div><p>SHIP SOMETHING</p><h3>项目实战与复盘</h3><span>把零散知识转化为可展示、可解释的工程能力。</span></div></div>
    <div class="project-grid">
      <article><span>移动端休闲玩法</span><h4>Cross Road</h4><p>练习无限地图、障碍生成、对象池、排行榜与移动端适配。</p><a href="https://gitee.com/TaiDeng1/cross-road" target="_blank" rel="noopener">查看项目</a></article>
      <article><span>横版动作 RPG</span><h4>2D RPG Game</h4><p>练习角色状态机、战斗反馈、物品系统、相机与数据驱动架构。</p><a href="https://github.com/Sarfffff/2D-RPG-Game" target="_blank" rel="noopener">查看项目</a></article>
      <article><span>综合能力验证</span><h4>下一份可发布作品</h4><p>补齐需求拆解、版本管理、测试、性能数据、演示视频和技术复盘。</p><a href="/projects/">浏览项目档案</a></article>
    </div>
  </section>

  <section class="roadmap-method">
    <p class="roadmap-kicker">WORKFLOW</p><h3>建议的学习循环</h3>
    <div><span><b>01</b>学习一个概念</span><i class="fas fa-chevron-right"></i><span><b>02</b>写最小示例</span><i class="fas fa-chevron-right"></i><span><b>03</b>放进项目验证</span><i class="fas fa-chevron-right"></i><span><b>04</b>整理笔记复盘</span></div>
  </section>
</div>
