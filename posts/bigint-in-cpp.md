---
title: C++ 高精度算法详解与竞赛模板
date: 2026-06-02
tags: [教程, C++, 算法]
cover: /covers/bigint-in-cpp.svg
---

C++ 原生整数最大只能到 `unsigned long long`（约 1.8 × 10¹⁹），但竞赛中经常需要处理几百位甚至几千位的大数。本文将系统讲解高精度算法的实现与优化。

<!-- more -->

## 核心思路

高精度的本质是**用数组模拟竖式运算**。通常用 `string` 读入，`vector<int>` 存储，低位在前（下标 0 是个位）。

```cpp
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

// 字符串 → 高精度（低位在前）
vector<int> from_str(const string& s) {
    vector<int> a;
    for (int i = s.size() - 1; i >= 0; i--)
        a.push_back(s[i] - '0');
    return a;
}

// 高精度 → 字符串
string to_str(const vector<int>& a) {
    string s;
    for (int i = a.size() - 1; i >= 0; i--)
        s += char(a[i] + '0');
    return s;
}
```

> **为什么低位在前？** 因为进位/借位从左往右处理更自然，`push_back` 也比头部插入高效。

---

## 高精度加法

```cpp
vector<int> add(const vector<int>& a, const vector<int>& b) {
    vector<int> c;
    int carry = 0;
    for (int i = 0; i < max(a.size(), b.size()) || carry; i++) {
        if (i < a.size()) carry += a[i];
        if (i < b.size()) carry += b[i];
        c.push_back(carry % 10);
        carry /= 10;
    }
    return c;
}
```

循环条件 `|| carry` 是精髓——最后如果有进位，循环会多跑一轮把它加上。

---

## 高精度减法

要求 `a >= b`，否则需要加符号处理：

```cpp
// 返回 a - b（前提：a >= b）
vector<int> sub(const vector<int>& a, const vector<int>& b) {
    vector<int> c;
    int borrow = 0;
    for (int i = 0; i < a.size(); i++) {
        int t = a[i] - borrow;
        if (i < b.size()) t -= b[i];
        if (t < 0) c.push_back(t + 10), borrow = 1;
        else       c.push_back(t),      borrow = 0;
    }
    // 去掉前导零（但保留最后一位 0）
    while (c.size() > 1 && c.back() == 0) c.pop_back();
    return c;
}
```

---

## 高精度乘法

### 高精 × 低精

```cpp
vector<int> mul(const vector<int>& a, int b) {
    vector<int> c;
    int carry = 0;
    for (int i = 0; i < a.size() || carry; i++) {
        if (i < a.size()) carry += a[i] * b;
        c.push_back(carry % 10);
        carry /= 10;
    }
    while (c.size() > 1 && c.back() == 0) c.pop_back();
    return c;
}
```

### 高精 × 高精

```cpp
vector<int> mul(const vector<int>& a, const vector<int>& b) {
    vector<int> c(a.size() + b.size(), 0);
    for (int i = 0; i < a.size(); i++) {
        for (int j = 0; j < b.size(); j++) {
            c[i + j] += a[i] * b[j];
        }
    }
    // 统一处理进位
    int carry = 0;
    for (int i = 0; i < c.size(); i++) {
        carry += c[i];
        c[i] = carry % 10;
        carry /= 10;
    }
    while (c.size() > 1 && c.back() == 0) c.pop_back();
    return c;
}
```

> **技巧：** 先不管进位，把每一位的乘积累加到 `c[i + j]`，最后一趟统一进位。这是高精乘法最常见的写法。

| 方法 | 复杂度 | 适用场景 |
|------|:--:|------|
| 朴素乘法 | O(n·m) | n, m ≤ 10⁴ |
| 分治 / Karatsuba | O(n^{1.58}) | 理论优化 |
| FFT / NTT | O(n log n) | 超大数（10⁵ 级） |

竞赛中朴素乘法的 O(n²) 已经够应付 95% 的题目。

---

## 高精度除法

### 高精 ÷ 低精（带余数）

```cpp
// 返回 {商, 余数}
pair<vector<int>, int> div(const vector<int>& a, int b) {
    vector<int> c;
    int r = 0;
    for (int i = a.size() - 1; i >= 0; i--) {
        r = r * 10 + a[i];
        c.push_back(r / b);
        r %= b;
    }
    reverse(c.begin(), c.end());
    while (c.size() > 1 && c.back() == 0) c.pop_back();
    return {c, r};
}
```

注意除法是唯一**从高位往低位**遍历的运算，和竖式除法的方向一致。

### 高精 ÷ 高精

```cpp
// 比较 a >= b（从高位比）
bool ge(const vector<int>& a, const vector<int>& b) {
    if (a.size() != b.size()) return a.size() > b.size();
    for (int i = a.size() - 1; i >= 0; i--)
        if (a[i] != b[i]) return a[i] > b[i];
    return true;  // 相等
}

// 高精 ÷ 高精，返回 {商, 余数}
pair<vector<int>, vector<int>> div(const vector<int>& a,
                                    const vector<int>& b) {
    vector<int> q, r;
    for (int i = a.size() - 1; i >= 0; i--) {
        r.insert(r.begin(), a[i]);  // 从高位拉下一位
        while (r.size() > 1 && r.back() == 0) r.pop_back();
        int digit = 0;
        while (ge(r, b)) {
            r = sub(r, b);  // 减法模拟试商
            digit++;
        }
        q.push_back(digit);
    }
    reverse(q.begin(), q.end());
    while (q.size() > 1 && q.back() == 0) q.pop_back();
    return {q, r};
}
```

> **竞赛技巧：** 如果题目只需要高精 ÷ 低精，直接用低精版本。高精 ÷ 高精 很少出现——如果需要，换 Python 是更明智的选择。

---

## 比大小 & 符号处理

```cpp
bool lt(const vector<int>& a, const vector<int>& b) {
    if (a.size() != b.size()) return a.size() < b.size();
    for (int i = a.size() - 1; i >= 0; i--)
        if (a[i] != b[i]) return a[i] < b[i];
    return false;  // 相等
}

// 带符号的高精度结构
struct BigInt {
    vector<int> digits;
    bool negative = false;

    BigInt(string s) {
        if (s[0] == '-') negative = true, s = s.substr(1);
        digits = from_str(s);
    }

    string to_string() const {
        return (negative ? "-" : "") + ::to_str(digits);
    }
};
```

---

## 竞赛高频应用

### 1. 阶乘

求 `n!`（n 可达几百甚至上千）：

```cpp
vector<int> fact = from_str("1");
for (int i = 2; i <= n; i++)
    fact = mul(fact, i);
cout << to_str(fact) << '\n';
```

### 2. 斐波那契

第 1000 项就有 209 位，必须高精度：

```cpp
vector<int> a = from_str("1");  // F(1)
vector<int> b = from_str("1");  // F(2)
for (int i = 3; i <= n; i++) {
    vector<int> c = add(a, b);
    a = b, b = c;
}
cout << to_str(b) << '\n';
```

### 3. 快速幂 + 高精

计算 a^b，结果可能极大：

```cpp
// 快速幂（乘低精的高精版本）
vector<int> qpow(int a, int b) {
    vector<int> res = from_str("1");
    vector<int> base = from_str(to_string(a));
    while (b) {
        if (b & 1) res = mul(res, base);
        base = mul(base, base);
        b >>= 1;
    }
    return res;
}
```

---

## 优化技巧 ⚡

### 1. 压位

用 `int` 存 0-9 太浪费了，每个元素存 4 位（万进制）或 8 位（亿进制）可以大幅提速：

```cpp
const int BASE = 10000;  // 万进制

// 字符串 → 压位高精度
vector<int> from_str_packed(const string& s) {
    vector<int> a;
    for (int i = s.size() - 1; i >= 0; i -= 4) {
        int num = 0;
        for (int j = max(0, i - 3); j <= i; j++)
            num = num * 10 + (s[j] - '0');
        a.push_back(num);
    }
    return a;
}

// 加法（BASE=10000 版）
vector<int> add_packed(const vector<int>& a, const vector<int>& b) {
    vector<int> c;
    int carry = 0;
    for (int i = 0; i < max(a.size(), b.size()) || carry; i++) {
        if (i < a.size()) carry += a[i];
        if (i < b.size()) carry += b[i];
        c.push_back(carry % BASE);
        carry /= BASE;
    }
    return c;
}
```

| 进制 | 速度提升 | 备注 |
|------|:--:|------|
| 十进制（BASE=10） | 1× | 入门写法 |
| 万进制（BASE=10000） | ~4× | 输出时注意补零 |
| 亿进制（BASE=100000000） | ~8× | 乘法小心溢出 int |

### 2. 避免 operator

每次运算都创建新 `vector` 开销很大。如果不需要保留原值：

```cpp
// 原地加法，修改 a
void add_assign(vector<int>& a, const vector<int>& b) {
    int carry = 0;
    for (int i = 0; i < max(a.size(), b.size()) || carry; i++) {
        if (i == a.size()) a.push_back(0);
        int t = a[i] + carry;
        if (i < b.size()) t += b[i];
        a[i] = t % 10;
        carry = t / 10;
    }
}
```

### 3. 善用 Python

```python
# Python 原生支持大整数
a = int("1" + "0" * 100)   # 10¹⁰⁰
b = 2 ** 1000               # 2¹⁰⁰⁰
print(a + b)
```

> 如果比赛允许用 Python（如蓝桥杯、天梯赛），高精度题直接切 Py 是最优解。学 C++ 的高精度更多是为了**没有 Python 的纯 C++ 赛制**（如 NOI/ICPC 部分赛站）。

---

## 竞赛防坑指南 ⚠️

### 1. 前导零

```cpp
// 每个运算函数末尾都要加这行
while (c.size() > 1 && c.back() == 0) c.pop_back();
```

漏掉的话 `00000` 会作为结果输出，直接 WA。

### 2. 999... + 1 的场景

加法的 `|| carry` 必须写——否则 999 + 1 的结果是 `000` 而不是 `1000`。

### 3. 乘低精的溢出

```cpp
// ❌ 危险：a[i] * b 可能溢出 int
int carry = 0;
carry += a[i] * b;  // a[i]≤9, b≤10⁹ → 可能爆 int！

// ✅ 安全
long long carry = 0;
```

### 4. 除法方向

除法必须**从高位到低位**，加减乘是**从低位到高位**。写反了会很隐蔽地出错。

### 5. 边界判断

```cpp
// 减法的前置条件：a >= b
if (lt(a, b)) {
    // 处理符号：c = -(b - a)
    vector<int> c = sub(b, a);
    // 标记负号...
}
```

---

## 完整竞赛模板

以下是一个整合了加减乘除（除低精度）的模板，直接带入竞赛：

```cpp
struct BigInt {
    vector<int> a;
    BigInt(string s = "0") {
        for (int i = s.size() - 1; i >= 0; i--)
            a.push_back(s[i] - '0');
    }
    string str() const {
        string s;
        for (int i = a.size() - 1; i >= 0; i--)
            s += char(a[i] + '0');
        return s;
    }

    BigInt operator+(const BigInt& b) const {
        BigInt c; c.a.clear();
        int t = 0;
        for (int i = 0; i < max(a.size(), b.a.size()) || t; i++) {
            if (i < a.size()) t += a[i];
            if (i < b.a.size()) t += b.a[i];
            c.a.push_back(t % 10), t /= 10;
        }
        return c;
    }

    BigInt operator-(const BigInt& b) const {
        BigInt c; c.a.clear();
        int t = 0;
        for (int i = 0; i < a.size(); i++) {
            t = a[i] - t;
            if (i < b.a.size()) t -= b.a[i];
            c.a.push_back((t + 10) % 10);
            t = (t < 0);
        }
        while (c.a.size() > 1 && c.a.back() == 0) c.a.pop_back();
        return c;
    }

    BigInt operator*(int b) const {
        BigInt c; c.a.clear();
        long long t = 0;
        for (int i = 0; i < a.size() || t; i++) {
            if (i < a.size()) t += 1LL * a[i] * b;
            c.a.push_back(t % 10), t /= 10;
        }
        while (c.a.size() > 1 && c.a.back() == 0) c.a.pop_back();
        return c;
    }

    BigInt operator*(const BigInt& b) const {
        BigInt c; c.a.assign(a.size() + b.a.size(), 0);
        for (int i = 0; i < a.size(); i++)
            for (int j = 0; j < b.a.size(); j++)
                c.a[i + j] += a[i] * b.a[j];
        int t = 0;
        for (int i = 0; i < c.a.size(); i++) {
            t += c.a[i];
            c.a[i] = t % 10, t /= 10;
        }
        while (c.a.size() > 1 && c.a.back() == 0) c.a.pop_back();
        return c;
    }

    pair<BigInt, int> div(int b) const {
        BigInt q; q.a.clear();
        int r = 0;
        for (int i = a.size() - 1; i >= 0; i--) {
            r = r * 10 + a[i];
            q.a.push_back(r / b), r %= b;
        }
        reverse(q.a.begin(), q.a.end());
        while (q.a.size() > 1 && q.a.back() == 0) q.a.pop_back();
        return {q, r};
    }
};
```

---

> 高精度是 C++ 竞赛选手的基本功。入门时手写一遍加深理解，之后要么背板、要么切 Py。记住——**能跑就行，别纠结常数优化**，压位 + 高精 ÷ 低精 已经能过 99% 的题目 📐
