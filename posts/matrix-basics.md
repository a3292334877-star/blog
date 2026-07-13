---
title: 矩阵入门：从高斯消元到特征值
date: 2026-06-03
tags: [教程, 线性代数, 高等数学]
cover: /blog/covers/matrix-basics.svg
---

**矩阵**是线性代数最核心的工具。它不仅仅是数字的排列，更是**线性变换**的数学表示。本文从零开始，梳理矩阵的基本概念与运算。

<!-- more -->

## 一、什么是矩阵

一个 $m \times n$ 矩阵由 $m$ 行、$n$ 列共 $mn$ 个元素组成：

$$
A = \begin{bmatrix}
a_{11} & a_{12} & \cdots & a_{1n} \\
a_{21} & a_{22} & \cdots & a_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
a_{m1} & a_{m2} & \cdots & a_{mn}
\end{bmatrix}
$$

矩阵可以理解为**从 $\mathbb{R}^n$ 到 $\mathbb{R}^m$ 的线性映射** $T(\mathbf{x}) = A\mathbf{x}$。

### 特殊矩阵

| 名称 | 定义 |
|------|------|
| 零矩阵 | 所有元素为 0 |
| 方阵 | $m = n$ |
| 单位矩阵 $I$ | 主对角元为 1，其余为 0 |
| 对角矩阵 | 非主对角元全为 0 |
| 对称矩阵 | $A^T = A$ |
| 上三角矩阵 | 主对角线以下全为 0 |

## 二、矩阵运算

### 2.1 加法与数乘

同型矩阵逐元素相加；数乘则每个元素乘以标量：

$$
(A + B)_{ij} = a_{ij} + b_{ij}, \qquad (cA)_{ij} = c \cdot a_{ij}
$$

### 2.2 矩阵乘法

$A$ 为 $m \times p$，$B$ 为 $p \times n$，乘积 $C = AB$ 为 $m \times n$：

$$
c_{ij} = \sum_{k=1}^{p} a_{ik}\, b_{kj}
$$

::: warning 注意
矩阵乘法**不满足交换律**！一般 $AB \neq BA$。
:::

### 2.3 转置

$$
(A^T)_{ij} = a_{ji}
$$

重要性质：$(AB)^T = B^T A^T$。

### 2.4 逆矩阵

若存在 $B$ 使得 $AB = BA = I$，则称 $B$ 为 $A$ 的逆，记作 $A^{-1}$。

**可逆的充要条件**：$\det(A) \neq 0$（行列式不为零）。

---

## 三、初等行变换与高斯消元

**三种初等行变换**：

1. **交换两行**：$R_i \leftrightarrow R_j$
2. **某行乘非零常数**：$R_i \leftarrow \lambda R_i$
3. **一行加上另一行的倍数**：$R_i \leftarrow R_i + \lambda R_j$

每种初等变换对应一个**初等矩阵**左乘。

### 高斯消元示例

求解方程组：

$$
\begin{cases}
2x + y - z = 8 \\
-3x - y + 2z = -11 \\
-2x + y + 2z = -3
\end{cases}
$$

**写出增广矩阵**：

$$
\left[\begin{array}{ccc|c}
2 & 1 & -1 & 8 \\
-3 & -1 & 2 & -11 \\
-2 & 1 & 2 & -3
\end{array}\right]
$$

**消元过程**：

<div class="steps">

**Step 1**：$R_2 \leftarrow R_2 + \frac{3}{2}R_1$

$$
\left[\begin{array}{ccc|c}
2 & 1 & -1 & 8 \\
0 & \frac{1}{2} & \frac{1}{2} & 1 \\
-2 & 1 & 2 & -3
\end{array}\right]
$$

**Step 2**：$R_3 \leftarrow R_3 + R_1$

$$
\left[\begin{array}{ccc|c}
2 & 1 & -1 & 8 \\
0 & \frac{1}{2} & \frac{1}{2} & 1 \\
0 & 2 & 1 & 5
\end{array}\right]
$$

**Step 3**：$R_3 \leftarrow R_3 - 4R_2$

$$
\left[\begin{array}{ccc|c}
2 & 1 & -1 & 8 \\
0 & \frac{1}{2} & \frac{1}{2} & 1 \\
0 & 0 & -1 & 1
\end{array}\right]
$$

</div>

**回代**：$z = -1$，$y = 3$，$x = 2$。

---

## 四、行列式

### 计算

对 $2 \times 2$ 矩阵：

$$
\det\begin{bmatrix} a & b \\ c & d \end{bmatrix} = ad - bc
$$

对 $n \times n$ 矩阵，可按任意一行（或一列）**Laplace 展开**：

$$
\det(A) = \sum_{j=1}^{n} (-1)^{i+j} a_{ij} \det(M_{ij})
$$

其中 $M_{ij}$ 是划去第 $i$ 行第 $j$ 列的**余子式**。

### 重要性质

- $\det(AB) = \det(A) \cdot \det(B)$
- $\det(A^T) = \det(A)$
- $\det(A^{-1}) = \frac{1}{\det(A)}$
- 一行（列）全为 0 → 行列式为 0
- 两行（列）成比例 → 行列式为 0
- 行交换一次 → 行列式变号

---

## 五、秩

矩阵的**秩** $\operatorname{rank}(A)$ 是其线性无关行（或列）的最大数量。

**计算方法**：化为行最简形（RREF），非零行数即为秩。

**秩定理**：$\operatorname{rank}(A) = \operatorname{rank}(A^T)$

**秩-零化度定理**（对 $m \times n$ 矩阵）：

$$
\operatorname{rank}(A) + \dim\ker(A) = n
$$

---

## 六、向量空间

### 核与像

- **零空间（核）**：$\ker(A) = \{\mathbf{x} \mid A\mathbf{x} = \mathbf{0}\}$
- **列空间（像）**：$\operatorname{Im}(A) = \{A\mathbf{x} \mid \mathbf{x} \in \mathbb{R}^n\}$

### 四个基本子空间

| 子空间 | 符号 | 所在空间 | 维数 |
|--------|------|----------|------|
| 列空间 | $\operatorname{Col}(A)$ | $\mathbb{R}^m$ | $r$ |
| 行空间 | $\operatorname{Row}(A)$ | $\mathbb{R}^n$ | $r$ |
| 零空间 | $\operatorname{Nul}(A)$ | $\mathbb{R}^n$ | $n - r$ |
| 左零空间 | $\operatorname{Nul}(A^T)$ | $\mathbb{R}^m$ | $m - r$ |

其中 $r = \operatorname{rank}(A)$。

---

## 七、特征值与特征向量

若 $A\mathbf{v} = \lambda \mathbf{v}$（$\mathbf{v} \neq \mathbf{0}$），则：

- $\lambda$ 称为 **特征值**
- $\mathbf{v}$ 称为 **特征向量**

### 求解

$$
\det(A - \lambda I) = 0
$$

这个关于 $\lambda$ 的多项式称为**特征多项式**。

**示例**：求 $A = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix}$ 的特征值。

$$
\det(A - \lambda I) = \begin{vmatrix} 2-\lambda & 1 \\ 1 & 2-\lambda \end{vmatrix} = (2-\lambda)^2 - 1 = \lambda^2 - 4\lambda + 3 = 0
$$

解得 $\lambda_1 = 3$，$\lambda_2 = 1$。

对应特征向量：

- $\lambda_1 = 3$：解 $(A - 3I)\mathbf{v} = 0$，得 $\mathbf{v}_1 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$
- $\lambda_2 = 1$：解 $(A - I)\mathbf{v} = 0$，得 $\mathbf{v}_2 = \begin{bmatrix} 1 \\ -1 \end{bmatrix}$

### 重要性质

- $\operatorname{tr}(A) = \sum \lambda_i$（迹等于所有特征值之和）
- $\det(A) = \prod \lambda_i$（行列式等于所有特征值之积）
- 实对称矩阵的特征值全为实数
- 属于不同特征值的特征向量线性无关

---

## 八、矩阵对角化

若 $A$ 有 $n$ 个线性无关的特征向量，则 $A$ 可对角化：

$$
A = PDP^{-1}
$$

其中 $D = \operatorname{diag}(\lambda_1, \ldots, \lambda_n)$，$P$ 的列是对应的特征向量。

**对角化的好处**：

$$
A^k = PD^kP^{-1} = P \begin{bmatrix} \lambda_1^k & & \\ & \ddots & \\ & & \lambda_n^k \end{bmatrix} P^{-1}
$$

这大大简化了矩阵幂的计算——例如解线性差分方程、Markov 链等。

---

## 九、C++ 实现：高斯消元

```cpp
#include <bits/stdc++.h>
using namespace std;

const double EPS = 1e-9;

// 高斯消元，返回解向量
// a 是 n×(n+1) 增广矩阵
vector<double> gauss(vector<vector<double>> a) {
    int n = a.size();
    for (int col = 0, row = 0; col < n; col++) {
        // 选主元（列最大值）
        int pivot = row;
        for (int i = row + 1; i < n; i++)
            if (fabs(a[i][col]) > fabs(a[pivot][col]))
                pivot = i;

        if (fabs(a[pivot][col]) < EPS) continue; // 奇异

        swap(a[row], a[pivot]);

        // 消去下方各行
        for (int i = row + 1; i < n; i++) {
            double factor = a[i][col] / a[row][col];
            for (int j = col; j <= n; j++)
                a[i][j] -= factor * a[row][j];
        }
        row++;
    }

    // 回代
    vector<double> x(n, 0);
    for (int i = n - 1; i >= 0; i--) {
        double sum = a[i][n];
        for (int j = i + 1; j < n; j++)
            sum -= a[i][j] * x[j];
        x[i] = sum / a[i][i];
    }
    return x;
}
```

> 竞赛中常用 [高斯-约旦消元](https://oi-wiki.org/math/gauss/) 一步到位求行最简形，避免回代。

---

## 总结

| 概念 | 本质 |
|------|------|
| 矩阵 | 线性变换的坐标表示 |
| 行列式 | 变换对体积的缩放因子 |
| 秩 | 变换后空间的维数 |
| 核 | 被映射为零的向量集合 |
| 特征值/向量 | 变换中方向不变的向量及其缩放比 |
| 对角化 | 在最优基下化简矩阵 |

线性代数的美在于：**所有看似抽象的代数操作，都有直观的几何解释**。理解了这一点，矩阵就不再是一堆数字，而是一个有生命的变换。

---

## 参考

- Gilbert Strang, *Introduction to Linear Algebra*
- [MIT 18.06](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/) — 经典线性代数公开课
- [3Blue1Brown 线性代数的本质](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab) — 强烈推荐的几何直觉
