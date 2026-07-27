---
title: Unity安卓平台开发
date: 2026-06-27 04:28:00
categories:
  - Unity/游戏客户端
tags:
  - Unity项目以及安卓构建
  - 笔记
---
# 基础部分

## Unity内发布安卓应用程序安装包.apk

### 📋 前期环境准备

在开始打包前，确保你的开发环境配置正确，这是成功构建APK的基础。

- **安装必要的软件**：你需要安装 **Unity Hub** 和 **Unity Editor**，并在安装时务必勾选 **Android Build Support** 模块（包含Android SDK & NDK工具）。同时，还需要安装 **Java JDK** 

  和 **Android Studio**（主要用于获取和更新SDK）

- **配置Unity路径**：安装完成后，打开Unity，依次点击 `Edit`> `Preferences`> `External Tools`，在这里分别设置 **JDK**、**Android SDK** 和 **NDK** 的本地安装路径。这能确保Unity在构建时能找到所需的工具链

![image-20250928151457943](/notes-assets/Unity%E9%A1%B9%E7%9B%AE%E4%BB%A5%E5%8F%8A%E5%AE%89%E5%8D%93%E6%9E%84%E5%BB%BA/assets/image-20250928151457943.png)

### ⚙️ Unity项目配置

环境准备好后，接下来是对你的Unity项目进行针对Android平台的专项设置。

1. **切换平台**：打开你的项目，依次点击 `File`> `Build Settings`，在平台列表中选择 **Android**，然后点击 **Switch Platform** Unity会开始转换资源以适应Android平台，请耐心等待完成。
2. **关键Player设置**：在 `Build Settings`窗口中点击 **Player Settings** 按钮，或直接通过 `Edit`> `Project Settings`> `Player`打开设置面板。以下是一些核心配置：
   - **标识信息**：
     - **Company Name**：你的公司或组织名称。
     - **Product Name**：应用安装后显示的名称。
     - **Package Name**：采用反向域名格式（如 `com.YourCompany.YourGame`），这是应用的唯一标识，非常重要
   - **版本信息**：
     - **Version**：面向用户的应用版本号（如1.0.0）。
     - **Version Code**：内部版本号，必须是整数，每次发布新版本都应递增
   - **API级别设置**：在 `Other Settings`区域，设置 **Minimum API Level**（应用支持的最低安卓版本）和 **Target API Level**（应用为之优化的安卓版本）。请根据你目标用户的设备情况合理设置，通常最低API级别不应低于你的主要用户群所使用的最低系统版本
3. **添加场景**：在 `Build Settings`窗口的 `Scenes In Build`部分，确保将游戏所需的所有场景都添加进来。只有在此列表中的场景才会被打包到APK中

### 🔨 构建与导出APK

所有配置确认无误后，就可以开始构建APK文件了。

- **直接构建APK（推荐）**：在 `Build Settings`窗口中点击 **Build** 按钮，然后选择一个文件夹用于保存生成的APK文件。Unity会自动完成编译和打包过程

  这是最常用和直接的方法。

- **导出为Android Studio项目（高级）**：对于一些需要深度定制原生代码（如接入特定SDK）的复杂项目，可以选择 `Export Project`选项。这将生成一个可以在Android Studio中打开和进一步配置的项目，最终在Android Studio中完成APK的构建

## Android Studio打包安卓应用

![image-20250928153431425](/notes-assets/Unity%E9%A1%B9%E7%9B%AE%E4%BB%A5%E5%8F%8A%E5%AE%89%E5%8D%93%E6%9E%84%E5%BB%BA/assets/image-20250928153431425.png)



![image-20250928153515843](/notes-assets/Unity%E9%A1%B9%E7%9B%AE%E4%BB%A5%E5%8F%8A%E5%AE%89%E5%8D%93%E6%9E%84%E5%BB%BA/assets/image-20250928153515843.png)

![image-20250928153449549](/notes-assets/Unity%E9%A1%B9%E7%9B%AE%E4%BB%A5%E5%8F%8A%E5%AE%89%E5%8D%93%E6%9E%84%E5%BB%BA/assets/image-20250928153449549.png)



### 基本打包流程

1. **配置构建信息**

   打开项目中的 `app/build.gradle`文件，确保 `android`块中的基本配置正确，例如 `applicationId`（应用的唯一标识）、`versionCode`（内部版本号）和 `versionName`（用户可见的版本号）

2. **生成签名 APK/App Bundle**

   这是为应用正式签名以便发布的关键步骤

   - 在 Android Studio 菜单栏中，依次选择 **Build** > **Generate Signed Bundle / APK**
   - 选择是生成 **APK** 还是 **Android App Bundle**。App Bundle 是 Google Play 推荐的应用发布格式，能生成更优化的 APK
   - 如果你还没有密钥库（Keystore）文件，点击 **Create new...** 来创建一个。你需要填写密钥库路径、密码、密钥别名、密钥密码以及证书有效期（建议至少 25 年）等信息。请务必妥善保管此密钥库文件，它是应用更新的唯一凭证
   - 如果已有密钥库文件，选择 **Choose existing...** 并填写相应密码
   - 在后续窗口中，选择构建变体为 **release**，并建议同时勾选 **V1 (Jar Signature)** 和 **V2 (Full APK Signature)** 签名版本以增强安全性
   - 点击 **Finish**，Android Studio 就会开始构建并生成已签名的应用文件

### ⚙️ 其构建方法与安全建议

- **使用 Gradle 生成**

  你也可以通过配置 `app/build.gradle`文件来定义签名配置（在 `signingConfigs`块中），然后在 `buildTypes`的 `release`块中应用它。之后，可以通过点击 Android Studio 右侧的 **Gradle** 面板，找到 **app** > **Tasks** > **build** 下的 **assemble** 或 **assembleRelease** 任务来生成 APK

  。这种方式便于自动化构建。

- **保护签名信息**

  为了避免签名密码等敏感信息直接暴露在 `build.gradle`文件中，建议将这些信息（如密钥库密码、密钥密码）以键值对的形式存储在项目的 **`gradle.properties`** 文件中（确保该文件已从版本控制系统如 Git 中排除），然后在 `build.gradle`文件中引用这些变量

  。这能有效防止敏感信息泄露。

## 如何调试

### 调试准备工作

| 步骤                       | 操作                                                         | 关键点/说明                                                  |
| :------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **1. Unity 项目配置**      | 在 Unity Editor 中，打开 `File > Build Settings`，选择 **Android** 平台，点击 **Switch Platform**。 | 确保项目已转换为 Android 环境。                              |
|                            | 在 `Player Settings`（通常位于 `Build Settings`窗口左下角）中，检查或设置 **Bundle Identifier**（包名），并配置 **Minimum API Level**。 | 包名需符合反向域名规则（如 `com.YourCompany.YourGame`）。    |
|                            | 在 `Other Settings`部分，勾选 **x86** 架构（如果计划使用 Android Studio 自带的模拟器进行调试）。 | 模拟器通常基于 x86 架构，仅勾选 ARMv7/ARM64 将无法在模拟器上运行。 |
|                            | 在 `Build Settings`窗口中，勾选 **Export Project** 选项，然后点击 **Export** 按钮选择一个文件夹导出项目。 | **这是关键一步**。这会生成一个标准的 Gradle 项目，而不是直接的 APK 文件。 |
| **2. 导入 Android Studio** | 启动 Android Studio，选择 **Open an existing Android Studio project**。 | 不要选择 "Import Project" (Gradle, Eclipse etc.)，直接 "Open" 即可。 |
|                            | 导航到上一步中 Unity 导出的文件夹（该文件夹通常包含 `gradle`、`libs`等文件和目录），选择并打开。 | Android Studio 会自动识别并开始同步 Gradle 项目。            |
| **3. 项目结构与同步**      | 等待 Android Studio 完成项目的索引和 Gradle 同步。           | 如果遇到网络问题导致依赖下载失败，可能需要配置国内镜像源，例如将 `repositories`中的 `google()`和 `jcenter()`替换为阿里云镜像。 |
| **4. 连接设备与运行**      | 通过 USB 连接你的 Android 设备或在 Android Studio 中创建并启动一个 AVD（Android 虚拟设备）。 | 在设备上需开启 **USB 调试** 模式。                           |
|                            | 在 Android Studio 中，点击工具栏上的 **Run 'app'** 按钮（绿色的三角形）。 | 这会将项目编译、安装并运行到你的设备或模拟器上。             |

### 🐛 开始调试与排查问题

当项目成功在设备上运行后，就可以开始核心的调试工作了。

- **使用 Logcat 查看日志**

  这是最基础也是最重要的调试手段。在 Android Studio 中，点击左下角的 **Logcat** 标签页。确保设备选择正确，然后你就可以看到应用程序输出的所有日志信息，包括来自 Unity 的 `Debug.Log`信息以及系统和其他库的详细输出。你可以通过标签 (Tag) 或关键字（如你的包名）来过滤日志，快速定位问题。

- **启用脚本调试（可选高级步骤）**

  如果问题可能出在 C# 脚本逻辑上，你可以在 Unity 导出项目前进行更深入的配置：在 `Build Settings`中，勾选 **Development Build** 和 **Script Debugging** 选项。这样，当应用在设备上运行时，你可以在 Unity Editor 中选择 `Debug > Attach to Unity Player`来尝试连接，但这通常需要设备与编辑器在同一网络下，且设置相对复杂。对于大多数与 Android 原生层相关的问题，Logcat 通常已经足够。

### 💡 常见问题与解决思路

| 问题                           | 可能原因与解决思路                                           |
| :----------------------------- | :----------------------------------------------------------- |
| **Gradle 同步失败**            | **网络问题**：检查 Gradle 能否正常下载依赖。可尝试配置可靠的镜像源。 **版本不兼容**：确保 Android Studio 使用的 Gradle 版本与 Unity 导出的项目兼容。 |
| **安装失败或闪退**             | **架构不匹配**：如果在模拟器上运行失败，请确认在 Unity 中已勾选 x86 架构。 **最低 API 等级过高**：检查设备系统版本是否满足 `Player Settings`中设置的 **Minimum API Level**。 **权限问题**：检查 `AndroidManifest.xml`是否声明了应用所需的权限。 |
| **Logcat 中看不到 Unity 日志** | 确保在 Logcat 视图中选择了正确的设备和应用进程（通常与你的包名一致）。应用启动后进程列表才会更新。 |

### 💎 核心价值总结

通过将 Unity 项目导出到 Android Studio 进行调试，你获得了直接访问 **Android 原生层日志（Logcat）** 的能力，这对于诊断权限问题、原生库（.so 文件）崩溃、与 Android 系统服务的交互异常等至关重要。这个方法将 Unity 的强大内容创作能力与 Android Studio 的专业原生开发调试环境结合了起来。

### 🔍Unity Romote

Unity Remote 是一款由 Unity Technologies 官方提供的移动端应用，支持 Android、iOS 和 tvOS 设备。它的核心功能是**将 Unity 编辑器的画面实时投射到移动设备上**，同时将设备的输入数据（如触摸、传感器等）传回编辑器，使开发者无需反复打包安装即可快速测试游戏在真机上的表现/

##### **支持的功能与输入类型**

Unity Remote 能够传输以下设备输入数据到 Unity 编辑器：

- **触摸与手写笔输入**（多点触控）

- **运动传感器**：加速度计、陀螺仪

- **定位与环境传感器**：GPS、电子罗盘

- **摄像头画面**（支持实时流）

- **外接手柄**（识别手柄名称并传输输入信号

  #### ⚙️ **配置步骤**

  1. **安装 Unity Remote 应用**
     - Android：从 Google Play下载。
     - iOS/tvOS：从 App Store下载
  2. **连接设备到电脑**
     - 使用 USB 数据线连接设备与开发机。
     - **Android 设备**需开启 USB 调试模式（设置 > 开发者选项 > USB 调试）
     - **iOS 设备**需确保电脑已安装 iTunes（Windows）或使用原生 USB 连接（macOS）
  3. **在 Unity 编辑器中设置**
     - 打开 `Edit > Project Settings > Editor`。
     - 在 **Unity Remote** 分区中，将 `Device`选择为已连接的设备

  ### 🎮 **使用方式**

  - 在编辑器中点击 **Play** 按钮，游戏画面将同时显示在设备屏幕和编辑器 Game 视图中。
  - 此时在设备上的所有操作（如摇动手机、触摸屏幕）都会实时传递到编辑器，脚本会像在真机上运行一样响应这些输入

  #### ⚠️ **重要注意事项**

  - **性能不代表最终效果**：游戏实际仍在编辑器上运行，设备仅接收画面流。因此**性能（帧率、加载速度）不能反映最终打包后的表现**，定期进行完整构建测试是必要的
  - **平台依赖编译问题**：如果脚本中使用了平台条件编译（例如 `#if UNITY_IOS`），需注意编辑器中的目标平台设置可能与实际设备平台不一致，建议在测试时将编辑器目标平台设置为设备对应的平台（如 Android 或 iOS）
  - **多设备连接限制**：Unity Remote **不支持同时连接多个 Android 设备**（编辑器会自动选择第一个检测到的设备），但可以同时连接一台 Android 设备和多台 iOS/tvOS 设备

  🖼️ **画面质量优化**

  由于带宽限制，默认画面会经过压缩且帧率较低。可通过以下设置提升画质（`Edit > Project Settings > Editor > Unity Remote`）：

  - **压缩方式**：默认 JPEG（有损压缩），可改为 **PNG**（无损压缩，画质更清晰但占用更多带宽）
  - **分辨率**：默认降低分辨率以节省带宽，可设置为 **Normal** 以使用原始分辨率预览

  🔄 **版本兼容性**

  - Unity Remote 已取代旧版的 **iOS Remote** 和 **Android Remote**，旧版应用不再受支持
  - 对于使用更早版本 Unity（如 5.6）的遗留项目，可能需要使用旧版 Unity Remote，具体请参考 Legacy 文档

总结：当我们在Unity编辑运行项目时，移动设备上安装的UnityRemote会和Unity连接，Unity编辑器中的游戏画面会被发送到移动设备中，移动设备的输入和输出操作会返回到Unity编辑器的项目中 

### Android Logcat

| 功能模块         | 核心用途/操作                                    | 关键要点                                                     |
| :--------------- | :----------------------------------------------- | :----------------------------------------------------------- |
| **环境准备**     | 确保Unity项目支持Android平台并导入Logcat包。     | Unity 2019.4+，安装Android模块，通过Package Manager导入Android Logcat包。 |
| **设备连接**     | 通过USB或Wi-Fi将Android设备连接到Unity编辑器。   | 需开启设备的**开发者模式**和**USB调试**。Wi-Fi连接通常需先用USB连接并配对。 |
| **基础日志查看** | 在Unity Editor中实时查看设备日志，过滤应用信息。 | 窗口路径：`Window > Analysis > Android Logcat`（快捷键 `Alt+6`）。选择设备和应用包名，使用搜索框过滤日志。 |
| **高级功能**     | 屏幕捕获、录屏、内存监控、堆栈跟踪解析等。       | 提供**屏幕截图**和**屏幕录制**功能。可查看设备**实时内存统计**。能解析Native崩溃堆栈，需配置符号表路径。 |

- **精准过滤日志**：除了通用的搜索，你可以利用 **Tag 过滤**功能。在Logcat窗口的日志列表里右键任意日志，可以快速添加或排除特定Tag，这对于聚焦你自定义的日志输出非常有效。你还可以按日志优先级（Verbose, Debug, Info, Warn, Error, Fatal）进行筛选
- **保存与分享日志**：当发现问题时，你可以选中全部或部分日志，右键选择保存，将日志内容导出为文本文件，方便分享给同事或后续分析
- **处理多设备情况**：如果同时连接了多台设备，务必在Logcat窗口顶部的设备列表中选择正确的目标设备，以确保日志输出不会混淆
- **确保获取完整的Unity日志**：为了让Unity脚本中`Debug.Log()`等语句输出的日志能正常显示，在打包安装到手机上的APK时，请确保在**Player Settings**中勾选了 **`Development Build`** 选项

#### Logcat内存监控

| 功能模块                    | 关键命令 / 日志特征                                          | 核心作用与解读要点                                           |
| :-------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **实时内存快照**            | `adb shell dumpsys meminfo <应用包名>`                       | 获取应用详细内存使用报告，关注 **PSS**（实际占用的物理内存）和 **Heap Alloc**（Java堆已分配内存）的变化趋势。 |
| **GC垃圾回收日志 (Dalvik)** | `D/dalvikvm: <GC_Reason> freed <Amount_freed>, <Heap_stats>` | **GC_Reason** 是关键：`GC_FOR_ALLOC`表示内存已满被迫回收，是性能瓶颈的信号；`GC_CONCURRENT`是常规并发回收。**Heap_stats** 持续增长可能预示内存泄漏。 |
| **GC垃圾回收日志 (ART)**    | `I/art: <GC_Reason> <GC_Name> freed ... <Heap_stats>, <Pause_time>` | ART的日志更详细。关注 **GC Reason**，如 `Alloc`同样表示堆已满。**Pause_time** 是GC导致的应用停顿时间，过长会影响流畅度。 |
| **内存分配跟踪**            | 使用Android Studio的 **Memory Monitor** 和 **Allocation Tracker** | 记录内存分配的详细调用栈，精准定位到是哪个类、哪个方法分配了大量对象，是优化代码的直接依据。 |

1. **内存抖动（Memory Churn）****现象**：Logcat中GC日志（尤其是`GC_FOR_ALLOC`或`Alloc`原因触发的）出现极其频繁，且每次回收的量很小。**原因**：通常在短时间内创建和销毁大量小对象，如频繁操作字符串或在循环中创建临时对象。**解决**：使用Allocation Tracker定位高频分配点，优化代码逻辑，如采用对象池复用对象。
2. **内存泄漏（Memory Leak）**
   - **现象**：应用内存占用（Heap stats中的活跃对象大小）在离开某个界面或完成某个操作后，持续增长且不下降，最终可能引发 `OutOfMemoryError`
   - **原因**：常见原因包括长生命周期的对象（如单例、静态变量）持有了Activity等短生命周期对象的引用，导致其无法被回收。
   - **解决**：分析堆转储文件，查看泄漏对象的引用链，打破不当的引用关系。

# 进阶部分

## java基础

## kotlin基础

## Unity和Android交互

将Unity项目与Android Studio整合，特别是创建可供Unity调用的Android库（AAR），确实需要一套清晰的流程。下面我为你梳理一个更完整的步骤，并补充一些关键细节和注意事项。

### 📱 第一步：创建Android Studio库项目

1. **创建新项目**：打开Android Studio，选择"Phone and Tablet"，然后选择"**Add No Activity**"。这一步是为了创建一个纯净的库项目基础。
2. **关键配置**： **包名（Package name）** 和 **Minimum SDK版本（minSdkVersion）**：必须与你的Unity项目中 `Player Settings`下的配置**完全一致**。你可以在Unity编辑器中通过 `File > Build Settings > Player Settings`进行查看和设置。 **SDK版本一致性**：如果在Android Studio中找不到Unity项目所要求的SDK版本，你需要通过Android Studio的SDK Manager进行下载安装。

### ⚙️ 第二步：修改项目类型与Gradle配置

1. **修改构建脚本**：在Android Studio中，打开 `app`(或你的Library模块) 下的 `build.gradle`文件。 将 `plugins`块内的 `id 'com.android.application'`修改为 `id 'com.android.library'`。这会将项目从可独立运行的应用程序变为一个库模块。 在 `defaultConfig`配置块中，**删除** `applicationId`这一行。
2. **同步项目**：点击 "**Sync Now**" 按钮，让Gradle同步配置。

### 📦 第三步：导入Unity的核心JAR包

1. **找到JAR包**：根据你的Unity项目脚本后端，前往Unity安装目录下的对应路径查找 `classes.jar`文件。 **Mono版本**：`Unity安装目录\Data\PlaybackEngines\AndroidPlayer\Variations\mono\Release\Classes` **IL2CPP版本**：`Unity安装目录\Data\PlaybackEngines\AndroidPlayer\Variations\il2cpp\Release\Classes`

2. **添加依赖**：将 `classes.jar`文件拷贝到Android Studio项目的 `app/libs`目录下。然后，在 `build.gradle`文件的 `dependencies`块中添加如下依赖项：

   ```java
   dependencies {
       implementation fileTree(dir: 'libs', include: ['*.jar'])
       // ... 其他依赖
   }
   ```

### 📄 第四步：导入UnityPlayerActivity源码（可选但推荐）

1. **定位源码**：前往Unity安装目录下的路径：`Unity安装目录/Data/PlaybackEngines/AndroidPlayer/Source/`。你会看到名为 `com`的文件夹。
2. **拷贝源码**：将整个 `com`文件夹拷贝到Android Studio项目的 `app/src/main/java`目录中。这一步确保了你的Android库拥有与Unity运行时兼容的Activity基础结构，对于需要自定义Activity或处理复杂生命周期交互的场景至关重要。

### ✏️ 第五步：编写你的Java代码

现在你可以在你的Android库项目中编写所需的Java代码了。例如，创建一个可以显示Toast消息的工具类：

```java
package com.yourcompany.uniplugin;

import android.content.Context;
import android.widget.Toast;

public class MyUnityPlugin {
    public static void showToast(Context context, String message) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
    }
}
```

如果你的插件需要包含界面（Activity），可以参考 `UnityPlayerActivity`的写法，继承并重写相关方法。

### 📦 第六步：生成AAR文件

在Android Studio中，点击 **Build > Make Project**。构建成功后，AAR文件会生成在 `app/build/outputs/aar/`目录下，通常会有debug和release两个版本。

### 🔄 第七步：在Unity中使用AAR文件

1. **导入AAR**：在你的Unity项目中，创建 `Assets/Plugins/Android`文件夹。将生成的AAR文件（通常是release版本）复制到这个文件夹内。

2. **一个关键步骤**：用压缩软件（如7-Zip）打开这个AAR文件，**删除**其内部 `libs`文件夹下的 `classes.jar`文件（如果存在）。这是因为Unity本身已经提供了这个jar包，避免冲突。

3. **在C#中调用**：现在你可以在Unity的C#脚本中通过AndroidJavaClass和AndroidJavaObject来调用你写在AAR里的Java方法了：

   ```C#
   using UnityEngine;
   
   public class CallAndroidPlugin : MonoBehaviour {
       void Start() {
           if (Application.platform == RuntimePlatform.Android) {
               using (AndroidJavaObject unityActivity = new AndroidJavaClass("com.unity3d.player.UnityPlayer").GetStatic<AndroidJavaObject>("currentActivity")) {
                   // 调用你的静态方法
                   unityActivity.Call("runOnUiThread", new AndroidJavaRunnable(() => {
                       new AndroidJavaClass("com.yourcompany.uniplugin.MyUnityPlugin").CallStatic("showToast", unityActivity, "Hello from Unity!");
                   }));
               }
           }
       }
   }
   ```

### ⚠️ 重要提醒

- **清单文件（AndroidManifest.xml）合并**：如果你的AAR中包含自定义的Activity或需要特定权限，它可能会携带自己的 `AndroidManifest.xml`。Unity在构建时会将这个清单文件与它自己的主清单文件合并。你需要确保其中的配置（如权限、Activity声明）是正确的，并且不会与Unity的配置冲突。
- **ProGuard混淆**：如果你在构建AAR时启用了代码混淆（ProGuard），请确保为Unity相关的API和你的公共方法添加了保留规则，防止它们被混淆导致Unity无法调用。

## 安卓平台，第三方SDK接入
