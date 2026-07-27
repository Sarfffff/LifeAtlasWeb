---
title: 电梯门蓝图
date: 2026-06-27 04:14:00
categories:
  - 图形与引擎
tags:
  - UE
  - 笔记
---
---
tags: [Unreal Engine, 蓝图, 电梯门, 位移]
---

# 电梯门蓝图制作教程

## 1. 概述

电梯门的实现原理与自动门类似，核心区别在于 **运动方式**：

| 门类型 | 运动方式 | 触发方式 | 复杂度 |
|--------|----------|----------|--------|
| 自动门 | **旋转**（绕 Z 轴） | 碰撞体自动触发 | 低 |
| 电梯门 | **平移**（沿 X/Y 轴滑动） | 按键交互触发 | 中 |

电梯门通常包含 **两扇门板**，向左右两侧滑动打开，并且需要按键（如 E 键）来触发开关门。

---

## 2. 创建 Actor 与组件层级

- 新建一个 **蓝图类（Blueprint Class）**，父类选择 **Actor**，命名为 `BP_ElevatorDoor`。
- 打开蓝图编辑器 → 视口（Viewport）。
- 添加组件并建立如下层级结构：

```
BP_ElevatorDoor (自建 Actor)
├── LeftDoor (StaticMesh)          ← 左侧门板，向左滑动
├── RightDoor (StaticMesh)         ← 右侧门板，向右滑动
├── BoxCollision (BoxCollider)     ← 碰撞体，检测玩家交互
│   └── (挂载在门板上，跟随门移动)
└── InteractionText (TextRender)   ← （可选）提示文字 "按 E 开门"
```

> **核心思路：** 电梯门的两个门板各自向相反方向平移。BoxCollider 需要挂载在**网格体父级之下**（而不是与门并列），这样碰撞体可以跟随门板移动，确保只有在门附近才能触发交互。
>
> 关键点：如果 BoxCollider 不跟随门移动，玩家在门打开后依然能触发"开门"操作，导致逻辑混乱。

![image-20260611182618969](/notes-assets/UE/assets/image-20260611182618969.png)

---

## 3. 组件详细设置

### 3.1 静态网格体（StaticMesh）

- 为 `LeftDoor` 和 `RightDoor` 分别指定对应的电梯门板网格体。
- 确保两扇门的 **枢轴点（Pivot Point）** 位于门板的内侧边缘（即两扇门相对的边缘），这样当门滑动时，两扇门向两侧张开。
  - 左门枢轴点在右边缘；
  - 右门枢轴点在左边缘。
- 如果模型枢轴点不对，可以用一个 **Scene Component** 作为父级做偏移补偿。

### 3.2 盒体碰撞组件（BoxCollision）

- 添加 **Box Collision** 组件，作为 `LeftDoor` 或 `RightDoor` 的**子组件**。
- 调整碰撞体大小，使其覆盖电梯门前的交互区域。
- 在细节面板中，勾选：
  - **✔ 组件开始重叠时（On Component Begin Overlap）**
- **不需要**勾选「组件结束重叠时」，因为电梯门是用按键触发的，不是自动关门。

### 3.3 交互提示（可选）

- 添加一个 **TextRender 组件**，显示"按 E 开门"。
- 仅在玩家靠近时可见（通过碰撞体重叠事件控制 Visible 属性）。

---

## 4. 蓝图节点逻辑

### 4.1 添加 Timeline（时间轴）

电梯门的滑动需要一个 **Timeline** 控制动画进度：

- 在事件图表中右键 → 添加 **Timeline** 节点，命名为 `DoorTimeline`。
- 双击打开 Timeline 编辑器：
  - 添加一个 **Float Track**，命名为 `Alpha`。
  - 设置总时长（Length）：**0.8 ~ 1.2 秒**（电梯门通常比普通门稍慢，更显平稳）。
  - 编辑曲线：
    - 起点 `(0, 0)` → 终点 `(Length, 1.0)`。
    - 曲线类型选择 **Auto / Cubic**（平滑缓动）。
- 关闭 Timeline 编辑器。

### 4.2 添加变量

| 变量名 | 类型 | 默认值 | 作用 |
|--------|------|--------|------|
| `bIsOpen` | `Boolean` | `false` | 记录当前门是否打开，用于切换开门/关门状态 |
| `DoorSlideDistance` | `Float` | `100.0` | 单扇门板的滑动距离（厘米），根据实际模型调整 |
| `bPlayerInRange` | `Boolean` | `false` | 记录玩家是否在交互范围内 |

### 4.3 碰撞检测逻辑

```
On Component Begin Overlap (BoxCollision)
    ↓
    [Set] → bPlayerInRange = true
    [Set] → InteractionText Visible = true

On Component End Overlap (BoxCollision)
    ↓
    [Set] → bPlayerInRange = false
    [Set] → InteractionText Visible = false
```

### 4.4 按键交互逻辑

```
InputAction E (按 E 键)
    ↓
    [Branch] → bPlayerInRange == true?
        ├── Yes → [Branch] → bIsOpen == true?
        │           ├── Yes → [Reverse] → DoorTimeline  (关门)
        │           │           [Set] → bIsOpen = false
        │           └── No  → [Play] → DoorTimeline    (开门)
        │                       [Set] → bIsOpen = true
        └── No  → (不执行任何操作)
```

### 4.5 连接开门/关门动画

```
DoorTimeline (Update) → Alpha (Float)
    ↓
    [Float * Float] → Alpha * DoorSlideDistance
        ↓
    分别连接到 LeftDoor 和 RightDoor 的 [Set Relative Location]

LeftDoor:
    X: -OutputValue  (左门向左移动：负方向)
    Y: 0.0
    Z: 0.0

RightDoor:
    X: +OutputValue  (右门向右移动：正方向)
    Y: 0.0
    Z: 0.0
```

> **完整连接示意图：**

![image-20260611182644131](/notes-assets/UE/assets/image-20260611182644131.png)

### 4.6 逻辑说明

| 事件 / 节点 | 作用 |
|-------------|------|
| `On Component Begin Overlap` | 玩家进入电梯门范围，标记为可交互 |
| `On Component End Overlap` | 玩家离开范围，标记为不可交互 |
| `InputAction E` | 按键触发，切换开门/关门状态 |
| `Branch` (x2) | 第一层判断玩家是否在范围内；第二层判断门的当前状态 |
| `Timeline (Update)` | 每帧输出 Alpha 值，驱动门板位移 |
| `Set Relative Location` | 分别控制左门和右门向相反方向平移 |

---

## 5. 进阶功能扩展

### 5.1 电梯楼层联动

如果电梯门需要与电梯轿厢联动：

- 在电梯到达指定楼层时，发送一个 **自定义事件**（如 `OpenDoor`）给电梯门蓝图。
- 电梯门收到事件后执行 Play Timeline 打开门，延迟几秒后执行 Reverse 关门。
- 使用 **Cast To BP_ElevatorDoor** 节点或 **Event Dispatcher**（事件分发器）实现通信。

### 5.2 单扇门（平移门）

如果只需要做单扇的平移门（如地铁屏蔽门、酒店平移门）：

- 只保留一个 `Door (StaticMesh)` 组件。
- 在 `Set Relative Location` 中只设置 X 轴（或 Y 轴）位移。

### 5.3 防夹检测

电梯门需要防夹功能，当门关闭过程中检测到碰撞体：

- 在 Timeline 关门过程中，使用 `On Component Begin Overlap` 检测是否有物体阻挡。
- 如果检测到阻挡，执行 `Reverse` → Timeline 重新开门。
- 可用 `DoOnce` 节点防止重复触发。

### 5.4 开门延时自动关闭

如果希望电梯门在打开一段时间后自动关闭：

- 在开门时启动一个 `Delay` 节点（如 3 秒）。
- Delay 结束后，如果 `bIsOpen == true` 且玩家已离开范围，执行关门逻辑。

---

## 6. 常见问题

| 问题 | 原因 / 解决 |
|------|-------------|
| 两扇门朝同方向移动 | LeftDoor 和 RightDoor 的位移值符号相同。确保左门乘 `-1`（负方向），右门乘 `+1`（正方向）。 |
| 门滑动超出边界或互相重叠 | `DoorSlideDistance` 值过大或过小。根据实际模型尺寸调整。 |
| 按键开门无效 | 检查 `InputAction E` 是否在项目设置中已绑定；检查 `Branch` 节点的 `bPlayerInRange` 是否被正确设置。 |
| 碰撞体不跟随门移动 | BoxCollider 需要作为门的子组件，或每帧用 `Set Actor Location` 更新位置。 |
| 关门时夹住玩家 | 添加防夹检测（见 5.3 节），在关门过程中检测到碰撞体时重新开门。 |

### 额外技巧

- 可以用 **Timeline 的 Reverse from End** 代替 Reverse，让门在完全打开后立即开始关闭。
- 如果电梯门需要**平滑加速/减速效果**，调整 Timeline 曲线为 **Cubic（三次缓动）** 或自定义 S 形曲线。
- `Set Relative Location` 也可以用 **Lerp (Vector)** 节点 + Timeline Alpha 代替，实现更灵活的位置插值。

---

## 7. 总结

一个基础的电梯门蓝图需要 **3 个组件 + 1 个 Timeline + 按键交互逻辑**：

| 组件 / 节点 | 作用 |
|-------------|------|
| `LeftDoor (StaticMesh)` | 左侧门板，向左滑动 |
| `RightDoor (StaticMesh)` | 右侧门板，向右滑动 |
| `BoxCollision (BoxCollider)` | 检测玩家交互范围 |
| `Timeline` (Float Track) | 控制 0 → 1 的滑动进度 |
| `bIsOpen` (Boolean) | 记录门状态，切换开关 |
| `InputAction E` | 玩家按键触发开关 |

电梯门与自动门的核心区别在于：**自动门用旋转 + 碰撞自触发，电梯门用平移 + 按键交互**。理解了这个框架，你可以轻松实现各类平移门、联动门、地铁屏蔽门等变体。

