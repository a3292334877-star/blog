---
title: 微积分入门：极限、导数与积分
date: 2026-11-19
description: 一条线打通微积分：从极限与等价无穷小，到导数定义、求导法则与极值，再到不定积分、定积分和牛顿-莱布尼茨公式，配方法决策图、几何直观与真题演算。
tags: [高等数学, 微积分, 专升本, 教程]
cover: /covers/calculus-basics.svg
---

<div class="math-hero-meta">
  <span class="math-badge">📚 专升本/考研必考</span>
  <span class="math-badge">⏱️ 建议阅读 18 分钟</span>
  <span class="math-badge">🧠 极限 → 导数 → 积分</span>
  <span class="math-badge">📐 切线斜率与面积直观</span>
  <span class="math-badge">🧮 换元 / 分部决策图</span>
  <span class="math-badge">✅ 核心公式速查</span>
</div>

微积分看起来公式很多，其实只围绕两个问题展开：**“某一瞬间变化得多快？”**（导数）以及**“把无数个微小部分累加起来是多少？”**（积分）。把这两个问题连接起来的，是极限。

本文从极限出发，沿着“**极限 → 导数 → 积分**”这条主线，梳理专升本与考研最常考的定义、公式和解题套路，并配以**方法决策图**、**几何直观**与**典型例题**，帮你把零散公式串成一张网。

<!-- more -->

![暖光书桌上的微积分手绘笔记：曲线、割线与曲边阴影面积](/images/posts/calculus-study-desk.webp)

---

## 🧭 不定积分方法决策导图

面对一道积分题，第一步不是埋头硬算，而是**先看结构，再选方法**：

<CalculusMethodTree />

> 📌 决策顺序：**能直接套公式就套公式 → 有内层导数就凑微分 → 是两个函数相乘想分部 → 有理分式先拆分**。

---

## 一、极限：微积分的地基

### 1. 极限在描述“无限接近”

设函数 $f(x)$ 在 $x_0$ 的某个去心邻域内有定义。如果当 $x$ 无限接近 $x_0$（但 $x \neq x_0$）时，$f(x)$ 无限接近常数 $A$，就称 $A$ 为 $f(x)$ 当 $x \to x_0$ 时的极限，记作：

<MathShowcase title="📐 极限的定义式">

$$
\lim_{x \to x_0} f(x) = A
$$

</MathShowcase>

::: warning ⚠️ 极限与函数在这一点的取值无关
极限只关心 $x$ **靠近** $x_0$ 时函数的变化趋势，与 $f(x_0)$ 是否有定义、等于多少都没有关系。
- $f(x)=\dfrac{x^2-1}{x-1}$ 在 $x=1$ 处无定义，但 $\lim\limits_{x\to1}f(x)=2$。
- 只有再加上 $\lim\limits_{x\to x_0}f(x)=f(x_0)$，才说明函数在 $x_0$ 处**连续**。
:::

::: tip 💡 判断极限存在的常用思路
左右极限都存在且相等，才能说明极限存在：

$$
\lim_{x \to x_0^-} f(x) = \lim_{x \to x_0^+} f(x) = A
$$

分段函数在分界点、含绝对值或开偶次方的函数，优先分左右讨论。
:::

---

### 2. 两个重要极限

<MathShowcase title="⭐ 必须脱口而出的两个极限">

$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
\qquad\qquad
\lim_{x \to \infty} \left(1 + \frac{1}{x}\right)^{x} = e
$$

</MathShowcase>

第二个极限常以变形出现：$\lim\limits_{x\to0}(1+x)^{1/x}=e$，以及 $1^{\infty}$ 型未定式常用

$$
\lim_{x \to \infty}\left(1+\frac{a}{x}\right)^{bx}=e^{ab}
$$

---

### 3. 等价无穷小：化简极限的利器

当 $x \to 0$ 时，下列替换可以把复杂函数换成最简幂函数：

| 常见形式 | 等价无穷小 | 记忆方式 |
| :--- | :---: | :--- |
| $\sin x$ | $\sim x$ | 正弦一阶 |
| $\tan x$、$\arcsin x$、$\arctan x$ | $\sim x$ | 与 $x$ 同阶 |
| $1-\cos x$ | $\sim \dfrac{1}{2}x^2$ | 余弦差二阶 |
| $\ln(1+x)$、$e^x-1$ | $\sim x$ | 对数、指数一阶 |
| $(1+x)^\alpha-1$ | $\sim \alpha x$ | 广义二项式 |

::: danger 🚨 最容易丢分的地方：加减不能随意替换
等价无穷小替换只对**乘除因子**安全。加减法中直接替换，可能把真正的高阶项抵消掉。
例如 $\lim\limits_{x\to0}\dfrac{x-\sin x}{x^3}$，若把 $\sin x$ 直接换成 $x$，会错误得到 $0$；正确答案是 $\dfrac{1}{6}$。
:::

<ExampleBox title="📝 【例题 1】等价无穷小基础题" tag="1∞ 与二阶无穷小">

**题目**：求 $\lim\limits_{x \to 0} \dfrac{1-\cos x}{x^2}$。

<ExampleSolution summary="🔍 展开两种解法" :open="true">

**解法一：等价无穷小**

当 $x \to 0$ 时，$1-\cos x \sim \dfrac{1}{2}x^2$，因此

$$
\lim_{x\to0}\frac{1-\cos x}{x^2}
= \lim_{x\to0}\frac{\frac{1}{2}x^2}{x^2}
= \frac{1}{2}
$$

**解法二：二倍角公式**

利用 $1-\cos x = 2\sin^2\dfrac{x}{2}$：

$$
\lim_{x\to0}\frac{2\sin^2\frac{x}{2}}{x^2}
= \lim_{x\to0}2\left(\frac{\sin\frac{x}{2}}{\frac{x}{2}}\right)^2\cdot\frac{1}{4}
= \frac{1}{2}
$$

</ExampleSolution>

</ExampleBox>

---

## 二、导数：刻画瞬时变化率

### 1. 导数的定义

函数 $y=f(x)$ 在 $x_0$ 处的导数，是**函数增量与自变量增量之比的极限**：

<MathShowcase title="📐 导数的两种等价写法">

$$
f'(x_0)
= \lim_{\Delta x \to 0}\frac{f(x_0+\Delta x)-f(x_0)}{\Delta x}
= \lim_{x \to x_0}\frac{f(x)-f(x_0)}{x-x_0}
$$

</MathShowcase>

- **几何意义**：曲线 $y=f(x)$ 在点 $(x_0,f(x_0))$ 处**切线的斜率**。
- **物理意义**：位移 $s(t)$ 对时间求导，就是**瞬时速度** $v=s'(t)$。

### 2. 可导与连续的关系

::: warning ⚠️ 可导一定连续，连续不一定可导
- $y=|x|$ 在 $x=0$ 处连续，但左右导数分别为 $-1$ 和 $1$，**不可导**（尖点）。
- 分段函数在分界点处，必须分别用**左导数**与**右导数**判断，二者相等才可导。
:::

### 3. 求导公式与法则

| 基本函数 | 导数 | 基本函数 | 导数 |
| :--- | :---: | :--- | :---: |
| $C$（常数） | $0$ | $x^\alpha$ | $\alpha x^{\alpha-1}$ |
| $\sin x$ | $\cos x$ | $\cos x$ | $-\sin x$ |
| $e^x$ | $e^x$ | $a^x$ | $a^x\ln a$ |
| $\ln x$ | $\dfrac{1}{x}$ | $\tan x$ | $\sec^2 x$ |
| $\arctan x$ | $\dfrac{1}{1+x^2}$ | $\arcsin x$ | $\dfrac{1}{\sqrt{1-x^2}}$ |

<MathShowcase title="🔧 四则运算与链式法则">

$$
(u \pm v)' = u' \pm v'
\qquad
(uv)' = u'v + uv'
\qquad
\left(\frac{u}{v}\right)' = \frac{u'v-uv'}{v^2}
$$

$$
\frac{dy}{dx} = \frac{dy}{du}\cdot\frac{du}{dx}
\qquad \text{（链式法则：由外向内逐层求导）}
$$

</MathShowcase>

::: tip 💡 链式法则口诀
“**外层先求导，内层照抄；再乘以内层导数**”。复合层数多时，就像剥洋葱一样一层一层往里写，直到最内层是 $x$。
:::

<ExampleBox title="🎯 【例题 2】复合函数求导" tag="链式法则">

**题目**：求 $y=\sin(x^2)+e^{-x}$ 的导数。

<ExampleSolution summary="🔍 展开逐项求导过程">

**第一步：对 $\sin(x^2)$ 用链式法则**

外层是 $\sin u$，内层是 $u=x^2$：

$$
\left[\sin(x^2)\right]' = \cos(x^2)\cdot (x^2)' = 2x\cos(x^2)
$$

**第二步：对 $e^{-x}$ 用链式法则**

$$
\left(e^{-x}\right)' = e^{-x}\cdot(-x)' = -e^{-x}
$$

**第三步：合并**

$$
y' = 2x\cos(x^2) - e^{-x}
$$

</ExampleSolution>

</ExampleBox>

<ExampleBox title="⚡ 【例题 3】隐函数求导" tag="方程两边同时对 x 求导">

**题目**：已知 $x^2+y^2=1$，求 $\dfrac{dy}{dx}$。

<ExampleSolution summary="🔍 展开隐函数求导细节">

**【解】**

把 $y$ 看作 $x$ 的函数 $y=y(x)$，方程两端同时对 $x$ 求导：

$$
2x + 2y\cdot y' = 0
$$

解出 $y'$：

$$
y' = -\frac{x}{y} \qquad (y \neq 0)
$$

> 💡 求某一点切线斜率时，把该点坐标直接代入 $y'=-\dfrac{x}{y}$ 即可；若 $y=0$，对应点是曲线与 $x$ 轴的交点，此时切线竖直，斜率不存在。
</ExampleSolution>

</ExampleBox>

### 4. 几何直观：从切线到面积

<DerivativeIntegralVisual />

左侧的切线斜率就是导数，右侧的曲边梯形面积就是定积分。现在先记住这张图，学到第五节时再回头看，会发现它们其实描述的是同一件事的两个侧面。

---

## 三、导数的应用：单调性与极值

### 1. 标准四步法

<StepCards>

<StepCard num="1" title="步骤一：确定定义域，求 f′(x)">

先写出函数的定义域，再逐项求导。含分母、对数、偶次根号时，定义域往往就是易错点。

</StepCard>

<StepCard num="2" title="步骤二：找驻点与不可导点">

解 $f'(x)=0$ 得到驻点，再补上导数不存在但函数有定义的点，这些点把定义域分成若干区间。

</StepCard>

<StepCard num="3" title="步骤三：判断 f′(x) 的符号">

在每个区间内取一个测试点，判断 $f'(x)$ 的正负，从而得到单调递增或递减区间。

</StepCard>

<StepCard num="4" title="步骤四：判定极值并比较端点">

$f'(x)$ 由正变负为极大值，由负变正为极小值；闭区间上的最值还要和两个端点函数值比较。

</StepCard>

</StepCards>

<ExampleBox title="🏆 【例题 4】求单调区间与极值" tag="三次函数标准题">

**题目**：求 $f(x)=x^3-3x$ 的单调区间与极值。

<ExampleSolution summary="🔍 展开完整判号过程" :open="true">

**【解】**

**第一步：求导并因式分解**

$$
f'(x)=3x^2-3=3(x-1)(x+1)
$$

**第二步：确定驻点并分区间**

驻点为 $x=-1$ 与 $x=1$，把定义域分成三个区间。

| 区间 | $(-\infty,-1)$ | $(-1,1)$ | $(1,+\infty)$ |
| :--- | :---: | :---: | :---: |
| $f'(x)$ 符号 | $+$ | $-$ | $+$ |
| $f(x)$ 单调性 | 递增 ↗ | 递减 ↘ | 递增 ↗ |

**第三步：读出极值**

- $x=-1$ 处导数由正变负，取**极大值**：$f(-1)=(-1)^3-3(-1)=2$。
- $x=1$ 处导数由负变正，取**极小值**：$f(1)=1^3-3=-2$。

故递增区间为 $(-\infty,-1)$ 与 $(1,+\infty)$，递减区间为 $(-1,1)$。

</ExampleSolution>

</ExampleBox>

---

## 四、不定积分：导数的逆运算

### 1. 不定积分的定义

如果 $F'(x)=f(x)$，就称 $F(x)$ 是 $f(x)$ 的一个**原函数**，并把全体原函数记为：

<MathShowcase title="📐 不定积分与任意常数 C">

$$
\int f(x)\,dx = F(x) + C
\qquad (C \text{ 为任意常数})
$$

</MathShowcase>

::: danger 🚨 不定积分最容易漏掉的东西：+ C
求导会把常数“抹掉”，所以积分必须把常数补回来。**不定积分的结果是一族函数，不是一个函数**。考试中漏写 $C$ 往往直接扣分。
:::

### 2. 基本积分表

| 被积函数 | 原函数 | 被积函数 | 原函数 |
| :--- | :---: | :--- | :---: |
| $x^\alpha\ (\alpha\neq-1)$ | $\dfrac{x^{\alpha+1}}{\alpha+1}+C$ | $\dfrac{1}{x}$ | $\ln\lvert x\rvert+C$ |
| $e^x$ | $e^x+C$ | $a^x$ | $\dfrac{a^x}{\ln a}+C$ |
| $\sin x$ | $-\cos x+C$ | $\cos x$ | $\sin x+C$ |
| $\sec^2 x$ | $\tan x+C$ | $\dfrac{1}{1+x^2}$ | $\arctan x+C$ |

### 3. 第一类换元法：凑微分

<MathShowcase title="🔁 凑微分公式">

$$
\int f(\varphi(x))\,\varphi'(x)\,dx
= \int f(u)\,du
\qquad (u=\varphi(x))
$$

</MathShowcase>

<StepCards>

<StepCard num="1" title="步骤一：观察内层函数">

找到被积函数里的 $\varphi(x)$，看它的导数 $\varphi'(x)$ 是否也（差一个常数倍）出现在旁边。

</StepCard>

<StepCard num="2" title="步骤二：凑出微分">

把 $\varphi'(x)\,dx$ 整体写成 $d\varphi(x)$，例如 $2x\,dx=d(x^2)$、$\dfrac{1}{x}\,dx=d(\ln x)$。

</StepCard>

<StepCard num="3" title="步骤三：换元积分并回代">

对 $u$ 积分后，把 $u=\varphi(x)$ 代回，得到关于 $x$ 的结果。

</StepCard>

</StepCards>

> 🧠 常见凑微分：$dx=d(x+b)$，$2x\,dx=d(x^2)$，$\cos x\,dx=d(\sin x)$，$\dfrac{1}{x}\,dx=d(\ln x)$，$e^x\,dx=d(e^x)$。

<ExampleBox title="📝 【例题 5】凑微分基础题" tag="内层导数恰好在场">

**题目**：求 $\displaystyle\int \frac{2x}{x^2+1}\,dx$。

<ExampleSolution summary="🔍 展开换元过程" :open="true">

**【解】**

注意到 $(x^2+1)'=2x$，于是

$$
\int \frac{2x}{x^2+1}\,dx
= \int \frac{1}{x^2+1}\,d(x^2+1)
$$

令 $u=x^2+1$，则

$$
\int \frac{1}{u}\,du = \ln\lvert u\rvert + C
= \ln(x^2+1)+C
$$

因为 $x^2+1>0$，所以绝对值可以去掉。

</ExampleSolution>

</ExampleBox>

### 4. 第二类换元与分部积分

第二类换元法（如令 $x=a\sin t$、$x=a\tan t$）主要用于处理根式。更常考的**分部积分**则专门对付“两类函数相乘”的积分：

<MathShowcase title="🔥 分部积分公式（务必背熟）">

$$
\int u\,dv = uv - \int v\,du
$$

</MathShowcase>

::: tip 💡 选 u 的口诀：反对幂指三
被积函数是两类函数相乘时，按“**反三角 → 对数 → 幂函数 → 指数 → 三角**”的顺序，**排在前面的选作 $u$**，剩下的连同 $dx$ 作为 $dv$。
例如 $\int x e^x\,dx$ 中，幂函数排在指数前，所以取 $u=x$、$dv=e^x\,dx$。
:::

<ExampleBox title="⚡ 【例题 6】分部积分经典题" tag="幂 × 指数">

**题目**：求 $\displaystyle\int x e^x\,dx$。

<ExampleSolution summary="🔍 展开 u、dv 的选择与计算" :open="true">

**【解】**

取 $u=x$，$dv=e^x\,dx$，则 $du=dx$，$v=e^x$。代入分部积分公式：

$$
\int x e^x\,dx
= x e^x - \int e^x\,dx
= x e^x - e^x + C
= (x-1)e^x + C
$$

> 💡 检验：对 $(x-1)e^x$ 求导，得 $e^x+(x-1)e^x=xe^x$，与原被积函数一致。
</ExampleSolution>

</ExampleBox>

---

## 五、定积分与微积分基本定理

### 1. 定积分的几何意义

定积分是“**无限细分再求和**”的极限：

<MathShowcase title="📐 定积分的黎曼和定义">

$$
\int_a^b f(x)\,dx
= \lim_{\lambda \to 0}\sum_{i=1}^{n} f(\xi_i)\,\Delta x_i
$$

</MathShowcase>

几何上，它表示曲线 $y=f(x)$、直线 $x=a$、$x=b$ 以及 $x$ 轴围成的**曲边梯形面积的代数和**：$x$ 轴上方的面积为正，下方的面积为负。

### 2. 牛顿-莱布尼茨公式

<MathShowcase title="⭐ 微积分基本定理">

$$
\int_a^b f(x)\,dx = F(b)-F(a) = F(x)\Big|_a^b
\qquad (F'(x)=f(x))
$$

</MathShowcase>

::: tip 💡 计算口诀
“**先求原函数，上限代进去，减去下限代进去**”。定积分的结果是一个数，不需要再写 $+C$。
:::

<ExampleBox title="🎯 【例题 7】定积分计算" tag="代入上下限">

**题目**：计算 $\displaystyle\int_0^1 x^2\,dx$ 与 $\displaystyle\int_0^{\frac{\pi}{2}} \cos x\,dx$。

<ExampleSolution summary="🔍 展开两个定积分" :open="true">

**第一个积分**

$x^2$ 的一个原函数是 $\dfrac{x^3}{3}$，所以

$$
\int_0^1 x^2\,dx
= \frac{x^3}{3}\Big|_0^1
= \frac{1}{3}-0
= \frac{1}{3}
$$

**第二个积分**

$\cos x$ 的一个原函数是 $\sin x$，所以

$$
\int_0^{\frac{\pi}{2}} \cos x\,dx
= \sin x\Big|_0^{\frac{\pi}{2}}
= \sin\frac{\pi}{2}-\sin 0
= 1
$$

</ExampleSolution>

</ExampleBox>

### 3. 变上限积分求导

设 $\Phi(x)=\displaystyle\int_a^x f(t)\,dt$，则

$$
\Phi'(x)=f(x)
$$

如果上下限都是 $x$ 的函数，则要用链式法则：

$$
\frac{d}{dx}\int_{\psi(x)}^{\varphi(x)} f(t)\,dt
= f(\varphi(x))\,\varphi'(x) - f(\psi(x))\,\psi'(x)
$$

::: warning ⚠️ 被积函数里含 x 时不能直接套公式
若积分号内出现 $x$（如 $\int_0^x x f(t)\,dt$），要先把 $x$ 提到积分号外，或通过换元把 $x$ 从被积函数中消去，再求导。
:::

---

## 六、核心考点通关小测验

读完这篇讲义，来测一测你对极限、导数与积分的掌握程度吧！（点击卡片展开解析）

<QuizPanel>

<template #question>

❓ 测验 1：求 $\lim\limits_{x \to 0}\dfrac{\tan x - \sin x}{x^3}$。

</template>

**【答案】**：$\dfrac{1}{2}$。

**【深度解析】**：先提取公因式：

$$
\tan x-\sin x=\tan x\,(1-\cos x)
$$

当 $x\to0$ 时，$\tan x \sim x$，$1-\cos x \sim \dfrac{1}{2}x^2$，所以

$$
\frac{\tan x-\sin x}{x^3}
\sim \frac{x\cdot \frac{1}{2}x^2}{x^3}
= \frac{1}{2}
$$

这里 $\tan x$ 与 $1-\cos x$ 是**乘积关系**，所以可以放心使用等价无穷小替换。

</QuizPanel>

<QuizPanel>

<template #question>

❓ 测验 2：求 $f(x)=x\ln x$ 的极小值。

</template>

**【答案】**：极小值为 $-\dfrac{1}{e}$，在 $x=\dfrac{1}{e}$ 处取得。

**【深度解析】**：定义域为 $x>0$。

$$
f'(x)=\ln x + 1
$$

令 $f'(x)=0$，得 $\ln x=-1$，即 $x=e^{-1}=\dfrac{1}{e}$。

当 $0<x<\dfrac{1}{e}$ 时 $f'(x)<0$，函数递减；当 $x>\dfrac{1}{e}$ 时 $f'(x)>0$，函数递增。因此 $x=\dfrac{1}{e}$ 是极小值点：

$$
f\left(\frac{1}{e}\right)=\frac{1}{e}\ln\frac{1}{e}=-\frac{1}{e}
$$

</QuizPanel>

<QuizPanel>

<template #question>

❓ 测验 3：求 $\displaystyle\int x\cos x\,dx$。

</template>

**【答案】**：$x\sin x+\cos x+C$。

**【深度解析】**：幂函数乘三角函数，按“反对幂指三”取 $u=x$，$dv=\cos x\,dx$，则 $du=dx$，$v=\sin x$：

$$
\int x\cos x\,dx
= x\sin x-\int \sin x\,dx
= x\sin x+\cos x+C
$$

</QuizPanel>

---

## 七、考场速查备忘表

| 主题 | 必背内容 | 使用提醒 |
| :--- | :--- | :--- |
| 重要极限 | $\lim\limits_{x\to0}\dfrac{\sin x}{x}=1$，$\lim\limits_{x\to\infty}\left(1+\dfrac{1}{x}\right)^x=e$ | $1^\infty$ 型先化成第二个极限 |
| 等价无穷小 | $\sin x\sim x$，$1-\cos x\sim\dfrac{x^2}{2}$，$\ln(1+x)\sim x$ | 只能用于乘除因子 |
| 导数定义 | $f'(x_0)=\lim\limits_{\Delta x\to0}\dfrac{f(x_0+\Delta x)-f(x_0)}{\Delta x}$ | 分段点用左右导数 |
| 链式法则 | $\dfrac{dy}{dx}=\dfrac{dy}{du}\cdot\dfrac{du}{dx}$ | 由外向内逐层求导 |
| 极值判定 | $f'$ 由正变负为极大，由负变正为极小 | 闭区间最值别忘端点 |
| 基本积分 | $\displaystyle\int x^\alpha dx=\frac{x^{\alpha+1}}{\alpha+1}+C$ | 不定积分别漏 $+C$ |
| 凑微分 | $\displaystyle\int f(\varphi(x))\varphi'(x)dx=\int f(u)du$ | 先找内层导数 |
| 分部积分 | $\displaystyle\int u\,dv=uv-\int v\,du$ | 按“反对幂指三”选 $u$ |
| 牛顿-莱布尼茨 | $\displaystyle\int_a^b f(x)dx=F(b)-F(a)$ | 结果是数，不写 $+C$ |
| 变上限积分 | $\dfrac{d}{dx}\displaystyle\int_a^x f(t)dt=f(x)$ | 上下限含 $x$ 用链式法则 |

> 🌟 **写在最后**：
> 微积分的主线可以压缩成一句话——**极限定义变化，导数描述变化，积分累积变化，而基本定理把导数与积分重新接上**。把这条主线想清楚，再多的公式也只是它的不同侧面。
