---
title: Java 零基础入门教程：从 Hello World 到面向对象
date: 2026-06-06
tags: [教程, Java, 面向对象, 入门]
cover: https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800
---

# Java 零基础入门教程：从 Hello World 到面向对象 ☕

面向零基础读者，系统梳理 Java 核心语法、面向对象编程和常用类库。学完即可看懂大部分 Java 代码，为后续 Spring、Android 开发打下基础。

<!-- more -->

## 一、Java 简介与环境搭建

### Java 三大体系

| 平台 | 全称 | 用途 |
|------|------|------|
| Java SE | Standard Edition | 桌面应用、基础API（本文内容） |
| Java EE | Enterprise Edition | Web 应用、企业级开发（Spring 等） |
| Java ME | Micro Edition | 嵌入式、移动设备 |

### 第一个程序

```java
// HelloWorld.java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

编译与运行：

```bash
javac HelloWorld.java   # 编译 → 生成 HelloWorld.class 字节码
java HelloWorld          # JVM 执行字节码
```

> **关键概念：** Java 源文件 (.java) → 编译器 (javac) → 字节码 (.class) → JVM 解释执行。**一次编译，到处运行**（只要装了 JVM）。

### JDK vs JRE vs JVM

| 缩写 | 全称 | 作用 |
|------|------|------|
| JVM | Java Virtual Machine | 运行字节码的虚拟机 |
| JRE | Java Runtime Environment | JVM + 核心类库，只能运行不能编译 |
| JDK | Java Development Kit | JRE + 开发工具（javac, javadoc, jar 等） |

> **下载：** 搜索 "JDK 21 download" 或使用 OpenJDK。建议用 JDK 17 或 21（LTS 长期支持版本）。

---

## 二、基础语法

### 2.1 变量与数据类型

Java 是**强类型**语言，每个变量必须声明类型。

```java
// 8 种基本类型 (Primitive Types)
byte b = 127;           // 1字节，-128~127
short s = 32767;        // 2字节
int i = 2147483647;     // 4字节，最常用
long l = 9999999999L;   // 8字节，末尾加 L
float f = 3.14f;        // 4字节，末尾加 f
double d = 3.14159265;  // 8字节，默认浮点类型
char c = 'A';           // 2字节，Unicode
boolean flag = true;    // true 或 false

// 引用类型 (Reference Types)
String name = "Sakiko";
int[] arr = {1, 2, 3, 4, 5};
```

### 2.2 运算符

```java
// 算术运算符
int sum = 10 + 3;       // 13
int diff = 10 - 3;      // 7
int product = 10 * 3;   // 30
int quotient = 10 / 3;  // 3（整数除法截断）
int remainder = 10 % 3; // 1（取模）

// 比较运算符 → 返回 boolean
boolean eq = (5 == 5);   // true
boolean neq = (5 != 3);  // true
boolean gt = (10 > 5);   // true

// 逻辑运算符
boolean and = true && false;  // false（短路与）
boolean or = true || false;   // true（短路或）
boolean not = !true;          // false

// 自增/自减
int x = 5;
int a = x++;  // a=5, x=6（后置：先赋值再自增）
int b = ++x;  // b=7, x=7（前置：先自增再赋值）
```

### 2.3 类型转换

```java
// 自动转换（小 → 大，不会丢数据）
int i = 100;
long l = i;      // int → long，安全
double d = i;    // int → double，安全

// 强制转换（大 → 小，可能丢数据）
double pi = 3.14159;
int n = (int) pi;  // n = 3，小数部分被截断

// String ↔ 基本类型
int num = Integer.parseInt("123");     // String → int
String s = String.valueOf(456);        // int → String
String s2 = Integer.toString(789);     // int → String
```

---

## 三、控制流程

### 3.1 条件判断

```java
// if-else
int score = 85;
if (score >= 90) {
    System.out.println("优秀");
} else if (score >= 60) {
    System.out.println("及格");
} else {
    System.out.println("不及格");
}

// switch（JDK 14+ 支持箭头语法）
int day = 3;
String dayName = switch (day) {
    case 1 -> "星期一";
    case 2 -> "星期二";
    case 3 -> "星期三";
    default -> "其他";
};
System.out.println(dayName);  // 星期三
```

### 3.2 循环

```java
// for 循环
for (int i = 0; i < 5; i++) {
    System.out.println("第" + i + "次");
}

// 增强 for（foreach）—— 遍历数组和集合
int[] nums = {10, 20, 30, 40, 50};
for (int n : nums) {
    System.out.println(n);
}

// while 循环
int count = 0;
while (count < 3) {
    System.out.println("count = " + count);
    count++;
}

// do-while（至少执行一次）
int j = 0;
do {
    System.out.println(j);
    j++;
} while (j < 3);
```

---

## 四、数组

```java
// 声明 + 初始化
int[] arr1 = new int[5];           // 默认值全 0
int[] arr2 = {1, 2, 3, 4, 5};     // 直接赋值
int[] arr3 = new int[]{1, 2, 3};   // 另一种写法

// 二维数组
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
System.out.println(matrix[1][2]);  // 6（第2行第3列）

// 数组工具类
import java.util.Arrays;

int[] a = {3, 1, 4, 1, 5, 9};
Arrays.sort(a);                      // 原地排序
System.out.println(Arrays.toString(a)); // [1, 1, 3, 4, 5, 9]

int idx = Arrays.binarySearch(a, 4); // 二分查找（需先排序）
System.out.println(idx);             // 3

int[] copy = Arrays.copyOf(a, 3);    // 截取前 3 个元素 → [1, 1, 3]
```

---

## 五、面向对象编程（核心）

### 5.1 类与对象

```java
// 定义一个类
public class Student {
    // 成员变量（属性）
    private String name;
    private int age;
    private double score;

    // 构造方法（创建对象时调用）
    public Student(String name, int age, double score) {
        this.name = name;
        this.age = age;
        this.score = score;
    }

    // 无参构造（重载）
    public Student() {
        this("未知", 0, 0.0);  // 调用另一个构造器
    }

    // getter / setter（封装）
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getAge() { return age; }
    public void setAge(int age) {
        if (age >= 0 && age <= 150) {
            this.age = age;
        }
    }

    // 普通方法
    public void study() {
        System.out.println(name + " 正在学习...");
    }

    @Override
    public String toString() {
        return "Student{name='" + name + "', age=" + age + ", score=" + score + "}";
    }
}

// 使用
Student stu = new Student("小明", 20, 88.5);
stu.study();
System.out.println(stu);
```

### 5.2 四大特性

| 特性 | 含义 | Java 实现 |
|------|------|-----------|
| **封装** | 隐藏内部细节，只暴露接口 | `private` 字段 + getter/setter |
| **继承** | 子类复用父类的属性和方法 | `extends` 关键字，单继承 |
| **多态** | 同一方法不同对象表现不同行为 | 方法重写 + 父类引用指向子类对象 |
| **抽象** | 只定义行为，不关心实现 | `abstract` 类 / `interface` 接口 |

### 5.3 继承

```java
// 父类
public class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public void eat() {
        System.out.println(name + " 正在吃东西");
    }
}

// 子类
public class Cat extends Animal {
    private String breed;

    public Cat(String name, String breed) {
        super(name);    // 调用父类构造器（必须放第一行）
        this.breed = breed;
    }

    @Override  // 重写父类方法（注解，编译器帮你检查）
    public void eat() {
        System.out.println(name + "（一只" + breed + "）正在吃鱼 🐟");
    }

    // 子类独有方法
    public void meow() {
        System.out.println("喵喵喵~");
    }
}

// 使用
Animal a = new Cat("咪咪", "英短");  // 父类引用指向子类对象（多态！）
a.eat();   // 调用 Cat 的 eat（多态：运行时动态绑定）
// a.meow(); // ❌ 编译错误：Animal 类型看不到 Cat 特有方法
```

### 5.4 抽象类与接口

```java
// 抽象类：不能被实例化，可以有普通方法
abstract class Shape {
    protected String color;

    public Shape(String color) {
        this.color = color;
    }

    // 抽象方法：子类必须实现
    abstract double area();

    // 普通方法：子类可直接用
    public void show() {
        System.out.println("这是一个" + color + "的图形");
    }
}

// 接口：纯抽象（JDK 8+ 可有 default 方法）
interface Drawable {
    void draw();  // 默认 public abstract

    // JDK 8+ 的默认方法
    default void info() {
        System.out.println("可绘制的对象");
    }
}

// 一个类可以实现多个接口
class Circle extends Shape implements Drawable {
    private double radius;

    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }

    @Override
    double area() {
        return Math.PI * radius * radius;
    }

    @Override
    public void draw() {
        System.out.println("画一个" + color + "的圆，半径=" + radius);
    }
}
```

> **抽象类 vs 接口：** 抽象类是 "is-a" 关系（`Circle is a Shape`），接口是 "can-do" 能力（`Circle can be drawn`）。单继承、多实现。

---

## 六、常用类库

### 6.1 String

```java
String s1 = "Hello";
String s2 = "World";

// 常用操作
int len = s1.length();                    // 5
char ch = s1.charAt(0);                   // 'H'
String sub = s1.substring(1, 4);          // "ell"（[1, 4) 左闭右开）
String upper = s1.toUpperCase();          // "HELLO"
String lower = s1.toLowerCase();          // "hello"
boolean starts = s1.startsWith("He");     // true
boolean contains = s1.contains("ll");     // true
int idx = s1.indexOf("l");               // 2（首次出现位置）
String replaced = s1.replace("l", "L");  // "HeLLo"
String[] parts = "a,b,c".split(",");     // ["a", "b", "c"]
String trimmed = "  hi  ".trim();        // "hi"（去首尾空格）

// 拼接
String result = s1 + " " + s2;            // "Hello World"
String joined = String.join(", ", "A", "B", "C");  // "A, B, C"

// 比较（❗必须用 equals，不能用 ==）
String a = new String("abc");
String b = new String("abc");
System.out.println(a == b);       // false（比较引用地址）
System.out.println(a.equals(b));  // true（比较内容）

// StringBuilder：频繁拼接用这个（性能好）
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(" ");
sb.append("World");
String result2 = sb.toString();  // "Hello World"
```

### 6.2 ArrayList（动态数组）

```java
import java.util.ArrayList;
import java.util.List;

List<String> list = new ArrayList<>();

// 增
list.add("张三");
list.add("李四");
list.add(1, "王五");     // 在索引 1 处插入 → [张三, 王五, 李四]

// 删
list.remove("张三");     // 按对象删除
list.remove(0);          // 按索引删除

// 改
list.set(0, "赵六");     // 修改索引 0 的元素

// 查
String first = list.get(0);        // 按索引取
int size = list.size();            // 元素个数
boolean has = list.contains("李四"); // 是否包含
int idx = list.indexOf("李四");     // 查找索引，找不到返回 -1

// 遍历
for (String name : list) {
    System.out.println(name);
}
```

### 6.3 HashMap（键值对）

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> map = new HashMap<>();

// 增/改
map.put("apple", 10);
map.put("banana", 20);
map.put("orange", 15);

// 查
int val = map.get("apple");           // 10
int val2 = map.getOrDefault("grape", 0); // 0（不存在用默认值）
boolean hasKey = map.containsKey("banana"); // true

// 删
map.remove("orange");

// 遍历
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + " → " + entry.getValue());
}

// 只遍历 key 或 value
for (String key : map.keySet()) { /* ... */ }
for (int value : map.values()) { /* ... */ }
```

### 6.4 其他常用集合

```java
import java.util.*;

// HashSet：无重复元素的集合（基于 HashMap）
Set<String> set = new HashSet<>();
set.add("A");  set.add("B");  set.add("A");  // 重复的 "A" 不会加入
System.out.println(set.size());  // 2

// LinkedList：双向链表（适合频繁插入删除）
LinkedList<String> linked = new LinkedList<>();
linked.addFirst("头部");
linked.addLast("尾部");

// Stack：栈（LIFO），用 ArrayDeque 替代
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);  stack.push(2);  stack.push(3);
System.out.println(stack.pop());  // 3

// Queue：队列（FIFO）
Queue<String> queue = new LinkedList<>();
queue.offer("A");  queue.offer("B");  queue.offer("C");
System.out.println(queue.poll());  // "A"

// PriorityQueue：优先队列（堆）
Queue<Integer> pq = new PriorityQueue<>();
pq.offer(5);  pq.offer(1);  pq.offer(3);
System.out.println(pq.poll());  // 1（最小的先出）
```

---

## 七、异常处理

```java
// try-catch-finally
try {
    int result = 10 / 0;                 // 会抛 ArithmeticException
    int[] arr = new int[3];
    arr[5] = 1;                          // 会抛 ArrayIndexOutOfBoundsException
} catch (ArithmeticException e) {
    System.out.println("数学错误：" + e.getMessage());
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("数组越界：" + e.getMessage());
} catch (Exception e) {
    System.out.println("其他异常：" + e); // 兜底
} finally {
    System.out.println("无论是否异常，这里都会执行");
}

// try-with-resources（自动关闭资源，JDK 7+）
try (BufferedReader reader = new BufferedReader(new FileReader("test.txt"))) {
    String line = reader.readLine();
    System.out.println(line);
} catch (IOException e) {
    e.printStackTrace();
}
// reader 自动关闭，不用手动写 finally
```

---

## 八、文件读写

```java
import java.io.*;
import java.nio.file.*;  // JDK 7+ NIO

// 读取整个文件为字符串（最简单）
String content = Files.readString(Path.of("input.txt"));
System.out.println(content);

// 写入字符串到文件
Files.writeString(Path.of("output.txt"), "Hello, Java!");

// 逐行读取
try (BufferedReader reader = new BufferedReader(new FileReader("data.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}

// 逐行写入
try (BufferedWriter writer = new BufferedWriter(new FileWriter("out.txt"))) {
    writer.write("第一行");
    writer.newLine();
    writer.write("第二行");
}
```

---

## 九、实战练习

### 练习1：统计字符频率

```java
// 输入一个字符串，统计每个字符出现的次数
import java.util.*;

public class CharCounter {
    public static void main(String[] args) {
        String s = "hello world";
        Map<Character, Integer> freq = new HashMap<>();

        for (char c : s.toCharArray()) {
            if (c == ' ') continue;  // 跳过空格
            freq.put(c, freq.getOrDefault(c, 0) + 1);
        }

        for (Map.Entry<Character, Integer> e : freq.entrySet()) {
            System.out.println(e.getKey() + " → " + e.getValue());
        }
    }
}
/* 输出：
h → 1
e → 1
l → 3
o → 2
w → 1
r → 1
d → 1
*/
```

### 练习2：学生成绩管理

```java
import java.util.*;

class Student {
    String name;
    int score;

    Student(String name, int score) {
        this.name = name;
        this.score = score;
    }
}

public class ScoreManager {
    public static void main(String[] args) {
        List<Student> students = new ArrayList<>();
        students.add(new Student("小明", 85));
        students.add(new Student("小红", 92));
        students.add(new Student("小刚", 78));
        students.add(new Student("小丽", 95));
        students.add(new Student("小华", 88));

        // 找出最高分
        Student top = Collections.max(students,
            Comparator.comparingInt(s -> s.score));
        System.out.println("最高分: " + top.name + " (" + top.score + ")");

        // 按分数降序排序
        students.sort((a, b) -> b.score - a.score);
        System.out.println("\n排名：");
        for (int i = 0; i < students.size(); i++) {
            Student s = students.get(i);
            System.out.println((i + 1) + ". " + s.name + " - " + s.score);
        }

        // 平均分
        double avg = students.stream()
            .mapToInt(s -> s.score)
            .average()
            .orElse(0);
        System.out.println("\n平均分: " + avg);

        // 及格人数
        long pass = students.stream()
            .filter(s -> s.score >= 60)
            .count();
        System.out.println("及格人数: " + pass + "/" + students.size());
    }
}
```

### 练习3：冒泡排序

```java
public class BubbleSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;  // 已有序，提前结束
        }
    }

    public static void main(String[] args) {
        int[] nums = {64, 34, 25, 12, 22, 11, 90};
        sort(nums);
        System.out.println(Arrays.toString(nums));
        // 输出: [11, 12, 22, 25, 34, 64, 90]
    }
}
```

---

## 十、学习路线建议

| 阶段 | 内容 | 预计时间 |
|------|------|:--:|
| 入门 | 基础语法、数组、String | 1周 |
| 核心 | 面向对象（封装、继承、多态） | 2周 |
| 进阶 | 集合框架、异常、IO、泛型 | 2周 |
| 实战 | 小项目：学生管理/图书管理/控制台游戏 | 2周 |
| 框架 | Spring Boot、MyBatis、Maven | 4周+ |

### 推荐资源

- **IDE：** IntelliJ IDEA（社区版免费）— Java 开发标配
- **文档：** Oracle 官方 Java Tutorial + 菜鸟教程
- **练手：** LeetCode（用 Java 刷题）、牛客网
- **书籍：** 《Java 核心技术》（卷Ⅰ）、《Effective Java》（进阶）

---

> Java 的关键不在于记忆语法，而在于理解**面向对象的设计思想**——把现实世界的事物抽象成类和对象。入门阶段多敲代码比多看更重要，每个示例都亲手跑一遍，才能真正掌握。☕
