---
title: 贪心算法
date: 2026-06-27 03:28:00
categories:
  - 算法与数据结构
tags:
  - Algorithm
  - 笔记
---
# 贪心算法(堆，排序)

贪心算法是一种在**每一步选择当前最优解**，从而希望最终得到全局最优解的算法策略。它的核心思想是**局部最优导致全局最优**，即在每个决策阶段选择对当前最有利的选项，而不考虑未来的影响

## **贪心算法的基本特点**

|       特点       |                   说明                   |
| :--------------: | :--------------------------------------: |
| **局部最优选择** |      每一步都选择当前看起来最好的解      |
|   **无后效性**   |       当前的选择不会影响未来的选择       |
|   **不可回退**   | 一旦做出选择，就不能撤销（不像回溯算法） |
|    **高效性**    |   通常时间复杂度较低，适用于大规模问题   |

贪心算法**不一定能得到全局最优解**，只有在满足以下两个条件时才能保证最优性：

### **(1) 贪心选择性质（Greedy Choice Property）**

- **当前的最优选择能导致全局最优解**。 
- 即：**局部最优解包含在全局最优解中**。

### **(2) 最优子结构（Optimal Substructure）**

- 问题的最优解包含其子问题的最优解。
- 即：**全局最优解 = 当前最优选择 + 子问题的最优解**。

## **贪心算法 vs 动态规划（DP）**

|     对比项     |              贪心算法              |         动态规划         |
| :------------: | :--------------------------------: | :----------------------: |
|  **决策方式**  |         每一步选择当前最优         |   考虑所有可能的子问题   |
|   **最优性**   | 不一定全局最优（除非满足贪心条件） |       保证全局最优       |
| **计算复杂度** |   通常 *O*(*n*)或 *O*(*n*log*n*)   |   通常 *O*(*n*2)或更高   |
|  **适用问题**  |  活动选择、霍夫曼编码、最小生成树  | 背包问题、最长公共子序列 |

# 活动安排问题

给定 *n*个活动的集合 *S*={*a*1,*a*2,…,*a**n*}，每个活动 *a**i*有一个**开始时间 \*s\**i\*** 和**结束时间 \*f\**i\***（其中 *f**i*>*s**i*）。这些活动都需要占用同一个资源（例如会议室、CPU 时间等），且资源在同一时间只能被一个活动占用。

**目标**：从这些活动中选出一个**最大的兼容活动子集**，使得这些活动**两两不重叠**（即任意两个被选中的活动的时间区间没有重叠）

```C#
class Program: IComparable<Pro>
{
	public int start;
    public int end;
    public Program(int start,int end){
        this.start = start;
        this.end = end;
    }
     // 实现按照end从小到大排序
     public int CompareTo(Pro? other)
     {
         if (other == null) return 1;
         return this.end.CompareTo(other.end);
     }
}

public static int bestArrange(Program[] pro){
	Array.Sort(pro);
    int timeLine = 0;
    int result = 0;
    for(int i = 0;i < pro.Length;i++){
        if(timeLine < pro[i].start){
			result ++;
            timeLine = pro[i].end;
        }
    }
    return result;
}
```

# 最小切割成本问题

给定一个整数数组 `arr`，其中每个元素 `arr[i]`表示第 `i`块石头（或木棍）的长度。每次可以**选择任意两块石头合并**，合并的**成本是这两块石头的长度之和**。合并后的新石头的长度也是这两块石头长度之和。重复这个过程，直到所有石头合并成一块。

**目标**：求将所有石头合并为一块的**最小总成本**。

哈夫曼编码

```C#
    public int lessMoney(int[] arr)
    {
        PriorityQueue<int,int> queue = new PriorityQueue<int,int>();
        for(int i = 0;i < arr.Length; i++)
        {
            queue.Enqueue(arr[i], arr[i]);
        }
        int cur = 0;
        int sum = 0;
        while(queue.Count > 1)
        {
            cur = queue.Dequeue() + queue.Dequeue();
            sum += cur;
            queue.Enqueue(sum, sum);
        }
        return sum;
    }
```

# 最大化资本

你是一名投资人，初始拥有资本 `W`，并有一系列投资项目 `work[]`可供选择。每个项目需要一定的启动资金（成本），完成后会获得相应的利润。你的目标是在最多完成 `k`个项目的情况下，**最大化最终的总资本**。

1. **初始化两个堆**：
   - **最小堆（`minCost`）**：按项目的 `Pay`（成本）升序排序，快速获取当前可承担的最小成本项目。
   - **最大堆（`maxProfit`）**：按项目的 `Money`（利润）降序排序，快速选择当前可选的最高利润项目。
2. **算法步骤**：
   - 将所有项目按成本存入 `minCost`。
   - 每次从 `minCost`中取出所有 `Pay ≤ W`的项目，将其利润存入 `maxProfit`。
   - 从 `maxProfit`中选择利润最大的项目，更新资本 `W += Money`。
   - 重复 `k`次或直到无项目可选。
3. **时间复杂度**：
   - 建堆：`O(n log n)`。
   - 每次操作：`O(log n)`，总复杂度 `O((n + k) log n)`。

```C#
    public int FindMaximizedCapital(Work[] work, int k, int W)
    {
        // 最小堆：按成本升序
        var minCost = new PriorityQueue<int, int>();
        // 最大堆：按利润降序（通过负数模拟）
        var maxProfit = new PriorityQueue<int, int>();

        // 初始化最小堆（存储工作索引）
        for (int i = 0; i < work.Length; i++)
        {
            minCost.Enqueue(i, work[i].Pay);
        }

        for (int i = 0; i < k; i++)
        {
            // 将所有可承担成本的工作加入最大堆
            while (minCost.Count > 0 && work[minCost.Peek()].Pay <= W)
            {
                int idx = minCost.Dequeue();
                maxProfit.Enqueue(work[idx].Money, -work[idx].Money); // 负数模拟大根堆
            }

            if (maxProfit.Count == 0) 
                break; // 无项目可选
            
            W += maxProfit.Dequeue(); // 选择利润最大的项目
        }

        return W;
    }
}
public class Work
{
    public int Money;
    public int Pay;
    Work(int money, int pay)
    {
        this.Money = money;
        this.Pay = pay;
    }
}
```

![image-20250812181451852](/notes-assets/Algorithm/assets/image-20250812181451852.png)

```C#
using System;
using System.Collections.Generic;

public class Solution 
{
    public int FindMaximizedCapital(int k, int w, int[] profits, int[] capital) 
    {
        // 创建项目列表
        var projects = new List<Project>();
        for (int i = 0; i < profits.Length; i++)
        {
            projects.Add(new Project(profits[i], capital[i]));
        }

        // 最小堆：按资本升序排序
        var minCostQueue = new PriorityQueue<Project, int>();
        // 最大堆：按利润降序排序
        var maxProfitQueue = new PriorityQueue<Project, int>(Comparer<int>.Create((x, y) => y.CompareTo(x)));

        // 将所有项目加入最小堆
        foreach (var project in projects)
        {
            minCostQueue.Enqueue(project, project.Capital);
        }

        for (int i = 0; i < k; i++)
        {
            // 将当前可承担的项目转移到最大堆
            while (minCostQueue.Count > 0 && minCostQueue.Peek().Capital <= w)
            {
                var project = minCostQueue.Dequeue();
                maxProfitQueue.Enqueue(project, project.Profit);
            }

            // 如果没有可选项目，提前返回
            if (maxProfitQueue.Count == 0)
            {
                break;
            }

            // 选择利润最大的项目
            w += maxProfitQueue.Dequeue().Profit;
        }

        return w;
    }
}

// 项目类
public class Project
{
    public int Profit { get; }
    public int Capital { get; }

    public Project(int profit, int capital)
    {
        Profit = profit;
        Capital = capital;
    }
}
```


