---
title: 网络通信
date: 2026-06-27 04:24:00
categories:
  - Unity/游戏客户端
tags:
  - Unity网络编程基础
  - 笔记
---
# 网络游戏通信方案概述

- **弱联网游戏**：以短时 HTTP/HTTPS 连接为主，通信频率低，可能几分钟甚至几小时才有一次通信，数据传输量少，主要是分数、道具信息等少量业务数据。核心玩法在客户端完成，客户端处理完后告知服务端结果，服务端进行验证即可，如开心消消乐、我叫 MT 等休闲游戏。
- **强联网游戏**：采用持久的 TCP/UDP 连接，通信频率高，通常每秒可达 10-60 次，数据传输量大，包含角色位置、动作等大量实时状态数据。部分核心逻辑由服务端处理，客户端和服务端需不停同步信息，像王者荣耀、魔兽世界等多人在线实时对战游戏或大型角色扮演游戏。
- **长连接游戏**：客户端和服务器之间保持长时间连接，在游戏过程中持续进行数据交互，能实时传输数据，保证游戏流畅性和实时性，但对服务器资源占用较大。适用于强联网游戏，如 MMORPG、MOBA、ACT 等多人在线实时对战游戏，以满足及时更新玩家状态信息等需求。
- **短连接游戏**：客户端与服务器进行一次数据交互后就断开连接，下次有需求时再重新建立连接。连接建立和断开开销小，对服务器资源占用相对较少，但不适合实时性要求高的场景，每次连接获取数据可能存在一定延迟。对应弱联网游戏，如三消类休闲游戏、卡牌游戏等不需要频繁实时与服务器交互数据的游戏。

 ![image-20250618154042041](/notes-assets/Unity%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/assets/image-20250618154042041.png)

### IP地址与端口类

在 Unity 游戏开发中，IP 地址和端口是实现网络通信的核心要素：

- **IP 地址**：标识网络中设备的唯一逻辑地址（如`192.168.1.100`），用于定位通信目标设备。
- **端口号**：标识设备中具体的通信进程（范围 0-65535），如 HTTP 默认 80 端口、Unity 网络服务器常用 7777 端口等。 

```C#
using System.Net;
using UnityEngine;

public class Lesson1 : MonoBehaviour
{
    void Start()
    {
#region 知识点IPAddress类

    //命名空间：System.Net;
    //类名:国

    //初始化IP信息的方式
    //1，用byte数组进行初始化
    byte[] bytes = new byte[]{192,168,11,1};
    IPAddress ip1 = new IPAddress(bytes);
    //2.用1ong长整型进行初始化
    //4字节对应的长整型一般不建议使用
    IPAddress ip2 = new IPAddress(0xc0a80b01);

    //3.推荐使用的方式使用字符串转换
    IPAddress ip3 = IPAddress.Parse("192.168.11.1");
    //特殊IP地址
    //127.0.0.1代表本机地址
#endregion

#region 知识点三IPEndPoint类
    //命名空间：System.Net;
    //类名：IPEndPoint
    //IPEndPoint类将网络端点表示为IP地址和端口号，表现为IP地址和端口类的组合
    //初始化方式

    //1.用IPAddress和int类型（端口号）进行初始化
    IPEndPoint ipPonit = new IPEndPoint(IPAddress.Parse("192.168.11.1"),8080);
        
#endregion
    }

}
```

### 域名解析

在计算机网络中，**域名解析**是将人类可读的域名（如`www.example.com`）转换为机器可识别的 IP 地址（如`192.168.1.1`）的过程。这一过程通过**域名系统（DNS）** 实现，类似于 “网络通讯录”，让用户无需记忆复杂的 IP 地址，直接通过域名访问目标服务器。

在 Unity 中进行域名解析（将域名转换为 IP 地址）可通过`Dns.GetHostEntry`或`Dns.GetHostAddresses`方法实现。

```C#
using System.Net;
using UnityEngine;
using System.Threading.Tasks;
public class lesson2 : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        //常用方法
    //1.获取本地系统的主机名
    print(Dns.GetHostName());
    //2.获取指定域名的IP信息
    //根据域名获取目标的Ip地址和主机别名
    //同步获取
    //注意：由于获取远程主机信息是需要进行网路通信，所以可能会阻塞主线程
    IPHostEntry ipHostEntry = Dns.GetHostEntry("www.baidu.com");
    for(int i = 0;i<ipHostEntry.AddressList.Length;i++  )
    {
        print("ip地址"+ipHostEntry.AddressList[i]);
    }
    for(int i = 0;i<ipHostEntry.Aliases.Length;i++  )
    {
        print("主机别名"+ipHostEntry.Aliases[i]);
    }
    print("DNS服务器名称"+ipHostEntry.HostName);


    GetHostEntryAsync("www.baidu.com");
    }

//异步获取域名解析
    private async void GetHostEntryAsync(string hostName){
        Task<IPHostEntry> task = Dns.GetHostEntryAsync(hostName);
        await task;
        for(int i =0;i<task.Result.AddressList.Length;i++   )
        {
            print("ip地址"+task.Result.AddressList[i]);
        }
        for(int i =0;i<task.Result.Aliases.Length;i++)
        {
            print("主机别名"+task.Result.Aliases[i]);
        }
        print("DNS服务器名称"+task.Result.HostName);
    }
}

```

### 序列化和反序列化2进制数据

**序列化**：将类对象信息转换为可保存或传输的格式的过程



**字符串类型以及非字符串类型转换为字节数组分别使用BitConverter类和Encoding类进行转换**

```C# 
byte[]  bytes = BitConverter.GetBytes(1);  //非字符串
byte[]	bytes1 = Encoding.UTF8.GetBytes("11111");  //字符串
```

**对于如何将类序列化，不能直接使用C#中的BinaryFormatter进行2进制的序列化，因为是C#语言的规则与其他语言的兼容性不好，如果使用它那么其他语言开发的服务器无法进行反序列化，使用需要自定义处理类对象**





**反序列化**：与序列化相对，将保存或传输过来的格式转换为类对象的过程

![image-20250618164609014](/notes-assets/Unity%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/assets/image-20250618164609014.png)

### **UTF-8 为何成为网络通信的首选？**

| **优势维度**   | **具体表现**                                               |
| -------------- | ---------------------------------------------------------- |
| **兼容性**     | 支持全球语言，跨平台 / 系统通用，与 ASCII 无缝兼容。       |
| **存储效率**   | 可变长编码，英文等常用字符占用字节少，压缩后传输流量更低。 |
| **处理便捷性** | 无字节序问题，错误定位容易，协议与工具链支持完善。         |
| **生态与标准** | W3C、HTTP 等国际标准强制推荐，开源社区和工具默认支持。     |
| **未来扩展性** | 支持 Unicode 持续更新，适应多语言内容增长需求。            |



# 套接字Socket

Socket（套接字）是网络通信的端点，用于不同主机或同一主机上的不同进程之间的通信。在C#中，Socket类封装了Berkeley套接字接口。一个Socket对象表示一个本地或者远程套接字信息，它可以被视为一个数据通道，这个通道连接客户端和服务端，通过这个通道收发消息，

### 主要协议类型

- **Stream Socket (SOCK_STREAM)**: 面向连接的TCP协议：提供面向连接的，可靠的，有序的，数据无差错的且无重复的数据传输任务
- **Datagram Socket (SOCK_DGRAM)**: 无连接的UDP协议：提供无连接的，不可靠的，数据包不能大于32kb的通信服务
- **Raw Socket (SOCK_RAW)**: 原始套接字

Socket的构造函数的存在3个参数，分别是AddressFamity（网络寻址，枚举类型，决定寻址放案ipv4，ipv6），Socket枚举类型（决定使用的套接字类型），ProtocolType（协议枚举类型，决定套接字使用的通信协议）

``` C#
// 创建TCP Socket
Socket tcpSocket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

// 创建UDP Socket
Socket udpSocket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
```

## TCP同步通信

### 套接字的常用属性

```C#
//1.套接字的连接状态
if(tcpSocket.Connected)
{
}
//2.获取套接字的类型
print(tcpSocket.SocketType);

//3.获取套接字的协议类型
print(tcpSocket.ProtocolType);

//4.获取套接字的寻址方案
print(tcpSocket.AddressFamily);

//5.从网络中获取准备读取的数据数据量
print(tcpSocket.Available);

//6.获取本机EndPoint对象（注意EndPoint继承EndPoint）
print(tcpSocket.LocalEndPoint as IPEndPoint);

//7.获取远程EndPoint对象
print(tcpSocket.RemoteEndPoint  as IPEndPoint);
```

### Tcp客户端的常用方法

```C#
// 创建TCP Socket
Socket clientSocket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

// 连接服务器
IPEndPoint endPoint = new IPEndPoint(IPAddress.Parse("127.0.0.1"), 8888);
clientSocket.Connect(endPoint);

// 发送数据
string message = "Hello Server!";
byte[] data = Encoding.UTF8.GetBytes(message);
clientSocket.Send(data);

// 接收响应
byte[] buffer = new byte[1024];
int bytesReceived = clientSocket.Receive(buffer);
string response = Encoding.UTF8.GetString(buffer, 0, bytesReceived);
Console.WriteLine($"服务器响应: {response}");

// 关闭连接
clientSocket.Shutdown(SocketShutdown.Both);
clientSocket.Close();
```

### Tcp 服务端的常用方法

```C#
// 创建TCP Socket
Socket serverSocket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

// 绑定IP和端口
IPEndPoint endPoint = new IPEndPoint(IPAddress.Any, 8080);
serverSocket.Bind(endPoint);

// 开始监听，设置最大连接数
serverSocket.Listen(10);

Console.WriteLine("服务器已启动，等待客户端连接...");

// 接受客户端连接
Socket clientSocket = serverSocket.Accept();
Console.WriteLine($"客户端已连接: {clientSocket.RemoteEndPoint}");

// 接收数据
byte[] buffer = new byte[1024];
int bytesReceived = clientSocket.Receive(buffer);
string receivedData = Encoding.UTF8.GetString(buffer, 0, bytesReceived);
Console.WriteLine($"接收到数据: {receivedData}");

// 发送数据
string response = "Hello Client!";
byte[] responseData = Encoding.UTF8.GetBytes(response);
clientSocket.Send(responseData);

// 关闭连接
clientSocket.Shutdown(SocketShutdown.Both);
clientSocket.Close();
serverSocket.Close();
```

![image-20250620144750887](/notes-assets/Unity%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/assets/image-20250620144750887.png)

### Tcp服务端的操作流程

创建Socket对象

```C#
Socket serverSocket = new Socket(
    AddressFamily.InterNetwork,  // 使用IPv4地址
    SocketType.Stream,          // 流式Socket(TCP)
    ProtocolType.Tcp);          // TCP协议
```

绑定IP和端口

```C#
IPEndPoint localEP = new IPEndPoint(
    IPAddress.Any,   // 监听所有可用网络接口
    8080);           // 监听端口号

serverSocket.Bind(localEP);     // 绑定本地端点
```

开始监听

```C#
serverSocket.Listen(10);  // 参数指定最大挂起连接数
Console.WriteLine("服务器已启动，等待连接...");
```

接受客户端连接

```c#
Socket clientSocket = serverSocket.Accept();  // 阻塞等待客户端连接
Console.WriteLine($"客户端已连接: {clientSocket.RemoteEndPoint}");
```

数据通信

```c#
// 发送数据
string welcomeMsg = "欢迎连接到服务器";
byte[] sendData = Encoding.UTF8.GetBytes(welcomeMsg);
clientSocket.Send(sendData);

// 接收数据
byte[] buffer = new byte[1024];
int recv = clientSocket.Receive(buffer);  // 阻塞接收数据
string receivedMsg = Encoding.UTF8.GetString(buffer, 0, recv);
Console.WriteLine($"收到消息: {receivedMsg}");
```

关闭连接

```C#
clientSocket.Shutdown(SocketShutdown.Both);  // 禁用发送和接收
clientSocket.Close();                       // 关闭客户端Socket
serverSocket.Close();                       // 关闭服务器Socket
```

### Tcp客户端的操作流程

创建Socket对象

```C#
Socket clientSocket = new Socket(
    AddressFamily.InterNetwork,  // 使用IPv4地址
    SocketType.Stream,          // 流式Socket(TCP)
    ProtocolType.Tcp);          // TCP协议
```

连接服务器

```c#
IPEndPoint ipPoint = new IPEndPoint(
    IPAddress.Parse("127.0.0.1"),  // 服务器IP地址
    8080);                         // 服务器端口号

try {
    clientSocket.Connect(ipPoint);  // 连接服务器
    Console.WriteLine("已连接到服务器");
} catch (SocketException ex) {
    Console.WriteLine($"连接失败: {ex.Message}");
    return;
}
```

数据通信

```C#
// 接收服务器欢迎消息
byte[] buffer = new byte[1024];
int recv = clientSocket.Receive(buffer);
string welcomeMsg = Encoding.UTF8.GetString(buffer, 0, recv);
Console.WriteLine($"服务器消息: {welcomeMsg}");

// 发送数据到服务器
string message = "Hello Server!";
byte[] sendData = Encoding.UTF8.GetBytes(message);
clientSocket.Send(sendData);
```

关闭连接

```C#
clientSocket.Shutdown(SocketShutdown.Both);  // 禁用发送和接收
clientSocket.Close();                       // 关闭Socket
Console.WriteLine("连接已关闭");
```

### 服务端为什么需要两个Socket？

#### 监听Socket

- **作用**：
  负责监听指定端口的连接请求，像"总机接线员"一样，只处理客户端的连接请求（TCP三次握手），​**​不参与实际数据传输​**​。
- **生命周期**：
  从启动服务到关闭服务期间一直存在，通常只创建一次。
- **关键特性**：
  - 调用`Accept()`时会阻塞，直到有客户端连接
  - 一个监听Socket可以接受多个客户端连接

#### 客户端通信Socket

- **作用**：
  与​**​特定客户端​**​进行一对一的数据传输（收发数据），像"专属客服"。
- **生命周期**：
  从客户端连接到断开连接期间存在，​**​每个客户端连接都会创建一个新实例​**​。
- **关键特性**：
  - 通过`Receive()`/`Send()`与客户端交互
  - 包含客户端的IP和端口信息（`RemoteEndPoint`）

|   设计原因   |           监听Socket           |   客户端通信Socket   |
| :----------: | :----------------------------: | :------------------: |
| **职责分离** |         只处理连接请求         |    只处理数据交换    |
| **并发支持** | 一个监听Socket可服务多个客户端 | 每个客户端独立Socket |
| **资源优化** |          占用固定资源          |    按需创建/销毁     |
| **安全控制** |        统一管理连接请求        |   独立控制每个连接   |

### **客户端Socket的单一性原理**

客户端只需要一个Socket对象的原因在于其**单向连接特性**：单个Socket完成了建立连接和通信的功能 

|     对比项     |          服务器端          |              客户端              |
| :------------: | :------------------------: | :------------------------------: |
|    **角色**    |      被动接受多个连接      |         主动发起单个连接         |
| **Socket职责** | 监听Socket + N个通信Socket | 单个Socket同时负责连接和数据传输 |
|  **生命周期**  |     监听Socket长期存在     |      连接建立到断开期间存在      |

### 区分消息类型

当序列化的2进制数据发送给对象时，应该如何去区分消息以及如何去使用对于的数据类去反序列化2进制数据？

- 在所有的发送的消息前加上ID（int ，short等待），即字节数组的头部加上ID。如果选用int类型作为消息ID的类型，那么在解析数据前，先把前4个字节取出来解析为消息ID，在根据ID进行消息的反序列化

### 分包和黏包

分包：一个消息分为多条消息发送

黏包：一个消息和另一个消息黏在一起（同时到达，变成了一个字节数组）

两者可能同时发生

![image-20250624151537023](/notes-assets/Unity%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/assets/image-20250624151537023.png)

如何去判断一条消息的发送是否出现了分包和黏包？

- 通过在消息体前面加上消息长度的字段来进行区分，解析消息的长度来判断到收到的消息体的字节数组是否满足长度，不够则出现了分包，超出则出现了黏包

|       场景       |                           判断条件                           |             处理方式             |
| :--------------: | :----------------------------------------------------------: | :------------------------------: |
|   **正常消息**   |                收到的字节数 == `TotalLength`                 |           直接反序列化           |
| **分包（半包）** |                 收到的字节数 < `TotalLength`                 |           等待后续数据           |
|     **黏包**     | `收到的字节数 > TotalLength` 或 缓冲区包含多个`TotalLength`标识的消息 | 截取第一条完整消息，保留剩余数据 |

![image-20250624152025808](/notes-assets/Unity%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/assets/image-20250624152025808.png)

### 客户端主动断开连接  

### 实现心跳机制

心跳消息：在长连接时，客户端和服务端之间定期发送的一种特殊的数据包用于通知对方自己还在线，确保长连接的有效性。（发送间隔是固定的持续的） 

- 避免非正常的关闭客户端时，服务器无法准确的收到关闭连接的消息
- 避免客户端长期不发送消息，防火墙或者路由器会断开连接，使用心跳消息一直保持活跃消息

客户端实现定时发送消息的功能，服务端不停检测上次收到某客户端的消息的时间，如果超时则认为连接已经断开。

```C#
//可以使用Unity自带的Api定时循环发送消息
InvokeRepeating("SendHeartMsg",0,2);//间隔2s，一开始就发送
public void SendHeartMsg(){
}
```

## TCP异步通信 

### Begin开头的方法

- BeginAccept：服务端的连接方法，EndAccept
- BeginConnect:客户端的连接方法，EndConnect
- BeginReceive：服务端和客户端接受信息的方法，EndReceive
- BeginSend：服务端和客户端发送消息的方法，EndSend

`BeginAccept` 的方法签名如下：

```C#
public IAsyncResult BeginAccept(AsyncCallback callback, object state);
```

- **`callback`**：异步操作完成时调用的回调函数（`IAsyncResult` 作为参数）。

- **`state`**：一个用户定义的对象，用于传递额外信息到回调函数（通常用于传递上下文信息）。

  

`BeginConnect` 的方法签名如下：

```C#
public IAsyncResult BeginConnect(
    EndPoint remoteEP, 
    AsyncCallback callback, 
    object state
);
```

- `remoteEP`：目标服务端的终结点（如 `IPEndPoint`）。
- `callback`：连接完成时调用的回调函数。
- `state`：传递到回调的用户自定义对象（通常是客户端 Socket）。



`BeginAccept` 的方法签名如下：

```C#
public IAsyncResult BeginSend(
    byte[] buffer, 
    int offset, 
    int size, 
    SocketFlags socketFlags,
    AsyncCallback callback, 
    object state
);
```

- `buffer`：要发送的数据字节数组。
- `offset`：数据起始偏移量。
- `size`：要发送的字节数。
- `socketFlags`：发送行为的标志（如 `SocketFlags.None`）。
- `callback`：发送完成时调用的回调函数。
- `state`：传递到回调的用户自定义对象（通常是当前 Socket）。



`BeginReceive` 的方法签名如下：

```C#
public IAsyncResult BeginReceive(
    byte[] buffer, 
    int offset, 
    int size, 
    SocketFlags socketFlags,
    AsyncCallback callback, 
    object state
);
```

- `buffer`：存储接收数据的字节数组。
- `offset`：数据存储的起始偏移量。
- `size`：要接收的最大字节数。
- `socketFlags`：接收行为的标志（如 `SocketFlags.None`）。
- `callback`：接收完成时调用的回调函数。
- `state`：传递到回调的用户自定义对象（通常是当前 Socket）。

```C#
using System.Collections;
using System.Collections.Generic;
using System.Net.Sockets;
using UnityEngine;
using System;
using System.Net;
using System.Text;

public class Lesson12 : MonoBehaviour
{
    private byte[] buffer = new byte[1024];
    void Start()
    {
        //创建Tcp服务器
        Socket socketTcp = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
        socketTcp.BeginAccept(AcceptCallback,socketTcp);
        
        //创建TCp客户端，客户端只需要与服务器连接一次，所以不需要封装回调函数
        IPEndPoint ipPoint = new IPEndPoint(IPAddress.Parse("127.0.0.1"),8080);
        socketTcp .BeginConnect(ipPoint,(result)=>{
            Socket s = result.AsyncState as Socket;
            try{
                s.EndConnect(result);
                Debug.Log("连接成功");
            }
            catch(SocketException e){
                Debug.LogError(e);
            }
        },socketTcp);

        //服务器接收消息
        socketTcp.BeginReceive(buffer,0,buffer.Length,SocketFlags.None,ReceiveCallback,null);
        //服务器发送消息
        byte[] sendMsg = Encoding.UTF8.GetBytes("Hello, World!");
        socketTcp.BeginSend(sendMsg,0,sendMsg.Length,SocketFlags.None,SendCallback,socketTcp);

    }
    //因为服务器需要接受多个客户端连接，所以封装一个回调函数，用于接受客户端连接
    private void AcceptCallback(IAsyncResult result){
        try{
                //因为BeginAccept是异步的，无法直接获取socketTcp对象，所以需要使用AsyncState来获取
                 //获取客户端socket    
                s.BeginAccept(AcceptCallback,null);
            }
            catch(SocketException e){
                Debug.LogError(e);
            }
    }

    //服务器接收消息
    private void ReceiveCallback(IAsyncResult result){
            Socket s = result.AsyncState as Socket;
        try{
            int num = s.EndReceive(result);
            Encoding.UTF8.GetString(buffer,0,num);
            Debug.Log("服务器收到消息：");
            s.BeginReceive(buffer,0,buffer.Length,SocketFlags.None,ReceiveCallback,null);
        }
        catch(SocketException e){
            Debug.LogError(e);
        }
    }
    //服务器发送消息
    private void SendCallback(IAsyncResult result){
        try{
            Socket s = result.AsyncState as Socket;
            s.EndSend(result); 
            s.BeginSend(buffer,0,buffer.Length,SocketFlags.None,SendCallback,null);
        }
        catch(SocketException e){
            Debug.LogError(e);
        }
    }
    void Update()
    {
        
    }
}
```

### Async结尾的方法

服务端连接

```C#
void Start(){
    Socket socketTcp = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
    SocketAsyncEventArgs e = new SocketAsyncEventArgs();
    e.Completed +=(socket,args)=>{
		if(args.SocketError == SocketError.Success) {
         	Socket clientSocket = args.AcceptSocket;
            (socket as Socket).AcceptAsync(e);
        }  
        else{
            
        }
    }
    sockerTcp.AcceptAsync(e);
}
```

客户端连接

```C#
void Start(){
    Socket socketTcp = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
    SocketAsyncEventArgs e2 = new SocketAsyncEventArgs();
    e2.Completed +=(socket,args)=>{
		if(args.SocketError == SocketError.Success) {
        }  
        else{
            
        }
    }
    sockerTcp.AcceptAsync(e2);
}
```

客户端和服务端之间的通信

```C#
void Start(){
        // 创建异步事件参数对象,发送消息
         SocketAsyncEventArgs e3 = new SocketAsyncEventArgs();
         byte[] buffer = Encoding.UTF8.GetBytes("Hello, World!");
         e3.SetBuffer(buffer,0,buffer.Length);
         e3.Completed +=(socket,args) =>{
            if(args.SocketError == SocketError.Success){
                print("通信成功");
            }
            else{
                print("通信失败"+args.SocketError);
            }
         };
         sockerTcp.SendAsync(e3);

        // 创建异步事件参数对象,接收消息
        SocketAsyncEventArgs e4 = new SocketAsyncEventArgs();
        byte[] buffer1 = new byte[1024];
        e4.SetBuffer(buffer1,0,buffer1.Length);
        e4.Completed +=(socket,args) =>{
            if(args.SocketError == SocketError.Success){
                print("接收成功");
                Encoding.UTF8.GetString(args.Buffer,0,args.BytesTransferred);
                args.SetBuffer(buffer1 ,0,buffer1.Length);
                
                //继续接收消息,接收完成后在接收一条消息
                (socket as Socket).ReceiveAsync(e4);
            }
            else{
                print("接收失败"+args.SocketError);
            }
        };
        sockerTcp.ReceiveAsync(e4);
}
```

SocketAsyncEventArgs.SetBuffer()为它为异步 Socket 操作（发送/接收）配置数据缓冲区。

- **分配工作区间**：为异步操作指定存储数据的字节数组
- **避免重复分配**：可重用同一缓冲区进行多次操作，减少GC压力

```C#
public void SetBuffer(byte[] buffer, int offset, int count);
```

|   参数   |   类型   |      作用域      |    典型值示例    |
| :------: | :------: | :--------------: | :--------------: |
| `buffer` | `byte[]` | 数据存储物理空间 | `new byte[1024]` |
| `offset` |  `int`   |   操作起始位置   | `0` (从数组开头) |
| `count`  |  `int`   |  最大操作字节数  | `buffer.Length`  |

![image-20250625185730322](/notes-assets/Unity%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/assets/image-20250625185730322.png)

### 异步通信的客户端和服务端

服务端的ServerSocket：通过服务端与客户端的连接以及广播，使用异步BeginAccept方法进行连接。同时将连入的客户端存入客户端字典，管理所有与服务端连接的客户端。

```C#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
namespace AsyncServerSocket
{
    class ServerSocket
    {
        private Socket socket;
        private Dictionary<int, ClientSocket> clientDic = new Dictionary<int, ClientSocket>();
        public void Start(string ip, int port, int num)
        {
            socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            IPEndPoint ipPoint = new IPEndPoint(IPAddress.Parse(ip), port);
            try
            {
                socket.Bind(ipPoint);
                socket.Listen(num);
                socket.BeginAccept(AccpetCallback, null);

            }
            catch (Exception e)
            {
                Console.WriteLine("连接失败" + e.Message);
            }
        }
        public void AccpetCallback(IAsyncResult result)
        {
            try
            {
                //获取连入的客户端
                Socket clientSocket = socket.EndAccept(result);

                //初始化连入的客户端
                ClientSocket client = new ClientSocket(clientSocket);
                clientDic.Add(client.clientID, client);

                //继续连接其他客户端
                socket.BeginAccept(AccpetCallback, null);
            }
            catch (Exception e)
            {
                {
                    Console.WriteLine("客户端连入失败" + e.Message);
                }
            }
        }
        public void Broadcast(string str)
        {
            foreach(var socket in clientDic.Values)
            {
                socket.Send(str);
            }
        }
    }
}
```

服务端的中的客户端：**封装客户端连接状态**：每个客户端都有自己的状态

- 每个客户端连接都有自己的状态（如socket、ID、缓存等），需要独立管理
- `ClientSocket`类封装了这些状态和相关的操作逻辑

```C#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace AsyncServerSocket
{
    class ClientSocket
    {
        public Socket socket;
        public int clientID;
        private static int CLIENT_ID = 1;

        private byte[] cacheBytes = new byte[1024];
        private int cacheNum = 0;
        public ClientSocket(Socket socket)
        {
            this.socket = socket;
            clientID = CLIENT_ID;
            ++CLIENT_ID;

            this.socket.BeginReceive(cacheBytes, cacheNum, cacheBytes.Length, SocketFlags.None, ReceiveCallback, this.socket);
        }
        public void ReceiveCallback(IAsyncResult result)
        {    
            try
            {
                cacheNum = this.socket.EndReceive(result);
                Console.WriteLine(Encoding.UTF8.GetString(cacheBytes, 0, cacheNum));
                cacheNum = 0;
                if (this.socket.Connected)
                {
                    this.socket.BeginReceive(cacheBytes, 0,cacheBytes.Length,SocketFlags.None,ReceiveCallback , this.socket);
                }
                else
                {
                    Console.WriteLine("没有连接，不用在接收消息");
                }
            }
            catch(SocketException e)
            {
                Console.WriteLine("连接失败",e.Message);
            }
        }
        public void Send(string str)
        {
            if (this.socket.Connected)
            {
                byte[] buffer = Encoding.UTF8.GetBytes(str);
                this.socket.BeginSend(buffer,0,buffer.Length,SocketFlags.None,SendCallback,null);
            }
            else
            {

            }

        }
        public void SendCallback(IAsyncResult result)
        {
            try
            {
                this.socket.EndSend(result);

            }
            catch (SocketException e)
            {
                Console.WriteLine("发送失败"+e.SocketErrorCode + e.Message);
            }
        }
    }
}
```

客户端：

```C#
using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using UnityEngine;

/// <summary>
/// 网络异步管理器 - 负责处理TCP客户端的异步连接、发送和接收消息
/// 使用单例模式，确保全局只有一个网络管理器实例
/// </summary>
public class NetAsyncMgr : MonoBehaviour
{
    // 单例实例
    private static NetAsyncMgr instance;
    
    /// <summary>
    /// 单例访问器
    /// </summary>
    public static NetAsyncMgr Instance
    {
        get
        {
            return instance;
        }
    }

    /// <summary>
    /// 与服务器进行连接的Socket对象
    /// </summary>
    public Socket socket;

    /// <summary>
    /// 接收消息用的缓存容器 - 用于存储从服务器接收到的数据
    /// </summary>
    private byte[] cacheBuffer = new byte[1024];
    
    /// <summary>
    /// 缓存中已使用的字节数
    /// </summary>
    private int cacheNum = 0;

    /// <summary>
    /// 初始化单例实例，并设置不销毁
    /// </summary>
    void Awake()
    {
        instance = this;
        DontDestroyOnLoad(gameObject); // 场景切换时不销毁
    }

    void Start()
    {
        
    }

    /// <summary>
    /// 连接到指定的服务器
    /// </summary>
    /// <param name="ip">服务器IP地址</param>
    /// <param name="port">服务器端口</param>
    public void Connect(String ip, int port)
    {
        // 如果socket不为空，并且已经连接，则返回
        if (socket != null && socket.Connected)
        {
            return;
        }

        // 创建新的Socket对象 - 使用TCP协议
        socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
        
        // 创建服务器端点
        IPEndPoint ipPoint = new IPEndPoint(IPAddress.Parse(ip), port);
        
        // 创建异步连接参数
        SocketAsyncEventArgs e = new SocketAsyncEventArgs();
        e.RemoteEndPoint = ipPoint;
        
        // 设置连接完成的回调函数
        e.Completed += (socket, args) =>
        {
            if (args.SocketError == SocketError.Success)
            {
                Debug.Log("连接成功");

                // 连接完成后，开始异步接收消息
                SocketAsyncEventArgs receiveArgs = new SocketAsyncEventArgs();
                receiveArgs.SetBuffer(cacheBuffer, 0, cacheBuffer.Length);

                // 设置接收消息的回调函数
                receiveArgs.Completed += ReceiveCallback;
                
                // 开始异步接收消息
                this.socket.ReceiveAsync(receiveArgs);
            }
            else
            {
                Debug.Log("连接失败: " + args.SocketError);
            }
        };
        
        // 开始异步连接
        socket.ConnectAsync(e);
    }

    /// <summary>
    /// 接收消息完成的回调函数
    /// 与lambda表达式相比，可以捕获变量，并且可以释放变量
    /// </summary>
    /// <param name="sender">发送者对象</param>
    /// <param name="args">异步事件参数</param>
    private void ReceiveCallback(object sender, SocketAsyncEventArgs args)
    {
        if (args.SocketError == SocketError.Success)
        {
            // 将接收到的字节数组转换为字符串
            string receivedMessage = Encoding.UTF8.GetString(args.Buffer, 0, args.BytesTransferred);
            Debug.Log("收到消息: " + receivedMessage);

            // 重置缓冲区，准备接收下一条消息
            args.SetBuffer(cacheBuffer, 0, cacheBuffer.Length);

            // 如果连接仍然有效，继续异步接收消息
            if (this.socket.Connected && this.socket != null)
            {
                this.socket.ReceiveAsync(args);
            }
        }
        else
        {
            Debug.Log("接收失败: " + args.SocketError);
            Close(); // 关闭连接
        }
    }

    /// <summary>
    /// 向服务器发送消息
    /// </summary>
    /// <param name="msg">要发送的消息内容</param>
    public void Send(string msg)
    {
        if (socket != null && socket.Connected)
        {
            // 将字符串转换为字节数组
            byte[] buffer = Encoding.UTF8.GetBytes(msg);
            
            // 创建发送参数
            SocketAsyncEventArgs args = new SocketAsyncEventArgs();
            args.SetBuffer(buffer, 0, buffer.Length);
            
            // 设置发送完成的回调函数
            args.Completed += (socket, args) =>
            {
                if (args.SocketError == SocketError.Success)
                {
                    Debug.Log("发送成功");
                }
                else
                {
                    Debug.Log("发送失败: " + args.SocketError);
                    Close(); // 关闭连接
                }
            };
            
            // 开始异步发送
            this.socket.SendAsync(args);
        }
    }

    /// <summary>
    /// 关闭网络连接
    /// </summary>
    public void Close()
    {
        if (socket != null)
        {
            socket.Shutdown(SocketShutdown.Both); // 关闭socket的读写功能
            socket.Disconnect(false); // 断开连接
            socket.Close(); // 关闭socket
            socket = null; // 清空引用
        }
    }
}
```

## UDP同步通信

UDP每次发送的数据都是一个独立的**数据报（Datagram）**，接收方必须以**完整的数据报**为单位接收，不会合并或拆分，所以不会出现粘包问题。

TCP不保留消息边界，数据被视为无结构的字节流。发送方多次写入的数据可能被接收方一次性读取（粘包），或单次写入的数据被拆分成多次接收（分包）。

但是UDP通信可能出现分包的问题。

- **限制UDP数据报大小 ≤ MTU**：确保单次`sendto()`的数据 ≤ 1472字节（以太网环境下），避免IP分片。如果数据较大，应用层自行分片，并在接收方重组。
- **手动进行数据报分片**：前提是解决UDP无序和丢包的问题
- **使用可靠的UDP通信**：

![image-20250626164038281](/notes-assets/Unity%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/assets/image-20250626164038281.png)

```C#
客户端的综合练习 --UDP的收消息和发送消息
using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
namespace UDP
{
    class Client //记录和服务器通信过的Ip和端口 
    {
        public IPEndPoint clientIPAndPoint;
        public string ClientStrID;

        //上一次收到消息的时间，心跳机制
        public long frontTime = -1;

        public Client(string IP,int port) {
            ClientStrID = IP + port;

            clientIPAndPoint = new IPEndPoint(IPAddress.Parse(IP), port);
        }
        public void ReceiveMsg(byte[] buffer)
        {
            //为了避免处理消息时又接收到了其他的消息，所以在处理前将其拷贝出来
            byte[] cache = new byte[512];
            buffer.CopyTo(cache, 0);

            frontTime = DateTime.Now.Ticks / TimeSpan.TicksPerSecond;//记录收到消息的时间

            ThreadPool.QueueUserWorkItem(HandleMsg, cache);

        }
        private void HandleMsg(Object obj)
        {
            try
            {
                //取出传进来的字节
                byte[] buffer = obj as byte[];


                int nowIndex = 0;
                //先处理ID
                int msgID = BitConverter.ToInt32(buffer, nowIndex);
                nowIndex += 4;
                //在处理长度
                int msgLength = BitConverter.ToInt32(buffer, nowIndex);
                nowIndex += 4;
                //在处理消息体
                switch (msgID)
                {
                    case 1001:
                        PlayerMsg playerMsg = new PlayerMsg();
                        playerMsg.Reading(buffer, nowIndex);

                        break;
                    case 1003:
                        break;
                }
            }

            catch (Exception e)
            {
                Console.WriteLine("");
            }
        }
     }  
}
```

服务的综合练习

```C#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace UDP
{
    class ServerSocket
    {
        public Socket socket;
        private bool isCLose = false;

        private Dictionary<string,Client>ClientDic = new Dictionary<string,Client>();
        //通过记录ip和端口
        public void Start(string ip,int port)
        {
            socket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
            IPEndPoint ipPoint = new IPEndPoint(IPAddress.Parse(ip), port);
            try
            {
                socket.Bind(ipPoint);
                isCLose = false;
                ThreadPool.QueueUserWorkItem(ReceiveMsg);

                //定时检测超时线程
                ThreadPool.QueueUserWorkItem(CheckTimeOut);
            }
            catch (Exception ex)
            {
                Console.WriteLine("UDP开启出错"+ex.Message );
            }
            
        }
        public void ReceiveMsg(Object obj)
        {
            byte[] buffer = new byte[512];
            EndPoint endPoint = new IPEndPoint(IPAddress.Any, 0);

            string strID = "";//将IP和端口号拼接作为客户端的唯一标识
            string IP;
            int port;
            while (!isCLose)
            {
                if (socket.Available > 0)
                {
                    lock(socket)//避免同时收发
                        socket.ReceiveFrom(buffer, ref endPoint);
                    //将发送消息的客户端的ip和port取出拼接为唯一ID
                    IP = (endPoint as IPEndPoint).Address.ToString();
                    port = (endPoint as IPEndPoint).Port;
                    strID = IP + port;


                    //判断字典中是否有该客户端（服务端是否记录此客户端），如果有则处理收发消息，没有则加入字典，在处理收发消息
                    if (ClientDic.ContainsKey(strID))  
                    {
                        ClientDic[strID].ReceiveMsg(buffer);//在Client中处理具体的收消息
                    }
                    else
                    {
                        ClientDic.Add(strID, new Client(IP,port));
                        ClientDic[strID].ReceiveMsg(buffer);
                    }
                }
            }
        }
        //指定发送一个消息给某个目标
        public void SendMsg(BaseMsg msg,IPEndPoint ipPoint) {
            try
            {
                lock (socket)//避免同时收发
                    socket.SendTo(msg.Writing(),ipPoint);
            }
            catch (SocketException e)
            {
                Console.WriteLine("发信息出现问题"+e.SocketErrorCode+e.Message);
            }
            catch (Exception e)
            {
                Console.WriteLine("");
            }
        }
   

        public void Close()
        {
            if(socket != null)
            {
                isCLose = true;
                socket.Shutdown(SocketShutdown.Both);
                socket.Close();
                socket = null;
            }
        }
    
        private void CheckTimeOut(Object obj)
        {
            long nowTime = 0;
            List<string> delList = new List<string>(); //待删除的客户端列表
            while (true)
            {
                Thread.Sleep(10000);
                nowTime = DateTime.Now.Ticks/TimeSpan.TicksPerSecond;//系统当前时间
                foreach (Client c in ClientDic.Values) {
                    if(nowTime - c.frontTime >= 10)
                    {
                        delList.Add(c.ClientStrID);//添加进入列表
                    }
                    
                }

                //根据待删除列表在客户端字典移除对于ID的客户端
                for(int i = 0; i < delList.Count; i++)
                {
                    RemoveClient(delList[i]);

                }
                delList.Clear();

            }
        }
        public void RemoveClient(string ClientID)
        {
            if(ClientDic.ContainsKey(ClientID))
            {
                ClientDic.Remove(ClientID);
                
            }
        }
    }
}

```

```C#
using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace UDP
{
    class Client //记录和服务器通信过的Ip和端口 
    {
        public IPEndPoint clientIPAndPoint;
        public string ClientStrID;

        //上一次收到消息的时间，心跳机制
        public long frontTime = -1;

        public Client(string IP,int port) {
            ClientStrID = IP + port;

            clientIPAndPoint = new IPEndPoint(IPAddress.Parse(IP), port);
        }
        public void ReceiveMsg(byte[] buffer)
        {
            //为了避免处理消息时又接收到了其他的消息，所以在处理前将其拷贝出来
            byte[] cache = new byte[512];
            buffer.CopyTo(cache, 0);

            frontTime = DateTime.Now.Ticks / TimeSpan.TicksPerSecond;//记录收到消息的时间

            ThreadPool.QueueUserWorkItem(HandleMsg, cache);

        }
        private void HandleMsg(Object obj)
        {
            try
            {
                //取出传进来的字节
                byte[] buffer = obj as byte[];


                int nowIndex = 0;
                //先处理ID
                int msgID = BitConverter.ToInt32(buffer, nowIndex);
                nowIndex += 4;
                //在处理长度
                int msgLength = BitConverter.ToInt32(buffer, nowIndex);
                nowIndex += 4;
                //在处理消息体
                switch (msgID)
                {
                    case 1001:
                        PlayerMsg playerMsg = new PlayerMsg();
                        playerMsg.Reading(buffer, nowIndex);

                        break;
                    case 1003:
                        break;
                }
            }

            catch (Exception e)
            {
                Console.WriteLine("");
            }
        }
     }  
}
```

## UDP异步通信

### Begin开头的方法

- BeginSendTo:使用回调函数，当发送消息后使用回调来实现发送后EndSendTo，来结束消息的发送

```C#
public IAsyncResult BeginSendTo(
    byte[] buffer,
    int offset,
    int size,
    SocketFlags socketFlags,
    EndPoint remoteEP,
    AsyncCallback callback,
    object state
)
```

- BeginReceiveFrom::使用回调函数，当发送消息后使用回调来实现发送后EndSendTo，来结束消息的接收

```C#
public IAsyncResult BeginReceiveFrom(
    byte[] buffer,
    int offset,
    int size,
    SocketFlags socketFlags,
    ref EndPoint remoteEP,
    AsyncCallback callback,
    object state
)
```



### Async开头的方法

- 

```C#

```



# 文件传输FTP

FTP（File Transfer Protocol，文件传输协议）是一种用于在网络上传输文件的标准协议，尤其适用于在客户端和服务器之间高效地上传或下载文件。**FTP的本质是TCP通信，通过FTP传输文件，双方至少需要建立2个TCP连接**

- **作用**：允许用户通过网络在两台主机之间传输文件（上传、下载、删除、重命名等），（一般使用在游戏当中的上传和下载的功能，原生Ab包的上传和下载，语音通话的功能，上传下载语音内容）。
- **工作模式**：
  - **主动模式（PORT）**：服务器主动连接客户端的指定端口（可能被防火墙阻挡）。
  - **被动模式（PASV）**：客户端连接服务器的随机端口（更适用于客户端位于防火墙后的场景）。

![image-20250701131923512](/notes-assets/Unity%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/assets/image-20250701131923512.png)

![image-20250701132210483](/notes-assets/Unity%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/assets/image-20250701132210483.png)

### 如何搭建FTP服务器？

- 使用别人做好的FTP服务器软件
- 自己编写FTP服务器应用程序，基于FTP的工作原理，用Socket中的TCP通信来进行编程
- 将电脑搭建为FTP文件共享服务器

##### FTP关键类

- NetWorkCredential类：提供用于基于密码的身份验证的凭据（用户名、密码、域）。
- FtpWebRequest类：封装FTP协议的请求，用于上传/下载文件、列出目录等操作。
- FtpWebResponse类：封装FTP服务器的响应，提供状态码、响应流等信息。

```C#
#region NetWorkCredential类凭证通信类
        //命名空间System.Net
        //用于在FTp文件传输时，设置账号密码
        NetworkCredential n = new NetworkCredential("User","123456");

#endregion
 
    
#region FtpWebRequest类
        //ftp文件传输协议客户端操作类
        //主要用于上传，下载，删除服务器上的文件

        //重要方法
        //1.Create创建新的WebRequest，用于进行Ftp相关操作
        FtpWebRequest ftp = (FtpWebRequest)WebRequest.Create("ftp://127.0.0.1/test.txt");//在ftp服务器上创建一个文件
       
        //2.Abort如果正在进行文件传输，用此方法可取消文件传输
        ftp.Abort();

        //3.GetRequestStream获取用于上传的流
        Stream s = ftp.GetRequestStream();
        
        //4.GetResponse 返回Ftp服务器响应
        FtpWebResponse res = (FtpWebResponse)ftp.GetResponse();


        //重要成员
        //1.Credentials设置或获取用于验证FTP请求的凭据
        ftp.Credentials = n;

        //2.Method设置或获取用于请求的方法，操作命令，上传，下载，删除，重命名，创建目录，获取文件列表
        ftp.Method = WebRequestMethods.Ftp.UploadFile;//上传
        ftp.Method = WebRequestMethods.Ftp.DownloadFile;//下载
        ftp.Method = WebRequestMethods.Ftp.DeleteFile;//删除
        ftp.Method = WebRequestMethods.Ftp.MakeDirectory;//创建目录
        ftp.Method = WebRequestMethods.Ftp.ListDirectory;//获取文件列表
        ftp.Method = WebRequestMethods.Ftp.Rename;//重命名

        //3.KeepAlive设置或获取一个值，该值指示是否与服务器保持连接，默认值为true
        ftp.KeepAlive = true;

        //4.UseBinary设置或获取一个值，该值指示是否使用二进制模式传输数据，默认值为true
        ftp.UseBinary = true;

        //5.RenameTo设置或获取要重命名的文件或目录的名称
        ftp.RenameTo = "test2.txt";

#endregion
    
#region FtpWebResponse类
    //ftp文件传输协议服务器响应类
    //主要用于获取Ftp服务器响应
    FtpWebResponse req = ftp.GetResponse() as FtpWebResponse;

    //重要方法
    //1.Close关闭FtpWebResponse,释放与该响应关联的资源
    req.Close();    
    //2.GetResponseStream获取响应流,返回从Ftp服务器返回的响应流
    Stream str = req.GetResponseStream();

    //重要成员
    //1.ContentLength获取响应内容的字节长度
    long length = req.ContentLength;
    //2.StatusCode获取响应的Http状态代码
    FtpStatusCode code = req.StatusCode;
    //3.Headers获取响应的Http头
    WebHeaderCollection headers = req.Headers;
    //4.接收数据的类型，返回接收数据的类型
    print(req.ContentType);

#endregion
```

### 如何上传文件到FTP服务器？

基本流程如下：

- 建立Ftp服务器的连接

```C#
FtpWebRequest req = FtpWebRequest.Create(new Uri("ftp://127.0.0.1/test.png")) as FtpWebRequest;  //指定ftp服务器的路径
```

- 设置通信凭证（如果不支持匿名登录，就必须设置）， 请求完毕后是否关闭连接，如果需要关闭，则设置为false

```C#
req.Credentials = new NetworkCredential(FTP_USER_NAME,FTP_PASSWORD);
req.Proxy = null
req.KeepAlive = false;
```

- 设置操作命令

```c#
req.Method = WebRequestMethods.Ftp.UploadFile;
```

- 指定传输类型，一般情况使用2进制进行传输

```C#
req.UseBinary = true;
```

- 得到用于上传的流对象（用于上传文件）

```C#
Stream upLoad = req.GetRequestStream();
```

- 开始上传

```C#
using(FileStream file = File.OpenRead("本地路径")){
    byte[] buffer = new byte[1024];
    int contentLength = file.Read(buffer,0,buffer.Length);
    while(contentLength != 0){
        UpLoad.Write(buffer,0,contentLength);
        contentLength = file.Read(buffer,0,buffer.Length);
    }
    UpLoad.Close();
    file.Close(); 
}
```

```C#
    public async void UploadFile(string path,string localPath,UnityAction callback = null){
       //通过一个线程来执行上传文件,只有当线程执行完毕后，才能执行下面的代码
       await Task.Run(()=>{
            try{
                //1.创建一个ftp连接
                FtpWebRequest req = FtpWebRequest.Create(new Uri(FTP_PATH + path)) as FtpWebRequest;

                //2.设置通信凭证（如果不支持匿名登录，就必须设置）
                NetworkCredential n = new NetworkCredential(FTP_USER_NAME,FTP_PASSWORD);
                req.Credentials = n;
                //请求完毕后是否关闭连接，如果需要关闭，则设置为false
                req.KeepAlive = false;
                //代理设置为null，避免代理有http服务
                req.Proxy = null;

                //3.设置操作命令
                req.Method = WebRequestMethods.Ftp.UploadFile;

                //4.指定传输类型
                req.UseBinary = true;

                //5.得到用于上传的流对象（用于上传文件）
                Stream UpLoad = req.GetRequestStream();
                //6.开始上传
                using(FileStream file = File.OpenRead(localPath)){
                    byte[] buffer = new byte[1024];
                    int contentLength = file.Read(buffer,0,buffer.Length);
                    while(contentLength != 0){
                        UpLoad.Write(buffer,0,contentLength);
                        contentLength = file.Read(buffer,0,buffer.Length);  
                    }
                    UpLoad.Close();
                    file.Close();
                }   
            }
            catch(Exception e){
                Debug.LogError(e.Message);
            }
       });
        Debug.Log("上传文件完成");
        callback?.Invoke();
    }
```

### 从FTP服务器下载文件到本地？ 

基本流程如下：

- 建立Ftp服务器的连接

```C#
FtpWebRequest req = FtpWebRequest.Create(new Uri("ftp://127.0.0.1/test.png")) as FtpWebRequest;  //指定ftp服务器的路径
```

- 设置通信凭证（如果不支持匿名登录，就必须设置）， 请求完毕后是否关闭连接，如果需要关闭，则设置为false

```C#
req.Credentials = new NetworkCredential(FTP_USER_NAME,FTP_PASSWORD);
req.Proxy = null
req.KeepAlive = false;
```

- 设置操作命令

```c#
req.Method = WebRequestMethods.Ftp.DownloadFile;
```

- 指定传输类型，一般情况使用2进制进行传输

```C#
req.UseBinary = true;
```

- 得到用于下载的流对象（用于下载文件）

```C#
FtpWebResponse res = req.GetResponse() as FtpWebResponse;
Stream DownLoad = res.GetResponseStream();
```

- 开始下载

```C#
using(FileStream file = File.Create("本地路径")){
    byte[] buffer =new byte[1024];
    int contentLength = DownLoad.Read(buffer,0,buffer.Length);//读取文件长度
    
    while(contentLength != 0){
         file.Write(buffer,0,contentLength);
         contentLength = DownLoad.Read(buffer,0,buffer.Length);
    }    
}
```

```C#
 public async void DownloadFile(string path,string localPath,UnityAction callback = null){

        await Task.Run(()=>{
            try{
                //1.创建一个ftp连接
                FtpWebRequest req = FtpWebRequest.Create(new Uri(FTP_PATH + path)) as FtpWebRequest;

                //2.设置通信凭证
                req.Credentials = new NetworkCredential(FTP_USER_NAME,FTP_PASSWORD);
               
                req.KeepAlive = false;
                //代理设置为null，避免代理有http服务
                req.Proxy = null;

                //3.设置操作命令
                req.Method = WebRequestMethods.Ftp.DownloadFile;

                //4.设置传输类型
                req.UseBinary = true;

                //5.得到用于下载的流对象
                FtpWebResponse res = req.GetResponse() as FtpWebResponse;
                Stream DownLoad = res.GetResponseStream();
                //6.开始下载,将文件转为2进制数据，写入到本地
                using(FileStream file = File.Create(localPath)){

                    //将文件转为2进制数据，写入到本地
                    byte[] buffer = new byte[1024];//缓存区，避免文件过大，导致内存溢出
                    int contentLength = DownLoad.Read(buffer,0,buffer.Length);

                    while(contentLength != 0){
                        file.Write(buffer,0,contentLength);
                        contentLength = DownLoad.Read(buffer,0,buffer.Length);
                    }
                    file.Close();   
                    DownLoad.Close();
                }
            }
            catch(Exception e){
                Debug.LogError(e.Message);
            }
        });
        callback?.Invoke();
    } 
```

### FTP的其他操作

- 删除文件
- 获取每一个文件的大小
- 创建文件夹
- 获取文件列表

对于Ftp的其他操作的一般流程都是类似的，都需要首先创建ftp连接，设置通信凭证，但是不同的操作有不同的命令操作，因此需要不同的命令操作，同时在命令操作后需要（FtpWebResponse res = req.GetResponse() as FtpWebResponse;）向ftp服务器发送命令请求同时获取服务器的响应。

```C#
    public async void DeleteFile(string path,UnityAction callback = null){
        await Task.Run(()=>{
            try{
                //1.创建一个ftp连接
                FtpWebRequest req = FtpWebRequest.Create(new Uri(FTP_PATH + path)) as FtpWebRequest;

                //2.设置通信凭证
                req.Credentials = new NetworkCredential(FTP_USER_NAME,FTP_PASSWORD);
                req.KeepAlive = false;
                req.Proxy = null;

                //3.设置操作命令    
                req.Method = WebRequestMethods.Ftp.DeleteFile;
                
                //4.删除文件
                FtpWebResponse  res  = req.GetResponse() as FtpWebResponse;
                res.Close();
            }
            catch(Exception e){
                Debug.LogError(e.Message);
            }
        });
        callback?.Invoke();
    }

    public async void GetFileSize(string path,UnityAction<long> callback = null){
        await Task.Run(()=>{
            try{
                //1.创建一个ftp连接
                FtpWebRequest req = FtpWebRequest.Create(new Uri(FTP_PATH + path)) as FtpWebRequest;

                //2.设置通信凭证
                req.Credentials = new NetworkCredential(FTP_USER_NAME,FTP_PASSWORD);
                req.KeepAlive = false;
                req.Proxy = null;

                //3.设置操作命令
                req.Method = WebRequestMethods.Ftp.GetFileSize;

                //4.得到文件大小
                FtpWebResponse res = req.GetResponse() as FtpWebResponse;
                int size = (int)res.ContentLength;
                res.Close();
               callback?.Invoke(size);
            }
            catch(Exception e){
                    Debug.LogError(e.Message);
                }
            });
        
    }

    public async void CreateDirectory(string path,UnityAction callback = null){
        await Task.Run(()=>{
            try{
                 //1.创建一个ftp连接
                FtpWebRequest req = FtpWebRequest.Create(new Uri(FTP_PATH + path)) as FtpWebRequest;

                //2.设置通信凭证
                req.Credentials = new NetworkCredential(FTP_USER_NAME,FTP_PASSWORD);
                req.KeepAlive = false;
                req.Proxy = null;

                //3.设置操作命令
                req.Method = WebRequestMethods.Ftp.MakeDirectory;

                //4.创建目录
                FtpWebResponse res = req.GetResponse() as FtpWebResponse;
                res.Close();
            }
            catch(Exception e){
                Debug.LogError(e.Message);
            }
        });
        callback?.Invoke();
    }

    public async void ReadFileList(string path,UnityAction<List<string>> callback = null  ){
        await Task.Run(()=>{
            try{
                //1.创建一个ftp连接
                FtpWebRequest req = FtpWebRequest.Create(new Uri(FTP_PATH + path)) as FtpWebRequest;

                //2.设置通信凭证
                req.Credentials = new NetworkCredential(FTP_USER_NAME,FTP_PASSWORD);
                req.KeepAlive = false;
                req.Proxy = null;

                //3.设置操作命令
                req.Method = WebRequestMethods.Ftp.ListDirectory;

                //4.得到文件列表
                FtpWebResponse res = req.GetResponse() as FtpWebResponse;
                //将下载的信息流 转换成StreamReader对象，方便一行一行的读取数据
                StreamReader reader = new StreamReader(res.GetResponseStream());

                //用于存储文件名列表
                List<string> nameStrS = new List<string>();

                //一行一行读取
                string line = reader.ReadLine();
                while (line != null)//如果读取到null，则表示读取完毕
                {
                    nameStrS.Add(line); //每读取一行就存入到列表中
                    line = reader.ReadLine();//读取下一行
                }
                reader.Close();
                res.Close();
                callback?.Invoke(nameStrS);
            }
            catch(Exception e){
                Debug.LogError(e.Message);
            }
        });
    }    
```

### 测试

```C#
using UnityEngine;
public class Test:MonoBehaviour
{
    public FtpMgr ftpMgr;
    void Start()
    {
        
        FtpMgr.Instance.DownloadFile("test.png",Application.persistentDataPath+"/test.png",()=>{
            Debug.Log("下载完成");
        }); 

        FtpMgr.Instance.UploadFile("test.png",Application.persistentDataPath+"/test.png",()=>{
            Debug.Log("上传完成");
        });
         FtpMgr.Instance.DeleteFile("test.png",()=>{
            Debug.Log("删除完成");
        });
        
        
        FtpMgr.Instance.GetFileSize("test.png",(size)=>{
            Debug.Log("文件大小："+size);
        });
        FtpMgr.Instance.ReadFileList("test.png",(list)=>{
            foreach (var item in list)
            {
                Debug.Log("文件名："+item);
            }   
        });
        FtpMgr.Instance.CreateDirectory("test",()=>{
            Debug.Log("创建完成");
        }); 
    }
}   
```

# 超文本传输HTTP

 HTTP（HyperText Transfer Protocol，超文本传输协议）是用于在客户端（如浏览器）和服务器之间传输数据的应用层协议。HTTP是以TCP方式工作的，连接，请求，响应，端口，接收的数据是有序的不会丢包。

**无状态性（Stateless）**

- 每个请求独立，服务器不记录之前请求的上下文。

- 解决方法：使用Cookies或Session跟踪状态（如登录信息）。

  ```
  Cookie: user_id=123
  ```

**持久连接（HTTP/1.1默认）**

- 早期HTTP/1.0每次请求需新建TCP连接，效率低。
- **HTTP/1.1+**：默认复用TCP连接（`Connection: keep-alive`），减少延迟。

**缓存控制**

- 通过响应头减少重复请求：

  ```
  Cache-Control: max-age=3600  // 缓存1小时
  ```

**安全性（HTTPS）**

- HTTP + **TLS加密**（端口443），防止数据窃听或篡改。
- 请求前通过`SSL握手`建立安全通道。

![image-20250702141503720](/notes-assets/Unity%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/assets/image-20250702141503720.png)

![image-20250702142055011](/notes-assets/Unity%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/assets/image-20250702142055011.png)

![image-20250702142613386](/notes-assets/Unity%E7%BD%91%E7%BB%9C%E7%BC%96%E7%A8%8B%E5%9F%BA%E7%A1%80/assets/image-20250702142613386.png)

### 如何搭建HTTP服务器？

- 使用别人做好的HTTP服务器软件，一般作为资源服务器时使用该方式
- 自已编写HTTP服务器应用程序，一般作为Web服务器或者短连接游戏服务器时使用该方式

#### HTTP关键类

- HttpWebRequest类：
- 

### 如何获取HTTP服务器上的内容？

### 如何上传内容到HTTP服务器？

