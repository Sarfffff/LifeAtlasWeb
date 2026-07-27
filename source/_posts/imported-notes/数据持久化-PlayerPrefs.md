---
title: PlayerPrefs
date: 2026-06-27 04:35:00
categories:
  - 数据库与持久化
tags:
  - 数据持久化
  - 笔记
---
# 数据持久化

数据持久化是指将应用程序中的临时数据（如游戏进度、玩家设置等）**永久保存**到存储设备（硬盘、SD卡等）中的过程，以便在应用程序关闭后再次启动时能够恢复这些数据。

![image-20250614130012390](/notes-assets/%E6%95%B0%E6%8D%AE%E6%8C%81%E4%B9%85%E5%8C%96/assets/image-20250614130012390.png)

# Playerprefs

PlayerPrefs是Unity提供的一个简单的**键值对存储系统**（键：string类型，值： int float string），用于在游戏会话之间保存和加载玩家偏好设置或简单游戏数据。它是Unity中最基础的数据持久化解决方案，是Unity提供的可以用于存储玩家数据的公共类

1. **轻量级存储**：适合存储少量简单数据（如设置、分数等）
2. **跨平台**：在所有Unity支持的平台上工作
3. **自动持久化**：数据会保存在设备本地
4. **三种数据类型**：支持int、float、string三种基本类型

关于Playerprefs最基础的用法是直接使用Set方法进行数据的存储，但是在运行的过程中只会存储在内存中，需要在结束时，Unity会自动将其存入硬盘中。如果游戏运行的过程中崩溃，那么则不会存储在硬盘中。可以使用自带的Api，Save方法进行自动存储。

```C#
using UnityEngine;
public class PlayerPrefsManager : MonoBehaviour{
    void Start(){
        PlayerPrefs.SetInt("Score", 100);
        PlayerPrefs.GetInt("Score");
        PlayerPrefs.SetString("Name", "John");
        PlayerPrefs.GetString("Name");
        PlayerPrefs.SetFloat("Score", 100.5f);
    }
}
```

同时，如果使用不同的数据类型对同一键名进行存储时，数据会进行覆盖。只要在运行时使用了Set方法的对应值，即使没有马上存储Save在本地，也能够读取出数据。如果找不到键对应的值，那么返回函数的默认值，如果找到，则不会返回默认值。

```C#
float score = PlayerPrefs.GetFloat("Score",100)//如果找到Score的值，则返回对应的值，如果没有，则返回100
```

**删除数据**：删除指定的键值和删除所有的存储的信息

```C#
PlayerPrefs.DeleteKey("Score");
PlayerPrefs.DeleteAll();
```

## 例题

![QQ_1749880693108](/notes-assets/%E6%95%B0%E6%8D%AE%E6%8C%81%E4%B9%85%E5%8C%96/assets/QQ_1749880693108.png)

```C#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerPrefsManager : MonoBehaviour
{
}

// 装备信息类
[System.Serializable]
public class EquipmentInfo
{
    public int id;
    public int count;
}

// 玩家信息类
[System.Serializable]
public class PlayerInfo
{
    public string name;
    public int age;
    public int attack;
    public int defense;

    public List<EquipmentInfo> equipments = new List<EquipmentInfo>();

    // 存储玩家信息
    public void Save()
    {
        PlayerPrefs.SetString("PlayerName", name);
        PlayerPrefs.SetInt("PlayerAge", age);
        PlayerPrefs.SetInt("PlayerAttack", attack);
        PlayerPrefs.SetInt("PlayerDefense", defense);

        // 存储装备信息
        PlayerPrefs.SetInt("EquipCount", equipments.Count);
        for (int i = 0; i < equipments.Count; i++)
        {
            PlayerPrefs.SetInt($"Equip_{i}_id", equipments[i].id);
            PlayerPrefs.SetInt($"Equip_{i}_count", equipments[i].count);
        }
        PlayerPrefs.Save();
    }

    // 读取玩家信息
    public void Load()
    {
        name = PlayerPrefs.GetString("PlayerName", "");
        age = PlayerPrefs.GetInt("PlayerAge", 0);
        attack = PlayerPrefs.GetInt("PlayerAttack", 0);
        defense = PlayerPrefs.GetInt("PlayerDefense", 0);

        // 读取装备信息
        equipments.Clear();
        int equipCount = PlayerPrefs.GetInt("EquipCount", 0);
        for (int i = 0; i < equipCount; i++)
        {
            EquipmentInfo equip = new EquipmentInfo();
            equip.id = PlayerPrefs.GetInt($"Equip_{i}_id", 0);
            equip.count = PlayerPrefs.GetInt($"Equip_{i}_count", 0);
            equipments.Add(equip);
        }
    }
}
```

## 存储位置

PlayerPrefs的数据存储位置因平台而异：

- **Windows**：注册表中（`HKEY_CURRENT_USER\Software\[公司名]\[产品名]`）
- **Mac**：`~/Library/Preferences/[bundle identifier].plist`
- **iOS/Android**：应用的沙盒目录中

## PlayerPrefs的唯一性

1.**基于键(Key)的唯一性**

- **键是唯一的标识符**：每个键对应唯一的值
- **同键覆盖原则**：对同一键多次赋值会覆盖前值

```C#
PlayerPrefs.SetInt("Score", 100);  // 第一次存储
PlayerPrefs.SetInt("Score", 200);  // 第二次存储会覆盖第一次的值
```

2. **应用级别的唯一性**

- **按应用隔离**：数据只对当前应用唯一
- **不同应用不共享**：即使在同一设备上，不同Unity应用的PlayerPrefs互不干扰

3. **平台级别的唯一性**

- **跨平台不共享**：同一游戏在Windows、Android等不同平台的PlayerPrefs数据相互独立
- **同一平台不同安装**：卸载重装后，PlayerPrefs数据通常会被清除（iOS/Android）
