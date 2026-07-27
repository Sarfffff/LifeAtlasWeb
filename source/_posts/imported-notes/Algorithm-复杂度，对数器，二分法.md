---
title: 复杂度，对数器，二分法
date: 2026-06-27 03:23:00
categories:
  - 算法与数据结构
tags:
  - Algorithm
  - 笔记
---
# 复杂度

#### 常数操作

在算法分析中，"常数操作"（constant-time operation）指的是执行时间不随输入规模变化的操作，其时间复杂度为 *O*(1)。以下是关于复杂度和常数操作的详细说明：

#### 常数操作的定义

- **特点**：执行时间固定，与输入数据量无关。
- **示例**：
  - 基本算术运算（如 `a + b`、`x * y`）。
  - 数组通过索引访问（如 `arr[i]`）。
  - 指针解引用或赋值（如 `p = q`）。
  - 简单的比较（如 `if (x < y)`）。
  - 哈希表的插入、查找（假设哈希冲突极少）。

#### 复杂度分析中的常数操作

- **大 O记号**：忽略常数项和低阶项，但实际编程中常数因子可能影响性能。
  - 例如，两个算法均为 *O*(*n*)，但一个的常数操作更少，可能更快。
- **示例对比**：
  - **算法 A**：每次循环执行 2 次常数操作 → 2*n*次操作 → *O*(*n*)。
  - **算法 B**：每次循环执行 5 次常数操作 → 5*n*次操作 → 仍为 *O*(*n*)，但实际更慢。

选择，冒泡，插入都是*O*(*n* * *n*)的时间复杂度，其中插入排序的最好时间复杂度是*O*(*n*)，最差的*O*(*n* * *n*)。

# 对数器

对数器（对数器测试法）是一种用于验证算法正确性的测试方法，通常用于**对比待测算法与暴力解法（或已知正确算法）**，通过**随机生成大量测试数据**来检查两者结果是否一致。它广泛应用于算法竞赛、面试准备和工程开发中，尤其适用于**难以直接证明正确性的算法**。

```C#
class Program
{
    static void Main(string[] args)
    {
        int testTimes = 100000; // 测试次数
        int maxSize = 100;      // 最大数组长度
        int maxValue = 100;     // 最大值范围
        bool success = true;
        Random rnd = new Random();

        for (int i = 0; i < testTimes; i++)
        {
            int[] arr1 = GenerateRandomArray(maxSize, maxValue);
            int[] arr2 = CopyArr(arr1);

            InsertSort1(arr1);  // 你的插入排序实现
            InsertSort2(arr2);  // 对照的正确排序（可以用Array.Sort）

            if (!IsEqual(arr1, arr2))
            {
                success = false;
                Console.WriteLine("出错数据：");
                PrintArray(arr1);
                PrintArray(arr2);
                break;
            }
        }

        Console.WriteLine(success ? "测试通过！" : "测试失败！");
    }

    public static int[] CopyArr(int[] arrs)   
    {
            int N = arrs.Length;
            int[] arrays = new int[N];
            if (N == 0)
            {
                return arrays;
            }

            for(int i = 0;i< N; i++)
            {
                arrays[i] = arrs[i];
            }
            return arrays; 
    }    
    public static int[] generateRandomArray(int maxSize,int maxValue)   
    {
            Random rnd = new Random();
            int[] arrs = new int[(int)rnd.Next(maxSize) + 1];//创建长度在1-maxsize之间随机长度的数组
            for (int i = 0; i < arrs.Length; i++)
            {
                arrs[i] =(int)rnd.Next(maxValue)- (int)rnd.Next(maxValue);

            }
            return arrs;    
    }
    public static void Swap(int[] arr,int i,int j)
    {
        int temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
     public static void InsertSort1(int[] arrs)
     {
         if (arrs == null || arrs.Length < 2)
             return;
         int N = arrs.Length;
         for(int end = 1;end < N; end++)  //从第二个数开始
         {
             int newIndex = end;
             while (newIndex - 1 >=0 && arrs[newIndex - 1] > arrs[newIndex])//条件：左边没有数了 或者 左边的数小于右边的 则不进行循环
             {
                 Swap(arrs,newIndex-1,newIndex);
                 newIndex--;
             }
         }
 }
     public static void InsertSort2(int[] arrs) {
         if (arrs == null || arrs.Length < 2)
             return;
         int N = arrs.Length;
         for (int end = 1;  end < N; end++)
         {
             for (int pre = end - 1;pre >=0&&arrs[pre]>arrs[pre+1];pre--)
             {
                 Swap(arrs,pre, pre+1);
             } 
         }
     }
     public static void PrintArray(int[] arrs) {
         for (int i = 0; i < arrs.Length; i++)
         {
             Console.Write(arrs[i] + " ");
         }
         Console.WriteLine();
     }
}
```



# 二分法

```C#
public static bool isExist(int[] arrs,int num) {
    if (arrs.Length == 0 || arrs == null)
        return false;

    int R = arrs.Length - 1;
    int L = 0;
    int mid = 0;
    while (L <= R)
    {
        mid = L + ((R - L) >> 1);
        if(arrs[mid] == num)
            return true;
        else if(arrs[mid] < num)
            L = mid + 1;
        else
            R = mid -1;
    }
    return false;
}
public static int nearestIndex (int[] arrs,int num)
{
    //在arr上找满足 >= value的最左位置
    int R = arrs.Length - 1;
    int L = 0;
    int index = -1;
    while (L <= R)
    {
        int mid = L + ((R - L) << 1);
        if (arrs[mid] >= num)
        {
            index = mid;
            R = mid -1;
        }
        else
            L = mid +1;
    }
    return index;
}
//局部最小值问题
```

