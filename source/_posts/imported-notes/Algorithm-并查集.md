---
title: 并查集
date: 2026-06-27 03:24:00
categories:
  - 算法与数据结构
tags:
  - Algorithm
  - 笔记
---
# 并查集

**并查集**（Union-Find）是一种用于管理**不相交集合**（Disjoint Sets）的数据结构，主要支持以下两种高效操作：

1. **`Find`（查找）**：查询某个元素所属的集合（通常返回该集合的代表元素）。
2. **`Union`（合并）**：将两个集合合并为一个集合。

此外，并查集通常还支持：

- **初始化（`MakeSet`）**：为每个元素单独创建一个集合。
- **判断两个元素是否属于同一集合（`isSameSet`）**。

------

### **核心概念**

1. **集合的代表（Root / Parent）**：
   - 每个集合有一个**代表元素**（通常称为**根节点**或**父节点**）。
   - 所有属于该集合的元素的 `Find`操作最终都会指向这个代表元素。
2. **路径压缩（Path Compression）**：
   - 在 `Find`操作时，将查询路径上的所有节点直接指向根节点，以优化后续查询效率。
3. **按秩合并（Union by Rank / Size）**：
   - 在 `Union`操作时，将较小的集合合并到较大的集合中，以保持树的平衡，提高效率。

|    操作     | 普通实现 |  路径压缩 + 按秩合并   |
| :---------: | :------: | :--------------------: |
|   `Find`    |   O(n)   | **O(α(n))** (接近常数) |
|   `Union`   |   O(n)   | **O(α(n))** (接近常数) |
| `isSameSet` |   O(n)   | **O(α(n))** (接近常数) |

```C#
  public class Node<T>
  {
      public T Value;
      public Node(T value) { Value = value; }
  }

  public class UnionSet<T>
  {
      Dictionary<T, Node<T>> nodes;
      Dictionary<Node<T>, Node<T>> parents;
      Dictionary<Node<T>, int> sizeMap;

      public UnionSet(List<T> values)
      {
          nodes = new Dictionary<T, Node<T>>();
          parents = new Dictionary<Node<T>, Node<T>>();
          sizeMap = new Dictionary<Node<T>, int>();
          foreach (var cur in values)
          {
              if (cur == null) continue;
              Node<T> node = new Node<T>(cur);
              nodes.Add(cur, node);
              parents.Add(node, node);
              sizeMap.Add(node, 1);
          }
      }
    public Node<T> FindFather(Node<T> cur)
 	{
         Stack<Node<T>> path = new Stack<Node<T>>();
         while (cur != parents[cur])
         {
             path.Push(cur);
             cur = parents[cur];
         }
         while (path.Count > 0)
         {
             parents[path.Pop()] = cur;  // 修正路径压缩
         }
         return cur;
 	}	
    
    public bool isSameSet(T a,T b){
		if (a == null || b == null) return false;
		return FindFather(nodes[a]) == FindFather(nodes[b]);
    }
    
    public void union(T a,T b){
		if (a == null || b == null) return;

        Node<T> aHead = FindFather(nodes[a]);
        Node<T> bHead = FindFather(nodes[b]);
        if (aHead != bHead)
        {
            int aSetSize = sizeMap[aHead];
            int bSetSize = sizeMap[bHead];

            Node<T> big = aSetSize >= bSetSize ? aHead : bHead;
            Node<T> small = big == aHead ? bHead : aHead;

            parents[small] = big;  // 修正合并操作
            sizeMap[big] = aSetSize + bSetSize;  // 更新正确的集合大小
            sizeMap.Remove(small);
        }
    }
}
```

### 数组优化并查集

```C#
public class UnionSet{
    public int[] parents;
    public int[] size;
    public int[] help;
    public int sets;
    
    public UnionSet(int N){
        parents = new int[N];
        size = new int[N];
        help = new int[N];
        sets = N;
        for(int i = 0;i < N;i++){
            parents[i] = i;
            size[i] = 1;
        }
    }
    public int find(int i){
        int hi = 0;
        while(i != parents[i]){
            help[hi++] = i;
            i = parents[i];
        }
        for(int j = hi - 1;j >= 0;j--){
            parents[help[j]] = i;
        }
        return i;
    }
    public void unionset(int i,int j){
        if(find(i) == find(j))
            return;
        else{
            int findA = find(i);
            int findB = find(j);
            if(size[findA] >= size[findB]){
                size[findA] += size[findB];
                parents[findB] = findA;
            }
            else{
                size[findB] += size[findA];
                parents[findA] = findB;
            }
            sets--;
        }
    }
}
```

# 岛屿数量

![image-20250822204922238](/notes-assets/Algorithm/assets/image-20250822204922238.png)

题目描述：给定一个 m x n 的网格，初始时所有单元格都是水域。操作 positions 中的每个元素 positions[i] = [ri, ci] 表示在网格的 (ri, ci) 处添加一块陆地。返回一个列表，其中第 i 个元素是第 i 次操作后岛屿的数量。

算法思路：使用并查集（Union-Find）来动态维护岛屿数量。每次添加一块新陆地时，先将其视为一个独立的岛屿，然后检查其上下左右四个方向，如果相邻单元格是陆地，则进行合并（Union）操作。并查集需要支持路径压缩和按秩合并（使用大小作为秩）以提高效率。

具体步骤：

1. 1.初始化并查集，大小为 m * n，初始时所有单元格的父节点为自己，但大小（size）为0（表示水域）。

2. 2.

   遍历每个操作位置 (r, c)：

   a. 计算索引 index = r * n + c（注意列数 n）。

   b. 如果该位置已经是陆地（size[index] > 0），则直接返回当前岛屿数量（避免重复添加）。

   c. 否则，将该位置初始化为陆地：父节点为自己，大小设为1，岛屿数（sets）加1。

   d. 检查上下左右四个方向：

   如果相邻位置存在且是陆地，则与当前位置进行合并。

   合并时，找到两个位置的根节点，如果根节点不同，则根据大小合并（小树合并到大树），同时岛屿数减1。

3. 3.

   每次操作后，记录当前岛屿数量到结果列表。

```C#
using System.Collections.Generic;

public class Solution {
    public IList<int> NumIslands2(int m, int n, int[][] positions) {
        UnionFind uf = new UnionFind(m, n);
        List<int> ans = new List<int>();
        foreach (int[] pos in positions) {
            int r = pos[0], c = pos[1];
            ans.Add(uf.Connect(r, c));
        }
        return ans;
    }
}

class UnionFind {
    private int[] size;
    private int[] parents;
    private int[] help;
    private int sets;
    private int rows;
    private int cols;

    public UnionFind(int m, int n) {
        int len = m * n;
        size = new int[len];
        parents = new int[len];
        help = new int[len];
        sets = 0;
        rows = m;
        cols = n;
    }

    private int Find(int i) {
        int hi = 0;
        while (i != parents[i]) {
            help[hi++] = i;
            i = parents[i];
        }
        for (int j = hi - 1; j >= 0; j--) {
            parents[help[j]] = i;
        }
        return i;
    }

    private int Index(int r, int c) {
        return r * cols + c;
    }

    public int Connect(int r, int c) {
        int index = Index(r, c);
        if (size[index] == 0) {
            parents[index] = index;
            size[index] = 1;
            sets++;
            // Check and union with four neighbors
            Union(r, c, r - 1, c);
            Union(r, c, r + 1, c);
            Union(r, c, r, c - 1);
            Union(r, c, r, c + 1);
        }
        return sets;
    }

    private void Union(int r1, int c1, int r2, int c2) {
        if (r1 < 0 || r1 == r || c1 < 0 || c1 == c || r < 0 || r2 == r || c2 < 0 || c2 == c)
    		return;
        int i1 = Index(r1, c1);
        int i2 = Index(r2, c2);
        if (size[i1] == 0 || size[i2] == 0) return;
        int f1 = Find(i1);
        int f2 = Find(i2);
        if (f1 != f2) {
            if (size[f1] >= size[f2]) {
                size[f1] += size[f2];
                parents[f2] = f1;
            } else {
                size[f2] += size[f1];
                parents[f1] = f2;
            }
            sets--;
        }
    }
}
```


