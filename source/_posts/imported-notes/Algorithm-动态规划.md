---
title: 动态规划
date: 2026-06-27 03:20:00
categories:
  - 算法与数据结构
tags:
  - Algorithm
  - 笔记
---
# 暴力递归

## 暴力递归的关键要素

一个典型的暴力递归算法包含三个要素：

1. 1.**递归终止条件：** 定义问题最简单的情况，并直接返回结果。这是递归的出口，没有它会导致无限递归。
2. 2.**问题分解：** 在每一步，将当前问题分解成一个或多个规模更小的**同类型**子问题。
3. 3.**决策与尝试：** 对于当前步骤，做出一个选择（或尝试所有可能的选择），然后基于这个选择递归地解决子问题，并将子问题的结果组合起来形成当前问题的解。

## Hanoi塔问题

设a,b,c是3个塔座。要求由a移动到b。移动圆盘时遵守以下移动规则
规则1:每次只能移动1个圆盘;
规则2:任何时刻都不允许较大的圆盘压在较小的圆盘之上:
规则3:在满足移动规则1和2的前提下，可将圆盘移至a,b,c中任一塔座上，

![image-20241122145623939](/notes-assets/Algorithm/assets/image-20241122145623939.png)

```C++
public class Solution {
    public void Hanota(IList<int> A, IList<int> B, IList<int> C) {
        Hanoi(A.Count,A,B,C);
    }
    public void Hanoi(int N,IList<int> form, IList<int> temp, IList<int> to){
        if(N == 1){
            to.Add(form[0]);
            form.RemoveAt(0);
            return;
        }
        Hanoi(N - 1,form,to,temp);
        Hanoi(1,form,temp,to);
        Hanoi(N - 1,temp,form,to);
    }
}
```

## 字符串的全部子序列

思路：

- 首先将字符串转变为数组，创建一个空列表存储所有的子序列，同时初始化一个空字符串作为当前的子序列。
- 对于递归，首先找到BaseCase也就是递归中止条件，也就是下标索引等于字符串长度退出递归
- 如果当前索引  < 字符串长度：
  - 需要当前索引处的元素：正在构建的子序列path + 当前索引的元素，处理下一个字符
  - 不需要当前索引处的元素：path不变，处理下一个字符。

```uml
开始（path=""）
├─ 不选'a' → path=""
│  ├─ 不选'b' → path=""
│  │  ├─ 不选'c' → 加入""
│  │  └─ 选'c' → 加入"c"
│  └─ 选'b' → path="b"
│     ├─ 不选'c' → 加入"b"
│     └─ 选'c' → 加入"bc"
└─ 选'a' → path="a"
   ├─ 不选'b' → path="a"
   │  ├─ 不选'c' → 加入"a"
   │  └─ 选'c' → 加入"ac"
   └─ 选'b' → path="ab"
      ├─ 不选'c' → 加入"ab"
      └─ 选'c' → 加入"abc"
```

```C#
static void Main(string[] args)
 {
     List<string> list = new List<string>();
     list = subs("abc");
     foreach(var i in list)
     {
         Console.WriteLine(i);
     }
}
public static List<string> subs(string str)
{
    char[] arr = str.ToCharArray();  // 将字符串转为字符数组
    List<string> ans = new List<string>();  // 存储所有子序列
    string path = "";  // 当前正在构建的子序列
    process(arr, 0, ans, path);  // 调用递归方法
    return ans;  // 返回所有子序列
}
public static void process(char[] arr, int index, List<string> set, string path)
{
    if (index == arr.Length)  // 递归终止条件：已经遍历完所有字符
    {
        set.Add(path);  // 将当前子序列加入结果集
        return;
    }
    process(arr, index + 1, set, path);  // **不选当前字符**，继续递归
    process(arr, index + 1, set, path + arr[index]);  // **选当前字符**，继续递归
}
```

整型

```C#
public class Solution {
    public IList<IList<int>> Subsets(int[] nums) {
        var ans = new List<IList<int>>();
        if(nums.Length == 0)
            return ans;
        List<int> path = new List<int>();
        Process(nums,0,ans,path);
        return ans;
    }
    public void Process(int[] nums,int index,List<IList<int>> ans,List<int> path){
        if(index == nums.Length){
            ans.Add(path);
            return;
        }
        Process(nums,index + 1,ans,path);
        var cur = new List<int>(path){nums[index]};
        Process(nums,index + 1,ans,cur);
    }
}
```

## 字符串的无重复子序列

在上述子序列的基础上使用HashSet即可，因为HashSet可以自动去重

```C#
static void Main(string[] args)
 {
     HashSet<string> list = new HashSet<string>();
     list = subs("acccc");
     foreach(var i in list)
     {
         Console.WriteLine(i);
     }
}
public static List<string> subs(string str)
{
    char[] arr = str.ToCharArray();  // 将字符串转为字符数组
    List<string> ans = new List<string>();  // 存储所有子序列
    HashSet<string> set = new HashSet<string>();
    string path = "";  // 当前正在构建的子序列
    process(arr, 0, ans, path);  // 调用递归方法
    foreach(var i in ans)
    {
        set.Add(i);
    }
    return ans;  // 返回所有子序列
}
public static void process(char[] arr, int index, List<string> set, string path)
{
    if (index == arr.Length)  // 递归终止条件：已经遍历完所有字符
    {
        set.Add(path);  // 将当前子序列加入结果集
        return;
    }
    process(arr, index + 1, set, path);  // **不选当前字符**，继续递归
    process(arr, index + 1, set, path + arr[index]);  // **选当前字符**，继续递归
}
```

## 字符串全排列

### 算法执行流程

1. 1.**初始化阶段**：
   - •将输入字符串转换为字符数组 `arr`。
   - •创建空列表 `ans` 存储所有排列结果。
   - •调用递归函数 `process` 开始生成排列。
2. 2.**递归函数 `process`**：
   - •**终止条件**：当 `index` 等于数组长度时，说明已经处理完所有字符，将当前排列（`arr` 的内容）加入结果列表 `set`。
   - •**递归过程**：•从当前 `index` 开始，遍历后续所有字符（`i` 从 `index` 到 `arr.Length - 1`）。•**交换字符**：将 `arr[index]` 和 `arr[i]` 交换位置（固定 `index` 位置的字符）。•**递归调用**：处理下一个位置（`index + 1`）。•**回溯**：恢复字符位置（交换回来），以便尝试其他排列组合。

### 字符串类型

```C#
    static void Main(string[] args)
    {
        // 测试Permute方法
        List<string> list = new List<string>();
        list = Permute("abc");
        
        // 输出所有排列结果
        foreach(var i in list)
        {
            Console.WriteLine(i);
        }
        Console.WriteLine("-----------------------------------------");
    }
    public static List<string> Permute(string str)
    {
        char[] arr = str.ToCharArray();  // 将字符串转为字符数组
        List<string> ans = new List<string>();  // 存储所有排列结果
        process(arr, 0, ans);  // 调用递归方法生成排列
        return ans;
    }
    public static void process(char[] arr, int index, List<string> set)
    {
        // 递归终止条件：当处理到数组末尾时，将当前排列加入结果集
        if(index == arr.Length)  
        {
            set.Add(new string(arr));  // 将字符数组转为字符串并加入结果
            return;
        }
        else
        {
            // 遍历从当前索引开始的所有字符
            for(int i = index; i < arr.Length; i++)
            {
                Swap(arr, index, i);  // 交换当前字符和后续字符
                process(arr, index + 1, set);  // 递归处理下一个位置，一直往后跑。
                Swap(arr, index, i);  // 回溯：恢复交换前的状态
            }
        }
    }
    public static void Swap(char[] arr, int a, int b)
    {
        char temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }
```

### 整型

``` C#
public class Solution {
    public IList<IList<int>> Permute(int[] nums) {
        var ans = new List<IList<int>>();
        if(nums.Length == 0){
            return ans;
        }
        process(nums,0,ans);
        return ans;
    }
    public void process(int[] nums,int index,IList<IList<int>> ans){
        if(index == nums.Length)
        {
            List<int> current = new List<int>(nums);
            ans.Add(current);
            return;
        }else{
            for(int i = index;i < nums.Length;i++){
                Swap(nums,i,index);
                process(nums,index + 1,ans);
                Swap(nums,i,index);
            }
        }
    }
    public void Swap(int[] nums,int i,int j){
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```



## 字符串无重复全排列

同样可以使用HashSet来去重。

```C#
using System;
using System.Collections.Generic;

public class Solution {
    public IList<IList<int>> Permute(int[] nums) {
        var ans = new List<IList<int>>();
        if (nums.Length == 0) return ans;
        
        Process(nums, 0, ans);
        return ans;
    }

    private void Process(int[] nums, int index, List<IList<int>> ans) {
        if (index == nums.Length) {
            ans.Add(new List<int>(nums));
            return;
        }
        
        // 使用HashSet记录当前层已交换过的数字
        var used = new HashSet<int>();
        
        for (int i = index; i < nums.Length; i++) {
            if (!used.Contains(nums[i])) {
                used.Add(nums[i]);
                Swap(nums, i, index);
                Process(nums, index + 1, ans);
                Swap(nums, i, index); // 回溯
            }
        }
    }

    private void Swap(int[] nums, int i, int j) {
        if (i == j) return;
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```

字符串

```C#
    static void Main(string[] args)
    {
        // 测试Permute方法
        List<string> list = new List<string>();
        list = Permute("abc");
        
        // 输出所有排列结果
        foreach(var i in list)
        {
            Console.WriteLine(i);
        }
        Console.WriteLine("-----------------------------------------");
    }
    public static List<string> Permute(string str)
    {
        char[] arr = str.ToCharArray();  // 将字符串转为字符数组
        List<string> ans = new List<string>();  // 存储所有排列结果
        process(arr, 0, ans);  // 调用递归方法生成排列
        return ans;
    }
    public static void process(char[] arr, int index, List<string> set)
    {
        // 递归终止条件：当处理到数组末尾时，将当前排列加入结果集
        if(index == arr.Length)  
        {
            set.Add(new string(arr));  // 将字符数组转为字符串并加入结果
            return;
        }
        else
        {
             bool[] T = new bool[256];
            // 遍历从当前索引开始的所有字符
            for(int i = index; i < arr.Length; i++)
            {
                if(!T[nums[i]]){
                    T[nums[i]] = true;
                    Swap(arr, index, i);  // 交换当前字符和后续字符
                    process(arr, index + 1, set);  // 递归处理下一个位置，一直往后跑。
                    Swap(arr, index, i);  // 回溯：恢复交换前的状态
                }
            }
        }
    }
    public static void Swap(char[] arr, int a, int b)
    {
        char temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }
```

## 栈逆序

在不申请其他数据结构的前提下，将栈逆序

1. **取出栈底元素**（`f`函数）：

   - •递归弹出栈顶元素，直到栈为空时返回最底部的元素。
   - •在递归返回过程中，将非栈底元素重新压回栈中，从而保留栈的原始顺序（仅移除栈底元素）。

2. 2.

   **逆序整个栈**（`Reserve`函数）：

   - •每次递归调用 `f` 获取当前栈的**最底层元素**，然后对剩余栈继续递归逆序。
   - •递归到底层（栈空）后，开始将之前取出的栈底元素依次压回栈顶，最终实现整体逆序。

**本质**：通过递归隐式暂存栈底元素，利用系统调用栈模拟“反向压入”的过程，无需显式辅助栈。时间复杂度为 O(n²)，空间复杂度 O(n)（递归栈深度）。

```C#
public static void Reserve(Stack<int> stack) {
    // 递归终止条件：栈为空时直接返回
    if(stack.Count == 0) return;

    // 关键步骤1：获取当前栈的栈底元素
    // 注意：这个操作会改变栈的结构（移除栈底元素）
    int last = GetBottomElement(stack);

    // 关键步骤2：递归处理剩余栈
    Reserve(stack);

    // 关键步骤3：将之前获取的栈底元素压入栈顶
    // 由于是递归返回时操作，这里实现了逆序效果
    stack.Push(last);
}

public static int GetBottomElement(Stack<int> stack)
{
    // 弹出当前栈顶元素
    int result = stack.Pop();
    
    // 终止条件：如果栈已空，当前元素就是栈底元素
    if(stack.Count == 0)
    {
        return result;
    }
    else
    {
        // 递归获取真正的栈底元素
        int realBottom = GetBottomElement(stack);
        
        // 将非栈底元素重新压回栈中
        // 这样能保持栈的原顺序，只移除栈底元素
        stack.Push(result);
        
        // 返回真正的栈底元素
        return realBottom;
    }
}
```



# 动态规划

动态规划基本步骤

- 找出最优解的性质，并刻划其结构特征(最优子结构性质)
- 递归地定义最优值。
- 以自底向上的方式计算出最优值。
- 根据计算最优值时得到的信息，构造最优解

**例题1：机器人线性走路**

机器人在1到N的直线上移动：

- •在位置1时，只能向右移动到位置2
- •在位置N时，只能向左移动到位置N-1
- •在中间位置i(1 < i < N)时，可以向左移动到i-1或向右移动到i+1

**问题**：从起点S走到终点E有多少种不同的路径？

机器人在一条长度为  N的直线上移动，从起点 Start出发，经过恰好 K 步后到达终点 Aim，求所有可能的路径数。

**1. 问题分析**

- •**机器人的移动规则**：•如果当前在位置 **1**，下一步只能向右走到 **2**。•如果当前在位置 **N**，下一步只能向左走到 **N-1**。•如果当前在中间位置 *i*（1<*i*<*N*），可以向左走到 *i*−1 或向右走到 *i*+1。
- •**目标**：计算从 *St**a**r**t* 出发，**恰好走 \*K\* 步**到达 *A**im* 的所有路径数。

```C#
public static int Ways(int N, int Start, int Aim, int K)
{
    // 初始化dp数组
    int[][] dp = new int[N + 1][];
    for (int i = 0; i <= N; i++)
    {
        dp[i] = new int[K + 1];
        for (int j = 0; j <= K; j++)
        {
            dp[i][j] = -1; // 初始化为-1表示未计算
        }
    }
    return Process(N, Start, Aim, K, dp);
}

public static int Process(int N, int cur, int aim, int rest, int[][] dp)
{
    // 先检查是否已经计算过
    if (dp[cur][rest] != -1)
    {
        return dp[cur][rest];
    }
    
    int ans = 0;
    if (rest == 0)
    {
        ans = (cur == aim) ? 1 : 0;
    }
    else if (cur == 1)
    {
        ans = Process(N, 2, aim, rest - 1, dp);
    }
    else if (cur == N)
    {
        ans = Process(N, N - 1, aim, rest - 1, dp);
    }
    else
    {
        ans = Process(N, cur - 1, aim, rest - 1, dp) + Process(N, cur + 1, aim, rest - 1, dp);
    }
    
    dp[cur][rest] = ans; // 保存计算结果
    return ans;
}
```

**例题2：博弈游戏最优策略**

给定一个整型数组arr，代表数值不同的纸牌拍成一条线，玩家A和玩家B依此拿走每张纸牌，规定玩家A先拿，玩家B后拿，但是每个玩家每次只能拿着最左或最右的纸牌，请返回最后的获胜者的分数

**方法1**：暴力递归：

1. **Win函数**：
   - 主函数，处理边界情况（空数组或null）
   - 计算先手玩家和后手玩家的最佳得分，返回两者中的最大值
2. **f函数（先手函数）**：
   - 表示当前玩家作为先手时能获得的最大分数
   - 基本情况：当L == R时，只有一个数字，直接取走
   - 递归情况：
     - p1：取左边数字 + 作为后手在剩余数组中的得分
     - p2：取右边数字 + 作为后手在剩余数组中的得分
     - 返回两者中的最大值（因为先手会选择对自己最有利的方案）
3. **g函数（后手函数）**：
   - 表示当前玩家作为后手时能获得的分数
   - 基本情况：当L == R时，先手已取走唯一数字，后手得0
   - 递归情况：
     - p1：先手取走左边数字后，自己作为先手在剩余数组中的得分
     - p2：先手取走右边数字后，自己作为先手在剩余数组中的得分
     - 返回两者中的最小值（因为对手会留下对自己最不利的局面）

```C#
public static int Win(int[] arr)
        {
            if(arr == null||arr.Length == 0)
                return 0;
            int first = f(arr, 0, arr.Length - 1);
            int Second = g(arr, 0, arr.Length - 1);
            return Math.Max(first,Second);
        }
        public static int f(int[] arr,int L,int R)
        {
            if(L == R)
                return arr[L];
            int p1 = arr[L] + g(arr,L + 1,R);
            int p2 = arr[R] + g(arr, L, R - 1);
            return Math.Max(p1, p2);  //先手总是选择最大的
        }
        public static int g(int[] arr,int L,int R)
        {
            if (L == R)
                return 0;  //如果只要一个数，先手直接拿完了
            int p1 = f(arr,L + 1,R);
            int p2 = f(arr,L,R - 1);
            return Math.Min(p1, p2);  //留给后手的只能选择L - R中小的值，最开始的左，右两个值总大的被先手选了
        }
```

动态规划：记忆化搜索，添加2个数组用于记录已经出现的数

```C#
public static int Win(int[] arr)
{
    if(arr == null||arr.Length == 0)
        return 0;
    int[][] gmap = new int[arr.Length][];
    int[][] fmap = new int[arr.Length][];
    for(int i = 0; i < arr.Length;i++)
    {
        gmap[i] = new int[arr.Length];
        fmap[i] = new int[arr.Length];
        for (int j = 0; j < arr.Length; j++)
        {
            gmap[i][j] = -1;
            fmap[i][j] = -1;
        }
    }
    int first = f(arr, 0, arr.Length - 1,gmap,fmap);
    int Second = g(arr, 0, arr.Length - 1, gmap, fmap);
    return Math.Max(first,Second);
}
public static int f(int[] arr,int L,int R, int[][] gmap, int[][]fmap)
{
    if (fmap[L][R] != -1)
        return fmap[L][R];
    int ans = 0;

    if(L == R)
    {
        ans =  arr[L];
    }
    else
    {
        int p1 = arr[L] + g(arr, L + 1, R,gmap,fmap);
        int p2 = arr[R] + g(arr, L, R - 1, gmap, fmap);
        ans = Math.Max(p1, p2);  //先手总是选择最大的
    }       
    fmap[L][R] = ans;
    return ans;
}
public static int g(int[] arr,int L,int R, int[][] gmap, int[][] fmap)
{
    if (gmap[L][R] != -1)
        return fmap[L][R];
    int ans = 0;
    if (L == R)
    {
        ans = 0;  //如果只要一个数，先手直接拿完了

    }
    else
    {
        int p1 = f(arr,L + 1,R, gmap, fmap);
        int p2 = f(arr, L, R - 1, gmap, fmap);
        ans = Math.Min(p1, p2);//留给后手的只能选择L - R中小的值，最开始的左，右两个值总大的被先手选了
    }
    gmap[L][R] = ans;
    return ans;
}	
```

**例题3：背包问题**

- 背包容量 `W`
- `N`个物品，每个物品有重量 `w[i]`和价值 `v[i]`
- **目标**：在不超过背包容量的情况下，最大化总价值

```C#
public static int MaxValue(int[] w, int[] v, int bag)
{
    if (w == null || v == null || w.Length != v.Length || bag <= 0)
        return 0;
    return Process(w, v, 0, bag);
}

public static int Process(int[] w, int[] v, int index, int bag)
{
    if (bag < 0)
        return -1;
    if (index == w.Length)
        return 0;

    // 不选当前物品
    int p1 = Process(w, v, index + 1, bag);

    // 选当前物品（如果能选）
    int p2 = 0;
    int next = Process(w, v, index + 1, bag - w[index]);
    if (next != -1)
        p2 = v[index] + next;

    return Math.Max(p1, p2);
}
```

**例题**

给定一个仅包含数字 `'0'-'9'`的字符串 `str`，假设 `'A' = 1, 'B' = 2, ..., 'Z' = 26`，问有多少种方式可以解码这个字符串？

### **示例**

- `"12"`→ `"AB" (1 2)`或 `"L" (12)`→ **2 种**
- `"226"`→ `"BZ" (2 26)`、`"VF" (22 6)`、`"BBF" (2 2 6)`→ **3 种**
- `"06"`→ `"0"`无法解码 → **0 种**

1. **基本情况**：
   - •如果 `index`到达字符串末尾，返回 `1`（表示找到一种解码方式）。
   - •如果当前字符是 `'0'`，返回 `0`（`'0'`不能单独解码）。
2. **递归计算**：
   - •**单字符解码**：`process(str, index + 1)`（当前字符单独解码）。
   - •**双字符解码**：如果 `index + 1`未越界，且 `str[index]`和 `str[index + 1]`组成的数字 `<= 26`，则 `ways += process(str, index + 2)`。

```C#
   public  static int number(string str)
   {
       if(str == null ||str.Length == 0)
           return 0;
       return process(str.ToCharArray(),0);
   }
   public static int process(char[] str,int index)
   {
       if (index == str.Length)
           return 1;
       if (str[index] == '0')
           return 0;
       int ways = process(str, index + 1);
       if (index + 1 < str.Length && (str[index] - '0') * 10 + str[index + 1] - '0' < 27)
           ways += process(str, index + 2);

       return ways;
   }
```

**例题4：**给定一个字符串str，给定一个字符串类型的数组arr，出现的字符都是小写英文arr每一个字符串，代表一张贴纸，你可以把单字

符剪开使用，目的是拼出str来返回需要至少多少张贴纸可以完成这个任务。

例子: str= "babac", arr ={"ba","c","abcd"}至少需要两张贴纸”ba"和"abcd"，因为使用这两张贴纸，把每一个字符单独剪开，含有2个a、2

个b、1个c。是可以拼出str的。所以返回2。



**例题5**：给定一个字符串str，返回这个字符串的最长回文子序列长度

比如:str=“a12b3c43def2ghi1kpm"，最长回文子序列是“1234321”或者“123c321”，返回长度7

```C#

```


