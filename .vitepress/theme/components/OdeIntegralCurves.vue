<template>
  <div class="math-diagram-container">
    <svg viewBox="0 0 680 300" role="img" aria-label="微分方程 y' + xy = 0 的积分曲线族" style="width: 100%; max-width: 660px; height: auto;">
      <!-- 坐标轴 -->
      <line x1="60" y1="150" x2="620" y2="150" style="stroke: var(--dg-axis);" stroke-width="1.8" />
      <line x1="340" y1="280" x2="340" y2="20" style="stroke: var(--dg-axis);" stroke-width="1.8" />
      <polygon points="620,146 628,150 620,154" style="fill: var(--dg-axis);" />
      <polygon points="336,20 340,12 344,20" style="fill: var(--dg-axis);" />
      <text x="626" y="141" style="fill: var(--dg-label);" font-size="14" font-style="italic">x</text>
      <text x="352" y="26" style="fill: var(--dg-label);" font-size="14" font-style="italic">y</text>
      <text x="322" y="168" style="fill: var(--dg-label);" font-size="13">O</text>

      <!-- C = 2 -->
      <path d="M 120 148 Q 240 140 290 85 T 340 50 T 390 85 Q 440 140 560 148" fill="none" style="stroke: var(--dg-c1);" stroke-width="2.5" />
      <text x="346" y="45" style="fill: var(--dg-c1);" font-size="12" font-weight="bold">C = 2</text>

      <!-- C = 1 -->
      <path d="M 120 149 Q 240 145 290 115 T 340 100 T 390 115 Q 440 145 560 149" fill="none" style="stroke: var(--dg-c2);" stroke-width="2" stroke-dasharray="3 2" />
      <text x="346" y="95" style="fill: var(--dg-c2);" font-size="12" font-weight="bold">C = 1</text>

      <!-- C = 0 -->
      <line x1="100" y1="150" x2="580" y2="150" style="stroke: var(--dg-c3);" stroke-width="2" />
      <text x="498" y="142" style="fill: var(--dg-c3);" font-size="12" font-weight="bold">C = 0 (y = 0)</text>

      <!-- C = -1 -->
      <path d="M 120 151 Q 240 155 290 185 T 340 200 T 390 185 Q 440 155 560 151" fill="none" style="stroke: var(--dg-c4);" stroke-width="2" stroke-dasharray="3 2" />
      <text x="346" y="216" style="fill: var(--dg-c4);" font-size="12" font-weight="bold">C = -1</text>

      <!-- C = -2 -->
      <path d="M 120 152 Q 240 160 290 215 T 340 250 T 390 215 Q 440 160 560 152" fill="none" style="stroke: var(--dg-c5);" stroke-width="2.5" />
      <text x="346" y="266" style="fill: var(--dg-c5);" font-size="12" font-weight="bold">C = -2</text>
    </svg>
    <div class="math-diagram-caption">💡 图 2：微分方程 y' + xy = 0 的积分曲线族 y = C · exp(−x²/2) 几何直观</div>
  </div>
</template>
