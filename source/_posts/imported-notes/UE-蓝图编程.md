---
title: 蓝图编程
date: 2026-06-27 04:16:00
categories:
  - 图形与引擎
tags:
  - UE
  - 笔记
---
### 1.蓝图类型以及继承链

**Object**：万物之父（GC、基本类型），不能放场景里。

**Actor**：能放到关卡里的 “实体”，可加组件（模型、碰撞、灯光等）。

- 场景道具、门、箱子、陷阱、摄像机、粒子特效 → 选 **Actor**。

**Pawn（棋子）**：可被控制的 Actor（玩家 / AI 都能 “占据”）。

- 车、飞船、无人机、非人形怪物 → 选 **Pawn**。

**Character（角色）**：人形专用 Pawn，自带 **CharacterMovement**（走 / 跑 / 跳 / 游泳）、胶囊碰撞、骨骼网格体插槽。

- 玩家主角、人形 NPC、敌人 → 选 **Character**。

![image](/notes-assets/UE/assets/344bc6f25ddbb46db2672a4ecee2b988tplv-a9rns2rl98-pc_smart_face_crop-v1359269.png)

**PlayerController**

- 管玩家输入、鼠标 / 键盘 / 手柄、视角控制。
- 不渲染、不在场景里显示，只负责 “操控” Pawn/Character。

**GameMode**

- 全局规则：出生点、谁是玩家、游戏胜利 / 失败条件、计分。
- 一个关卡通常一个 GameMode。

**GameInstance**

- 全局唯一，跨关卡不销毁，存全局数据（玩家等级、存档）。

**Widget（UI）**

- 血条、背包、菜单、按钮 → 用 **Widget Blueprint**。

**Level Blueprint（关卡蓝图）**

- 整个关卡的全局逻辑：开门触发、过关事件、关卡初始化Epic Games。

**Animation Blueprint（动画蓝图）**

- 角色动画状态机： idle/run/jump/attack 切换、动画混合。

#### 实践玩家的移动操作

**重置默认模板&配置GameMode**

1.世界场景设置重置

- 打开你的关卡 → 窗口 → 世界场景设置（World Settings）
- 找到「Game Mode」部分，把当前关卡的 Game Mode 设为 `None`（或直接选你自己创建的 GameMode）
- 这样做是为了避免关卡里的旧模板设置和项目设置冲突。

2.创建并配置 GameMode 蓝图

- 右键 → Blueprint Class → 搜索 `Game Mode Base`，创建蓝图（命名比如 `BP_GameMode`）
- 打开 BP_GameMode，在细节面板找到：
  - **Default Pawn Class**：选你创建的 Character 蓝图（比如 `BP_PlayerCharacter`）
  - 其他如 `Player Controller Class` 可以先保持默认 `PlayerController`，后续再扩展。

3.项目设置绑定默认 GameMode

- 编辑 → 项目设置 → 地图和模式（Maps & Modes）
- 「Default Game Mode」选择你的 `BP_GameMode`
- 这样新建关卡 / 打包运行时，都会默认使用你的 GameMode，而不是模板自带的。

**配置增强输入**

1.创建输入操作（Input Action）

- 右键 → Input → 输入操作（命名 `IA_Move`）
- 打开 `IA_Move`，在细节面板找到 **Value Type**，设置为 `Vector2D`（这样才能同时传递前后、左右两个方向的输入值，实现 WASD 移动）
- 再创建一个 `IA_Look`，同样设为 `Vector2D`，用于鼠标 / 摇杆视角转向。

2.创建输入映射情境（Input Mapping Context）

- 右键 → Input → 输入映射情境（命名 `IMC_Gameplay`）
- 打开 `IMC_Gameplay`，开始绑定按键：
- 绑定 WASD 时，注意「Scale」和「Axis」的设置，让 W = 向前、S = 向后、A = 向左、D = 向右。

**Character 蓝图实现移动**

1.绑定输入操作事件

- 打开你的 `BP_PlayerCharacter`，进入事件图表
- 首先在「组件」面板里，确保有 `Enhanced Input Component`（增强输入组件）和 `Character Movement` 组件
- 拖入节点：Bind Action（绑定 IA_Move）和 Bind Action（绑定 IA_Look）
  - 或者更简单的方式：直接在事件图表右键，搜索 `IA_Move`，选择「Bind Action 事件」

2. 移动逻辑（核心）

- 当 `IA_Move` 触发时，获取输入值（Get Vector2D Value）
- 拆分 X、Y 值，分别连接到 Add Movement Input：
  - X 值（前后）：`Get Actor Forward Vector` × X 值 → `Add Movement Input`
  - Y 值（左右）：`Get Actor Right Vector` × Y 值 → `Add Movement Input`

![image-20260526175222757](/notes-assets/UE/assets/image-20260526175222757.png)![image-20260526175816085](/notes-assets/UE/assets/image-20260526175816085.png)

![image-20260526175918344](/notes-assets/UE/assets/image-20260526175918344.png)

**第三人称人物移动**
