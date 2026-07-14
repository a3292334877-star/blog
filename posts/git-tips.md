---
title: Git 入门与实用技巧
date: 2026-06-02
tags: [教程, Git]
cover: /covers/git-tips.svg
---

Git 是程序员最常用的版本控制工具。这篇笔记整理了日常高频命令和一些实用技巧。

<!-- more -->

## 基础配置

装好 Git 后先配置身份信息：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

## 日常工作流

### 从零开始

```bash
git init                  # 初始化仓库
git add .                 # 暂存所有文件
git commit -m "初次提交"   # 提交
git branch -M main        # 重命名为 main 分支
git remote add origin <仓库地址>
git push -u origin main   # 推送并关联远程
```

### 日常改动

```bash
git status                # 看改了什么
git diff                  # 看具体改了哪些内容
git add <文件>            # 暂存
git commit -m "描述改动"   # 提交
git push                  # 推送
```

## 分支操作

```bash
git branch feature        # 新建分支
git checkout feature      # 切换过去
# 或者一步到位：
git checkout -b feature   # 新建并切换

git merge feature         # 把 feature 合并到当前分支
git branch -d feature     # 删除本地分支
```

## 撤销操作 🆘

```bash
# 改坏了还没 add —— 丢弃工作区改动
git restore <文件>

# 已经 add 了想撤销 —— 取消暂存
git restore --staged <文件>

# 已经 commit 了想反悔 —— 回退一次提交，改动保留
git reset --soft HEAD~1

# commit 写错了信息 —— 修改最近一次提交
git commit --amend -m "新的提交信息"
```

## 实用小技巧

### 别名

在 `~/.gitconfig` 里加一些别名能省不少键盘：

```ini
[alias]
  st = status
  co = checkout
  br = branch
  cm = commit -m
  lg = log --oneline --graph --all
```

### 查看历史

```bash
git log --oneline --graph --all   # 彩色分支图
git log -p                         # 看每次提交的具体改动
git blame <文件>                   # 看每一行是谁写的
```

### 暂存临时改动

有时候写到一半要切分支，又不想 commit：

```bash
git stash          # 暂存当前改动
git stash pop      # 恢复
git stash list     # 查看暂存列表
```

### .gitignore

项目里不需要版本控制的文件写到 `.gitignore`：

```ini
node_modules/
.vitepress/dist/
.vitepress/cache/
*.log
.env
```

## 提交信息规范

好的提交信息让项目历史一目了然：

```
<类型>: <简短描述>

<详细说明（可选）>
```

常用类型前缀：

| 前缀 | 含义 |
|------|------|
| `✨` 或 `feat` | 新功能 |
| `🐛` 或 `fix` | 修复 bug |
| `📝` 或 `docs` | 文档更新 |
| `♻️` 或 `refactor` | 重构 |
| `🎨` 或 `style` | 样式调整 |
| `🔥` 或 `chore` | 杂项 |

## 常见踩坑

### 推送到远程被拒

通常是远程有新提交你没拉：

```bash
git pull --rebase origin main
git push
```

### 合并冲突

冲突文件会被标记，手动编辑保留需要的内容，然后：

```bash
git add <冲突文件>
git commit
```

### 不小心提交了大文件

```bash
git rm --cached <大文件>
git commit -m "移除大文件"
# 把文件加到 .gitignore
```

---

> Git 是个强大的工具，熟能生巧。遇到问题别慌，`git reflog` 能救你 😌
