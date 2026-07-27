---
title: 堆和堆排序
date: 2026-06-27 03:22:00
categories:
  - 算法与数据结构
tags:
  - Algorithm
  - 笔记
---
# 比较器

在 C# 中，比较器用于定义对象的排序规则。主要有以下几种实现方式：

### 1. IComparable 接口

实现 `IComparable` 接口可以让对象自身具有比较能力：

```C#
public class Person : IComparable<Person>
{
    public string Name { get; set; }
    public int Age { get; set; }
    
    public int CompareTo(Person other)
    {
        if (other == null) return 1;
        
        // 先按年龄比较
        int ageComparison = Age.CompareTo(other.Age);
        if (ageComparison != 0) return ageComparison;
        
        // 年龄相同再按姓名比较
        return string.Compare(Name, other.Name, StringComparison.Ordinal);
    }
}
```

### 2. IComparer 接口

实现 `IComparer` 接口可以创建独立的外部比较器：

```C#
public class PersonAgeComparer : IComparer<Person>
{
    public int Compare(Person x, Person y)
    {
        if (x == null && y == null) return 0;
        if (x == null) return -1;
        if (y == null) return 1;
        
        return x.Age.CompareTo(y.Age);
    }
}

// 使用
var people = new List<Person>();
people.Sort(new PersonAgeComparer());
```

### 3. Comparison 委托

使用委托方式实现比较：

```
Comparison<Person> comparison = (x, y) => 
    string.Compare(x.Name, y.Name, StringComparison.Ordinal);

var people = new List<Person>();
people.Sort(comparison);
```

### 4. LINQ 排序

使用 LINQ 的 `OrderBy`、`ThenBy` 等方法：

```C#
var sortedPeople = people
    .OrderBy(p => p.Age)#
    .ThenBy(p => p.Name)
    .ToList();
```

### 5. 默认比较器

.NET 提供了一些内置比较器：

```C#
// 字符串比较器（忽略大小写）
var comparer = StringComparer.OrdinalIgnoreCase;
var result = comparer.Compare("Apple", "apple"); // 返回 0

// 创建反向比较器
var reverseComparer = Comparer<int>.Default.Reverse();
```

### 注意事项

1. 比较器应遵循以下规则：
   - x.CompareTo(y) == -y.CompareTo(x)
   - 如果 x.CompareTo(y) > 0 且 y.CompareTo(z) > 0，则 x.CompareTo(z) > 0
   - x.CompareTo(y) == 0 时，x.CompareTo(z) 应与 y.CompareTo(z) 结果相同
2. 对于复杂排序，考虑使用 `ThenBy` 或实现多级比较逻辑
3. 处理 null 值时应保持一致，通常 null 被视为小于任何非 null 值

# 堆结构

堆是一种特殊的完全二叉树数据结构，具有以下性质：

## 堆的性质

1. **完全二叉树性质**：堆是一棵完全二叉树（除最后一层外，其他层节点都填满，最后一层从左到右填充）
2. **堆序性质**：
   - **最大堆**：每个节点的值都大于或等于其子节点的值（根节点最大）
   - **最小堆**：每个节点的值都小于或等于其子节点的值（根节点最小）

在.NET 6.0中使用优先队列*PriorityQueue*默认实现小根堆，将传入的数据参数按照小根堆的形式进行存储。如果想以大根堆的形式进行存储，通过自定义比较器来进行比较。

**PriorityQueue方法签名**：

```C#
PriorityQueue<string,int> Heap = new PriorityQueue<string,int>();
/*
第一个泛型参数为TElement（第一个参数）
表示队列中存储的实际元素类型
这是你想要管理的内容（如任务、消息、节点等）
示例：string、Task、GraphNode

TPriority（第二个参数）
表示元素的优先级类型
用于确定元素的出队顺序
必须是可比较的类型（如int、double、DateTime或实现IComparable的自定义类型）   
*/
```

大根堆的实现，同时也是堆排序

```C#
public class MyCompare : IComparer<int>
{
    public int Compare(int x, int y)
    {
        return y.CompareTo(x);
    }
}
class Program
    {    
     static void Main()
     {
        int[] array = { 12, 5, 20, 3, 8, 15 };
        PriorityQueue<int,int> Heap = new PriorityQueue<int,int>(new MyCompare());
        foreach(var i  in array)
        {
            Heap.Enqueue(element:i, priority:i);
        }
               
        while (Heap.Count > 0)
        {
            Console.WriteLine(Heap.Dequeue()); // 输出 20, 15, 12, 8, 5, 3
        }

    }
   
}

```

# 堆排序

## 手写原地堆排序

```C#
static void Main()
    {
        int[] array = { 12, 5, 20, 3, 8, 15 };
    O(n * logN)   一个一个的数给你 
    for (int i = 0; i < array.Length; i++)
        {
            HeapInsert(array, i);
        }
    O(N)  一次性数给你
    	for(int i = array.Length- 1;i >= 0;i--){
            HeapIfy(array,i,array.Length);
        }
        int HeapSize = array.Length;
        Swap(array, 0, --HeapSize);
        while (HeapSize > 0)
        {
            Heapify(array, 0, HeapSize);
            Swap(array, 0, --HeapSize);
        }

    }
/**
 * 向最大堆中插入元素，并调整堆结构（从下往上调整）
 * @param arr 堆数组
 * @param index 当前插入的节点索引
 */
public static void HeapInsert(int[] arr, int index) {
    // 循环条件：当前节点值 > 父节点值（违反最大堆性质）
    while (arr[index] > arr[(index - 1) / 2]) {
        // 交换当前节点与父节点
        Swap(arr, index, (index - 1) / 2);
        // 更新当前节点索引为父节点索引，继续向上比较
        index = (index - 1) / 2;
    }
}

/**
 * 调整堆结构（从上往下调整），确保以 index 为根的子树满足最大堆性质
 * @param arr 堆数组
 * @param index 当前需要调整的节点索引
 * @param heapSize 堆的有效大小（可能部分数组未参与堆结构）
 */
public static void Heapify(int[] arr, int index, int heapSize) {
    int left = 2 * index + 1; // 左孩子索引
    // 循环条件：左孩子存在（即当前节点不是叶子节点）
    while (left < heapSize) {
        // 选择左右孩子中较大的一个
        int largestIndex = (left + 1 < heapSize) && (arr[left] < arr[left + 1]) 
                          ? left + 1  // 右孩子存在且更大
                          : left;     // 否则选左孩子
        
        // 比较当前节点与较大孩子节点的值
        largestIndex = (arr[index] > arr[largestIndex]) 
                      ? index         // 当前节点已经是最大的，无需调整
                      : largestIndex; // 否则选择较大的孩子节点
        
        // 如果当前节点比两个孩子都大，调整结束
        if (index == largestIndex) {
            break;
        }
        
        // 交换当前节点与较大的孩子节点
        Swap(arr, largestIndex, index);
        // 更新当前节点索引为交换的孩子节点，继续向下调整
        index = largestIndex;
        left = 2 * index + 1; // 重新计算左孩子索引
    }
}
public static void Swap(int[] arr, int i, int j)
   {
       int temp = arr[j];
       arr[j] = arr[i];
       arr[i] = temp;
   }
```

## 优先队列堆排序

```C#
public class MyCompare : IComparer<int>
{
    public int Compare(int x, int y)
    {
        return y.CompareTo(x);
    }
}
class Program
    {    
     static void Main()
     {
        int[] array = { 12, 5, 20, 3, 8, 15 };
        PriorityQueue<int,int> Heap = new PriorityQueue<int,int>(new MyCompare());
        foreach(var i  in array)
        {
            Heap.Enqueue(element:i, priority:i);
        }
               
        while (Heap.Count > 0)
        {
            Console.WriteLine(Heap.Dequeue()); // 输出 20, 15, 12, 8, 5, 3
        }

    }
   
}

```

|    特性    |     手动堆排序     |   PriorityQueue    |
| :--------: | :----------------: | :----------------: |
|  实现方式  | 手动实现所有堆操作 |   使用.NET内置类   |
|  排序方向  |   直接实现大根堆   |   通过比较器控制   |
|  内存使用  |      原地排序      |    需要额外空间    |
| 代码复杂度 |        较高        |        较低        |
|   灵活性   |      修改困难      | 易于调整优先级逻辑 |
|  适用场景  |   需要原地排序时   | 需要优先队列功能时 |

![image-20250718172310296](/notes-assets/Algorithm/assets/image-20250718172310296.png)

使用字典以及优先队列进行堆排序

```C#
  public int[] TopKFrequent(int[] nums, int k)
  {
      int[] result = new int[k];
      Dictionary<int, int> Dic = new Dictionary<int, int>();
      PriorityQueue<int, int> Heap = new PriorityQueue<int, int>();
      foreach (int num in nums)
      {
          if (Dic.ContainsKey(num))
          {
              Dic[num]++;
          }
          else
          {
              Dic.Add(num, 1);
          }
      }
      foreach (var pair in Dic) {
          int value = pair.Value;
          int keys = pair.Key;
          Heap.Enqueue(keys,value);
          
          if(Heap.Count > k)
          {
              Heap.Dequeue();
          }
      }
      for (int i = k - 1; i >= 0; i++)
      {
          result[i] = Heap.Dequeue();
      }
      return result;
  }
```

![image-20250718175618307](/notes-assets/Algorithm/assets/image-20250718175618307.png)

```C#
public class Solution {
    public int FindKthLargest1(int[] nums, int k) {
        PriorityQueue<int,int> heap = new PriorityQueue<int,int>();
        foreach(var num in nums)
        {
            heap.Enqueue(num,num);
            if(heap.Count > k) 
                heap.Dequeue();
        }
        int result = heap.Dequeue();
        
        return result;
    }
    public int FindKthLargest(int[] nums, int k) {
        Array.Sort(nums);
        return nums[nums.Length - k];
    }
}
```

# 加强堆

最大线段重合问题（用堆的实现）

给定很多线段，每个线段都有两个数[start，end]，表示线段开始位置和结束位置，左右都是闭区间

规定：

- 线段的开始和结束位置一定都是整数值
-  线段重合区域的长度必须>=1
- 返回线段最多重合区域中，包含了几条线段

![image-20250720161807297](/notes-assets/Algorithm/assets/image-20250720161807297.png)

1. **按起点排序**（保证按时间顺序处理）。

2. 维护最小堆

   （存线段的结束时间）：

   - 堆顶是最早结束的线段。
   - 如果当前线段的起点 ≥ 堆顶的结束时间 → 弹出堆顶（该线段已结束）。

3. **加入当前线段的结束时间到堆**，此时堆的大小就是当前的重叠数。

4. **全程记录堆的最大大小**，即为答案。

![image-20250924091558478](/notes-assets/Algorithm/assets/image-20250924091558478.png)

```C#
    public static int Solve(int[][] arrs)
    {
        // 1. 将输入转换为Line数组，并按起点排序
        Line[] lines = new Line[arrs.Length];
        for (int i = 0; i < arrs.Length; i++)
        {
            lines[i] = new Line(arrs[i][0], arrs[i][1]);
        }
        Array.Sort(lines, (a, b) => a.Start.CompareTo(b.Start));
        // 2. 使用最小堆跟踪最早的结束时间
        PriorityQueue<int, int> heap = new PriorityQueue<int, int>();
        int maxOverlap = 0;
        foreach (Line line in lines)
        {
            // 移除所有已结束的线段（堆顶结束时间 <= 当前线段的起点）
            while (heap.Count > 0 && heap.Peek() <= line.Start)
            {
                heap.Dequeue();
            }
            // 将当前线段的结束时间加入堆
            heap.Enqueue(line.End, line.End);

            // 更新最大重叠数
            maxOverlap = Math.Max(maxOverlap, heap.Count);
        }
        return maxOverlap;
    }
}
class Line
{
    public int Start;
    public int End;
    public Line(int start, int end)
    {
        Start = start;
        End = end;
    }
}
```

```C#
class Pos{
    public int Start;
    public int End;
    public Pos(int s,int e){
        this.Start = s;
        this.End = e;
    }
}
public class Solution {
    public int[][] Merge(int[][] intervals) {
        if (intervals == null || intervals.Length == 0)
            return new int[0][];
        Pos[] arr = new Pos[intervals.Length];
        for(int i = 0;i < intervals.Length;i++){
            arr[i] = new Pos(intervals[i][0],intervals[i][1]);
        }
        List<int[]> ans = new List<int[]>();    
        Array.Sort(arr, (a, b) => a.Start.CompareTo(b.Start));
        int curStart = arr[0].Start;
        int curEnd = arr[0].End;

        foreach(var pos in arr){
            if(pos.Start <= curEnd){
                curEnd = Math.Max(pos.End,curEnd);
            }
            else{
                ans.Add(new int[]{curStart,curEnd});
                curStart = pos.Start;
                curEnd = pos.End;
            }
        }
        ans.Add(new int[]{curStart,curEnd});
        return ans.ToArray();
    }
}
```

**加强堆**

```C#
using System;
using System.Collections.Generic;

public class EnhancedHeap<T> where T : IComparable<T>
{
    private List<T> heap; // 堆存储结构
    private Dictionary<T, int> indexMap; // 元素到索引的映射
    
    public int Count => heap.Count;
    public bool IsEmpty => Count == 0;

    public EnhancedHeap()
    {
        heap = new List<T>();
        indexMap = new Dictionary<T, int>();
    }

    // 添加元素到堆
    public void Push(T item)
    {
        if (indexMap.ContainsKey(item))
        {
            throw new ArgumentException("堆中不允许重复元素");
        }
        
        heap.Add(item);
        indexMap[item] = heap.Count - 1;
        HeapInsert(heap.Count - 1);
    }

    // 移除并返回堆顶元素
    public T Pop()
    {
        if (IsEmpty)
        {
            throw new InvalidOperationException("堆为空");
        }

        T top = heap[0];
        Remove(top);
        return top;
    }

    // 查看堆顶元素但不移除
    public T Peek()
    {
        if (IsEmpty)
        {
            throw new InvalidOperationException("堆为空");
        }
        return heap[0];
    }

    // 更新堆中元素
    public void Update(T oldItem, T newItem)
    {
        if (!indexMap.TryGetValue(oldItem, out int index))
        {
            throw new ArgumentException("元素不在堆中");
        }
        
        heap[index] = newItem;
        indexMap.Remove(oldItem);
        indexMap[newItem] = index;
        
        int cmp = newItem.CompareTo(oldItem);
        if (cmp < 0)
            HeapInsert(index);
        else if (cmp > 0)
            Heapify(index);
    }

    // 从堆中移除指定元素
    public void Remove(T item)
    {
        if (!indexMap.TryGetValue(item, out int index))
        {
            return;
        }
        
        Swap(index, heap.Count - 1);//将想删掉的数的索引与最后进行掉换，在进行上浮或下沉操作
        heap.RemoveAt(heap.Count - 1);
        indexMap.Remove(item);
        
        if (index < heap.Count)
        {
            HeapInsert(index);
            Heapify(index);
        }
    }

    // 上浮操作
    private void HeapInsert(int index)
    {
        while (index > 0 && heap[index].CompareTo(heap[(index - 1) / 2]) < 0)
        {
            int parent = (index - 1) / 2;
            Swap(index, parent);
            index = parent;
        }
    }

    // 下沉操作
    private void Heapify(int index)
    {
        int left = 2 * index + 1;
        while (left < heap.Count)
        {
            // 找出左右子节点中较小的（最小堆）
            int smallest = left;
            if (left + 1 < heap.Count && heap[left + 1].CompareTo(heap[left]) < 0)
            {
                smallest = left + 1;
            }

            // 如果当前节点已经小于等于子节点，则停止
            if (heap[index].CompareTo(heap[smallest]) <= 0)
            {
                break;
            }

            Swap(index, smallest);
            index = smallest;
            left = 2 * index + 1;
        }
    }

    // 交换元素并更新索引映射
    private void Swap(int i, int j)
    {
        if (i == j) return;
        
        (heap[i], heap[j]) = (heap[j], heap[i]);
        indexMap[heap[i]] = i;
        indexMap[heap[j]] = j;
    }
}
```

# 加强堆例题1

![image-20250720190312291](/notes-assets/Algorithm/assets/image-20250720190312291.png)

![image-20250720195415182](/notes-assets/Algorithm/assets/image-20250720195415182.png)

```C#
public class Program
    {
        public static void Main(string[] args)
        {
            int[] arr = { 3, 3, 1, 2, 1, 2, 5 };
            bool[] op = { true, true, true, true, false, true, false };
            int k = 2;

            var result = topK(arr, op, k);
            foreach (var list in result)
            {
                Console.WriteLine(string.Join(", ", list));
            }
        }
     public static List<List<int>> topK(int[] arr, bool[] op,int k)
     {
         List<List<int>> ans = new List<List<int>>();
         WhosPrize who = new WhosPrize(k);
         for (int i = 0; i < arr.Length; i++)
         {
             who.Operator(i, arr[i], op[i]);
             //ans.Add();//得到获奖列表
         }
         return ans;
     }

    }

class Customer:IComparable<Customer>
{
    public int id;
    public int buy;
    public int enterTime;
    public Customer(int v,int b,int o)
    {
        id = v;
        buy = b;
        enterTime = o;
    }

    public int CompareTo(Customer? other)
    {
        if (other == null) return 1;

        // 首先按购买量降序排列
        if (this.buy != other.buy)
        {
            return other.buy.CompareTo(this.buy); // 降序
        }

        // 如果购买量相同，则按进入时间升序排列
        return this.enterTime.CompareTo(other.enterTime);
    }
}
class WhosPrize {
    private Dictionary<int, Customer> customers;
    private EnhancedHeap<Customer> candHeap;
    private EnhancedHeap<Customer> prizeHeap;
    private int Limit;   //Top K
    public WhosPrize(int Limit)
    {
        customers = new Dictionary<int, Customer>();
        candHeap = new EnhancedHeap<Customer>();
        prizeHeap = new EnhancedHeap<Customer>();
        this.Limit = Limit;
    }
    public void Operator(int Time,int id,bool buyOrRefund)
    {
        //如果没有这个用户并且没有买东西，直接return
        if(!buyOrRefund&&!customers.ContainsKey(id))
            return;


        /*3种情况：
         * 用户购买数为0，并且退货了
         * 用户购买数>0，买了东西
         * 用户购买数>0，退了东西
         
         */
        if (!customers.ContainsKey(id))
        {
            customers.Add(id,new Customer(id,0,0));
        }
        Customer c = customers[id];

        //如果用户购买则++
        if (buyOrRefund)
            c.buy++;
        else
            c.buy--;

        //没有购买，直接删除
        if(c.buy == 0)
            customers.Remove(id);
    
        if(!candHeap.Contains(c) && !prizeHeap.Contains(c))//得奖区和候补区都不含有c用户
        {
            if(prizeHeap.Count < Limit)  //如果得奖区未满，直接填入，否者直接填入候补区
            {
                c.enterTime = Time;
                prizeHeap.Push(c);
            }
            else
            {
                c.enterTime = Time;
                candHeap.Push(c);   
            }
        }
        else if (candHeap.Contains(c))//c不在得奖区，在候补区
        {
            if(c.buy == 0)
                customers.Remove(id) ;
            else
            {
                candHeap.Push(c);//压入，自动排序
            }
        }
        else  //在得奖区，不在候补区
        {
            if (c.buy == 0)
                customers.Remove(id);
            else
            {
                prizeHeap.Push(c) ;
            }
        }

        //保证得奖区有k个元素
        MaintainHeap(Time);
    }

    private void MaintainHeap(int Time)
    {
        if (prizeHeap.IsEmpty)
            return;
        if (prizeHeap.Count < Limit)
        {
            //从候选区弹出一个元素存入得奖区
            Customer c = candHeap.Pop();
            c.enterTime = Time;
            prizeHeap.Push(c);
        }
        else
        {
            if(candHeap.Peek().buy> prizeHeap.Peek().buy)
            {
                Customer cand = candHeap.Pop();
                Customer prize = prizeHeap.Pop();
                cand.enterTime = Time;
                prize.enterTime = Time;
                prizeHeap.Push(cand);
                candHeap.Push(prize);

            }
        }
    }
    private List<int> Return()
    {

        List<Customer> Temp = new List<Customer>();  //临时存储列表值，最后重新压入
        List<int> result = new List<int>();
        while(prizeHeap.Count > 0 && result.Count < Limit)
        {
            Customer c = prizeHeap.Pop();
            Temp.Add(c);
            result.Add(c.id);
        }
        foreach(var i in  Temp)
        {
            prizeHeap.Push(i);
        }
        return result;
    }

}
 class EnhancedHeap<T> where T : IComparable<T>
{
    private List<T> heap; // 堆存储结构
    private Dictionary<T, int> indexMap; // 元素到索引的映射

    public int Count => heap.Count;
    public bool IsEmpty => Count == 0;

    public EnhancedHeap()
    {
        heap = new List<T>();
        indexMap = new Dictionary<T, int>();
    }

    // 添加元素到堆
    public void Push(T item)
    {
        if (indexMap.ContainsKey(item))
        {
            throw new ArgumentException("堆中不允许重复元素");
        }

        heap.Add(item);
        indexMap[item] = heap.Count - 1;
        HeapInsert(heap.Count - 1);
    }

    // 移除并返回堆顶元素
    public T Pop()
    {
        if (IsEmpty)
        {
            throw new InvalidOperationException("堆为空");
        }

        T top = heap[0];
        Remove(top);
        return top;
    }

    // 查看堆顶元素但不移除
    public T Peek()
    {
        if (IsEmpty)
        {
            throw new InvalidOperationException("堆为空");
        }
        return heap[0];
    }

    // 更新堆中元素
    public void Update(T oldItem, T newItem)
    {
        if (!indexMap.TryGetValue(oldItem, out int index))
        {
            throw new ArgumentException("元素不在堆中");
        }

        heap[index] = newItem;
        indexMap.Remove(oldItem);
        indexMap[newItem] = index;

        int cmp = newItem.CompareTo(oldItem);
        if (cmp < 0)
            HeapInsert(index);
        else if (cmp > 0)
            Heapify(index);
    }

    // 从堆中移除指定元素
    public void Remove(T item)
    {
        if (!indexMap.TryGetValue(item, out int index))
        {
            return;
        }

        Swap(index, heap.Count - 1);//将想删掉的数的索引与最后进行掉换，在进行上浮或下沉操作
        heap.RemoveAt(heap.Count - 1);
        indexMap.Remove(item);

        if (index < heap.Count)
        {
            HeapInsert(index);
            Heapify(index);
        }
    }

    // 上浮操作
    private void HeapInsert(int index)
    {
        while (index > 0 && heap[index].CompareTo(heap[(index - 1) / 2]) < 0)
        {
            int parent = (index - 1) / 2;
            Swap(index, parent);
            index = parent;
        }
    }

    // 下沉操作
    private void Heapify(int index)
    {
        int left = 2 * index + 1;
        while (left < heap.Count)
        {
            // 找出左右子节点中较小的（最小堆）
            int smallest = left;
            if (left + 1 < heap.Count && heap[left + 1].CompareTo(heap[left]) < 0)
            {
                smallest = left + 1;
            }

            // 如果当前节点已经小于等于子节点，则停止
            if (heap[index].CompareTo(heap[smallest]) <= 0)
            {
                break;
            }

            Swap(index, smallest);
            index = smallest;
            left = 2 * index + 1;
        }
    
    }
    public bool Contains(T item)
    {
        return indexMap.ContainsKey(item);
    }
    // 交换元素并更新索引映射
    private void Swap(int i, int j)
    {
        if (i == j) return;

        (heap[i], heap[j]) = (heap[j], heap[i]);
        indexMap[heap[i]] = i;
        indexMap[heap[j]] = j;
    }
}
```


