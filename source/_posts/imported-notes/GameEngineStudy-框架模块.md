---
title: 框架模块
date: 2026-06-27 03:48:00
categories:
  - 图形与引擎
tags:
  - GameEngineStudy
  - 笔记
---
# 单例模式

单例模式（Singleton Pattern）是一种创建型设计模式，它确保一个类只有一个实例，并提供一个全局访问点。这种模式常用于需要全局访问点的对象，如配置管理器、游戏管理器等。

1. **唯一性**：确保一个类只有一个实例存在
2. **全局访问**：提供全局访问点
3. **延迟初始化**：通常采用懒加载方式创建实例

unity中的泛型单例，并且继承了MonoBehaviour，确保能够挂载到场景中的物体上，同时能够使用自带的生命周期函数，以及类型OntriggerEnter之类的物理事件

```C#
public class Singleton<T> : MonoBehaviour where T : Singleton<T>
{
    private static T instance;
    
    public static T Instance
    {
        get
        {
            return instance;
        }
    }   
    protected virtual void Awake()
    {
        if (instance == null)
        {
            instance = (T)this;
            DontDestroyOnLoad(gameObject);
        }
        else if (instance != this)
        {
            Destroy(gameObject);
        }
    } 
    public static bool IsInitialized
    {
        get
        {
            return instance != null;
        }
    }
    
    protected virtual void OnDestroy()
    {
        if (instance == this)
        {
            instance = null;
        }
    }
}
```

# 缓存池模块

缓存池(Pool)是游戏开发中优化性能的核心技术，通过对象复用减少Instantiate/Destroy的调用，特别适用于频繁创建销毁的对象(如子弹、特效、敌人等)。

在Unity中，直接使用`Instantiate`和`Destroy`存在以下问题：

- **性能开销大**：每次Instantiate都需要内存分配和初始化
- **内存碎片**：频繁创建销毁会导致内存碎片化
- **GC压力**：Destroy后Unity需要垃圾回收

缓存池通过以下方式解决：

1. **预创建**：游戏初始化时创建一批对象
2. **禁用代替销毁**：对象"销毁"时只是禁用并存入池中
3. **重复利用**：需要时从池中取出并重新激活

PoolManager 采用衣柜-抽屉的类比结构：

- **衣柜 (poolDic)**：使用 Dictionary<string, PoolData> 存储所有对象池
- **抽屉 (PoolData)**：每个 PoolData 实例管理一类游戏对象
- **根对象 (poolRoot)**：所有抽屉的父节点，保持场景整洁

PoolData 类封装了单个对象池的功能：

- **fatherObj**：作为同类对象的父节点
- **poolList**：存储可用对象的列表
- **PushObj**：回收对象时将其设为非激活状态并挂到父节点下
- **GetObj**：取出对象时激活并解除父子关系

**获取对象流程**：

1. 检查是否存在对应名称的对象池
2. 如果池中有可用对象，直接取出并激活
3. 如果池为空，通过 ResourceManager 异步加载新对象
4. 加载完成后通过回调返回对象

**回收对象流程**：

1. 检查 poolRoot 是否存在，不存在则创建
2. 查找或创建对应的 PoolData
3. 将对象设为非激活状态并挂到对象池节点下

**场景切换处理**：
Clear() 方法清空所有对象池，防止场景切换后引用残留对象

```C#
public class PoolManager : Singleton<PoolManager>
{
    //缓存池类似于衣柜，每个衣柜有很多抽屉，每个抽屉存放相应的物品
   private Dictionary<string,List<GameObject>> poolDic = new Dictionary<string,List<GameObject>>();
   private GameObject poolRoot;
  /// <summary>
  /// 从衣柜的抽屉取出物品
  /// </summary>
  /// <param name="name">物品名称</param>
  /// <returns></returns>
    private GameObject GetObject(string name){
        GameObject obj = null;
        //判断衣柜中是否有该抽屉,如果有抽屉并且物品的数量大于0
        if(poolDic.ContainsKey(name)&&poolDic[name].Count>0){
            //从抽屉中取出一个物品
            obj = poolDic[name][0];
            poolDic[name].RemoveAt(0);
        }
        else{
            obj = GameObject.Instantiate(Resources.Load<GameObject>(name));
            //把对象的名称设置为物品名称 
            obj.name = name;
        }
        obj.SetActive(true);
        //断开父子关系
        obj.transform.SetParent(null);
        return obj;
    }
    /// <summary>
    /// 将物品放回衣柜的抽屉
    /// </summary>
    /// <param name="name">物品名称</param>
    /// <param name="obj">物品</param>
    /// <returns></returns>
   private void PushObject(string name,GameObject obj){
        if(poolRoot==null){
            poolRoot = new GameObject("Pool");
        }
        //将物品设置为Pool的子对象
        obj.transform.SetParent(poolRoot.transform);
        obj.SetActive(false);
        //判断衣柜是否有该抽屉
        if(poolDic.ContainsKey(name)){
            //将物品放回抽屉
            poolDic[name].Add(obj);
        }
        else{
            poolDic.Add(name,new List<GameObject>(){obj});
        }
        
   }
   /// <summary>
   /// 场景转换时，清空缓存池
   /// </summary>
   public void Clear(){
    poolDic.Clear();
    poolRoot = null;
   }
}

```

根据以上的缓存池模块，我们可以在此基础上进行优化，因为上述的缓冲池模块，在检视器窗口实例化物品时，会造成检视器窗口的混乱。为此，需要进行优化，我们给每个List列表添加一个名称进行标识，则创建相同的物品时，进行统一的管理。

```c#
public class PoolData{
    public GameObject fatherObj;  //中间层，上面还有一个PoolRoot对象，下面则是存放的子物体
    public List<GameObject> poolList;
    public PoolData(GameObject obj,GameObject poolObj){  //参数是子物品和父对象
        fatherObj = new GameObject(obj.name); //创建父对象
        fatherObj.transform.SetParent(poolObj.transform); //设置父对象的父对象，最开始的根对象是poolObj

        poolList = new List<GameObject>(){};//将子物品添加到抽屉中
        PushObj(obj);
    }
    public void PushObj(GameObject obj){
        poolList.Add(obj);
        obj.transform.SetParent(fatherObj.transform);
        obj.SetActive(false);
    }
    public GameObject GetObj(){
        GameObject obj = null;
        if(poolList.Count>0){
            obj = poolList[0];
            poolList.RemoveAt(0);
        }
        obj.SetActive(true);
        obj.transform.SetParent(null);
        return obj;
    }
}

public class PoolManager : Singleton<PoolManager>
{
    //缓存池类似于衣柜，每个衣柜有很多抽屉，每个抽屉存放相应的物品
   private Dictionary<string,PoolData> poolDic = new Dictionary<string,PoolData>();
   private GameObject poolRoot;
  /// <summary>
  /// 从衣柜的抽屉取出物品
  /// </summary>
  /// <param name="name">物品名称</param>
  /// <returns></returns>


    private GameObject GetObject(string name){
        GameObject obj = null;
        //判断衣柜中是否有该抽屉,如果有抽屉并且物品的数量大于0
        if(poolDic.ContainsKey(name)&&poolDic[name].poolList.Count>0){
            //从抽屉中取出一个物品
            obj = poolDic[name].GetObj();
        }
        else{
            obj = GameObject.Instantiate(Resources.Load<GameObject>(name));
            //把对象的名称设置为物品名称 
            obj.name = name;
        }
        return obj;
    }
    /// <summary>
    /// 将物品放回衣柜的抽屉
    /// </summary>
    /// <param name="name">物品名称</param>
    /// <param name="obj">物品</param>
    /// <returns></returns>


   private void PushObject(string name,GameObject obj){
        if(poolRoot==null){
            poolRoot = new GameObject("Pool");
        }
        //判断衣柜是否有该抽屉
        if(poolDic.ContainsKey(name)){
            //将物品放回抽屉
            poolDic[name].PushObj(obj);
        }
        else{
            poolDic.Add(name,new PoolData(obj,poolRoot));
        }
        
   }
   /// <summary>
   /// 场景转换时，清空缓存池
   /// </summary>
   public void Clear(){
    poolDic.Clear();
    poolRoot = null;
   }
}
```

## 缓冲池模块与异步加载

PoolManager通过对象池+异步加载实现高效资源管理：

**对象池机制**：

- 使用Dictionary管理不同类型的对象池(PoolData)
- 每个PoolData维护一个对象列表和父节点
- GetObj取出可用对象，PushObj回收对象

**异步加载流程**：

1. 当池中无可用对象时，调用ResourceManager异步加载
2. 加载完成后通过回调返回新对象
3. 新对象首次使用后会被自动回收进对象

```C#
public class PoolManager : Singleton<PoolManager>
{
    private Dictionary<string, PoolData> poolDic = new Dictionary<string, PoolData>();
    private GameObject poolRoot;

    /// <summary>
    /// 异步方式从池中获取对象（推荐）
    /// 如果池中没有，则异步加载资源并创建新对象
    /// </summary>
    /// <param name="name">资源路径/名称</param>
    /// <param name="callback">获取到对象后的回调函数</param>
    public void GetObjectAsync(string name, UnityAction<GameObject> callback)
    {
        // 1. 检查池中是否有可用的对象
        if (poolDic.ContainsKey(name) && poolDic[name].poolList.Count > 0)
        {
            GameObject obj = poolDic[name].GetObj();
            callback?.Invoke(obj); // 立即通过回调返回
        }
        else
        {
            // 2. 池中没有，异步加载资源并实例化
            ResourceManager.Instance.LoadResourceAsync<GameObject>(name, (go) =>
            {
                go.name = name; // 确保名称一致，便于后续回收
                callback?.Invoke(go); // 将新创建的对象返回

                // 可选：将新创建的对象也加入到池的管理中，但此时是活跃状态。
                // 下次归还时，它就会被加入到池里。
            });
        }
    }

    /// <summary>
    /// 同步方式从池中获取对象
    /// 如果池中没有，则同步加载资源并创建新对象
    /// </summary>
    /// <param name="name">资源路径/名称</param>
    /// <returns>游戏对象</returns>
    public GameObject GetObject(string name)
    {
        GameObject obj = null;
        // 1. 检查池中是否有可用的对象
        if (poolDic.ContainsKey(name) && poolDic[name].poolList.Count > 0)
        {
            obj = poolDic[name].GetObj();
        }
        else
        {
            // 2. 池中没有，同步加载资源并实例化
            obj = ResourceManager.Instance.LoadResource<GameObject>(name);
            obj.name = name;
        }
        return obj;
    }

    /// <summary>
    /// 将物品放回衣柜的抽屉
    /// </summary>
    /// <param name="name">物品名称（资源路径）</param>
    /// <param name="obj">物品</param>
    public void PushObject(string name, GameObject obj)
    {
        if (poolRoot == null)
            poolRoot = new GameObject("PoolRoot");

        // 判断衣柜是否有该抽屉
        if (poolDic.ContainsKey(name))
        {
            // 将物品放回抽屉
            poolDic[name].PushObj(obj);
        }
        else
        {
            // 创建一个新抽屉来存放这个物品
            poolDic.Add(name, new PoolData(obj, poolRoot));
        }
    }

    /// <summary>
    /// 预加载资源并填充对象池，避免运行时卡顿
    /// </summary>
    /// <param name="name">资源名</param>
    /// <param name="count">预加载数量</param>
    public void Preload(string name, int count)
    {
        // 同步预加载
        for (int i = 0; i < count; i++)
        {
            GameObject go = ResourceManager.Instance.LoadResource<GameObject>(name);
            go.name = name;
            PushObject(name, go); // 直接放入池中
        }

        // 或者使用异步预加载（协程）
        // MonoManager.Instance.StartCoroutine(PreloadAsync(name, count));
    }

    private IEnumerator PreloadAsync(string name, int count)
    {
        int loadedCount = 0;
        while (loadedCount < count)
        {
            ResourceManager.Instance.LoadResourceAsync<GameObject>(name, (go) =>
            {
                go.name = name;
                PushObject(name, go);
                loadedCount++;
            });
            yield return null; // 下一帧继续加载，避免一帧内加载过多卡顿
        }
    }

    /// <summary>
    /// 清空缓存池
    /// </summary>
    public void Clear()
    {
        poolDic.Clear();
        if (poolRoot != null)
            GameObject.Destroy(poolRoot);
        poolRoot = null;
    }
}
```



# 事件中心模块

事件中心模块是游戏开发中用于管理事件发布与订阅的核心系统，它解耦了事件的发送者和接收者，提供了一种高效、安全的通信机制。事件中心使用字典存储事件名和对应的委托（`Dictionary<string, UnityAction<object>>`），采用单例模式确保全局访问。通过`AddListener`添加监听，`RemoveListener`移除监听，`EventTrigger`触发事件。所有事件数据通过object类型传递，需要使用时进行类型转换

- **AddListener**：检查事件是否存在，不存在则新建条目，存在则用`+=`添加多播委托。需注意同一方法重复添加会导致多次调用。
- **RemoveListener**：检查事件存在后用`-=`移除指定方法，但不会清理空委托条目。
- **EventTrigger**：检查事件存在后同步调用所有监听方法，参数通过object传递。

```c#
using System;
using System.Collections.Generic;

using UnityEngine.Events;

class EventCenter:Singleton<EventCenter>
{

   /// <summary>
   /// 事件字典，当事件触发时，会调用字典中对应的委托
   /// </summary>
   private Dictionary<string,UnityAction<object>> eventDic = new Dictionary<string,UnityAction<object>>();
   /// <summary>
   /// 添加事件监听
   /// </summary>
   /// <param name="eventName"></param>
   /// <param name="action"></param>
   public void AddListener(string eventName,UnityAction<object> action){
      
      
      if(!eventDic.ContainsKey(eventName)){//如果字典中没有这个事件，则添加事件
         eventDic.Add(eventName,action);
      }else{//如果字典中已经有这个事件，则添加事件
         eventDic[eventName] += action;
      }
   }
   /// <summary>
   ///  移除事件的监听
   /// </summary>
   /// <param name="eventName"></param>
   /// <param name="action"></param>
   public void RemoveListener(string eventName,UnityAction<object> action){
      if(eventDic.ContainsKey(eventName)){
         eventDic[eventName] -= action;
      }
   }
   /// <summary>
   ///  事件触发逻辑，如果事件存在，则延迟调用
   /// </summary>
   /// <param name="eventName"></param>
   /// <param name="data"></param>
   public void EventTrigger(string eventName,object data){
      if(eventDic.ContainsKey(eventName)){
         eventDic[eventName].Invoke(data);
      }     
   }  
}
```

###  添加事件监听

在需要监听事件的脚本中，使用 `AddListener`方法订阅特定事件名的事件，并指定回调函数。

```
using UnityEngine;

public class EventSubscriber : MonoBehaviour
{
    void Start()
    {
        // 订阅名为 "PlayerDamage" 的事件
        EventCenter.Instance.AddListener("PlayerDamage", OnPlayerDamaged);
    }

    private void OnPlayerDamaged(object damageData)
    {
        // 处理伤害事件，damageData 可以是任意类型的数据
        int damage = (int)damageData;
        Debug.Log($"玩家受到 {damage} 点伤害");
    }
}
```

### 📌 2. 触发事件

在需要触发事件的脚本中，使用 `EventTrigger`方法发布事件，并传递相关数据。

```
using UnityEngine;

public class EventTriggerExample : MonoBehaviour
{
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            // 触发名为 "PlayerDamage" 的事件，并传递伤害值
            EventCenter.Instance.EventTrigger("PlayerDamage", 10);
        }
    }
}
```

### 📌 3. 移除事件监听

在适当的时候（如对象销毁时），使用 `RemoveListener`方法取消订阅，避免内存泄漏。

```
void OnDestroy()
{
    EventCenter.Instance.RemoveListener("PlayerDamage", OnPlayerDamaged);
}
```

### ⚠️ 4. 使用注意事项

- **单例访问**：通过 `EventCenter.Instance`访问事件中心实例
- **事件名一致性**：确保订阅和触发时使用的事件名完全一致（区分大小写）。
- **数据类型匹配**：在回调函数中正确处理 `object`类型的数据，需进行类型转换。
- **避免空委托**：移除监听后，建议检查委托是否为 `null`，但你的代码中未处理此情况，可考虑优化。

### 🔧 5. 实际应用示例

以下是一个完整场景示例，演示事件中心在玩家血量变化时的应用：

```
// 血量管理器
public class HealthManager : MonoBehaviour
{
    public int health = 100;

    void TakeDamage(int damage)
    {
        health -= damage;
        // 触发血量更新事件
        EventCenter.Instance.EventTrigger("HealthUpdate", health);
    }
}

// UI控制器
public class HealthUI : MonoBehaviour
{
    public Text healthText;

    void Start()
    {
        // 订阅血量更新事件
        EventCenter.Instance.AddListener("HealthUpdate", OnHealthUpdated);
    }

    private void OnHealthUpdated(object healthValue)
    {
        healthText.text = $"血量: {(int)healthValue}";
    }

    void OnDestroy()
    {
        EventCenter.Instance.RemoveListener("HealthUpdate", OnHealthUpdated);
    }
}
```

### 💡 6. 潜在问题与优化建议

- **泛型支持**：当前使用 `object`传递数据需类型转换，可考虑泛型改进类型安全
- **事件名管理**：建议用常量或枚举管理事件名，避免拼写错误。
- **空委托检查**：在 `RemoveListener`和 `EventTrigger`中添加空委托检查。

通过以上方式，你可以在Unity项目的任何脚本中高效使用事件中心进行模块间通信。

## 事件中心模块，避免装箱拆箱问题

**装箱是将值类型隐式转换为引用类型（如int转为Object）的过程，需在堆上分配内存并复制值，性能有损耗；拆箱是将引用类型显式转回值类型的过程，需强制类型转换且可能抛异常。二者常见于非泛型集合操作（如ArrayList存值类型时装箱、读取时拆箱）或方法参数为Object时。频繁装箱拆箱会因堆内存分配和垃圾回收影响性能，建议优先使用泛型集合（如List<int>）避免此类操作。**

当前 EventCenter 实现使用 `UnityAction<object>` 作为事件委托类型，当传递值类型数据时会触发装箱(boxing)操作，接收端使用时又需要拆箱(unboxing)，这会带来性能开销和类型安全问题。

```C#
using System;
using System.Collections.Generic;
using UnityEngine.Events;

public interface IEventTrigger
{
    void Trigger<T>(string eventName, T eventData);
}

public interface IEventRegistry
{
    void AddListener<T>(string eventName, UnityAction<T> action);
    void RemoveListener<T>(string eventName, UnityAction<T> action);
}

public class EventCenter : Singleton<GenericEventCenter>, IEventTrigger, IEventRegistry
{
    private Dictionary<string, object> eventTable = new Dictionary<string, object>();

    public void AddListener<T>(string eventName, UnityAction<T> action)
    {
        if (!eventTable.ContainsKey(eventName))
        {
            eventTable[eventName] = action;
        }
        else
        {
            eventTable[eventName] = Delegate.Combine((Delegate)eventTable[eventName], action);
        }
    }

    public void RemoveListener<T>(string eventName, UnityAction<T> action)
    {
        if (eventTable.TryGetValue(eventName, out var existingDelegate))
        {
            eventTable[eventName] = Delegate.Remove((Delegate)existingDelegate, action);
        }
    }

    public void EventTrigger<T>(string eventName, T eventData)
    {
        if (eventTable.TryGetValue(eventName, out var action) && action != null)
        {
            ((UnityAction<T>)action)?.Invoke(eventData);
        }
    }
}
```



# 公共Mono模块

让没有继承MonoBehavior的类也可以开启协程，同时使用MonoBehavior模块的一些生命周期函数，并且可以统一管理生命周期函数 

1. **集中管理Update事件**：允许其他非MonoBehaviour类也能响应Unity的Update事件
2. **协程管理**：为非MonoBehaviour类提供启动协程的能力
3. **单例模式**：确保全局只有一个实例管理这些功能

使用场景，非**MonoController**类需要帧更新，或者需要使用协程，使用2个类进行实现：

**MonoController**类

- 继承自**MonoBehavior**，实际挂载在游戏对象上
- 主要功能：
  - 维护一个updateEvent事件列表
  - 在Update中触发所有注册的事件
  - 提供添加/移除Update监听的方法
  - 使用DontDestroyOnLoad保证跨场景不销毁

```c#
using UnityEngine;
using UnityEngine.Events;

public class MonoController : MonoBehaviour
{
    private event UnityAction updateEvent;

    private void Start(){
        DontDestroyOnLoad(this.gameObject);
    }
    private void Update(){
        if(updateEvent != null  )
        {
            updateEvent();
        }
    }
    public void AddUpdateListener(UnityAction action){
        updateEvent += action;
    }
    public void RemoveUpdateListener(UnityAction action){
        updateEvent -= action;
    }
    
}

```

**MonoManager**类

- 单例类（基于Singleton<T>模板）
- 主要功能：
  - 在构造函数中创建MonoController实例
  - 对外提供Add/RemoveUpdateListener接口
  - 提供StartCoroutine的代理方法，可以开启外部的协程方法

```C#
using System.Collections;
using UnityEngine;
using UnityEngine.Events;

public class MonoManager : Singleton<MonoManager>
{

    private MonoController controller;

/// <summary>
/// 在场景中添加一个空物体，并添加MonoController组件，并且只会存在一个，单例模式
/// </summary>
    public MonoManager()
    {
        GameObject obj = new GameObject("MonoController");
        controller = obj.AddComponent<MonoController>();
    }
    public void AddUpdateListener(UnityAction action){
        controller.AddUpdateListener(action);
    }
    public void RemoveUpdateListener(UnityAction action){
        controller.RemoveUpdateListener(action);
    }
    
    //实现非MonoBehavior类的协程功能
    public Coroutine StartCoroutine(IEnumerator routine){
        return controller.StartCoroutine(routine);
    }
    public Coroutine StartCoroutine(string methodName,  object value){
        return controller.StartCoroutine(methodName,value);
    }
}

```

# 场景切换模块

在切换场景的过程中,提供场景切换的公共接口。并且使用同步或者异步加载的方式进行场景的加载。

```c#

using UnityEngine;
using UnityEngine.Events;
using UnityEngine.SceneManagement;
using System.Collections;
public class SceneMgr : Singleton<SceneMgr>
{
   //场景管理器

   //同步执行
    private void LoadScene(string sceneName,UnityAction action  )
    {
        SceneManager.LoadScene(sceneName);
        action();
    }
   //异步执行
   public void LoadSceneAsync(string sceneName,UnityAction action){
        MonoManager.Instance.StartCoroutine(ReallyLoadSceneAsync(sceneName,action));
		StartCoroutine(ReallyLoadSceneAsync(sceneName,action));
   }
/// <summary>
/// 异步协程执行异步加载场景
/// </summary>
/// <param name="sceneName"></param>
/// <param name="action"></param>
/// <returns></returns>
   private IEnumerator ReallyLoadSceneAsync(string sceneName,UnityAction action){
        AsyncOperation ao = SceneManager.LoadSceneAsync(sceneName);//异步方法返回值是AsyncOperation
       //场景加载的进度
        while(!ao.isDone){
            EventCenter.Instance.EventTrigger("进度条加载",ao.progress);//外部想要使用进度条加载，就订阅这个事件（AddListener）
            yield return ao.progress;
        }
        //加载完成后执行action
        action();
   }
}

```

# 资源加载模块

资源加载模块提供资源加载的公共接口，使用单例模块进行管理资源。同样也使用2种方法进行资源加载的模块，同步和异步。在资源加载的过程中，同步资源加载是需要等待加载完成后主线程才移动，所有加载可以直接使用，而异步加载时不是立马得到的，需要等待n帧才能加载完成，待资源加载完成后，使用回调函数来操作资源（延迟返回）。

在异步加载的过程中可以使用Lambda表达式

**ResourceManager类**

```C#
using UnityEngine;
using UnityEngine.Events;
using System.Collections;
public class ResourceManager:Singleton<ResourceManager>
{
    public T LoadResource<T>(string path) where T : Object{
        T res = Resources.Load<T>(path);
        if(res is GameObject){
            return GameObject.Instantiate(res);
        }
        else{
            return res;
        }
    }
    //异步加载，如果是GameObject，则返回实例化后的对象
    public void LoadResourceAsync<T>(string path,UnityAction<T> action) where T : Object{
        MonoManager.Instance.StartCoroutine(ReallyLoadResourceAsync(path,action));
    }
    private IEnumerator ReallyLoadResourceAsync<T>(string path,UnityAction<T> action) where T : Object{
        ResourceRequest rq = Resources.LoadAsync<T>(path);
        yield return rq;  //等待资源加载完成
        if(rq.asset is GameObject){  
            action(GameObject.Instantiate(rq.asset) as T);  //回调函数，执行操作
        }
        else{
            action(rq.asset as T);
        }
    }
}
```

**Test类**

```C#
class Test:MonoBehavior
{
	void Update(){
        ResourceManager.Instance.LoadResourceAsync<GameObject>("Test/Cube",(obj) =>{
            obj.transform.localScale = Vector3.one* 2;
        	}
        );
    }
}
```

# 输入控制模块

**统一管理键盘的输入**

**InputManager类（输入管理器）**

- **功能概述**：管理游戏输入事件，检测按键按下/抬起状态，并通过事件中心触发对应事件。
- **核心成员**
  - `isStart`：布尔值，控制输入检测的启停。
  - `StartOrEnd(bool isStart)`：设置输入检测的启停状态。
  - `CheckInput(KeyCode key)`：检测指定按键的状态，触发“按键按下”或“按键抬起”事件。
- **关键逻辑**
  - **Update()**：每帧检测WASD按键的按下状态，若`isStart`为`true`，则调用`CheckInput`。
  - **事件触发**：通过`EventCenter.Instance`触发事件，传递按键类型（`KeyCode`）作为参数。
- **依赖关系**
  - 继承自`Singleton<InputManager>`（单例模式）。
  - 依赖`EventCenter`类分发事件。

**EventCenter（事件中心）**

- **功能概述**
  - 实现事件监听与触发的中心化管理，支持动态添加/移除监听器。
- **核心成员**
  - `eventDic`：字典，存储事件名（`string`）与对应的委托（`UnityAction<object>`）。
- **主要方法**
  - AddListener：添加事件监听器，若事件不存在则新建，否则合并委托。
  - RemoveListener：移除指定事件的监听器。
  - EventTrigger：触发指定事件，调用所有关联的委托并传递数据（`object`类型）。
- **设计特点**
  - **松耦合**：通过字符串标识事件，允许跨模块通信。
  - **单例模式**：继承`Singleton<EventCenter>`，确保全局唯一访问

**InputManager类**

```C#
using UnityEngine;
using UnityEngine.Events;

class InputManager : Singleton<InputManager>{
    //输入管理器
    
    private bool isStart = false;
    public void StartOrEnd(bool isStart){
        this.isStart = isStart;
    }
    public void CheckInput(KeyCode key){
        if(Input.GetKeyDown(key)){
            EventCenter.Instance.EventTrigger("按键按下",key);
        }
        if(Input.GetKeyUp(key)){
            EventCenter.Instance.EventTrigger("按键抬起",key);
        }
    }
    void Update()
    {   
        if(isStart){
            CheckInput(KeyCode.A);
            CheckInput(KeyCode.D);
            CheckInput(KeyCode.W);
            CheckInput(KeyCode.S);  
        }
    }
}
```

**InputTest类**

```c#
using UnityEngine;
using UnityEngine.Events;
class TestInput : MonoBehaviour{
   void Start(){
        InputManager.Instance.StartOrEnd(true);
        EventCenter.Instance.AddListener("按键按下",OnKeyDown);
        EventCenter.Instance.RemoveListener("按键抬起",OnKeyUp);
   }
   void OnKeyDown(object key){
        KeyCode keyCode = (KeyCode)key;
        switch(keyCode){
            case KeyCode.A:
                Debug.Log("按键按下:A");
                break;
            case KeyCode.D:
                Debug.Log("按键按下:D");
                break;
            case KeyCode.W:
                Debug.Log("按键按下:W");
                break;
            case KeyCode.S:
                Debug.Log("按键按下:S");
                break;
        }
   }
   void OnKeyUp(object key){
    KeyCode keyCode = (KeyCode)key;
    switch(keyCode){
        case KeyCode.A:
            Debug.Log("按键抬起:A");
            break;
        case KeyCode.D:
            Debug.Log("按键抬起:D");
            break;
        case KeyCode.W:
            Debug.Log("按键抬起:W");
            break;
        case KeyCode.S:
            Debug.Log("按键抬起:S");
            break;
    }   
   }
}
```

# 音效管理模块

这个Unity音效管理模块`AudioManager`是一个单例类，主要功能分为背景音乐(BGM)管理和音效(SFX)管理两部分：

1. **背景音乐管理**：
   - 支持异步加载和播放背景音乐，可设置音量、循环播放
   - 包含暂停和音量调节功能
   - 音乐资源路径为"Music/BGM/"，可以自定义路径
2. **音效管理**：
   - 支持异步加载和播放音效，可回调获取AudioSource
   - 统一管理所有音效的音量
   - 自动销毁播放完成的音效组件
   - 音效资源路径为"Music/SFX/"，可以自定义路径
3. **其他特性**：
   - 使用单例模式确保全局唯一实例
   - 动态创建音效管理游戏对象
   - 通过Update方法自动清理完成播放的音效

该模块通过ResourceManager异步加载音频资源，实现了音效的播放、暂停、音量控制和自动清理功能，适合在Unity项目中管理游戏音效。

```C#
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
    
class AudioManager:Singleton<AudioManager>
{
    //背景音乐
    [SerializeField]private AudioSource BGM = null;
    [SerializeField]private float BGMVolume = 1f;
    [SerializeField]private float SFXVolume = 1f;

    private GameObject soundobj = null;
    [SerializeField]private bool isLoop = true;
    [SerializeField]private List<AudioSource> SFX = new List<AudioSource>();
#region 背景音乐

    /// <summary>
    /// 异步加载背景音乐，同时播放
    /// </summary>
    /// <param name="name"></param>
    public void PlayBGM(string name){
        if(BGM = null){
            GameObject obj = new GameObject();
            obj.name = "BGMManager";
            BGM = obj.AddComponent<AudioSource>();
        }
        //从资源文件加载音频文件,文件路径为"Music/BGM/"+name
        ResourceManager.Instance.LoadAssetAsync<AudioClip>("Music/BGM/"+name, (clip) =>{
            BGM.clip = clip;
            BGM.volume = BGMVolume;
            BGM.loop = isLoop;
            BGM.Play();

        });

    }
    public void ChangeBGMVolume(float volume){

        BGM.volume = volume;
        if(BGM == null)
            return;
        BGM.volume = volume;
    }
    public void PauseBGM(){ 
        if(BGM == null)
            return;
        BGM.Stop();
    }
#endregion

#region 音效

/// <summary>
/// 加载音效，同时播放
/// </summary>
/// <param name="name"></param>
    public void PlaySFX(string name,UnityAction<AudioSource> action){
        if(soundobj == null){ 
            soundobj = new GameObject();
            soundobj.name = "SFXManager";
        }
        ResourceManager.Instance.LoadAssetAsync<AudioClip>("Music/SFX/"+name, (clip) =>{
            AudioSource source = soundobj.AddComponent<AudioSource>();
            source.clip = clip;
            source.Play();
            SFX.Add(source);
            if(action != null)
                action(source);
        });
    } 
    public void ChangeSoundValue(float value){
        SFXVolume = value;
        foreach(AudioSource source in SFX){
            source.volume = SFXVolume;
        }
    }

    public void StopSFX(AudioSource source){
        if(SFX.Contains(source)){
            SFX.Remove(source);
            source.Stop();
            GameObject.Destroy(source);
        }
    }


#endregion
    /// <summary>
    /// 音效播放结束，销毁音效
    /// </summary>
    public void Update(){
        for(int i = SFX.Count - 1;i >= 0;i--){
            if(!SFX[i].isPlaying){
                GameObject.Destroy(SFX[i]);
                SFX.RemoveAt(i);
            }
        }
    }
}
```

# UI模块

```c#

```

