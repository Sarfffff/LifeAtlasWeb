---
title: 代码随想录刷题
date: 2026-06-27 03:17:00
categories:
  - 算法与数据结构
tags:
  - Algorithm
  - 笔记
---
#  	数组

## 二分查找

### [二分查找](https://leetcode.cn/problems/binary-search/)

**这道题目的前提是数组为有序数组**，同时题目还强调**数组中无重复元素**，因为一旦有重复元素，使用二分查找法返回的元素下标可能不是唯一的，这些都是使用二分法的前提条件，当大家看到题目描述满足如上条件的时候，可要想一想是不是可以用二分法了。

二分查找涉及的很多的边界条件，逻辑比较简单，但就是写不好。例如到底是 `while(left < right)` 还是 `while(left <= right)`，到底是`right = middle`呢，还是要`right = middle - 1`呢？

大家写二分法经常写乱，主要是因为**对区间的定义没有想清楚，区间的定义就是不变量**。要在二分查找的过程中，保持不变量，就是在while寻找中每一次边界的处理都要坚持根据区间的定义来操作，这就是**循环不变量**规则。

写二分法，区间的定义一般为两种，左闭右闭即[left, right]，或者左闭右开即[left, right)。

![image-20251124202814065](/notes-assets/Algorithm/assets/image-20251124202814065.png)

```C#
public class Solution {
    public int Search(int[] nums, int target) {
        int L = 0;
        int R = nums.Length - 1;
        while(L <= R){
            int mid = (L + ((R - L) >> 1));
            if(nums[mid] == target)
                return mid;
            else if(target > nums[mid])
                L = mid + 1;
            else
                R = mid - 1;
        }
        return -1;
    }
} 
```

### 相关题目

#### [搜索插入位置](https://leetcode.cn/problems/search-insert-position/)

![image-20251124202942432](/notes-assets/Algorithm/assets/image-20251124202942432.png)

```C#
public class Solution {
    public int SearchInsert(int[] nums, int target) {
        int L = 0;
        int R = nums.Length - 1;
        while( L <= R){
            int mid = L + ((R - L) >> 1);
            if( nums[mid] == target)
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

#### [在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)

![image-20251124203003278](/notes-assets/Algorithm/assets/image-20251124203003278.png)

```C#
public class Solution {
    public int[] SearchRange(int[] nums, int target) {
       int L = 0;
       int R = nums.Length - 1;
       int start = -1;
       int end = -1;
       while(L <= R){
            int mid = (L + ((R - L) >> 1));
            if(target == nums[mid]){
                start = mid;
                end = mid;
                break;
            }
            else if(nums[mid] < target)
                L = mid + 1;
            else
                R = mid - 1;
       }
       while(start > 0 && nums[start - 1] == target)start--;
       while(end < nums.Length - 1&& nums[end + 1] == target)end++;
        return new int[2]{start,end};
    }
} 
```

#### [x 的平方根 ](https://leetcode.cn/problems/sqrtx/)

```C#
public class Solution {
    public int MySqrt(int x) {
        if (x == 0) return 0;
        if (x == 1) return 1;
        int L = 0;
        int R = x;
        int ans = 0;
        while(L <= R){
            int mid = (L + (R - L) / 2);
            if(mid <= x / mid)
            {
                ans = mid;
                L = mid + 1;
            }
            else
                R = mid - 1;
        }
        return ans;
    }
}
```

#### [有效的完全平方数](https://leetcode.cn/problems/valid-perfect-square/)

```c#
public class Solution {
    public bool IsPerfectSquare(int num) {
        if (num == 0 || num == 1) return true;
        int L = 0;
        int R = num;
        bool ans = false;
        while(L <= R){
            int mid = (L + (R - L) / 2);
            if(mid == num / mid){
                if(num % mid == 0){
                    ans = true;
                }
                break;
            }
            else if(mid < num / mid)
                L = mid + 1;
            else 
                R = mid - 1;
        }
        return ans;
    }
}
```

## 移除元素

### [移除元素](https://leetcode.cn/problems/remove-element/)

![image-20251124205121506](/notes-assets/Algorithm/assets/image-20251124205121506.png)

**暴力解法**：发现需要移除的元素，就将数组集体向前移动一位

```C#
public class Solution{
    public int RemoveElement(int[] nums, int val) {
 		int k = nums.Length;
        for(int i = 0;i < nums.Length;i++){
            if(nums[i] == val){
                for(int j = i + 1;j < nums.Length;j++)
                    nums[j - 1] = nums[j];
            }
            i--;
            k--;
        }
        return k;
    }
}
```

**双指针法**：通过一个快指针和慢指针在一个for循环下完成两个for循环的工作。

定义快慢指针

- 快指针：寻找新数组的元素 ，新数组就是不含有目标元素的数组
- 慢指针：指向更新 新数组下标的位置

```C#
public class Solution{
    public int RemoveElement(int[] nums, int val) {
        int index =0;
        for(int i = 0;i < num.Length;i++)
        {
			if(nums[i] != val)
                nums[index++] = nums[i]; 
        }
        return k;
    }
}
```

### 相关题目

#### [删除有序数组中的重复项](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/)

![image-20251125152655079](/notes-assets/Algorithm/assets/image-20251125152655079.png)

```C#
public class Solution {
    public int RemoveDuplicates(int[] nums) {
 		int k = 1;
        for(int i = 1;i < nums.Length;i++){
			if(nums[i] == nums[i - 1]){
                nums[k] = nums[i];
            }
            else{
                nums[k++] = nums[i];
            }
        }
        return k;
    }
}
```

#### [移动零](https://leetcode.cn/problems/move-zeroes/)

![image-20251125153003507](/notes-assets/Algorithm/assets/image-20251125153003507.png)

```C#
public class Solution {
    public void MoveZeroes(int[] nums) {
        int L = 0;
        for(int i = 0;i < nums.Length;i++){
            if(nums[i] != 0)
            {
               nums[L] = nums[i];
               L++;
            }
        }    
        for(int i = L ;i < nums.Length ;i++)
            nums[i] = 0;
    }
}
```

#### [有序数组的平方](https://leetcode.cn/problems/squares-of-a-sorted-array/)

![image-20251125164214064](/notes-assets/Algorithm/assets/image-20251125164214064.png)

```C#
public class Solution {
    public int[] SortedSquares(int[] nums) {
        int[] ans = new int[nums.Length];
        int k = 0;
        for(int i = 0;i < nums.Length;i++){
            nums[i] = nums[i] * nums[i];
        }
        int Left = 0;
        int Right = nums.Length - 1;
        int n = nums.Length - 1;
        while(Left <= Right){
            if(nums[Left] < nums[Right]){
                ans[n] = nums[Right];
                Right--;
                n--;
            }
            else if(nums[Left] > nums[Right]){
                ans[n] = nums[Left];
                Left++;
                n--;
            }
            else{
                ans[n] = nums[Right];
                Right--;
                n--;
            }
        }
        return ans;
    }
}
```

## 有序数组的平方

### [有序数组的平方](https://leetcode.cn/problems/squares-of-a-sorted-array/)

![image-20251125164214064](/notes-assets/Algorithm/assets/image-20251125164214064.png)

暴力求解：将数组平方后使用自带的函数直接排序即可

这个时间复杂度是 O(n + nlogn)， 可以说是O(nlogn)的时间复杂度

```C#
public class Solution {
    public int[] SortedSquares(int[] nums) {
        for(int i = 0;i < nums.Length;i++)
        {
            nums[i] *= nums[i];
        }
        Array.Sort(nums);
    	return nums;
    }
}
    
```

数组其实是有序的， 只不过负数平方之后可能成为最大数了。那么数组平方的最大值就在数组的两端，不是最左边就是最右边，不可能是中间。此时可以考虑双指针法了，i指向起始位置，j指向终止位置。

- 定义一个新数组result，和A数组一样的大小，让k指向result数组终止位置。
- 如果`A[i] * A[i] < A[j] * A[j]` 那么`result[k--] = A[j] * A[j];` 。
- 如果`A[i] * A[i] >= A[j] * A[j]` 那么`result[k--] = A[i] * A[i];`

```C#
public class Solution {
    public int[] SortedSquares(int[] nums) {
        int[] ans = new int[nums.Length];
        int k = 0;
        for(int i = 0;i < nums.Length;i++){
            nums[i] = nums[i] * nums[i];
        }
        int Left = 0;
        int Right = nums.Length - 1;
        int n = nums.Length - 1;
        while(Left <= Right){
            if(nums[Left] < nums[Right]){
                ans[n] = nums[Right];
                Right--;
                n--;
            }
            else if(nums[Left] > nums[Right]){
                ans[n] = nums[Left];
                Left++;
                n--;
            }
            else{
                ans[n] = nums[Right];
                Right--;
                n--;
            }
        }
        return ans;
    }
}
```

## 长度最小的子数组

[长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/)

![image-20251125164803821](/notes-assets/Algorithm/assets/image-20251125164803821.png)

```C#
public class Solution {
    public int MinSubArrayLen(int target, int[] nums) {
        int sum = 0;
        int Len = nums.Length;
        int L = 0;
        for(int R = 0;R < nums.Length;R++){
            sum += nums[R];
            while(sum >=target){
                Len = Math.Min(Len, R - L + 1);
                sum -= nums[L];
                L++;
            }
        }
        if(sum < target && L == 0)
            return 0;
        return Len;
    }
}
```

#### [水果成篮](https://leetcode.cn/problems/fruit-into-baskets/)

![image-20251125173759334](/notes-assets/Algorithm/assets/image-20251125173759334.png)

题意：**在一排果树上，用两个篮子摘水果，每个篮子只能装同一种水果，必须从某棵树开始，顺着往右挨个摘（每棵树只能摘 1 个，不能跳着摘），一旦遇到第三种水果就停。问你最多能摘多少个水果？**

**例子 1：简单情况**

fruits = [1,2,1]

- 从第 1 棵树（1）开始：

  

  篮子 1 装 1，篮子 2 装 2，接下来还是 1（符合），一共摘 3 个（最多）。

- 结果：3

**例子 2：遇到第三种水果就停**

fruits = [1,2,3,2,2]

- 从第 1 棵树（1）开始：摘 1（篮 1）→2（篮 2）→下一棵是 3（第三种），停！摘了 2 个；
- 从第 2 棵树（2）开始：摘 2（篮 1）→3（篮 2）→2（符合篮 1）→2（符合篮 1），一共摘 4 个（最多）；
- 结果：4

**例子 3：只有一种水果**

fruits = [0,0,0,0]

- 两个篮子都能装 0（虽然没必要，但规则允许），能摘所有 4 个；
- 结果：4

**例子 4：三种水果连续，只能选前两种**

fruits = [1,3,5,7]

- 最多只能摘 2 个（比如 1 和 3，3 和 5，5 和 7）；
- 结果：2

**核心规则再提炼：**

1. 工具：2 个篮子，每个篮子只能装 “一种水果”（比如篮 1 装苹果，就不能装橘子）；
2. 采摘方式：从任意一棵树开始，**必须向右挨个摘**（不能回头、不能跳），每棵树摘 1 个；
3. 停止条件：遇到 “既不是篮 1 水果，也不是篮 2 水果” 的树，就不能再摘了；
4. 目标：找到 “能摘到最多水果” 的采摘方式，返回这个最大数量。



**解题思路**：最多能摘多少个水果？代表就是寻找最大窗口（连续的最大子数组），因为一个果树只能摘一个水果。

**解法**：关于找最大连续子数组一般考虑滑动窗口来求解，哈希表则是用来记录窗口内的元素类型及数量，以便快速判断窗口的水果数是否超过2中

- 初始化最大值maxTotal 以及左指针，同时定义一个<int,int>的字典用于记录水果类型和数量
- 遍历数组（右指针 `R` 从 0 到数组末尾），每次将当前水果 `fruits[R]` 加入窗口。若已存在则数量 + 1，若不存在则初始化为 1
- 当哈希表的键值对数量 > 2（窗口内水果类型超 2 种，违反规则）时，触发收缩：

- - 取出左边界水果类型 `fruits[L]`；
  - 将该类型在哈希表中的数量减 1（相当于移除一个左边界水果）；
  - 若数量减为 0，从哈希表中删除该类型（避免残留导致约束判断错误）；
  - 左指针 `L` 右移，缩小窗口范围；
  - 重复以上操作，直到哈希表的键值对数量 ≤ 2（窗口合法）。
- 每次窗口调整（扩张或收缩后），窗口均为合法状态，计算当前窗口长度 `R - L + 1`，若当前窗口长度大于 `maxTotal`，则更新 `maxTotal` 为当前窗口长度。

**核心逻辑可概括为：**右指针负责 “找新水果”（扩张范围），左指针负责 “清违规”（保证合法），哈希表负责 “记类型”（判断约束），最终筛选出最长合法窗口**。**

```C#
public class Solution {
    public int TotalFruit(int[] fruits) {
        int L = 0;
        int maxTotal = 0;//记录最大采摘数量,也就是窗口大小
        Dictionary<int,int> Dic = new Dictionary<int,int>();
        for(int R = 0;R < fruits.Length;R++){
            int type = fruits[R];
            Dic[type] = Dic.ContainsKey(type) ? Dic[type] + 1 : 1;  //统计每种水果的类型和摘取数量
            while(Dic.Count > 2) //超过篮子数量
            {
                int leftType = fruits[L];  //直接删除左边界的水果值，因为每次都会比较一次
                Dic[leftType]--;

                //如果删除一次后发现为0了，去除这个数
                if(Dic[leftType] == 0)
                    Dic.Remove(leftType);
                L++;
            }
            //不是一次找到最大值，而是找到所有的可能里面的最大值
            int currentWindowSize = R - L + 1;  // 计算当前合法窗口的长度
            if (currentWindowSize > maxTotal) {  // 比之前记录的最大值大，就更新
                maxTotal = currentWindowSize;
            }
        }
        return maxTotal;
    }
}
```

# 链表

什么是链表，链表是一种通过指针串联在一起的线性结构，每一个节点由两部分组成，一个是数据域一个是指针域（存放指向下一个节点的指针），最后一个节点的指针域指向null（空指针的意思）。

链表的入口节点称为链表的头结点也就是head。

如图所示： ![链表1](/notes-assets/Algorithm/assets/20200806194529815.png)

**链表的类型**

接下来说一下链表的几种类型:

**单链表**

刚刚说的就是单链表。

**双链表**

单链表中的指针域只能指向节点的下一个节点。

双链表：每一个节点有两个指针域，一个指向下一个节点，一个指向上一个节点。

双链表 既可以向前查询也可以向后查询。

如图所示： ![链表2](/notes-assets/Algorithm/assets/20200806194559317.png)

**循环链表**

循环链表，顾名思义，就是链表首尾相连。

循环链表可以用来解决约瑟夫环问题。

![链表4](/notes-assets/Algorithm/assets/20200806194629603.png)

**链表的存储方式**

了解完链表的类型，再来说一说链表在内存中的存储方式。

数组是在内存中是连续分布的，但是链表在内存中可不是连续分布的。

链表是通过指针域的指针链接在内存中各个节点。

所以链表中的节点在内存中不是连续分布的 ，而是散乱分布在内存中的某地址上，分配机制取决于操作系统的内存管理。

如图所示：

![链表3](/notes-assets/Algorithm/assets/20200806194613920.png)

这个链表起始节点为2， 终止节点为7， 各个节点分布在内存的不同地址空间上，通过指针串联在一起。

## 移除链表元素

[移除链表元素](https://leetcode.cn/problems/remove-linked-list-elements/)

![image-20251126203435200](/notes-assets/Algorithm/assets/image-20251126203435200.png)

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
    public ListNode RemoveElements(ListNode head, int val) {
        while(head!=null){  //判断头节点的值是否 等于 val， 如果等于，则直接删除
            if(head.val != val)
                break;
            head = head.next;
        }  
        ListNode pre = head;
        ListNode cur = head;
        
        while(cur != null){
            if(cur.val == val){
				pre.next = cur.next;
            }
            else{
				pre = cur;
            }
            cur = cur.next;
        }
        return head;
    }
}
```

## [设计链表](https://leetcode.cn/problems/design-linked-list/)

![image-20251126225505373](/notes-assets/Algorithm/assets/image-20251126225505373.png)

```C#
public class Node{
    public int val;
    public Node next;
    public Node(int val){
        this.val = val;
        next = null;
    }
}

public class MyLinkedList {
    Node dummyHead;
    int count;

    public MyLinkedList() {
        dummyHead = new Node(0);
        count = 0;
    }
    
    public int Get(int index) {
        if(index >= count || index < 0)
            return -1;
        Node cur = dummyHead.next;
        
        while(index > 0)
        {
            cur = cur.next;
            index--;
        }
        return cur.val;
    }
    
    public void AddAtHead(int val) {
        AddAtIndex(0,val);
    }
    
    public void AddAtTail(int val) {
        AddAtIndex(count,val);
    }
    
    public void AddAtIndex(int index, int val) {
        if(index > count || index < 0)
            return;
        Node newNode = new Node(val);
        Node cur = dummyHead;
        
        // 移动到要插入位置的前一个节点
        while(index > 0) {
            cur = cur.next;
            index--;
        }
        
        newNode.next = cur.next;
        cur.next = newNode;
        count++;
    }
    
    public void DeleteAtIndex(int index) {
        if(index >= count || index < 0)
            return;
        Node cur = dummyHead;
        
        // 移动到要删除位置的前一个节点
        while(index > 0) {
            cur = cur.next;
            index--;
        }
        
        cur.next = cur.next.next;
        count--;
    }
}
```

## 反转链表

### [反转链表](https://leetcode.cn/problems/reverse-linked-list/)

![image-20251126225555802](/notes-assets/Algorithm/assets/image-20251126225555802.png)

首先定义一个cur指针，指向头结点，再定义一个pre指针，初始化为null。

然后就要开始反转了，首先要把 cur->next 节点用tmp指针保存一下，也就是保存一下这个节点。

为什么要保存一下这个节点呢，因为接下来要改变 cur->next 的指向了，将cur->next 指向pre ，此时已经反转了第一个节点了。

接下来，就是循环走如下代码逻辑了，继续移动pre和cur指针。

最后，cur 指针已经指向了null，循环结束，链表也反转完毕了。 此时我们return pre指针就可以了，pre指针就指向了新的头结点。

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
    public ListNode ReverseList(ListNode head) {
        ListNode next = null;
        ListNode prev = null;
        while(head !=null){
            next = head.next;
            head.next = prev;   //将当前节点的前一个节点变为下一个节点，也就是翻转，由原本的指向下一个的，指向前一个，最开始前一个为null
            
            //继续往后翻转
            prev = head;
            head=  next;
        }
        return prev;
    }
}
```

## [两两交换链表中的节点](https://leetcode.cn/problems/swap-nodes-in-pairs/)

![image-20251126231453529](/notes-assets/Algorithm/assets/image-20251126231453529.png)

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
```

## **[删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)**

![image-20251128211802422](/notes-assets/Algorithm/assets/image-20251128211802422.png)

```C#
public class Solution{
    public ListNode RemoveNthFromEnd(ListNode head, int n) {
        if(head == null || head.Length == 0)
            return null;
        int Len = 0;
        ListNode cur = head;
        while(cur != null){
            Len++;
            cur = cur.next;
        }
        
        int m = Len - n;
        if(m == 0)   //删除头节点
        {
            ListNode newHead = head.next;
            head.next = null; 
            return newHead;
        }
        cur = head;
        while(m > 1){
			m--;
            cur = cur.next;
        }
        ListNode ToDelete = cur.next;
        if(ToDelete != null)
        {
            cur.next = ToDelete.next;
            ToDelete.next = null;
        }
        return head;
    }
}
```

双指针法

```C#
public class Solution{
    public ListNode RemoveNthFromEnd(ListNode head, int n) {
 		if(head == null)
            return null;
        ListNode fast = head;
        ListNode slow = head;
        while(n > 0 && fast.next != null){
            fast = fast.next;  //先让fast走n步
        	n--;
        }
        fast = fast.next;
        while(fast.next != null){
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;
        return head;
    }
}
```

## [链表相交](https://leetcode.cn/problems/intersection-of-two-linked-lists-lcci/)

![image-20251129150904734](/notes-assets/Algorithm/assets/image-20251129150904734.png)

```C#
public class Solution {
    public ListNode GetIntersectionNode(ListNode headA, ListNode headB) {
        if(headA == null || headB == null )
            return null;
        int n = 0;

        ListNode cur1 = headA;
        ListNode cur2 = headB;
        while(cur1 != null){
            n++;
            cur1 = cur1.next;
        }
        while(cur2 != null){
            n--;
            cur2 = cur2.next;
        }
        cur1 = n > 0 ? headA : headB;//找到长链表
        cur2 = cur1 == headA ? headB : headA;
        n = Math.Abs(n);
        while(n-- != 0){
            cur1 = cur1.next;
        }
        while(cur1 != cur2){
            cur1 = cur1.next;
            cur2 = cur2.next;
        }
        return cur1;
    }
}
```

## [环形链表 II](https://leetcode.cn/problems/linked-list-cycle-ii/)

![image-20251129150956324](/notes-assets/Algorithm/assets/image-20251129150956324.png)

```C#
public class Solution {
    public ListNode DetectCycle(ListNode head) {
 		if(head == null || head.next ==null){
            return null;
        }
        ListNode slow = head.next;
        ListNode fast = head.next.next;
        while(fast.next != null && fast.next.next != null){
            if(slow == fast)
                break;
            fast = fast.next.next;
            slow = slow.next;
        }
        if(fast == null || fast.next == null)
            return null;
        fast = head;
        while(fast != slow){
            fast = fast.next;
            slow = slow.next;
        }
        return slow;
    }
}
```



# 哈希表

![哈希表1](/notes-assets/Algorithm/assets/20210104234805168.png)

那么哈希表能解决什么问题呢，**一般哈希表都是用来快速判断一个元素是否出现集合里。**

例如要查询一个名字是否在这所学校里。

要枚举的话时间复杂度是O(n)，但如果使用哈希表的话， 只需要O(1)就可以做到。

我们只需要初始化把这所学校里学生的名字都存在哈希表里，在查询的时候通过索引直接就可以知道这位同学在不在这所学校里了。

将学生姓名映射到哈希表上就涉及到了**hash function ，也就是哈希函数**。

## 哈希函数

哈希函数，把学生的姓名直接映射为哈希表上的索引，然后就可以通过查询索引下标快速知道这位同学是否在这所学校里了。

哈希函数如下图所示，通过hashCode把名字转化为数值，一般hashcode是通过特定编码方式，可以将其他数据格式转化为不同的数值，这样就把学生名字映射为

哈希表上的索引数字了。

![哈希表2](/notes-assets/Algorithm/assets/2021010423484818.png)

如果hashCode得到的数值大于 哈希表的大小了，也就是大于tableSize了，怎么办呢？

此时为了保证映射出来的索引数值都落在哈希表上，我们会在再次对数值做一个取模的操作，这样我们就保证了学生姓名一定可以映射到哈希表上了。

此时问题又来了，哈希表我们刚刚说过，就是一个数组。

如果学生的数量大于哈希表的大小怎么办，此时就算哈希函数计算的再均匀，也避免不了会有几位学生的名字同时映射到哈希表 同一个索引下标的位置。

接下来**哈希碰撞**登场

### 哈希碰撞

如图所示，小李和小王都映射到了索引下标 1 的位置，**这一现象叫做哈希碰撞**。

![哈希表3](/notes-assets/Algorithm/assets/2021010423494884.png)

般哈希碰撞有两种解决方法， 拉链法和线性探测法。

### 拉链法

刚刚小李和小王在索引1的位置发生了冲突，发生冲突的元素都被存储在链表中。 这样我们就可以通过索引找到小李和小王了

![哈希表4](/notes-assets/Algorithm/assets/20210104235015226.png)

（数据规模是dataSize， 哈希表的大小为tableSize）

其实拉链法就是要选择适当的哈希表的大小，这样既不会因为数组空值而浪费大量内存，也不会因为链表太长而在查找上浪费太多时间。

### 线性探测法

使用线性探测法，一定要保证tableSize大于dataSize。 我们需要依靠哈希表中的空位来解决碰撞问题。

例如冲突的位置，放了小李，那么就向下找一个空位放置小王的信息。所以要求tableSize一定要大于dataSize ，要不然哈希表上就没有空置的位置来存放 冲突的数据了。如图所示：

![哈希表5](/notes-assets/Algorithm/assets/20210104235109950.png)。

## [有效的字母异位词](https://leetcode.cn/problems/valid-anagram/)

![image-20251129153909183](/notes-assets/Algorithm/assets/image-20251129153909183.png)

```C#
public class Solution {
    public bool IsAnagram(string s, string t) {
        int[] ans = new int[26];
        int sLen = s.Length;
        int tLen = t.Length;
        if(sLen != tLen)
            return false;
        for(int i = 0;i < sLen;i++){
            ans[s[i] - 'a']++;  //将s的每个字符都存入数组
            ans[t[i] - 'a']--;  //如果t中的字符与s的相同则删除
        }
        foreach(var i in ans){
            if(i != 0)
                return false;  // ==0 代表两个字符串有相同的字母
        }
        return true;
    }
}
```

进阶：如果输入字符串包含 unicode 字符怎么办？你能否调整你的解法来应对这种情况？

此时不能使用固定长度的数组了，因为unicode字符大于26，可以采用字典来解决

```C#
public class Solution {
    public bool IsAnagram(string s, string t) {
        int sLen = s.Length;
        int tLen = t.Length;
        if (sLen != tLen)  
            return false;
            
        Dictionary<char, int> Dic = new Dictionary<char, int>();
        
        // 统计 s 中字符出现次数
        for (int i = 0; i < sLen; i++) {
            if (Dic.ContainsKey(s[i])) {
                Dic[s[i]]++;
            } else {
                Dic[s[i]] = 1;
            }
        }
        
        // 用 t 中的字符递减计数
        for (int i = 0; i < tLen; i++) {
            if (!Dic.ContainsKey(t[i])) {
                return false; // t 中有 s 中没有的字符
            }
            Dic[t[i]]--;
            if (Dic[t[i]] < 0) {
                return false; // t 中该字符出现次数多于 s
            }
        }
        
        return true;
    }
}
```

### 相关题目

#### [赎金信](https://leetcode.cn/problems/ransom-note/)

![image-20251129173210343](/notes-assets/Algorithm/assets/image-20251129173210343.png)

```C#
public class Solution {
    public bool CanConstruct(string ransomNote, string magazine) {
        Dictionary<char,int> Dic = new Dictionary<char,int>();
        foreach(var i in magazine){
            if(Dic.ContainsKey(i)){
                Dic[i]++;
            else
                Dic[i] = 1;
            }
        }
        foreach(var i in ransomNote){
            if(!Dic.ContainsKey(i) || Dic[i] == 0)
                return false;
           	Dic[i]--;
            if(Dic[i] == 0)
                Dic.Remove(i);
        }
    }
}
```

### [字母异位词分组](https://leetcode.cn/problems/group-anagrams/)

![image-20251129173700568](/notes-assets/Algorithm/assets/image-20251129173700568.png)

```C#
public class Solution {
    public IList<IList<string>> GroupAnagrams(string[] strs) {
 		Dictionary<string,List<string>>Dic = new Dictionary<string,List<string>>();
        foreach(var str in strs){
            char[] c = str.ToCharArray();  
            Array.Sort(c);  //每个子字符串都排序
            string key = new string(c);
            
            if(!Dic.ContainsKey(key))
                Dic[key] = new List<string>();
            Dic[key].Add(str);
        }
        return new List<IList<string>>(Dic.Values);
    }
}
```

### [找到字符串中所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/)

![image-20251129174508949](/notes-assets/Algorithm/assets/image-20251129174508949.png)

```C#
using System.Collections.Generic;

public class Solution {
    public IList<int> FindAnagrams(string s, string p) {
        List<int> result = new List<int>();
        // 边界条件：p比s长，直接返回空
        if (p.Length > s.Length) return result;
        
        Dictionary<char, int> need = new Dictionary<char, int>();
        Dictionary<char, int> window = new Dictionary<char, int>();
        
        // 初始化need字典：统计p中各字符的需求数量
        foreach (char c in p) {
            need[c] = need.ContainsKey(c) ? need[c] + 1 : 1;
        }
        
        int left = 0, right = 0;
        int valid = 0; // 满足需求的字符种类数  
        while (right < s.Length) {
            // 1. 右边界扩张：纳入当前字符c
            char c = s[right];
            right++;
            
            // 若c是需要的字符，更新window和valid
            if (need.ContainsKey(c)) {
                // 优化：用TryGetValue减少一次查询
                if (!window.TryGetValue(c, out int count)) {
                    count = 0;
                }
                window[c] = count + 1;
                
                // 当该字符的数量满足需求时，valid+1
                if (window[c] == need[c]) {
                    valid++;
                }
            }
            
            // 2. 窗口长度等于p的长度时，判断是否是异位词，并收缩左边界
            while (right - left == p.Length) {
                // 关键修复：valid等于need的种类数，说明是异位词
                if (valid == need.Count) {
                    result.Add(left); // 记录起始索引
                }
                
                // 收缩左边界：移除字符d
                char d = s[left];
                left++;
                
                // 若d是需要的字符，更新window和valid
                if (need.ContainsKey(d)) {
                    // 若移除前该字符刚好满足需求，valid-1
                    if (window[d] == need[d]) {
                        valid--;
                    }
                    // 递减计数，若为0则删除键（避免冗余）
                    window[d]--;
                }
            }
        }
        return result;
    }
}
```

## [两个数组的交集](https://leetcode.cn/problems/intersection-of-two-arrays/)

![image-20251129180851086](/notes-assets/Algorithm/assets/image-20251129180851086.png)

```C#
public class Solution {
    public int[] Intersection(int[] nums1, int[] nums2) {
        HashSet<int> ans = new HashSet<int>(nums1);
        HashSet<int> res = new HashSet<int>();
        for(int i = 0;i < nums2.Length;i++){
            if(ans.Contains(nums2[i]))
                res.Add(nums2[i]);
        }
        return res.ToArray();
    }
}
```

## [快乐数](https://leetcode.cn/problems/happy-number/)

![image-20251129182112314](/notes-assets/Algorithm/assets/image-20251129182112314.png)

题目中说了会 **无限循环**，那么也就是说**求和的过程中，sum会重复出现，这对解题很重要！**

所以这道题目使用哈希法，来判断这个sum是否重复出现，如果重复了就是return false， 否则一直找到sum为1为止。

判断sum是否重复出现就可以使用HashSet，使用HashSet来判断是否出现过

```C#
public class Solution {
    public bool IsHappy(int n) {
        HashSet<int> ans = new HashSet<int>();
        while(true){
            int sum = GetNum(n);
            if(sum == 1)
                return true;
            if(ans.Contains(sum)) //说明已经出现过,出现无线循环
                return false;
            else
                ans.Add(sum);
            n = sum;
        }
    }
    public int GetNum(int n){
        int sum = 0;
        while (n != 0) {
            sum += (n % 10) * (n % 10);
            n /= 10;
        }
        return sum;
    }
}
```

## [两数之和](https://leetcode.cn/problems/two-sum/)

![image-20251129183425114](/notes-assets/Algorithm/assets/image-20251129183425114.png)

暴力法：

```C#
public class Solution {
   public int[] TwoSum(int[] nums, int target) 
   {
 		for(int i = 0;i < nums.Length;i++){
            for(int j = i + 1;j < nums.Length;j++){
                if(nums[i] + nums[j] == target)
                {
                    return new int[]{i,j};
                }
            }
        }      
   }
}
```

哈希法

```C#
public class Solution {
   public int[] TwoSum(int[] nums, int target) 
   {
		Dictionary<int,int> Dic = new Dictionary<int,int>();  //键为nums[i] , 值为 下标 i
       	for(int i = 0;i < nums.Length;i++){
			int sum = nums[i];
            if(Dic.ContainsKey(target - sum)){  //判断之前是否出现过 与 本次遍历的数 相加 等于 target的值
                return new int[]{i,Dic[target - sum]};
            }
            Dic[sum] = i;
        }
   }
}
```

## [四数相加 II](https://leetcode.cn/problems/4sum-ii/)

![image-20251130005407587](/notes-assets/Algorithm/assets/image-20251130005407587.png)

```C#
public class Solution {
    public int FourSumCount(int[] nums1, int[] nums2, int[] nums3, int[] nums4) {
        Dictionary<int,int> Dic = new Dictionary<int,int>();  //键存值，值存次数
        int count = 0;
        foreach(var i in nums1){
            foreach(var j in nums2){
                int sum = i + j;
                if(Dic.ContainsKey(sum))
                    Dic[sum]++;
                else
                    Dic[sum] = 1;
            }
        }

        foreach(var i in nums3){
            foreach(var j in nums4){
                int sum = i + j;
                if(Dic.TryGetValue(-sum, out var result))
                    count+=   ;
                
            }
        }
        return count;
    }
}
```



## [三数之和](https://leetcode.cn/problems/3sum/)

![image-20251130005433880](/notes-assets/Algorithm/assets/image-20251130005433880.png)

```C#
public class Solution {
    public IList<IList<int>> ThreeSum(int[] nums) {
 		var ans = new List<IList<int>>();
        if (nums == null || nums.Length < 3)
            return ans;   
        Array.Sort(nums);
        for(int i = 0;i < nums.Length - 2;i++){
			int j = i + 1;
            int t = nums.Length - 1;
            
            if(i > 0 &&nums[i] == nums[i - 1])
        		continue;
            while(j < t){
				int sum = nums[i] + nums[j] + nums[t];
                if(sum == 0){
                    ans.Add(new List<int>{nums[i],nums[j],nums[t]});
                    while(j < t && nums[j] == nums[j + 1])j++;
                    while(j < t && nums[t] == nums[t - 1])t--;
                    
                    j++;
                    t--;
                }
                else if(sum > 0)
                	t--;
                else
                    j++;
            }
        }
        return ans;
    }
}
```

## [四数之和](https://leetcode.cn/problems/4sum/)

![image-20251130151444534](/notes-assets/Algorithm/assets/image-20251130151444534.png)

对于本题，其实原理与三数之和的原理相识，都是采取固定相应的数，同时使用双指针来进行操作。而本题是四数之和，也就是需要固定2个数字，然后采用双指针来进行操作。同样需要先进行排序操作，但是要进行一些剪枝操作，如**if(nums[i] > target && nums[i] >= 0)**，来减少重复操作，同时这个是固定的第一个数，此时要进行内存循环，固定第二个数**if(nums[k] + nums[i] > target && nums[i] + nums[k] >= 0)**。剩余的其他操作与三数之和类似。

```C#
public class Solution {
    public IList<IList<int>> FourSum(int[] nums, int target) {
        var ans = new List<IList<int>>();
        if (nums == null || nums.Length < 4)
            return ans;
        Array.Sort(nums);
        for(int i = 0;i < nums.Length - 2;i++){
            if(i > 0 && nums[i - 1] == nums[i])
                continue;
            if(nums[i] > target && nums[i] >= 0)
                break;
            for(int k = i + 1; k < nums.Length - 2;k++){
                int j = k + 1;
                int t = nums.Length - 1;
                if(nums[k] == nums[k - 1] && k > i + 1)
                    continue;
                if(nums[k] + nums[i] > target && nums[i] + nums[k] >= 0)
                    break;
                while(j < t){
                    long sum = nums[i] + nums[k] + nums[j] + nums[t];
                    if(sum == target){
                        ans.Add(new List<int>{nums[i],nums[k],nums[j],nums[t]});
                        while(j < t && nums[j] == nums[j + 1])j++;
                        while(j < t && nums[t] == nums[t - 1])t--;

                        j++;
                        t--; 
                    }
                    else if(sum < target)
                        j++;
                    else
                        t--;
                }

            }
        }
        return ans;
    }
}
```

# 字符串

## 反转字符串

### [反转字符串](https://leetcode.cn/problems/reverse-string/)

![image-20251130152754225](/notes-assets/Algorithm/assets/image-20251130152754225.png)

因为字符串也是一种数组，所以元素在内存中是连续分布。对于字符串，我们定义两个指针（也可以说是索引下标），一个从字符串前面，一个从字符串后面，两个指针同时向中间移动，并交换元素。

```C#
public class Solution {
    public void ReverseString(char[] s) {
        for(int i = 0,j = s.Length - 1;i < s.Length / 2;i++,j--){
            Swap(s,i,j);
        }
    }
    public void Swap(char[] s,int i,int j){
        char temp = s[i];
        s[i] = s[j];
        s[j] = temp;
    }
}
```

## [反转字符串 II](https://leetcode.cn/problems/reverse-string-ii/)

![image-20251130164010125](/notes-assets/Algorithm/assets/image-20251130164010125.png)

```C#
public class Solution {
    public string ReverseStr(string s, int k) {
        int n = s.Length;
        char[] str = s.ToCharArray();
        for(int i = 0;i < n;i+= (2 * k)){
            if(i + k < n){
                Reverse(str,i,i + k - 1);
                continue;
            }
            else
                Reverse(str,i, n - 1);
        }
        return new string(str);
    }
    public void Reverse(char[] s,int start,int end){
        for(int i = start,j = end;i < j;i++,j--)
            Swap(s,i,j);
    }
    public void Swap(char[] s,int i,int j){
        char temp = s[i];
        s[i] = s[j];
        s[j] = temp;
    }
}
```

## [反转字符串中的单词](https://leetcode.cn/problems/reverse-words-in-a-string/)

![image-20251130191356409](/notes-assets/Algorithm/assets/image-20251130191356409.png)

```C#
public class Solution {
    public string ReverseWords(string s) {
        if (s == null || s.Length == 0)
            return string.Empty;  

        char[] str = s.ToCharArray();
        int newLength = DeleteExtraWhiteSpace(str);  //去除多余空格
        if (newLength == 0) return string.Empty;

        Reverse(str,0,newLength - 1);//反转整个字符串
        
        //移除多余空格 : "the sky is blue"  √
		//字符串反转："eulb si yks eht"		√
		//Todo ：单词反转："blue is sky the"
        int start = 0;
        for(int i = 0;i <= newLength;i++){
            // 遇到空格或字符串结尾，反转前面的单词
    		if (i == newLength || str[i] == ' ') {
                if(start < i - 1) // 确保单词长度 > 1
                	Reverse(str,start,i - 1);
            }
            start = i + 1;
        }
        return new string(str,0,newLength);
    }
    public int DeleteExtraWhiteSpace(char[] str){
		int slow = 0;  //快慢指针删除空格
        for(int fast = 0;fast < str.Length;fast++){
            if(str[fast] != ' '){
				if(slow != 0) //第一个单词前面不用加上 ' '，其他单词都要加' '
                {
					str[slow++] = ' ';//slow != 0 说明不是第一个单词，则要加空格
                }
                while(fast < str.Length && str[fast] != ' ')
                    str[slow++] = str[fast++];
            }
            if(fast >= str.Length)break;
            fast--; 
        }
        return slow;
    }
    public void Reverse(char[] s,int start,int end){
        for(int i = start,j = end;i < j;i++,j--)
            Swap(s,i,j);
    }
    public void Swap(char[] s,int i,int j){
        char temp = s[i];
        s[i] = s[j];
        s[j] = temp;
    }
}
```

## 右旋字符串

例如，对于输入字符串 "abcdefg" 和整数 2，函数应该将其转换为 "fgabcde"。

输入：输入共包含两行，第一行为一个正整数 k，代表右旋转的位数。第二行为字符串 s，代表需要旋转的字符串。

输出：输出共一行，为进行了右旋转操作后的字符串。

```C++
2
abcdefg 
    
fgabcde
```

```C#
using System;

class Solution{
    public void R(string s,int n){
		char[] str = s.ToCharArray();
        Reverse(str,0,str.Length - 1);
        Reverse(str,0,n - 1);
        Reverse(str,n,str.Length - 1);
    
    }
    public void Reverse(char[] str,int start,int end){
        for(int i = start,j = end;i < j;i++,j--)
            Swap(str,i,j);
    }
    public void Swap(char[] str,int i,int j){
		char temp = str[i];
        str[i] = str[j];
        str[j] = temp;
    }
}
```

## 字符串匹配

**Kmp算法求解**

重点是求解next数组。

主要有如下三步：

1. 初始化
2. 处理前后缀不相同的情况
3. 处理前后缀相同的情况

1. 初始化：

定义两个指针i和j，j指向前缀末尾位置，i指向后缀末尾位置。然后还要对next数组进行初始化赋值，如下：

```C#
int j = 0;
next[0] = 0;
```

。。。。

next数组的具体代码实现

``` C#
public int[] getNext(string s,int[] next){
    char[] str = s.ToCharArray();
    next[0] = 0;
    int j = 0;
    for(int i = 1;i < s.Length;i++){
        if(j > 0 && str[j] != str[i]){
                        j = next[j];
        }
        if(str[i] == str[j]){
            j++;
        }    
        next[i] = j;
    }
}
```

完整的字符串匹配代码

### [找出字符串中第一个匹配项的下标](https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/)![image-20251201202830760](/notes-assets/Algorithm/assets/image-20251201202830760.png)

**KMP算法求解**

```C#
public class Solution {	
	public int StrStr(string haystack,string needle){
        if (string.IsNullOrEmpty(needle)) return 0;
        if (haystack.Length < needle.Length) return -1;
        int[] next = new int[needle.Length];
        getNext(next,needle);
        int j = 0;
        for(int i = 0;i < haystack.Length;i++){
			while(j > 0 && haystack[i] != needle[j]) {  // 不匹配
                j = next[j - 1];  // j 寻找之前匹配的位置
            }
            if (haystack[i] == needle[j]) {  //匹配，j和i同时向后移动
                j++;  // i的增加在for循环里
            }
            if (j == needle.Length ) { // 文本串s里出现了模式串t
                return (i - needle.Length + 1);
            }
        }
        return -1;
    }
    public void getNext(int[] next,string s){
        int j = 0;
        next[0] = 0;
        for(int i = 1;i < s.Length;i++){
            if(j > 0 && s[i] != s[j])
            {
                j = next[j - 1];
            }
            if(s[i] == s[j])
                j++;
            next[i] = j;
        }
    }
}
```

**暴力求解**

```C#
public class Solution {	
	public int StrStr(string haystack,string needle){     
		if (string.IsNullOrEmpty(needle)) return 0;       
		if (haystack.Length < needle.Length) return -1;
    	for(int i = 0;i < haystack.Length - needle.Length;i++){
            int j = 0;
            while(j < need.Length && haystack[i + j] == needle[j]) //i一直不变进行比较，j一直++
                j++;
            if(j == needle.Length)
                return i;
        }
        return -1;
    }
}
```

## [重复的子字符串](https://leetcode.cn/problems/repeated-substring-pattern/)

![image-20251202142022593](/notes-assets/Algorithm/assets/image-20251202142022593.png)

移动匹配：

当一个字符串s：abcabc，内部由重复的子串组成，那么这个字符串的结构一定是这样的也就是由前后相同的子串组成。那么既然前面有相同的子串，后面有相同的子串，用 s + s，这样组成的字符串中，后面的子串做前串，前面的子串做后串，就一定还能组成一个s

```C#
public class Solution {
    public bool RepeatedSubstringPattern(string s) {
        string ss = (s + s).Substring(1,(s+s).Length - 2);
        return ss.Contains(s);
        }
}
```

# 栈和队列

关于队列和栈，是比较常见的数据结构。

栈：先进后出，提供Push，Pop等方法

队列：先进先出，提供Enqueue，Dequeue方法

## [用栈实现队列](https://leetcode.cn/problems/implement-queue-using-stacks/)

![image-20251202143258042](/notes-assets/Algorithm/assets/image-20251202143258042.png)

用栈实现队列，因为栈是先进后出的，要想实现先进先出的。则需要使用2个栈来进行模拟队列操作。对于队列的入队操作，不需要额外的操作，直接存入栈中即可。对于出队操作，则需要进行操作，因为栈先进入的元素会被压入栈底，所以想要栈底的元素先出来，则需要将其他元素都移除放入另外一个栈中，此时因为在栈底的元素就变为栈顶了。同理，其他元素也是如此。

```C#
public class MyQueue {
    Stack<int> PopStack;
    Stack<int> PushStack;
    public MyQueue() {
        PopStack = new Stack<int>();
        PushStack = new Stack<int>();
    }
    
    public void Push(int x) {
        PushStack.Push(x);
  
    }
    
    public int Pop() {
        if(PopStack.Count == 0){
            while(PushStack.Count > 0){
                PopStack.Push(PushStack.Pop());
            }
        }
        return PopStack.Pop();
    }
    
    public int Peek() {    
        if(PopStack.Count == 0){
            while(PushStack.Count > 0){
                PopStack.Push(PushStack.Pop());
            }
        }
        return PopStack.Peek();
       
    }
    
    public bool Empty() {
        return PushStack.Count == 0 && PopStack.Count == 0;
    }
}
```

## [用队列实现栈](https://leetcode.cn/problems/implement-stack-using-queues/)

![image-20251202152401602](/notes-assets/Algorithm/assets/image-20251202152401602.png)

队列实现栈也是同理，但是相较于栈实现队列，可以不需要使用2个队列即可完成操作。

方法一：2个队列实现栈操作，为了模拟栈的先进后出的特性，我们准备2个队列分别是主队列和辅助队列，对于入栈操作，直接将元素全部装入主队列中即可。出栈操作，则需要特殊处理，如果是最后一个进入的元素，在队列中是最后出去，在栈中，则是最先出去。所以需要将其他元素全部从主队列移入辅助队列中即可。剩下的元素则是要出去的元素，将最后的元素返回即可。同时交换主队列和辅助队列，及完成出队操作。

方法二：使用一个队列实现，因为队列是先进先出的，入栈一样，一次性全部进入队列即可。对于出队，只需要将所有元素重新入队即可，此时的元素则都在需要出队的元素后面了。

```C#
public class MyStack {
    Queue<int> MainQueue;
    Queue<int> TempQueue;
    public MyStack() {
        MainQueue = new Queue<int>();
        TempQueue = new Queue<int>();

    }
    
    public void Push(int x) {
        MainQueue.Enqueue(x);
    }
    
    public int Pop() {
        while(MainQueue.Count > 1){
            TempQueue.Enqueue(MainQueue.Dequeue());
        }        
        var item = MainQueue.Dequeue();
        var tmp = MainQueue;
        MainQueue = TempQueue;
        TempQueue = tmp;
        return item;
    }
    
    public int Top() {
        while(MainQueue.Count > 1){
            TempQueue.Enqueue(MainQueue.Dequeue());
        }        
        var item = MainQueue.Peek();
        TempQueue.Enqueue(MainQueue.Dequeue());
        var tmp = MainQueue;
        MainQueue = TempQueue;
        TempQueue = tmp;
        return item;
    }
    
    public bool Empty() {
        return MainQueue.Count == 0;;
    }
}
```

```C#
public class MyStack {
	 Queue<int> MainQueue;
    public MyStack() {
        MainQueue = new Queue<int>();
    }
    
    public void Push(int x) {
        MainQueue.Enqueue(x);
    }
    
    public int Pop() {
    	if(MainQueue.Count == 0)
            return 0;
        for(int i = 0;i < MainQueue.Count - 1;i++)
        	MainQueue.Enqueue(MainQueue.Dequeue());
        return MainQueue.Dequeue();
    }
    
    public int Top() {
        if(MainQueue.Count == 0)
            return 0;
        var item = 0;
        for(int i = 0;i < MainQueue.Count;i++){
            item = MainQueue.Dequeue();
            MainQueue.Enqueue(item);
        }

        return item;
    }
    
    public bool Empty() {
        return MainQueue.Count == 0;;
    }

}
```



## [有效的括号](https://leetcode.cn/problems/valid-parentheses/)

![image-20251202152548190](/notes-assets/Algorithm/assets/image-20251202152548190.png)

**由于栈结构的特殊性，非常适合做对称匹配类的题目**

第一种情况：已经遍历完了字符串，但是栈不为空，说明有相应的左括号没有右括号来匹配，所以return false

第二种情况：遍历字符串匹配的过程中，发现栈里没有要匹配的字符。所以return false

第三种情况：遍历字符串匹配的过程中，栈已经为空了，没有匹配的字符了，说明右括号没有找到对应的左括号return false

那么什么时候说明左括号和右括号全都匹配了呢，就是字符串遍历完之后，栈是空的，就说明全都匹配了。

```C#
public class Solution {
    public bool IsValid(string s) {
 		Stack<char> S = new Stack<char>();
        for(int i = 0;i < s.Length;i++){
            if(s[i] == '(' || s[i] == '{' || s[i] == '['){
                S.Push(s[i]);
            } 
            else
            {
                if(S.Count == 0) //相当于只有左括号
                    return false;
                if(s[i] == ')' && S.Peek()!= '(') return false;
                if(s[i] == ']' && S.Peek()!= '[') return false;
                if(s[i] == '}' && S.Peek()!= '{') return false;
                S.Pop();
            }
        }
        return S.Count == 0;
    }
}
```

## [删除字符串中的所有相邻重复项](https://leetcode.cn/problems/remove-all-adjacent-duplicates-in-string/)

![image-20251202154738888](/notes-assets/Algorithm/assets/image-20251202154738888.png)

```C#
public class Solution {
    public string RemoveDuplicates(string s) {
        Stack<char> ans = new Stack<char>();
        for(int i = 0;i < s.Length;i++){
            if(ans.Count > 0 && s[i] == ans.Peek() )
            {
                ans.Pop();
                continue;
            }
            ans.Push(s[i]);
        }
        char[] res = ans.ToArray();
        Array.Reverse(res);
        return new string(res);
    }

}
```

## [逆波兰表达式求值](https://leetcode.cn/problems/evaluate-reverse-polish-notation/)

![image-20251202154947043](/notes-assets/Algorithm/assets/image-20251202154947043.png)

```C#
public class Solution {
    public int EvalRPN(string[] tokens) {
 		Stack<int> ans = new Stack<int>();
      	foreach(var i in tokens){
			switch(i){
            	case "+":
                    ans.Push(ans.Pop() + ans.Pop());
                   	break;
                case "-":
                    int num = ans.Pop();
                    ans.Push(ans.Pop - num);
                    break;
                case "*":
                    ans.Push(ans.Pop() * ans.Pop());
                    break;
                case "/":
                    int num1 = ans.Pop();
                    ans.Push(ans.Pop / num1);
                    break;
                default:
                    ans.Push(int.Parse(i));
                    break;
            }
        }
        return ans.Pop();
    }
}
```

## [滑动窗口最大值](https://leetcode.cn/problems/sliding-window-maximum/)

![image-20251202191906510](/notes-assets/Algorithm/assets/image-20251202191906510.png)

暴力法求解：循环遍历数组，同时遍历每个区间，找到每个区间的最大值，同时区间右移即可。

```C#
public class Solution {
    public int[] MaxSlidingWindow(int[] nums, int k) {
 		List<int> ans = new List<int>();
        for(int i = 0;i <= nums.Length - k;i++){
            int max = int.MinValue;
            for(int j = i;j < i + k;j++){
                max = Math.Max(max,nums[j]);
            }
            ans.Add(max);
        }
        return ans.ToArray();
    }
}
```

单调队列求解：**单调队列**是一种特殊的队列，它保持队列中的元素单调递减（或递增）。对于最大值问题，我们使用**单调递减队列**。

**为什么要使用单调队列？**

1. **避免重复比较**：暴力法在每个窗口都重新比较所有元素，而单调队列利用之前窗口的信息
2. **维护候选最大值**：队列始终维护当前窗口内"有可能成为最大值"的元素
3. **高效移除**：当窗口滑动时，可以快速确定哪些元素不再可能成为最大值

**队列设计原则**

- **单调递减**：队首元素始终是当前窗口的最大值
- **索引存储**：存储元素索引而不是值，便于判断元素是否在窗口内
- **淘汰策略**：新元素入队时，淘汰所有比它小的元素（因为它们不再可能成为最大值）

```css
单调递减队列：队首(最大) ← ... ← 队尾(最小)

示例：队列内容 [7, 5, 3, 1]
- First.Value = 7 (最大值)
- Last.Value = 1 (最小值)
```

```C#
public class MonotonicQueue {
    private LinkedList<int> deque = new LinkedList<int>(); // 存储值（不是索引）
    //队尾进来
    public void Push(int val) {
        // 淘汰策略：移除所有比当前元素小的元素
        // 注意：deque.Last.Value 是队列中当前最小的元素
        while (deque.Count > 0 && deque.Last.Value < val) {
            deque.RemoveLast();  // 移除比新元素小的元素
        }
        deque.AddLast(val);      // 删除所有小于该元素的队尾元素，在队尾添加新元素
    }
    
    public void Pop(int val) {
        // 只有当队首元素是要移除的元素时才弹出
        if (deque.Count > 0 && deque.First.Value == val) {
            deque.RemoveFirst();
        }
    }
    
    public int GetMax() {
        return deque.First.Value;  // 队首始终是最大值
    }
}
```

```C#
public class MyQueue {
    private LinkedList<int> deque = new LinkedList<int>(); // 存储值（不是索引）
    //队尾进来
    public void Push(int val) {
        // 淘汰策略：移除所有比当前元素小的元素
        // 注意：deque.Last.Value 是队列中当前最小的元素
        while (deque.Count > 0 && deque.Last.Value < val) {
            deque.RemoveLast();  // 移除比新元素小的元素
        }
        deque.AddLast(val);      // 删除所有小于该元素的队尾元素，在队尾添加新元素
    }
    
    public void Pop(int val) {
        // 只有当队首元素是要移除的元素时才弹出
        if (deque.Count > 0 && deque.First.Value == val) {
            deque.RemoveFirst();
        }
    }
    
    public int GetMax() {
        return deque.First.Value;  // 队首始终是最大值
    }
}
public class Solution {
    public int[] MaxSlidingWindow(int[] nums, int k) {
 		MyQueue res = new MyQueue();
        List<int> ans = new List<int>();
        for(int i = 0;i < k;i++)
            res.Push(nums[i]);
        ans.Add(res.GetMax());
        
        for(int i = k;i < nums.Length;i++){
            res.Pop(nums[i - k]);  //弹出区间最左边
            res.Push(nums[i]);//区间右移
            ans.Add(res.GetMax());
        }
        return ans.ToArray();
    }
}
```

## [前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/)

![image-20251203160429173](/notes-assets/Algorithm/assets/image-20251203160429173.png)

对于本题，考虑到元素出现的次数，一般考虑到哈希表来进行解题。然后本地又需要对频率进行排序，则考虑使用优先级队列来求解。在C#中，优先级队列一般是堆结构（类似于2叉树），在C#默认提供了优先队列的实现，默认是小根堆也就是当需要弹出元素时，优先级数字最小的先出。根据这个特性，我们将出现次数的频率存入队列，然后当数量超过k时，频率最小的就被弹出了，正好符号题意。对于代码的书写如下；

首先我们需要哈希表来记录出现次数，同时需要优先级队列来弹出次数少的元素。题目又要求需要返回数组，此时，题意的数据结构很清晰了。在C#中，提供的优先级队列需要有2个泛型参数

- **`TElement`** - 队列中存储的**实际元素类型**
- **`TPriority`** - 用于确定优先级的**优先级类型**

根据值的优先级来决定弹出顺序，默认是小的先弹出

```C#
Dictionary<int,int> Dic = new Dictionary<int,int>();
PriorityQueue<int,int> queue = new PriorityQueue<int,int>();
int[] result = new int[k];
```

数据结构确定好后，则需要进行频率统计

```C#
foreach(var i in nums){
    if(Dic.ContainsKey(i))
        Dic[i]++;
    else
        Dic[i] = 1;
}
```

下一步则是弹出出现次数小的吗，满足topk元素

```C#
foreach(var pair in Dic){
    int key = pair.Key;
    int value = pair.Value;
    queue.Enqueue(key,value);
    if(queue.Count > k)
        queue.Dequeue();
}
```

此时优先队列剩下的元素则是我们需要的答案，但是因为题目的输出类型是多的在前，使用从后往前遍历即可

```C#
for(int i = k - 1;i >=0 ;i--){
    result[i] = queue.Dequeue();
}
return result[i];
```

完整代码

```C#
public class Solution {
    public int[] TopKFrequent(int[] nums, int k) {
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
            for (int i = k - 1; i >= 0; i--)
            {
                result[i] = Heap.Dequeue();
            }
            return result;
    }
}
```

# 二叉树

## **二叉树种类：**

**满二叉树和完全二叉树。**

满二叉树：如果一棵二叉树只有度为0的结点和度为2的结点，并且度为0的结点在同一层上，则这棵二叉树为满二叉树。这棵二叉树为满二叉树，也可以说深度为k，有2^k-1个节点的二叉树。

![img](/notes-assets/Algorithm/assets/20200806185805576.png)

完全二叉树：在完全二叉树中，除了最底层节点可能没填满外，其余每层节点数都达到最大值，并且最下面一层的节点都集中在该层最左边的若干位置。若最底层为第 h 层（h从1开始），则该层包含 1~ 2^(h-1) 个节点。

![image-20251203163252006](/notes-assets/Algorithm/assets/image-20251203163252006.png)

二叉搜索树：**二叉搜索树是一个有序树**。

- 若它的左子树不空，则左子树上所有结点的值均小于它的根结点的值；
- 若它的右子树不空，则右子树上所有结点的值均大于它的根结点的值；
- 它的左、右子树也分别为二叉排序树

![image-20251203163342055](/notes-assets/Algorithm/assets/image-20251203163342055.png)

平衡二叉树：又被称为AVL（Adelson-Velsky and Landis）树，且具有以下性质：它是一棵空树或它的左右两个子树的高度差的绝对值不超过1，并且左右两个子树都是一棵平衡二叉树。

![image-20251203163403190](/notes-assets/Algorithm/assets/image-20251203163403190.png)

| C++ 类型        | C# 对应类型                                         | 底层实现    | 时间复杂度 | 是否排序 |
| :-------------- | :-------------------------------------------------- | :---------- | :--------- | :------- |
| `map`           | `SortedDictionary<TKey,TValue>`                     | 红黑树      | O(log n)   | 是       |
| `set`           | `SortedSet<T>`                                      | 红黑树      | O(log n)   | 是       |
| `multimap`      | 无内置，可用 `SortedDictionary<TKey, List<TValue>>` | 红黑树+列表 | O(log n)   | 是       |
| `multiset`      | 无内置，可用 `SortedDictionary<T, int>`计数         | 红黑树      | O(log n)   | 是       |
| `unordered_map` | `Dictionary<TKey,TValue>`                           | 哈希表      | 平均 O(1)  | 否       |
| `unordered_set` | `HashSet<T>`                                        | 哈希表      | 平均 O(1)  | 否       |

## 二叉树的存储方式

**二叉树可以链式存储，也可以顺序存储。**

那么链式存储方式就用指针， 顺序存储的方式就是用数组。

顾名思义就是顺序存储的元素在内存是连续分布的，而链式存储则是通过指针把分布在各个地址的节点串联一起

![image-20251203163650837](/notes-assets/Algorithm/assets/image-20251203163650837.png)

其实就是用数组来存储二叉树，顺序存储的方式如图：

![image-20251203163719254](/notes-assets/Algorithm/assets/image-20251203163719254.png)

**如果父节点的数组下标是 i，那么它的左孩子就是 i \* 2 + 1，右孩子就是 i \* 2 + 2。**

## 二叉树的遍历方式

二叉树主要有两种遍历方式：

1. 深度优先遍历：先往深走，遇到叶子节点再往回走。
2. 广度优先遍历：一层一层的去遍历。

- 深度优先遍历
  - 先序遍历（递归法，迭代法）
  - 中序遍历（递归法，迭代法）
  - 后序遍历（递归法，迭代法）
- 广度优先遍历
  - 层次遍历（迭代法）

![image-20251203163846337](/notes-assets/Algorithm/assets/image-20251203163846337.png)

**栈其实就是递归的一种实现结构**，也就说前中后序遍历的逻辑其实都是可以借助栈使用递归的方式来实现的。

而广度优先遍历的实现一般使用队列来实现，这也是队列先进先出的特点所决定的，因为需要先进先出的结构，才能一层一层的来遍历二叉树。

## 二叉树的定义

链式存储的二叉树节点的定义方式。

```C#
public TreeNode{
    int val;
    TreeNode left;
    TreeNode right;
    public TreeNode(int val){
        this.val = val;
        left = null;
        right = null;
    }
}
```

## 二叉树的递归遍历

### 递归三要素

1. **确定递归函数的参数和返回值：** 确定哪些参数是递归的过程中需要处理的，那么就在递归函数里加上这个参数， 并且还要明确每次递归的返回值是什么进而确定递归函数的返回类型。
2. **确定终止条件：** 写完了递归算法, 运行的时候，经常会遇到栈溢出的错误，就是没写终止条件或者终止条件写的不对，操作系统也是用一个栈的结构来保存每一层递归的信息，如果递归没有终止，操作系统的内存栈必然就会溢出。
3. **确定单层递归的逻辑：** 确定每一层递归需要处理的信息。在这里也就会重复调用自己来实现递归的过程。

**前序遍历 - 递归求解**

```C#
public class Solution{
    public IList<int> PreorderTraversal(TreeNode root) {
     	List<int> ans = new List<int>();   
        process(root,ans);
        return ans;
           
    }
    public void process(TreeNode root,List<int> ans){
        if(root == null)
            return;
        ans.Add(root.val);
        process(root.left,ans);     
        process(root.right,ans);
    }
}
```

**中序遍历 - 递归求解**

```C#
public class Solution{
    public IList<int> InorderTraversal(TreeNode root) {
     	List<int> ans = new List<int>();   
        process(root,ans);
        return ans;
           
    }
    public void process(TreeNode root,List<int> ans){
        if(root == null)
            return;
        process(root.left,ans); 
        ans.Add(root.val);
        process(root.right,ans);
    }
}
```

**后序遍历 - 递归求解**

```C#
public class Solution {
    public IList<int> PostorderTraversal(TreeNode root) {
        List<int> ans = new List<int>();   
        process(root,ans);
        return ans;
    }
    public void process(TreeNode root,List<int> ans){
        if(root == null)
            return;
        process(root.left,ans); 
        process(root.right,ans);
        ans.Add(root.val);
    }
}
```

## 二叉树的非递归遍历

**栈其实就是递归的一种实现结构**，也就说前中后序遍历的逻辑其实都是可以借助栈使用递归的方式来实现的。在实现了递归实现二叉树的遍历后，来实现非递归的遍历

**前序遍历 - 非递归（迭代）**:根 - 左 - 右。为了实现迭代处理二叉树的遍历，我们使用**栈结构**来模拟递归调用的过程。由于前序遍历是一种**深度优先遍历**，其特点是沿着每条路径一直向下访问，直到遇到 `null`才开始回溯，这种"一路到底"的特性非常适合使用栈来处理。

1. **初始化阶段**：首先将根节点入栈。
2. **循环处理**：入栈后判断栈是否为空，若不为空，则开始循环处理栈中的节点。
3. **节点访问**：每次循环中，将栈顶节点出栈，并将该节点的值存入结果列表，完成对当前根节点的访问。
4. **子树处理**：由于前序遍历的顺序是"根节点→左子树→右子树"，而栈具有"先进后出"的特性，为了确保左子树先于右子树被处理，我们需要先将右子节点入栈，再将左子节点入栈。这样在后续的出栈顺序中，左子节点会先于右子节点出栈，从而保证遍历顺序的正确性。

```C#
public class Solution{
    public IList<int> PreorderTraversal(TreeNode root) {
        Stack<TreeNode> res = new Stack<TreeNode>();
        List<int> ans = new List<int>();
        if (root == null) return ans;
        
        res.Push(root);
        while(res.Count > 0){
            TreeNode cur = res.Pop();
            ans.Add(cur.val);
            
            // 先右后左，因为栈是LIFO
            if(cur.right != null)  
                res.Push(cur.right);
            if(cur.left != null)
                res.Push(cur.left);
        }
        return ans;
    }
}
```

**中序遍历 - 非递归（迭代）**:左 - 根 -  右。中序遍历则与前序遍历不同，不能简单地通过调整入栈顺序来实现。中序遍历需要遵循"左子树→根节点→右子树"的顺序，这要求我们必须先深度优先地遍历到最左侧的节点，然后再回溯访问根节点，最后处理右子树。

1. **初始化指针**：从根节点开始，使用一个当前指针`head`指向根节点。
2. **左子树深度遍历**：通过循环将当前节点及其所有左子节点依次入栈，直到遇到`null`为止，这确保了我们能到达最左侧的叶子节点。
3. **回溯访问**：从栈中弹出顶部节点（即当前最左侧的节点），访问该节点并将其值加入结果列表。
4. **转向右子树**：将当前指针指向弹出节点的右子节点，开始对右子树进行同样的中序遍历处理。

```C#
 public IList<int> InorderTraversal(TreeNode head) {
        List<int> res = new List<int>();
     	if(head == null)return res;
        Stack<TreeNode> s = new Stack<TreeNode>();
        if(head!=null){
            while(s.Count > 0 || head !=null){
                if(head !=null){
                    s.Push(head);
                    head= head.left;

                }
                else{
                    head = s.Pop();
                    res.Add(head.val);
                    head = head.right;
                }
            }
        }
        return res;
    }
```

**后序遍历 - 非递归（迭代）**: 根 - 左 - 右 ---->  根 - 右 - 左 ----->左 - 右 - 根。后序遍历可以通过**修改版的前序遍历**来实现。具体方法是：调整入栈顺序为先左子节点后右子节点（利用栈的LIFO特性），这样可以得到"根→右→左"的访问顺序，最后将得到的结果序列进行反转，即可得到正确的后序遍历顺序"左→右→根"。

1. **修改入栈顺序**：在标准前序遍历中，我们是先右后左入栈（得到根→左→右）。现在改为**先左后右入栈**，这样出栈顺序就变成了根→右→左。
2. **结果反转**：将"根→右→左"的序列反转后，就得到了正确的后序遍历"左→右→根"

```C#
public class Solution {
    public IList<int> PostorderTraversal(TreeNode root) {
        List<int> result = new List<int>();
        if (root == null) return result;
        
        Stack<TreeNode> stack1 = new Stack<TreeNode>();
        Stack<TreeNode> stack2 = new Stack<TreeNode>();
        stack1.Push(root);
        
        // 第一个栈：根→左→右 的顺序入栈
        while (stack1.Count > 0) {
            TreeNode node = stack1.Pop();
            stack2.Push(node);  // 将节点压入第二个栈
            
            // 先左后右，这样在第二个栈中就是右→左→根
            if (node.left != null)
                stack1.Push(node.left);
            if (node.right != null)
                stack1.Push(node.right);
        }
        
        // 第二个栈弹出顺序就是后序遍历：左→右→根
        while (stack2.Count > 0) {
            result.Add(stack2.Pop().val);
        }
        
        return result;
    }
}
```

## 二叉树的层序遍历

二叉树的层序遍历也就是广度优先遍历，按照每一层来进行遍历二叉树。从根节点开始遍历，在是左子树，右子树。需要借用一个辅助数据结构即队列来实现，**队列先进先出，符合一层一层遍历的逻辑，而用栈先进后出适合模拟深度优先遍历也就是递归的逻辑。而这种层序遍历方式就是图论中的广度优先遍历，只不过我们应用在二叉树上。**

```C#
public class Solution {
    public IList<IList<int>> LevelOrder(TreeNode root) {
        var ans = new List<IList<int>>();                    // 存储最终结果：每层一个子列表
        Queue<TreeNode> queue = new Queue<TreeNode>();        // BFS队列：按层级顺序处理节点
        
        if (root == null) return ans;                        // 空树检查
        queue.Enqueue(root);                                  // 根节点入队，开始BFS
        
        while (queue.Count > 0) {                             // 当队列非空，继续处理各层
            List<int> LevelList = new List<int>();            // 当前层的节点值列表
            int LevelLength = queue.Count;                    // 关键：记录当前层节点数（在添加子节点前）
            
            for (int i = 0; i < LevelLength; i++) {          // 遍历当前层所有节点
                TreeNode temp = queue.Dequeue();              // 出队当前节点（FIFO）
                LevelList.Add(temp.val);                      // 记录节点值到当前层
                
                if (temp.left != null)                       // 左子节点入队（下一层）
                    queue.Enqueue(temp.left);
                if (temp.right != null)                      // 右子节点入队（下一层）
                    queue.Enqueue(temp.right);
            }
            ans.Add(LevelList);                               // 完成当前层，加入结果集
        }
        return ans;
    }
}
```

### 相关题目

#### [二叉树的层序遍历 II](https://leetcode.cn/problems/binary-tree-level-order-traversal-ii/)

![image-20251203200824055](/notes-assets/Algorithm/assets/image-20251203200824055.png)

题目要求输出自底向上输出，其实本质还是层序遍历，只不过需要将结构反转一下即可。

```C#
public class Solution {
    public IList<IList<int>> LevelOrderBottom(TreeNode root) {
        var ans = new List<IList<int>>();
        if(root == null)return ans;
        Queue<TreeNode> queue = new Queue<TreeNode>();
        queue.Enqueue(root);
        while(queue.Count > 0){
            int LevelCount = queue.Count;
            var LevelList = new List<int>();
            for(int i = 0;i < LevelCount;i++){
                TreeNode temp = queue.Dequeue();
                LevelList.Add(temp.val);

                if(temp.left != null)
                    queue.Enqueue(temp.left);
                if(temp.right != null)
                    queue.Enqueue(temp.right);
            }
            ans.Add(LevelList);
        }
        ans.Reverse();
        return ans;
    }
}
```

#### [二叉树的右视图](https://leetcode.cn/problems/binary-tree-right-side-view/)

![image-20251203201119094](/notes-assets/Algorithm/assets/image-20251203201119094.png)

此题咋一看发现会有点难度，因为只需要最右边的值。但是其实就是层序遍历的最右边的值，本质还是层序遍历

```C#
public class Solution {
    public IList<int> RightSideView(TreeNode root) {
        var ans = new List<int>();
        if(root == null)return ans;
        Queue<TreeNode> queue = new Queue<TreeNode>();
        queue.Enqueue(root);
        while(queue.Count > 0){
            int LevelCount = queue.Count;
            int value = 0;
            for(int i = 0;i < LevelCount;i++){
                TreeNode temp = queue.Dequeue();
                value = temp.val;
                
                if(temp.left != null)
                    queue.Enqueue(temp.left);
                if(temp.right != null)
                    queue.Enqueue(temp.right);
            }
            ans.Add(value);
        }
        return ans;
    }
}
```

#### [二叉树的层平均值](https://leetcode.cn/problems/average-of-levels-in-binary-tree/)

![image-20251203201919891](/notes-assets/Algorithm/assets/image-20251203201919891.png)

同样本题只需要将每层的平均值返回即可

```C#
public class Solution {
    public IList<double> AverageOfLevels(TreeNode root) {
        var ans = new List<double>();
        if(root == null)return ans;
        Queue<TreeNode> queue = new Queue<TreeNode>();
        queue.Enqueue(root);
        while(queue.Count > 0){
            int LevelCount = queue.Count;
            double value = 0;
            for(int i = 0;i < LevelCount;i++){
                TreeNode temp = queue.Dequeue();
                value += temp.val;
                
                if(temp.left != null)
                    queue.Enqueue(temp.left);
                if(temp.right != null)
                    queue.Enqueue(temp.right);
            }
            ans.Add(value / LevelCount);
        }
        return ans;
    }
}
```

#### [N 叉树的层序遍历](https://leetcode.cn/problems/n-ary-tree-level-order-traversal/)

![image-20251203202049570](/notes-assets/Algorithm/assets/image-20251203202049570.png)

N叉树的层序遍历算法框架与二叉树完全一致，都是基于队列的广度优先搜索。唯一的核心区别在于处理子节点的方式：

- **二叉树**：每个节点最多有两个固定的子节点（左子节点、右子节点）
- **N叉树**：每个节点拥有一个动态的子节点列表，数量从0到N不等

因此，在算法实现中，只需要将二叉树中针对左右子节点的固定检查，改为对子节点列表的循环遍历即可，其他部分（队列操作、层级控制等）保持完全相同。

```C#
/*
// Definition for a Node.
public class Node {
    public int val;
    public IList<Node> children;  // 关键区别：从左右子树变为子节点列表

    public Node() {}

    public Node(int _val) {
        val = _val;
    }

    public Node(int _val, IList<Node> _children) {
        val = _val;
        children = _children;
    }
}
*/

public class Solution {
    public IList<IList<int>> LevelOrder(Node root) {
        var ans = new List<IList<int>>();
        if (root == null) return ans;
        
        Queue<Node> queue = new Queue<Node>();
        queue.Enqueue(root);
        
        while (queue.Count > 0) {
            int count = queue.Count;           // 当前层节点数
            var LevelList = new List<int>();   // 存储当前层所有节点值
            
            for (int i = 0; i < count; i++) {
                Node temp = queue.Dequeue();
                LevelList.Add(temp.val);       // 将当前节点值加入本层结果
                
                // 关键区别：遍历所有子节点（而非固定的left/right）
                if (temp.children != null && temp.children.Count != 0) {
                    for (int j = 0; j < temp.children.Count; j++) {
                        queue.Enqueue(temp.children[j]);  // 所有子节点入队
                    }
                }
            }
            ans.Add(LevelList);  // 完成当前层遍历
        }
        return ans;
    }
}
```

#### [在每个树行中找最大值](https://leetcode.cn/problems/find-largest-value-in-each-tree-row/)

![image-20251203204115630](/notes-assets/Algorithm/assets/image-20251203204115630.png)

层序遍历打的第五个。但是本地阴在测试案例存在int类型的最小值

```C#
public class Solution {
    public IList<int> LargestValues(TreeNode root) {
        var ans = new List<int>();
        if(root == null)return ans;
        Queue<TreeNode> queue = new Queue<TreeNode>();
        queue.Enqueue(root);
        while(queue.Count > 0){
            int LevelCount = queue.Count;
            int maxvalue = int.MinValue;
            for(int i = 0;i < LevelCount;i++){
                TreeNode temp = queue.Dequeue();
                maxvalue = Math.Max(maxvalue,temp.val);
                
                if(temp.left != null)
                    queue.Enqueue(temp.left);
                if(temp.right != null)
                    queue.Enqueue(temp.right);
            }
            ans.Add(maxvalue);
        }
        return ans;
    }
}
```

#### [填充每个节点的下一个右侧节点指针](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node/)

![image-20251203205840086](/notes-assets/Algorithm/assets/image-20251203205840086.png)

充每个节点的下一个右侧指针的算法框架与二叉树层序遍历完全一致，都是基于队列的广度优先搜索。

唯一的核心区别在于：**普通层序遍历只收集节点值，而本题需要额外处理同一层节点间的横向连接关系**。

具体来说，在遍历每一层时，除了常规的子节点入队操作外，需要增加next指针的连接逻辑——将当前节点指向队列中的下一个同层节点，如果是该层最后一个节点则指向null。

```C#
public class Solution {
    public Node Connect(Node root) {
        if(root == null)return null;
        Queue<Node> queue = new Queue<Node>();
        queue.Enqueue(root);
        while(queue.Count > 0){
            int LevelCount = queue.Count;

            Node pre = null;
            for(int i = 0;i < LevelCount;i++){
                Node temp = queue.Dequeue();
                if(temp.left != null)
                    queue.Enqueue(temp.left);
                if(temp.right != null)
                    queue.Enqueue(temp.right);

                if(pre != null)
                    pre.next =temp;
                pre = temp;

                if(i == LevelCount - 1)
                    pre.next = null;
            }

        }
        return root;
    }
}
```

**递归法**

**第一，连接同父节点的直接子节点**：对于每个节点，将其左子节点直接指向右子节点（`root.left.next = root.right`），这解决了同一父节点下的兄弟节点连接问题。

**第二，利用父节点指针进行跨子树连接**：如果当前节点的next指针不为空，说明同一层有相邻节点，此时将当前节点的右子节点指向相邻节点的左子节点（`root.right.next = root.next.left`），这实现了不同父节点的子树间的横向连接。

**第三，递归向下传递处理**：在处理完当前层的连接关系后，分别递归处理左子树和右子树（`Connect(root.left)`和`Connect(root.right)`），通过递归调用将连接逻辑传递到整个树的每一层。

```C#
public class Solution {
	public Node Connect(Node root) {
        if(root == null)
            return null;
        if(root.left != null)
        {
            root.left.next = root.right;
            if(root.next != null){  //就是右子树
                root.right.next = root.next.left;
            }
        }
        Connect(root.left);
        Connect(root.right);
        return root;
    }
}
```

#### [填充每个节点的下一个右侧节点指针 II](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node-ii/)

![image-20251203211318266](/notes-assets/Algorithm/assets/image-20251203211318266.png)

如果这道题使用BFS的话那么和 [填充每个节点的下一个右侧节点指针](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node/)没有任何区别，因为BFS可以忽略各种空节点造成的影响，然而如果想要尝试使用递归的话，

限制就比较多了，因为这并不是一颗完美二叉树（各个节点可能都只有一个孩子），这会导致我们无法轻松判断应该将当前节点的孩子连接到右侧的哪个节点上，

因为有可能是当前节点的next的左右子节点也有可能是next和next的，因此基于这种思想可以定义一个递归函数不断向右进行搜索直到搜索到对应的节点进行返

回，这是一个难点，此外需要注意的是先处理当前节点的左右孩子之间的连接然后处理层之间的连接，最后在递归的时候必须先递归右子树，否则无法保证递归到

左侧的时候右侧的节点都是相连的。

迭代法，BFS

```C#
public class Solution {
    public Node Connect(Node root) {
        if(root == null)return null;
        Queue<Node> queue = new Queue<Node>();
        queue.Enqueue(root);
        while(queue.Count > 0){
            int LevelCount = queue.Count;

            Node pre = null;
            for(int i = 0;i < LevelCount;i++){
                Node temp = queue.Dequeue();
                if(temp.left != null)
                    queue.Enqueue(temp.left);
                if(temp.right != null)
                    queue.Enqueue(temp.right);

                if(pre != null)
                    pre.next =temp;
                pre = temp;

                if(i == LevelCount - 1)
                    pre.next = null;
            }

        }
        return root;
    }
}
```

#### [二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

![image-20251203212101181](/notes-assets/Algorithm/assets/image-20251203212101181.png)

递归法：**树的深度等于其左右子树深度的最大值加1**。当节点为空时返回深度0，作为递归的基准情况；对于非空节点，递归计算左子树和右子树的深度，取两者的较大值然后加1（当前节点自身的深度），通过这种分治策略自底向上地计算出整棵二叉树的最大深度。

```C#
public class Solution {
    public int MaxDepth(TreeNode root) {;
        if(root == null)
            return 0;
        return Math.Max(TreeNode(root.left),TreeNode(root.right)) + 1;
    }
}
```

迭代法：因为层序遍历是每层都会进行循环，说明层序遍历可以标记总层数，则说明可以得到总层数

```C#
    public int MaxDepth1(TreeNode root){
        if(root == null)
            return 0;
        int maxDp = 0;
        Queue<TreeNode> queue = new Queue<TreeNode>();
        queue.Enqueue(root);
        while(queue.Count > 0){
            int Len = queue.Count;
            maxDp++;
            for(int i = 0;i < Len;i++){
                TreeNode cur = queue.Dequeue();
                if(cur.left != null)
                    queue.Enqueue(cur.left);
                if(cur.right != null)
                    queue.Enqueue(cur.right);
                
            }
        }
        return maxDp;
    }
```

#### 二叉树的最小高度

![image-20251203232305151](/notes-assets/Algorithm/assets/image-20251203232305151.png)

本题要求二叉树的最小深度。**最小深度**的定义是：从根节点到最近**叶子节点**的最短路径上的节点数量。

**常见误区**：很多人认为只需要将求最大深度的代码中的 `Math.max`改为 `Math.min`即可，但这种做法是错误的。

**根本区别**在于：

- **最大深度**：关心的是树的最大高度，空子树深度为0是合理的
- **最小深度**：必须到达**叶子节点**（即没有子节点的节点），空节点不能算作有效的路径终点

**关键问题**：当某个子树为空时，该路径无法到达叶子节点，因此不能参与最小值的比较。

```C#
public int MinDepth1(TreeNode root) {
        if(root == null)
            return 0;
        if(root.left == null && root.right != null)
            return 1 + MinDepth(root.right);
        if(root.left != null && root.right == null)
            return 1 + MinDepth(root.left);    
        return Math.Min(MinDepth(root.left),MinDepth(root.right)) + 1;
    }
```

使用迭代法（通常指广度优先搜索，BFS）求解二叉树的最小深度，其核心逻辑非常直观高效。

1. **算法基础**：采用层次遍历，从根节点开始，自上而下、自左向右地访问每一层的节点。
2. **终止条件**：在遍历过程中，我们只需要判断当前节点的左右子树是否**同时为空**（即该节点是否为叶子节点）。一旦遇到第一个这样的节点，当前所在的层数就是整个树的最小深度。
3. **原理优势**：这正是因为BFS的遍历顺序保证了我们总是先完成当前层的所有节点，再进入下一层。因此，**最先被访问到的叶子节点，其所在的路径一定是最短的**。找到它即可立即返回结果，无需继续遍历剩余的节点。
4. **对比递归法**：与需要处理多种特殊情况的递归法（DFS）相比，迭代法的逻辑更为简洁统一，无需关心单子树等复杂场景，因为BFS的搜索顺序天然地契合了“寻找最短路径”这一目标。

**简而言之：利用BFS按层遍历，找到的第一个叶子节点所在的深度，就是最小深度。**

```C#
public int MinDepth(TreeNode root) {
        if(root == null)
            return 0;
        int minDp = 0;
        Queue<TreeNode> queue = new Queue<TreeNode>();
        queue.Enqueue(root);
        while(queue.Count > 0){
            int Len = queue.Count;
            minDp++;
            for(int i = 0;i < Len;i++){
                TreeNode cur = queue.Dequeue();
                if(cur.left == null && cur.right == null)
                    return minDp;
                if(cur.left != null){

                    queue.Enqueue(cur.left);
                }
                if(cur.right != null){

                    queue.Enqueue(cur.right);
                }
                
            }
        }
        return minDp;
    }
```

## [翻转二叉树](https://leetcode.cn/problems/invert-binary-tree/)

![image-20251204141437730](/notes-assets/Algorithm/assets/image-20251204141437730.png)

递归法求解：

```C#
public class Solution {
    public TreeNode InvertTree(TreeNode root) {
 		if(root == null)
            return null;
        TreeNode temp = root.left;
        root.left = root.right;
        root.right = temp;
        InvertTree(root.left);
        InvertTree(root.right);
        return root;
    }
}
```

迭代法：

```C#
public TreeNode InvertTree(TreeNode root) {
        if (root == null) return null;    
        
        Queue<TreeNode> Q = new Queue<TreeNode>();
        Q.Enqueue(root);
        
        while (Q.Count > 0)
        {
            TreeNode cur = Q.Dequeue();  

            TreeNode temp = cur.left;
            cur.left = cur.right;
            cur.right = temp;

            if (cur.left != null)
                Q.Enqueue(cur.left);         
            if (cur.right != null)
                Q.Enqueue(cur.right);
        }
    
    return root;
    }
```

## [对称二叉树](https://leetcode.cn/problems/symmetric-tree/)

![image-20251204143456847](/notes-assets/Algorithm/assets/image-20251204143456847.png)

**判断对称二叉树的关键在于验证整棵树是否呈镜像对称，这需要同时满足两个层面的比较条件：**

1. **节点值层面的对称性**：对应位置的节点值必须相等
2. **子树结构层面的对称性**：需要比较内外侧子树的对称关系**外侧比较**：左子树的左子节点 vs 右子树的右子节点**内侧比较**：左子树的右子节点 vs 右子树的左子节点

**采用递归解法时，必须严谨处理以下边界条件：**

- **基准情况**：当比较的两个节点都为空时，视为对称
- **不对称情况**：任一节点为空而另一个不为空，或节点值不相等
- **递归推进**：在每一层递归中，需要同时验证外侧子树对和内侧子树对是否都对称

```C#
public class Solution {
    public bool IsSymmetric(TreeNode root) {
        if(root == null)
            return true;
        return isSymmetric(root.left,root.right);
    }
    public bool isSymmetric(TreeNode L,TreeNode R){
        if(L == null && R ==null)
            return true;
        if(L == null || R ==null)
            return false;

        if(L.val != R.val){
            return false;
        }
        return isSymmetric(L.left,R.right) && isSymmetric(R.left,L.right);
    }
}
```

**迭代法实现对称二叉树判断时，与常规的层次遍历有所不同，需要采用特殊的"对称配对"遍历策略：**

1. **同步遍历机制**：同时处理左右子树中对应的镜像节点对，而非单独遍历某一边
2. **配对比较原则**：每次从队列中成对取出节点进行比较，确保比较的是对称位置上的节点
3. **对称性入队**：将子节点按镜像对称的顺序入队，维持下一轮的对称比较关系左子的左子节点与右子的右子节点配对（外侧对称）左子的右子节点与右子的左子节点配对（内侧对称）

```C#
public class Solution {
    public bool IsSymmetric(TreeNode root) {
        if (root == null)
            return true;
        
        Queue<TreeNode> queue = new Queue<TreeNode>();
        queue.Enqueue(root.left);
        queue.Enqueue(root.right);
        
        while (queue.Count > 0) {
            TreeNode L = queue.Dequeue();
            TreeNode R = queue.Dequeue();
            
            // 先判断两个节点都为null的情况
            if (L == null && R == null)
                continue;
            
            // 再判断一个为null一个不为null的情况
            if (L == null || R == null)
                return false;
            
            // 最后判断值是否相等
            if (L.val != R.val)
                return false;
            
            // 按对称顺序入队
            queue.Enqueue(L.left);
            queue.Enqueue(R.right);  // 外侧比较
            queue.Enqueue(L.right);
            queue.Enqueue(R.left);   // 内侧比较
        }
        return true;
    }
}
```

### 相关题目

#### [相同的树](https://leetcode.cn/problems/same-tree/)

![image-20251204150038099](/notes-assets/Algorithm/assets/image-20251204150038099.png)

**判断两棵树是否相同与对称二叉树在本质上确实具有相似的遍历逻辑：两者都需要同步遍历两棵树的对应节点并进行比较。不同之处在于比较的对称关系：**

- **对称二叉树**：比较的是同一棵树内的镜像对称关系（左子的左子 vs 右子的右子）
- **相同树判断**：比较的是两棵独立树在相同位置上的节点关系（树A的左子 vs 树B的左子）

**核心思想一致**：都需要采用深度优先搜索，同步遍历两棵树的结构，确保在每个对应位置上的节点值相等且子树结构一致。

```C#
public class Solution {
    public bool IsSameTree(TreeNode p, TreeNode q) {
        // 合并边界条件判断，使代码更简洁
        if (p == null && q == null) return true;
        if (p == null || q == null) return false;
        
        // 值不相等立即返回false，避免不必要的递归
        if (p.val != q.val) return false;
        
        // 递归比较左右子树
        return IsSameTree(p.left, q.left) && IsSameTree(p.right, q.right);
    }
}
```

#### [另一棵树的子树](https://leetcode.cn/problems/subtree-of-another-tree/)

![image-20251204150709809](/notes-assets/Algorithm/assets/image-20251204150709809.png)

**判断子树问题相比判断相同树难度更高，主要体现在约束条件的严格性上：**

- **相同树判断**：只需验证两棵树在结构和值上完全一致
- **子树判断**：需要验证`subRoot`必须是`root`中**连续完整**的子树部分，不能跨越多个层级或分散在不同分支

**本质区别在于**：子树必须是原树中一个完整的连通分量，这意味着：

1. **连续性要求**：`subRoot`的所有节点必须在`root`中形成连续的子树结构
2. **位置限制**：`subRoot`只能是`root`的某个左子树**或**右子树，不能同时包含左右分支的不同部分
3. **完整性约束**：匹配时必须包含`subRoot`的整个树形结构，不能只匹配部分节点

**算法核心**：通过遍历`root`的每个节点作为潜在的子树的根，然后验证从该节点开始的子树是否与`subRoot`完全相同。

```c#
public class Solution {
    public bool IsSubtree(TreeNode root, TreeNode subRoot) {
        if (subRoot == null) return true;  // 空树是任何树的子树
        if (root == null) return false;    // 非空树不可能是空树的子树
        
        // 判断当前子树是否与subRoot相同，或者是左/右子树的子树
        return IsSameTree(root, subRoot) || 
            IsSubtree(root.left, subRoot) || 
            IsSubtree(root.right, subRoot);
    }

    // 辅助方法：判断两棵树是否完全相同
    private bool IsSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) return true;
        if (p == null || q == null) return false;
        if (p.val != q.val) return false;
        
        return IsSameTree(p.left, q.left) && IsSameTree(p.right, q.right);
    }
}
```

## [完全二叉树的节点个数](https://leetcode.cn/problems/count-complete-tree-nodes/)

![image-20251204222506771](/notes-assets/Algorithm/assets/image-20251204222506771.png)

对于本题来说，如果使用常规的二叉树遍历方法（如前序、中序、后序遍历）来统计节点个数，时间复杂度为 O(n)，虽然可以解决问题，但未能充分利用完全二叉树的性质。本题的考点在于如何利用完全二叉树的结构特征进行优化，达到低于 O(n) 的时间复杂度。

完全二叉树（Complete Binary Tree）的定义是：除最后一层外，其余层都是满的，并且最后一层的节点尽可能靠左排列。根据这个性质，我们可以通过判断子树是否为满二叉树来减少递归或遍历的深度。

具体优化思路如下：

- 对于任意子树，分别计算其左子树的最左路径深度（leftDepth）和右子树的最右路径深度（rightDepth）。
- 如果 leftDepth 等于 rightDepth，说明当前子树是一棵满二叉树，其节点总数可直接由公式 2depth−1计算得出，无需递归遍历所有节点。
- 如果 leftDepth 不等于 rightDepth，说明当前子树不是满二叉树，则递归计算左子树和右子树的节点数，并在结果上加 1（当前根节点）。

这种方法利用了完全二叉树的结构特性，将问题分解为多个满二叉子的统计，从而在平均情况下降低时间复杂度，最坏情况下为 O(log n × log n)。

```C#
public class Solution {
    public int CountNodes(TreeNode root) {
    	if(root == null) return 0;
        TreeNode leftNode = root.left;
        TreeNode rightNode = root.right;
        int leftDepth = 0;
        int rightDepth = 0;
        while(leftNode != null){
      		leftDepth++;
            leftNode = leftNode.left; 
        }
        while(rightNode != null){
            rightDepth++;
            rightNode = rightNode.right;
        }
        int count = 0;
        return rightDepth == leftDepth ? (2 << leftDepth) - 1:CountNode(root.left) + CountNode(root.right) + 1;
        
    }
}
```

## [平衡二叉树](https://leetcode.cn/problems/balanced-binary-tree/)

![image-20251204231310854](/notes-assets/Algorithm/assets/image-20251204231310854.png)

本题我在写的时候，因为刚写过完全二叉树的节点个数这题，就想着能不能借用完全二叉树的节点这题的思路来求解。因为本题也需要求解二叉树的高度，先求解左边的高度，在得到右边的高度，然后判断相差是否大于 1 。接着进行递归，判断每个子树是否满足平衡二叉树，思路可行但是存在问题。结果出现问题，因为遍历的时候，一直向左或者向右，无法判断正确的高度。最后我想到之前写的二叉树的最大深度问题，因此，我开始每次判断当前节点的左右子树的最大深度，每次都进行比较，得到最后结果。

**问题分析：**

1. **深度计算方法的差异**：完全二叉树节点统计中，计算的是**最左路径**和**最右路径**的深度，这适用于判断是否为满二叉树平衡二叉树判断需要的是**真实的最大深度**，而不仅仅是单侧路径深度
2. **平衡二叉树的定义理解**：平衡二叉树要求**每个节点**的左右子树高度差不超过1仅凭最左和最右路径深度无法准确反映真实的高度差，因为二叉树可能在某些分支上深度很大

第二次尝试的方向：

- 使用 `process`方法计算每个节点的真实最大深度
- 通过递归确保每个子树都满足平衡条件
- 时间复杂度为 O(n²)，因为每个节点都需要计算深度

```C#
public class Solution {
    public bool IsBalanced(TreeNode root) {
        if(root == null) return 0;
        TreeNode leftNode = root.left;
        TreeNode rightNode = root.right;
        int leftDepth = 0;
        int rightDepth = 0;
        while(leftNode != null){
      		leftDepth++;
            leftNode = leftNode.left; 
        }
        while(rightNode != null){
            rightDepth++;
            rightNode = rightNode.right;
        }
        int abs = Math.Abs(leftDepth - rightDepth);
        if(abs > 1)
            return false;
        return IsBalanced(root.left) && IsBalanced(root.right) && true;
    }
}
```

```C#
public class Solution {
    public bool IsBalanced(TreeNode root) {
        if(root == null)return true;
        int leftDepth = process(root.left);
        int rightDepth = process(root.right);
        int abs = Math.Abs(leftDepth - rightDepth);
        if(abs > 1)
            return false;
        return IsBalanced(root.left) && IsBalanced(root.right) && true;
    }
    public int process(TreeNode root){
        if(root == null) return 0;
        return Math.Max(process(root.left),process(root.right)) + 1;
    }
}
```

## [二叉树的所有路径](https://leetcode.cn/problems/binary-tree-paths/)

![image-20251205225515233](/notes-assets/Algorithm/assets/image-20251205225515233.png)

对于本题求解二叉树的所有路径，我们需要找到从根节点到所有叶子节点的所有可能路径。由于一个节点可以有左右两个子节点，每个子节点又可能延伸出新的路径，因此我们需要系统地探索所有可能的路径组合。

1. **回溯法的应用**

回溯法是解决此类问题的关键。每个节点都可以作为一个"跳板"，用于探索其下方不同的路径分支。具体来说：

- 从根节点出发，沿着一条路径深入
- 当到达叶子节点时，记录当前路径
- 然后回溯到上一个分支点，选择另一条未探索的路径继续深入
- 重复此过程直到所有路径都被探索

2. **叶子节点作为终止条件**

题目要求找到所有从根节点到叶子节点的路径，因此叶子节点自然成为递归的终止条件。叶子节点的特征是：既没有左子节点也没有右子节点。

3. **路径记录与回溯机制**

我们使用一个列表 `path`来动态记录当前探索的路径：

- **前进**：每次访问一个节点，将其值加入 `path`
- **回溯**：当一条路径探索完成（到达叶子节点）或某个分支探索完毕，需要从 `path`中移除当前节点，回到上一个状态

```C#
public IList<string> BinaryTreePaths(TreeNode root) {
        var result = new List<string>();
        if(root == null)return result;
        List<int> path = new List<int>();
        process(root,result,path);
        return result;
    }
    public void process(TreeNode cur,List<string> res,List<int> path)
    {
        //直接将当前节点装入
        path.Add(cur.val);
        if(cur.left == null && cur.right == null) //代表当前节点是叶子节点,说明找到了一条路径，path已经装完了一条完整的路径
        {
            StringBuilder sb = new StringBuilder();  //C#string是不能修改的
            for(int i = 0;i < path.Count - 1;i++){  //因为最后一个节点是 不需要 -> ，遍历到Count - 1，好处理 ->
                sb.Append(path[i]);
                sb.Append("->");
            }
            sb.Append(path[path.Count - 1]);
            res.Add(sb.ToString());
            return;
        }     
        //找到一个后开始递归，寻找下一个路径并且在找到后进行回溯
        if(cur.left != null)
        {
            process(cur.left,res,path);
            path.RemoveAt(path.Count - 1);
        }
        if(cur.right != null){
            process(cur.right,res,path);
            path.RemoveAt(path.Count - 1);
        }
    }
```

迭代法

**双栈协同机制**

我们使用两个栈来实现同步遍历：

- **节点栈 (treeNode)**：存储待处理的树节点
- **路径栈 (Path)**：存储从根节点到当前节点的完整路径字符串 这种双栈设计确保了每个节点都与其对应的路径精确对应，避免了复杂的回溯操作。

**栈的先进后出特性**

栈的LIFO（后进先出）特性让我们自然地实现了**深度优先遍历**：

- 每次处理栈顶元素（最近添加的节点）
- 优先处理左子树（由于入栈顺序，实际上右子树先入栈，左子树后入栈，所以左子树先被处理）

**路径信息的实时构建**

与递归法中回溯重建路径不同，迭代法在遍历过程中**实时构建并保存完整路径**：

- 当处理一个新节点时，立即构建"从根节点到该节点"的完整路径字符串
- 将路径与节点一同入栈，实现路径信息的"空间换时间"

```C#
public IList<string> BinaryTreePaths(TreeNode root) {
	Stack<TreeNode> treeNode = new Stack<TreeNode>();
    Stack<string> Path = new Stack<string>();
    var ans = new List<string>();
    treeNode.Push(root);
    Path.Push(root.val.ToString());
    while(treeNode.Count > 0){
        TreeNode temp = treeNode.Pop();
        string path = Path.Pop();
        if(temp.left == null && temp.right == null)  //如果是叶子节点，找到一条结果
        	ans.Add(path);
        if(temp.right != null){
			treeNode.Push(temp.right);
            Path.Push(path + "->" + temp.right.val.ToString()); //如果不是叶子节点，则把之前的路径 + 之后的路径
        }
        if(temp.left != null){
			treeNode.Push(temp.left);
            Path.Push(path + "->" + temp.left.val.ToString());
        }
    }
    return ans;
}
```

## [左叶子之和](https://leetcode.cn/problems/sum-of-left-leaves/)

![image-20251206145043475](/notes-assets/Algorithm/assets/image-20251206145043475.png)

本题的主要难点在于如何准确地判断一个节点是否为左叶子节点。由于叶子节点本身不包含指向子节点的信息，因此需要**从其父节点的视角**进行判断。左叶子节点必须同时满足以下两个条件：

1. 该节点是父节点的左子节点（即 `parent.left == node`）；
2. 该节点自身为叶子节点，即其左、右子节点均为空（`node.left == null && node.right == null`）。

基于以上条件，我们可以在递归遍历二叉树的过程中，**在父节点处判断其左子节点是否为叶子节点**。如果是，则将该左叶子节点的值加入总和；否则，继续递归遍历左子树和右子树，直至遍历完整棵树。

具体实现时，我们通过一个变量累加所有满足条件的左叶子节点的值，并在递归过程中不断更新这个总和。这种方法的时间复杂度为 O(n)，其中 n 为节点个数，因为需要访问树中的每个节点。空间复杂度取决于递归深度，在最坏情况下（树退化为链表）为 O(n)。 

```C#
 public int SumOfLeftLeaves(TreeNode root) {
        int sum = 0;
        if(root == null)return 0;
        if(root.left == null && root.right == null)return 0;
        if(root.left != null && root.left.left == null && root.left.right == null){
            sum += root.left.val;
        }
        sum += SumOfLeftLeaves(root.left);
        sum += SumOfLeftLeaves(root.right);
        return sum;
    }
```

迭代法就是常见的层序遍历求解，判断条件还是一样的。

在迭代过程中，我们从根节点开始，依次处理队列中的每个节点。对于当前节点 `temp`：

- 如果其左子节点存在且为叶子节点（左右子节点均为空），则将其值累加到总和中。
- 将当前节点的左、右子节点（如果存在）加入队列，以便后续处理。

这种方法**逐层遍历**二叉树，确保每个节点都被访问一次，并在访问父节点时判断其左子节点是否为左叶子。与递归法相比，迭代法避免了递归调用的函数栈开销，更适合深度较大的树结构。

```C#
public int SumOfLeftLeaves(TreeNode root) {
        Queue<TreeNode> queue = new Queue<TreeNode>();
        int sum = 0;
        if(root == null)return 0;
        if(root.left == null && root.right == null)return 0;
        queue.Enqueue(root);
        while(queue.Count > 0){
            TreeNode temp = queue.Dequeue();
            if(temp.left != null && temp.left.left == null && temp.left.right == null)
                sum += temp.left.val;
            if(temp.left != null)
                queue.Enqueue(temp.left);
            if(temp.right != null)
                queue.Enqueue(temp.right);
        }
        return sum;
    }
```

## [找树左下角的值](https://leetcode.cn/problems/find-bottom-left-tree-value/)

![image-20251206152954489](/notes-assets/Algorithm/assets/image-20251206152954489.png)

本题如果使用迭代法求解，核心思路与**二叉树的右视图**问题非常相似，都是基于**层序遍历（广度优先搜索）**的思想。两者的关键在于**处理每一层的节点时记录特定位置的值**

**层序遍历框架**： 使用队列实现标准的二叉树层序遍历 通过记录每层节点数（`levelSize`）确保每次处理完整的一层

**记录位置差异**：

-  **二叉树右视图**：记录每层的最后一个节点（`i == levelSize - 1`） **二叉树左下角值**：记录每层的第一个节点（`i == 0`）

**更新策略**： 在遍历每一层时，将目标值更新为当前层对应的节点值 由于遍历是从上到下的，最后一次更新的值必然是**最后一层**的目标节点值 对于本题，最终得到的就是最后一层的最左侧节点值

```C#
public class Solution {
    public int FindBottomLeftValue(TreeNode root) {
        Queue<TreeNode> queue = new Queue<TreeNode>();
        int sum = 0;
        if(root == null)return 0;
        queue.Enqueue(root);
        while(queue.Count > 0){   
            int levelSize = queue.Count; 
            for(int i = 0;i < levelSize;i++)   {
                TreeNode temp = queue.Dequeue();

                if(i == 0)
                    sum = temp.val;        
                
                if(temp.left != null)
                    queue.Enqueue(temp.left);
                if(temp.right != null)
                    queue.Enqueue(temp.right);
            }
           
        }
        return sum;
    }
}
```

**递归终止条件**： 当遇到叶子节点（`root.left == null && root.right == null`）时，进行判断 比较当前深度与记录的最大深度 如果当前深度更大，说明找到了更深的叶子节点，更新最大深度和结果值

**深度传递**： 在递归调用时传递当前深度 `depth + 1` 由于每个递归调用都有自己的 `depth`参数副本，实现了深度的**隐式回溯**

**优先遍历顺序**： 先递归左子树，再递归右子树 对于同一深度的多个叶子节点，左子树的叶子节点会先被访问 这确保了当多个节点处于同一最大深度时，最左侧的节点值被正确记录

```C#
public class Solution {
    public int result;
    public int maxDepth = int.MinValue;
    public int FindBottomLeftValue(TreeNode root) {
        if(root == null)return 0;
        process(root,0);
        return result;
    }
    public void process(TreeNode root,int depth){
        if(root.left == null && root.right == null)//叶子节点
        {
            if(depth > maxDepth){
                maxDepth = depth;
                result = root.val;   
            }
            return;
        }
        if(root.left != null)
        {
            process(root.left,depth + 1);//隐藏着回溯，因为depth的实际深度没有 + 1
        }
        if(root.right != null)
        {
            process(root.right,depth + 1);
        }
        return;
    }
}
```

## [路径总和](https://leetcode.cn/problems/path-sum/)

![image-20251206172505875](/notes-assets/Algorithm/assets/image-20251206172505875.png)

递归求解：

**递归框架**：函数从根节点开始深度优先遍历，在递归过程中累加从根节点到当前节点父节点的路径和。

**叶子节点判断**：当到达叶子节点（左右子节点均为空）时，将当前累加值与叶子节点值相加，若等于目标值则立即返回`true`，表示找到有效路径。

**子树探索**：对于非叶子节点，递归遍历其左子树和右子树，并将当前节点值加入累加和传递给子递归调用。

**结果聚合**：递归返回时，通过逻辑或运算合并左右子树的搜索结果。只要任意子树存在有效路径，即向上返回`true`，否则返回`false`。

**搜索终止**：一旦在某条路径的叶子节点找到匹配，结果会通过递归调用链向上传递，最终返回给主函数。

```C#
public class Solution {
    public bool HasPathSum(TreeNode root, int targetSum) {
        if(root == null)return false;
        bool res = false;
        res = process(root,targetSum,0);
        return res;
    }
    public bool process(TreeNode root,int targetSum,int curSum){

        if(root.left == null && root.right == null)
            if(curSum + root.val == targetSum)
                return true;
        bool leftResult = false;
        bool rightResult = false;
        if(root.left != null)
        {
            leftResult = process(root.left,targetSum,curSum + root.val);
        }
        if(root.right != null)
        {
            rightResult = process(root.right,targetSum,curSum + root.val);
        }
        return leftResult || rightResult;
    }
}
```

迭代法：使用双栈结构或者元组栈。使用一个节点栈存储当前遍历的节点，同时使用一个路径和栈同步存储从根节点到当前节点**父节点**的累计和。

- 在遍历过程中，当到达叶子节点时，将栈中存储的父节点路径和与当前叶子节点值相加，若等于目标值则立即返回`true`；
- 对于非叶子节点，则将其子节点及更新后的路径和分别压入对应的栈中，继续深度优先搜索。

```C#
public bool HasPathSum1(TreeNode root, int targetSum) {
        if(root == null)return false;
        Stack<TreeNode> treeNode = new Stack<TreeNode>();
        Stack<int> sumNode = new Stack<int>();
        treeNode.Push(root);
        sumNode.Push(0);
        while(treeNode.Count > 0){
            TreeNode cur = treeNode.Pop();
            int cursum = sumNode.Pop();
            if(cur.left == null && cur.right == null)
            	if(cursum + cur.val == targetSum)
                    return true;
            if(cur.right != null){
                treeNode.Push(cur.right);
                sumNode.Push(cur.val + cursum);
            }

            if(cur.left != null)
            {
	            treeNode.Push(cur.left);
                sumNode.Push(cur.val + cursum);
            }
        }
        return false;
    }
```

## [从中序与后序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)

![image-20251206201615554](/notes-assets/Algorithm/assets/image-20251206201615554.png)

**通过中序遍历和后序遍历序列构建二叉树**的递归算法。其核心思路是：**利用后序遍历的最后一个元素确定根节点，然后在中序遍历中找到该根节点的位置，以此划分左右子树的中序序列，并根据左右子树的节点数量对应划分后序序列，最后递归构建左右子树**。

算法首先从后序遍历末尾获取根节点值并创建根节点；然后在中序遍历中定位根节点位置，将中序序列分割为左子树和右子树的中序数组；

接着根据左右子树的节点数量（由中序分割结果确定），将后序序列相应分割为左子树和右子树的后序数组；

最后递归调用自身构建左子树和右子树，并连接到根节点上。该算法通过不断在子数组中重复“确定根节点-分割序列-递归构建”的过程，最终完成整个二叉树的重建。

在实际实现中，数组的划分容易产生混乱，需要特别注意**索引边界**。本算法采用创建四个新数组的方式：

1. **中序左子树数组**：`inorder[0]`到 `inorder[rootIndex-1]`
2. **中序右子树数组**：`inorder[rootIndex+1]`到 `inorder[inorder.Length-1]`
3. **后序左子树数组**：`postorder[0]`到 `postorder[rootIndex-1]`
4. **后序右子树数组**：`postorder[rootIndex]`到 `postorder[postorder.Length-2]`

**关键规律**：后序数组中左子树和右子树的分界点正好是`rootIndex`（即左子树的节点数量），因为左子树节点数 = 中序根节点索引位置 = 后序左子树结束位置。

```C#
public class Solution {
    public TreeNode BuildTree(int[] inorder, int[] postorder) {
        if (inorder.Length == 0 || postorder.Length == 0) return null;

        //找到根节点，并且创建根节点
        int rootVal = postorder[postorder.Length - 1];
        TreeNode root = new TreeNode(rootVal);

        int rootIndex = Array.IndexOf(inorder,rootVal);//判断根节点在中序遍历的位置，找到左右子树

        //中序 - 左子树
        int[] insortLeft = new int[rootIndex];
        for(int i = 0;i < rootIndex;i++)
            insortLeft[i] = inorder[i];
        
        //中序 - 右子树
        int[] insortRight = new int[inorder.Length - rootIndex - 1];
        for(int i = 0;i < insortRight.Length;i++)
            insortRight[i] = inorder[i + rootIndex + 1];

        //后序 - 左子树
        int[] postsortLeft = new int[rootIndex];
        for(int i = 0;i < rootIndex;i++){
            postsortLeft[i] = postorder[i];
        }  

        //后序 - 右子树
        int[] postsortRight = new int[inorder.Length - rootIndex - 1];
        for(int i = 0;i < postsortRight.Length;i++){
            postsortRight[i] = postorder[rootIndex + i];
        }
        root.left = BuildTree(insortLeft,postsortLeft);
        root.right = BuildTree(insortRight,postsortRight);

        return root;
    }
}
```

### 相关题目

#### [从前序与中序遍历序列构造二叉树](https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

![image-20251206202121201](/notes-assets/Algorithm/assets/image-20251206202121201.png)

**根节点确定**：前序遍历的第一个元素 `preorder[0]`为当前子树的根节点值，据此创建根节点。

**中序定位**：在中序遍历数组中查找该根节点的位置 `rootIndex`，此位置将中序序列划分为左右子树的中序数组。

**序列划分**： 

- 中序左子树数组为 `inorder[0]`到 `inorder[rootIndex-1]` 
- 中序右子树数组为 `inorder[rootIndex+1]`到 `inorder`末尾 
- 前序左子树数组为 `preorder[1]`到 `preorder[rootIndex]` 
- 前序右子树数组为 `preorder[rootIndex+1]`到 `preorder`末尾

**递归构建**：将划分得到的左右子树前序和中序数组分别传入递归函数，构建左右子树并连接到根节点。

```C#
public class Solution {
    public TreeNode BuildTree(int[] preorder, int[] inorder) {
        if (preorder.Length == 0 || inorder.Length == 0) return null;

        int rootVal = preorder[0];
        TreeNode root = new TreeNode(rootVal);

        int rootIndex = Array.IndexOf(inorder, rootVal);

        // 中序 - 左子树
        int[] inSortLeft = new int[rootIndex];
        for(int i = 0; i < rootIndex; i++){
            inSortLeft[i] = inorder[i];
        }
        
        // 中序 - 右子树
        int[] inSortRight = new int[inorder.Length - rootIndex - 1];
        for(int i = 0; i < inSortRight.Length; i++){
            inSortRight[i] = inorder[rootIndex + 1 + i];
        }

        // 前序 - 左子树
        int[] preSortLeft = new int[rootIndex];
        for(int i = 0; i < preSortLeft.Length; i++){
            preSortLeft[i] = preorder[1 + i];
        }

        // 前序 - 右子树
        int[] preSortRight = new int[inorder.Length - rootIndex - 1];
        for(int i = 0; i < preSortRight.Length; i++){  // 修正：使用preSortRight.Length
            preSortRight[i] = preorder[rootIndex + 1 + i];  // 修正：正确的索引计算
        }

        root.left = BuildTree(preSortLeft, inSortLeft);
        root.right = BuildTree(preSortRight, inSortRight);
        return root;
    }
}
```

## [最大二叉树](https://leetcode.cn/problems/maximum-binary-tree/)

![image-20251209203820207](/notes-assets/Algorithm/assets/image-20251209203820207.png)

本题也是给定数组去构建二叉树，但是与上述的根据后序遍历和中序遍历构建二叉树有所不同在只给一个数组去构建。但其实本质是一样的，本题在于最大二叉树中的最大代表则数组的最大值，这样我们只需要找到数组的最大值就可以确定根节点，以及分割左右子树了。在每次确定根节点和左右子树后，进行递归，在此找到子节点的左右子树，即可完成题解。

```C#
public class Solution {
    public TreeNode ConstructMaximumBinaryTree(int[] nums) {
        if(nums == null||nums.Length == 0)return null;
        int maxVal = nums.Max();
        int maxValIndex = Array.IndexOf(nums,maxVal);
        TreeNode root = new TreeNode(maxVal);

        //左子树
        int[] leftSort = new int[maxValIndex];
        for(int i = 0;i < leftSort.Length;i++){
            leftSort[i] = nums[i];
        }

        //右子树
        int[] rightSort = new int[nums.Length - maxValIndex - 1];
        for(int i = 0;i < rightSort.Length ;i++){
            rightSort[i] = nums[i + maxValIndex + 1];
        }
        root.left = ConstructMaximumBinaryTree(leftSort);
        root.right = ConstructMaximumBinaryTree(rightSort);
        
        return root;
    }
}
```

在每次递归调用时，都通过循环复制创建了新的左子树数组 (`leftSort`) 和右子树数组 (`rightSort`)。这个过程会消耗额外的时间和空间。更高效的做法是**通过传递索引范围来在原数组上进行操作**

```C#
public class Solution {
    public TreeNode ConstructMaximumBinaryTree(int[] nums) {
        return BuildTree(nums,0,nums.Length - 1);
    }
    public TreeNode BuildTree(int[] nums,int left,int right){
		// 递归终止条件：当左边界超过右边界，说明当前子树为空
        if (left > right) {
            return null;
        }    
        //在当前区间 [left, right] 内找到最大值及其索引
        int maxIndex = left;
        for (int i = left + 1; i <= right; i++) {
            if (nums[i] > nums[maxIndex]) {
                maxIndex = i;
            }
        }
    	//以最大值创建根节点
        TreeNode root = new TreeNode(nums[maxIndex]);
        
        // 递归构建左子树（区间：left 到 maxIndex-1）
        root.left = Build(nums, left, maxIndex - 1);
        // 递归构建右子树（区间：maxIndex+1 到 right）
        root.right = Build(nums, maxIndex + 1, right);
        
        return root;
    }
}
```

## [合并二叉树](https://leetcode.cn/problems/merge-two-binary-trees/)

![image-20251212201838032](/notes-assets/Algorithm/assets/image-20251212201838032.png)

对于本题求解，只需要进行同时比较即可，每次比较两棵树的节点是否为空，都不为空则相加，其中有一个为空，则将另一个树的节点挂载到新树上即可

```C#
public class Solution {
    public TreeNode MergeTrees(TreeNode root1, TreeNode root2) {
        if(root1 == null && root2 != null)return root2;
        if(root2 == null && root1 != null)return root1;
        if(root1 == null && root2 == null)return null;
        TreeNode newRoot = new TreeNode(root1.val + root2.val);

        newRoot.left = MergeTrees(root1.left,root2.left);
        newRoot.right = MergeTrees(root1.right,root2.right);
        return newRoot;
    }
}
```

## [二叉搜索树中的搜索](https://leetcode.cn/problems/search-in-a-binary-search-tree/)

![image-20251212202133416](/notes-assets/Algorithm/assets/image-20251212202133416.png)

- **终止条件**：首先明确递归何时结束。一是当遍历到空节点 (`root == null`)，说明目标值不存在于树中，返回 `null`。二是当当前节点的值等于目标值 (`root.val == val`)，说明找到了目标节点，返回该节点。
- **递归过程**：利用二叉搜索树的**有序性**决定搜索路径。比较目标值 `val`与当前节点值 `root.val`的大小：
  - 若 `val`更小，则**递归地在左子树中搜索**。
  - 若 `val`更大，则**递归地在右子树中搜索**。
- **返回值**：始终返回以找到的节点为根的子树。如果未找到，最终会返回 `null`。

```C#
public class Solution {
    public TreeNode SearchBST(TreeNode root, int val) {
        if(root == null || root.val == val)return root;

        TreeNode res = null;
        if(root.val > val)
            res = SearchBST(root.left,val);
        if(root.val < val)
            res = SearchBST(root.right,val);

        return res;
    }
}
```

迭代法求解：

```C#
public class Solution {
    public TreeNode SearchBST(TreeNode root, int val) {
        TreeNode currentNode = root;
        while (currentNode != null) {
            if (val == currentNode.val) {
                return currentNode; // 找到目标节点
            } else if (val < currentNode.val) {
                currentNode = currentNode.left; // 转向左子树
            } else {
                currentNode = currentNode.right; // 转向右子树
            }
        }
        return null; // 遍历到叶子节点仍未找到
    }
}
```

## [验证二叉搜索树](https://leetcode.cn/problems/validate-binary-search-tree/)

![image-20251212203804472](/notes-assets/Algorithm/assets/image-20251212203804472.png)

方法一：中序遍历法。如果是二叉搜索树，我们使用中序遍历得到是递增序列。因此我们将使用中序遍历二叉树得到一个数组，然后判断数组是否是递增数组即可

```C#
public class Solution {
    public bool IsValidBST(TreeNode root) {
        if(root == null)
            return true;
        List<int> ans = new List<int>();
        P(root,ans);
        for(int i = 1;i < ans.Count;i++){
            if(ans[i] <= ans[i - 1])
            return false;
        }
        return true;
    }
    public void P(TreeNode root,List<int> ans){
        if(root ==  null)return;
        P(root.left,ans);
        ans.Add(root.val);
        P(root.right,ans);
    }
}
```

方法二：递归求解法。所有的递归模拟都可以使用栈来解决，在题解时，我们使用栈来模拟递归求解。因为采用的是中序遍历求解，所有需要使用2个变量来记录当前节点和前一个节点。进行 左 和 中 比较，中在和 右比较，依此比较来验证是否是2叉搜索树。

算法步骤如下：

1. **深入左子树**：从根节点开始，尽可能地将当前节点及其左子节点压入栈中，直到最左边的叶子节点。这模拟了递归中的“左”步骤。
2. **处理中间节点**：当`cur`为空时，表示已经到达某条路径的最左端，此时从栈顶弹出一个节点，它就是当前应该访问的“中间”节点。比较该节点与前驱节点`pre`的值，如果当前节点值小于或等于`pre`的值，则违反了BST的严格递增规则，立即返回`false`。
3. **转向右子树**：在处理完中间节点后，将`pre`更新为当前节点，并开始遍历该节点的右子树。这模拟了递归中的“右”步骤。
4. **循环与终止**：重复步骤1-3，直到栈为空且`cur`也为空，表示所有节点都已处理完毕。如果遍历全程没有发现违反规则的情况，则返回`true`。

```C#
public class Solution {
    public bool IsValidBST(TreeNode root) {
 		if(root == null)
            return true;
        Stack<TreeNode> st = new Stack<TreeNode>();
        TreeNode cur = root;
        TreeNode pre = null;
        while(cur != null || st.Count > 0){
			if(cur != null){
                st.Push(cur);
				cur = cur.left;
            }
            else{
                cur = st.Pop();
                if(pre != null && cur.val <= pre.val)
                    return false;
                pre = cur;
                cur = cur.right;
            }
        }
        return true;
    }
}
```

方法三：树形DP

**信息收集与传递**：算法为每个节点定义了一个 `Info`类，用来记录以该节点为根的子树的三项关键信息： `max`：该子树中的**最大值**。 `min`：该子树中的**最小值**。 `isSelect`：该子树是否是**有效的BST**。

**递归基**：如果当前节点 `head`为 `null`，直接返回 `null`。这保证了递归的终止。

**子树判定与范围计算**：如图中步骤所示，算法先递归地获取左右子树的 `Info`信息。然后，当前子树的 `max`和 `min`由当前节点值、左子树的最大值、右子树的最大值共同决定；当前子树的 `min`则由当前节点值、左子树的最小值、右子树的最小值共同决定。

**有效性综合判定**：当前子树是否为BST（`IsSelect`）由四个条件共同决定，必须全部满足才为 `true`，对应流程图中的判断路径： 左子树存在时，它本身必须是BST。 右子树存在时，它本身必须是BST。 如果左子树存在，其最大值必须严格小于当前节点值。 如果右子树存在，其最小值必须严格大于当前节点值。

```C#
public class Info{
    public int max;
    public int min;
   	public bool isSelect;
    public Info(int M,int m,int isS){
        max =M;
        min = m;
        isSelect = isS;
    }
}
public bool IsValidBST(TreeNode head){
    if(head == null)
        return true;
    return process(head).isSelect;
}
public Info process(TreeNode head){
	if(head == null)
		return null;
    
    Info left = process(head.left);
    Info right = process(head.right);
    
    int max = head.val;
    int min = head.val;
    if(left!=null){
		max = Math.Max(max,left.max);
        min = Math.min(min,left.min);
    }
     if(right!=null){
		max = Math.Max(max,right.max);
        min = Math.min(min,right.min);
    }
    bool IsSelect = true;
    if(left!=null && !left.isSelect)
        IsSelect =false;
    if(right!=null && !right.isSelect)
        IsSelect =false;
    if(left.max >= head.val && left!=null)
        IsSelect =false;
    if(right.max <= head.val && right!=null)
        IsSelect =false;
    return new Info(max,min,IsSelect);
}
```

## [二叉搜索树的最小绝对差](https://leetcode.cn/problems/minimum-absolute-difference-in-bst/)

![image-20251214200736785](/notes-assets/Algorithm/assets/image-20251214200736785.png)

方法一：中序遍历二叉搜索树的结果是一个递增的数组。所以我们只需要将二叉搜索树转变为数组，然后遍历数组，每次记录数组间元素的差值，即可找到最小绝对差。

```C#
public class Solution {
    public int GetMinimumDifference(TreeNode root) {
        int MinAns = 0;
 		if(root == null)return MinAns;
        List<int> res = new List<int>();
        MinAns = res[1] - res[0];
        for(int i = 1;i < res.Count;i++){
            MinAns = Math.Min(MinAns,res[i] - res[i - 1]);
        }
        return MinAns;
    }
    public void Process(TreeNode root,List<int> res){
        if(root == null)return;
        Process(root.left,res);
        res.Add(root.val);
        Process(root.right,res);
    }
}
```

方法二：

**遍历过程：中序遍历 (In-order Traversal)** 代码中的 `Process`函数是一个递归的中序遍历函数： `Process(cur.left);`：递归遍历左子树。 处理当前节点 `cur`：这是中序遍历访问节点的时机。 `Process(cur.right);`：递归遍历右子树。

**关键操作：在遍历时计算差值** 在访问每个当前节点 `cur`时，算法执行以下步骤： **检查前驱节点**：通过全局变量 `pre`记录中序遍历序列中当前节点的前一个节点。当 `pre`不为 `null`时，说明当前节点 `cur`有其前驱。 **计算并更新最小差值**：计算当前节点值 `cur.val`与前驱节点值 `pre.val`的差值 `cur.val - pre.val`（因为中序遍历是递增的，该差值必然为正数，无需取绝对值）。然后将此差值与当前记录的最小差值 `MinAns`进行比较，取较小者更新 `MinAns`。 **更新前驱节点**：将全局变量 `pre`设置为当前节点 `cur`。这样，当遍历到下一个节点时，`pre`就指向了它的前驱。

```C#
public class Solution {
    public TreeNode pre;
    public int MinAns = int.MaxValue;
    public int GetMinimumDifference(TreeNode root) {
        Process(root);
        return MinAns;
    }
    public void Process(TreeNode cur){
        if(cur == null) return;
        Process(cur.left);
        if(pre != null)
        	MinAns = Math.Min((cur.val - pre.val),MinAns);
        pre = cur;
        Process(cur.right);
    }
}
```

方法三：将递归的过程改变为迭代的过程，使用栈来模拟递归。也是采用变量来记录前一个节点，每次遍历是时，计算差值，并且记录。

```C#
public class Solution {
    public int GetMinimumDifference(TreeNode root) {
 		if(root == null)return 0;
        Stack<TreeNode> st = new Stack<TreeNode>();
        TreeNode pre = null;
        TreeNode cur = root;
        int minAns = int.MaxValue;
        while(cur != null || st.Count > 0){
			if(cur != null){
				st.Push(cur);
                cur = cur.left;
            }
            else{
				cur = st.Pop();
                if(cur != null){
                    minAns = Math.Min(minAns,cur.val - pre.val);
                }
                pre = cur;
                cur = cur.right;
            }
        }
        return minAns;    
    }
}
```

## [二叉搜索树中的众数](https://leetcode.cn/problems/find-mode-in-binary-search-tree/)

![image-20251215004711849](/notes-assets/Algorithm/assets/image-20251215004711849.png)

方法一：常规方法使用字典进行存储每个对应的值出现的次数，最后将结果进行排序，然后输出最多次数的值。

```C#
public class Solution {
    public List<int> res;
    public Dictionary<int, int> Dic;
    
    public int[] FindMode(TreeNode root) {
        res = new List<int>();
        Dic = new Dictionary<int, int>();
        if (root == null) return res.ToArray();
        
        Process(root); // 中序遍历统计频率
        
        // 对字典按值（频率）进行降序排序[6,7,8](@ref)
        var sortedDict = Dic.OrderByDescending(x => x.Value);
        
        // 获取最高频率
        int maxFrequency = sortedDict.First().Value;
        
        // 找出所有频率等于最高频率的键[1,2,3](@ref)
        foreach (var pair in sortedDict) {
            if (pair.Value == maxFrequency) {
                res.Add(pair.Key);
            } else {
                break; // 由于是降序排列，后面的频率肯定更小，可以提前结束
            }
        }
        
        return res.ToArray();
    }
    
    public void Process(TreeNode cur) {
        if (cur == null) return;
        
        Process(cur.left); // 遍历左子树
        
        // 统计当前节点值的频率[1](@ref)
        if (Dic.ContainsKey(cur.val)) {
            Dic[cur.val]++;
        } else {
            Dic[cur.val] = 1;
        }
        
        Process(cur.right); // 遍历右子树
    }
}
```

方法二：不使用字典进行处理，每次遍历记录每个值的频率，同时设置一个maxCount记录当前的最大出现次数，如果当前值的出现次数大于maxCount，说明之前的众数是假的，清空数组。等于则存入数组中

**中序遍历**：对BST进行中序遍历。

- **遍历左子树**：递归地处理当前节点的左子树。
- **处理当前节点**：这是算法的核心步骤。 **频率统计**：比较当前节点值 `cur.val`与前驱节点 `pre`的值。 如果 `pre`为 `null`（当前是第一个节点），或 `cur.val != pre.val`，说明遇到了一个新值，将 `currentCount`重置为 1。 如果 `cur.val == pre.val`，说明当前值连续出现，将 `currentCount`加 1。 **更新众数列表**：将 `currentCount`与 `maxCount`进行比较。 如果 `currentCount > maxCount`：这表示**当前值的出现频率已经超过了之前记录的所有值**。此时，需要清空 `result`列表，将当前节点的值 `cur.val`加入列表，并更新 `maxCount`为 `currentCount`。这正是您提到的“之前的众数是假的，需要清空数组”的情况。 如果 `currentCount == maxCount`：这表示**当前值的出现频率与当前最大频率相同**。此时，直接将当前节点的值 `cur.val`加入 `result`列表即可。 如果 `currentCount < maxCount`：无需任何操作。 **更新前驱节点**：将 `pre`指向当前节点 `cur`，为处理下一个节点做准备。
- **遍历右子树**：递归地处理当前节点的右子树。

```C#
public class Solution {
    public List<int> res;     // 结果列表，用于存储众数
    public int count = 0;     // 当前节点值出现的次数
    public int maxCount = 0;  // 迄今为止出现的最大频率
    public TreeNode pre = null; // 记录中序遍历序列中的前一个节点，用于比较

    public int[] FindMode(TreeNode root) {
        res = new List<int>();
        Process(root);         // 启动中序遍历
        return res.ToArray();  // 将结果列表转换为数组返回
    }

    public void Process(TreeNode cur) {
        if (cur == null) return; // 递归基：当前节点为空时返回
        
        // 1. 递归遍历左子树
        Process(cur.left);
        
        // 2. 处理当前节点（中序遍历的核心逻辑）
        // 判断当前节点值出现的次数
        if (pre == null) {
            // pre为null，说明当前是第一个节点
            count = 1;
        } else if (pre.val == cur.val) {
            // 当前节点值与前一个节点值相同，计数增加
            count++;
        } else {
            // 当前节点值与前一个节点值不同，重置计数
            count = 1;
        }
        
        // 更新pre指针指向当前节点，为下一次比较做准备
        pre = cur;
        
        // 3. 根据当前计数更新结果列表
        if (count > maxCount) {
            // 发现更高频率，清空之前的结果，更新最大频率
            res.Clear();
            res.Add(cur.val);
            maxCount = count;
        } else if (count == maxCount) {
            // 当前频率等于最大频率，加入结果列表
            res.Add(cur.val);
        }
        // 注意：当 count < maxCount 时，不进行任何操作
        
        // 4. 递归遍历右子树
        Process(cur.right);
    }
}
```

## [二叉树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/)

![image-20251215210756117](/notes-assets/Algorithm/assets/image-20251215210756117.png)

方法一：树形DP求解

**信息类 (`Info`) 的作用**

`Info`类是一个关键的数据结构，它封装了递归过程中需要传递的三个关键信息：

- `findA`: 记录以当前节点为根的子树中是否**存在节点 A**（即 `p`）。
- `findB`: 记录以当前节点为根的子树中是否**存在节点 B**（即 `q`）。
- `ans`: 记录在当前子树中找到的 **最近公共祖先节点**。如果还没找到，则为 `null`。

通过这个类，递归函数可以将子树的查找结果“打包”返回给父节点，使得父节点能够基于子节点的信息做出全局判断。

**递归函数 (`process`) 的逻辑**

递归函数 `process`对每个节点进行后序遍历，其逻辑清晰且严谨：

1. **基准情况（终止条件）**： 如果当前节点 `head`为 `null`，说明到达了空子树。此时返回一个 `Info`对象，其中 `findA`和 `findB`均为 `false`，`ans`为 `null`。这表示空树中不包含任何目标节点，也没有LCA。
2. **递归左右子树**： 分别对左子树和右子树调用 `process`函数，获取左右子树的查找结果 `leftInfo`和 `rightInfo`。
3. **整合当前节点的状态**： **判断当前子树是否包含 A 或 B**： `findA = (head == a) || left.findA || right.findA;` `findB = (head == b) || left.findB || right.findB;` 这意味着，只要当前节点本身是 A/B，或者其左子树包含 A/B，或者其右子树包含 A/B，那么当前子树就包含 A/B。 **确定最近公共祖先 (`ans`)**：这是最核心的逻辑，遵循一个**重要原则：整个树中第一个满足特定条件的节点就是LCA**。 **情况一：LCA在左子树中**。如果 `leftInfo.ans`不为 `null`，说明在左子树中已经找到了A和B的LCA。根据定义，这已经是整个子树中“最深”的公共祖先，因此直接继承它 (`ans = leftInfo.ans`)。 **情况二：LCA在右子树中**。同理，如果 `rightInfo.ans`不为 `null`，则 `ans = rightInfo.ans`。 **情况三：LCA就是当前节点**。如果以上两种情况都不满足（说明LCA不在左子树也不在右子树），但当前子树又同时包含了A和B (`findA && findB`为真）。这只能说明**A和B分别位于当前节点的左右两侧**（或者当前节点自身就是A或B）。那么，当前节点 `head`就是A和B的LCA (`ans = head`)。

```C#
public class Info{
    public bool findA;
    public bool findB;
    public TreeNode ans;
    public Info(bool fA,bool fB,TreeNode an){
        findA = fA;
        findB = fB;
        ans = an;
    }
}
public class Solution {
    public TreeNode LowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if(root == null)return null;
        return Process().
    }
   public Info process(TreeNode head,TreeNode a,TreeNode b){
        if(head == null)
            return new Info(false,false,null);
        Info left = process(head.left);
        Info right = process(head.rigth);

        bool findA = (head == a) || left.findA || rigth.findA;
        bool findA = (head == b) || left.findB || rigth.findB;
        TreeNode ans = null;

        if(left.ans != null)   //答案在左子树中
            ans = left.ans;
        else if(right.ans != null) //答案在右子树中
            ans = rigth.ans;
        else {
            if(findA && findB)//答案不在左右子树，并且a，b包含在head的子数中，那么head就是（a在左子树，b在右子树）；
                ans = head;
        }
        return new Info(findA,findB,ans);
    }
}

```

方法二：递归回溯

```C#
public class Solution {
    public TreeNode LowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if(root == null || p == null || q == null)return root;
        TreeNode L = LowestCommonAncestor(root.left,p,q);
        TreeNode R = LowestCommonAncestor(root.right,p,q);
        if(L != null && R != null)return root;
        if(L == null) return R;
        return L;
    }
}
```

## [二叉搜索树的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-search-tree/)

![image-20251215213910642](/notes-assets/Algorithm/assets/image-20251215213910642.png)

二叉搜索树的关键特性是：对于任意节点，其**左子树**上所有节点的值都**小于**该节点的值，其**右子树**上所有节点的值都**大于**该节点的值。

基于此，算法逻辑可以清晰地分为三种情况，代码中的判断流程对应了这些情况：

1. **`p`和 `q`都小于当前根节点值 (`p.val < Val && q.val < Val`)** **逻辑推断**：这说明目标节点 `p`和 `q`都位于当前根节点的**左子树**中。它们的最近公共祖先也必然在左子树里。 **操作**：递归地在**左子树** (`root.left`) 中继续寻找 `p`和 `q`的LCA。
2. **`p`和 `q`都大于当前根节点值 (`p.val > Val && q.val > Val`)** **逻辑推断**：这说明目标节点 `p`和 `q`都位于当前根节点的**右子树**中。 **操作**：递归地在**右子树** (`root.right`) 中继续寻找。
3. **其他情况（当前根节点是“分岔点”）** **逻辑推断**：如果上述两个条件都不满足，则说明 `p`和 `q`要么分别位于当前根节点的**两侧**子树中，要么当前根节点本身就是 `p`或 `q`。无论哪种情况，当前根节点 (`root`) 都是它们的**最近公共祖先**。 **操作**：直接返回当前根节点 `root`。

```C#
public class Solution {
    public TreeNode LowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
 		if(root == null || p == null || q == null)return root;
        int Val = root.val;
        if(p.val < Val && q.val < Val)
            return LowestCommonAncestor(root.left,p,q);
        if(p.val > Val && q.val > Val)
            return LowestCommontAncestor(root.right,p,q);
        return root;
    
    }
}
```

## [二叉搜索树中的插入操作](https://leetcode.cn/problems/insert-into-a-binary-search-tree/)

![image-20251217202215818](/notes-assets/Algorithm/assets/image-20251217202215818.png)

```C#
    //递归法
    public TreeNode InsertIntoBST1(TreeNode root, int val) {
        if(root == null){
            return new TreeNode(val);
        }
        if(root.val < val){
            root.right = InsertIntoBST(root.right,val);
        }
        else if(root.val > val){
            root.left = InsertIntoBST(root.left,val);
        }
        return root;
    }
```

```C#
    public TreeNode InsertIntoBST(TreeNode root,int val){
        if(root == null)
            return new TreeNode(val);
        TreeNode cur = root;
        TreeNode pre = null;
        while(cur != null){
            pre = cur;
            if(val > cur.val)
                cur = cur.right;
            else
                cur = cur.left;
        }
        if (val < pre.val) 
            pre.left = new TreeNode(val);
        else 
            pre.right = new TreeNode(val);
        
        return root;
    }
```

## [删除二叉搜索树中的节点](https://leetcode.cn/problems/delete-node-in-a-bst/)

![image-20251217220757681](/notes-assets/Algorithm/assets/image-20251217220757681.png)

```C#
public class Solution {
    public TreeNode DeleteNode(TreeNode root, int key) {
 		if(root == null)return null;
        
        if(root.val < key)
            root.right = DeleteNode(root.right,key);
        else if(root.val > key)
    		root.left = DeleteNode(root.left,key);
        else
        {
			if(root.left == null)return root.right;
            if(root.right == null)return root.left;
            
            TreeNode minNode = FindMinNode(root.right);//找到右子树中的最小节点（后继节点）来替代被删除的节点
            root.val = minNode.val
            root.right = DeleteNode(root.right,minNode,val);
            
        }
    }
    public TreeNode FindMinNode(TreeNode node){//一直往左走 因为二叉搜索树的左值较小
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }
}
```

## [修剪二叉搜索树](https://leetcode.cn/problems/trim-a-binary-search-tree/)

![image-20251217223226277](/notes-assets/Algorithm/assets/image-20251217223226277.png)

方法一：迭代法：

**移动根节点**：确保根节点本身在有效范围内。如果不在，则根据其值是小还是大，不断地向右或向左移动，直到找到一个有效的根节点或确定为null。

**修剪左子树**：从左子树的根节点开始，自上而下地检查。如果某个节点的左孩子的值小于`low`，则将这个左孩子替换为它的右孩子（因为右孩子可能更大，符合要求）。重复这个过程，直到所有左子节点都符合要求。

**修剪右子树**：原理同修剪左子树，方向相反。如果某个节点的右孩子的值大于`high`，则将这个右孩子替换为它的左孩子（因为左孩子可能更小，符合要求）。

```C#
public class Solution {
    public TreeNode TrimBST(TreeNode root, int low, int high) {
		if(root == null)return null;
        //首先判断根节点
        while(root != null && (root.left.val < L || root.right.val > R)){
			if(root.val < L)root = root.right;
            else root = root.left;
        }
        TreeNode cur = root;
        while(cur != null){
            while(cur.left != null &&cur.left.val < low)
                cur.left = cur.left.right;
            cur = cur.left;
        }
         cur = root;
        while(cur != null){
            while(cur.right != null && cur.right.val > high)
                cur.right = cur.right.left;
            cur = cur.right;
        }
        return root;    
    }
}
```

方法二：递归法

**当前节点值小于 `low`** **逻辑推断**：根据BST的性质，当前节点以及其**整个左子树**的所有节点值都小于 `low`，因此它们全部不在要求范围内，需要被舍弃。 **操作**：不再考虑当前节点和左子树，直接递归地对**右子树**进行修剪，并将修剪后右子树的根节点返回给上一层。因为右子树中可能存在大于等于 `low`的节点。

**当前节点值大于 `high`** **逻辑推断**：同理，当前节点以及其**整个右子树**的所有节点值都大于 `high`，均不在范围内，需要被舍弃。 **操作**：不再考虑当前节点和右子树，直接递归地对**左子树**进行修剪，并将修剪后左子树的根节点返回给上一层。因为左子树中可能存在小于等于 `high`的节点。

**当前节点值在 `[low, high]`范围内** **逻辑推断**：当前节点符合要求，需要被保留。 **操作**：此时，需要分别递归地修剪当前节点的**左子树**和**右子树**。修剪完成后，将得到的新的左子树和右子树重新连接回当前节点，然后返回当前节点。

```C#
public class Solution {  
	public TreeNode TrimBST(TreeNode root, int low, int high) {
        if(root == null)return null;
        if(root.val < low)
            return TrimBST(root.right,low,high);
        if(root.val > high)
            return TrimBST(root.left,low,high);
        root.left = TrimBST(root.left,low,high);
        root.right = TrimBST(root.right,low,high);
        return root;
    }
}
```

## [将有序数组转换为二叉搜索树](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/)

![image-20251218232108650](/notes-assets/Algorithm/assets/image-20251218232108650.png)

本题要求将有序数组转变为二叉搜索树，二叉搜索树的中序遍历就是严格递增的数组。所以每次构造二叉搜索树，只需要将数组最中间的值作为根节点构建到树种即可。

```C#
public class Solution {
    public TreeNode SortedArrayToBST(int[] nums) {
 		if(nums.Length == 0 || nums == null)return null;
        return BuildTree(nums,0,nums.Length - 1);
    }
    public TreeNode BuildTree(int[] nums,int L,int R){
        if(L > R)
            return null;
        int mid = (L + (R - L) >> 1);
        TreeNode newNode = new TreeNode(nums[mid]);
        newNode.left = BuildTree(nums,L,mid - 1);
        newNode.right = BuildTree(nums,mid + 1,R);
        return newNode;
    }
}
```

## [把二叉搜索树转换为累加树](https://leetcode.cn/problems/convert-bst-to-greater-tree/)

![image-20251218232756922](/notes-assets/Algorithm/assets/image-20251218232756922.png)



## 二叉树相关题目

### [求根节点到叶节点数字之和](https://leetcode.cn/problems/sum-root-to-leaf-numbers/)

![image-20251219215824247](/notes-assets/Algorithm/assets/image-20251219215824247.png)

```C#
public class Solution {
    public int SumNumbers(TreeNode root) {
        if(root == null)return 0;
        return DFS(root,0);
    }
    public int DFS(TreeNode root,int Sum){
        if(root == null) return 0;
        Sum = Sum * 10 + root.val;
        if(root.left == null && root.right == null)
            return Sum;
        return DFS(root.left,Sum) + DFS(root.right,Sum);
    }
    public int SumNumbers1(TreeNode root) {
        var result = new List<string>();
        if(root == null)return 0;
        List<int> path = new List<int>();
        process(root,result,path);
        int sum = 0;
        for(int i = 0;i < result.Count;i++){
            sum += int.Parse(result[i]);
        }
        return sum;
    }
    public void process(TreeNode cur,List<string> res,List<int> path)
    {
        //直接将当前节点装入
        path.Add(cur.val);
        if(cur.left == null && cur.right == null) //代表当前节点是叶子节点,说明找到了一条路径，path已经装完了一条完整的路径
        {
            StringBuilder sb = new StringBuilder();  //C#string是不能修改的
            for(int i = 0;i < path.Count;i++){  //因为最后一个节点是 不需要 -> ，遍历到Count - 1，好处理 ->
                sb.Append(path[i]);
            }
            res.Add(sb.ToString());
        }     
        //找到一个后开始递归，寻找下一个路径并且在找到后进行回溯
        if(cur.left != null)
        {
            process(cur.left,res,path);
            path.RemoveAt(path.Count - 1);
        }
        if(cur.right != null){
            process(cur.right,res,path);
            path.RemoveAt(path.Count - 1);
        }
    }
}
```

### [叶子相似的树](https://leetcode.cn/problems/leaf-similar-trees/)

![image-20251219221022307](/notes-assets/Algorithm/assets/image-20251219221022307.png)

```C#
public class Solution {
    List<int> R1;
    List<int> R2;
    public bool LeafSimilar(TreeNode root1, TreeNode root2) {
        R1 = new List<int>();
        R2 = new List<int>();
        Process1(root1);
        Process2(root2);
        if(R1.Count != R2.Count)
            return false;
        for(int i = 0;i < R1.Count;i++){
            if(R1[i] != R2[i])
                return false;
        }
        return true;
    }
    public void Process1(TreeNode root1){
        if(root1 == null)
            return;
        Process1(root1.left);
        if(root1.left == null && root1.right == null)
            R1.Add(root1.val);
        Process1(root1.right);
    }
    public void Process2(TreeNode root2){
        if(root2 == null)
            return;
        Process2(root2.left);
        if(root2.left == null && root2.right == null)
            R2.Add(root2.val);
        Process2(root2.right);
    }
}
```

### [开幕式焰火](https://leetcode.cn/problems/sZ59z6/)

![image-20251219222020003](/notes-assets/Algorithm/assets/image-20251219222020003.png)

```C#
public class Solution {
    HashSet<int> ans;
    int total = 0;
    public int NumColor(TreeNode root) {
        ans = new HashSet<int>();
        Process(root);
        return ans.Count;
    }
    public void Process(TreeNode root){
        if(root == null)return;
        Process(root.left);
        if(!ans.Contains(root.val))
            ans.Add(root.val);
        Process(root.right);
            
    }
}
```

### [二叉树中第二小的节点](https://leetcode.cn/problems/second-minimum-node-in-a-binary-tree/)

![image-20251219223427376](/notes-assets/Algorithm/assets/image-20251219223427376.png)

```C#
public int FindSecondMinimumValue(TreeNode root) {
    if(root == null) return -1; // 这里按题目约定，空树应返回-1更合适
    return process(root, root.val);
}

public int process(TreeNode root, int val) {
    if(root == null) return -1;
    if(root.val > val) return root.val; // 找到候选值
    int left = process(root.left, val);
    int right = process(root.right, val);
    // 合并左右子树的结果
    if(left < 0) return right;
    if(right < 0) return left;
    return Math.Min(left, right);
}
```

### [统计二叉树中好节点的数目](https://leetcode.cn/problems/count-good-nodes-in-binary-tree/)

![image-20251219225315143](/notes-assets/Algorithm/assets/image-20251219225315143.png)

```C#
public class Solution {
    public int GoodNodes(TreeNode root) {
        return process(root,root.val);
    }
    public int process(TreeNode root,int curMax){
        if(root ==null)return 0;
        int count = 0;
        if(root.val >= curMax)
        {
            count = 1;
            curMax = root.val;
        }
        count += process(root.left,curMax);
        count += process(root.right,curMax);
        return count;
    }
}
```

### [祖父节点值为偶数的节点和](https://leetcode.cn/problems/sum-of-nodes-with-even-valued-grandparent/)

![image-20251219234014636](/notes-assets/Algorithm/assets/image-20251219234014636.png)

```C#
public class Solution {
    public int SumEvenGrandparent(TreeNode root) {
        int sum = 0;
        if(root == null)return sum;
        if(root.left != null && (root.val % 2 == 0)){
            if(root.left.left != null)
                sum += root.left.left.val;
            if(root.left.right != null)
                sum += root.left.right.val;
        }
        if(root.right != null && (root.val % 2 == 0)){
            if(root.right.left != null)
                sum += root.right.left.val;
            if(root.right.right != null)
                sum += root.right.right.val;
        }

        sum += SumEvenGrandparent(root.left);
        sum += SumEvenGrandparent(root.right);
        return sum;
    }
}
```

### [节点与其祖先之间的最大差值](https://leetcode.cn/problems/maximum-difference-between-node-and-ancestor/)

![image-20251220200451461](/notes-assets/Algorithm/assets/image-20251220200451461.png)

```C#
public class Solution {
    public int MaxAncestorDiff(TreeNode root) {
        int left = Dfs(root.left,root.val,root.val);
        int right = Dfs(root.right,root.val,root.val);
        return Math.Max(left,right);
    }
    public int Dfs(TreeNode root,int max,int min){
        if(root == null)return 0;
        if(root.val > max)
            max = root.val;
        if(root.val < min)
            min = root.val;
        if(root.left == null && root.right == null)
            return max - min;
        return Math.Max(Dfs(root.left,max,min),Dfs(root.right,max,min));
        
    }
}
```

### [从根到叶的二进制数之和](https://leetcode.cn/problems/sum-of-root-to-leaf-binary-numbers/)

![image-20251220201142512](/notes-assets/Algorithm/assets/image-20251220201142512.png)

```C#
public class Solution {
    int total = 0;
    public int SumRootToLeaf(TreeNode root) {
        if(root == null)return 0;
        return process(root,0);
    }
    public int process(TreeNode root,int sum){
        if(root ==  null)return 0;
        sum = sum * 2 + root.val;
        if(root.left == null && root.right == null)
            return sum;
        return process(root.left,sum) + process(root.right,sum);
    }
    
    public int SumRootToLeaf1(TreeNode root) {
        if(root == null)return 0;
        List<int> path = new List<int>();
        process(root,path);
        return total;
    }
    public void process(TreeNode root,List<int> path){
		path.Add(root.val);
        if(root.left == null && root.right == null){
            int sum = 0;
            for(int i = 0;i < path.Count;i++){
				sum  = sum * 2 + path[i];    
            }
            total +=sum;
        }
        if(root.left != null){
            process(root.left,path);
            path.RemoveAt(path.Count - 1);
        }
        if(root.rigth != null){
            process(root.right,path);
            path.RemoveAt(path.Count - 1);
        }
    }
}
```

### [ 在二叉树中增加一行](https://leetcode.cn/problems/add-one-row-to-tree/)

![image-20251220210334724](/notes-assets/Algorithm/assets/image-20251220210334724.png)

```C#
public class Solution {
    public TreeNode AddOneRow(TreeNode root, int val, int depth) {
        if(depth == 1)
        {
            TreeNode newNode = new TreeNode(val);
            newNode.left = root;
            return newNode;
        }
        Dfs(root,val,depth);
        return root;
    }
    public void Dfs(TreeNode root,int val,int depth){
        if(root == null)return;
        if(depth == 2){ //当 depth = 2时，当前节点处于深度1（即第d-1层）
            TreeNode L = root.left;
            TreeNode R = root.right;
            root.left = new TreeNode(val,L,null);
            root.right = new TreeNode(val,null,R);
            return;
        }
        Dfs(root.left,val,depth - 1);
        Dfs(root.right,val,depth - 1);
    }
}
```

# 回溯算法

对于回溯算法，大体分为3种类型，分别是组合型回溯，子集型回溯，排列型回溯。对于解题采用类似但并不相同的模板。

| 特征                       | 组合型回溯                                  | 子集型回溯                                   | 排列型回溯                                    |
| -------------------------- | ------------------------------------------- | -------------------------------------------- | --------------------------------------------- |
| **问题目标**               | 从n个元素中选取k个                          | 找出集合的所有子集                           | 对集合所有元素进行有序排列                    |
| **元素顺序**               | **无关**（[1,2]与[2,1]相同）                | **无关**                                     | **有关**（[1,2]与[2,1]不同）                  |
| **搜索起点 (start_index)** | **关键**，从`i+1`开始，避免重复选择相同元素 | **关键**，从`i+1`开始，避免重复选择相同元素  | 通常从**0**开始，需使用`used`数组标记已选元素 |
| **终止条件**               | `path.size() == k`                          | 通常**无需严格终止条件**，每次递归都记录结果 | `path.size() == nums.length`                  |
| **典型例题**               | LeetCode 77. 组合                           | LeetCode 78. 子集                            | LeetCode 46. 全排列                           |

**核心参数：`start_index`与 `used`数组**

- **组合/子集型** 使用 `start_index`是**本质要求**。它确保了元素选择的顺序性，从根源上避免了像 `[1,2]`和 `[2,1]`这样的重复组合。因为一旦选择了某个索引的元素，后续选择只会从它之后开始，不会回头。
- **排列型** 必须使用 `used`数组（或类似机制）。因为每次选择都可以从数组开头开始，但必须避免在一条路径中重复使用同一个元素。`used`数组的作用就是**标记当前路径下哪些元素已被使用**。

**去重逻辑的层次**

当题目中**包含重复元素**时，去重是关键一步，主要分为两种：

- **树层去重**：在同一层递归的循环中，如果连续遇到相同的元素，应该跳过，避免产生重复的结果。这通常需要先对数组进行**排序**。
- **树枝去重**：在递归路径上，允许选择相同的元素，例如组合总和问题中元素可无限次使用。排列问题中，通过 `used`数组避免的是树枝上的重复使用。

**子集问题的特殊性**

子集问题可以看作是 **k 从 0 到 n 的所有组合问题的集合**。因此，它的代码结构非常类似于组合问题，主要区别在于**没有元素数量k的终止限制**，每一次递归调用都需要记录当前路径的状态。

## 组合型回溯：

## 组合问题

![image-20251219203354577](/notes-assets/Algorithm/assets/image-20251219203354577.png)

对于本题，难度颇高。本题使用回溯法求解：

1. **初始化与启动** 定义两个成员变量：`ans`用于存储所有符合条件的组合结果，`path`作为临时路径记录当前选择的数字序列。 主方法 `Combine`初始化 `ans`和 `path`，并调用递归方法 `Process`从数字 `1`开始探索。
2. **递归与回溯**（Process 方法）
   - **终止条件**：当 `path`的长度等于 `k`时，说明当前路径已经是一个有效组合。这里通过 `new List<int>(path)`创建副本存入 `ans`，避免后续回溯修改已保存的结果。 
   - **剪枝优化**：在循环选择数字时，通过条件 `i <= n - (k - path.Count) + 1`限制遍历范围。这是因为剩余的数字数量（`n - i + 1`）必须至少等于还需要选择的数字数量（`k - path.Count`），否则无法形成有效组合。这显著减少了不必要的递归调用。 
   - **选择与回溯**： **选择**：将当前数字 `i`加入 `path`。 **递归**：调用 `Process(n, k, i + 1)`，确保下一个数字从 `i+1`开始选择，避免重复。 
   - **撤销选择**：递归返回后，通过 `path.RemoveAt(path.Count - 1)`移除最后添加的数字，以便尝试当前层次的下一个可能选项。

- **去重机制**：通过每次递归传入 `i + 1`作为起始位置，确保每个数字在一条路径中只被使用一次，并且组合内数字顺序递增，自然避免了如 `[1,2]`和 `[2,1]`被视作不同组合的情况。
- **剪枝的价值**：剪枝操作是提升算法效率的关键。例如，当 `n=5`, `k=3`且 `path`已选择 `[1]`时，还需要选2个数。此时循环只需执行到 `i=3`（因为从4开始，剩余数字 `[4,5]`不足2个），直接跳过无效分支。
- **时间复杂度**：优化后的时间复杂度约为 **O(C(n,k) × k)**，其中 C(n,k) 是组合数。剪枝避免了大量无效搜索。

```C#
public class Solution {
    List<IList<int>> ans;
    List<int> path;
    public IList<IList<int>> Combine(int n, int k) {
 		ans = new List<IList<int>>();
        path = new List<int>();
        process(n,k,1);
        return ans;
    }
    public void Process(int n,int k,int curNum){
        if(path.Count == k){  //如果当前的结果长度满足要求，存入最终答案
            ans.Add(new List<int>(path));
            return;
        }
        //剪枝，如果剩余数字不够凑齐k个元素，提前结束 
        for(int i = curNum;i <= n - (k - path.Count) + 1;i++){
            path.Add(i);
            Process(n,k,i + 1);
            path.RemoveAt(path.Count - 1);
        }
   }
}
```

## [组合总和 III](https://leetcode.cn/problems/combination-sum-iii/)

![image-20251220215637742](/notes-assets/Algorithm/assets/image-20251220215637742.png)

对于本题，较上题组合类似，只不过本题将的限制条件给了，只能使用数字 1 - 9。解题思路与组合一样；

本题要求在数字1-9的范围内找出所有大小为`k`且总和为`n`的组合，其核心解法与组合问题类似，但增加了总和与元素个数的双重限制。

1. **初始化和启动**：定义成员变量`ans`用于存储所有有效组合，`path`作为临时路径记录当前选择。主方法`CombinationSum3`初始化后调用递归方法`Process`，从数字1开始探索。

2. **递归与回溯（Process方法）**： 

   **终止条件**：当`path`的长度等于`k`时，判断其元素总和是否等于`n`。若相等，则将当前路径的副本存入`ans`。这里使用`new List<int>(path)`是为了避免后续回溯操作修改已保存的结果。 

   **剪枝优化**：在循环选择数字时，通过条件`i <= 9 - (k - path.Count) + 1`限制遍历范围。这是因为剩余的数字数量（`9 - i + 1`）必须至少等于还需选择的数字数量（`k - path.Count`），否则无法形成有效组合。这显著减少了不必要的递归调用。 

   **选择与回溯**： **选择**：将当前数字`i`加入`path`。 **递归**：调用`Process(k, n, i + 1)`，确保下一个数字从`i+1`开始选择，避免重复使用同一数字。 **撤销选择**：递归返回后，从`path`末尾移除数字，以便尝试当前层次的下一个选项。

3. **去重机制**：通过每次递归传入`startIndex`为`i + 1`，确保每个数字在一条路径中只使用一次，且组合内数字顺序递增，自然避免了重复组合（如`[1,2]`和`[2,1]`）

```C#
public class Solution {
    List<int> path;
    List<IList<int>> ans;
    public IList<IList<int>> CombinationSum3(int k, int n) {
        path = new List<int>();
        ans = new List<IList<int>>();
        process(k,n,1);
        return ans;
    }
    public void process(int k,int n,int startIndex){
        if(path.Count == k)
        {
            int sum = 0;
            for(int i = 0;i < path.Count;i++)
                sum+= path[i];
            if(sum == n)
                ans.Add(new List<int>(path));
            return;
        }
        for(int i = startIndex;i <= 9 - (k - path.Count) + 1;i++){
            path.Add(i);
            process(k,n,i + 1);
            path.RemoveAt(path.Count - 1);
        }
    }  
}
```

## [电话号码的字母组合](https://leetcode.cn/problems/letter-combinations-of-a-phone-number/)

![image-20251221205449626](/notes-assets/Algorithm/assets/image-20251221205449626.png)

本题与之前写的题都不太一样，之前的题都是在给定某个值并且在 1 - n之间。本题不只是有一个区间取值，而是根据对于的字符，在字符区间进行取值。相当于是每个部分进行取值，而不是一个部分取值。对于如何处理取值，则是本题的关键。同时本题需要进行关系映射，因为不同的数字对于不同的字符。

**初始化与启动**：使用字典来进行数字和字符之间的映射，使用`ans`用于存储所有有效组合，主方法`LetterCombinations`初始化后调用递归方法`process`，从第一个字符开始探索。

**独立集合的笛卡尔积**：与之前在单一集合内求组合不同，本题每个数字（如'2'）对应一个独立的字符集合（如"abc"）。我们需要生成的是所有可能的选择序列，即每个集合中选一个字符构成字符串。

**映射关系**：使用字典（`Dictionary`）来建立数字到字母的映射是标准且清晰的做法。

**回溯框架**：您构建的回溯方法（`process`）参数设计合理，清晰地体现了回溯算法的核心步骤： **索引驱动**：使用 `index`来追踪当前处理到输入数字字符串（`digits`）的第几位，这决定了当前要在哪个字符集合中进行选择。 **选择与探索**：对于当前数字对应的字符集合中的每一个字母，将其加入到构建中的路径（`StringBuilder`），然后递归地处理下一个数字（`index + 1`）。 **回溯撤销**：在递归返回后，撤销当前的选择（移除`StringBuilder`的最后一个字符），以便尝试当前字符集合中的下一个字母

```C#
public class Solution {
    public List<string> result;
    public IList<string> LetterCombinations(string digits) {
 		result = new List<string>();
        if (string.IsNullOrEmpty(digits)) {
            return result;
        }
        Dictionary<char,string> phoneMap = new Dictionary<char,string>(){
            {'2', "abc"},
            {'3', "def"},
            {'4', "ghi"},
            {'5', "jkl"},
            {'6', "mno"},
            {'7', "pqrs"},
            {'8', "tuv"},
            {'9', "wxyz"}
        }
        process(digits,0,phoneMap,new StringBuilder());
    	return result;
    }
    public void process(string digits,Dictionary<char,string> phoneMap,int index,StringBuilder current){
        // 如果当前组合长度等于数字字符串长度，说明已经完成一个组合
        if (index == digits.Length) {
            result.Add(current.ToString());
            return;
        }
        // 获取当前数字对应的字母字符串
        char digit = digits[index];
        string letters = phoneMap[digit];

        // 遍历当前数字对应的所有字母
        for (int i = 0; i < letters.Length; i++) {
            // 添加当前字母到组合中
            current.Append(letters[i]);
            // 递归处理下一个数字
            process(digits, phoneMap, index + 1, current);
            // 回溯：移除最后添加的字母，尝试下一个可能
            current.Remove(current.Length - 1, 1);
        }
    }
}
```

## [组合总和](https://leetcode.cn/problems/combination-sum/)

![image-20251221211450783](/notes-assets/Algorithm/assets/image-20251221211450783.png)



对于本题，都是类似于组合III的题型，只不过条件不太一样，它允许一个数字无限制重复选取，那么代表我们可以使用一个数字就组成结果集。难点在于如何使用完这个数字后，跳过到第二个数字,因此我们需要添加新的限制条件。

1. **初始化和启动**：定义成员变量`ans`用于存储所有有效组合，`path`作为临时路径记录当前选择。主方法`CombinationSum3`初始化后调用递归方法`Process`，从第一个数组元素开始探索。

2. **递归与回溯（Process方法）**： **终止条件**： 当 `target`减至 `0`时，说明当前路径 `path`中数字的和恰好等于目标值，此时将路径的副本（`new List<int>(path)`）存入 `ans`。使用副本是为了避免后续回溯操作修改已保存的结果。 当 `target`减至小于 `0`时，说明当前路径数字和已超过目标值，直接返回，终止这条路径的探索。 **剪枝优化**：在循环选择数字时，通过条件 `if (candidates[i] > target) break;`进行剪枝。因为数组已经排序，如果当前数字 `candidates[i]`已经大于剩余的目标值 `target`，那么它后面更大的数字也必然不符合条件，可以直接跳出循环，显著减少不必要的递归调用。 **选择与回溯**： **选择**：将当前数字 `candidates[i]`加入 `path`。 **递归**：调用 `process(candidates, target - candidates[i], i)`。这里的关键是**第三个参数传入 `i`**，而不是 `i+1`。这表示下一层递归仍然可以从当前数字开始选择，从而实现了**允许数字被无限次选取**。 **撤销选择（回溯）**：递归返回后，从 `path`末尾移除刚才添加的数字，以便回溯到上一层状态，尝试当前层次的下一个选项。

   **去重机制**：通过两个关键点确保结果集不包含重复组合（如 `[2, 2, 3]`和 `[2, 3, 2]`被视为同一个组合）： **对数组排序**。 在递归时，通过 `startIndex`（在您的代码中是 `index`参数）控制每一层循环的起始位置。虽然允许重复选取，但每次递归的起始索引保证了对于某个数字，其“后续”的更大数字不会再被“回头”选取，从而保证了组合内数字的非递减顺序，自然避免了因顺序不同造成的重复。

3. **去重机制**：通过两个关键点确保结果集不包含重复组合（如 `[2, 2, 3]`和 `[2, 3, 2]`被视为同一个组合）：

   - **对数组排序**。
   - 在递归时，通过 `startIndex`（在您的代码中是 `index`参数）控制每一层循环的起始位置。虽然允许重复选取，但每次递归的起始索引保证了对于某个数字，其“后续”的更大数字不会再被“回头”选取，从而保证了组合内数字的非递减顺序，自然避免了因顺序不同造成的重复。

```C#
public class Solution {
    List<IList<int>> ans;
    List<int> path;
    public IList<IList<int>> CombinationSum(int[] candidates, int target) {
        ans = new List<IList<int>>();
        path = new List<int>();
        Array.Sort(candidates);
        process(candidates,target,0);
        return ans;
    }
    public void process(int[] candidates,int target,int index){
        if(target == 0)
            ans.Add(new List<int>(path));
        if(target < 0)
            return;
        for(int i = index;i < candidates.Length;i++){
            if(candidates[i] > target) //当前值已经大于target直接退出
                break;
            path.Add(candidates[i]);
            process(candidates,target - candidates[i],i);
            path.RemoveAt(path.Count - 1);
        }
    }
}
```

## [组合总和 II](https://leetcode.cn/problems/combination-sum-ii/)

![image-20251221211457522](/notes-assets/Algorithm/assets/image-20251221211457522.png)

1. **初始化和启动**：定义成员变量`ans`用于存储所有有效组合，`path`作为临时路径记录当前选择。主方法`CombinationSum3`初始化后调用递归方法`Process`，从数字1开始探索。

2. **递归与回溯（Process方法）**： **终止条件**： 当 `target`减至 `0`时，说明当前路径 `path`中数字的和恰好等于目标值，此时将路径的副本（`new List<int>(path)`）存入 `ans`。使用副本是为了避免后续回溯操作修改已保存的结果。 当 `target`减至小于 `0`时，说明当前路径数字和已超过目标值，直接返回，终止这条路径的探索。 **剪枝优化**：在循环选择数字时，通过条件 `if (candidates[i] > target) break;`进行剪枝。因为数组已经排序，如果当前数字 `candidates[i]`已经大于剩余的目标值 `target`，那么它后面更大的数字也必然不符合条件，可以直接跳出循环，显著减少不必要的递归调用。 **选择与回溯**： **选择**：将当前数字 `candidates[i]`加入 `path`。 **递归**：调用 `process(candidates, target - candidates[i], i)`。这里的关键是**第三个参数传入 `i`**，而不是 `i+1`。这表示下一层递归仍然可以从当前数字开始选择，从而实现了**允许数字被无限次选取**。 **撤销选择（回溯）**：递归返回后，从 `path`末尾移除刚才添加的数字，以便回溯到上一层状态，尝试当前层次的下一个选项。

   **去重机制**：通过两个关键点确保结果集不包含重复组合（如 `[2, 2, 3]`和 `[2, 3, 2]`被视为同一个组合）： **对数组排序**。 在递归时，通过 `startIndex`（在您的代码中是 `index`参数）控制每一层循环的起始位置。虽然允许重复选取，但每次递归的起始索引保证了对于某个数字，其“后续”的更大数字不会再被“回头”选取，从而保证了组合内数字的非递减顺序，自然避免了因顺序不同造成的重复。

3. **去重机制**：通过两个关键点确保结果集不包含重复组合（如 `[2, 2, 3]`和 `[2, 3, 2]`被视为同一个组合）：

   - **对数组排序**。
   - 在递归时，通过 `startIndex`（在您的代码中是 `index`参数）控制每一层循环的起始位置。虽然允许重复选取，但每次递归的起始索引保证了对于某个数字，其“后续”的更大数字不会再被“回头”选取，从而保证了组合内数字的非递减顺序，自然避免了因顺序不同造成的重复。

```C#
public class Solution {
    List<IList<int>> ans;
    List<int> path;
    public IList<IList<int>> CombinationSum2(int[] candidates, int target) {
        ans = new List<IList<int>>();
        path = new List<int>();
        Array.Sort(candidates);
        process(target,0,candidates);
        return ans;
    }
    public void process(int target,int index,int[] candidates){
        if(target == 0){
            ans.Add(new List<int>(path));
            return;
        }
        if(target < 0)
            return;
        for(int i = index;i < candidates.Length;i++){
            if(i > index && candidates[i] == candidates[i - 1])continue;
            if(candidates[i] > target)break;
            path.Add(candidates[i]);
            process(target - candidates[i],i + 1,candidates);
            path.RemoveAt(path.Count - 1);

        }
    }
}
```

## 子集型回溯

## [分割回文串](https://leetcode.cn/problems/palindrome-partitioning/)

![image-20251223201816322](/notes-assets/Algorithm/assets/image-20251223201816322.png)

本题题意简单，但是却不容易写。主要难点在于怎么判断当前子串是回文串，以及如何去收集所有的回文串。本题只能使用回溯法进行求解，但是如何使用回溯法求解呢？首先判断需要哪些变量来求解，在本题中，使用ans作为结果集，path来记录当前的子串。

**递归和回溯**：**递归终止条件**：当 `startIndex`达到字符串长度时，说明已经找到一种将整个字符串分割为回文子串的方案。此时将 `path`的副本添加到结果集 `ans`中。

**递归处理过程**： 从当前位置 `startIndex`开始，尝试所有可能的结束位置 `i` 对于每个子串 `s[startIndex..i]`，判断是否为回文串 如果是回文串，将其加入当前路径 `path`，然后递归处理剩余部分 `s[i+1..]` 递归返回后，执行回溯操作：从 `path`中移除刚刚加入的子串，尝试其他可能性

**回文判断函数**：通过双指针法从两端向中间比较字符，高效判断子串是否为回文串。

```c#
public class Solution {
    List<IList<string>> ans;
    List<string> path;
    public IList<IList<string>> Partition(string s) {
        ans = new List<IList<string>>();
        path = new List<string>();
        if(s == null)return ans;
        process(0,s);
        return ans;
    }
    public void process(int startIndex,string s){
        if(startIndex >= s.Length){
            ans.Add(new List<string>(path));
            return;
        }
        for(int i = startIndex;i < s.Length;i++){
            if(isPalindrome(s,startIndex,i)){//当前子串是回文子串
                string str = s.Substring(startIndex,i - startIndex + 1);
                path.Add(str);
            }
            else
                continue;
            process(i + 1,s);
            path.RemoveAt(path.Count - 1);
        }
    }
    public bool isPalindrome(string s,int start,int end){
        for(int i = start,j = end;i < j;i++,j--){
            if(s[i] != s[j])
                return false;
        }
        return true;
    }
}
```

## [复原 IP 地址](https://leetcode.cn/problems/restore-ip-addresses/)

![image-20251223215549955](/notes-assets/Algorithm/assets/image-20251223215549955.png)

本题很类似与分割回文串这题，都是需要分割子串，但是要求不太一样。本题求有效的IP地址，固定了需要4个整数，3个逗点。因此本题的回溯的中止条件不同于其他，可以通过逗点数来判断当前字符是否有效。本题还有一个难点在于如何判断是否有效，我们则需要另外一个写来判断是否有效。具体思路如下：

**递归终止条件**：当已经添加了3个点号（`pointNum == 3`）时，说明字符串已经被分成了四段。此时需要验证最后一段是否有效，如果有效则将当前分割结果加入答案集。

**递归处理过程**：从当前位置`startIndex`开始，尝试所有可能的结束位置`i`： 使用`IsValid`函数判断子串`s[startIndex..i]`是否构成有效的IP地址段 如果有效，在该位置后插入点号，然后递归处理剩余部分 递归返回后，通过回溯撤销当前选择（移除点号），尝试其他分割可能性

**有效性判断**：`IsValid`函数检查子串是否满足IP地址段的要求： 不能以0开头（除非是单独的"0"） 必须由数字组成且在0-255范围内

```C#
public class Solution {
    List<string> ans;
    public IList<string> RestoreIpAddresses(string s) {
        ans = new List<string>();
        process(s,0,0);
        return ans;
    }
    public void process(string s,int startIndex,int pointNum){
        if(point == 3){
            if(IsVaild(s,startIndex,s.Length - 1)){
				ans.Add(s);
            }
        }
        for(int i = startIndex;i < s.Length ;i++){
            if(IsVaild(s,startIndex,i)){
                s = s.Insert(i + 1,'.');
                process(s,i + 1,pointNum + 1);
                s = s.Remove(i + 1,1);
            }
            else
                break;
        }
    }
    public bool IsVaild(string s,int start,int end){
        if(start > end)
            return false;
        if(s[start] == '0' && start != end)
            return false;
        int num = 0;
        for(int i = start;i <= end;i++){
            if(s[i] > '9' || s[i] < '0')
                return false;
            num = num * 10 + (s[i] - '0');
        	if(num > 25)
                return false;
        }
        return true;
    }
}
```

## [子集](https://leetcode.cn/problems/subsets/)

![image-20251224192956993](/notes-assets/Algorithm/assets/image-20251224192956993.png)

标准的回溯法求解模板。首先判断递归的中止条件，当前索引 >= 数组的长度时，递归结束。但是本题的结果集的条件不同，在经典的回溯算法中，我们通常只在满足一个“完整”解的条件时（例如，路径长度达到k）才收集结果。然而，子集问题要求我们找出所有可能的子集，这意味着**搜索树上的每一个节点（而不仅仅是叶子节点）都代表一个有效的解**。

**初始调用**：`process(nums, 0)`。在进入`for`循环之前，首先执行 `ans.Add(new List<int>(path))`。此时`path`为空，因此子集 `[]`被加入结果列表。

**第一层循环 (i=0)**： **选择**：将 `nums[0]`（假设为1）加入`path`，此时 `path = [1]`。 **递归调用**：`process(nums, 1)`。 **在新递归中**：首先再次收集结果，将 `[1]`加入结果列表。 然后开始新循环（从索引1开始），以此类推。

**回溯操作**：`path.RemoveAt(path.Count - 1)`是关键。当一条路径深入探索完毕后（例如，在得到 `[1,2,3]`并返回后），通过此操作撤销上一次选择，`path`变回 `[1]`，从而允许循环继续，尝试 `i=2`即选择3，得到子集 `[1,3]`。

```C#
public class Solution {
    List<IList<int>> ans;
    List<int> path;
    public IList<IList<int>> Subsets(int[] nums) {
        ans = new List<IList<int>>();
        path = new List<int>();
        process(nums,0);
        return ans;
    }
    public void process(int[] nums,int index){
        ans.Add(new List<int>(path));
        if(index == nums.Length){		
            return;
        }
        for(int i = index;i < nums.Length;i++){
            path.Add(nums[i]);
            process(nums,i + 1);
            path.RemoveAt(path.Count - 1);
        }
    }
}
```

## [子集 II](https://leetcode.cn/problems/subsets-ii/)

![image-20251224200412676](/notes-assets/Algorithm/assets/image-20251224200412676.png)

本题较子集的区别就是在于如何去重，常见的去重`if(i > index && nums[i] == nums[i - 1])continue;`即可去重，但是前提在于数组是一个有序数组，因此，因为数组有序的情况下，数组中出现重复字符只会相邻出现，因此可以直接跳过。另外的去重方法就是进行标记，将使用过的相同的数字进行标记，代表这个数字在本层使用过，可以直接跳过。在标记数组方法中，`used[i-1] == false`正表明前一个相同的元素**已经在本层被使用过并且完成了回溯**，其状态已被重置为`false`。因此，当前元素 `nums[i]`应该被跳过，这正是树层去重的体现.具体如下：

**排序去重**

```C#
public class Solution {
    List<IList<int>> ans;
    List<int> path;
    public IList<IList<int>> SubsetsWithDup(int[] nums) {
        ans = new List<IList<int>>();
        Array.Sort(nums);
        path = new List<int>();
        process(nums,0);
        return ans;
    }
    public void process(int[] nums,int index){
        ans.Add(new List<int>(path));
        if(index == nums.Length)
            return;
        for(int i = index;i < nums.Length;i++){
            if(i > index && nums[i] == nums[i - 1] )continue;
            path.Add(nums[i]);
            process(nums,i + 1);
            path.RemoveAt(path.Count - 1);
        }
    }
}
```

**标记去重**

```C#
public class Solution {
    List<IList<int>> ans;
    List<int> path;
    public IList<IList<int>> SubsetsWithDup(int[] nums) {
        ans = new List<IList<int>>();
        path = new List<int>();
        bool[] used = new bool[nums.Length]; // 初始化used数组
        Array.Sort(nums);
        process(nums, 0, used); // 将used数组传入递归函数
        return ans;
    }
    
    public void process(int[] nums, int index, bool[] used){
        ans.Add(new List<int>(path));
        if(index == nums.Length)
            return;
            
        for(int i = index; i < nums.Length; i++){
            // 使用used数组进行去重判断
            if(i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) {
                continue;
            }
            path.Add(nums[i]);
            used[i] = true;
            process(nums, i + 1, used);
            path.RemoveAt(path.Count - 1);
            used[i] = false; // 回溯used数组状态
        }
    }
}
```

## [非递减子序列](https://leetcode.cn/problems/non-decreasing-subsequences/)

![image-20251225191612442](/notes-assets/Algorithm/assets/image-20251225191612442.png)

```C#
public class Solution {
    public List<IList<int>> ans;
    public List<int> path;
    public IList<IList<int>> FindSubsequences(int[] nums) {
        ans = new List<IList<int>>();
        path = new List<int>();
        process(nums,0);
        return ans;
    }
    public void process(int[] nums,int index){        
        if( path.Count >= 2){
            ans.Add(new List<int>(path));
        }
        HashSet<int> hs = new HashSet<int>();
        for(int i = index;i < nums.Length;i++){
            if(path.Count > 0&& path[path.Count - 1] > nums[i] || hs.Contains(nums[i]))
                continue;
            hs.Add(nums[i]);
            path.Add(nums[i]);
            process(nums,i + 1);
            path.RemoveAt(path.Count - 1);
        }
    }
}
```

## 排列型回溯

## [全排列](https://leetcode.cn/problems/permutations/)

![image-20251225192203571](/notes-assets/Algorithm/assets/image-20251225192203571.png)

对于本题，很显然是一个排列型回溯的经典题。对于排列型回溯，与组合型回溯很类似，在于遍历的时候一般是从0开始，而不是根据索引变化而变化。同时本题要求全排列，不同元素的顺序也是一个新的排列，但是在排列的过程，我们也需要考虑每个元素只使用一次，不能使用多次，因此我们也需要添加一个数组来记录本层元素的使用次数，在本层结束后记录结束。

**初始化与启动**：在开始回溯之前，需要初始化几个关键的数据结构来跟踪状态：

- `ans`：一个全局列表，用于存储所有找到的完整排列。
- `path`：一个列表，用于记录当前递归路径下已经做出的选择（即当前正在构建的排列）。
- `used`：一个布尔数组，其长度与输入数组 `nums`相同。它用于标记 `nums`中每个位置的元素是否已经被包含在当前的 `path`中。这是实现**不同树枝去重**（避免同一个元素在一条路径中使用多次）的关键机制。

**回溯**：回溯函数 `process`是算法的核心，其运作模式遵循“选择-探索-撤销”的循环。

- **终止条件**：当 `path`的长度等于原数组 `nums`的长度时，说明一个完整的排列已经生成。此时，将 `path`的**副本**（`new List<int>(path)`）添加到结果集 `ans`中。这里必须添加副本而非 `path`本身，因为在后续回溯中 `path`的内容会被修改。
- **选择与遍历**：使用一个循环，**每次都从数组的起始位置（索引0）开始遍历**。这与组合问题（使用 `startIndex`）的关键区别，确保了每个元素在任何位置都有可能被选中，从而生成所有可能的顺序。
- **剪枝**：在循环内，首先检查 `used[i]`。如果为 `true`，说明 `nums[i]`已经在当前路径中，跳过此次选择以避免重复使用同一元素。
- **递归与回溯**：
  1. **做出选择**：将 `nums[i]`加入 `path`，并将 `used[i]`标记为 `true`。
  2. **探索下一层**：递归调用 `process`函数，基于当前选择继续构建排列。
  3. **撤销选择**：在递归调用返回后，从 `path`末尾移除刚刚添加的元素，并将 `used[i]`重置为 `false`。这一步是“回溯”的精髓，它撤销了当前选择，让状态恢复到递归前的样子，从而允许在同一层级上尝试下一个不同的选择。

```C#
public class Solution {
    public List<IList<int>> ans;
    public List<int> path;
    public bool[] used; // 用于标记元素是否被使用过

    public IList<IList<int>> Permute(int[] nums) {
        ans = new List<IList<int>>();
        path = new List<int>();
        used = new bool[nums.Length]; // 关键修正：初始化used数组
        
        process(nums);
        return ans;
    }

    public void process(int[] nums) {
        if (path.Count == nums.Length) {
            ans.Add(new List<int>(path)); // 添加当前排列的副本
            return;
        }
        for (int i = 0; i < nums.Length; i++) {
            if (used[i] == true) continue; // 跳过已使用的元素
            
            used[i] = true;   // 标记当前元素为已使用
            path.Add(nums[i]); // 将当前元素加入路径
            
            process(nums);     // 递归处理下一层
            
            // 回溯：撤销当前选择，以尝试其他可能性
            path.RemoveAt(path.Count - 1);
            used[i] = false;
        }
    }
}
```

```C#
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

## [全排列 II](https://leetcode.cn/problems/permutations-ii/)

![image-20251225195156924](/notes-assets/Algorithm/assets/image-20251225195156924.png)

本题较全排列多了一个如何去重的问题，就是出现相同元素在数组，如何进行去重。关键步骤如下：

**排序预处理 (`Array.Sort(nums)`)**

这是去重的基础。排序后，所有相同的元素会**相邻排列**。这使得我们可以在遍历过程中，通过比较相邻元素的值来轻松识别重复项，为后续的去重判断提供了必要条件。

**树层去重 (`if (i > 0 && nums[i] == nums[i-1] && !used[i-1]) continue;`)**

这行代码是去重的核心逻辑，也称为“树层去重”。它的作用是：**在同一层递归（即填充排列的同一个位置）中，如果当前元素与前一个元素相同，且前一个元素还没有被使用过，则跳过当前元素**。

- `nums[i] == nums[i-1]`：判断当前元素是否和上一个元素重复。
- `!used[i-1]`：这是关键中的关键。它表示前一个相同的元素**尚未被使用**。为什么前一个相同的元素没被使用，当前这个就要跳过呢？因为这表明我们正处于**决策树的同一层（横向遍历）**。在当前位置上，如果之前已经选择过一个相同的数字，那么再选一次当前这个相同的数字，就会产生完全相同的分支，导致重复排列。跳过它，就避免了同一层中出现重复的选择。
- 相反，如果 `used[i-1]`为 `true`，说明前一个相同的元素是在当前路径的上一层（即排列的前一个位置）被使用的，这是允许的，属于**树枝上的重复使用**，不会导致最终排列重复。例如，在构建 `[1,1,2]`时，第二个 `1`是在第一个 `1`已经被使用的情况下被选择的，这是合法的。

```C#
public class Solution {
    public HashSet<IList<int>> ans;
    public List<int> path;
    public bool[] used;
    public IList<IList<int>> PermuteUnique(int[] nums) {
        ans = new HashSet<IList<int>>();
        path = new List<int>();
        used = new bool[nums.Length]; // 关键修正：初始化used数组
        Array.Sort(nums);
        process(nums);
        return new List<IList<int>>(ans);
    }
    public void process(int[] nums){
        if(path.Count == nums.Length){
            ans.Add(new List<int>(path));
            return;
        }
        for(int i = 0;i < nums.Length;i++){;
            if (used[i]) continue;
            if (i > 0 && nums[i] == nums[i-1] && !used[i-1])continue;
            used[i] = true;   // 标记当前元素为已使用
            path.Add(nums[i]);
            process(nums);
            path.RemoveAt(path.Count - 1);
            used[i] = false;
        }
    }
}
```

```C#
public class Solution {
    public List<IList<int>> ans;
    public List<int> path;
    public bool[] used;
    public IList<IList<int>> PermuteUnique(int[] nums) {
        ans = new List<IList<int>>();
        path = new List<int>();
        used = new bool[nums.Length]; // 关键修正：初始化used数组
        Array.Sort(nums);
        process(nums);
        return ans;
    }
    public void process(int[] nums){
        if(path.Count == nums.Length){
            ans.Add(new List<int>(path));
            return;
        }
        for(int i = 0;i < nums.Length;i++){;
            if (i > 0 && nums[i] == nums[i-1] && !used[i-1])continue;
            if(used[i] == false){
                used[i] = true;   // 标记当前元素为已使用
                path.Add(nums[i]);
                process(nums);
                path.RemoveAt(path.Count - 1);
                used[i] = false;
            }
        }
    }
}
```

## [N 皇后](https://leetcode.cn/problems/n-queens/)

![image-20251226160906918](/notes-assets/Algorithm/assets/image-20251226160906918.png)

对于N皇后问题，本质也是排列型回溯。本题的关键在于如何进行回溯以及如何判断当前位置的皇后合法。因此我们需要分布来处理，对于当前位置是否合法，我们使用IsVaild函数来判断，因为合法的条件在于同一行，同一列，同一斜线不能出现皇后，因此我们可以很简单的写出3个方向的判断代码，为什么只有3个方向，因为我们是从上到小开始遍历的，还没遍历到的位置默认是没有值的，因此不需要判断。在有了这个判断后，剩下的就是回溯法的基本框架了。

 **核心策略：逐行放置与回溯**

由于皇后不能互相攻击，且棋盘大小为n×n，因此**每行必须且只能放置一个皇后**。这自然引出了算法的核心策略：**从上到下逐行放置皇后**。在每一行中，我们依次尝试每一列的位置，这构成了回溯算法中递归的每一层。

**冲突检测：`IsValid`函数与检查方向**

在当前位置`(row, col)`放置皇后前，必须检查其是否安全。您的判断完全正确：由于皇后是**从上到下逐行放置**的，因此只需要检查**上方**的区域（即行号小于`row`的区域），因为下方（行号大于`row`）的行还是空的，不可能有皇后。`IsValid`函数因此只需检查三个方向：

- **正上方（同一列）**：检查第`col`列在`0`到`row-1`行是否已有皇后。
- **左上方对角线（135°方向）**：检查行索引和列索引同时递减的方向（即满足`行差 == 列差`的格子）是否有皇后。
- **右上方对角线（45°方向）**：检查行索引递减而列索引递增的方向（即满足`行差 == 列差`的格子）是否有皇后。

**回溯过程：选择、递归与撤销**

回溯算法在每一行的操作都遵循一个清晰的模式，这也是您代码中的核心循环：

- **遍历选择**：对于当前行`row`，遍历所有列`col`（从`0`到`n-1`）。
- **剪枝**：对每个位置`(row, col)`，调用`IsValid`函数判断。如果冲突，则跳过该列（**剪枝**），尝试下一列。
- **做出选择**：如果位置安全，则在该位置放置皇后`"Q"`。
- **递归探索**：递归调用回溯函数，处理下一行（`row + 1`），每行只能存在一个。
- **撤销选择（回溯）**：当递归返回时（无论是因为找到了一个解还是此路不通），都需要撤销当前选择，将`chessBoard[row][col]`重置为`"."`。这一步是**回溯算法的精髓**，它使得算法能够退回到上一步状态，从而尝试新的可能性。

**终止条件与结果保存**

当递归处理到第`n`行时（即`row == n`），意味着已经成功在所有`n`行都放置了皇后，找到了一个有效解。此时，需要将当前的棋盘状态保存到结果集`ans`中。通常，需要将二维棋盘数组转换为一个`List<string>`，其中每个字符串代表棋盘的一行。

```C#
public class Solution {
    List<IList<string>> ans;
    public IList<IList<string>> SolveNQueens(int n) {
    	ans = new List<IList<string>>();
        string[][] chessBoard = new string[n][];
        for(int i = 0;i < n;i++){
            chessBoard[i] = new string[n];
            for(int j = 0;j < n;j++){
                chessBoard[i][j] = ".";
            }
        }
        process(row,col,chessBoard,n);
        return ans;
    }
	public void process(int row,int col,string[][] chessBoard,int n){
        if(row == n){
            List<string> Solution = new List<string>();
            for (int i = 0; i < n; i++)
                solution.Add(string.Join("", chessBoard[i]));
            ans.Add(solution);
            return;
        }
        for(int col = 0;col < n;col++){
            if(IsVaild(row,col,chessBoard,n)){
				chessBoard[row][col] = "Q";
                process(row + 1,col,chessBoard,n);
            	chessBoard[row][col] = ".";
            }
        }
    }
    public bool IsVaild(int row,int col,string[][] chessBoard,int n){
        for(int i = 0;i < row;i++){
            if(chessBoard[i][col] == "Q")
                return false;
        }
        for(int i = row - 1,j = col - 1;i >=0 && j>=0;i--,j--)
            if(chessBoard[i][col] == "Q")
                return false;
        for(int i = row - 1,j = col + 1;i >=0 && j<n;i--,j++)
            if(chessBoard[i][col] == "Q")
                return false;
    	return true;
    }
    
}
```

## [解数独](https://leetcode.cn/problems/sudoku-solver/)

![image-20251226191941803](/notes-assets/Algorithm/assets/image-20251226191941803.png)

```C#
public class Solution {
    public void SolveSudoku(char[][] board) {
        BackTrack(board, 0, 0);
    }
    public bool BackTrack(char[][] board,int row,int col){
        if(row == 9)
            return true;
        if(col == 9)
            return BackTrack(board,row + 1,0);

        if(board[row][col] != '.')
            return BackTrack(board,row,col + 1);

        for(char i = '1';i <= '9';i++){
            if(IsVaild(board,row,col,i)){
                board[row][col] = i;  //填完一个位置后，在此基础上继续填完其他的，如果都正确，则正确，否则回溯全部结果
                if(BackTrack(board,row,col + 1))
                    return true;
                board[row][col] = '.';
            }
        }
        return false;
    }
    public bool IsVaild(char[][] board,int row,int col,char val){
        for(int i = 0;i < 9;i++)  //如果当前列遇到了val相等的数字，直接false
            if(board[i][col] == val)
                return false;
        
        for(int i = 0;i < 9;i++) //如果当前行遇到了val相等的数字，直接false
            if(board[row][i] == val)
                return false;

        int subgridRow = row / 3 * 3; //找到当前数字所处的子网格第一个格子的行
        int subgridCol = col / 3 * 3; //找到当前数字所处的子网格第一个格子的列

        for(int i = subgridRow;i < subgridRow + 3;i++)
            for(int j = subgridCol;j < subgridCol + 3;j++)
                if(board[i][j] == val)
                    return false;
        return true;
    }
}
```

## 总结：

![回溯法问题求解](/notes-assets/Algorithm/assets/%E5%9B%9E%E6%BA%AF%E6%B3%95%E9%97%AE%E9%A2%98%E6%B1%82%E8%A7%A3.jpg)

# 贪心算法

贪心本质：通过每阶段的局部最优，从而寻找整体最优。没有模板，全靠感觉

## [分发饼干](https://leetcode.cn/problems/assign-cookies/)

![image-20251227160908972](/notes-assets/Algorithm/assets/image-20251227160908972.png)

对于本题，处于贪心算法的题型里面，就使用贪心来做。要求我们满足的孩子最多的数量，我们可以使用小尺寸喂饱小胃口，如果小尺寸不满足，尺寸就往后遍历，但是前提在于需要将其排序。思路很简短，代码如下：

```C#
public class Solution {
    public int FindContentChildren(int[] g, int[] s) {
		Array.Sort(g);
        Array.Sort(s);
        int total = 0;
        int i = 0;
        int j = 0;
        while(i < s.Length&&j < g.Length){
            if(s[i] >= g[j]){
                total++;
                j++;
            }
            i++;
        }
        return total;
    }
}
```

## [摆动序列](https://leetcode.cn/problems/wiggle-subsequence/)

![image-20260106172732474](/notes-assets/Algorithm/assets/image-20260106172732474.png)

 对于本题求解，采用局部最优得到整体最优解。本题求解摆动序列的最长长度，需要找到极值（也就是峰值），删除峰值之间单调的节点，最后得到到就是最长摆动序列。对于峰值，我们需要遍历数组，使用`prediff（nums[i] - nums[i-1]） 和 curdiff（nums[i+1] - nums[i]）`，如果`prediff < 0 && curdiff > 0` 或者 `prediff > 0 && curdiff < 0` 此时就有波动就需要统计。

同时需要考虑三种情况：

- 存在平坡的情况，如[1,2,2,2,2,1]，此时最长的序列为3，也就是我们在删除的时候 要不删除左面的三个 2，要不就删除右边的三个 2。我们此时同一规则，删除左边的，我们记录峰值的条件应该是： `(preDiff <= 0 && curDiff > 0) || (preDiff >= 0 && curDiff < 0)`

- 数组首尾2端，数组只存在2个元素，直接返回数组长度即可
- 单调坡度有平坡，即如果在一个单调坡度上有平坡，例如[1,2,2,2,3,4]，我们需要考虑如何去更新preDiff，不能每次都遍历就更新，因此我们将更新操作放入坡度 摆动变化的时候。

```C#
public class Solution {
    public int WiggleMaxLength(int[] nums) {
        if(nums.Length <= 1)return nums.Length;
        int preDiff = 0;//记录当前元素与上一个元素的差值
        int curDiff = 0;//记录当前元素与下一个元素的差值
        int maxLen = 1;
        for(int i = 0;i < nums.Length - 1;i++){
            curDiff = nums[i + 1] - nums[i];
            if((preDiff <= 0 && curDiff > 0) || (preDiff >= 0 && curDiff < 0)){
                preDiff = curDiff;
                maxLen++;
            }
        }
        return maxLen;
    }
}
```

## [最大子数组和](https://leetcode.cn/problems/maximum-subarray/)

![image-20260106175824302](/notes-assets/Algorithm/assets/image-20260106175824302.png)

方法一：通过维护**当前前缀和**与**历史最小前缀和**，用 **当前前缀和 − 最小前缀和** 得到以当前位置结尾的某段子数组的最大和，并在遍历过程中更新全局最大和。

```C#
public class Solution {
    public int MaxSubArray1(int[] nums) {
        int ans = -10000;
        int curMax = 0;  //当前前缀
        int min = 0;  //最小前缀
 		for(int i = 0;i < nums.Length;i++){
            curMax += nums[i];
            ans = Math.Max(ans,curMax - min);
            min = Math.Min(min,curMax);
        }
        return ans;
    }
}
```

## [买卖股票的最佳时机 II](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/)

![image-20260106180554991](/notes-assets/Algorithm/assets/image-20260106180554991.png)

```C#
public class Solution {
    public int MaxProfit(int[] prices) {
 		int profit = 0;
        int buy = prices[0];
        for(int i = 1;i < prices.Length;i++){
            if(buy < prices[i]){
				profit += prices[i] - buy;
            }
            buy = prices[i];
        }
        return profit;
    }
}
```

## [跳跃游戏](https://leetcode.cn/problems/jump-game/)

![image-20260107134447336](/notes-assets/Algorithm/assets/image-20260107134447336.png)

本题的重点不在于每一步具体跳多少格，而是判断**当前能够覆盖的最远范围能否到达终点**。我们只需要维护一个变量 `Len`，表示**从起点出发当前能够到达的最大索引位置**。

在遍历数组的过程中，对于每个位置 `i`：

1. 如果 `Len < i`，说明当前能够到达的最远位置无法覆盖到位置 `i`，即**已经无法继续前进**，因此直接返回 `false`
2. 否则，更新能够到达的最远位置：`Len = Math.Max(Len, i + nums[i])`
   - 这里 `i + nums[i]`表示**从位置 i 出发能够跳跃到的最远索引**
   - 而 `Len`表示**到目前为止，从所有可达位置出发能够到达的最远距离**

```C#
public class Solution {
    public bool CanJump(int[] nums) {
        int Len = 0;
        for(int i = 0; i < nums.Length;i++){
            if(Len < i)
                return false;
            Len = Math.Max(i+nums[i],Len);
        }
        return true;
    }
}
```

## [跳跃游戏 II](https://leetcode.cn/problems/jump-game-ii/)

![image-20260107135520702](/notes-assets/Algorithm/assets/image-20260107135520702.png)

在每一步跳跃时，都选择能让我**下一步跳得最远**的位置。不关注具体路径，只关注最少跳跃次数。

**当前跳跃边界**：从当前位置出发，经过`times`次跳跃能到达的最远位置

**下一跳边界**：在下一跳时能够到达的最远位置

**跳跃时机**：当走到当前跳跃边界时，必须进行一次新的跳跃

```C#
public class Solution {
    public int Jump(int[] nums) {
        int Len = 0;        // 当前跳跃能够到达的最远位置
        int times = 0;      // 跳跃次数
        int nextPos = 0;    // 下一次跳跃能够到达的最远位置
        
        // 如果数组长度小于等于1，已经在终点，不需要跳跃
        if (nums.Length <= 1)
            return 0;
            
        for (int i = 0; i < nums.Length; i++) {
            if (Len < i) break;  // 无法到达当前位置，退出
            if (Len >= nums.Length - 1) break;  // 已经可以到达终点，退出
            
            // 更新从当前位置能够到达的最远位置
            nextPos = Math.Max(nextPos, nums[i] + i);
            
            // 如果已经到达当前跳跃的边界
            if (i == Len) {
                times++;      // 必须进行一次跳跃
                Len = nextPos; // 更新为下一跳的最远边界
            }
        }
        return times;
    }
}
```

## [K 次取反后最大化的数组和](https://leetcode.cn/problems/maximize-sum-of-array-after-k-negations/)

![image-20260109235739923](/notes-assets/Algorithm/assets/image-20260109235739923.png)

本题题意很明显，如何去反转数组。首先需要看反转的次数以及数组元素的排列。

- 如果数组负数的个数 大于 k，则可以从小到大 依此反转数组，这样越小的数反转后得到的数越大。
- 负数个数小于 k 且没有 0”的情况下，需要先翻转完所有负数，然后**根据剩余翻转次数的奇偶性**来决定是否翻转当前数组中的**绝对值最小的数**

```C#
public class Solution {
    public int LargestSumAfterKNegations(int[] nums, int k) {
		for(int i = 0;i < k;i++){
            Array.Sort(nums);
            nums[0] = nums[0] * -1;
        }
        int sum = 0;
        for(int i = 0;i < nums.Length;i++){
            sum += nums[0];
        }
        return sum;
    }
}
```

```C#
public class Solution {
    public int LargestSumAfterKNegations(int[] nums, int k) {
        Array.Sort(nums,(a,b) => Math.Abs(b) - Math.Abs(a));  //按数组元素的绝对值大小进行排序
        for(int i = 0;i < nums.Length;i++){
            if(nums[i] < 0 && k > 0){  //如果当前元素是负数，并且依旧可以反转
                nums[i] *= -1;
                k--;
            }
        }
        if(k % 2 == 1)nums[nums.Length - 1] *= -1; 
        //如果负数全部反转后，以及还有反转次数，并且反转次数是奇数，那么直接反转数组的最后一个元素，因为是按照绝对值大小进行排序的，最后一个元素是最小的。
        int sum = 0;
        for(int i = 0;i < nums.Length;i++)
            sum += nums[i];
        return sum;
    }
}
```

## [加油站](https://leetcode.cn/problems/gas-station/)

![image-20260110001612750](/notes-assets/Algorithm/assets/image-20260110001612750.png)

**总油量检查**

计算 `总油量 = sum(gas)`，`总消耗 = sum(cost)`。

如果 `总油量 < 总消耗`，则无论从哪站出发都无法绕一圈，返回 `-1`。

**贪心选择起点**

如果总油量足够，则一定有解。

我们可以从头遍历一次，用 `current_tank`记录当前油箱的剩余油量，`start`记录可能的起点。

- 从 `start = 0`开始，`current_tank = 0`。
- 依次经过每个加油站 `i`，更新 `current_tank += gas[i] - cost[i]`。
- 如果到达某个站点时，`current_tank < 0`，说明从 `start`出发无法到达这个站点，则将起点设为 `i + 1`，并重置 `current_tank = 0`。
- 遍历结束时，`start`即为可行起点。

**正确性依据**

如果总油量足够，那么从 `start`开始一定能走完。因为如果从 `A`无法到 `B`，那么 `A`到 `B`之间任意点出发也无法到 `B`，所以可以直接跳到 `B`之后尝试。

```C#
public class Solution {
    public int CanCompleteCircuit(int[] gas, int[] cost) {
        if (gas.Length == 0)
            return -1;
        int index = 0;      // 可能的起点
        int totalGas = 0;   // 总剩余油量
        int curGas = 0;     // 当前累积剩余油量
        for(int i = 0; i < gas.Length;i++){
            int costGas = gas[i] - cost[i];  // 在i站加油后到达i+1站的净收益
            totalGas += costGas;             // 统计总净收益
            curGas += costGas;               // 当前路径的累积净收益
            
            if(curGas < 0){                  // 当前路径油量不足
                index = i + 1;               // 重新从下一站开始尝试
                curGas = 0;                  // 重置当前累积油量
            } 
        }
        return totalGas >= 0 ? index : -1;
    }
}
```

## [分发糖果](https://leetcode.cn/problems/candy/)

![image-20260110235058468](/notes-assets/Algorithm/assets/image-20260110235058468.png)

对于本题求解，不能直接一次遍历求解，每个位置的糖果值同时依赖2侧，对于ratings = [1, 3, 2, 1]，如果采用一次遍历结果如下所示。

```C#
初始化: [1,1,1,1]

i=0: 只看右边，1<3 → 不调整
i=1: 左边(3>1) → candies[1]=2
     右边(3>2) → candies[1]=max(2, 1+1)=2 → [1,2,1,1]
i=2: 左边(2<3) → 不调整
     右边(2>1) → candies[2]=max(1, 1+1)=2 → [1,2,2,1]
i=3: 最后一人 → [1,2,2,1]

检查：位置1(3分,2糖) > 位置2(2分,2糖) ❌
评分3>2，但糖果2=2，违反规则！
```

所以我们需要依赖两侧的值，依此需要2次遍历。但是这2次遍历不能都从左往右开始。对于本题，如果都采用从左往后开始遍历，那么第二次的遍历操作与第一次没有任何区别，处理不了左 > 右这个约束条件，所以第二次遍历是右往左开始。同时第一次的操作是直接赋值，第二次的操作是比较赋值的原因在于评分高的位置要高于左右2侧的糖果，所以需要在左右2侧中的最高值 + 1得到。

**具体思路**：

- 首先对所有的位置都进行初始化操作，为了满足都有糖果的题意
- 第一次遍历，如果右侧的评分高于左侧，右侧糖果则在上一个索引的糖果数上 + 1，以满足大于左右2侧的要求
- 第二次遍历，从右往左，如果左侧的评分高于右侧，则右侧糖果上 + 1.
- 最后统计即可

```C#
public class Solution {
    public int Candy(int[] ratings) {
        if(ratings.Length == 0)
            return 0;
        
        int[] T = new int[ratings.Length];

        for(int i = 0; i < ratings.Length; i++){
            T[i] = 1;
        }
        for(int i = 1;i < ratings.Length;i++)
        {
           if(ratings[i] > ratings[i - 1])//如果右边孩子的评分大于左边，则一定比左边孩子多一个糖果
                T[i] = T[i - 1] + 1;       
        }

        for(int i = ratings.Length - 2;i >= 0;i--)
        {
            if(ratings[i] > ratings[i + 1]) //如果左边的孩子大于右边
                T[i] = Math.Max(T[i],T[i + 1] + 1);
        }
        int result = 0;
        for(int i = 0;i < T.Length;i++)
            result += T[i];
        return result;
    }
}
```

## [柠檬水找零](https://leetcode.cn/problems/lemonade-change/)

![image-20260111014345921](/notes-assets/Algorithm/assets/image-20260111014345921.png)duiyu

对于本题求解，由于本题给出只需要维护三种金额的数量，5，10和20。很显然只有3中情况

- 情况一：账单是5，直接收下。
- 情况二：账单是10，消耗一个5，增加一个10
- 情况三：账单是20，优先消耗一个10和一个5，如果不够，再消耗三个5

我们使用3个int变量来记录每个类型即可，本题贪心在于在顾客支付20的时候优先使用10 + 5组合支付，因为5美元的通用性更加广。

```C#
public class Solution {
    public bool LemonadeChange(int[] bills) {
        int FiveCount = 0;
        int TenCount = 0;
        int TwenteCount = 0;
        for(int i = 0;i < bills.Length;i++){
            if(bills[i] == 5){
                FiveCount++;
            }
            else if(bills[i] == 10){
                if(FiveCount < 1)
                    return false;
                FiveCount--;
                TenCount++;
            }
            else
            {   // 优先使用 10+5 的组合找零
                if(TenCount > 0 && FiveCount > 0){
                    FiveCount--;
                    TenCount--;
                }
                else if(FiveCount >= 3)
                    FiveCount -= 3;
                else
                    return false;
            }
        }
        return true;
    }
}
```

## [用最少数量的箭引爆气球](https://leetcode.cn/problems/minimum-number-of-arrows-to-burst-balloons/)

![image-20260111193005166](/notes-assets/Algorithm/assets/image-20260111193005166.png)

![avatar](/notes-assets/Algorithm/assets/1722243105-Ttiufu-image.png)

本题求解首先需要对数组进行排序，按照每个区间范围的开始进行从小到大的排序。排序完成后，进行遍历，如果一个区间的开始值大于上一个区间的结束值，代表没有交集区间，那么此时的箭的数量需要 + 1，如果在同一个区间，则进行区间的收缩，找到较小的值。在判断下一个区间和本次收缩后区间是否存在交集，如果存在，则也是相同的。

```C#
public class Solution {
    public int FindMinArrowShots(int[][] points) {
        if(points.Length == 0)
            return 0;
        // 使用 CompareTo 避免溢出
        Array.Sort(points, (a, b) =>
        {
            int cmp = a[0].CompareTo(b[0]);  // 先比较第一个元素
            if (cmp == 0)  // 如果第一个元素相等
            {
                return a[1].CompareTo(b[1]);  // 再比较第二个元素
            }
            return cmp;
        });
        int Count = 1;
        for(int i = 1;i < points.Length;i++){
            if(points[i][0] > points[i - 1][1])
                Count++;
            else
                points[i][1] = Math.Min(points[i][1],points[i - 1][1]);
        }
        return Count;
    }
}
```

## [无重叠区间](https://leetcode.cn/problems/non-overlapping-intervals/)

![image-20260112003326632](/notes-assets/Algorithm/assets/image-20260112003326632.png)

本题求解与上题 [用最少数量的箭引爆气球](https://leetcode.cn/problems/minimum-number-of-arrows-to-burst-balloons/)很类似，一个模板，区别在于一个是需要交集，一个是不需要交集。因此我们只需要在判断条件的位置换一下即可。具体思路一致

```C#
public class Solution {
    public int EraseOverlapIntervals(int[][] intervals) {
        // 使用 CompareTo 避免溢出
        Array.Sort(intervals, (a, b) =>
        {
            int cmp = a[0].CompareTo(b[0]);  // 先比较第一个元素
            if (cmp == 0)  // 如果第一个元素相等
            {
                return a[1].CompareTo(b[1]);  // 再比较第二个元素
            }
            return cmp;
        });
        int count = 0;
        for(int i = 1;i < intervals.Length;i++){
            if(intervals[i][0] < intervals[i - 1][1]){
                intervals[i][1] = Math.Min(intervals[i][1],intervals[i- 1][1]);
                count++;
            }
        }
        return count;
    }
}
```

## [划分字母区间](https://leetcode.cn/problems/partition-labels/)

![image-20260112003650110](/notes-assets/Algorithm/assets/image-20260112003650110.png)

**预处理**：记录每个字符在字符串中**最后出现的位置**（最右索引）

**遍历贪心**：

- 维护当前分段的起始位置`left`和必须包含的**最远边界`right`**
- 遍历每个字符时，用`Math.Max`更新`right`为**当前字符最后出现位置**和**当前right**的较大值
- 当遍历到`i == right`时，说明当前位置之后不再有当前段的字符，此时：
  - 记录当前段长度
  - 将`left`移动到下一段的开始位置

重复直到字符串结束

本题求解的关键就在于如何找到当前区间能满足题意的最右区间，因此使用**Right = Math.Max(Right,hash[s[i] - 'a'])**，这样才能找到正确的区间

```C#
public class Solution {
    public IList<int> PartitionLabels(string s) {
        int[] hash = new int[27];
        for(int i = 0;i < 27;i++){
            hash[i] = 0;
        }
        for(int i = 0;i < s.Length;i++){
            hash[s[i] - 'a'] = i;//记录每个字符出现的最后一次的索引
        }
        List<int> ans = new List<int>();
        int Left = 0;
        int Right = 0;
        for(int i = 0;i < s.Length;i++){
            Right = Math.Max(Right,hash[s[i] - 'a']);//找到当前已经包含区间的最远边界
            if(i == Right){
                ans.Add(Right - Left + 1);
                Left = i + 1;
            }
        }
        return ans;
    }
}
```

## [合并区间](https://leetcode.cn/problems/merge-intervals/)

![image-20260112151052019](/notes-assets/Algorithm/assets/image-20260112151052019.png)

关于区间类型的题，一般都是需要进行排序的。因此首先进行数组的排序，按照起始值 从小到大开始排序。排序结束后，开始数组的遍历，找到区间交集然后开始合并区间，但是本题的区别在于将区间合并后，原始区间并没有消失。因此我们需要一个新变量来存储结果，首先将数组的第一个元素存入，然后使用存入的遍历与数组元素进行比较区间是否存在交集，这样保持原数组不变的情况下，也能保证答案正确。

```C#
 public int[][] Merge1(int[][] intervals) {
        Array.Sort(intervals, (a, b) =>
        {
            int cmp = a[0].CompareTo(b[0]);  // 先比较第一个元素
            if (cmp == 0)  // 如果第一个元素相等
            {
                return a[1].CompareTo(b[1]);  // 再比较第二个元素
            }
            return cmp;
        });
        List<int[]> ans = new List<int[]>();
        ans.Add(intervals[0]);

        for(int i = 1;i < intervals.Length;i++){
            if(ans[ans.Count - 1][1] >= intervals[i][0])
            {
                ans[ans.Count - 1][1] = Math.Max(ans[ans.Count - 1][1],intervals[i][1]);    
            }
            else{
                ans.Add(intervals[i]);
            }
        }
        return ans.ToArray();
    }
```

## [单调递增的数字](https://leetcode.cn/problems/monotone-increasing-digits/)

![image-20260112200728637](/notes-assets/Algorithm/assets/image-20260112200728637.png)

# 动态规划

**贪心算法**：每一步都做出**当前看起来最优**的选择，不回头

**动态规划**：考虑**所有可能的决策**，基于之前的最优解推导当前最优解

| 方面       | 动态规划 (DP)              | 贪心算法               |
| ---------- | -------------------------- | ---------------------- |
| 决策依据   | 基于之前所有子问题的最优解 | 基于当前局部最优       |
| 时间复杂度 | 通常更高（多项式时间）     | 通常更低（线性/对数）  |
| 空间复杂度 | 需要存储状态表             | 通常只需常量空间       |
| 最优性     | 保证全局最优               | 不一定保证全局最优     |
| 问题类型   | 最优化问题，有重叠子问题   | 有贪心选择性质的问题   |
| 典型问题   | 0-1背包、最长公共子序列    | 霍夫曼编码、最小生成树 |

## [斐波那契数](https://leetcode.cn/problems/fibonacci-number/)

![image-20260115001141757](/notes-assets/Algorithm/assets/image-20260115001141757.png)

对于本题求解，很简单的思路，采用递归求解。我们只需要知道每次的结果都是由上一次结果来得到，因此我们只需要做好每部的操作，然后将结果送到下一层。

```C#
public class Solution {
    public int Fib(int n) {
        if(n == 0)
            return 0;
        else if(n == 1)
            return 1;
        else
            return Fib(n - 1) + Fib(n - 2);
}
```

但是这样写的效率很低，包含了很多重复计算，比如计算Fib(4)，需要计算Fib（3） + Fib（2），Fib（3） =  Fib（2）+ Fib（1）,这样就计算了多次Fib（2），降低效率，因此我们需要去记录已经存在的结果，就需要用空间复杂度来换时间复杂度，我们使用数组来记录已经知道结果的数值即可。也可以不使用数组，因为只需要知道n - 1和 n - 2的数值。

```C#
public class Solution {
    public int Fib(int n) {
        if(n == 1 || n == 2)
            return 1;
        if(n == 0)
            return 0;
        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 1;
        for(int i = 3;i <= n;i++)
            dp[i] = dp[i - 1] + dp[i - 2];
        
        return dp[n];
    }
}
```

## [爬楼梯](https://leetcode.cn/problems/climbing-stairs/)

![image-20260115002626839](/notes-assets/Algorithm/assets/image-20260115002626839.png)

本题其实本质与斐波那契数列一致，都是需要知道前面的结果来得到本次结果，并且状态转移方程也是相同的，都是由 n - 1和 n - 2的结果来得到本次的结果的，因此使用同样的方法来求解；

```c#
public class Solution {
    public int ClimbStairs(int n) {
        if(n == 1)
            return 1;
        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 2;
        for(int i = 3 ; i <= n;i++)
            dp[i] = dp[i - 1] + dp[i - 2];
        return dp[n];
    }
}
```

## [使用最小花费爬楼梯](https://leetcode.cn/problems/min-cost-climbing-stairs/)

![image-20260115003525521](/notes-assets/Algorithm/assets/image-20260115003525521.png)

本题要求在爬楼梯操作中以最小成本到达楼顶。由于每次爬楼梯可选择走 1 级或 2 级台阶，到达某一层的最小成本仅依赖于前 1 层和前 2 层的最小成本，因此我们采用动态规划方法：定义一个数组来记录爬到每一层台阶的最小成本，通过比较到达当前层的所有可能路径的成本，选择最小值存入数组，最终递推计算至楼顶时，数组中对应的结果即为爬楼梯的最小总成本。

```C#
public class Solution {
    public int MinCostClimbingStairs(int[] cost) {
        int n = cost.Length;
        if(n < 2)
            return 0;
        int[] dp = new int[cost.Length + 1];
        dp[0] = 0;
        dp[1] = 0;
        for(int i = 2; i <= n;i++){
            dp[i] = Math.Min(dp[i - 1] + cost[i - 1],dp[i - 2] + cost[i - 2]);
        }
        return dp[n];
    } 
}
```

## [不同路径](https://leetcode.cn/problems/unique-paths/)

![image-20260115162347777](/notes-assets/Algorithm/assets/image-20260115162347777.png)

本题是典型的动态规划问题，机器人只能向右或向下移动，因此每个位置只能从左方或上方到达。状态转移方程为：`dp[i][j] = dp[i-1][j] + dp[i][j-1]`。初始时，第一行和第一列的每个位置都只有一种到达方式，因此初始化为1。最后返回右下角位置的值即可。

```C#
public class Solution {
    public int UniquePaths(int m, int n) {
       int[][] dp = new int[m][];
        for(int i = 0; i < m; i++)
        {
            dp[i] = new int[n];
        }
        dp[0][0] = 0;
        for (int i = 0; i < m; i++)
            dp[i][0] = 1;
        for (int j = 0; j < n; j++)
            dp[0][j] = 1;
        for (int i = 1; i < m; i++)
        {

            for (int j = 1; j < n; j++)
            {
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            }
        }
        return dp[m - 1][n - 1];
    }
}
```

## [不同路径 II](https://leetcode.cn/problems/unique-paths-ii/)

![image-20260115164727882](/notes-assets/Algorithm/assets/image-20260115164727882.png)

本题与上题的区别在于多了障碍物，导致路径减少。但是不影响求解的思路，首先就是初始化，第一行和第一列，但是会存在区别，如果障碍物出现第一行和第一列，那么后面的全部都是 0，因为到达不了。同时在遍历的时候也需要修改，到遍历到障碍物后，说明到达不了这个点，但是不影响其他点。

```C#
public class Solution {
    public int UniquePathsWithObstacles(int[][] obstacleGrid) {
        int m = obstacleGrid.Length;
        int n = obstacleGrid[0].Length;

        int[][] dp = new int[m][];

        for(int i = 0;i < m;i++){
            dp[i] = new int[n];
        }
        for(int i = 0;i < m;i++){
            for(int j = 0;j < n;j++)
                dp[i][j] = 0;
        }
        
        for (int i = 0; i < m; i++)
        {
            if(obstacleGrid[i][0] == 0)
                dp[i][0] = 1;
            else
                break;
        }
        for (int j = 0; j < n; j++){
            if(obstacleGrid[0][j] == 0)
                dp[0][j] = 1;
            else
                break;
        }
        for(int i = 1;i < m;i++){
            for(int j = 1; j < n;j++){
                if(obstacleGrid[i][j] == 1){
                    dp[i][j] = 0;
                }
                else
                    dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
            }
        }
        return dp[m - 1][n - 1];
    }
}
```

## [不同的二叉搜索树](https://leetcode.cn/problems/unique-binary-search-trees/)

![image-20260117155307182](/notes-assets/Algorithm/assets/image-20260117155307182.png)

题意需要找到有多少种二叉搜索树，关于二叉搜索树的定义（左 < 中 < 右），如果n = 1，只有一个节点，只有一个二叉搜索树，如果 n = 2，那么存在2中情况，1为根节点，那么2只能在右侧，2为根节点，1只能在左侧。对于 `n`个节点，我们可以考虑分别以每个节点作为根节点：

- 如果根节点值为 `j`，则左子树必然由 `1`到 `j-1`这 `j-1`个节点组成，右子树由 `j+1`到 `n`这 `n-j`个节点组成。
- 左子树能构成的 BST 数量为 `dp[j-1]`，右子树能构成的 BST 数量为 `dp[n-j]`。
- 左右子树相互独立，因此以 `j`为根节点的 BST 种类数为 `dp[j-1] * dp[n-j]`。
- dp[i]=∑j=1idp[j−1]⋅dp[i−j]

```C#
public class Solution {
    public int NumTrees(int n) {
        int[] dp = new int[n + 1];
        dp[0] = 1;

        for(int i = 1;i <= n;i++)
            for(int j = 1;j <= i;j++){
                dp[i] += dp[j - 1] * dp[i - j];
        }
        return dp[n];
    }
}
```

## 背包问题

![image-20260126130159256](/notes-assets/Algorithm/assets/image-20260126130159256.png)

### 01背包问题

有n件物品和一个最多能背重量为w 的背包。第i件物品的重量是weight[i]，得到的价值是value[i] 。**每件物品只能用一次**，求解将哪些物品装入背包里物品价值总和最大。

**暴力动态规划**

```C#
public class Solution
{
    static void Main(string[] args)
    {
        int n = 0;
        int bagWeight = 0;
        string Cin = Console.ReadLine();
        string Cin1 = Console.ReadLine();

        n = int.Parse(Cin);
        bagWeight = int.Parse(Cin1);

        List<int> weight = new List<int>();
        List<int> value = new List<int>();
        for(int i = 0;i<n;i++)
        {
            string cin =  Console.ReadLine();
            weight.Add(int.Parse(cin));
        }
        for(int i = 0; i<n;i++)
        {
            string cin = Console.ReadLine();
            value.Add(int.Parse(cin));
        }
        process(weight, value,0, bagWeight);
    }
    static int process(List<int> weight,List<int> value,int index,int bag) {
        if (bag < 0)
            return -1;
        if (index == weight.Count)
            return 0;

        // 不选当前物品
        int p1 = process(weight, value, index + 1, bag);

        // 选当前物品（如果能选）
        int p2 = 0;
        int next = process(weight, value, index + 1, bag - weight[index]);
        if (next != -1)
            p2 = value[index] + next;

        return Math.Max(p1, p2);
    }
}
```

**二维数组动态规划**

1.确定dp数组的下标及其意义

使用二维数组dp[ i ] [ j ]来**表示从下标为[0-i]的物品里任意取，放进容量为j的背包，价值总和最大是多少**。其中i代表物品i，j代表背包容量大小。

2.确定递推公式

![img](/notes-assets/Algorithm/assets/20240730174436.png)

对于每一个物品，我们需要考虑是否放置该物体后价值的最大。

- **不放物品i**：背包容量为j，里面不放物品i的最大价值是dp[i - 1] [j]。
- **放物品i**：背包空出物品i的容量后，背包容量为j - weight[i]，dp[i - 1] [j - weight[i]] 为背包容量为j - weight[i]且不放物品i的最大价值，那么dp[i - 1] [j - weight[i]] + value[i] （物品i的价值），就是背包放物品i得到的最大价值

递推公式：dp[i][j] = max(dp[i - 1] [j], dp[i - 1] [j - weight[i]] + value[i]);

3.dp数组初始化

首先从dp数组的定义出发，如果背包容量j 为 0 的情况下，因为背包容量为空，总价值肯定为0

在看其他情况。

状态转移方程 `dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - weight[i]] + value[i]);` 可以看出i 是由 i-1 推导出来，那么i为0的时候就一定要初始化。

dp[0] [j]，即：i为0，存放编号0的物品的时候，各个容量的背包所能存放的最大价值。

那么很明显当 `j < weight[0]`的时候，dp[0][j] 应该是 0，因为背包容量比编号0的物品重量还小。

当`j >= weight[0]`时，dp[0][j] 应该是value[0]，因为背包容量放足够放编号0物品。

```C#
for(int i = 1;i < weight.Length;i++){//初始化背包容量为0的情况
    dp[i][0] = 0;
}
for(int j = weight[0];j <= bagweight;j++){
    dp[0][j] = value[0];
}
```

此时经过初始化代码的情况后，背包情况如下：

![动态规划-背包问题7](/notes-assets/Algorithm/assets/20210110103109140.png)

其实从递归公式： dp[i][j] = max(dp[i - 1] [j], dp[i - 1] [j - weight[i]] + value[i]); 可以看出dp[i] [j] 是由左上方数值推导出来了，那么 其他下标初始为什么数值都可以，因为都会被覆盖。那么直接全部初始化为0

![动态规划-背包问题10](/notes-assets/Algorithm/assets/%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92-%E8%83%8C%E5%8C%85%E9%97%AE%E9%A2%9810.jpg)

```C#
List<List<int>> dp = new List<List<int>>();
for (int j = weight[0]; j <= bagweight; j++) {
    dp[0][j] = value[0];
}
```

4.确定遍历顺序

先遍历物品，然后遍历背包重量

```C#
// weight数组的大小 就是物品个数
for(int i = 1; i < weight.size(); i++) { // 遍历物品
    for(int j = 0; j <= bagweight; j++) { // 遍历背包容量
        if (j < weight[i]) dp[i][j] = dp[i - 1][j];
        else dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - weight[i]] + value[i]);

    }
}
```

```C#
public int Knapsack01(int bagweight, int[] weight, int[] value)
{
    if (weight.Length == 0 || bagweight == 0) return 0;
    
    int n = weight.Length;
    int[,] dp = new int[n, bagweight + 1];
    
    // 初始化
    for (int j = 0; j <= bagweight; j++)
    {
        dp[0, j] = (j >= weight[0]) ? value[0] : 0;
    }
    
    // 遍历
    for (int i = 1; i < n; i++)  // 遍历物品
    {
        for (int j = 1; j <= bagweight; j++)  // 遍历背包容量
        {
            if (j < weight[i])
            {
                // 当前背包容量小于物品重量，无法放入
                dp[i, j] = dp[i - 1, j];
            }
            else
            {
                // 可以选择放入或不放入当前物品
                dp[i, j] = Math.Max(
                    dp[i - 1, j],  // 不放入
                    dp[i - 1, j - weight[i]] + value[i]  // 放入
                );
            }
        }
    }
    
    return dp[n - 1, bagweight];
}
```

