---
title: SQL
date: 2026-06-27 04:03:00
categories:
  - 数据库与持久化
tags:
  - Mysql
  - 笔记
---
## SQL通用语法

**语法**

- `SQL`语句可以单行或多行书写，以分号结尾。

- `SQL`语句可以使用空格/缩进来增强语句的可读性。

- `MySQL`数据库的`SQL`语句不区分大小写，关键字建议使用大写，
  注释:
  单行注释:--注释内容 或 #注释内容(`MySQL`特有)
  多行注释:/*注释内容 */

  

## SQL分类

![image-20241019114318600](/notes-assets/Mysql/.assets/image-20241019114318600.png)

**D-定义，M-操作，Q-查询，C-控制**



## DDL数据定义语言

**(不区分大小写)**

查询所有数据库：`SHOW DATABASES;`
查询当前数据库：`SELECT DATABASE();`
创建数据库：`CREATE DATABASE [ IF NOT EXISTS ] 数据库名 [ DEFAULT CHARSET 字符集] [COLLATE 排序规则 ];`
删除数据库：`DROP DATABASE [ IF EXISTS ] 数据库名;`
使用数据库：`USE 数据库名;`

**注意事项**

- UTF8字符集长度为3字节，有些符号占4字节，所以推荐用utf8mb4字符集

#### 表操作

查询当前数据库所有表：`SHOW TABLES;`
查询表结构：`DESC 表名;`
查询指定表的建表语句：`SHOW CREATE TABLE 表名;`

```sql
CREATE TABLE 表名(
	字段1 字段1类型 [COMMENT 字段1注释],
	字段2 字段2类型 [COMMENT 字段2注释],
	字段3 字段3类型 [COMMENT 字段3注释],
	...
	字段n 字段n类型 [COMMENT 字段n注释]
)[ COMMENT 表注释 ];
//id int commnet '学号',
```

**最后一个字段后面没有逗号**

**修改与删除**

添加字段：`ALTER TABLE 表名 ADD 字段名 类型(长度) [COMMENT 注释] [约束];`
例：`ALTER TABLE emp ADD nickname varchar(20) COMMENT '昵称';`

修改数据类型：`ALTER TABLE 表名 MODIFY 字段名 新数据类型(长度);`

修改字段名和字段类型：`ALTER TABLE 表名 CHANGE 旧字段名 新字段名 类型(长度) [COMMENT 注释] [约束];`
例：将emp表的nickname字段修改为username，类型为varchar(30)
`ALTER TABLE emp CHANGE nickname username varchar(30) COMMENT '昵称';`

删除字段：`ALTER TABLE 表名 DROP 字段名;`

修改表名：`ALTER TABLE 表名 RENAME TO 新表名`

删除表：`DROP TABLE [IF EXISTS] 表名;`
删除表，并重新创建该表：`TRUNCATE TABLE 表名;`



## DML数据操作语言

#### 添加数据

指定字段：`INSERT INTO 表名 (字段名1, 字段名2, ...) VALUES (值1, 值2, ...);`
全部字段：`INSERT INTO 表名 VALUES (值1, 值2, ...);`

批量添加数据：`INSERT INTO 表名 (字段名1, 字段名2, ...) VALUES (值1, 值2, ...), (值1, 值2, ...), (值1, 值2, ...);`
`INSERT INTO 表名 VALUES (值1, 值2, ...), (值1, 值2, ...), (值1, 值2, ...);`

##### 注意事项

- 字符串和日期类型数据应该包含在引号中
- 插入的数据大小应该在字段的规定范围内

#### 更新和删除数据

修改数据：`UPDATE 表名 SET 字段名1 = 值1, 字段名2 = 值2, ... [ WHERE 条件 ];`

例：`UPDATE emp SET name = 'Jack' WHERE id = 1;`

删除数据：`DELETE FROM 表名 [ WHERE 条件 ];`



## DQL数据查询语言

语法：

```
SELECT
	字段列表
FROM
	表名字段
WHERE
	条件列表
GROUP BY
	分组字段列表
HAVING
	分组后的条件列表
ORDER BY
	排序字段列表
LIMIT
	分页参数
```

 基本查询

1.查询多个字段

```sql
SELECT 字段1, 字段2, 字段3, ... FROM 表名;`
SELECT * FROM 表名;
```

2.设置别名

```sql
SELECT 字段1 [ AS 别名1 ], 字段2 [ AS 别名2 ], 字段3 [ AS 别名3 ], ... FROM 表名;
SELECT 字段1 [ 别名1 ], 字段2 [ 别名2 ], 字段3 [ 别名3 ], ... FROM 表名;//A
```

3.去除重复记录：

```sql
SELECT DISTINCT 字段列表 FROM 表名;
```

#### **DQL聚合函数**

```sql
count   //统计数量
max		//最大值
min		//最小值
avg		//平均值
sum		//求和
```

语法

```sql
select 聚合函数 （字段列表） from 表名  //*代表all

select avg(*) from emp;
select sum(age) from emp where workaddress = '西安';
```

##### 注意事项

null值不参与聚合函数



#### 分组查询

语法

```sql
select 字段列表 from 表名 [where 条件] Group By 分组字段名[Having 分组后的过滤条件]
```

**where 和 Having的区别**

->执行时机不同：where 是分组之前进行过滤，不满足where条件的不参与分组，having是分组之后的过滤

->判断条件不同：where不能对聚合函数判断，而having可以

执行顺序：where > 聚合函数>having

例子：

```sql
-- 根据性别分组，统计男性和女性数量（只显示分组数量，不显示哪个是男哪个是女）
select count(*) from employee group by gender;
-- 根据性别分组，统计男性和女性数量
select gender, count(*) from employee group by gender;
-- 根据性别分组，统计男性和女性的平均年龄
select gender, avg(age) from employee group by gender;
-- 年龄小于45，并根据工作地址分组
select workaddress, count(*) from employee where age < 45 group by workaddress;
-- 年龄小于45，并根据工作地址分组，获取员工数量大于等于3的工作地址
select workaddress, count(*) address_count from employee where age < 45 group by workaddress having addre
```

#### 排序查询

语法

```sql
select 字段列表 from 表名 order by字段1，排序方式1，字段2，排序方式2
//ASC  升序（默认为升序）
//DESC 降序

select * from emp order by age，asc;
```

多字段排序，当第一个字段相同时，才会根据第二个字段排序



#### 分页查询

语法

```sql
select 字段列表 from 表名 Limit 起始索引，查询记录数
```

起始索引从0开始，起始索引 = （查询页码 - 1）* 每页显示记录数

如果查询记录是第一页数据，起始索引省略，简写为Limit 10



#### DQL执行顺序

```sql
select 4
from 1
where 2
Group By 3
Having
Order By 5
Limit 6
```

## DCL数据控制语言

#### 管理用户

```sql
//查询用户
USE mysql;
SELECT * FROM user
/创建用户
CREATE USER '用户名'@'主机名' IDENTIFIED BY '密码';
修改用户密码：
ALTER USER '用户名'@'主机名' IDENTIFIED WITH mysql_native_password BY '新密码';
删除用户：
DROP USER '用户名'@'主机名';
```

例子：

```sql
-- 创建用户test，只能在当前主机localhost访问
create user 'test'@'localhost' identified by '123456';
-- 创建用户test，能在任意主机访问
create user 'test'@'%' identified by '123456';
create user 'test' identified by '123456';
-- 修改密码
alter user 'test'@'localhost' identified with mysql_native_password by '1234';
-- 删除用户
drop user 'test'@'localhost';
```

##### 注意事项

- 主机名可以使用 % 通配

#### 权限控制

常用权限：

| 权限                | 说明               |
| ------------------- | ------------------ |
| ALL, ALL PRIVILEGES | 所有权限           |
| SELECT              | 查询数据           |
| INSERT              | 插入数据           |
| UPDATE              | 修改数据           |
| DELETE              | 删除数据           |
| ALTER               | 修改表             |
| DROP                | 删除数据库/表/视图 |
| CREATE              | 创建数据库/表      |

查询权限：
`SHOW GRANTS FOR '用户名'@'主机名';`

授予权限：
`GRANT 权限列表 ON 数据库名.表名 TO '用户名'@'主机名';`

撤销权限：
`REVOKE 权限列表 ON 数据库名.表名 FROM '用户名'@'主机名';`

##### 注意事项

- 多个权限用逗号分隔
- 授权时，数据库名和表名可以用 * 进行通配，代表所有


























