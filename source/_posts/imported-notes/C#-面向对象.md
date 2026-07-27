---
title: 面向对象
date: 2026-06-27 03:32:00
categories:
  - 编程语言
tags:
  - C#
  - 笔记
---
调试和错误处理

```c#
--1.单个try catch异常捕捉
//try块：包含可能会抛出异常的代码。这是需要被监视的代码段，如果其中的代码引发异常，程序将立即跳转到相应的catch块进行异常处理
    
//catch块：当try块中抛出异常时，程序会根据异常的类型，查找与之匹配的catch块进行处理。如果异常类型匹配，程序将执行该catch块中				的代码。可以使用多个catch块来处理不同类型的异常。

//finally块：无论try块中是否抛出异常，finally块中的代码都会被执行。通常用于释放资源，如关闭文件、释放数据库连接等，确保资源的正确释放
class Program
{
    static void Main()
    {
        try
        {
            // 可能会抛出异常的代码
            int result = 10 / 0;
        }
        catch (DivideByZeroException ex)  //分母为0
        {
            // 处理除以零的异常
            Console.WriteLine("除数不能为零：" + ex.Message);
        }
        catch (Exception ex)
        {
            // 处理其他类型的异常
            Console.WriteLine("发生了其他异常：" + ex.Message);
        }
        finally
        {
            // 无论是否抛出异常，都会执行的代码
            Console.WriteLine("这是 finally 块，用于资源清理等操作");
        }
    }
}

--2.多个try catch异常捕捉
try
{
    // 可能引发多种异常的代码
    string str = null;
    Console.WriteLine(str.Length);
}
catch (NullReferenceException ex)
{
    Console.WriteLine("发生了空引用异常：" + ex.Message);
}
catch (IndexOutOfRangeException ex)
{
    Console.WriteLine("发生了索引越界异常：" + ex.Message);
}
catch (Exception ex)
{
    Console.WriteLine("发生了其他异常：" + ex.Message);
}

--3.异常的传播：如果try块中的异常没有被catch块捕获，异常将向上层调用者传播，直到被捕获或程序终止。
    
--4.使用throw关键字：可以在catch块中使用throw关键字重新抛出异常，例如：
try
{
    // 可能引发异常的代码
    int[] arr = new int[5];
    Console.WriteLine(arr[10]);
}
catch (IndexOutOfRangeException ex)
{
    Console.WriteLine("发生了索引越界异常：" + ex.Message);
    throw; // 重新抛出异常
}
//当发生IndexOutOfRangeException时，先打印异常信息，然后使用throw重新抛出异常，使得异常可以继续向上层传播，让上层调用者知道发生了这个异常
```

## 类和对象

- 在类的继承中，子类是不会继承基类的构造函数，但是可以通过base关键字调用父类的构造器`：base()`
- 类成员的访问级别不能高于所在类的访问级别，如果类的是`internal class`只能在当前程序集里面进行访问，那么该类的成员无论怎样设置访问修饰符，其实际可访问范围最大只能达到和类本身一样，也就是在当前程序集内可访问

```c#
using System;

// 定义基类
class Vehicle
{
    // 字段
    protected string brand;
    // 构造函数
    public Vehicle(string brand)
    {
        this.brand = brand;
    }
    // 虚方法，用于多态
    public virtual void ShowInfo()
    {
        Console.WriteLine($"这是一辆 {brand} 的车。");
    }
}

// 定义派生类，继承自 Vehicle
class Car : Vehicle
{
    private int doors;
    // 派生类的构造函数
    public Car(string brand, int doors) : base(brand)
    {
        this.doors = doors;
    }
    // 重写基类的虚方法
    public override void ShowInfo()
    {
        Console.WriteLine($"这是一辆 {brand} 的汽车，有 {doors} 个车门。");
    }
}

class Program
{
    static void Main()
    {
        // 创建基类实例
        Vehicle genericVehicle = new Vehicle("通用");
        genericVehicle.ShowInfo();

        // 创建派生类实例
        Car myCar = new Car("丰田", 4);
        myCar.ShowInfo();

        // 多态的体现：基类引用指向派生类对象
        Vehicle anotherCar = new Car("宝马", 2);
        anotherCar.ShowInfo();
    }
}
//类的定义与字段：
Vehicle 类是基类，有一个受保护的字段 brand，可被派生类访问。
Car 类是 Vehicle 的派生类，有自己的私有字段 doors。

//构造函数：
Vehicle 类的构造函数用于初始化 brand 字段。
Car 类的构造函数通过 : base(brand) 调用基类的构造函数来初始化 brand，并初始化自己的 doors 字段。

//方法与多态：    
Vehicle 类的 ShowInfo 方法被定义为 virtual（虚方法），允许派生类重写。
Car 类使用 override 关键字重写了 ShowInfo 方法，以提供特定于汽车的信息。
在 Main 方法中，通过基类引用 anotherCar 指向派生类 Car 的对象，调用 ShowInfo 方法时执行的是 Car 类重写后的方法，体现了多态性。

```

## 属性

```c#
using System;

// 1. 基本属性示例
class Person
{
    // 私有字段
    private string name;

    // 基本属性，封装对私有字段的访问
    public string Name
    {
        get { return name; }
        set { name = value; }
    }
}

// 2. 自动实现的属性示例
class Book
{
    // 自动实现属性，编译器自动处理背后的字段
    public string Title { get; set; }
    public int PageCount { get; set; }
}

// 3. 只读属性示例
class Square
{
    private double sideLength;

    public Square(double sideLength)
    {
        this.sideLength = sideLength;
    }

    // 只读属性，根据边长计算面积，不可外部设置
    public double Area
    {
        get { return sideLength * sideLength; }
    }
}

// 4. 属性访问修饰符示例
class BankAccount
{
    private decimal balance;

    public decimal Balance
    {
        get { return balance; }
        // 私有 set 访问器，限制外部直接修改余额
        private set { balance = value; }
    }

    public void Deposit(decimal amount)
    {
        if (amount > 0)
        {
            Balance += amount;
        }
    }
}

class Program
{
    static void Main()
    {
        // 基本属性测试
        Person person = new Person();
        person.Name = "Alice";  //调用Name函数的set
        Console.WriteLine($"Person 的姓名: {person.Name}");

        // 自动实现的属性测试
        Book book = new Book();
        book.Title = "C# 入门指南";
        book.PageCount = 200;
        Console.WriteLine($"Book 的标题: {book.Title}, 页数: {book.PageCount}");

        // 只读属性测试
        Square square = new Square(5);
        Console.WriteLine($"Square 的面积: {square.Area}");

        // 属性访问修饰符测试
        BankAccount account = new BankAccount();
        account.Deposit(1000);
        Console.WriteLine($"BankAccount 的余额: {account.Balance}");
    }
}
```

## 匿名类型

```c#
using System;
using System.Linq;

class Program
{
    static void Main()
    {
        // 1. 创建匿名类型对象
        var person = new { Name = "张三", Age = 25 };
        Console.WriteLine($"姓名：{person.Name}，年龄：{person.Age}");

        // 2. 尝试修改匿名类型属性（会编译报错）
        // person.Name = "李四"; 

        // 3. 匿名类型的相等性比较
        var obj1 = new { Value = 10 };
        var obj2 = new { Value = 10 };
        bool areEqual = obj1.Equals(obj2);
        Console.WriteLine($"两个对象是否相等：{areEqual}");

        // 4. 匿名类型在 LINQ 查询中的使用
        int[] numbers = { 1, 2, 3, 4, 5 };
        var result = numbers.Select(n => new { Number = n, Squared = n * n });
        foreach (var item in result)
        {
            Console.WriteLine($"数字：{item.Number}，平方：{item.Squared}");
        }
    }
}
//创建匿名类型对象：使用 new { Name = "张三", Age = 25 } 创建一个包含 Name 和 Age 属性的匿名类型对象，并将其赋值给 var 类型的变量 person，随后打印出对象的属性值。

//尝试修改属性：注释掉的 person.Name = "李四"; 代码展示了匿名类型属性的只读特性，若取消注释会导致编译错误。

//相等性比较：创建两个具有相同属性和属性值的匿名类型对象 obj1 和 obj2，使用 Equals 方法比较它们是否相等，并输出比较结果。

//在 LINQ 查询中使用：利用 LINQ 的 Select 方法对整数数组 numbers 进行查询，为每个元素创建一个包含 Number（原始数字）和 Squared（数字平方）属性的匿名类型对象，最后遍历结果并打印每个对象的属性值。
```

## 栈（Stack）

概念 : 栈属于后进先出（LIFO）的数据结构，其用途是存储方法调用的上下文信息以及局部变量。每当调用一个方法时，系统会在栈上为该方法分配一块内存，此内存被称作栈帧（Stack Frame），它用于存储该方法的局部变量、参数以及返回地址等信息。当方法执行完毕，对应的栈帧会被销毁，其占用的内存也会被释放。

特点

- **内存分配和释放速度快**：栈的内存分配和释放由系统自动完成，只需移动栈指针，所以速度极快。
- **空间有限**：栈的空间相对较小，若递归调用过深或者局部变量占用内存过大，可能引发栈溢出（Stack Overflow）异常。
- **数据存储的生命周期短**：栈上的数据会随着方法的结束而被销毁，生命周期较短。

示例代码

```csharp
using System;

class Program
{
    static void Main()
    {
        int a = 10; // 局部变量 a 存储在栈上
        int b = 20; // 局部变量 b 存储在栈上
        int sum = Add(a, b);
        Console.WriteLine($"Sum: {sum}");
    }

    static int Add(int x, int y)
    {
        int result = x + y; // 局部变量 result 存储在栈上
        return result;
    }
}
```

在这段代码中，`Main` 方法和 `Add` 方法里的局部变量 `a`、`b`、`x`、`y` 以及 `result` 都存于栈上。

## 堆（Heap）

概念 : 堆是用于动态分配内存的区域，主要用来存储引用类型的对象。当运用 `new` 关键字创建一个对象时，系统会在堆上为该对象分配一块内存，同时返回一个指向该对象的引用，这个引用存储在栈上。

特点

- **内存分配和释放速度相对较慢**：堆的内存分配和释放需要进行复杂的内存管理操作，所以速度相对较慢。
- **空间较大**：堆的空间相对较大，能够存储大量的对象。
- **数据存储的生命周期长**：堆上的对象不会随方法的结束而被销毁，而是由垃圾回收器（Garbage Collector，GC）负责回收不再使用的对象所占用的内存。

示例代码

```csharp
using System;

class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}

class Program
{
    static void Main()
    {
        Person person = new Person(); // 在堆上创建一个 Person 对象
        person.Name = "John";
        person.Age = 30;
        Console.WriteLine($"Name: {person.Name}, Age: {person.Age}");
    }
}
```

在上述代码中，借助 `new Person()` 在堆上创建了一个 `Person` 对象，变量 `person` 存储的是该对象的引用，此引用存于栈上。

## 静态存储区

概念:静态存储区用于存储静态变量、常量以及全局数据等。静态变量和常量在程序启动时就会被分配内存，并且在整个程序的生命周期内都存在。

特点

- **内存分配和释放由系统管理**：静态存储区的内存分配和释放由系统自动完成，无需程序员手动管理。
- **数据存储的生命周期长**：静态变量和常量在程序启动时就被分配内存，直至程序结束才会被释放。

示例代码

```csharp
using System;

class Program
{
    static int staticVariable = 10; // 静态变量存储在静态存储区
    const int constantValue = 20; // 常量存储在静态存储区

    static void Main()
    {
        Console.WriteLine($"Static Variable: {staticVariable}");
        Console.WriteLine($"Constant Value: {constantValue}");
    }
}
```

在这段代码中，`staticVariable` 是静态变量，`constantValue` 是常量，它们都存储在静态存储区。



## `this` 关键字

- **作用**：引用当前类的实例。
- 常见用法
  - **区分同名成员**：方法参数与类成员同名时，用 `this` 明确访问类成员。
  - **构造函数重载调用**：在一个构造函数里调用同类其他构造函数。
- **示例**

```csharp
class MyClass
{
    private int num;
    public MyClass(int num)
    {
        this.num = num; 
    }
    public MyClass() : this(0) {} 
}
```

## `base` 关键字

- **作用**：在派生类中访问基类成员。

- 常见用法

  - **调用基类方法**：派生类重写基类方法后，用 `base` 调用基类原始实现。
  - **调用基类构造函数**：在派生类构造函数中调用基类构造函数。

  

- **示例**

```csharp
class BaseClass
{
    public virtual void Print() { Console.WriteLine("Base"); }
}
class DerivedClass : BaseClass
{
    public DerivedClass() : base() {} 
    public override void Print()
    {
        base.Print(); 
        Console.WriteLine("Derived");
    }
}
```

## 虚方法

虚方法用于实现多态，允许派生类重写基类方法。

|    **特性**    |      **抽象方法（abstract）**      |         **虚方法（virtual）**          |
| :------------: | :--------------------------------: | :------------------------------------: |
|    **定义**    |  只有声明，无方法体（以分号结束）  |        有默认实现（包含方法体）        |
|   **关键字**   |             `abstract`             |               `virtual`                |
|   **所在类**   |         必须在抽象类中声明         |         可在任何非密封类中声明         |
|  **子类要求**  |     子类必须重写（`override`）     |         子类可选择重写或不重写         |
| **实例化限制** |          抽象类不能实例化          |        包含虚方法的类可以实例化        |
|  **设计目的**  | 强制子类实现特定行为（接口式约束） | 提供可选的默认行为，允许子类扩展或修改 |

**声明与重写**

- 基类用 `virtual` 声明虚方法，可提供默认实现。

```csharp
class Shape
{
    public virtual double Area()
    {
        return 0;
    }
}
```

- 派生类用 `override` 重写虚方法，提供新实现。

```csharp
class Circle : Shape
{
    private double radius;
    public Circle(double radius) { this.radius = radius; }
    public override double Area()
    {
        return Math.PI * radius * radius;
    }
}
```

**运行时绑定**

调用虚方法时，根据对象实际类型决定执行的方法版本。

```csharp
class Program
{
    static void Main()
    {
        Shape circle = new Circle(5);
        Console.WriteLine($"Circle area: {circle.Area()}"); 
    }
}
```

这里 `circle` 虽声明为 `Shape` 类型，但实际是 `Circle` 对象，所以调用 `Circle` 类重写的 `Area` 方法。

**注意要点**

- 只有基类 `virtual` 方法能被 `override` 重写。

- 重写方法签名要和基类虚方法一致。

- 可用 `base` 在派生类重写方法里调用基类虚方法。

  

## 抽象类

在 C# 中，抽象类是一种特殊的类，它为派生类提供了一个通用的模板，是实现多态性和代码复用的重要工具。以下将详细介绍抽象类的相关内容。

**定义**:抽象类是使用 `abstract` 关键字修饰的类。它不能被实例化，主要用于作为其他类的基类，为派生类提供一个公共的接口和部分实现。抽象类可以包含抽象成员（抽象方法、抽象属性等）和非抽象成员。

**特点**:

- **不能实例化**：无法使用 `new` 关键字直接创建抽象类的对象，因为无法使用类中的抽象方法（没有实现，没有方法体）。
- **可包含抽象成员**：抽象成员只有声明，没有具体的实现，派生类必须实现这些抽象成员。
- **可包含非抽象成员**：抽象类中可以有普通的方法、属性、字段等，这些成员有具体的实现。
- **作为基类**：抽象类主要用于被其他类继承，为派生类提供公共的行为和属性，派生类必须实现基类的抽象方法。
- **访问修饰符**：抽象类不可以为private，但是其中的变量可以是private，抽象方法不可以是private
- 抽象类使用 `virtual` 关键字实现接口方法时，意味着该方法有默认的实现，但允许子类对其进行修改。

**语法**

```csharp
// 定义抽象类
abstract class 抽象类名
{
    // 抽象方法
    public abstract 返回类型 抽象方法名(参数列表);只有声明，没有定义

    // 非抽象方法
    public 返回类型 非抽象方法名(参数列表)
    {
        // 方法实现
    }

    // 抽象属性
    public abstract 属性类型 属性名 { get; set; }

    // 非抽象属性
    public 属性类型 非抽象属性名 { get; set; }
}
```

**示例代码**

```csharp
using System;
class Program
{
    static void Main(string[] args)
    {
        IVehicle v = new Car();
        v.Run();
        v.Stop();

    }
    
    interface IvehicleBase
    {
        void Run();
        void Stop();
        void Fill();
    }
    
    abstract class IVehicle:IvehicleBase
    {
        public abstract void Run(); //抽象类可以不完全实现接口的方法，将其交给抽象类的子类进行实现
        public virtual void Stop()   //抽象类可以使用virtual关键字实现接口的方法，并且抽象类的派生类也可以进行重写
        {
            Console.WriteLine("stopped");
        }
        public  void Fill()  //抽象类实现接口的部分方法时，不能在该实现的方法上面加上abstract；
        {
            Console.WriteLine("Null");
        }
    }
    
   class Car : IVehicle {

        public override void Run()
        {
            Console.WriteLine("Car is running");
        }
        public override void Stop()
        {
            Console.WriteLine("Stopped,car");
        }
    }
    
    class Truck : IVehicle
    {
        public override void Run()
        {
            Console.WriteLine("Truck is running");
        }
        public override void Stop()
        {
            Console.WriteLine("Stopped,truck");
        }
    }


}
```

**代码解释**

- **抽象类 `Animal`**：包含一个抽象方法 `MakeSound()` 和一个非抽象方法 `Sleep()`。由于 `MakeSound()` 是抽象方法，没有具体实现，派生类必须重写该方法。
- **派生类 `Dog` 和 `Cat`**：继承自抽象类 `Animal`，并实现了抽象方法 `MakeSound()`，分别给出了狗和猫发出声音的具体实现。
- **`Main` 方法**：尝试创建抽象类 `Animal` 的对象会导致编译错误，因为抽象类不能实例化。创建了 `Dog` 和 `Cat` 的对象，并调用了它们的 `MakeSound()` 和 `Sleep()` 方法。

**抽象类与虚方法的区别** 

- **抽象方法必须在抽象类中**：抽象方法只能在抽象类中声明，且没有方法体，派生类必须实现。而虚方法可以在普通类中声明，有默认实现，派生类可以选择重写。
- **抽象类不能实例化**：抽象类的主要作用是为派生类提供一个统一的接口和部分实现，必须通过派生类来使用。而普通类可以直接实例化。

## 密封类

```c#
//防止其他开发者错误或恶意地继承该类并修改其行为，保证类的实现细节不被改变，维护代码的安全性和完整性。例如，某些包含敏感业务逻辑或核心算法的类，使用密封类可以避免其被错误扩展而影响系统的正常运行。
//编译器在处理密封类时，由于知道它不会有派生类，可能会进行一些特定的优化，从而提高代码的执行效率。

sealed class 类名
{
    // 类的成员（字段、属性、方法等）
}

// 密封类
sealed class FinalClass
{
    public void PrintMessage()
    {
        Console.WriteLine("This is a sealed class.");
    }
}

class Program
{
    static void Main()
    {
        FinalClass fc = new FinalClass();
        fc.PrintMessage();

        // 以下代码会导致编译错误，因为 FinalClass 是密封类，不能被继承
        // class DerivedClass : FinalClass { } 
    }
}

```

**代码解释**

- `FinalClass` 是一个密封类，使用 `sealed` 关键字修饰。它包含一个 `PrintMessage` 方法用于输出信息。
- 在 `Main` 方法中，创建了 `FinalClass` 的对象并调用了 `PrintMessage` 方法。
- 若尝试定义一个继承自 `FinalClass` 的 `DerivedClass`，编译器会报错，因为密封类不允许被继承。

## 程序修饰符

#### 访问修饰符

- **`public`**：可在任何地方访问。
- **`private`**：仅能在声明它的类内部访问，这也是类成员的默认访问修饰符。
- **`protected`**：可以在声明它的类及其派生类中访问。
- **`internal`**：能在同一程序集内访问。
- **`protected internal`**：可在同一程序集内访问，或者在不同程序集的派生类中访问。
- **`private protected`**：能在声明它的类及其同一程序集内的派生类中访问。

#### 其他修饰符

#### 类修饰符

- **`abstract`**：表明该类是抽象类，无法实例化，且可包含抽象成员。
- **`sealed`**：表明该类不能被继承。
- **`static`**：表明该类仅包含静态成员，不能被实例化。

#### 成员修饰符

- **`static`**：表明该成员属于类，而非类的实例。
- **`virtual`**：表明该方法、属性、索引器或事件可在派生类中被重写。
- **`override`**：表明该方法、属性、索引器或事件重写了基类中的虚成员。
- **`readonly`**：表明该字段只能在声明时或构造函数中赋值。
- **`const`**：表明该字段是常量，在编译时就已确定值。

#### 方法修饰符

- **`async`**：表明该方法是异步方法。
- **`extern`**：表明该方法的实现是在外部代码（如 C++ DLL）中。

## 静态

```c#
//1.静态类--静态类只能包含静态成员，不能被实例化，通常用于工具类或者包含一些通用的方法和属性。
// 定义一个静态类
public static class MathHelper
{
    // 静态字段
    public static readonly double Pi = 3.14159265358979;

    // 静态方法
    public static double CalculateCircleArea(double radius)
    {
        return Pi * radius * radius;
    }
}

class Program
{
    static void Main()
    {
        // 直接通过类名访问静态成员
        double area = MathHelper.CalculateCircleArea(5);
        Console.WriteLine($"半径为 5 的圆的面积是: {area}");
    }
}

//2. 静态成员
//2.1 静态字段--静态字段属于类，所有实例共享该字段。
public class Counter
{
    // 静态字段，用于记录创建的实例数量
    public static int InstanceCount;

    public Counter()
    {
        InstanceCount++;
    }
}

class Program
{
    static void Main()
    {
        Counter c1 = new Counter();
        Counter c2 = new Counter();

        // 直接通过类名访问静态字段
        Console.WriteLine($"创建的实例数量: {Counter.InstanceCount}"); 
    }
}

//2.2 静态方法--静态方法可以直接通过类名调用，不需要创建类的实例。静态方法只能访问静态成员。
public class StringUtils
{
    // 静态方法，用于反转字符串
    public static string ReverseString(string input)
    {
        char[] charArray = input.ToCharArray();
        Array.Reverse(charArray);
        return new string(charArray);
    }
}

class Program
{
    static void Main()
    {
        string original = "Hello";
        string reversed = StringUtils.ReverseString(original);
        Console.WriteLine($"反转后的字符串: {reversed}");
    }
}

//3.静态构造函数--静态构造函数用于初始化静态字段，它在类的任何静态成员被访问之前自动调用，并且只调用一次。
public class MyClass
{
    public static int StaticField;

    // 静态构造函数
    static MyClass()
    {
        StaticField = 10;
        Console.WriteLine("静态构造函数被调用");
    }
}

class Program
{
    static void Main()
    {
        // 访问静态字段，触发静态构造函数
        Console.WriteLine($"静态字段的值: {MyClass.StaticField}");
    }
}
```

## 接口

在 C# 里，接口是一种引用类型，它定义了一组方法的签名，不过没有包含这些方法的实现。接口能够被类或者结构体实现，而且一个类或结构体可以实现多个接口。同时，接口也是解耦合的核心工具，如紧耦合，一个类直接依赖另外一个类（在类中定义另外一个类），在这种情况下，可以通过添加接口功能将依赖关系移除，如下列代码

```C#
using System;
class Program
{
    static void Main(string[] args)
    {
        var user = new User(new Xm());//依赖注入是一种设计模式，它允许你将对象的依赖关系（在这个例子中是 User 类对手机对象的依赖）从对象内部转移到对象外部。在 User 类中，通过构造函数接收一个 Iphone 类型的参数，从而实现了依赖注入
        user.Do();
        var U = new User(new Rm());
        U.Do();
    }
    class User
    {
        private Iphone phone;
        public User(Iphone _phone)
        {
            phone = _phone;
        }
        public void Do()
        {
            phone.Dosomething();
        }
    }
    interface Iphone
    {
        void Dosomething();
    }
    class Xm : Iphone {
        public void Dosomething()
        {
            Console.WriteLine("Xm am doing it");
        }
        
    }
    class Rm : Iphone
    {
        public void Dosomething()
        {
            Console.WriteLine("Rm am doing it");
        }
    }

}
```

**抽象类与接口的异同**

*相同点* ：

- 纯抽象类和接口都不能直接实例化，主要用于定义规范，供具体类去实现
- 二者都为实现它们的类提供了一套行为规范。实现接口或者继承纯抽象类的类，都需要实现其中定义的抽象成员。

*不同点*：

- 接口只能包含方法、属性、事件和索引器的声明，不能包含字段和实现代码。纯抽象类可以包含抽象成员和具体成员，并且可以有字段。
- 一个类可以实现多个接口。一个类只能继承一个抽象类。
- 接口中的成员默认是 `public` 的，并且不能使用其他访问修饰符。抽象类中的成员可以使用不同的访问修饰符，如 `private`、`protected` 等。
- 依赖注入就是让一个东西（类）的依赖（所需的其他东西）从外部提供，而不是自己创建。虽然从表面上看，用实现接口的类的实例去满足接口的依赖，有点像用子类实例化父类，但接口和父类在本质、实现方式等方面是不同的。

#### **IEnumerable` 和 `ICollection接口**

**`IEnumerable` 接口**：

- `IEnumerable` 接口定义于 `System.Collections` 命名空间，它是所有非泛型集合的基础接口，而 `IEnumerable<T>` 接口则是所有泛型集合的基础接口。这个接口仅定义了一个方法 `GetEnumerator()`，该方法用于返回一个可用于遍历集合元素的枚举器。**当一个类实现了IEnumerable接口时，那么这个类则可以被foreach遍历**
  - **支持 `foreach` 循环**：实现了 `IEnumerable` 接口的类可以使用 `foreach` 循环来遍历集合中的元素。
  - **延迟执行**：`IEnumerable` 支持延迟执行，这意味着在真正需要数据时才会执行查询。这对于处理大型数据集时非常有用，可以提高性能。
  - **LINQ 查询**：LINQ（Language Integrated Query）查询可以直接应用于实现了 `IEnumerable` 接口的对象。

**ICollection接口**：

- `ICollection` 接口继承自 `IEnumerable` 接口，它在 `IEnumerable` 的基础上提供了更多的功能，比如获取集合中元素的数量、判断集合是否为只读等。`ICollection<T>` 是泛型版本的 `ICollection` 接口。
  - **集合信息获取**：可以使用 `Count` 属性获取集合中元素的数量，使用 `IsReadOnly` 属性判断集合是否为只读。
  - **元素操作**：提供了一些方法来操作集合中的元素，如 `Add`、`Remove`、`Contains` 等。
  - **同步访问**：`ICollection` 接口提供了 `SyncRoot` 和 `IsSynchronized` 属性，用于支持线程安全的集合访问。

```C#
using System;
using System.Collections;

class MyCollection : IEnumerable
{
    private int[] items = { 1, 2, 3, 4, 5 };

    public IEnumerator GetEnumerator()
    {
        return items.GetEnumerator();
    }
}

class Program
{
    static void Main()
    {
        MyCollection collection = new MyCollection();
        foreach (int item in collection)
        {
            Console.WriteLine(item);
        }
    }
}
```

```C#
using System;
using System.Collections.Generic;

class Program
{
    static void Main()
    {
        List<int> numbers = new List<int> { 1, 2, 3, 4, 5 };
        ICollection<int> collection = numbers;

        Console.WriteLine("Count: " + collection.Count);
        Console.WriteLine("IsReadOnly: " + collection.IsReadOnly);

        if (!collection.IsReadOnly)
        {
            collection.Add(6);
        }

        foreach (int item in collection)
        {
            Console.WriteLine(item);
        }
    }
}
```

接口的显式实现：接口显式实现是一种特殊的实现接口成员的方式。当一个类实现了多个接口，而这些接口存在同名成员时，或者你想隐藏接口成员的公共访问时，就可以采用显式实现。

- **解决命名冲突**：当一个类实现多个接口，且这些接口有同名成员时，显式实现能避免歧义。
- **隐藏接口成员**：显式实现的接口成员只能通过接口类型的引用访问，不能通过类的实例访问，从而实现了接口成员的隐藏。

```c#
using System;
class Program {
    static void Main(string[] args) {
        var killer = new warmkill();
        killer.Love();
        //killer.kill();  报错，找不到kill方法
        Kill killers = new warmkill();
        killers.kill();  //以显示接口的名称进行调用，即可找到


    }
    interface love
    {
        void Love();
    }
    interface Kill
    {
        void kill();
    }
    class warmkill : love, Kill
    {
        public void Love()
        {
            Console.WriteLine("L O V E");
        }
        void Kill.kill()  // 接口的显示实现，类外无法直接使用
        {
            Console.WriteLine("K I L L");
        }
    }
    
}


```



```c#
//1.接口的定义与实现--接口使用interface关键字来定义，其方法默认是public的，不需要显式地声明访问修饰符
// 定义一个接口
interface IAnimal
{
    void Eat();
    void Sleep();
}

// 实现接口的类
class Dog : IAnimal
{
    public void Eat()
    {
        Console.WriteLine("Dog is eating.");
    }

    public void Sleep()
    {
        Console.WriteLine("Dog is sleeping.");
    }
}

class Program
{
    static void Main()
    {
        Dog dog = new Dog();
        dog.Eat();
        dog.Sleep();
    }
}
//2.接口的继承--接口可以继承其他接口，这意味着一个接口能够从另一个接口继承方法签名

// 定义一个基础接口
interface IAnimal
{
    void Eat();
}

// 定义一个继承自 IAnimal 的接口
interface IBird : IAnimal
{
    void Fly();
}

// 实现 IBird 接口的类
class Eagle : IBird//继承IBird接口后，必须将Ibird接口继承的接口也进行实现
{
    public void Eat()
    {
        Console.WriteLine("Eagle is eating.");
    }

    public void Fly()
    {
        Console.WriteLine("Eagle is flying.");
    }
}

class Program
{
    static void Main()
    {
        Eagle eagle = new Eagle();
        eagle.Eat();
        eagle.Fly();
    }
}
//3.接口的多态--多态性允许你使用基类型（这里是接口类型）的引用来引用派生类型（实现接口的类）的对象
interface IAnimal
{
    void MakeSound();
}

class Dog : IAnimal
{
    public void MakeSound()
    {
        Console.WriteLine("Woof!");
    }
}

class Cat : IAnimal
{
    public void MakeSound()
    {
        Console.WriteLine("Meow!");
    }
}

class Program
{
    static void Main()
    {
        IAnimal[] animals = new IAnimal[2];
        animals[0] = new Dog();
        animals[1] = new Cat();

        foreach (IAnimal animal in animals)
        {
            animal.MakeSound();
        }
    }
}
```

## 索引器

在 C# 里，索引器属于特殊的类成员，其作用类似于属性，不过它可以借助索引来访问对象中的元素，就像访问数组一样

```c#
using System;

class MyList  //给类中的私有数组进行赋值
{
    private int[] data = new int[10];

    // 定义索引器
    public int this[int index] 
    {
        get
        {
            if (index < 0 || index >= data.Length)
            {
                throw new IndexOutOfRangeException("索引超出范围");
            }
            return data[index];
        }
        set
        {
            if (index < 0 || index >= data.Length)
            {
                throw new IndexOutOfRangeException("索引超出范围");
            }
            data[index] = value;
        }
    }
}

class Program
{
    static void Main()
    {
        MyList list = new MyList();

        // 设置元素
        list[0] = 10;
        list[1] = 20;

        // 获取元素
        Console.WriteLine(list[0]);
        Console.WriteLine(list[1]);
    }
}
```



二维索引器

```c#
using System;

class Matrix
{
    private int[,] data = new int[3, 3];  //给类中的二维数组赋值

    // 定义二维索引器
    public int this[int row, int col]
    {
        get
        {
            return data[row, col];
        }
        set
        {
            data[row, col] = value;
        }
    }
}

class Program
{
    static void Main()
    {
        Matrix matrix = new Matrix();

        // 设置元素
        matrix[0, 0] = 1;
        matrix[0, 1] = 2;

        // 获取元素
        Console.WriteLine(matrix[0, 0]);
        Console.WriteLine(matrix[0, 1]);
    }
}
```

## 运算符重载

在 C# 里，运算符重载能够让自定义类型像内置类型那样使用运算符。这意味着你可以为自定义类或者结构体定义诸如 `+`、`-`、`*`、`/` 等运算符的行为。运算符重载的规则

- **方法声明**：运算符重载方法必须是 `public` 和 `static` 的。
- **方法命名**：使用 `operator` 关键字，后面紧跟要重载的运算符。
- **参数数量**：运算符重载方法的参数数量取决于运算符是一元还是二元的。一元运算符有一个参数，二元运算符有两个参数。

一元运算符重载

```c#
using System;

class Point
{
    public int X { get; set; }
    public int Y { get; set; }

    public Point(int x, int y)
    {
        X = x;
        Y = y;
    }

    // 重载一元 + 运算符
    public static Point operator +(Point p)
    {
        return p;
    }

    // 重载一元 - 运算符
    public static Point operator -(Point p)
    {
        return new Point(-p.X, -p.Y);
    }

    public override string ToString()
    {
        return $"({X}, {Y})";
    }
}

class Program
{
    static void Main()
    {
        Point p1 = new Point(10, 20);

        Point positiveP1 = +p1;
        Point negativeP1 = -p1;

        Console.WriteLine($"Positive: {positiveP1}");
        Console.WriteLine($"Negative: {negativeP1}");
    }
}
```

二元运算符重载

```c#
using System;

class Vector
{
    public int X { get; set; }
    public int Y { get; set; }

    public Vector(int x, int y)
    {
        X = x;
        Y = y;
    }

    // 重载二元 + 运算符
    public static Vector operator +(Vector v1, Vector v2)
    {
        return new Vector(v1.X + v2.X, v1.Y + v2.Y);
    }

    // 重载二元 - 运算符
    public static Vector operator -(Vector v1, Vector v2)
    {
        return new Vector(v1.X - v2.X, v1.Y - v2.Y);
    }

    public override string ToString()
    {
        return $"({X}, {Y})";
    }
}

class Program
{
    static void Main()
    {
        Vector v1 = new Vector(10, 20);
        Vector v2 = new Vector(30, 40);

        Vector sum = v1 + v2;
        Vector difference = v1 - v2;

        Console.WriteLine($"Sum: {sum}");
        Console.WriteLine($"Difference: {difference}");
    }
}
```

### 可重载和不可重载的运算符

- **可重载的运算符**：算术运算符（`+`、`-`、`*`、`/`、`%` 等）、逻辑运算符（`&`、`|`、`^` 等）、比较运算符（`==`、`!=`、`<`、`>` 等）。
- **不可重载的运算符**：赋值运算符（`=`、`+=`、`-=` 等）、条件逻辑运算符（`&&`、`||`）、成员访问运算符（`.`）、三元运算符（`?:`）等。

## 集合类 列表List

在 C# 里，`List<T>` 属于泛型集合类，它存在于 `System.Collections.Generic` 命名空间下。`List<T>` 提供了动态数组的功能，意味着它能在运行时动态调整大小。

列表内部数据是使用数组进行的存储，一个空的列表内部会有一个长度为0的数组，当给列表中添加元素的时候，列表的容量会扩大为4，如果添加第5个的时候，列表的大小会重新设置为8，如果添加第9个元素，列表容量会扩大为16，依次增加。当列表的中的容量发生改变的时候，它会创建一个新的数组，使用Array.CopyO方法将旧数组中的元素复制到新数组中。

```C#
using System;
using System.Collections.Generic;
namespace CSharp_project
{
    class Program
    {
        static void Main(string[] args)
        {
            List<int> list = new List<int>() { 1,2,3,4};  //初始化，其中的括号用于指定列表的容量
            list.Add(1);
            list.Add(2);  //添加

            list[3] = 7;//修改下标为3的元素的值为7
			Console.WriteLine(list.capacity);//列表的容量，2，4，8，16...
            list.Insert(0, 2);  //在下标为0的位置，插入数据2.插在下标的前面
            
            
            //删除
            list.Remove(1);   //删除数据为1的数据，并且只会删除匹配的第一个数据
            list.RemoveAt(3);  //删除下标为3的数据
            list.RemoveAll()
            
                
            //查询数据
            Console.WriteLine(list.IndexOf(320));  //从前往后查找
            Console.WriteLine(list.LastIndexOf(32));//从后往前查询
            
            //列表的排序
            list.sort();
            
            for (int i = 0; i < list.Count; i++) { 
                Console.WriteLine(list[i]);   //循环输出
            }
            foreach(int i in list){
                Console.WriteLine(list[i]);
            }
        }
    }
}
 
```

## 泛型编程

C# 泛型编程允许你创建独立于具体数据类型的类、接口、方法和委托。使用泛型，你可以编写可重用的代码，提高代码的类型安全性和性能。

##### 泛型类

```c#
//类似于c++模板，在创建类时，不指定类的参数的类型，给一个抽象的数据类型，在调用时，指定类型
using System; 

class Progarm
{
    static void Main(string[] args)
    {
        Apple apple = new Apple() { Cargo = "apple"};
        Book book = new Book() {Cargo = "Book" };
        Box<Apple> box1 = new Box<Apple>(){ Tcargo = apple };
        Box<Book> box2 = new Box<Book>(){ Tcargo = book };
        Console.WriteLine(box1.Tcargo.Cargo);
    }
}
class Apple
{
    public string Cargo { get; set; }
} class Book
{
    public string Cargo { get; set; }
}
class Box<T> {
    public T Tcargo { get; set; }   
}
```

##### 泛型方法

```c#
using System;

class Program
{
    static void Swap<T>(ref T a, ref T b)
    {
        T temp = a;
        a = b;
        b = temp;
    }

    static void Main()
    {
        int x = 1, y = 2;
        Console.WriteLine($"Before swap: x = {x}, y = {y}");
        Swap(ref x, ref y);
        Console.WriteLine($"After swap: x = {x}, y = {y}");

        string s1 = "Hello", s2 = "World";
        Console.WriteLine($"Before swap: s1 = {s1}, s2 = {s2}");
        Swap(ref s1, ref s2);
        Console.WriteLine($"After swap: s1 = {s1}, s2 = {s2}");
    }
}
```

##### 泛型接口

如果一个类实现了一个泛型接口，那么这个类可以是泛型类或者是非泛型类，取决于它如何实现接口的泛型参数<>

- **类也是泛型类**

  ```C#
  //其中的类在实现接口时，实现的接口为泛型接口，没有指明接口的泛型参数类型
  namespace _01_命名空间
  {
      class Progarm
      {
          static void Main(string[] args)
          {
              Stu<int> s1 = new Stu<int>() { Id = 1 };  //实例化时需要指定泛型参数的类型
              Console.WriteLine(s1.Id);
          }
      }
      interface ID<TID>
      {
          TID Id { get; set; }
      }
  
      class Stu<TID> : ID<TID> { 
          public TID Id { get; set; }
      }
  }
  ```

- **类不是泛型类**

  ```C#
  //直接在实现接口时，指明泛型参数为int
  namespace _01_命名空间
  {
      class Progarm
      {
          static void Main(string[] args)
          {
              Stu s1 = new Stu() { Id = 1 };  //实例化时需要指定泛型参数的类型
              Console.WriteLine(s1.Id);
          }
      }
      interface ID<TID>
      {
          TID Id { get; set; }
      }
  
      class Stu : ID<int> { 
          public int Id { get; set; }
  
      }
  }
  ```

  

```c#
using System;

interface IContainer<T>
{
    void Add(T item);
    T Get(int index);
}

class ListContainer<T> : IContainer<T>
{
    private T[] items = new T[10];
    private int count = 0;

    public void Add(T item)
    {
        if (count < items.Length)
        {
            items[count++] = item;
        }
    }

    public T Get(int index)
    {
        if (index >= 0 && index < count)
        {
            return items[index];
        }
        throw new IndexOutOfRangeException();
    }
}

class Program
{
    static void Main()
    {
        IContainer<int> intContainer = new ListContainer<int>();
        intContainer.Add(1);
        intContainer.Add(2);
        Console.WriteLine(intContainer.Get(0));

        IContainer<string> stringContainer = new ListContainer<string>();
        stringContainer.Add("Hello");
        stringContainer.Add("World");
        Console.WriteLine(stringContainer.Get(1));
    }
}
```

##### 类型约束

可以对泛型类型参数应用约束，以限制可以使用的具体类型。常见的类型约束包括：

- `where T : struct`：`T` 必须是值类型。
- `where T : class`：`T` 必须是引用类型。
- `where T : new()`：`T` 必须有一个无参数的构造函数。
- `where T : SomeBaseClass`：`T` 必须是 `SomeBaseClass` 或其派生类。
- `where T : SomeInterface`：`T` 必须实现 `SomeInterface`。
- `where T : Person`: `T`必须是某类或者派生自某类
- `where T : IONe，ITwo（接口名）`: `T`必须实现一个或多个接口

```C#
using System;

class GenericClass<T> where T : new()
{
    public T CreateInstance()
    {
        return new T();
    }
}

class MyClass
{
    public MyClass()
    {
        Console.WriteLine("MyClass instance created.");
    }
}

class Program
{
    static void Main()
    {
        GenericClass<MyClass> generic = new GenericClass<MyClass>();
        MyClass instance = generic.CreateInstance();
    }
}
```

## Equals

### `Equals` 方法的基本使用形式

`Equals` 方法有两种基本形式：实例方法和静态方法。

#### 实例方法

每个对象都继承自 `Object` 类，因此都有 `Equals` 方法。默认情况下，`Object` 类的 `Equals` 方法比较的是两个对象的引用是否相同（即是否指向内存中的同一个位置）。不过，许多类会重写这个方法，以实现值的比较。

```csharp
object obj1 = new object();
object obj2 = new object();
object obj3 = obj1;

bool isSameReference1 = obj1.Equals(obj2); // false，因为它们指向不同的内存位置
bool isSameReference2 = obj1.Equals(obj3); // true，因为它们指向相同的内存位置
```

#### 静态方法

`Object` 类提供了静态的 `Equals` 方法，它可以处理 `null` 值，在比较之前会先检查两个对象是否为 `null`。

```csharp
object objA = null;
object objB = null;
object objC = new object();

bool result1 = Object.Equals(objA, objB); // true，因为两个都是 null
bool result2 = Object.Equals(objA, objC); // false，一个是 null，一个不是 null
```

### 2. 重写 `Equals` 方法

为了实现基于值的比较，很多类会重写 `Equals` 方法。例如，`string` 类就重写了 `Equals` 方法，用来比较字符串的内容是否相同。

```csharp
string str1 = "hello";
string str2 = "hello";
bool isEqual = str1.Equals(str2); // true，比较的是字符串的内容
```

下面是一个自定义类重写 `Equals` 方法的示例

```csharp
class Person
{
    public string Name { get; set; }
    public int Age { get; set; }

    public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
            return false;

        Person other = (Person)obj;
        return Name == other.Name && Age == other.Age;
    }

    public override int GetHashCode()
    {
        return Name.GetHashCode() ^ Age.GetHashCode();
    }
}

class Program
{
    static void Main()
    {
        Person p1 = new Person { Name = "Alice", Age = 25 };
        Person p2 = new Person { Name = "Alice", Age = 25 };

        bool areEqual = p1.Equals(p2); // true，因为重写了 Equals 方法进行值比较
    }
}
```

### 3. `Equals` 方法和 `==` 运算符的区别

- **`Equals` 方法**：主要用于比较对象的内容是否相等。对于引用类型，默认比较引用，但可重写以比较值；对于值类型，比较值是否相等。
- **`==` 运算符**：对于引用类型，默认比较引用是否相同；对于值类型，比较值是否相等。不过，一些类（如 `string`）会重载 `==` 运算符以实现值的比较。

```csharp
string s1 = "test";
string s2 = new string("test".ToCharArray());

bool resultEquals = s1.Equals(s2); // true，比较内容
bool resultOperator = s1 == s2;    // true，string 类重载了 == 运算符，比较内容

object o1 = s1;
object o2 = s2;
bool resultObjEquals = o1.Equals(o2); // true，调用重写的 Equals 方法比较内容
bool resultObjOperator = o1 == o2;    // false，比较引用
```

### 4. 使用 `EqualityComparer<T>.Default`

在泛型代码中，为了安全且正确地比较两个对象是否相等，可以使用 `EqualityComparer<T>.Default`。它会根据 `T` 的类型选择合适的比较器。

```csharp
using System.Collections.Generic;

class MyClass
{
    public int Value { get; set; }
}

class Program
{
    static void Main()
    {
        MyClass mc1 = new MyClass { Value = 10 };
        MyClass mc2 = new MyClass { Value = 10 };

        bool areEqual = EqualityComparer<MyClass>.Default.Equals(mc1, mc2); 
        // 如果 MyClass 没有重写 Equals，这里比较的是引用
    }
}
```

## IEnumerator和IEumerable

`IEnumerator` 是 `IEnumerable` **实现迭代功能的核心工具**，二者的关系可以理解为 **集合数据（`IEnumerable`）与遍历逻辑（`IEnumerator`）的职责分离**。这种设计体现了迭代器模式的核心思想，使得集合的遍历更加灵活、可控且安全。在IEnumerable的GetEnumerator()方法下隐式调用IEumerable接口实习遍历的功能，也就是**`foreach` 循环是 C# 中用于遍历集合的语法糖，它的底层实现依赖于 `IEnumerable` 和 `IEnumerator` 接口。当使用 `foreach` 循环遍历一个实现了 `IEnumerable` 接口的集合时，编译器会自动调用 `GetEnumerator()` 方法获取一个 `IEnumerator` 对象，然后使用该枚举器的 `MoveNext()` 和 `Current` 属性来遍历集合中的元素。**

### **核心区别**

|              |           `IEnumerable`            |              `IEnumerator`              |
| :----------: | :--------------------------------: | :-------------------------------------: |
|   **职责**   | 声明对象是“可枚举的”，提供遍历工具 |    定义具体的遍历逻辑，维护遍历状态     |
| **接口定义** |   仅包含 `GetEnumerator()` 方法    | 包含 `MoveNext()`, `Current`, `Reset()` |
|  **实现者**  |   集合类（如 `List<T>`, 数组等）   |   遍历逻辑类（由开发者或编译器生成）    |
| **生命周期** |        长期存在（集合本身）        |     短期存在（仅在一次遍历中存活）      |

### **常见的误解澄清**

#### 误解1：`IEnumerable` 自己实现了遍历逻辑

**纠正**：`IEnumerable` 只是提供遍历工具（`IEnumerator`），**真正的遍历逻辑在 `IEnumerator` 中**。

- 例如：`List<T>` 实现了 `IEnumerable`，但遍历逻辑由 `List<T>.Enumerator` 类（实现 `IEnumerator`）处理。

#### 误解2：`IEnumerable` 和 `IEnumerator` 是同一层逻辑

**纠正**：二者是**生产者-消费者模式**：

- `IEnumerable` 是生产者：生产遍历工具（`IEnumerator`）。
- `IEnumerator` 是消费者：实际执行遍历操作

### **为什么需要分离？**

1. **支持多次独立遍历**
   每次调用 `GetEnumerator()` 返回一个新的 `IEnumerator`，保证多次遍历互不干扰：

   ```csharp
   var collection = new MyCollection();
   var enumerator1 = collection.GetEnumerator();  // 遍历器1
   var enumerator2 = collection.GetEnumerator();  // 遍历器2
   ```

2. **延迟执行（Lazy Evaluation）**
   `IEnumerator` 可以按需遍历元素，例如从数据库或网络流中逐步读取数据，无需一次性加载全部内容。

3. **自定义遍历逻辑**
   通过不同的 `IEnumerator` 实现，可以为同一集合定义多种遍历方式（如正序、逆序、筛选遍历等）。

------

### **简化实现：`yield return`**

其中yield return 定义的迭代器不会一次性生成所有元素，而是按需逐个生成。这在处理大数据集或耗时操作时非常高效：就是编译器会将 `yield return` 代码转换为一个**状态机类**，自动处理遍历过程中的状态（例如循环变量、当前执行位置等）编译器生成的代码会跟踪执行到哪个 `yield return`，并在每次调用 `MoveNext()` 时恢复执行，当不往下执行了，则则元素不会生成

手动实现 `IEnumerator` 较为繁琐，C# 提供 `yield return` 语法糖，**由编译器自动生成 `IEnumerator` 类**：

```csharp
public class MyCollection : IEnumerable
{
    private int[] _data = { 1, 2, 3 };

    public IEnumerator GetEnumerator()
    {
        for (int i = 0; i < _data.Length; i++)
        {
            yield return _data[i];  // 编译器生成状态机管理遍历逻辑
        }
    }
}
```

编译器会将此代码转换为一个实现了 `IEnumerator` 的隐藏类，自动处理 `MoveNext()` 和 `Current`。

## IEumerator和协程

#### **协程的本质**

- 协程是一种**分段执行**的机制，允许代码在特定位置暂停，并在后续帧或条件满足时恢复执行。
- **Unity 的协程通过 `IEnumerator` 实现**，利用 `yield return` 语法控制执行流程。

####  **为什么使用 `IEnumerator`？**

- IEnumerator接口的MoveNext()和Current方法天然适合管理协程的状态：
  - `MoveNext()`：推进协程到下一个 `yield return` 暂停点。
  - `Current`：获取当前暂停的条件（如等待时间、帧数等）。
- **Unity 通过 `StartCoroutine` 方法驱动协程**，内部不断调用 `MoveNext()` 直到协程结束。

####  **协程的代码示例**

```csharp
IEnumerator MyCoroutine()
{
    Debug.Log("协程开始");
    yield return null;              // 等待一帧
    yield return new WaitForSeconds(1); // 等待1秒
    Debug.Log("1秒后恢复");
    yield return StartCoroutine(AnotherCoroutine()); // 嵌套协程
    Debug.Log("协程结束");
}

IEnumerator AnotherCoroutine()
{
    yield return new WaitForSeconds(0.5f);
}
```

------

#### **`IEnumerable` 的角色**

- `IEnumerable` 是协程的“间接参与者”：
  - 协程方法的返回类型是 `IEnumerator`，但 `IEnumerable` 并不直接参与协程逻辑。
  - 由于 `yield return` 语法需要方法返回 `IEnumerable` 或 `IEnumerator`，而协程选择 `IEnumerator` 作为返回值，因为它更适合管理**单次执行流程**（而非遍历集合）。

------

#### **三者的协作流程**

1. **协程启动**：

   ```csharp
   StartCoroutine(MyCoroutine());
   ```

   Unity 会获取 `MyCoroutine()` 返回的 `IEnumerator` 对象。

2. **驱动协程**：

   - Unity 在每一帧调用 `IEnumerator.MoveNext()`，直到返回 `false`。
   - `Current` 属性告诉 Unity 何时恢复执行（例如等待一帧、等待时间等）。

3. **状态机实现**：

   - `yield return` 生成的 `IEnumerator` 内部是一个状态机，记录协程执行到的位置（例如 `yield return` 后的代码行）。

------

#### **关键区别**

|              |      `IEnumerable`       |       `IEnumerator`        |     协程（Coroutine）     |
| :----------: | :----------------------: | :------------------------: | :-----------------------: |
|   **目的**   |      声明集合可遍历      | 实现遍历逻辑或协程状态管理 |     实现分段异步逻辑      |
| **生命周期** |   长期存在（集合本身）   | 短期存在（单次遍历或协程） |  由 `MonoBehaviour` 控制  |
| **核心方法** |    `GetEnumerator()`     |  `MoveNext()`, `Current`   | `yield return` 控制暂停点 |
| **使用场景** | 集合遍历（如 `foreach`） |     遍历集合或驱动协程     |  游戏逻辑的异步/分帧执行  |
