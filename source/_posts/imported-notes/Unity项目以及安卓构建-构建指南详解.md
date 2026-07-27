---
title: 构建指南详解
date: 2026-06-27 04:32:00
categories:
  - Unity/游戏客户端
tags:
  - Unity项目以及安卓构建
  - 笔记
---
![image-20250928131005278](/notes-assets/Unity%E9%A1%B9%E7%9B%AE%E4%BB%A5%E5%8F%8A%E5%AE%89%E5%8D%93%E6%9E%84%E5%BB%BA/assets/image-20250928131005278.png)

这份 **CrossLink 构建系统指南** 非常专业和全面，它详细说明了一个支持从原生库到Unity Package全流程自动化构建的系统。下面我为你梳理和解释其中的核心内容、工作流程以及最佳实践。

### 🧠 核心概念与价值

这套构建系统的核心目标是实现 **自动化** 和 **标准化**。它通过 **Makefile** 和 **Shell 脚本** 将复杂的多平台编译、依赖同步和测试流程封装成简单的命令，极大提升了开发效率，保证了构建结果的一致性，尤其适合团队协作和持续集成（CI/CD）环境。

### 💡 为何有时需要更直接地控制构建工具？

既然 Unity 能自动处理，为什么我们有时还需要了解甚至直接使用这些构建工具呢？主要是为了应对更复杂的需求：

- **深度定制**：当你需要深度定制 `AndroidManifest.xml`（比如添加特殊的权限或元数据），或者引入复杂的第三方 SDK（这些SDK可能有自己的依赖和资源冲突）时，可能需要导出 Gradle 项目到 Android Studio 中进行手动配置。
- **疑难排查**：当打包过程出错时，错误信息往往来自底层的构建工具（如 Gradle 报依赖冲突、`aapt`报资源重复）。理解这些工具能帮你更快地定位和解决问题。
- **性能优化**：针对特定的 CPU 架构进行原生库的编译优化，有时需要直接配置 NDK 的编译参数。

### 📁 理解目录结构

构建系统的目录结构组织清晰，模块化程度高，这有助于管理复杂的跨平台代码和依赖：

```
tudou/
├── build-all.sh              # 完整构建脚本
├── quick-build.sh            # 快速构建脚本
├── Makefile                  # Make构建规则 (核心控制)
├── Tudou.CrossLink.Native/   # C++原生库模块 (CMake管理)
├── Tudou.CrossLink.Android/  # Android AAR模块 (Gradle管理)
├── Tudou.CrossLink.iOS/      # iOS Framework模块
├── Tudou.CrossLink.Unity/    # Unity Package主体（含同步脚本）
└── CrossLinkUnityTest/       # Unity测试项目（用于验证Package）
```

这种结构确保了Android、iOS和Unity项目的代码和资源既相互独立，又能通过自动化脚本有机地整合在一起。

### 🧱 构建类型与命令

系统提供了不同粒度的构建命令，适应从日常开发到发布准备的各种场景：

| **命令/脚本**                     | **适用场景**                                 | **关键作用**                                                 |
| --------------------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| `make all`或 `./build-all.sh`     | 完整的构建流程，适合发布前或重大改动后       | 执行从环境检查到生成报告的全套步骤，确保产出的完整性         |
| `make quick`或 `./quick-build.sh` | **日常开发中最常用**，仅构建变动的部分       | 跳过通常不经常变动的原生库构建，极大缩短构建时间，提升开发效率 |
| `make android``make unity`        | 只构建特定模块，适合针对性修改后的快速验证   | 提供细粒度的控制能力                                         |
| `make release`                    | 准备发布版本，通常包含清理操作以确保构建纯净 | 生成优化后的生产环境包                                       |
| `make debug`                      | 需要调试或详细日志时                         | 生成带调试信息的包，便于排查问题                             |

### 🔧 构建流程详解

**完整构建流程** (`make all`) 包含以下关键阶段，这些阶段在 `Makefile`和脚本中通常是顺序执行或具有依赖关系的：

1. **环境检查 (Environment Check)**: 脚本会自动检查 CMake、Android SDK、Gradle 等**必需工具**和 **环境变量**（如 `ANDROID_HOME`）是否正确安装和配置。这是避免构建失败的第一步。
2. **构建原生库 (Native Library Build)**: 使用 **CMake** 配置和编译 C++ 代码，生成 Android (`.so`) 和 iOS (`.framework`) 的动态库文件。这是跨平台功能的底层基础。
3. **构建Android AAR (Android AAR Build)**: 使用 **Gradle** 将上一步的 `.so`库、JNI 接口代码和Java/Kotlin代码打包成标准的AAR文件，便于Unity和其他Android项目引用。
4. **同步Unity Package (Unity Package Sync)**: **这是连接原生代码和Unity的关键步骤**。脚本会将生成的AAR（放入 `Assets/Plugins/Android`）和iOS Framework（放入 `Assets/Plugins/iOS`）**自动复制**到Unity Package的相应目录中，并更新依赖关系。
5. **更新测试项目 & 运行测试 (Update Test Project & Run Tests)**: 将整合好的Unity Package同步到独立的测试项目 `CrossLinkUnityTest`中，并可能运行**自动化测试**来验证功能的完整性和稳定性。
6. **生成报告 (Generate Report)**: 构建完成后生成一份详细的报告，记录构建类型、时间、产物大小等信息，便于追溯和审计。

**快速构建流程** (`make quick`) 则聪明地跳过了第2步（假设原生代码未改动），直接执行第3、4、5步，这是开发者的常用命令。

### 🚀 高效开发工作流

基于这套系统，推荐的日常开发流程是：

1. **开发调试**: 在 `Tudou.CrossLink.Android`或 `Tudou.CrossLink.Unity`中进行代码修改。
2. **快速验证**: 运行 `make quick`（或更精确的 `make android unity`）快速生成并同步最新改动到Unity测试环境。
3. **功能测试**: 在Unity编辑器中打开 `CrossLinkUnityTest`项目进行手动测试，或运行 `make test`执行自动化测试。
4. **问题排查**: 如果遇到问题，使用 `make debug`构建并利用日志和调试工具进行排查。
5. **提交与发布**: 功能稳定后，运行 `make release`进行完整的发布构建，最终提交代码和构建产物。

### ⚠️ 常见问题与解决

构建过程中可能会遇到以下典型问题：

- **环境配置错误**: 确保 `ANDROID_HOME`, `NDK`路径正确。运行 `make setup`可以帮助检查。
- **权限问题**: 给 Shell 脚本 (`build-all.sh`, `quick-build.sh`) 添加执行权限 (`chmod +x *.sh`)。
- **文件同步失败**: 如果自动同步脚本失效，可以尝试手动运行 `Tudou.CrossLink.Unity/Scripts/`下的同步脚本。
- **Unity实例冲突**: 构建或测试时，**确保关闭Unity编辑器**，否则可能导致文件占用或访问冲突。

### 💡 高级技巧与优化

- **并行构建**: 在拥有多核CPU的开发机上，Gradle和CMake都支持并行编译（如 `./gradlew assembleRelease --parallel`），可以显著加快构建速度。
- **缓存利用**: 在非“清理构建”（`CLEAN_BUILD=false`）时，构建系统会利用缓存，避免重复编译未变动的代码。
- **CI/CD集成**: 这套基于命令行的自动化系统能非常方便地集成到Jenkins、GitHub Actions等CI/CD平台中，实现自动化构建、测试和部署。

### ✅ 总结

总而言之，这份指南描述了一个**高度自动化、模块化且高效的跨平台（Android/iOS/Unity）构建系统**。它的核心价值在于：

- **简化流程**: 通过单一命令处理复杂操作。
- **提升效率**: 快速构建模式大幅缩短开发者的等待时间。
- **保证一致性**: 自动化避免了手动操作可能带来的错误。
- **支持协作**: 清晰的目录结构和标准化流程非常适合团队开发。

希望这份详细的解释能帮助你更好地理解和使用这个强大的构建系统！
