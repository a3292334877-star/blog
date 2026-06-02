---
title: Henrycat - 你的课表，优雅掌控
date: 2026-05-20
tags: [项目, Flutter, Dart, SQLite]
cover: https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800
---

# Henrycat - 你的课表，优雅掌控 📅

一款面向大学生的课程表管理应用，支持手动添加课程、教务系统一键导入、时间冲突检测和课表分享。

<!-- more -->

## 项目简介

Henrycat 是一款 Material 3 风格的课程表管理 App，专为深圳职业技术大学学生设计。它不仅能手动添加课程，还能通过内置 WebView 自动从教务系统抓取课程数据，省去手动录入的麻烦。

> **版本**：v2.0.0+1 | **平台**：Android / iOS / 桌面

## 功能概览

### 📅 课程表视图

- 周视图网格布局，13 个时间段 × 7 天
- 每门课程以彩色卡片展示，卡片高度按课时跨度自动计算
- 支持 5 天 / 7 天视图切换
- 点击课程卡片进入编辑，长按删除
- 单双周过滤（全部 / 单周 / 双周）
- 周次导航（上一周 / 下一周）

### ➕ 课程管理

- 表单式添加/编辑课程，字段包括：
  - 课程名称、教师、上课地点
  - 星期几（当天高亮）、起始/结束节次
  - 周次类型（全部/单周/双周）
  - 颜色标签（10 色可选）
  - 备注
- **时间冲突检测**：添加新课时自动检查是否与已有课程重叠

### 🌐 教务系统导入（特色功能）

- 内嵌 WebView 加载深圳职业技术大学教务门户
- JavaScript 注入拦截 `window.fetch` 和 `XMLHttpRequest` 响应
- 自动识别 `kbList` / `kcmc` 等字段并解析为课程数据
- 支持从 sessionStorage、localStorage、HTML 表格多维度提取
- 导入的课程以 `imp_` 前缀标记，可一键清除重新导入

### 📤 课表分享

- 将整周课表格式化为文本
- 通过系统分享面板发送（微信、QQ、复制等）

### 🎨 主题

- 支持浅色 / 深色 / 跟随系统三种主题模式
- Material 3 蓝色种子色 (#5B9BF5)
- 设置持久化存储

## 技术栈

| 技术 | 说明 |
|------|------|
| **框架** | Flutter 3.5+ |
| **语言** | Dart |
| **状态管理** | `Provider` (ChangeNotifier) |
| **本地数据库** | `sqflite` (SQLite) |
| **本地设置** | `shared_preferences` |
| **分享** | `share_plus` |
| **WebView** | `webview_flutter` |
| **OTA 更新** | Shorebird |
| **UI** | Material 3 |

## 架构设计

```
lib/
├── main.dart                     # 入口，MaterialApp + 路由
├── models/
│   └── course_model.dart         # 课程数据模型，序列化/反序列化
├── providers/
│   ├── course_provider.dart      # 课程 CRUD（SQLite）
│   └── settings_provider.dart    # 主题设置
├── screens/
│   ├── home_screen.dart          # 主屏：课程表 + 导航
│   ├── add_course_screen.dart    # 添加/编辑课程表单
│   ├── settings_screen.dart      # 设置页
│   ├── about_screen.dart         # 关于页
│   └── import_schedule_screen.dart # WebView 教务导入
└── widgets/
    └── course_table.dart         # 课程表网格组件
```

### 数据流

```
用户操作 → Provider (ChangeNotifier) → SQLite 持久化 → UI 刷新
                                            ↓
                                  notifyListeners()
                                            ↓
                                   Consumer / context.watch
```

## 构建与安装

```bash
# 克隆项目
cd Henrycat

# 安装依赖
flutter pub get

# 构建 APK
flutter build apk --release
```

## 下载

APK 安装包可联系作者获取。

---

> 课表管理，本该如此优雅。告别截图记课表的日子 📸
