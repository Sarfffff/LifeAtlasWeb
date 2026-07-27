---
title: 归并排序
date: 2026-06-27 03:26:00
categories:
  - 算法与数据结构
tags:
  - Algorithm
  - 笔记
---
# 迭代归并排序

```C#
public void Sort(int[] arrs, int L, int R) {
    int step = 1;
    int N = arrs.length;
    while (step < N) {
        int left = 0;
        while (left < N) {
            int mid = left + step - 1;
            if (mid >= N)
                break;
            int right = Math.min(left + 2 * step - 1, N - 1); // 修正右边界计算
            Merge(arrs, left, mid, right); // 修正方法调用参数
            left = right + 1;
        }
        step <<= 1; 
    }
}

public void Merge(int[] arrs, int L, int mid, int R) {
    int[] help = new int[R - L + 1];
    int i = 0;
    int p1 = L;
    int p2 = mid + 1; 
    while (p1 <= mid && p2 <= R) {
        help[i++] = arrs[p1] <= arrs[p2] ? arrs[p1++] : arrs[p2++];
    }
    // p2越界
    while (p1 <= mid) {
        help[i++] = arrs[p1++];
    }
    // p1越界
    while (p2 <= R) {
        help[i++] = arrs[p2++];
    }
    for (int j = 0; j < help.Length; j++)
        arrs[L + j] = help[j]; 
}
```

# 递归归并排序

```C#
public void Sort(int[] arrs, int L, int R) {
   if(L == R)
       return ;
    int Mid = L + ((R - L )>>1);
    Sort(arrs,L,Mid);
    Sort(arrs,Mid + 1,R);
    Merge(arrs,L,Mid,R);
}

public void Merge(int[] arrs, int L, int mid, int R) {
    int[] help = new int[R - L + 1];
    int i = 0;
    int p1 = L;
    int p2 = mid + 1; 
    while (p1 <= mid && p2 <= R) {
        help[i++] = arrs[p1] <= arrs[p2] ? arrs[p1++] : arrs[p2++];
    }
    // p2越界
    while (p1 <= mid) {
        help[i++] = arrs[p1++];
    }
    // p1越界
    while (p2 <= R) {
        help[i++] = arrs[p2++];
    }
    for (int j = 0; j < help.Length; j++)
        arrs[L + j] = help[j]; 
}
```

# 求解小和问题

在一个数组中，每一个数左边比当前数小的数的和累加起来，叫做这个数组的小和。例如，数组`[1,3,4,2,5]`的小和为`0+1+1+3+1+3+4+2=17`。

在归并排序的**合并阶段**，我们需要将两个**有序子数组**合并成一个有序数组。关键观察点是：

- **左子数组**和**右子数组**内部已经是有序的

- 如果左子数组的某个元素`arr[p1]`小于右子数组的某个元素`arr[p2]`那么：

  - `arr[p1]` 必然小于**右子数组中从`p2`开始到末尾的所有元素  **

  ```C#
  result += arr[p1] < arr[p2] ? (R - p2 + 1) * arr[p1] : 0;
  ```

  - 因此，`arr[p1]` 对**右子数组中从`p2`开始的每个元素**都贡献了一个小和

```C#
 public int Process(int[] arr, int L, int R)
    {
        if (L == R)
        {
            return 0;
        }
        int mid = L + ((R - L) >> 1);
        return Process(arr, L, mid) + Process(arr, mid + 1, R) + MergeSort(arr, L, mid, R);
    }

    public int MergeSort(int[] arr, int L, int mid, int R)
    {
        int result = 0;
        int[] help = new int[R - L + 1];
        int i = 0;
        int p1 = L;
        int p2 = mid + 1;

        while (p1 <= mid && p2 <= R)
        {
            result += arr[p1] < arr[p2] ? (R - p2 + 1) * arr[p1] : 0;
            help[i++] = arr[p1] < arr[p2] ? arr[p1++] : arr[p2++];
        }

        while (p1 <= mid)
        {
            help[i++] = arr[p1++];
        }

        while (p2 <= R)
        {
            help[i++] = arr[p2++];
        }

        for (int j = 0; j < help.Length; j++)
        {
            arr[L + j] = help[j];
        }

        return result;
    }
```

# 求解逆序对

1. **分治拆分**：将数组不断二分，直到子数组长度为1
2. **归并统计**：在合并两个有序子数组时：
   - 当左半元素 > 右半元素时，左半剩余所有元素都与当前右半元素构成逆序对
   - 统计数量公式：`逆序对数 += mid - p1 + 1`
3. **排序合并**：正常归并排序的合并操作，保证后续统计的正确性

```C#
 public int Process(int[] arr, int L, int R)
    {
        if (L >= R)
        {
            return 0;
        }
        int mid = L + ((R - L) >> 1);
        return Process(arr, L, mid) + Process(arr, mid + 1, R) + MergeAndCount(arr, L, mid, R);
    }

    public int MergeAndCount(int[] arr, int L, int mid, int R)
    {
        int inversionCount  = 0;
        int[] help = new int[R - L + 1];
        int i = 0;
        int p1 = L;
        int p2 = mid + 1;

        while (p1 <= mid && p2 <= R)
        {
            inversionCount  += arr[p1] < arr[p2] ? 0: (mid - p1 + 1);
            help[i++] = arr[p1] < arr[p2] ? arr[p1++] : arr[p2++];
        }

        while (p1 <= mid)
        {
            help[i++] = arr[p1++];
        }

        while (p2 <= R)
        {
            help[i++] = arr[p2++];
        }

        for (int j = 0; j < help.Length; j++)
        {
            arr[L + j] = help[j];
        }

        return inversionCount ;
    }
```

# 求解翻转对

![image-20250715165052566](/notes-assets/Algorithm/assets/image-20250715165052566.png)

```C#
public class Solution {
    public int ReversePairs(int[] nums) {
       if (nums == null || nums.Length == 0) {
            return 0;
        }
        return MergeSortAndCount(nums, 0, nums.Length - 1);
    }

    public int MergeSortAndCount(int[] arr,int L,int R){
        if (L >= R) {
            return 0; // 递归终止条件
        }
        int ans = 0;
        int Mid = L + ((R - L) >> 1);
        int windowR =  Mid + 1;

        ans = MergeSortAndCount(arr, L, Mid) + MergeSortAndCount(arr, Mid + 1, R);

        for(int i = L;i<=Mid;i++){
            while(windowR<=R&&arr[i] > 2L*arr[windowR]){
                windowR++;
            }
            ans += windowR - Mid - 1;
        }
        int[] help = new int[R-L+1];
        int j = 0;
        int p1 = L;
        int p2 = Mid + 1; 
         while (p1 <= Mid && p2 <= R)
        {
            help[j++] = arr[p1] <= arr[p2] ? arr[p1++] : arr[p2++];
        }

        while (p1 <= Mid)
        {
            help[j++] = arr[p1++];
        }

        while (p2 <= R)
        {
            help[j++] = arr[p2++];
        }

        for (int k = 0; k< help.Length; k++)
        {
            arr[L + k] = help[k];
        }

        return ans ;
    }
}
```

又或者是

```C#
    public int Process(int[] arrs, int L, int R)
    {
        if (L == R)
        {
            return 0;
        }
        int mid = L + ((R - L) >> 1);
        return Process(arrs, L, mid) + Process(arrs, mid+1, R) + MergeSort(arrs,L,mid,R);
    }
    public int MergeSort(int[] arrs,int L,int Mid,int R)
    {
        int ans = 0;
        int WindowR = Mid + 1;
        for (int j = L; j <= Mid; j++) { 
            while(WindowR < R && arrs[j] > (2 * arrs[WindowR]))
            {
                WindowR++;
            }
            ans += WindowR - Mid - 1;
        }


        int[] help = new int[R - L + 1];
        int i = 0;
        int p1 = L;
        int p2 = Mid + 1;
        while (p1 <= Mid && p2 <= R)
        {
         
            help[i++] = arrs[p1] < arrs[p2] ? arrs[p1++] : arrs[p2++];
        }

        while (p1 <= Mid)
        {
            help[i++] = arrs[p1++];
        }

        while (p2 <= R)
        {
            help[i++] = arrs[p2++];
        }

        for (int j = 0; j < help.Length; j++)
        {
            arrs[L + j] = help[j];
        }
        return ans;
    }
```

# 求解前缀和

给定一个数组arr，两个整数lower和upper,返回arr中有多少个子数组的累加和在[lower.upper]范围上,统计数组中连续子数组的和落在[lower, upper]范围内的数量。

![image-20250716174024415](/notes-assets/Algorithm/assets/image-20250716174024415.png)

如果某个前缀和区间sum[i,j]在这个lower到upper上，证明下标i-j这个区间的数满足题意。例如arr[]数组的0~17范围的前缀和为100，lower~upper为[10,40]，要是在0~17的范围（如0~8）内有一个区间的前缀和为[60,90]，那么（9~17的范围这个区间则满足upper-lower）



```C#
  public  static int CountRangeNum(int[] nums,int lower,int upper)
  {
      if(nums == null || nums.Length == 0) 
          return 0;
      long[] sum = new long[nums.Length];
      sum[0] = nums[0];
      for(int i = 1;i < nums.Length;i++)  //求前缀和数组
      {
          sum[i] = sum[i-1] + nums[i];
      }
      return process(sum,0,sum.Length - 1,lower,upper);

  }
  public static int process(long[] sum,int L,int R,int lower,int upper)
  {
      if (L == R)
          return sum[L] >= lower && sum[L] <= upper ? 1 : 0;

      int M = L + ((R - L) >> 1);
      return process(sum,L,M,lower,upper) + process(sum,M + 1,R,lower,upper) + 
          Merge(sum,L,M,R,lower,upper);
  }

  private static int Merge(long[] sum, int L, int M, int R, int lower, int upper)
  {
      int ans = 0;
      int WindowL = L;
      int WindowR = L;
      for (int i = M + 1; i <= R; i++)  //在左组后找到满足右组中 - upper，lower的数
      {
          long min = sum[i] - upper;
          long max = sum[i] - lower;
          while (WindowL <= M && sum[WindowL] < min) 
              WindowL++;
          while (WindowR <= M && sum[WindowR] <= max) 
              WindowR++;
          ans += Math.Max(0, (WindowR - WindowL));
      }
      long[] help = new long[R - L + 1];
      int p1 = L;
      int p2 = M + 1;
      int j = 0;
      while (p1 <= M && p2 <= R) {
          help[j++] = sum[p1] < sum[p2] ? sum[p1++] : sum[p2++];
      }
      while (p1 <= M)
      {
          help[j++] = sum[p1++];
      }
      while (p2 <= R)
      {
          help[j++] = sum[p2++];
      }
      for(int k = 0; k < help.Length; k++)
      {
          sum[L + k] = help[k];
      }
      return ans;
  }
```

