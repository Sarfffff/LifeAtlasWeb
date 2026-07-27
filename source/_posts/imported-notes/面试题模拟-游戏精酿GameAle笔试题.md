---
title: 游戏精酿GameAle笔试题
date: 2026-06-27 05:03:00
categories:
  - 面试准备
tags:
  - 面试题模拟
  - 笔记
---
## GameAle - U3D客户端（重庆）笔试

#### 题一：[删除链表的倒数第 N 个结点](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

![image-20251125213449120](/notes-assets/%E9%9D%A2%E8%AF%95%E9%A2%98%E6%A8%A1%E6%8B%9F/assets/image-20251125213449120.png)

```C#
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     public int val;
 *     public ListNode next;
 *     public ListNode(int val=0, ListNode next=null) {
 *         this.val = val;
 *         this.next = next;
 *     }
 * }
 */
public class Solution {
    public ListNode RemoveNthFromEnd(ListNode head, int n) {
        ListNode cur = head;
        if(head == null) return null;
        int N = 0;  //链表长度
        while(cur != null){
            cur = cur.next;
            N++;
        }
        int m = N - n;  //倒数第n个，变为 总长度 - 倒数第n个
        
        //边界条件
        if(m == 0){
            ListNode newHead = head.next;
            head.next = null; 
            return newHead;
        }
        cur = head; //更新
        while(m > 1){  //刚好找到要删除节点的前一个节点
            cur = cur.next;      
            m--;
        }
        ListNode ToDelete = cur.next;
        if(ToDelete != null){
            cur.next = ToDelete.next;
            ToDelete.next = null;
        }
        return Head;
    }
}
```



#### 题二：[二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

![image-20251125214017297](/notes-assets/%E9%9D%A2%E8%AF%95%E9%A2%98%E6%A8%A1%E6%8B%9F/assets/image-20251125214017297.png)

```C#
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     public int val;
 *     public TreeNode left;
 *     public TreeNode right;
 *     public TreeNode(int val=0, TreeNode left=null, TreeNode right=null) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
public class Solution {
    public int MaxDepth(TreeNode root) {
 		if(root == null)
            return 0;
        int DepthL = MaxDepth(root.left);
        int DepthR = MaxDepth(root.right);
        return Math.Max(DepthL,DepthR) + 1;
    }
}
```



#### 题三：值类型和引用类型的区别

| 对比维度        | 值类型（Value Type）                            | 引用类型（Reference Type）                 |
| --------------- | ----------------------------------------------- | ------------------------------------------ |
| 存储方式        | 直接存储 **数据本身**                           | 存储 **数据的内存地址（引用 / 指针）**     |
| 内存分配位置    | 栈（Stack，少数例外如 C# 的 `struct` 嵌入对象） | 堆（Heap）（引用存在栈上，数据存在堆上）   |
| 赋值 / 传参逻辑 | 拷贝 **完整数据副本**                           | 拷贝 **引用地址副本**（指向同一份堆数据）  |
| 默认值          | 零值（如 `0`、`false`、`'\0'`）                 | 空引用（如 `null`、`nil`）                 |
| 生命周期        | 随作用域销毁（栈自动释放）                      | 堆数据需垃圾回收（GC）或手动释放（如 C++） |
| 内存开销        | 小（仅数据本身）                                | 大（含引用 + 堆数据 + GC 额外开销）        |
| 线程安全        | 天然安全（副本独立）                            | 需同步（多线程共享同一份堆数据）           |



#### 题四：Lod和MipMap的区别

LOD（Level of Detail，细节层次）和 MipMap（纹理多级渐远）是 Unity 中 **优化渲染性能** 的两种核心技术，但优化目标、作用对象、工作原理完全不同，核心区别在于 “优化 3D 模型复杂度” vs “优化纹理采样效率”。

| 对比维度 | LOD（细节层次）                                              | MipMap（纹理多级渐远）                                       |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 作用对象 | 3D 模型（Mesh）                                              | 纹理（Texture2D）                                            |
| 优化目标 | 降低模型的面数 / 顶点数，减少绘制计算开销                    | 降低纹理采样时的内存带宽和计算量，避免锯齿 / 闪烁            |
| 工作原理 | 为同一模型准备多套不同面数的版本，根据 “模型到相机的距离” 自动切换 | 预生成一系列分辨率递减的纹理副本（如 1024→512→256…），根据 “纹理到相机的距离 / 尺寸” 自动选择对应分辨率 |
| 资源准备 | 需手动 / 工具生成多套 LOD 模型（如 LOD0 高模、LOD1 中模、LOD2 低模） | 导入纹理时勾选 “Generate Mip Maps”，Unity 自动生成多级纹理   |
| 触发条件 | 模型与相机的距离（可手动设置各 LOD 切换阈值）                | 纹理在屏幕上的投影尺寸（Unity 自动计算，无需手动设置）       |
| 视觉影响 | 远距离时模型细节降低（但不影响纹理）                         | 远距离时纹理分辨率降低（但不影响模型）                       |
| 适用场景 | 大型场景中的远景模型（如树木、建筑、山体）                   | 所有需要纹理渲染的对象（尤其是远景纹理、大面积纹理）         |

1. **LOD 工作流程**：

   - 步骤 1：为模型添加 `LOD Group` 组件，关联多套 LOD 模型（LOD0 是最高细节，面数最多；LOD 等级越高，面数越少）；
   - 步骤 2：运行时，Unity 计算模型包围盒到相机的距离（或视角大小）；
   - 步骤 3：当距离超过阈值时，自动切换到对应 LOD 等级（如远距离切换到 LOD2 低模，甚至 LOD 最后一级隐藏模型）；
   - 示例：玩家近距离看角色时用 LOD0（10000 面），远距离看时切换到 LOD2（1000 面），减少 GPU 绘制压力。

   LOD 注意：

   - 切换阈值需合理设置，避免近距离切换导致 “模型突变”（可开启 `Cross Fading` 渐变过渡）；
   - 过多 LOD 等级会增加资源体积，通常设置 3-4 级即可（LOD0~LOD2/3）。

2. **MipMap 工作流程**：

   - 步骤 1：导入纹理时勾选 “Generate Mip Maps”，Unity 自动生成一系列 “缩小版纹理”（每个级别分辨率是上一级的 1/2，直到 1x1 像素）；
   - 步骤 2：运行时，Unity 根据纹理在屏幕上的实际投影尺寸（如远景纹理仅占几个像素），选择最匹配的 MipMap 级别采样；
   - 步骤 3：避免 “用高分辨率纹理渲染极小区域” 导致的采样浪费（如 1024x1024 纹理渲染 10x10 像素区域，需多次采样插值，效率低）；
   - 优势：不仅提升性能，还能减少纹理 “闪烁”（aliasing）和锯齿，让远景纹理更平滑。

   MipMap 注意：

   - 会占用额外内存（约原纹理的 1.33 倍，因所有级别纹理总和为原纹理的 4/3）；
   - 2D 游戏（如 UI、像素风）可关闭 MipMap（避免纹理模糊），3D 游戏建议默认开启。



#### 题五：Alpha Render 的工作原理

Alpha Render（Alpha 渲染）是 Unity 中 **处理 “透明 / 半透明物体”** 的渲染技术，核心是通过 `Alpha 通道` 控制像素的 “不透明度”，再结合特定的渲染队列和混合模式，实现透明效果。

- Alpha 通道：是纹理的第 4 个通道（RGBA 中的 A），取值范围 0~1（或 0~255）：
  - Alpha = 1：完全不透明（像素正常显示）；
  - Alpha = 0：完全透明（像素不显示）；
  - 0 < Alpha < 1：半透明（像素与背景混合显示）。
- 不透明度来源：
  1. 纹理自带 Alpha 通道（如 PNG 图片）；
  2. Shader 中手动设置 `Alpha` 参数（如通过 `_Color` 的 A 分量控制）。

**渲染的核心流程**

Unity 实现 Alpha 透明的关键是 **“渲染队列（Render Queue）”** 和 **“颜色混合（Blending）”**，流程如下：

1. **渲染队列排序**：
   - 不透明物体（Opaque）默认在 “Geometry” 队列（队列号 2000），按 “从近到远” 渲染（Z-Test 剔除远处像素，效率高）；
   - 透明 / 半透明物体需放在 “Transparent” 队列（队列号 3000），按 “从远到近” 渲染（避免远处透明物体被近处不透明物体遮挡，确保混合正确）。
2. **颜色混合计算**：
   - 不透明物体：直接覆盖帧缓冲区的像素颜色（无混合）；
   - 透明物体：通过 Shader 中的Blend指令，将当前像素颜色与帧缓冲区已有的背景颜色混合，公式由混合模式定义：
     - 常用混合模式（半透明核心）：Blend SrcAlpha OneMinusSrcAlpha（标准 Alpha 混合）
       - 混合公式：最终颜色 = （当前像素颜色 × 当前 Alpha） + （背景颜色 × (1 - 当前 Alpha)）
       - 示例：当前像素颜色（红，Alpha=0.5），背景颜色（蓝）→ 最终颜色 = 红 ×0.5 + 蓝 ×0.5 = 紫色（半透明效果）。
3. **ZWrite（深度写入）控制**：
   - 不透明物体：开启 ZWrite（写入深度缓冲区，后续物体可通过 Z-Test 剔除被遮挡部分）；
   - 透明物体：默认关闭 ZWrite（若开启，远处透明物体的深度会覆盖近处透明物体，导致混合错误）；
   - 例外：完全透明（Alpha=0）的像素，可通过 `AlphaTest` 剔除（不渲染该像素，节省性能）。



#### 题六：Monobehavior的生命周期函数有哪些

`Awake()` → `OnEnable()` → `Start()` → [每帧循环：`FixedUpdate()` → `Update()` → `LateUpdate()` → 渲染相关函数] → [交互事件触发时执行对应函数] → `OnDisable()` → `OnDestroy()` → `OnApplicationQuit()`（游戏退出时）



#### 题七：下列函数会出现什么报错，如何避免

```C#
List<int> ans = new List<int>(){new int[]{1,2,3,4,5}};
foreach(var i in ans){
	Console.WriteLine(i);
}
```

**无法将类型“int[]”隐式转换为“int”（CS0029）**

**报错原因**

- `List<int>` 是 **int 类型的集合**，只能存储 `int` 单个值；
- 但你试图往里面添加 `new int[]{1,2,3,4,5}`（一个 `int[]` 数组）—— 数组是引用类型，`int[]` 和 `int` 是完全不同的类型，无法隐式转换，编译器直接拒绝编译。

**想存储 “单个 int 数组”（List 元素是数组）**

将 `List<int>` 改为 `List<int[]>`（存储 int 数组的集合），此时遍历的是数组本身：

```csharp
// 修正：List 类型改为 List<int[]>（存储数组）
List<int[]> ans = new List<int[]> { new int[] { 1, 2, 3, 4, 5 } };
foreach (var arr in ans)  // arr 是 int[] 类型
{
    // 如需输出数组元素，需嵌套遍历
    foreach (var i in arr)
    {
        Console.WriteLine(i); // 输出 1、2、3、4、5
    }
}
```



#### 题八：Material和 SharedMaterial的区别

在 Unity 中，`Material`（材质）和 `SharedMaterial`（共享材质）是 **控制渲染器（Renderer）材质引用** 的核心属性，其本质区别在于 **是否共享材质实例、修改是否影响其他对象**，直接影响渲染效果和性能。

| 对比维度      | Material（独立材质）                          | SharedMaterial（共享材质）                         |
| ------------- | --------------------------------------------- | -------------------------------------------------- |
| 引用类型      | 渲染器的 **私有材质实例**（拷贝自共享材质）   | 所有关联对象的 **公共材质实例**（原始资源）        |
| 修改影响范围  | 仅作用于当前渲染器（其他对象不受影响）        | 作用于所有使用该共享材质的对象（全局生效）         |
| 内存开销      | 额外占用内存（每个渲染器一份拷贝）            | 内存高效（所有对象共用一份实例）                   |
| 资源类型      | 运行时动态创建的 **实例化材质**（非原始资源） | 项目中导入 / 创建的 **原始材质资源**（Asset 目录） |
| 序列化 / 保存 | 不随对象保存（运行时临时实例）                | 随资源保存（修改会同步到 Asset 资源）              |
| 适用场景      | 单个对象的材质个性化修改（如单独变色）        | 多个对象共用相同材质（如批量道具、重复场景元素）   |

Unity 材质的 “资源 - 实例” 关系：

- **原始材质资源**：存储在 Project 窗口的 `.mat` 文件，是 “模板”，包含 Shader、纹理、颜色等配置；
- **材质实例**：运行时从原始资源拷贝出来的 “副本”，存储在内存中，供渲染器直接使用。

**Material（独立材质）的逻辑**

当你通过 `renderer.material` 访问时：

1. 若渲染器当前没有私有实例，Unity 会 **自动拷贝一份 SharedMaterial 的实例**（底层调用 `Instantiate(sharedMaterial)`）；
2. 后续修改 `material` 的属性（如颜色、纹理），仅修改该私有实例；
3. 其他使用同一原始材质的渲染器，因引用的是不同实例，不受影响。

![image-20251125214934369](/notes-assets/%E9%9D%A2%E8%AF%95%E9%A2%98%E6%A8%A1%E6%8B%9F/assets/image-20251125214934369.png)

**SharedMaterial（共享材质）的逻辑**

当你通过 `renderer.sharedMaterial` 访问时：

1. 直接引用 **原始材质资源本身**（无拷贝，所有渲染器共用同一份实例）；
2. 修改 `sharedMaterial` 的属性，会直接修改原始资源；
3. 所有关联该原始材质的渲染器，都会立即同步显示修改后的效果（全局生效）

![image-20251125215017462](/notes-assets/%E9%9D%A2%E8%AF%95%E9%A2%98%E6%A8%A1%E6%8B%9F/assets/image-20251125215017462.png)

#### 题九：如何评价代码的好坏

评价代码好坏的核心在于是否满足“可维护、可扩展、高性能、高可靠”的核心目标，而非仅能运行，需从多维度综合判断：

首先是可读性，要求命名规范（如“CalculateTotalPrice()”而非“fun1()”）、注释清晰且无冗余、结构简洁（函数行数≤50行、嵌套层级≤3层）、风格统一，让他人能快速理解逻辑；

其次是可维护性，需遵循单一职责原则（函数/类只做一件事）、低耦合高内聚、无重复代码（重复逻辑抽为公共工具）、错误处理规范（精准捕获异常、明确错误信息），降低后续修改和调试成本；

再者是可扩展性，通过抽象设计（接口/抽象类分离规范与实现）、配置化（可变参数放入配置文件而非硬编码）、模块化拆分，支持新增功能时无需大幅修改原有代码；

同时要保证正确性与健壮性，覆盖空值、极值、非法输入等边界场景，无逻辑漏洞且适配不同环境；性能与资源效率也至关重要，需选择高效算法与数据结构、减少冗余计算、优化资源使用（如Unity中复用对象、避免频繁创建销毁）、无资源泄漏；

针对业务系统还需考虑安全性，做好输入校验、权限控制和敏感数据加密。

以Unity脚本为例，原PlayerMove脚本存在变量命名模糊（“s”应为“moveSpeed”）、边界值硬编码、移动与边界检测逻辑混杂、重复代码多等问题，优化后可通过规范命名、添加配置字段（如maxX、minZ）、拆分移动与边界检测函数、采用配置化参数，显著提升可读性、可维护性与可扩展性，更好地契合好代码的核心评价标准。

#### 还有一题：想不起来了
