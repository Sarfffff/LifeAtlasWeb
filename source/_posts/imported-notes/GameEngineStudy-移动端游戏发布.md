---
title: 移动端游戏发布
date: 2026-06-27 03:50:00
categories:
  - 图形与引擎
tags:
  - GameEngineStudy
  - 笔记
---
# Goggle Play游戏发布

### Goggle Play Console端

- **账号与材料准备**
  - **注册开发者账号**：访问 Google Play Console，使用你的谷歌账号登录并缴纳一次性注册费。务必准确填写开发者名称等信息，因为这将在应用商店中公开显示。
  - **准备应用材料**：除了打包好的应用（APK 或 AAB 文件），你还需要准备：应用图标、截图、宣传图、描述文字、关键词、隐私政策链接等。所有图片素材需符合平台要求的尺寸和格式。
- **应用创建与配置**
  - 在 Play Console 中创建新应用，填写名称、默认语言等基本信息。
  - 需要填写一份内容分级问卷，系统会根据答案自动生成内容分级。
  - 必须提供一个可公开访问的隐私政策链接，详细说明数据收集和使用情况。
- **测试与发布**
  - **充分利用测试轨道**：在上线前，强烈建议使用 Google Play 的测试功能。你可以创建内部测试、封闭式测试或开放式测试，将应用包分发给指定的测试人员，收集反馈并修复问题，这能有效避免上线后的差评。
  - **发布审核**：完成所有配置后，提交应用审核。审核通过后，可以选择手动发布或定时发布



### Unity端项目设置

**Unity 项目关键设置**：在 Unity Editor 的 **Player Settings** 中，以下配置至关重要：

- **包名 (Package Name)**：格式通常为 `com.公司名.产品名`，这在 Google Play 上是应用的唯一标识，发布后不可轻易更改。
- **版本管理**：`Version`是展示给用户的版本号（如 1.0.0），而 `Bundle Version Code`是内部版本代码，每次提交新版本时**必须递增**。
- **API 级别**：`Minimum API Level`决定了应用能安装的最低 Android 版本。`Target API Level`必须设置为符合 Google Play 当前要求的版本（通常为最新或较新的 API 等级）。
- **脚本后端与架构**：在 **Other Settings > Configuration** 下，将 `Scripting Backend`从 Mono 切换到 **IL2CPP**，以获得更好的性能和安全性。同时，在 `Target Architectures`中，**必须勾选 ARM64**，因为 Google Play 要求应用支持 64 位架构。可以视情况同时勾选 ARMv7 以兼容旧设备。
- **应用签名**：在 **Publishing Settings** 中，勾选 `Custom Keystore`并选择或创建一个密钥库文件（.keystore）。请务必妥善保管此文件和密码，这是应用的身份凭证，丢失将无法更新应用。

- **生成上传包**：在 **Build Settings** 窗口中，选择 Android 平台，并务必勾选 **Build App Bundle (Google Play)** 选项。Google Play 现在要求新应用必须使用 Android App Bundle (.aab) 格式提交，它比传统的 APK 更高效。点击构建即可生成所需的 .aab 文件。

![image-20251020130920471](/notes-assets/GameEngineStudy/assets/image-20251020130920471.png)

# IOS游戏发布

环境配置 - >配置Unity项目 ->生成XCode工程并且配置签名 -->真机测试和调试 -->提交至App Store

### 环境配置

- **硬件与软件**：您需要**一台 Mac 电脑**（用于运行 Xcode 进行编译和签名），并安装好最新版本的 **Unity** 和 **Xcode** 。
- **开发者账户**：必须注册 **Apple Developer Program**（苹果开发者计划），年费为 99 美元。这是后续创建证书和上架应用的前提 

### 配置 Unity 项目

在 Unity Editor 中，对项目进行针对 iOS 平台的设置至关重要。

1. **切换目标平台**：打开您的 Unity 项目，依次点击 `File`-> `Build Settings`，在平台列表中选择 **iOS**，然后点击 **Switch Platform** 。

2. **设置 Bundle Identifier**：在 `Build Settings`窗口中点击 `Player Settings`，打开 Player Settings 面板。在 `Other Settings`部分，找到 **Bundle Identifier**。它通常采用 `com.你的公司名.你的产品名`的格式，例如 `com.YourCompany.YourGame`。请确保此标识符是唯一的，因为它将是您应用在 App Store 中的唯一身份标识 。

   **其他关键设置**：在 Player Settings 中，您还需要配置应用在设备上显示的 **Product Name**，上传 **应用图标**，并根据需要调整分辨率、横竖屏等选项 。

### XCode工程并且配置签名

1. **导出 Xcode 项目**：在 Unity 的 `Build Settings`窗口中，点击 **Build** 按钮。选择一个文件夹位置，Unity 将在此生成一个包含所有必要文件的 Xcode 项目（通常包含 `Unity-iPhone.xcodeproj`文件）。
2. **在 Xcode 中配置签名**：在 Finder 中找到生成的 Xcode 项目文件，双击打开。在 Xcode 中，选择项目目标，进入 **Signing & Capabilities** 标签页。在此处：
   - 勾选 **"Automatically manage signing"**（自动管理签名），Xcode 通常会帮助处理很多证书和配置文件工作。
   - 在 **"Team"** 下拉菜单中选择您所属的开发者团队（与您的苹果开发者账户关联）。正确配置后，Xcode 会自动为您生成或选择相应的开发证书（Development Certificate）和配置文件（Provisioning Profile）。配置文件会将开发者、设备及应用 ID 关联起来，对于真机安装测试是必需的 。

### 真机测试和调试

1. **连接设备**：使用 USB 数据线将您的 iOS 设备连接到 Mac 。
2. **选择设备并运行**：在 Xcode 顶部的工具栏中，选择您连接的 iOS 设备作为运行目标，然后点击 **Build and run**（三角形播放按钮）。Xcode 会将应用安装到您的设备并启动它 。
3. **信任开发者**：首次在设备上运行开发版应用时，可能需要进入设备的`设置`> `通用`> `VPN 与设备管理`（或`描述文件与设备管理`），信任与之关联的开发者证书 。

### 发布AppStore

1. **创建应用记录**：登录 App Store Connect，点击“我的 App”，然后点击左上角的“+”按钮来**创建新 App**。在这里，您需要填写应用名称、描述、关键词、截图、宣传图等所有上架所需的元数据 。
2. **构建归档版本**：回到 Xcode，确保在左上角方案设备选择处选择了 **"Any iOS Device (arm64)"** 或类似通用设备。然后，在顶部菜单栏选择 **Product** > **Archive**。归档过程完成后，Xcode Organizer 窗口会自动打开，列出所有已归档的版本 。
3. **上传与提交审核**：在 Xcode Organizer 中，选择刚刚归档的版本，点击 **Distribute App**。在后续流程中，选择 **"App Store Connect"** 作为分发方式，然后按照向导完成上传。上传成功后，返回 App Store Connect，找到您的应用，在“构建”部分选择刚上传的版本，最后提交应用等待苹果审核 。审核通过后，您的应用就可以在 App Store 中供用户下载了。

# 华为鸿蒙游戏发布

| 阶段               | 核心任务/注意事项                                            |
| :----------------- | :----------------------------------------------------------- |
| **技术准备**       | - 使用 Unity 正常进行 Android 平台的构建。鸿蒙系统目前对 Android 应用兼容性良好，通常可沿用 Android 版本。 - 关注鸿蒙 NEXT 的进展。若计划开发纯鸿蒙原生应用，需关注鸿蒙 NDK 和 Unity 未来对 HarmonyOS NEXT 的原生支持。 |
| **华为生态集成**   | - **必须接入华为 HMS Core 的游戏相关服务**，特别是 Game Service Kit（用于账号登录、实名认证等）和 IAP Kit（应用内支付）。网络游戏必须接入华为应用内支付。 - 在 `AndroidManifest.xml`等配置文件中正确配置从华为应用市场获取的 `client_id`和 `app_id`等。 |
| **上架前关键步骤** | - **联系华为技术支持进行游戏软件包验收**：这是正式提交审核前的**必要步骤**，未通过验收直接提审会被驳回。 - **应用签名服务**：华为 AppGallery Connect 提供应用签名服务，强烈建议使用。它由华为安全地管理您的最终签名密钥，可有效防止密钥丢失导致无法更新应用的风险。您需要生成一个“上传密钥”用于向华为提交应用，华为会用它验证您的身份，并用其安全保管的“签名密钥”为最终分发给用户的安装包重签名。 |
| **提交审核与发布** | - 在 AppGallery Connect 后台完善应用信息，包括应用描述、截图、分类、内容分级、隐私政策等。 - 选择发布的国家/地区，设置上架时间并提交审核。审核通常需要1-3个工作日。 |
| **争取推广资源**   | - 若游戏属于**新游首次发布**，可考虑申请“**游戏首发**”。这需要在 AppGallery Connect 的“分发 > 服务 > 首发申请”中提交，**建议至少提前7天申请**。符合条件的游戏有机会获得华为应用市场“精品首发”等位置的曝光资源。 |

![image-20251020184749726](/notes-assets/GameEngineStudy/assets/image-20251020184749726.png)
