# 岁迹（LifeAtlas）

岁迹是一个基于 Hexo 与 Butterfly 主题搭建的个人技术笔记网站，主要整理 Unity、游戏客户端开发、算法、面试准备和项目经历。线上域名为 [lifeatlas.cn](https://lifeatlas.cn)。

## 技术栈

- Hexo 7
- Butterfly 5
- Node.js 与 pnpm
- Markdown、JavaScript、CSS
- Nginx 静态站点部署

## 快速开始

建议安装 Node.js 20 LTS、Git 和 pnpm。首次拉取项目后执行：

```powershell
git clone https://github.com/Sarfffff/LifeAtlasWeb.git
cd LifeAtlasWeb
corepack enable
pnpm install
pnpm run dev
```

本地预览默认地址为 `http://localhost:4000`。如果系统没有 Corepack，可先执行 `npm install -g pnpm`。

## 常用命令

```powershell
# 启动本地预览
pnpm run dev

# 清理并生成静态网站
pnpm run clean
pnpm run build

# 生成服务器部署包
pnpm run package
```

部署包会生成到 `deploy/lifeatlas-site.tar.gz`，同时输出 SHA-256 校验值。部署时使用 `tar.gz`，避免中文笔记路径在 Linux 上被 ZIP 解压工具转码。

## 目录说明

| 路径 | 用途 |
| --- | --- |
| `_config.yml` | Hexo 站点、域名、文章链接等主配置 |
| `_config.butterfly.yml` | Butterfly 主题、导航、页脚和资源注入配置 |
| `source/_posts/` | 网站文章和导入的笔记正文 |
| `source/notes-assets/` | 笔记引用的图片、GIF 等附件 |
| `source/css/` | 自定义页面样式 |
| `source/js/` | 搜索、时间轴等自定义交互 |
| `source/img/` | 网站背景与项目图片 |
| `scaffolds/` | Hexo 新文章模板 |
| `scripts/` | 构建和部署辅助脚本 |
| `docs/` | 项目交接与部署说明 |
| `public/` | Hexo 生成结果，不提交到 Git |

## 编辑笔记

已有笔记位于 `source/_posts/imported-notes/`。新增普通文章可以执行：

```powershell
pnpm exec hexo new post "文章标题"
```

修改后先运行 `pnpm run dev` 检查导航、搜索、文章详情和图片，再运行构建命令。文章链接由 Front Matter 中的 `title`、`date`、`categories`、`tags` 等字段决定，请保留文件开头的 YAML 区域。

## 站点信息

- 站点名称：岁迹
- 域名：`lifeatlas.cn`
- ICP 备案号：`鄂ICP备2026033623号`
- 公安备案号：取得正式编号后补充到主题页脚配置

更完整的新电脑接手、发布和故障处理流程见 [docs/HANDOFF.md](docs/HANDOFF.md)。

## 安全约定

不要把服务器密码、SSH 私钥、API 密钥、证书或个人访问令牌提交到仓库。部署凭据由维护者单独保管；如果笔记中含个人信息，仓库应保持私有。

