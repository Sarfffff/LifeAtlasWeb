---
title: 热更新
date: 2026-06-27 03:49:00
categories:
  - 图形与引擎
tags:
  - GameEngineStudy
  - 笔记
---
# AssetBundle和Resources资源加载的区别

| **对比维度**       | **Resources**                                    | **AssetBundle (AB 包)**                        |
| ------------------ | ------------------------------------------------ | ---------------------------------------------- |
| **资源打包方式**   | 自动打包，放在`Assets/Resources`目录下即被包含   | 手动打包，需通过脚本或编辑器指定资源打包       |
| **是否包含在主包** | 是，所有资源打包进游戏安装包                     | 否，独立于主安装包，需单独分发                 |
| **动态更新支持**   | 不支持，修改需重新发布整个安装包                 | 支持，可通过网络更新单个 AB 包                 |
| **加载方式**       | `Resources.Load(资源名称)`，无需路径细节         | 先加载 AB 包，再通过`bundle.LoadAsset(资源名)` |
| **卸载控制**       | 只能通过`Resources.UnloadUnusedAssets()`批量卸载 | 支持`AssetBundle.Unload()`单独卸载某个包       |
| **安装包体积影响** | 增大初始安装包体积                               | 不影响主包体积，资源可按需下载                 |
| **内存效率**       | 整体优化，可能占用更多内存                       | 按需加载，内存占用更可控                       |
| **分平台支持**     | 不支持分平台单独打包                             | 支持为不同平台生成优化后的 AB 包               |
| **适用场景**       | 小型项目、静态资源、原型开发                     | 中大型项目、需更新资源、按场景划分的资源       |
| **复杂度**         | 简单，无需额外管理逻辑                           | 复杂，需处理打包、版本控制、下载逻辑           |

# AssetBundle

在 Unity 中，**AssetBundle** 是一种打包格式，用于将游戏资源（如模型、纹理、音频、预制体等）在运行时动态加载。它是优化游戏资源管理和减小安装包体积的核心技术，尤其适用于大型游戏、DLC（下载内容）和资源热更新。在使用AssetBundle进行打包时，不能将C#进行打包，因为C#是编译性语言，需要进行编译。

**AB包资源加载**

加载AB包的流程，首先从加载AB包，在加载AB包中的资源，实例化加载的AB包资源，管理资源的生命周期。

加载AB包可以  分为同步加载与异步加载资源

**同步加载**

```C#
//加载AB包
AssetBundle ab = AssetBundle.LoadFromFile(Application.);//文件路径 
AssetBundle ab = AssetBundle.LoadFromFile(Application.streamingAssetsPath+"/"+"model");

//加载AB包中的资源，建议使用泛型
Gameobject prefab = ab.LoadAsset<GameObject>("prefabName")

//实例化资源
Instantiate(prefab);
```

**异步加载**

```C#
//使用协程进行异步加载
   private IEnumerator LoadAsset(string name,string path){
      AssetBundleCreateRequest request = AssetBundle.LoadFromFileAsync(path);//异步加载AB包
      yield return request;
      
      AssetBundle ab = request.assetBundle;//获取AB包
      AssetBundleRequest assetRequest = ab.LoadAssetAsync<GameObject>(name);//异步加载资源
      yield return assetRequest;
 
      GameObject prefab = assetRequest.asset as GameObject;//获取资源
      Instantiate(prefab);
      
}
```

**AssetBundle.LoadFromFileAsync(path) 返回的是一个 AssetBundleCreateRequest 对象，而不是直接返回 AssetBundle。这个 AssetBundleCreateRequest 对象在异步加载完成后，才会包含真正的 AssetBundle 实例，所以需要在异步加载完成后，通过 request.assetBundle 获取到已经加载好的 AB 包。**

异步加载时，LoadFromFileAsync 只是启动了加载过程，等 yield return request 之后，request.assetBundle 才是真正 的 AB 包对象。这和同步加载（直接返回 AB 包）不同，异步加载需要等加载完成后再取出结果

## 依赖包

 关于AB包的依赖： 一个资源身上用到了别的AB包中的资源这个时候如果只加载自己的AB包通过它创建对象会出现资源丢失的情况这种时候需要把依赖包一起加载了才能正常。加载主包，在得到主包中固定文件，从固定文件中得到依赖信息。只能知道一个包依赖那几个包，但是不会知道包中的资源依赖那几个包，一次性全部加载进来

```C#
//加载主包
AssetBundle abmain = AssetBundle.LoadFromFile(Application.streamingAssetPath + "/" + "PC");
//加载主包中的依赖文件
AssetBundleManifest abManifest = abMain.LoadAsset<AssetBundleManifest>("AssetBundleManifest");
//得到该包的依赖信息
string[] strs = abManifest.GetAllDependencies("model");
for(int i = 0;i < strs.Length;i++){
	AssetBundle.LoadFromFile(Application.streamingAssetPath + "/" + strs[i]);
}

```

## AB包资源加载管理器

#### 使用案例

```C#
// 同步加载
GameObject prefab = ABManager.Instance.LoadRes<GameObject>("characters", "player");

// 异步加载
ABManager.Instance.LoadResAsync("weapons", "sword", (Object obj) => {
    if(obj != null) {
        Instantiate(obj);
    }
});

// 泛型异步加载
ABManager.Instance.LoadResAsync<Texture>("ui", "icon", (Texture tex) => {
    if(tex != null) {
        GetComponent<Image>().texture = tex;
    }
});
```

#### 管理器

提供一个加载AB包中资源的管理器

3个同步加载函数以及3个异步加载的函数，分别传入需要加载的AB包以及AB包中需要加载的资源，同时加载该Ab包的依赖。window平台应该是PC包先加载

![image-20250821191617613](/notes-assets/GameEngineStudy/assets/image-20250821191617613.png)

```C#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class ABManager : MonoBehaviour
{
    private static ABManager _instance;
    public static ABManager Instance
    {
        get
        {
            if (_instance == null)
            {
                GameObject obj = new GameObject("ABManager");
                _instance = obj.AddComponent<ABManager>();
                DontDestroyOnLoad(obj);
            }
            return _instance;
        }
    }

    private AssetBundle mainAb = null;
    private AssetBundleManifest manifest = null;
    private Dictionary<string, AssetBundle> abDic = new Dictionary<string, AssetBundle>();

    /// <summary>
    /// AB包存放路径
    /// </summary>
    public string PathURL
    {
        get { return Application.streamingAssetsPath + "/"; }
    }

    /// <summary>
    /// 主包名，根据平台自动选择
    /// </summary>
    private string MainABName
    {
        get
        {
#if UNITY_IOS
            return "IOS";
#elif UNITY_ANDROID
            return "Android";
#else
            return "PC";
#endif
        }
    }

    /// <summary>
    /// 加载AB包及其依赖
    /// </summary>
    public void LoadAB(string abName)
    {
        if (string.IsNullOrEmpty(abName)) return;

        // 加载主包和manifest
        if (mainAb == null)
        {
            mainAb = AssetBundle.LoadFromFile(PathURL + MainABName);
            if (mainAb == null)
            {
                Debug.LogError("Failed to load main AssetBundle");
                return;
            }
            manifest = mainAb.LoadAsset<AssetBundleManifest>("AssetBundleManifest");
        }

        // 加载依赖包
        string[] dependencies = manifest.GetAllDependencies(abName);
        foreach (string dependency in dependencies)
        {
            if (!abDic.ContainsKey(dependency))
            {
                AssetBundle depAb = AssetBundle.LoadFromFile(PathURL + dependency);
                if (depAb != null)
                {
                    abDic.Add(dependency, depAb);
                }
                else
                {
                    Debug.LogError($"Failed to load dependency: {dependency}");
                }
            }
        }

        // 加载目标包
        if (!abDic.ContainsKey(abName))
        {
            AssetBundle ab = AssetBundle.LoadFromFile(PathURL + abName);
            if (ab != null)
            {
                abDic.Add(abName, ab);
            }
            else
            {
                Debug.LogError($"Failed to load AssetBundle: {abName}");
            }
        }
    }

    /// <summary>
    /// 同步加载资源
    /// </summary>
    public Object LoadRes(string abName, string resName)
    {
        LoadAB(abName);
        
        if (abDic.TryGetValue(abName, out AssetBundle ab))
        {
            Object obj = ab.LoadAsset(resName);
            if (obj is GameObject)
                return Instantiate(obj);
            return obj;
        }
        return null;
    }

    /// <summary>
    /// 同步加载资源（指定类型）
    /// </summary>
    public Object LoadRes(string abName, string resName, System.Type type)
    {
        LoadAB(abName);
        
        if (abDic.TryGetValue(abName, out AssetBundle ab))
        {
            Object obj = ab.LoadAsset(resName, type);
            if (obj is GameObject)
                return Instantiate(obj);
            return obj;
        }
        return null;
    }

    /// <summary>
    /// 同步加载资源（泛型）
    /// </summary>
    public T LoadRes<T>(string abName, string resName) where T : Object
    {
        LoadAB(abName);
        
        if (abDic.TryGetValue(abName, out AssetBundle ab))
        {
            T obj = ab.LoadAsset<T>(resName);
            if (obj is GameObject)
                return Instantiate(obj) as T;
            return obj;
        }
        return null;
    }

    /// <summary>
    /// 异步加载资源
    /// </summary>
    public void LoadResAsync(string abName, string resName, UnityAction<Object> callback)
    {
        StartCoroutine(ReallyLoadResAsync(abName, resName, callback));
    }

    private IEnumerator ReallyLoadResAsync(string abName, string resName, UnityAction<Object> callback)
    {
        LoadAB(abName);
        
        if (abDic.TryGetValue(abName, out AssetBundle ab))
        {
            AssetBundleRequest request = ab.LoadAssetAsync(resName);
            yield return request;

            if (request.asset is GameObject)
                callback?.Invoke(Instantiate(request.asset));
            else
                callback?.Invoke(request.asset);
        }
        else
        {
            callback?.Invoke(null);
        }
    }

    /// <summary>
    /// 异步加载资源（指定类型）
    /// </summary>
    public void LoadResAsync(string abName, string resName, System.Type type, UnityAction<Object> callback)
    {
        StartCoroutine(ReallyLoadResAsync(abName, resName, type, callback));
    }

    private IEnumerator ReallyLoadResAsync(string abName, string resName, System.Type type, UnityAction<Object> callback)
    {
        LoadAB(abName);
        
        if (abDic.TryGetValue(abName, out AssetBundle ab))
        {
            AssetBundleRequest request = ab.LoadAssetAsync(resName, type);
            yield return request;

            if (request.asset is GameObject)
                callback?.Invoke(Instantiate(request.asset));
            else
                callback?.Invoke(request.asset);
        }
        else
        {
            callback?.Invoke(null);
        }
    }

    /// <summary>
    /// 异步加载资源（泛型）
    /// </summary>
    public void LoadResAsync<T>(string abName, string resName, UnityAction<T> callback) where T : Object
    {
        StartCoroutine(ReallyLoadResAsync<T>(abName, resName, callback));
    }

    private IEnumerator ReallyLoadResAsync<T>(string abName, string resName, UnityAction<T> callback) where T : Object
    {
        LoadAB(abName);
        
        if (abDic.TryGetValue(abName, out AssetBundle ab))
        {
            AssetBundleRequest request = ab.LoadAssetAsync<T>(resName);
            yield return request;

            T asset = request.asset as T;
            if (asset is GameObject)
                callback?.Invoke(Instantiate(asset) as T);
            else
                callback?.Invoke(asset);
        }
        else
        {
            callback?.Invoke(null);
        }
    }

    /// <summary>
    /// 卸载单个AB包
    /// </summary>
    public void Unload(string abName, bool unloadAllLoadedObjects = false)
    {
        if (abDic.TryGetValue(abName, out AssetBundle ab))
        {
            ab.Unload(unloadAllLoadedObjects);
            abDic.Remove(abName);
        }
    }

    /// <summary>
    /// 清理所有AB包
    /// </summary>
    public void ClearAll()
    {
        foreach (var ab in abDic.Values)
        {
            ab.Unload(false);
        }
        abDic.Clear();
        
        if (mainAb != null)
        {
            mainAb.Unload(false);
            mainAb = null;
            manifest = null;
        }
    }
}
```

```C#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class ABManager : Singleton<ABManager>
{

    private AssetBundle mainAb = null;
    private AssetBundleManifest manifest = null;

    private Dictionary<string, AssetBundle> abDic = new Dictionary<string, AssetBundle>();
    /// <summary>
    /// AB包存放路径
    /// </summary>
    public string PathURL
    {
        get
        {
            return (Application.streamingAssetsPath + "/");
        }
    }
    /// <summary>
    /// 主包名,方便修改
    /// </summary>
    private string mainAbname
    {
        get
        {
#if UNITY_IOS
            return "IOS";
#elif UNITY_ANDROID
            return "Android;
#else
            return "PC";
#endif
        }
    }
    //加载AB包
    public void LoadAB(string abName)
    {
        if (mainAb == null)
        {
            mainAb = AssetBundle.LoadFromFile(PathURL + mainAbname);  //加载完主包
            manifest = mainAb.LoadAsset<AssetBundleManifest>("AssetBundleManifest");//加载完固文件

        }

        //加载目标包的依赖包资源
        string[] strs = manifest.GetAllDependencies(abName);
        for (int i = 0; i < strs.Length; i++)
        {
            if (!abDic.ContainsKey(strs[i]))
            {
                AssetBundle ab = AssetBundle.LoadFromFile(PathURL + strs[i]);
                abDic.Add(strs[i], ab);
            }
        }

        //加载目标包,如果没有加载过在加载
        if (!abDic.ContainsKey(abName))
        {
            AssetBundle ab = AssetBundle.LoadFromFile(PathURL + abName);
            abDic.Add(abName, ab);
        }
    }
    /// <summary>
    /// 从AB包加载资源
    /// </summary>
    /// <param name="abName">目标资源所在的 AssetBundle 包名称</param>
    /// <param name="resName">要加载的资源在AB包内的名称</param>


    //同步加载
    public Object LoadRes(string abName, string resName)
    {
        LoadAB(abName);

        Object obj = abDic[abName].LoadAsset(resName);
        if (obj is GameObject)
            return Instantiate(obj);
        else
            return obj;
    }

    //同步加载，根据Type类型
    public Object LoadRes(string abName, string resName, System.Type type)//使用时加上typeof（GameObject）
    {
        LoadAB(abName);

        Object obj = abDic[abName].LoadAsset(resName, type);
        if (obj is GameObject)
            return Instantiate(obj);
        else
            return obj;
    }
    //同步加载，根据泛型加载
    public T LoadRes<T>(string abName, string resName) where T : Object
    {
        LoadAB(abName);

        T obj = abDic[abName].LoadAsset<T>(resName);
        if (obj is GameObject)
            return Instantiate(obj);
        else
            return obj;
    }


    //此处的异步加载是资源加载，而非AB包异步加载
    //根据名字异步加载
    public void LoadResAsync(string abName, string resName, UnityAction<Object> callback)
    {
        StartCoroutine(ReallyLoadResAsync(abName, resName, callback));
    }
    public IEnumerator ReallyLoadResAsync(string abName, string resName, UnityAction<Object> callback)
    {
        LoadAB(abName);
        AssetBundleRequest assetRequest = abDic[abName].LoadAssetAsync(resName);//异步加载资源
        yield return assetRequest;

        if (assetRequest is GameObject)
            callback(Instantiate(assetRequest.asset));
        else
            callback (assetRequest.asset);
    }

    //根据Type异步加载
    public void LoadResAsync(string abName, string resName, System.Type type,UnityAction<Object> callback)
    {
        StartCoroutine(ReallyLoadResAsync(abName, resName, type, callback));
    }
    public IEnumerator ReallyLoadResAsync(string abName, string resName, System.Type type, UnityAction<Object> callback)
    {
        LoadAB(abName);
        AssetBundleRequest assetRequest = abDic[abName].LoadAssetAsync(resName, type);//异步加载资源
        yield return assetRequest;

        if (assetRequest is GameObject)
            callback (Instantiate(assetRequest.asset));
        else
            callback(assetRequest.asset);
    }

    //根据泛型异步加载
    public void LoadResAsync<T>(string abName, string resName, UnityAction<T> callback) where T : Object
    {
        StartCoroutine(ReallyLoadResAsync<T>(abName, resName, callback));
    }
    public IEnumerator ReallyLoadResAsync<T>(string abName, string resName, UnityAction<T> callback) where T : Object
    {
        LoadAB(abName);
        AssetBundleRequest assetRequest = abDic[abName].LoadAssetAsync<T>(resName);//异步加载资源
        yield return assetRequest;

        if (assetRequest is GameObject)
            callback( Instantiate(assetRequest.asset) as T);
        else
            callback(assetRequest.asset as T);
    }
    public void UnLoad(string abName)
    {
        if (abDic.ContainsKey(abName))
        {
            abDic[abName].Unload(false); //只删除AB包，不删除资源
            abDic.Remove(abName);

        }
    }
    public void clearAb()
    {
        AssetBundle.UnloadAllAssetBundles(false);
        abDic.Clear();
        mainAb = null;
        manifest = null;
    }

}

```

# 重新回顾xlua框架

xLua 是腾讯开源的一款用于 Unity 的 **C#/Lua 热更新框架**。它允许开发者在 C# 中调用 Lua 代码，也支持在 Lua 中调用 C# 的功能，从而实现**无需重新编译和发布应用**就能更新游戏逻辑的能力

最重要的就是LuaEnv（lua虚拟机）

```C#
using xlua;
LuaEnv luaenv = new LuaEnv();
```

- 管理 Lua 虚拟机的生命周期
- 加载和执行 Lua 脚本
- 管理 Lua 内存

在使用中，我创建一个通用的类来快捷的在C#调用lua脚本，首先是创建一个lua虚拟机。其次我们在其他脚本中调用的时候需要初始化，因此创建一个初始化的函数，同时实现文件重定向，**在文件重定向的时候，存在2种情况，一种是lua脚本存在于一个文件夹中，我们将所有的lua脚本都存在这个文件夹中，在重定向函数中指明存储的路径。另外一种是AB中，在测试的时候将lua打包进ab'包，再从ab中调用，但是我们需要实现AB包加载器，先加载AB包后即可使用**

**LuaManager.cs**

```C#
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using XLua;

public class LuaManager : Singleton<LuaManager>
{
    public LuaEnv luaEnv;
    public LuaTable Global//得到大G表，用于访问全局lua中的全局变量
    {
        get
        {
            return luaEnv.Global;
        }
    }
    public void Init()
    {
        if (luaEnv != null)
            return;
        luaEnv = new LuaEnv();
        luaEnv.AddLoader(MyCustomLoader); //重定向从文件夹
       // luaEnv.AddLoader(MyCustomABLoader); //重定向从AB包
    }
    public void DoluaFile(string name)
    {
        string str = string.Format("require('{0}')",name);
        DoString(str);
    }

    /// <summary>
    /// lua文件重定向
    /// </summary>
    /// <param name="filepath"></param>
    /// <returns></returns>


    //这个相当于是从自定义文件夹中调用lua文件，而不是ab包，文件的后缀为test.lua
    private byte[] MyCustomLoader(ref string filepath)
    { 
        //AB包中如果要加载本文后缀还是有一定的限制.lua不能被识别
        //打包时，将lua文件后缀改为txt
        string path = Application.dataPath + "/Lua/" + filepath + ".lua";
        if (File.Exists(path))
        {
            return File.ReadAllBytes(path);
        }
        return null;
    }
    //Lua脚本会放在AB包
    //最终我们会通过加载AB包再加载其中的Lua脚本资源来执行它
    //重定向加载AB包中的LUa脚本
    //这个则是ab包中加载lua,文件的后缀为test.lua.txt
    private byte[] MyCustomABLoader(ref string filepath)//文件路径重定向，如果需要在Unity中调用lua脚本，需要在脚本后面添加txt后缀
    {
        #region 没有AB包管理器，加载AB包
        //加载Ab包
        //string path = Application.streamingAssetsPath + "/lua";
        //AssetBundle ab = AssetBundle.LoadFromFile(path);

        ////加载AB包中的lua文件
        //TextAsset text = ab.LoadAsset<TextAsset>(filepath + ".lua");

        //加载lua文件中的字节数组
        #endregion

        #region 从AB包管理器加载
        TextAsset txt = ABManager.Instance.LoadRes<TextAsset>("lua", filepath + ".lua");  //第一个填Ab包名，第二个是
        #endregion
        if(txt == null)
        {
            return null;
        }
        
        return txt.bytes;
    }

    /// <summary>
    /// 执行lua语句
    /// </summary>
    /// <param name="str"></param>
    public void DoString(string str)
    {
        if (luaEnv == null) 
            return; 
        luaEnv.DoString(str);
    }

    /// <summary>
    /// 释放lua垃圾
    /// </summary>
    public void Tick()
    {
        luaEnv.Tick();
    }

    /// <summary>
    /// 销毁解析器
    /// </summary>
    public void Dispose()
    {
        luaEnv.Dispose();
        luaEnv = null;
    }
}

```

#### 如何在C#中获取lua的变量以及函数

使用luaManager中的Global，也就是lua中的大G表，因为在lua中，所有的全局变量都存储在大G表中，因此我们需要通过获取大G表来获取到lua中变量和函数`LuaManager.Instance.Global`,

下面我给出测试案例以及lua边的脚本以及运行结果。需要确保测试的脚本继承monobehaviour以被挂载

```C#
using System;
using UnityEngine;
using XLua;


public class Main : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        LuaManager.Instance.Init();
        LuaManager.Instance.DoluaFile("Test");
        int i = LuaManager.Instance.Global.Get<int>("testNumber");
        bool j = LuaManager.Instance.Global.Get<bool>("testBool");
        string h = LuaManager.Instance.Global.Get<string>("testString");

        //关于无参数无返回值的函数可以使用自带的UnityAction
        // 获取函数引用
        LuaFunction luaFunc = LuaManager.Instance.Global.Get<LuaFunction>("testfunction");

        // 调用函数
        luaFunc.Call();  // 无参数

        //变长参数
        LuaFunction luaFunc1 = LuaManager.Instance.Global.Get<LuaFunction>("testfunction3");
        luaFunc1.Call(1, "hello", true);  // 带参数

        // 通过委托获取（性能更好，但需要预先知道函数签名）
        Action simpleFunc = LuaManager.Instance.Global.Get<Action>("testfunction");
        Func<int, int> addFunc = LuaManager.Instance.Global.Get<Func<int, int>>("testfunction1");
        addFunc(1);
        if (simpleFunc != null) simpleFunc();

        print(i);
        print(j);
        print(h);
    }

    // Update is called once per frame
    void Update()
    {

    }
}

```

```lua
print("Test")
testNumber = 1
testBool = true
testString = '!2'
testfunction = function ()
    print("无返回值无参数")
end
testfunction1 = function (a)
    print('有参数有返回值')
    return a
end
testfunction2 = function ()
    print("多返回值")
    return 1,2,3,false,"1"
end
testfunction3 = function (a,...)
    print("变长参数")
    print(a)
    obj = {...}
    for k,v in pairs(obj) do
        print(k,v)
    end
    
end
```

#### 映射到 C# List<T>（数组型 table）

Lua 数组通常从 **1 开始**；C# List 索引从 **0 开始**

映射时按 1..n 依次取值

```lua
nums = { 10, 20, 30 }
players = {
  { id=1, name="A" },
  { id=2, name="B" }
}
```

**C# 侧映射要点**

- `table[1]` → `list[0]`
- `List<Player>`：每个元素仍是 table，要递归映射到类

** 常见坑**

- table “数组部分”中间有 nil：比如 `{1, nil, 3}`，Lua 的长度 `#t` 行为会不稳定（不同实现/版本可能不同）。
   实战建议：**不要依赖 `#t`**，而是用明确长度字段或用遍历取最大整数 key。

#### 映射到 C# Dictionary<K,V>（字典型 table）

Lua table 的 key 可以是多种类型：string / number / boolean / table / function…

C# Dictionary 需要固定 `K` 类型
 → 最常用是 `Dictionary<string, T>` 或 `Dictionary<int, T>`

```lua
cfg = { hp=100, mp=50, name="hero" }

items = {
  [1001] = { name="sword", atk=10 },
  [1002] = { name="shield", def=5 },
}
```

**映射要点**

- **string key** → `Dictionary<string, object/T>`
- **int key** → `Dictionary<int, object/T>`
- value 是 table → 递归映射到类/字典/列表

**常见坑**

- 混合 key：有 string 又有 int → 你得选一种策略：
  1. 拆分成 `List + Dictionary`
  2. 统一成 `Dictionary<string, object>`（把数字 key 转成字符串）
  3. 用 `Dictionary<object, object>`（不推荐：类型处理麻烦，性能/序列化也差）

 

# Lua基础语法

### 全局变量

在lua语言中，默认创建的变量就是全局变量。全局变量不需要声明，给一个变量赋值，该变量就是全局变量。默认访问一个全局变量也不会报错，但是会输出nil,如果想要删除全局变量，直接给全局变量赋值为nil

```lua
print(b)  --不会报错 ,输出nil
b = 10 --全局变量
b = nil --删除全局变量
```

### 数据类型

Lua 是动态类型语言，变量不要类型定义,只需要为变量赋值。 值可以存储在变量中，作为参数传递或结果返回。

Lua 中有 8 个基本类型分别为：nil、boolean、number、string、userdata、function、thread 和 table。

| 数据类型 | 描述                                                         |
| :------- | :----------------------------------------------------------- |
| nil      | 这个最简单，只有值nil属于该类，表示一个无效值（在条件表达式中相当于false）。 |
| boolean  | 包含两个值：false和true。                                    |
| number   | 表示双精度类型的实浮点数                                     |
| string   | 字符串由一对双引号或单引号来表示                             |
| function | 由 C 或 Lua 编写的函数                                       |
| userdata | 表示任意存储在变量中的C数据结构                              |
| thread   | 表示执行的独立线路，用于执行协同程序                         |
| table    | Lua 中的表（table）其实是一个"关联数组"（associative arrays），数组的索引可以是数字、字符串或表类型。在 Lua 里，table 的创建是通过"构造表达式"来完成，最简单构造表达式是{}，用来创建一个空表。 |

可以使用type关键字来回去变量的数据类型

```lua
print(type(nil))
print(type('123'))
```

##### nil

nil 类型表示一种没有任何有效值，它只有一个值 -- nil，例如打印一个没有赋值的变量，便会输出一个 nil 值，对于全局变量和 table，nil 还有一个"删除"作用，给全局变量或者 table 表里的变量赋一个 nil 值，等同于把它们删掉。而在bool类型中，nil 等同于false，都代表假

```lua
b = 10
b = nil --删除全局变量
tab1 = {key1 = 'value1',key2 = 'value2'}
print(tab1.key1)
tab1.key1 = nil
print(tab1.key1)
```

##### bool

bool数据类型只有false和nil为假，其他都为真，包括负数

```lua
if -1 then  --输出true
    print("true")
else
    print("false")
end
```

##### string

在lua中，字符串由一对双引号或单引号来表示，也可以用 2 个方括号 "[[]]" 来表示"一块"字符串。在对一个数字字符串上进行算术操作时，Lua 会尝试将这个数字字符串转成一个数字，在lua里面字符串的拼接不是使用 +，而是使用..进行拼接。

```lua
print("string1")
print('string1')   --都代表字符串
html = [[stfafaifhahu]]
print(html) --字符串
print("2"+"2") --数字字符串会转成一个数字  结果是4
print("2+2")   --结果是2+2
print("2"+2) --结果是4
```

#### table

在 Lua 里，table 的创建是通过"构造表达式"来完成，最简单构造表达式是{}，用来创建一个空表。也可以在表里添加一些数据，直接初始化表,也可以直接给表进行赋值。不同于其他语言的数组把 0 作为数组的初始索引，在 Lua 里表的默认初始索引一般以 1 开始。table 不会固定长度大小，有新数据添加时 table 长度会自动增长，没初始的 table 都是 nil。

```lua
-- 数组形式的表
fruits = {"apple", "banana", "cherry"}
print(fruits[2])

-- 字典形式的表
person = {name = "Bob", age = 30, city = "New York"}
print(person.name)  --或者 print(person["name"];
--添加
person["gender"] = "男"

-- 遍历表  键值对
for key, value in pairs(person) do
    print(key, value)
end

-- 表的插入，删除
a = {1,"avc", {},function,end}
a[5] = 123
table.insert = (a,2,"d") --a这张表的第二个位置插入d这个字符串
local s = table.remove(a,2)  --将a这张表的第二个元素移除并且赋值给s
```

### 运算符

在lua中，没用自增运算符和复合运算符，不支持三目运算符和位运算符

#### 6.1 算术运算符

```lua
a = 12
b = 5
print(a + b)
print(a - b)
print(a * b)
print(a / b)
print(a % b)
print(a ^ b) --幂运算
```

#### 6.2 关系运算符

```lua
m = 8
n = 8
--返回值是bool值
print(m == n)
print(m ~= n)
print(m > n)
print(m < n)
print(m >= n)
print(m <= n)
```

#### 6.3 逻辑运算符

```lua
p = true
q = false
print(p and q)
print(p or q)
print(not p)
```

### 条件分支语句

Lua 编程语言流程控制语句通过程序设定一个或多个条件语句来设定。在条件为 true 时执行指定程序代码，在条件为 false 时执行其他指定代码。控制结构的条件表达式结果可以是任何值，Lua认为false和nil为假，true和非nil为真。在lua中没有switch条件分支

**要注意的是Lua中 0 为 true，在lua中elseif之间没有空格**

| 语句                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [if 语句](https://www.runoob.com/lua/if-statement-in-lua.html) | **if 语句** 由一个布尔表达式作为条件判断，其后紧跟其他语句组成。 |
| [if...else 语句](https://www.runoob.com/lua/if-else-statement-in-lua.html) | **if 语句** 可以与 **else 语句**搭配使用, 在 if 条件表达式为 false 时执行 else 语句代码。 |
| [if 嵌套语句](https://www.runoob.com/lua/nested-if-statements-in-lua.html) | 你可以在**if** 或 **else if**中使用一个或多个 **if** 或 **else if** 语句 。 |

```lua
score = 78
if score >= 90 then
    print("Grade: A")
elseif score >= 80 then
    print("Grade: B")
elseif score >= 70 then
    print("Grade: C")
elseif score >= 60 then
    print("Grade: D")
else
    print("Grade: F")
end
```

### 循环语句

Lua 语言提供了以下几种循环处理方式：

| 循环类型                                                     | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [while 循环](https://www.runoob.com/lua/lua-while-loop.html) | 在条件为 true 时，让程序重复地执行某些语句。执行语句前会先检查条件是否为 true。 |
| [for 循环](https://www.runoob.com/lua/lua-for-loop.html)     | 重复执行指定语句，重复次数可在 for 语句中控制。              |
| [repeat...until](https://www.runoob.com/lua/lua-repeat-until-loop.html) | 重复执行循环，直到 指定的条件为真时为止                      |
| [循环嵌套](https://www.runoob.com/lua/lua-nested-loops.html) | 可以在循环内嵌套一个或多个循环语句（while do ... end;for ... do ... end;repeat ... until;） |

#### 循环控制语句

循环控制语句用于控制程序的流程， 以实现程序的各种结构方式。

Lua 支持以下循环控制语句：

| 控制语句                                                     | 描述                                             |
| :----------------------------------------------------------- | :----------------------------------------------- |
| [break 语句](https://www.runoob.com/lua/lua-break-statement.html) | 退出当前循环或语句，并开始脚本执行紧接着的语句。 |
| [goto 语句](https://www.runoob.com/lua/lua-goto.html)        | 将程序的控制点转移到一个标签处。                 |

#### while 循环

```lua
--不允许存在n--，
count = 1
while count <= 5 do
    print(count)
    count = count + 1
end
```

####  for 循环

```lua
-- 数值型 for 循环，其中的i默认递增
for i = 1, 10, 2 do  -- 步长为 2，步长也可以为负数，在循环中，循环变量是不可以修改的，即i不可以修改，因为是默认递增，如果使用往下变量，则将步长设置为负数
    print(i)
    i = 1 --前面默认有一个local，局部变量
end

-- 泛型 for 循环遍历表
numbers = {10, 20, 30, 40}
for index, value in ipairs(numbers) do
    print(index, value)
end
```

####  repeat - until 循环

```lua
num = 1
repeat
    print(num)
    num = num + 1
until num > 5  --until是结束条件，而非进入条件
```

###  函数

因为lua是解释性语言，执行的顺序是从上到下逐条执行的，必须在函数的定义之后才能够使用函数。在有参函数中，因为是不指定参入的参数的类型是，所以支持所有的基本类型传入，**如果传入函数的参数与函数的参数个数不匹配，不会报错，只会补空nil或者是丢弃**，在lua中，默认不支持函数重载，如果有相同的函数，默认调用最后创建的函数

```lua
-- 定义函数
function multiply(x, y)
    return x * y
end

-- 调用函数
product = multiply(4, 7)
print(product)

-- 返回多个值的函数，需要相匹配的变量去接取
function get_name_age()
    return "Alice", 25
end

name, age = get_name_age()
print(name, age)

--变长参数使用，使用一个表进行存储
function F(...)
    arg ={...}
    for i,#arg do 
        print(arg[i])
    end
end
F(1,2,3,4,5,6)
```

lua函数闭包

```lua
function f1(x)
    --改变了传入参数的生命周期，延长
	return function(y)
		return x+y
	end
end
f = f1(10)
print(f(5))
```

函数f1返回一个匿名函数，该匿名函数捕获了外部变量x 也就是10，写成闭包。f变量接受一个返回值为函数的赋值，所以f = function（y），变量f成为一个函数。当调用f（5），闭包内的`x`与传入的`y`（值为 5）相加，输出结果 15。正常f1的变量在生命周期接受后就被释放，在此次通过闭包的方式，延迟了声明周期。

### 数组

Lua 中并没有专门的数组类型，而是使用一种被称为 **"table"** 的数据结构来实现数组的功能。Lua 数组的索引键值可以使用整数表示，数组的大小不是固定的。在 Lua 索引值是以 **1** 为起始，但你也可以指定 0 开始。通过#来计算数组的长度，在计算数组的长度时，只要遇到nil，则不计算nil及以后的数组元素，只计算之前的。

```lua
a = {1,2,nil,1,3,nil}
--数组的长度为2

-- 定义数组  数组下标是1开始的
array = {11, 22, 33, 44, 55}

-- 访问数组元素
print(array[3])

-- 遍历数组
for i = 1, #array do
    print(array[i])
end

--二维数组的创建以及遍历
a = {{1,2,3},{2,3,4}}
for i = 1,#a do
    b = a[i]
    for j =1,#b do
        print(b[j])
    end
end

--自定义索引
a = {[0]=1,2,3,[-1]=4,5}
print(a[0])
print(a[-1])
print(#a) --长度是3，因为lua是从1开始遍历的，[0],[-1]的索引都小于1，没有被遍历进数组的长度中
```

### 表

```lua
-- 数组形式的表
fruits = {"apple", "banana", "cherry"}
print(fruits[2])

-- 字典形式的表
person = {name = "Bob", age = 30, city = "New York"}
print(person.name)  --或者 print(person["name"];
--添加
person["gender"] = "男"

-- 遍历表  键值对
for key, value in pairs(person) do
    print(key, value)
end

-- 表的插入，删除
a = {1,"avc", {},function,end}
a[5] = 123
table.insert = (a,2,"d") --a这张表的第二个位置插入d这个字符串
local s = table.remove(a,2)  --将a这张表的第二个元素移除并且赋值给s
```

特殊的表结构，字典。字典是由键值对得到的

```lua
a ={["name"] = "111",["age"]=13}
--访问其中的单个变量可以通过中括号进行访问
print(a["name"])
--或者类似于.成员变量的形式进行得到，但是不能是数字
print(a.name)

--新增变量
a["Sex"] = false

--删除变量
a["Sex"] = nil
```

在lua中，可以使用表来模拟面向对象，在调用方法时，存在两种方式，通过.进行调用或者是通过通过：进行调用。通过冒号进行调用，会默认把调用者作为第一个参数传入方法中。同时，冒号也可以用来声明函数，如果是冒号声明，相当于有一个默认参数

```lua
Student ={
    name = "111",
    Sex = false,
    Learn = function()
        print(Student.Sex)
        print("11111111")
    end
}
Student.name = "222"    --在表外为创建表内的元素
Student.age = 18
Student.speak = function()  --直接在表外创建表内的方法
    print("I say")
    end
Student:Learn()
```

### 多脚本执行

Lua提供了一个名为require的函数用来加载模块。要加载一个模块，只需要简单地调用就可以了。例如：

```lua
require("<模块名>")
```

或者

```lua
require "<模块名>"
```

执行 require 后会返回一个由模块常量或函数组成的 table，并且还会定义一个包含该 table 的全局变量。并且执行require后，可以使用其他模块中的全局变量以及方法，但是局部变量无法使用，如果使用返回nil

```lua
--_G全局表,所有的全家变量都在全局表_G，如果加入local，则不会被添加进_G

new_variable = 100
print(_G.new_variable)   --print(_G[new_variable])

-- 动态创建全局变量
_G["dynamic_variable"] = 200
print(dynamic_variable)
```

### 迭代器遍历

**ipairs遍历,遍历的索引依旧是从下标1开始遍历，小于等于0的索引遍历不到。并且只能找到连续索引的键，如果中间断续了，它也无法遍历出后面的内容。**

```lua
a ={[0]=1,2,[-1]=3,4,5,[5]=6}
for i,k in ipairs(a) do
	print("ipairs遍历键值"..i.."_"..k)
end
```

![image-20250513194246915](E:\typora_note\GameEngineStudy\assets\image-20250513194246915.png)

**pairs迭代器遍历能够把所有的键都找到，同时也可以只遍历键**

```lua
a ={[0]=1,2,[-1]=3,4,5,[5]=6}
for i,k in pairs(a) do
	print("pairs遍历键值"..i.."_"..k)
end
```

![image-20250513194437828](E:\typora_note\GameEngineStudy\assets\image-20250513194437828.png)

### 协程

lua 协同程序(coroutine)与线程比较类似：拥有独立的堆栈，独立的局部变量，独立的指令指针，同时又与其它协同程序共享全局变量和其它大部分东西。协同程序可以理解为一种特殊的线程，可以暂停和恢复其执行，从而允许非抢占式的多任务处理。

| 方法                | 描述                                                         |
| :------------------ | :----------------------------------------------------------- |
| coroutine.create()  | 创建 coroutine，返回 coroutine， 参数是一个函数，当和 resume 配合使用的时候就唤醒函数调用 |
| coroutine.resume()  | 重启 coroutine，和 create 配合使用                           |
| coroutine.yield()   | 挂起 coroutine，将 coroutine 设置为挂起状态，这个和 resume 配合使用能有很多有用的效果 |
| coroutine.status()  | 查看 coroutine 的状态 注：coroutine 的状态有三种：dead，suspended，running，具体什么时候有这样的状态请参考下面的程序 |
| coroutine.wrap（）  | 创建 coroutine，返回一个函数，一旦你调用这个函数，就进入 coroutine，和 create 功能重复 |
| coroutine.running() | 返回正在跑的 coroutine，一个 coroutine 就是一个线程，当使用running的时候，就是返回一个 coroutine 的线程号 |

### 元表

Lua 提供了元表(Metatable)，允许我们改变 table 的行为，每个行为关联了对应的元方法。例如，使用元表我们可以定义Lua如何计算两个table的相加操作当 Lua 试图对两个表进行相加时，先检查两者之一是否有元表，之后检查是否有一个叫 **__add** 的字段，若找到，则调用对应的值。 **__add** 等即时字段，其对应的值（往往是一个函数或是 table）就是"元方法"。

- **setmetatable(table,metatable):** 对指定 table 设置元表(metatable)，如果元表(metatable)中存在 __metatable 键值，setmetatable 会失败。
- **getmetatable(table):** 返回对象的元表(metatable)。
- **rawget(table,变量)：**只会在table中寻找该元素，不会在元表查找变量
- **rawset(table,变量，变量值)：**会忽略newindex设置，只会在自己的表中修改变量的值

```lua
meta = {
	__tostring = function()
		return 'pap'
	end
}
tab1 = {}
setmetatable(tab1,meta)
print(tab1)

--当子表作为一个函数来使用的时候，默认调用__call里面的内容
meta = {
	__tostring = function()
		return 'pap'
	end,
    __call = function(a,b) --当传入的参数少于接受的参数，默认是第一个参数接受传入的
        print(a) 
        print(b)
        print('__call被调用')
	end
}
tab2 = {}
setmetatable(tab2,meta)
tab2(1)
```

同时，可以使用元表进行运算符进行重载，如果实现2张表进行相加，会寻找元表是否存在 __ add函数，存在则进行相加,减法也是如此，寻找元表中是否存在 __sub， _ _index当子表中找不到某一个属性时，会到元表中 _ _index指定的表中去寻找索引,建议将  _ _index写在函数外部，因为写在解释性语言边执行边解释，然后在内部因为表还没有完全初始化，所以为nil。如果在meta表中index也找不到这个元素，在meta表的元表的index去寻找

```lua
metafather ={
    
}
metafather.__index = {age = 2 }
meta = {
	__add = function(a,b)
		return a.a + b.a
		end,
    __sub = function(a,b)
        return a.a - b.a
		end,
    __mul = function(a,b)
        return a.a * b.a
		end,
    __div = function(a,b)
        return a.a / b.a
		end,
}
setmetatable(meta,metafather)

meta.__index = meta
tab1 = {a= 10}
tab2 = {a= 10}
setmetatable(tab1,meta)
print(tab1+tab2)
print(tab1-tab2)
print(tab1*tab2)
print(tab1/tab2)

print(tab1.age)
```

### 面向对象

### 封装

```lua
object = {}
object.id = 1

--将表进行封装，实现了2个函数
function object :Test()
  print(self.id)
end

function object:func()  --通过冒号定义方法相当于把自己作为第一个参数传入

    local obj = {}
    setmetatable(obj,self)
    self.__index = self
    return obj
  end

local obj = object:func()
print(obj.id)

obj:Test()  --等价于object.Test(obj),由于obj原型继承了object，因此调用Test方法时，self指向obj
obj.id =2  
print(object.id)  --相当于对空表obj中声明一个新的id，所以打印原来的id还是1
obj:Test()    --将自身传入，所以打印出来的是自身的id
```

### 继承

```lua
object = {}
object.id = 1

function object:func()  --通过冒号定义方法相当于把自己作为第一个参数传入

    local obj = {}
    setmetatable(obj,self)
    self.__index = self
    return obj
  end
function object:subClass(ClassName)
  _G[ClassName] = {}
  local obj = _G[ClassName]
  setmetatable(obj,self)
  self.__index = self
  return obj
end

object:subClass("Person")  --object.subClass(object,"Person")

local p1 = object.func(Person)  --Person:func()
print(p1.id)
```

### 多态

```lua
object = {}   --实现类
object.id = 1


function object:new()   --封装
    local obj = {}
    setmetatable(obj,self)
    self.__index = self
    return obj
end

function object:makeSound()
    print("object makeSound")
end

function object:subclass(className)   --实现继承
    _G[className] = {}
    local child = _G[className]
    setmetatable(child,self)
    self.__index = self
    self.base = self
    return child
end

object:subclass("childobject1")  --创建object的子类childobject
object:subclass("childobject2")

function childobject1:makeSound()    --多态
    print("childobject1 makeSound")
end

function childobject2:makeSound()
    print("childobject2 makeSound")
end

childobject1.makeSound()
childobject2.makeSound()

local ob = object:new()
print(ob.id)

   
```

# XLua框架

Unity游戏引擎的Lua热更新框架，允许开发者使用Lua脚本来实现游戏逻辑的热更新。

## 核心功能 

1. **Lua 与 C# 互调**
   - 支持 C# 调用 Lua
   - 支持 Lua 调用 C#
   - 自动生成绑定代码
2. **热更新能力**
   - 无需重新发布游戏客户端
   - 通过下载 Lua 脚本更新游戏逻辑
3. **性能优化**
   - 高效的 Lua 虚拟机
   - 优化的绑定调用性能

## Lua解析器

Lua解析器是将Lua源代码转换为可执行代码的核心组件，它负责词法分析、语法分析和代码生成等关键步骤

Lua解析器通常包含以下几个主要模块：

1. **词法分析器(Lexer)**：将源代码分解为标记(tokens)
2. **语法分析器(Parser)**：根据语法规则构建抽象语法树(AST)
3. **代码生成器(Code Generator)**：将AST转换为字节码或机器码
4. **符号表管理**：跟踪变量和作用域

```C#
using Xlua

```

## Lua文件加载重定向

Lua文件加载重定向是指在Lua模块加载过程中，通过自定义的加载逻辑改变原始文件的加载路径或内容。这种机制允许开发者灵活控制Lua脚本的加载来源和方式。通过xlua自带的`AddLoader`方法用于向Lua环境添加自定义的模块加载器，允许你控制Lua脚本的加载方式和来源。AddLoader接受一个自定义加载器的方法。获得文件的路径和内容。

requires("Lua脚本") 首先通过自定义函数寻找文件，在从默认路径寻找。

大概流程如下，如果使用 `AddLoader`方法时，传入的自定义加载器方法返回 `nil`（未找到指定路径的Lua文件），XLua 会继续尝试在默认路径（即 `Resources`文件夹及其子目录）下查找对应的 Lua 文件。

```C#
using System.IO;
using XLua;
using UnityEngine;
class LuaLearn:MonoBehaviour
{
    public void Start(){
        LuaEnv luaEnv = new LuaEnv();//lua解析器，能够在Unity中执行lua脚本  
        luaEnv.DoString("require('Main')");   //执行lua脚本
        luaEnv.AddLoader(CustomLoader);//是一个委托，需要传入一个方法，方法的参数是ref string filepath，返回值是byte[]，加载lua脚本
    }
    private byte[] CustomLoader(ref string filepath){//接受的参数是一个require执行的lua脚本名
        //将脚本名以及后缀名拼接成文件路径
        string path = Application.dataPath + "/Lua/" + filepath + ".lua";
        if(File.Exists(path)){//如果文件存在，则读取文件内容
            return File.ReadAllBytes(path);
        }
        return null;//如果文件不存在，则返回null
    }


}

```

## lua文件加载管理器

### 核心逻辑流程

1. **初始化 Lua 环境并注册 AB 包加载器**
   - 创建`LuaEnv`实例（Lua 虚拟机）
   - 仅注册 AB 包专用加载器，确保所有 Lua 脚本都从 AB 包加载
2. **从 AB 包加载 Lua 脚本资源**
   - 通过 AB 包管理器加载指定 AB 包（如名为`lua`的包）
   - 从 AB 包中读取 Lua 脚本（以`TextAsset`形式存储，通常后缀为`.lua`）
   - 提取`TextAsset`的字节数据或文本内容
3. **通过`DoString`执行加载的 Lua 内容**
   - 将加载到的 Lua 脚本内容（字符串或字节数组）传入`luaEnv.DoString()`
   - 执行 Lua 代码，完成逻辑调用





1.从本地资源加载  从`Assets/Lua/`目录直接读取原始Lua文件。

- 功能：从本地`Assets/Lua`目录加载 Lua 脚本
- 工作流程：
  1. 拼接完整文件路径
  2. 检查文件是否存在
  3. 存在则返回文件字节数组，否则返回 null

```C#
private byte[] MyCustomLoader(ref string filepath)
{
    //构建本地Lua文件路径
    string path = Application.dataPath + "/Lua/" + filepath + ".lua";
    if (File.Exists(path))
    {
        return File.ReadAllBytes(path);  //返回文件字节数组
    }
    return null;  //文件不存在返回null
}
```

2.从AssetBundle资源加载，从`StreamingAssets/lua`加载AssetBundle文件

- 功能：从 AssetBundle 资源包中加载 Lua 脚本
- 工作流程：
  1. 通过 AB 包管理器加载指定的 TextAsset 资源
  2. 检查资源是否存在
  3. 存在则返回字节数组，否则返回 null
  4. 注：Lua 脚本在 AB 包中通常以 txt 后缀存储，避免打包识别问题

```C#
private byte[] MyCustomABLoader(ref string filepath)
{
    //从AB包管理器加载lua文件（已打包为TextAsset）
    TextAsset txt = ABManager.Instance.LoadRes<TextAsset>("lua", filepath + ".lua");
    if(txt == null)
    {
        return null;
    }
    return txt.bytes;  //返回文本资源的字节数组
}
```

3.加载完成lua脚本后，执行lua脚本

```C#
public void DoString(string str)
{
    if (luaEnv == null) 
        return; 
    luaEnv.DoString(str);  //执行Lua代码字符串
}
```

## C#调用lua

### 全局变量的获取

通过xlua中的 LuaEnv中的global变量的方法来获取全局变量，get获取变量，set设置变量

```C#
    public LuaTable Global//得到大G表，用于访问全局lua中的全局变量
    {
        get
        {
            return luaEnv.Global;
        }
    }
    LuaTable globalTable = luaEnv.Global;
    int number = globalTable.Get<int>("testVar");//参数必须与lua中的变量名相同，而且是值拷贝

	luaEnv.Global.Set("testVar", 456); // 修改 Lua 全局变量
    luaEnv.Global.Set("testStr", "Hello Lua");
    luaEnv.Global.Set("testFlag", true);

List<int> list = LunEnv.Instance.Global.Get<List<int>>("testList");//指定类型，不指定类型用Object
for(int i = 0; i < list.Count;i++){
	
}
Dictionary<int,object> list = LunEnv.Instance.Global.Get<Dictionary<int,object>>("testList");//指定类型，不指定类型用Object
```

### 函数的获取

- 无参无返回值
- 有参有返回值
- 多返回值：使用out和ref来实现
- 变长参数

使用委托来获取函数

```C#
public delegate void Func();

--方法1
Func func = LuaManager.Instance.Global.Get<Func>("传入lua函数名");//无参数无返回值
--方法2//Unity自带的无参数无返回值的委托
UnityAction ua = LuaManager.Instance.Global.Get<UnityAction>("传入lua函数名");


```

```C#
// 获取 Lua 函数
LuaFunction addFunc = luaEnv.Global.Get<LuaFunction>("Add");

// 调用函数
object[] result = addFunc.Call(10, 20);
Debug.Log($"10 + 20 = {result[0]}"); // 输出 30

// 或者直接执行
luaEnv.DoString("print(Add(5, 7))"); // 输出 12
```

### 类和接口映射table

在 Unity 中使用 XLua 实现 C# 单向调用 Lua 时，类映射和接口映射是两种核心交互方式。类映射通过 `[LuaCallCSharp]`将 C# 类暴露给 Lua，使 Lua 能直接实例化并操作 C# 对象，适合需要将复杂 C# 对象提供给 Lua 使用的场景。例如定义 `[LuaCallCSharp] class Player`后，Lua 可通过 `CS.Player()`创建对象并调用方法。

接口映射则通过 `[CSharpCallLua]`让 C# 以面向对象方式调用 Lua 逻辑，先在 C# 定义接口如 `[CSharpCallLua] interface IEnemy`，再在 Lua 中实现对应 Table，最后 C# 通过 `Get<IEnemy>()`获取实例调用。这种方式比直接使用 `LuaTable`更安全高效，适合高频调用场景。

两种方式各有所长：类映射侧重将 C# 对象注入 Lua 环境，接口映射则优化 C# 调用 Lua 逻辑的性能和可维护性。实际开发中，类映射常用于提供基础服务，接口映射多用于业务逻辑交互，二者配合可构建清晰的跨语言架构。关键是根据交互频率和复杂度选择合适方式，同时注意通过缓存和委托优化性能。法来实现

```lua
-- 在Lua中创建一个玩家表
PlayerTable = {
    name = "张三",
    level = 25,
    skills = {"火球术", "冰冻术", "治疗术"},
    stats = {
        attack = 150,
        defense = 80,
        speed = 120
    },
    
    -- 方法
    Attack = function(self, target)
        print(self.name .. "对" .. target .. "发动攻击!")
        return self.stats.attack
    end,
    
    LevelUp = function(self)
        self.level = self.level + 1
        print(self.name .. "升级了! 当前等级:" .. self.level)
    end
}
```

两种方法得到：一种是通过luatable（效率低，且为引用类型，直接改了lua中的内容），一种是通过global，本质上一样的，因为global是luatable类型

```C#
using UnityEngine;
using XLua;

public class LuaTableExample : MonoBehaviour
{
  
    void Start()
    {
        // 1. 初始化Lua环境
        LuaManger.Instance.Init();
        
        // 2. 加载包含PlayerTable的Lua脚本
        LuaManger.Instance.DoluaFile("Main");
        
        // 3. 获取Lua中的表
        LuaTable playerTable = luaEnv.Global.Get<LuaTable>("PlayerTable");
        
        // 4. 读取表中的数据
        string name = playerTable.Get<string>("name");
        int level = playerTable.Get<int>("level");
        Debug.Log($"玩家: {name}, 等级: {level}");
        
        // 5. 读取嵌套表
        LuaTable statsTable = playerTable.Get<LuaTable>("stats");
        int attack = statsTable.Get<int>("attack");
        Debug.Log($"攻击力: {attack}");
        
        // 6. 读取数组
        LuaTable skillsTable = playerTable.Get<LuaTable>("skills");
        for(int i = 1; i <= skillsTable.Length; i++)
        {
            string skill = skillsTable.Get<string>(i);
            Debug.Log($"技能{i}: {skill}");
        }
        
        // 7. 调用Lua表中的方法
        LuaFunction attackFunc = playerTable.Get<LuaFunction>("Attack");
        object[] results = attackFunc.Call(playerTable, "怪物A");
        Debug.Log($"造成伤害: {results[0]}");
        
        LuaFunction levelUpFunc = playerTable.Get<LuaFunction>("LevelUp");
        levelUpFunc.Call(playerTable);
        
        // 8. 修改表中的数据
        playerTable.Set("name", "李四");
        statsTable.Set("attack", 180);
        Debug.Log($"修改后的玩家名: {playerTable.Get<string>("name")}");
    }
    
    void OnDestroy()
    {
        if (luaEnv != null)
        {
            luaEnv.Dispose();
        }
    }
}
```



| 知识点       | 核心内容                                                | 考试重点/易混淆点                    |
| ------------ | ------------------------------------------------------- | ------------------------------------ |
| 接口映射基础 | 通过自定义接口获取Lua表内容，接口中变量需用属性声明     | 接口不支持成员变量，必须使用属性     |
| 特性标记要求 | 接口前必须添加[CSharpCallLua]特性标记                   | 每次修改接口结构后需重新生成代码     |
| 代码生成流程 | 必须通过XLua菜单执行"生成代码"操作                      | 结构变更时需要先清除旧代码再重新生成 |
| 引用拷贝特性 | 接口是首个引用拷贝类型，修改接口值会同步改变Lua表原始值 | 与之前学习的值拷贝机制形成对比       |
| 属性兼容规则 | 接口属性与Lua表字段可多可少，多余属性自动忽略           | 缺失字段返回默认值（如int返回0）     |
| 嵌套结构处理 | 嵌套接口需遵循相同规则（需特性标记+代码生成）           | 与类映射规则相似但需注意接口特性     |
| 调试验证方法 | 通过值修改测试引用拷贝特性，通过增删属性测试兼容性      | 需观察控制台输出和Lua表实际变化      |

## lua调用C#

**必须先在 C# 中创建并初始化 Lua 虚拟机环境，然后才能执行任何 Lua 代码（包括调用 C# 的 Lua 代码）**。Lua 脚本本身无法"自主"运行，它需要一个宿主程序（Host）来启动 Lua 虚拟机（Lua State）。

![image-20250823141423581](/notes-assets/GameEngineStudy/assets/image-20250823141423581.png)

### 类相关

- 自定义类：使用 `CS.命名空间.类名.new()`创建实例，通过冒号调用实例方法
- U3D自带类：通过 `CS.UnityEngine.类名`直接访问静态方法或使用构造函数创建引擎对象。
- 继承Mono类：通过 `gameObject:GetComponent("类名")`获取组件后调用其公共方法和字段。

```lua
--lua中使用c#的类非常简单,U3D自带类
--固定套路
--CS.命名空间.类名
--Unity的类比如GameObject，Transform等等   CS.UnityEngine.类名
--CS.UnityEngine.GameObject 

--通过c#中的类实例化一个对象lua中没有new所以我们直接类名括号就是实例化对象
--默认调用的相当于就是无参构造
local obj = CS.UnityEngine.GameObject()   --直接创建了一个GameObject对象
obj.name = "Test"   --设置对象的名称

--为了方便使用，我们可以给这个对象起一个别名
GameObject = CS.UnityEngine.GameObject
local obj2 = GameObject()

--c#中类的静态方法调用,通过.调用
local obj3 = GameObject.Find("Test")

--c#中类的成员变量调用,直接对象.变量名
Debug = CS.UnityEngine.Debug
Debug.Log(obj.transform.position)

--c#中类的成员方法调用,直接对象:方法名(参数)
Vector3 = CS.UnityEngine.Vector3
obj.transform:Translate(Vector3(1,0,0))

--调用自定义类
local t = CS.Test()  --有命名空间加上命名空间，没有则直接类名
t:speak("Hello World")

local t2 = CS.Mr_J.Test2()  --有命名空间加上命名空间，没有则直接类名
t2:speak("Hello World")


--继承MonoBehaviour的类，不能直接实例化，需要挂载到游戏对象上
local obj4 = GameObject()
--xlua中提供了一个重要方法，使用typeof可以得到类的type
--xlua中不支持 无参泛型函数，所以使用另一个方法
obj4:AddComponent(typeof(CS.test))  --为obj4添加一个test组件（脚本）
```

### 枚举类型

**自定义枚举**：通过 CS.命名空间.枚举类型访问，如 CS.MyGame.ItemType。

**系统自带枚举**：通过 CS.UnityEngine.枚举类型访问，如 CS.UnityEngine.DayOfWeek

```lua
GameObject = CS.UnityEngine.GameObject

-- 假设有一个自定义枚举类型 CS.MyGame.CharacterState
-- 正确访问方式：

-- 1. 直接访问枚举值
local idleState = CS.MyGame.CharacterState.idle
print("枚举值:", idleState)

-- 2. 使用__CastFrom从数值转换
local stateFromNumber = CS.MyGame.CharacterState.__CastFrom(1)
print("从数字转换:", stateFromNumber)

-- 3. 使用__CastFrom从字符串转换  
local stateFromString = CS.MyGame.CharacterState.__CastFrom("atk")
print("从字符串转换:", stateFromString)
```

### 数组，List，字典

数组

```lua
--调用C#中的数组
local obj = CS.SSS()
print(obj.array.Lenght)

for i = 0,obj.array.Length - 1 do
    print(obj.array[i])
end

-- 创建数组
local array = CS.System.Array.CreateInstance(CS.System.Int32, 5)

-- 设置元素（索引从0开始）
for i = 0, 4 do
    array[i] = i * 10
end

-- 访问元素
for i = 0, array.Length - 1 do
    print("数组元素[" .. i .. "]: " .. array[i])
end

-- 获取长度
local length = array.Length

```

List

```lua
local obj = CS.SSS()
print(obj.list.Count)


--在lua中创建一个List对象,需要指定泛型类型

local list1 = CS.System.Collections.Generic.List(CS.System.Int32)()

-- 添加元素
list1:Add(10)
list1:Add(20)
list1:Add(30)-- 常用方法

-- 遍历List
for i = 0, list1.Count - 1 do
    print("List元素[" .. i .. "]: " .. list1[i])
end

list1:Remove(20)          -- 移除元素
list1:Contains(10)        -- 检查包含
list1:Clear()             -- 清空列表
```

字典

```lua
local obj = CS.SSS()

-- 创建字典（指定键值类型）
local dict = CS.System.Collections.Generic.Dictionary(CS.System.String, CS.System.Int32)()

-- 添加键值对
dict:Add("apple", 100)
dict:Add("banana", 200)
dict:Add("orange", 300)

-- 访问值（使用TryGetValue避免异常）
local value
if dict:TryGetValue("apple", value) then
    print("apple的价格: " .. value)
end

-- 索引器访问（如果键不存在会报错）
print("banana的价格: " .. dict["banana"])

-- 设置值
dict["grape"] = 400

-- 检查包含键
if dict:ContainsKey("orange") then
    print("包含orange")
end

-- 遍历字典
local enumerator = dict:GetEnumerator()
while enumerator:MoveNext() do
    local current = enumerator.Current
    print("键: " .. current.Key .. ", 值: " .. current.Value)
end

-- 常用方法
dict:Remove("banana")    -- 移除键值对
print("字典数量: " .. dict.Count)
```

### 拓展方法

想要使用C#的拓展方法，必须加上特性

```C#
// 必须添加 [LuaCallCSharp] 特性
[LuaCallCSharp]
public static class StringExtensions
{
    public static int WordCount(this string str) 
    {
        return str.Split(' ').Length;
    }
}
```

因为是静态方法，直接可以通过.调用

```lua
-- 直接通过静态类调用，第一个参数传实例
local count = CS.StringExtensions.WordCount("hello world")
print(count) -- 输出 2
```

### lua使用C#重载函数

在 Lua 中调用 C# 的重载函数时，由于 Lua 只有 number 一种数值类型（同时涵盖整数和浮点数），而 C# 的重载函数通常会根据参数的精确类型（如 int、float、double 等）来区分，这就可能导致 Lua 无法正确匹配到预期的重载函数，从而引发数据错误或调用异常。

1. **避免参数类型重载**：对于需要在 Lua 中调用的 C# 函数，尽量不使用仅靠数值类型区分的重载，而是使用不同的函数名。
2. **类型显式转换**：在 Lua 调用时，通过中间层或绑定工具提供的机制显式指定参数类型，帮助匹配正确的重载函数。
3. **使用包装函数**：在 C# 端创建一个统一入口的函数，接收参数后根据实际情况转发到对应的重载函数，避免 Lua 直接处理类型重载。

``` lua
local obj = CS.L()
print(obj:calc())
print(obj:calc(15,1))
--调用了C#的L类中的calc的方法以及该方法的重载
```

### lua使用C#的委托和事件

委托

C# 委托本质是函数指针的包装，在 Lua 中通常需要：

- 将 Lua 函数转换为 C# 可识别的委托实例
- 或直接调用已存在的 C# 委托

```lua
local obj = CS.TestClass()

local fun = function (a,b)
    print("lua被调用" ,a,b)
end

obj.myDelegate = fun
obj.myDelegate(51,"from lua") --有参函数，无参函数直接调用不用传值obj.myDelegate

obj:InvokeDelegate(function (a,b)
    print("委托参数回调",a,b)
    
end)
```

```C#
public delegate void MyDelegate(int a, string b);

public class TestClass
{
    // 委托字段
    public MyDelegate myDelegate;

    // 接收委托作为参数的方法
    public void InvokeDelegate(MyDelegate del)
    {
        del?.Invoke(123, "from C#");
    }
}
```

事件

C# 事件是特殊的委托（带访问控制的委托成员），在 Lua 中通常通过 `+=` 订阅、`-=` 取消订阅，但需要注意：

- 订阅时需保存 Lua 函数的引用，否则可能被 GC 回收
- 不同框架可能有特定的事件绑定语法（如 `AddListener`/`RemoveListener`）

```C#
public class EventTest {
    // 定义事件
    public event Action<string> OnMessage;
    
    // 触发事件的方法
    public void TriggerEvent(string msg) {
        OnMessage?.Invoke(msg);
    }
}
```

```lua
local eventObj = CS.EventTest()

-- 定义回调函数（需保存引用，避免被回收）
local onMessageFunc = function(msg)
    print("收到事件：", msg)
end

-- 订阅事件（+= 语法，XLua 支持）
eventObj.OnMessage = eventObj.OnMessage + onMessageFunc

-- 触发事件（C# 侧调用后，Lua 回调会执行）
eventObj:TriggerEvent("Hello Lua!")  -- 输出：收到事件：Hello Lua!

-- 取消订阅（-= 语法）
eventObj.OnMessage = eventObj.OnMessage - onMessageFunc
eventObj:TriggerEvent("测试")  -- 此时回调不再执行
```

1. **类型匹配**：
   - Lua 函数的参数数量和类型需与 C# 委托 / 事件的签名一致（Lua 会自动进行基础类型转换）。
   - 复杂类型（如自定义类）需确保已在绑定框架中注册。
2. **内存管理**：
   - Lua 函数绑定到 C# 委托 / 事件后，需手动取消订阅，否则可能导致 C# 对象无法被 GC 回收（内存泄漏）。
   - 部分框架（如 ILRuntime）需要显式管理委托的生命周期。
3. **框架差异**：
   - **XLua**：支持 `+=`/`-=` 语法直接操作事件，自动处理类型转换。
   - **ILRuntime**：需通过 `Add`/`Remove` 方法操作委托，且需要注册委托转换器。
   - **LuaInterface**：通常使用 `Delegate.CreateDelegate` 手动创建委托实例。
4. **性能考量**：
   - 频繁的委托 / 事件绑定可能有性能开销，建议在初始化时完成绑定，避免运行时频繁操作。

### lua调用c#二维数组

在 Lua 中调用 C# 的二维数组需要注意两者数据结构的差异，Lua 中没有原生的二维数组概念，通常用嵌套表（table）来模拟。不同的 Lua-C# 绑定框架（如 XLua、ILRuntime 等）处理方式略有不同，但核心思路是通过绑定层实现二维数组与 Lua 嵌套表的转换。

```C#
public class ArrayTest {
    // 定义一个二维数组字段
    public int[,] int2DArray = new int[2, 3] { 
        { 1, 2, 3 }, 
        { 4, 5, 6 } 
    };
    
    // 定义一个返回二维数组的方法
    public float[,] GetFloat2DArray() {
        return new float[2, 2] { 
            { 1.1f, 2.2f }, 
            { 3.3f, 4.4f } 
        };
    }
}
```



```lua
--二维数组访问元素是通过Getvalue(0,0)  行列



-- 获取 C# 对象实例
local testObj = CS.ArrayTest()

-- 访问 int 类型二维数组
local intArray = testObj.int2DArray

-- 获取数组维度长度（第 0 维：行数，第 1 维：列数）
local rowCount = intArray:GetLength(0)  -- 结果：2
local colCount = intArray:GetLength(1)  -- 结果：3

-- 遍历二维数组
for i = 0, rowCount - 1 do
    for j = 0, colCount - 1 do
        local value2 = intArray:GetValue(i, j)
        print(string.format("intArray[%d,%d] = %d", i, j, value2))
    end
end
-- 输出：
-- intArray[0,0] = 1
-- intArray[0,1] = 2
-- intArray[0,2] = 3
-- intArray[1,0] = 4
-- intArray[1,1] = 5
-- intArray[1,2] = 6


-- 访问方法返回的 float 二维数组
local floatArray = testObj:GetFloat2DArray()
local floatRow = floatArray:GetLength(0)  -- 结果：2
local floatCol = floatArray:GetLength(1)  -- 结果：2

for i = 0, floatRow - 1 do
    for j = 0, floatCol - 1 do
        print(string.format("floatArray[%d,%d] = %.1f", i, j, floatArray[i, j]))
    end
end
-- 输出：
-- floatArray[0,0] = 1.1
-- floatArray[0,1] = 2.2
-- floatArray[1,0] = 3.3
-- floatArray[1,1] = 4.4
```

1. **维度索引**：
   - C# 二维数组的索引从 0 开始，与 Lua 表的默认索引一致。
   - 必须通过 `GetLength(dimension)` 获取维度长度，不能直接用 `#` 运算符（Lua 的 `#` 对 C# 数组可能返回不正确的结果）。
2. **数组类型差异**：
   - 上述示例针对 C# 的多维数组（int[,]），如果是 交错数组（int[][]，数组的数组），处理方式不同：
     - 交错数组在 Lua 中会被转换为嵌套表，可直接用 `[i][j]` 访问（如 `array[0][1]`）。
     - 可通过 `#` 获取外层数组长度（如 `#array` 获取行数）

### lua调用C#的null和nil比较

- **C# 的 `null`**：表示引用类型未指向任何对象（引用为空），仅适用于引用类型（如类实例、字符串、数组等），值类型（如 int、float）不能为 `null`（除非使用可空值类型 `int?` 等）。
- **Lua 的 `nil`**：表示变量未定义或没有有效值，是 Lua 中唯一的 “空” 值，可用于任何变量。

在 Lua 调用 C# 时，绑定框架通常会做如下映射：

- C# 中的 `null` 传递到 Lua 中，会被转换为 Lua 的 `nil`。
- Lua 中的 `nil` 传递到 C# 中，会被转换为 C# 的 `null`（仅对引用类型有效）。

```C#
public class NullTest {
    public string GetNullString() {
        return null;  // 返回 C# null
    }
    
    public void CheckNull(object obj) {
        if (obj == null) {
            Debug.Log("C# 接收：obj 是 null");
        } else {
            Debug.Log("C# 接收：obj 不是 null");
        }
    }
}
```

```lua
local test = CS.NullTest()

-- 1. C# null 转换为 Lua nil
local str = test:GetNullString()
print(str == nil)  -- 输出：true（C# null → Lua nil）

-- 2. Lua nil 转换为 C# null
test:CheckNull(nil)  -- 输出："C# 接收：obj 是 null"（Lua nil → C# null）
```

### lua使用C#协程

```lua
util = require("xlua.util")  --加载 XLua 的工具模块，提供了 cs_generator函数，用于将 Lua 函数包装成 C# 协程可识别的格式
GameObject = CS.UnityEngine.GameObject
WaitForSeconds = CS.UnityEngine.WaitForSeconds

local obj = GameObject("Coroutine")  --创建GameObject物体
local mono = obj:AddComponent(typeof(CS.test))  --因为协程是Mono类中自带，所以为这个物体添加一个带Mono类的脚本，这样就可以使用协程

local function countingCoroutine()  --函数
    local a = 1
    while true do
        coroutine.yield(WaitForSeconds(1))
        print("计数:", a)
        a = a + 1
    end
end

local coroutineFunc = util.cs_generator(countingCoroutine)  --启用协程
mono:StartCoroutine(coroutineFunc)
```

### lua使用C#泛型函数

```C#
using System;
using System.Collections.Generic;

// 泛型类
public class GenericClass<T>
{
    private T _value;
    
    // 泛型构造函数
    public GenericClass(T value)
    {
        _value = value;
    }
    
    // 泛型方法（返回值和参数均为泛型）
    public T GetValue()
    {
        return _value;
    }
    
    public void SetValue(T newValue)
    {
        _value = newValue;
    }
    
    // 多参数泛型方法
    public TResult Combine<TResult>(Func<T, TResult> converter)
    {
        return converter(_value);
    }
}

// 包含泛型静态方法的非泛型类
public class GenericMethodHolder
{
    // 基础泛型静态方法
    public static T GetDefault<T>()
    {
        return default(T);
    }
    
    // 带约束的泛型方法
    public static T Max<T>(T a, T b) where T : IComparable<T>
    {
        return a.CompareTo(b) >= 0 ? a : b;
    }
    
    // 泛型集合方法
    public static List<T> CreateList<T>(params T[] items)
    {
        return new List<T>(items);
    }
}

```



```lua
-- 1. 实例化泛型类（需指定具体类型参数）
-- 方式：通过框架提供的泛型实例化语法（不同框架可能有差异）
local intObj = CS.GenericClass(123)  -- XLua自动推断为GenericClass<int>
local strObj = CS.GenericClass("hello")  -- 自动推断为GenericClass<string>

-- 2. 调用泛型类的方法
print(intObj:GetValue())  -- 输出：123（int类型）
print(strObj:GetValue())  -- 输出：hello（string类型）

intObj:SetValue(456)
print(intObj:GetValue())  -- 输出：456

-- 3. 调用带泛型参数的方法（需显式指定类型参数）
-- 将int转换为string（Combine<TResult>）
local numStr = intObj:Combine(CS.System.Func_int_string(
    function(num) return CS.System.String.Format("Number: {0}", num) end
))
print(numStr)  -- 输出：Number: 456

-- 4. 调用泛型静态方法
-- 获取默认值（GetDefault<T>）
local defaultInt = CS.GenericMethodHolder.GetDefault(CS.System.Int32)  -- 指定int类型
local defaultStr = CS.GenericMethodHolder.GetDefault(CS.System.String)  -- 指定string类型
print(defaultInt)  -- 输出：0（int默认值）
print(defaultStr == nil)  -- 输出：true（string默认值为null，转换为Lua的nil）

-- 5. 调用带约束的泛型方法（Max<T>）
local maxInt = CS.GenericMethodHolder.Max(10, 20)  -- 自动推断int类型
local maxStr = CS.GenericMethodHolder.Max("apple", "banana")  -- 自动推断string类型
print(maxInt)  -- 输出：20
print(maxStr)  -- 输出：banana

-- 6. 处理泛型集合（List<T>）
local intList = CS.GenericMethodHolder.CreateList(1, 2, 3, 4)  -- 自动推断List<int>
print("List count: " .. intList.Count)  -- 输出：List count: 4

-- 遍历泛型集合
for i = 0, intList.Count - 1 do
    print("Item " .. i .. ": " .. intList[i])
end

```



# xlua背包实践

# ILRuntime

# YooAsset HybridClr

### 热更新流程

- 发现Bug并且修改Bug
- 资源打Ab包上传，代码使用热更方案上传
- 玩家启动游戏检测是否需要更新
- 下载补丁包
- 检测是否更新成功（例如通过MD5校验）

- 进入游戏

### AOT

AOT是一种编译方式,也称为提前编译或静态编译。在AOT编译中,源代码在程序运行之前就被编译成机器码。这种编译方式的好处是，由于编译过程在程序运行前已经完成，因此程序在运行时可以更快地启动，并且不需要占用额外的运行时资源来进行编痒。然而，AOT编译的一个主要缺点是，由于它无法接触到程序运行时的信息，因此可能无法生成最优化的代码。

### JIT

- JIT,即Just-In-TimeCompilation(即时编译）,是一种在程序运行时,将中间代码(如字节码)转换为特定平台的机器码并执行的技术，这种技术允许程序在运行时根据需要生成和执行代码，从而提高程序的灵活性和性能。
- 然而,iOS系统禁止了JIT的编译方式。iOS之所以禁止JIT,主要是出于安全和稳定性的考虑。具体来说,实现JIT的一个基本要求是平台允许修改内存页面的访问权限，使得进程可以执行自己的数据段。但IOS系统封存了内存的可执行权限，变相地封锁了IT编译方式，即机器码被禁止映射到内存。这样的设计可以防止应用程序动态生成和执行任意代码，从而降低被恶意代码攻击的风险。

### RunTime

### Mono

### IL2CPP

