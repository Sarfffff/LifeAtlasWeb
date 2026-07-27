---
title: 自动门蓝图
date: 2026-06-27 04:15:00
categories:
  - 图形与引擎
tags:
  - UE
  - 笔记
---
---
tags: [Unreal Engine, 蓝图, 自动门]
---

# 自动门蓝图制作教程

## 1. 创建 Actor 与组件层级

- 新建一个 **蓝图类（Blueprint Class）**，父类选择 **Actor**，命名为 BP_AutoDoor。
- 打开蓝图编辑器 → 视口（Viewport）。
- 添加组件并建立如下层级结构：

```
BP_AutoDoor (自建 Actor)
├── DoorFrame (StaticMesh)   ← 门框，静态，不参与运动
├── Door (StaticMesh)        ← 门扇，绕着 Z 轴旋转
└── BoxCollision (BoxCollider)  ← 触发开门/关门检测的碰撞体
```

> **核心思路：** 门框（DoorFrame）是静态部分，门扇（Door）作为子物体相对门框旋转，碰撞体（BoxCollision）检测玩家的进入和离开。
>
> 关键点：**碰撞体要调整到合适的大小**，覆盖门前人物站立区域，但不要穿墙或延伸到不合理的范围。

---

## 2. 组件详细设置

### 2.1 静态网格体（StaticMesh）

- 为 DoorFrame 和 Door 分别指定对应的静态网格体资源。
- Door 的 **枢轴点（Pivot Point）** 必须位于门的转轴侧边缘，否则旋转时门会偏离原位。如果模型本身的枢轴点不对，可以：
  - 在建模软件中调整模型原点；
  - 或者在蓝图中给 Door 添加一个 **Scene Component** 作为父级，用 Offset 偏移补偿。

### 2.2 盒体碰撞组件（BoxCollision）

- 添加 **Box Collision** 组件，调整其大小和位置使其覆盖门前的触发区域。
- 在细节面板中，勾选：
  - **✔ 组件开始重叠时（On Component Begin Overlap）**
  - **✔ 组件结束重叠时（On Component End Overlap）**

![image-20260611180455776](/notes-assets/UE/assets/image-20260611180456908.png)

---

## 3. 蓝图节点逻辑

### 3.1 添加 Timeline（时间轴）

门的旋转 **不是瞬间完成的**，因此需要一个 **Timeline** 来控制开门/关门的进度：

- 在事件图表中右键 → 添加 **Timeline** 节点，命名为 DoorTimeline。
- 双击打开 Timeline 编辑器：
  - 添加一个 **Float Track**，命名为 Alpha。
  - 设置总时长（Length）：**0.5 ~ 1.0 秒**（根据手感调整）。
  - 编辑曲线：
    - 起点 (0, 0) → 终点 (Length, 90)（表示从闭合 0° 到打开 90°）。
    - 曲线类型选择 **Auto / Cubic**（平滑缓动），或者选择 **Linear**（匀速，更机械）。
- 关闭 Timeline 编辑器。

### 3.2 开门逻辑

> **完整连接示意图：**

![image-20260611181343970](/notes-assets/UE/assets/image-20260611181343970.png)

### 3.3 逻辑说明

| 事件 | 作用 | Timeline 行为 |
|------|------|---------------|
| On Component Begin Overlap | 玩家/角色进入范围 | **Play** → 从 0 到 1 输出 Alpha |
| On Component End Overlap | 玩家/角色离开范围 | **Reverse** → 从 1 回到 0 输出 Alpha |
| Timeline (Update) | 每帧更新 Alpha 值 | 驱动 Set Relative Rotation.Yaw |

---

## 4. 进阶功能扩展

### 4.1 按键 / 点击式开门

如果要 **按 E 键开门** 或 **点击门交互**：

- 添加 E 键的 **InputAction** 事件（需要在项目设置中绑定）。
- 或者使用 **OnClicked** 事件（需要启用 Door 组件的 Simulate Physics / Generate Overlap Events）。
- 结合 **Branch** 节点判断当前门的状态（用一个 oolean 变量 IsOpen 记录），在打开和关闭之间切换。

### 4.2 双向开门

Set Relative Rotation.Yaw 的输出角度可以是 180（向内侧开）或 -90 / 90（分别表示左开/右开）。用变量控制开门方向：

- loat 变量 DoorAngle，默认设为 90.0。
- 在 Set Relative Rotation 的 Yaw 输入中，连接 Alpha * DoorAngle（打开）或 DoorAngle - (Alpha * DoorAngle)（关闭）。

### 4.3 滑动门（平移门）

如果要做酒店式的平移门，只需将 Set Relative Rotation 替换为 **Add Actor World Offset** 或 **Set Actor Location**，用 Timeline 输出驱动门的 X 或 Y 轴位移即可，原理完全一致。

### 4.4 防重复触发

用变量 ool bIsOpen 配合 **Branch** 判断：
- 如果门正处于打开过程中，不再响应新的 Begin Overlap。
- 或者使用 DoOnce 节点，防止短时间内重复触发。

---

## 5. 常见问题

| 问题 | 原因 / 解决 |
|------|-------------|
| 门旋转时脱离门框 | Door 的枢轴点不在门轴侧，需要调整模型原点或套一层 Scene Component 做平移补偿。 |
| 门在一个状态不断反复 | Timeline 的 Play/Reverse 没有正确区分，或者 On End Overlap 在门未完全打开时就触发了 Reverse。建议加 DoOnce 或状态变量。 |
| 碰撞体触发不稳定 | 检查 Collision Presets，确保角色 Pawn 在碰撞通道中正确产生 Overlap。 |
| 门打开方向反了 | Yaw 的角度符号不对：正向为顺时针，负向为逆时针，根据门的安装方向调整。 |

### 额外技巧

- 碰撞体禁用（可选）：防止重复触发 — 开门时设置 Set Collision Enabled → NoCollision，关门后恢复。
- Timeline 也可以用 **Lerp (Rotator)** 节点替代，但 Timeline 更直观，适合入门。

---

## 6. 总结

一个基础的自动门蓝图只需要 **3 个组件 + 1 个 Timeline**：

| 组件 / 节点 | 作用 |
|-------------|------|
| DoorFrame (StaticMesh) | 固定门框 |
| Door (StaticMesh) | 可旋转门扇 |
| Box Collision | 触发区域 |
| Timeline (Float Track) | 控制 0 → 开门角度的平滑过渡 |

利用这个框架可以快速派生出手动门、滑动门、双开门等变体。核心思路就是 **碰撞检测 → Timeline 驱动旋转/位移** 这一条线。

