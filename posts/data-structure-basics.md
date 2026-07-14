---
title: 数据结构基础：从数组到并查集
date: 2026-06-02
tags: [教程, C++, 数据结构]
cover: /covers/data-structure-basics.svg
---

数据结构是程序的骨架。选对数据结构，问题就解决了八成。本文串讲 C++ 竞赛中最核心的基础数据结构及其应用场景。

<!-- more -->

## 数据结构选型指南

```
需要 O(1) 随机访问  →  数组/vector
需要先进先出       →  queue
需要先进后出       →  stack
需要两端出入       →  deque
需要最大/最小值    →  priority_queue
需要有序 + 遍历   →  set/map
需要快速查+改     →  unordered_set/map
需要合并集合      →  并查集
```

---

## 数组：一切的起点

```cpp
// 静态数组 —— 速度最快，适合固定大小
int a[100010];

// 动态数组 —— 竞赛首选，可变长
vector<int> v;

// 二维
vector<vector<int>> grid(n, vector<int>(m, 0));
```

### vector 常用操作

```cpp
v.push_back(x);      // 尾部插入
v.pop_back();        // 尾部删除
v.insert(v.begin()+i, x);  // 指定位置插入（O(n)，少用）
v.erase(v.begin()+i);      // 指定位置删除（O(n)，少用）

sort(v.begin(), v.end());              // 升序
sort(v.begin(), v.end(), greater());   // 降序
reverse(v.begin(), v.end());           // 反转
v.erase(unique(v.begin(), v.end()), v.end()); // 去重

// 二分查找（需先排序）
auto it = lower_bound(v.begin(), v.end(), x);  // 第一个 >= x
auto it = upper_bound(v.begin(), v.end(), x);  // 第一个 > x
int cnt = upper_bound(...) - lower_bound(...); // 等于 x 的个数
```

### 数组 vs vector

| | 静态数组 | vector |
|------|:--:|:--:|
| 速度 | ⭐⭐⭐ | ⭐⭐ |
| 长度可变 | ❌ | ✅ |
| 边界检查 | ❌（越界不报） | 可开 `_GLIBCXX_DEBUG` |
| 传参 | 退化指针 | 引用传值均可 |

```cpp
// ✅ 推荐：vector 作为默认选择
// 只有极端卡常时才用静态数组
```

---

## 栈与队列

### stack —— 后进先出

```cpp
#include <stack>
stack<int> stk;
stk.push(1);
stk.push(2);
cout << stk.top();  // 2
stk.pop();          // 弹出 2
cout << stk.size(); // 1
```

**典型应用：**

```cpp
// 括号匹配
bool isValid(string s) {
    stack<char> stk;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{')
            stk.push(c);
        else {
            if (stk.empty()) return false;
            char top = stk.top(); stk.pop();
            if ((c == ')' && top != '(') ||
                (c == ']' && top != '[') ||
                (c == '}' && top != '{')) return false;
        }
    }
    return stk.empty();
}
```

```cpp
// 单调栈 —— 找下一个更大元素
vector<int> nextGreater(vector<int>& nums) {
    int n = nums.size();
    vector<int> ans(n, -1);
    stack<int> stk;  // 存下标，栈内值单调递减
    for (int i = 0; i < n; i++) {
        while (!stk.empty() && nums[stk.top()] < nums[i]) {
            ans[stk.top()] = nums[i];
            stk.pop();
        }
        stk.push(i);
    }
    return ans;
}
```

### queue —— 先进先出

```cpp
#include <queue>
queue<int> q;
q.push(1);
q.push(2);
cout << q.front();  // 1
cout << q.back();   // 2
q.pop();            // 弹出 1
```

**典型应用：BFS（广度优先搜索）**

```cpp
// 迷宫最短路
int bfs(vector<vector<int>>& grid, int sx, int sy) {
    int n = grid.size(), m = grid[0].size();
    int dx[] = {0, 0, 1, -1};
    int dy[] = {1, -1, 0, 0};
    vector<vector<int>> dist(n, vector<int>(m, -1));

    queue<pair<int, int>> q;
    q.push({sx, sy});
    dist[sx][sy] = 0;

    while (!q.empty()) {
        auto [x, y] = q.front(); q.pop();
        if (grid[x][y] == 目标) return dist[x][y];
        for (int k = 0; k < 4; k++) {
            int nx = x + dx[k], ny = y + dy[k];
            if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;
            if (dist[nx][ny] == -1 && grid[nx][ny] != 障碍) {
                dist[nx][ny] = dist[x][y] + 1;
                q.push({nx, ny});
            }
        }
    }
    return -1;
}
```

### deque —— 双端队列

```cpp
#include <deque>
deque<int> dq;
dq.push_front(1);  // 头部插入
dq.push_back(2);   // 尾部插入
dq.pop_front();    // 头部删除
dq.pop_back();     // 尾部删除
```

**典型应用：单调队列（滑动窗口最大值）**

```cpp
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;  // 存下标，队首是当前窗口最大值
    vector<int> ans;
    for (int i = 0; i < nums.size(); i++) {
        // 移除过期元素
        while (!dq.empty() && dq.front() <= i - k) dq.pop_front();
        // 维护递减性
        while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
        dq.push_back(i);
        // 窗口成型后记录答案
        if (i >= k - 1) ans.push_back(nums[dq.front()]);
    }
    return ans;
}
```

---

## 堆（优先队列）

```cpp
#include <queue>

// 默认大顶堆
priority_queue<int> pq;
pq.push(3); pq.push(1); pq.push(5);
cout << pq.top();  // 5（最大值）

// 小顶堆（三种写法）
priority_queue<int, vector<int>, greater<int>> min_pq;
// 或：所有数取负插入大顶堆，取出时取负
```

**典型应用：Top K**

```cpp
// 第 K 大的数 —— 用小顶堆，堆顶就是第 K 大
int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> pq;
    for (int x : nums) {
        pq.push(x);
        if (pq.size() > k) pq.pop();  // 只保留最大的 K 个
    }
    return pq.top();  // K 个里最小的 = 第 K 大
}
```

**典型应用：Dijkstra 最短路**

```cpp
// priority_queue 优化 Dijkstra
vector<int> dijkstra(vector<vector<pair<int, int>>>& g, int s) {
    int n = g.size();
    vector<int> dist(n, INT_MAX);
    // {距离, 节点}，小顶堆
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;
    pq.push({0, s});
    dist[s] = 0;

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;  // 过时记录
        for (auto [v, w] : g[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}
```

---

## set / map：有序容器

### set —— 不重复的有序集合

```cpp
#include <set>
set<int> s;
s.insert(3);
s.insert(1);
s.insert(3);  // 重复元素不会插入
// s = {1, 3}

s.erase(1);          // 删除
if (s.count(3)) {}   // 判断存在
if (s.find(3) != s.end()) {}  // 同上

// 有序遍历
for (int x : s) cout << x << ' ';  // 1 3（升序）

// 二分查询
auto it = s.lower_bound(2);  // 第一个 >= 2 的元素 = 3
```

### multiset —— 可重复的平衡树

```cpp
#include <set>
multiset<int> ms;
ms.insert(1);
ms.insert(1);  // 可以重复
// ms = {1, 1}

ms.erase(1);          // 删除所有 1！
ms.erase(ms.find(1)); // 只删一个 1（传入迭代器）

// 统计出现次数
cout << ms.count(1);
```

### map —— 键值映射

```cpp
#include <map>
map<string, int> mp;
mp["apple"] = 5;
mp["banana"] = 3;

for (auto& [key, val] : mp) {
    cout << key << " -> " << val << '\n';
    // 按 key 字典序输出：apple -> 5, banana -> 3
}
```

### 选型速查

```
set vs unordered_set
  ├─ 需要有序遍历     → set（O(log n)）
  ├─ 只需要插入/查找  → unordered_set（O(1)）
  └─ 值域小且紧凑     → 布尔数组（O(1)，常数极小）

map vs unordered_map
  ├─ 需要按键排序     → map
  ├─ 只需要映射关系   → unordered_map
  └─ key 是连续整数   → vector/数组
```

---

## 链表

C++ 竞赛中几乎**不用手写链表**，STL 栈/队列已覆盖大部分场景。但有两类题目必须理解链表结构。

### list —— 双向链表

```cpp
#include <list>
list<int> l;
l.push_back(1);
l.push_front(0);
// 支持 O(1) 任意位置插入/删除（已知迭代器位置）
auto it = l.begin();
l.insert(it, -1);
l.erase(it);
```

### 手写链表（面试/模拟题）

```cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// 反转链表
ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *curr = head;
    while (curr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

// 快慢指针找中点
ListNode* middleNode(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}
```

---

## 并查集 (DSU)

并查集是竞赛中最优雅的数据结构之一，只有 5 行核心代码。

```cpp
struct DSU {
    vector<int> fa;
    DSU(int n) : fa(n) {
        for (int i = 0; i < n; i++) fa[i] = i;
    }

    int find(int x) {
        return fa[x] == x ? x : fa[x] = find(fa[x]);  // 路径压缩
    }

    void unite(int x, int y) {
        fa[find(x)] = find(y);
    }

    bool same(int x, int y) {
        return find(x) == find(y);
    }
};
```

### 完全体（按秩合并）

```cpp
struct DSU {
    vector<int> fa, sz;
    DSU(int n) : fa(n), sz(n, 1) {
        for (int i = 0; i < n; i++) fa[i] = i;
    }

    int find(int x) {
        return fa[x] == x ? x : fa[x] = find(fa[x]);
    }

    void unite(int x, int y) {
        x = find(x), y = find(y);
        if (x == y) return;
        if (sz[x] < sz[y]) swap(x, y);  // 小的合并到大的
        fa[y] = x;
        sz[x] += sz[y];
    }

    int size(int x) { return sz[find(x)]; }
};
```

**路径压缩 + 按秩合并后，操作均摊复杂度为 O(α(n))，其中 α 是反阿克曼函数，实际中 ≤ 4。**

### 典型应用

```cpp
// 1. 连通分量计数
DSU dsu(n);
for (auto& [u, v] : edges) dsu.unite(u, v);
int components = 0;
for (int i = 0; i < n; i++)
    if (dsu.find(i) == i) components++;

// 2. 冗余连接检测
for (auto& [u, v] : edges) {
    if (dsu.same(u, v)) return {u, v};  // 找到冗余边
    dsu.unite(u, v);
}

// 3. 朋友圈 / 亲戚问题 —— 并查集经典题
// 给定 m 对关系，判断任意两人是否在同一集合
```

### 带权并查集

```cpp
// 维护节点到父节点的距离（可用于判断奇偶性、食物链等）
struct DSU {
    vector<int> fa, d;  // d[x]：x 到 fa[x] 的权值
    DSU(int n) : fa(n), d(n, 0) {
        for (int i = 0; i < n; i++) fa[i] = i;
    }

    int find(int x) {
        if (fa[x] == x) return x;
        int root = find(fa[x]);
        d[x] += d[fa[x]];  // 路径压缩时累加权值
        return fa[x] = root;
    }

    void unite(int x, int y, int w) {
        int fx = find(x), fy = find(y);
        if (fx == fy) return;
        fa[fx] = fy;
        d[fx] = d[y] - d[x] + w;  // 合并后保持权值关系
    }
};
```

---

## 完整练习路径

| 阶段 | 题目 | 知识点 |
|------|------|------|
| 入门 | [LeetCode 20](https://leetcode.com/problems/valid-parentheses/) 有效括号 | stack |
| 入门 | [LeetCode 232](https://leetcode.com/problems/implement-queue-using-stacks/) 用栈实现队列 | stack/queue |
| 基础 | [LeetCode 239](https://leetcode.com/problems/sliding-window-maximum/) 滑动窗口最大值 | deque 单调队列 |
| 基础 | [LeetCode 215](https://leetcode.com/problems/kth-largest-element-in-an-array/) 第K大元素 | heap |
| 提高 | [LeetCode 739](https://leetcode.com/problems/daily-temperatures/) 每日温度 | stack 单调栈 |
| 提高 | [LeetCode 200](https://leetcode.com/problems/number-of-islands/) 岛屿数量 | BFS/DFS/DSU |
| 进阶 | [LeetCode 547](https://leetcode.com/problems/number-of-provinces/) 省份数量 | 并查集 |
| 进阶 | [POJ 1182](http://poj.org/problem?id=1182) 食物链 | 带权并查集 |

---

## 复杂度速查表

| 数据结构 | 插入 | 查找 | 删除 | 特点 |
|----------|:--:|:--:|:--:|------|
| `vector` (尾部) | O(1) | O(1) | O(1) | 随机访问 |
| `vector` (中间) | O(n) | O(1) | O(n) | — |
| `stack` | O(1) | — | O(1) | 只能操作栈顶 |
| `queue` | O(1) | — | O(1) | 只能操作两端 |
| `deque` | O(1) | O(1) | O(1) | 双端操作 |
| `priority_queue` | O(log n) | O(1) | O(log n) | 最值优先 |
| `set/map` | O(log n) | O(log n) | O(log n) | 有序 |
| `unordered_set/map` | O(1)* | O(1)* | O(1)* | 无序，可能被卡 |
| 并查集 | — | ≈O(1) | — | 动态连通性 |

> *平均复杂度，最坏 O(n)。

---

> 数据结构不是背出来的，是用出来的。每当你发现暴力超时，先问自己：我选对数据结构了吗？换一个结构，解法可能从 O(n²) 变成 O(n log n) 🧠
