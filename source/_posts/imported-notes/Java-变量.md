---
title: 变量
date: 2026-06-27 03:55:00
categories:
  - 编程语言
tags:
  - Java
  - 笔记
---
## 2.1 变量

​	变量：变量相当于内存中一个数据存储空间的表示，你可以把变量看做是一个房间的门牌号，通过门牌号我们可以找到房间，而通过变量名可以访问到变量(值)。

> 变量：变量是程序的基本组成单位
>
> 变量的三个基本要素：类型 + 名称 + 值
>
> 示例：`int a = 1` 类型 int 名称 a 值 1

**如何声明变量：**

```java
int a；//声明变量a，给变量a一块空间
a = 100;
int b = 100;//变量的赋值，将100赋值给b
int c = 5, d;
```



## 2.2 变量使用注意事项

1. 变量表示内存中的一个存储区域。不同变量，不同类型，占用的空间大小不同。如 `int` 有 4 byte，而 `double` 有 8 byte。

2. 该区域有自己的名称 `变量名` 和类型 `数据类型`

3. 变量必须先声明，后使用。

   ```java
   int a；
   a=10；
   System.out.println(a);
   ```

4. 变量在同一作用域内不能重名。

5. 该区域的数据值可以在同一类型范围内变化。

6. 变量的三个基本要素：类型 + 名称 + 值



## 2.3 程序中 `+`号的使用

1. 当左右两边都是数值型，做加法运算
2. 当左右两边任意一方为字符串，做拼接运算
3. 运算顺序是从左到右的

```java
System.out.println(100+98)// 198
System.out.println("100"+98)// 10098
System.out.println(100+98+"hello")// 198hello
System.out.println("hello"+100+98)// hello10098
```



## 2.4 Java 数据类型

![image-20240625204813515](/notes-assets/Java/.assets/image-20240625204813515.png)

**基本数据类型**

- **数值型**
  - 整数类型：
    - byte：占用 1 字节
    - short：占用 2 字节
    - int：占用 4 字节
    - long：占用 8 字节
  - 浮点（小数）类型：
    - float：占用 4 字节
    - double：占用 8 字节
- **字符型**
  - char：存放单个字符，占用 2 字节
- **布尔型**
  - boolean：存放 true（真），false（假）。占用 1 字节

**引用数据类型（复合数据类型）**

- **类**：class

  ***——详见 [[ 6 类与对象 \]](https://i-melody.github.io/2021/11/29/Java/入门阶段/6 面向对象编程（基础）/#6-1-类与对象（OOP）)***

- **接口**：interface

  ***——详见 [[ 9.7 接口 \]](https://i-melody.github.io/2021/12/14/Java/入门阶段/9 面向对象编程（高级）/#9-7-接口)***

- **数组**：`[]`

  ***——详见 [[ 5 数组、排序和查找 \]](https://i-melody.github.io/2021/11/27/Java/入门阶段/5 数组、排序和查找/#5-数组、排序和查找)***

## 2.5 整数类型 

> 用于存放整数值

- `byte` 占用 1 字节，范围 -128 ~ 127
- `short` 占用 2 字节，范围 $-2^{15}$ ~$2^{15}$ - 1
- `int` 占用 4 字节，范围 -$2^{31}$ ~ $2^{31}$ - 1
- `long` 占用 8 字节，范围 -$2^{63}$ ~ $2^{63}$ - 1

**使用细节：**

1. Java 各整数类型有固定的范围和字符长度，不受具体 OS（操作系统）影响，以保证 Java 程序的可移植性。
2. Java 默认整型常量为 `int` ，要声明 `long` 型常量必须后加 `l` 或 `L`。
3. 从 Java 7 开始，加上前缀 `0b` 或 `0B` 就可以写二进制数。
4. 从 Java 7 开始，可以为数字字面添加下划线。这不会影响数字的值，只是为了方便阅读。

```
int n = 0b0010;
n = 0b001;
n = 100_0_000000;
n = 0B0000_0010_1100;
float f = 1.0F;JAVA
```

如果基本的整数、浮点类型不能满足范围、精度的需求，可以使用 “大数”

***—— 大数，见 [[12.8 BigInteger 和 BigDecimal 类\]](https://i-melody.github.io/2021/12/19/Java/入门阶段/12 常用类/#12-8-BigInteger-和-BigDecimal-类)***

## 2.6 浮点类型

> 可以表示一个小数

- `float` 单精度（6 ~ 7 位有效数字），占用 4 字节，范围约 -3.403E38 ~ 3.403E38
- `double` 双精度（15 位有效数字），占用 8 字节，范围约 -1.798E308 ~ 1.798E308

*浮点数在机器中存放形式为：浮点数 = 符号位 + 指数位 + 尾数位*

***因此，尾数部分可能丢失，造成精度损失。换言之，小数都是近似值***

### 2.6.1 使用细节

1. 与整数类型相似，有固定的范围和字符长度，不受具体 OS（操作系统）影响。

2. Java 默认浮点常量为 `double` ，要声明 `float` 型常量必须后加 ”f“ 或 ”F“

3. 浮点型常量有两种表示形式

   > 十进制数形式：`5.13`、`315.4F`、`.414`等价于`·0.414`
   >
   > 科学计数法：`5.12e2` 即[5.12 × $10^2$]、`5.12E-2` 即[5.12 / $10^2$]

4. 通常情况下，应该使用 `double` 类型，以其更为精确。

5. 浮点数使用陷阱：当我们对运算结果是小数的进行相对判断时，要小心。（因为***小数都是近似值***）

   ```
   double num1 = 2.7;
   double num2 = 8.1/3;
   System.out.println(num1); //输出2.7
   System.out.println(num2)；//输出无限接近2.7的数字，而非2.7
   ```

   正确方法是：**以两个数差值的绝对值，在某个精度范围内判断**

   ```java
   if (Math.abs(num1 - num2) < 0.00001) {
   	System.out.println("插值范围内认为相等");
   }
   ```

6. 特殊的浮点类型常量

   - 正无穷大：`Float.POSITIVE_INFINITY`、`Double.POSITIVE_INFINITY`

     （浮点数运算中）一个正数除以 0，会得到该值

   - 负无穷大：`Float.NEGATIVE_INFINITY`、`Double.NEGATIVE_INFINITY`

     （浮点数运算中）一个负数除以 0，会得到该值

   - 0 / 0：`Float.NaN`、`Double.NaN`

     （浮点数运算中）0 除以 0，会得到该值

   - 最大、最小值：`Float.MAX_VALUE`、`Double.MIN_VALUE`

7. 不能用运算符来比较特殊值，而要用特别的方法

   ```java
   double num = 0.0 / 0;
   System.out.println(num == Double.NaN);			// <——— 始终为 false。不能如此比较
   System.out.println(Double.isNaN(num));			// <——— 判断是否是 NaN
   num = 1.0 / 0;
   System.out.println(Double.isInfinite(num));		// <——— 是否是无穷大
   ```

8. 由于不同处理器寄存浮点数的策略可能不同，浮点数运算的结果也可能不同。

   ***—— 见 [[12.1.4 strictfp 关键字\]](https://i-melody.github.io/2021/12/19/Java/入门阶段/12 常用类/#12-1-4-strictfp-关键字)***

## 2.7 字符型使用

> 可以表示单个字符。（可以存放一个数字，因为其字符是数字编号的。输出时会输出数字对应的字符。”编码的概念“）
>
> ```
> char c1 = 'a';` `char c2 = '\t';` `char c3 = '字';` `char c4 = 99;
> ```

### 2.7.1 使用细节

1. 字符常量用单引号括起 `‘字’`

2. `char` 的本质是一个整数，输出时，输出的是 unicode 码对应的字符。[unicode 码查询](https://i-melody.github.io/2021/11/22/Java/入门阶段/2 变量/tool.chinaz.com/Tools/Unicode.aspx) 。

   要输出那个整数，用 `int`

   ```java
   char c1 = 'a';
   System.out.println((int)c1);//强制类型转换（数据类型）
   ```

3. `char` 是可以进行运算的，其相当于一个整数。

   ```java
   // 注：(int)'a' = 97
   char c1 = 'a' + 1;				// 相当于 char c1 = 'b'
   System.out.println('a' + 1);	// 这个代码输出 98，'a'被强制转换成int类型
   System.out.println("a" + 1);	// 这个代码输出 a1 '输出为字符串'
   ```

4. 字符允许使用转义符（*见 [1.8 Java 转义字符]*）

   ```java
   char c = '\u0041';
   ```

   **转义序列 \u 能出现在引号外。所有这些转义序列会在解析代码前得到处理**

   - 以下字符串是空串：

     ```java
     String s = "\u0022+\u0022";
     ```

     因为 \u0022 表示引号。该代码等同于以下代码

     ```java
     String s = "" + "";
     ```

   - 以下注释会报错：

     ```java
     // \u000A is a newline
     ```

     因为 \u000A 是换行符。在解析前会得到处理。在程序看来，上述注释等于以下写法

     ```java
     // 
     is a newline
     ```

   - 以下注释也会报错：

     ```java
     // look inside c:\users
     ```

     因为程序认为，\users 不是一个合法的转义字符

   - 在某些场合下这种写法似乎也能实现：

     ```java
     int\u005B\u005D a;			// int[] a; 一个数组
     ```

### 2.7.2 字符本质与编码表

- 字符类型的本质，是把字符对应的码值编程二进制，存储。显示时将二进制代码转化为码值，找到对应的字符。

- 字符与码值的对应关系是字符编码表规定的。

  > ASCII 编码表，占用 1 byte，共有 128 个字符。
  >
  > Unicode 编码表，占用 2 byte，字母汉字都占用 2 byte，这样可能浪费空间。0 - 127 的字符与 ASCII 相同，所以兼容 ASCII。
  >
  > UTF-8 编码表，根据不同符号大小可变（1 - 6 byte），字母占用 1 byte，汉字占用 3 byte。是 Unicode 的改进，是互联网上使用最广的 Unicode 实现方式。
  >
  > GBK 编码表，可以表示汉字，字母占用 1 byte，汉字占用 2 byte。
  >
  > GB2312 编码表，可以表示汉字（GB2312 < GBK）
  >
  > BIG5 编码表，可以存放繁体中文（香港，台湾）

- UTF-16 编码采用不同长度的编码表示所有 Unicode 码点。包含从 U+0000 到 U+FFFF 的经典 Unicode 代码（16位，1 个代码单元），以及 U+10000 到 U+10FFFF 的辅助字符（32位，2 个代码单元）

- 在 Java 中，char 类型描述的是 UTF-16 编码中的 1 个代码单元。

  字符串中的一个辅助字符（如 🎶）可能占用 2 个代码单元。这个场合，使用 char 可能会导致错误

  ```java
  String str = "🎶JLH🎶";
  char c = str.charAt(1);			// <———— 这个场合，c 是 🎶 符号的第二个代码单元而非 'M'
  ```

  **因此，一般不建议在程序中使用 char 类型**

## 2.8 boolean类型

> `boolean` 只允许取值 `ture` 或 `false` ，没有 `null`。适用于逻辑运算，通常用于程序流程控制
>
> ```java
> if（）elss（）  while（）  do-while  for（）
> ```

**使用细节：**

1. 不可以用 0 或 非0 的整数替代 `false` 或 `ture` 。这点和 C语言 不同。

2. 不能让布尔类型转换为其他类型。如需转换，请使用如下方法：（三元运算符）

   ```java
   boolean b = true;
   int n = b ? 0 : 1;
   ```

## 2.9 基本类型转换

### 2.9.1 自动类型转换

> 自动类型转换：Java 在进行赋值或运算时，精度（容量）小的类型自动转换为精度（容量）大的类型。
>
> ```java
> char > int > long > float > double
> byte > short > int > long > float > double
> ```
>
> 例子：`int a = 'c'` 或者 `double b = 80`

#### #2.9.1.1 使用细节

1. 有多种类型数据混合运算时，系统会将所有数据转换成容量最大的那种，再进行运算。

2. 如若把大精度（容量）数据赋值给小精度（容量）类型，就会报错（小数由于精度原因，大赋小会丢失精度，必不可用。但整数大赋小时：

   > 1.赋予具体数值时，判断范围。2.变量赋值时，判断类型。反之进行自动类型转换。

3. （`byte` `short`） `char` 三者不会相互自动转换，但可以计算。计算时首先转化为 `int`（这三种元素类型只要参与运算，就变成`int`类型）。

```java
byte a = 1；//对 byte范围（-127~128）
byte c = 1000//错误 超过byte的范围
int b = 1；
byte c = b  //错误 不可以把int类型转换byte类型
```

4. boolean不参与转换

   ```java
   boolean pass = true;
   int a1 = pass;//错误，boolean不参与数据类型转换
   ```

   

5. 自动提升原则：表达式的结果自动提升为操作数中的最大的类型

### 2.9.2 强制类型转换

>  强制类型转换：自动类型转换的逆过程，将容量大的数据类型转换为容量小的数据类型。使用时加上强制转换符 `( )` ，但**可能造成精度降低或溢出**，要格外注意。

#### #2.9.2.1 使用细节

1. 当进行数据从大到小转换时，用强制转换。
2. 强制转换只能对最近的操作数有效，往往会使用 `( )` 提升优先级。

```java
int x = (int)10*3.5+6*1.4//错误 double ->int 
int x = (int)(10*3.5+6*1.4)//正确 
```

3. char类型可以保存`int`的常量值，但不能保存`int`的变量值，需要强制转换

```java
char m1 = 100;  //ok
int m2 = 100;  //ok
char m1 = m2; // false
char m1 = char(m2); //ok
```

4. `byte`,`short`和`char`类型在运算时，当作`int`类型来处理

### 2.9.3 基本数据类型和 `String` 的转换

- 基本类型转 `String`：基本数据类型加上 `" "`。

  ```java
  int n1 = 100;
  String s = n1 + "";
  System.out.println(n1 + "" + n1 + "" + n1 + "");
  ```

- `String` 转基本数据类型：通过基本数据类型的包装类调用 `parseXX` 方法。

  ```java
  String s = "123";
  int num1 = Integer.parseInt(s);
  double num2 = Double.parseDouble(s);
  float num3 = Float.parseDouble(s);
  long num3 = Long.parseLong(s);
  byte num4 = Byte.parseByte(s);
  boolean num5 =  = Boolean.parseBoolean("true"/"false");
  short num6 = short.parseShort(s);
  //可以将上述括号（）内的变量转换为相应的类型
  ```

  特别的，把 `String` 转换为 `char`,`char`类型是一般是单个字符，所有将`String`转换为`char`类型一般是取单个字符 ；

  ```java
  char c = s.charAt(0);		// 得到 s 字符串中的第一个字符。
  ```

#### #2.9.3.1 使用细节

1. 将 `String` 转成基本数据类型时，要保证其能转换为有效数据。即不能把 `"Hello"` 转换成 `int`。
2. 如果格式不正确，会抛出[异常](https://i-melody.github.io/2021/12/18/Java/入门阶段/11 异常/)，程序会中止。
