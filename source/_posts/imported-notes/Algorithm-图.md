---
title: 图
date: 2026-06-27 03:21:00
categories:
  - 算法与数据结构
tags:
  - Algorithm
  - 笔记
---
# 图结构

图 = 点 + 边

## 点结构

```C#
public class Node{
    public int value; //点值
    public int in;  //入度
    public int out; //出度
    public List<Node> nexts;   	//从该点能找到邻居
    public List<Edge> edges;	//能找到邻居的边集
	public Node(int v){
		value = v;
        in = 0;
        out = 0;
        nexts = new List<Node>();
        edges = new List<Edge>();
    }
}
```

## 边结构

```C#
public class Edge{
	public int weight;//权重
    public Node from; //那个点出发
    public Node to;	  //到那个点
    public Edge(int weight,Node from,Node to){
        this.weight = weight;
        this.from = from;
        this.to = to;
    }
}
```

## 图

```C#
public class Graph{
    public Dictionary<int,Node> nodes;
    public List<Edge> edges;
    public Graph(){
		nodes = new Dictionary<int,Node>();
        edges = new List<Edge>();
    }
}

//创建图
//N * 3,N行，3列的结构，0代表权重，1代表起始点，2代表到达点
public Graph createGraph(int[][] matrix){
	Graph newG = new Graph();
    for(int i =0 ;i < matrix.Length;+){
        
        int weight = matrix[i][0];
        int From = matrix[i][1];
        int To = matrix[i][2];
        
        if(!newG.nodes.ContainKey(From)){
            newG.nodes.Add(From,new Node(weight));
        }
        if(!newG.nodes.ContainKey(To)){
			newG.nodes.Add(To,new Node(weight));
        }
        
        Node FromNode = newG.nodes[From];
        Node ToNode =newG.nodes[To];
        Edge newEdge = new Edge(weight,FromNode,ToNode);
        
        FromNode.nexts.Add(ToNode);
        FromNode.out++;
        ToNode.in++;
        FromNode.edges.Add(newEdge);
        newG.edges.Add(newEdge);
    }
    return newG;
}
```

# 宽度优先遍历

**广度优先搜索**采用"层层递进"的策略：

1. 1.从起始节点开始，先访问所有直接相邻的节点
2. 2.再访问这些相邻节点的相邻节点
3. 3.依此类推，直到遍历完所有可达节点

为了确保每次的元素走过后不再次经过，使用一个列表将其存入，如果列表中存在该元素则直接跳过，不走回头路。出队就存入ans

```C#
public List<int> BFS(Node root){
    if (root == null) return new List<int>();
    HashSet<Node> sets = new HashSet<Node>();
    Queue<Node> queue = new Queue<Node>();
    List<int> ans = new List<int>();
    
    sets.Add(root);
    queue.Enqueue(root);
    while(queue.Count > 0){
        Node cur = queue.Dequeue();
        ans.Add(cur.value);
        foreach(var next in cur.nexts)
        {
            if(!sets.Contains(next)){
                queue.Enqueue(next);
                sets.Add(next);
            }
        }
    }
    return ans;
}
```

# 深度优先遍历

为了确保每次的元素走过后不再次经过，使用一个列表将其存入，如果列表中存在该元素则直接跳过，不走回头路。出栈就存入ans

### 算法逻辑

1. 1.**初始化**：将根节点加入已访问集合、栈和结果列表

2. 2.

   **遍历过程**：

   - •弹出栈顶节点作为当前节点
   - •遍历当前节点的所有邻接节点
   - •找到第一个未访问的邻接节点时：
     - •将当前节点重新压回栈中（用于回溯）
     - •将新节点压入栈中
     - •标记新节点为已访问
     - •将新节点值加入结果
     - •**立即break**（关键！只处理第一个未访问节点)

```C#
public List<int> DFS(Node root){
    if (root == null) return new List<int>();
    
    HashSet<Node> sets = new HashSet<Node>();
    Stack<Node> stack = new Stack<Node>();
    List<int> ans = new List<int>();
    
    sets.Add(root);
    stack.Push(root);
    ans.Add(root.value);
    while(stack.Count > 0){
        Node cur = stack.Pop();
        foreach(var next in cur.nexts)
        {
            if(!sets.Contains(next)){
                stack.Push(cur);
                stack.Push(next);
                sets.Add(next);
                ans.Add(next.val);
                break;
            }
        }
    }
    return ans;
}
```

# 拓扑排序

拓扑排序（Topological Sorting）是针对**有向无环图（DAG）** 的线性排序算法，使得对于图中的每条有向边 `u → v`，在排序中节点 u 都排在节点 v 的前面。

### 拓扑排序的核心思想

1. 1.**只适用于有向无环图（DAG）**
2. 2.**反映节点间的依赖关系**
3. 3.**可能存在多种合法的排序结果**

```C#
  public static List<Node> TopologicalSort(Graph graph)
    {
        if (graph == null || graph.nodes.Count == 0)
            return new List<Node>();

        // 1. 统计初始入度并初始化队列
        Dictionary<Node, int> inMap = new Dictionary<Node, int>();
        Queue<Node> zeroInQueue = new Queue<Node>();

        foreach (var node in graph.nodes.Values)
        {
            inMap[node] = node.in; // 记录每个节点的入度
            if (node.in == 0)
                zeroInQueue.Enqueue(node);
        }

        // 2. 处理队列
        List<Node> result = new List<Node>();
        while (zeroInQueue.Count > 0)
        {
            Node cur = zeroInQueue.Dequeue();
            result.Add(cur);

            // 遍历当前节点的所有邻居
            foreach (Node next in cur.nexts)
            {
                inMap[next]--; // 邻居入度减1
                if (inMap[next] == 0)
                    zeroInQueue.Enqueue(next);
            }
        }

        // 3. 检查是否有环
        if (result.Count != graph.nodes.Count)
        {
            throw new InvalidOperationException("图中存在环，无法进行拓扑排序！");
        }

        return result;
    }
```

# 克鲁斯卡尔算法

**按边权从小到大排序，逐步选择边，并避免形成环**（用并查集判断是否成环）。

### 算法步骤

1. 1.**排序所有边**：按权重从小到大排序。
2. 2.**初始化并查集**：每个节点自成一个集合。
3. 3.**遍历边**：
   - •如果边的两个端点不属于同一集合（即不形成环），则选择该边，并合并两个集合。
   - •否则跳过该边。
4. 4.**终止条件**：已选边数 = 节点数 - 1。

```C#
using System;
using System.Collections.Generic;
using System.Linq;

// 你的并查集类（已优化路径压缩和按秩合并）
public class UnionSet
{
    public int[] parents;
    public int[] size;
    public int[] help;
    public int sets;

    public UnionSet(int N)
    {
        parents = new int[N];
        size = new int[N];
        help = new int[N];
        sets = N;
        for (int i = 0; i < N; i++)
        {
            parents[i] = i;
            size[i] = 1;
        }
    }

    // 查找根节点（路径压缩）
    public int Find(int i)
    {
        int hi = 0;
        while (i != parents[i])
        {
            help[hi++] = i;
            i = parents[i];
        }
        for (int j = hi - 1; j >= 0; j--)
        {
            parents[help[j]] = i;
        }
        return i;
    }

    // 合并两个集合（按秩合并）
    public void Union(int i, int j)
    {
        if (Find(i) == Find(j))
            return;
        else
        {
            int findA = Find(i);
            int findB = Find(j);
            if (size[findA] >= size[findB])
            {
                size[findA] += size[findB];
                parents[findB] = findA;
            }
            else
            {
                size[findB] += size[findA];
                parents[findA] = findB;
            }
            sets--;
        }
    }
}

// Kruskal算法实现
public class Kruskal
{
    public static List<Edge> KruskalMST(Graph graph)
    {
        List<Edge> result = new List<Edge>();
        if (graph == null || graph.nodes.Count == 0)
            return result;

        // 1. 将边按权重从小到大排序
        List<Edge> edges = graph.edges.OrderBy(e => e.weight).ToList();

        // 2. 初始化并查集（节点值需连续整数，否则需映射）
        // 假设节点值是 0 到 N-1 的连续整数
        int maxNodeValue = graph.nodes.Keys.Max();
        UnionSet uf = new UnionSet(maxNodeValue + 1);

        // 3. 遍历所有边
        foreach (Edge edge in edges)
        {
            int from = edge.from.value;
            int to = edge.to.value;
            if (uf.Find(from) != uf.Find(to))
            {
                result.Add(edge);
                uf.Union(from, to);
                if (result.Count == graph.nodes.Count - 1)
                    break; // 已选够边数
            }
        }

        return result;
    }
}
```

