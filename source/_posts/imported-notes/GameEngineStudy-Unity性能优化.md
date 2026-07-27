---
title: Unity性能优化
date: 2026-06-27 03:46:00
categories:
  - 图形与引擎
tags:
  - GameEngineStudy
  - 笔记
---
# 性能工具

**性能问题本质是什么？**

- CPU忙不过来：脚本逻辑、物理、动画、AI、UI计算太多
- GPU画不过来：画面太复杂、透明太多、Shader太重、阴影后处理太狠
- 内存/GC：突然卡一下（尤其是移动端）
- 加载/IO：进场景、切关卡、打开界面时卡

Profile就是来说明是那个部分在拖后腿

### Profiler

Unity 中有两种 Profiler：普通 Profiler 和 Profiler（Standalone Process）。两者的界面和功能基本一致，区别在于普通 Profiler 运行在 Unity Editor 进程内，会对性能产生一定额外开销，可能影响分析结果；而 Standalone Process 以独立进程运行，对主进程干扰更小，数据更接近真实表现。因此，小型项目或日常调试可使用普通 Profiler，而在大型项目或进行精确性能优化时，更推荐使用 Standalone Profiler。

![image-20260301114736725](/notes-assets/GameEngineStudy/assets/image-20260301114736725.png)

- **上面：时间轴（Timeline）**
   像心电图，看到尖峰就说明那帧很慢（卡了）。
- **中间：模块图（CPU/GPU/Memory等）**
   选哪个模块就看哪个维度。
- **下面：详细列表（Hierarchy/Timeline/Raw Data）**
   这里是“抓凶手”的地方：哪一段代码、哪一段渲染最耗时。

> 重要概念：**帧时间**
>
> - 60FPS ≈ 每帧 16.6ms
> - 30FPS ≈ 每帧 33.3ms
>    看到CPU或GPU某一帧超过这个阈值，就会掉帧卡顿
