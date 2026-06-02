---
title: StudyTracker - 初音未来主题学习助手
date: 2026-03-15
tags: [项目, Flutter, Dart]
cover: https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800
---

# StudyTracker - 初音未来主题学习助手 📱

一款以初音未来为主题的二次元风格学习辅助工具，集番茄钟、背单词和学习统计于一体。

<!-- more -->

## 项目简介

StudyTracker 是一款面向学生群体的移动端学习辅助应用，采用 Material 3 设计语言，以初音未来（Hatsune Miku）为主题，Bilibili 粉色系配色。应用通过底部导航栏组织三个核心功能模块。

> **版本**：v1.1.0 | **平台**：Android

## 功能概览

### 🍅 番茄钟

- 25 分钟专注计时，5 分钟短休息 / 15 分钟长休息（每 4 个番茄钟后）
- 圆形进度条动画，`AnimationController` + `Timer.periodic` 实现
- 自动跟踪完成的番茄钟总数，持久化至本地

### 📖 CET-4 背单词

- 内置约 160 个 CET-4 核心词汇（中英对照 JSON 数据）
- 闪卡模式：点击翻转查看释义
- 支持标记"已记住"、跳过、随机抽词
- 按等级筛选词汇
- 每日学习进度按日期持久化存储

### 📊 学习统计

- 累计番茄钟数、今日学习单词数
- 过去 7 天学习趋势柱状图（基于 `fl_chart` 库）
- 内置学习技巧提示

## 技术栈

| 技术 | 说明 |
|------|------|
| **框架** | Flutter 3.5+ |
| **语言** | Dart |
| **UI** | Material 3 |
| **状态持久化** | `shared_preferences` |
| **图表** | `fl_chart` |
| **数据** | 内置 JSON 词汇库 (`assets/words.json`) |

## 设计特色

- **初音未来主题**：AppBar 标题为"初音未来学习助手"，配合葱绿色和粉色点缀
- **二次元风格**：圆角卡片、渐变背景、流畅过渡动画
- **Bilibili 粉配色**：整体视觉以暖粉色为主调，贴近 ACGN 审美

## 构建与安装

```bash
# 克隆项目
cd studytracker

# 安装依赖
flutter pub get

# 构建 APK
flutter build apk --release
```

生成的 APK 位于 `build/app/outputs/flutter-apk/app-release.apk`。

## 项目结构

```
studytracker/
├── lib/
│   └── main.dart          # 单文件架构，约 840 行
├── assets/
│   └── words.json         # CET-4 词汇数据
├── android/               # Android 平台配置
├── pubspec.yaml           # 项目配置 (v1.1.0)
└── web/
    └── index.html         # APK 下载落地页
```

> 应用采用单文件架构，所有 UI 和逻辑集中在 `main.dart` 中，结构简洁清晰，适合初学者阅读学习。

## 下载

APK 安装包可联系作者获取。

---

> 学习也可以很可爱。初音未来陪你一起专注每一分钟 ✨
