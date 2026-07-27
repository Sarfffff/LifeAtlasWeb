---
title: LeetCode-Hot100
date: 2026-06-27 03:14:00
categories:
  - 算法与数据结构
tags:
  - Algorithm
  - 笔记
---
# 哈希表

## 两数之和

![image-20250714183805426](/notes-assets/Algorithm/assets/image-20250714183805426.png)

解答一：使用暴力算法

```C#
public int[] TwoSum(int[] nums, int target) {
    int[] arrs = new int[2];
    for(int i = 0; i < nums.Length; i++) {
        for(int j = i + 1; j < nums.Length; j++) {
            if(nums[i] + nums[j] == target) {
                arrs[0] = i;
                arrs[1] = j;
                return arrs;  // 找到后立即返回，提升效率
            }
        }
    }
    return arrs;
}
```

解答二：使用字典

```C#
public class Solution {
   public int[] TwoSum(int[] nums, int target) 
   {
        Dictionary<int,int> Dic = new Dictionary<int,int>();
            for(int i = 0;i< nums.Length;i++)
            {
                int num =  target - nums[i];
                if (Dic.ContainsKey(num))
                {
                    return new int[] {Dic[num], i};
                }
                Dic[nums[i]] = i;
            }
            return new int[] {};
    }
}
```

![image-20250714184706893](/notes-assets/Algorithm/assets/image-20250714184706893.png)

## 字母异位词分组

[字母异位词分组](https://leetcode.cn/problems/group-anagrams/)

![image-20250803182812449](/notes-assets/Algorithm/assets/image-20250803182812449.png)

使用字典进行求解，首先通过循环遍历每个字符串，将其转换为字符数组并且进行排序。在排序结束后使用存入字典，能够相互排列的存入一个列表中，最后返回

```C#
public class Solution {
    public IList<IList<string>> GroupAnagrams(string[] strs) {
        Dictionary<string,List<string>> Dic = new Dictionary<string,List<string>>();
        foreach(var str in strs){//str代表每排序的字符串
            char[] c = str.ToCharArray();
            Array.Sort(c);
            string key = new string(c);

            if(!Dic.ContainsKey(key))
                Dic[key] = new List<string>();
            Dic[key].Add(str);
        }
        return new List<IList<string>>(Dic.Values);
    }
}
```

## 最长连续序列

使用HashSet进行解决，将数组的值全部存入HashSet中，循环遍历每个元素，对于每一个元素i来说，i - 1是否存在在集合中，如果不存在则说明i 是一个新的连续序列的起点，从i开始遍历i+1，i+2等等，最后将每个新起点的长度进行比较，找到最大的序列；

```C#
public class Solution {
    public int LongestConsecutive(int[] nums) {
        HashSet<int> ans = new HashSet<int>(nums);
        int max = 0;
        foreach(var i in ans){
            if(!ans.Contains(i - 1)){  //遍历每个数，只有当 i-1 不存在时，说明 i 是一个连续序列的起点,才有可能是一个新序列
                int currentNum = i;
                int currentLen = 1;

                while(ans.Contains(currentNum + 1)){
                    currentLen++;
                    currentNum = currentNum + 1;
                }
                max = Math.Max(max,currentLen);
            }
        }
        return max;
    }
}
```

# 双指针

## [移动零](https://leetcode.cn/problems/move-zeroes/)

![image-20250803191856814](/notes-assets/Algorithm/assets/image-20250803191856814.png)

使用快慢指针，当数组的当前元素等于0时，慢指针不动，快指针往后走，遇到非0元素后，将当前的非0元素放入慢指针出，此时慢指针+1，依此。将所有的非0元素往前移了，后面的元素全部用0补齐；

```C#
public class Solution {
    public void MoveZeroes(int[] nums) {
		int L = 0;
        for(int i = 0; i < num.Length;i++){
            if(nums[i]!=0){
                num[L] = num[i];
                L++;
            }
        }
        for(int i = L;i<nums.Length;i++)
            nums[i]= 0;
        
    }
}
```

## [盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)

![image-20250805170058295](/notes-assets/Algorithm/assets/image-20250805170058295.png)

```C#
public class Solution {
    public int MaxArea1(int[] height) {
       int max = 0;
       for(int i = 0;i < height.Length;i++){
            for(int j = i + 1 ;j<height.Length;j++){
                int ans = (j - i) * (Math.Min(height[j],height[i]));
                max = Math.Max(max,ans);
            }
       } 
       return max;
    }
    public int MaxArea(int[] height) {
        int L = 0;
        int R = height.Length - 1;
        int maxArea = 0;
        while(L < R){
            maxArea = Math.Max(maxArea,(R - L) * (Math.Min(height[R],height[L])));
            if(height[L] < height[R])
                L++;
            else
                R--;
        }
        return maxArea;
    }
}
```

## [三数之和](https://leetcode.cn/problems/3sum/)

![image-20251124155102251](/notes-assets/Algorithm/assets/image-20251124155102251.png)

**用双指针+去重解决这个问题**

- 首先这个题目没有要我们输出位置，因此我们可以改变原数组的位置，进行sort排序一下，这样数组就是从小到大依次排列。
- 然后我们从头开始进行遍历（int i= 0，这里要注意i也有可能是重复的，因此有个去重代码）
- 然后设置俩个指针，一个从i+1,另外一个从数组尾部，进入第二层循环，找三个位置相加为0的数字，如果找到了，就记录进结果中

```C#
for(int i = 0;i < nums.Length - 2;i++){
    int j = i + 1;
    int t = nums.Lenght - 1;
    if(nums[i] == nums[i+1])// 跳过重复元素
        continue; 
}
```

- 这里要注意了，记录进结果之后，我们要对两个指针进行移位，去重也就是在这里发生的。

```C#
//如果数组是[-1 -1 -1 -1 0 0 0 0 1 1 1 1 2 2 2 3 3 3 ] 
```

- 假设i在num[0],j在nums[1],t在最后一个2，现在三个相加为0，然后两个指针开始移动，发现 j = j + 1，j + 1 = j + 2 ，j + 2 != j +3，那么 j 就会移动到 j+2 的位

  置（答案中不可以包含重复的三元组。），同理t会移动到最前面那个2，然后再进行一个 j++，t--，达成去重的目的。后面就是如果sum小于0的话，j 就向前移位，大于0的话，t 就向后移位。

```C#
public class Solution {
    public IList<IList<int>> ThreeSum(int[] nums) {
        var ans = new List<IList<int>>();
        Array.Sort(nums);
        for(int i = 0;i < nums.Length - 2;i++){
            int j = i + 1;
            int t = nums.Length - 1;
            if(nums[i] == nums[i + 1])
                continue;
            
            while(j < t){
                int sum = nums[i] + nums[j] + nums[t];
                if(sum == 0){
					ans.Add(new List<int>{num[i],nums[j],nums[t]});
                    
                    //开始去重
                    while(j < t && nums[j] == nums[j + 1])j++:
                    while(j < t && nums[t] == nums[t - 1])t--;
                    
                    j++;
                    t--;
                }
                else if(sum < 0)
                    j++;
                else
                    t--;
            }
        }
        return ans;
    }
}
```



## [接雨水](https://leetcode.cn/problems/trapping-rain-water/)

![image-20250907190631470](/notes-assets/Algorithm/assets/image-20250907190631470.png)

算法思路：双指针法：

**双指针法**：使用两个指针，`left`从数组开头开始，`right`从数组末尾开始。

**记录左右最大高度**：维护两个变量 `pre_max`（从左往右遍历时的当前最大高度）和 `las_max`（从右往左遍历时的当前最大高度）。

**计算雨水**：每一步比较 `pre_max`和 `las_max`：

- 如果 `pre_max`> `las_max`，说明右边的墙足够高，可以接住左边的雨水，计算 `left`位置的积水量（`pre_max - height[left]`），然后 `left`右移。
- 否则，说明左边的墙足够高，可以接住右边的雨水，计算 `right`位置的积水量（`las_max - height[right]`），然后 `right`左移。

**返回结果**：最终累加的 `ans`就是能接住的雨水总量。

```C#
public class Solution {
    public int Trap(int[] height) {
        if (height == null || height.Length <= 2) return 0;
        int ans = 0;
        int left = 0;
        int right = height.Length - 1;
        int pre_max = 0;
        int las_max = 0;
        while(left <= right){
            if(height[left] < height[right]){
                pre_max = Math.Max(pre_max,height[left]);
                ans += pre_max - height[left];
                left++;
            }
            else{
                las_max = Math.Max(las_max,height[right]);
                ans += las_max - height[right];
                right--;
            }
        }
        return ans;
    }
}
```



# 全0子数组的数目

![image-20250820003607790](/notes-assets/Algorithm/assets/image-20250820003607790.png)

进行分区处理。定义一个变量记录每个区间段0的数目，遍历数组，如果遇到0，变量++。在遇到非0数字时进行计算。但是如果非0区间在最后一段可能无法处理，因为计算是遇到非0数时，所以最后需要单独处理

```C#
public class Solution {
    public long ZeroFilledSubarray(int[] nums) {
        int sum = 0;
        int max = 0;
        for(int i= 0;i < nums.Length;i++){
			if(nums[i] == 0){
                sum++;
            }
            else{
				max += (sum * (sum + 1) / 2);;
            }
        }
        return (max + (sum + 1) * sum / 2);
	}
}
```

# 滑动窗口

滑动窗口是一种用于处理**数组/字符串**子区间问题的优化技术。它通过维护一个窗口（通常是连续的子数组/子字符串），在数据上滑动，从而避免重复计算，将时间复杂度从暴力解的 O(n²) 或更高降到 O(n)。

**适用题型**：

- 问题涉及**连续子数组**或**子字符串**
- 通常求：最长/最短满足某条件的子数组长度满足条件的子数组个数子数组的最大/最小值等
- 常见关键词：“连续”、“子串”、“无重复字符”、“和大于/等于某值”

**滑动窗口基本类型**

**3.1 固定长度窗口**

窗口大小固定为 k，每次向右移动一步，用于解决定长子数组的问题。

**示例问题**：大小为 k 的子数组的最大和。

**步骤**：

1. 计算第一个窗口的和。
2. 从第二个窗口开始，每次加新元素，减旧元素，更新结果。

**3.2 可变长度窗口**

窗口大小不固定，根据条件动态扩展或收缩。

**常见两种模式**：

- **求最小长度**：不断扩大右边界直到满足条件，然后收缩左边界直到不满足条件，记录最小长度。
- **求最大长度**：不断扩大右边界，当不满足条件时收缩左边界直到满足条件，记录最大长度。

## [无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

![image-20251124011147117](/notes-assets/Algorithm/assets/image-20251124011147117.png)

如本题长度是动态的，我们需要进行动态扩展窗口。

- 首先创建一个HashSet来记录字符出现的位置，如果首次出现，则存入HashSet，在此出现，则证明出现了重复字符，此时一直循环删除HashSet元素，直至没有重复元素重写
- 首先从字符串下标为0开始，遍历存储。
- 使用maxLen记录最长子串

```C#
public class Solution {
    public int LengthOfLongestSubstring(string s) {
        int L = 0;
        int maxLen = 0;
        HashSet<char> set = new HashSet<char>();
        for(int R = 0;R < s.Length;R++){
            while(set.Contains(s[R])){
                set.Remove(s[L]);
                L++;
            }
            set.Add(s[R]);
            maxLen = Math.Max(R - L + 1,maxLen);
        }
        return maxLen;
    }
}
```



## [ 找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/)

![image-20251123194726241](/notes-assets/Algorithm/assets/image-20251123194726241.png)

思路算法与最小覆盖子串（题号：76）很相似；但是有所不同，这个题目是找到起始索引，代表着子串要完全满足p字符串的异位词，在子串中不能包含其他无关紧要的字符

**完整的解题思路：**

1. **初始化**：统计p的字符计数到`need`字典

2. **构建初始窗口**：先处理前p.Length个字符右指针从0移动到p.Length-1统计这些字符到`window`字典

3. 

   **滑动窗口检查**：固定区间范围，每当区间长度满足Right - Left == p.Length就进行一次判断，如果满足此区间的子串是异位词则存入列表，left则右移去进行下一个区间的判断

   ```C#
    //此时已经在s中找到了包含字符串p的区间
   while(Right - Left == p.Length) {//固定区间长度为p的长度
   	if(Vaild == need.Count)
   		ans.Add(Left);
       
   	char d = s[Left];
   	Left++;  //区间右移，继续寻找
       
   	if (need.ContainsKey(d)) {  //能满足Vaild == need.Count这个的直接进入代表找到了一个解，将这个解去除去寻找下一个
   		if (windows[d] == need[d]) 
   			Vaild--;
   		windows[d]--;
   	}
   }
   ```

4. **优化判断**：使用`valid`计数器当某个字符数量达到需求时，`valid++`当`valid == need.Count`时，且窗口大小固定 ⇒ 必然完全匹配

```C#
public class Solution {
    public IList<int> FindAnagrams(string s, string p) {
        List<int> ans = new List<int>();
        Dictionary<char,int> need = new Dictionary<char,int>();
        foreach(var c in p){
            need[c] = need.ContainsKey(c)?need[c] + 1:1;
        }
        Dictionary<char,int> windows = new Dictionary<char,int>();
        int Left = 0;
        int Right = 0;
        int Vaild = 0;
        while(Right < s.Length){
            char c = s[Right];
            Right++;
            if(need.ContainsKey(c)){
                windows[c] = windows.ContainsKey(c)?windows[c] + 1: 1;
                if(need[c] == windows[c])
                    Vaild++;
            }
            //此时已经在s中找到了包含字符串p的区间
            while(Right - Left == p.Length) {//固定区间长度为p的长度
                if(Vaild == need.Count)
                    ans.Add(Left);
                char d = s[Left];
                Left++;
                if (need.ContainsKey(d)) {
                    if (windows[d] == need[d]) 
                        Vaild--;
                    windows[d]--;
                }
            }

        }
        return ans;

    }
}
```

# 子串

## [和为 K 的子数组](https://leetcode.cn/problems/subarray-sum-equals-k/)

![image-20251124144532929](/notes-assets/Algorithm/assets/image-20251124144532929.png)

此题的关键就是子数组 `nums[i...j]`的和等于 k，即：

```C#
sum[i...j] = prefixSum[j] - prefixSum[i-1] = k
```

转换得：

```C#
prefixSum[i-1] = prefixSum[j] - k
```

只要找到了这个即可解，相当于**前缀和 - 前面的某个前缀和 = 这段区间的和**

```C#
//前缀和 - 前面的某个前缀和 = 这段区间的和
public class Solution {
    public int SubarraySum(int[] nums, int k) {
		int ans = 0;
        int sum = 0;
        for(int i = 0;i < nums.Length;i++){
			sum = 0;
            for(int j = i; j < nums.Length;j++){
                //前缀和区间 从0 - nums.Length : 1 - nums.Length : 2 - nums.Lenght : nums.Lenght - nums.Length;
                sum += nums[j];
                if(sum == k){
                    ans++;
                    continue;
                }
            }
        }
        return ans;
    }
}
```

**时间复杂度**：O(n²) - 对于每个起始点 i，都遍历了所有可能的结束点 j

**空间复杂度**：O(1)



使用前缀和 + 哈希表（最优解）可以优化上述操作

- 使用前缀和来避免重复计算
- 利用哈希表记录前缀和出现的次数
- 对于每个位置，查找 `prefix_sum - k`是否出现过

我们要找的是子数组 `nums[i...j]`的和等于 k，即：

```C#
sum[i...j] = prefixSum[j] - prefixSum[i-1] = k
```

转换得：

```C#
prefixSum[i-1] = prefixSum[j] - k
```

如：对于数组 `[1, 1, 1]`, k = 2：

- 前缀和变化：0 → 1 → 2 → 3
- 当 prefixSum = 2 时，查找 prefixSum - k = 0，找到1次
- 当 prefixSum = 3 时，查找 prefixSum - k = 1，找到1次
- 总共找到2个子数组：[1,1] 和 [1,1]（不同的位置）

```C#
public class Solution {
    public int SubarraySum(int[] nums, int k) {
 		Dictionary<int,int> Dic = new Dictionary<int,int>();
        Dic[0] = 1;  // 前缀和为0出现1次
        int total = 0;
        int sum = 0;
        for(int i = 0;i < nums.Length;i++){
            sum += nums[i];
            if(Dic.ContainsKey(sum - k))   //只要前缀和中存在等于 sum - k的值就证明有一个子数组满足 等于 k的要求
            {
                total += Dic[sum - k];  //Dic[sum - k] 代表出现 sum - k的值的次数
            }
            if(Dic.ContainsKey(sum)){
                Dic[sum]++;
            }
            else{
                Dic[sum] = 1;
            }
        }
        return total;
    }
}
```

## [滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)

![image-20251124151504072](/notes-assets/Algorithm/assets/image-20251124151504072.png)

暴力求解（但是超时）

```C#
public class Solution {
    public int[] MaxSlidingWindow(int[] nums, int k) {
        int max = -10000;
        List<int> ans = new List<int>();
        for(int i = 0;i < nums.Length - k;i++){
            max = -10000;
            for(int j = i;j < k + i;j++){
                max = Math.max(max,nums[j]);
            }
            ans.Add(max);
        }
        return ans.ToArray();
    }
}
```

单调栈求解

# 普通数组

## [ 最大子数组和](https://leetcode.cn/problems/maximum-subarray/)

![image-20251124162950501](/notes-assets/Algorithm/assets/image-20251124162950501.png)

前缀和求解题目：

- 题目要求求解最大连续子数组，不要求返回数组下标，返回值即可。
- 采用前缀和求解，当前最大和连续子数组 = 当前前缀 - 当前已经遍历得到的最小前缀
- 使用Math.Max（）方法得到最大的连续子数组即可

```C#
public class Solution {
    public int MaxSubArray1(int[] nums) {
		int ans = -10000;
        int curMax = 0;  //当前前缀
        int min = 0;  //最小前缀
        for(int i = 0;i < nums.Length;i++){  //最大前缀 - 最小前缀即可
			curMax += nums[i];
            ans = Math.Max(ans,curMax - min);
            min = Math.Min(min,curMax);
        }
        return ans;
    }
}
```

动态规划

```C#
public int MaxSubArray(int[] nums) {
        if(nums.Length == 0 || nums == null)
            return 0;
        int maxNum = nums[0]; // 全局最大值
        int cur = nums[0]; // 当前子数组和
        for(int i = 1;i < nums.Length;i++){
            cur = Math.Max(nums[i],cur + nums[i]);
            maxNum = Math.Max(cur,maxNum);
        }
        return maxNum;
    }
```



# 矩阵

## [矩阵置零](https://leetcode.cn/problems/set-matrix-zeroes/)

![image-20251122211721619](/notes-assets/Algorithm/assets/image-20251122211721619.png)

对于本题，题目要求值为0的行，列都要为0。我们直接遍历找到所有为0的数字的行，列，使用2个数组分别存储值为0的行，列。最后在此从头遍历，如果遇到行或者列为0的直接置为0，因为（行或列相同直接为0）

```C#
public class Solution {
    public void SetZeroes(int[][] matrix) {
		int m = matrix.Length;  //行
        int n = matrix[0].Length;  //列
        
        //用于记录值为0的行，列
        bool[] ZeroRow = new bool[m];
        bool[] ZeroCol = new bool[n];
        
        for(int i = 0;i < m;i++){
            for(int j = 0;j < n;j++){
                if(matrix[i][j] == 0)
                {
                    ZeroRow[i] = true;
                    ZeroCol[j] = true;
                }
            }
        }
        
         for(int i = 0;i < m;i++){
            for(int j = 0;j < n;j++){
                if(ZeroRow[i] || ZeroCal[j])
                    matrix[i][j] = 0;
            }
    
         }
    }
}
```

## [螺旋矩阵](https://leetcode.cn/problems/spiral-matrix/)

![image-20251122235857424](/notes-assets/Algorithm/assets/image-20251122235857424.png)

使用四个边界指针来定义当前的遍历范围，每次完成一条边的遍历后，收缩对应的边界。设置四个遍历代表从左到右，从上到下。遍历一次，就收缩一次边界，同时检测边界是否满足条件。

```C#
public class Solution {
    public IList<int> SpiralOrder(int[][] matrix) {
        if(matrix.Length == 0 || matrix[0].Length == 0 || matrix == null){
                return new List<int>(){};
        }
        List<int> ans = new List<int>();
        int m = matrix.Length;  //行
        int n = matrix[0].Length; //列
        int up = 0;  //行的起始点
        int down = m - 1;  //行的末尾
        int left = 0;
        int right = n - 1;
        while(true){   
            for(int i = left;i <=right;i++) //从左往右 矩阵最上层
                ans.Add(matrix[up][i]);
            if(++up > down)  //缩小边界，相当于删除第一行,在进行判断数组是否越界
                break;
            
            for(int i = up;i <= down;i++) //从右边的最上到右边最下
                ans.Add(matrix[i][right]);
         	if(--right < left)
  				break;
            
            for(int i = right;i >= left;i--)
                ans.Add(matrix[down][i]);
            if(--down < up)
                break;
            
            for(int i = down;i >= up;i--)
                ans.Add(matrix[i][left]);
           	if(++left > right)
                break;
        }
        return ans;
    }
}
```

## [ 旋转图像](https://leetcode.cn/problems/rotate-image/)

![image-20251123020446246](/notes-assets/Algorithm/assets/image-20251123020446246.png)

先转置后关于中间轴进行交换（n / 2）

**矩阵原地转置**：把矩阵的「行」变成「列」，为后续旋转铺垫 —— 转置后，元素的位置会初步调整到旋转 90° 所需的大致区域。

- 遍历方阵的「上三角部分」（j 从 i+1 开始），因为方阵转置的本质是「交换 (i,j) 和 (j,i) 成对元素」；
- 只遍历上三角是为了避免重复交换（比如 (0,1) 和 (1,0) 只换 1 次，若遍历全部元素会换 2 次恢复原状）；
- 主对角线元素（i=j）位置不变，无需处理。

**每行水平镜像翻转**：在转置的基础上，通过左右翻转，让元素最终落到顺时针旋转 90° 的目标位置。

- 遍历每一行，仅处理该行的「前半列」（j < n/2），因为每一对左右对称的元素只需交换 1 次；
- 对称位置公式：第 j 列的元素 ↔ 第 (n-1-j) 列的元素（比如 n=3 时，j=0 对应 j=2，j=1 是中间列无需交换）；
- 列只遍历一半，避免同一对元素重复交换，提升效率。

```C#
public class Solution {
    public void Rotate(int[][] matrix) {
        //先将矩阵转置,n * n的矩阵
        int n = matrix.Length;
        for(int i = 0;i < n;i++){
            for(int j = i + 1; j < n;j++){
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        //遍历行，但是列只需要遍历一般
        for(int i = 0;i < n;i++){  
            for(int j = 0;j < n / 2 ;j++){
                int temp = matrix[i][j];
                matrix[i][j] = matrix[i][n - 1 - j];//对称交换，关于中间轴
                matrix[i][n - 1 - j] = temp;
            }
        }
    }
}
```

## [ 搜索二维矩阵 II](https://leetcode.cn/problems/search-a-2d-matrix-ii/)

![image-20251123183958272](/notes-assets/Algorithm/assets/image-20251123183958272.png)

# 链表

## [ 删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

![image-20250826191518383](/notes-assets/Algorithm/assets/image-20250826191518383.png)

先通过遍历链表计算出链表的总长度 N，然后确定需要删除的倒数第 n 个节点对应的正数位置 m（即 N-n），若 m 为 0 则说明要删除头节点，直接返回头节点的下一个节点即可；否则重新遍历链表找到要删除节点的前一个节点，通过该节点的 next 指针跳过要删除的节点，并将被删除节点的 next 指针置空以断开引用，最终返回原头节点。

```C#
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     public int val;
 *     public ListNode next;
 *     public ListNode(int val=0, ListNode next=null) {
 *         this.val = val;
 *         this.next = next;
 *     }
 * }
 */
public class Solution {
    public ListNode RemoveNthFromEnd(ListNode head, int n) {
        if (head == null) return null;    
       int N = 0;
       ListNode cur = head;
       while(cur != null){
            cur = cur.next;
            N++;
       }
        int m = N - n;
        if(m == 0){
            ListNode newHead = head.next;
            head.next = null; 
            return newHead;
        }
        cur = head;
        while(m > 1){  //刚好找到要删除节点的前一个节点
            cur = cur.next;
         
            m--;
        }
        ListNode ToDelete = cur.next;
        if(ToDelete != null){
            cur.next = ToDelete.next;
            ToDelete.next = null;
        }
        
        return head;
    }
}	
```

## [ 合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)

```C#
public class Solution {
    public ListNode MergeTwoLists1(ListNode list1, ListNode list2) {
        ListNode head = new ListNode(-1);
        ListNode cur = head;
        while(list1!=null && list2!=null){
            if(list1.val < list2.val)
            {
                cur.next= new ListNode(list1.val);
                cur = cur.next;
                list1 = list1.next;
            }
            else if(list1.val > list2.val){
                cur.next = new ListNode(list2.val);
                cur = cur.next;
                list2 = list2.next;
            }
            else{
                cur.next = new ListNode(list1.val,null);
                cur.next.next= new ListNode(list2.val,null);
                cur = cur.next.next;
                list1 = list1.next;
                list2 = list2.next;
            }

        }
        while(list1!=null){
            cur.next = new ListNode(list1.val);
            cur = cur.next;
            list1 = list1.next;
        }
        while(list2!=null){
            cur.next = new ListNode(list2.val);
            cur = cur.next;
            list2 = list2.next;
        }
        return head.next;
    }
    public ListNode MergeTwoLists(ListNode list1, ListNode list2) {
        if(list1 == null)
            return list2;
        if(list2 == null)
            return list1;
        if(list1.val < list2.val){
            list1.next = MergeTwoLists(list1.next,list2);
            return list1;
        }
        else{
            list2.next = MergeTwoLists(list1,list2.next);
            return list2;
        }

    }
}
```

## [删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

```C#
public class Solution {
    public ListNode RemoveNthFromEnd1(ListNode head, int n) {
        if (head == null) return null;    
       int N = 0;
       ListNode cur = head;
       while(cur != null){
            cur = cur.next;
            N++;
       }
        int m = N - n;
        if(m == 0){
            ListNode newHead = head.next;
            head.next = null; 
            return newHead;
        }
        cur = head;
        while(m > 1){  //刚好找到要删除节点的前一个节点
            cur = cur.next;
         
            m--;
        }
        ListNode ToDelete = cur.next;
        if(ToDelete != null){
            cur.next = ToDelete.next;
            ToDelete.next = null;
        }
        
        return head;
    }
    public ListNode RemoveNthFromEnd(ListNode head, int n) {
 		if(head == null)
            return null;
        ListNode dummyNode = new ListNode(0);
        dummyNode.next = head;
        ListNode fast = dummyNode;
        ListNode slow = dummyNode;
        while(n-- != 0 && fast.next != null){
            fast = fast.next;  //先让fast走n步
        }
        while(fast.next != null){
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;
        return dummyNode.next;
    }
} 	
```

## [排序链表](https://leetcode.cn/problems/sort-list/)

```C#

public class Solution {
    public ListNode SortList(ListNode head) {
        if(head == null)
            return null;
        List<int> ans = new List<int>();
        ListNode cur = head;
        while(cur != null){
            ans.Add(cur.val);
            cur = cur.next;
        }
        ans.Sort();
        
       ListNode newHead = new ListNode(0);
    ListNode dummy = newHead;
 
        for(int i = 0; i < ans.Count;i++){
            dummy.next = new ListNode(ans[i]);
            dummy = dummy.next;
        }
        return newHead.next;
    }
}
```

## [合并 K 个升序链表](https://leetcode.cn/problems/merge-k-sorted-lists/)

```C#
public class Solution {
    //1.堆排序：每个链表的头节点加入最小堆，每次取出堆顶（值最小的节点）接入新链表，若该节点有后继节点，则将后继节点加入堆；堆为空时，合并完成
    public ListNode MergeKLists1(ListNode[] lists) {
        if(lists.Length == 0 || lists == null)
            return null;
        ListNode dummyNode = new ListNode(0);
        ListNode cur = dummyNode;
        PriorityQueue<ListNode,int> Pq = new PriorityQueue<ListNode,int>();
        for(int i = 0;i < lists.Length;i++){
            if(lists[i] == null)continue;
            Pq.Enqueue(lists[i],lists[i].val);
        }
        while(Pq.Count > 0){
            ListNode temp = Pq.Dequeue();
            cur.next = temp;
            cur = cur.next;
            if(temp.next != null)
                Pq.Enqueue(temp.next,temp.next.val);
        }
        return dummyNode.next;
    }
    //2.归并（一个一个排序）
    public ListNode MergeKLists(ListNode[] lists) {
        if(lists.Length == 0 || lists == null)
            return null;
        return MergeSort(lists,0,lists.Length - 1);
    }
    public ListNode MergeSort(ListNode[] lists,int L,int R){
        if(L == R)return lists[L];
        int mid = L + ((R - L) >> 1);
         // 递归合并左组和右组
        ListNode l1 = MergeSort(lists, L, mid);
        ListNode l2 = MergeSort(lists, mid + 1, R);
        return Process(l1,l2);
    }
    public ListNode Process(ListNode l1,ListNode l2){
        ListNode dummyNode = new ListNode(0);
        ListNode cur = dummyNode;
        while(l1 != null && l2 != null){
            if(l1.val >= l2.val){
                cur.next = l2;
                l2 = l2.next; 
            }
            else{
                cur.next = l1;
                l1 = l1.next;
            }
            cur = cur.next;
        }
        if(l1 != null)
            cur.next = l1;
        if(l2 != null)
            cur.next = l2;
        return dummyNode.next;
    }
    public ListNode MergeKLists2(ListNode[] lists) {
        List<int> ans = new List<int>();
        for(int i = 0; i < lists.Length;i++){
            ListNode head = lists[i];
            while(head != null){
                ans.Add(head.val);
                head = head.next;
            }
        }
        ans.Sort();
        ListNode newHead = new ListNode(0);
        ListNode dummy = newHead;
 
        for(int i = 0; i < ans.Count;i++){
            dummy.next = new ListNode(ans[i]);
            dummy = dummy.next;
        }
        return newHead.next;
        
    }
}
```



# 二叉树

## 二叉搜索树中第 K 小的元素

![image-20250820004543425](/notes-assets/Algorithm/assets/image-20250820004543425.png)

找最小值，可以将2叉树层级遍历，得到数组后进行排序，直接输出k - 1下标的元素。

```c#
public class Solution {
    public int KthSmallest(TreeNode root, int k) {
		if(root == null)
            return 0;
        List<int> ans = new List<int>();
        Queue<TreeNode> queue = new Queue<TreeNode>();
        queue.Enqueue(root);
        while(queue.Count > 0){
            TreeNode cur = new TreeNode();
            cur = queue.Dequeue();
            ans.Add(cur.val);
            if(cur.left !=null){
                queue.Enqueue(cur.left);
            }
            if(cur.right !=null)
            {
                queue.Enqueue(cur.right);
            }
        }
        int[] arr = ans.ToArray();
        Array.Sort(arr);
        return arr[k -1];       
    }
}
```

## [两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs/)

```C#
public class Solution {
    public ListNode SwapPairs(ListNode head) {
        ListNode DummyNode = new ListNode(0);
        DummyNode.next = head;
        ListNode cur = DummyNode;
        //如果链表是 1 - 2 - 3 - 4
        while(cur.next != null && cur.next.next != null){ //必须有2个元素进行交换
            ListNode temp1 = cur.next;  // 1
            ListNode temp2 = cur.next.next.next; // 3

            cur.next = cur.next.next; // 将2 赋值给 1
            cur.next.next = temp1;  //将记录的1给2节点了
            
            //此时已经交换了 1和2，但是和后面是断开的，需要链接起来,就需要我们记录的3了,与头节点链接.
            cur.next.next.next = temp2;

            cur = cur.next.next; //交换2个后往后继续交换
        }
        return DummyNode.next;
    }
    public ListNode SwapPairs1(ListNode head) {
        if (head == null) {
            return head;
        }
        int Length = 0;
        ListNode cur = head;
        while(cur != null){
            cur = cur.next;
            Length++;
        }
        int m = Length / 2;


        ListNode dummy = new ListNode(0); 
        dummy.next = head;
        ListNode prevTail = dummy; // 记录上一段反转后的尾部
        cur = head;


        while(m > 0){
            ListNode newHead = changeListNode(cur,2);  //每段进行反转
            prevTail.next = newHead;     //反转后节点与前一段连接

            prevTail = cur;  
            cur = cur.next;
            m--;
        }
        return dummy.next;
    
    }
    public ListNode changeListNode(ListNode head, int k) {
        if (head == null || k <= 1) {
            return head;
        }
        
        ListNode pre = null;
        ListNode current = head;
        ListNode next = null;
        ListNode tailOfReversed = head; // 保存反转部分的原头部（反转后成为尾部）
        
        while (k > 0 && current != null) {
            next = current.next;  // 保存下一个节点
            current.next = pre;   // 当前节点指向前一个节点
            pre = current;        // 更新前一个节点为当前节点
            current = next;       // 移动到下一个节点
            k--;
        }
        
        tailOfReversed.next = current;
        return pre;  
    }

}
```



## 二叉树的右视图

![image-20250820005421037](/notes-assets/Algorithm/assets/image-20250820005421037.png)

同理，也是使用层级遍历，但是这个层级遍历只存储每层的最后一个元素，即可得到右视图,层级遍历时，记录每层的层数。

```C#
public class Solution {
     public IList<int> RightSideView(TreeNode root) {
		List<int> ans = new List<int>();
        if(root == null)
            return ans;
        else{
			Queue<TreeNode> queue = new Queue<TreeNode>();
        	queue.Enqueue(root);
            while(queue.Count > 0){
                int size = queue.Count;
				int lastval = 0;
                for(int i = 0; i< size;i++){
                    TreeNode cur = queue.Dequeue();
                   
                    lastval = cur.val; //每次覆盖，直到每层的最后一个元素
                    
                    if(cur.left !=null){
                        queue.Enqueue(cur.left);
                    }
                    if(cur.right !=null)
                    {
                        queue.Enqueue(cur.right);
                    }
				}
                ans.Add(lastval);
                
            }
        }      
        return ans;       
    }
}
```

## 二叉树展开为链表

![image-20250820011030607](/notes-assets/Algorithm/assets/image-20250820011030607.png)

1. 1.**初始化**：•

   若根节点为空，直接返回。

   创建一个栈，并将根节点压入栈。

   维护一个 `prev`指针，记录前一个节点（初始为 `null`）。

2. 2.**迭代处理**：•

   弹出栈顶节点作为当前节点 `current`。•

   若 `prev`非空：•

   将 `prev`的右指针指向 `current`（形成链表）。•

   将 `prev`的左指针置空（满足链表要求）。

   - •

     按**先右后左**的顺序将子节点压入栈（保证左子树先处理）。

   - •更新 `prev`为当前节点。

3. 3.**终止条件**：

   - •栈为空时结束。

```C#
public class Solution {
    public void Flatten(TreeNode root) {
        if (root == null) return;
        
        Stack<TreeNode> stack = new Stack<TreeNode>();
        stack.Push(root);
        TreeNode prev = null;
        
        while (stack.Count > 0) {
            TreeNode current = stack.Pop();
            
            if (prev != null) {
                prev.right = current; // 将前一个节点的右指针指向当前节点
                prev.left = null;     // 左指针置空
            }
            
            // 先压右节点，再压左节点（保证左节点先处理）
            if (current.right != null) stack.Push(current.right);
            if (current.left != null) stack.Push(current.left);
            
            prev = current; // 更新前一个节点
        }
    }
}
```

# 图论

# 回溯

# 二分查找

## 搜索插入位置

![image-20250820013911722](/notes-assets/Algorithm/assets/image-20250820013911722.png)

使用2分法进行查找，如果没有找到元素，则不存在，并且L的位置则插入的目标位置

```C#
public class Solution {
    public int SearchInsert(int[] nums, int target) {
		int L = 0;
        int R = nums.Length;
        while(L <= R){
            int mid = (L + (R - L) >> 1);
            if(nums[mid] ==  target)
                return mid;
            else if(nums[mid] < target)
                L = mid + 1;
            else 
                R = mid - 1;
        }
        return L;
    }
}
```

## 在排序数组中查找元素的第一个和最后一个位置

![image-20250820184549129](/notes-assets/Algorithm/assets/image-20250820184549129.png)

```C#
public class Solution {
    public int[] SearchRange(int[] nums, int target) {
 		int L = 0;
        int R = nums.Length -1;
        int start = -1;
        int end = -1;
        while(L <= R){
            int mid = (L + (R - L) >> 1);
            if(nums[mid] == target){
                start = mid;
                end = mid;
                break;
            }
            else if(nums[mid] < target){
                L = mid + 1;
            }
            else
                R = mid - 1;
        }
       while(start>0&&nums[start-1]==target)start--;
       while(end<nums.Length-1&&nums[end+1]==target)end++;
       return new int[]{start,end};
    }
}
```

## 搜索旋转排序数组

![image-20250820185205492](/notes-assets/Algorithm/assets/image-20250820185205492.png)

旋转后的数组必定mid左边或者右边有序，如果左边有序，判断是否在左边区间，将target与mid索引处进行比较。如果右边有序，则同理。只需要在有序空间进行判断即可。

```C#
public class Solution {
    public int Search(int[] nums, int target) {
 		int L = 0;
        int R = nums.Length - 1;
        while( L <= R){
			int mid = (L + (R - L) >> 1);
             if(nums[mid] == target){
                return mid;
            }
            else if(nums[mid] < nums[L]) //右边有序
            {
                if(nums[mid] < target && target <= nums[R]){
					L = mid + 1;
                }
                else{
                    R = mid - 1;
                }
            }
            else{
                if(nums[mid] < target && target >= nums[L]){
					R = mid - 1;
                }
                else{
                    L = mid + 1;
                }
            }
        }
        return -1;
    }
}
```

# 栈

# 堆

# 贪心算法

## 跳跃游戏

![image-20250830164934811](/notes-assets/Algorithm/assets/image-20250830164934811.png)

1. .**初始化**：`Len`初始化为 0，表示初始能到达的最远位置（即起点，索引 0）。
2. 2.**遍历数组**：
   - •**可行性检查**：在每一步 `i`，检查当前能到达的最远位置 `Len`是否小于 `i`。如果是，说明无法从之前的任何位置跳到 `i`，直接返回 `false`。
   - •**更新最远位置**：如果 `i`可达，则更新 `Len`为 `max(Len, i + nums[i])`，即从当前位置 `i`能跳到的最远位置。
3. 3.**成功判断**：如果遍历完整个数组都没有触发 `false`，说明可以到达终点，返回 `true`。

```c#
  public static bool jump(int[] nums)
  {
      int Len = 0;
      for (int i = 0; i < nums.Length; i++)
      {
          if (Len < i)
          {
              return false;
          }
          Len = Math.Max(Len, i + nums[i]);
      }
      return true;
  }
```

## 股票股买的最佳时期I

![image-20250911103339113](/notes-assets/Algorithm/assets/image-20250911103339113.png)

对于该题，只能购买和卖出一次股票，所以需要找到股票的最大值和最小值，并且最大值的下标索引大于最小值。因此设置一个buy变量用于寻找最低的购买价值，profit用于找到每次卖出股票的得到利润，max用于记录最大的利润。

1. **初始化**：将max，profit初始化为0，buy初始化为数组的第一个值prices[0]；
2. **遍历数组**：
   - 如果当前值大于buy（即购买值），即可卖出得到当前的利润profit（profit = nums[i] - buy)，并改变当前max的最大利润
   - 如果当前值小于buy（即购买值），即更新购买价值
3. .**成功找到**：最后得到的max值即为利润最大值

```C#
    public int MaxProfit(int[] prices) {
        int profit = 0;
        int Buy = prices[0];
        int max = 0;
        for(int i = 1;i < prices.Length;i++){
            if(prices[i] < Buy){
                Buy = prices[i];
            }
            else{
                profit = prices[i] - Buy;
                max = Math.Max(max,profit);
            }
        }
        return max;
    }
```

## 股票购买的最佳时期II

![image-20250911104439007](/notes-assets/Algorithm/assets/image-20250911104439007.png)

对于该题，可以多次购买和卖出一次股票，因此每当当前的价值大于购买值即卖出，将所有的利润值相加，最后得到最大的价值。

1. **初始化**：将profit初始化为0，buy初始化为数组的第一个值prices[0]；
2. **遍历数组**：
   - 如果当前值大于buy（即购买值），即可卖出得到当前的利润profit（profit += nums[i] - buy)，更新购买价值
   - 如果当前值小于buy（即购买值），即更新购买价值
3. .**成功找到**：最后得到的profit值即为利润最大值

```C#
public class Solution {
    public int MaxProfit(int[] prices) {
        int profit = 0;
        int buy = prices[0];
        for(int i = 1;i < prices.Length;i++){
            if(prices[i] > buy){
                profit += prices[i] - buy;
                
            }
            buy = prices[i];        
        }
        return profit;
    }
}
```

# 动态规划

## [杨辉三角](https://leetcode.cn/problems/pascals-triangle/)

![image-20250925153157970](/notes-assets/Algorithm/assets/image-20250925153157970.png)

对于此题，采用动态规划求解。

1. **初始化处理**：首先检查输入参数`numRows`的有效性，如果小于等于0则直接返回空列表
2. **基础行处理**：
   - 添加第一行 `[1]`
   - 如果只需要1行，直接返回
   - 添加第二行 `[1, 1]`
   - 如果只需要2行，直接返回
3. **动态生成后续行**：从第3行开始循环到目标行数：
   - 获取前一行数据：`var prev = ans[i - 2]`
   - 创建新行列表，首元素固定为1
   - 计算中间元素：通过循环将前一行的相邻元素相加
   - 末尾元素固定为1
   - 将生成的新行添加到结果列表中

```C#
public class Solution {
    public IList<IList<int>> Generate(int numRows) {
        var ans = new List<IList<int>>();

        if (numRows <= 0) return ans;

        ans.Add(new List<int>(){1});
        if (numRows == 1) return ans;

        ans.Add(new List<int>(){1, 1});
        if (numRows == 2) return ans;
        
        for(int i = 3; i<=numRows;i++){
            var prev = ans[i - 2];
            List<int> res = new List<int>();
            res.Add(1);
            for(int j = 1; j < i - 1;j++){
                res.Add(prev[j - 1] + prev[j]);
            }
            res.Add(1);
            ans.Add(res);
        }
        return ans;
    }
}
```

```C#
public class Solution {
    public IList<IList<int>> Generate(int numRows) {
        var ans = new List<IList<int>>();
 		for(int i = 0;i <=numRows;i++){
            if(numRows == 0 || )
        }
    }
}
```

## [加油站](https://leetcode.cn/problems/gas-station/)

![image-20250926100706643](/notes-assets/Algorithm/assets/image-20250926100706643.png)

从0号加油站开始遍历，记录当前加油站走到下一个加油站的消耗的油量 costGas，同时使用totalGas记录总的剩余油量，用于是否能够走一圈回到出发的加油站。同时使用一个变量curGas记录当前的剩余油量，如果当前的剩余油量 < 0，证明从当前加油站出发在中间就没有汽油走到下一个加油站了，此时从下一个加油站开始遍历。循环往复，如果没有一个加油站满足，直接返回-1；

```C# 
public class Solution {
    public int CanCompleteCircuit(int[] gas, int[] cost) {
        if (gas.Length == 0)
            return -1;
        int index = 0;
        int totalGas = 0;
        int curGas = 0;
        for(int i = 0; i < gas.Length;i++){
            int costGas = gas[i] - cost[i];
            totalGas += costGas;
            curGas += costGas;
            if(curGas < 0){
                index = i + 1;
                curGas = 0;
            } 
        }
        return totalGas >= 0 ? index : -1;
    }
}
```

# 多维动态规划

# 技巧

# 两数相加

![image-20250714191546122](/notes-assets/Algorithm/assets/image-20250714191546122.png)

1. **对齐处理**：
   - 短链表末尾补零，使其与长链表长度一致。
   - **示例**：`1→2→3`+ `4→5`视为 `1→2→3`+ `4→5→0`。
2. **逐位相加**：
   - 同步遍历两链表，对应位相加并计算进位。
   - 当前位结果 = (节点1值 + 节点2值 + 进位) % 10。
   - 新进位 = (节点1值 + 节点2值 + 进位) / 10。
3. **处理最终进位**：
   - 若遍历结束后仍有进位，需新增节点。

```C#
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     public int val;
 *     public ListNode next;
 *     public ListNode(int val=0, ListNode next=null) {
 *         this.val = val;
 *         this.next = next;
 *     }
 * }
 */

public class Solution {
    public ListNode AddTwoNumbers(ListNode l1, ListNode l2) { 
        int carry = 0;  
        ListNode newNode = new ListNode(0);
        ListNode current = newNode;
        while(l1!=null || l2!=null ||carry!=0){
            int x = (l1 != null) ? l1.val : 0;
            int y = (l2 != null) ? l2.val : 0;

            int num = x + y + carry;
            carry = num /10;
            current.next = new ListNode(num % 10);
            current = current.next;

            if (l1 != null) l1 = l1.next;
            if (l2 != null) l2 = l2.next;
        }
        /*ListNode pre = null;
        ListNode Next = null;
        while(current!=null){
            Next = current.next;
            current.next = pre;
            pre = current;
            current = Next;
        }
        return pre;
        */
        return newNode.next;
    }
}
```

# [包含所有 1 的最小矩形面积 I](https://leetcode.cn/problems/find-the-minimum-area-to-cover-all-ones-i/)

![image-20250822182205151](/notes-assets/Algorithm/assets/image-20250822182205151.png)

遍历二维网格中的每个元素，记录所有值为 1 的元素所在位置的最小行索引（minX）、最大行索引（maxX）、最小列索引（minY）和最大列索引（maxY），这些索引分别构成了包含所有 1 的最小矩形的上下左右边界，最后通过公式（maxX - minX + 1）×（maxY - minY + 1）计算该矩形的面积，即为所求的最小面积。

```C#
public class Solution {
    public int MinimumArea(int[][] grid) {
        int minX = grid.Length - 1;   
        int maxX = 0;                 
        int minY = grid[0].Length - 1;
        int maxY = 0;                 
        for(int i = 0;i < grid.Length;i++){
            for(int j = 0;j < grid[0].Length;j++){
                if(grid[i][j] == 1){
                    minX = Math.Min(minX,i);
                    maxX = Math.Max(maxX,i);
                    minY = Math.Min(minY,j);
                    maxY = Math.Max(maxY,j);
                }
            }
        }
        
        return (maxX - minX + 1)*(maxY - minY + 1);
    }
}
```

# 

