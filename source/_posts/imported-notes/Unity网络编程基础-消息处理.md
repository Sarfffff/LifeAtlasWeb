---
title: 消息处理
date: 2026-06-27 04:21:00
categories:
  - Unity/游戏客户端
tags:
  - Unity网络编程基础
  - 笔记
---
# 分包，黏包

# 自定义协议工具

# 第三方协议工具Protobuf

![image-20251029135442195](/notes-assets/Unity%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/assets/image-20251029135442195.png)

![image-20251029135554376](/notes-assets/Unity%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/assets/image-20251029135554376.png)

### Protobuf配置规则

**规则1**：注释方式 

- //
- /**/

**规则2**：第一行版本号

- syntax = "proto3"
- 如果不写默认proto2

**规则3**：命名空间

- package + 命名空间名

**规则4**：消息类

- message + 类名{ 字段声明}

**规则5**：成员类型 和 唯一编号

- 浮点数：float ， double
- 变长整数：int32 ， int64，uint32，uint64
- 固定字节数：fixed32，fixed64，sfixed32，sfixed64
- 其他类型：bool，string，bytes
- 唯一编号：配置成员时需要默认给他们一个编号（从1开始）。这些编号用于标识中的字段消息二进制格式

**规则6**：特殊表示

- required 必须赋值的字段
- optional 可以不赋值的字段
- repeated 数组
- map 字典

**规则7**：枚举

- enum 枚举名{ 常量1 = 0 //第一个值必须映射到0}

**规则8**：默认值

- string - 空字符串
- bytes -空字节
- bool - false
- 数值 - 0
- 枚举 - 0
- message - 取决于语言 C#为空

**规则9**：允许嵌套

- 内部类

**规则10**：保留字段

- 如果修改了协议规则删除了部分内容为了避免更新时重新使用已经删除了的编号我们可以利用reserved关键字来保留字段这些内容就不能再被使用了

```protobuf
message Foo{
    reserved 2,15,9 to 11;
    reserved "foo","bar";
}
```

**规则11**：导入定义

- import ”  文件名“





### 第一部分：Protobuf 的作用（它解决了什么问题？）

想象一下，您的C++算法引擎需要与用C#编写的Unity游戏客户端，以及用Go或Java编写的游戏服务器进行通信。它们之间要传递复杂的“算法请求”和“算法响应”数据。如何让这些不同语言、不同平台上的程序理解同一份数据？

这就是Protobuf要解决的核心问题：**高效、跨平台、跨语言的结构化数据序列化**。

#### 1. 与传统方式的对比

| 特性                    | XML / JSON（传统方式）     | Protocol Buffers（现代方式）               |
| ----------------------- | -------------------------- | ------------------------------------------ |
| **可读性**              | **高**，人类可读的文本格式 | **低**，二进制格式，人类不可读             |
| **数据大小**            | **大**，包含重复的标签名   | **非常小**，只编码数据本身，无冗余         |
| **序列化/反序列化速度** | **慢**，需要解析文本       | **非常快**，直接操作二进制流               |
| **Schema约束**          | **弱**，文档约定，易出错   | **强**，有明确的`.proto`文件，编译器会检查 |
| **跨语言支持**          | 需要不同语言的解析库       | **官方支持**多种语言，保证行为一致         |

#### 2. Protobuf的核心作用

1. **定义数据结构（契约先行）**： 您需要先在一个`.proto`文件中定义数据的结构（称为Message）。这就像一份**契约**，所有参与通信的团队（游戏客户端团队、服务器团队、算法团队）都基于这份契约进行开发，从源头上减少了沟通错误。
2. **生成代码（自动化）**： 使用Protobuf编译器（`protoc`），可以自动将`.proto`文件编译成您所需编程语言的代码（如C++、C#、Go、Java等）。这些生成的类提供了非常方便的API来设置数据、序列化和反序列化。
3. **高效序列化**： 将生成的结构化数据对象（如C++中的一个`AlgorithmRequest`对象）转换成一个紧凑的二进制字节流。这个过程非常快速，生成的数据包极小。
4. **跨平台通信**： 这个二进制字节流可以通过网络（Socket、gRPC）、进程间通信（IPC）、甚至写入文件，传递给另一个系统。接收方再用同样由`.proto`文件生成的代码，将字节流反序列化成自己语言中的对象。

------

### 第二部分：如何实现 Protobuf（以Solitaire项目为例）

让我们通过您Solitaire算法库的具体例子，一步步实现Protobuf。

#### 步骤1：定义数据结构（.proto 文件）

首先，创建您的协议文件。这步是**最关键的设计阶段**。

**`solitaire_protocol.proto`**

```
// 指定语法版本，通常用 proto3
syntax = "proto3";

// 定义包名，用于防止命名冲突，也会成为生成代码的命名空间
package solitaire;

// 定义扑克牌
message Card {
  Suit suit = 1;  // 字段编号，唯一且不能重复
  Rank rank = 2;
  bool face_up = 3;
}

// 定义花色枚举
enum Suit {
  SUIT_UNKNOWN = 0; // 枚举值必须从0开始
  SPADES = 1;
  HEARTS = 2;
  DIAMONDS = 3;
  CLUBS = 4;
}

// 定义点数枚举
enum Rank {
  RANK_UNKNOWN = 0;
  ACE = 1;
  TWO = 2;
  // ... 直到 KING
  KING = 13;
}

// 定义游戏状态
message GameState {
  string game_id = 1;
  GameType game_type = 2;
  repeated Card tableau_piles = 3; // `repeated` 表示一个列表/数组
  repeated Card foundation_piles = 4;
  repeated Card stock_pile = 5;
  map<string, int32> game_stats = 6; // `map` 表示键值对
}

enum GameType {
  TYPE_UNKNOWN = 0;
  SPIDER = 1;
  KLONDIKE = 2;
  FREECELL = 3;
}

// 定义算法请求
message AlgorithmRequest {
  string request_id = 1;
  AlgorithmType algorithm_type = 2;
  GameState current_state = 3; // 可以嵌套使用自定义的Message
}

enum AlgorithmType {
  ALGO_UNKNOWN = 0;
  DEAL = 1;        // 发牌算法
  SOLVABILITY = 2; // 是否有解
  SUGGEST_MOVE = 3;// 建议移动
}

// 定义算法响应
message AlgorithmResponse {
  string request_id = 1; // 用于匹配请求和响应
  bool success = 2;
  string error_message = 3;
  oneof result { // `oneof` 表示多个字段中只有一个会被设置
    DealResult deal_result = 4;
    SolvabilityResult solvability_result = 5;
    SuggestedMove suggested_move = 6;
  }
  int64 compute_time_ms = 7; // 计算耗时
}

message DealResult {
  GameState new_state = 1;
}

message SolvabilityResult {
  bool is_solvable = 1;
  double confidence = 2; // 置信度
}

message SuggestedMove {
  Card card = 1;
  string from_pile = 2;
  string to_pile = 3;
}
```

#### 步骤2：安装Protobuf编译器并生成代码

1. **安装 `protoc`**： 从 [Protobuf GitHub Release](https://github.com/protocolbuffers/protobuf/releases)页面下载适合您操作系统的编译器，或使用包管理器（如 `apt-get install protobuf-compiler`）。

2. **生成代码**：

   在终端中运行以下命令，为不同语言生成代码。

   ```
   # 为 C++ 生成代码（用于算法引擎 DLL）
   protoc --cpp_out=./generated/cpp solitaire_protocol.proto
   
   # 为 C# 生成代码（用于 Unity 游戏客户端）
   protoc --csharp_out=./generated/csharp solitaire_protocol.proto
   
   # 为 Go 生成代码（用于游戏服务器）
   protoc --go_out=./generated/go solitaire_protocol.proto
   ```

   执行后，您会得到类似这样的文件：

   - `./generated/cpp/solitaire_protocol.pb.h`和 `.pb.cc`（C++头文件和源文件）
   - `./generated/csharp/SolitaireProtocol.cs`（C#类文件）
   - `./generated/go/solitaire_protocol.pb.go`（Go代码）

#### 步骤3：在项目中使用生成的代码

**在C++算法引擎（DLL）中：**

1. **项目配置**： 将生成的`.pb.cc`和`.pb.h`文件添加到您的C++项目中，并链接Protobuf库（如 `libprotobuf`）。

2. **编写代码**：

   ```
   // algorithm_engine.cpp
   #include "solitaire_protocol.pb.h" // 引入生成的头文件
   #include <string>
   
   extern "C" __declspec(dllexport) const char* ProcessRequest(const char* serialized_data, int length) {
       // 1. 反序列化：将接收到的二进制数据解析成 Request 对象
       solitaire::AlgorithmRequest request;
       if (!request.ParseFromArray(serialized_data, length)) {
           return nullptr; // 解析失败
       }
   
       // 2. 业务逻辑处理
       solitaire::AlgorithmResponse response;
       response.set_request_id(request.request_id());
   
       if (request.algorithm_type() == solitaire::DEAL) {
           // 调用您的发牌算法
           auto* deal_result = response.mutable_deal_result();
           // ... 设置 deal_result 的内容
           response.set_success(true);
       } else if (request.algorithm_type() == solitaire::SOLVABILITY) {
           // 调用有解性算法
           // ...
       }
       response.set_compute_time_ms(100);
   
       // 3. 序列化：将 Response 对象转换成二进制数据返回
       std::string response_string;
       response.SerializeToString(&response_string);
   
       // 注意：这里需要将数据返回给调用方，通常需要处理内存管理
       // 为简单起见，这里返回一个静态缓冲区（实际项目需更安全的方法）
       static std::string last_response;
       last_response = response_string;
       return last_response.c_str();
   }
   ```

**在C# Unity客户端中：**

1. **添加依赖**： 通过NuGet安装 `Google.Protobuf`库。

2. **使用生成的C#类**：

   ```
   // AlgorithmClient.cs in Unity
   using Google.Protobuf;
   using Solitaire; // 您的生成代码的命名空间
   
   public class AlgorithmClient {
       [DllImport("SolitaireAlgorithmEngine")] // 您的DLL名称
       private static extern System.IntPtr ProcessRequest(byte[] requestData, int length);
   
       public AlgorithmResponse GetSuggestedMove(GameState currentState) {
           // 1. 构建请求对象
           var request = new AlgorithmRequest {
               RequestId = System.Guid.NewGuid().ToString(),
               AlgorithmType = AlgorithmType.SuggestMove,
               CurrentState = currentState // 需要将Unity中的状态转换为Protobuf格式
           };
   
           // 2. 序列化请求
           byte[] requestData = request.ToByteArray();
   
           // 3. 调用C++ DLL
           IntPtr responsePtr = ProcessRequest(requestData, requestData.Length);
   
           // 4. 将返回的指针转换为C#字节数组（需要实现Marshal逻辑）
           // ... (略复杂的指针操作)
   
           // 5. 反序列化响应
           AlgorithmResponse response = AlgorithmResponse.Parser.ParseFrom(responseBytes);
           return response;
       }
   }
   ```

------

### 总结：在您项目中的价值

对于您的Solitaire算法库，Protobuf实现了：

1. **解耦**： Unity客户端（C#）和算法引擎（C++）通过一份`.proto`契约交互，可以独立开发和升级。
2. **高性能**： 二进制序列化确保了算法调用（可能每帧多次）的低延迟。
3. **清晰的数据契约**： `.proto`文件本身就是最好的API文档，明确了输入和输出。
4. **为未来做准备**： 当您需要将算法部署到服务器进行校验时（防作弊），Go或Java服务器可以**使用同一份`.proto`文件**生成代码，保证数据格式完全一致，轻松实现“双端一致性”。

简单来说，**Protobuf让您用一种现代化、高效且可靠的方式，取代了在C++和C#之间手动拼接字符串或定义复杂二进制格式的原始方法。**

## Protobuf 完整使用流程

### 第一步：定义 .proto 协议文件

**创建 `SolitaireProtocol.proto`**

```
syntax = "proto3";
package solitaire;

// 定义消息类型（相当于C#类）
message Card {
  int32 id = 1;
  Suit suit = 2;
  Rank rank = 3;
  bool is_face_up = 4;
}

message GameState {
  string game_id = 1;
  GameType game_type = 2;
  repeated Card deck = 3;           // 重复字段（相当于List）
  map<string, int32> scores = 4;    // 字典类型
  int32 move_count = 5;
}

message AlgorithmRequest {
  string request_id = 1;
  AlgorithmType algorithm_type = 2;
  GameState game_state = 3;
}

message AlgorithmResponse {
  string request_id = 1;
  bool success = 2;
  string error_message = 3;
  bytes result_data = 4;  // 用于存储任意二进制结果
}

// 定义枚举
enum Suit {
  SUIT_UNKNOWN = 0;
  SPADES = 1;
  HEARTS = 2;
  DIAMONDS = 3;
  CLUBS = 4;
}

enum GameType {
  GAME_UNKNOWN = 0;
  SPIDER = 1;
  KLONDIKE = 2;
  FREECELL = 3;
}
```

### 第二步：安装Protobuf编译工具

**安装 protoc 编译器：**

```
# Windows 使用 Chocolatey
choco install protoc

# 或者手动下载添加到PATH
# 从 https://github.com/protocolbuffers/protobuf/releases 下载

# Mac 使用 Homebrew
brew install protobuf

# 验证安装
protoc --version
```

**安装C#代码生成插件：**

```
# 安装生成C#代码的插件
dotnet tool install -g Grpc.Tools
```

### 第三步：生成C#代码文件

**使用命令行生成：**

```
# 基本命令格式
protoc --csharp_out=输出目录 协议文件.proto

# 具体示例
protoc --csharp_out=./Generated/ SolitaireProtocol.proto

# 如果proto文件有导入其他文件
protoc --csharp_out=./Generated/ -I ./protos/ ./protos/SolitaireProtocol.proto
```

**生成的文件结构：**

```
Project/
├── Protos/
│   └── SolitaireProtocol.proto
└── Generated/
    └── SolitaireProtocol.cs  # 自动生成的C#类
```

### 第四步：将生成的C#文件导入Unity项目

**手动拖拽：**

1. 将生成的 `SolitaireProtocol.cs`文件拖入Unity的 `Assets/Scripts/Protocol/`文件夹
2. Unity会自动编译该文件

**或者使用Unity Package Manager：**

1. 安装Google的Protobuf Unity包
2. 在Unity中设置proto文件的导入设置

### 第五步：安装Unity所需的Protobuf库

**通过Package Manager安装：**

```
Window → Package Manager → "+" → Add package from git URL...
输入：https://github.com/google-protobuf.git#unity
```

**或修改 `Packages/manifest.json`：**

```
{
  "dependencies": {
    "com.google.protobuf": "https://github.com/google-protobuf.git#unity",
    "com.unity.nuget.newtonsoft-json": "3.0.2"
  }
}
```

### 第六步：在C#代码中使用Protobuf

**创建数据模型和序列化操作：**

```
// CardManager.cs
using UnityEngine;
using Google.Protobuf;
using Solitaire; // 生成的命名空间

public class CardManager : MonoBehaviour
{
    // 1. 创建Protobuf对象实例
    public Card CreateCard(int id, Suit suit, Rank rank, bool isFaceUp)
    {
        var card = new Card
        {
            Id = id,
            Suit = suit,
            Rank = rank,
            IsFaceUp = isFaceUp
        };
        return card;
    }
    
    // 2. 序列化（对象 → 字节数组）
    public byte[] SerializeCard(Card card)
    {
        return card.ToByteArray();
    }
    
    // 3. 反序列化（字节数组 → 对象）
    public Card DeserializeCard(byte[] data)
    {
        return Card.Parser.ParseFrom(data);
    }
    
    // 4. 完整的使用示例
    public void ProtobufExample()
    {
        // 创建游戏状态
        var gameState = new GameState
        {
            GameId = System.Guid.NewGuid().ToString(),
            GameType = GameType.Spider,
            MoveCount = 0
        };
        
        // 添加卡片到牌组
        var card = CreateCard(1, Suit.Spades, Rank.Ace, true);
        gameState.Deck.Add(card);
        
        // 添加分数
        gameState.Scores["Player1"] = 100;
        gameState.Scores["Player2"] = 85;
        
        // 序列化保存
        byte[] serializedData = gameState.ToByteArray();
        
        // 可以保存到文件或发送网络
        SaveToFile(serializedData, "game_save.dat");
        
        // 反序列化读取
        byte[] loadedData = LoadFromFile("game_save.dat");
        GameState loadedState = GameState.Parser.ParseFrom(loadedData);
        
        Debug.Log($"加载游戏: {loadedState.GameId}, 移动次数: {loadedState.MoveCount}");
    }
    
    private void SaveToFile(byte[] data, string filename)
    {
        System.IO.File.WriteAllBytes(Application.persistentDataPath + "/" + filename, data);
    }
    
    private byte[] LoadFromFile(string filename)
    {
        return System.IO.File.ReadAllBytes(Application.persistentDataPath + "/" + filename);
    }
}
```

### 第七步：高级使用 - 算法请求处理

```C#
// AlgorithmClient.cs
using UnityEngine;
using Google.Protobuf;
using Solitaire;

public class AlgorithmClient : MonoBehaviour
{
    // 发送算法请求到DLL
    public AlgorithmResponse SendAlgorithmRequest(GameState currentState, AlgorithmType algorithmType)
    {
        // 1. 构建请求
        var request = new AlgorithmRequest
        {
            RequestId = System.Guid.NewGuid().ToString(),
            AlgorithmType = algorithmType,
            GameState = currentState
        };
        
        // 2. 序列化请求
        byte[] requestData = request.ToByteArray();
        
        // 3. 调用C++ DLL（通过P/Invoke）
        IntPtr responsePtr = NativeAlgorithmEngine.ExecuteAlgorithm(requestData, requestData.Length);
        
        // 4. 处理DLL返回的数据（需要实现Marshal逻辑）
        byte[] responseData = MarshalResponse(responsePtr);
        
        // 5. 反序列化响应
        AlgorithmResponse response = AlgorithmResponse.Parser.ParseFrom(responseData);
        
        return response;
    }
    
    // 处理移动建议
    public void ProcessMoveSuggestion(GameState gameState)
    {
        var response = SendAlgorithmRequest(gameState, AlgorithmType.SuggestMove);
        
        if (response.Success)
        {
            // 处理成功结果
            Debug.Log("算法执行成功！");
            
            // 如果有二进制结果数据，可以进一步解析
            if (response.ResultData != null && response.ResultData.Length > 0)
            {
                // 根据具体需求解析result_data
                ProcessResultData(response.ResultData.ToByteArray());
            }
        }
        else
        {
            Debug.LogError($"算法执行失败: {response.ErrorMessage}");
        }
    }
    
    private void ProcessResultData(byte[] resultData)
    {
        // 根据具体协议解析二进制结果
        // 例如，如果result_data是另一个Protobuf消息
        // var moveResult = MoveResult.Parser.ParseFrom(resultData);
    }
}
```

### 第八步：配置Unity的编译设置

**在Unity中解决编译问题：**

```C#
// 如果遇到编译错误，可能需要添加预处理指令
#if UNITY_EDITOR || UNITY_STANDALONE
using Google.Protobuf;
using Solitaire;
#endif

public class MyClass 
{
    // 你的代码
}
```

### 完整工作流程总结

1. **设计阶段**：编写 `.proto`文件定义数据结构
2. **代码生成**：使用 `protoc`生成对应语言的类文件
3. **项目集成**：将生成的 `.cs`文件拖入Unity项目
4. **依赖管理**：安装Protobuf的Unity包
5. **开发使用**：在C#代码中创建、序列化、反序列化Protobuf对象
6. **数据交互**：通过字节数组与C++ DLL或其他系统通信

这个流程确保了团队间数据格式的一致性，同时提供了高效的序列化性能，非常适合游戏开发中的数据通信需求。
