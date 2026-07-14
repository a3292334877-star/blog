---
title: C++ 中哈希 Map 的应用与竞赛技巧
date: 2026-06-02
tags: [教程, C++, 算法]
cover: /covers/hashmap-in-cpp.svg
---

哈希表是竞赛中最常用的数据结构之一。本文梳理 C++ 中 `unordered_map` / `map` 的用法、原理和竞赛实战技巧。

<!-- more -->

## 基础知识

C++ STL 提供两种关联容器：

| 容器 | 底层 | 操作复杂度 | 有序性 |
|------|------|:--:|:--:|
| `std::map` | 红黑树 | O(log n) | 按键升序 |
| `std::unordered_map` | 哈希表 | O(1) 平均 | 无序 |

```cpp
#include <unordered_map>
#include <map>
using namespace std;

unordered_map<string, int> umap;  // 哈希表
map<string, int> tmap;            // 平衡树
```

## 常用操作速查

```cpp
unordered_map<string, int> mp;

// 插入
mp["apple"] = 5;
mp.insert({"banana", 3});
mp.emplace("cherry", 8);    // 原地构造，效率最高

// 查找
if (mp.count("apple")) { }           // 判断 key 是否存在
if (mp.find("apple") != mp.end()) {} // 同上，并返回迭代器
auto it = mp.find("apple");
cout << it->second;                  // 通过迭代器访问

// 遍历
for (auto& [k, v] : mp) {
    cout << k << " -> " << v << '\n';
}

// 删除
mp.erase("apple");
mp.erase(it);
```

### count vs find

```cpp
// ❌ 不推荐 —— 两次查找
if (mp.count(key)) {
    int val = mp[key];  // 又查找一次
}

// ✅ 推荐 —— 只查一次
auto it = mp.find(key);
if (it != mp.end()) {
    int val = it->second;
}
```

## 竞赛高频应用场景

### 1. 频率统计

最常见用法，统计数组中每个值出现的次数：

```cpp
// LeetCode 1: Two Sum
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;  // 值 -> 下标
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}
```

### 2. 去重与计数

```cpp
// 统计字符串中每个字符的出现次数
string s = "abracadabra";
unordered_map<char, int> freq;
for (char c : s) freq[c]++;

// 找出现次数最多的字符
auto max_it = max_element(freq.begin(), freq.end(),
    [](auto& a, auto& b) { return a.second < b.second; });
cout << max_it->first << ": " << max_it->second << '\n';
```

### 3. 前缀和 + 哈希

极高频竞赛套路，把 O(n²) 优化到 O(n)：

```cpp
// 和为 k 的子数组个数
int subarraySum(vector<int>& nums, int k) {
    unordered_map<int, int> pre{ {0, 1} };
    int sum = 0, ans = 0;
    for (int x : nums) {
        sum += x;
        // 如果 sum - k 出现过，说明中间那段和为 k
        ans += pre[sum - k];
        pre[sum]++;
    }
    return ans;
}
```

### 4. 字符映射 / 同构问题

```cpp
// 判断两个字符串是否同构
bool isIsomorphic(string s, string t) {
    unordered_map<char, char> s2t, t2s;
    for (int i = 0; i < s.size(); i++) {
        if (s2t.count(s[i]) && s2t[s[i]] != t[i]) return false;
        if (t2s.count(t[i]) && t2s[t[i]] != s[i]) return false;
        s2t[s[i]] = t[i];
        t2s[t[i]] = s[i];
    }
    return true;
}
```

### 5. 记忆化搜索

```cpp
unordered_map<int, long long> memo;

long long fib(int n) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];
    return memo[n] = fib(n - 1) + fib(n - 2);
}
```

### 6. 多值映射（分组）

```cpp
// 按字母异位词分组
vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> groups;
    for (string& s : strs) {
        string key = s;
        sort(key.begin(), key.end());  // 排序后作为 key
        groups[key].push_back(s);
    }
    vector<vector<string>> ans;
    for (auto& [k, v] : groups) ans.push_back(v);
    return ans;
}
```

## 自定义哈希函数

竞赛中有时要以自定义结构体作为 key：

```cpp
struct Point {
    int x, y;
    bool operator==(const Point& o) const {
        return x == o.x && y == o.y;
    }
};

// 自定义哈希
struct PointHash {
    size_t operator()(const Point& p) const {
        // 用位运算合并两个哈希值（经典写法）
        return hash<int>()(p.x) ^ (hash<int>()(p.y) << 1);
    }
};

unordered_map<Point, int, PointHash> grid;
grid[{2, 3}] = 10;
```

C++20 可以用更简洁的方式：

```cpp
// C++20 直接用 lambda 做 hash
auto hash = [](const Point& p) {
    return hash<int>()(p.x) ^ (hash<int>()(p.y) << 1);
};
```

## 竞赛防坑指南 ⚠️

### 1. 用 map 还是 unordered_map？

```cpp
// 键少、顺序不重要 → unordered_map（O(1)）
unordered_map<int, int> umap;

// 需要有序遍历 → map（O(log n)）
map<int, int> tmap;

// 值域小且紧凑 → 直接用数组，O(1) 且常数极小
int cnt[100010] = {0};  // 比 map 快 10 倍+
```

**经验法则：** 能开数组解决就不用地 map/map；需要字符串 key 用 unordered_map；需要按序遍历用 map。

### 2. unordered_map 可能被卡

CCF/NOI 等比赛中有人会故意构造数据把 `unordered_map` 卡成 O(n)，爆炸退化成链表：

```cpp
// 防卡方案：自定义哈希
struct custom_hash {
    static uint64_t splitmix64(uint64_t x) {
        x += 0x9e3779b97f4a7c15;
        x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
        x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
        return x ^ (x >> 31);
    }
    size_t operator()(uint64_t x) const {
        return splitmix64(x + 0x9e3779b97f4a7c15);
    }
};
unordered_map<int, int, custom_hash> safe_map;
```

或者直接用 `gp_hash_table`（pb_ds），但 STL 的自定义哈希通常够用。

### 3. 遍历时修改

```cpp
// ❌ 错误 —— 遍历中删除，迭代器失效
for (auto it = mp.begin(); it != mp.end(); ++it) {
    if (it->second == 0) mp.erase(it);  // it 失效！
}

// ✅ 正确写法
for (auto it = mp.begin(); it != mp.end(); ) {
    if (it->second == 0)
        it = mp.erase(it);  // erase 返回下一个有效迭代器
    else
        ++it;
}
```

### 4. [] 操作符的副作用

```cpp
unordered_map<int, int> mp;
cout << mp[42];  // 输出 0 —— 但 mp 里已经多了个 {42, 0}！
cout << mp.size(); // 输出 1

// 如果只读不写，用 find 或 at()
// mp.at(42) 在 key 不存在时会抛异常
```

## 实战例题

### 经典：最长无重复子串

```cpp
int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> pos;  // 字符最近出现的位置
    int ans = 0, left = 0;
    for (int i = 0; i < s.size(); i++) {
        if (pos.count(s[i])) {
            left = max(left, pos[s[i]] + 1);  // 跳过重复
        }
        ans = max(ans, i - left + 1);
        pos[s[i]] = i;
    }
    return ans;
}
```

### 竞赛经典：pair 计数的技巧

```cpp
// 统计满足 a[i] + a[j] = a[k] + a[l] (i<j<k<l) 的对数
// 用 unordered_map 把 O(n⁴) 压到 O(n²)
unordered_map<int, int> sum;
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        sum[a[i] + a[j]]++;  // 统计所有可能的和

long long ans = 0;
for (auto& [k, v] : sum)
    ans += 1LL * v * (v - 1) / 2;  // 组合数
```

## 性能对比

实测 10⁶ 次操作（插入 + 查找）：

| 容器 | 耗时 | 内存 |
|------|------|------|
| 普通数组 | ~5ms | 按值域 |
| `unordered_map` | ~80ms | 较高 |
| `map` | ~200ms | 较低 |
| `gp_hash_table` (pb_ds) | ~40ms | 较高 |

> 结论：小值域 → 数组，大值域/字符串 → unordered_map + 自定义 hash，需要有序 → map

---

> 哈希表是算法竞赛的「瑞士军刀」—— 前缀和 + 哈希 能解决一大类子数组问题，计数统计更是无处不在。掌握好它，银牌保底 🥈
