---
title: Unity为什么需要构建工具
date: 2026-06-27 04:27:00
categories:
  - Unity/游戏客户端
tags:
  - Unity项目以及安卓构建
  - 笔记
---
# 为什么Unity项目需要Android 构建工具链？

Unity 能直接生成 APK，恰恰是因为它在后台 **自动调用** 了 Android 的构建工具链。你可以把 Unity 想象成一位经验丰富的总指挥，而构建工具（如 Android SDK/NDK）就是它手下各司其职的专业施工队。

下面这个表格能帮你快速理解它们各自的分工：

| 核心环节             | Unity 的总指挥角色                                  | 构建工具 (施工队) 的不可替代作用                             |
| :------------------- | :-------------------------------------------------- | :----------------------------------------------------------- |
| **🔨 最终编译与打包** | 提供项目蓝图（场景、C#脚本、资源）                  | **将蓝图变为安卓系统认识的实物**： • 使用 **Android SDK** 中的 `aapt`(Android Asset Packaging Tool) 工具处理图片、布局等资源，并打包成安卓规范的文件结构。 • 如需使用 C/C++ 代码，需通过 **Android NDK** 将其编译为设备CPU可直接执行的 `.so`库文件。 |
| **📄 应用配置**       | 提供 Player Settings 进行基础配置（如应用名、图标） | **生成并处理最终的 `AndroidManifest.xml`文件**。这个文件是安卓应用的“身份证”，定义了应用权限、入口Activity等关键信息。Unity 的配置需要被“翻译”成标准的安卓清单文件，这个过程由 SDK 工具完成。 |
| **🔐 应用签名**       | 提供设置签名文件的界面                              | **使用 SDK 中的 `apksigner`或 `jarsigner`工具对 APK 进行数字签名**。这是应用发布的必需步骤，用于验证应用发布者身份和应用的完整性。 |
| **⚙️ 平台适配**       | 提供跨平台的抽象层                                  | **处理与特定安卓版本、设备架构和系统的兼容性**。例如，确保应用能在不同CPU架构（arm64, x86等）的设备上正常运行。 |

###  构建流程如何协同工作

当你点击 Unity 的 **Build** 按钮时，背后发生了一系列协同工作：

1. **Unity 预处理**：Unity 首先编译你的 C# 脚本，处理场景和资源，准备好所有素材。
2. **生成中间项目**：Unity 会根据你的设置，生成一个标准的 Android 项目结构（即使是生成 APK，内部也会经历这一步）。
3. **调用构建工具（核心步骤）**：Unity 会自动调用你电脑上已配置好的 Android SDK 和 NDK 中的工具。
   - 资源文件（如图片、声音）会由 `aapt`工具进行编译和打包。
   - C/C++ 代码（包括 Unity 引擎底层或你使用的原生插件）由 NDK 编译成对应 CPU 架构的 `.so`库。
   - 所有组件最终被打包、对齐优化 (`zipalign`)，并进行数字签名 (`apksigner`)，生成最终的 APK 文件。

所以，你看到的“直接生成APK”，实际上是 Unity 高效地为你自动化了这一整套复杂的流程。

# 构建工具的作用再Unity项目中

![image-20250928233715389](/notes-assets/Unity%E9%A1%B9%E7%9B%AE%E4%BB%A5%E5%8F%8A%E5%AE%89%E5%8D%93%E6%9E%84%E5%BB%BA/assets/image-20250928233715389.png)

### 核心集成策略与步骤

集成方式主要有两种，对应图中不同的路径，您可以根据项目需求和团队技术栈进行选择。

- **方式一：导出 Gradle 项目（高灵活性）**

  这种方法将 Unity 项目导出为一个标准的 **Android Studio Gradle 项目**。之后的所有 SDK 集成、配置和编译工作都在这个 Gradle 项目中进行。这是目前最被推荐的方式，因为它能直接利用 Android Studio 和 Gradle 强大的依赖管理功能，尤其适合需要集成多个复杂 SDK 或进行深度定制的情况

  - **操作路径**：在 Unity 的 `Build Settings`中，勾选 `Export Project`选项，然后进行构建。将生成的工程文件夹导入 Android Studio
  - **后续步骤**：在 Android Studio 中，您可以像在普通安卓项目中一样，在 `build.gradle`文件中添加 SDK 依赖，并修改 `AndroidManifest.xml`等配置文件

- **方式二：使用原生插件（AAR/JAR）（高自动化）**

  这种方法更贴近您提到的“构建工具”概念。您首先在 Android Studio 中创建一个**安卓库模块（Android Library Module）**，将所需的外部 SDK 集成到这个模块中，并编写与 Unity 交互的桥接代码。然后，将该模块编译成 `AAR`（或 `JAR`）文件以及对应的资源文件，作为 **Unity 原生插件（Native Plugin）** 直接放入 Unity 项目的 `Assets/Plugins/Android`目录下

  。最终，直接由 Unity 完成 APK 的打包。

  - **优势**：一旦插件制作完成，在 Unity 中的使用和打包过程非常简便，易于实现自动化构建流程

无论选择哪种方式，在 Android Studio 中都需要完成一些**共同的配置核心**：

- **依赖管理**：在 `build.gradle`文件中正确添加第三方 SDK 的依赖项
- **清单文件配置**：在 `AndroidManifest.xml`中添加必要的权限、Activity 声明和元数据（如 AppKey）
- **编写桥接代码**：这是实现 C# 与 Java/Kotlin 通信的关键。通常需要创建继承自 `UnityPlayerActivity`的 Activity，并使用 `UnitySendMessage`等方法实现双向通信

**总结：Unity 之所以能“直接”打包 APK，是因为它内部整合并自动调用了一整套 Android 原生构建工具链（如 SDK 和 NDK），将您的 C# 代码和游戏资源转换、编译并打包成 Android 系统可识别的格式；而当您需要集成外部 SDK（如登录、支付）时，本质上是在这套自动化流程中，手动添加并配置这些 SDK 对应的原生代码（Java/.so）和依赖，使其能够被 Unity 的工具链正确识别并打包进最终的 APK 中**

# 将原生库制作成UnityPackage是什么意思？

**把用C/C++或Java编写的原生代码（及其所有必要文件）打包成一个标准的 `.unitypackage`文件**。这样，无论是你自己在不同项目间复用，还是分享给团队或发布到资源商店，都能实现“一键导入”，极大简化了集成过程

![image-20250928235818118](/notes-assets/Unity%E9%A1%B9%E7%9B%AE%E4%BB%A5%E5%8F%8A%E5%AE%89%E5%8D%93%E6%9E%84%E5%BB%BA/assets/image-20250928235818118.png)

1. **准备核心材料**

   - **编译原生库**：这是基础。你需要使用 Android NDK 将 C/C++ 代码编译成针对不同手机处理器架构（如 arm64-v8a, armeabi-v7a）的 `.so`共享库，或者在 Android Studio 中将 Java 代码打包成 `.jar`或 `.aar`文件。**关键点**：确保编译的是包含调试符号的 Debug 版本，以便后续排查问题

   - **编写C#封装脚本**：这是实现“一键调用”的关键。你需要编写 C# 脚本，利用 `DllImport`（针对 C/C++ 库）或 `AndroidJavaClass`/`AndroidJavaObject`（针对 Java 库）来调用原生函数。一个好的做法是创建一个**单例管理类**，统一处理所有与原生层的交互，并处理好平台差异（例如，在编辑器模式下返回模拟值）

2. **组织标准文件结构**

   在 Unity 项目中，文件必须放在特定的文件夹里，Unity 才能正确识别和处理它们。一个专业的 UnityPackage 会严格遵循以下结构：

   ```
   Assets/
   └── Plugins/
       └── Android/
           ├── arm64-v8a/        # 64位ARM架构的.so文件
           ├── armeabi-v7a/      # 32位ARM架构的.so文件
           ├── your-plugin.aar   # 或.jar文件
           └── AndroidManifest.xml # 必要的权限或组件声明
   ```

   将你编译好的 `.so`、`.aar`等文件，以及可能需要的 `AndroidManifest.xml`（用于声明权限等）和资源文件，按照上述结构放置

3. **导出UnityPackage**

   一切准备就绪后，在 Unity Editor 中点击 `Assets > Export Package...`，在弹出的窗口中勾选所有与你插件相关的文件（包括原生库、C#脚本、文档等），然后导出即可生成 `.unitypackage`文件

# 构建工具与原生库制作UnityPackage的联系？

目的：将外部SDK集成、封装成UnityPackage以及实现自动化构建这三者结合，可以构建一个高度自动化、可复用的开发流水线。

![image-20250929000241172](/notes-assets/Unity%E9%A1%B9%E7%9B%AE%E4%BB%A5%E5%8F%8A%E5%AE%89%E5%8D%93%E6%9E%84%E5%BB%BA/assets/image-20250929000241172.png)

### 将外部SDK封装为UnityPackage

这一步的目的是将平台相关的复杂性封装起来，为游戏项目提供干净、统一的C#接口。其核心工作是创建**原生插件（Android Plugin）** 和**桥接层**。

- **核心组件**：你需要将SDK提供的 `AAR`、`JAR`或 `.so`库文件，以及可能需要的资源文件和 `AndroidManifest.xml`配置，按照Unity的标准目录结构（通常放在 `Assets/Plugins/Android`下）进行组织。
- **核心工作：编写桥接代码**
  - **Java/Kotlin桥接层**：在Android Studio中创建一个库模块，编写原生代码来封装对第三方SDK的调用。这部分代码需要提供静态方法，以便C#调用，并处理好通过 `UnityPlayer.UnitySendMessage`将结果回调给Unity。
  - **C#封装层**：在Unity中，使用 `AndroidJavaClass`和 `AndroidJavaObject`来调用上一步编写的原生桥接方法。最佳实践是定义一个C#接口或抽象类，为游戏逻辑提供一套不依赖具体SDK的实现。
- **打包为UnityPackage**：所有相关文件（原生库、C#脚本、文档）准备就绪后，使用Unity Editor的 `Assets > Export Package...`功能，将它们打包成一个标准的 `.unitypackage`文件。这样就能像导入其他资源一样，在不同项目中轻松共享和复用这个SDK功能模块。

### 🤖 2. 创建自动化构建脚本

当你的项目中可能包含多个这样的UnityPackage（如不同渠道的登录、支付SDK）时，自动化构建就变得至关重要。

- **核心工具**：Unity提供了强大的**命令行接口**。你可以使用 `-batchmode`（批处理模式）和 `-executeMethod`参数来在无界面的情况下执行预先编写好的Editor脚本。
- **脚本任务**：一个完整的构建脚本（例如 `BuildScript.cs`）需要处理以下任务：
  - **设置构建参数**：自动配置 `PlayerSettings`，如应用标识符（Bundle Identifier）、版本号、公司名称等。
  - **管理渠道配置**：根据目标渠道（如华为、小米），动态替换或注入特定的配置文件（如 `AndroidManifest.xml`中的AppID）。
  - **调用构建管线**：最终调用 `BuildPipeline.BuildPlayer`方法，并指定输出为Gradle项目或直接生成APK。

### 🔄 3. 结合与进阶：实现CI/CD

将上述两部分结合起来，就形成了自动化的核心。你可以通过持续集成工具（如Jenkins、GitLab CI、GitHub Actions）来定时或由代码触发整个流程。

- **流程衔接**：CI/CD流水线中的一条典型命令可能是：

  ```
  Unity -batchmode -projectPath /path/to/your/project -executeMethod BuildScript.BuildAllChannels -quit
  ```

- **使用Gradle项目**：一个更灵活的做法是让Unity**导出Gradle项目**，而不是直接生成APK

  。这样，你可以在最终打包前，在Gradle脚本中拥有极大的灵活性，例如轻松管理复杂的产品风味（`productFlavors`）和依赖关系

  。这对于需要为几十个甚至上百个渠道打包的场景尤其有效。

### 💡 实践建议与常见策略

- **接口抽象**：为同类功能（如支付）定义统一的C#接口，让游戏核心逻辑只与接口交互。这样，切换不同渠道的SDK实现时，业务代码无需改动
- **配置化**：将所有渠道相关的参数（AppID、密钥等）维护在外部配置文件（如JSON、XML）中，由构建脚本自动读取和注入，避免硬编码
- **错误处理与日志**：在自动化脚本中加入完善的日志记录和错误处理机制，便于快速定位打包失败的原因

# Cmake，makefile，Xshell的作用？

| 工具         | 角色定位             | 核心价值                                                     | 在自动化流水线中的典型动作                                   |
| :----------- | :------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **CMake**    | **项目架构师**       | **跨平台配置**。用一份`CMakeLists.txt`文件定义项目结构、依赖和编译规则，为不同平台（Linux/Mac/Windows）生成对应的原生构建脚本。 | `cmake -B build .`(在指定目录生成构建文件)                   |
| **Makefile** | **施工队长**         | **精确执行与控制**。包含具体的编译、链接指令和文件依赖关系，指挥编译器（如gcc）将源代码变成可执行文件或库（.so/.a）。 | `make -C build`(在指定目录读取Makefile并执行编译)            |
| **XShell**   | **远程指挥与物流官** | **安全远程访问与自动化**。通过SSH等协议安全地登录到远程构建服务器或设备，执行命令、传输文件，并可通过脚本将整个流程自动化。 | `xshell.exe -newtab ssh user@build-server "cd /path/to/project && make"` |

### 💡 理解它们的协同工作流程

理解了各自的分工后，我们再来看一个典型的自动化场景，比如“每晚自动为Android构建不同CPU架构的原生库”：

1. **配置（CMake）**：在您的开发机上，CMake根据 `CMakeLists.txt`中的配置，为 `arm64-v8a`和 `armeabi-v7a`等不同Android架构**生成对应的Makefile**。这个过程会指定交叉编译工具链（Android NDK）。
2. **编译（Makefile + Make）**：在持续集成（CI）服务器上（可能通过XShell远程触发），**Make工具读取Makefile**，调用NDK中的编译器，只编译改动过的文件，最终产出各架构的 `.so`库文件。这一步是真正的“施工”阶段
3. **部署与集成（XShell）**：XShell通过内嵌的SFTP功能（或配合Xftp），**将编译好的 `.so`库文件安全地传输到Unity项目的 `Plugins/Android`目录下**。随后，可以继续通过XShell执行命令行，触发Unity的批量打包流程，生成最终的APK

### 🔧 进阶应用与技巧

将这三者结合，可以构建非常强大的自动化流程：

- **脚本化一切**：您可以编写一个Shell脚本或批处理文件，将CMake配置、Make编译、文件复制等命令按顺序写进去。然后，在XShell中只需执行这一个脚本，即可完成全套动作，实现“一键构建”
- **与CI/CD工具集成**：在现代开发中，像Jenkins、GitLab CI/CD这样的工具可以自动侦听代码仓库的变更。当发现代码更新时，它们可以自动启动一个干净的构建环境（如Docker容器），并在其中执行上述CMake和Make命令，实现全自动的持续集成和持续部署。

# 总结

![image-20250929002136088](/notes-assets/Unity%E9%A1%B9%E7%9B%AE%E4%BB%A5%E5%8F%8A%E5%AE%89%E5%8D%93%E6%9E%84%E5%BB%BA/assets/image-20250929002136088.png)

这套流程的关键优势在于，它将复杂的、多步骤的构建任务**模块化**和**自动化**了。下面我们对其中几个关键环节的价值和实践要点进行补充说明。

### 🔧 关键环节的深度解读

1. **原生库制作（CMake/Makefile）的价值**

   - **跨平台与标准化**：正如您所理解的，使用CMake可以编写一份通用的构建配置（`CMakeLists.txt`），从而为Windows、Linux、macOS等不同平台生成对应的Makefile或项目文件。这极大地简化了跨平台原生库的编译管理
   - **增量编译效率**：Make工具会检查文件时间戳，只重新编译改动过的源文件，这在项目庞大时能**显著提升编译速度**
   - **自动化基础**：正是由于CMake和Make可以通过命令行调用，才使得我们能够用XShell等工具编写脚本，将编译过程自动化。

2. **封装为UnityPackage的意义**

   - **创建可复用模块**：将编译好的原生库（.so、.aar）、配套的C#桥接脚本、文档和示例场景打包成一个`.unitypackage`文件，相当于创建了一个独立的**功能模块**

     。这个模块可以在不同的Unity项目中轻松导入和复用，也便于进行版本管理和小队协作。

   - **职责分离**：负责核心算法或底层功能的开发者和Unity逻辑开发者可以并行工作，只要定义好清晰的接口（API），最终通过UnityPackage集成，这符合现代软件工程的**高内聚低耦合**原则。

3. **导出到Android Studio的必要性**

   - **处理复杂依赖**：当您的游戏需要集成多个第三方SDK（如登录、支付、广告）时，这些SDK之间可能存在资源或配置冲突。在Android Studio中，您可以利用Gradle强大的依赖管理能力，更灵活地解决这些问题
   - **深度定制与调试**：在Android Studio中，您可以方便地修改或合并`AndroidManifest.xml`文件，添加权限、注册Activity，甚至编写原生的Java/Kotlin代码来处理特定的安卓系统行为。此外，您还可以使用Android Profiler等工具进行**原生层面的深度性能分析和调试**

### 🚀 迈向更高阶的自动化：CI/CD流水线

您已经提到了使用XShell执行脚本，这其实就是自动化的雏形。在实践中，这一整套流程可以进一步整合到**持续集成/持续部署（CI/CD）** 流水线中（例如使用Jenkins、GitLab CI/CD或GitHub Actions）。

在CI/CD流水线中，您可以配置一个监听器，当代码仓库有新的提交时，自动触发以下序列化操作：

1. **拉取最新代码**：从Git等版本控制系统拉取Unity项目代码和原生库代码。
2. **编译原生库**：在配置好的构建服务器上，执行CMake和Make命令，编译出各平台（如arm64-v8a, armeabi-v7a）的原生库。
3. **生成UnityPackage**：自动将新版原生库替换到指定位置，并调用Unity命令行执行一个Editor脚本，将最新组件打包成UnityPackage。
4. **构建APK**：将新生成的UnityPackage导入一个统一的Unity主项目，然后通过Unity命令行导出Gradle项目，并自动调用Gradle命令编译出最终的可测试APK。

这样一来，从代码提交到生成可测试安装包的整个过程都无需人工干预，极大提升了开发效率和版本质量。
