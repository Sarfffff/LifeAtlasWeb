---
title: 基本语法
date: 2026-06-27 03:30:00
categories:
  - 编程语言
tags:
  - C#
  - 笔记
---
## 基础语法（C#）

```c#
//最基础的C#程序结构如下
using System;
namespace CSharp_project
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello");
        }        
    }

}
```



```c#
using System;  //引入命名空间   Console 属于System
namesapce      //包含了一系列的类
class			//包含了程序使用的数据和方法声明、
Console.WriteLine(""); //输入到控制台上（输出语句）
Console.Write("");//b
Console.WriteLine(@"");//添加@后 转义字符不生效


string str = "123"+"456";// 输出123456(相当于拼接)

Console.ReadLine(str);//相当于cin,此时输入的类型为字符串类型
int age = Console.ReadLine();
int strint =  Convert.ToInt32(str);  //"12" ->12 √  "df"->"数字"×   32
```

```c#
Console.WriteLine("{},{},{}"3,32,32);   //每一个中括号按顺序取后面的每一个数字；
a++;  //先赋值 后+1
++a;  //先+1 后赋值

bool a = 45<57;  // ture  a=1， false  a = 0；

while(true||false){
	//执行	
}//true 进入循环体  false 退出循环体


```

```c#
//简单的循环输入
using System;
namespace CSharp_project
{
    class Program
    {
        static void Main(string[] args)
        {
            int n = Convert.ToInt32(Console.ReadLine());//输入n的大小
            for (int i = 0; i < n; i++)
            {
                Console.WriteLine(i);
            }
        }
    }
}

```

## 数据类型

![image-20250119214405047](/notes-assets/C%23/.assets/image-20250119214405047.png)

**数据转换**

![image-20250119215249415](/notes-assets/C%23/.assets/image-20250119215249415.png)

```c#
//数组的初始化
1.int[] 数组名 = {"数据"};
2.int[] 数组名;
	数组名 = new int[10]；   //不同的数据类型默认值不同  int为0  string 为null
        

for(int i = 0;i<10;i++){
	Console.WriteLine()
}
foreach(int temp in age)// 其中int temp 为定义的临时变量  in age表示在数组age中遍历
{
    Console.WirteLine(temp + "");  //遍历输出
}
//C#中也可以直接通过  数组名.length 直接获得数组的长度     字符串长度也可以直接通过  字符串名.length 直接获得
```

```c#
//几个常用的方法    字符串名.方法
ToUpper( );  //将字符串全部变为小写
ToLower( );  //将字符串全部变为大写
Trim();	 //去除字符串前面和后面的空格
TrimStart( );//去除字符串前面的空格
Split(",");  //代表一个字符串通过逗号分割了
```

```c#
//Split方法
//Split方法是用于将一个字符串按照指定的分隔符或分隔符数组，拆分成多个子字符串，并将这些子字符串存储在一个字符串数组中

--1.以单个字符作为分隔符：可以传入一个字符作为参数，Split方法会根据该字符来拆分字符串。例如：
string str = "apple,banana,cherry";
string[] parts = str.Split(',');
// 此时parts数组包含三个元素："apple"、"banana"、"cherry"

--2.以字符串数组作为分隔符：可以传入一个字符串数组作为分隔符，Split方法会根据数组中的多个分隔符来拆分字符串。例如：
    string str = "apple;banana,cherry";
string[] separators = { ",", ";" };
string[] parts = str.Split(separators, StringSplitOptions.None);
// 此时parts数组包含三个元素："apple"、"banana"、"cherry"

--3.指定拆分的最大数量：可以传入一个整数参数来指定最多拆分出的子字符串数量。例如：
string str = "apple,banana,cherry,date";
string[] parts = str.Split(',', 3);
// 此时parts数组包含三个元素："apple"、"banana"、"cherry,date"

--4.使用枚举值指定拆分选项：可以使用StringSplitOptions枚举来指定拆分选项，如RemoveEmptyEntries表示在拆分后移除结果中的空字符串。例如：

string str = "apple,,banana,";
string[] parts = str.Split(',', StringSplitOptions.RemoveEmptyEntries);
// 此时parts数组包含两个元素："apple"、"banana"
```

```c#
//C#中的函数调用
static void main(string[] args){}   //主函数-入口函数

static void func1(){}  //func1为方法（函数）的名称  定义方法
```



**params**：它允许向方法传递可变数量的参数。使用 `params` 关键字可以简化方法的重载，避免为不同数量的参数编写多个重载方法。`params` 修饰的参数必须是方法参数列表中的最后一个参数，并且它只能修饰一维数组类型。

```c#
using System;

class Program
{
    static void Main()
    {
        // 调用 Sum 方法，可以传递任意数量的整数参数
        int result1 = Sum(1, 2, 3, 4, 5);
        Console.WriteLine(result1);

        int result2 = Sum(10, 20);
        Console.WriteLine(result2);
    }

    // 使用 params 关键字，允许传递可变数量的整数参数
    static int Sum(params int[] numbers)
    {
        int sum = 0;
        foreach (int num in numbers)
        {
            sum += num;
        }
        return sum;
    }
}
```

**const**：用于声明常量。常量是在编译时就确定值的变量，其值在程序的整个生命周期内都不能被修改。

```c#
const int myConstant = 10;
//这里的 const 修饰 int 类型，表示 myConstant 是一个常量，其值为 10，不能被修改
//const 常量必须在声明时初始化，且初始化的值必须是一个在编译时可以确定的表达式，不能是运行时计算的值
```

**枚举**：整型常量的集合，默认是从 0 开始 逐渐 变大 + 1。如果第一个非0，后面的都是在前一个数字的基础上累加，但是值可以认为修改

**一般声明在namespace 语句块中，但是也可以声明在class struct等自定义数据结构中**

```c#
//声明枚举类型,
enum RoleType{      //其中RoleType为枚举类型的名字，jack，tim等等枚举类型的值
    Jack, //0
    Jim,  //1
    Tim = 5,//5
    Tom
}

//调用枚举
RoleType roletype = RoleType.jack;  //定义RoleType的变量 来获取jack的值

//枚举类型的数据转换
 //int - 枚举
int i = (int)roleType;
 //枚举 - int
roleType = (RoleType)3;

 //string - 枚举
string str = roleType.ToString();
 //枚举 - string
roleType = (RoleType)Enum.Parse(typeof(RoleType),"Jack") ;
```

**结构体**

```c#
//声明结构体类型   不在主函数中声明  其中的结构体的成员也可以使用权限控制符 public private protected
struct Student{
    int Id;
    String Name;
    int age;
}

//结构体的调用
Student Stu1；
Stu1.age = 10；
    
//结构体数组
Student[] Stu2 = new Student[10];
Stu2[0];  //代表第一个结构体


//结构体函数
Struct Position {
	public double x;
    public double y;
    public double z;
    public void Print(){
        .....
    }
}
Position p1;
p1.Print();
```

**委托**

```c#
//类似于 C 或 C++ 中的函数指针，但功能更强大且更安全。委托可以看作是对方法的引用，它允许将方法作为参数传递给其他方法，或者将方法存储在变量中以便稍后调用。


//委托的定义
delegate 返回值类型 委托名称(参数列表);
delegate int Mydelegate;

//委托使用方法    委托的使用函数必须与委托的参数列表以及返回值类型相同才能使用 
using System;
namespace CSharp_project
{
    class Program
    {
        static double Muliply(double param1,double param2)
        {
            return param1 * param2;
        }
        static double Divide(double param1, double param2)
        {
            return param1 / param2;
        }
        static void Test()
		{
    		Console.WriteLine("Test");
		}
        
        delegate double Mydelegate(double param1, double param2);
        
        static void Main(string[] args)
        {
            Mydelegate delegate1;
            delegate1 = Muliply;   //指向Muliply
            Console.WriteLine(delegate1(2, 4));  //此时调用delegate相当于直接调用Muliply这个函数

            delegate1 = Divide;		//指向Divide
            Console.WriteLine(delegate1(2, 4));	//此时调用delegate相当于直接调用Divide这个函数
                        
            //delegate1 = Test;  “Test”没有与委托“Program.Mydelegate”匹配的重载	
        }
    }
}

//泛型委托最常用的是Action和Func委托。
//Action委托用于引用没有返回值的方法，例如Action<T1, T2>可以引用有两个参数（类型分别为T1和T2）且没有返回值的方法。
//Func委托用于引用有返回值的方法，例如Func<T1, T2, TResult>可以引用有两个参数（类型分别为T1和T2）且返回值类型为TResult的方法。
class Program
{
    static int Add(int a, int b)
    {
        return a + b;
    }
    static void Main()
    {
        Func<int, int, int> addFunc = Add;
        int result = addFunc(3, 4);
        Console.WriteLine(result);
    }
}
```


