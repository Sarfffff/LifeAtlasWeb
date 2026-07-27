---
title: 蓝图通信和自定义事件
date: 2026-06-27 04:17:00
categories:
  - 图形与引擎
tags:
  - UE
  - 笔记
---
---
tags: [Unreal Engine, 蓝图通信, 自定义事件, Event Dispatcher, 蓝图接口]
---

# 蓝图通信与自定义事件

## 1. 概述

在 UE 项目中，不同的蓝图之间往往需要**互相通信**：

- 角色吃到了金币 -> 通知 UI 更新分数
- 玩家按下开关 -> 告诉门打开
- 敌人死亡 -> 通知关卡管理器检查是否全部击败
- 电梯到达楼层 -> 通知电梯门打开

蓝图通信的核心问题就是：**A 蓝图如何找到 B 蓝图，并调用 B 蓝图的方法或修改变量？**

UE 提供了多种通信方式，各有适用场景：

| 通信方式 | 耦合度 | 适用范围 | 推荐场景 |
|----------|--------|----------|----------|
| 直接引用 + Cast To | 高耦合 | 一对一 | 已知类型的特定对象 |
| 自定义事件 | 低/中 | 同一蓝图内部 / 外部调用 | 复用逻辑、传参触发 |
| 事件分发器（Event Dispatcher） | 低耦合 | 一对多 | 一个事件触发多个蓝图响应 |
| 蓝图接口（Blueprint Interface） | 低耦合 | 接口协议 | 不同类之间统一行为 |
| Get All Actors Of Class/Tag | 动态 | 一对多搜索 | 按类别/标签批量查找 |
| 关卡蓝图直接引用 | 中耦合 | 关卡级 | 关卡与 Actor 通信 |
| GameInstance | 低耦合 | 全局 | 跨关卡的全局数据/通信 |

---

## 2. 自定义事件（Custom Events）

### 2.1 什么是自定义事件

自定义事件是你在蓝图中**自己定义的事件**，它不像 `BeginPlay`、`Tick` 那样由引擎自动触发，而是需要你**手动调用**。

### 2.2 创建自定义事件

1. 在事件图表中右键 -> 添加 **自定义事件（Custom Event）**，命名如 `OpenDoor`。
2. 在事件图表中会生成一个节点。
3. 选择该节点，在细节面板可以添加**输入参数**（Parameters）。

```
[OpenDoor] (参数: float Speed, bool PlaySound)
    |
    [Set Actor Location]  <- 使用 Speed 控制速度
```

### 2.3 调用自定义事件

- 直接拖出已有的事件节点并连线即可**内部调用**。
- 从**其他蓝图**通过**目标引用**来调用时，配合 `Cast To` 获取引用。

### 2.4 自定义事件 vs 函数（Function）

| 对比项 | 自定义事件 | 函数 |
|--------|-----------|------|
| 执行流程 | 异步，支持 Delay 等时间节点 | 同步，**不支持** Delay |
| 返回值 | 不支持 | 支持返回值 |
| 输入参数 | 支持 | 支持 |
| 从外部调用 | 通过引用调用 | 通过引用调用 |
| 访问权限 | Public / Private | Public / Private |

> **总结：** 如果逻辑需要 Delay、时间线或其他异步操作，用**自定义事件**；如果只需要纯计算 + 返回值，用**函数**。

---

## 3. 直接引用与 Cast To

### 3.1 基本概念

要让一个蓝图调用另一个蓝图的方法，必须先拿到目标的**引用（Reference）**。最直接的方式就是 **Cast To（类型转换）**。

### 3.2 获取引用的常见方式

```
方式一：从碰撞事件获取
On Component Begin Overlap -> Other Actor -> Cast To BP_Door

方式二：按类获取
Get All Actors Of Class -> BP_Door -> 遍历数组找到目标

方式三：从公有变量获取
Public 变量已持有引用 -> 直接调用
```

### 3.3 Cast To 的执行流程

```
Other Actor ----> [Cast To BP_Door]
                    |
        +-----------+-----------+
        |                       |
    Cast Success             Cast Failed
        |                       |
    [OpenDoor]               (不执行任何操作)
```

### 3.4 性能注意

Cast To 有一定的性能开销（尤其是每帧调用时）。推荐做法：

- 在 `BeginPlay` 中**缓存引用**到变量，之后直接使用变量，不要每帧 Cast。
- 使用 **Blueprint Interface** 替代 Cast To（见第 5 节）。
- Cast To 失败时走 Cast Failed 分支，不会崩溃。

---

## 4. 事件分发器（Event Dispatcher）

### 4.1 什么是 Event Dispatcher

事件分发器是 UE 蓝图中最灵活的**一对多通信**方式。一个蓝图**声明一个事件**，其他蓝图**绑定这个事件**，触发时所有绑定的接收方都会收到通知。

### 4.2 声明 Event Dispatcher

1. 打开蓝图，在**我的蓝图（My Blueprint）**面板中点击 **+** -> **事件分发器（Event Dispatcher）**。
2. 命名如 `OnDoorOpened`。
3. 在细节面板中可以添加**参数**（如 `float DoorAngle`、`bool bInstant`）。

```
[我的蓝图面板]
  +-- 变量（Variables）
  +-- 事件分发器（Event Dispatchers）
  |     +-- OnDoorOpened (参数: float Angle)
  +-- 函数（Functions）
  +-- ...
```

### 4.3 绑定 Event Dispatcher

在**接收端**蓝图中绑定事件：

```
// 接收端蓝图（如 UI Widget 或 Audio Manager）

BeginPlay
    -> Get Actor Of Class -> BP_Door     // 找到门
    -> Bind Event to OnDoorOpened
        -> 自定义事件 UpdateUI          // 门打开时更新 UI
```

绑定节点有 4 种模式：

| 绑定模式 | 作用 | 适用场景 |
|----------|------|----------|
| Bind | 绑定到已有的自定义事件 | 最常见 |
| Bind (Event) | 创建并绑定一个新事件 | 快捷方式 |
| Unbind | 解除单个绑定 | 不再需要接收通知 |
| Unbind All | 解除所有绑定 | 彻底断开连接 |

### 4.4 触发 Event Dispatcher

在**发送端**蓝图中触发：

```
// 发送端（如 BP_Door 蓝图）

[满足条件时触发]
    -> [Event Dispatcher] -> OnDoorOpened
    -> 参数: Angle = 90.0
    -> 所有绑定了 OnDoorOpened 的接收端都会收到通知
```

### 4.5 生命周期管理

1. **绑定时机** -> 通常在 `BeginPlay` 中绑定
2. **解绑时机** -> 在 `EndPlay` 或 `Destroyed` 中解绑，防止悬空引用（Dangling Reference）
3. **触发时机** -> 满足业务条件时触发

```
BeginPlay -> Bind Event（绑定到目标）
EndPlay   -> Unbind All（清理绑定，防止内存泄漏）
```

---

## 5. 蓝图接口（Blueprint Interface）

### 5.1 为什么需要蓝图接口

Cast To 的问题：如果门、箱子、陷阱、NPC 各自都响应一个 `Interact` 事件，用 Cast To 你需要写 4 个分支。

蓝图接口让**不同类的蓝图**实现**相同的行为**，而不需要互相知道对方的具体类型。

### 5.2 创建蓝图接口

1. 右键内容浏览器 -> **蓝图（Blueprint）** -> **蓝图接口（Blueprint Interface）**。
2. 命名为 `BPI_Interactable`。
3. 在接口编辑器中添加**函数**（如 `Interact`、`OnFocus`）。
4. 可以为函数添加输入/输出参数。

### 5.3 实现蓝图接口

1. 打开目标蓝图（如 `BP_Door`、`BP_Chest`、`BP_Trap`）。
2. 在**类设置（Class Settings）** -> **接口（Interfaces）** -> 添加 `BPI_Interactable`。
3. 接口的函数会自动出现在事件图表中，直接实现即可。

```
// BP_Door 中实现 Interact -> 开门
// BP_Chest 中实现 Interact -> 打开箱子并生成掉落物
// BP_Trap 中实现 Interact -> 激活陷阱
```

### 5.4 调用蓝图接口

调用者不需要知道对象的具体类型，只要它实现了接口：

```
InputAction E（按 E 键交互）
    -> Line Trace 检测前方物体
    -> Hit Actor -> Interact (BPI_Interactable)

如果该 Actor 实现了 BPI_Interactable，调用成功
如果没有实现，不产生任何效果（不会崩溃）
```

> **接口 vs Cast To：** 接口不需要知道具体类，Cast To 需要知道具体类。接口更适合通用交互协议。

---

## 6. 通过类/标签批量通信

### 6.1 Get All Actors Of Class

当你需要找到场景中所有某一类的 Actor 时：

```
Get All Actors Of Class -> BP_Door
    -> Out Actors（数组）
    -> For Each Loop 遍历所有门
        -> Cast To BP_Door -> Close All（关门）
```

### 6.2 Get All Actors With Tag

更灵活的方式是使用**标签（Tag）**：

1. 在 Actor 的细节面板中，给 **Tags** 添加自定义标签，如 `"Door"` 或 `"EnemySpawner"`。

```
Get All Actors With Tag -> "Door"
    -> Out Actors（数组）
    -> For Each Loop 遍历所有带标签的 Actor
        -> 逐个操作
```

> 标签的优点是**不需要知道具体类**，不同类型的 Actor 可以有相同标签。

---

## 7. 关卡蓝图通信

### 7.1 关卡蓝图

关卡蓝图（Level Blueprint）是**当前关卡**的全局蓝图，适合：

- 关卡开始时的初始化
- 过关条件检查（如是否击败了所有敌人）
- 管理关卡中的关键事件

### 7.2 关卡蓝图 -> Actor

直接在关卡蓝图中引用场景中的 Actor：

```
关卡蓝图
    -> Get All Actors Of Class -> BP_Door
    -> OpenDoor（直接调用）

或：在关卡视口中选中该 Actor -> 关卡蓝图中右键 -> "创建对该 Actor 的引用"
```

### 7.3 Actor -> 关卡蓝图

```
Actor 中获取关卡蓝图引用
    -> Get Actor Of Class -> Level Blueprint
    -> Cast To Level BP_MyLevel
    -> 调用自定义事件 OnAllEnemiesDefeated
```

推荐使用 **Event Dispatcher** 替代，这样 Actor 不需要知道关卡蓝图的存在。

---

## 8. Widget（UI）与蓝图通信

### 8.1 从 Widget 获取玩家引用

```
Widget 蓝图

Get Player Controller
    -> Get Controlled Pawn
    -> Cast To BP_PlayerCharacter
    -> 获取角色引用，调用角色方法或读取变量
```

### 8.2 从 Actor 更新 Widget

```
角色蓝图

Get Player Controller -> Get HUD -> Create Widget
    -> 将 Widget 保存到变量（如 HUDWidget）

当分数变化时：
HUDWidget -> UpdateScore（Widget 中的自定义事件）
```

### 8.3 Event Dispatcher 用于 UI 更新

这是**最推荐**的 Actor -> UI 通信方式：

```
Actor（如 GameMode）中声明 Event Dispatcher -> OnScoreChanged
Widget 在 BeginPlay 中绑定该事件

OnScoreChanged（参数: int NewScore）
    -> Set Text -> 更新 UI 中的分数显示
```

---

## 9. 通信方式对比总结

| 通信方式 | 适用场景 | 耦合度 | 性能 | 复杂度 |
|----------|----------|--------|------|--------|
| 自定义事件 | 蓝图内部复用 / 外部通过引用调用 | 低-中 | 高 | 低 |
| Cast To | 明确目标类型，一对一通信 | 高 | 中 | 低 |
| Event Dispatcher | 一个触发多个响应、低耦合 | 低 | 高 | 中 |
| 蓝图接口 | 不同类之间统一行为协议 | 低 | 高 | 中 |
| Get All Actors | 批量操作、按标签搜索 | 低 | 低 | 低 |
| 关卡蓝图 | 关卡全局逻辑管理 | 中 | 高 | 低 |
| GameInstance | 跨关卡全局数据 | 低 | 高 | 中 |

### 选择建议

- **需要一对一通信，知道具体类** -> Cast To
- **需要一对一通信，不知道具体类** -> 蓝图接口
- **需要一对多通信** -> Event Dispatcher
- **UI 需要更新** -> Event Dispatcher + Widget 绑定
- **不同类需要统一行为（都可交互/都可被破坏）** -> 蓝图接口
- **跨关卡的全局数据** -> GameInstance

---

## 10. 常见问题与最佳实践

| 问题 | 原因 / 解决 |
|------|-------------|
| Cast To 总是失败 | 目标对象不是预期的类型。检查 Other Actor 的实际蓝图类是否正确。 |
| Event Dispatcher 绑定了但是不触发 | 检查是否在 BeginPlay 中绑定了；发送端和接收端是否引用了同一个实例。 |
| 调用自定义事件后没有反应 | 自定义事件可能是 Private（私有）的，外部无法访问。在细节面板中改为 Public。 |
| Get All Actors Of Class 返回空数组 | 检查场景中是否确实放置了该类的 Actor。 |
| 蓝图接口的函数无法实现 | 检查接口是否在编辑器中正确编译，蓝图类设置中是否正确添加了接口。 |
| Widget 中的变量没有更新 | Widget 可能持有的是旧引用（实例不对）。需要确保引用的是当前关卡中实际存在的 Actor。 |
| 关卡蓝图中拖不出场景中的 Actor 引用 | 在关卡视口中选中该 Actor，再打开关卡蓝图，右键 -> 创建对该 Actor 的引用。 |

### 额外技巧

- **尽量少用 Cast To，多用接口和 Event Dispatcher**，这样蓝图之间耦合度更低，维护起来更轻松。
- Event Dispatcher 的绑定操作最好在 `BeginPlay` 中做，**解绑**在 `EndPlay` 或 `Destroyed` 中做，避免悬空引用。
- 自定义事件最好加上**参数注释**，方便团队协作时理解传参含义。
- 蓝图接口的函数可以设置 **Access Specifier（访问修饰符）**：Public / Protected / Private。
- 跨关卡通信用 **GameInstance**（全局唯一，不随关卡销毁），通过 GameInstance 持有引用或 Event Dispatcher。
- 在 `BeginPlay` 中缓存引用，避免每帧 Cast To，可以显著提升性能。
- 多个蓝图共用的通信逻辑，可以封装到一个**管理器蓝图**（如 GameMode 或 GameState）中统一管理。

---

## 11. 应用示例：完整通信流程

以**玩家吃金币更新 UI**为例，展示完整的通信链路：

```
1. 声明 Event Dispatcher
   BP_GameMode 中声明 OnScoreChanged（参数: int NewScore）

2. Widget 绑定
   Widget 的 BeginPlay
       -> Get Actor Of Class -> BP_GameMode
       -> Bind Event to OnScoreChanged
           -> 自定义事件 UpdateScoreText
               -> Set Text（更新 UI 显示）

3. 金币吃到的逻辑
   BP_Coin 的 OnComponentBeginOverlap
       -> Other Actor -> Cast To BP_PlayerCharacter
           -> Cast Success（角色吃到金币）
               -> BP_GameMode 的 AddScore(+1)
                   -> Event Dispatcher -> OnScoreChanged(NewScore=当前分数)
                       -> Widget 收到通知 -> 自动更新分数显示

4. 销毁金币
   -> Destroy Actor（销毁金币对象）

5. 解绑
   Widget 的 Destruct/Destroyed
       -> Unbind All（清理绑定）
```
