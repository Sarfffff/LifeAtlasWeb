---
title: Unity
date: 2026-06-27 03:42:00
categories:
  - 图形与引擎
tags:
  - GameEngineStudy
  - 笔记
---
## 生命周期

1）游戏对象生命周期
       游戏对象的生命周期主要有这几个状态：创建、激活、禁用和销毁。游戏对象的状态直接影响挂载在其上的脚本的生命周期和函数调用。

①创建：游戏对象被创建时，它的所有组件（包括脚本）都会被初始化，但这时脚本的生命周期方法尚未被调用。

②激活：当游戏对象被激活时，脚本的生命周期方法开始生效。如果游戏对象在场景中被激活或设置为启用状态，那么挂载在该对象上的所有脚本附加的脚本会按顺序调用OnEnable()、Start()等生命周期函数。

③禁用：当游戏对象被禁用时，游戏对象及所有挂载的脚本会停止调用生命周期函数，直到它再次被启用。

④销毁：当游戏对象被销毁时，它和所有附加的组件（包括脚本）都会被清理，相关的生命周期方法会被调用来处理清理工作。

2）脚本生命周期
       只有继承了MonoBehavior的脚本才可挂载到游戏对象上，这样的脚本才有生命周期。脚本的生命周期与游戏对象的状态密切相关，但脚本的生命周期函数会按照固定顺序执行，即该脚本从创建到销毁的各个阶段，这就是我们说的Unity的生命周期。

## Unity生命周期的主要阶段及各个阶段常用的生命周期函数

​       主要有四个阶段：初始化阶段->更新阶段->渲染阶段->销毁阶段，下面的讲述的顺序也是生命周期函数的执行顺序 -Awake()-Enable()-Start()-Update()-LateUpdate()-。

1）初始化阶段
①Awake()：
       在脚本实例被加载时调用，用于初始化变量或设置对象的初始状态,实例化对象立即调用（Instantiate）这是在游戏对象启用之前调用的。注意：在脚本整个生命周期内它仅被调用一次，且每个游戏物体上的Awke以随机的顺序被调用，Awake总是在Start之前被调用。

```c#
using UnityEngine;

public class Test01 : MonoBehaviour
{
    private void Awake()
    {
        //在控制台打印
        Debug.Log("Awake()函数被调用！");
    }

```

②OnEnable()：
       当脚本或对象被激活时调用，用于处理对象激活时的逻辑。同理，进行如下测试。

```c#
using UnityEngine;

public class Test01 : MonoBehaviour
{
    private void OnEnable()
    {
        Debug.Log("OnEnable()函数被调用！");
    }
}
```

③Start()：
       在所有Awake()方法调用完成后并且所有游戏对象已启用时调用，用于脚本的初始设置和游戏逻辑初始化。在第一个Update发生之前调用一次。同理，进行如下测试。

```c#
using UnityEngine;

public class Test01 : MonoBehaviour
{
    private void Start()
    {
        Debug.Log("Start()函数被调用!");
    }
}
```

2）更新阶段：

①FixedUpdate()：
       每固定时间间隔调用一次，通常是0.02s，用于处理物理计算。如处理力，给游戏对象加上刚体（Rigidbody）组件后，通过刚体给物体加一个作用力时，必须在FixedUpdate里的固定帧执行，而不是Update中的帧，两者帧长不同，每帧应用一个力到刚体上。如果没有刚体（Rigidbody）组件，对象将不会受到物理引擎的影响，也就无法参与物理模拟和力的应用，所以需要给游戏对象添加刚体，但没加刚体组件的物体可以通过碰撞检测（Collider）来触发事件。

```c#
using UnityEngine;

public class FixedUpdateTest : MonoBehaviour
{
    public new Rigidbody rigidbody;
    

    private void FixedUpdate()
    {
        rigidbody.AddForce(Vector3.up);
    }

}
```

②Update()：
       每帧调用一次，用于常规的游戏逻辑处理，如输入检测和对象移动。同理，新建一个三维物体，挂载脚本进行测试。

```c#
using UnityEngine;

public class UpdateTest : MonoBehaviour
{
    //Unity中脚本的成员访问权限不写，默认是private
    void Update()
    {
        transform.position += new Vector3(Time.deltaTime * 1.2f, 0,0);
    }
}
```

③LateUpdate()：
       在所有Update()方法之后调用，用于在所有对象更新后处理逻辑，如当物体在Update里移动时，跟随物体的相机可以在此处实现。

```c#
using UnityEngine;

public class UpdateTest : MonoBehaviour
{
    //Unity中脚本的成员访问权限不写，默认是private
    void Update()
    {
        transform.position += new Vector3(Time.deltaTime * 1.2f, 0,0);
    }

    private void LateUpdate()
    {
        Camera.main.transform.position = transform.position+ new Vector3(0, 0.7f, -1.5f);
    }

}
```

3）渲染阶段：
OnGUI()：
       主要用于绘制即时用户界面元素和调试信息，适用于创建和管理GUI界面，如绘制一个按钮。该方法用于旧输入系统，而本项目使用的是新的输入系统，可以查看到。

4）销毁阶段：
①OnApplicationQuit()：
       当应用程序退出时调用，用于清理代码、保存数据或执行其他在退出时需要完成的操作。同理，进行如下测试。

```c#
using UnityEngine;

public class Test01 : MonoBehaviour
{
    private void OnApplicationQuit()
    {
        Debug.Log("OnApplicationQuit()函数被调用!");
    }

}
```

②OnDisable()：
       当场景或游戏结束，或者停止播放模式和终止应用程序，用于清理操作或停止处理。同理，进行如下测试。

```c#
using UnityEngine;

public class Test01 : MonoBehaviour
{
    private void OnDisable()
    {
        Debug.Log("OnDisable()函数被调用!");
    }


```

③OnDestroy()：
       当游戏对象被销毁时调用，场景和游戏结束，停止播放模式，网页视图关闭，用于释放资源或执行清理操作。同理，进行如下测试，将之前所有测试的生命周期函数加上，可以看到控制台打印的语句顺序，就是生命周期函数执行的顺序。



```c#
using UnityEngine;

public class Test01 : MonoBehaviour
{
    private void Awake()
    {
        //在控制台打印
        Debug.Log("Awake()函数被调用!");
    }
private void OnEnable()
{
    Debug.Log("OnEnable()函数被调用!");
}
 
private void Start()
{
    Debug.Log("Start()函数被调用!");
}
 
private void OnApplicationQuit()
{
    Debug.Log("OnApplicationQuit()函数被调用!");
}
 
private void OnDisable()
{
    Debug.Log("OnDisable()函数被调用!");
}
 
private void OnDestroy()
{
    Debug.Log("OnDestroy()函数被调用!");
}
```

3.其他
       在更新阶段的FixedUpdate()和Update ()函数间还有如下生命周期函数会调用

1）OnTriggerXXX(Collider other)：触发检测
       通常一起使用。

①void OnTriggerEnter (Collider other)：
       进入触发器，当Collider(碰撞体)进入trigger(触发器)时调用。

②void OnTriggerStay (Collider other)：
       逗留触发器，当碰撞体接触触发器时，OnTriggerStay将在每一帧被调用。

③void OnTriggerExit(Collider other)：
       退出触发器，当Collider(碰撞体)停止触发trigger(触发器)时调用。

2）OnCollisionXXX (Collision collisionInfo)：碰撞检测
①void OnCollisionEnter(Collision collisionInfo)：
       进入碰撞，当此collider/rigidbody触发另一个rigidbody/collider时，OnCollisionEnter将会在开始碰撞时调用。

②void OnCollisionStay(Collision collisionInfo)：
       逗留碰撞，当此collider/rigidbody触发另一个rigidbody/collider时，OnCollisionStay将会在每一帧被调用。

③void OnCollisionExit (Collision collisionInfo)：
       退出碰撞，当此collider/rigidbody停止触发另一个rigidbody/collider时，OnCollisionExit将被调用。

       Collision包含接触点，碰撞速度等细节，如果在函数中不使用碰撞信息，省略collisionInfo参数以避免不必要的运算.

3）OnMouseXXX()：鼠标交互
①void OnMouseEnter ()：
       鼠标进入，当鼠标进入到Collider(碰撞体)中时调用。

②void OnMouseDown ()：
       鼠标按下，当鼠标在Collider(碰撞体)上点击时调用。

③void OnMouseUp ()：
       鼠标弹起，当用户释放鼠标按钮时调用。OnMouseUp只调用在按下的同一物体上。此函数在iPhone上无效。

④void OnMouseExit ()：
       鼠标移出，当鼠标移出Collider(碰撞体)上时调用。

⑤void OnMouseOver ()：
       鼠标悬浮，当鼠标悬浮在Collider(碰撞体)上时调用。

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class test : MonoBehaviour
{
    private void Awake()//最开始的调用
    {
        Debug.Log("awake");
    }
    private void OnEnable()
    {
        Debug.Log("OnEnable");
    }
    // Start is called before the first frame update
    void Start()
    {
        Debug.Log("Unity 脚本入口 , 启动加载时调用");
    }

    // Update is called once per frame
    void Update()//每一帧会调用一次
    {
        
    }
    private void LateUpdate()//紧跟着update执行
    {
        
    }
    private void FixedUpdate()//每个固定桢上就调用
    {
        
    }
    private void OnDisable()//非激活时调用该函数
    {
        
    }
    private void OnDestroy()//移除组件时被调用
    {
        
    }
}
```

Unity脚本的执行顺序**Awake ->OnEable-> Start ->-> FixedUpdate-> Update -> LateUpdate ->OnGUI ->Reset -> OnDisable ->OnDestroy**

## 预制体和变体

制作一个预制体

![在这里插入图片描述](/notes-assets/GameEngineStudy/.assets/42f91d524b1844e1dedc1835199ae023-17253329634693.gif)

在Unity中操作`预制体`的时候会出现下面这种情况：

有一个Assets工程中的`预制体A`，把`预制体A`拖到场景中之后，这个游戏对象还是蓝色形状的`预制体A`没错。但是当我把这个`预制体A`再拖拽到工程中想让他当做`预制体B`的时候，Unity会弹出一个窗口让我们选择

![img](/notes-assets/GameEngineStudy/.assets/3b0eeb6199dfaf551cdaf605211c8853.png)

* 选择Original(原始预制体)：这个游戏对象会成为一个新的预制体B，与原来的预制体A就断绝关系了！

* 选择Prefab Variant(预制体变体)：这个游戏对象也会变成一个`预制体A1`，不同的是这个`预制体A1`就相当于变成了原来预制体A的子类每当原来的预制体A发生变化的时候，这个`预制体A1`会跟随着进行变化！而且当我们修改`预制体A1`的属性的时候，原来的预制体A并不会发生了变化。就跟一个继承父类的子类一样，修改父类的公共属性的时候，子类也会跟随着变化，但是在子类做修改的时候，父类并不受影响
  

## Unity中的向量(Vector3)

**`Vector3`类是Unity常用类之一，通常用来表示`3D`向量和点，有时也可以用来表示欧拉旋转。`Vector3`使用给定的 x、y、z 分量创建新向量。**

***静态变量***

| back             | 用于编写 Vector3(0,0,-1)的简便方法。                         |
| ---------------- | ------------------------------------------------------------ |
| down             | 用于编写 Vector3(0,-1,0) 的简便方法。                        |
| forward          | 用于编写 Vector3(0,0,1)的简便方法。                          |
| left             | 用于编写 Vector3(-1,0,0) 的简便方法。                        |
| negativelnfinity | 用于编写 Vector3(foat.Negativelnfinity, foat.NegativeInfinity, foat.Negativelnfinity) 的简便方法 |
| one              | 用于编写 Vector3(1,1,1)的简便方法                            |
| positivelnfinity | 用于编写 Vector3(foat.Positivelnfinity, foat.Positivelnfinity, float.Positivelnfinity) 的简使方法 |
| right            | 用于编写 Vector3(1.0,0)的简便方法。                          |
| yp               | 用于编写 Vector3(0,1,0)的简便方法。                          |
| zero             | 用于编写 Vector3(0,0,0) 的简便方法,                          |

***变量***

| **变量名**   | **作用**                                   |
| ------------ | ------------------------------------------ |
| magnitude    | 返回该向量的长度。（只读）                 |
| normalized   | 返回 magnitude 为 1 时的该向量。（只读）   |
| sqrMagnitude | 返回该向量的平方长度。（只读）             |
| this[int]    | 分别使用 [0]、[1]、[2] 访问 x、y、z 分量。 |
| x            | 向量的 X 分量。                            |
| y            | 向量的 Y 分量。                            |
| z            | 向量的 Z 分量。                            |



```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class vector : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        //向量，坐标，旋转，缩放
        Vector3 v = new Vector3(1, 1, 0.5f);
        v = Vector3.zero;
        v = Vector3.one;

        Vector3 v2 = Vector3.forward;

        //计算两个向量夹角
        Debug.Log(Vector3.Angle(v, v2));
        //计算两点之间的距离
        Debug.Log(Vector3.Distance(v, v2));
        //点乘
        Debug.Log(Vector3.Dot(v, v2));
        //叉乘
        Debug.Log(Vector3.Cross(v, v2));
        //插值
        Debug.Log(Vector3.Lerp(Vector3.zero, Vector3.one, 0.8f));
        //向量的模
        Debug.Log(v.magnitude);
        //规范化向量
        Debug.Log(v.normalized);

    }

    // Update is called once per frame
    void Update()
    {
        
    }
}

```

```c#
//旋转: 欧拉角，四元数
Vector3 rotate = new Vector3(0,30, 0);
Quaternion guaternion = Quaternion.identity;
//欧拉角转为四元数
quaternion = Quaternion.Euler(rotate);
//四元数转为欧拉角
rotate = quaternion.eulerAngles,
//看向一个物体
guaternion = Quaternion.LookRotation(new Vector3(0, 0, 0));
```

## 欧拉角和四元数

### **1.欧拉角（Euler Angles）**

**定义**：

用三个绕坐标轴的连续旋转角度表示方向，常见顺序如`ZYX`（偏航-俯仰-滚转，即`Yaw-Pitch-Roll`）。

**优点**：

- **直观**：直接对应人类理解的“上下、左右、倾斜”旋转。
- **存储高效**：仅需3个浮点数。

**缺点**：

- **万向节死锁（Gimbal Lock）**：当俯仰角为±90°时，失去一个自由度，导致旋转不连续。
- **插值困难**：直接插值可能导致非平滑运动。
- **顺序依赖**：不同旋转顺序（如XYZ vs. ZYX）结果不同。

**应用场景**：

摄像机控制、飞行器姿态显示等需要直观理解的场景。

------

### **2. 四元数（Quaternion）**

**定义**：

复数扩展形式，表示为 `q = w + xi + yj + zk`（其中`w`为实部，`(x,y,z)`为虚部），满足 `i² = j² = k² = ijk = -1`。

**优点**：

- **无万向节死锁**：避免欧拉角的奇异性问题。
- **平滑插值**：可通过球面线性插值（Slerp）实现自然过渡。
- **计算高效**：组合旋转只需乘法，无需矩阵运算。

**缺点**：

- **不直观**：四元数的几何意义难以直接理解。
- **存储稍大**：需4个浮点数（但比旋转矩阵的9个更高效）。

**应用场景**：

3D动画、机器人控制、VR/AR等需要复杂旋转计算的领域。

|          **方法**           |         **作用**         |                  **示例**                  |
| :-------------------------: | :----------------------: | :----------------------------------------: |
|    `Quaternion.Euler()`     |      欧拉角→四元数       |        `Quaternion.Euler(0, 90, 0)`        |
|    `Quaternion.Slerp()`     | 平滑插值（如摄像机跟踪） |        `Quaternion.Slerp(a, b, t)`         |
| `Quaternion.LookRotation()` |    使物体朝向指定方向    | `Quaternion.LookRotation(Vector3.forward)` |
|  `Quaternion.AngleAxis()`   |   绕指定轴旋转指定角度   |   `Quaternion.AngleAxis(90, Vector3.up)`   |

------

### **关键对比**

|    **特性**    |     **欧拉角**     |   **四元数**   |
| :------------: | :----------------: | :------------: |
|   **直观性**   |         高         |       低       |
|   **自由度**   |  可能丢失（死锁）  |     无奇点     |
|    **插值**    |   线性插值不自然   |   Slerp平滑    |
| **计算复杂度** | 中等（需矩阵转换） | 高效（仅乘法） |
|  **存储空间**  |       3个值        |     4个值      |

------

### **转换与选择建议**

- **欧拉角 → 四元数**：通过绕各轴旋转的四元数乘法合成。
- **四元数 → 欧拉角**：需解算三角函数，可能丢失精度。
- **何时使用**：
  - **欧拉角**：需要人工输入或显示时（如UI界面）。
  - **四元数**：需复杂旋转计算或避免死锁时（如动画、游戏引擎）。

```C#
// 设置欧拉角旋转（不推荐直接修改eulerAngles）
transform.eulerAngles = new Vector3(30f, 60f, 90f); 
// 推荐通过Quaternion.Euler转换
transform.rotation = Quaternion.Euler(30f, 60f, 90f); [2,7](@ref)

//Quaternion q =  Quaternion.AngleAxis(20,Vector3.up); 
// 平滑转向目标物体
Vector3 dir = target.position - transform.position;
Quaternion targetRot = Quaternion.LookRotation(dir);//
transform.rotation = Quaternion.Slerp(transform.rotation, targetRot, speed * Time.deltaTime); [1,6](@ref)//本物品位置，目标位置，旋转速度
```

## Application类

```c#
     //游戏数据文件夹路径（只读，加密）
     Debug.Log(Application.dataPath + "/新建文本文档");
     //持久化文件夹路径
     Debug.Log(Application.persistentDataPath);
     //StreamingAssets文件夹路径(只读，配置文件，不加密)
     Debug.Log(Application.streamingAssetsPath);
     //临时文件夹
     Debug.Log(Application.temporaryCachePath);
     //控制台是否在后台运行 
     Debug.Log(Application.runInBackground);
     //打开url_
     Application.OpenURL("");
     //退出游戏
     Application.Quit();
```

## 场景类和场景管理类	

在Unity中，`Scene`类是用来表示和操作场景的一个类。场景是Unity项目的基本构建块，每个场景都包含一组游戏对象、光源、相机和其他内容。通过`Scene`类和相关的`SceneManager`类，你可以加载、卸载和管理场景。

### 场景类

`	Scene`类本身提供了一些关于场景的信息，但许多操作是通过`SceneManager`类来完成的。以下是一些与`Scene`类相关的属性和方法：

属性
Scene.name: 场景的名称。
Scene.path: 场景的路径。
Scene.isLoaded: 场景是否已加载。
Scene.buildIndex: 场景的构建索引。
Scene.rootCount: 场景中根游戏对象的数量。
Scene.isDirty: 场景是否被修改但未保存。
Scene.isSubScene: 场景是否为子场景。
方法
Scene.GetRootGameObjects(): 返回场景中所有根游戏对象的数组。
Scene.IsValid(): 检查场景是否有效。

### 场景管理类

SceneManager类提供了一些用于加载、卸载和管理场景的方法。以下是一些常用的方法：
卸载场景
获取和设置场景
加载场景
`SceneManager.LoadScene(string sceneName):` 同步加载指定名称的场景。
`SceneManager.LoadScene(int sceneBuildIndex):` 同步加载指定构建索引的场景。
`SceneManager.LoadScene(string sceneName, LoadSceneMode mode):` 使用指定的加载模式加载场景（`LoadSceneMode.Single 或 LoadSceneMode.Additive）`。
`SceneManager.LoadSceneAsync(string sceneName):` 异步加载指定名称的场景。
`SceneManager.LoadSceneAsync(int sceneBuildIndex):` 异步加载指定构建索引的场景。
`SceneManager.LoadSceneAsync(string sceneName, LoadSceneMode mode)`: 使用指定的加载模式异步加载场景。
`SceneManager.UnloadSceneAsync(string sceneName)`: 异步卸载指定名称的场景。
`SceneManager.UnloadSceneAsync(int sceneBuildIndex)`: 异步卸载指定构建索引的场景。
`SceneManager.UnloadSceneAsync(Scene scene)`: 异步卸载指定的场景对象。
`SceneManager.GetActiveScene()`: 获取当前激活的场景。
`SceneManager.SetActiveScene(Scene scene)`: 设置指定场景为激活场景。
`SceneManager.GetSceneByName(string name)`: 根据名称获取场景。
`SceneManager.GetSceneByBuildIndex(int buildIndex)`: 根据构建索引获取场景。
`SceneManager.GetSceneAt(int index)`: 获取场景列表中指定索引处的场景。

```c#
    //两个类，场景类，场景管理类

    //场景跳转
    SceneManager.LoadScene("MyScene");
    //获取当前场景
    Scene scene = SceneManager.GetActiveScene();    
    //场景名称
    Debug.Log(scene.name);
    //场景是否已经加载
    Debug.Log(scene.isLoaded);
    //场景路径
    Debug.Log(scene.path);
    //场景索引
    Debug.Log(scene.buildIndex);
    GameObject[] gos = scene.GetRootGameObjects();
    Debug.Log(gos.Length);

    //场景管理类
    //创建新场景
    Scene newScene = SceneManager.CreateScene("newScene");
    //已加载场景个数
    Debug.Log(SceneManager.sceneCount);
    //卸载场景
    SceneManager.UnloadSceneAsync(newScene);
    //加载场景
    SceneManager.LoadScene("MyScene", LoadSceneMode.Additive);
```

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class test : MonoBehaviour
{
    public GameObject Cube;
    public GameObject Prefab;
    // Start is called before the first frame update
    void Start()
    {
        // 拿到当前脚本所挂载的游戏物体
        GameObject go = this.gameObject;
        //名称
        Debug.Log(gameObject.name);
        //tag
        Debug.Log(gameObject.tag);
        //layer
        Debug.Log(gameObject.layer);
        //立方体的名称
        Debug.Log(Cube.name);
        //当前真正的激活状态
        Debug.Log(Cube.activeInHierarchy);
        //当前自身激活状态
        Debug.Log(Cube.activeSelf);
        // Transform组件
        //Transform trans = this.transform,
        Debug.Log(transform.position);
        //获取其他组件
       // BoxCollider bc = GetComponent<BoxCollider>();
        //获取当前物体的子物体身上的某个组件
       // GetComponentInChildren<CapsuleCollider>(bc);
        //获取当前物体的父物体身上的某个组件
        GetComponentInParent<BoxCollider>();
        //添加一个组件
        Cube.AddComponent<AudioSource>();
        //通过游戏物体的名称获取游戏物体
        GameObject test = GameObject.Find("Test");
        Debug.Log(test.name);
        //通过游戏物体的标签获取游戏物体
        test = GameObject.FindWithTag("Enemy");
        Debug.Log(test.name);
        //通过预设体来实例化一个游戏对象
        Instantiate(Prefab,transform);
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}

```

```c#
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using UnityEngine;

public class NewBehaviourScript : MonoBehaviour
{
    float timer = 0;
    // Start is called before the first frame update
    void Start()
    {
        //游戏开始到现在所花的时间
        Debug.Log(Time.time);
        //时间缩放指
        Debug.Log(Time.timeScale);
        //固定时间间隔
        Debug.Log(Time.fixedDeltaTime);
    }

    // Update is called once per frame
    void Update()
    {

        //上一帧到这一帧所用的时间   60帧   1s/60
        //Debug.Log(Time.deltaTime);
        timer += Time.deltaTime;  //用做计时器
        if (timer > 3)
        {
            Debug.Log("大于3s了");
        }
    }
}

```

## TransForm(旋转，缩放，位置)

```c#
/*Transform 组件的作用
    定位：Transform组件能够明确游戏对象在三维空间里的具体位置，借助position属性来设定和获取位置信息。
    旋转：它可以规定游戏对象的旋转状态，使用rotation属性来设定和获取旋转角度。
    缩放：Transform组件能够调整游戏对象的大小，通过localScale属性来设定和获取缩放比例。
    层级关系：Transform组件能够确立游戏对象之间的父子关系，进而构建出层级结构。子对象会跟随父对象的移动、旋转和缩放而变化。
在脚本中的作用
    在脚本里，Transform组件是极为常用的组件，你能够借助它来实现各种效果。以下是一些常见的应用场景：
    移动游戏对象：通过修改position属性来实现游戏对象的移动。
    旋转游戏对象：通过修改rotation属性来实现游戏对象的旋转。
    缩放游戏对象：通过修改localScale属性来实现游戏对象的缩放。
    查找子对象：使用Find方法可以查找子对象的Transform组件。
    获取父对象：使用parent属性可以获取父对象的Transform组件。
*/

//Transform 还可以控制父子关系
//获取当前位置
Debug.Log(transform.position);
//获取相对于父类的坐标
Debug.Log(transform.position);   
//获取世界坐标
Debug.Log(transform.localPosition);
//获取旋转
Debug.Log(transform.rotation);
Debug.Log(transform.localRotation);
//获取缩放
Debug.Log(transform.localScale);

//获取父物体
Debug.Log(transform.parent.gameObject);
//某个方向选转
transform.Rotate(Vector3.up, 1);//旋转方向 以及按帧旋转的速度
 //按某个物体旋转
        transform.RotateAround(Vector3.zero, Vector3.up, 1);//围绕旋转的物体，旋转的坐标轴，速度


```

## 键鼠控制

```c#
//左键0，右键1，滚轮2
if(Input.GetKeyDown(KeyCode.Mouse0))  //鼠标的点击
if(Input.GetKey(KeyCode.Mouse0)) //持续按住鼠标
if(Input.GetKeyUp(KeyCode.Mouse0))  //抬起鼠标
    
if(Input.GetMouseButtonDown(0))//鼠标的点击
if(Input.GetMouseButton(0))//持续按住鼠标
if(Input.GetMouseButtonUp(0))//抬起鼠标
    
//上下的语句表达是一样的
    
if(Input.GetKeyDown(KeyCode.Escape))//按下空格
if(Input.GetKeyDown(KeyCode.A))//按下A 
 
 //获取水平轴
float horizontal = Input.GetAxis("Horizontal");
float vertcial = Input.GetAxis("Vertical");
    
    
 //虚拟按键  Jump虚拟按键等于空格
 if (Input.GetButton("Jump")) { 
     Debug.Log("2");
 }
 if (Input.GetButtonDown("Jump"))
 {
     Debug.Log("2");
 }
 if (Input.GetButtonUp("Jump"))
 {
     Debug.Log("2");
 }
```

## 屏幕控制

手机和平板用户通过触摸控制

```c#
    void Start()
    {
        //开启多点触摸
        Input.multiTouchEnabled = true;
    }

    // Update is called once per frame
    void Update()
    {
        //判断是否为单点触摸
        if (Input.touchCount == 1)
        {
            //触摸对象
            Touch touch = Input.touches[0];
            //触摸位置
            Debug.Log(touch.position);
            //触摸阶段
            switch (touch.phase) {
                case TouchPhase.Began:
                    break;
                case TouchPhase.Moved:
                    break;
                case TouchPhase.Stationary:
                    break;
                case TouchPhase.Ended:
                    break;
                case TouchPhase.Canceled:
                    break;
            
            }

        }
        if(Input.touchCount ==2){//h
			Touch touch = Input.touches[0];
        	Touch touch1 = Input.touches[1];
        }

    }
```

## 音效和声音

**方法一：在 Inspector 面板中设置并播放音乐**

1. 创建空对象
   - 在 Hierarchy 面板中右键点击，选择 `Create Empty` 来创建一个空的 GameObject。
2. 添加 Audio Source 组件
   - 选中创建的空对象，在 Inspector 面板中点击 `Add Component`，搜索并添加 `Audio Source` 组件。
3. 设置 Audio Clip
   - 将准备好的音频文件（`Audio Clip`）从 Project 面板拖到 `Audio Source` 组件的 `Audio Clip` 字段。
4. 配置播放选项
   - **Play On Awake**：勾选该选项，游戏开始时音乐将自动播放；不勾选则需通过脚本控制播放。
   - **Loop**：勾选该选项可使音乐循环播放。
5. 运行游戏
   - 点击 Unity 编辑器的播放按钮，若 `Play On Awake` 已勾选，音乐将自动播放。

**方法二：通过脚本控制音乐播放**

1. 创建脚本
   - 在 Project 面板中右键点击，选择 `Create` -> `C# Script`，创建一个新脚本（如命名为 `MusicPlayer`）。
2. **编写脚本代码**

```csharp
using UnityEngine;

public class MusicPlayer : MonoBehaviour
{
    public AudioClip music;  // 用于指定要播放的音频
    private AudioSource audioSource;   //播放器组件

    void Start()
    {
        // 获取 Audio Source 组件
        audioSource = gameObject.AddComponent<AudioSource>();
        // 设置要播放的音频剪辑
        audioSource.clip = music;
        // 设置音乐循环播放
        audioSource.loop = true;
        //音量
        audioSource.volume = 0.5f； 
        // 播放音乐
        audioSource.Play();
    }
    void Update()
  	{
      //按下空格键切换声音的播放和暂停
      if (Input.GetKeyDown(KeyCode.Escape))
      {
          //如果当前正在播放
          if (audioSource.isPlaying)
          {
              //停止播放
              audioSource.Pause();
              //audioSource.Stop();
          }
          else
          {
              //继续播放
              audioSource.UnPause();
              //pause 与unpause  stop与play
              audioSource.Play();
          }
      }
  }
}
```

1. 挂载脚本
   - 将编写好的脚本挂载到一个 GameObject 上（可使用之前创建的空对象）。
2. 设置 Audio Clip
   - 在 Inspector 面板中，把准备好的音频文件（`Audio Clip`）拖到脚本的 `Music Clip` 字段。
3. 运行游戏
   - 点击播放按钮，音乐将开始播放。

**方法三：动态切换音乐**

有时需要在游戏运行过程中动态切换音乐

```csharp
using UnityEngine;

public class DynamicMusicPlayer : MonoBehaviour
{
    public AudioClip[] musicClips;  // 存储多个音频剪辑
    private AudioSource audioSource;
    private int currentClipIndex = 0;

    void Start()
    {
        audioSource = gameObject.AddComponent<AudioSource>();
        PlayCurrentMusic();
    }

    void PlayCurrentMusic()
```

## 视频

**方法一：在 Inspector 面板中设置并播放视频**

1. **创建 Video Player 对象** 在 Hierarchy 面板中右键点击，选择 `GameObject` -> `Video` -> `Video Player`，创建一个 `Video Player` 对象。

2. **设置视频源**

   选中创建的 `Video Player` 对象，在 Inspector 面板中找到 `Video Player` 组件。

   - 在 `Source` 选项中选择 `Video Clip`。
   - 将准备好的视频文件（支持的格式如 `.mp4`、`.mov` 等）从 Project 面板拖到 `Video Clip` 字段。

3. **配置渲染模式**

    在 `Render Mode` 选项中选择合适的渲染模式，例如：

   - **Render Texture**：将视频渲染到一个 `Render Texture` 上，可用于将视频显示在游戏对象的材质上。需要先创建一个 `Render Texture` 对象，然后将其赋值给 `Render Texture` 选项。
   - **Camera Far Plane**：将视频渲染到相机的远平面上，视频会铺满整个相机视野。
   - **Camera Near Plane**：将视频渲染到相机的近平面上。
   - **Material Override**：将视频渲染到指定的材质上。需要创建一个材质，并将其赋值给 `Material Override` 选项。
   - **API Only**：仅通过代码来处理视频的渲染，不会自动显示在场景中。

4. **（可选）配置音频**

   如果视频包含音频，可在 `Video Player` 组件中配置音频输出。

   - 在 `Audio Output Mode` 选项中选择 `Audio Source`。
   - 点击 `Audio Source` 字段后面的 `Create` 按钮创建一个新的 `Audio Source` 对象，或者选择已有的 `Audio Source` 对象。

5. **运行游戏** 点击 Unity 编辑器的播放按钮，视频将开始播放。

   

**方法二：通过脚本控制视频播放**

1. **创建脚本** 在 Project 面板中右键点击，选择 `Create` -> `C# Script`，创建一个新脚本（如命名为 `VideoPlayerController`）。
2. **编写脚本代码**

```csharp
using UnityEngine;
using UnityEngine.Video;

public class VideoPlayerController : MonoBehaviour
{
    public VideoPlayer videoPlayer;
    public VideoClip videoClip;

    void Start()
    {
        // 获取 Video Player 组件
        videoPlayer = gameObject.GetComponent<VideoPlayer>();
        // 设置要播放的视频剪辑
        videoPlayer.clip = videoClip;
        // 播放视频
        videoPlayer.Play();
    }
}
```



1. **挂载脚本** 将编写好的脚本挂载到一个 GameObject 上（可使用之前创建的 `Video Player` 对象）。

2. **设置 Video Clip** 在 Inspector 面板中，把准备好的视频文件（Video Clip）拖到脚本的 `Video Clip` 字段。

3. **运行游戏** 点击播放按钮，视频将开始播放。

   

**方法三：动态切换视**创建脚本** 在 Project 面板中右键点击，选择 `Create` -> `C# Script`，创建一个新脚本（如命名为 `DynamicVideoPlayer`）。

1. **编写脚本代码**

```csharp
using UnityEngine;
using UnityEngine.Video;

public class DynamicVideoPlayer : MonoBehaviour
{
    public VideoPlayer videoPlayer;
    public VideoClip[] videoClips;  // 存储多个视频剪辑
    private int currentClipIndex = 0;

    void Start()
    {
        // 获取 Video Player 组件
        videoPlayer = gameObject.GetComponent<VideoPlayer>();
        PlayCurrentVideo();
    }

    void PlayCurrentVideo()
    {
        if (videoClips.Length > 0)
        {
            videoPlayer.clip = videoClips[currentClipIndex];
            videoPlayer.Play();
        }
    }

    // 切换到下一个视频
    public void PlayNextVideo()
    {
        currentClipIndex = (currentClipIndex + 1) % videoClips.Length;
        PlayCurrentVideo();
    }
}
```

1. **挂载脚本** 将编写好的脚本挂载到一个 GameObject 上（可使用之前创建的 `Video Player` 对象）。
2. **设置 Video Clips** 在 Inspector 面板中，把准备好的多个视频文件（Video Clip）拖到脚本的 `Video Clips` 数组字段。
3. **运行游戏** 点击播放按钮，视频将开始播放。可以在需要时调用 `PlayNextVideo` 方法来切换视频。

## 角色控制

1. **创建角色模型和场景** 首先，你需要将角色模型（可以是从外部 3D 建模软件导入的，如 Blender、Maya 等）放置到 Unity 场景中。确保模型的比例和位置合适，并且已经正确地添加了碰撞体（Collider）组件，用于碰撞检测。碰撞体组件的类型根据角色形状可以选择 Box Collider（用于长方体形状的碰撞区域）、Sphere Collider（用于球体形状）等
2. **添加角色控制器组件（可选）**如果是简单的人形或类似形状的角色，可以考虑添加 Character Controller 组件。这个组件提供了简单的碰撞处理和移动控制功能。它可以处理角色在场景中的移动，并且自动防止角色穿过碰撞体。例如，在一个第三人称视角的冒险游戏中，玩家角色就可以添加 Character Controller 组件来方便地控制其在地形和建筑物之间的移动。
3. **编写控制脚本** 控制脚本是实现角色控制的核心部分。在 Unity 中，通过 C# 脚本实现角色的各种行为控制。创建一个新的 C# 脚本（在 Project 视图中右键点击，选择 Create -> C# Script），并将其挂载到角色对象上。

```c#
private CharacterController player;    
void Start()
{
    player = GetComponent<CharacterController>();    
}
void Update()
{
//水平轴
   	float horizontal = Input.GetAxis("Horizontal");      //通过ad在水平轴上进行移动
//竖直轴
    float vertical = Input.GetAxis("Vertical");			 //通过ws在垂直上进行移动
    Vector3 dir = new Vector3(horizontal, 0, vertical);
    dir = transform.TransformDirection(dir);   //本地坐标系下的移动方向转换为世界坐标系下的方向。
    dir *= 5 * Time.deltaTime;
    transform.Translate(dir);
  	//transform.Translate(Vector3.forward * Time.deltaTime * horizontal * 5);
}
```

## 碰撞以及检测

在 Unity 中，碰撞及碰撞检测是非常重要的概念，常用于实现游戏中的交互逻辑，比如角色与道具的交互、敌人之间的攻击判定等。以下是关于 Unity 中碰撞以及碰撞检测的简要说明：

**1. 碰撞相关组件**

- **Collider（碰撞体）**
  - **作用**：用于定义物体的碰撞范围和形状，是实现碰撞检测的基础组件。
  - **类型**：常见的有 Box Collider（盒子碰撞体，适用于方形或矩形物体）、Sphere Collider（球形碰撞体，适用于球形物体）、Capsule Collider（胶囊碰撞体，适用于角色模型等）等。
  - **特点**：Collider 本身只是定义了碰撞范围，并不会使物体受到物理影响。例如，一个只有 Collider 的物体可以与其他物体发生碰撞检测，但不会因为碰撞而移动或产生物理效果。
- **Rigidbody（刚体）**
  - **作用**：用于使物体受到物理引擎的影响，如重力、力的作用等。当物体添加了 Rigidbody 组件后，它就可以参与物理模拟，例如在受到力的作用时会移动、旋转等。
  - **关系**：通常与 Collider 组件一起使用，只有同时具有 Collider 和 Rigidbody 的物体才能进行真实的物理碰撞（如碰撞后的反弹等）。例如，一个游戏中的小球，添加了 Sphere Collider 和 Rigidbody 后，就可以与其他物体发生真实的物理碰撞，并在碰撞后产生相应的物理效果。

**2. 碰撞检测的类型**

- **OnCollisionXXX 系列函数（碰撞检测）**
  - **OnCollisionEnter(Collision collisionInfo)**
    - **作用**：当此 Collider/Rigidbody 触发另一个 Rigidbody/Collider 时，OnCollisionEnter 将会在开始碰撞时调用。
    - **示例场景**：在一个打砖块游戏中，当球（带有 Collider 和 Rigidbody）撞击到砖块（带有 Collider）时，就会触发 OnCollisionEnter 函数，可以在该函数中编写逻辑来处理砖块的销毁等操作。
  - **OnCollisionStay(Collision collisionInfo)**
    - **作用**：当此 Collider/Rigidbody 触发另一个 Rigidbody/Collider 时，OnCollisionStay 将会在每一帧被调用。
    - **示例场景**：如果角色站在一个移动平台上（角色和平台都有 Collider 和 Rigidbody），可以在 OnCollisionStay 函数中处理角色跟随平台移动的逻辑。
  - **OnCollisionExit(Collision collisionInfo)**
    - **作用**：当此 Collider/Rigidbody 停止触发另一个 Rigidbody/Collider 时，OnCollisionExit 将被调用。
    - **示例场景**：当球离开某个特定区域（该区域有 Collider）时，可以在 OnCollisionExit 函数中执行相应的逻辑，比如记录球离开的次数等。
  - **注意**：Collision 包含接触点、碰撞速度等细节，如果在函数中不使用碰撞信息，可省略`collisionInfo`参数以避免不必要的运算。
- **OnTriggerXXX 系列函数（触发检测）**
  - **前提条件**：要使用 OnTriggerXXX 系列函数，至少有一个 Collider 需要将`IsTrigger`属性设置为`true`。当设置为触发器后，物体之间不会产生物理碰撞效果（如反弹等），而是用于检测物体是否进入、停留或离开某个区域。
  - OnTriggerEnter(Collider other)
    - **作用**：当 Collider (碰撞体) 进入 trigger (触发器) 时调用。
    - **示例场景**：在一个迷宫游戏中，当玩家进入某个特定的触发区域（该区域的 Collider 设置为触发器）时，可以触发一些事件，如开启一扇门等。
  - OnTriggerStay(Collider other)
    - **作用**：当碰撞体接触触发器时，OnTriggerStay 将在每一帧被调用。
    - **示例场景**：如果玩家站在一个特定的触发区域内（如魔法阵），可以在 OnTriggerStay 函数中持续执行一些效果，如给玩家增加护盾等。
  - OnTriggerExit(Collider other)
    - **作用**：当 Collider (碰撞体) 停止触发 trigger (触发器) 时调用。
    - **示例场景**：当玩家离开某个触发区域（如离开魔法阵）时，可以在 OnTriggerExit 函数中取消之前的效果，如移除玩家的护盾等。

## 射线检测

​		模拟从一个点沿着特定方向发射一条无限长或有限长的射线，并检测射线与场景中的物体是否相交。射线检测在很多场景中都有应用，比如实现点击物体交互、子弹射击检测、视线检测等。

#### 原理

​		射线检测的原理是从一个起始点沿着指定方向发射一条射线，当射线与场景中的碰撞体（Collider）相交时，就会返回相交的信息，如相交点的位置、相交的物体等。

```c#
//创建射线
Ray ray = Camera.main.ScreePointToRay(Input.mousePosition);

//射线检测
bool Physics.Raycast(Ray ray,out RaycastHit hitInfo,float maxDistance,int layerMask);
    /*ray：要发射的射线。
    hitInfo：用于存储射线检测结果的RaycastHit结构体。
    maxDistance：射线的最大检测距离。
    layerMask：用于过滤检测的图层。*/

//处理检测结果  如果射线检测成功（返回true），可以通过hitInfo结构体获取相交的信息，如相交的物体、相交点的位置等。
if (Physics.Raycast(ray, out RaycastHit hitInfo, Mathf.Infinity))
{
    // 射线检测成功，获取相交的物体
    GameObject hitObject = hitInfo.collider.gameObject;//获取射线检测的物体
    Debug.Log("射线击中物体：" + hitObject.name);
}
```

```c#
using UnityEngine;

public class RaycastExample : MonoBehaviour
{
    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            // 从相机位置向鼠标点击位置发射射线
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);

            // 进行射线检测
            if (Physics.Raycast(ray, out RaycastHit hitInfo, Mathf.Infinity))
            {
                // 射线检测成功，获取相交的物体
                GameObject hitObject = hitInfo.collider.gameObject;
                Debug.Log("射线击中物体：" + hitObject.name);
            }
        }
    }
}
```

## Animator动画

动画状态机管理游戏对象的动画播放，适合处理复杂动画逻辑，如角色多种动作状态转换。

#### 原理：

Animator 以 Animator Controller（动画控制器）为核心，它是一个由动画状态、转换和参数构成的状态机网络。动画状态对应具体的动画剪辑，如角色的闲置、行走等动作。转换定义了状态切换的条件，这些条件可基于时间或参数设定。参数类型有布尔型、整数型、浮点数型和触发型，用于控制状态转换。例如，布尔型参数 “IsMoving” 可控制角色在 “Idle” 和 “Walk” 状态间切换。

#### 使用流程

1. **创建与配置**：在 Project 窗口创建 Animator Controller，将动画剪辑拖到 Animator 窗口创建状态，设置状态间的转换条件。
2. **关联组件**：给游戏对象添加 Animator 组件，并将创建好的 Animator Controller 赋值给其 “Controller” 属性。
3. **代码控制**：在脚本中获取 Animator 组件引用，使用 `SetBool`、`SetInt`、`SetFloat`、`SetTrigger` 等方法设置参数，控制动画状态转换。

```c#
using UnityEngine;

public class AnimatorControlExample : MonoBehaviour
{
    private Animator animator;

    void Start()
    {
        animator = GetComponent<Animator>();
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            animator.SetTrigger("JumpTrigger");
        }
    }
}
```

## 序列帧动画

 		序列帧动画的基本原理是**视觉暂留**。当多张内容连续的静态图片（即“帧”）以足够快的速度（例如每秒24-30帧）依次播放时，人脑会将这些独立的画面感知为一个连续流畅的动作。其技术实现的核心在于对**时间控制和帧索引跟踪**。播放器需要根据设定的帧率（FPS），在准确的时间点切换当前显示的图片，并通过一个**当前帧索引**来记录播放位置，从而形成动画。

#### 使用Animation窗口

1. **准备素材**：将包含所有动画帧的图片导入Unity。在Inspector窗口中将纹理类型设置为 `Sprite (2D and UI)`，并使用Sprite Editor将其切割成单个的Sprite。
2. **创建动画剪辑**：为你的游戏对象打开 `Animation`窗口，创建一个新的Animation Clip。然后，直接将切割好的Sprite序列从Project视图拖拽到时间轴上，Unity会自动生成关键帧。
3. **创建Animator Controller**：将制作好的动画剪辑赋值给Animator Controller中的状态，并可以设置过渡条件（如参数"isRunning"），通过脚本控制动画切换。

#### 灵活管理播放

```C#
IEnumerator AnimateSprite(SpriteRenderer spriteRenderer, List<Sprite> sprites, float switchTime) {
    int frameIndex = 0;
    while (true) {
        spriteRenderer.sprite = sprites[frameIndex];
        frameIndex = (frameIndex + 1) % sprites.Count; // 循环播放
        yield return new WaitForSeconds(switchTime);
    }
}
```

通过脚本，你可以轻松实现播放、暂停、停止以及跳转到特定帧等复杂逻辑。

#### 高性能方案：使用Shader（GPU加速）

对于移动端或需要大量播放的特效（如爆炸、火焰），使用Shader在GPU上实现序列帧动画能极大提升性能。

其核心思想是在片元着色器中，根据时间变化动态计算UV坐标，从一张包含所有帧的合成图片（纹理数组）中采样正确的帧。专业的插件（如Flipbook VFX）通常采用这种方式，提供高性能的播放模式（单次、循环、乒乓循环），并支持自发光、扭曲等高级特效通道。

## 骨骼动画

- **骨骼与层级**：动画师会为角色创建一套由多根“骨骼”组成的虚拟骨架。这些骨骼之间存在着父子层级关系，例如，移动大臂骨骼会带动小臂，进而带动手部骨骼运动。这种层级关系是形成自然动作的基础。
- **蒙皮与权重**：角色的模型（即我们看到的视觉部分）被称为“蒙皮”。蒙皮上的每个顶点都会被分配“权重”，用以定义它受哪几根骨骼的影响以及影响的程度。合理的权重分配能让关节在弯曲时产生平滑的变形，而不是生硬的断裂。
- **关键帧动画**：动画师只需要在时间轴上的关键点设定好骨骼的姿势（关键帧），软件会自动计算中间过渡帧的骨骼位置和旋转，从而生成连贯的动画。

### 单张图片骨骼编辑

这种方式适用于相对简单的角色或道具。您将一张完整的PNG或JPG图片（例如，一个没有分层的完整角色图像）导入编辑器后，直接在这张图片上绘制骨骼系统。

编辑过程中，您需要为图片生成网格（蒙皮），并将网格的顶点权重绑定到相应的骨骼上。当骨骼运动时，与之关联的网格部分就会随之变形，从而使图片“动”起来。这种方式的好处是准备资源非常快捷，但局限性在于角色身体各部分无法独立运动，动画的灵活性和自然度相对较低。

![image-20251023183627696](/notes-assets/GameEngineStudy/assets/image-20251023183627696.png)

![image-20251023183611986](/notes-assets/GameEngineStudy/assets/image-20251023183611986.png)

![image-20251023184216909](/notes-assets/GameEngineStudy/assets/image-20251023184216909.png)

### 🧩 图集图片骨骼编辑

当需要对一个角色进行更精细和灵活的动画控制时，通常会采用图集编辑的方式。首先，您需要在图像处理软件（如Photoshop）中将角色按照身体部位（如头、身体、左上臂、左下臂等）拆分成多个部分，并将这些部分打包成一张**纹理图集**（Sprite Atlas）。

在Unity等工具的骨骼编辑器中，您需要为图集中的每一个精灵（即角色的一个部位）单独创建和绑定骨骼。之后，在场景中将所有这些分散的、已经绑好骨骼的部件像拼拼图一样重新组合成完整的角色，并在场景层级中建立正确的父子关系，以模拟骨骼之间的物理连接。这种方法实现了部件级的独立控制，可以制作出更复杂的动画（如一边走路一边挥手），并且资源管理效率较高。

### 🎨 PSB图片骨骼编辑

- 

- | 阶段                  | 核心目标与操作要点                                           |
  | :-------------------- | :----------------------------------------------------------- |
  | **1. 前期准备**       | 确保Unity能正确识别并导入分层的PSB文件。                     |
  | **2. 骨骼创建与绑定** | 构建角色的骨架，并建立骨骼与图片各部分（图层）的驱动关系。   |
  | **3. 权重调整**       | 精细控制每根骨骼对图片顶点的影响范围，确保动作自然、无异常形变。 |
  | **4. 动画制作与装配** | 基于设置好的骨骼系统，制作动画序列，并为角色添加附属物品。   |

  ### 💁 详细操作指南

  **1. 前期准备与导入**

  首先，你需要在Unity的Package Manager中安装 **2D PSD Importer** 和 **2D Animation** 这两个核心工具包。接着，将Photoshop中保存好的PSB文件（**务必勾选“ICC配置文件”**）导入Unity项目。选中该文件，在检查器中将其 **Sprite Mode** 从默认的`Single`修改为`Multiple`，这是进行骨骼编辑的前提。

  **2. 骨骼创建、蒙皮与父子关系**

  点击`Sprite Editor`进入编辑界面，选择`Skinning Editor`。在这里，你可以使用`Create Bone`工具为角色的每个部位绘制骨骼。绘制时，要特别注意骨骼的**父子层级关系**。例如，身体的骨骼应是手臂骨骼的父级，而手臂骨骼又是手部骨骼的父级。这种关系可以通过在创建时从父骨骼的末端拖拽来建立，或之后使用`Reparent Bone`工具进行调整。

  骨骼绘制完成后，需要为每个图层生成蒙皮（网格）。选中一个部位，点击`Auto Geometry`并生成，Unity会自动创建网格和初步的权重。之后，关键的步骤是使用**Bone Influence**功能来精确控制哪些骨骼可以影响当前部位。例如，你可以移除身体部位受手臂骨骼的影响，这样移动手臂时身体就不会发生不自然的形变。同时，对于像披风、项链这类没有独立骨骼但需要跟随身体运动的装饰物，可以通过Bone Influence为其**添加**身体骨骼的影响。

  **3. 权重微调**

  自动生成的权重往往不完美，需要使用权重工具进行精细调整。`Weight Brush`（权重笔刷）可以让你直观地“涂抹”骨骼对网格顶点的影响强度。对于刷子难以处理的细节，可以切换到`Weight Slider`模式，直接选择单个顶点，通过滑块精确分配不同骨骼对其的影响值。如果在动画测试时发现某些关节弯曲处形变生硬，通常意味着该区域的**顶点（Vertex）数量不足或分布不均**。这时可以切换到`Geometry`标签，使用`Create Vertex`（创建顶点）和`Create Edge`（创建边）等工具来增加网格密度，从而使形变更平滑。

  **4. 动画制作与附件装配**

  所有编辑完成后，务必先点击`Restore Pose`让骨骼复位，然后点击`Apply`保存所有设置。接下来，将PSB文件从项目窗口拖入场景或层级视图（Hierarchy），它会自动生成带有骨骼结构的预制件。你可以调整根物体的位置（如放在脚底）作为整个角色的轴心点。

  打开`Animation`窗口，点击创建新动画剪辑。**开启录制模式**（红色圆点按钮），然后在不同时间点拖动骨骼摆出姿势，Unity会自动记录关键帧。若想为角色添加武器等道具，只需将道具模型拖拽到层级视图中对应的骨骼（如手部骨骼）下，使其成为该骨骼的**子物体**，这样道具就会自动跟随手部运动。

### ✨ 专业工具Spine

Spine是一款专业的2D骨骼动画软件，在游戏开发领域应用广泛。它与引擎无关，制作好的动画可以导出数据文件，供Unity、UE4、Cocos等多种游戏引擎使用。

Spine的核心优势在于其强大的动画编辑功能、高效的运行时性能以及丰富的功能集：

- **反向动力学（IK）**：可以轻松实现如脚部固定在地面、手部抓取物体等更符合直觉的动画效果。
- **网格变形与自由形变（FFD）**：可以为图片创建精细的网格，实现肌肉膨胀、布料飘动等柔和的非线性形变，大大增强表现力。
- **动画混合与切换**：可以无缝地在不同动画（如从走路过渡到跑步）之间进行混合，使动作更流畅自然。

## 曲线和帧事件

### 曲线（Animation Curves）

在 Unity 中，曲线（Animation Curves）是一种强大的工具，用于在动画中控制数值随时间的变化。曲线可以控制诸如位置、旋转、缩放、颜色等属性的变化，让动画更加自然和生动。以下是一些关键信息：

- **创建曲线**：在动画窗口中选择要添加曲线的属性，然后右键单击并选择 “添加关键帧” 来创建曲线。
- **编辑曲线**：在曲线编辑器中，可以通过拖动关键帧、添加或删除关键帧以及调整曲线的切线来编辑曲线的形状。
- **使用曲线**：曲线可以用于控制动画的速度、加速度、弹性等效果，也可以用于控制游戏中的其他参数，如音效的音量、粒子系统的发射速率等。

### 帧事件（Frame Events）

帧事件允许你在动画的特定帧上触发脚本中的函数。这在需要在动画的特定时刻执行特定操作时非常有用，比如播放音效、触发粒子效果、改变游戏状态等。以下是使用帧事件的步骤：

1. **创建脚本**：创建一个包含你想要触发的函数的脚本。
2. **添加脚本到对象**：将脚本添加到具有动画的对象上。
3. **设置帧事件**：在动画窗口中，选择要添加帧事件的动画剪辑，然后在特定的帧上添加帧事件，并指定要调用的函数。

```c#
using UnityEngine;

public class AnimationExample : MonoBehaviour
{
    public AnimationCurve movementCurve; // 定义一个动画曲线
    private float startTime;

    void Start()
    {
        startTime = Time.time;
    }

    void Update()
    {
        float elapsedTime = Time.time - startTime;
        // 使用曲线控制对象的位置
        float newX = movementCurve.Evaluate(elapsedTime);
        transform.position = new Vector3(newX, transform.position.y, transform.position.z);
    }

    // 帧事件调用的函数
    public void OnFrameEvent()
    {
        Debug.Log("Frame event triggered!");//每次到达该事件帧，即调用函数
    }
}
```

## 混合树概念

混合树是 Animator 控制器中的一个节点类型，它可以根据一个或多个参数，在多个动画剪辑之间实现平滑过渡。简单来说，它能让角色在不同动作之间自然转换，使动画表现更加流畅和真实。

### 工作原理

混合树依据指定的参数（如速度、方向等），计算各个动画剪辑的权重，进而决定每个动画在最终输出中所占的比例，实现动画的混合。例如，当角色从站立到行走再到奔跑时，通过混合树可以根据角色的移动速度，自然地在站立、行走和奔跑动画之间过渡。

### 类型

- **一维混合树**：基于单个参数来控制动画的混合。比如根据角色的移动速度，在静止、慢走、快跑等动画之间进行过渡。
- **二维混合树**：依赖两个参数来决定动画的混合。常用于控制角色在二维平面上的移动，例如同时考虑水平和垂直方向的速度，实现不同方向和速度下的移动动画。
- **自由形式笛卡尔混合树**：允许开发者自定义参数的含义和范围，更加灵活地控制动画的混合。
- **自由形式网格混合树**：适合处理多个动画之间的复杂混合，开发者可以手动调整每个动画的权重。

### 创建和使用步骤

1. **创建混合树**：在 Animator 窗口中，右键点击空白处，选择 “Create State” -> “From New Blend Tree” 来创建一个新的混合树。
2. **添加动画剪辑**：将需要混合的动画剪辑添加到混合树中。
3. **设置参数**：在 Animator 窗口的 Parameters 面板中创建参数，如 “Speed”“Direction” 等。
4. **配置混合树**：在混合树的 Inspector 面板中，设置参数和动画剪辑的阈值。例如，在一维混合树中，为每个动画剪辑设置对应的参数范围。
5. **设置过渡条件**：在 Animator 窗口中设置状态之间的过渡条件，以控制动画的切换。

```c#
using UnityEngine;

public class CharacterMovement : MonoBehaviour
{
    public Animator animator; // 动画控制器
    public float speed; // 角色移动速度

    void Update()
    {
        // 获取输入的移动方向
        float horizontalInput = Input.GetAxis("Horizontal");
        float verticalInput = Input.GetAxis("Vertical");

        // 计算移动速度
        speed = new Vector2(horizontalInput, verticalInput).magnitude;

        // 设置Animator中的参数
        animator.SetFloat("Speed", speed);
    }
}
```

### 应用场景

- **角色移动**：实现角色在不同速度和方向下的移动动画，如行走、奔跑、转身等。
- **表情动画**：根据角色的情绪状态，混合不同的表情动画，使角色更加生动。
- **战斗动画**：在战斗中，根据角色的攻击类型和状态，平滑过渡不同的攻击和防御动画。

## 动画遮罩

动画遮罩用于控制动画的哪些部分会影响对象。在动画制作中，有时候我们只想让动画的某些部位（如手臂、腿部）产生动画效果，而其他部位保持不变，这时就可以使用动画遮罩。它通过定义一个遮罩层，指定哪些骨骼或动画属性会受到动画的影响。例如，多个Layer层（Animator层）中的不同层的权重不同，调整权重，并且通过动画遮罩，控制该层对对象的影响

#### 创建和使用步骤

1. **创建动画遮罩文件**：在 Project 面板中右键选择`Create` -> `Animator Override Controller`，然后在`Inspector`面板中设置`Avatar Mask`。
2. **设置遮罩层**：在`Animator`窗口中，创建一个新的层，将动画遮罩文件分配给该层。
3. **调整权重**：通过调整层的权重，可以控制该层动画对对象的影响程度。

## 反向运动学IK

反向运动学（Inverse Kinematics，简称 IK）是一种在计算机动画、机器人学等领域广泛应用的技术。它与正向运动学相对应。正向运动学是已知关节角度等参数来计算末端执行器（如机械臂的末端、角色的手或脚等）的位置和姿态；而反向运动学则是已知末端执行器的期望位置和姿态，反过来求解关节的角度等参数。

### 应用场景

- **角色交互**：角色与场景中的物体进行交互时，如伸手抓取物品、脚踩在特定位置等，通过反向运动学可以让肢体自然地接触到目标物体。
- **复杂动作**：实现一些复杂的动作，如攀爬、舞蹈等，使角色的动作更加流畅和真实。

### 实现方式

#### 1. 使用 Animator 组件的 IK Pass

Unity 的 Animator 组件提供了 IK Pass 机制，允许开发者在动画播放过程中动态控制 IK。具体步骤如下：

- **创建动画控制器**：在 Animator 窗口中创建一个动画控制器，并将其赋值给角色的 Animator 组件。
- **启用 IK Pass**：在 Animator 组件中，勾选 “Apply Root Motion” 和 “IK Pass” 选项。
- **编写脚本**：创建一个脚本，在脚本中实现`OnAnimatorIK`方法，该方法会在每一帧动画更新时被调用，用于控制 IK。

```c#
using UnityEngine;

public class IKControl : MonoBehaviour
{
    public Transform target; // 目标物体的Transform
    private Animator animator;

    void Start()
    {
        animator = GetComponent<Animator>();
    }

    void OnAnimatorIK(int layerIndex)
    {
        if (target != null)
        {
            // 设置IK目标位置
            animator.SetIKPosition(AvatarIKGoal.RightHand, target.position);
            animator.SetIKPositionWeight(AvatarIKGoal.RightHand, 1f);//权重

            // 设置IK目标旋转
            animator.SetIKRotation(AvatarIKGoal.RightHand, target.rotation);
            animator.SetIKRotationWeight(AvatarIKGoal.RightHand, 1f);
        }
    }
}
```

#### 2.使用内置的 IK 组件

Unity 还提供了一些内置的 IK 组件，如`Configurable Joint`和`Spring Joint`，可以用于实现简单的 IK 效果。这些组件可以通过在 Hierarchy 面板中右键点击物体，选择 “Add Component”，然后搜索相应的组件来添加。

#### 3. 使用第三方插件

如果需要更复杂的 IK 功能，可以使用一些第三方插件，如 Final IK。Final IK 是一个强大的 IK 插件，提供了多种 IK 求解器和工具，能够实现更高级的 IK 效果，如多关节链的 IK、脚部 IK 等。

## 导航，Ai寻路

1. 导航系统基础概念
   - **导航网格（NavMesh）**：这是一种数据结构，用于描述游戏世界中可行走的表面，它是基于场景中的几何体自动构建或烘焙而来的。通过导航网格，游戏引擎可以确定角色可移动的区域以及在这些区域之间的可行路径。例如，在一个室内场景中，地面、走廊等区域会被构建成导航网格，而墙壁、家具等障碍物则会被排除在外。
   - **导航网格代理（NavMeshAgent）**：是一个组件，添加到游戏对象上后，该对象就可以使用导航网格进行移动。它能够帮助角色在朝目标移动时避开其他角色或移动的障碍物。代理使用导航网格来推断游戏世界，并知道如何移动以及避开障碍物。
2. 导航系统的设置与烘焙
   - **设置静态属性**：首先需要将场景中参与导航的地面、路障等静态对象的 `Static` 属性设置为 `NavigationStatic`，以便在导航网格烘焙过程中被包含。
   - **打开导航窗口与烘焙**：依次选择 `Window -> AI -> Navigation` 打开导航窗口，在其中选择 `Bake` 选项卡，可以调整一些烘焙设置，如 `Agent Radius`（角色半径）、`Agent Height`（角色高度）、`Max Slope`（角色能爬的最大坡度）、`Step Height`（角色爬台阶时每步能跨的最大高度）等，以匹配角色的属性。点击 `Bake` 按钮即可构建导航网格。烘焙完成后，会在与导航网格所属场景同名的文件夹中找到导航网格资源文件。
3. AI 寻路的实现
   - **寻路算法**：Unity 中常用的寻路算法是 A*（A Star）算法2。该算法通过计算每个节点的代价函数（`F` 值，`F = G + H`，其中 `G` 是从起始点到当前节点的实际代价，`H` 是从当前节点到目标点的预估代价）来确定最优路径。在 Unity 中，导航系统会自动使用 A* 算法来计算角色从当前位置到目标位置的路径5。
   - **设置目标位置**：在脚本中，通过设置 `NavMeshAgent` 的 `destination` 属性为目标点的位置，即可告诉代理开始计算路径并移动。例如：

```c#
using UnityEngine;
using UnityEngine.AI;

public class MoveToTarget : MonoBehaviour
{
    public Transform target;
    private NavMeshAgent navMeshAgent;

    void Start()
    {
        navMeshAgent = GetComponent<NavMeshAgent>();
    }

    void Update()
    {
        Ray ray = Camera.main.ScreenToPoint(Input.mousePoint)//获取鼠标点击位置
        RaycastHit hit;
        if(Physics.Raycast(ray,out hit)){
			Vector3 point = hit.point ; 
            navMeshAgent.SetDestination(point);//将鼠标点击的位置作为目标点传入
        }
        
        if (target!= null)
        {
            navMeshAgent.destination = target.position;
        }
    }
}
```

1. 路径的跟踪与移动
   - **跟随路径**：寻路算法找到的从起点到目标的路径是由一系列多边形组成的 “走廊”。角色会始终朝着走廊的下一个可见拐角移动，直至到达目标。在移动过程中，导航系统会根据角色的位置和速度不断更新路径，以确保角色能够沿着正确的方向前进。
   - **移动代理**：在确定了移动方向和速度后，导航系统会使用一个简单的动态模型来模拟代理的移动，该模型还会考虑加速度等因素，以实现更自然和平滑的移动。移动后的代理位置会被约束到导航网格上，以保证角色始终在可行走的区域内移动。
2. 高级应用与优化
   - **动态障碍物**：可以使用 `NavMeshObstacle` 组件来描述代理在世界中导航时应避开的移动障碍物，如由物理系统控制的木桶或板条箱等。当障碍物移动时，代理会尽力避开它；当障碍物静止时，导航网格中会雕刻一个孔，使代理能够改变自己的路径绕过它，或者寻找其他不同的路线2。
   - **分层剔除**：通过 `NavMeshAgent` 的 `AreaMask` 属性可以进行分层剔除，设置导航角色可以行走的层。这在复杂的场景中非常有用，可以根据不同的区域或功能将场景划分为不同的层，然后让角色只在特定的层上移动。
   - **优化性能**：在大型场景中，导航系统的计算可能会消耗大量的性能。可以通过减少导航网格的复杂度、优化寻路算法的参数、限制导航计算的频率等方式来优化性能。

## UGUI

### 画布

##### 1.创建画布

要创建画布，可在 Unity 编辑器里，选择`GameObject` -> `UI` -> `Canvas`。这样就能在场景中创建一个新的画布对象。

##### 2. 设置渲染模式

Screen Space - Overlay

- **原理**：此模式下，UI 元素会直接覆盖在屏幕上，无论场景中的相机如何设置，UI 都会始终显示在最前面，并且会自动适应屏幕的大小和分辨率。
- 特点
  - **始终可见**：不管场景相机的视角、位置和旋转如何变化，UI 元素都会完整地显示在屏幕上，不会被场景中的其他物体遮挡。
  - **自动适配**：UI 元素会根据屏幕的分辨率自动调整大小和位置，保证在不同设备上都能正确显示。
- **应用场景**：常用于需要始终显示在屏幕上的 UI 元素，如游戏中的血条、分数显示、菜单按钮等。

2. Screen Space - Camera

- **原理**：UI 元素会渲染在指定相机的前面，其位置和大小由相机的视角和距离决定。可以通过调整画布与相机的距离来控制 UI 元素的大小和透视效果。
- 特点
  - **与相机关联**：UI 元素的显示依赖于指定的相机，相机的位置、旋转和视野变化会影响 UI 元素的显示效果。
  - **可调整透视**：可以通过设置画布与相机的距离和相机的透视参数，为 UI 元素添加透视效果，使其看起来更具立体感。
- **应用场景**：适用于需要与场景有一定交互或需要根据相机视角变化而变化的 UI 元素，如游戏中的提示信息、瞄准镜等。

3. World Space

- **原理**：UI 元素会像普通的 3D 对象一样存在于场景空间中，具有自己的位置、旋转和缩放属性。可以通过场景相机来观察和渲染这些 UI 元素。
- 特点
  - **3D 空间交互**：UI 元素可以与场景中的其他 3D 对象进行交互，如被遮挡、被光照影响等。
  - **灵活布局**：可以根据场景的需要，自由地调整 UI 元素的位置和方向，实现更复杂的布局效果。
- **应用场景**：常用于需要与 3D 场景深度融合的 UI 元素，如游戏中的广告牌、全息投影等。

在创建好画布后，你可以添加各类 UI 元素，像按钮、文本框、图像等。例如，要添加一个按钮，可选择`GameObject` -> `UI` -> `Button`，这个按钮就会成为画布的子对象。

```c#
using UnityEngine;
using UnityEngine.UI;

public class ButtonClickExample : MonoBehaviour
{
    public Button myButton;

    void Start()
    {
        // 为按钮的点击事件添加监听器
        myButton.onClick.AddListener(OnButtonClick);
    }

    void OnButtonClick()
    {
        Debug.Log("按钮被点击了！");
    }
}
```



### 文本Text

##### 1. 创建 `Text` 对象

在 Unity 编辑器中，你可以通过以下步骤创建一个 `Text` 对象：

- 选中 `Hierarchy` 面板，点击 `GameObject` -> `UI` -> `Text`。如此一来，场景中便会生成一个 `Canvas` 对象，同时在 `Canvas` 下会创建一个 `Text` 对象。

##### 2. `Text` 组件的常用属性

- **Text**：这是要显示的文本内容。你可以直接在 Inspector 面板里修改它，或者在代码中进行设置。
- **Font**：指定用于渲染文本的字体。你可以将自定义字体文件（如 `.ttf` 格式）拖拽到该属性上。
- **Font Size**：设置文本的字号大小。
- **Color**：设定文本的颜色。
- **Alignment**：用于调整文本的对齐方式，例如左对齐、居中对齐、右对齐等。

##### 3. 在代码中控制 `Text` 组件

以下是一个简单的 C# 脚本示例，它展示了如何在代码中修改 `Text` 组件的文本内容：

```csharp
using UnityEngine;
using UnityEngine.UI;

public class TextExample : MonoBehaviour
{
    public Text myText; // 在Inspector面板中赋值

    void Start()
    {
        // 修改文本内容
        myText.text = "Hello, Unity!";

        // 修改文本颜色
        myText.color = Color.red;

        // 修改字号大小
        myText.fontSize = 30;
    }
}
```

##### 4. 使用步骤

1. 创建一个新的 C# 脚本，例如 `TextExample.cs`，并将上述代码复制进去。
2. 在 Unity 中创建一个空的 `GameObject`，并将 `TextExample` 脚本挂载到该对象上。
3. 在 Inspector 面板中，将之前创建的 `Text` 对象拖拽到 `TextExample` 脚本的 `myText` 字段中。
4. 运行游戏，你会看到 `Text` 组件的文本内容、颜色和字号大小发生了改变。

##### 5. 富文本支持

`Text` 组件支持富文本标签，这样就能实现多样化的文本样式。例如：

```csharp
myText.text = "<color=blue>这是蓝色文本</color> <size=40>这是大字号文本</size>";
```



### 图片Image

##### 1. 创建 `Image` 对象

在 Unity 编辑器里，创建 `Image` 对象的步骤如下：

- 选中 `Hierarchy` 面板，点击 `GameObject` -> `UI` -> `Image`。这时场景中会生成一个 `Canvas` 对象，并且在 `Canvas` 下会创建一个 `Image` 对象。

##### 2. `Image` 组件的常用属性

- **Source Image**：指定要显示的图片，你可以把纹理文件（如 `.png`、`.jpg`）拖到该属性上。
- **Color**：设定图片的颜色，这会和图片原本的颜色相乘。
- **Material**：指定用于渲染图片的材质。
- **Type**：有几种不同的显示类型，如 `Simple`（简单拉伸）、`Sliced`（九宫格切片）、`Tiled`（平铺）和 `Filled`（填充）。

##### 3. 在代码中控制 `Image` 组件

以下是一个简单的 C# 脚本示例，展示了如何在代码里修改 `Image` 组件的图片和颜色：

```csharp
using UnityEngine;
using UnityEngine.UI;

public class ImageExample : MonoBehaviour
{
    public Image myImage; // 在Inspector面板中赋值
    public Sprite newSprite; // 新的图片

    void Start()
    {
        // 修改图片
        myImage.sprite = newSprite;

        // 修改颜色
        myImage.color = Color.green;
    }
}
```

##### 4. 使用步骤

1. 创建一个新的 C# 脚本，比如 `ImageExample.cs`，并把上述代码复制进去。
2. 在 Unity 中创建一个空的 `GameObject`，将 `ImageExample` 脚本挂载到该对象上。
3. 在 Inspector 面板中，把之前创建的 `Image` 对象拖到 `ImageExample` 脚本的 `myImage` 字段中。
4. 准备一张新的图片，将其拖到 `ImageExample` 脚本的 `newSprite` 字段中。
5. 运行游戏，你会看到 `Image` 组件的图片和颜色发生了改变。

##### 5. 不同 `Type` 的使用

- **Simple**：图片会简单地拉伸以适应 `Image` 对象的大小。
- **Sliced**：适合用于有边框的图片，可通过九宫格切片来保证边框和中心部分的正确缩放。
- **Tiled**：图片会在 `Image` 对象内平铺显示。
- **Filled**：可根据 `Fill Amount` 属性来部分显示图片，常用于制作进度条等效果



### 按钮Button

##### 1.创建图片按钮

在 Unity 编辑器中，你可以按照以下步骤创建一个带有图片的按钮：

- 选中 `Hierarchy` 面板，点击 `GameObject` -> `UI` -> `Button`。此时场景中会生成一个 `Canvas` 对象，并且在 `Canvas` 下会创建一个 `Button` 对象。
- `Button` 对象默认包含一个 `Text` 子对象，你若想用图片替代文字，可以将 `Text` 对象删除，然后添加一个 `Image` 子对象。选中 `Button` 对象，点击 `GameObject` -> `UI` -> `Image`。

##### 2. `Button` 组件的常用属性

- **Interactable**：用来控制按钮是否可交互。若设置为 `false`，按钮将变灰且无法点击。
- **Transition**：有几种过渡效果，比如 `Color Tint`（颜色渐变）、`Sprite Swap`（图片切换）、`Animation`（动画过渡）。
- **Target Graphic**：指定按钮交互时要应用过渡效果的图形对象，通常是 `Image` 组件。

##### 3. 使用图片作为按钮外观

- **设置默认图片**：选中 `Button` 对象下的 `Image` 组件，在 `Source Image` 属性中指定要显示的默认图片。
- **使用 `Sprite Swap` 过渡效果**：若要在按钮的不同状态（如 `Normal`、`Highlighted`、`Pressed`、`Disabled`）显示不同的图片，可以将 `Transition` 设置为 `Sprite Swap`，然后分别为每个状态指定不同的图片。

##### 4. 在代码中控制按钮交互

```csharp
using UnityEngine;
using UnityEngine.UI;

public class ButtonExample : MonoBehaviour
{
    public Button myButton; // 在Inspector面板中赋值

    void Start()
    {
        // 为按钮的点击事件添加监听
        myButton.onClick.AddListener(OnButtonClick);
    }

    void OnButtonClick()
    {
        Debug.Log("按钮被点击了！");
    }
}
```

##### 5. 使用步骤

1. 创建一个新的 C# 脚本，例如 `ButtonExample.cs`，并将上述代码复制进去。
2. 在 Unity 中创建一个空的 `GameObject`，将 `ButtonExample` 脚本挂载到该对象上。
3. 在 Inspector 面板中，把之前创建的 `Button` 对象拖拽到 `ButtonExample` 脚本的 `myButton` 字段中。
4. 运行游戏，点击按钮，你会在控制台看到 “按钮被点击了！” 的输出信息。

##### 6. 按钮音效与动画

- **音效**：可以为按钮添加 `AudioSource` 组件，在按钮的点击事件中播放音效。
- **动画**：若使用 `Animation` 过渡效果，需要创建动画剪辑并将其应用到按钮上，以此实现按钮在不同状态下的动画效果。



### 锚点Anchor

##### 1. 锚点的基本概念

锚点是 `Canvas` 上的一组参考点，UI 元素的位置和大小由其相对于锚点的关系来确定。每个 UI 元素都有四个锚点，分别位于矩形的四个角，这些锚点可以被移动到 `Canvas` 的任意位置。

##### 2. 锚点的表现形式

在 Unity 的 Inspector 面板中，锚点以一个小矩形的形式呈现，这个小矩形由四个角组成，分别对应 UI 元素的四个锚点。当你选中一个 UI 元素时，可以在 Inspector 面板的 `Rect Transform` 组件中看到锚点的设置。

##### 3. 锚点的作用

锚点的主要作用是让 UI 元素能够自适应不同的屏幕分辨率和 `Canvas` 大小。通过合理设置锚点，你可以确保 UI 元素在不同的设备上都能正确显示和布局。

##### 4. 常见的锚点设置方式

###### 4.1 锚点聚合在一起

当四个锚点聚合在一起时，UI 元素的位置和大小与锚点的位置无关，而是由 `Rect Transform` 组件中的 `Position` 和 `Size` 属性直接决定。这种设置方式适合那些不随屏幕大小变化而改变位置和大小的 UI 元素，例如固定位置的按钮。

###### 4.2 锚点分散在四个角

当四个锚点分别位于 `Canvas` 的四个角时，UI 元素的四个边会分别与锚点对齐，并且会随着 `Canvas` 的大小变化而自动调整大小。这种设置方式适合那些需要铺满整个屏幕或者占据固定比例区域的 UI 元素，例如背景图片。

###### 4.3 部分锚点固定，部分锚点可移动

你还可以将部分锚点固定，部分锚点移动，从而实现更复杂的布局效果。例如，将顶部和底部的锚点固定，左右锚点可移动，这样 UI 元素的高度就会固定，宽度会随着屏幕宽度的变化而变化。

##### 5. 在 Unity 中设置锚点

- **手动设置**：在 Inspector 面板的 `Rect Transform` 组件中，点击锚点矩形的四个角，然后拖动鼠标将锚点移动到所需的位置。
- **使用快捷方式**：在 Scene 视图中，选中 UI 元素，然后按住 `Alt` 键（Windows）或 `Option` 键（Mac），同时拖动 UI 元素的边框，即可快速调整锚点的位置。

##### 6. 代码中控制锚点

以下是一个简单的 C# 脚本示例，展示了如何在代码中设置 UI 元素的锚点：

```csharp
using UnityEngine;
using UnityEngine.UI;

public class AnchorExample : MonoBehaviour
{
    public RectTransform myRectTransform;

    void Start()
    {
        // 设置锚点为四个角
        myRectTransform.anchorMin = Vector2.zero;
        myRectTransform.anchorMax = Vector2.one;

        // 设置偏移量为零，使UI元素铺满整个Canvas
        myRectTransform.offsetMin = Vector2.zero;
        myRectTransform.offsetMax = Vector2.zero;
    }
}
```

## 粒子系统

## UI_Toolkit

## NavMesh寻路

## ScriptableObject

一种特殊类，用于创建可独立于 MonoBehaviour 存在的数据容器。它继承自 UnityEngine.Object，主要用于存储游戏数据或配置信息，避免数据在场景间传递时丢失。

#### **核心特点**

1. **数据持久化**
   ScriptableObject 可以保存为资产文件（`.asset`），存储在项目的 Assets 文件夹中。这些数据在运行时保持不变，可被多个场景或对象共享。
2. **避免数据冗余**
   多个 MonoBehaviour 可以引用同一个 ScriptableObject 实例，减少内存占用。例如，武器属性、角色配置等可作为共享资源。
3. **独立于场景**
   不同于 MonoBehaviour 必须依附于游戏对象，ScriptableObject 可作为独立资源存在，适合存储全局数据。
4. **编辑器集成**
   可通过自定义 Inspector 面板编辑数据，也可通过脚本动态生成，提高开发效率。在实际发布运行后，不具备持久化特性

## A*算法

#### 算法核心

A* 算法的精髓在于其评价函数：**F = G + H**。

- **G 成本** 代表了从起点移动到当前节点的真实代价，是已经发生的、确定无疑的成本。
- **H 成本** 则是从当前节点到终点的预估代价，是一种启发式的猜想。

算法通过始终优先探索 **F 值最小** 的节点，在“已付出的代价”和“未来的希望”之间做出了最优权衡。这使它避免了 Dijkstra 算法的盲目性，也规避了贪婪最佳优先搜索的短视，成为两者理想的折中方案。

#### 运作流程

算法的执行过程可以看作一场对地图的智能探索：

1. 1.**初始化**：旅程从起点开始，将其列入“待探索”（开放列表）。
2. 2.**主循环**：
   - 从“待探索”列表中找出当前最有希望的节点（F值最小）。
   - 若该点是终点，则使命完成，通过回溯“父节点”记录即可重建完整路径。
   - 否则，将其标记为“已探索”（关闭列表），并检视其所有邻居。
3. 3.**评估邻居**：
   - 对每个邻居，计算从当前路径到达它的 **G 成本**。若该成本比它已知的更低，则意味着找到了一条更优的路径。此时需要更新其成本，并将其“父节点”指向当前节点，引导它加入或重新评估“待探索”列表。

整个过程持续进行，直到成功找到终点，或穷尽所有可能后宣告失败。

#### 启发函数 H(n)

启发函数 `H(n)`是 A* 算法中的“指南针”，指引着搜索的大方向。它的选择直接影响算法的效率和准确性。

- **曼哈顿距离**：计算速度快，适用于只能上下左右移动的网格场景（如经典 2D 游戏）。
- **对角线距离**：更贴合可沿对角线移动的八方向寻路，估算更精确。
- **欧几里得距离**：最精确的直线距离估算，保证找到最短路径，但计算开销最大。

选择启发函数的一条黄金法则是：**永远不要高估实际成本**。遵守此规则，A* 算法一定能找到最优解。

#### Unity 实践与优化之道

在 Unity 中实现 A* 时，效率和内存管理是关键。

- **地图表示**：通常用一个二维网格（`Grid`）来抽象游戏世界，每个单元格存储其通行性和代价。
- **性能核心**：
  - 使用**优先队列**（最小堆）来管理开放列表，这是大幅提升性能的关键。
  - 采用**对象池**管理节点对象，避免频繁创建销毁，防止 GC 压力。
- **超越基础**：对于庞大世界，**分层寻路**（HPA*）是先进行粗略寻路，再局部精细寻路的高效策略。

**重要提示**：对于大多数商业游戏项目，应优先考虑使用 Unity 内置的 **NavMesh** 系统。它经过高度优化且稳定可靠，足以应对绝大多数寻路需求。将自实现的 A* 方案用于 NavMesh 无法满足的、高度定制化的特定场景。

## 延迟函数

MonoBehavior中的方法，继承了Mono的类即可使用。

#### Invoke函数

- 通过字符串方法名调用，简单但类型不安全（拼写错误不会编译报错）
- 支持单次延迟（`Invoke`）和重复调用（`InvokeRepeating`）。
- 依赖`MonoBehaviour`，需通过`CancelInvoke`取消调用。

```C#
void Start() {
    Invoke("DelayedMethod", 2f); // 2秒后执行
    InvokeRepeating("RepeatMethod", 1f, 3f); // 1秒后开始，每3秒重复
}
void DelayedMethod() => Debug.Log("执行延迟方法");
void RepeatMethod() => Debug.Log("重复执行");
```

**适用场景**：简单延迟（如3秒后销毁物体）

**缺点**：

- 无法传递参数，只能传递无参方法

- 延迟时间不可动态修改


## Resource资源加载

### 资源同步加载

同步资源加载是Unity中最直接的资源获取方式，它会阻塞主线程直到资源完全加载完成。

- **阻塞式执行**：调用线程（通常是主线程）会暂停执行，等待资源从磁盘读取并完成内存分配

- **即时可用**：方法返回时资源已经准备就绪，可直接使用

- **简单易用**：API设计直观，不需要处理回调或协程

```C#
T obj = Resources.Load<T>(string path);//泛型加载
Object obj = Resources.Load(string path);

GameObject obj = Resources.Load<GameObject>(string path);
Instantiate(obj);

AudioClip clip = Resources.Load<AudioClip>("Music/BkMusic");
audioSource.clip = clip;
audioSource.Play();  // 直接使用无需实例化

TextAsset text = Resources.Load<TextAsset>(string path);
print(text.text);
```



### 资源异步加载

异步资源加载是Unity推荐的资源加载方式，它通过后台线程处理IO操作，避免阻塞主线程。

- **非阻塞式**：资源加载在后台线程进行，主线程可继续执行其他任务
- **延迟可用**：资源需要若干帧后才能准备就绪
- **进度可控**：可监控加载进度，实现进度条等UI反馈

资源加载完成后执行回调方法

```C#
private Texture2D loadedTexture;

void Start() {
    ResourceRequest request = Resources.LoadAsync<Texture2D>("Textures/MyTexture");
    request.completed += OnLoadCompleted;
}

private void OnLoadCompleted(AsyncOperation operation) {
    ResourceRequest request = operation as ResourceRequest;
    if(request.asset == null) {
        Debug.LogError("加载失败");
        return;
    }
    loadedTexture = request.asset as Texture2D;
    // 使用资源...
}
```

异步资源加载封装类

```C#
public class ResourceLoadManager : MonoBehaviour {
    private static ResourceLoadManager instance;
    
    public static ResourceLoadManager Instance {
        get {
            if(instance == null) {
                GameObject go = new GameObject("ResourceLoadManager");
                instance = go.AddComponent<ResourceLoadManager>();
                DontDestroyOnLoad(go);
            }
            return instance;
        }
    }
    
    public void LoadAsync<T>(string path, Action<T> callback) where T : Object {
        StartCoroutine(LoadAsyncCoroutine(path, callback));
    }
    
    private IEnumerator LoadAsyncCoroutine<T>(string path, Action<T> callback) where T : Object {
        ResourceRequest request = Resources.LoadAsync<T>(path);
        yield return request;
        
        if(request.asset == null) {
            Debug.LogError($"加载失败：{path}");
            yield break;
        }
        
        callback?.Invoke(request.asset as T);
    }
}


//使用方法
ResourceLoadManager.Instance.LoadAsync<Textures>("Textures/MyTexture",  (texture) => {
    // 使用加载完成的纹理
}) 
```

## MipMap

需要消耗一定的内存空间，因为需要不同分辨率的图片来换取性能

当 3D 物体离相机远的时候，它上面的纹理看起来会很小。如果还直接用原始的高清纹理，不仅浪费显卡性能，还可能因为像素缩放出现锯齿或模糊。

Mipmap 的做法是：提前给一张纹理生成一系列不同分辨率的 "缩小版"（比如原始图 1024x1024，就生成 512x512、256x256... 直到 1x1 的版本）。

游戏运行时，显卡会自动根据物体离相机的距离，选择最合适大小的纹理版本：

- 物体很近 → 用大尺寸高清图
- 物体很远 → 用小尺寸缩略图

这样既保证了近处的画质，又提高了远处渲染的效率，还能让纹理缩放更平滑自然。

在 Unity 里，导入纹理时勾选 "Mip Maps" 选项就会自动生成这些多级纹理，不需要你手动处理每个尺寸。

## 模型制作

![image-20250902152702641](/notes-assets/GameEngineStudy/assets/image-20250902152702641.png)

## SpriteMask

**SpriteMask** 是 Unity 中的一个组件，它允许你使用一个精灵（Sprite）的透明度（Alpha通道）来定义另一个精灵的可见区域。

你可以把它想象成一张**镂空的纸**（模板）。你把这张纸盖在另一张图片上，那么只有透过镂空部分才能看到下面的图片。SpriteMask 就是那张镂空的纸，它控制

着其他精灵的显示与隐藏。

**创建一个SpriteMask组件，选择遮罩的图像，在创建sprite对象，可以选择遮罩类型，如果是Inside Mask，将图片拖入遮罩范围中即显示，否者不显示 OutSide Mask则相反**

SpriteMask 系统包含两个关键部分：

1. 1.**遮罩本身：**
   - 这是一个带有 `SpriteMask` 组件的游戏对象（GameObject）。
   - 你需要给它指定一个**精灵**作为遮罩图形。
   - 这个精灵的 **不透明/白色区域** 定义了“可见区域”，**透明/黑色区域** 定义了“被隐藏的区域”。
   - *重要提示：遮罩本身在游戏中通常是不可见的（除非你特意让它显示），它的作用是控制别人。*
2. 2.**被遮罩的精灵：**
   - 这是任何带有 `SpriteRenderer`（精灵渲染器）的普通精灵。
   - 你需要修改它的 **“Mask Interaction”** 属性，告诉它如何与遮罩进行交互。

一个常见的误解是认为遮罩精灵是自己显示出来的东西。其实不是，它是一个无形的区域，控制着**其他**精灵的可见性。



**在 `SpriteMask` 组件上：**

- **Sprite（精灵）：** 用于定义遮罩形状的精灵。它的 Alpha 通道（透明度）是关键。
- **Is Custom Range（是否自定义范围）：**不勾选时，遮罩会影响所有在它**后面**（具有更高 Sorting Order 或更底层 Sorting Layer）的、设置了 Mask Interaction 的精灵。这是简单情况的默认行为。勾选时，你可以手动设置 `Sorting Layer` 和 `Front/Back Sorting Order`，来精确控制这个遮罩会影响**哪些层、哪些顺序**的精灵。这对于处理复杂的分层场景非常有用**（只会遮罩在Front/Back Sorting Order层级之间的物品）**。

**在被遮罩精灵的 `SpriteRenderer` 组件上：**

- **Mask Interaction（遮罩交互）：** 这是最重要的设置，它有四个选项：
  - **None（无）：** 精灵忽略所有遮罩。这是默认行为。
  - **Visible Inside Mask（在遮罩内可见）：** 精灵**只**在遮罩的不透明区域内绘制。这是**最常用**的选项。
  - **Visible Outside Mask（在遮罩外可见）：** 精灵在遮罩的**外部**绘制，而在遮罩的不透明区域内会被隐藏。是“Visible Inside Mask”的反向操作。
  - **Cutout：** 这是一个遗留选项，主要用于与旧的“Sprite Shader”系统兼容，现在较少使用。效果类似于“Visible Inside Mask”。

## DrawCall

#### 核心概念

- **是什么**：CPU 命令 GPU 绘制一个**网格+材质**的指令。
- **核心比喻**：**CPU（项目经理）** 对 **GPU（艺术家）** 说：“画一个这个东西！”。每说一次，就是 1 个 Draw Call。
- **黄金法则**：**Draw Call 数量越少，游戏性能通常越好。**

####  为什么重要？

- **CPU 开销**：准备和发送每个 Draw Call 都需要 CPU 工作，过程本身有成本。
- **GPU 工作**：GPU 需要处理每个指令，过多指令会导致处理不过来，造成卡顿。
- **核心目标**：优化游戏性能的关键之一就是 **减少 Draw Call**。

####  影响因素

- **首要因素**：**材质**。使用不同材质的物体几乎无法合并，会导致多个 Draw Call。
- **渲染顺序**：渲染队列被不同材质的物体打断，会阻止合批。
- **动态/静态**：静态物体（标记 `Static`）有更多优化手段。

#### 优化策略 (减少 Draw Call)

| 策略                  | 原理                                       | 适用场景                             | 注意                                     |
| :-------------------- | :----------------------------------------- | :----------------------------------- | :--------------------------------------- |
| **批处理 (Batching)** | 将相同材质的物体合并渲染                   | 通用                                 | 减少Draw Call的核心手段                  |
| ↳ **静态批处理**      | 将**静态**(`Static`)物体在运行前合并网格   | 场景中不动的物体（建筑、地形）       | **大幅提升性能**，但会增加内存占用       |
| ↳ **动态批处理**      | Unity运行时自动合并**小型、移动的**物体    | 顶点数很少的移动物体（如方块、精灵） | 限制极多，效果有限                       |
| **GPU Instancing**    | 1个DrawCall绘制多个**完全相同**的网格/材质 | 大量重复物体（树木、草、石头）       | 性能极高，比静态批处理更省内存           |
| **图集 (Atlas)**      | 将多个小纹理打包到一张大纹理中             | UI、2D精灵、GUI                      | **使用同一张纹理=使用同一材质=可以合批** |
| **合并材质**          | 让多个物体共享**同一个材质实例**           | 所有场景                             | 避免不必要的材质复制                     |

#### 如何查看？

- 在 Game 视图运行时，点击 **Stats** 按钮。
- 关注关键数据：**Batches**: 近似等于 **Draw Call 数量**（核心指标）。
  - **Saved by batching**: 批处理为你节省的 Draw Call 数，越高越好。
  - **SetPass calls**: 渲染状态切换次数，也是重要性能指标。

## 2D效应器

Unity 2D 效应器是一组与 2D 碰撞体协同工作的强大组件，能够创造出丰富多样的物理交互效果，是提升 2D 游戏动态感和趣味性的关键工具。**需要对GameObject添加碰撞器**

| 效应器名称                            | 主要功能描述                                                 | 典型应用场景                                                 |
| :------------------------------------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **Area Effector 2D (区域效应器)**     | 在特定区域内（由碰撞体定义）施加一个指定方向和大小的力。     | 模拟蹦床、风洞、龙卷风等定向力场。                           |
| **Point Effector 2D (点效应器)**      | 从一个点源发出吸引力或排斥力，力的大小和模式可调。           | 创建黑洞、磁铁、星球引力、鼓风机效果。                       |
| **Surface Effector 2D (表面效应器)**  | 沿碰撞体表面施加力，使物体沿着表面移动。                     | 制作传送带、移动平台。                                       |
| **Platform Effector 2D (平台效应器)** | 实现单向碰撞，允许物体从特定方向穿过平台。**不需要再colider组件勾选IsTrigger，需要产生碰撞** | 2D 平台游戏中的平台，角色可从下方跳上来，但从上方向下落体时会站在平台上。 |
| **Buoyancy Effector 2D (浮力效应器)** | 模拟浮力和流体动力学，如密度、流动和阻力。                   | 制作水面、浮筒、流动的河水或岩浆。                           |

### 如何使用效应器

1. **添加碰撞体与效应器**：首先为 GameObject 添加一个 2D 碰撞体（如 `Box Collider 2D`）以定义作用区域，然后添加所需的效应器组件 。
2. **启用 Used By Effector**：**这是关键一步**。在已附加的 2D 碰撞体组件上，务必勾选 **“Used By Effector”** 选项，效应器才能通过该碰撞体生效。
3. **设置触发器（Trigger）属性**：对于 **点效应器** 和 **区域效应器**，通常需要将其关联的碰撞体设置为**触发器（Is Trigger）**，这样其他物体可以进入其区域并持续受到力的影响。而 **表面效应器** 和 **平台效应器** 通常保持碰撞体为非触发器，以确保有明确的接触表面。
4. **调整参数**：在 Inspector 窗口中根据需求详细调整效应器的各项参数。

### 关键参数

- **点/区域效应器的力模式（Force Mode）**：这个参数决定了力随距离变化的衰减方式。例如，可以选择恒定力、线性衰减或平方反比衰减，根据你想模拟的物理现象（如恒定的风阻、与距离平方成反比的引力）进行选择。
- **表面效应器的力缩放（Force Scale）**：此参数建议设置为小于 1 的值（如 0.5），以避免效应器施加的力完全覆盖角色自身的物理运动（如跳跃力），导致控制失灵。值越低，达到目标速度越慢；值越高，越快，但容易抵消其他力。
- **平台效应器的表面弧度（Surface Arc）**：这个参数定义了平台表面允许单向碰撞的角度范围。调整它可以精确控制角色从哪个角度可以站上平台。
- **浮力效应器的密度（Density）与水面（Surface Level）**：物体的浮沉状态由物体自身的质量（Rigidbody 2D 的 `Mass`属性）与流体的 `Density`属性共同决定。`Surface Level`则定义了流体的表面高度。

## 瓦片地图

## FSM（有限状态机）和BT（行为树）

| 对比维度         | 有限状态机 (FSM)                                             | 行为树 (BT)                                                  |
| :--------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **核心哲学**     | **状态驱动**：AI行为由明确的、互斥的“状态”定义。             | **任务驱动**：AI行为通过树形结构组织任务，自顶向下决策。     |
| **结构模型**     | **图状结构**：节点是状态，边是状态间的转换条件。             | **树状结构**：由根节点、控制节点、条件节点和动作节点构成。   |
| **复杂度管理**   | 状态增多后，转换条件会呈指数级增长，导致“**状态爆炸**”，难以维护。 | 通过子树和节点复用降低复杂度，**天然适合管理复杂逻辑**。     |
| **模块化与复用** | 状态间耦合高，修改一个状态可能影响其他状态，**复用性差**。   | 节点高度独立，易于复用和动态替换，**模块化程度高**。         |
| **灵活性**       | 转换条件硬编码，**灵活性低**。增加新行为常需修改现有结构。   | 通过调整节点组合即可改变AI行为，**扩展性极强**，新增行为对现有逻辑影响小。 |
| **调试直观性**   | 状态少时直观；状态多时，转换关系错综复杂，**调试困难**。     | 树形结构层次清晰，可实时显示活跃节点，**便于追踪执行流程**。 |
| **典型适用场景** | 行为逻辑简单、状态明确且转换固定的AI，如门的开关、简单的小怪。 | 行为复杂、需要动态优先级和中断机制的角色，如开放世界NPC、RTS游戏单位、复杂Boss。 |

- **优先选择 FSM 的情况**：你的AI逻辑非常简单（状态数通常**少于5个**），状态转换规则固定，例如一个只会“巡逻→发现玩家→追击→攻击”的小怪。或者，你需要**快速原型验证**，并且对**性能有极致要求**（FSM通常开销极低）。
- **优先选择行为树的情况**：你的AI行为复杂，需要处理大量的**条件判断和优先级**（例如，“血量低时逃跑，否则攻击；若队友求助则优先支援”）。或者，你预计AI逻辑在未来会**频繁扩展或修改**，行为树的模块化特性将使维护变得轻松。此外，在**团队协作**中，行为树的分工合作更便利。
- **考虑混合使用**：在许多大型游戏中，通常会采用混合架构。例如，用一个高层级的**FSM管理宏观状态**（如“空闲”、“战斗”、“休息”），然后在每个状态内部，使用一棵**行为树来处理该状态下的具体决策和动作**。这样既能利用FSM管理大状态切换的简洁性，又能享受行为树处理复杂子逻辑的灵活性。

### 行为树

| 节点类型                   | 核心功能与规则                                               | 经典应用场景                                                 |
| :------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **控制节点 (Composite)**   | 管理多个子节点的执行流程。                                   | 组织行为序列或提供备选方案。                                 |
| ┣ 顺序节点 (Sequence)      | **依次**执行子节点，**全部成功则成功**，**任一失败则立即失败**。 | 定义一连串必须按顺序完成的动作，如“发现敌人→靠近→攻击”。     |
| ┣ 选择节点 (Selector)      | **依次尝试**子节点，**任一成功则成功**，全部失败才失败。也称“回退节点”(Fallback)。 | 实现优先级决策，如“优先攻击→若失败则寻找掩体→若再失败则逃跑”。 |
| ┗ 并行节点 (Parallel)      | **同时执行**所有子节点，根据预设策略（如全部成功/任一成功）决定最终结果。 | 处理需同时进行的行为，如“一边移动一边播放脚步声并检测周围环境”。 |
| **装饰节点 (Decorator)**   | **只能有一个子节点**，用于修饰或改变该子节点的行为。         | 增加循环、条件判断、结果反转等控制逻辑。                     |
| ┣ 取反器 (Inverter)        | 反转子节点的返回结果：成功变失败，失败变成功。               | 检查“是否没有敌人”这类否定条件。                             |
| ┣ 重复器 (Repeater)        | 重复执行子节点指定次数或无限循环。                           | 让角色持续巡逻，或限制某个动作（如破门）的最大尝试次数。     |
| ┣ 直到成功 (Until Success) | 反复执行子节点，直到其返回成功。                             | 持续尝试某个行为直到达成，如“一直寻路直到找到可达路径”。     |
| ┗ 冷却 (Cooldown)          | 为子节点添加冷却时间，执行一次后需等待一段时间才能再次执行。 | 限制技能或特殊动作的使用频率，使其更合理。                   |
| **叶节点 (Leaf)**          | 行为树的“叶子”，是最终执行具体任务的节点。                   | 实现具体的游戏逻辑。                                         |
| ┣ 条件节点 (Condition)     | 检查某个游戏状态是否成立（如“生命值低于30%”），立即返回成功或失败。 | 作为行为执行的先决条件，不改变游戏状态。                     |
| ┗ 动作节点 (Action)        | 执行具体的行为（如“移动”、“攻击”），可能需要多帧完成，可返回运行中(Running)。 | 实现AI的具体动作，是行为树影响游戏世界的出口。               |

1. **执行流程：Tick与遍历**

   游戏运行时，每一帧（或每隔几帧）都会从**根节点（Root）** 出发，对行为树进行一次更新，这个过程称为一次 **“Tick”** 。系统会自顶向下、从左到右地遍历整棵树，根据每个节点的规则决定执行路径，最终激活一个或多个**叶节点**来执行具体任务 。

2. **核心状态：成功、失败与运行中**

   每个节点执行后都会返回三种状态之一 ：

   - **成功（Success）**：该节点代表的任务已顺利完成。
   - **失败（Failure）**：该节点代表的任务无法完成。
   - **运行中（Running）**：该节点代表的任务正在执行中，尚未结束（例如一个“行走”动作正在途中）。这是行为树支持**持续多帧行为**的关键 。

3. **数据共享：黑板（Blackboard）**

   为了在不同节点间共享信息（如敌人的位置、自身的状态），行为树通常配备一个称为 **“黑板”（Blackboard）** 的共享数据存储系统 。节点可以从黑板读取数据（如“目标坐标”），也可以将结果写入黑板（如“当前状态：受伤”），从而实现复杂的决策。

### 🆚 与有限状态机（FSM）的核心区别

为了更好地理解行为树的优势，可以将其与另一种常见的AI架构——有限状态机（FSM）进行对比。

| 对比维度       | 行为树 (Behavior Tree)                                       | 有限状态机 (FSM)                                             |
| :------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **核心哲学**   | **任务驱动**的树形结构，通过组合节点逻辑来决策。             | **状态驱动**的图状结构，在预设的、互斥的状态间转换。         |
| **复杂度管理** | **模块化程度高**，节点可独立设计和复用，易于扩展，适合复杂AI。 | 状态增多后，状态间的转换线会急剧增加，导致“**状态爆炸**”，难以维护。 |
| **决策方式**   | **主动轮询（Polling）**：每帧从根节点重新评估，根据当前条件选择最优路径。 | **事件驱动（Event-Driven）**：通常在收到特定事件（如“被攻击”）后触发状态转换。 |
| **灵活性**     | **高**。通过调整节点组合即可大幅改变AI行为，无需重写底层逻辑。 | **低**。增加新状态或转换规则通常需要修改现有代码结构，容易引入错误。 |

简单来说，**FSM更适合行为简单、固定的AI**（比如一个只有“闲置”“攻击”两种状态的炮台）。而**当AI行为变得复杂，需要多种条件判断和优先级选择时，行为树的模块化和可扩展性优势就非常明显了**。

## Unity协同程序

**请不要使用Unity自带的协程协调器开启协程，通过迭代器函数实现每隔一秒执行函数的一部分逻辑**

**核心原理**：

- 不调用 Unity 的`StartCoroutine`，而是在`Update`中轮询迭代器队列。
- 用`Time.time`记录下次执行时间，当当前时间≥目标时间时，调用`MoveNext()`执行迭代器下一步。
- `yield return 1` 作为约定，代表延迟 1 秒执行下一段逻辑。

**队列管理**：

- 用`List<(IEnumerator, float)>`存储迭代器和对应的下次执行时间，倒序遍历避免删除元素时索引异常。
- 迭代器执行完毕（`MoveNext()`返回 false）或出错时，自动从队列移除。

```C#
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CustomCoroutineMgr : MonoBehaviour
{
    // 单例（保证全局唯一）
    private static CustomCoroutineMgr _instance;
    public static CustomCoroutineMgr Instance => _instance;

    // 存储待执行的迭代器及对应的时间戳（迭代器 + 下次执行时间）
    private readonly List<(IEnumerator coroutine, float nextExecuteTime)> _coroutineQueue = new List<(IEnumerator, float)>();

    void Awake()
    {
        if (_instance == null)
        {
            _instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else if (_instance != this)
        {
            Destroy(gameObject);
        }
    }

    void Update()
    {
        // 每帧检查所有待执行的迭代器，满足时间条件则执行
        UpdateAllCoroutines();
    }

    /// <summary>
    /// 启动自定义分步执行逻辑（完全脱离Unity原生协程）
    /// </summary>
    /// <param name="coroutine">迭代器函数</param>
    public void StartCustomCoroutine(IEnumerator coroutine)
    {
        if (coroutine == null)
        {
            Debug.LogWarning("迭代器不能为空！");
            return;
        }
        // 初始执行时间：立即执行第一步
        _coroutineQueue.Add((coroutine, Time.time));
    }

    /// <summary>
    /// 每帧更新所有自定义协程
    /// </summary>
    private void UpdateAllCoroutines()
    {
        // 倒序遍历，避免删除元素时索引错乱
        for (int i = _coroutineQueue.Count - 1; i >= 0; i--)
        {
            var (coroutine, nextTime) = _coroutineQueue[i];
            
            // 检查是否到达执行时间
            if (Time.time >= nextTime)
            {
                try
                {
                    // 执行迭代器下一步，返回false说明执行完毕
                    bool hasNext = coroutine.MoveNext();
                    if (hasNext)
                    {
                        // 获取yield return的值（这里约定返回int表示延迟秒数）
                        object current = coroutine.Current;
                        if (current is int delaySeconds)
                        {
                            // 更新下次执行时间：当前时间 + 延迟秒数
                            _coroutineQueue[i] = (coroutine, Time.time + delaySeconds);
                        }
                        else
                        {
                            // 非int类型默认延迟1秒（或根据需求调整）
                            _coroutineQueue[i] = (coroutine, Time.time + 1f);
                        }
                    }
                    else
                    {
                        // 迭代器执行完毕，从队列移除
                        _coroutineQueue.RemoveAt(i);
                    }
                }
                catch (Exception e)
                {
                    Debug.LogError($"自定义协程执行出错：{e.Message}");
                    _coroutineQueue.RemoveAt(i);
                }
            }
        }
    }

    /// <summary>
    /// 停止所有自定义协程
    /// </summary>
    public void StopAllCustomCoroutines()
    {
        _coroutineQueue.Clear();
    }
}
```


