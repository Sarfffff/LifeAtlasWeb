---
title: 项目
date: 2026-06-27 02:40:00
type: projects
---

<div class="project-page">
<section class="portfolio-hero">
<div>
<p class="media-kicker">Selected Works</p>
<h2>游戏客户端与个人 App 项目</h2>
<p>这里集中展示 Unity、C#、客户端架构、移动端构建和工具链方向的项目积累。项目说明会优先呈现工程价值：我做了什么、用了什么技术、解决了什么问题。</p>
</div>
<div class="portfolio-hero-stats">
<div><strong>2</strong><span>核心项目</span></div>
<div><strong>Unity</strong><span>主要技术栈</span></div>
<div><strong>Mobile</strong><span>重点平台</span></div>
</div>
</section>

<section class="project-showcase-grid">
<article class="project-showcase-card featured-project">
<div class="project-showcase-cover crossroad-cover"><span class="project-status">Gitee</span></div>
<div class="project-showcase-body">
<div class="project-title-row"><span>Unity / C# / PlayFab / Mobile</span><em>休闲躲避类</em></div>
<h3>Cross Road 移动端休闲游戏</h3>
<p>一款 2D 移动端休闲躲避类游戏，围绕无限场景、障碍生成、得分循环和排行榜构建轻量玩法闭环。</p>
<div class="project-tags"><b>无限地图</b><b>对象池</b><b>排行榜</b><b>移动端适配</b></div>
<div class="project-detail-grid">
<div><h4>负责模块</h4><ul><li>随机道路、车辆和障碍物生成逻辑</li><li>对象池复用，降低频繁创建销毁开销</li><li>移动端输入、分辨率适配和基础 UI 流程</li><li>接入 PlayFab 完成云端排行榜</li></ul></div>
<div><h4>工程难点</h4><ul><li>控制场景生成节奏，避免重复、穿帮和难度断层</li><li>在移动端控制 DrawCall、实例数量和 GC 压力</li><li>处理第三方服务接入、调试和异常兜底</li></ul></div>
</div>
<div class="project-summary-strip">
<span>核心价值</span>
<p>这个项目更偏完整游戏闭环训练，重点体现玩法系统拆分、性能意识和移动端发布经验。</p>
</div>
<div class="project-actions">
<a class="media-link-btn" href="https://gitee.com/TaiDeng1/cross-road.git" target="_blank" rel="noopener">查看 Gitee 仓库</a>
<a class="project-secondary-link" href="/notes-import-summary.html">查看相关笔记</a>
</div>
</div>
</article>

<article class="project-showcase-card featured-project">
<div class="project-showcase-cover rpg-cover"><span class="project-status">GitHub</span></div>
<div class="project-showcase-body">
<div class="project-title-row"><span>Unity / C# / FSM / Cinemachine</span><em>横版动作 RPG</em></div>
<h3>2D 类银河恶魔城</h3>
<p>一款 2D 横版动作 RPG，重点练习角色控制、战斗状态切换、物品系统、相机跟随和 UI 数据流组织。</p>
<div class="project-tags"><b>有限状态机</b><b>ScriptableObject</b><b>Cinemachine</b><b>背包 UI</b></div>
<div class="project-detail-grid">
<div><h4>负责模块</h4><ul><li>拆分角色移动、攻击、受击、跳跃等状态</li><li>使用 ScriptableObject 管理物品和配置数据</li><li>搭建相机跟随、场景切换和基础战斗反馈</li><li>整理 UI、事件和角色数据之间的通信方式</li></ul></div>
<div><h4>工程难点</h4><ul><li>避免角色控制逻辑堆积，使用状态机保持行为清晰</li><li>让数据配置和表现逻辑分离，便于扩展物品、技能和敌人</li><li>减少模块之间的强引用，保留后续迭代空间</li></ul></div>
</div>
<div class="project-summary-strip">
<span>核心价值</span>
<p>这个项目更偏客户端架构训练，重点体现状态机、数据驱动、模块解耦和战斗反馈组织能力。</p>
</div>
<div class="project-actions">
<a class="media-link-btn" href="https://github.com/Sarfffff/2D-RPG-Game.git" target="_blank" rel="noopener">查看 GitHub 仓库</a>
<a class="project-secondary-link" href="/timeline/">查看开发时间轴</a>
</div>
</div>
</article>
</section>

<section class="project-roadmap">
<p class="media-kicker">Next</p>
<h3>后续补充计划</h3>
<div class="roadmap-grid">
<div><strong>演示视频</strong><span>补充核心玩法录屏、操作流程和发布包预览。</span></div>
<div><strong>技术复盘</strong><span>沉淀性能优化、架构拆分、构建发布和踩坑记录。</span></div>
<div><strong>岁迹</strong><span>备案完成后补充个人 App 的产品说明和开发日志。</span></div>
</div>
</section>
</div>
