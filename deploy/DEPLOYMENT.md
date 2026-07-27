# 岁迹站点上线说明

## 站点信息

- 域名：`lifeatlas.cn`
- 服务器 IP：`47.122.124.84`
- 备案号：`鄂ICP备2026033623号`
- Hexo 生产地址：`https://lifeatlas.cn`
- 服务器目录：`/www/wwwroot/lifeatlas.cn`

## DNS 解析

在域名控制台添加：

| 主机记录 | 类型 | 记录值 |
| --- | --- | --- |
| `@` | A | `47.122.124.84` |
| `www` | A | `47.122.124.84` |

## 本机构建

在项目根目录执行：

```powershell
pnpm install
pnpm run clean
pnpm run build
pnpm run package
```

部署包位于 `deploy/lifeatlas-site.tar.gz`。打包脚本会输出文件大小和 SHA-256，可用于确认上传前后文件一致。

> 不要使用 ZIP 部署含中文路径的笔记。部分 Linux `unzip` 环境会错误转换中文文件名，造成文章详情 404 或反复刷新。

## 上传与部署

本机执行：

```powershell
scp .\deploy\lifeatlas-site.tar.gz root@47.122.124.84:/www/wwwroot/lifeatlas.cn/lifeatlas-site.tar.gz
ssh root@47.122.124.84
```

服务器执行：

```bash
cd /www/wwwroot/lifeatlas.cn
tar -xzf lifeatlas-site.tar.gz -C /www/wwwroot/lifeatlas.cn
find /www/wwwroot/lifeatlas.cn -type d -exec chmod 755 {} \;
find /www/wwwroot/lifeatlas.cn -type f -exec chmod 644 {} \;
nginx -t
systemctl reload nginx
```

如果出现 `Permission denied`，确认当前 SSH 用户为 `root`，或由管理员授权该目录。Nginx 配置可参考 `deploy/nginx-lifeatlas.cn.conf`。

## 上线后检查

- `https://lifeatlas.cn/`
- `https://lifeatlas.cn/search/`
- `https://lifeatlas.cn/timeline/`
- `https://lifeatlas.cn/projects/`
- 随机打开至少三篇中文标题笔记，包括“飞鱼科技”文章
- 页脚显示备案号并链接到工信部备案系统

若浏览器仍显示旧页面，使用 `Ctrl+F5` 强制刷新，再检查服务器文件的更新时间。

