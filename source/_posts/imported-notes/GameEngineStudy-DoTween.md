---
title: DoTween
date: 2026-06-27 03:38:00
categories:
  - 图形与引擎
tags:
  - GameEngineStudy
  - 笔记
---
# Unity DoTween 详解

## 一、概述

**DoTween**（现称为 **DG.Tweening**）是一个功能强大、性能优异的Unity动画插件，它提供了比Unity原生动画系统更简洁、更灵活的API来创建各种补间动画。

## 二、安装方法

### 1. **从Asset Store安装**（推荐新手）

- 

  在Unity Asset Store中搜索"DOTween (HOTween v2)"

- 

  免费版功能完整，专业版（收费）提供额外功能

### 2. **通过Git URL安装**（Package Manager）

- 

  打开Package Manager → Add package from git URL

- 

  输入：`https://github.com/Demigiant/dotween.git?path=Demigiant/DOTween/Assets/DOTween`

### 3. **安装后设置**

```
// 第一次使用前需初始化
using DG.Tweening;
void Start() {
    DOTween.Init();
}
```

## 三、核心功能与语法

### 1. **基本动画方法**

```
// 移动
transform.DOMove(new Vector3(10, 0, 0), 1f); // 1秒移动到(10,0,0)
transform.DOLocalMoveX(5, 2f); // 沿本地X轴移动

// 旋转
transform.DORotate(new Vector3(0, 360, 0), 2f, RotateMode.FastBeyond360);
transform.DOLocalRotate(new Vector3(0, 180, 0), 1f);

// 缩放
transform.DOScale(2f, 1f); // 缩放到2倍
transform.DOScale(new Vector3(1, 2, 1), 1f); // 非均匀缩放

// 颜色（UI/材质）
Image img = GetComponent<Image>();
img.DOColor(Color.red, 0.5f);
img.DOFade(0, 1f); // 淡出

// 数值变化
int score = 0;
DOTween.To(() => score, x => score = x, 100, 2f);
```

### 2. **链式调用**（Fluent API）

```
transform.DOMoveX(5, 1f)
    .SetEase(Ease.OutBounce)
    .SetDelay(0.5f)
    .OnComplete(() => {
        Debug.Log("移动完成！");
    })
    .SetLoops(2, LoopType.Yoyo); // 来回运动2次
```

## 四、核心设置与配置

### 1. **缓动函数**（Easing）

```
// 常用缓动类型
.SetEase(Ease.Linear)           // 线性
.SetEase(Ease.InOutQuad)        // 平滑进出
.SetEase(Ease.OutBack)          // 回弹效果
.SetEase(Ease.InElastic)        // 弹性效果
.SetEase(Ease.InBounce)         // 弹跳效果
.SetEase(Ease.InSine)           // 正弦曲线

// 自定义曲线
[SerializeField] AnimationCurve customCurve;
.SetEase(customCurve)
```

### 2. **循环与重复**

```
.SetLoops(3, LoopType.Restart)  // 重复3次
.SetLoops(-1, LoopType.Yoyo)    // 无限来回运动
.SetLoops(2, LoopType.Incremental) // 增量式循环
```

### 3. **回调函数**

```
.OnStart(() => Debug.Log("动画开始"))
.OnPlay(() => Debug.Log("动画播放"))
.OnUpdate(() => Debug.Log("每帧调用"))
.OnComplete(() => Debug.Log("动画完成"))
.OnKill(() => Debug.Log("动画被杀死"))
```

## 五、序列动画（Sequence）

### 1. **基本序列**

```
Sequence mySequence = DOTween.Sequence();

// 按顺序执行
mySequence.Append(transform.DOMoveX(5, 1f));
mySequence.Append(transform.DORotate(new Vector3(0, 180, 0), 1f));
mySequence.Append(transform.DOScale(2, 1f));

// 同时执行
mySequence.Join(transform.DOShakeScale(1f));

// 插入动画
mySequence.Insert(0.5f, transform.DOMoveY(2, 1f)); // 在0.5秒时插入

// 预置间隔
mySequence.AppendInterval(1f); // 等待1秒

// 链式设置
mySequence.SetLoops(-1).SetEase(Ease.Linear);
```

### 2. **高级序列控制**

```
Sequence seq = DOTween.Sequence()
    .Append(transform.DOMoveX(5, 1))
    .AppendCallback(() => Debug.Log("第一步完成"))
    .Append(transform.DOMoveY(3, 1))
    .SetAutoKill(false)  // 不自动销毁
    .Pause();  // 创建后暂停

// 稍后播放
seq.Play();
```

## 六、特殊效果

### 1. **相机震动**

```
// 位置震动
transform.DOShakePosition(1f, strength: 0.3f, vibrato: 10, randomness: 90);

// 旋转震动
transform.DOShakeRotation(1f, strength: 10f);

// 缩放震动
transform.DOShakeScale(1f, strength: 0.5f);

// 相机专用震动（屏幕震动）
Camera.main.DOShakePosition(0.5f, strength: 0.1f);
```

### 2. **路径动画**

```
Vector3[] path = new Vector3[] {
    new Vector3(0, 0, 0),
    new Vector3(5, 2, 0),
    new Vector3(10, 0, 0)
};

transform.DOPath(path, 3f, PathType.CatmullRom)
    .SetOptions(true)  // 闭合路径
    .SetLookAt(0.01f); // 朝向移动方向
```

### 3. **UI动画**

```
// 文本动画
Text textComponent = GetComponent<Text>();
textComponent.DOText("Hello World!", 2f); // 打字机效果
textComponent.DOColor(Color.red, 1f);
textComponent.DOFade(0, 1f);

// 填充动画
Image image = GetComponent<Image>();
image.DOFillAmount(1, 2f); // 2秒内填满

// 布局动画
LayoutElement layout = GetComponent<LayoutElement>();
layout.DOPreferredSize(new Vector2(200, 100), 1f);
```

## 七、性能优化与内存管理

### 1. **对象池与重用**

```
// 创建可重用的Tween
Tween myTween = transform.DOMoveX(10, 1f)
    .SetAutoKill(false)  // 不自动回收
    .SetRecyclable(true) // 可回收重用
    .Pause();

// 重用
myTween.Restart();

// 手动管理
DOTween.Clear();  // 清除所有Tween
DOTween.ClearCachedTweens();  // 清除缓存的Tween
```

### 2. **性能设置**

```
// 全局设置
DOTween.SetTweensCapacity(200, 50); // 设置Tween和序列的容量

// 时间缩放独立
transform.DOMoveX(5, 1f).SetUpdate(true); // 使用非缩放时间

// 性能模式
DOTween.defaultEaseType = Ease.Linear;
DOTween.useSafeMode = true;  // 安全模式（推荐开发时使用）
```

## 八、高级特性

### 1. **From 动画**

```
// 从指定值开始动画
transform.DOMoveX(5, 1f).From();  // 从当前位置移动到5
transform.DOMoveX(5, 1f).From(true);  // 从5移动到当前位置
```

### 2. **相对动画**

```
transform.DOMoveX(5, 1f).SetRelative();  // 相对当前位置移动5个单位
```

### 3. **控制与状态查询**

```
Tween tween = transform.DOMoveX(10, 2f);

// 控制
tween.Pause();
tween.Play();
tween.TogglePause();
tween.Rewind();  // 重播
tween.Complete();  // 立即完成

// 状态查询
bool isPlaying = tween.IsPlaying();
bool isComplete = tween.IsComplete();
float elapsed = tween.Elapsed();  // 已过去的时间
```

## 九、实用示例

### 1. **按钮点击动画**

```
public void OnButtonClick() {
    transform.DOScale(0.9f, 0.1f)
        .OnComplete(() => transform.DOScale(1f, 0.1f));
}
```

### 2. **对象淡入淡出**

```
public IEnumerator FadeInOut(GameObject obj) {
    CanvasGroup cg = obj.GetComponent<CanvasGroup>();
    if (cg == null) cg = obj.AddComponent<CanvasGroup>();
    
    yield return cg.DOFade(1, 0.5f).WaitForCompletion();
    yield return new WaitForSeconds(2f);
    yield return cg.DOFade(0, 0.5f).WaitForCompletion();
}
```

### 3. **分数计数动画**

```
public Text scoreText;
private int _score = 0;

public void AddScore(int points) {
    int oldScore = _score;
    _score += points;
    
    DOTween.To(() => oldScore, 
               x => scoreText.text = $"Score: {x}", 
               _score, 0.5f)
          .SetEase(Ease.OutQuad);
}
```

## 十、最佳实践与常见问题

### 1. **最佳实践**

```
// 1. 初始化一次
void Start() {
    DOTween.Init(autoKillMode: false, useSafeMode: true, logBehaviour: LogBehaviour.ErrorsOnly);
}

// 2. 对象销毁时清理
void OnDestroy() {
    transform.DOKill();  // 杀死此Transform的所有Tween
}

// 3. 使用WaitForCompletion等待
yield return transform.DOMoveX(10, 2f).WaitForCompletion();

// 4. 避免内存泄漏
DOTween.KillAll();  // 场景切换时清理
```

### 2. **常见问题解决**

- 

  **问题：动画结束后对象不恢复**

  ```
  // 使用From()时注意方向
  transform.DOScale(0, 1f).From();  // 从0缩放到当前尺寸
  ```

- 

  **问题：动画卡顿**

  ```
  // 减少同时运行的Tween数量
  // 使用SetUpdate(UpdateType.Fixed)用于物理相关
  ```

- 

  **问题：编辑器模式不工作**

  ```
  // 确保在编辑器运行模式下测试
  #if UNITY_EDITOR
  DOTween.Init(true, true, LogBehaviour.Verbose);
  #endif
  ```

## 十一、与Unity协程配合

```
IEnumerator AnimationSequence() {
    yield return transform.DOMoveX(5, 1f).WaitForCompletion();
    yield return new WaitForSeconds(0.5f);
    yield return transform.DORotate(new Vector3(0, 180, 0), 1f).WaitForCompletion();
}
```

## 总结

DoTween是Unity中最流行的动画插件之一，其特点包括：

- 

  ✅ **API简洁直观**，链式调用流畅

- 

  ✅ **性能优异**，对象池管理内存

- 

  ✅ **功能全面**，支持各种动画类型

- 

  ✅ **与Unity深度集成**，支持UI、2D、3D

- 

  ✅ **社区活跃**，文档完善

**学习建议**：从简单的DOMove/DOScale开始，逐步掌握Sequence和高级特性，注意内存管理和性能优化。