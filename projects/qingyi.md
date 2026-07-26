---
title: 轻译
date: 2026-07-25
tags:
  - 项目
  - 翻译器
  - PWA
  - React
cover: /projects/qingyi.webp
---

# 轻译

> 自动识别，即刻翻译

轻译是一款跨平台翻译器。输入文本后，它会自动识别源语言并翻译成选定语言，可以通过网页、桌面 PWA 或 Android 原生应用使用。

<!-- more -->

## 项目简介

这个项目将常用翻译操作集中在一个简洁界面中：无需先选择输入语言，只要设置目标语言并开始输入即可。网页版本直接部署在博客域名下；Android 用户也可以下载安装原生 APK，两者都不依赖 `chatgpt.site` 页面。

## 功能概览

- 自动识别输入语言，并翻译成指定目标语言
- 支持中文、英语、日语、韩语等 14 种常用语言
- 停止输入约 650 毫秒后自动翻译，也可按 `Ctrl / Cmd + Enter`
- 支持源语言与目标语言互换
- 一键复制原文或译文，并支持语音朗读
- 本地保存最近 30 条翻译记录，可收藏常用内容
- 支持浅色与深色主题
- 响应式布局，适配桌面、平板与手机
- 支持 PWA 安装，并提供基础离线应用外壳
- 提供 Android 原生 APK，内置双翻译服务自动切换

## 技术栈

| 类型 | 技术 |
| --- | --- |
| 前端 | Next.js 16、React 19、TypeScript |
| 构建 | vinext、Vite |
| 部署 | Cloudflare Worker |
| 数据 | localStorage 本地历史与收藏 |
| 跨平台 | Web App Manifest、Service Worker、PWA |
| Android | Java、Android Framework API |

## 设计特色

- 使用暖色系界面，减少长时间阅读和输入时的视觉疲劳
- 输入区与译文区并列展示，移动端自动切换为纵向布局
- 将复制、朗读、收藏等高频操作放在内容附近
- 历史记录仅保存在当前设备，打开应用即可继续使用

## 在线体验

<a href="/translate/" target="_blank" rel="noopener noreferrer">打开轻译 →</a>

> 翻译内容会发送至在线翻译服务，请勿输入密码、证件信息等敏感内容。

## Android APK 下载

<a href="/downloads/qingyi-android-v1.0.0.apk" download>下载轻译 Android v1.0.0 →</a>

- 最低支持 Android 6.0
- APK 已签名，可直接安装
- 原生应用不需要打开 `chatgpt.site`
- SHA-256：`E723DD4D6D9B6BAD68B8054F134756A58CA89136376FC4B3DE78FE43D59FF38B`

> 首次安装时，Android 可能会提示允许浏览器安装未知来源应用。APK 仅申请网络权限，用于发送需要翻译的文本。

## 安装方式

- **Windows / macOS**：使用 Chrome 或 Edge 打开应用，点击地址栏中的安装图标。
- **Android**：点击上方按钮下载 APK，打开下载文件并按系统提示安装。
- **iPhone / iPad**：使用 Safari 打开应用，点击分享按钮，再选择“添加到主屏幕”。

## 当前版本

- 版本：Web v1.0 / Android v1.0.0
- 平台：Web / Windows / macOS / Android / iOS
- 状态：公开使用
