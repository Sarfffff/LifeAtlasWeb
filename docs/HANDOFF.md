# 岁迹项目交接指南

本文用于在新电脑上接手开发、验证和部署 `lifeatlas.cn`。项目是纯静态 Hexo 网站，GitHub 保存源码，服务器只存放构建后的 `public` 内容。

## 1. 新电脑准备

安装 Git、Node.js 20 LTS（至少 18）、pnpm，以及 PowerShell。检查环境：

```powershell
git --version
node --version
corepack enable
pnpm --version
```

## 2. 拉取并启动项目

```powershell
git clone https://github.com/Sarfffff/LifeAtlasWeb.git
cd LifeAtlasWeb
pnpm install
pnpm run dev
```

浏览器打开 `http://localhost:4000`。首次安装依赖需要联网，后续不要提交 `node_modules`、`public` 或 `db.json`。

## 3. 日常修改流程

开始修改前同步远程：

```powershell
git switch main
git pull --ff-only
git switch -c feature/简短功能名
```

完成修改后依次验证并提交：

```powershell
pnpm run clean
pnpm run build
pnpm run dev
git status
git add <本次修改的文件>
git commit -m "说明本次修改"
git push -u origin HEAD
```

建议通过功能分支提交，确认无误后再合并到 `main`。不要在同一次提交中混入与当前功能无关的大量笔记或资源文件。

## 4. 发布到服务器

在项目根目录构建并打包：

```powershell
pnpm run clean
pnpm run build
pnpm run package
```

上传并登录服务器：

```powershell
scp .\deploy\lifeatlas-site.tar.gz root@47.122.124.84:/www/wwwroot/lifeatlas.cn/lifeatlas-site.tar.gz
ssh root@47.122.124.84
```

登录服务器后执行：

```bash
cd /www/wwwroot/lifeatlas.cn
tar -xzf lifeatlas-site.tar.gz -C /www/wwwroot/lifeatlas.cn
find /www/wwwroot/lifeatlas.cn -type d -exec chmod 755 {} \;
find /www/wwwroot/lifeatlas.cn -type f -exec chmod 644 {} \;
nginx -t
systemctl reload nginx
```

发布后检查首页、搜索页、时间轴、项目页，并至少随机打开三篇含中文路径和图片的笔记。浏览器仍显示旧内容时，先使用 `Ctrl+F5` 强制刷新。

## 5. 重点配置

- `_config.yml`：站点名称、域名、文章永久链接、语言与时区。
- `_config.butterfly.yml`：导航菜单、页脚备案信息、主题资源和页面组件。
- `source/js/search-timeline.js`：导航搜索和文章索引交互。
- `source/css/dynamic-bg.css`：全站背景、导航栏、搜索与响应式样式。
- `source/search-data.json`：搜索数据；笔记变化后需要同步更新生成逻辑或数据文件。

当前备案信息：

- 网站名称：岁迹
- ICP 备案号：`鄂ICP备2026033623号`
- 公安备案：正式申请通过后，补充备案编号和公安备案链接。

## 6. 常见问题

### 中文文章点击后 404 或反复刷新

先确认 `public/<年>/<月>/<日>/<文章路径>/index.html` 已在本地生成，再确认服务器存在同一路径。部署包必须使用本项目生成的 `tar.gz`，不要改用 ZIP；旧问题主要来自中文文件名被 `unzip` 错误转码。

### 解压时 Permission denied

说明当前 SSH 用户无权覆盖网站文件。使用 `root` 登录，或由管理员给部署用户授予 `/www/wwwroot/lifeatlas.cn` 的写权限。不要在权限不足时反复解压，以免形成新旧文件混合状态。

### 页面仍显示 Sarf Lab

确认 `_config.yml` 中的 `title`、`author` 均为“岁迹”，然后执行 `pnpm run clean` 和 `pnpm run build`。服务器部署后检查是否仍有旧名称，并强制刷新浏览器缓存。

### 导航先在右侧再跳动

这通常是自定义脚本加载后才插入搜索框导致的布局变化。导航占位样式位于 `source/css/dynamic-bg.css`，修改搜索结构时要同时检查桌面和移动端首屏。

## 7. 发布检查清单

- `pnpm run build` 无错误。
- 首页品牌名称为“岁迹”。
- 导航搜索框位置稳定，桌面和手机宽度均无重叠。
- 搜索结果可点击并进入文章详情。
- 中文标题文章、代码块、图片和 GIF 正常显示。
- 页脚显示 `鄂ICP备2026033623号`，链接指向工信部备案系统。
- 服务器执行 `nginx -t` 成功后再重载 Nginx。
- Git 提交中不包含密码、私钥、证书、`node_modules`、`public` 或部署压缩包。

