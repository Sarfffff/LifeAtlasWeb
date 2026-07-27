---
title: Xml
date: 2026-06-27 04:36:00
categories:
  - 数据库与持久化
tags:
  - 数据持久化
  - 笔记
---
# 数据持久化

数据持久化是指将应用程序中的临时数据（如游戏进度、玩家设置等）**永久保存**到存储设备（硬盘、SD卡等）中的过程，以便在应用程序关闭后再次启动时能够恢复这些数据。

![image-20250614130012390](/notes-assets/%E6%95%B0%E6%8D%AE%E6%8C%81%E4%B9%85%E5%8C%96/assets/image-20250614130012390.png)

# Xml

![image-20250725172836914](/notes-assets/%E6%95%B0%E6%8D%AE%E6%8C%81%E4%B9%85%E5%8C%96/assets/image-20250725172836914.png)

固定语法

```xml
<?xml version="1.0" encoding="UTF-8"?> <!--版本和编码格式-->
```

![image-20250803164931454](/notes-assets/%E6%95%B0%E6%8D%AE%E6%8C%81%E4%B9%85%E5%8C%96/assets/image-20250803164931454.png)

![image-20250803165206844](/notes-assets/%E6%95%B0%E6%8D%AE%E6%8C%81%E4%B9%85%E5%8C%96/assets/image-20250803165206844.png)

# 在C#中读取XML文件的方法

在C#中，你可以使用多种方式读取XML文件。以下是几种常用的方法：

## 1. 使用XmlDocument类（传统方式）

```C#
using System.Xml;

// 创建XmlDocument对象
XmlDocument xmlDoc = new XmlDocument();

// 加载XML文件
xmlDoc.Load("path/to/your/file.xml");

// 获取根节点
XmlNode root = xmlDoc.DocumentElement;

// 遍历节点
foreach (XmlNode node in root.ChildNodes)
{
    Console.WriteLine($"节点名: {node.Name}");
    Console.WriteLine($"节点值: {node.InnerText}");
    
    // 读取属性
    if (node.Attributes != null)
    {
        foreach (XmlAttribute attr in node.Attributes)
        {
            Console.WriteLine($"属性: {attr.Name} = {attr.Value}");
        }
    }
}
```

## 2. 使用XDocument类（LINQ to XML，推荐方式）

```c#
using System.Xml.Linq;

// 加载XML文件
XDocument xdoc = XDocument.Load("path/to/your/file.xml");

// 获取根元素
XElement root = xdoc.Root;

// 使用LINQ查询XML
var elements = from el in root.Elements()
               select el;

foreach (XElement el in elements)
{
    Console.WriteLine($"元素名: {el.Name}");
    Console.WriteLine($"元素值: {el.Value}");
    
    // 读取属性
    foreach (XAttribute attr in el.Attributes())
    {
        Console.WriteLine($"属性: {attr.Name} = {attr.Value}");
    }
}
```

## 3. 使用XmlReader类（流式读取，适合大文件）

```c#
using System.Xml;

// 创建XmlReader
using (XmlReader reader = XmlReader.Create("path/to/your/file.xml"))
{
    while (reader.Read())
    {
        // 只处理元素节点
        if (reader.NodeType == XmlNodeType.Element)
        {
            Console.WriteLine($"节点名: {reader.Name}");
            
            // 读取属性
            if (reader.HasAttributes)
            {
                while (reader.MoveToNextAttribute())
                {
                    Console.WriteLine($"属性: {reader.Name} = {reader.Value}");
                }
                // 移回元素
                reader.MoveToElement();
            }
        }
        else if (reader.NodeType == XmlNodeType.Text)
        {
            Console.WriteLine($"节点值: {reader.Value}");
        }
    }
}
```

## 4. 反序列化为对象（推荐用于结构化数据）

首先定义一个与XML结构对应的类：

```C#
[Serializable]
[XmlRoot("Root")] // 对应XML的根元素名
public class MyData
{
    [XmlElement("Item")]
    public List<Item> Items { get; set; }
}

public class Item
{
    [XmlAttribute("id")] // 对应属性
    public int Id { get; set; }
    
    [XmlElement("Name")] // 对应子元素
    public string Name { get; set; }
    
    [XmlElement("Value")]
    public string Value { get; set; }
}
```

然后使用XmlSerializer反序列化：

```C#
using System.Xml.Serialization;

// 创建序列化器
XmlSerializer serializer = new XmlSerializer(typeof(MyData));

// 读取并反序列化
using (FileStream stream = new FileStream("path/to/your/file.xml", FileMode.Open))
{
    MyData data = (MyData)serializer.Deserialize(stream);
    
    // 使用数据
    foreach (var item in data.Items)
    {
        Console.WriteLine($"ID: {item.Id}, Name: {item.Name}, Value: {item.Value}");
    }
}
```

