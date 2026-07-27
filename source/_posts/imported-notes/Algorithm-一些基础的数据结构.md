---
title: 一些基础的数据结构
date: 2026-06-27 03:15:00
categories:
  - 算法与数据结构
tags:
  - Algorithm
  - 笔记
---
#  动态数组

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

## 反转链表

**头指针（Head Pointer）**：

- 它是一个指针变量（如 `ListNode* head`或 `ListNode head`），存储的是链表的第一个节点（头节点）的地址（引用）。
- 如果链表为空，`head`应该是 `null`。

```C#
public static Node reverseLinkedList(Node head)// head -> A ->B ->C ->null
 {
     Node pre = null;
     Node next = null ;

     while (head != null)
     {
         next = head.next ;  //存储找到下一个节点，将头指针移过去
         head.next = pre;   //将头节点置为null ，后面的节点指向前一个节点
         pre = head;    //更新pre节点
         head=  next ;
     }
     return pre;
 }
```

## 把给定的值都删除

```C#
       public static Node DeleteNum(Node head, int num)
       {
           while (head != null)
           {
               if(head.e != num)
               {
                   break;
               }
               head = head.next ;
           }
           Node cur = head;
           Node pre = head;
           while (cur != null)
           {
               if(cur.e == num)
               {
                   pre.next = cur.next ;
               }
               else
               {
                   pre = cur ;
               }

               cur = cur.  next ;
           }

           return head;
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

## 双向反转链表

```C#
public static void reverseLinkedList(DNode head){
    DNode cur = head;
    DNode temp = null;
    //// 遍历链表，交换每个节点的 prev 和 next 指针
    while(cur!=null){
        //保存当前节点
		temp = cur.prev;
        
        // 交换 prev 和 next,前一个节点的后一个节点
        cur.prev = cur.next;
        cur.next = temp;
        
        cur = cur.prev // 移动到下一个节点
    }
    //// 更新头指针（temp 现在是原链表的最后一个节点）
    if(temp!=null)
        head = temp.prev;
    
    return head;
}
```

# 队列和栈

### 基础的队列结构

```C#
public class Queue<T>
{
    private T[] elements;      // 存储队列元素的数组
    private int front;        // 队首指针
    private int rear;         // 队尾指针
    private int capacity;     // 队列容量
    private int count;        // 当前元素数量

    public Queue(int size = 10)
    {
        capacity = size;
        elements = new T[capacity];
        front = 0;
        rear = -1;
        count = 0;
    }

    // 入队操作
    public void Enqueue(T item)
    {
        if (count == capacity)
        {
            Resize(capacity * 2);  // 队列满时扩容
        }
        
        rear = (rear + 1) % capacity;  // 循环队列处理
        elements[rear] = item;
        count++;
    }

    // 出队操作
    public T Dequeue()
    {
        if (IsEmpty())
        {
            throw new InvalidOperationException("Queue is empty");
        }
        
        T item = elements[front];
        front = (front + 1) % capacity;  // 循环队列处理
        count--;
        
        // 如果元素数量小于容量的1/4，缩小容量
        if (count > 0 && count == capacity / 4)
        {
            Resize(capacity / 2);
        }
        
        return item;
    }

    // 查看队首元素
    public T Peek()
    {
        if (IsEmpty())
        {
            throw new InvalidOperationException("Queue is empty");
        }
        return elements[front];
    }

    // 判断队列是否为空
    public bool IsEmpty()
    {
        return count == 0;
    }

    // 获取队列元素数量
    public int Count
    {
        get { return count; }
    }

    // 调整队列容量
    private void Resize(int newCapacity)
    {
        T[] newArray = new T[newCapacity];
        for (int i = 0; i < count; i++)
        {
            newArray[i] = elements[(front + i) % capacity];
        }
        elements = newArray;
        front = 0;
        rear = count - 1;
        capacity = newCapacity;
    }
}
```

### 基础的栈结构

```C#
using System;

public class Stack<T>
{
    private T[] elements;       // 存储栈元素的数组
    private int top;            // 栈顶指针
    private int capacity;       // 栈的容量

    public Stack(int size = 10)
    {
        capacity = size;
        elements = new T[capacity];
        top = -1;  // 栈空时top为-1
    }

    // 入栈操作
    public void Push(T item)
    {
        if (top == capacity - 1)
        {
            Resize(capacity * 2);  // 栈满时扩容
        }
        elements[++top] = item;
    }

    // 出栈操作
    public T Pop()
    {
        if (IsEmpty())
        {
            throw new InvalidOperationException("Stack is empty");
        }
        T item = elements[top--];
        
        // 如果栈大小小于容量的1/4，缩小容量
        if (top > 0 && top == capacity / 4)
        {
            Resize(capacity / 2);
        }
        
        return item;
    }

    // 查看栈顶元素
    public T Peek()
    {
        if (IsEmpty())
        {
            throw new InvalidOperationException("Stack is empty");
        }
        return elements[top];
    }

    // 判断栈是否为空
    public bool IsEmpty()
    {
        return top == -1;
    }

    // 获取栈中元素数量
    public int Count
    {
        get { return top + 1; }
    }

    // 调整栈容量
    private void Resize(int newCapacity)
    {
        T[] newArray = new T[newCapacity];
        for (int i = 0; i <= top; i++)
        {
            newArray[i] = elements[i];
        }
        elements = newArray;
        capacity = newCapacity;
    }
}
```



## 用双向链表实现栈和队列

**栈**

#### **双向链表实现栈（Stack）**

- **特点**：后进先出（LIFO）
- **核心操作**：
  - **`Push`（入栈）**：在链表头部插入新节点，并更新栈顶指针。
  - **`Pop`（出栈）**：移除链表头部节点，并返回其值，更新栈顶指针。
  - **`Peek`（查看栈顶）**：返回头部节点的值，不移除。
- **关键点**：
  - 只需维护一个 `head`指针（栈顶）。
  - 入栈和出栈都在头部操作，保证 O(1) 时间复杂度。

```C#
public class DoubleLinkedStack {
    private class DNode {
        public int data;
        public DNode prev;
        public DNode next;
        public DNode(int data) {
            this.data = data;
        }
    }

    private DNode head; // 栈顶
    private int size;

    // **入栈（Push）**
    public void Push(int value) {
        DNode newNode = new DNode(value);
        if (head == null) {
            head = newNode;
        } else {
            newNode.next = head;  // 新节点的next指向原栈顶
            head.prev = newNode;  // 原栈顶的prev指向新节点
            head = newNode;       // 更新栈顶指针
        }
        size++;
    }

    // **出栈（Pop）**
    public int Pop() {
        if (head == null) {
            throw new Exception("Stack is Empty");
        }
        int value = head.data;
        head = head.next; // 栈顶指针下移
        if (head != null) {
            head.prev = null; // 断开新栈顶的prev指针
        }
        size--;
        return value;
    }

    // **查看栈顶元素（Peek）**
    public int Peek() {
        if (head == null) {
            throw new Exception("Stack is empty");
        }
        return head.data;
    }

    // **判断栈是否为空**
    public bool IsEmpty() {
        return head == null;
    }

    // **返回栈的大小**
    public int Size() {
        return size;
    }
}
```

**队列**

####  **双向链表实现队列（Queue）**

- **特点**：先进先出（FIFO）
- **核心操作**：
  - **`EnQueue`（入队）**：在链表尾部插入新节点，更新尾指针。
  - **`DeQueue`（出队）**：移除链表头部节点，并返回其值，更新头指针。
  - **`Peek`（查看队头）**：返回头部节点的值，不移除。
- **关键点**：
  - 需要维护 `head`（队头）和 `tail`（队尾）两个指针。
  - 入队在尾部，出队在头部，保证 O(1) 时间复杂度。

```C#
public class DoubleLinkedQueue {
    private class DNode {
        public int data;
        public DNode prev;
        public DNode next;
        public DNode(int data) {
            this.data = data;
        }
    }

    private DNode front; // 队头（出队端）
    private DNode rear;  // 队尾（入队端）
    private int size;

    // **入队（在队尾添加元素）**
    public void EnQueue(int value) {
        DNode newNode = new DNode(value);
        if (rear == null) {
            // 队列为空，新节点既是队头也是队尾
            front = rear = newNode;
        } else {
            // 将新节点链接到队尾
            rear.next = newNode;
            newNode.prev = rear;
            rear = newNode; // 更新队尾指针
        }
        size++;
    }

    // **出队（从队头移除元素）**
    public int DeQueue() {
        if (front == null) {
            throw new Exception("Queue is Empty");
        }
        int value = front.data;
        front = front.next; // 队头指针后移
        if (front == null) {
            // 如果队列已空，队尾指针也要置空
            rear = null;
        } else {
            // 断开旧队头的连接
            front.prev = null;
        }
        size--;
        return value;
    }

    // **查看队头元素（不移除）**
    public int Peek() {
        if (front == null) {
            throw new Exception("Queue is empty");
        }
        return front.data;
    }

    // **判断队列是否为空**
    public bool IsEmpty() {
        return front == null;
    }

    // **返回队列大小**
    public int Size() {
        return size;
    }
}
```

 **双端队列**

#### **双向链表实现双端队列（Deque）**

- **特点**：两端均可插入和删除
- **核心操作**：
  - **`AddFront`（头部插入）**：在链表头部插入新节点，更新头指针。
  - **`AddRear`（尾部插入）**：在链表尾部插入新节点，更新尾指针。
  - **`RemoveFront`（头部删除）**：移除头部节点并返回其值，更新头指针。
  - **`RemoveRear`（尾部删除）**：移除尾部节点并返回其值，更新尾指针。
  - **`PeekFront`/`PeekRear`**：查看头部或尾部节点的值。
- **关键点**：
  - 需要维护 `head`和 `tail`指针。
  - 头部和尾部操作均需保证 O(1) 时间复杂度。

```C#
public class DoubleLinkedDeque {
    private class DNode {
        public int data;
        public DNode prev;
        public DNode next;
        public DNode(int data) {
            this.data = data;
        }
    }

    private DNode front; // 队头
    private DNode rear;  // 队尾
    private int size;

    // **从队尾入队**
    public void EnQueueRear(int value) {
        DNode newNode = new DNode(value);
        if (rear == null) {
            front = rear = newNode;
        } else {
            rear.next = newNode;
            newNode.prev = rear;
            rear = newNode; // 更新尾节点
        }
        size++;
    }

    // **从队头入队**
    public void EnQueueFront(int value) {
        DNode newNode = new DNode(value);
        if (front == null) {
            front = rear = newNode;
        } else {
            newNode.next = front;
            front.prev = newNode;
            front = newNode; // 更新头节点
        }
        size++;
    }

    // **从队尾出队**
    public int DeQueueRear() {
        if (rear == null) {
            throw new Exception("Queue is Empty");
        }
        int value = rear.data;
        rear = rear.prev; // 尾指针前移
        if (rear == null) {
            front = null; // 如果队列空了，头指针也要置空
        } else {
            rear.next = null; // 断开旧尾节点的连接
        }
        size--;
        return value;
    }

    // **从队头出队**
    public int DeQueueFront() {
        if (front == null) {
            throw new Exception("Queue is Empty");
        }
        int value = front.data;
        front = front.next; // 头指针后移
        if (front == null) {
            rear = null; // 如果队列空了，尾指针也要置空
        } else {
            front.prev = null; // 断开旧头节点的连接
        }
        size--;
        return value;
    }

    // **查看队头元素**
    public int PeekFront() {
        if (front == null) throw new Exception("Queue is empty");
        return front.data;
    }

    // **查看队尾元素**
    public int PeekRear() {
        if (rear == null) throw new Exception("Queue is empty");
        return rear.data;
    }

    // **判断队列是否为空**
    public bool IsEmpty() {
        return front == null;
    }

    // **返回队列大小**
    public int Size() {
        return size;
    }
}
```

## 用数组实现栈和队列

#### **队列**

1. **`pushi`（入队指针）**：
   - 指向**下一个可插入的位置**。
   - 插入元素后，`pushi`移动到下一个位置（如果到达数组末尾则回到 `0`）。
2. **`popi`（出队指针）**：
   - 指向**当前队头元素**。
   - 出队后，`popi`移动到下一个位置（如果到达数组末尾则回到 `0`）。
3. **`size`**：
   - 记录当前队列中的元素数量，避免 `pushi`和 `popi`重叠时无法区分队列是**空**还是**满**。
4. **循环利用数组空间**：
   - 当指针到达数组末尾时，通过 `NextIndex`回到 `0`，实现**循环队列**的特性。

```C#
public class MyQueue {
    private int[] arr;      // 存储队列元素的数组
    private int pushi;      // 入队指针（指向下一个插入位置）
    private int popi;       // 出队指针（指向队头元素）
    private int size;       // 当前队列大小
    private int limit;      // 队列容量上限

    public MyQueue(int limit) {
        arr = new int[limit];
        pushi = 0;
        popi = 0;
        size = 0;
        this.limit = limit;
    }

    // **入队（在队尾插入元素）**
    public void Push(int value) {
        if (size == limit) {
            throw new Exception("队列已满");
        }
        arr[pushi] = value; // 插入元素
        pushi = NextIndex(pushi); // 移动入队指针
        size++;
    }

    // **出队（移除并返回队头元素）**
    public int Pop() {
        if (size == 0) {
            throw new Exception("队列为空，无法弹出元素");
        }
        int value = arr[popi]; // 获取队头元素
        popi = NextIndex(popi); // 移动出队指针
        size--;
        return value;
    }

    // **判断队列是否为空**
    public bool IsEmpty() {
        return size == 0;
    }

    // **计算下一个指针位置（循环）**
    private int NextIndex(int index) {
        return index < limit - 1 ? index + 1 : 0;
    }
}
```

#### **栈**

```C#
public class Stack {
    private int[] arr;    // 存储栈元素的数组
    private int top;      // 栈顶指针（指向当前栈顶元素）
    private int size;     // 当前栈的大小
    private int limit;    // 栈的容量上限

    public Stack(int limit) {
        arr = new int[limit];
        top = -1;         // 初始时栈为空，top = -1
        size = 0;
        this.limit = limit;
    }

    // **入栈（Push）**
    public void Push(int value) {
        if (size == limit) {
            throw new Exception("栈已满");
        }
        top++;            // 栈顶指针上移
        arr[top] = value;  // 存入新元素
        size++;
    }

    // **出栈（Pop）**
    public int Pop() {
        if (size == 0) {
            throw new Exception("栈为空，无法弹出元素");
        }
        int value = arr[top]; // 获取栈顶元素
        top--;               // 栈顶指针下移
        size--;
        return value;
    }

    // **查看栈顶元素（Peek）**
    public int Peek() {
        if (size == 0) {
            throw new Exception("栈为空");
        }
        return arr[top];
    }

    // **判断栈是否为空**
    public bool IsEmpty() {
        return size == 0;
    }

    // **返回栈的大小**
    public int Size() {
        return size;
    }
}
```

# 面试题

## 实现一个特殊的栈，在基本功能的基础上，在实现返回栈中的最小元素的功能。

- pop,push,getMin操作时的时间复杂度都是O(1).
- 设计的栈类型可以使用现成的栈结构

思路：

1. **主栈**：存储所有元素，支持常规的push和pop操作
2. **辅助栈（最小栈）**：栈顶始终存储当前主栈中的最小元素

每当主栈push一个新元素时，比较新元素与最小栈栈顶元素：

- 如果新元素更小（或等于），则同时将其push到最小栈
- 否则，重复push最小栈当前的栈顶元素

这样，最小栈的栈顶始终是主栈当前的最小值，且所有操作都保持O(1)时间复杂度。

实现思路：

``` C#
public class MinStack
{
    private Stack<int> stack;     // 主栈
    private Stack<int> minStack;  // 最小栈

    public MinStack()
    {
        stack = new Stack<int>();
        minStack = new Stack<int>();
    }

    public void Push(int value)  
    {
        stack.Push(value);// 主栈不需要比较大小，默认压入

        // 如果最小栈为空，或者新值小于等于当前最小值，则加入最小栈
        if (minStack.IsEmpty() || value <= minStack.Peek())
        {
            minStack.Push(value);
        }
        else
        {
            // 否则，重复当前最小值
            minStack.Push(minStack.Peek());
        }
    }

    public void Pop()
    {
        if (stack.IsEmpty())
        {
            throw new InvalidOperationException("Stack is empty");
        }

        stack.Pop();
        minStack.Pop();
    }

    public int Top()
    {
        if (stack.IsEmpty())
        {
            throw new InvalidOperationException("Stack is empty");
        }

        return stack.Peek();
    }

    public int GetMin()
    {
        if (minStack.IsEmpty())
        {
            throw new InvalidOperationException("Stack is empty");
        }

        return minStack.Peek();
    }
}
```

## 如何用栈结构实现队列

1. **入队(AddElement)**：
   - 直接将元素压入PushStack
   - 然后尝试将PushStack元素转移到PopStack（保持队列顺序）
2. **出队(PopTo)**：
   - 如果PopStack为空，将PushStack所有元素弹出并压入PopStack（这会反转元素顺序）
   - 从PopStack弹出栈顶元素（即队列头部）
3. **查看队首(Peek)**：
   - 与出队类似，但不移除元素

```C#
using System;
using System.Collections.Generic;

public class TwoStackToQueue
{
    private Stack<int> popStack;  // 用于出队操作
    private Stack<int> pushStack; // 用于入队操作

    public TwoStackToQueue()
    {
        popStack = new Stack<int>();
        pushStack = new Stack<int>();
    }

    private void PushToPop()
    {
        if (popStack.Count == 0)  // 使用 Count == 0 替代 IsEmpty()
        {
            while (pushStack.Count > 0)  // 使用 Count > 0 替代 !IsEmpty()
            {
                popStack.Push(pushStack.Pop());
            }
        }
    }

    public void AddElement(int e)  // 参数名改为小写
    {
        pushStack.Push(e);
        PushToPop();
    }

    public int PopTo()
    {
        if(popStack.Count == 0 && pushStack.Count == 0)
        {
            throw new InvalidOperationException("Queue is empty");  // 使用更具体的异常类型
        }
        PushToPop();
        return popStack.Pop();
    }

    public int Peek()
    {
        if (popStack.Count == 0 && pushStack.Count == 0)
        {
            throw new InvalidOperationException("Queue is empty");  // 使用更具体的异常类型
        }
        PushToPop();
        return popStack.Peek();
    }
}
```

或者是

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



## 如何用队列结构实现栈

**操作逻辑**：

1. **入栈（Enqueue）**：
   - 直接加入主队列（MainQueue）
   - *时间复杂度：O(1)*
2. **出栈（DeQueue）**：
   - 将主队列中除最后一个元素外的所有元素转移到临时队列（TempQueue）
   - 弹出并返回主队列最后一个元素（即栈顶）
   - 交换两个队列的角色（保证下次操作仍从主队列开始）
   - *时间复杂度：O(n)*（需转移n-1个元素）
3. **查看栈顶（Peek）**：
   - 同出栈操作，但不移除最后元素
   - *时间复杂度：O(n)*

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

# 递归 

master公式：分析递归的时间复杂度

![image-20250714172319249](/notes-assets/Algorithm/assets/image-20250714172319249.png)

