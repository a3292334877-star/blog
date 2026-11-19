<template>
  <div class="math-diagram-container">
    <svg viewBox="0 0 760 345" role="img" aria-label="一阶微分方程题型识别与解法流向图" style="width: 100%; max-width: 720px; height: auto;">
      <defs>
        <linearGradient id="ode-tree-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.92" />
          <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.96" />
        </linearGradient>
        <linearGradient id="ode-tree-pink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e11d48" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#d97a8c" stop-opacity="0.96" />
        </linearGradient>
        <linearGradient id="ode-tree-amber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#d97706" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.96" />
        </linearGradient>
        <filter id="ode-tree-shadow" x="-8%" y="-8%" width="116%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.14" />
        </filter>
      </defs>

      <!-- 根节点：一阶微分方程 -->
      <g filter="url(#ode-tree-shadow)">
        <rect x="245" y="14" width="270" height="54" rx="14" fill="url(#ode-tree-blue)" />
        <text x="380" y="41" fill="#ffffff" font-size="15.5" font-weight="bold" text-anchor="middle" dominant-baseline="middle">一阶微分方程 dy/dx = F(x, y)</text>
      </g>

      <!-- 分支虚线 -->
      <path d="M 320 68 L 320 112 L 180 112 L 180 143" fill="none" style="stroke: var(--dg-pink);" stroke-width="2.5" stroke-dasharray="4 4" />
      <path d="M 440 68 L 440 112 L 580 112 L 580 143" fill="none" style="stroke: var(--dg-amber);" stroke-width="2.5" stroke-dasharray="4 4" />

      <!-- 分支 A：可分离变量 -->
      <g filter="url(#ode-tree-shadow)">
        <rect x="55" y="143" width="250" height="74" rx="14" fill="url(#ode-tree-pink)" />
        <text x="180" y="170" fill="#ffffff" font-size="15" font-weight="bold" text-anchor="middle">类型一：可分离变量方程</text>
        <text x="180" y="196" fill="#ffe4e6" font-size="13" text-anchor="middle">dy/dx = f(x) · g(y)</text>
      </g>

      <!-- 分支 B：齐次方程 -->
      <g filter="url(#ode-tree-shadow)">
        <rect x="455" y="143" width="250" height="74" rx="14" fill="url(#ode-tree-amber)" />
        <text x="580" y="170" fill="#ffffff" font-size="15" font-weight="bold" text-anchor="middle">类型二：齐次方程</text>
        <text x="580" y="196" fill="#fef3c7" font-size="13" text-anchor="middle">dy/dx = f(y / x)</text>
      </g>

      <!-- 向下箭头 -->
      <line x1="180" y1="217" x2="180" y2="251" style="stroke: var(--dg-pink);" stroke-width="2.5" />
      <line x1="580" y1="217" x2="580" y2="251" style="stroke: var(--dg-amber);" stroke-width="2.5" />

      <!-- 操作卡片 A -->
      <g filter="url(#ode-tree-shadow)">
        <rect x="38" y="251" width="284" height="80" rx="12" style="fill: var(--dg-card-bg); stroke: var(--dg-pink);" stroke-width="1.5" />
        <text x="180" y="275" style="fill: var(--dg-title-a);" font-size="13.5" font-weight="bold" text-anchor="middle">操作：x 归 x，y 归 y</text>
        <text x="180" y="296" style="fill: var(--dg-label);" font-size="12.5" text-anchor="middle">两端同时积分：</text>
        <text x="180" y="315" style="fill: var(--dg-label);" font-size="12.5" text-anchor="middle">∫ (1/g(y)) dy = ∫ f(x) dx + C</text>
      </g>

      <!-- 操作卡片 B -->
      <g filter="url(#ode-tree-shadow)">
        <rect x="438" y="251" width="284" height="80" rx="12" style="fill: var(--dg-card-bg); stroke: var(--dg-amber);" stroke-width="1.5" />
        <text x="580" y="275" style="fill: var(--dg-title-b);" font-size="13.5" font-weight="bold" text-anchor="middle">操作：令 u = y/x 换元降维</text>
        <text x="580" y="296" style="fill: var(--dg-label);" font-size="12.5" text-anchor="middle">则 dy/dx = u + x·(du/dx)</text>
        <text x="580" y="315" style="fill: var(--dg-label);" font-size="12.5" text-anchor="middle">转化为可分离变量方程</text>
      </g>
    </svg>
    <div class="math-diagram-caption">💡 图 1：一阶微分方程题型识别与解法流向图</div>
  </div>
</template>
