---
title: 简单排序
date: 2026-06-27 03:27:00
categories:
  - 算法与数据结构
tags:
  - Algorithm
  - 笔记
---
前几种时间复杂度为*O*(*n* * *n*)的排序

# 选择排序

![img](/notes-assets/Algorithm/assets/54709e71700c449795a16c2d7236a6c3.gif)

```C#
public static void SeletSort(int[] arr){
     if (arrs == null || arrs.Length < 2)
     return;
	for(int i = 0; i < arr.Length;i++){
        int newIndex = i;
        for(int j = i+1;j<arr.Length;j++){
			newIndex = arr[j] < arr[newIndex] ? j:newIndex;
        }
        Swap(arr,i,newIndex);
    }
}
  public static void Swap(int[] arr, int i, int j)
  {
      int temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
  }
  public static void PrintArray(int[] arrs)
  {
      for (int i = 0; i < arrs.Length; i++)
      {
          Console.Write(arrs[i] + " ");
      }
      Console.WriteLine();
  }
```

# 冒泡排序

![img](/notes-assets/Algorithm/assets/dbdb6dc94b4a4fbd9cd25110665d485a.gif)

```C#
public static void PubbleSort(int[] arrs)
 {
     if (arrs == null || arrs.Length < 2)
         return;
     int N = arrs.Length;
     for (int end = N - 1; end >= 0; end--)
     {
         for (int i = 1; i <= end; i++)
         {
             if (arrs[i - 1] > arrs[i])
             {
                 Swap(arrs, i - 1, i);
             }
         }
     }

 }
  public static void Swap(int[] arr, int i, int j)
  {
      int temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
  }
  public static void PrintArray(int[] arrs)
  {
      for (int i = 0; i < arrs.Length; i++)
      {
          Console.Write(arrs[i] + " ");
      }
      Console.WriteLine();
  }
```

# 插入排序

![img](/notes-assets/Algorithm/assets/6f8f7516a5cb4216a39efe51e4b3e1da.gif)

```C#
public static void InsertSort1(int[] arrs){
    if (arrs == null || arrs.Length < 2)
    	return;
    int N = arrs.Length;
	for(int i = 1;i < N;i++){
        for(int j = i -1; j >=0&&arrs[j] > arrs[j+1];j--)
             Swap(arrs, j, j + 1);
    }
}
  public static void InsertSort1(int[] arrs)
  {
      if (arrs == null || arrs.Length < 2)
          return;
      int N = arrs.Length;
      for (int end = 1; end < N; end++)  //从第二个数开始
      {
          int newIndex = end;
          while (newIndex - 1 >= 0 && arrs[newIndex - 1] > arrs[newIndex])//条件：左边没有数了 或者 左边的数小于右边的 则不进行循环
          {
              Swap(arrs, newIndex - 1, newIndex);
              newIndex--;
          }
      }
  }


public static void Swap(int[] arr, int i, int j)
  {
      int temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
  }
  
public static void PrintArray(int[] arrs)
  {
      for (int i = 0; i < arrs.Length; i++)
      {
          Console.Write(arrs[i] + " ");
      }
      Console.WriteLine();
  }
```

# 快速排序

荷兰国旗问题：是将一个包含 **0、1、2** 三种元素的数组，按照 **0、1、2** 的顺序进行排序（类似于荷兰国旗的三色排序）。

给定一个数组 `nums`，其中只包含 `0`、`1`、`2`，要求在不使用排序函数的情况下，**原地（in-place）** 将它们排序，使得所有 `0`在前，`1`在中间，`2`在后。

```C#
/// <summary>
/// 对数组进行分区，返回等于基准值的区间范围
/// </summary>
/// <param name="arrs">待分区的数组</param>
/// <param name="L">分区的左边界</param>
/// <param name="R">分区的右边界（同时也是基准值的索引）</param>
/// <returns>等于基准值的区间的起始和结束索引</returns>
public static int[] nearestFlag(int[] arrs, int L, int R)
{
    // 边界检查
    if (L > R)
    {
        return new int[] { -1, -1 }; // 无效区间
    }
    if (L == R)
    {
        return new int[] { L, R };   // 只有一个元素，直接返回
    }

    int less = L - 1;  // 左区域边界（小于基准值的最后一个元素的索引）
    int more = R;      // 右区域边界（大于基准值的第一个元素的索引）
    int index = L;     // 当前遍历的索引

    while (index < more) // 遍历直到当前索引碰到右边界
    {
        if (arrs[index] == arrs[R])
        {
            index++;  // 当前值等于基准值，跳过
        }
        else if (arrs[index] > arrs[R])
        {
            Swap(arrs, index, --more); // 当前值大于基准值，交换到右区域
        }
        else if (arrs[index] < arrs[R])
        {
            Swap(arrs, index++, ++less); // 当前值小于基准值，交换到左区域
        }
    }

    // 将基准值交换到正确的位置（等于区的第一个位置）
    Swap(arrs, more, R);

    // 返回等于基准值的区间范围
    return new int[] { less + 1, more };
}

public static void Swap(int[] arr, int i, int j)
{
    int temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
}
```

![image-20250716183123258](/notes-assets/Algorithm/assets/image-20250716183123258.png)



### 随机快速排序（递归）

使用随机数作为快速排序的基准值，遍历整个数组与基准值进行比较，小于的放在左侧，大于放在右侧。在第一次遍历后，分为了3个区间，小于区间，等于区间，大于区间。分别在大于以及小于区间进行同样的次数，直至数组有序。

![img](/notes-assets/Algorithm/assets/efb99a80f078458f899106186d3b9e57.gif)



首先

```C#
    public static void nearestFlag(int[] arrs, int L, int R)
    {
        if (L >= R)
        return;
        
    // 随机选择基准值并交换到末尾
    int privotIndex = new Random().Next(L, R + 1);
    Swap(arrs, privotIndex, R);
    int pivot = arrs[R];

    int less = L - 1;    // 小于区右边界 
    int more = R;        // 大于区左边界
    int index = L;
    
    // 分区过程
    while (index < more)
    {
        if (arrs[index] < pivot)
            Swap(arrs, ++less, index++);
        else if (arrs[index] > pivot)
            Swap(arrs, --more, index);
        else
            index++;
    }
    
    // 将基准值放到正确位置
    Swap(arrs, more, R);

    // 递归处理小于区和大于区
    nearestFlag(arrs, L, less);
    nearestFlag(arrs, more + 1, R);
    }
    public static void Swap(int[] arr, int i, int j)
    {
        int temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
```

 

