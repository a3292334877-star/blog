<template>
  <div class="math-diagram-container">
    <svg viewBox="0 0 760 300" role="img" aria-label="导数切线斜率与定积分曲边梯形面积的几何对照" style="width: 100%; max-width: 720px; height: auto;">
      <!-- 面板标题 -->
      <text x="200" y="34" style="fill: var(--dg-label);" font-size="14" font-weight="bold" text-anchor="middle">① 导数：切线斜率</text>
      <text x="560" y="34" style="fill: var(--dg-label);" font-size="14" font-weight="bold" text-anchor="middle">② 定积分：曲边梯形面积</text>

      <!-- 左图坐标轴 -->
      <line x1="60" y1="215" x2="350" y2="215" style="stroke: var(--dg-axis);" stroke-width="1.6" />
      <line x1="75" y1="245" x2="75" y2="55" style="stroke: var(--dg-axis);" stroke-width="1.6" />
      <polygon points="350,211 358,215 350,219" style="fill: var(--dg-axis);" />
      <polygon points="71,55 75,47 79,55" style="fill: var(--dg-axis);" />
      <text x="345" y="232" style="fill: var(--dg-label);" font-size="13" font-style="italic">x</text>
      <text x="62" y="58" style="fill: var(--dg-label);" font-size="13" font-style="italic">y</text>

      <!-- 左图曲线 -->
      <path d="M 95 205 Q 210 60 325 205" fill="none" style="stroke: var(--dg-c4);" stroke-width="2.6" />

      <!-- 切线 -->
      <line x1="200" y1="116" x2="310" y2="171" style="stroke: var(--dg-c1);" stroke-width="2.2" stroke-dasharray="6 4" />
      <circle cx="256" cy="144" r="5" style="fill: var(--dg-c1);" />
      <text x="262" y="132" style="fill: var(--dg-title-a);" font-size="12.5" font-weight="bold">P(x₀, f(x₀))</text>

      <!-- 左图标注 -->
      <text x="88" y="86" style="fill: var(--dg-title-a);" font-size="12.5" font-weight="bold">切线斜率 = f′(x₀)</text>
      <text x="88" y="106" style="fill: var(--dg-label);" font-size="12">刻画该点的瞬时变化率</text>

      <!-- 中间连接 -->
      <text x="390" y="146" style="fill: var(--dg-c3);" font-size="24" font-weight="bold" text-anchor="middle">⇄</text>
      <text x="390" y="170" style="fill: var(--dg-label);" font-size="11.5" text-anchor="middle">基本定理</text>

      <!-- 右图坐标轴 -->
      <line x1="420" y1="215" x2="700" y2="215" style="stroke: var(--dg-axis);" stroke-width="1.6" />
      <line x1="445" y1="245" x2="445" y2="55" style="stroke: var(--dg-axis);" stroke-width="1.6" />
      <polygon points="700,211 708,215 700,219" style="fill: var(--dg-axis);" />
      <polygon points="441,55 445,47 449,55" style="fill: var(--dg-axis);" />
      <text x="694" y="232" style="fill: var(--dg-label);" font-size="13" font-style="italic">x</text>
      <text x="432" y="58" style="fill: var(--dg-label);" font-size="13" font-style="italic">y</text>

      <!-- 右图阴影面积 -->
      <path
        d="M 481 215 L 481 158.6 L 498.25 147.2 L 515.5 139 L 532.75 134.1 L 550 132.5 L 567.25 134.1 L 584.5 139 L 601.75 147.2 L 619 158.6 L 619 215 Z"
        style="fill: var(--dg-pink);"
        opacity="0.22"
      />
      <path d="M 435 205 Q 550 60 665 205" fill="none" style="stroke: var(--dg-c4);" stroke-width="2.6" />
      <line x1="481" y1="215" x2="481" y2="158.6" style="stroke: var(--dg-c4);" stroke-width="1.6" stroke-dasharray="4 3" />
      <line x1="619" y1="215" x2="619" y2="158.6" style="stroke: var(--dg-c4);" stroke-width="1.6" stroke-dasharray="4 3" />
      <text x="470" y="232" style="fill: var(--dg-label);" font-size="13" font-style="italic">a</text>
      <text x="612" y="232" style="fill: var(--dg-label);" font-size="13" font-style="italic">b</text>

      <!-- 右图标注 -->
      <text x="492" y="86" style="fill: var(--dg-title-a);" font-size="12.5" font-weight="bold">阴影面积 = ∫ₐᵇ f(x) dx</text>
      <text x="492" y="106" style="fill: var(--dg-label);" font-size="12">刻画 [a, b] 上的累积量</text>
    </svg>
    <div class="math-diagram-caption">💡 图 2：导数给出瞬时变化率，定积分给出累积量，牛顿-莱布尼茨公式把两者连接起来</div>
  </div>
</template>
