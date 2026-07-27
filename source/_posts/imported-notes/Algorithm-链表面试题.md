---
title: 链表面试题
date: 2026-06-27 03:29:00
categories:
  - 算法与数据结构
tags:
  - Algorithm
  - 笔记
---
# 判断链表是否为回文

1.使用容器栈来进行，将所有的数据压入栈，在一个一个出栈与链表进行比较，只要不相同就直接return false

```C#
    public bool isTenet(Node head)
    {
        Stack<int> Contains = new Stack<int>();
        Node cur = head;
        while (cur != null)
        {
            Contains.Push(cur.e);
            cur = cur.next;
        }
        cur = head;
        while (cur != null)
        {
            if (Contains.Pop() != cur.e)
                return false;
            cur = cur.next;
        }
        return true;
    }
```

2.翻转后端链表，使用快慢指针找到中间节点，找到后翻转后半部分的链表，比较后段部分的链表是否和前端部分，最后恢复链表

```C#
public bool IsPalindrome(Node head) {
    if (head == null || head.next == null) return true; // 修正1：空链表或单节点应返回true

    Node slow = head;
    Node fast = head;
    
    // 修正2：安全的快指针移动条件
    while (fast.next != null && fast.next.next != null) 
    {
        slow = slow.next; 
        fast = fast.next.next;
    }
    
    // 将右半部分逆序
    fast = slow.next;
    slow.next = null;
    Node cur = null;
    while (fast != null) 
    {
        cur = fast.next;
        fast.next = slow;  // 逆序指向中间节点 
        slow = fast;
        fast = cur;
    }
    
    // 比较两部分
    fast = head;
    Node tail = slow; // 保存尾部节点用于恢复
    bool res = true;
    while (slow != null)  // 修正3：只需判断slow不为null
    {
        if (fast.val != slow.val)
        {
            res = false;
            break;
        }
        fast = fast.next;
        slow = slow.next;
    }

    // 翻转回来（恢复链表）
    slow = tail;
    cur = null;
    while (slow != null)
    {
        fast = slow.next;
        slow.next = cur;
        cur = slow;
        slow = fast;
    }
    return res;
}
```

# 链表分区

链表分区算法，将链表根据给定值 N 划分为三个部分：小于 N 的节点、等于 N 的节点和大于 N 的节点，同时保持每个分区内节点的原始相对顺序。

- `Node cur = null;` —— 临时存储当前节点的下一个节点。
- `SmallS` 和 `SmallE` —— 分别指向“小于 N”分区的头节点和尾节点。
- `MidS` 和 `MidE` —— 分别指向“等于 N”分区的头节点和尾节点。
- `MoreS` 和 `MoreE` —— 分别指向“大于 N”分区的头节点和尾节点。

```C#
public Node R(Node head,int N){
     Node cur = null;  //遍历指针
     Node SmallS = null;  //小于区域的头
     Node SmallE = null;  //小于区域的尾
     Node MidS = null;    //等于区域的头
     Node MidE = null;    //等于区域的尾
     Node MoreS = null;   //大于区域的头
     Node MoreE = null;   //大于区域的尾
    
    while (head != null) {
    cur = head.next;  // 暂存下一个节点
    head.next = null;  // 断开当前节点
    if (head.e < N) {  // 放入“小于 N”分区
        if (SmallS == null) {  // 如果分区为空，初始化头尾
            SmallS = head;
            SmallE = head;
        } else {  // 否则追加到尾部
            SmallE.next = head;
            SmallE = head;
        }
    }
    else if (head.e == N) {  // 放入“等于 N”分区
        if (MidS == null) {
            MidS = head;
            MidE = head;
        } else {
            MidE.next = head;
            MidE = head;
        }
    }
    else {  // 放入“大于 N”分区
        if (MoreS == null) {
            MoreS = head;
            MoreE = head;
        } else {
            MoreE.next = head;
            MoreE = head;
        }
    }
    head = cur;  // 移动到下一个节点
    }
    
    if (SmallE != null) {  // 如果“小于 N”分区非空
    SmallE.next = MidS;  // 连接“小于”和“等于”分区
    MidE = MidE == null ? SmallE : MidE;  // 如果“等于”分区为空，则用“小于”的尾节点连接“大于”分区
    }
    
    if (MidE != null) {  // 如果“等于”分区非空（或已由“小于”分区连接）
        MidE.next = MoreS;  // 连接“等于”和“大于”分区
    }
    
    return SmallS != null ? SmallS : (MidS != null ? MidS : MoreS);//返回新链表的头节点​
}
```

# 复制带随机指针的链表

### 1.使用容器

```C#
public class Solution {
    public Node CopyRandomList(Node head) {
        if (head == null)
            return null;
        Dictionary<Node,Node> NodeDic = new Dictionary<Node,Node>();
        Node cur = head;
        while(cur != null)
        {
            NodeDic.Add(cur, new Node(cur.val));
            cur = cur.next;
        }
        cur = head;
        while(cur != null)
        {

            NodeDic[cur].next = cur.next != null ? NodeDic[cur.next] : null;
             NodeDic[cur].random = cur.random != null ? NodeDic[cur.random] : null;
            cur = cur.next;
        }
        return NodeDic[head];
    }
}
```

| `NodeDic[cur].next = NodeDic[cur.next];` | 让新节点的 `next` 指向对应的新节点 | 避免新链表仍然依赖原链表 |
| ---------------------------------------- | ---------------------------------- | ------------------------ |
| `NodeDic[cur].Rand = NodeDic[cur.Rand];` | 让新节点的 `Rand` 指向对应的新节点 | 确保随机指针正确映射     |

### 2.**原地复制 + 拆分链表**

**核心思路**

1. **在每个原节点后面插入它的副本**（创建新节点并插入）。

2. 设置 `random` 指针

   ：新节点的 `random` = 原节点 `random` 的副本（即 `cur.next.random = cur.random.next`）。

3. **拆分新旧链表**，恢复原链表结构，并返回新链表。

```C#
public Node copyListWithRand(Node head) {
    if (head == null) return null;

    // 1. 复制每个节点，并插入到原节点后面
    Node cur = head;
    while (cur != null) {
        Node copy = new Node(cur.e);  // 创建新节点
        copy.next = cur.next;         // 新节点指向原节点的下一个
        cur.next = copy;              // 原节点指向新节点
        cur = copy.next;              // 移动到下一个原节点
    }

    // 2. 设置新节点的 random 指针
    cur = head;
    while (cur != null) {
        if (cur.Rand != null) {
            cur.next.Rand = cur.Rand.next;  // 新节点的 random = 原节点 random 的副本
        }
        cur = cur.next.next;  // 跳过新节点，处理下一个原节点
    }

    // 3. 拆分新旧链表
    cur = head;
    Node newHead = head.next;  // 新链表的头节点
    Node copyCur = newHead;
    while (cur != null) {
        cur.next = cur.next.next;      // 恢复原链表的 next
        cur = cur.next;                // 移动到原链表的下一个节点
        if (copyCur.next != null) {
            copyCur.next = copyCur.next.next;  // 设置新链表的 next
            copyCur = copyCur.next;            // 移动到新链表的下一个节点
        }
    }

    return newHead;
}
```

# 两个可能有环的单链表的第一个相交节点 

给定两个可能有环也可能无环的单链表，头节点head1和head2请实现一个函数，如果两个链表相交，请返回相交的第一个节点。如果不

相交，返回null

【要求]如果两个链表长度之和为N，时间复杂度请达到O(N)，额外空间复杂度请达到O(1)。

1.2个单链表无环

2.一个链表有环，一个链表无环，不可能相交

3.两个链表都有环，此时有3种情况

- 2个链表不相交
- 2个链表的相交节点的相同，且为入环节点
- 2个链表的相交节点的不同 

```C#
  public Node main(Node head1, Node head2)
  {
      if (head1 == null || head2 == null)
          return null;
      Node loop1 = GetLoopNode(head1);
      Node loop2 = GetLoopNode(head2);
      if(loop1 != null && loop2 != null)
      {
          return bothLoop(head1,loop1,head2,loop2);
      }
      else
      {
          return noLoop(head1,head2);
      }
  }
  public Node bothLoop(Node head1,Node loop1,Node head2,Node loop2)
  {
      if (head1 == null || head2 == null)
          return null;
      if (loop1 == loop2)
      {
          Node cur1 = head1;
          Node cur2 = head2;
          int n = 0;
          while (cur1 != null)
          {
              n++;
              cur1 = cur1.next;
          }
          while (cur2 != null)
          {
              n--;
              cur2 = cur2.next;
          }
         
          cur1 = n > 0 ? head1 : head2;//找到长链表
          cur2 = cur1 == head1 ? head2 : head1;  //如果cur1是长两边，cur2是短的
          n = Math.Abs(n);
          while (n != 0)
          {
              cur1 = cur1.next;
              n--;
          }
          while (cur1 != cur2)
          {
              cur1 = cur1.next;
              cur2 = cur2.next;
          }
          return cur1;
      }
      else
      {
          Node cur = loop1.next;
          while (cur != loop1)
          {
              if (cur == loop2)
                  return loop1;
              cur = cur.next;
          }
      }
      return null;
  }
  public Node noLoop(Node head1,Node head2)
  {
      if (head1 == null || head2 == null)
          return null;
      Node cur1 = head1;
      Node cur2 = head2;
      int n = 0;
      while (cur1!=null)
      {
          n++;
          cur1 = cur1.next;
      }
      while (cur2 != null)
      {
          n--;
          cur2 = cur2.next;
      }
      n = Math.Abs(n);
      cur1 = n > 0 ? head1 : head2;//找到长链表
      cur2 = cur1 == head1 ? head2 : head1;  //如果cur1是长两边，cur2是短的

      while (n != 0)
      {
          cur1 = cur1.next;
          n--;
      }
      while (cur1 != cur2)
      {
          cur1 = cur1.next;
          cur2 = cur2.next;
      }
      return cur1;
  }
  public Node GetLoopNode(Node head)
  {
      if(head == null||head.next == null || head.next.next == null)
      {
          return null;
      }
      Node slow = head.next;
      Node fast = head.next.next;
      while (fast != null && fast.next != null)//可能沒有环，找到了最后的节点
      {
          if(slow == fast)
              break;
          
          slow = slow.next;
          fast = fast.next.next;
      }
      
      if(fast == null || fast.next == null)//判断是不是最后的节点，如果是则直接返回false
            return null;
      
      fast = head;//找到了快慢指针的重合点
      while(slow!=fast)
      {
          slow = slow.next;
          fast = fast.next;
      }
      return slow;
  }
```

