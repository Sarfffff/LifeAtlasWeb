---
title: "分支相关知识以及提交分支流程"
date: 2026-08-27T20:06:01+08:00
updated: 2026-08-27T20:06:01+08:00
permalink: /dev-notes/Ugit-%E5%88%86%E6%94%AF%E7%9B%B8%E5%85%B3%E7%9F%A5%E8%AF%86%E4%BB%A5%E5%8F%8A%E6%8F%90%E4%BA%A4%E5%88%86%E6%94%AF%E6%B5%81%E7%A8%8B/
categories:
  - 研发手记
  - "Ugit"
tags:
  - 研发手记
  - "Ugit"
source_repo: https://github.com/Sarfffff/LearnByCompany
---

1.先将本地分支提交到远程：feature/leohujiang - >origin
2.在工蜂平台上创建MR，目标选择develop
	3.等待审查提交

# 几个分支的理解

1.develop 和 sX-dev 是什么关系？
```
赛季开始时：
develop ──拷贝──▶ sX-dev（赛季版本分支）

赛季开始后：各干各的
develop  ──────继续往后开发（下个赛季的内容）──────▶
sX-dev   ──────专注当前赛季（修bug、加活动）──────▶

```
develop：永远往前走，开发未来的东西
sX-dev：从 develop 拷贝出来后，就独立了，专门服务当前赛季
⚠️ 关键点：sX-dev 上的改动不会自动回到 develop。比如你在 sX-dev 上修了个 bug，develop 上那个 bug 还在，除非你手动合回去

2.线上"是哪个分支？
"线上" = 当前玩家正在玩的那个版本，对应的分支就是上一次发布的那个 release 分支。
```
比如这周三刚发布了 release_v3.5
那"线上"就是 release_v3.5 这个状态
玩家手机上跑的就是这个
```
3.每周热更的完整流程
```
周四：从"线上"（上次发布的 release）拉一份出来
      ──▶ 本周新的 release 分支
        │
        │  在上面改东西（修bug、加活动配置等）
        │
周三：发布 ▶ 玩家手机上更新

```
4.整体来看
```
赛季初：
  develop ──合并──▶ sX-dev ──合并──▶ release ──发布──▶ 玩家

赛季中（每周热更）：
  上次发布的release ──拉副本──▶ 本周release ──改东西──▶ 发布 ──▶ 玩家

下个赛季初：
  develop（一直在往前走）──合并──▶ sY-dev ──▶ release ──▶ 玩家

```
<img src="/dev-notes-assets/Pasted%20image%2020260717123332.png" alt="Pasted image 20260717123332.png">
<img src="/dev-notes-assets/Pasted%20image%2020260708173707.png" alt="Pasted image 20260708173707.png">

---

> 本文从 [LearnByCompany 原始文档](https://github.com/Sarfffff/LearnByCompany/blob/main/Ugit/%E5%88%86%E6%94%AF%E7%9B%B8%E5%85%B3%E7%9F%A5%E8%AF%86%E4%BB%A5%E5%8F%8A%E6%8F%90%E4%BA%A4%E5%88%86%E6%94%AF%E6%B5%81%E7%A8%8B.md) 自动同步。
