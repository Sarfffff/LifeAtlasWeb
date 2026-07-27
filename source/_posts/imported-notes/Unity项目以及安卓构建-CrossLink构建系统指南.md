---
title: CrossLink构建系统指南
date: 2026-06-27 04:26:00
categories:
  - Unity/游戏客户端
tags:
  - Unity项目以及安卓构建
  - 笔记
---
# CrossLink 构建系统指南

本项目提供了完整的自动化构建系统，支持从原生库到Unity Package的全流程自动化构建。

## 快速开始

### 一键构建（推荐）

```bash
# 完整构建流程
make all

# 或使用脚本
./build-all.sh
```

### 快速开发构建

```bash
# 仅构建AAR和同步Unity（适合日常开发）
make quick

# 或使用脚本
./quick-build.sh
```

## 构建命令参考

### Make命令

```bash
# 基本命令
make help          # 显示帮助信息
make all          # 完整构建流程
make quick        # 快速构建（推荐日常使用）
make clean        # 清理所有构建产物
make setup        # 检查构建环境
make status       # 显示构建状态

# 单步构建
make native       # 只构建原生库
make android      # 只构建Android AAR
make unity        # 只同步Unity Package
make test         # 运行测试

# 特殊构建
make debug        # Debug构建
make release      # Release构建（包含清理）
make dev          # 开发构建（quick + test）
```

### 脚本命令

```bash
# 完整构建脚本
./build-all.sh [BUILD_TYPE] [CLEAN_BUILD] [SKIP_TESTS]

# 示例
./build-all.sh                    # 默认Release构建
./build-all.sh Debug             # Debug构建
./build-all.sh Release true      # Release构建 + 清理
./build-all.sh Release false true # Release构建，跳过测试

# 快速构建脚本
./quick-build.sh                  # 快速构建
```

## 构建流程详解

### 完整构建流程

1. **🔍 环境检查**
   - 检查CMake、Android SDK、Gradle、Unity等工具
   - 验证必要的环境变量

2. **🏗️ 构建原生库**
   - 使用CMake构建C++原生库
   - 生成各平台的动态库文件

3. **📦 构建Android AAR**
   - 使用Gradle构建Android AAR包
   - 包含JNI绑定和原生库

4. **🔄 同步Unity Package**
   - 从原生模块复制最新的AAR和Framework
   - 更新Unity插件依赖

5. **📋 更新测试项目**
   - 将Unity Package同步到测试项目
   - 清理不必要的文件

6. **🧪 运行测试**
   - 执行Unity自动化测试
   - 验证功能完整性

7. **📄 生成报告**
   - 创建详细的构建报告
   - 包含构建产物信息

### 快速构建流程

快速构建适用于日常开发，跳过原生库构建（通常不经常变动）：

1. **📦 构建Android AAR**
2. **🔄 同步Unity Package**
3. **📋 更新测试项目**

## 目录结构

```
tudou/
├── build-all.sh              # 完整构建脚本
├── quick-build.sh            # 快速构建脚本
├── Makefile                  # Make构建规则
├── BUILD.md                  # 构建文档（本文件）
│
├── Tudou.CrossLink.Native/   # 原生库模块
│   ├── CMakeLists.txt
│   └── build/                # 构建输出
│
├── Tudou.CrossLink.Android/  # Android模块
│   ├── build-aar.sh
│   └── crosslink-android/
│       └── build/outputs/aar/
│
├── Tudou.CrossLink.iOS/      # iOS模块
│   └── CrossLinkSDK.framework/
│
├── Tudou.CrossLink.Unity/    # Unity Package
│   ├── Scripts/
│   │   └── update-native-dependencies.sh
│   └── Runtime/
│       └── Plugins/
│           ├── Android/      # AAR文件位置
│           └── iOS/          # Framework位置
│
└── CrossLinkUnityTest/       # Unity测试项目
    └── Packages/
        └── com.tudou.crosslink/  # 同步的Package
```

## 环境要求

### 必需工具

- **CMake** 3.15+ - 构建原生库
- **Android SDK/NDK** - 构建Android AAR
- **Gradle** 6.0+ - Android构建工具
- **Unity 2022.3+** - 运行Unity测试（可选）

### 环境变量

```bash
export ANDROID_HOME=/path/to/android/sdk
export ANDROID_NDK_HOME=$ANDROID_HOME/ndk/version
```

### macOS系统

```bash
# 安装Xcode Command Line Tools
xcode-select --install

# 安装CMake (使用Homebrew)
brew install cmake

# 安装Android Studio获取SDK/NDK
```

## 构建配置

### 构建类型

- **Release** (默认) - 优化构建，用于生产
- **Debug** - 调试构建，包含调试信息

### 构建选项

| 选项          | 说明         | 默认值  |
| ------------- | ------------ | ------- |
| `BUILD_TYPE`  | 构建类型     | Release |
| `CLEAN_BUILD` | 是否清理构建 | false   |
| `SKIP_TESTS`  | 是否跳过测试 | false   |

### 使用示例

```bash
# 环境变量方式
export BUILD_TYPE=Debug
make all

# 参数方式
make all BUILD_TYPE=Debug CLEAN=true

# 脚本方式
./build-all.sh Debug true false
```

## 常见问题

### 1. 构建失败

**原因**: 环境配置问题
**解决**: 运行 `make setup` 检查环境

```bash
make setup
```

### 2. Android构建失败

**原因**: Android SDK路径问题
**解决**: 检查ANDROID_HOME环境变量

```bash
echo $ANDROID_HOME
```

### 3. Unity测试失败

**原因**: Unity实例正在运行
**解决**: 关闭Unity编辑器后重试

```bash
# 检查运行的Unity实例
pgrep -f Unity

# 手动运行测试
make test
```

### 4. 权限问题

**原因**: 脚本没有执行权限
**解决**: 添加执行权限

```bash
chmod +x build-all.sh quick-build.sh
```

### 5. 依赖同步问题

**原因**: 文件复制失败
**解决**: 手动运行同步脚本

```bash
cd Tudou.CrossLink.Unity
./Scripts/update-native-dependencies.sh
```

## 高级用法

### 自定义构建

```bash
# 仅构建特定组件
make android           # 只构建AAR
make unity            # 只同步Unity
make native           # 只构建原生库

# 组合构建
make android unity    # 构建AAR并同步Unity
```

### 并行构建

```bash
# CMake并行构建（自动检测核心数）
make native

# Gradle并行构建
cd Tudou.CrossLink.Android
./gradlew assembleRelease --parallel
```

### 持续集成

在CI/CD环境中使用：

```bash
#!/bin/bash
# CI构建脚本

set -e

# 检查环境
make setup

# 执行构建（跳过交互测试）
./build-all.sh Release true true

# 检查构建产物
make status
```

## 性能优化

### 加速构建

1. **使用快速构建**: `make quick` 用于日常开发
2. **避免清理构建**: 仅在必要时使用 `CLEAN=true`
3. **并行构建**: 利用多核CPU并行编译
4. **缓存依赖**: 保留构建缓存目录

### 构建时间参考

| 构建类型 | 预估时间 | 说明              |
| -------- | -------- | ----------------- |
| 快速构建 | 1-2分钟  | 仅AAR + Unity同步 |
| 完整构建 | 3-5分钟  | 包含原生库构建    |
| 清理构建 | 5-8分钟  | 完全重新构建      |

## 开发工作流

### 日常开发

```bash
# 1. 修改Android代码后
make android unity

# 2. 修改Unity代码后
make unity

# 3. 验证功能
make test

# 4. 快速验证（推荐）
make quick
```

### 发布准备

```bash
# 1. 完整构建
make release

# 2. 检查构建产物
make status

# 3. 手动测试验证
# 在Unity编辑器中打开CrossLinkUnityTest项目

# 4. 提交代码
git add .
git commit -m "Release build ready"
```

### 问题调试

```bash
# 1. 清理所有构建产物
make clean

# 2. 检查环境
make setup

# 3. 逐步构建排查问题
make native
make android
make unity
make test

# 4. 查看详细日志
./build-all.sh Debug false false
```

---

## 技术支持

如果遇到构建问题，请提供以下信息：

1. 运行 `make setup` 的输出
2. 运行 `make status` 的输出
3. 具体的错误信息
4. 操作系统和版本信息

联系方式：
- 📧 邮箱: support@tudou.com
- 🐛 问题反馈: GitHub Issues

![image-20250927171413132](/notes-assets/Unity%E9%A1%B9%E7%9B%AE%E4%BB%A5%E5%8F%8A%E5%AE%89%E5%8D%93%E6%9E%84%E5%BB%BA/assets/image-20250927171413132.png)
