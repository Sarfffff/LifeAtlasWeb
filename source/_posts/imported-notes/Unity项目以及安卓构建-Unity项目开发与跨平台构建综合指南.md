---
title: Unity项目开发与跨平台构建综合指南
date: 2026-06-27 04:29:00
categories:
  - Unity/游戏客户端
tags:
  - Unity项目以及安卓构建
  - 笔记
---
# Unity项目开发与跨平台构建综合指南

## 1. 制作原生Unity Package

Unity Package (.unitypackage) 是Unity项目中资源、代码和插件的打包格式，便于分享和复用。

- **创建方法**：
  - 在Unity编辑器中，右键点击要打包的资产文件夹，选择"Export Package..."。
  - 勾选需要包含的文件及其依赖项，导出为 `.unitypackage`文件。
- **使用场景**：快速共享插件、资源包，或备份特定功能模块。
- **注意事项**：确保包含所有必要依赖，避免在其他项目中出现资源丢失。

## 2. 命令行Unity打包

Unity支持通过命令行（Command Line）进行自动化构建，这对于持续集成（CI/CD）和批量处理非常有用

- **基本命令结构**：

  ```bash
  Unity.exe -quit -batchmode -projectPath <项目路径> -executeMethod <构建方法名> -buildTarget <目标平台>
  ```

  - `-quit`: 构建完成后退出Unity编辑器。
  - `-batchmode`: 批处理模式，无图形界面。
  - `-projectPath`: 指定Unity项目的路径。
  - `-executeMethod`: 调用编辑器中的静态方法执行构建逻辑。
  - `-buildTarget`: 指定构建平台（如Android、iOS、StandaloneWindows等）。

- **构建脚本示例**：需要在 `Assets/Editor/`目录下创建C#脚本，定义一个静态方法来配置构建参数

  ```bash
  using UnityEditor;
  using UnityEngine;
  
  public class BuildTools
  {
      public static void BuildAndroid()
      {
          BuildPlayerOptions options = new BuildPlayerOptions();
          options.scenes = new[] { "Assets/Scene/Main.unity" }; // 要打包的场景
          options.locationPathName = "Build/Android/app.apk"; // 输出路径
          options.target = BuildTarget.Android; // 目标平台
          options.options = BuildOptions.None; // 构建选项
  
          BuildPipeline.BuildPlayer(options);
      }
  }
  ```

- **应用场景**：自动化构建流程，适合团队开发、每日构建或与CI工具（如Jenkins）集成。

## 3. C#调用C++ (P/Invoke)

在Unity中，C#脚本可以通过P/Invoke（Platform Invocation Services）机制调用C++编写的原生库函数，以提升性能或复用现有C++代码

- **C++侧 (DLL)**: 编写函数并导出。

  ```bash
  // native_lib.cpp
  extern "C" __declspec(dllexport) int Add(int a, int b) {
      return a + b;
  }
  ```

- **C#侧**: 使用 `DllImport`特性声明外部函数。

  ```bash
  using System.Runtime.InteropServices;
  
  public class NativePlugin
  {
      [DllImport("native_lib")]
      public static extern int Add(int a, int b);
  
      void Start()
      {
          int result = Add(3, 5);
          Debug.Log("C++ Add result: " + result);
      }
  }
  ```

- **关键点**：

  - 确保原生库（`.dll`、`.so`、`.dylib`）放置在Unity项目的 `Assets/Plugins`或对应平台子目录下。
  - 注意数据类型的映射（如C#的 `int`对应C++的 `int`）。
  - 处理复杂的结构体和内存管理时需要特别小心

## 4. C++调用Java (JNI)

在Android平台上，C++代码可以通过JNI（Java Native Interface）调用Java方法，常用于访问Android系统的特定API或与Java层逻辑交互。

- **Java侧**: 定义Native方法或要调用的类。

  ```bash
  // JavaClass.java
  package com.example;
  
  public class JavaClass {
      public static String getMessageFromJava() {
          return "Hello from Java!";
      }
  }
  ```

- **C++侧 (JNI)**: 使用JNI函数查找类和方法并调用。

  ```bash
  #include <jni.h>
  
  extern "C" JNIEXPORT jstring JNICALL
  Java_com_example_NativeClass_callJavaMethod(JNIEnv* env, jobject thiz) {
      jclass javaClass = env->FindClass("com/example/JavaClass");
      jmethodID methodId = env->GetStaticMethodID(javaClass, "getMessageFromJava", "()Ljava/lang/String;");
      jstring result = (jstring)env->CallStaticObjectMethod(javaClass, methodId);
      return result;
  }
  ```

- **关键点**：

  - JNI方法签名需准确无误。
  - 注意内存管理和局部引用的释放，避免内存泄漏。
  - 通常在Android原生插件开发中结合使用。

## 5. ./tools/build-aar.sh 打包Android库

AAR（Android Archive）是Android的库文件格式，包含代码、资源和清单文件。`build-aar.sh`脚本通常用于自动化打包AAR

- **脚本典型内容**：

  ```bash
  #!/bin/bash
  # 设置路径和参数
  PROJECT_DIR="/path/to/android/project"
  MODULE_NAME="mylibrary"
  BUILD_TYPE="release"
  
  cd $PROJECT_DIR
  ./gradlew :${MODULE_NAME}:assemble${BUILD_TYPE^} # 执行Gradle构建任务
  # 复制生成的AAR文件到指定输出目录
  cp ${MODULE_NAME}/build/outputs/aar/*.aar ../output/
  ```

- **工作原理**：该脚本通过调用Android Gradle插件（`com.android.library`）的构建任务来编译和打包AAR

- **在Unity中的使用**：将生成的AAR文件（以及可能需要的其他JAR或清单文件）放入Unity项目的 `Assets/Plugins/Android`目录中，Unity在构建Android应用时会自动将其包含在内

## 6. ./tools/build-apk.sh 打包Android版本

`build-apk.sh`脚本用于自动化构建最终的Android APK安装包，它可能整合了前述多个步骤。

- **脚本可能包含的操作**：

  ```bash
  #!/bin/bash
  # 1. 构建Unity项目
  UNITY_PATH="/Applications/Unity/Unity.app/Contents/MacOS/Unity"
  PROJECT_PATH="/path/to/unity/project"
  $UNITY_PATH -batchmode -quit -projectPath $PROJECT_PATH -executeMethod BuildTools.BuildAndroid -logFile build.log
  
  # 2. 或者直接使用Gradle构建已导出的Android工程
  # cd android-project
  # ./gradlew assembleRelease
  ```

- **整合流程**：一个完整的APK构建脚本可能会依次执行：编译C++库 → 生成AAR → 在Unity中执行Android构建（输出APK或Gradle工程） → 必要时执行Gradle的 `assembleRelease`任务。

- **与环境变量的关系**：这些脚本通常会依赖或设置一系列环境变量，如 `JAVA_HOME`、`ANDROID_SDK_ROOT`、`NDK_ROOT`等，以确保构建工具链能够正确找到

## 7. 完整工作流与最佳实践

将这些技术点串联起来，一个常见的面向Android平台的Unity项目开发和构建流程可能如下：

1. **代码开发**：在Unity中用C#编写主要游戏逻辑。
2. **性能关键模块**：用C++实现高性能模块，并通过P/Invoke由C#调用。
3. **Android特定功能**：通过JNI让C++调用Java代码来访问Android系统API。
4. **库打包**：将Java和C++部分打包成AAR文件供Unity使用。
5. **自动化构建**：使用 `build-aar.sh`脚本打包AAR，使用 `build-apk.sh`脚本最终构建APK。

**注意事项**：

- **环境一致性**：确保开发、构建环境（JDK、SDK、NDK、Unity版本）的一致性和正确配置
- **依赖管理**：清晰管理C#、C++、Java之间的依赖关系。
- **错误处理**：在脚本中添加详细的日志输出和错误检查，便于排查问题。
- **安全与兼容性**：注意不同架构（arm64-v8a, armeabi-v7a）的兼容性。

通过理解和掌握这些环节，你就能构建一个高效、自动化且支持原生代码交互的跨平台Unity项目开发流程。

理解你希望在Unity中通过C++调用原生接口来创建界面并显示Android原生组件的需求。这在需要深度定制UI或复用现有Android组件时非常有用。下面我将为你梳理实现思路、关键步骤和注意事项。

实现这一目标通常涉及**两个主要路径**：一是利用Unity提供的Android Java接口（如`AndroidJavaClass`和`AndroidJavaObject`）进行高层交互；二是在更底层，通过C++插件使用JNI（Java Native Interface）与Android系统通信，最终将原生视图嵌入Unity。

# 📱 利用Unity的Android Java接口（推荐用于大多数情况）

Unity内置了`AndroidJavaClass`和`AndroidJavaObject`等类，允许C#脚本直接调用Android Java代码。虽然你的问题中提到C++，但通常C#调用Java足以创建简单界面，C++更多用于高性能计算或复用现有C++库。

1. **获取Android Activity上下文**：几乎所有Android操作都需要当前Activity的上下文。

   ```
   AndroidJavaClass unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
   AndroidJavaObject currentActivity = unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
   ```

2. **在UI线程上运行**：Android的UI操作必须在主线程进行。

   ```
   currentActivity.Call("runOnUiThread", new AndroidJavaRunnable(() => {
       // 在这里创建和显示你的原生UI组件
   }));
   ```

3. **创建和显示原生Android组件**：例如，显示一个Toast提示。

   ```
   AndroidJavaObject toast = new AndroidJavaObject("android.widget.Toast", currentActivity);
   toast.CallStatic<AndroidJavaObject>("makeText", currentActivity, 
       new AndroidJavaObject("java.lang.String", "Hello from Native Android"), 
       toast.GetStatic<int>("LENGTH_SHORT")).Call("show");
   ```

4. **嵌入更复杂的视图**：如按钮、文本框等。这需要获取Unity的根布局并向其中添加视图。

   - 思路是获取 `UnityPlayer`的根 `ViewGroup`（通常是一个 `FrameLayout`），然后使用 `addView`方法将自定义的Android原生视图添加进去。
   - 请注意，这种方式对Unity版本和Android设备可能有兼容性要求，需要仔细处理生命周期和触摸事件的分发。

## ⚙️ 通过C++插件与JNI（用于复杂或高性能需求）

如果你的C++代码已经存在，或者有极高的性能要求，可以通过C++创建共享库（.so），在C++中使用JNI调用Android Java代码来创建UI。

1. **创建C++函数并导出**：在C++中声明一个函数，该函数通过JNI调用Java方法创建UI。

   ```
   #include <jni.h>
   #include <string>
   
   extern "C" JNIEXPORT void JNICALL
   Java_com_yourcompany_yourplugin_NativeLib_showNativeUI(JNIEnv* env, jobject /* this */, jobject activity) {
       // 1. 查找Java类和方法
       jclass toastClass = env->FindClass("android/widget/Toast");
       jmethodID makeTextMethod = env->GetStaticMethodID(toastClass, "makeText", "(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;");
       jmethodID showMethod = env->GetMethodID(toastClass, "show", "()V");
   
       // 2. 创建参数
       jstring message = env->NewStringUTF("Hello from C++/JNI");
       jint duration = 0; // LENGTH_SHORT的值通常是0
   
       // 3. 调用Java方法
       jobject toast = env->CallStaticObjectMethod(toastClass, makeTextMethod, activity, message, duration);
       env->CallVoidMethod(toast, showMethod);
   
       // 4. 释放局部引用
       env->DeleteLocalRef(message);
       env->DeleteLocalRef(toast);
   }
   ```

2. **在Unity C#中调用C++函数**：

   - 将编译好的 `.so`库文件放入Unity项目的 `Assets/Plugins/Android`目录下。
   - 在C#中使用P/Invoke调用该Native函数。

   ```
   [DllImport("your-native-lib")]
   private static extern void showNativeUI(IntPtr androidActivity);
   
   // 调用时，需要将AndroidJavaObject转换为IntPtr
   // 注意：获取jobject指针的方式较为复杂，通常需要借助AndroidJNIHelper等工具
   ```

## 🧩 在Unity中显示Android原生组件

将Android原生组件“嵌入”到Unity画面中，主要有两种方式：

1. **叠加方式 (Overlay)**：将Android原生控件（如Button、TextView）添加到UnityPlayer所在的Activity的窗口布局中。这样原生控件会覆盖在Unity渲染的内容之上。
   - **优点**：实现相对简单。
   - **缺点**：布局位置需要通过坐标精确控制，且需要处理好触摸事件的分发，避免Unity和Android控件同时响应。
2. **集成方式 (Integration)**：修改Android工程，将UnityPlayer作为一个View（或Fragment）嵌入到现有的Android原生布局中，周围再放置其他Android原生组件。
   - **优点**：布局更灵活，可以构建出融合度更高的混合界面。
   - **缺点**：需要导出Android工程（Gradle项目）并在Android Studio中进行大量定制开发，流程更复杂。

### ⚠️ 重要注意事项

- **线程问题**：所有UI操作必须在Android主线程（UI线程）上进行。在C#中务必使用 `runOnUiThread`，在C++/JNI中如果不在UI线程，也需要将任务抛到UI线程执行。
- **生命周期管理**：妥善处理Activity的生命周期（onPause, onResume, onDestroy），确保UI的创建和销毁与生命周期同步，避免内存泄漏和崩溃。
- **权限**：如果需要使用系统功能（如网络、存储），记得在 `AndroidManifest.xml`中声明权限。
- **版本兼容性**：不同Android API等级的设备行为可能有差异，需要进行充分测试。
- **性能考量**：频繁在Unity和Android原生之间通信或创建复杂原生界面可能会对性能产生影响。
- **打包部署**：如果使用自定义的Android代码或修改了Manifest，通常需要将相关文件（.jar、.aar、.so、AndroidManifest.xml等）放在Unity项目的 `Assets/Plugins/Android`目录下。

### 💡 实践建议

对于大多数需要在Unity中显示Android原生UI的场景，**优先考虑使用Unity提供的 `AndroidJavaClass`和 `AndroidJavaObject`在C#中直接操作**。这种方式无需编译本地库，流程更简单，足够满足Toast、对话框、系统设置等常见需求。