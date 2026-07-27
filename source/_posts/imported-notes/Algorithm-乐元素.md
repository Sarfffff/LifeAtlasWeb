---
title: 乐元素
date: 2026-06-27 03:16:00
categories:
  - 算法与数据结构
tags:
  - Algorithm
  - 笔记
---


# 1.好名字

给定一个字符串，需要找出最长的连续子串（即“好名字”），满足条件：

- •在这个子串中，**每个字符最多出现2次**。
- •并且**最多只能有一个字符出现恰好2次**（其他字符只能出现0次或1次）。

换句话说：

- •子串中所有字符的频率最多为2。
- •并且**至多有一个字符的频率为2**（其他字符频率必须≤1）。

我们需要返回最长这样的子串的长度。

------

## 方法：滑动窗口（双指针）

**思路：**

1. 1.使用滑动窗口 `[left, right]`来代表当前子串。
2. 2.用 `freq`数组（或哈希表）记录窗口内每个字符的出现次数。
3. 3.维护两个关键计数：
   - •countTwo`：记录当前窗口内出现次数恰好为2的字符的个数（应该最多为1）。
   - •`countOver`：记录当前窗口内出现次数超过2的字符的个数（应该为0）。
4. 4.扩展右指针 `right`，增加字符，更新频率和计数。
5. 5.如果当前窗口违反条件（即 `countOver > 0`或 `countTwo > 1`），则收缩左指针 `left`直到窗口再次合法。
6. 6.在每一步中，如果窗口合法，更新最大长度。

**注意：**

- •由于条件要求最多一个字符出现2次，且没有字符出现超过2次，所以我们需要同时检查：
  - •是否有字符频率>2（`countOver>0`）？
  - •是否有超过一个字符频率恰好为2（`countTwo>1`）？
- •当窗口非法时，收缩左边界，减少字符频率，并更新计数。

```C#
using System;

public class Solution {
    public static int LongestGoodName(string s) {
        int n = s.Length;
        int[] freq = new int[256]; // 存储每个ASCII字符的出现频率
        int left = 0;
        int maxLen = 0;
        int countTwo = 0;   // 记录当前窗口内出现恰好2次的字符个数
        int countOver = 0;  // 记录当前窗口内出现超过2次的字符个数

        for (int right = 0; right < n; right++) {
            char c = s[right];
            freq[c]++;
            
            // 更新计数
            if (freq[c] == 2) {
                countTwo++;
            } else if (freq[c] == 3) {
                countTwo--;  // 之前是2，现在变成3，所以不再属于"恰好2次"
                countOver++;
            }
            
            // 如果窗口非法：有字符超过2次 或 有超过1个字符出现2次
            while (countOver > 0 || countTwo > 1) {
                char leftChar = s[left];
                freq[leftChar]--;
                if (freq[leftChar] == 1) {
                    // 之前是2，现在变成1，所以减少一个"恰好2次"
                    countTwo--;
                } else if (freq[leftChar] == 2) {
                    // 之前是3，现在变成2，所以减少一个"超过2次"，增加一个"恰好2次"
                    countOver--;
                    countTwo++;
                }
                left++;
            }
            
            // 此时窗口合法，更新最大长度
            maxLen = Math.Max(maxLen, right - left + 1);
        }
        return maxLen;
    }

    public static void Main() {
        string s = Console.ReadLine();
        Console.WriteLine(LongestGoodName(s));
    }
}
```

# 2.闪电链

你有一个闪电链攻击：

- •从起点 `(x0, y0)`发射，初始发射范围 `r0`（只能攻击到发射范围内的敌人）。
- •攻击到第一个敌人后，闪电链会传递到该敌人，并以该敌人为中心，以攻击范围 `r`继续传递（攻击到新范围内的其他敌人）。
- •每个敌人只能被攻击一次。
- •你只能发射一次（即只能从起点开始一次连锁）。

目标是：找出最多能攻击到的敌人数量。

**注意：**

- •起点可能没有敌人（所以第一个敌人必须在发射范围内）。
- •传递是连锁的：从起点开始，每次攻击到一个敌人后，以该敌人为中心，用攻击范围 `r`去攻击下一个未被攻击的敌人（类似BFS/DFS遍历）。

## 方法：BFS（广度优先搜索）

**思路：**

1. 1.将起点视为第0个“节点”，其范围是 `r0`（发射范围）。
2. 2.从起点开始，找到所有在发射范围 `r0`内的敌人（这些敌人可以作为第一层）。
3. 3.然后从每一个第一层敌人开始，用攻击范围 `r`去扩展（BFS），寻找下一层敌人（未被攻击过的）。
4. 4.注意：起点本身不是敌人（所以不会消耗攻击次数），但起点有发射范围。

**关键点：**

- •由于起点是固定的，但第一层敌人可能有多个（都在发射范围内），我们需要尝试从每一个第一层敌人开始进行BFS，并取最大值（因为闪电链只能选择一条路径传递？但注意：闪电链是连锁的，但每次只能攻击一个敌人，然后从该敌人继续传递？实际上，闪电链是链式的，每次只能攻击一个目标，然后从该目标继续传递？但问题中可能允许同时攻击多个？但问题说“传递”，通常是一条链）。

**但问题描述可能有两种解释：**

1. 1.**链式传递**：每次攻击只能选择一个目标（从多个可选目标中选一个），然后从该目标继续传递。这样我们需要选择一条链，使得攻击到的敌人最多（类似树的最长链）。
2. 2.**范围传递**：攻击到第一个敌人后，以该敌人为中心，范围r内的所有敌人都会受到攻击（同时），然后这些敌人再同时传递？但问题说“传递”，更可能是链式（每次一个）。

由于问题说“攻击能够传递”，且“每个敌人只能受到一次攻击”，通常理解为：每次攻击只能选择一个目标（从范围内多个可选目标中选一个），然后从该目标继续。所以我们需要找到一条最长的链。

**然而**，问题要求“最多攻击敌人的数量”，且只能发射一次，但传递是链式的，所以实际上是从起点开始，选择一条链（每一步从当前节点的范围内选择一个敌人），使得链长度最长。

但注意：起点发射范围可能包含多个敌人，我们可以任意选择其中一个作为第一个攻击目标，然后从它开始传递。所以我们需要尝试所有可能的第一层敌人，然后对每个第一层敌人做BFS（实际上DFS更合适，因为要找最长链）。

------

## 方法：DFS（深度优先搜索） + 回溯

由于每一步攻击只能选择一个目标（从当前范围内的多个敌人中选一个），然后继续，所以实际上是一个决策树：我们需要选择一条链，使得攻击到的敌人最多。

但敌人数量可能不多（假设最多几十个），我们可以用DFS+回溯。

**步骤：**

1. 1.表示每个敌人为节点，节点i到节点j的距离如果<=当前节点的范围（起点范围r0，其他节点范围r），则存在边。
2. 2.从起点开始，起点可以到达所有距离<=r0的敌人。
3. 3.然后从每个第一层敌人开始，DFS遍历（标记已访问），每次从当前敌人u，可以到达所有距离<=r且未访问的敌人v。
4. 4.对每条路径，记录长度，取最大值。

注意：起点不是敌人，所以不计入攻击数量。

**实现：**

- •设敌人列表为`enemies`（每个敌人有坐标）。
- •起点为`(x0,y0)`。
- •计算起点到每个敌人的距离，小于等于`r0`的为第一层。
- •然后对每个第一层敌人作为起点，进行DFS（记录当前链长度，并标记访问）。

由于链是顺序的，我们需要回溯（因为一条链结束后，要尝试其他分支）。

但注意：闪电链传递时，每次只能攻击一个敌人，所以是一条路径（不是树），所以我们需要找最长的路径。

但由于图不是树（可能有环），但每个敌人只能攻击一次，所以实际上我们遍历的是简单路径。

**算法：**

- •用DFS+回溯，尝试所有可能的路径。
- •敌人数量n不大（假设n<=20），所以可行。

```C#
using System;
using System.Collections.Generic;

public struct Point
{
    public double X { get; }
    public double Y { get; }

    public Point(double x, double y)
    {
        X = x;
        Y = y;
    }
}

public class Program
{
    public static double Distance(Point a, Point b)
    {
        double dx = a.X - b.X;
        double dy = a.Y - b.Y;
        return Math.Sqrt(dx * dx + dy * dy);
    }

    public static int Dfs(int u, bool[] visited, List<List<int>> graph)
    {
        visited[u] = true;
        int maxDepth = 0;
        
        foreach (int v in graph[u])
        {
            if (!visited[v])
            {
                int depth = Dfs(v, visited, graph);
                if (depth > maxDepth)
                {
                    maxDepth = depth;
                }
            }
        }
        
        visited[u] = false; // 回溯
        return maxDepth + 1;
    }

    public static void Main()
    {
        string[] firstLine = Console.ReadLine().Split();
        double x0 = double.Parse(firstLine[0]);
        double y0 = double.Parse(firstLine[1]);
        double r0 = double.Parse(firstLine[2]);
        double r = double.Parse(firstLine[3]);

        int n = int.Parse(Console.ReadLine());
        List<Point> enemies = new List<Point>();

        for (int i = 0; i < n; i++)
        {
            string[] coords = Console.ReadLine().Split();
            double x = double.Parse(coords[0]);
            double y = double.Parse(coords[1]);
            enemies.Add(new Point(x, y));
        }

        // 构建图
        List<List<int>> graph = new List<List<int>>();
        for (int i = 0; i < n; i++)
        {
            graph.Add(new List<int>());
        }

        for (int i = 0; i < n; i++)
        {
            for (int j = i + 1; j < n; j++)
            {
                double d = Distance(enemies[i], enemies[j]);
                if (d <= r)
                {
                    graph[i].Add(j);
                    graph[j].Add(i);
                }
            }
        }

        // 找到第一层节点（从起点可直接到达的敌人）
        Point start = new Point(x0, y0);
        List<int> firstLayer = new List<int>();
        for (int i = 0; i < n; i++)
        {
            if (Distance(start, enemies[i]) <= r0)
            {
                firstLayer.Add(i);
            }
        }

        int ans = 0;
        bool[] visited = new bool[n];
        foreach (int i in firstLayer)
        {
            int depth = Dfs(i, visited, graph);
            if (depth > ans)
            {
                ans = depth;
            }
        }

        Console.WriteLine(ans);
    }
}
```

# 多任务调度与依赖关系

**问题描述：**

给定：

1. 1.`tasks`数组：`tasks[i]`表示任务`i`需要的工作天数。
2. 2.`dependencies`二维数组：`dependencies[i][j] = 1`表示任务`i`依赖于任务`j`（需要任务`j`完成后才能开始任务`i`）。
3. 3.`workers`：可用工人数量（每个工人同时只能进行一个任务）。

求完成所有任务所需的最短天数。

**案例说明：**

- •tasks = [1, 1, 3]`：任务0需要1天，任务1需要1天，任务2需要3天。
- •`dependencies = [[0,0,0], [1,0,0], [1,1,0]]`：
  - •任务0：无依赖（`[0,0,0]`表示不依赖任何任务）
  - •任务1：依赖任务0（`[1,0,0]`表示只依赖任务0）
  - •任务2：依赖任务0和任务1（`[1,1,0]`表示依赖任务0和任务1）
- •workers = 2`：有2个工人

**任务依赖图：**

```
任务0 → 任务1 → 任务2
```

**调度方案：**

- •第0天：工人1开始任务0，工人2开始任务1（但任务1依赖任务0，不能立即开始）
- •实际上：只能先开始任务0（第0天）
- •第1天：任务0完成，开始任务1（工人1）和任务2（工人2）？
- •但任务2同时依赖任务0和任务1，必须等任务1完成

**正确调度：**

- •第0天：开始任务0（工人1）
- •第1天：任务0完成，开始任务1（工人1）
- •第2天：任务1完成，开始任务2（工人1）
- •总天数：1（任务0） + 1（任务1） + 3（任务2） = 5天？

但工人2一直空闲？实际上我们可以优化：

**最优调度（2个工人）：**

- •第0天：工人1开始任务0
- •第1天：任务0完成，工人1开始任务1，工人2开始任务2（但任务2依赖任务1，不能开始）
- •实际上任务2必须等任务1完成：
- •第0天：任务0（工人1）
- •第1天：任务0完成，任务1开始（工人1）
- •第2天：任务1完成，任务2开始（工人1和工人2可以一起做任务2？但一个任务只能由一个工人完成）

**关键约束：**

- •每个任务只能由一个工人完成，且不能中断
- •任务必须在其所有依赖任务完成后才能开始
- •一个工人同时只能进行一个任务

所以案例中：

- •第0天：任务0（工人1）
- •第1天：任务0完成，任务1开始（工人1）
- •第2天：任务1完成，任务2开始（工人1）
- •总天数：1 + 1 + 3 = 5天

------

## 算法：拓扑排序 + 动态规划 + 工人调度

### 步骤：

1. 1.**构建依赖图**：使用邻接表表示任务依赖关系
2. 2.**拓扑排序**：确定任务执行顺序
3. 3.**计算最早开始时间**：对于每个任务，其开始时间必须 ≥ 所有前置任务的最早完成时间
4. 4.**工人调度**：使用贪心策略，总是将可用工人分配给可以开始的任务中最早完成的

### 具体实现（模拟时间流）：

```C#
using System;
using System.Collections.Generic;
using System.Linq;

public class Solution {
    public static int MinDays(int[] tasks, int[][] dependencies, int workers) {
        int n = tasks.Length;
        if (n == 0) return 0;
        
        // 构建图和入度
        List<List<int>> graph = new List<List<int>>();
        for (int i = 0; i < n; i++) {
            graph.Add(new List<int>());
        }
        int[] inDegree = new int[n];
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dependencies[i][j] == 1) {
                    graph[j].Add(i);  // j -> i 表示j是i的前置
                    inDegree[i]++;
                }
            }
        }
        
        // 拓扑排序
        Queue<int> queue = new Queue<int>();
        for (int i = 0; i < n; i++) {
            if (inDegree[i] == 0) {
                queue.Enqueue(i);
            }
        }
        
        // 最早开始时间
        int[] startTime = new int[n];
        List<int> topoOrder = new List<int>();
        
        while (queue.Count > 0) {
            int u = queue.Dequeue();
            topoOrder.Add(u);
            
            foreach (int v in graph[u]) {
                inDegree[v]--;
                if (inDegree[v] == 0) {
                    queue.Enqueue(v);
                }
                // 更新最早开始时间：必须等所有前置完成
                startTime[v] = Math.Max(startTime[v], startTime[u] + tasks[u]);
            }
        }
        
        // 模拟调度：使用优先队列（小顶堆）管理工人空闲时间
        SortedSet<int> freeWorkers = new SortedSet<int>();
        for (int i = 0; i < workers; i++) {
            freeWorkers.Add(0);  // 工人初始空闲时间为0
        }
        
        int[] completionTime = new int[n];
        
        foreach (int task in topoOrder) {
            // 获取最早空闲的工人时间
            int earliestWorkerFreeTime = freeWorkers.Min;
            freeWorkers.Remove(earliestWorkerFreeTime);
            
            // 实际开始时间 = max(最早开始时间, 工人空闲时间)
            int actualStart = Math.Max(startTime[task], earliestWorkerFreeTime);
            completionTime[task] = actualStart + tasks[task];
            
            // 将工人的新空闲时间加入集合
            freeWorkers.Add(completionTime[task]);
        }
        
        return completionTime.Max();
    }
    
    public static void Main() {
        // 测试案例
        int[] tasks = {1, 1, 3};
        int[][] dependencies = {
            new int[] {0, 0, 0},
            new int[] {1, 0, 0},
            new int[] {1, 1, 0}
        };
        int workers = 2;
        
        Console.WriteLine(MinDays(tasks, dependencies, workers));  // 输出应为5
    }
}

```

# 根据树的2中遍历顺序得到树结构

#### **第一步：识别根节点**

- •**前序+中序**：前序的第一个元素是根节点
- •**中序+后序**：后序的最后一个元素是根节点

#### **第二步：划分左右子树**

- •在中序遍历中找到根节点的位置
- •**左子树**：根节点左边的所有元素
- •**右子树**：根节点右边的所有元素

#### **第三步：确定子树遍历序列**

- •**前序+中序**：
  - •左子树前序 = 前序中接下来的n个元素（n=左子树长度）
  - •右子树前序 = 前序中剩余的元素
- •**中序+后序**：
  - •左子树后序 = 后序中前n个元素（n=左子树长度）
  - •右子树后序 = 后序中接下来的元素（排除根节点）

#### **第四步：递归处理**

- •对左子树和右子树分别重复上述过程
- •**递归终止条件**：当遍历序列为空时返回null