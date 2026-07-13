# Sakikoの博客

基于 VitePress 的个人博客，部署到 GitHub Pages，包含文章归档、标签、RSS、音乐播放器、Live2D、Giscus 评论和可选的 Supabase 访客统计。

## 本地开发

要求 Node.js 20 或更高版本（CI 使用 Node.js 22）。

```bash
npm ci
npm run dev
```

提交前执行：

```bash
npm run check
npm run build
```

`npm run check` 会检查文章 frontmatter、封面资源和 Live2D 核心资源，避免无效资源进入部署产物。

## 可选服务

复制 `.env.example` 为 `.env`，按需配置 Giscus 和 Supabase。访客统计的安全初始化 SQL 位于 `supabase/visitor-counter.sql`：公开客户端只能写入访问记录和调用聚合统计函数，不能读取原始指纹或访问路径。

## 部署

推送到 `main` 或 `master` 后，GitHub Actions 会构建并部署到 GitHub Pages。部署所需的环境变量请配置为仓库 Actions secrets。
