---
title: 数据结构
date: 2026-06-27 03:31:00
categories:
  - 编程语言
tags:
  - C#
  - 笔记
---
# 动态数组

- **装箱**：装箱是指将值类型转换为引用类型的过程。值类型（如 `int`、`char`、`struct` 等）通常存储在栈上，而引用类型存储在堆上。当进行装箱操作时，会在堆上为值类型创建一个对象实例，并将值类型的值复制到该对象中，最后返回这个对象的引用。
- **拆箱**：拆箱则是将引用类型转换为值类型的过程。它需要先检查引用类型是否为某个特定值类型的装箱实例，然后将堆上对象中存储的值复制到栈上的新值类型变量中。

- **装箱开销**：装箱操作会在堆上分配内存，并且需要复制值类型的值，这会带来一定的性能开销，尤其是在频繁进行装箱操作时，会导致内存分配和垃圾回收的压力增加。
- **拆箱开销**：拆箱操作需要进行类型检查，确保引用类型确实是某个值类型的装箱实例，这也会带来一定的性能开销。

动态数组指的是是大小能在程序运行期间动态调整的数组，可根据实际需求增添或删减元素。与固定大小的数组不同，动态数组能够灵活应对元素数量的变化，从而更高效地管理内存。以下通过自定义的类实现动态数组，使用泛型类，来进行动态数组的实现，这样可以根据数组的类型，实现相应的功能，同时实现IEnumerable接口，可以被foreach循环遍历。提高更高效的数组实现功能

```c#
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

namespace CSharp_project //动态数组
{
    class Array1<T> : IEnumerable<T>
    {
        private T[] data;
        private int N;

        public Array1()
        {
            data = new T[10]; //默认大小为10
            N = 0;
        }

        public Array1(int capacity)
        {
            data = new T[capacity];  //数组大小为capacity     
            N = 0;
        }

        public int Capacity
        {
            get { return data.Length; }  //返回数组的容量
        }

        public int Count
        {
            get { return N; }         //访问动态数组实际存储元素的多少
        }

        // 检查索引是否合法
        private void CheckIndex(int index)
        {
            if (index < 0 || index >= N)
            {
                throw new ArgumentOutOfRangeException("数组索引越界");
            }
        }

        // 数组扩容或缩容
        private void Resize(int newCapacity)
        {
            T[] newData = new T[newCapacity];
            Array.Copy(data, newData, N);
            data = newData;
        }

        public void Add(int index, T e)
        {
            if (index < 0 || index > N)
            {
                throw new ArgumentOutOfRangeException("数组索引越界");
            }
            if (N == data.Length)
            {
                Resize(2 * data.Length);
            }
            if (e == null && typeof(T).IsClass)
            {
                throw new ArgumentNullException(nameof(e));
            }
            for (int i = N - 1; i >= index; i--)
            {
                data[i + 1] = data[i];
            }
            data[index] = e;
            N++;
        }

        public void AddLast(T e)
        {
            Add(N, e);
        }

        public void AddHead(T e)
        {
            Add(0, e);
        }

        public T Get(int index)
        {
            CheckIndex(index);
            return data[index];
        }

        public T GetHead()
        {
            return Get(0);
        }

        public T GetLast()
        {
            return Get(N - 1);
        }

        public bool IsContains(T e)
        {
            for (int i = 0; i < N; i++)
            {
                if (EqualityComparer<T>.Default.Equals(data[i], e))
                    return true;
            }
            return false;
        }

        public int IndexOf(T e)
        {
            for (int i = 0; i < N; i++)
            {
                if (EqualityComparer<T>.Default.Equals(data[i], e))
                    return i;
            }
            return -1;
        }

        public void DeleteAt(int index)
        {
            CheckIndex(index);
            for (int i = index; i < N - 1; i++)
            {
                data[i] = data[i + 1];
            }
            N--;
            data[N] = default(T);

            if (N == data.Length / 4 && data.Length / 2 > 0)
            {
                Resize(data.Length / 2);
            }
        }

        public void DeleteHead()
        {
            DeleteAt(0);
        }

        public void DeleteLast()
        {
            DeleteAt(N - 1);
        }

        public void DeleteElement(T e)
        {
            int index = IndexOf(e);
            if (index != -1)
            {
                DeleteAt(index);
            }
        }

        public void Set(int index, T newvalue)
        {
            CheckIndex(index);
            if (newvalue == null && typeof(T).IsClass)
            {
                throw new ArgumentNullException(nameof(newvalue));
            }
            data[index] = newvalue;
        }

        public void Clear()  //清楚数组
        {
            for (int i = 0; i < N; i++)
            {
                data[i] = default(T);
            }
            N = 0;
        }

        public void InsertRange(int index, IEnumerable<T> items)  //在某个位置插入多个数据
        {
            if (index < 0 || index > N)
            {
                throw new ArgumentOutOfRangeException("数组索引越界");
            }
            if (items == null)
            {
                throw new ArgumentNullException(nameof(items));
            }
            int countToAdd = 0;
            foreach (var item in items)
            {
                countToAdd++;
            }
            if (N + countToAdd > data.Length)
            {
                Resize(Math.Max(data.Length * 2, N + countToAdd));
            }
            for (int i = N - 1; i >= index; i--)
            {
                data[i + countToAdd] = data[i];
            }
            int j = 0;
            foreach (var item in items)
            {
                data[index + j] = item;
                j++;
            }
            N += countToAdd;
        }

        public IEnumerator<T> GetEnumerator()
        {
            for (int i = 0; i < N; i++)
            {
                yield return data[i];
            }
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public override string ToString()
        {
            StringBuilder res = new StringBuilder();
            res.Append(string.Format("Array1:  count ={0} capacity{1} \n", N, data.Length));
            res.Append("[");
            for (int i = 0; i < N; i++)
            {
                res.Append(data[i]);
                if (i != N - 1)
                {
                    res.Append(", ");
                }
            }
            res.Append("]");
            return res.ToString();
        }
    }
}
```

# 链表

假设我们有一个简单的链表，存储的是整数类型的数据，当前链表包含三个节点，分别存储 `1`、`2`、`3`，初始状态下 `head` 指向存储 `1` 的节点。现在要插入一个新节点，其数据为 `0`，执行 `head = new Node(0, head);` 后的变化如下：

**初始状态**

```plaintext
head ---> [1] ---> [2] ---> [3] ---> null
```

**执行 `new Node(0, head)*`**

- 首先创建一个新节点，数据为 `0`，其 `next` 指针指向原来的头节点（存储 `1` 的节点）。此时新节点的状态为：

```plaintext
[0] ---> [1] ---> [2] ---> [3] ---> null
```

**执行 `head = new Node(0, head)`**

- 把 `head` 指向新创建的节点，更新后的链表状态为：

```plaintext
head ---> [0] ---> [1] ---> [2] ---> [3] ---> null
```

```C#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSharp_project
{
    class LinkList1<T>
    {
        private class Node
        {
            public T e;
            public Node next;

            public Node(T e, Node next)
            {
                this.e = e;
                this.next = next;
            }

            public Node(T e) //表示该节点是链表的末尾节点。
            {
                this.e = e;
                this.next = null;
            }

            public override string ToString()
            {
                return e.ToString();
            }
        }

        private Node head;  //链表的头部
        private int N;  //链表的节点数

        public LinkList1()
        {
            head = null;
            N = 0;
        }

        public int Count
        {
            get { return N; }
        }

        public bool IsEmpty
        {
            get { return N == 0; }
        }

        private void CheckIndex(int index)
        {
            if (index < 0 || index > N)
            {
                // 提供更详细的异常信息，便于定位问题
                throw new ArgumentOutOfRangeException($"索引越界，当前索引: {index}，链表节点数: {N}");
            }
        }

        public void Add(int index, T e)
        {
            CheckIndex(index);
            if (index == 0)
            {
                Node node = new Node(e);  //将新节点作为头节点
                node.next = head;
                head = node;
            }
            else
            {
                Node pre = head;
                for (int i = 0; i < index - 1; i++)
                    pre = pre.next;

                Node node = new Node(e);
                node.next = pre.next;
                pre.next = node;
            }
            N++;
        }

        public void AddHead(T e)
        {
            Add(0, e);
        }

        public void AddLast(T e)
        {
            Add(N, e);
        }

        public T Get(int index)
        {
            CheckIndex(index);
            Node n = head;
            for (int i = 0; i < index; i++)
            {
                n = n.next;
            }
            return n.e;
        }

        public T GetHead()
        {
            return Get(0);
        }

        public T GetLast()
        {
            return Get(N - 1);
        }

        public void Set(int index, T newe)
        {
            CheckIndex(index);
            Node n = head;
            for (int i = 0; i < index; i++)
                n = n.next;
            n.e = newe;
        }

        public bool IsContains(T e)
        {
            Node n = head;
            for (int i = 0; i < N; i++)
            {
                if (n.e.Equals(e))
                    return true;

                n = n.next;
            }
            return false;
        }

        public void DeleteAt(int index)
        {
            CheckIndex(index);
            if (index == 0)
            {
                head = head.next;
                
            }
            else
            {
                Node pre = head;
                for (int i = 0; i < index - 1; i++)
                {
                    pre = pre.next;
                }
                pre.next = pre.next.next;
                
            }
            N--;
        }

        public void DeleteHead()
        {
            DeleteAt(0);
        }

        public void DeleteLast()
        {
            DeleteAt(N - 1);
        }

         

        public override string ToString()
        {
            StringBuilder res = new StringBuilder();
            Node cur = head;
            while (cur != null)
            {
                res.Append(cur + "->");
                cur = cur.next;
            }
            res.Append("Null");
            return res.ToString();
        }
    }
}
```

# 双向循环链表

双向循环链表是基于单线的链表的前提的下，对每个节点都添加一个指向前一个节点的指针，包括头节点和尾节点，在逻辑上构成首位相连。对于每一个节点都有一个指向后一个节点和指向前一个节点的指针，以及存储的元素。

```C#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSharp_project
{
    class DoublyLinkedList1<T>
    {
        class Node {
            public T e;
            public Node next;
            public Node pre;
            public Node(T e)
            {
                this.e = e;
                this.next = null;
                this.pre = null;
            }
            public Node(T e,Node next,Node pre)
            {
                this.next = next;
                this.pre = pre;
                this.e = e;
            }
        

        }
        private Node prev;  //链表的头部
        private int N;  //长度
        private Node end;  //链表的尾部
        public DoublyLinkedList1()
        {
            prev = null;
            end = null;
            N = 0;
        }
        public int Count {
            get
            {
                return N;
            }
        }
        public bool IsEmpty
        {
             get { return N == 0; }
        }
        private void CheckIndex(int index)
        {
            if (index < 0 || index > N)
            {
                // 提供更详细的异常信息，便于定位问题
                throw new ArgumentOutOfRangeException($"索引越界，当前索引: {index}，链表节点数: {N}");
            }
        }
        public void Add(int index,T e)
        {
            CheckIndex(index);
            Node newnode = new Node(e);
            if (IsEmpty)
            {
                prev = newnode;
                end = newnode;
            }
            else if (index == 0)
            {

                newnode.next = prev;
                prev.pre = newnode;
                prev = newnode;
            }
            else if (index == N) {

                newnode.pre = end;
                end.next = newnode;
                end = newnode;

            }
            else
            {
                Node node = prev;
                for (int i = 0; i < index; i++)  //找到的添加的位置的下一个节点
                    node = node.next;
                newnode.next = node;
                newnode.pre = node.pre;

                node.pre.next = newnode;
                node.pre = newnode;

                //for(int i = 0;i < index - 1; i++)
                //{
                //    node = node.next;
                //}
                //node.next.pre = newnode;
                //newnode.next = node.next;

                //node.next = newnode;
                //newnode.pre = node;

            }
        }
        public void AddHead(T e)
        {
            Add(0, e);
        }

        public void AddLast(T e)
        {
            Add(N, e);
        }

        public T Get(int index)
        {
            CheckIndex(index);
            Node n = prev;
            for (int i = 0; i < index; i++)
            {
                n = n.next;
            }
            return n.e;
        }
        public T GetHead()
        {
            if (IsEmpty)
            {
                throw new InvalidOperationException("链表为空，无法获取头节点。");
            }
            return Get(0);
        }

        public T GetLast()
        {
            if (IsEmpty)
            {
                throw new InvalidOperationException("链表为空，无法获取尾节点。");
            }
            return Get(N - 1);
        }

        public void Set(int index, T newe)
        {
            CheckIndex(index);
            Node n = prev;
            for (int i = 0; i < index; i++)
                n = n.next;
            n.e = newe;
        }
        public bool IsContains(T e)
        {
            Node n = prev;
            for (int i = 0; i < N; i++)
            {
                if (n.e.Equals(e))
                    return true;

                n = n.next;
            }
            return false;
        }
        public void DeleteAt(int index)
        {
            CheckIndex(index);
            if (IsEmpty)
            {
                return;
            }
            if (index == 0)
            {
                if (prev.next != null)
                {
                    prev.next.pre = null;
                }
                else
                {
                    end = null;
                }
                prev = prev.next;
            }
            else if (index == N - 1)
            {
                if (end.pre != null)
                {
                    end.pre.next = null;
                }
                else
                {
                    prev = null;
                }
                end = end.pre;
            }
            else
            {
                Node node = prev;
                for (int i = 0; i < index; i++)
                {
                    node = node.next;
                }
                node.pre.next = node.next;
                node.next.pre = node.pre;
            }
            N--;
        }
        public void DeleteHead()
        {
            DeleteAt(0);
        }

        public void DeleteLast()
        {
            DeleteAt(N - 1);
        }

        public void DeleteElement(T e)
        {
            Node current = prev;
            while (current != null)
            {
                if (current.e.Equals(e))
                {
                    if (current.pre != null)
                    {
                        current.pre.next = current.next;
                    }
                    else
                    {
                        // 如果删除的是头节点
                        prev = current.next;
                    }

                    if (current.next != null)
                    {
                        current.next.pre = current.pre;
                    }
                    else
                    {
                        // 如果删除的是尾节点
                        end = current.pre;
                    }

                    N--;
                    // 处理删除节点后指针的移动
                    current = current.next;
                }
                else
                {
                    current = current.next;
                }
            }
        }
        public override string ToString()
        {
            StringBuilder res = new StringBuilder();
            if (IsEmpty)
            {
                res.Append("Null");
            }
            else
            {
                Node cur = prev;
                res.Append("Null <-> ");
                while (cur != null)
                {
                    res.Append(cur.e);
                    if (cur.next != null)
                    {
                        res.Append(" <-> ");
                    }
                    cur = cur.next;
                }
                res.Append(" <-> Null");
            }
            return res.ToString();
        }
    }
}

```

# 时间复杂度

