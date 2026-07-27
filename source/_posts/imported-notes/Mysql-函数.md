---
title: 函数
date: 2026-06-27 04:05:00
categories:
  - 数据库与持久化
tags:
  - Mysql
  - 笔记
---
##  函数

**函数是指一段可以直接被另一端查程序调用的程序或代码**

- 字符串函数
- 数值函数
- 日期函数
- 流程函数

### 字符串函数

常用函数：

| 函数                             | 功能                                                      |
| :------------------------------- | --------------------------------------------------------- |
| CONCAT(s1, s2, …, sn)            | 字符串拼接，将s1, s2, …, sn拼接成一个字符串               |
| LOWER(str)                       | 将字符串全部转为小写                                      |
| UPPER(str)                       | 将字符串全部转为大写                                      |
| LPAD(str, n, pad)                | 左填充，用字符串pad对str的左边进行填充，达到n个字符串长度 |
| RPAD(str, n, pad)                | 右填充，用字符串pad对str的右边进行填充，达到n个字符串长度 |
| TRIM(str)                        | 去掉字符串头部和尾部的空格                                |
| SUBSTRING(str, start, len)       | 返回从字符串str从start位置起的len个长度的字符串           |
| REPLACE(column, source, replace) | 替换字符串                                                |



```sql
-- 拼接
SELECT CONCAT('Hello', 'World');  //Hello world;
-- 小写
SELECT LOWER('Hello');   //hello
-- 大写
SELECT UPPER('Hello'); //HELLO
-- 左填充
SELECT LPAD('01', 5, '-');  //加上空格到达5个字符  //---01
-- 右填充
SELECT RPAD('01', 5, '-');  //加上空格到达5个字符  //01---
-- 去除空格
SELECT TRIM(' Hello World '); //Helloworld
-- 切片（起始索引为1）
SELECT SUBSTRING('Hello World', 1, 5); //H
-- 由于业务需求变更，企业员工的工号，统一为5位数，目前不足5位数的全部在前面补0。比如:1号员工的工号应该为00001。
updata emp set workno = lpad(workno,5,'0');
```

### 数值函数

常见函数：

| 函数        | 功能                             |
| ----------- | -------------------------------- |
| CEIL(x)     | 向上取整                         |
| FLOOR(x)    | 向下取整                         |
| MOD(x, y)   | 返回x/y的模                      |
| RAND()      | 返回0~1内的随机数                |
| ROUND(x, y) | 求参数x的四舍五入值，保留y位小数 |

```sql
select ceil(1.5);     //2

select floor(1.9);    //1

select mod(5,4);      //1

rand();    

round(2.345,2);      //2.35

--案例:通过数据库的函数，生成一个六位数的随机验证码
select lpad(round(rand() * 1000000,0),6,'0');
```



### 日期函数

常用函数：

| 函数                               | 功能                                              |
| ---------------------------------- | ------------------------------------------------- |
| CURDATE()                          | 返回当前日期                                      |
| CURTIME()                          | 返回当前时间                                      |
| NOW()                              | 返回当前日期和时间                                |
| YEAR(date)                         | 获取指定date的年份                                |
| MONTH(date)                        | 获取指定date的月份                                |
| DAY(date)                          | 获取指定date的日期                                |
| DATE_ADD(date, INTERVAL expr type) | 返回一个日期/时间值加上一个时间间隔expr后的时间值 |
| DATEDIFF(date1, date2)             | 返回起始时间date1和结束时间date2之间的天数        |

例子：

```sql
select curdate();

select curtime();

select now();

select year(now());
select month(now());
select day(now());

select date_add(now(),interval 70 day);
select date_add(now(),interval 70 month);
select date_add(now(),interval 70 year);

select datedifff('2021-10-01','2021-8-08');

案例:查询所有员工的入职天数，并根据入职天数倒序排序。
select name,datediff(curdate,entrydate) as 'entrydays' from emp order by entrydays desc;
```



### 流程函数

常用函数：

| 函数                                                         | 功能                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------- |
| IF(value, t, f)                                              | 如果value为true，则返回t，否则返回f                     |
| IFNULL(value1, value2)                                       | 如果value1不为空，返回value1，否则返回value2            |
| CASE WHEN [ val1 ] THEN [ res1 ] … ELSE [ default ] END      | 如果val1为true，返回res1，… 否则返回default默认值       |
| CASE [ expr ] WHEN [ val1 ] THEN [ res1 ] … ELSE [ default ] END | 如果expr的值等于val1，返回res1，… 否则返回default默认值 |

```sql
select if(true,'0k','error');    //return ok;

select ifnull('ok','default');  //return ok
select ifnull(null,;default)    //return default

select 
	name 
	(case workaddress when '北京' then ' 一线城市' when '上海' then'一线城市' else '二线城市'end) as'工作地址'
from emp;
```



## 约束

分类：

| 约束                    | 描述                                                     | 关键字      |
| ----------------------- | -------------------------------------------------------- | ----------- |
| 非空约束                | 限制该字段的数据不能为null                               | NOT NULL    |
| 唯一约束                | 保证该字段的所有数据都是唯一、不重复的                   | UNIQUE      |
| 主键约束                | 主键是一行数据的唯一标识，要求非空且唯一                 | PRIMARY KEY |
| 默认约束                | 保存数据时，如果未指定该字段的值，则采用默认值           | DEFAULT     |
| 检查约束（8.0.1版本后） | 保证字段值满足某一个条件                                 | CHECK       |
| 外键约束                | 用来让两张图的数据之间建立连接，保证数据的一致性和完整性 | FOREIGN KEY |

约束是作用于表中字段上的，可以再创建表/修改表的时候添加约束。用于保证数据库中的数据正确，有效性和完整性。

### 常用约束

| 约束条件 | 关键字         |
| -------- | -------------- |
| 主键     | PRIMARY KEY    |
| 自动增长 | AUTO_INCREMENT |
| 不为空   | NOT NULL       |
| 唯一     | UNIQUE         |
| 逻辑条件 | CHECK          |
| 默认值   | DEFAULT        |

```
create table user(
	id int primary key auto_increment,
	name varchar(10) not null unique,
	age int check(age > 0 and age < 120),
	status char(1) default '1',
	gender char(1)
);
```

### 外键约束

添加外键：

```
CREATE TABLE 表名(
	字段名 字段类型,
	...
	[CONSTRAINT] [外键名称] FOREIGN KEY(外键字段名) REFERENCES 主表(主表列名)
);
ALTER TABLE 表名 ADD CONSTRAINT 外键名称 FOREIGN KEY (外键字段名) REFERENCES 主表(主表列名);

-- 例子
alter table emp add constraint fk_emp_dept_id foreign key(dept_id) references dept(id);
```

删除外键：
`ALTER TABLE 表名 DROP FOREIGN KEY 外键名;`

#### 删除/更新行为

| 行为        | 说明                                                         |
| ----------- | ------------------------------------------------------------ |
| NO ACTION   | 当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则不允许删除/更新（与RESTRICT一致） |
| RESTRICT    | 当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则不允许删除/更新（与NO ACTION一致） |
| CASCADE     | 当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则也删除/更新外键在子表中的记录 |
| SET NULL    | 当在父表中删除/更新对应记录时，首先检查该记录是否有对应外键，如果有则设置子表中该外键值为null（要求该外键允许为null） |
| SET DEFAULT | 父表有变更时，子表将外键设为一个默认值（Innodb不支持）       |

```sql
更改删除/更新行为：
`ALTER TABLE 表名 ADD CONSTRAINT 外键名称 FOREIGN KEY (外键字段) REFERENCES 主表名(主表字段名) ON UPDATE 行为 ON DELETE 行为;`
```



## 多表查询

###  多表关系

- 一对多（多对一）
- 多对多
- 一对一

#### 一对多

案例：部门与员工
关系：一个部门对应多个员工，一个员工对应一个部门
实现：在多的一方建立外键，指向一的一方的主键

#### 多对多

案例：学生与课程
关系：一个学生可以选多门课程，一门课程也可以供多个学生选修
实现：建立第三张中间表，中间表至少包含两个外键，分别关联两方主键

#### 一对一

案例：用户与用户详情
关系：一对一关系，多用于单表拆分，将一张表的基础字段放在一张表中，其他详情字段放在另一张表中，以提升操作效率
实现：在任意一方加入外键，关联另外一方的主键，并且设置外键为唯一的（UNIQUE）

### 查询

合并查询（笛卡尔积，会展示所有组合结果）：

```sql
select * from employee, dept;
```



> 笛卡尔积：两个集合A集合和B集合的所有组合情况（在多表查询时，需要消除无效的笛卡尔积，只需要有效的数据）

消除无效笛卡尔积：

```sql
select * from employee, dept where employee.dept = dept.id;
```



### 内连接查询

内连接查询的是两张表交集的部分

隐式内连接：

```sql
SELECT 字段列表 FROM 表1, 表2 WHERE 条件 ...;
```

显式内连接：

```sql
SELECT 字段列表 FROM 表1 [ INNER ] JOIN 表2 ON 连接条件 ...;
```

显式性能比隐式高  

### 外连接查询

左外连接：
查询左表所有数据，以及两张表交集部分数据

```sql
SELECT 字段列表 FROM 表1 LEFT [ OUTER ] JOIN 表2 ON 条件 ...;
```

相当于查询表1的所有数据，包含表1和表2交集部分数据

右外连接：
查询右表所有数据，以及两张表交集部分数据

```sql
SELECT 字段列表 FROM 表1 RIGHT [ OUTER ] JOIN 表2 ON 条件 ...;
```

左连接可以查询到没有dept的employee，右连接可以查询到没有employee的dept

### 自连接查询

当前表与自身的连接查询，自连接必须使用表别名

语法：

```sql
SELECT 字段列表 FROM 表A 别名A JOIN 表A 别名B ON 条件 ...;
```

自连接查询，可以是内连接查询，也可以是外连接查询

```sql
--1.查询员工 及其 所属领导的名字
select e.name,b.name from emp e,emp b where e.managerid = b.id;

--2.查询所有员工emp及其领导的名字emp，如果员工没有领导，也需要查询出来
select a.name ' ' ,b.name ' ' from  emp a left join emp b on a.managerid = b.id;

```



### 联合查询 union, union all

把多次查询的结果合并，形成一个新的查询集

语法：

```sql
SELECT 字段列表 FROM 表A ...
UNION [ALL]
SELECT 字段列表 FROM 表B ...

// 删除ALL即可保证查询的字段不重复出现
```

#### 注意事项

- UNION ALL 会有重复结果，UNION 不会
- 联合查询比使用or效率高，不会使索引失效

### 子查询

SQL语句中嵌套SELECT语句，称谓嵌套查询，又称子查询。

```sql
SELECT * FROM t1 WHERE column1 = ( SELECT column1 FROM t2);
//内部语句称为子查询
```

**子查询外部的语句可以是 INSERT / UPDATE / DELETE / SELECT 的任何一个**

根据子查询结果可以分为：

- 标量子查询（子查询结果为单个值）
- 列子查询（子查询结果为一列）
- 行子查询（子查询结果为一行）
- 表子查询（子查询结果为多行多列）

根据子查询位置可分为：

- WHERE 之后
- FROM 之后
- SELECT 之后

#### 标量子查询

子查询返回的结果是单个值（数字、字符串、日期等）。
常用操作符：=    < >     >     >=      <   <=

```sql
标量子查询
--1.查询“销售部”的所有员工信息
select *from emp where dept_id = (select id from dept where name = '销售' );
--2.查询在“方东白”入职之后的员工信息
select * from where entrydate > (select entrydate from where name ='方东白');

```

#### 列子查询

返回的结果是一列（可以是多行）。

常用操作符：

| 操作符 | 描述                                   |
| ------ | -------------------------------------- |
| IN     | 在指定的集合范围内，多选一             |
| NOT IN | 不在指定的集合范围内                   |
| ANY    | 子查询返回列表中，有任意一个满足即可   |
| SOME   | 与ANY等同，使用SOME的地方都可以使用ANY |
| ALL    | 询返回列表的所有值都必须满足           |

```sql
--列子查询
--1.查询“销售部”和“市场部”的所有员工信息
select *from emp where dept_id in(select id from dept where name = '销售部' or name = '市场部');
--2.查询比财务部所有人工资都高的员工信息
select * from emp where salary >all(select salary from emp where dept_id = (select id from dept where name = '财务部';);)
--3.查询比研发部其中任意一人工资高的员工信息
select * from emp where salary >any(some) (select salary from emp where dept_id = (select id from dept where name = '研发部'));
```

#### 行子查询

返回的结果是一行（可以是多列）。
常用操作符：=, <, >, IN, NOT IN

```sql
--1.查询与“张无忌”的薪资及直属领导相同的员工信息;
select *from emp where(salary,managerid) = (select salary,managerid from emp where name = '张无忌');
```

#### 表子查询

返回的结果是多行多列
常用操作符： 

```sql
--1.查询与“鹿杖客”，“宋远桥”的职位和薪资相同的员工信息
//select job,salary from emp where name = '鹿杖客'or name = '宋远桥';
select * from emp where(job,salary) in (select job,salary from emp where name = '鹿杖客'or name = '宋远桥');

--2.查询入职日期是“2006-01-01”之后的员工信息及其部门信息
//select * from emp where entrydate > '2006-01-01';//把这个作为一张表  m
select e.*,d.* from(select * from emp where entrydate > '2006-01-01') e left join dept d on e.dept_id = d.id;

```

### 总结

![image-20241102103931793](/notes-assets/Mysql/.assets/image-20241102103931793.png)  

## 事务

事务是一组操作的集合，事务会把所有操作作为一个整体一起向系统提交或撤销操作请求，即这些操作要么同时成功，要么同时失败。

```
转账操作(张三给李四转账1000)
--1.查询张三账户余额
select * from account where name = '张三 ';
--2.将张三账户余额-1000
updata account set money = money -1000 where name = '张三';
模拟sql语句错误   //-- 此语句出错后张三钱减少但是李四钱没有增加
--3.将李四账户余额+100d
updata account set money = money +1000 where name = '李四 ';

-- 查看事务提交方式
SELECT @@autocommit;
-- 设置事务提交方式，1为自动提交，0为手动提交，该设置只对当前会话有效
SET @@autocommit = 0;
-- 提交事务
COMMIT;
-- 回滚事务
ROLLBACK;


-- 设置手动提交后上面代码改为：
select * from account where name = '张三';
update account set money = money - 1000 where name = '张三';
update account set money = money + 1000 where name = '李四';
commit;//必须执行commit，数据库才会修改
```

操作方式二：

```sql
开启事务：
START TRANSACTION 或 BEGIN TRANSACTION;
提交事务：
COMMIT;
回滚事务：
ROLLBACK;
```

实例：

```
start transaction;
select * from account where name = '张三';
update account set money = money - 1000 where name = '张三';
update account set money = money + 1000 where name = '李四';
commit;
```

### 四大特性ACID

- 原子性(Atomicity)：事务是不可分割的最小操作但愿，要么全部成功，要么全部失败
- 一致性(Consistency)：事务完成时，必须使所有数据都保持一致状态
- 隔离性(Isolation)：数据库系统提供的隔离机制，保证事务在不受外部并发操作影响的独立环境下运行
- 持久性(Durability)：事务一旦提交或回滚，它对数据库中的数据的改变就是永久的

### 并发事务

| 问题       | 描述                                                         |
| ---------- | ------------------------------------------------------------ |
| 脏读       | 一个事务读到另一个事务还没提交的数据                         |
| 不可重复读 | 一个事务先后读取同一条记录，但两次读取的数据不同             |
| 幻读       | 一个事务按照条件查询数据时，没有对应的数据行，但是再插入数据时，又发现这行数据已经存在 |

并发事务隔离级别：

| 隔离级别              | 脏读 | 不可重复读 | 幻读 |
| --------------------- | ---- | ---------- | ---- |
| Read uncommitted      | √    | √          | √    |
| Read committed        | ×    | √          | √    |
| Repeatable Read(默认) | ×    | ×          | √    |
| Serializable          | ×    | ×          | ×    |

- √表示在当前隔离级别下该问题会出现
- Serializable 性能最低；Read uncommitted 性能最高，数据安全性最差

查看事务隔离级别：

```sql
`SELECT @@TRANSACTION_ISOLATION;
```

设置事务隔离级别：

```sql
SET [ SESSION | GLOBAL ] TRANSACTION ISOLATION LEVEL {READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE };
```

SESSION 是会话级别，表示只针对当前会话有效，GLOBAL 表示对所有会话有效
























