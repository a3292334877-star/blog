---
title: 常微分方程入门：基本概念、可分离变量方程与齐次方程
date: 2026-10-28
description: 从零搞懂常微分方程核心概念：微分方程的阶、通解与特解；手把手掌握可分离变量方程与齐次方程的解法推导、换元技巧与经典例题剖析。
tags: [高等数学, 微积分, 专升本, 教程]
cover: /covers/differential-equations-basics.svg
---

<div class="math-hero-meta">
  <span class="math-badge">📚 专升本/考研必考</span>
  <span class="math-badge">⏱️ 建议阅读 15 分钟</span>
  <span class="math-badge">✨ 阶数与解判定</span>
  <span class="math-badge">🔑 任意常数独立性</span>
  <span class="math-badge">⚡ 可分离变量三步法</span>
  <span class="math-badge">🔄 齐次换元三板斧</span>
</div>

在高等数学与工程应用中，许多物理规律和几何问题描述的往往不是未知量本身，而是**未知量与其变化率（导数）之间的内在规律**。这种联系未知函数及其导数的方程，就是**微分方程**。

本文从零梳理微分方程的阶数、通解与特解的判定，并配以**几何积分曲线族图解**与**思维决策导图**，手把手攻克高数中最核心的两种一阶微分方程——**可分离变量方程**与**齐次方程**。

<!-- more -->

---

## 🧭 一阶微分方程解法决策导图

在面对一道一阶微分方程时，最关键的能力是**快速识别类型并选择最直接的算法通道**：

<div class="math-diagram-container">
<svg viewBox="0 0 760 340" width="100%" height="100%" style="max-width: 720px; font-family: system-ui, -apple-system, sans-serif;">
  <defs>
    <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.9" />
    </linearGradient>
    <linearGradient id="grad-pink" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e11d48" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#d97a8c" stop-opacity="0.9" />
    </linearGradient>
    <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d97706" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.9" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity="0.12"/>
    </filter>
  </defs>

  <!-- 根节点 -->
  <g filter="url(#shadow)">
    <rect x="250" y="15" width="260" height="54" rx="14" fill="url(#grad-blue)" />
    <text x="380" y="42" fill="#ffffff" font-size="16" font-weight="bold" text-anchor="middle" dominant-baseline="middle">一阶微分方程 dy/dx = F(x, y)</text>
  </g>

  <!-- 连线 -->
  <path d="M 320 69 L 320 115 L 180 115 L 180 145" fill="none" stroke="#d97a8c" stroke-width="2.5" stroke-dasharray="4 4" />
  <path d="M 440 69 L 440 115 L 580 115 L 580 145" fill="none" stroke="#7c3aed" stroke-width="2.5" stroke-dasharray="4 4" />

  <!-- 分支 A: 可分离变量 -->
  <g filter="url(#shadow)">
    <rect x="60" y="145" width="240" height="75" rx="14" fill="url(#grad-pink)" />
    <text x="180" y="172" fill="#ffffff" font-size="15" font-weight="bold" text-anchor="middle">类型一：可分离变量方程</text>
    <text x="180" y="198" fill="#ffe4e6" font-size="13" text-anchor="middle">dy/dx = f(x) · g(y)</text>
  </g>

  <!-- 分支 B: 齐次方程 -->
  <g filter="url(#shadow)">
    <rect x="460" y="145" width="240" height="75" rx="14" fill="url(#grad-amber)" />
    <text x="580" y="172" fill="#ffffff" font-size="15" font-weight="bold" text-anchor="middle">类型二：齐次方程</text>
    <text x="580" y="198" fill="#fef3c7" font-size="13" text-anchor="middle">dy/dx = f(y / x)</text>
  </g>

  <!-- 动作箭头向下 -->
  <line x1="180" y1="220" x2="180" y2="255" stroke="#d97a8c" stroke-width="2.5" />
  <line x1="580" y1="220" x2="580" y2="255" stroke="#f59e0b" stroke-width="2.5" />

  <!-- 操作卡片 A -->
  <g filter="url(#shadow)">
    <rect x="40" y="255" width="280" height="65" rx="12" fill="#ffffff" stroke="#f43f5e" stroke-width="1.5" />
    <text x="180" y="280" fill="#9f1239" font-size="13.5" font-weight="bold" text-anchor="middle">操作：x 归 x，y 归 y</text>
    <text x="180" y="302" fill="#475569" font-size="13" text-anchor="middle">两端同时积分 ∫(1/g(y))dy = ∫f(x)dx + C</text>
  </g>

  <!-- 操作卡片 B -->
  <g filter="url(#shadow)">
    <rect x="440" y="255" width="280" height="65" rx="12" fill="#ffffff" stroke="#f59e0b" stroke-width="1.5" />
    <text x="580" y="280" fill="#92400e" font-size="13.5" font-weight="bold" text-anchor="middle">操作：令 u = y/x 换元降维</text>
    <text x="580" y="302" fill="#475569" font-size="13" text-anchor="middle">dy/dx = u + x(du/dx) 转化为分离变量</text>
  </g>
</svg>
<div class="math-diagram-caption">💡 图 1：一阶微分方程题型识别与解法流向图</div>
</div>

---

## 一、 微分方程的基本概念

### 1. 什么是微分方程？

包含**自变量**、**未知函数**以及**未知函数的各阶导数（或微分）**的方程，称为**微分方程**（Differential Equation）。若未知函数仅有一个自变量，则称为**常微分方程**（Ordinary Differential Equation, 简称 ODE）。

<div class="math-showcase">
  <div class="math-showcase-title">
    <span>📐 常微分方程的一般形式</span>
  </div>
  <div class="math-showcase-body">

$$
F(x, y, y', y'', \cdots, y^{(n)}) = 0 \qquad \text{或显式形式：} \quad y^{(n)} = f(x, y, y', \cdots, y^{(n-1)})
$$

  </div>
</div>

::: warning ⚠️ 准入红线：方程中必须出现导数或微分
判断一个式子是否是微分方程，**唯一的标准是看它是否含有未知函数的导数（如 $y', y'', \frac{dy}{dx}$）或微分（如 $dy, dx$）**。
- ❌ $x^2 + y^2 = 1$：普通二元二次代数方程（无导数）。
- ✅ $y' + x^2 = 0$：**微分方程**（含有一阶导数 $y'$）。
- ✅ $x \, dy - y \, dx = 0$：**微分方程**（以微分形式呈现）。
:::

::: tip 💡 变量身份辨析
解方程前务必分清“谁是函数、谁是自变量”：
在方程 $y' + y + x = 2$ 中，**$y = y(x)$ 是未知函数**，而 **$x$ 是自变量**。除未知函数 $y$ 及其导数 $y'$ 外，其余项（自变量 $x$ 和常量 $2$）在微积分运算中均被视为已知变量或常数。
:::

---

### 2. 微分方程的“阶”

微分方程中出现的**未知函数最高阶导数的阶数**，称为该微分方程的**阶**（Order）。

| 微分方程 | 最高阶导数项 | 阶数 | 常见认知误区 |
| :--- | :---: | :---: | :--- |
| $y' + x^2 = 0$ | $y'$ | **1 阶** | 最经典的一阶形式 |
| $(y')^3 + y = x$ | $y'$ | **1 阶** | 易误判为 3 阶，注意其为**一阶三次**方程 |
| $y'' + \omega^2 y = 0$ | $y''$ | **2 阶** | 物理简谐振动经典方程 |
| $y''' - 3y' + 2y = e^x$ | $y'''$ | **3 阶** | 阶数只由最高阶导数 $y'''$ 决定 |

> 📌 **口诀记心间**：“**阶看导数几撇，次看幂次几次方**”。阶数只盯未知函数最高被求导了几次！

---

### 3. 解、通解与特解

#### (1) 微分方程的解
设函数 $y = \varphi(x)$ 在区间 $I$ 上具有各阶连续导数，将其代入微分方程后等式在 $I$ 上**恒成立**，则称 $y = \varphi(x)$ 为方程的一个解。

#### (2) 通解（General Solution）
如果微分方程的解中包含有**任意常数**，且**独立的任意常数个数恰好等于该微分方程的阶数**，则称此解为该方程的**通解**。

::: danger 🚨 核心考点：任意常数的独立性（不能被代数吸收）
通解里的任意常数必须**无法通过代数运算合并减少**：
- **伪双常数示例**：$y = x + C_1 + C_2$。看似有两个常数，但令 $C = C_1 + C_2$，可化为 $y = x + C$，本质上只有 **1 个**独立任意常数！
- **真双常数示例**：$y = C_1 e^x + C_2 e^{-x}$。$e^x$ 与 $e^{-x}$ 线性无关，两个常数无法合并，货真价实是 **2 个**独立任意常数。
:::

#### (3) 特解（Particular Solution）
确定了通解中任意常数之后的特定解，称为**特解**。常由题目所给的**初始条件**（如 $y(x_0) = y_0, y'(x_0) = y'_0$）来唯一锁定。

---

### 4. 严密验证题：二阶方程通解判定

<div class="example-box">
  <div class="example-header">
    <div class="example-title">
      <span>📐 概念自检：验证二阶方程的通解</span>
    </div>
    <span class="example-tag">必考概念</span>
  </div>
  <div class="example-body">
    <p><strong>题目</strong>：验证 $y = C_1 \cos x + C_2 \sin x$ 是微分方程 $y'' + y = 0$ 的通解。</p>
    
    <details class="example-details" open>
      <summary>🔍 展开完整推导与得分要点</summary>
      <div class="example-solution">

**【证】**

**第一步：逐阶求导**

$$
\begin{aligned}
y &= C_1 \cos x + C_2 \sin x \\
y' &= -C_1 \sin x + C_2 \cos x \\
y'' &= -C_1 \cos x - C_2 \sin x = - (C_1 \cos x + C_2 \sin x) = -y
\end{aligned}
$$

**第二步：代入方程验证恒等式**

$$
y'' + y = (-y) + y = 0
$$

等式恒成立，故 $y = C_1 \cos x + C_2 \sin x$ 确实是该方程的解。

**第三步：依据定义锁定通解**

原方程的最高阶导数为 $y''$，阶数为 **2**；解中包含 $C_1, C_2$ 两个无法通过初等化简消除的**独立任意常数**。常数个数与方程阶数完全相等，故该解为原方程的**通解**。

      </div>
    </details>
  </div>
</div>

---

## 二、 可分离变量的微分方程

### 1. 标准形式

凡是能够变形为“**一个纯 $x$ 函数与一个纯 $y$ 函数之积**”的一阶方程：

$$
\frac{dy}{dx} = f_1(x) f_2(y) \qquad \text{或对称微分形式：} \quad M_1(x) M_2(y) \, dx + N_1(x) N_2(y) \, dy = 0
$$

即称为**可分离变量的微分方程**。

---

### 2. 标准解题三步法

<div class="step-container">
  <div class="step-card">
    <div class="step-number">1</div>
    <div class="step-content">
      <h4>步骤一：分离变量（两军分立）</h4>
      <p>将含 $y$ 和 $dy$ 的所有项移至左边，含 $x$ 和 $dx$ 的所有项移至右边：让左边只有 $y$，右边只有 $x$。</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-number">2</div>
    <div class="step-content">
      <h4>步骤二：两端同时求不定积分</h4>
      <p>两边同时套上积分号，且只需在某一端加上一个任意常数 $C$：$\int \frac{1}{g(y)} dy = \int f(x) dx + C$。</p>
    </div>
  </div>
  <div class="step-card">
    <div class="step-number">3</div>
    <div class="step-content">
      <h4>步骤三：化简整理与常数吸收</h4>
      <p>利用指数或对数性质去绝对值，将任意常数吸收整合（如令 $C = \pm e^{C_1}$），得出整洁漂亮的通解表达式。</p>
    </div>
  </div>
</div>

---

### 3. 几何直观：解曲线族与高斯钟形图

我们在求解方程 $y' + xy = 0$ 时，求得通解为 $y = C e^{-\frac{x^2}{2}}$。**在几何上，常数 $C$ 的取值不同对应着平面上一组平滑伸展的积分曲线族**：

<div class="math-diagram-container">
<svg viewBox="0 0 680 300" width="100%" height="100%" style="max-width: 650px; font-family: system-ui, -apple-system, sans-serif;">
  <!-- 坐标轴 -->
  <line x1="60" y1="150" x2="620" y2="150" stroke="#94a3b8" stroke-width="1.8" />
  <line x1="340" y1="280" x2="340" y2="20" stroke="#94a3b8" stroke-width="1.8" />
  <polygon points="620,146 628,150 620,154" fill="#94a3b8" />
  <polygon points="336,20 340,12 344,20" fill="#94a3b8" />
  <text x="625" y="142" fill="#64748b" font-size="14" font-style="italic">x</text>
  <text x="352" y="24" fill="#64748b" font-size="14" font-style="italic">y</text>
  <text x="326" y="168" fill="#94a3b8" font-size="13">O</text>

  <!-- 解曲线族：高斯型钟形曲线 y = C * exp(-x^2 / 2) -->
  <!-- C = 2 (峰值在 y = 150 - 100 = 50) -->
  <path d="M 120 148 Q 240 140 290 85 T 340 50 T 390 85 Q 440 140 560 148" fill="none" stroke="#e11d48" stroke-width="2.5" />
  <text x="345" y="44" fill="#e11d48" font-size="12" font-weight="bold">C = 2</text>

  <!-- C = 1 (峰值在 y = 150 - 50 = 100) -->
  <path d="M 120 149 Q 240 145 290 115 T 340 100 T 390 115 Q 440 145 560 149" fill="none" stroke="#f43f5e" stroke-width="2" stroke-dasharray="3 2" />
  <text x="345" y="94" fill="#f43f5e" font-size="12" font-weight="bold">C = 1</text>

  <!-- C = 0 (y = 0 特解，沿 x 轴) -->
  <line x1="100" y1="150" x2="580" y2="150" stroke="#059669" stroke-width="2" />
  <text x="540" y="142" fill="#059669" font-size="12" font-weight="bold">C = 0 (y = 0)</text>

  <!-- C = -1 (下凹高斯) -->
  <path d="M 120 151 Q 240 155 290 185 T 340 200 T 390 185 Q 440 155 560 151" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="3 2" />
  <text x="345" y="215" fill="#3b82f6" font-size="12" font-weight="bold">C = -1</text>

  <!-- C = -2 (下凹高斯深谷) -->
  <path d="M 120 152 Q 240 160 290 215 T 340 250 T 390 215 Q 440 160 560 152" fill="none" stroke="#1d4ed8" stroke-width="2.5" />
  <text x="345" y="265" fill="#1d4ed8" font-size="12" font-weight="bold">C = -2</text>
</svg>
<div class="math-diagram-caption">💡 图 2：微分方程 y' + xy = 0 的积分曲线族 y = C · exp(-x²/2) 几何直观</div>
</div>

---

### 4. 经典例题手把手精解

<div class="example-box">
  <div class="example-header">
    <div class="example-title">
      <span>📝 【例题 1】可分离变量基础题：求解 y' + xy = 0</span>
    </div>
    <span class="example-tag">常数吸收技巧</span>
  </div>
  <div class="example-body">
    <p><strong>题目</strong>：求微分方程 $y' + xy = 0$ 的通解。</p>
    <p>💡 <em>思路点拨：将 $y'$ 改写为 $\frac{dy}{dx}$，移项分离 $x$ 与 $y$。注意常数取绝对值时的合并手法。</em></p>

    <details class="example-details" open>
      <summary>🔍 点击展开分步演算与避坑分析</summary>
      <div class="example-solution">

**【解】**

**Step 1. 改写微分形式并分离变量**

$$
\frac{dy}{dx} = -xy
$$

当 $y \neq 0$ 时，两端同除以 $y$，同乘 $dx$：

$$
\frac{1}{y} \, dy = -x \, dx
$$

**Step 2. 两端同时求积分**

$$
\int \frac{1}{y} \, dy = -\int x \, dx \implies \ln|y| = -\frac{1}{2}x^2 + C_1 \quad (C_1 \text{ 为任意常数})
$$

**Step 3. 显式化与常数整合（大题核心踩分点）**

两端取指数底 $e$：

$$
|y| = e^{C_1 - \frac{1}{2}x^2} = e^{C_1} \cdot e^{-\frac{1}{2}x^2}
$$

去掉绝对值符号：

$$
y = \pm e^{C_1} \cdot e^{-\frac{1}{2}x^2}
$$

令 $C = \pm e^{C_1}$，由于指数函数恒大于 0，此处 $C \neq 0$。

**检查漏解**：在最初分离变量时我们假设了 $y \neq 0$。直接将 $y = 0$ 代入原方程 $y' + xy = 0$，左端 $= 0 + 0 = 0$ 恒成立，说明 $y = 0$ 也是方程的解。当 $C = 0$ 时正好囊括了 $y = 0$！

因此，全区间上的通解可统一写为：

$$
y = C e^{-\frac{1}{2}x^2} \quad (C \text{ 为任意实常数})
$$

      </div>
    </details>
  </div>
</div>

<div class="example-box">
  <div class="example-header">
    <div class="example-title">
      <span>🎯 【例题 2】初值问题（求特解）：dy/dx = 2xy, y(0) = 1</span>
    </div>
    <span class="example-tag">特解锁定</span>
  </div>
  <div class="example-body">
    <p><strong>题目</strong>：求微分方程 $\frac{dy}{dx} = 2xy$ 满足初始条件 $y(0) = 1$ 的特解。</p>

    <details class="example-details">
      <summary>🔍 点击展开求特解推导</summary>
      <div class="example-solution">

**【解】**

1. **分离变量**：

$$
\frac{1}{y} \, dy = 2x \, dx
$$

2. **两端积分**：

$$
\int \frac{1}{y} \, dy = \int 2x \, dx \implies \ln|y| = x^2 + C_1 \implies y = C e^{x^2}
$$

3. **代入初始条件** $x = 0, y = 1$：

$$
1 = C e^{0^2} \implies 1 = C \cdot 1 \implies C = 1
$$

4. **故满足题意初始条件的特解为**：

$$
y = e^{x^2}
$$

      </div>
    </details>
  </div>
</div>

---

## 三、 齐次微分方程

### 1. 什么是齐次方程？

如果一阶微分方程中的导数 $\frac{dy}{dx}$ 可以写为**比值 $\frac{y}{x}$ 的一元函数**，即形如：

$$
\frac{dy}{dx} = f\left(\frac{y}{x}\right)
$$

则称该方程为**齐次微分方程**（Homogeneous Differential Equation）。

> 💡 **几何与高中的灵感串联**：
> 在高中平面解析几何中，经过原点的直线斜率恰好就是 $k = \frac{y}{x}$。齐次方程正是抓住了这一“**同次比值整体**”的不变性，通过换元实现降维打击！

---

### 2. 解题核心：换元三板斧（四步通关）

齐次方程本身并不满足分离变量条件，但**只要换元，就能立刻化归为上一节的“可分离变量方程”**。

<div class="math-showcase">
  <div class="math-showcase-title">
    <span>🔥 齐次方程灵魂换元三板斧（务必背诵）</span>
  </div>
  <div class="math-showcase-body">

$$
\begin{cases}
1. \quad \text{令 } u = \dfrac{y}{x} \\
2. \quad \text{反解得 } y = u x \\
3. \quad \text{两端对 } x \text{ 求导：} \dfrac{dy}{dx} = u + x\dfrac{du}{dx}
\end{cases}
$$

  </div>
</div>

::: tip 💡 乘积求导法则解析
很多初学者容易在这里漏掉项。因为 $u = u(x)$ 是 $x$ 的未知函数，根据乘积导数公式 $(uv)' = u'v + uv'$：
$$
\frac{d}{dx}(ux) = \frac{du}{dx} \cdot x + u \cdot \frac{dx}{dx} = x\frac{du}{dx} + u
$$
:::

#### 齐次四步求解全景：
1. **代换导数**：将 $\frac{dy}{dx} = u + x\frac{du}{dx}$ 代入原方程：
   $$
   u + x\frac{du}{dx} = f(u)
   $$
2. **分离变量**：移项消元：
   $$
   x\frac{du}{dx} = f(u) - u \implies \frac{1}{f(u) - u} \, du = \frac{1}{x} \, dx
   $$
3. **两端积分**：
   $$
   \int \frac{1}{f(u) - u} \, du = \int \frac{1}{x} \, dx = \ln|x| + C
   $$
4. **回代整理**：将 $u = \frac{y}{x}$ 替换回来，整理得通解。

---

### 3. 经典考题深入剖析

<div class="example-box">
  <div class="example-header">
    <div class="example-title">
      <span>⚡ 【例题 3】基础入门：求解 dy/dx = (x + y) / x</span>
    </div>
    <span class="example-tag">换元标准流</span>
  </div>
  <div class="example-body">
    <p><strong>题目</strong>：求微分方程 $\frac{dy}{dx} = \frac{x + y}{x}$ 的通解。</p>

    <details class="example-details" open>
      <summary>🔍 点击展开四步推导</summary>
      <div class="example-solution">

**【解】**

**Step 1. 拆项识别齐次式**

$$
\frac{dy}{dx} = \frac{x}{x} + \frac{y}{x} = 1 + \frac{y}{x} \implies f(u) = 1 + u
$$

**Step 2. 换元并代入**

令 $u = \frac{y}{x}$，则 $\frac{dy}{dx} = u + x\frac{du}{dx}$，代入方程得：

$$
u + x\frac{du}{dx} = 1 + u
$$

**Step 3. 分离变量并两端积分**

两端消去 $u$：

$$
x\frac{du}{dx} = 1 \implies du = \frac{1}{x} \, dx
$$

两端同时积分：

$$
\int du = \int \frac{1}{x} \, dx \implies u = \ln|x| + C
$$

**Step 4. 回代 $u = \frac{y}{x}$**

$$
\frac{y}{x} = \ln|x| + C \implies y = x(\ln|x| + C)
$$

此即原微分方程的通解。

      </div>
    </details>
  </div>
</div>

<div class="example-box">
  <div class="example-header">
    <div class="example-title">
      <span>🏆 【例题 4】高频真题：求解 (x² + y²)dx - xy dy = 0</span>
    </div>
    <span class="example-tag">同次齐次项拆分</span>
  </div>
  <div class="example-body">
    <p><strong>题目</strong>：求微分方程 $(x^2 + y^2) \, dx - xy \, dy = 0$ 的通解。</p>
    <p>💡 <em>思路点拨：各项均为 2 次（$x^2, y^2, xy$），同除以 $x^2$ 瞬间呈现齐次比值。</em></p>

    <details class="example-details" open>
      <summary>🔍 点击展开完整解题细节</summary>
      <div class="example-solution">

**【解】**

**Step 1. 变形构造 $\frac{y}{x}$**

移项可得：

$$
xy \, dy = (x^2 + y^2) \, dx \implies \frac{dy}{dx} = \frac{x^2 + y^2}{xy}
$$

分子分母同除以 $x^2$：

$$
\frac{dy}{dx} = \frac{1 + \left(\frac{y}{x}\right)^2}{\frac{y}{x}}
$$

**Step 2. 换元三板斧**

令 $u = \frac{y}{x}$，则 $\frac{dy}{dx} = u + x\frac{du}{dx}$，代入得：

$$
u + x\frac{du}{dx} = \frac{1 + u^2}{u} = \frac{1}{u} + u
$$

**Step 3. 分离变量并积分**

两端消去 $u$：

$$
x\frac{du}{dx} = \frac{1}{u} \implies u \, du = \frac{1}{x} \, dx
$$

两端求积分：

$$
\int u \, du = \int \frac{1}{x} \, dx \implies \frac{1}{2}u^2 = \ln|x| + C_1
$$

两边同乘 2 并重整常数（令 $C = 2C_1$）：

$$
u^2 = 2\ln|x| + C
$$

**Step 4. 回代 $u = \frac{y}{x}$**

$$
\left(\frac{y}{x}\right)^2 = 2\ln|x| + C \implies y^2 = x^2(2\ln|x| + C)
$$

此即原方程的隐式通解。

      </div>
    </details>
  </div>
</div>

---

## 四、 核心知识点通关小测验

读完这篇讲义，来测一测你对核心考点的掌握程度吧！（点击卡片即可展开解析）：

<details class="quiz-panel">
  <summary>
    <span>❓ 测验 1：方程 $((y')^3)^2 + y''' = \sin x$ 的阶数是多少？</span>
    <span style="color: var(--accent-color); font-size: 13px;">点击查看解析 ▼</span>
  </summary>
  <div class="quiz-answer">

**【答案】**：**3 阶**。

**【深度解析】**：阶数只取决于未知函数出现的**最高阶导数的阶数**。方程中最高阶导数为 $y'''$（三阶导数），虽然 $y'$ 的复合幂次达到了 6 次，但导数本身仍是一阶，因此整方程的阶数为 3。

  </div>
</details>

<details class="quiz-panel">
  <summary>
    <span>❓ 测验 2：函数 $y = C_1 e^x + C_2 e^{x+2}$ 能否作为二阶方程的通解？</span>
    <span style="color: var(--accent-color); font-size: 13px;">点击查看解析 ▼</span>
  </summary>
  <div class="quiz-answer">

**【答案】**：**不能**。

**【深度解析】**：利用指数性质，$C_2 e^{x+2} = (C_2 e^2) e^x$。原式可化为 $y = (C_1 + C_2 e^2) e^x = C e^x$。这里的两个常数并不独立，本质上只有 1 个独立任意常数，不能作为二阶方程的通解（二阶方程通解必须含有 2 个独立任意常数）。

  </div>
</details>

<details class="quiz-panel">
  <summary>
    <span>❓ 测验 3：齐次方程在分离变量后积出 $\ln|y/x| = \ln|x| + C$，如何化简最优雅？</span>
    <span style="color: var(--accent-color); font-size: 13px;">点击查看解析 ▼</span>
  </summary>
  <div class="quiz-answer">

**【答案】**：通解可优雅写为 **$y = C x^2$**。

**【深度解析】**：将右边常数写为 $\ln C_1$（$C_1 > 0$），则 $\ln|\frac{y}{x}| = \ln(C_1 |x|) \implies |\frac{y}{x}| = C_1 |x| \implies y = \pm C_1 x^2$。将 $\pm C_1$ 结合 $y=0$ 统一吸收为任意常数 $C$，即得 $y = C x^2$。

  </div>
</details>

---

## 五、 考场速查备忘口诀

| 方程模型 | 判定特征 | 核心手法 | 踩分关键点 |
| :--- | :--- | :--- | :--- |
| **可分离变量** | 能因式分解为 $f(x) \cdot g(y)$ | **$x$ 归 $x$，$y$ 归 $y$** | 除式前注意 $g(y)=0$ 特解检验；利用 $C=\pm e^{C_1}$ 吸收绝对值 |
| **齐次方程** | 各项次数相同，或含 $\frac{y}{x}$ | **令 $u = \frac{y}{x}$，代入 $\frac{dy}{dx} = u + x\frac{du}{dx}$** | 积法则导数切勿漏项；求出 $u$ 后务必回代为 $\frac{y}{x}$ |

> 🌟 **写在最后**：
> 微分方程的本质是“**化未知为已知**”。无论是变量分离还是齐次换元，核心都是将复杂的导数关系化简为我们最熟悉的**不定积分**。掌握了这套标准化流程，面对考题便能胸有成竹！
