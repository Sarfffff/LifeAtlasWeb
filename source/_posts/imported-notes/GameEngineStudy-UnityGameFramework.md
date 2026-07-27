---
title: UnityGameFramework
date: 2026-06-27 03:43:00
categories:
  - 图形与引擎
tags:
  - GameEngineStudy
  - 笔记
---
# GF与UGF

GameFramework（GF）与UnityGameFramework（UGF）是UnityGameFramework框架的两个核心组成部分，它们的关系和区别主要体现在设计目标、依赖关系和功能分工上。

#### 🔧 1. **核心定位与设计目标**

- **GameFramework (GF)**：是框架的**核心逻辑层**。它包含了对象池、事件系统、流程控制、资源管理等19个核心模块的具体实现

  。其关键设计目标是**与Unity引擎解耦**，这意味着GF本身是一个纯C#类库，不引用任何Unity的API，因此理论上可以移植到其他C#环境中

- **UnityGameFramework (UGF)**：是GF在**Unity引擎上的适配层或“外壳”**。它负责将GF的核心功能与Unity引擎的具体实现（如GameObject、AssetBundle、编辑器扩展）连接起来。UGF通过继承`MonoBehaviour`的组件（Component）来接收Unity的生命周期事件，并作为桥梁，让游戏逻辑层能够通过UGF调用GF的功能

简单来说，**GF是独立于引擎的“大脑”和“规则”**，而**UGF是专为Unity定制的“手脚”和“接口”**

#### 📦 2. **依赖关系**

- **GF**：**不依赖Unity引擎**。它是一个独立的、基于.NET的库，确保了核心框架的稳定性和可移植性
- **UGF**：**完全依赖Unity引擎**。它的存在就是为了在Unity项目中具体实现GF定义的各种接口和功能，例如资源的实际加载、场景的切换等

#### 🧩 3. **功能分工与协作方式**

两者通过清晰的接口进行协作，UGF层通过实现GF层定义的Helper接口来注入具体的引擎实现

| **功能方面**    | **GameFramework (GF)**                                   | **UnityGameFramework (UGF)**                                 |
| :-------------- | :------------------------------------------------------- | :----------------------------------------------------------- |
| **资源加载**    | 定义异步加载的资源管理策略和接口 (如 `IResourceManager`) | 具体实现AssetBundle的加载、卸载等Unity相关操作 (如 `DefaultLoadResourceAgentHelper`) |
| **实体/UI管理** | 定义实体和UI的创建、显示、回收等管理逻辑和接口           | 负责实例化Unity的GameObject、处理其生命周期和显示层级        |
| **数据解析**    | 定义数据表、配置等数据的解析接口 (如 `IDataTableHelper`) | 提供具体的解析实现，如使用JsonUtility或自定义格式解析Excel导出的数据文件 |
| **网络通信**    | 定义网络消息包格式、事件派发等核心逻辑                   | 基于Unity的协程或.NET Socket实现具体的网络连接和数据收发     |

#### 🎮 4. **项目中的层级关系**

在一个典型的UGF项目中，代码结构通常分为三个清晰的层级：

1. **GF层**：最底层，是框架的核心实现，无Unity依赖。
2. **UGF层**：中间层，是GF的Unity适配器，处理所有与Unity引擎相关的具体工作。
3. **游戏逻辑层 (Game)**：最上层，是开发者编写的具体游戏业务代码。它**只直接与UGF层交互**，通过UGF提供的组件接口来调用GF的强大功能，从而保持业务代码的整洁和框架的隔离性。

#### 💡 5. **总结与选择**

理解GF和UGF的区别对于高效使用该框架至关重要。

- **GF**提供了**强大、稳定、引擎无关的核心功能**，是框架能力的基石。
- **UGF**则提供了**与Unity引擎无缝衔接的具体实现**，是框架能在Unity项目中运行的保障。

这种**分离设计的好处**是带来了极高的**解耦性**、**可测试性**（核心逻辑可脱离Unity测试）和**可维护性**。对于开发者而言，在大多数情况下，你是在**游戏逻辑层**通过**UGF层提供的入口（如`GameEntry.GetComponent`）** 来使用框架的各种功能，而GF的核心模块则在背后默默工作。

# Base类

以下是对 `GameEntry.Builtin.cs`、`GameEntry.cs` 和 `GameEntry.Custom.cs` 三个脚本的文档介绍：

---

### **GameEntry 模块文档**

#### **1. 概述**
`GameEntry` 是 Unity 游戏框架的核心入口类，负责初始化和管理游戏的基础组件和自定义组件。它采用 `partial` 类设计，将功能分散到多个文件中，便于维护和扩展。

#### **2. 模块组成**
1. **`GameEntry.Builtin.cs`**
   - **功能**：定义并管理游戏的基础组件，包括资源管理、网络、UI、声音等核心功能模块。
   - **关键组件**：
     - `BaseComponent`：基础功能组件。
     - `ResourceComponent`：资源管理组件。
     - `UIComponent`：界面管理组件。
     - 其他如 `NetworkComponent`、`SoundComponent` 等。
   - **初始化方法**：
     - `InitBuiltinComponents`：初始化所有基础组件。

2. **`GameEntry.cs`**
   - **功能**：作为游戏的主入口，负责调用基础组件和自定义组件的初始化逻辑。
   - **关键方法**：
     - `Start`：在游戏启动时调用 `InitBuiltinComponents` 和 `InitCustomComponents`。
   - **设计模式**：
     - 使用 `partial` 类，将逻辑分散到多个文件中。

3. **`GameEntry.Custom.cs`**
   - **功能**：扩展游戏框架，定义和管理自定义组件。
   - **关键组件**：
     - `BuiltinDataComponent`：内置数据管理组件。
     - `HPBarComponent`：血条管理组件。
   - **初始化方法**：
     - `InitCustomComponents`：初始化所有自定义组件。

#### **3. 模块关系**
- **调用流程**：
  - `GameEntry.cs` 的 `Start` 方法依次调用 `InitBuiltinComponents` 和 `InitCustomComponents`。
  - `GameEntry.Builtin.cs` 提供基础功能，`GameEntry.Custom.cs` 提供扩展功能。
- **静态访问**：
  - 所有组件通过静态属性提供全局访问点，例如 `GameEntry.Base`、`GameEntry.UI` 等。

#### **4. 使用示例**
```csharp
// 访问基础组件
var baseComponent = GameEntry.Base;
var uiComponent = GameEntry.UI;

// 访问自定义组件
var hpBarComponent = GameEntry.HPBar;
```

#### **5. 设计优势**
- **模块化**：通过 `partial` 类将功能分散，便于团队协作和功能扩展。
- **全局访问**：静态属性设计简化了组件调用。
- **灵活性**：支持自定义组件的快速集成。

#### **6. 注意事项**
- **初始化顺序**：确保 `InitBuiltinComponents` 在 `InitCustomComponents` 之前调用。
- **组件依赖**：某些自定义组件可能依赖基础组件，需注意加载顺序。

如果需要进一步扩展或修改功能，请参考框架文档或联系开发团队。
