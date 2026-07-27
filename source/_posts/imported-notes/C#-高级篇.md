---
title: 高级篇
date: 2026-06-27 03:33:00
categories:
  - 编程语言
tags:
  - C#
  - 笔记
---
# 字符串

#### 1.字符串的基础语法

```C# 
关于字符串的更多方法
1、CompareTo()方法，比较字符串的内容
2、Replace()用另一个字符或者字符串替换字符串中给定的字符或者字符串
3、Split()在出现给定字符的地方，把字符串拆分称一个字符串数组
4、SubString()在字符串中检索给定位置的子字符串
5、ToLower()把字符串转换成小写形式
6、ToUpper()把字符串转换成大写形式
7、Trim()删除首尾的空白
8、Concat()方法，合并字符串
9、CopyTo()方法，把字符串中指定的字符复制到一个数组中
10、Format()方法，格式化字符串
11、IndexOf()方法，取得字符串第一次出现某个给定字符串或者字符的位置
12、IndexOfAny()方法，
13、-nsert()把一个字符串实例插入到另一个字符串实例的制定索引处
14、Join()合并字符串数组，创建一个新字符串
```

#### 2.字符串的存储位置

**引用类型本质**：string是System.string的别名（通过Using System），属于引用类型，实例存储在堆区。

**不可变性**：字符串一旦创建，不可以修改字符串的内容。任何的修改操作都会产生新的字符串对象，源对象保存不变。

```C#
using System;
class Program
{
    unsafe static void Main()
    {
        string s1 = "abc";
        fixed (char* ptr = s1)
        {
            Console.WriteLine("s1字符串的地址是: " + (long)ptr);
            Console.wrileLine(s1);
        }
        
        string s2 = s1;   //s2和s1指向同一内存
        s1 += "def";		//新建字符串，s1指向新地址，s2仍指向原地址
        
        fixed (char* ptr = s1)
        {
            Console.WriteLine("s1字符串的地址是: " + (long)ptr);
            Console.WriteLine(s1);
        }
        fixed (char* ptr = s2)
        {
            Console.WriteLine("s2字符串的地址是: " + (long)ptr);
            Console.WriteLine(s2);
        }
    }
}

```

![image-20250327170919707](E:\typora_note\C#\assets\image-20250327170919707.png)

#### 3.**字符串驻留**

​	通常情况下，C# 编译器会自动把字符串字面量驻留到字符串驻留池中，这样当代码里有多个相同的字符串字面量时，它们实际上引用的是同一个内存地址，以此节省内存。但对于那些不是通过字符串字面量创建的字符串，比如通过拼接、从文件读取或者从用户输入获取的字符串，默认不会自动驻留。手动驻留就是让开发者能够把这些非字面量字符串添加到驻留池中，实现内存优化。

在 C# 里，字符串驻留是一种内存优化机制，它的目的是减少重复字符串的内存占用。

* 常量池优化：编译时确定的字符串字面量（如"ABC"）会被自动驻留（interned），相同字面量共享同一内存地址。

  ```csharp
  using System;
  class Program
  {
      unsafe static void Main()
      {
          string a = "ABC";
          string b = "ABC";
          bool isSame = object.ReferenceEquals(a, b); // true（指向同一对象）
          fixed(char *ptr = a)
          {
              Console.WriteLine("字符串a的地址是: " + (long)ptr);
          }
          fixed (char* ptr = b)
          {
              Console.WriteLine("字符串b的地址是: " + (long)ptr);
          }
      }
  }
  
  ```

  ![image-20250327171547570](E:\typora_note\C#\assets\image-20250327171547570.png)

* 手动驻留：通过String.Intern()和String.IsInterned()方法管理。手动驻留指的是通过编程方式将字符串添加到字符串驻留池中，而非依赖于 C# 编译器自动将字符串字面量驻留。StringBuilder每次增删改查不会生成新的字符串，直接修改缓冲区

  ```csharp
  string c = new StringBuilder().Append("AB").Append("C").ToString();//Tostring（）转化为字符串，Append（）添加
  string d = String.Intern(c); // 强制驻留
  ```

# 正则表达式

#### 元字符

```c#
//元字符
.：匹配除换行符外的任意字符
\d：匹配数字（等价于 [0-9]）
\w：匹配字母、数字或下划线
^ 和 $：分别匹配字符串的开始和结束
    
//量词：
*：零次或多次
+：一次或多次
{n,m}：匹配 n 到 m 次
```

#### 常用方法

- 匹配验证

```C#
bool isValid = Regex.IsMatch("123-45-6789", @"^\d{3}-\d{2}-\d{4}$");  // true
```

- 提取匹配项

```c#
MatchCollection matches = Regex.Matches("a a farm", @"\b(\w+)\W+\1\b");
foreach (Match match in matches) {
    Console.WriteLine(match.Value); // 输出重复单词
}
```

- 替换文本：

```csharp
string result = Regex.Replace("Hello world", "world", "C#");
```



# 委托

#### 委托与函数指针的区别

|   **特性**   |       **C#委托**       |      **C/C++函数指针**       |
| :----------: | :--------------------: | :--------------------------: |
| **类型安全** |    是（编译时检查）    |       否（仅地址匹配）       |
| **封装对象** | 支持实例方法和静态方法 | 仅支持静态函数或成员函数指针 |
|   **多播**   |          支持          |            不支持            |
| **匿名方法** |  支持Lambda和匿名方法  |        需显式定义函数        |

**委托本质上是面向对象的函数指针，更灵活且安全 。并且委托的类型是class（类），一般声明在命名空间下，与其他类平级，如果声明在其他类里面，那就是嵌套类，使用时在委托前面加上 - 类名.委托名**

#### 基本语法

```C#
using System;

// 声明委托类型
public delegate int BinaryOp(int x, int y);

class Program
{
    // 关联方法
    public static int Add(int a, int b) => a + b;
    public static int Subtract(int a, int b) => a - b;
    static void Main()
    {
        // 创建委托实例并关联 Add 方法
        BinaryOp op = Add;

        // 调用委托
        int result1 = op(3, 5);
        Console.WriteLine($"Add 方法结果: {result1}");

        // 关联 Subtract 方法
        op = Subtract;
        int result2 = op(3, 5);
        Console.WriteLine($"Subtract 方法结果: {result2}");

        // 多播委托
        op = Add;
        op += Subtract;

        // 调用多播委托
        Delegate[] invocationList = op.GetInvocationList();
        foreach (BinaryOp singleOp in invocationList)
        {
            int result = singleOp(3, 5);
            Console.WriteLine($"多播委托调用结果: {result}");
        }
    }
}
```

委托数组

```c#
using System;

// 声明委托类型
public delegate int Mydelegate(int x);
class Program
{
    public static int Op(int x)
    {
        return x;
    }
    public static int Op1(int x)
    {
        return x * x;
    }
    static void Main()
    {
        // 创建委托数组
        Mydelegate[] mydelegate = { Op, Op1 };

        // 遍历委托数组并调用委托
        foreach (Mydelegate op in mydelegate)
        {
            int result = op(5);
            Console.WriteLine($"调用委托的结果: {result}");
        }
    }
}
```

#### Action委托和Function委托

|   **特性**   |        **`Action` 委托**         |            **`Func` 委托**             |
| :----------: | :------------------------------: | :------------------------------------: |
|  **返回值**  |        无返回值（`void`）        | 有返回值（最后一个泛型参数为返回类型） |
| **参数数量** |     支持 0 到 16 个输入参数      |  支持 0 到 16 个输入参数 + 1 个返回值  |
|   **用途**   | 封装无返回值的方法（如事件处理） |    封装有返回值的方法（如计算逻辑）    |

```c#
//Func委托 如果传递的是类里面的方法，则需要实例也就是 new Func("方法名");

using System;

// 声明委托类型
public delegate int Mydelegate(int x);
class Program
{

    //有参数类型   Func<> f = 方法名; 
    public static int Op(int x)
    {
        return x;
    }
    public static double Op1(double x,double y)
    {
        return x * y;
    }
    static void Main()
    {
        Func<int,int> f = Op;
        Console.WriteLine(f(1));

        Func<double, double, double> f1 = Op1;
        Console.WriteLine(f1(1, 3));

    }
}
```

```c#
//Action委托,如果传递的是类里面的方法，则需要实例也就是 new Action("方法名");

using System;

// 声明委托类型
public delegate int Mydelegate(int x);
class Program
{

    //有参数类型
    public static void Op(int x)
    {
        Console.WriteLine("1");
    }
    public static void Op1(double x,double y)
    {
        Console.WriteLine("2");
    }
    static void Main()
    {
        Action<int> f = Op;
        f(1);
		//Action<int> f = new Action<int>(Op)
        Action<double,double> f1 = Op1;
        f1(1,2);
		//Action<double,double> f1 = new Action<double,double>(Op1)
    }
}
    
```

#### 委托的Invoke方法

`Invoke` 方法为调用委托所引用的方法提供了一种标准、显式的方式。虽然可以直接调用委托实例，但使用 `Invoke` 能让代码意图更清晰，特别是在代码审查或者多人协作开发时，能让其他开发者明确这里是在调用委托。

```C#
using System;
public delegate void Mydelegate(string sr);
class Program
{
    public static void Op(string sr)
    {
        Console.WriteLine("Hello");
    }
    static void Main()
    {
        Mydelegate m = new Mydelegate(Op);
        m.Invoke("Using Op method" );
    }

}
```

**?.Invoke**:委托可能为 `null`，也就是没有指向任何方法。当尝试调用一个为 `null` 的委托时，会引发 `NullReferenceException` 异常。使用 `?.Invoke` 可以在调用委托之前先检查委托是否为 `null`，若不为 `null` 则调用 `Invoke` 方法；若为 `null` 则不执行任何操作，避免抛出异常

```C#
using System;

// 定义委托类型
delegate void MyDelegate(string message);

class Program
{
    static void PrintMessage(string message)
    {
        Console.WriteLine(message);
    }

    static void Main()
    {
        // 声明委托变量，初始化为 null
        MyDelegate myDelegate = null;

        // 使用 ?.Invoke 安全调用委托
        myDelegate?.Invoke("尝试调用委托");

        // 为委托赋值
        myDelegate = PrintMessage;

        // 再次使用 ?.Invoke 调用委托
        myDelegate?.Invoke("委托已赋值，现在调用");
    }
}
```



#### 多播委托

多播委托的所有方法必须与委托声明的参数类型、数量及顺序完全匹配。例如，若委托定义为`delegate int MyDelegate(int a, string b)`，则所有绑定的方法必须接受`int`和`string`参数，否则会在编译时报错.,并且多播委托可以使用多次,但是如果委托的多个方法都有返回值的情况下，只返回最后的一个的返回值

- 调用委托时，如果其中的一个委托报错，则后面的不会被调用
- 注意最后一个的返回值才会被作为委托的返回值
- 因为是数组,remove则是从后往前遍历，所以remove(-=)的复杂的是O(n)
- 线程不安全

```C#
using System;
public delegate int Mydelegate(int x);
class Program
{
    public static int Op(int x)
    {
        Console.WriteLine("Op" + x);
        return 0;
    }
    public static int Op1(int x)
    {
        Console.WriteLine("Op1" + x);
        return 0;
    }
    public static void Op2(int x)
    {
        Console.WriteLine("Op2"+ x);
    }
    static void Main()
    {
        Mydelegate D1 = Op;
        
        D1 += Op1;  //多播委托
       	// D1 +=Op2  //会报错，因为返回值类型与委托类型不一致
        // D1 +=Op1;//2次使用多播委托，结果输出多一份
        //D1 -=Op; //减少多播委托
        D1(1);
    }
}
```

**Action多播委托和Function多播委托**

**Action委托**用于封装**无返回值**的方法，其参数类型通过泛型参数定义：

```csharp
Action<int, string> action = Method1;
action += Method2;  // 两个方法必须接受int和string参数，且返回void
```

- 参数要求：所有绑定的方法必须与Action的泛型参数完全匹配。例如，若定义为Action<int, string>，则所有方法必须接受int和string参数，且顺序一致

- **返回值要求**：由于Action本身无返回值，所有方法必须返回`void`，否则编译报错

```C#
Action<int> print = x => Console.WriteLine(x);
print += x => Console.WriteLine(x * 2);
print(5);  // 依次输出5和10
```



**Func委托**用于封装**有返回值**的方法，其最后一个泛型参数表示返回值类型：

```csharp
Func<int, int, int> func = Add;
func += Subtract;  // 两个方法必须接受两个int参数并返回int
```

- 参数要求：参数类型、数量和顺序必须与Func的泛型参数完全匹配。例如，Func<int, string, bool>要求所有方法接受int和string参数，并返回bool
- 返回值要求：所有方法的返回值类型必须与Func的最后一个泛型参数一致。例如，若定义为Func<int, string>，则所有方法必须返回string

**示例**：

```csharp
Func<int> getNumber = () => 10;
getNumber += () => 20;
int result = getNumber();  // 调用顺序：10 -> 20，最终返回20
```

**多播委托的返回值处理**

- **Action委托**：由于无返回值，无需处理返回值覆盖问题。

- **Func委托**：多播调用时，只有最后一个方法的返回值会被保留，其他方法的返回值会被丢弃。例如：

  ```csharp
  Func<int> func = () => 1;
  func += () => 2;
  int result = func();  // 结果为2
  ```

  若需要获取所有方法的返回值，需手动遍历调用列表：

  ```csharp
  foreach (Delegate del in func.GetInvocationList()) {
      Console.WriteLine(del.DynamicInvoke());
  }
  ```

### 注意：

- `Func` 和 `Action` 是 C# 内置的泛型委托类型，它们本质上是已经定义好的委托类型，你可以在方法内部直接使用这些类型来声明委托实例，而不需要额外定义委托类型。

- 使用 `delegate` 关键字自定义委托类型时，必须在类、结构体或者命名空间的作用域内声明，而不能在方法内部声明。因为委托类型属于类型定义，其作用类似于类和结构体的定义，需要在全局或类级别的作用域中定义，以保证在整个类或者命名空间内可以被访问和使用。

# Lamda表达式

#### 匿名方法

定义与语法

```C#
delegate(参数列表){方法体}

//Action匿名方法，Function匿名方法，delegate匿名方法
using System;
//全局定义delegate
public delegate void func(int x, int y);
class Program
{
    static void Main()
    {
        //Func委托
        Func<int,int,int> f = delegate(int x,int y) { Console.WriteLine(x * y); return 0; };
        f(1,2);
        
        //Action委托
        Action<int, int> A = delegate (int x, int y) { Console.WriteLine(x * y); };
        A(1,2);
        
        //delegate方法
        func d = delegate(int x,int y) { Console.WriteLine(x * y); };
        f(1,2);
    }
}
```

#### lamda表达式

- Lambda 表达式的基本语法：
  - 当方法体只有一条语句时，可以省略大括号和 `return` 关键字，例如 `(x, y) => Console.WriteLine(x * y)`。
  - 当方法体有多条语句时，需要使用大括号将语句括起来，并且如果有返回值，需要显式使用 `return` 关键字，例如 `(x, y) => { Console.WriteLine(x * y); return 0; }`。
- **`Func` 委托的 Lambda 表达式**：`Func<int, int, int> f = (x, y) => { Console.WriteLine(x * y); return 0; };` 这里 `(x, y)` 是参数列表，`{ Console.WriteLine(x * y); return 0; }` 是方法体，该方法返回一个 `int` 类型的值。
- **`Action` 委托的 Lambda 表达式**：`Action<int, int> A = (x, y) => Console.WriteLine(x * y);` 由于 `Action` 委托不返回值，所以方法体中直接执行 `Console.WriteLine(x * y)`。
- **自定义委托的 Lambda 表达式**：`func d = (x, y) => Console.WriteLine(x * y);` 同样，根据自定义委托 `func` 的定义，它不返回值，所以 Lambda 表达式的方法体也是直接执行 `Console.WriteLine(x * y)`。

```C#
using System;
public delegate void func(int x, int y);
class Program
{
    
    static void Main()
    {
        //Func 委托的 Lambda 表达式
        Func<int,int,int> f = (x,y) =>  x * y;
        Console.WriteLine(f(3,4));
        
        //Action 委托的 Lambda 表达式
        Action<int,int> A =(x,y) => Console.WriteLine(x*y);
        A(3,4);
        //自定义委托
        func d = (x,y) =>Console.WriteLine(x*y);
        d(3,4);
    }
}
```

# 事件event

#### 核心机制

1. **委托与事件的本质关系**
   事件是委托的封装升级，通过`event`关键字限制外部直接访问，仅允许`+=`/`-=`操作订阅方法
   - 编译器自动生成私有委托字段和访问器（add/remove），确保封装性
2. **发布-订阅模式**
   - 发布者：定义事件并触发（如Toolman.DownStair()），无需感知订阅者细节
   - 订阅者：注册符合委托签名的方法（如Lazyman.TakePackage），实现松耦合通信
3. **多播委托特性**
   事件支持绑定多个处理方法，触发时按订阅顺序执行，通过遍历GetInvocationList()可逐个调用方法

```c#
using System;

namespace _01_命名空间
{	//使用实例
    class Program
    { 
        static void Main(string[] args)
        {
            Toolman toolman = new Toolman("小明");
            Lazyman lz1 = new Lazyman("张三");
            Lazyman lz2 = new Lazyman("李四");
            Lazyman lz3 = new Lazyman("五五");
            toolman.Mydelegate += lz1.TakePackage;
            toolman.Mydelegate += lz2.TakePackage;
            toolman.Mydelegate += lz3.TakeFood;
            toolman.DownStair();
            Console.WriteLine();
            toolman.Mydelegate -= lz1.TakePackage;
            toolman.DownStair();
            toolman.Mydelegate();

        }
    }
    //订阅人
    class Lazyman
	{
        public string name {  get; private set; }
        public Lazyman(string name) {
            this.name = name;
        }
        public void TakePackage()
        {
            Console.WriteLine("给" + name + "拿快递");
        }
        public void TakeFood()
        {
            Console.WriteLine("给" + name + "拿外卖");
        }
	}
    public delegate void Mydelegate();
    //发布人
    class Toolman
    {
        public string Name {  get;private set; }
        public Mydelegate Mydelegate = null;
        public Toolman(string name) {
            Name = name;
        }
        public void DownStair() {
            if (Mydelegate != null)
            {
                Mydelegate();
            }

    }

}

}
```

# 事件与委托

从概念上来说，委托是一种类型，它定义了方法的签名，允许将方法作为参数传递、存储和调用，它可以指向一个或多个方法。而事件是基于委托实现的一种特殊机制 ，它是一种特殊的委托实例。事件对委托进行了封装和限制。委托可以在类的外部随意调用，但是事件在类的外部只能进行订阅（添加处理程序）和取消订阅（移除处理程序）操作，而不能像普通委托那样直接调用。事件是一种更安全、更符合面向对象设计原则的机制，它使得类能够更好地控制哪些代码可以注册到该事件上以及在何时触发该事件。

- **委托**：委托本质上是一种类型，它定义了方法的签名，也就是方法的返回类型和参数列表。借助委托，你可以把方法当作参数传递给其他方法，还能将方法存储在变量里。委托能够指向一个或多个方法，调用委托时，所有被指向的方法都会被执行。
- **事件**：事件是基于委托实现的一种特殊机制，它是一种特殊的委托实例。事件为类提供了一种方式，使其能够在特定事情发生时通知其他对象。其他对象可以通过订阅事件来响应这些事情。
- 事件是对委托的一种封装和限制。委托在类的外部能被随意调用，而事件在类的外部仅能进行订阅（添加处理程序）和取消订阅（移除处理程序）操作，不能像普通委托那样直接调用。这保证了类能更好地把控哪些代码可以注册到该事件上以及何时触发该事件。
- 委托的使用场景
  - **回调方法**：在一个方法里调用另一个方法，且这个被调用的方法在运行时才确定。
  - **多播委托**：一个委托可以同时调用多个方法。
  - **泛型委托**：像`Func`和`Action`这样的泛型委托，能简化代码编写。
- 事件的使用场景
  - **GUI 编程**：在图形用户界面编程中，当用户点击按钮、关闭窗口等操作发生时，会触发相应的事件。
  - **异步编程**：在异步操作完成时触发事件通知其他代码。
  - **观察者模式**：一个对象的状态发生变化时，通知所有依赖它的对象。

```C#
using System;

// 定义委托类型
public delegate void Notify();

// 发布者类
public class Publisher
{
    // 声明事件
    public event Notify SomethingHappened;

    public void DoSomething()
    {
        // 模拟一些操作
        Console.WriteLine("发布者正在执行操作...");

        // 触发事件
        OnSomethingHappened();
    }

    protected virtual void OnSomethingHappened()
    {
        SomethingHappened?.Invoke();
    }
}

// 订阅者类
public class Subscriber
{
    public void OnNotified()
    {
        Console.WriteLine("订阅者收到通知！");
    }
}

class Program
{
    static void Main()
    {
        Publisher publisher = new Publisher();
        Subscriber subscriber = new Subscriber();

        // 订阅事件
        publisher.SomethingHappened += subscriber.OnNotified;

        // 发布者执行操作，触发事件
        publisher.DoSomething();

        // 取消订阅事件
        publisher.SomethingHappened -= subscriber.OnNotified;

        // 再次执行操作，事件不会触发订阅者的方法
        publisher.DoSomething();
    }
}
```

**委托定义**：`public delegate void Notify();`定义了一个名为`Notify`的委托类型，该委托不接受参数，返回值为`void`。

**事件声明**：在`Publisher`类中，`public event Notify SomethingHappened;`声明了一个基于`Notify`委托的事件`SomethingHappened`。

**事件触发**：`OnSomethingHappened`方法用于触发事件，`SomethingHappened?.Invoke();`表示如果有订阅者订阅了该事件，则调用所有订阅者的方法。

**事件订阅和取消订阅**：在`Main`方法中，通过`+=`和`-=`操作符分别实现了事件的订阅和取消订阅。

# 闭包

闭包（Closure）是一种允许函数（如委托或lambda表达式）捕获并保留其词法作用域中变量（在函数的作用域中只使用到，但是变量的定义和声明在外部）的机制。即使外部作用域已经执行完毕，闭包仍能访问和操作这些变量，延长变量的声明周期。**简单来讲，闭包可以理解成一个函数，它不仅能访问自身作用域内的变量，还能访问定义它的外部函数作用域里的变量，即便外部函数已经执行完毕。也就是说，闭包把它所引用的外部变量给 “捕获” 了，让这些变量不会随着外部函数的结束而被销毁。**

#### 闭包的原理

闭包如何去摆脱作用域的限制，并且延长变量的声明周期的？

C#通过编译器生成的类来实现闭包。当lambda或匿名函数捕获外部变量时，编译器会：

- **将捕获的变量“提升”到编译器生成的类的字段中**。(将捕获到的外部变量在底层生成一个匿名方法储存起来)
- **闭包函数成为该类的方法**，从而维持变量的生命周期。

```C#
using System;

class Program
{
    static void Main()
    {
        // 调用外部函数，得到一个闭包
        Func<int> counter = CreateCounter();

        // 多次调用闭包
        Console.WriteLine(counter()); // 输出 1
        Console.WriteLine(counter()); // 输出 2
        Console.WriteLine(counter()); // 输出 3
    }

    // 外部函数
    static Func<int> CreateCounter()
    {
        // 被捕获的变量
        int count = 0;

        // 内部函数（闭包）
        Func<int> counter = () =>
        {
            // 访问并修改外部函数的变量
            count++;
            return count;
        };

        return counter;
    }
}
```

1. **外部函数 `CreateCounter`**：此函数定义了一个局部变量 `count`，初始值为 0。同时，它还定义了一个内部函数（使用 Lambda 表达式），这个内部函数会访问并修改 `count` 变量，最后返回这个内部函数。
2. **内部函数（闭包）**：内部函数捕获了外部函数的 `count` 变量。每次调用这个内部函数时，`count` 变量的值都会加 1，并且返回更新后的值。
3. **`Main` 方法**：调用 `CreateCounter` 函数，得到一个闭包 `counter`。之后多次调用 `counter` 函数，会发现 `count` 变量的值会持续增加，这表明闭包成功捕获并保留了 `count` 变量的状态。

# Solid（设计原则）

#### 单一职责原则

思想：一个类应该只有一个引起它变化的原因，也就是一个类只负责一项职责，避免“万能类”

#### 开闭原则

思想：软件实体（类，模块，函数）应对扩展开放，对修改关闭，也就 是通过抽象和继承对类进行横向的扩展，实现扩展的功能，并不是修改已经已有代码，（Bug）除外

#### 里氏替换原则

思想：子类必须能够替换其基类，且不会破坏程序的正确性，也就是子类不应改变父类的行为（不覆盖父类的非抽象方法），保持”is-a“关系

```C#
using System;

// 定义一个抽象基类，代表形状
public abstract class Shape
{
    public abstract double Area();
}

// 定义一个矩形类，继承自 Shape
public class Rectangle : Shape
{
    public double Width { get; set; }
    public double Height { get; set; }

    public override double Area()
    {
        return Width * Height;
    }
}

// 定义一个正方形类，继承自 Shape
public class Square : Shape
{
    public double SideLength { get; set; }

    public override double Area()
    {
        return SideLength * SideLength;
    }
}

// 包含一个静态方法 CalculateArea，该方法接受一个 Shape 类型的参数。
//由于 Rectangle 和 Square 都是 Shape 的子类，根据里氏替换原则，它们可以替换 Shape 类型的参数。
public class AreaCalculator
{
    public static double CalculateArea(Shape shape)
    {
        return shape.Area();
    }
}

class Program
{
    static void Main()
    {
        // 创建一个矩形对象
        Rectangle rectangle = new Rectangle { Width = 5, Height = 10 };
        // 调用计算面积的方法，传入矩形对象
        double rectangleArea = AreaCalculator.CalculateArea(rectangle);
        Console.WriteLine($"Rectangle Area: {rectangleArea}");

        // 创建一个正方形对象
        Square square = new Square { SideLength = 7 };
        // 调用计算面积的方法，传入正方形对象
        double squareArea = AreaCalculator.CalculateArea(square);
        Console.WriteLine($"Square Area: {squareArea}");
    }
}
    
```

#### 接口隔离原则

思想：客户端不应被迫依赖不使用的接口，也就是接口应尽量细化，避免臃肿接口，通俗来说就是不要把客户端不需要的接口让客户端进行实现。

#### 依赖倒置原则

思想：高层模块不应该依赖低层模块，二者都应该依赖抽象。抽象不依赖细节，细节应依赖抽象

**依赖注入是一种设计模式，它将依赖的创建和管理从类内部转移到类外部。通过依赖注入，类可以接收它所依赖的对象，而不是自己创建这些对象。**

```C#
using System;

// 定义接口
interface IVehicle
{
    void Run();
}

// 实现接口的具体类
class ConcreteVehicle : IVehicle
{
    public void Run()
    {
        Console.WriteLine("Vehicle is running");
    }
}

class Car
{
    private IVehicle _vehicle;

    public Car(IVehicle vehicle)
    {
        _vehicle = vehicle;
    }

    public void DRun()
    {
        _vehicle.Run();
    }
}

class Program
{
    static void Main(string[] args)
    {
        // 创建实现接口的具体类的实例
        var vehicle = new ConcreteVehicle();
        // 通过构造函数注入依赖
        var car = new Car(vehicle);
        car.DRun();
    }
}    
```



# 反射

反射是一种强大的机制，它允许程序在运行时获取类型信息、创建对象、调用方法以及访问字段和属性等

#### **核心组件**：

- `Type`：表示类型（类、接口、数组等）的抽象描述，是反射的核心。
- `Assembly`：表示程序集，提供对包含多个类型的程序集的访问。
- `MethodInfo、PropertyInfo、FieldInfo`：表示类的成员信息（方法、属性、字段等）。

```C#
//获取Type
```

#### 程序集

1. **定义和概念**：程序集是 .NET 中可重用、版本化并且是自我描述的模块，是部署、版本控制、重用、激活范围控制和安全权限控制的基本单元。它可以是一个可执行文件（`.exe`），也可以是一个类库（`.dll`）。简单来说，程序集就是包含了代码和相关资源的一个文件或一组文件。
2. **组成部分**：
   - **清单（Manifest）**：包含了程序集的元数据，描述了程序集的版本信息、依赖的其他程序集、资源信息等。例如，一个程序集可能依赖于 `System.Core.dll`，这些依赖关系会在清单中记录。
   - **类型元数据**：存储了程序集中定义的所有类型（类、接口、结构体等）的信息，包括类型的名称、成员（方法、属性、字段等）的定义和访问权限等。
   - **IL（中间语言）代码**：C# 代码在编译时会被转换为 IL 代码，它是一种与平台无关的中间表示形式。在运行时，IL 代码会被即时编译器（JIT）编译成本地机器码。
   - **资源**：程序集可以包含各种资源，如图像、字符串、配置文件等。这些资源可以在代码中通过特定的方式进行访问。
3. **作用和用途**：
   - **代码封装和重用**：将相关的代码组织到一个程序集中，可以方便地进行重用。例如，你可以创建一个包含常用工具方法的类库程序集，在多个项目中引用它。
   - **版本控制**：程序集的清单中包含版本信息，这有助于进行版本管理。当程序集的功能发生变化时，可以更新版本号，客户端程序可以根据版本号来决定是否需要更新引用的程序集。
   - **部署和分发**：程序集是部署的基本单元。你可以将一个或多个程序集打包在一起进行分发，客户端只需要安装这些程序集即可运行应用程序。
   - **安全控制**：基于程序集的来源和版本等信息，可以对程序集进行安全权限控制，确保只有授权的程序集能够访问系统资源。

#### 元数据

1. **定义和概念**：元数据是描述数据的数据。在程序集中，元数据包含了关于程序集自身、类型定义、成员定义等多方面的信息。它是 .NET 运行时能够理解和管理代码的关键。
2. **内容和类型**：
   - **程序集元数据**：包含程序集的名称、版本号、文化信息、强名称（如果有）等。这些信息在程序集的清单中存储，用于标识和管理程序集。
   - **类型元数据**：描述了程序集中定义的类型的信息，包括类型的名称、基类型、实现的接口、访问修饰符（如 `public`、`private` 等）。例如，一个类的元数据会记录它继承自哪个类，实现了哪些接口。
   - **成员元数据**：对于类型的每个成员（方法、属性、字段等），元数据包含了成员的名称、参数列表、返回类型、访问修饰符等信息。例如，一个方法的元数据会记录它的参数个数、参数类型和返回值类型。
   - **特性元数据**：可以为类型、成员等添加特性（Attribute），元数据中会记录这些特性的信息。例如，`[Serializable]` 特性表示一个类可以被序列化，这个特性信息会存储在元数据中。
3. **作用和用途**：
   - **类型安全**：在运行时，.NET 运行时（CLR）利用元数据来确保类型的安全性。例如，当调用一个方法时，CLR 会根据元数据检查方法的参数类型和个数是否匹配，防止类型不匹配的错误。
   - **反射**：反射是 .NET 中的一项强大功能，它允许程序在运行时动态地获取类型信息、创建对象、调用方法等。反射的实现依赖于元数据，通过元数据可以获取到类型的所有信息，从而实现动态编程。
   - **序列化和反序列化**：在进行对象的序列化和反序列化时，元数据用于确定对象的结构和成员信息，以便正确地将对象转换为字节流并在需要时恢复对象。
   - **互操作性**：元数据使得不同编程语言编写的 .NET 程序集之间能够进行互操作。因为元数据提供了统一的类型描述，不同语言编写的代码可以基于元数据来理解和调用对方的类型和成员。

#### Type类

`Type` 类是反射机制的核心，它代表了类型的元数据，提供了对类型信息的访问和操作能力。通过 `Type` 对象，可以获取类型的名称、命名空间、基类型、是否为抽象类、是否为接口等基本信息，这对于了解类型的结构和特性非常有帮助。

**Type类**：

- ##### *获取对象的Type类*

  ```C#
  int a = 32;			//定义一个变量
  Type type1 = a.GetType();   //通过Object基类的GetType（）可以直接获取对象的Type
  Type type2 = typeof(int);	//通过typeof关键字 传入类名，得到对象的Type
  Type type3 =Type.GetType("System.Int32");  ////通过类的名字，也可以获取类型，但是类名必须包含命名空间
  ```

- ##### *获取类所在的程序集(一般是非本程序集)*

  ```C#
  Console.WriteLine(type1.Assembly);  //通过Type得到的类型获取程序集所在的程序集信息，包含版本名等等
  Type t = typeof(Test)  //其中test是定义的类名,一般本程序集使用typeof，非本程序集使用Type.GetType();
  MemberInfo[] infos = t.GetMembers();  
  for(int i = 0;i<infos.length;i++)   //使用数组得到类的所有公共成员,但是获取不了私有变量
      Console.WriteLine(infos[i]);
  ```

- ##### *获取类中的公共构造函数并且调用*

  ```c#
  ConstructorInfo[] ctors = t.GetConstructors(); //1. 使用数组得到类的所有公共构造函数,如果是只有一个不需要数组
  for (int i = 0;i < ctors.Length; i++)
  	 Console.WriteLine(ctors[i]);
  
  //2.获取其中的一个构造函数，并且执行
  //得构造函数传入 Type数组  数组中内容按顺序是参数类型
  //执行构造函数传入 object数组  表示按顺序传入的参数
  
  //2.1得到无参构造，执行无参构造，无参构造，没有参数，传入null
  ConstructorInfo info = t.GetConstructor(Type.EmptyTypes);//无参
  Test obj = info.Invoke(null) as Test;
  Console.WriteLine(obj.j);
  
  //2.2得到有参构造(class中定义2个有参的构造函数)
  ConstructorInfo info1 = t.GetConstructor(new Type[]{typeof(int),typeof(string) });//有参
  obj = info1.Invoke (new object[] {2,"11"}) as Test;  //中括号传入传递的数值
  Console.WriteLine(obj.s);
  
  ConstructorInfo info2 = t.GetConstructor(new Type[] { typeof(int), typeof(int), typeof(string) });
  obj = info2.Invoke(new object[] {1,2,"333"}) as Test;
  Console.WriteLine(obj.s);
  //中括号传入传递的数值
  ```

- ##### *获取类的公共成员变量*

  ```c#
  //1.得到所有的公共成员变量
  FieldInfo[] fields = t.GetFields();
  for (int i = 0; i<fields.Length; i++) 
         Console.WriteLine(fields[i]);
  
  //2.得到指定名称的公共成员变量，在类中定义变量j，变量s，使用根据变量名直接获取
  FieldInfo infoj = t.GetField("j");
  FieldInfo infoS = t.GetField("s");
  Console.WriteLine(infoS);
  Console.WriteLine(infoj);
  
   //3.通过反射获取和设置对象的值，自身的程序集（一般是不同程序集）
  Test test = new Test();
  test.j = 1;
      //3-1通过反射，获取对象的某个变量的值
      var result = infoj.GetValue(test);
      Console.WriteLine(result);  
      //3-2通过反射，获取指定对象的某个变量的值
      infoj.SetValue(test, 2);//test是类名
      Console.WriteLine(infoj.GetValue(test));
      #endregion
  ```

- ##### *获得类中的公共成员方法*

  ```C#
   //通过Type类的GetMethod，得到所有的方法，如果方法重载，用Type数值表示参数类型
   Type strType= typeof(string);
   MethodInfo[] methodS = strType.GetMethods();
   for (int i = 0; i < methodS.Length; i++)
   {
       Console.WriteLine(methodS[i]);//获取string类的所有方法
   }
  
  ////得到一个方法
  MethodInfo method = strType.GetMethod("Substring", new Type[] { typeof(int), typeof(int) });//得到方法为Substring的方法,GetMethod("SubString,new Type[]{typeof(int),typeof(int)....})可以得到对象的重载方法
  //调用该方法,如果是静态方法Invoke中的第一个参数传null即可
  string str = "Hello,World";
  object results = method.Invoke(str, new object[] { 7, 4 });
  Console.WriteLine(results);
  ```

- ##### *最后汇总*

```c#
using System;
using System.Reflection;//引入反射的命名空间

class Test
{
    private int i;
    public int j;
    public string s;
    public Test()
    {
        
    }
    public Test(int i,string str)
    {
        this.i = i;
        s = str;
    }
    public Test(int i, int j, string s)
    {
        this.i = i;
        this.j = j;
        this.s = s; 
    }
    public void test()
    {
        Console.WriteLine(i);
        
    }
}


class Program {
    static void Main(string[] args)
    {
        #region 获取Type
        int a = 32;
        //通过Object基类的GetType（）可以直接获取对象的Type
        Type type1 = a.GetType();
        Console.WriteLine(type1);
        //通过typeof关键字 传入类名，得到对象的Type
        Type type2 = typeof(int);
        Console.WriteLine(type2);
        //通过类的名字，也可以获取类型，但是类名必须包含命名空间
        Type type3 = Type.GetType("System.Int32");
        Console.WriteLine(type3);
        #endregion

            
         
        #region 获取类所在的程序集
        //通过Type得到的类型获取程序集所在的程序集信息
        Console.WriteLine(type1.Assembly);
        #endregion

        Type t =typeof(Test);
        #region 获取类中的所有公共成员
        Console.WriteLine();
        MemberInfo[] infos = t.GetMembers(); //使用数组得到类的所有公共成员,但是获取不了私有变量
        for (int i = 0; i < infos.Length; i++)
        {
            Console.WriteLine(infos[i]);
        }
        #endregion

            
            
            
        #region 获取类中的公共构造函数并且调用
        ConstructorInfo[] ctors = t.GetConstructors(); //使用数组得到类的所有公共构造函数,如果是只有一个不需要数组
        for (int i = 0;i < ctors.Length; i++)
        {
            Console.WriteLine(ctors[i]);
        }

        //2.获取其中的一个构造函数，并且执行
        //得构造函数传入 Type数组  数组中内容按顺序是参数类型
        //执行构造函数传入 object数组  表示按顺序传入的参数

        // 得到无参构造，执行无参构造，无参构造，没有参数，传入null
        Console.WriteLine();
        ConstructorInfo info = t.GetConstructor(Type.EmptyTypes);//无参
        Test obj = info.Invoke(null) as Test;
        Console.WriteLine(obj.j);

        //得到有参构造
        ConstructorInfo info1 = t.GetConstructor(new Type[]{typeof(int),typeof(string) });//有参
        obj = info1.Invoke (new object[] {2,"11"}) as Test;  //中括号传入传递的数值
        Console.WriteLine(obj.s);

        ConstructorInfo info2 = t.GetConstructor(new Type[] { typeof(int), typeof(int), typeof(string) });
        obj = info2.Invoke(new object[] {1,2,"333"}) as Test;
        Console.WriteLine(obj.s);
        //中括号传入传递的数值
        #endregion

            
            
            
        #region 获取类的公共成员变量
        //1.得到所有的公共成员变量
        FieldInfo[] fields = t.GetFields();
        for (int i = 0; i<fields.Length; i++) {
            Console.WriteLine(fields[i]);
        }

        //2.得到指定名称的公共成员变量
        Console.WriteLine();
        FieldInfo infoj = t.GetField("j");
        FieldInfo infoS = t.GetField("s");
        Console.WriteLine(infoS);
        Console.WriteLine(infoj);
        

        //3.通过反射获取和设置对象的值，自身的程序集（一般是不同程序集）
        Test test = new Test();
        test.j = 1;

        //3-1通过反射，获取对象的某个变量的值
        var result = infoj.GetValue(test);
        Console.WriteLine(result);  
        //3-2通过反射，获取指定对象的某个变量的值
        infoj.SetValue(test, 2);
        Console.WriteLine(infoj.GetValue(test));
        #endregion

            
            
        #region 获得类中的公共成员方法
        //通过Type类的GetMethod，得到所有的方法，如果方法重载，用Type数值表示参数类型
        Type strType= typeof(string);
        MethodInfo[] methodS = strType.GetMethods();
        for (int i = 0; i < methodS.Length; i++)
        {
            //Console.WriteLine(methodS[i]);
        }

        //得到一个方法
        MethodInfo method = strType.GetMethod("Substring", new Type[] { typeof(int), typeof(int) });//得到方法为Substring的方法,GetMethod("SubString,new Type[]{typeof(int),typeof(int)....})可以得到对象的重载方法
        //调用该方法,如果是静态方法Invoke中的第一个参数传null即可
        string str = "Hello,World";
        object results = method.Invoke(str, new object[] { 7, 4 });
        Console.WriteLine(results);
        #endregion
    }

}

```

#### Activator类

- *快速实例化一个对象*：用于将Type对象快捷实例化为对象，先得到Type类，然后通过 Activator.CreateInstance(Type)

  ```c#
  Type testType = typeof(Test);  //其中的Test为本程序集
   //1.无参构造
   Test testobj = Activator.CreateInstance(testType) as Test;  //因为是object类型，所有需要as Test
   Console.WriteLine(testobj.s);
  
   //2.有参构造
   testobj = Activator.CreateInstance(testType, 99, "11") as Test;  //2个参数的构造函数
   Console.WriteLine(testobj.s);
   testobj = Activator.CreateInstance(testType, 99, 11, "11") as Test; //3个参数的构造函数
   Console.WriteLine(testobj.j);
  ```

#### Assembly类

- *加载程序集*：**首先通过加载程序集，加载后，才能用Type来使用其它程序集中的信息，如果想要使用不是自己程序集中的内容需要先加载程序集，比如dll文件（库文件）--简单的把库文件看成一种代码仓库，它提供给使用者一些可以直接拿来用的变量、函数或类**

  ```c#
  //三种加载程序集的函数
       //一般用来加载在同一文件下的其它程序集
  Assembly asembly2 = Assembly.Load("程序集名称");
  
       //一般用来加载不在同一文件下的其它程序集
  Assemblyasembly=Assembly.LoadFrom("包含程序集清单的文件的名称或路径");
  Assemblyasembly3=Assembly.LoadFile（"要加载的文件的完全限定路径");
  
  //1.先加载一个指定的程序集
  Assembly assembly = Assembly.LoadFrom(@"E:\code\C#\CSharp_project\CSharp_project\bin\Debug\net8.0\CSharp_project.dll");
  ```

- *对程序集中的一个类对象进行反射*：**首先获取程序集中全部的类对象，还在单个类对象**

  ```C#
  Type[] types = assembly.GetType(); //获取该程序集下的所有Type类对象，一个可以不用数组
  for (int i = 0; i < types.Length; i++)
      Console.WriteLine(types[i]);
  
  //2.再加载程序集中的一个类对象之后才能使用反射，获取该程序集下单一个类型
  Type type = assembly.GetType("CSharp_project.Test");
  Type type = assembly.GetType("CSharp_project.program");//
  ```

- *获取类对象的全部公共成员*

  ```C#
  Type type = assembly.GetType("CSharp_project.program");
  if(type != null) {
      MemberInfo[] members = type.GetMembers();  //调用program里面的所有公共方法 
      for (int i = 0; i < members.Length; i++)
          Console.WriteLine(members[i]);
  }
  ```

- 获取类对象的静态方法和实例方法并且进行调用

  ```C#
  //得到反射对象中的静态方法，不需要实例
  MethodInfo methods = InterF.GetMethod("Speak");
  
  if (methods != null){
      methods.Invoke(null, null);  //无参静态方法的调用
   }
  
   //得到反射对象中的实例方法，不在program类对象里面，在Test类里面，所以实现这个Type type = assembly.GetType("CSharp_project.Test");获取Test类对象
   //无参实例方法的调用，
  MethodInfo method1 = InterF.GetMethod("Move");  //获取方法
  if (method1 != null) { 
      object instance = Activator.CreateInstance(InterF);// 实例化
      method1.Invoke(instance, null);
  }
  
   //有参实例方法的调用
  MethodInfo method2 = InterF.GetMethod("Sit", new[] {typeof(int)});
  if (method2 != null) 
  {
      object instance1 = Activator.CreateInstance(InterF);
      object[] parameter = { 11 };
      Console.WriteLine(method2.Invoke(instance1, parameter));    
  }
  ```

- 完整的代码，分两个程序集

  ```C#
  using System;
  using System.Reflection;
  class Program {
      static void Main(string[] args)
      {
  
          //1.先加载一个指定程序集
          Assembly assembly = Assembly.LoadFrom(@"E:\code\C#\CSharp_project\CSharp_project\bin\Debug\net8.0\CSharp_project.dll");
          Type[] types = assembly.GetTypes();   //获取该程序集下的所有类型
          for (int i = 0; i < types.Length; i++)
              Console.WriteLine(types[i]);
  
  
          //2.再加载程序集中的一个类对象之后才能使用反射  ，获取该程序集下单一个类型
  
          Type InterF = assembly.GetType("CSharp_project.Test");
          //Type InterF = assembly.GetType("CSharp_project.Program");
  
  
          if (InterF != null)
          {
              MemberInfo[] members = InterF.GetMembers();  //调用program里面的所有公共方法 
              for (int i = 0; i < members.Length; i++)
                  Console.WriteLine(members[i]);
  
  
              //得到反射对象中的静态方法，不需要实例
              MethodInfo methods = InterF.GetMethod("Speak");
  
              if (methods != null)
              {
                  methods.Invoke(null, null);  //无参静态方法的调用
              }
  
              //得到反射对象中的实例方法
              //无参实例方法的调用
              MethodInfo method1 = InterF.GetMethod("Move");  //获取方法
              if (method1 != null)
              {
                  object instance = Activator.CreateInstance(InterF);// 实例化
                  method1.Invoke(instance, null);
  
              }
  
              //有参实例方法的调用
              MethodInfo method2 = InterF.GetMethod("Sit", new[] { typeof(int) });
              if (method2 != null)
              {
                  object instance1 = Activator.CreateInstance(InterF);
                  object[] parameter = { 11 };
                  Console.WriteLine(method2.Invoke(instance1, parameter));
  
              }
          }
      }
  
  }
  ```

  ```c#
  //简单的循环输入
  using System;
  namespace CSharp_project{
      class Program{
          public static void Speak()
          	Console.WriteLine("SAY Something");
           
          static void Main(string[] args)
          {
              Test test = new Test();
              Mylist<int> list = new Mylist<int>();
              Speak(); 
              test.Move();
              int x  = 0; 
              test.Sit(x);
           
          }  
      }
      class Test
      {
          public int x;
          public void Move()
  			Console.WriteLine("I am Running");
  
          public void Sit(int x)
  			Console.WriteLine("Sitting there"+ x);  
      }
  }
  ```

# 委托的 Invoke 方法和 BeginInvoke 方法

#### 1. Invoke 方法

##### 作用

`Invoke` 方法为调用委托所引用的方法提供了一种标准、显式的方式。它会同步执行委托所指向的方法，即调用 `Invoke` 后，程序会等待该方法执行完毕才会继续执行后续代码。

##### 使用原因

虽然可以直接调用委托实例，但使用 `Invoke` 能让代码意图更清晰，特别是在代码审查或者多人协作开发时，能让其他开发者明确这里是在调用委托。

##### 示例代码

```csharp
using System;
public delegate void Mydelegate(string sr);
class Program
{
    public static void Op(string sr)
    {
        Console.WriteLine("Hello");
    }
    static void Main()
    {
        Mydelegate m = new Mydelegate(Op);
        m.Invoke("Using Op method");
    }
}
```

#### 2. BeginInvoke 方法

##### 作用

`BeginInvoke` 方法用于异步调用委托所引用的方法。它会立即返回，不会等待委托方法执行完毕，程序会继续执行后续代码。在调用 `BeginInvoke` 后，委托方法会在一个新的线程中执行。

##### 使用原因

在需要执行耗时操作时，如果使用同步调用（如 `Invoke`），会导致主线程阻塞，界面可能会出现卡顿现象。而使用 `BeginInvoke` 可以避免这种情况，让耗时操作在后台线程中执行，保证主线程的流畅性，提升用户体验。

##### 示例代码

```csharp
using System;

public delegate void MyAsyncDelegate(int value);

class Program
{
    public static void LongRunningMethod(int value)
    {
        Console.WriteLine($"Starting long running method with value {value}...");
        System.Threading.Thread.Sleep(2000); // 模拟耗时操作
        Console.WriteLine($"Long running method with value {value} completed.");
    }

    static void Main()
    {
        MyAsyncDelegate asyncDelegate = LongRunningMethod;

        // 异步调用委托
        IAsyncResult asyncResult = asyncDelegate.BeginInvoke(42, null, null);

        Console.WriteLine("Main thread continues to execute...");

        // 可以在这里执行其他操作

        // 等待异步操作完成
        asyncDelegate.EndInvoke(asyncResult);

        Console.WriteLine("Main thread finished.");
    }
}
```

# 多线程

在 C# 里，多线程编程能够让程序同时执行多个任务，进而提升程序的性能与响应能力。一个进程包含多个线程，线程是进程中的实际运作单位，一条线程指的是进程中的一个单一顺序的控制流，一个进程可以并发多个线程。并且进程之间相互独立，互不干扰，但是可以互相访问。

但是并不是线程越多越好，因为是采用资源换时间，同时会产生其他的成本，包括（阅读上下文，管理成本等等），同时使用多线程执行任务时，必须保证任务是多个独立的，且可以同时运行的

异步多线程也是无序的：启动无序，执行顺序不确定，结束无序，每个线程的执行时间也不同

Join方法和Sleep方法的区别

- `Join`方法主要用于等待一个线程执行完毕。当在一个线程里调用另一个线程的`Join`方法时，当前线程会暂停执行,阻塞，直至被调用`Join`方法的线程执行结束。
- `Sleep`方法的作用是让当前正在执行的线程暂停一段时间。在暂停期间，线程不会占用 CPU 资源，过了指定的时间后，线程会继续执行后续代码。

- **作用对象不同**：`Join`方法是针对其他线程使用的，用于等待其他线程执行完毕；而`Sleep`方法是针对当前线程使用的，让当前线程暂停执行。
- **目的不同**：`Join`方法主要用于线程同步，保证一个线程在另一个线程执行完毕后再继续执行；`Sleep`方法主要用于控制线程的执行时间，让线程在一段时间内不占用 CPU 资源。
- **影响范围不同**：`Join`方法会影响调用它的线程，使其等待；`Sleep`方法只会影响当前执行的线程。

### 1.线程的创建与启动

在 C# 中，`System.Threading` 命名空间提供了 `Thread` 类来创建和管理线程。后台线程（也称为守护线程）是一种在程序运行时在后台执行任务的线程。它的主要特点是当程序中所有的非后台线程（也叫用户线程）结束时，后台线程会自动结束，而不管后台线程自己的任务是否完成。

```c#
using System;
using System.Threading;

class Program
{
    static void Main()
    {
        // 创建一个新线程，并指定要执行的方法
        Thread newThread = new Thread(WorkerMethod);
        // 启动线程
        newThread.Start();

        // 主线程继续执行其他任务
        for (int i = 0; i < 5; i++)
        {
            Console.WriteLine($"Main thread: {i}");
            Thread.Sleep(100);
        }
        //将线程设置为后台线程
		newThread.Background = true;
        // 等待新线程执行完毕
        newThread.Join();
    }

    static void WorkerMethod()
    {
        for (int i = 0; i < 5; i++)
        {
            Console.WriteLine($"Worker thread: {i}");
            Thread.Sleep(100);
        }
    }
}
```

`new Thread(WorkerMethod)` 创建了一个新线程，并且指定了该线程要执行的方法 `WorkerMethod`。接着，调用 `Start` 方法来启动线程。`Join` 方法会让主线程等待新线程执行完毕。

### 2. 线程池的使用

频繁创建和销毁线程会带来较大的开销，而线程池可以复用线程，减少这种开销。`System.Threading` 命名空间中的 `ThreadPool` 类可用于管理线程池。当有任务需要执行时，线程池会分配一个 空闲线程执行任务，执行完后线程又回到线程池中等待下一个任务。`ThreadPool.QueueUserWorkItem(WorkerMethod)` 把 `WorkerMethod` 方法添加到线程池的工作队列中，线程池会安排一个空闲线程来执行该方法。

线程池中的线程默认是后台线程。当主线程结束时，如果没有其他的前台线程在执行，程序就会终止，即便线程池中还有未完成的任务

```csharp
using System;
using System.Threading;

class Program
{
    static void Main()
    {
        // 将方法排队到线程池
        ThreadPool.QueueUserWorkItem(WorkerMethod);

        // 主线程继续执行其他任务
        for (int i = 0; i < 5; i++)
        {
            Console.WriteLine($"Main thread: {i}");
            Thread.Sleep(100);
        }

        // 等待一段时间，让线程池中的线程有机会执行
        Thread.Sleep(1000);
    }

    static void WorkerMethod(object state)
    {
        for (int i = 0; i < 5; i++)
        {
            Console.WriteLine($"Worker thread: {i}");
            Thread.Sleep(100);
        }
    }
}
```

### 3.使用 `Task` 和 `async/await`

在.NET 4.0 及更高版本中，`System.Threading.Tasks` 命名空间提供了 `Task` 类和 `async/await` 关键字，让异步编程更加简便。以下是一个使用 `Task` 和 `async/await` 的示例：

```csharp
using System;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        // 创建一个任务
        Task<int> task = Task.Run(() => CalculateSum(1, 100));

        // 主线程可以继续执行其他任务
        Console.WriteLine("Main thread is doing other work...");

        // 等待任务完成并获取结果
        int result = await task;
        Console.WriteLine($"The sum is: {result}");
    }

    static int CalculateSum(int start, int end)
    {
        int sum = 0;
        for (int i = start; i <= end; i++)
        {
            sum += i;
        }
        return sum;
    }
}
```

`Task.Run` 方法会在一个新的线程上执行 `CalculateSum` 方法，并返回一个 `Task<int>` 对象。`await` 关键字会让主线程等待任务完成，并获取任务的结果。

### 4.线程同步

- 同步方法：顺序执行，等待一个方法执行完成，顺序执行下一个。
- 异步方法：不会等待方法执行完成，直接执行下一行，多个线程并发执行，速度较快

当多个线程访问共享资源时，可能会出现数据竞争和不一致的问题，因此需要进行线程同步。C# 提供了多种线程同步机制，如 `lock` 语句、`Mutex`、`Semaphore` 等，并且lock语句后面是接引用类型。以下是一个使用 `lock` 语句的示例：

```csharp
using System;
using System.Threading;

class Program
{
    private static int counter = 0;
    private static readonly object lockObject = new object();

    static void Main()
    {
        Thread t1 = new Thread(IncrementCounter);
        Thread t2 = new Thread(IncrementCounter);

        t1.Start();
        t2.Start();

        t1.Join();
        t2.Join();

        Console.WriteLine($"Counter value: {counter}");
    }

    static void IncrementCounter()
    {
        for (int i = 0; i < 100000; i++)
        {
            // 使用 lock 语句确保同一时间只有一个线程可以访问共享资源
            lock (lockObject)
            {
                counter++;
            }
        }
    }
}
```

`lock` 语句确保了同一时间只有一个线程可以进入临界区，从而避免了数据竞争的问题。

### 5.线程的优先级

在多线程的环境下，操作系统调度线程执行时的一个指标。它可以影响线程获取cpu时间片的概率，优先级高的线程在竞争cpu资源时更有优势，更有可能优先得到执行，但是并不意味着高优先级的线程一定会先执行完，因为操作系统的调度策略还会受到其他因素的影响。

```c#

```



# LINQ

# 异步编程模型

# Json

Json是一种轻量级的数据交换格式，易于人阅读和编写，同时也易于机器解析和生成。它基于JavaScript的一个子集，但采用完全独立于语言的文本格式。Json的基本格式为键值对（字典）

```C#
"Key":Value
```

#### **数据类型**：

- 字符串（必须用双引号）：`"name": "张三"`
- 数字：`"age": 25`
- 布尔值：`"isStudent": true`
- 数组（用方括号 `[]` 包裹）：`"hobbies": ["读书", "跑步"]`
- 对象（用花括号 `{}` 包裹）：`"address": {"city": "北京", "postcode": "100000"}`
- `null`：`"status": null`

#### 序列化和反序列化

 **序列化**是将对象转换为可存储或传输的格式（如 JSON、XML），而 **反序列化（Deserialization）** 则是将这种格式的数据重新转换为对象。

```C#
using System;
using System.Text.Json;

public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    public List<string> Hobbies { get; set; }
}

class Program
{
    static void Main()
    {
        // 对象 → JSON（序列化）
        var person = new Person
        {
            Name = "张三",
            Age = 25,
            Hobbies = new List<string> { "读书", "跑步" }
        };
        string json = JsonSerializer.Serialize(person);
        Console.WriteLine(json);
        // 输出：{"Name":"张三","Age":25,"Hobbies":["读书","跑步"]}

        // JSON → 对象（反序列化）
        string jsonInput = "{\"Name\":\"李四\",\"Age\":30,\"Hobbies\":[\"编程\"]}";
        Person deserializedPerson = JsonSerializer.Deserialize<Person>(jsonInput);
        Console.WriteLine(deserializedPerson.Name); // 输出：李四
    }
}
```

# 协程

#### 核心机制

**基于迭代器模式**
协程通过C#的`IEnumerator`接口实现，利用`yield return`语句暂停执行，返回时保留当前状态（局部变量、执行位置等）。

**Unity的驱动机制**
Unity通过`MonoBehaviour.StartCoroutine()`启动协程，并在每帧检查`yield return`的条件是否满足，决定是否恢复执行。

|                   指令类型                    |              描述               |
| :-------------------------------------------: | :-----------------------------: |
|              `yield return null`              |  等待下一帧继续执行，等待一帧   |
|     `yield return new WaitForSeconds(t)`      | 等待t秒（受Time.timeScale影响） |
|    `yield return new WaitForEndOfFrame()`     |       等待当前帧渲染完成        |
| `yield return new WaitUntil(() => condition)` |    自定义条件满足后继续执行     |
|      `yield return StartCoroutine(...)`       |        嵌套执行其他协程         |

#### 核心作用

**实现非阻塞等待**
在不阻塞主线程的情况下，暂停代码执行，等待特定条件（如时间、事件、资源加载）满足后继续运行。

**简化异步逻辑**
用同步代码风格编写异步操作，避免回调地狱（Callback Hell），提升代码可读性。

**控制代码执行顺序**
精确控制代码的分步执行，适合需要依赖帧循环（如 Unity 的 `Update`）的任务。

**管理复杂的状态机**
将多阶段逻辑（如任务流程、AI 行为）用线性代码表达，替代繁琐的状态切换。

**单线程执行**
协程运行在主线程，无需处理线程同步问题，但无法利用多核CPU。

**生命周期绑定**
协程与所属的`MonoBehaviour`生命周期绑定，对象禁用或销毁时自动终止。

**性能开销**
每个活跃协程约占用几十字节内存，大量协程可能导致GC压力。

![image-20250814173417257](/notes-assets/C%23/assets/image-20250814173417257.png)

# 协变与逆变

协变(Covariance)和逆变(Contravariance)是C#中关于类型转换的两个重要概念，它们描述了泛型类型参数在继承关系中的转换规则。

### 协变(Covariance)

- 允许使用**更派生**的类型作为返回类型
- 用`out`关键字标记
- 适用于**输出位置**（如方法的返回值）

### 逆变(Contravariance)

- 允许使用**更基础**的类型作为参数类型
- 用`in`关键字标记

**作用：**

- **返回值和参数**：使用out修饰的泛型只能作为返回值使用，无法作为参数使用。使用in修饰的返回值只能作为参数使用，无法作为返回值使用
- **里氏转换原则**

```
delegate void Test<in T>(T a);//只能作为返回值使用
delegate T Test1<out T>(); //只能作为参数使用

```

### 规则

1. **协变规则**：
   - 只能用于返回类型
   - 不能用于输入参数
   - 标记为`out`的泛型参数
2. **逆变规则**：
   - 只能用于输入参数
   - 不能用于返回类型
   - 标记为`in`的泛型参数
3. **不变规则**：
   - 既用于输入又用于输出的泛型参数
   - 既不标记为`in`也不标记为`out`

### 标准库中的协变和逆变

**协变接口**

- `IEnumerable<out T>`
- `IEnumerator<out T>`
- `IQueryable<out T>`

**逆变接口**

- `IComparer<in T>`
- `IEqualityComparer<in T>`
- `Action<in T>`

# 预处理指令

预处理指令是在编译前由预处理器处理的特殊指令，以`#`开头。C#中的预处理指令不像C/C++那样强大，主要用于条件编译

## 主要指令分类

**条件编译指令**

```c#
#define DEBUG       // 定义符号
#undef DEBUG       // 取消定义符号

#if DEBUG
    // DEBUG符号定义时编译的代码
#elif RELEASE
    // RELEASE符号定义时编译的代码
#else
    // 其他情况编译的代码
#endif
```

**错误和警告指令**

```c#
#warning "这是一个警告信息"  // 产生编译警告
#error "这是一个错误信息"    // 产生编译错误，阻止编译
```

**区域指令**

```C#
#region 代码块描述
    // 相关代码
#endregion
```

**行号指令**

```C#
#line 200 "SpecialFile.cs"  // 修改编译器报告的行号和文件名
#line default              // 恢复实际行号
```

**杂注指令**

```c#
#pragma warning disable 414, 3021  // 禁用特定警告
#pragma warning restore 3021       // 恢复特定警告
#pragma checksum "file.cs" "{guid}" "校验和" // 用于调试器校验
```

# 特性

特性(Attributes)是C#中用于向程序元素(如类、方法、属性等)添加元数据的强大机制。它们为代码提供了声明性信息，可以在运行时通过反射获取。

通过一个类继承Attributes，即可自定义特性：

：指定特性可以应用在哪些目标上

- `AttributeTargets`：指定应用目标(类、方法、属性等)
- `AllowMultiple`：是否允许多次应用于同一目标
- `Inherited`：是否可被派生类继承

 

```C#
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, 
               AllowMultiple = true, Inherited = false)]
public class MyCustomAttribute : Attribute
{
    public string Description { get; }
    public int Version { get; set; }
    
    public MyCustomAttribute(string description)
    {
        Description = description;
    }
}
```

通过反射读取特性

```C#
// 获取类上的特性
var type = typeof(BusinessClass);
var classAttributes = type.GetCustomAttributes(typeof(MyCustomAttribute), false);//第一个参数是特性的类型，第二个代表搜索继承链
foreach (MyCustomAttribute attr in classAttributes)
{
    Console.WriteLine($"类描述: {attr.Description}, 版本: {attr.Version}");
}

// 获取方法上的特性
var method = type.GetMethod("Calculate");
var methodAttribute = method.GetCustomAttribute<MyCustomAttribute>();
Console.WriteLine($"方法描述: {methodAttribute.Description}");
```

# .Net相关知识

![image-20250806180716918](/notes-assets/C%23/assets/image-20250806180716918.png)

## Unity跨平台的基本原理Mono

![image-20250806181203454](/notes-assets/C%23/assets/image-20250806181203454.png)

![image-20250806181318116](/notes-assets/C%23/assets/image-20250806181318116.png)

![image-20250806181445550](/notes-assets/C%23/assets/image-20250806181445550.png)

# 垃圾回收GC

**总结：在C#中垃圾回收机制是自动化的托管堆内存管理机制，对于在栈上的内存，系统会自动进行内存管理，垃圾回收是应用在堆区的管理内存的机制。具体为将堆上的对象分为3代，分别是0代，1代，2代，默认创建的引用类型的变量都会存储在堆中，并且设置为0代，当0代的内存空间满后会进行垃圾回收机制，将可达的对象也就是创建并且实例的对象放入1代中，不可达的则进行清空。同时将迁移过去的对象按顺序排好，当一代的空间满后进行针对一代的垃圾回收，按照同样的原理进行清空和迁移到2代，如果2代的内存满了之后，触发一次针对所有内存的回收机制，回收所有的内存。大文件默认放在2代处**

**C# 的垃圾回收（GC）是一种自动化的托管堆内存管理机制。其核心是基于“分代假设”，将堆中的对象按存活时间划分为 0、1、2 三代。新创建的对象位于第 0 代；当 0 代空间不足时，GC 会触发回收，清除不再被引用的垃圾对象，并将存活对象提升至第 1 代。同理，当 1 代空间不足时，会回收 1 代并晋升存活对象至第 2 代。而第 2 代空间不足时，则触发一次完整的回收，处理所有代中的对象。该机制自动运作，有效防止内存泄漏，无需开发者手动干预**

## 一、核心思想：自动化内存管理

C# 采用一种名为 **“跟踪回收”** 的自动化内存管理方案。其核心目标是帮助开发者摆脱手动管理内存（如C++中的 `new`/`delete`）的负担，从而**避免内存泄漏和悬空指针**等常见问题。

**基本原理**：
 CLR（公共语言运行时）会定期检查托管堆中的对象，识别哪些对象仍然被应用程序的根对象（如全局变量、静态字段、局部变量、CPU寄存器等）直接或间接引用着。这些对象是“存活”的。而​**​没有任何引用链可以访问到的对象​**​则被判定为“垃圾”，其所占用的内存会被回收。**在C#中垃圾回收会在每一代内存满时进行垃圾回收**

------

## 二、关键机制：分代回收 (Generational GC)

.NET GC基于一个强大的观察经验：**“对象越新，其生命周期越短；对象越老，其存活时间越长”**（即弱代假设）。基于此，它将托管堆上的对象分为三代：

### 三代结构

| 代 (Generation)     | 包含对象                               | 回收频率   | 特点                               |
| :------------------ | :------------------------------------- | :--------- | :--------------------------------- |
| **第 0 代 (Gen 0)** | **新创建**的、生命周期极短的对象       | **非常高** | 容量小（约几MB），回收速度快       |
| **第 1 代 (Gen 1)** | 在第0代GC中**幸存**下来的对象          | **中等**   | 充当 Gen 0 和 Gen 2 之间的缓冲区   |
| **第 2 代 (Gen 2)** | **长期存活**的对象（如静态变量、单例） | **低**     | 容量大，回收耗时较长，又称“完整GC” |

### 工作流程

1. **对象诞生**：新对象（`new`出来的）分配在**Gen 0**。
2. **Gen 0 满**：当Gen 0空间被填满时，CLR会触发一次针对**Gen 0的GC**。
3. **晋升**：GC会标记存活对象，并将它们**提升（Promote）** 到**Gen 1**，然后清空Gen 0。
4. **Gen 1 满**：当Gen 1空间也被填满时，CLR会触发针对**Gen 1的GC**。存活对象被提升到**Gen 2**。
5. **Gen 2 满**：当Gen 2空间满时，触发一次**完整GC**，回收所有代（Gen 0, 1, 2）。这是开销最大的操作。

**这种分代设计的优势**在于，GC可以大部分时间只快速回收Gen 0，而无需遍历整个堆，从而大幅提高了效率。

------

## 三、GC 的两种模式

.NET为不同的应用场景优化了GC行为：

| 模式         | 工作站模式 (Workstation GC)   | 服务器模式 (Server GC)        |
| :----------- | :---------------------------- | :---------------------------- |
| **目标应用** | 客户端应用（如WPF, WinForms） | 高性能服务器应用（如ASP.NET） |
| **核心目标** | **低延迟**，减少UI卡顿        | **高吞吐量**，最大化处理能力  |
| **线程**     | 单线程GC                      | 多线程GC                      |
| **堆**       | 单个托管堆                    | 每个CPU核心一个独立的托管堆   |

------

## 四、对开发者的影响与最佳实践

虽然GC是自动的，但编写不当的代码仍会显著影响其性能。

### 1. 性能开销来源

- **GC暂停**：在进行GC时，应用程序的所有托管线程通常会暂时挂起（STW - Stop The World）。Gen 2 GC的暂停时间明显长于Gen 0。
- **CPU开销**：标记和压缩对象需要消耗CPU计算资源。

### 2. 优化建议（如何减少GC压力）

| 实践                     | 说明                                                 | 例子                                      |
| :----------------------- | :--------------------------------------------------- | :---------------------------------------- |
| **避免不必要的对象分配** | 减少Gen 0的填充速度，降低GC触发频率                  | 在循环或`Update()`中避免`new`引用类型对象 |
| **使用值类型**           | 值类型分配在栈上，方法返回后自动释放，不增加GC负担   | 使用`struct`、`int`、`Vector3`等          |
| **利用对象池**           | 对频繁创建/销毁的对象（如子弹、特效）进行复用        | 创建一个对象池管理类                      |
| **及时解除引用**         | 对不再使用的大对象（如纹理、音频），设置引用为`null` | `largeObject = null;`                     |
| **谨慎使用析构函数**     | 含析构函数的对象需要至少两次GC才能完全回收           | 实现`IDisposable`接口替代                 |

### 3. `IDisposable` 接口

对于需要**手动释放非托管资源**（如文件句柄、数据库连接、网络套接字）的对象，GC爱莫能助。为此，C#提供了 `IDisposable` 模式。

```C#
public class ResourceHolder : IDisposable {
    private FileStream _fileStream; // 非托管资源的包装

    // ... 其他代码 ...

    public void Dispose() {
        _fileStream?.Dispose(); // 手动释放非托管资源
        GC.SuppressFinalize(this); // 告诉GC无需再调用析构函数
    }
}

// 使用 using 语句，确保资源及时释放
using (var resource = new ResourceHolder()) {
    // 使用 resource
} // 超出作用域时，Dispose() 会自动调用
```

------

## 面试回答精要

**问：简述C#的垃圾回收机制。**

**答**：C#的GC是.NET运行时提供的自动化内存管理机制。它采用**分代回收**策略，将对象分为Gen 0、Gen 1、Gen 2三代。新对象分配在Gen 0，当某代空间满时，GC会回收该代及更年轻代中不再被引用的垃圾对象，并将存活对象晋升到下一代。这种设计基于“对象越新越容易死亡”的假设，使得GC可以高效地回收短期对象，大部分时间只需快速清理Gen 0。

虽然GC是自动的，但我们仍应通过减少不必要的堆分配、使用值类型、对象池和`IDisposable`接口等方式来减轻GC压力，从而提升程序性能，尤其是在性能敏感的游戏或服务器应用中。

# ref和out

下面给你一个 **全面、清晰、深入** 的解释，帮助你彻底理解 C# 中的 **`ref`** 和 **`out`** 关键字。

### 🔑 **C# 中的 `ref` 和 `out` 到底有什么区别？**

在 C# 中，`ref` 和 `out` 都用于 **引用传递（pass-by-reference）**。这意味着函数可以**修改实参本身的值**。

但它们的使用目的和规则不同。

| 关键字  | 作用                           | 调用前必须赋值？ | 函数内部必须赋值？ |
| ------- | ------------------------------ | ---------------- | ------------------ |
| **ref** | 双向传递：让函数读取与修改变量 | ✔ 必须初始化     | ❌ 可以不改         |
| **out** | 单向输出：用于返回多个值       | ❌ 不需要初始化   | ✔ 必须赋值         |

------

### 📌 详细解释

### 1. **`ref` 用于“传入 + 传出”**

你可以把 `ref` 理解为：

> “我把这个变量借给你，你可以看也可以改，但我必须先给你一个初始值。”

### 🌟 场景适用：

- 函数需要读取原值
- 函数可能修改原值
- 多返回值（但通常用 tupple / out）

### 🚀 示例：

```csharp
void SetValue(ref int x)
{
    x = x + 10;   // 可以读取 x
}

int a = 5;
SetValue(ref a);   // 传入原值 a
Console.WriteLine(a); // 输出 15
```

------

### 2. **`out` 用于“只传出”**

你可以把 `out` 理解为：

> “你不用给我初值，但函数必须给你一个最终值。”

### 🌟 场景适用：

- 函数要返回多个结果
- 函数需要返回成功/失败，并通过 out 给结果（如 `int.TryParse`）

### 🚀 示例：

```csharp
void GetValue(out int x)
{
    x = 5;   // 必须赋值，否则编译不通过
}

int a;       // 不用初始化
GetValue(out a);
Console.WriteLine(a); // 输出 5
```

------

### 🧪 经典示例：`int.TryParse`

为什么 `TryParse` 结果参数用 `out`？

```csharp
if (int.TryParse("123", out int number))
{
    Console.WriteLine(number); // 123
}
```

理由：

- 输入参数在解析前没有意义 → 不需要初始化
- 函数内部一定会为 number 赋值（成功：结果；失败：0）
- 所以用 `out` 最合适

------

### 🧩 `ref` vs `out` 代码对比

```csharp
void TestRef(ref int x)
{
    Console.WriteLine(x);  // ✔ 可以读取
    x = 20;
}

void TestOut(out int x)
{
    // Console.WriteLine(x); // ❌ 编译错误！不能读取未赋值
    x = 20; // ✔ 必须赋值
}

// 调用
int a = 5;
TestRef(ref a);   // ✔ a 已初始化
int b;
TestOut(out b);   // ✔ 可不初始化
```

IL 层面，`ref` 与 `out` 都是：

```
managed pointer (T&)
```

意思是：

- 都是**真正的引用传递**（不是拷贝，不是指针）
- 但是 **编译器** 对 `ref` 和 `out` 做了不同的语义限制

所以它们的“区别”是语义上的，不是内部实现上的差异。

| C++             | C#                      |
| --------------- | ----------------------- |
| `T& x` 读写引用 | `ref T x`               |
| `T& x` 用作输出 | `out T x`               |
| `T* x` 指针     | `ref T x`（多数情况下） |

## ✔ ref 和 out 可以作用于：

- 值类型（int, struct）
- 引用类型（class 的引用本身）
- 泛型参数（T）

示例：

```csharp
void Reset(ref MyClass obj)  
{
    obj = new MyClass();
}
```

这会修改“引用本身”，而不是对象内部字段！

### ❌ 属性不能作为 ref/out 参数：

```csharp
ref a.Property // 编译错误
```

因为属性不是变量（没有地址）。

| 用法    | 描述                                           |
| ------- | ---------------------------------------------- |
| **ref** | 输入输出参数，必须初始化。                     |
| **out** | 输出参数，调用前不需初始化，函数内部必须赋值。 |
| 本质    | 两者都是引用传递，因此能修改实参。             |
| 区别    | 语法和语义层面不同。                           |

# 异步编程

### Task：

Task 是 .NET Framework 4.0 引入的异步编程模型（TAP - Task-based Asynchronous Pattern）的核心类，用于表示一个异步操作。

```C#

```


