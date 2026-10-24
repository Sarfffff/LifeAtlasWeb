---
title: "C++"
date: 2026-09-16T11:50:07+08:00
updated: 2026-09-16T11:50:07+08:00
permalink: /dev-notes/UE-C++-C++/
categories:
  - 研发手记
  - "UE-C++"
tags:
  - 研发手记
  - "UE-C++"
source_repo: https://github.com/Sarfffff/LearnByCompany
---

### 仿函数
仿函数 = 函数对象（Function Object）= 重载了 operator() 的类（或结构体）。它"长得像函数"，但本质是对象。

```C++
class Add{
public:
	int operator()(int a,int b)const{
		return a + b;
	}
};
Add add;
add(3,4); //// 等价于 add.operator()(3, 4)
```
- 仿函数可以使用成员变量保存状态
```C++
class Counter {
    int count = 0;
public:
    void operator()() {
        ++count;
        cout << "第 " << count << " 次调用" << endl;
    }
};
```

---

> 本文从 [LearnByCompany 原始文档](https://github.com/Sarfffff/LearnByCompany/blob/main/UE-C%2B%2B/C%2B%2B.md) 自动同步。
