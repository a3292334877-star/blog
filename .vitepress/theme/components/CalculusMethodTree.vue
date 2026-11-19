<template>
  <div class="math-diagram-container">
    <svg viewBox="0 0 760 310" role="img" aria-label="不定积分方法选择决策图" style="width: 100%; max-width: 720px; height: auto;">
      <defs>
        <linearGradient id="calc-tree-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.92" />
          <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.96" />
        </linearGradient>
        <linearGradient id="calc-tree-pink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e11d48" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#d97a8c" stop-opacity="0.96" />
        </linearGradient>
        <linearGradient id="calc-tree-amber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#d97706" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.96" />
        </linearGradient>
        <linearGradient id="calc-tree-green" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#059669" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#10b981" stop-opacity="0.96" />
        </linearGradient>
        <filter id="calc-tree-shadow" x="-8%" y="-8%" width="116%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.14" />
        </filter>
      </defs>

      <!-- 根节点：求不定积分 -->
      <g filter="url(#calc-tree-shadow)">
        <rect x="228" y="12" width="304" height="54" rx="14" fill="url(#calc-tree-blue)" />
        <text x="380" y="45" fill="#ffffff" font-size="15.5" font-weight="bold" text-anchor="middle">求不定积分 ∫ f(x) dx</text>
      </g>

      <!-- 分支连接线 -->
      <path d="M 380 66 L 380 92 M 105 92 L 660 92" fill="none" style="stroke: var(--dg-axis);" stroke-width="2" />
      <line x1="105" y1="92" x2="105" y2="122" style="stroke: var(--dg-pink);" stroke-width="2.4" />
      <line x1="290" y1="92" x2="290" y2="122" style="stroke: var(--dg-c4);" stroke-width="2.4" />
      <line x1="475" y1="92" x2="475" y2="122" style="stroke: var(--dg-amber);" stroke-width="2.4" />
      <line x1="660" y1="92" x2="660" y2="122" style="stroke: var(--dg-c3);" stroke-width="2.4" />

      <!-- ① 直接套公式 -->
      <g filter="url(#calc-tree-shadow)">
        <rect x="25" y="122" width="160" height="112" rx="12" fill="url(#calc-tree-pink)" />
        <text x="105" y="148" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">① 直接套公式</text>
        <text x="105" y="173" fill="#ffe4e6" font-size="12.5" text-anchor="middle">∫xⁿ dx、∫eˣ dx</text>
        <text x="105" y="194" fill="#ffe4e6" font-size="12.5" text-anchor="middle">∫1/x dx、∫cos x dx</text>
        <text x="105" y="217" fill="#ffffff" font-size="12" text-anchor="middle">核对基本积分表</text>
      </g>

      <!-- ② 凑微分换元 -->
      <g filter="url(#calc-tree-shadow)">
        <rect x="210" y="122" width="160" height="112" rx="12" fill="url(#calc-tree-blue)" />
        <text x="290" y="148" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">② 凑微分换元</text>
        <text x="290" y="173" fill="#e0e7ff" font-size="12.5" text-anchor="middle">∫f(φ(x))φ′(x) dx</text>
        <text x="290" y="194" fill="#e0e7ff" font-size="12.5" text-anchor="middle">令 u = φ(x)</text>
        <text x="290" y="217" fill="#ffffff" font-size="12" text-anchor="middle">内层导数恰好在场</text>
      </g>

      <!-- ③ 分部积分 -->
      <g filter="url(#calc-tree-shadow)">
        <rect x="395" y="122" width="160" height="112" rx="12" fill="url(#calc-tree-amber)" />
        <text x="475" y="148" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">③ 分部积分</text>
        <text x="475" y="173" fill="#fef3c7" font-size="12.5" text-anchor="middle">∫u dv = uv − ∫v du</text>
        <text x="475" y="194" fill="#fef3c7" font-size="12.5" text-anchor="middle">u 按「反对幂指三」</text>
        <text x="475" y="217" fill="#ffffff" font-size="12" text-anchor="middle">幂 × 指数 / 三角</text>
      </g>

      <!-- ④ 有理分式 -->
      <g filter="url(#calc-tree-shadow)">
        <rect x="580" y="122" width="160" height="112" rx="12" fill="url(#calc-tree-green)" />
        <text x="660" y="148" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle">④ 有理分式</text>
        <text x="660" y="173" fill="#d1fae5" font-size="12.5" text-anchor="middle">P(x) / Q(x)</text>
        <text x="660" y="194" fill="#d1fae5" font-size="12.5" text-anchor="middle">先部分分式分解</text>
        <text x="660" y="217" fill="#ffffff" font-size="12" text-anchor="middle">再逐项积分</text>
      </g>

      <!-- 底部口诀 -->
      <text x="380" y="272" style="fill: var(--dg-label);" font-size="13" text-anchor="middle">能凑微分就换元；看到乘积想分部；分子次数高先做除法或拆分。</text>
    </svg>
    <div class="math-diagram-caption">💡 图 1：不定积分方法识别与选择流程</div>
  </div>
</template>
