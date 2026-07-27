---
title: 2叉树
date: 2026-06-27 03:12:00
categories:
  - 算法与数据结构
tags:
  - Algorithm
  - 笔记
---
![image-20250728183541588](/notes-assets/Algorithm/assets/image-20250728183541588.png)

```C#
 * public class Node {
 *     public int val;
 *     public Node left;
 *     public Node right;
 *     public Node(int val=0, Node left=null, Node right=null) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
```



# 非递归实现遍历

### 使用栈进行先序遍历  头 - 左 - 右

```C#
public List<int> presort(Node head)
{
    List<int> result = new List<int>();
    Stack<Node> nodes = new Stack<Node>();
    if (head != null)
    {
        nodes.Push(head);
        while(nodes.Count > 0)
        {
            Node cur = nodes.Pop();
            result.Add(cur.value); // 收集节点值
            
            if (cur.right != null)
                nodes.Push(cur.right);
            if (cur.left != null)
                nodes.Push(cur.left);
        }
    }
    return result;
}
```

### 使用栈进行先序遍历  头 - 右 - 左

```C#
public List<int> presort(Node head)
{
    List<int> result = new List<int>();
    Stack<Node> nodes = new Stack<Node>();
    if (head != null)
    {
        nodes.Push(head);
        while(nodes.Count > 0)
        {
            Node cur = nodes.Pop();
            result.Add(cur.value); // 收集节点值
            
            if (cur.left != null)
                nodes.Push(cur.left);
            if (cur.right != null)
                nodes.Push(cur.right);
           
        }
    }
    return result;
}
```

### 后序遍历  左 - 右 -头

将上述的头  - 右 - 左进行再次的入栈即可

```C#
public List<int> oldsort(Node head)
{
    List<int> result = new List<int>();
    Stack<Node> nodes = new Stack<Node>();
    Stack<Node> res = new Stack<Node>();
    if (head != null)
    {
        nodes.Push(head);
        while(nodes.Count > 0)
        {
            Node cur = nodes.Pop();//出栈后在入栈
            res.Push(cur);
            if (cur.left != null)
                nodes.Push(cur.left);
            if (cur.right != null)
                nodes.Push(cur.right);
           
        }
    }
    while(res.Count > 0)
        result.Add(res.Pop());
    return result;
}
```

### 中序遍历 左 - 头 - 右

```C#
public List<int> InSort(Node head){
    List<int> res = new List<int>
	Stack<Node> s = new Stack<Node>();
    if(head!=null){
        while(s.Count>0||head!=null){
			if(head!=null){
                s.Push(head);
                head = head.left;
            }
            else{
                head = s.Pop();
                res.Add(head.val);
                head = head.rigth;
            }
        }
    }
    return r
}
```

# 层级遍历

层级遍历，也称为广度优先遍历（BFS），是一种按层次访问树或图中所有节点的遍历方法。它从根节点开始，逐层向下访问，同一层的节点从左到右依次访问。

```C#
public List<int> LayerSort(Node head)
{
    List<int> res = new List<int>();
    if (head == null) return res; 
    
    Queue<Node> Q = new Queue<Node>();
    Q.Enqueue(head);
    
    while (Q.Count > 0)
    {
        Node cur = Q.Dequeue();  
        res.Add(cur.e);
        
        if (cur.Left != null)
            Q.Enqueue(cur.Left);
        if (cur.Right != null)
            Q.Enqueue(cur.Right);
    }
    
    return res;
}
```

```c#
public class Solution {
    public IList<IList<int>> LevelOrder(TreeNode root) {
        var r = new List<IList<int>>();
        if(root == null)
            return r ;
        Queue<TreeNode> Q = new Queue<TreeNode>();
        Q.Enqueue(root);
        while(Q.Count > 0){
            List<int> res = new List<int>();
            int length = Q.Count;

            for(int i = 0 ; i < length;i++){
                TreeNode cur = Q.Dequeue();
                res.Add(cur.val);
                if(cur.left != null)
                    Q.Enqueue(cur.left);
                if(cur.right != null)
                    Q.Enqueue(cur.right);
            }
            r.Add(res);
        }
        return r;
    }
}      
```

# 序列化2叉树（队列结构）

### 先序序列化和反序列化2叉树

对于二叉树：

```
    1
   / \
  2   3
     / \
    4   5
```

序列化结果为：`"1,2,#,#,3,4,#,#,5,#,#"`

反序列化过程会重建原始二叉树结构。

```C#
    public Queue<string> Serialize(TreeNode head)
    {
        Queue<string> ans = new Queue<string>();
        pres(head, ans);
        return ans;
    }
    public void pres(TreeNode head,Queue<string> ans)
    {
        if (head == null){
            ans.Enqueue("#");
			return;
        }
            
        else
        {
            ans.Enqueue(head.val.ToString());
            pres(head.left, ans);
            pres(head.right, ans);
        }
    }

    public TreeNode DeSerialize(Queue<string> a ns)
    {
        if (ans == null || ans.Count > 0)
            return null;
        return preb(ans);
    }
    public TreeNode preb(Queue<string> ans)
    {
        string value= ans.Dequeue();
        if (value == null)
            return null;

        TreeNode head = new TreeNode(int.Parse(value));
        head.left = preb(ans);
        head.right = preb(ans);
        return head;
    }
```

### 层级遍历序列化和反序列化

使用2个队列（结果队列，操作队列）进行操作，如果当前节点的孩子节点不为null，则将孩子节点进行序列化以及放入遍历队列和操作队列，如果为空，则放入结果队列进行序列化。

```C#
    public  Queue<string> Seri (TreeNode head)
    {
        Queue<string > ans = new Queue<string>();
        if (head == null)
            return ans;
        else
        {
            Queue<TreeNode> treeNodes = new Queue<TreeNode>();
            ans.Enqueue(head.val.ToString());
            treeNodes.Enqueue(head);
            while (treeNodes.Count > 0)
            {
                TreeNode cur = treeNodes.Dequeue();
                if (cur.left != null)
                {
                    ans.Enqueue(cur.left.val.ToString());
                    treeNodes.Enqueue(cur.left);
                }
                else
                    ans.Enqueue(null);
                if (cur.right != null)
                {
                    ans.Enqueue(head.right.val.ToString());
                    treeNodes.Enqueue(cur.right);
                }
                else
                    ans.Enqueue(null);
            }
        }
        return ans;
    } 
    public TreeNode Deri(Queue<string> ans)
    {
        if (ans.Count <= 0||ans ==null)
            return null;
        TreeNode head = generate(ans.Dequeue());
        Queue<TreeNode > treeNodes = new Queue<TreeNode>();
        if (head != null)
            treeNodes.Enqueue(head);

        TreeNode node = null;
        while (treeNodes.Count > 0)
        {
            node = treeNodes.Dequeue();
            node.left = generate(ans.Dequeue());
            node.right = generate(ans.Dequeue());
            if (node.left != null)
                treeNodes.Enqueue(node.left);

            if (node.right != null)
                treeNodes.Enqueue(node.right);
        }
        return head;

    } 
    public TreeNode generate(string val)
    {
        if (val == null)
            return null;
        return new TreeNode(int.Parse(val));
    }
```

# 序列化2叉树（数组结构）

### 先序遍历序列化2叉树

```C#
 public int[] Serialize(TreeNode head)
    {
        if(head == null)
            return new int[0];
     	List<int> res = new List<int>();
        pres(head, ans);
        return ans.ToArray;
    }
    public void pres(TreeNode head,List<int> ans)
    {
        if (head == null){
            ans.Add("#");
			return;
        }       
        else
        {
            ans.Add(head.val);
            pres(head.left, ans);
            pres(head.right, ans);
        }
    }
```

### 先序遍历反序列化2叉树 

```C#
int index = 0;
public TreeNode DeSerialize(int[] nums)
    {
       if (nums == null || nums.Length == 0)
        return preb(ans);
    }
    
public TreeNode preb(int[] nums)
{
    if (index >= nums.Length || nums[index] == null) {
          index++;
          return null;
    }
    TreeNode head =new TreeNode(nums[index]);
    index++;
    head.left = preb(nums);
    head.right = preb(nums);
    return head;
}
```

### 层级遍历序列化2叉树

```C#
public int[] Seri(TreeNode head){
    if(head == null)
		return new int[0];
    List<int> res = new List<int>();
    Queue<TreeNode> queue = new Queue<TreeNode>();
    queue.EnQueue(head);
    while(queue.Count > 0){
		TreeNode cur = new TreeNode();
        cur = queue.DeQueue();
        if(cur != null){       //if(cur.left !=null)    if(cur.right != null)
			res.Add(cur.val);
        	queue.EnQueue(cur.left);
            queue.EnQueue(cur.right);
        }
        else{
            res.Arr(null);
        }
    }
    while(res.Count > 0 && res[res.Count - 1] == null)  //每次遍历索引都会减一
        result.RemoveAt(result.Count - 1);
    return res.ToArray;
}
```

### 层级遍历反序列化2叉树

# 求2叉树最宽层的节点数

按照层级遍历的方法，设置2个变量，一个代表当前层的最后一个节点，一个代码下一层的最后一个节点，在当前层的情况下得到下一层的最后一个节点

```C#
public int R(TreeNode head){
    if(head == null)
        return 0;
    Queue<TreeNode> treeNodes = new Queue<TreeNode>();
    treeNodes.EnQueue(head);
    int max = 0;
    int curMax = 0;
    TreeNode curEnd = null;
    TreeNode NextEnd = null;
    while(treeNode.Count > 0){
        TreeNode cur = treeNodes.Dequeue();
        if(cur.left != null){
            NextEnd = cur.left; //找下一层的最后节点
            treeNodes.EnQueue(cur.left);
        }
        if(cur.right != null){
            NextEnd = cur.right;
            treeNodes.EnQueue(cur.rigth);
        }
        curMax++;
        if(cur == curEnd){
            max = Math.Max(max,curMax);
            curMax = 0;
            curEnd = NextEnd;
        }
        
    }
    return max;
      
}
```

# 判断一个树是否是完全2叉树

按照层级遍历的思想，一层一层遍历。 

```q
public bool isCBT(TreeNode head){
	if(head == null)
        return true;
    Queue<TreeNode> queue = new Queue<TreeNode>();
    queue.Enqueue(head);
    TreeNode L;
    TreeNode R;
    bool leaf = false;  //找到叶子几点的起始点
    while(queue.Count  > 0){
		TreeNode cur = queue.Dequeue();
    	L = cur.left;
        R = cur.rigth;
        if(lead&&(L!=null||R!=null) //叶子节点的左孩子和右孩子都为空，如果不为空则违法定义
			|| 
			(L==null && R!=null)//如果一个节点没有左子节点但有右子节点，
			)
            return false;
        if(L!=null)
            queue.Enqueue(L);
        if(R!=null)
            queue.Enqueue(R);
        if(L == null || R == null)//因为是按层级遍历开始的，从当前节点开始后面的所有节点都是叶子节点
            leaf = true;
        
    }
    return true; 
}
```

递归法

完全2叉树

- 左子树满，右子树满，左子树的高度 = 右子树的高度
- 左子树是完全2叉树，右子树满，左子树的高度 = 右子树的高度 + 1（多一层）
- 左子树满，右子树满，左子树的高度 = 右子树的高度 + 1（多一层）
- 左子树满，右子树是完全2叉树，左子树的高度 = 右子树的高度

```C#
public class Info{
	public int height;
    public bool isFull;  //是否是满2叉树
    public bool isCBT;  //是否是完全2叉树
    public Info(bool full,bool CBt,int h){
        height = h;
        isFull = full;
        isCBT = CBt;
    }
}
public bool M(TreeNode head){
	return process(head).isCBT;
}
public bool process(TreeNode head){
	if(head == null)
        return new Info(true,true,0);
    Info left = process(head.left);
    Info right = process(head.right);
    
    int height = Math.Max(left.height,right.height) + 1;
    bool IsFull = left.isFull && right.isFull && left.height == right.height;
    
    bool IsCBT = false;
    if(left.isFull && right.isFull && left.height == right.height)
        IsCBT = true;
    else if(left.isCBT && right.isFull && left.height == right.height + 1)
        IsCBT = true;
    else if(left.isFull && right.isFull && left.height == right.height + 1)
   		IsCBT = true;
    else if(left.isFull && right.isCBT && left.height == right.height)
    	IsCBT = true;
    
    return new Info(IsFull,IsCBT,height);
}
```

| 二叉树类型     | 定义特点                           | 示例                               |
| :------------- | :--------------------------------- | :--------------------------------- |
| **满二叉树**   | 每一层的节点数都达到最大值         | 所有叶子节点都在同一层             |
| **完全二叉树** | 除最后一层外是满的，最后一层左连续 | 最后一层可以不满，但必须从左开始填 |
| **普通二叉树** | 无特殊结构限制                     | 任意形式的树结构                   |

# 判定一个2叉树是否是平衡2叉树

平衡2叉树

|        特性        |              平衡二叉树              |     普通二叉搜索树     |
| :----------------: | :----------------------------------: | :--------------------: |
|    **平衡条件**    |     每个节点的左右子树高度差 ≤1      |         无限制         |
| **最坏时间复杂度** |               O(log n)               |   O(n)（退化成链表）   |
|    **适用场景**    | 需要高效动态操作（查找、插入、删除） | 数据基本静态或随机插入 |

使用递归进行

```C#
public class Info{
	public bool isBalance;
    public int height;
    public Info(bool IsB,int H)
    {
		isBalance = IsB;
        height = H;
    }
}
public bool IsB(TreeNode head){
    return process(head).isBalance;
}
public Info process(TreeNode head){
    if(head == null)
        return new Info(true,0);
    Info left = process(head.left);
    Info right = process(head.right);
    
    int height = (Math.Max(left.height,right.height) + 1);
    bool IsBalance = true;
    
    if(!left.isBalance)
        IsBalance = false;
     if(!right.isBalance)
        IsBalance = false;
    if(Math.Abs(left.height,right.height) > 1)
        IsBalance = false;
    return new Info(IsBalance,height);
}
```

# 判定一个2叉树是否是搜索2叉树

#### 搜索2叉树

1. **有序性（BST Property）**
   - 对于树中的 **任意节点**：
     - 其 **左子树** 上的所有节点的值 **小于** 该节点的值。
     - 其 **右子树** 上的所有节点的值 **大于** 该节点的值。
     - （如果允许重复值，可以定义为左子树 ≤ 当前节点 ≤ 右子树）
2. **递归定义**
   - 左子树和右子树也必须是 **BST**（即整个树的所有子树都满足BST

**使用中序遍历2叉树，如果一直上升则证明是；**

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
public bool IsS(TreeNode head){
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

# 求二叉树中两个节点之间的最大距离

- **基本情况（Base Case）**：

  - 如果 `head == null`，返回 `Info(0, 0)`（空树的高度和最大距离均为 0）。

- **递归计算左右子树的信息**：

  - `left = process(head.left)`
  - `right = process(head.right)`

- **计算当前树的高度**：

  - `height = max(left.height, right.height) + 1`

    （当前树的高度 = 左右子树的最大高度 + 1）

- **计算当前树的最大距离**：

  - `p1 = left.maxDistance`（左子树的最大距离）

  - `p2 = right.maxDistance`（右子树的最大距离）

  - `p3 = left.height + right.height + 1`（经过当前节点的最长路径）

  - `maxDistance = max(p1, p2, p3)`

    （当前树的最大距离 = 左/右子树的最大距离，或经过当前节点的路径）

- **返回当前树的 `Info`**：

  - `return new Info(maxDistance, height)`



最大距离有2种情况

- 经过head节点，如果经过head节点，最大值可能为2树的高度 + head节点
- 不经过head节点，也分2种情况
  - 完全在左子树上：依旧判断是否经过左子树的节点，找maxDistance
  - 完全在右子树上：依旧判断是否经过右子树的节点，找maxDistance

```C#
public class Info{
    public int maxDistance;
    public int height;
    public Info(int max,int H){
		maxDistance = max;
        height = H;
    }
}
public int R(TreeNode head){
    if(head == null)
        return 0;
    return process(head).maxDistance;
}
public Info process(TreeNode head){
    if(head == null)
        return new Info(0,0);
    
    Info left = process(head.left);
    Info right = process(head.right);
    int height = Math.Max(left.height,right.height) + 1;
    int p1 = left.maxDistance;
    int p2 = right.maxDistance;
    int p3 = left.height + right.height + 1;
    int maxDistance = Math.Max(Math.Max(p1,p2),p3);
    
    return new Info(maxDistance,height);
}
```

# 判断一个2叉树是否是满2叉树

1. **每个节点要么是叶子节点（无子节点），要么必须有两个子节点**
   - 不存在 **只有一个子节点** 的节点。
   - 即所有非叶子节点的度（子节点数）必须为 2。
2. **递归定义**
   - 如果树非空，则必须满足：
     - 左子树是满二叉树。
     - 右子树是满二叉树。

1. **节点数量与高度的关系**
   - 设树的高度为 `h`（从根到叶子的最长路径的边数），则：
     - 叶子节点数 = 2^*h*
     - 总节点数 = 2^(*h*+1)−1
   - 例如：高度 `h=2`的满二叉树，叶子数 = 4，总节点数 = 7。
2. **严格平衡**
   - 所有叶子节点都在同一层（最后一层）。
   - 是 **完全二叉树（Complete Binary Tree）** 的特例（完全二叉树不一定是满二叉树）。

```C#
public class Info{
    public int nodes;
    public int height;
   	public Info (int n,int h){
		nodes = n;
        heigth = h;
    }
}
public bool Is(TreeNode head){
    if(head == null)
        return true;
    Info all = process(head);
    return (1<<all.heigth) -1 ==all.nodes; 
}
public Info process(TreeNode head){
	if(head == null)
        return new Info(0,0);
    Info left = process(head.left);
    Info right = process(head.right);
    int height = Math.Max(left.height,right.height) + 1;
    int nodes = left.nodes + right.nodes + 1;
    return new Info(nodes,height);
}
```



```C#
public class Info{
    public int max;
    public int min;
    public int allS;
   	public bool maxBstSubtreeSize;
    public Info(int M,int m,int allS,int maxBstSubtreeSize){
        max =M;
        min = m;
        allS = allS;
        this.maxBstSubtreeSize = maxBstSubtreeSize;
    }
}
public bool IsS(TreeNode head){
    if(head == null)
        return true;
    return process(head).isSelect;
}
public Info process(TreeNode head){
	if(head == null)
		return null;
    
    Info left = process(head.left);
    Info right = process(head.right);
    
    int maxBstSubtreeSize;
    int max = head.val;
    int min = head.val;
    int allsize = 1;
    
    if(left!=null){
		max = Math.Max(max,left.max);
        min = Math.min(min,left.min);
        allsize += left.allS 
    }
     if(right!=null){
		max = Math.Max(max,right.max);
        min = Math.min(min,right.min);
        allsize += right.allS 
    }
   int p1 = -1;
   if(left!= null)
       p1 = left.maxBstSubtreeSize
       
   int p2 = -1;
   if(right!= null)
       p1 = right.maxBstSubtreeSize
    return new Info(max,min,allsize,maxBstSubtreeSize);
}
                                  
```

# 给定一个2叉树的头节点head，和另外2个节点a，b。返回a，b的最低公共祖先

|                情况                 |                条件                |            处理方式             |
| :---------------------------------: | :--------------------------------: | :-----------------------------: |
|         **1. 当前节点为空**         |           `head == null`           | 返回 `Info(false, false, null)` |
|      **2. 递归左子树和右子树**      |                 -                  | 获取 `left`和 `right`的 `Info`  |
| **3. 判断当前节点是否是 `a`或 `b`** |     `head == a`或 `head == b`      |     更新 `findA`或 `findB`      |
|       **4. 判断是否找到 LCA**       |         `left.ans != null`         |         返回 `left.ans`         |
|                                     |        `right.ans != null`         |        返回 `right.ans`         |
|                                     | `findA && findB`（当前节点是 LCA） |           返回 `head`           |
|      **5. 返回当前节点的信息**      |                 -                  | 返回 `Info(findA, findB, ans)`  |

```C#
public class Info{
	public bool findA;
    public bool findB;
    public TreeNode ans;
    public Info(bool fA,bool fB.TreeNode an){
        findA = fA;
        findB = fB;
        ans = an;
    }
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
    return new Info(findA,finB,ans);
}
```

# 公司员工派对的最大快乐值问题

公司举办派对，邀请员工参加。每个员工都有一个快乐值 `val`，并且每个员工可能有多个直接下属（即多叉树结构）。派对的规则是：

1. **如果某个员工参加派对，那么他的所有直接下属都不能参加。**
2. **如果某个员工不参加派对，那么他的直接下属可以选择参加或不参加。**
3. **目标是让整个派对的快乐值总和最大。**



- **树形DP（动态规划）**：由于员工关系是多叉树结构，我们需要递归处理每个员工及其下属。
- **两种状态**：
  - **当前员工参加（`yes`）**：则所有直接下属都不能参加，快乐值 = `当前员工.val + 所有下属不参加的总和`。
  - **当前员工不参加（`no`）**：则每个下属可以自由选择参加或不参加，快乐值 = `所有下属的 max(参加, 不参加) 的总和`

#### **递归逻辑**

1. **基本情况（Base Case）**：
   - 如果当前员工 `head`是 `null`（即没有员工），返回 `Info(0, 0)`（不参加和参加的值都是 0）。
2. **递归处理所有下属**：
   - 遍历每个下属，递归计算其 `Info`（即下属参加或不参加的最大快乐值）。
3. **计算当前员工的 `yes`和 `no`**：
   - **`yes`（当前员工参加）**：
     - 快乐值 = `head.val + 所有下属的`no`（因为下属不能参加）。
   - **`no`（当前员工不参加）**：
     - 快乐值 = `所有下属的 max(yes, no)`之和（因为下属可以自由选择）。
4. **返回当前员工的 `Info`**：
   - 最终返回 `Info(no, yes)`，表示当前员工不参加或参加时的最大快乐值。

```C#
public class Employee {
    public int val;          // 当前员工的快乐值
    public List<Employee> nexts = new List<Employee>();  // 直接下属列表
    public Employee() { }
}

public class Info {
    public int no;           // 当前员工不参加时的最大快乐值
    public int yes;          // 当前员工参加时的最大快乐值
    public Info(int n, int y) {
        no = n;
        yes = y;
    }
}
public int maxHappy(Employee head){
	Info all = process(head);
    return Math.Max(all.no,all.yes);
}

public Info process(Employee head){
	if(head == null)
        return new Info(0,0);
    int yes = head.val;
    int no = 0;
    foreach(var next in head.nexts){
		Info nextInfo = process(next);
        no += Math.Max(nextInfo.yes,nextInfo.no);
        yes += nextInfo.no;
    }
    return new Info(no,yes);
}
```


