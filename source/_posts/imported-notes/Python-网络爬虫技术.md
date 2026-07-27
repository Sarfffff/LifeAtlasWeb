---
title: 网络爬虫技术
date: 2026-06-27 04:11:00
categories:
  - 编程语言
tags:
  - Python
  - 笔记
---
#####  Python框架

```python
print("Hello World")  //Python 可以直接输出 不需要头文件或者其他的名称空间

"""的作用
#1.多行字符串
#借助 """ 能够定义多行字符串，也就是字符串内容可以跨越多行。示例如下：

multiline_string = """这是一个
多行字符串的示例。
它可以包含多个段落。"""
print(multiline_string)
代码解释：
在这个例子中，multiline_string 变量被赋予了一个多行字符串值。""" 起始和结束之间的所有文本，包含换行符，都被视为字符串的一部分。当你打印这个变量时，输出的字符串会保留所有的换行和格式。


2.文档字符串
#在函数、类或者模块的开头运用 """ 来编写文档字符串，用于对代码的功能、参数、返回值等信息进行描述。这有助于其他开发者理解代码。示#例如下：
def add_numbers(a, b):
    """
    此函数用于将两个数字相加。
    参数:
    a (int 或者 float): 第一个数字。
    b (int 或者 float): 第二个数字。

    返回:
    int 或者 float: 两个数字相加的结果。
    """
    return a + b

# 打印函数的文档字符串
print(add_numbers.__doc__)
代码解释：
在 add_numbers 函数的开头，""" 之间的文本就是文档字符串。它详细说明了函数的用途、输入参数以及返回值。借助 __doc__ 属性，你可以获取并打印这个文档字符串。这在使用 help() 函数查看函数帮助信息时也会显示出来。

```

##### 变量

```python
#python中的变量不需要数据类型名称 如int ，float等等
#直接定义即可,如:
A = 10
B = 20
A = B
print(A)
print(B)
```

##### 数据运算

```python
#导入库  import
import math  #导入math这个库 
from 库名  import  函数名()
math.sin(1)  #math.函数名()
math.cos(1)
print(math.cos(1))
A = 10
B = A**2  #A**2等于A的2次方


```

##### 数据类型

```python
#1.字符串求长度

len() #函数可以直接对字符串求长度
S = "Hello World"
print(len(S))  #直接求出字符串S的长度

#2.通过索引求长度

print(S[0])
print(S[1])

#3.布尔类型  首字符大写

b1 = True  
b2 = False

#4.Type函数  f

print(type(S))  
print(type(b1))
print(type(b2))
```

##### 输入与输出

```python
username = input("请输入XXX");   #其中的username是字符串类型 因为python一律返回字符串类型
username = int(input("请输入XXX")); #其中的username是int类型  将string类型转换成int
print(username)

```

##### 流程控制语句

```python
#条件判断语句
if 条件判断:
	代码块
else :  
    代码块
  

#嵌套条件判读语句
if 条件判断1:
	if 条件判断2:
    	代码块
else :  
    代码块

#多条件判断条件
if 条件判断1:
    代码块1
elif 条件判断2:
	代码块2
elif 条件判断3:
	代码块3
else:
    代码块4

#逻辑运算符号
and 与(&&)
or 或(||)
not 非(！)
```

##### 列表

```python
一、列表的定义
	#在Python中，列表（List）是一种有序的可变序列容器。它可以存储不同类型的数据，如整数、浮点数、字符串、甚至其他列表等。可以使用方括号`[]`来创建一个列表，例如：
my_list = [1, 2.5, "hello", [4, 5]]

#在这个例子中，`my_list`包含了一个整数`1`、一个浮点数`2.5`、一个字符串`hello`和一个内部列表`[4, 5]`。

二、列表的索引和切片
#1. 索引：列表中的每个元素都有一个对应的索引，索引从0开始。可以通过索引来访问列表中的元素。例如：
my_list = [10, 20, 30, 40]
print(my_list[0])  # 输出10
print(my_list[2])  # 输出30

#还可以使用负索引，从列表末尾开始计数。例如，`-1`表示最后一个元素，`-2`表示倒数第二个元素，以此类推。
print(my_list[-1])  # 输出40
print(my_list[-2])  # 输出30

#2. 切片：切片用于获取列表的一个子序列。切片的语法是`[start:stop:step]`，其中`start`是起始索引（包含），`stop`是结束索引（不包含），`step`是步长。例如：
my_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print(my_list[2:6])  # 输出[3, 4, 5, 6]，从索引2开始到索引6（不包括6）的元素
print(my_list[::2])  # 输出[1, 3, 5, 7, 9]，步长为2，获取所有元素
print(my_list[::-1])  # 输出[10, 9, 8, 7, 6, 5, 4, 3, 2, 1]，步长为 - 1，反转列表

三、列表的操作方法

#1. 修改元素：由于列表是可变的，可以通过索引来修改列表中的元素。例如：
my_list = [1, 2, 3]
my_list[1] = 4
print(my_list)  # 输出[1, 4, 3]

#2. 添加元素：使用`append()`方法可以在列表末尾添加一个元素。例如：
my_list = [1, 2, 3]
my_list.append(4)
print(my_list)  # 输出[1, 2, 3, 4]

  #使用`insert()`方法可以在指定位置插入一个元素。例如：
my_list = [1, 2, 3]
my_list.insert(1, 5)  # 在索引1的位置插入5
print(my_list)  # 输出[1, 5, 2, 3]

#3. 删除元素：使用`remove()`方法可以删除指定值的元素。例如：
my_list = [1, 2, 3, 2]
my_list.remove(2)  # 删除第一个值为2的元素 print(my_list)  # 输出[1, 3, 2]

	#使用`pop()`方法可以删除指定索引位置的元素，并返回被删除的元素。如果不指定索引，默认删除最后一个元素。例如：
my_list = [1, 2, 3]
popped_element = my_list.pop(1)
print(popped_element)  # 输出2
print(my_list)  # 输出[1, 3]

#4. 列表的拼接和重复：可以使用`+`运算符来拼接两个列表。例如：
list1 = [1, 2, 3]
list2 = [4, 5, 6]
new_list = list1 + list2
print(new_list)  # 输出[1, 2, 3, 4, 5, 6]

	#使用`*`运算符可以重复列表中的元素。例如：
my_list = [1, 2]
repeated_list = my_list * 3
print(repeated_list)  # 输出[1, 2, 1, 2, 1, 2]


四、列表的其他特性和应用场景
#1.嵌套列表；如前面提到的，列表可以嵌套。这在处理二维数据结构（如矩阵）等场景中很有用。例如：
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print(matrix[1][2])  # 输出6，先访问第二个子列表（索引为1），再访问其中的第三个元素（索引为2）

#2. 列表推导式：列表推导式是一种简洁的创建列表的方式。例如，要创建一个包含1到10的平方的列表，可以使用以下列表推导式：
squares = [i * i for i in range(1, 11)]
print(squares)  # 输出[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
    
    #还可以在列表推导式中添加条件。例如，创建一个包含1到10中偶数的平方的列表：
even_squares = [i * i for i in range(1, 11) if i % 2 ==0]
print(even_squares)  # 输出[4, 16, 36, 64, 100]

#打印列表的最大值和最小值以及排序
print(max(list))  #最大值
print(min(list))  #最小值
print(sorted(list))  #排序
#获取最大值和最小值
max1 = max(list)	
min1 = min(list) 
```

##### 字典

```python
# 1. 字典的创建
# 创建一个空字典
empty_dict = {}
print(empty_dict)

# 创建一个包含键值对的字典
student = {
    "name": "Alice",
    "age": 20,
    "major": "Computer Science"
}
print(student)

# 2. 访问字典中的值
student = {
    "name": "Bob",
    "age": 22,
    "major": "Mathematics"
}

# 通过键访问值
print(student["name"])

# 使用 get 方法访问值，避免 KeyError
print(student.get("gender", "Not found"))

# 3. 添加和修改键值对
student = {
    "name": "Charlie",
    "age": 21
}

# 添加新的键值对
student["city"] = "New York"
print(student)

# 修改已有的键值对
student["age"] = 22
print(student)

# 4. 删除键值对
student = {
    "name": "David",
    "age": 23,
    "major": "Physics"
}

# 使用 del 关键字删除键值对
del student["major"]
print(student)

# 使用 pop 方法删除键值对并返回被删除的值
removed_age = student.pop("age")
print(removed_age)
print(student)

# 5. 遍历字典
student = {
    "name": "Eve",
    "age": 24,
    "major": "Biology"
}

# 遍历键
for key in student.keys():
    print(key)

# 遍历值
for value in student.values():
    print(value)

# 遍历键值对
for key, value in student.items():
    print(key, value)

# 6. 嵌套字典
students = {
    "student1": {
        "name": "Frank",
        "grades": {
            "math": 90,
            "science": 85
        }
    },
    "student2": {
        "name": "Grace",
        "grades": {
            "math": 80,
            "science": 75
        }
    }
}

# 访问嵌套字典中的值
print(students["student1"]["grades"]["science"])

# 7. 字典推导式
# 创建一个字典，键是 1 到 5 的数字，值是这些数字的平方
square_dict = {i: i * i for i in range(1, 6)}
print(square_dict)

```

##### 元组

```python
# 元组的定义和基本语法
# 创建空元组
empty_tuple = ()

# 创建包含元素的元组
single_element_tuple = (1,)
multiple_elements_tuple = (1, 2, 3, 'apple', True)

# 访问元组元素
fruits = ('apple', 'banana', 'cherry')
print(f"访问元组 fruits 的第一个元素: {fruits[0]}")
print(f"访问元组 fruits 的最后一个元素: {fruits[-1]}")

# 切片操作
numbers = (1, 2, 3, 4, 5, 6, 7, 8, 9)
print(f"从索引 2 到 5（不包含 5）的切片: {numbers[2:5]}")
print(f"步长为 2 的切片: {numbers[::2]}")

# 元组的不可变性示例
# 以下代码会报错，因为元组是不可变的
# numbers[0] = 10

# 元组的操作符
# 拼接
tuple1 = (1, 2)
tuple2 = (3, 4)
combined_tuple = tuple1 + tuple2
print(f"拼接后的元组: {combined_tuple}")

# 重复
repeated_tuple = (1, 2) * 3
print(f"重复后的元组: {repeated_tuple}")

# 元组的内置方法
# count()
numbers = (1, 2, 2, 3, 2)
print(f"元素 2 在元组中出现的次数: {numbers.count(2)}")

# index()
fruits = ('apple', 'banana', 'cherry')
print(f"元素 'banana' 在元组中的索引: {fruits.index('banana')}")

# 元组在函数返回多个值中的应用
def get_name_and_age():
    return 'John', 30

name, age = get_name_and_age()
print(f"函数返回的姓名: {name}")
print(f"函数返回的年龄: {age}")
```

##### 循环控制语句

```python
#Range
range(2，5，1)  #其中2是起始值  5是结束值但不包含在range的范围（2，3，4）  1为步长

# 1. 遍历列表
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"当前水果: {fruit}")

# 2. 遍历元组
numbers = (1, 2, 3, 4, 5)
for num in numbers:
    square = num ** 2
    print(f"{num} 的平方是: {square}")

# 3. 遍历字符串
message = "Python"
for char in message:
    print(f"字符: {char}")

# 4. 遍历字典
# 4.1 遍历字典的键
student = {
    "name": "Alice",
    "age": 20,
    "major": "Computer Science"
}
print("字典的键:")
for key in student.keys():
    print(key)

# 4.2 遍历字典的值
print("字典的值:")
for value in student.values():
    print(value)

# 4.3 遍历字典的键值对
print("字典的键值对:")
for key, value in student.items():
    print(f"{key}: {value}")

# 5. 使用 range() 函数遍历数字序列
print("使用 range() 函数遍历数字序列:")
for i in range(1, 6):
    print(i)

# 6. 嵌套 for 循环
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
print("嵌套 for 循环遍历二维列表:")
for row in matrix:
    for element in row:
        print(element, end=" ")
    print()
```

```python
# 1. 简单的计数循环
count = 0
while count < 5:
    print(f"当前计数: {count}")
    count = count + 1

# 2. 从用户输入读取数据直到满足条件
number = 0
while number <= 10:
    try:
        number = int(input("请输入一个大于 10 的数字: "))
    except ValueError:
        print("输入无效，请输入一个有效的整数。")
print(f"你输入的数字 {number} 大于 10。")

# 3. 结合 break 语句提前终止循环
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
index = 0
while index < len(numbers):
    if numbers[index] == 6:
        print("找到了数字 6，提前终止循环。")
        break
    print(numbers[index])
    index = index + 1

# 4. 结合 continue 语句跳过当前循环迭代
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
index = 0
while index < len(numbers):
    if numbers[index] % 2 == 0:
        index = index + 1
        continue
    print(numbers[index])
    index = index + 1
```

##### 函数

```python
# 1. 无参数、无返回值的函数
def say_hello():
    """打印问候语"""
    print("Hello!")


say_hello()

# 2. 有参数、无返回值的函数
def print_name(name):
    """打印传入的名字"""
    print(f"Your name is {name}.")


print_name("Alice")

# 3. 有参数、有返回值的函数
def add_numbers(a, b):
    """返回两个数的和"""
    return a + b


result = add_numbers(3, 5)
print(f"The sum of 3 and 5 is {result}.")

# 4. 带有默认参数的函数
def power(base, exponent=2):
    """计算一个数的指定次幂，默认指数为 2"""
    return base ** exponent


print(f"3 的平方是 {power(3)}")
print(f"2 的 3 次方是 {power(2, 3)}")

# 5. 可变参数函数 - *args
def sum_all(*args):
    """计算传入的所有数字的总和"""
    total = 0
    for num in args:
        total = total + num
    return total


print(f"The sum of 1, 2, 3, 4 is {sum_all(1, 2, 3, 4)}")

# 6. 可变参数函数 - **kwargs
def print_info(**kwargs):
    """打印传入的键值对信息"""
    for key, value in kwargs.items():
        print(f"{key}: {value}")


print_info(name="Bob", age=25, city="New York")

# 7. 嵌套函数
def outer_function():
    """外部函数，包含一个内部函数"""
    def inner_function():
        print("This is an inner function.")

    print("This is an outer function.")
    inner_function()


outer_function()

# 8. 匿名函数（lambda 函数）
# 定义一个简单的 lambda 函数用于计算两个数的乘积
multiply = lambda x, y: x * y
print(f"The product of 4 and 6 is {multiply(4, 6)}")
```

##### 类

```python
#类中的方法的第一个参数比兴被占用self
1 # 定义一个基类 Animal    
class Animal:
    def __init__(self, name, age):  #必需有 def _init_(self):
        """
        初始化动物对象
        :param name: 动物的名字
        :param age: 动物的年龄
        """
        self.name = name
        self.age = age

    def introduce(self):
        """
        打印动物的基本信息
        """
        print(f"I'm {self.name}, and I'm {self.age} years old.")

    def make_sound(self):
        """
        发出声音的方法，基类中只是一个占位方法
        """
        print("Some generic sound")


2 # 定义一个继承自 Animal 的 Cat 类
class Cat(Animal):
    def __init__(self, name, age, color):
        """
        初始化猫对象
        :param name: 猫的名字
        :param age: 猫的年龄
        :param color: 猫的颜色
        """
        super().__init__(name, age)
        self.color = color

    def make_sound(self):
        """
        重写父类的 make_sound 方法，猫会喵喵叫
        """
        print("Meow!")

    def show_color(self):
        """
        打印猫的颜色
        """
        print(f"My fur color is {self.color}.")


# 以下是使用这些类的示例代码
# 创建一个 Animal 对象
generic_animal = Animal("Generic", 3)
generic_animal.introduce()
generic_animal.make_sound()

# 创建一个 Dog 对象
dog = Dog("Buddy", 2, "Golden Retriever")
dog.introduce()
dog.make_sound()
dog.show_breed()

# 创建一个 Cat 对象
cat = Cat("Whiskers", 1, "Gray")
cat.introduce()
cat.make_sound()
cat.show_color()

3 # 继承  通过super关键字调用父类的构造函数
# 定义父类
class Animal:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        print(f"I'm {self.name}, and I'm {self.age} years old.")

    def make_sound(self):
        print("Some generic sound")

        
# 定义子类，继承自 Animal 类
class Dog(Animal):
    def __init__(self, name, age, breed):
        # 调用父类的构造函数来初始化父类的属性
        super().__init__(name, age)
        self.breed = breed

    # 重写父类的 make_sound 方法
    def make_sound(self):
        print("Woof! Woof!")

    def show_breed(self):
        print(f"I'm a {self.breed}.")


# 创建 Dog 类的对象
dog = Dog("Buddy", 2, "Golden Retriever")
dog.introduce()  # 调用父类的方法
dog.make_sound()  # 调用子类重写后的方法
dog.show_breed()  # 调用子类自己的方法

```

##### 文件操作

```python
# 1. 打开和创建文件
# 使用 open() 函数打开文件，'w' 表示写入模式，如果文件不存在则创建
file = open('example.txt', 'w')

# 2. 写入文件   再次使用前会清空原有的文本，如果想保留使用a
# 写入单行文本
file.write('This is the first line.\n')
# 写入多行文本
lines = ['This is the second line.\n', 'This is the third line.\n']
file.writelines(lines)

# 3. 关闭文件
# 关闭文件以释放系统资源
file.close()

# 4. 读取文件
# 'r' 表示读取模式
file = open('example.txt', 'r')

# 4.1 读取整个文件内容
content = file.read()
print('读取整个文件内容：')
print(content)

# 4.2 读取指定数量的字符
file.seek(0)  # 将文件指针移动到文件开头
partial_content = file.read(10)
print('\n读取前 10 个字符：')
print(partial_content)

# 4.3 逐行读取文件
file.seek(0)
print('\n逐行读取文件：')
for line in file:
    print(line.strip())  # strip() 用于去除每行末尾的换行符

# 5. 追加内容到文件  保留原因的内容
# 'a' 表示追加模式
file = open('example.txt', 'a')
file.write('This is an appended line.\n')
file.close()

# 6. 使用 with 语句操作文件
# with 语句会自动处理文件的打开和关闭，避免资源泄漏
with open('example.txt', 'r') as file:
    all_lines = file.readlines()
    print('\n使用 with 语句读取所有行：')
    for line in all_lines:
        print(line.strip())
        
#7.使用w+a进行文件的读和写
#w+a 读和写
with open('example.txt','w + r') as file
	file.read()
    file.write("Hello world")   
        
# 8. 二进制文件操作
# 'wb' 表示二进制写入模式
with open('binary_example.bin', 'wb') as binary_file:
    data = b'\x48\x65\x6c\x6c\x6f'  # 二进制数据（对应 'Hello'）
    binary_file.write(data)

# 'rb' 表示二进制读取模式
with open('binary_example.bin', 'rb') as binary_file:
    binary_content = binary_file.read()
    print('\n读取二进制文件内容：')
    print(binary_content)
```

##### 异常捕捉

```python
# 1. 基本的 try - except 结构
try:
    # 可能会引发异常的代码
    num1 = 10
    num2 = 0
    result = num1 / num2
    print(result)
except ZeroDivisionError:
    # 当发生 ZeroDivisionError 异常时执行的代码
    print("Error: division by zero!")

# 2. 捕获多种异常
try:
    num_str = "abc"
    num = int(num_str)
    result = 10 / num
    print(result)
except (ValueError, ZeroDivisionError):
    # 当发生 ValueError 或 ZeroDivisionError 异常时执行的代码
    print("An error occurred, either due to invalid input or division by zero.")

# 3. 分别捕获不同类型的异常
try:
    num_str = "abc"
    num = int(num_str)
    result = 10 / num
    print(result)
except ValueError:
    # 当发生 ValueError 异常时执行的代码
    print("Invalid input! Please enter a valid integer.")
except ZeroDivisionError:
    # 当发生 ZeroDivisionError 异常时执行的代码
    print("Error: division by zero!")

# 4. 使用 else 子句
try:
    num = 5
    result = 10 / num
except ZeroDivisionError:
    print("Error: division by zero!")
else:
    # 当 try 块中没有发生异常时执行的代码
    print(f"The result is {result}.")

# 5. 使用 finally 子句
try:
    file = open("nonexistent_file.txt", "r")
    content = file.read()
    print(content)
except FileNotFoundError:
    print("The file was not found.")
finally:
    # 无论 try 块中是否发生异常，finally 块中的代码都会执行
    try:
        file.close()
    except NameError:
        pass

# 6. 自定义异常
class MyCustomError(Exception):
    def __init__(self, message="This is a custom error."):
        self.message = message
        super().__init__(self.message)

try:
    raise MyCustomError("Something went wrong with our custom logic.")
except MyCustomError as e:
    print(f"Custom error caught: {e.message}")
```

##### 高阶函数

```python
# 1. 函数作为参数传递
# 定义一个高阶函数，它接受一个函数和一个列表作为参数
def apply_function(func, numbers):
    """
    对列表中的每个元素应用传入的函数
    :param func: 要应用的函数
    :param numbers: 包含元素的列表
    :return: 包含处理后元素的列表
    """
    result = []
    for num in numbers:
        result.append(func(num))
    return result

# 定义一个简单的函数，用于计算平方
def square(x):
    return x ** 2

# 定义一个简单的函数，用于计算立方
def cube(x):
    return x ** 3

numbers = [1, 2, 3, 4, 5]

# 使用 apply_function 高阶函数应用 square 函数
squared_numbers = apply_function(square, numbers)
print("Squared numbers:", squared_numbers)

# 使用 apply_function 高阶函数应用 cube 函数
cubed_numbers = apply_function(cube, numbers)
print("Cubed numbers:", cubed_numbers)

# 2. 函数作为返回值
# 定义一个高阶函数，它返回一个函数
def get_multiplier(factor):
    """
    返回一个将输入值乘以指定因子的函数
    :param factor: 乘数因子
    :return: 一个乘法函数
    """
    def multiplier(x):
        return x * factor
    return multiplier

# 获取一个将输入值乘以 3 的函数
triple = get_multiplier(3)

# 使用返回的函数
print("Triple of 5 is:", triple(5))

# 3. 内置高阶函数 - map()
# map() 函数将一个函数应用于可迭代对象的每个元素，并返回一个迭代器
numbers = [1, 2, 3, 4]
squared_numbers_map = map(square, numbers)
print("Squared numbers using map():", list(squared_numbers_map))

# 4. 内置高阶函数 - filter()
# filter() 函数根据指定的函数过滤可迭代对象中的元素，并返回一个迭代器
def is_even(x):
    return x % 2 == 0

numbers = [1, 2, 3, 4, 5, 6]
even_numbers = filter(is_even, numbers)
print("Even numbers using filter():", list(even_numbers))

# 5. 内置高阶函数 - reduce()
# reduce() 函数需要从 functools 模块导入，它对可迭代对象的元素进行累积操作
from functools import reduce

def add(x, y):
    return x + y

numbers = [1, 2, 3, 4]
sum_of_numbers = reduce(add, numbers)
print("Sum of numbers using reduce():", sum_of_numbers)
```

***代码解释：***

1. **函数作为参数传递**：定义了高阶函数 `apply_function`，它接受一个函数和一个列表作为参数，将该函数应用于列表中的每个元素，并返回处理后的列表。通过传入不同的函数（如 `square` 和 `cube`），可以实现不同的处理逻辑。
2. **函数作为返回值**：定义了高阶函数 `get_multiplier`，它接受一个因子作为参数，并返回一个新的函数 `multiplier`，该函数可以将输入值乘以指定的因子。
3. **内置高阶函数 - `map()`**：`map()` 函数将指定的函数应用于可迭代对象的每个元素，并返回一个迭代器。可以使用 `list()` 将迭代器转换为列表。
4. **内置高阶函数 - `filter()`**：`filter()` 函数根据指定的函数过滤可迭代对象中的元素，只保留使函数返回 `True` 的元素，并返回一个迭代器。
5. **内置高阶函数 - `reduce()`**：`reduce()` 函数需要从 `functools` 模块导入，它对可迭代对象的元素进行累积操作，将前两个元素应用指定的函数，然后将结果与下一个元素继续应用该函数，直到处理完所有元素。

##### 匿名函数

```python
# 1. 简单的匿名函数示例
# 定义一个匿名函数用于计算两个数的和
add = lambda x, y: x + y
result = add(3, 5)
print(f"3 + 5 的结果是: {result}")

# 2. 匿名函数作为参数传递给高阶函数
# 2.1 与 map() 函数结合
numbers = [1, 2, 3, 4, 5]
# 使用匿名函数结合 map() 计算每个数的立方
cubed_numbers = map(lambda x: x ** 3, numbers)
print("每个数的立方:", list(cubed_numbers))

# 2.2 与 filter() 函数结合
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
# 使用匿名函数结合 filter() 筛选出能被 3 整除的数
divisible_by_three = filter(lambda x: x % 3 == 0, numbers)
print("能被 3 整除的数:", list(divisible_by_three))

# 2.3 与 sorted() 函数结合
students = [
    {"name": "Alice", "age": 20},
    {"name": "Bob", "age": 18},
    {"name": "Charlie", "age": 22}
]
# 使用匿名函数作为 key 参数，按年龄对学生列表进行排序
sorted_students = sorted(students, key=lambda student: student["age"])
print("按年龄排序后的学生列表:", sorted_students)

# 3. 嵌套匿名函数
# 定义一个返回匿名函数的匿名函数
get_multiplier = lambda factor: (lambda x: x * factor)
double = get_multiplier(2)
triple = get_multiplier(3)
print(f"2 的两倍是: {double(2)}")
print(f"2 的三倍是: {triple(2)}")
```

***代码解释：***

1. **简单的匿名函数示例**：使用 `lambda` 关键字定义了一个简单的匿名函数 `add`，用于计算两个数的和，并调用该函数得到结果。

2. 匿名函数作为参数传递给高阶函数

   ：

   - **`map()` 函数**：将匿名函数 `lambda x: x ** 3` 应用到列表 `numbers` 的每个元素上，计算每个数的立方。
   - **`filter()` 函数**：使用匿名函数 `lambda x: x % 3 == 0` 对列表 `numbers` 进行筛选，找出能被 3 整除的数。
   - **`sorted()` 函数**：以匿名函数 `lambda student: student["age"]` 作为 `key` 参数，对包含学生信息的字典列表按年龄进行排序。

3. **嵌套匿名函数**：定义了一个返回匿名函数的匿名函数 `get_multiplier`，通过传入不同的因子得到不同的乘法函数（如 `double` 和 `triple`），并使用这些函数进行计算。

##### 飞机大战                        

```python
import random
import pygame
import math
from pygame.event import clear

# 1.初始化界面
pygame.init()
# 设置窗口的大小
screen = pygame.display.set_mode((800, 600))
# 设置窗口标题
pygame.display.set_caption('飞机大战')
# 加载图标图片
icon = pygame.image.load('ufo.png')
# 设置窗口图标
pygame.display.set_icon(icon)
# 加载背景图片
BackImage = pygame.image.load('bg.png')

#.添加音乐
pygame.mixer.music.load('bg.wav')
pygame.mixer.music.play(-1)  #单曲循环
#添加射中音效
bao_sound = pygame.mixer.Sound('exp.wav')

#.射击分数
score = 0
font = pygame.font.Font('freesansbold.ttf', 32)
def show_score():
    text = f"Score:{score}"
    score_render = font.render(text, True, (0, 255, 0))
    screen.blit(score_render, (10, 10))

#.游戏结束
isOver = False
Over_font = pygame.font.Font('freesansbold.ttf', 64)
def check_isOver():
    if isOver:
        text = "Game Over"
        render = font.render(text, True, (255, 0, 0))
        screen.blit(render, (400, 300))


# .飞机
playerImg = pygame.image.load('player.png')
playerX = 400
playerY = 500
playerStep = 0  # 玩家移动速度

def move_player():
    global playerX
    # 防止飞机出界  因为飞机的大小为64 * 64
    playerX += playerStep
    if playerX > 736:
        playerX = 736
    if playerX < 0:
        playerX = 0

# .敌人
number_of_enemies = 6  # 敌人数量

class Enemy:
    def __init__(self):
        try:
            self.img = pygame.image.load('enemy.png')
        except pygame.error as e:
            print(f"敌人图片加载失败: {e}")
        self.x = random.randint(200, 600)
        self.y = random.randint(50, 250)
        self.step = random.randint(2, 6)  # 敌人移动速度
    def reset(self):
        self.x = random.randint(200, 600)
        self.y = random.randint(50, 250)

enemies = []
for i in range(number_of_enemies):
    enemies.append(Enemy())

def distance(bx,by,ex,ey):
    a = bx - ex
    b = by - ey
    return math.sqrt(a*a + b*b)  #开根号

# .子弹
class Bullet:
    def __init__(self):
        try:
            self.img = pygame.image.load('bullet.png')
        except pygame.error as e:
            print(f"子弹图片加载失败: {e}")
        self.x = playerX + 16
        self.y = playerY + 10
        self.step = 10  # 子弹移动速度
    def hit (self):
        global score
        for e in enemies:
            if distance(self.x,self.y,e.x,e.y) < 30 :
                bao_sound.play()
                bullets.remove(self)
                e.reset()
                score += 1


bullets = []  # 保存现有的子弹  超过边界则去除

def show_bullet():
    for b in bullets:
        screen.blit(b.img, (b.x, b.y))
        b.hit()
        b.y -= b.step  # 子弹往上移动
        if b.y < 0:
            bullets.remove(b)  # 超过边界移除子弹

# 显示敌人，并且实现敌人的移动和下层
def show_enemy():
    global isOver
    for e in enemies:
        screen.blit(e.img, (e.x, e.y))
        e.x += e.step
        if e.x > 736 or e.x < 0:
            e.step = -e.step  # 改变移动方向
            e.y += 40  # 向下移动一定距离
            if e.y > 450:
                isOver = True
                print("Game Over")
                enemies.clear()

# 创建一个Clock对象来控制帧率
clock = pygame.time.Clock()
# 设置帧率
FPS = 60

# 2.游戏主循环
running = True
while running:
    # 限制帧率
    clock.tick(FPS)
    screen.blit(BackImage, (0, 0))  # 在游戏主循环中，每次循环都将这个背景图像绘制到屏幕的左上角，最后更新显示
    show_score()

    for event in pygame.event.get():  # 遍历所有的事件队列，获取当前发生的所有事件。
        if event.type == pygame.QUIT:  # 检查当前事件是否为关闭窗口事件（即用户点击了窗口的关闭按钮），如果是，则将 running 设置为 False，从而使主循环停止
            running = False
        if event.type == pygame.KEYDOWN:  # 如果是键盘按下.a向左移 d向右移
            if event.key == pygame.K_d:
                playerStep = 5
            elif event.key == pygame.K_a:
                playerStep = -5
            elif event.key == pygame.K_SPACE:
                bullets.append(Bullet())
        if event.type == pygame.KEYUP:  # 松开停止
            playerStep = 0

    screen.blit(playerImg, (playerX, playerY))  # 飞机的初始化位置
    move_player()
    show_enemy()
    show_bullet()
    check_isOver()
    # 更新显示
    pygame.display.update()

pygame.quit()
```

