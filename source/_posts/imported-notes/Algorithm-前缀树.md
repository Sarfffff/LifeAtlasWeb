---
title: 前缀树
date: 2026-06-27 03:19:00
categories:
  - 算法与数据结构
tags:
  - Algorithm
  - 笔记
---
# 前缀树

前缀树（Trie，发音类似 "try"）是一种**树形数据结构**，用于高效存储和检索字符串集合。它的核心特点是**共享公共前缀**，适用于**自动补全、拼写检查、IP路由**等场景。

------

## **1. 前缀树的特点**

- **节点结构**：每个节点存储一个字符，从根节点到某个节点的路径构成一个字符串。
- **共享前缀**：不同单词的相同前缀会共享同一条路径，节省空间。
- **快速查找**：查找时间复杂度为 **O(L)**（L 是单词长度），比哈希表更适合前缀匹配。

```C#
public class Node1
{
    public int pass;
    public int end;
    public Node1[] Next;//存储它的所有下一个节点
    public Node1()
    {
        pass = 0;
        end = 0;
        Next = new Node1[26];
    }
}

public class  Trie
{
    public Node1 root;
    public Trie()
    {
        root = new Node1();
    }
    public void Insert(string word)
    {
        if (word == null)
            return;

        char[] str = word.ToCharArray();
        Node1 node = root;
        node.pass++;

        int path = 0;
        for(int i = 0;i< str.Length;i++) {  //从左往右遍历字符串
            path = str[i] - 'a';    //下标为该字符的AscII码-a的Ascii码
            if (node.Next[path] == null)   
            {
                node.Next[path] = new Node1();
            }
            node = node.Next[path];//node就不指向头了，往下移动，直到为null
            node.pass++;
        }
        node.end++;
    }
    public int Search(string word)//word这个字符串之前出现过多少次
    {
        if (word == null)
            return 0;
        char [] str = word.ToCharArray();
        Node1 node = root;
        int index;
        for(int i = 0; i< str.Length;i++)
        {
            index = str[i] - 'a';
            if(node.Next[index] == null)//没有有这个单词的首字符为开始的前缀树
            {
                return 0;
            }
            node = node.Next[index];
        }
        return node.end;
            
    }
    public int prefixNumber(string word)//在所有加入的字符串中，有几个是以pre这个字符串为前缀的{
    {
        if (word == null) return 0;
        char[] str = word.ToCharArray();
        Node1 node = root;
        int index;
        for (int i = 0; i < str.Length; i++)
        {
            index = str[i] - 'a';
            if (node.Next[index] == null)
                return 0;

            node = node.Next[index];
        }
            
        return node.pass;
    }
    public void Delete(string word)
    {
        if (Search(word) != 0)
        {
            char[] str = word.ToCharArray();
            Node1 node = root;
            node.pass--;
            int path = 0;
            for (int i = 0;i< str.Length; i++)
            {
                path = str[i] - 'a';
                if (--node.Next[path].pass == 0)//如果某个节点的end减完等于=，删除这个节点
                {
                    node.Next[path] = null;
                }
                node = node.Next[path];
            }
            node.end--;

        }
    }
    public bool Contains(string word)
    {
        return Search(word) > 0;
    }

}
```

```C#
public class Trie {
    int pass;
    int end;
    Trie[] Next;

    public Trie() {
        pass = 0;
        end = 0;
        Next = new Trie[26];
    }
    
    public void Insert(string word) {
        if (word == null)
            return;

        char[] str = word.ToCharArray();
        Trie node = this;
        int path = 0;
        node.pass++;
        for (int i = 0; i < str.Length; i++)
        {
            path = str[i] - 'a';
            if (node.Next[path] == null)
            {
                node.Next[path] = new Trie();
            }
            node = node.Next[path];
            node.pass++;
        }
        node.end++;
    }
    
    public bool Search(string word) {
        if (word == null)
            return false;

        char[] str = word.ToCharArray();
        Trie node = this;
        int path = 0;
        for (int i = 0; i < str.Length; i++)
        {
            path = str[i] - 'a';
            if (node.Next[path] == null)
            {
                return false;
            }
            node = node.Next[path];
        }
        return node.end > 0;
    }
    
    public bool StartsWith(string prefix) {
         if (prefix == null)
            return false;

        char[] str = prefix.ToCharArray();
        Trie node = this;
        int path = 0;
        for (int i = 0; i < str.Length; i++)
        {
            path = str[i] - 'a';
            if (node.Next[path] == null)
            {
                return false;
            }
            node = node.Next[path];
        }
        return node.pass > 0;
    }
}

```

# 不基于比较的排序

#### 计数排序（Counting Sort）

- **核心思想**：通过统计每个元素在序列中出现的次数，然后根据次数直接计算元素的最终位置。
- 适用场景：
  - 元素为非负整数（或可映射为非负整数）；
  - 元素的取值范围（最大值与最小值的差值）较小（通常远小于序列长度 n）。
- 步骤：
  1. 确定序列中元素的取值范围（找到最小值 min 和最大值 max）；
  2. 创建一个计数数组（长度为 max - min + 1），统计每个元素出现的次数；
  3. 对计数数组进行 “前缀和” 处理，得到每个元素在结果数组中的起始位置；
  4. 反向遍历原始序列，根据计数数组的前缀和将元素放入结果数组的对应位置，并更新计数。
- **示例**：对序列 [2, 1, 3, 1, 2] 排序，取值范围为 1-3，计数数组为 [2, 2, 1]（1 出现 2 次，2 出现 2 次，3 出现 1 次），前缀和后确定位置，最终得到 [1, 1, 2, 2, 3]。
- **时间复杂度**：O (n + k)，其中 n 是序列长度，k 是元素的取值范围（max - min + 1）；空间复杂度 O (n + k)。

#### 2. 基数排序（Radix Sort）

- **核心思想**：按照元素的 “基数”（如数字的个位、十位、百位，或字符串的字符）逐层排序，从最低位到最高位（或相反），每一层使用稳定的排序算法（通常是计数排序）。
- 适用场景：
  - 元素可以按 “基数” 分解（如整数、字符串）；
  - 基数的范围较小（如数字的基数为 10，字符的基数为 256）。
- 步骤：
  1. 确定序列中最大元素的位数（如最大数是 123，则位数为 3）；
  2. 从最低位（个位）到最高位（百位），对每一位进行稳定排序（如计数排序）；
  3. 每完成一位排序，序列会按该位有序，最终所有位排序完成后，序列整体有序。
- **示例**：对 [170, 45, 75, 90, 802, 24, 2, 66] 排序，按个位→十位→百位的顺序，每次用计数排序处理当前位，最终得到 [2, 24, 45, 66, 75, 90, 170, 802]。
- **时间复杂度**：O (d*(n + k))，其中 d 是最大元素的位数，n 是序列长度，k 是基数范围（如 10）；空间复杂度 O (n + k)。

#### 3. 桶排序（Bucket Sort）

- **核心思想**：将序列分散到若干个 “桶” 中（每个桶对应一个数值范围），对每个桶内的元素单独排序（可使用其他排序算法，如插入排序），最后将所有桶的元素按顺序合并。
- 适用场景：
  - 元素的分布比较均匀（避免某一桶内元素过多）；
  - 可以预先确定合理的桶范围。
- 步骤：
  1. 根据元素的取值范围和分布，创建若干个空桶（如元素在 0-100 之间，可创建 10 个桶，每个桶对应 10 个数值）；
  2. 将每个元素放入对应的桶中；
  3. 对每个非空桶内的元素进行排序；
  4. 按桶的顺序依次将元素取出，合并为有序序列。
- **示例**：对 [49, 38, 65, 97, 76, 13, 27, 49] 排序，创建 5 个桶（0-19、20-39、40-59、60-79、80-99），元素分桶后，每个桶内排序，再合并得到 [13, 27, 38, 49, 49, 65, 76, 97]。
- **时间复杂度**：平均 O (n + k)，最坏 O (n²)（若所有元素落入同一桶，且桶内用 O (n²) 算法）；空间复杂度 O (n + k)，其中 k 是桶的数量。

### 不基于比较的排序 vs 基于比较的排序

| 特性           | 不基于比较的排序（如计数、基数、桶排序） | 基于比较的排序（如快排、归并、堆排序） |
| -------------- | ---------------------------------------- | -------------------------------------- |
| 核心逻辑       | 利用元素特性直接计算位置                 | 通过比较元素大小确定位置               |
| 时间复杂度上限 | 可达到线性 O (n)（特定场景）             | 最低 O (n log n)（基于比较的排序下限） |
| 适用范围       | 依赖元素特性（如数值范围、分布）         | 适用于任何可比较的元素类型             |
| 空间复杂度     | 通常较高（需额外空间存储计数 / 桶等）    | 可优化至 O (1)（如堆排序）             |

# 排序稳定性

###  **稳定排序 vs 不稳定排序**

|   **特性**   |                   **稳定排序**                   |                  **不稳定排序**                  |
| :----------: | :----------------------------------------------: | :----------------------------------------------: |
|   **定义**   |       相等元素的原始顺序在排序后保持不变。       |          相等元素的原始顺序可能被打乱。          |
| **典型算法** | 归并排序、冒泡排序、插入排序、计数排序、基数排序 | 快速排序、堆排序、选择排序（一般实现）、希尔排序 |
| **应用场景** |     需要保留原始顺序的场景（如多条件排序）。     |       仅需最终有序，不关心相等元素的顺序。       |

#### **场景示例**

假设有一个学生数据表，先按**班级**排序，再按**成绩**排序：

- **稳定排序**：
  第二次按成绩排序后，同成绩的学生仍保持之前的班级顺序。
- **不稳定排序**：
  同成绩的学生可能班级顺序混乱，破坏第一次排序的规则。

#### **典型需求**

- 数据库的多列排序（如 `ORDER BY grade, class`）。
- 图形渲染中的层级叠加（按Z轴排序后保留绘制顺序）。

# 排序总结