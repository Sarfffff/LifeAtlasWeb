---
title: 麦田物语
date: 2026-06-27 03:52:00
categories:
  - 图形与引擎
tags:
  - GameEngineStudy
  - 笔记
---
# 场景切换

## 创建TransitionManager控制人物的场景切换

 在游戏中，我们存在多个场景，我们需要进入不同的场景，以便游戏的游玩性。对于场景的管理，我们使用事件来进行管理，对于每一个场景，我们都设置一个进入的以及出去的碰撞体，每当碰撞体的碰撞器检查到玩家后，开始进行场景的切换，将玩家的位置传送到指定的场景中。在切换场景的时候，我们需要对当前场景的物体也进行管理，因为当前的场景需要被卸载，新场景的加载需要时间，可能会在新场景加载进行访问，就可能找不到相应的物体，进而报空。

**例如，当新场景加载时，原有场景被卸载，场景中的相机可能无法访问到新场景的边界信息，因为新场景还未被加载完成，所有会报空，所有我们需要在新场景加载完成后，重新获取场景的边界，这个时候就需要事件处理**

具体实现场景切换的逻辑：在Hierarchy窗口中创建一个空物体，让其携带碰撞体的组件，将其的位置移动到需要进行场景切换的位置，同时挂载Teleport脚本。每当检测到玩家的碰撞器，进行场景切换

**Teleport**

```C#
namespace MFarm.Transition
{
    public class Teleport : MonoBehaviour
    {
        [SceneName]  //标记类，将下面的第一个属性进行标记，说明其需要特殊显示，实现其下拉
        public string sceneToGo;
        public Vector3 positionToGo;
        private void OnTriggerEnter2D(Collider2D other)
        {
            if (other.CompareTag("Player"))
            {
                EventHandler.CallTransitionEvent(sceneToGo, positionToGo);
            }
        }
    }
}
```

**TransitionManager类**

```C#
namespace MFarm.Transition
{
    public class TransitionManager : Singleton<TransitionManager>,ISaveable
    {
        [SceneName]//自己编写的Unity辅助功能标记
        public string startSceneName = string.Empty;
        protected override void Awake()
        {
            base.Awake();
            SceneManager.LoadScene("UI", LoadSceneMode.Additive);
        }
        private void Start()
        {
            ISaveable saveable = this;
            saveable.RegisterSaveable();
            fadeCanvasGroup = FindObjectOfType<CanvasGroup>();
        }
        private void OnEnable()
        {
            EventHandler.TransitionEvent += OnTransitionEvent;
        }
        private void OnDisable()
        {
            EventHandler.TransitionEvent -= OnTransitionEvent;

        }
        
        private void OnTransitionEvent(string sceneToGo, Vector3 positionToGo)
        {
            StartCoroutine(Transition(sceneToGo, positionToGo));
        }

        /// <summary>
        /// 场景切换
        /// </summary>
        /// <param name="sceneName">目标场景</param>
        /// <param name="targetPosition">到达目标场景的位置</param>
        /// <returns></returns>
        private IEnumerator Transition(string sceneName,Vector3 targetPosition)
        {
            EventHandler.CallBeforeSceneUnloadEvent();//先执行一下卸载场景之前要做的事儿，加载所有的订阅了该委托的方法

            yield return SceneManager.UnloadSceneAsync(SceneManager.GetActiveScene());//卸载掉当前场景
            
            yield return LoadSceneSetActive(sceneName);//加载新的场景
            //移动人物坐标
            EventHandler.CallMoveToPosition(targetPosition);//场景加载好了就把人物挪过去
            EventHandler.CallAfterSceneLoadedEvent();//加载场景之后又需要做一些事件

        }
        /// <summary>
        /// 加载场景并设置为激活
        /// </summary>
        /// <param name="sceneName">加载的场景名</param>
        /// <returns></returns>
        private IEnumerator LoadSceneSetActive(string sceneName)//所有的场景切换，加载都需要使用协程的异步加载来保障场景加载切换的流畅和安全
        {
            yield return SceneManager.LoadSceneAsync(sceneName, LoadSceneMode.Additive);//异步加载(加载的场景名,加载的模式:叠加)此时只是加载了场景但是没有激活
            //叠加模式:一个项目中同时存放着许多场景叠加在一起，一个场景激活其他场景就处于非激活状态
            //单独模式:一个项目中一次性只加载一个场景，切换场景时其他场景切换进来，当前场景切换出去
            Scene newScene = SceneManager.GetSceneAt(SceneManager.sceneCount - 1);//获取放入到场景管理器里的当前场景
            SceneManager.SetActiveScene(newScene);//激活场景
        }
    }
}
```

同时，我们也需要事件的管理，在场景卸载前以及在场景加载后，写在EventHandler中。使用订阅-发布者模式，一个委托提供很多方法进行订阅，在调用委托时，执行所有订阅后的方法

```C#
    public static event Action<string, Vector3> TransitionEvent;//场景切换委托事件
    public static void CallTransitionEvent(string sceneName,Vector3 pos)
    {
        TransitionEvent?.Invoke(sceneName, pos);
    }
    public static event Action BeforeSceneUnloadEvent;//场景卸载之前需要触发一些事件来避免报错
    public static void CallBeforeSceneUnloadEvent()
    {
        BeforeSceneUnloadEvent?.Invoke();
    }
    public static event Action AfterSceneLoadedEvent;//加载场景之后需要触发一些事件来切换数据
    public static void CallAfterSceneLoadedEvent()
    {
        AfterSceneLoadedEvent?.Invoke();
    }
    public static event Action<Vector3> MoveToPosition;//切换场景人物移动到指定位置委托事件
    public static void CallMoveToPosition(Vector3 targetPosition)
    {
        MoveToPosition?.Invoke(targetPosition);
    }
```

## 自定义场景名称

在每个场景中我们都会场景一个挂载碰撞器的空物体用于场景切换，在该物体上，会手动设置跳转场景的名称以及坐标。场景名称是手动输入的字符串，容易出错，通过自定义属性，我们可以创建一个下拉列表，直接选择场景，避免手动输入错误。为了实现上述操作，**我们使用SceneNameAttribute类作为标记类，继承自PropertyAttribute，提供一个标记。SceneNameDrawer是实际的自定义绘制器，使用CustomPropertyDrawer特性标记，指定它要处理SceneNameAttribute类型的属性，继承自PropertyDrawer，用于自定义Inspector中的属性显示**

具体的实现：

- 从EditorBuildSettings获取所有场景

- 将场景路径转换为场景名称

- 创建一个下拉列表供用户选择

- 当选择改变时，更新属性的值

**SceneNameAttribute类：**首先获取到所有的场景，将场景进行自定义分隔，得到完整的场景名称，检测是否得到完整的场景名称，如果得到了，则将其装入属性值中，提供EditorGUI.Popup，在Unity中生成下拉菜单列表，实现自定义的场景名称选择

```C#
[CustomPropertyDrawer(typeof(SceneNameAttribute))]//自定义属性绘制器
public class SceneNameDrawer : PropertyDrawer
{
    int sceneIndex = -1;
    GUIContent[] sceneNames;

    readonly string[] scenePathSplit = { "/", ".unity" };//场景路径分割符

    /// <summary>
    /// 在Inspector中绘制场景名称   
    /// </summary>
    /// <param name="position">位置</param>
    /// <param name="property">属性</param>
    /// <param name="label">标签</param>
    public override void OnGUI(Rect position, SerializedProperty property, GUIContent label)
    {
        if (EditorBuildSettings.scenes.Length == 0) return;//如果场景数量为0，则返回

        if (sceneIndex == -1)
            GetSceneNameArray(property);

        int oldIndex = sceneIndex;

        sceneIndex = EditorGUI.Popup(position, label, sceneIndex, sceneNames);//下拉弹出列表

        if (oldIndex != sceneIndex)
            property.stringValue = sceneNames[sceneIndex].text;
    }
/// <summary>
/// 获取场景名称数组
/// </summary>
/// <param name="property">属性</param>
    private void GetSceneNameArray(SerializedProperty property)
    {
        var scenes = EditorBuildSettings.scenes;//获取场景列表
        //初始化数组
        sceneNames = new GUIContent[scenes.Length];//初始化场景名称数组

        for (int i = 0; i < sceneNames.Length; i++)//遍历场景列表
        {
            string path = scenes[i].path;//获取场景路径
            string[] splitPath = path.Split(scenePathSplit, System.StringSplitOptions.RemoveEmptyEntries);//分割路径

            string sceneName = "";//场景名称

            if (splitPath.Length > 0)//如果分割路径长度大于0（代表有场景名称）
            {
                sceneName = splitPath[splitPath.Length - 1];//获取场景名称
            }
            else
            {
                sceneName = "(Deleted Scene)";//如果分割路径长度为0，则设置为(Deleted Scene)
            }
            sceneNames[i] = new GUIContent(sceneName);//将分隔后的场景名称设置到场景名称数组中
        }

        if (sceneNames.Length == 0)//如果场景名称数组长度为0（代表没有场景）
        {
            sceneNames = new[] { new GUIContent("Check Your Build Settings") };//设置为(Check Your Build Settings)
        }

        if (!string.IsNullOrEmpty(property.stringValue))//如果属性值不为空（代表有场景名称）
        {
            bool nameFound = false;//是否找到场景名称

            for (int i = 0; i < sceneNames.Length; i++)//遍历场景名称数组
            {
                if (sceneNames[i].text == property.stringValue)//如果场景名称数组中的文本等于属性值
                {
                    sceneIndex = i;//设置场景索引
                    nameFound = true;//设置找到场景名称
                    break;//跳出循环
                }
            }
            if (nameFound == false)//如果未找到场景名称
                sceneIndex = 0;//设置场景索引为0
        }
        else//如果属性值为空
        {
            sceneIndex = 0;//设置场景索引为0
        }
        property.stringValue = sceneNames[sceneIndex].text;//将场景名称设置到属性值中
    }
}
```

**SceneNameAttribute类：**只作为一个标记类，*// 定义标记类时使用Attribute后缀*，*// 使用时可以省略Attribute后缀*   [SceneName] *// 等同于 [SceneNameAttribute]*，将 [SceneName] 下面的第一个属性进行标记，说明其需要进行特殊显示

```C#
/// <summary>
/// 自定义属性，用于在Inspector中显示场景名称
/// </summary>
public class SceneNameAttribute : PropertyAttribute//可以在其他类使用SceneName进行标记
{
        public const float fadeDuration = 1.5f;//场景切换动画持续事件
}
```

## 场景切换淡入淡出和动态UI显示

在进行场景切换时，我们需要实现一个淡入以及淡出的效果，以便平滑的过渡场景的转换。为了实现淡入淡出的效果，我们在UI场景中创建一个panel作为场景切换的图片，将其的图片默认颜色设置为黑色，alpha设置为不透明（255），同时在该panel下设置一个场景切换的文本，提示玩家下一个场景正在加载，以及一个过场动画，使用Animator来进行动画的播放。实现了淡入的效果的，在淡出时，我们协程方法平滑降低panel的alpha值，实现黑色背景逐渐透明。

**Setting类：**

```C#
public class Settings //自己编写的一个静态设置类，相当于写了一个设置按钮来控制工程里面需要经常使用的常量或者函数
{                 //只不过是通过代码的形式呈现出的设置按钮，当游戏中的一个效果需要改变时，直接到设置里面来设置一样
{
```

**TransitionManager类：**

```C#
public class TransitionManager{
    private CanvasGroup fadeCanvasGroup;
    private bool isFade;
    private void Start(){
        fadeCanvasGroup = FindObjectOfType<CanvasGroup>();
    }
    private IEnumerator Transition(string sceneName,Vector3 targetPosition)
    {
            EventHandler.CallBeforeSceneUnloadEvent();//先执行一下卸载场景之前要做的事儿，加载所有的订阅了该委托的方法
			Fade(1);
            yield return SceneManager.UnloadSceneAsync(SceneManager.GetActiveScene());//卸载掉当前场景
            
            yield return LoadSceneSetActive(sceneName);//加载新的场景
            //移动人物坐标
            EventHandler.CallMoveToPosition(targetPosition);//场景加载好了就把人物挪过去
            EventHandler.CallAfterSceneLoadedEvent();//加载场景之后又需要做一些事件
            Fade(0);

    }    
    private IEnumerator Fade(float targetAlpha)//场景切换时的加载转换动画更适合用协程来完成
    {
            isFade = true;//开始阿尔法值转换
            fadeCanvasGroup.blocksRaycasts = true;//开启鼠标遮挡,场景加载时鼠标不能点击任何物品
            float speed = Mathf.Abs(fadeCanvasGroup.alpha - targetAlpha) / Settings.fadeDuration;//获得一个阿尔法变透明的速度
            while (!Mathf.Approximately(fadeCanvasGroup.alpha, targetAlpha))//当当前阿尔法值不等于目标阿尔法值就会一直执行动画转换
            {
                fadeCanvasGroup.alpha = Mathf.MoveTowards(fadeCanvasGroup.alpha, targetAlpha, speed * Time.deltaTime);
                yield return null;
            }
                fadeCanvasGroup.blocksRaycasts = false;//动画执行完毕,关闭鼠标遮挡
                isFade = false;
    }
}
```

## 保存和加载场景中的物品

在场景切换的过程中，我们没有保存场景中的物品的情况。例如，当我们拾取场景中的物品后，切换场景，在切换回来，场景中的物品又可以再次拾取。为此，我们需要实现场景中的物品保存功能。

*在DataCollection类中，定义场景物品的坐标属性以及物品的ID（物品的ID可以获得物品的所有信息），在ItemManager类中，使用字典来进行操作，字典的第一个变量存代表场景的名称，第二个代表场景中的物品列表。有了基本的存储的数据结构后，首先需要获取场景所有的物品列表，在GetAllSceneItems（）方法进行实现，定义一个临时的场景物品列表，使用FindObjectsOfType<Item>()找到场景中的所有物品，将物品的ID和位置传入临时的列表中，这样就得到所有的物品(foreach遍历)，得到所有的物品，在字典检测是否存在该场景，如果存在，则将更新场景中的物品列表，不存在，则将场景以及物品列表存入字典*

*在上述得到场景中的所有物品后，我们需要加载场景中的物品。同样定义一个临时的物品列表，使用字典自带的TryGetValue方法判断字典中的当前场景是否存在物品，存在则将物品列表赋值给临时的物品列表。如果临时的物品列表不为空，则说明场景中有物品，我们则将其在场景生成（存储物品的位置）*

**ItemManager类**

```C#
public class ItemManager{
    private Dictionary<string ,List<SceneItem>>sceneItemDict = new Dictionary<string, List<SceneItem>>()//第一个变量是场景的名字，第二个是场景中的物品列表
    
        //进行事件调用，订阅事件。在场景卸载和加载时，调用事件，将订阅事件的所有方法进行执行。
        private void OnEnable()
        {
            EventHandler.BeforeSceneUnloadEvent += OnBeforeSceneUnloadEvent;
            EventHandler.AfterSceneLoadedEvent += OnAfterSceneLoadedEvent;
        }
        private void OnDisable()
        {
            EventHandler.BeforeSceneUnloadEvent -= OnBeforeSceneUnloadEvent;
            EventHandler.AfterSceneLoadedEvent -= OnAfterSceneLoadedEvent;;
        }
        private void OnBeforeSceneUnloadEvent()  //旧场景卸载前，得到场景中物品
        {
            GetAllSceneItems();
        }

        private void OnAfterSceneLoadedEvent()  //新场景加载后调用，重新创建新物品
        {
            RecreateAllItems();
        }
        
    //得到当前场景中所有物品
    private void GetAllSceneItems(){
        List<SceneItem> currentSceneItems = new List<SceneItem>();  //定义临时的存储场景中物品变量
        foreach(var Item in FindObjectsOfType<Item>()){  //遍历场景中的物品
			SceneItem sceneItem = new SceneItem {
                ItemID = Item.itemID；
                position = new SerializableVector3(Item.transform.position);
            }
            currentSceneItems.Add(sceneItem);
        }
        // 检查当前场景是否已经在字典中
        if (sceneItemDict.ContainsKey(SceneManager.GetActiveScene().name))
        {
            // 如果场景已存在，更新该场景的物品列表
            sceneItemDict[SceneManager.GetActiveScene().name] = currentSceneItems;
        }
        else
        {
            // 如果是新场景，添加新的场景和物品列表
            sceneItemDict.Add(SceneManager.GetActiveScene().name, currentSceneItems);
        }
    }
    
    //生成场景中的所有物品
    private void RecreateAllItems(){
		List<SceneItem> currentSceneItems = new List<SceneItem>();  //定义临时的存储场景中物品变量
        ////out currentSceneItems:反向输出,如果之前的bool为true则反向输出currentSceneItems将sceneItemDict的Value输出到currentSceneItems中
        if (sceneItemDict.TryGetValue(SceneManager.GetActiveScene().name,out currentSceneItems)){   //检测当前中是否存在物品，如果有则将当前场景中的物品赋值给currentSceneItems
			if(currentSceneItems!=null){
                //无论当前场景中是否存在物品，都进行清理，因为进行匹配过于麻烦
				foreach(var Item in FindObjectsOfType<Item>()){
					Destroy(Item.gameobject);
                }
                foreach)(var Item in currentSceneItems){
					 Item newItem = Instantiate(itemPrefab, item.position.ToVector3(), Quaternion.identity, itemParent);
                     newItem.Init(item.ItemID);
                }
            }
        }
    }
}
```

**DataCollection类**

```C#
[System.Serializable]
//该类代表在场景中物体的坐标类
public class SerializableVector3{  //unity中Vector3变量默认是不能被序列化的，自定义序列化Vector3
	public float x,y,z;
    public SerizlizableVector3(Vector3 pos){
        x = pos.x;
        y = pos.y;
        z = pos.z;
    }
    public Vector3 ToVector3(){
        return new Vector3(x, y, z);
	}
    
    public Vector2Int ToVector2Int()//只返回x,y且为整形
    {
        return new Vector2Int((int)x, (int)y);
    }
}
[System.Serializable]
public class SceneItem{   //场景中物品（物品Id，物品在场景中坐标）
    public int ItemID;
    public SerializableVector3 position；
}

```

# 设置鼠标指针根据物品调整

在游戏中，我们会有一个独属于

```C#
public class CursorManager : MonoBehaviour
{
    public Sprite normal,seed,item,tool;
    public Sprite currentSprite;
    private RectTransform cursorCanvas;
    public Image cursorImage;
    private void Start(){
	cursorCanvas = GameObject.FindGameObjectWithTag("CursorCanvas").GetComponent<RectTransform>();//获取CursorCanvas的RectTransform
   	cursorImage = cursorCanvas.GetChild(0).GetComponent<Image>();// 获取CursorCanvas的第一个子对象的Image组件
    currentSprite = normal; 
    SetCursorImage(normal);//默认传入normal图片
    }
    
    private void OnEnable()
    {
        EventHandler.ItemSelectedEvent += OnItemSelectedEvent;//注册一个当选择物品的时候触发的事件      
    }
    private void OnDisable()
    {
        EventHandler.ItemSelectedEvent -= OnItemSelectedEvent;       
    }

    
    private void Update(){
         if (cursorCanvas == null)
            return;
		 cursorImage.transform.position = Input.mousePosition;//图片始终跟随鼠标移动
        
       SetCursorImage(currentSprite);
    }
    
    private void SetCursorImage(Sprite sprite)  
    {
        cursorImage.sprite = sprite;
        cursorImage.color = new Color(1, 1, 1, 1);
    }
    
    private void OnItemSelectedEvent(ItemDetails itemDetails, bool isSelected)
    {   //根据选择的物品使用不同的cursor图片
    	if(!isSelected){  //没有选择的物品后,默认图片是normal
            currentSprite = normal;
		}
        else{   //物品被选择才会有图片
            currentSprite = itemDetails.itemType switch{
            ItemType.seed =>seed;
            ItemType.item =>seed;
            ItemType.tool =>seed;
            _=>normal;
        	}  
        }
    }
    
    private bool InteractWithUI{   //判断是否与UI交互
		if (EventSystem.current != null && EventSystem.current.IsPointerOverGameObject()){
			return true;
        }
        return false;
    }
    
}
```

# 构建地图信息系统	

在game中，我们需要在鼠标在点击地图不同的位置能显示我们能在此处干什么，在此处则不可以。

1.创建自定义的瓦片地图，存储每个瓦片的功能逻辑。

2. 使用Grid Information脚本，获取和显示瓦片地图信息的脚本

```C#

```

