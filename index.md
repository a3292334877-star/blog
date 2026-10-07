---
layout: home
head:
  # 首屏大图是 CSS 背景，浏览器要等样式表解析后才发现它；
  # 提前 preload 可以更早开始下载，按断点只取其中一张。
  - - link
    - rel: preload
      as: image
      href: /backgrounds/k-on-hero.webp
      media: '(min-width: 821px)'
  - - link
    - rel: preload
      as: image
      href: /backgrounds/k-on-hero-mobile.webp
      media: '(max-width: 820px)'
---

<!-- 首页内容通过 home-hero-before / home-hero-after 插槽注入 -->
