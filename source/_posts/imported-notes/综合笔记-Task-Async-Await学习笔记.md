---
title: Task-Async-Await学习笔记
date: 2026-06-27 03:11:00
categories:
  - 其他笔记
tags:
  - 综合笔记
  - 笔记
---
# C# 异步学习笔记（Task / async / await）

## 1. 核心概念
- `Task`：表示一个将来会完成的操作。
- `Task<T>`：表示将来会完成并返回 `T` 的操作。
- `async`：修饰方法，表示方法内部可使用 `await`。
- `await`：异步等待，不阻塞当前线程。

关键理解：异步不等于多线程。`Task` 不是线程本身，而是“未来结果”的抽象。

## 2. Task 的状态
`Task` 最终会进入以下三种状态之一：
- `RanToCompletion`：成功完成。
- `Faulted`：失败并携带异常。
- `Canceled`：被取消。

## 3. async/await 执行机制
异步方法会先同步执行，直到遇到第一个尚未完成的 `await` 才挂起。
任务完成后，方法从 `await` 后继续执行。

```csharp
public async Task<int> GetNumberAsync()
{
    await Task.Delay(500);
    return 42;
}
```

## 4. 返回类型选择
- 推荐：`Task` / `Task<T>`。
- 仅事件处理器使用：`async void`。

```csharp
public async Task SaveAsync() { ... }
public async Task<int> QueryAsync() { ... }
private async void Button_Click(object sender, EventArgs e) { ... }
```

## 5. I/O 异步 vs CPU 并行
- I/O 密集（网络/磁盘/数据库）：直接 `await` 原生异步 API。
- CPU 密集（大量计算）：可用 `Task.Run` 放到线程池。

```csharp
// CPU 密集
var result = await Task.Run(() => HeavyCompute(data));
```

注意：不要给本来就是 I/O 异步的方法再套 `Task.Run`。

## 6. 串行与并发
### 串行
```csharp
await AAsync();
await BAsync();
```

### 并发
```csharp
Task a = AAsync();
Task b = BAsync();
await Task.WhenAll(a, b);
```

- `Task.WhenAll`：等待全部完成。
- `Task.WhenAny`：等待任意一个先完成。

## 7. 异常处理（重点）
`await` 会抛出任务中的异常，可用 `try/catch` 处理。

```csharp
try
{
    await DoWorkAsync();
}
catch (Exception ex)
{
    Console.WriteLine(ex.Message);
}
```

`Task.WhenAll` 场景下可能有多个失败任务，要注意聚合异常信息。

## 8. 取消机制 CancellationToken（重点）
取消是协作式，不是强制终止线程。

```csharp
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
await WorkAsync(cts.Token);

public async Task WorkAsync(CancellationToken ct)
{
    for (int i = 0; i < 10; i++)
    {
        ct.ThrowIfCancellationRequested();
        await Task.Delay(500, ct);
    }
}
```

## 9. 同步上下文与 ConfigureAwait
- UI 程序默认会尝试在 `await` 后回到 UI 线程。
- 类库代码常用 `ConfigureAwait(false)`，避免不必要的上下文切换。

```csharp
await SomeIoAsync().ConfigureAwait(false);
```

## 10. 常见死锁原因
在有同步上下文的环境中，用 `.Result` / `.Wait()` 阻塞异步任务，常引发死锁。

原则：异步链路尽量“全异步”（async all the way）。

## 11. 常用 API 速记
- `Task.Delay`：异步延时
- `Task.Run`：线程池执行（主要用于 CPU 密集）
- `Task.WhenAll`：等待全部
- `Task.WhenAny`：等待任意一个
- `Task.FromResult`：快速返回已完成 `Task<T>`
- `Task.CompletedTask`：快速返回已完成 `Task`

## 12. 进阶知识点
### ValueTask
- 用于高频、且经常同步完成的场景，减少分配。
- 默认仍优先使用 `Task<T>`，更简单更安全。

### IAsyncEnumerable
- 适合“边产出边消费”数据流。

```csharp
public async IAsyncEnumerable<int> GenerateAsync()
{
    for (int i = 0; i < 5; i++)
    {
        await Task.Delay(200);
        yield return i;
    }
}
```

### IAsyncDisposable
- 异步释放资源用 `await using`。

## 13. 实战模板：超时 + 取消 + 异常
```csharp
public async Task<string> FetchAsync(HttpClient client, string url, CancellationToken externalToken)
{
    using var timeoutCts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
    using var linked = CancellationTokenSource.CreateLinkedTokenSource(externalToken, timeoutCts.Token);

    try
    {
        using var resp = await client.GetAsync(url, linked.Token);
        resp.EnsureSuccessStatusCode();
        return await resp.Content.ReadAsStringAsync(linked.Token);
    }
    catch (OperationCanceledException) when (timeoutCts.IsCancellationRequested)
    {
        throw new TimeoutException("Request timed out.");
    }
}
```

## 14. 常见反模式
- 在异步代码中使用 `.Result` / `.Wait()`。
- 在业务代码中滥用 `async void`。
- 忘记传递 `CancellationToken`。
- 对纯 I/O 异步盲目使用 `Task.Run`。
- 并发过高不做限流。

## 15. 并发限流示例
```csharp
var sem = new SemaphoreSlim(8);
var tasks = items.Select(async item =>
{
    await sem.WaitAsync();
    try
    {
        await ProcessAsync(item);
    }
    finally
    {
        sem.Release();
    }
});

await Task.WhenAll(tasks);
```

## 16. 学习路线
1. 掌握 `Task`、`async`、`await` 基础语义。
2. 练习 `WhenAll/WhenAny`、异常处理、取消机制。
3. 理解同步上下文、死锁与 `ConfigureAwait(false)`。
4. 做实战：超时、重试、限流、幂等。
5. 学进阶：`ValueTask`、`IAsyncEnumerable`、异步释放。

## 17. 一页总结
- `Task` 是未来结果，不是线程。
- `await` 是非阻塞等待。
- I/O 直接异步，CPU 计算再考虑 `Task.Run`。
- 取消靠 `CancellationToken` 协作传播。
- 业务代码优先 `Task/Task<T>`，避免 `async void`。
- 避免 `.Result/.Wait()`，防止死锁。
- 并发要可控，必要时限流。

# C# Task 详解

## 1. Task 基础概念

### 什么是 Task？

Task 是 .NET Framework 4.0 引入的异步编程模型（TAP - Task-based Asynchronous Pattern）的核心类，用于表示一个异步操作。

```C#
// 创建和运行 Task
Task task = new Task(() => 
{
    Console.WriteLine("Task 正在运行...");
    Thread.Sleep(1000);
    Console.WriteLine("Task 完成");
});
task.Start();
```

### Task 状态

```C#
public enum TaskStatus
{
    Created,        // 已创建但未调度
    WaitingForActivation,  // 等待激活
    WaitingToRun,    // 等待执行
    Running,        // 正在执行
    WaitingForChildrenToComplete, // 等待子任务
    RanToCompletion, // 成功完成
    Canceled,       // 被取消
    Faulted         // 发生异常
}
```

## 2. Task 创建方式

### 2.1 直接创建

```c#
// 方式1: 构造函数 + Start
Task task1 = new Task(() => DoWork());
task1.Start();

// 方式2: Task.Run (推荐)
Task task2 = Task.Run(() => DoWork());

// 方式3: Task.Factory.StartNew
Task task3 = Task.Factory.StartNew(() => DoWork());

// 方式4: Task.Delay (延迟任务)
Task delayTask = Task.Delay(1000); // 延迟1秒
await delayTask;
```

### 2.2 带返回值的 Task

```C#
// Task<TResult> 泛型版本
Task<int> task = Task.Run(() =>
{
    Thread.Sleep(1000);
    return 42;  // 返回计算结果
});

int result = await task;  // 获取返回值
Console.WriteLine($"结果: {result}");
```

### 2.3 长时间运行的 Task

```C#
Task longRunningTask = Task.Factory.StartNew(() =>
{
    // 长时间运行的操作
    for (int i = 0; i < 1000000; i++)
    {
        // 耗时计算
    }
}, TaskCreationOptions.LongRunning);
```

## 3. Task 控制与配置

### TaskCreationOptions

```C#
Task task = Task.Factory.StartNew(() =>
{
    // 任务逻辑
}, 
CancellationToken.None,
TaskCreationOptions.None,  // 默认选项
TaskScheduler.Default);

// 常用选项：
// - LongRunning: 长时间运行的任务
// - AttachedToParent: 附加到父任务
// - DenyChildAttach: 拒绝子任务附加
// - PreferFairness: 公平调度
// - RunContinuationsAsynchronously: 异步继续
```

### TaskContinuationOptions

```C#
Task parentTask = Task.Run(() => Console.WriteLine("父任务"));

Task continuationTask = parentTask.ContinueWith(prevTask =>
{
    Console.WriteLine("父任务完成后继续执行");
}, 
TaskContinuationOptions.OnlyOnRanToCompletion);  // 只在成功完成时执行
```

## 4. Task 等待与结果获取

### 4.1 等待方法

```C#
Task task = Task.Run(() =>
{
    Thread.Sleep(2000);
    Console.WriteLine("任务完成");
});

// 阻塞等待
task.Wait();  // 阻塞当前线程直到完成
task.Wait(1000);  // 最多等待1秒
task.Wait(CancellationToken.None);  // 可取消的等待

// 异步等待
await task;  // 异步等待，不阻塞线程

// 等待多个任务
Task task1 = Task.Delay(1000);
Task task2 = Task.Delay(2000);
Task.WaitAll(task1, task2);  // 等待所有完成
Task.WaitAny(task1, task2);  // 等待任意一个完成
```

### 4.2 获取结果

```C#
Task<int> task = Task.Run(() =>
{
    Thread.Sleep(1000);
    return 100;
});

// 方式1: Result 属性（阻塞）
int result1 = task.Result;  // 如果未完成会阻塞

// 方式2: await 关键字（推荐）
int result2 = await task;  // 异步获取

// 方式3: GetAwaiter()
int result3 = task.GetAwaiter().GetResult();  // 类似Result，但有更好的异常处理
```

## 5. Task 异常处理

### 5.1 基本异常处理

```
Task task = Task.Run(() =>
{
    throw new InvalidOperationException("任务异常");
});

try
{
    await task;  // await 会重新抛出异常
    // 或使用 task.Wait();
}
catch (AggregateException ex)
{
    foreach (var innerEx in ex.InnerExceptions)
    {
        Console.WriteLine($"异常: {innerEx.Message}");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"异常: {ex.Message}");
}
```

### 5.2 Exception 属性

```
Task task = Task.Run(() => throw new Exception("错误"));

try
{
    task.Wait();
}
catch
{
    // 访问异常信息
    if (task.Exception != null)
    {
        Console.WriteLine($"任务异常: {task.Exception.Message}");
        Console.WriteLine($"状态: {task.Status}");  // Faulted
    }
}
```

## 6. Task 取消操作

### 6.1 使用 CancellationToken

```
CancellationTokenSource cts = new CancellationTokenSource();

Task task = Task.Run(() =>
{
    for (int i = 0; i < 100; i++)
    {
        if (cts.Token.IsCancellationRequested)
        {
            Console.WriteLine("任务被取消");
            cts.Token.ThrowIfCancellationRequested();  // 抛出 OperationCanceledException
        }
        
        Thread.Sleep(100);
        Console.WriteLine($"进度: {i}%");
    }
}, cts.Token);

// 3秒后取消任务
await Task.Delay(3000);
cts.Cancel();

try
{
    await task;
}
catch (OperationCanceledException)
{
    Console.WriteLine("任务已取消");
}
finally
{
    cts.Dispose();
}
```

### 6.2 取消后状态检查

```
if (task.IsCanceled)
{
    Console.WriteLine("任务已被取消");
}
else if (task.IsFaulted)
{
    Console.WriteLine("任务执行失败");
}
else if (task.IsCompleted)
{
    Console.WriteLine("任务正常完成");
}
```

## 7. Task 组合与延续

### 7.1 ContinueWith

```
Task<int> task1 = Task.Run(() => 
{
    Console.WriteLine("任务1: 计算开始");
    return 10;
});

Task<string> task2 = task1.ContinueWith(prevTask =>
{
    Console.WriteLine($"任务2: 接收到结果 {prevTask.Result}");
    return (prevTask.Result * 2).ToString();
});

Task task3 = task2.ContinueWith(prevTask =>
{
    Console.WriteLine($"任务3: 最终结果 {prevTask.Result}");
});

await task3;
```

### 7.2 任务组合

```
// 等待所有任务完成
Task task1 = Task.Delay(1000);
Task task2 = Task.Delay(2000);
Task task3 = Task.Delay(1500);

Task allTasks = Task.WhenAll(task1, task2, task3);
await allTasks;
Console.WriteLine("所有任务完成");

// 等待任意任务完成
Task anyTask = Task.WhenAny(task1, task2, task3);
Task completedTask = await anyTask;
Console.WriteLine($"有任务完成: {completedTask.Id}");

// 带返回值的 WhenAll
Task<int>[] tasks = new[]
{
    Task.Run(() => 1),
    Task.Run(() => 2),
    Task.Run(() => 3)
};

int[] results = await Task.WhenAll(tasks);
Console.WriteLine($"结果总和: {results.Sum()}");
```

## 8. Task 并行处理

### 8.1 Parallel.For 与 Task

```
// 使用 Parallel
Parallel.For(0, 10, i =>
{
    Console.WriteLine($"并行执行: {i}, 线程: {Thread.CurrentThread.ManagedThreadId}");
});

// 转换为 Task
Task parallelTask = Task.Run(() =>
{
    Parallel.For(0, 10, i =>
    {
        Console.WriteLine($"Task中的并行: {i}");
    });
});
```

### 8.2 Task 并行执行

```
List<Task> tasks = new List<Task>();

for (int i = 0; i < 5; i++)
{
    int index = i;  // 重要：捕获循环变量
    tasks.Add(Task.Run(() =>
    {
        Console.WriteLine($"任务 {index} 开始");
        Thread.Sleep(100 * index);
        Console.WriteLine($"任务 {index} 完成");
    }));
}

await Task.WhenAll(tasks);
```

## 9. Unity 中的 Task 使用

### 9.1 Unity 主线程同步

```
using UnityEngine;
using System.Threading.Tasks;

public class TaskExample : MonoBehaviour
{
    async void Start()
    {
        // 在后台线程执行
        int result = await Task.Run(() =>
        {
            // 耗时的计算操作
            Thread.Sleep(1000);
            return 100;
        });
        
        // 自动回到主线程
        Debug.Log($"结果: {result}");
        
        // 在Unity主线程上更新UI
        // await 会自动回到调用时的同步上下文（Unity主线程）
    }
    
    async Task LoadAssetAsync()
    {
        // 模拟异步加载
        await Task.Delay(1000);
        
        // 需要使用 UnitySynchronizationContext
        // Unity 2021+ 已内置支持
    }
}
```

### 9.2 Unity 中的注意事项

```
public class UnityTaskManager : MonoBehaviour
{
    private CancellationTokenSource cts;
    
    async void Start()
    {
        cts = new CancellationTokenSource();
        
        try
        {
            await ProcessDataAsync(cts.Token);
        }
        catch (OperationCanceledException)
        {
            Debug.Log("任务被取消");
        }
    }
    
    async Task ProcessDataAsync(CancellationToken token)
    {
        for (int i = 0; i < 10; i++)
        {
            token.ThrowIfCancellationRequested();
            
            // 模拟工作
            await Task.Delay(500, token);
            
            // 更新UI（在主线程）
            await UnityMainThreadDispatcher.Instance.DispatchAsync(() =>
            {
                // 更新UI元素
            });
        }
    }
    
    void OnDestroy()
    {
        cts?.Cancel();
        cts?.Dispose();
    }
}
```

## 10. 性能优化与最佳实践

### 10.1 避免常见问题

```
// 错误：在循环中创建大量Task
for (int i = 0; i < 10000; i++)
{
    Task.Run(() => DoWork());  // ❌ 创建过多线程
}

// 正确：使用 Task.WhenAll
List<Task> tasks = new List<Task>();
for (int i = 0; i < 100; i++)  // 合理数量
{
    tasks.Add(Task.Run(() => DoWork()));
}
await Task.WhenAll(tasks);

// 错误：阻塞异步代码
var result = task.Result;  // ❌ 可能导致死锁
var result2 = task.GetAwaiter().GetResult();  // ❌ 同样可能死锁

// 正确：使用 await
var result3 = await task;  // ✅
```

### 10.2 配置 TaskScheduler

```
// 自定义 TaskScheduler
public class UnityTaskScheduler : TaskScheduler
{
    // 实现任务调度逻辑
}

// 使用特定调度器
Task task = Task.Factory.StartNew(() =>
{
    // 任务逻辑
}, 
CancellationToken.None,
TaskCreationOptions.None,
new UnityTaskScheduler());
```

### 10.3 内存和性能

```
// 使用 ValueTask 减少分配
public async ValueTask<int> CalculateAsync()
{
    if (cacheAvailable)
        return cachedValue;  // 同步返回，不分配Task
        
    return await Task.Run(() => ExpensiveCalculation());  // 异步时分配
}

// 复用 Task
private static readonly Task CompletedTask = Task.CompletedTask;
private static readonly Task<int> CompletedIntTask = Task.FromResult(0);
```

## 11. 调试和诊断

### 11.1 获取 Task 信息

```
Task task = Task.Run(() => Thread.Sleep(1000));

Console.WriteLine($"Task ID: {task.Id}");
Console.WriteLine($"状态: {task.Status}");
Console.WriteLine($"是否完成: {task.IsCompleted}");
Console.WriteLine($"是否失败: {task.IsFaulted}");
Console.WriteLine($"是否取消: {task.IsCanceled}");

// 等待完成
task.Wait();
Console.WriteLine($"完成状态: {task.Status}");
```

### 11.2 使用 AsyncLocal

```
private static AsyncLocal<string> asyncLocalContext = new AsyncLocal<string>();

async Task MethodA()
{
    asyncLocalContext.Value = "Context A";
    await MethodB();
}

async Task MethodB()
{
    Console.WriteLine($"上下文: {asyncLocalContext.Value}");  // 保持 "Context A"
    await Task.Delay(100);
}
```

## 12. 高级模式

### 12.1 任务超时控制

```
public static async Task<T> WithTimeout<T>(Task<T> task, TimeSpan timeout)
{
    using (var cts = new CancellationTokenSource())
    {
        var delayTask = Task.Delay(timeout, cts.Token);
        var completedTask = await Task.WhenAny(task, delayTask);
        
        if (completedTask == delayTask)
            throw new TimeoutException("操作超时");
            
        cts.Cancel();
        return await task;
    }
}

// 使用
try
{
    var result = await WithTimeout(LongRunningTask(), TimeSpan.FromSeconds(5));
}
catch (TimeoutException)
{
    Console.WriteLine("任务超时");
}
```

### 12.2 任务重试机制

```
public static async Task<T> RetryAsync<T>(
    Func<Task<T>> action, 
    int maxRetries, 
    TimeSpan delay)
{
    for (int i = 0; i <= maxRetries; i++)
    {
        try
        {
            return await action();
        }
        catch (Exception ex) when (i < maxRetries)
        {
            Console.WriteLine($"重试 {i + 1}/{maxRetries}: {ex.Message}");
            await Task.Delay(delay);
        }
    }
    throw new InvalidOperationException("重试次数用尽");
}
```

Task 是现代 C# 异步编程的核心，熟练掌握 Task 的使用可以大幅提升程序的响应性和性能。在 Unity 开发中，合理使用 Task 可以实现真正的异步操作，避免阻塞主线程，提升游戏流畅度。
