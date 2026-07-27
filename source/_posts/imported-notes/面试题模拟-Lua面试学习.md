---
title: Lua面试学习
date: 2026-06-27 04:41:00
categories:
  - 面试准备
tags:
  - 面试题模拟
  - 笔记
---
![image-20260219010901529](/notes-assets/%E9%9D%A2%E8%AF%95%E9%A2%98%E6%A8%A1%E6%8B%9F/assets/image-20260219010901529.png)

# 1.Table表

### 基本原理：

- 在lua中不存在字典，列表等数据类型，同时也不存在class与struct等数据类型，所有的这些类型都是基于Table表实现的。

- lua是关联性数据结构，可以使用任意类型的值来表示索引，但不可以是nil
- lua是不固定大小的数据结构，可以自动进行扩容
- 如果在table中允许nil存在，他是会占一个索引位 
- {}相对于匿名table，如果判断一个table是否为nil，不能直接进行与{}比较，因为相对于2个table，而非空。`if next(data) == nil then end`进行判断

```lua
--数组(如果使用Table表来实现数组，默认索引是从1开始的，但是可以指定元素索引。并且lua中的数组中元素类型可以不相同)
--在lua中的#是取出数组长度，但是遇见nil会直接停止，不会获取后序的元素
local Mytable = {1,3,"av",1.2,true}
Mytable["123"] = "123"
Mytable[1] = "1234" --索引为1的值的元素修改为1
Mytable = nil

for i = 1,#Mytable do
    print(Mytable[i])
end
--字典(使用任意类型的值（除了 nil）作为键。包含空格的键需要用方括号来包裹键。如果使用数值类型作为键时，需要使用[]进行包裹)
local MyDic = {
    name = "123",  ---- 字符串键（简化写法，等价于 ["name"] = "123"）
    version = '1.1',
    ["new new"] = 2020,
    [1] = 2
}
MyDic = nil

for key,value in pairs(MyDic) do
    print(key,value);    
end
```

**对于 `{v1, v2, v3}` 这种隐式下标写法，Lua 会自动给元素分配从 1 开始的连续整数下标（即 `[1]=v1, [2]=v2, [3]=v3`），当表中同时出现**隐式下标**和**显式下标**时，Lua 会按代码书写顺序依次赋值，后赋值的会覆盖先赋值的**

```lua
-- 定义表，显示赋值的会进行分配，如果下标重合，会被覆盖
local da = {1, 2, 3, [3] = 4}

-- 打印表中每个下标的值
print("下标1的值：", da[1])  -- 输出 1
print("下标2的值：", da[2])  -- 输出 2
print("下标3的值：", da[3])  -- 输出 4（被显式赋值覆盖）

-- 遍历表所有键值对，更直观看到结果
for k, v in pairs(da) do
    print("键：" .. k .. "，值：" .. v)
end
```

**此外，对于lua中不存在结构体以及类等结构，我们可以使用table来模拟，因此我们可以在table中创建函数**

```lua
-- 定义一个表，包含多种类型的元素
local data = {1,1,1,"Mydata",true}

-- 给表定义一个名为 test 的方法（注意：Lua中方法是表的函数属性）
function data:test(p)  -- 这里去掉多余的 do
    print(p)          -- 打印传入的参数 p
    print(data[1])    -- 打印表 data 下标为 1 的元素（值为 1）或者 self[1]
end  -- 补充闭合函数的 end

-- 调用这个方法（两种合法调用方式）
data:test("Hello Lua")  -- 推荐的冒号调用方式，将自身进行传入
-- data.test(data, "Hello Lua")  -- 等价的点调用方式（需手动传 self）
```

**table模拟类结构**

```lua
-- 定义一个"学生对象"（包含属性 + 方法）
local student = {
    name = "李四",
    score = 85,
    
    -- 方法1：打印学生信息（直接在表内定义函数）
    show_info = function(self)
        print("姓名：" .. self.name .. "，分数：" .. self.score)
    end,
    
    -- 方法2：修改分数（后续也可动态添加）
    update_score = function(self, new_score)
        self.score = new_score
        print("分数已更新为：" .. self.score)
    end
}

-- 调用对象方法（两种等价方式）
student.show_info(student)  -- 方式1：手动传 self
student:update_score(92)    -- 方式2：冒号调用（Lua 自动传 self，推荐）
student:show_info()         -- 输出：姓名：李四，分数：92
```



### 遍历：

在lua中对Table进行遍历的时候，一般是使用pairs，ipairs进行。两者都是迭代器。因为lua的表是无序的,使用下标不是固定的，此时遍历都会产生区别。

- 对于pairs会遍历所有key，对于key的类型没有要求，遇到nil时可以跳过，不会影响后面的遍历，既可以遍历数组部分，又能遍历哈希部分，但是不保证遍历顺序，因为Lua的表是无序的。
- pairs 是一个更通用的迭代器生成器，用于遍历表中的所有键值对。它利用了Lua的内置函数 `next`，该函数会返回表中下一个键值对。
- `pairs` 返回三个值：`next` 函数、表 `t` 和初始键 `nil`。`next` 函数会从表中返回下一个键值对，直到没有更多的键值对

```lua
function pairs(t)
    return next,t,nil
end
```



- 对于ipairs是从索引1开始遍历，步长为1，只能遍历数组部分， 中间不是数字的key忽略, 到第一个不连续的数字为止（不含），遍历时只能取key为整数值，遇到nil时终止遍历。
- 这个实现中，ipairs 返回一个迭代器函数、表 `t` 和初始索引 `0`。迭代器函数每次调用时，会将索引 `i` 加1，并检查表中该索引的值是否为 `nil`。如果值为 `nil`，则停止迭代。

```lua
function ipairs(t)
    return function(t, i)
        i = i + 1
        local v = t[i]
        if v == nil then
            return nil, nil
        end
        return i, v
    end, t, 0
end
```

在Lua中，表是基于哈希表的，这意味着它们可以存储任何类型的键，而不仅仅是整数。当你使用非连续的索引（如[3] = 10）时，Lua会将这些索引转换为哈希键，以便在表中存储和检索对应的值。

### 点和冒号的区别

| 操作符  | 用途               | 隐式参数        | 调用示例               |
| ------- | ------------------ | --------------- | ---------------------- |
| **`.`** | **普通成员访问**   | 无              | `obj.method(obj, arg)` |
| **`:`** | **方法调用语法糖** | 自动传递 `self` | `obj:method(arg)`      |

**点号：**

```lua
-- 定义一个表
local obj = {
    name = "Lua",
    sayHello = function(self, msg)
        print(self.name .. " says: " .. msg)
    end
}

-- 使用点号调用（必须显式传递 self）
obj.sayHello(obj, "Hello!")  -- 输出: Lua says: Hello!
```

如果函数需要传递本身的话，则在调用的时候需要将本题显示传递；

**冒号：**

```lua
local obj = {
    name = "Lua",
    sayHelo = function(self,msg)
        print(self.name .." says: " .. msg)
    end
}
obj.sayHello("Hello!")
```



# 2.元表

基本概念：

- **每个 table 都可以有一个元表**。元表用于“拦截”或“重载”某些操作。元表本身也是一个 table
- 通过 `setmetatable()` 进行设置，通过 `getmetatable()` 获取

```lua
--设置元表
local t = {}
local mt = {}

setmetatable(t, mt)  --mt是t的元表

--获取元表
local m = getmetatable(t)
```

**元方法：当对 table 做某些“特殊操作”时，Lua 会去元表中查找对应的字段（称为元方法）。**

- __index：当访问 table 中 **不存在的字段** 时触发。如果在本表中查找不到字段，则取元表中进行寻找。

如果访问一个表中不存在的字段时，如果这个表的元表设置了 `__index` 且 `__index` 是**函数**，Lua 就会自动调用这个函数，并且会把**被访问的原表**和**不存在的那个键**作为两个参数传给这个函数，函数的返回值会作为这次 “字段访问” 的结果。

 如果__index是一个表，Lua会在这个表里面查找key对应的值。

```lua
local proto = { name = "默认" }
local t = {}
setmetatable(t, { __index = proto })

--以table的形式

print(t.name)  -- 默认

--以方法的形式
setmetatable(t, {
    __index = function(self, key)
        return "不存在"
    end
})
```

- __newindex：当你给表的一个缺少的索引赋值，解释器就会查找 _ _newindex 元方法：如果存在则调用这个函数而不进行赋值操作。

当赋值时，如果赋值一个不存在的索引。

​    如果__newindex是一个表，那么会把这个值赋值到newindex所指的表中（有这个索引就修改，没有就创建），不会修改自己；

​    如果__newindex是一个函数，那么会调用这个函数。

##### 参数：    

**`    table`**：被赋值的表。

**`    key`**：被赋值的键。

**`    value`**：被赋值的值。

![img](/notes-assets/%E9%9D%A2%E8%AF%95%E9%A2%98%E6%A8%A1%E6%8B%9F/assets/96a14488ceee57aa0578721cc5feb60d.png)

```lua
-- 定义空表，用于接收__newindex重定向的赋值
mymetatable = {}
-- 初始化mytable并设置元表，__newindex指向mymetatable（拦截不存在键的赋值）
mytable = setmetatable({key1 = "value1"}, { __newindex = mymetatable })

print(mytable.key1)
-- 给mytable不存在的newkey赋值，触发__newindex，值存入mymetatable
mytable.newkey = "新值2"

print(mytable.newkey,mymetatable.newkey)
-- 给mytable已存在的key1赋值，仅修改自身（不触发__newindex）
mytable.key1 = "新值1"

print(mytable.key1,mymetatable.key1)
```

- __add：table 支持运算符，让表可以进行相加操作

```lua
-- 1. 定义第一个表（包含数值属性num）
local t1 = {num = 10}
-- 2. 定义第二个表（包含数值属性num）
local t2 = {num = 20}

-- 3. 定义元表：通过__add指定表相加的规则（取两个表的num属性相加）
local meta = {
    __add = function(a, b)  -- a、b分别对应+左右两边的表
        return {num = a.num + b.num}  -- 返回新表，num为两表num之和
    end
}
setmetatable(t1, meta)
setmetatable(t2, meta)

local t3 = t1 + t2

print(t3.num)
```

- __call：`__call` 是用来让**表可以像函数一样被调用**的元方法，核心作用是自定义表被当作函数执行时的逻辑

```lua
-- 1. 定义一个普通表（包含基础属性）
local my_table = {name = "测试表", version = 1.0}

-- 2. 定义元表：通过__call指定表被调用时的逻辑
local meta = {
    -- __call函数：第一个参数是被调用的表本身，后续参数是调用时传入的参数
    __call = function(tab, arg1, arg2)
        print("表被当作函数调用了！")
        print("表名：", tab.name)
        print("传入的参数1：", arg1)
        print("传入的参数2：", arg2)
        -- 可返回自定义结果
        return "调用成功，版本：" .. tab.version
    end
}
setmetatable(my_table, meta)
local result = my_table("参数A", "参数B")  --将2个参数传入，在my——table这找到能接受2个参数的方法，找不到元表进行操作
print(result)
```

- __tostring

### 关于在lua中如何实现只读表

首先我们需要使用_ _index和 _ _newindex2个元方法。在下列的代码，首先先给obj进行赋值，此时t是一个table，它的值是{"1","2","#"},然后开始执行onlyread函数，创建一个newT表，创建一个mt表，此时__index函数是一个表，  _ _newindex是一个函数，如果

```lua
function onlyread(t)
    local newT = {};
    local mt = {
        __index = t,  --如果t是一个表，那么在newT中没找到该元素，需要在元表中查找
        __newindex = function()
        	error("不可修改");    
        end
    }
    setmetadata(newT,mt);
    return newT;
end

local obj = onlyread({"1","2","#"})
obj[3] = "3";
```



# 3.闭包

闭包是一个函数 **加上** 该函数能访问的所有 **非局部变量**（upvalue）。

闭包就是 **“有记忆的函数”**。一个普通的函数用完就忘，但闭包能记住它诞生时接触到的外部变量，并在每次被调用时，基于这个记忆更新状态。就像你办了一张独

立的会员卡，每次消费都会扣除卡内余额——这个余额对外界是隐藏的，只有闭包自己记得。

```lua
function 开一张会员卡()
    local 余额 = 100  -- 新卡初始送100元
    return function(消费金额)  -- 返回一个“刷卡消费”的功能
        余额 = 余额 - 消费金额
        print("本次消费"..消费金额.."元，卡里还剩"..余额.."元")
    end
end

我的卡 = 开一张会员卡()

我的卡(30)  -- 输出：本次消费30元，卡里还剩70元
我的卡(20)  -- 输出：本次消费20元，卡里还剩50元

我老婆的卡 = 开一张会员卡()
我老婆的卡(40)  -- 输出：本次消费40元，卡里还剩60元
```

实际例子

```lua
function 计数器工厂()
    local 计数 = 0  -- 这是小本本上的第一页
    return function()
        计数 = 计数 + 1  -- 每次调用，先看小本本，然后修改
        return 计数
    end
end

数羊 = 计数器工厂()
print(数羊())  -- 1  （小本本：0 -> 1）
print(数羊())  -- 2  （小本本：1 -> 2）

数苹果 = 计数器工厂()
print(数苹果()) -- 1  （这是本全新的小本本，从0开始）
```

# 4.lua的数据类型

在lua中，实际存在的数据类型包括number,bool,nil,table,thread,string,function,userdata。

**nil**：代表“无”或“无效值”。

- 全局变量在赋值前的默认值是 `nil`。
- 将变量赋值为 `nil`相当于删除它。
- 在布尔上下文中视为 `false`。

**number**：表示所有数值，包含整数和浮点数。

- 无需声明类型，运算时自动进行整数/浮点数转换。
- Lua 5.3 开始，`number`分为两个子类型：`integer`（64位有符号整数）和 `float`（双精度浮点数）。
- 但 `type()`函数对两者都返回 `"number"`。
- 可通过 `math.type(42)`进一步区分（返回 `"integer"`）。

**boolean**：只有两个——`true`和 `false`。

- 在 Lua 中，**只有 `false`和 `nil`被视为假**，其他所有值（包括 0、空字符串、空表）在条件判断中都视为真。
- `if 0 then print("true") end --> 输出"true"`

**string**

- 不可变（immutable），修改会创建新字符串。
- 支持单引号 `'...'`、双引号 `"..."`和长括号 `[[...]]`。使用 `..`进行连接。
- 字符串驻留：相同字符串在内存中只存一份。
- 数字与字符串自动转换：`print("10" + 1) --> 11`
- 显式转换：`tostring(123)`, `tonumber("123")`

**function**:Lua 中的“一等公民”，可赋值、传递、作为返回值。

- **闭包**：函数可捕获并访问外层局部变量（upvalue）。
- 支持函数式编程：高阶函数、匿名函数、柯里化等。

**table（表）**:Lua **唯一**的数据结构，是所有复杂数据的基础。

- 关联数组：键可为除 `nil`外的任何类型。

  数组部分：以连续整数为键的序列（从 1 开始）。

  字典部分：存储其他键值对。

- 表引用传递：赋值、传参都是传递引用。

  元表：可通过元表实现面向对象、操作符重载。

  构造灵活：`{1, 2, 3}`（数组）、`{x=1, y=2}`（字典）。

**userdata**:用于 Lua 与 C 语言扩展交互。

- 表示一块由 C 语言管理的内存。Lua 代码只能使用，不能直接创建或修改其内部结构。
- 通常用于表示文件指针、窗口句柄、C 结构体等。

**thread**:不是操作系统线程，而是 **Lua 协程**。

- 协作式多任务：需主动让出执行权。

  轻量级：创建开销小。

  通过 `coroutine`库操作。

- `local co = coroutine.create(function() print("hi") end)`

# 5.C#和xlua的互相调用

#### C#与xlua的调用原理：

- 在C#中将需要热更的类标记（标签，静态列表，动态列表）。
- 生成函数连接器来连接lua脚本和c#函数。
- 对编译生成的dll进行修改。
- 把代码的执行路径修改到lua脚本中（如果lua中执行了对应的热修复函数，则把il中对应的函数替换为对应的lua函数）。



# 6.lua与Unity的相互调用

# 7.lua与Unity的GC

#### UnityGC

Unity的是GC非分代非压缩的标记清除算法，它会在需要进行GC时占用主线程，进行遍历-标记-垃圾回收的过程，然后在归还主线程控制权。这会导致帧数的突然

下降，产生卡顿。所以我们需要慎重地处理对象的创建（内存请求），还有释放（使用GC管理内存是没有主动释放内存的接口的，但是我们可以通过消除对某个

对象的引用来做到这一点）。此外，Unity的代码分为两部分：托管与非托管，GC影响的只有托管部分的代码使用的堆内存。而且这个托管堆占用的地址空间不会

返还给操作系统。标记清楚算法可以解决两个变量相互引用，产生标记的现象。

### LuaGC

Lua 使用**增量标记-清除**垃圾回收机制，采用三色标记算法（白-灰-黑）。对象被创建时标记为白色；GC 运行时，从根集合出发，将可达对象标记为灰色并放入待

处理列表；递归扫描灰色对象引用的白色对象，将其变为灰色；扫描完毕后，存活对象变为黑色，剩余的白色对象被清除。GC 过程分步执行，避免长时间停顿，

可自动或手动触发，支持调节 GC 速度和内存阈值。

### C#GC

C# 使用**分代标记-压缩**垃圾回收机制。内存分为三代（0、1、2代），新对象分配在第0代。GC触发时，从根引用出发标记存活对象，然后压缩内存消除碎片，存

活对象晋升到下一代。第0代回收最频繁，第2代回收代价最高。托管堆分为小对象段（<85KB）和大对象段（直接进入第2代）。GC有工作站（低延迟）和服务器

（高吞吐）两种模式，支持后台并发回收以减少暂停时间。

#### Lua减少GC策略

1.减少临时对象的创建：避免在lua脚本里频繁创建和销毁临时对象，可以通过重用变量来减少内存的分配。

2.优化C#和Lua的交互：在使用XLua时，可以通过[GCOptimize]标记来优化C#和Lua之间的传递值类型（如结构体、枚举等）时的GC分配。

3.使用对象池：Lua可以调用C#测的对象池来管理C#对象的引用，避免频繁创建和销毁对象。

4.合理管理引用：Lua对C#对象的引用需要合理管理，保证不再使用的对象可以正确被回收。

5.手动发起Lua GC。

# 8.热更新机制

# 9.lua协程

# 10.模块与包
