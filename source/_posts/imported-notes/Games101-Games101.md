---
title: Games101
date: 2026-06-27 03:53:00
categories:
  - 图形与引擎
tags:
  - Games101
  - 笔记
---
**Lecture2 线性代数简单总结**

**向量的点乘**：点乘结果反映两个向量的方向相似程度

![image-20251130232446522](/notes-assets/Games101/assets/image-20251130232446522.png)

Lecture 02 Review of Linear Algebra P2 - 26:00

可以判断向量前与后的信息

点乘>0 同方向

点乘<0 反方向

![img](/notes-assets/Games101/assets/b12128df52cdc907821096bc60ce0b50f672aeb9.jpg%40686w_!web-note.webp)

**向量的叉乘**

Lecture 02 Review of Linear Algebra P2 - 30:31

输入两个向量，输出一个同时垂直与这两个向量的新向量

![image-20251130232502029](/notes-assets/Games101/assets/image-20251130232502029.png)

如何判断新向量的方向？

右手螺旋定则

如**a×b=c** 

四指从a的方向向b的方向握紧，大拇指指向的就是c的方向

![img](/notes-assets/Games101/assets/acdd405e8591503c0d093d0746605b0f8118be32.jpg%40686w_!web-note.webp)

如何判断两个向量的左右关系？



Lecture 02 Review of Linear Algebra P2 - 38:10



a×b得到结果是和z轴同向，是正的，说明b在a的左侧

如何判断一个点是否落在三角形内部？（做光栅化，给三角形内部的像素着色需要用到）



Lecture 02 Review of Linear Algebra P2 - 39:29



AB×AP > 0  说明P在AB左侧

BC×BP > 0  说明P在BC左侧

CA×CP > 0  说明P在CA左侧

说明点P落在三角形ABC内部

**矩阵**



Lecture 02 Review of Linear Algebra P2 - 45:25



矩阵的乘积



Lecture 02 Review of Linear Algebra P2 - 47:39



首先两个矩阵必须要可以相乘

（M x N）（N x P） = （M x P）

第一个矩阵的列==第二个矩阵的行。才能相乘

如：

第一个矩阵M行N列

第二个矩阵N行P列

得到M行P列的新矩阵

新矩阵a行b列的元素怎么得出来呢？

第一个矩阵a行和第二个矩阵b列做点积运算

如：

二行三列

5*9 +2*8 = 61

![img](/notes-assets/Games101/assets/05b908af365cfbf81945f9b9f626587801e8f101.jpg%40686w_!web-note.webp)

**矩阵的性质**

![img](/notes-assets/Games101/assets/6adf0cf8a7f6cb31aa56b8ee76a95a3bee2a5086.jpg%40686w_!web-note.webp)

**矩阵乘向量**

![img](/notes-assets/Games101/assets/19947ad1d796f433ad61003e7358f17c92558cad.jpg%40686w_!web-note.webp)

**矩阵的转置**

![img](/notes-assets/Games101/assets/e89515f4c5b7eecd46c1ab2bc7efe1d6fc518fc1.jpg%40686w_!web-note.webp)

**单位矩阵、矩阵的逆**

![img](/notes-assets/Games101/assets/ae7b91e261ed5f7ed7a065e45a9439b2573edaa8.jpg%40686w_!web-note.webp)

**向量的点乘、叉乘（矩阵形式）**

向量的点乘（矩阵形式）（见下图）

向量的叉乘（矩阵形式）



Lecture 02 Review of Linear Algebra P2 - 54:30



将a向量重新组织，变为A*这个矩阵，A*这个矩阵叫a向量的**反对称矩阵（Skew-Symmetric Matrix）**

（为什么PPT中写的是DualMatrix（对偶矩阵？）呢？此处的“对偶”并非线性代数中“对偶空间”的标准定义，而是强调**向量与叉乘矩阵的等价性**。叉乘矩阵可视为向量的一种“对偶表示”，使得几何操作（如旋转）可通过矩阵运算实现。计算机图形学中，这种术语是约定俗成的，目的是直观表达向量与矩阵形式的对应关系）（感谢评论区大佬批评指正）





A*乘以b就是axb的结果

（Lecture4的罗德里格斯旋转公式会用到这个性质）

![img](/notes-assets/Games101/assets/85ed6793e5c7724af366392d8820ab935af5131c.jpg%40686w_!web-note.webp)





\------------------------------------------------------------





 **Lecture3 变换简单总结**

**缩放变换**

Sx  0    

0   Sy      就叫缩放矩阵，与xy点乘得到缩放后的矩阵

![img](/notes-assets/Games101/assets/6c8e53ebd45a2bd36600ded4b841e3b90a8be6d3.jpg%40686w_!web-note.webp)

**镜像变换**

![img](/notes-assets/Games101/assets/511aa12b1fa2b6ab90eef477f0831dab03cdbe05.jpg%40686w_!web-note.webp)

**错切变换**



Lecture 03 Transformation P3 - 13:17



对于图片来说每个点的y坐标都没变

对于左上角的点来说变化应该是0+a

对于右上角的点来说变化应该是1+a

对于左边中间的点来说变化应该是0+a/2

所以每个点的变化应该是x+ay

故矩阵如图

![img](/notes-assets/Games101/assets/8f3d5738bc044dfe77141af456fe92adc9b8f425.jpg%40686w_!web-note.webp)

**旋转**

默认绕（0，0）转，默认逆时针旋转



Lecture 03 Transformation P3 - 17:13



![img](/notes-assets/Games101/assets/afea031edd642c9b0c60da0883f1b824fa497c16.jpg%40686w_!web-note.webp)

公式推导



Lecture 03 Transformation P3 - 18:38



![img](/notes-assets/Games101/assets/71281713af59aa9246df43951fb1fdb1908bfaaf.jpg%40686w_!web-note.webp)

如果用一个矩阵乘以输入可以得到输出的坐标，那么称这个变换叫线性变换

![img](/notes-assets/Games101/assets/f6b0fa691f83f14dcd8495fc0c10bdc0a3443b6f.jpg%40686w_!web-note.webp)

**平移**

平移可以写成

x = x + tx

y = y + ty

矩阵如图，无法写成线性变换的样子，为了解决平移这个特例，人们引入齐次坐标

**齐次坐标**

（齐次坐标这里老师讲的非常透彻，深入浅出，忘记了知识点的话建议直接看视频）



Lecture 03 Transformation P3 - 32:24



![img](/notes-assets/Games101/assets/56b34c48b435c4b70de22c2978bed2cc81e7b30b.jpg%40686w_!web-note.webp)



![img](/notes-assets/Games101/assets/26b990e31baf2e355b27ef44d7b4a5a141012c16.jpg%40686w_!web-note.webp)



**2D变换的齐次坐标形式**

![img](/notes-assets/Games101/assets/678f1afb700901fce4f6334d63ab255af0991d52.jpg%40686w_!web-note.webp)



先旋转在平移写作  （T·R·向量）  从右往左写





\------------------------------------------------------------





**Lecture4 变换进阶篇**

正交矩阵：矩阵的转置等于他的逆d

![img](/notes-assets/Games101/assets/36f0b09550805e4a637fc7d1421404f1bd4cfcff.jpg%40686w_!web-note.webp)



**3D变换**

3D变换相对于2D变换来说只是多增加了一个维度，可由2D变换举一反三得来

![img](/notes-assets/Games101/assets/2e79735d1960a5befa316fd2aade4444ca4e0c8b.jpg%40686w_!web-note.webp)

**3D旋转**

3D旋转在绕Y轴旋转时理解有些特殊



Lecture 04 Transformation Cont. P4 - 10:49



![img](/notes-assets/Games101/assets/11df3d6c3c6d41b981a8a8b96e887156fbb61b8e.jpg%40686w_!web-note.webp)

以xyz三个轴来说

X x Y = Z             Y x Z = X             X x Z = -Y

所以绕Y轴旋转的矩阵表现出来是转置的状态

**罗德里格斯旋转公式**



Lecture 04 Transformation Cont. P4 - 15:29



我们说在三维空间内绕某一轴旋转，默认这个轴是过原点的

罗德里格斯旋转公式就是总结了绕任意过原点的轴旋转的公式

![img](/notes-assets/Games101/assets/6e27b380288e57a99e0ae2e60c9718192c6b08b4.jpg%40686w_!web-note.webp)

拆分一下罗德里格斯旋转公式（下图来自百度百科）

![img](/notes-assets/Games101/assets/f150811bce2a4bb3720415a9914601ac1c208e07.png%40686w_!web-note.webp)

对于绕不过原点的轴旋转，我们可以将其拆分为

1. 将旋转轴平移到原点
2. 绕轴旋转
3. 将旋转后的模型平移回去



**视图/相机变换**

**图形学的最终目的是为了将三维中的物体渲染成二维里的图像**

在现实生活中如何照一张照片？

1. 找个好地方摆pose（Model变换）
2. 把相机放个好角度（View变换）
3. 按快门（Projection变换）



View变换--如何摆放相机的角度

1. 决定相机的位置
2. 决定相机看向的方向
3. 决定相机头朝上的方向

![img](/notes-assets/Games101/assets/1494f4276d252ab49ccd32bf70ce7e9b12e61e40.jpg%40686w_!web-note.webp)

规定相机永远在（0，0，0），沿着-Z看

变化的永远是其他物体

![img](/notes-assets/Games101/assets/106c442b64c98577d40ba20b76bceb6950e94a40.jpg%40686w_!web-note.webp)

 所以要先把摄像机归到原点

1. 平移摄像机至（0，0，0）
2. 将相机lookat的方向旋转到-z
3. 旋转相机头朝上的方向到Y

![img](/notes-assets/Games101/assets/4ab434d9bf0bbabca062ddd198288b9994a5af20.jpg%40686w_!web-note.webp)



第一步的平移可以简单的写成下图Tview

![img](/notes-assets/Games101/assets/c5183a54f1cb8b2acf81ec718177718aa3f7723f.jpg%40686w_!web-note.webp)

但是要将任意向量旋转到轴上比较难写（也就是第2步和第三步）

但是将轴（如X轴（1，0，0））旋转到任意向量比较好写

所以我们先求将X轴旋转到任意向量的矩阵，之后将该矩阵求逆，即可得到任意向量旋转到轴的矩阵Rview

Rview x Tview = Mview

Mview即为视图变换，将Mview应用到相机，相机归零，同时也需要将Mview应用到其他所有物体，让物体和相机的相对位置保持不变

**投影**

**正交投影**

先将相机归零lookat -Z轴

对于二维投影来说，直接把Z轴坐标舍弃，就能得到物体在xy平面上的投影

要把得到的图像平移并且缩放到[-1,1]²中，方便之后的计算



Lecture 04 Transformation Cont. P4 - 45:15



对于正交投影来说，视口是个[l,r][b,t][f,n]的长方体,想让他变成[-1,1]³中的话只需要

- 先将立方体的中心平移到原点
- 在将立方体缩放到[-1,1]³中

首先要找到立方体的中心点，也就是

![img](/notes-assets/Games101/assets/ebee555790d537b78d11817237007dacd9863396.png%40100w_!web-note.webp)

将边长r-l、t-b、n-f缩放到长度2

所以正交投影矩阵如下

![img](/notes-assets/Games101/assets/5488a816500b6c635a624c3d77d588cc37a04512.png%40686w_!web-note.webp)

（此时物体肯定会被拉伸，在之后的视口操作中会恢复拉伸）

![img](/notes-assets/Games101/assets/94d3c6de293ddded53c44653b8fd65cc9fe4af97.jpg%40686w_!web-note.webp)





**透视投影**

传统的欧式几何是在同一平面内生效的法则

对于不同平面就会造成照片中近大远小的情况

![img](/notes-assets/Games101/assets/9f12bb51a640a8fffbbd486572b2824d6bb18297.jpg%40686w_!web-note.webp)



如何做透视投影呢？（本分P难点！）

![img](/notes-assets/Games101/assets/2eab0458f455296ea977cb37e92ab5f026d999df.jpg%40686w_!web-note.webp)



老师的方法是，先将Frustum远平面及远平面到近平面之间的所有平面挤压到近平面大小，

变成Cuboid的样子，然后做一次正交投影

那么如何做挤压呢？

- 对于除近平面外的任意一个点，通过挤压后该点的高度y要变成和近平面一样的y’
- 从侧面看Frustum的话，如下图，可以形成两个相似三角形，即可得出y‘=(n/z)y
- 同理x'=(n/z)x

![img](/notes-assets/Games101/assets/28ad96cf69d3d5d580d2eb70d2f526e6bc5e43ff.jpg%40686w_!web-note.webp)

- 通过上面推导出来的两个公式可得，对于任意一点（x,y,z,1）T 可得

这里为了方便书写，用T来表示转置矩阵，下文同

![img](/notes-assets/Games101/assets/1010f66afad4b34ec586de71b86f100fdcf665f4.png%40590w_!web-note.webp)

将这个点同时乘z得

![img](/notes-assets/Games101/assets/d84db17070f36f342e668f486b8611dfa1b8e983.png%40462w_!web-note.webp)

（齐次坐标同时乘k（k！=0），还得到相同的点）

齐次坐标的性质的复习↓（详解可见虎书150页）



Lecture 04 Transformation Cont. P4 - 55:23



![img](/notes-assets/Games101/assets/2013bb16801ac9ba3babf10577ef070f3b1925b1.jpg%40686w_!web-note.webp)

- 所以我们推导出了变化后的点的一部分

就是

![img](/notes-assets/Games101/assets/7f1fa9ad0d116e4717a71619c189afe6c21e3a54.png%40414w_!web-note.webp)

- 那么一个矩阵乘以任意一点（x,y,z,1）T得到上图，我们就可以推导出这个矩阵的一部分了

矩阵的一部分如下图

![img](/notes-assets/Games101/assets/c394760388975507e3eeaec1cb0ac7db0e676655.jpg%40686w_!web-note.webp)

想补全这个矩阵，需要用到两条已知的性质

1. 近平面的点不会发生变化
2. 远平面的点z的值不会发生变化

![img](/notes-assets/Games101/assets/43a21791c7e1d59143c30c8bbb43478088f89666.jpg%40686w_!web-note.webp)

- 对于近平面上的点来说，他的z值就是n

见下图

![img](/notes-assets/Games101/assets/11f6f436bf12e2549b29e2f6ae798e52b5db530c.png%40686w_!web-note.webp)

由性质1可得

对于近平面上的点（x,y,n,1）T经过矩阵变换后该点还为（x,y,n,1）T，同时乘n后得(nx,ny,n²,n）T

所以当z等于n时，也就是说近平面的点通过矩阵运算后变为(nx,ny,n²,n）T

![img](/notes-assets/Games101/assets/7d2dc831af42d290840b9d05203b572dfb22a67d.png%40686w_!web-note.webp)

所以矩阵第三行乘以（x,y,n,1）T= n²

可得第三行前两个数一定为0，即（0，0，A，B）

![img](/notes-assets/Games101/assets/dd5143e9a9ca4625035fe2c4c18f007d0a8d6c36.png%40686w_!web-note.webp)

可得

1. An+B=n²

由性质2可得

选一远平面上的点x=0，y=0，即中间点（0，0，f,1）T，经矩阵变化后还是中间点（0,0,f,1）T，同时乘f后得（0，0，f²，f）T

即（0，0，A，B）(0，0，f,1）T=（0，0，f²，f）T

可得

 2.Af+B=f²

联立1、2得

A=n+f

B=-nf

至此可解出Mpersp -> ortho

![img](/notes-assets/Games101/assets/5ed67eface3729489c347c28f01b1431614abbfc.png%40686w_!web-note.webp)

所以对于空间中任意一点进行透视变换可以通过如下公式解出

![img](/notes-assets/Games101/assets/b920bc0b2e2dd887d852cc77611172bf884da2b4.png%40686w_!web-note.webp)



关于任意一点挤压后向哪里移动的问题，简单推导了一下



![img](/notes-assets/Games101/assets/2becce16a100e4242a2d69488bbcc3822a38e617.jpg%40686w_!web-note.webp)





\---------------------------------------------------------------------------------



**Lecture5 光栅化**

在进行了上节课的操作之后，所有物体都处在了[-1，1]³的立方体中，接下来就要把他画在屏幕上，这一步就叫做光栅化

在做透视投影时候需要将一个四棱梯挤压成正方体，就需要先定义一个视锥（四棱锥）

那么如何定义视锥呢？



Lecture 05 Rasterization 1 (Triangles) P5 - 07:54



![img](/notes-assets/Games101/assets/16412ed8898b07dfbd62029ba64f9045c4ecc1a8.jpg%40686w_!web-note.webp)

从摄像机看向一个地方，我们把它当作近平面，宽和高是可以定义的，所以宽高比就是可以定义的

- 宽高比 Aspect ratio
- 可视角度 FOV （垂直角度和水平角度可以互相转换）

通过以上两点即可定义一个视锥

![img](/notes-assets/Games101/assets/f2b383811c763ca07e00bdb8991ec8ab228ad7ac.jpg%40686w_!web-note.webp)



要把图像投影到屏幕上就需要先定义屏幕，在图形学中，屏幕就认为是一个装了像素的二维数组。如数组大小1920*1080

像素是最小单位，每个像素由RBG构成

**屏幕空间**

屏幕坐标系如下图

![img](/notes-assets/Games101/assets/912ef67ef6394f3974f70f1496b613dd551a1a96.jpg%40686w_!web-note.webp)



像素的坐标以左下角为准，如图中蓝色像素坐标为（2，1）

像素的中心为（x+0.5,y+0.5）



继续上节课的话题

如何将[-1,1]³中的东西显示到屏幕上呢？

![img](/notes-assets/Games101/assets/730daab1b2685d17a9c75877fe776c9400e3d4cf.jpg%40686w_!web-note.webp)



- 暂时忽略z
- 如果只将[-1,1]²中的东西显示到[0,width] x [0,height]，那么就很简单了

做个缩放并平移就可以，这个变换就被称为视口变换

![img](/notes-assets/Games101/assets/2bdecc97a1489137523a0eeec64569935b8b2585.jpg%40686w_!web-note.webp)



**隔行扫描**

老师提到的一个有意思的知识点



Lecture 05 Rasterization 1 (Triangles) P5 - 30:12隔行扫描



![img](/notes-assets/Games101/assets/14750a297051e9f0d61324132f76679f5e345659.jpg%40686w_!web-note.webp)



以前的显示设备要成像，都是在屏幕上画很多线，画满整个屏幕就形成了一帧画面

隔行扫描就是说

在第一帧只画1、3、5等奇数线

在第二帧只画2、4、6等偶数线

利用人眼的视觉残留特性，这样人们即发现不了画面的异常，还能使机器工作量减半

如今还有某些视频压缩技术采用了这个思想

（但是隔行扫描会造成严重的画面撕裂，特别是对高速运动的画面来说）

**现代的一些显示设备介绍**



Lecture 05 Rasterization 1 (Triangles) P5 - 32:36



**三角形**



Lecture 05 Rasterization 1 (Triangles) P5 - 39:25





![img](/notes-assets/Games101/assets/f51be075ad1414eec3f54dea021a089d96846c49.jpg%40686w_!web-note.webp)



为什么光栅化选择了三角形？

- 三角形是最基本的多边形，没有比三角形边更少的多边形
- 其他多边形都可以拆分为三角形
- 三角形必定在一个平面内
- 容易定义三角形的里外
- 三角形的三个点定义好后，三角形内任意一点可以通过线性的插值来计算得到（重心坐标的插值方法）

如：定义好三个点的颜色，三角形内任意一点的颜色可以通过三个点的颜色来进行插值计算得到

如何将三角形转化为一个一个的像素？

![img](/notes-assets/Games101/assets/3e8b94eec7e4e82036e29b9a43c2823fe27b1a70.jpg%40686w_!web-note.webp)

**简单近似采样**

给定一个连续的函数f（x），当x等于1时得到的f（1）就是1的采样

所以采样就是把一个函数离散化的过程

只要有一个定义在屏幕空间的函数，那么我们就能算出来不同像素中心的值是多少



我们要采样的东西就是

给定一个三角形，在像素的中心进行采样，来判断中心是否落在三角形内

![img](/notes-assets/Games101/assets/b8d0db56f254d117c1e04c6578892be8a0b7efca.jpg%40686w_!web-note.webp)



逐像素遍历，判断该像素中心是否在三角形内部，输出到屏幕显示

（至于如何判断点在三角形内部，前面的课程也讲过请看Lecture2）



Lecture 02 Review of Linear Algebra P2 - 39:29



![img](/notes-assets/Games101/assets/c77b2222ded95d28b66bc9629a115d3646c67592.jpg%40686w_!web-note.webp)

但是遍历所有像素开销太大，如下图中白色那一列的像素根本没有碰到三角形，所以只要遍历蓝色区域就可以了

我们知道三角形三个顶点的坐标，有了Xmin，Ymin，Xmax，Ymax就可以得到蓝色的区域

蓝色区域就叫做包围盒（轴向包围盒/BoundingBox/AABB）

![img](/notes-assets/Games101/assets/76b4a91b0c791be0b2f069583be72ea8efeb6852.jpg%40686w_!web-note.webp)

采样完成后，因为每个像素都是最小单位，像素内的颜色必须一样，所以我们会得到这样一副图

![img](/notes-assets/Games101/assets/6fa2431233384257dfe426224723f51370bf29cc.jpg%40686w_!web-note.webp)

这看起来和初始的三角形差别很大，有一个个的明显锯齿（Jaggies/Aliasing）

下节课就会学习图形学中的重大技术，反走样aka抗锯齿！

\---------------------------------------------------------------------------------------------------------------------------------

**Lecture6 反走样&深度缓冲**



**采样理论**



Lecture 06 Rasterization 2 (Antialiasing and Z-Buffering) P6 - 05:50



把到达光学元件上的光，产生的信息，离散成了像素，对这些像素采样，形成了照片

采样不只发生在位置上还能发生在时间上，对图像在时间上进行采样，形成了视频

**采样产生的问题**

- 走样
- 摩尔纹
- 车轮效应

原因就是信号的变化太快了，以至于采样的速度跟不上

**反走样处理方法：采样前模糊**



Lecture 06 Rasterization 2 (Antialiasing and Z-Buffering) P6 - 13:12



![img](/notes-assets/Games101/assets/aae1c2ba788aa21aa2597dc1369e4905aa21fabf.jpg%40686w_!web-note.webp)

不能先采样再模糊！只能先模糊在采样

**频域、时域**



Lecture 06 Rasterization 2 (Antialiasing and Z-Buffering) P6 - 17:27



频域和时域是对信号或系统的两种不同的表示方式。

频域表示是通过分析信号的频率分布来表示信号的方式。在频域中，信号被分解为一系列不同频率的分量，每个分量对应着信号中的一种特定的周期性成分。

时域表示是通过直接分析信号在时间上的变化情况来表示信号的方式。在时域中，信号的变化被直接表示为在时间上的变化，而不是在频率上的变化。

![img](/notes-assets/Games101/assets/a8766c244ee65e54e47c194ed36a9d5ca46d1f4b.jpg%40686w_!web-note.webp)

**傅里叶级数展开**



Lecture 06 Rasterization 2 (Antialiasing and Z-Buffering) P6 - 20:12



任何一个周期性的函数都可以变成一系列正弦/余弦的线性组合和一个常数项

![img](/notes-assets/Games101/assets/33f70e549d482e5c362afa7afb57e6aa6b9d4ccb.jpg%40686w_!web-note.webp)

**傅里叶变换**

可以把一个函数f（x）通过变化变成F（w），F（w）还能通过逆变换变成f（x）

![img](/notes-assets/Games101/assets/f7d8ff5c12ff2ba7830de05a6e02b06c049e9fcb.jpg%40686w_!web-note.webp)

对五个不同频率的函数波形进行采样

通过f1(x)、f2(x)的采样点，我们可以大致还原出f1(x)\f2(x)的函数波形

但是从f3(x)开始，还原出的波形和原来的函数有较大出入，越往下越明显

这里就可以理解什么叫采样的频率跟不上信号变化的频率了

![img](/notes-assets/Games101/assets/96cc1eeeafb3cd4a8c40d116f709a1deec95fc57.jpg%40686w_!web-note.webp)

我们对蓝色函数进行采样，得到黑色的函数

但假如原本就有这样一个黑色的函数

我们同时对蓝色和黑色进行采样，两个截然不同的函数，得到的采样结果完全相同

这就被称为走样（Aliases）

![img](/notes-assets/Games101/assets/1c0fe8330e5a80a7d83f3925b50ab7248f4e8d76.jpg%40686w_!web-note.webp)

**滤波**



Lecture 06 Rasterization 2 (Antialiasing and Z-Buffering) P6 - 29:23



滤波就是抹掉一些特定的频率

对应的信号如何发生变化

傅里叶变换可以把一个函数从时域变到频域



右边的图像就是左边的照片通过傅里叶变换得到的

右边图像表示的就是有多少信息

中间部分是低频信息，越往外越高频

![img](/notes-assets/Games101/assets/d6b4012d7fe32ea70cc64a3f1add265a06f5f589.jpg%40686w_!web-note.webp)



**高通滤波**



Lecture 06 Rasterization 2 (Antialiasing and Z-Buffering) P6 - 33:28



在频域空间内完全抹掉低频信号，将结果还原成图像，形成左图

高频的东西在图像上表示的就是图像的边界

为什么高频信息代表着边界？

当某一图像的周围突然发生发生了变化，我们就认为他是边界

比如图中人物的衣服和背景就是由黑色突然变成了灰色

相当于颜色信号突然从黑色变成了灰色，就是出现了高频的变化，即边界

![img](/notes-assets/Games101/assets/5fe3265e41ab305057bff56c63965b18842b6bb8.jpg%40686w_!web-note.webp)

**低通滤波**

同理高通滤波，得到模糊的图像

![img](/notes-assets/Games101/assets/5c8b2c5646b745abba7a34c9f5312d5a3e8dbfd1.jpg%40686w_!web-note.webp)

去除高频和低频，只留一部分

![img](/notes-assets/Games101/assets/1add9f11a4ce4f41ac3ed72ef99539a61502379a.jpg%40686w_!web-note.webp)



![img](/notes-assets/Games101/assets/513bc57a497e5e5ac5fd391bf7a12adf97c67a0a.jpg%40686w_!web-note.webp)



**卷积**



Lecture 06 Rasterization 2 (Antialiasing and Z-Buffering) P6 - 40:38



移动窗口（Filter），将窗口中三个数和覆盖信号的三个数做点乘，填到结果中

![img](/notes-assets/Games101/assets/094c9916e15ed629ee7e2aa45591ae1db0ca792d.jpg%40686w_!web-note.webp)



![img](/notes-assets/Games101/assets/67d015f81155f8bb74028547d7c37c78e30483df.jpg%40686w_!web-note.webp)

其实就是信号在任意一个地方，在他的周围做了个平均操作

**卷积的一些定理**



Lecture 06 Rasterization 2 (Antialiasing and Z-Buffering) P6 - 43:16



时域的卷积 == 频域的乘积

- 可以拿到一幅图直接用一个卷积滤波器进行卷积操作
- 也可以

​			1.先傅里叶变换这幅图，将这幅图变到频域

​			2.将卷积滤波器变到频域上

​			3.将两者相乘，乘完后得到的频域的结果，将其逆傅里叶变换，变到时域上

![img](/notes-assets/Games101/assets/bcdf58bfc414bcd1b084a1d3610b8b6471c89ac7.jpg%40686w_!web-note.webp)

将3*3的滤波器乘1/9是为了不让图像整体的颜色发生变化

如果不乘1/9，那么每个像素就会是原来这个像素周围九个像素的和，图像就会越滤波越明亮了

![img](/notes-assets/Games101/assets/350778c5f087365cafdc3db2f14c1fcc5221e219.jpg%40686w_!web-note.webp)



时域中的图像的变化会对频域产生什么样的影响？



Lecture 06 Rasterization 2 (Antialiasing and Z-Buffering) P6 - 49:07





什么是采样，什么是走样



Lecture 06 Rasterization 2 (Antialiasing and Z-Buffering) P6 - 51:30





![img](/notes-assets/Games101/assets/3a17bd1d9f1bdb4a60b25633cbd1b6db23a93af9.jpg%40686w_!web-note.webp)



左边一列是时域，右边一列是频域

对a图像进行c的采样，得到e

对应的操作在频域中就是bdf

时域的采样在频域中就就体现为频域信号的复制

（这里老师说左边时域进行乘积=右边频域的卷积，和前文说的不一致，我去查了一下，好像两种说法是相互的，都可以，这里不太懂，但是不影响整体的理解）

为什么会产生走样呢？



Lecture 06 Rasterization 2 (Antialiasing and Z-Buffering) P6 - 55:08



采样不同的间隔，会引起频谱不同间隔进行复制，所相交的部分就是走样

![img](/notes-assets/Games101/assets/f87f5a16c1d38989734aeed257834e723af4216a.jpg%40686w_!web-note.webp)

**反走样**



Lecture 06 Rasterization 2 (Antialiasing and Z-Buffering) P6 - 59:14



先对图像做模糊（把高频信息拿掉），再采样

![img](/notes-assets/Games101/assets/4c2819167e6ea80ec3b2acd149bd6847c7223757.jpg%40686w_!web-note.webp)

把高频信息砍掉，砍掉虚线方块以外，在以原始采样频率进行采样

这样频域图像就不会发生混叠，也就没有走样了

![img](/notes-assets/Games101/assets/b120f9eb57137a43c753984448cb04791cd80831.jpg%40686w_!web-note.webp)



对覆盖面积求平均，也就是卷积

![img](/notes-assets/Games101/assets/060a4713ac894aea22a50e5b28cf47467f50ac15.jpg%40686w_!web-note.webp)



**MSAA（****Multisample Anti-Aliasing****）多重采样抗锯齿**

通过更多的样本来近似三角形的覆盖率，并不是提高采样频率



Lecture 06 Rasterization 2 (Antialiasing and Z-Buffering) P6 - 01:05:04



把一个像素划分为几个小点，判断这些小点是否在三角形内，再把结果平均起来，就知道三角形覆盖了这个像素的百分之多少

![img](/notes-assets/Games101/assets/94f32711c1b4809a894c4702f520c8845d9d0c3b.jpg%40686w_!web-note.webp)



![img](/notes-assets/Games101/assets/31554db3ccec7f10cb1022c18f6c12578e5c3ff9.jpg%40686w_!web-note.webp)



![img](/notes-assets/Games101/assets/33557050e9a877b310b368416c99694854cc3f26.jpg%40686w_!web-note.webp)

并不是简单的提高了采样的频率，只是用来做第一步模糊，求三角形的覆盖率，平均之后是什么

MSAA解决的其实是对信号的模糊操作

在工业界并不是直接将每个像素平均分了四份，而是采用了一些独特的图形，而且一些边缘的像素还会被复用

![img](/notes-assets/Games101/assets/74aef5bd5f8a44c7e5179d16a6e06be222f8a79f.jpg%40686w_!web-note.webp)

关于FXAA可以去看一下Games104第7讲，里面有一小节专门讲抗锯齿，讲的比较详细https://www.bilibili.com/video/BV1kY411P7QM/?share_source=copy_web&vd_source=b5b61a696da53c748b74998cb3c20d84&t=2199

﻿

\-------------------------------------------------------------------------------------------------------



**Lecture7  Z-buffering（深度缓冲） Shading（着色）**



**画家算法**

先画最远的物体，逐渐画近的物体，让近的物体覆盖远的物体

看起来是没问题的

![img](/notes-assets/Games101/assets/3ab7852f88d5261e6d1e2d8bcba2294da473da3f.jpg%40686w_!web-note.webp)

但不是总生效的

![img](/notes-assets/Games101/assets/fcdc10d3c8223e3b9111d7455a39c028e5bb0d4d.jpg%40686w_!web-note.webp)

这张图三个三角形互相遮挡，没办法定义深度关系，就不能采用画家算法



**Z-Buffer**



Lecture 07 Shading 1 (Illumination, Shading and  Graphics Pipeline) P7 - 10:32



![img](/notes-assets/Games101/assets/b74774d2c955ad2213dbea36f6d20e2b35c86a82.jpg%40686w_!web-note.webp)

既然没办法判断三角形整体的深度，那么就判断每个像素的深度

像素内记录像素深度最浅的几何

对于深度来说，越小越近，越大越远

在渲染时不光要存渲染的图，也要存一张深度的图

![img](/notes-assets/Games101/assets/36a73409ea57de95fef53936e442c79bd5b8f7ec.jpg%40686w_!web-note.webp)

算法如何进行？



Lecture 07 Shading 1 (Illumination, Shading and  Graphics Pipeline) P7 - 15:10



对单个像素来说，逐步记录深度

如先画地板，先记录地板深度

物品来了后比对物品的深度和记录的深度

发现物品深度小于记录的地板深度，说明物品要遮挡住地板

![img](/notes-assets/Games101/assets/c5e67e09b10c13c91d6f9a971b050b9fd3edc838.jpg%40686w_!web-note.webp)

下图一目了然

![img](/notes-assets/Games101/assets/5552d106d5ebb36a3a48bfa68c7b50e02e51e766.jpg%40686w_!web-note.webp)

暂时假设不存在深度相同的像素

在浮点数的表示中，两个浮点数完全相同的概率很小

（实际上会有相同深度的，但本课中暂不考虑）

（透明物体Z-Buffer也处理不了，暂不考虑）



**Shading（着色）**



Lecture 07 Shading 1 (Illumination, Shading and  Graphics Pipeline) P7 - 30:48



物体产生的颜色和光照、材质有关



**Blinn-Phong Reflectance Model（布林·冯反射模型）**



Lecture 07 Shading 1 (Illumination, Shading and  Graphics Pipeline) P7 - 38:06





![img](/notes-assets/Games101/assets/f5a11a908ae54734d773f19371d55ccc23702c56.jpg%40686w_!web-note.webp)

局部着色

对着色的描述是一个点

v、l、n都是单位向量

shininess表面有多亮（对比石膏和陶瓷）

不考虑阴影

![img](/notes-assets/Games101/assets/165eef7935737ffa5b4944714b5736379b09d09f.jpg%40686w_!web-note.webp)

**漫反射**



Lecture 07 Shading 1 (Illumination, Shading and  Graphics Pipeline) P7 - 47:53



同样的光，以不同角度照上去，明暗不一样

![img](/notes-assets/Games101/assets/ea3f97c6d32366cf89c4a7cebc23e4fd149f6ad3.jpg%40686w_!web-note.webp)

1.物体表面法向量n，和光源方向l，的夹角θ，决定了明暗强度

可以把光当成能量，吸收的越多越亮

**能量守恒**



Lecture 07 Shading 1 (Illumination, Shading and  Graphics Pipeline) P7 - 53:18



光的能量都集中在一个球壳上，一开始球壳的表面积很小，考虑到能量守恒的话，那么单位面积上光的能量就很多，光越向外扩散，单位面积的能量就越小

![img](/notes-assets/Games101/assets/9aaa1a3bceca41dc4fa28d1784f434dd20c5d2f0.jpg%40686w_!web-note.webp)

2.通过球面公式可以计算出，距离光源为r的球壳上，单位面积上能量为I/r²

![img](/notes-assets/Games101/assets/1412d4a66ed1a1abd8412102346318f96a393fee.jpg%40686w_!web-note.webp)

根据2.就知道有多少光从光源传播到shadingPoint处

再根据1.就知道有多少光被shadingPoint吸收

这样就能知道diffuse的公式

![img](/notes-assets/Games101/assets/ab00b0973919b0799fa57b44c50fd43b2431a0af.jpg%40690w_!web-note.webp)

- I/r² 表示有多少光到达了ShadingPoint（因为光会随着传播距离而衰减）
- Kd表示了该点颜色的反射率

​	 如果Kd=0，那么该点完全没有反射光出去，该点吸收了所有光，那么该点表现为黑色

​	 如果Kd=1，那么该点反射了所有光，那么该点表现为白色

​	 如果用RGB三个通道表示Kd，那么Kd就是Color

- Max（0，**n·l**）表示反射角度，nl都是单位向量，**n·l** = cosθ，当入射光从表面下面照入，θ>90°，cos<0，这种情况没有意义，因为我们只考虑反射光，不考虑折射等光线，所以需要和0比，取最大值

![img](/notes-assets/Games101/assets/fa17a2d413dc9b13dd22ccc947020d7a7622c204.jpg%40690w_!web-note.webp)

\----------------------------------------------------------------------------------------------------

**Lecture8 Shading、Blinn-Phong reflectance model  -- 着色**

**高光**



Lecture 08 Shading 2 (Shading, Pipeline and Texture Mapping) P8 - 06:02



高光的方向  -> 越光滑 越趋于镜面反射的方向

观察的方向越接近镜面反射的方向 越能看到高光

![img](/notes-assets/Games101/assets/a395f66e1d5698d32c47ae76d0b02662080a54c9.png%40686w_!web-note.webp)

图片来自“入门Shading，详解Blinn-Phong和Phong光照模型 - 小菠萝的IT之旅的文章 - 知乎

https://zhuanlan.zhihu.com/p/352209183”



![img](/notes-assets/Games101/assets/d271ad47819eb46c5f394cf4d0f6c5a221d1f1ba.jpg%40686w_!web-note.webp)



当观察方向接近镜面反射方向的时候  <=>  法线方向n 接近于 半程向量h

知道两个单位向量l和v，求他俩的角平分线向量很简单，将两个向量相加，并求归一化

![img](/notes-assets/Games101/assets/be6a29ce747636ba3cd332785fde302975789e5d.png%40222w_!web-note.webp)

![img](/notes-assets/Games101/assets/47d2144da3e736f57bd1b2b63369313c6dc39229.png%40254w_!web-note.webp)

所以为了知道能否看到高光，布林冯模型只需要知道n和h是否接近

如果用视线方向v和高光方向R来判断能否看到高光，就是冯模型

（点乘接近1即向量接近）（冯模型计算量大）

![img](/notes-assets/Games101/assets/ae15cbbfb871031c5de249e09bf31698531573b4.jpg%40690w_!web-note.webp)





Lecture 08 Shading 2 (Shading, Pipeline and Texture Mapping) P8 - 12:10



向量之间的夹角余弦确实可以衡量两向量是否接近，但容忍度太大了

在一次幂的cos曲线下可看到，当夹角很大时，仍然有很大的值，这样生成的高光就会很大

正常情况下，我们认为高光都是很小很亮的

随着指数增加，能看到在大约0~30°之内才可以看到高光，这样就算一个合理的模型

在布林冯模型下，一般来说，指数选在100~200之间，高光角度大约在3~5°之间，算是比较真实的

![img](/notes-assets/Games101/assets/495b25c643ca8a4d9c34acc937cd89edadafa47b.jpg%40686w_!web-note.webp)





Lecture 08 Shading 2 (Shading, Pipeline and Texture Mapping) P8 - 13:47



纵向来看，反射系数Ks越大，高光越亮

横向来看，指数p越大，高光越小

![img](/notes-assets/Games101/assets/6f406d7501a2cfdf3a16746fdda49e84506e0075.jpg%40686w_!web-note.webp)



- **环境光照**



Lecture 08 Shading 2 (Shading, Pipeline and Texture Mapping) P8 - 14:40



![img](/notes-assets/Games101/assets/f07e8c49b04d688fcd8c1852f54e549a5d500dfc.jpg%40686w_!web-note.webp)

一个茶杯，在光源并没有直接照射的方向上也有一定的亮度，因为一个光线可以弹射很多次，从四面八方打到任何一个点，这些光照就算是环境光照

由于环境光照非常复杂，这里我们假设一个点受到的环境光照永远都是相同的，强度称为Ⅰa

任何一个点都有自己的颜色，Ka相当于环境光的系数

可以近似的得到一个环境光La = KaⅠa



**Blinn-Phong Reflection Model**



Lecture 08 Shading 2 (Shading, Pipeline and Texture Mapping) P8 - 16:57



环境光（无论方向）（常数颜色） + 漫反射（无论观测方向）（光照/法线） + 高光 

= 布林冯反射模型

![img](/notes-assets/Games101/assets/3029e8f8355c68b7a604549d21fc306a91ce5ede.jpg%40686w_!web-note.webp)

**ShadingFrequencies 着色频率**



Lecture 08 Shading 2 (Shading, Pipeline and Texture Mapping) P8 - 20:38



三个球具有完全相同的空间信息，着色频率不同后表现不一样

![img](/notes-assets/Games101/assets/f5ed1a32ad080972af7a3dbfe4857266e43420d8.jpg%40686w_!web-note.webp)

**FlatShading（面着色）**

![img](/notes-assets/Games101/assets/305b7109191ca71104a58360bc4f2e7e16fea60a.jpg%40686w_!web-note.webp)

**GouraudShading（顶点着色）**

![img](/notes-assets/Games101/assets/0859f65a29b491d9ae292b8bec590dd720b543ec.jpg%40686w_!web-note.webp)

**PhongShading(像素着色)**

![img](/notes-assets/Games101/assets/9591b602ae66e863711365dced16f56fb3dfec9a.jpg%40686w_!web-note.webp)





Lecture 08 Shading 2 (Shading, Pipeline and Texture Mapping) P8 - 26:46



三种着色频率产生的效果也取决于模型本身

每一行的模型本身顶点数是一样的，越往下顶点数越多

当几何足够复杂时用FlatShading得到的效果也很好

反过来说，当几何的面数大于像素数量时FlatShading的性能也不会好于PhongShading

![img](/notes-assets/Games101/assets/5c788a6928b203ece09fac40adf3ba0a109a546c.jpg%40686w_!web-note.webp)

**如何求逐顶点的法线**



Lecture 08 Shading 2 (Shading, Pipeline and Texture Mapping) P8 - 29:05



将和顶点相邻的面的法向量做加权平均

![img](/notes-assets/Games101/assets/cb76ceb5e7a863bf05822afe3bece0b08795921a.jpg%40686w_!web-note.webp)

**如何求逐像素的法线**



Lecture 08 Shading 2 (Shading, Pipeline and Texture Mapping) P8 - 31:19



已知顶点法线，如何求中间某一点的法线---->插值、重心坐标

![img](/notes-assets/Games101/assets/0f701fa09e8d990c1baa6fbc9251a5cd0b035288.jpg%40686w_!web-note.webp)

**图形管线/实时渲染管线**



Lecture 08 Shading 2 (Shading, Pipeline and Texture Mapping) P8 - 33:38



![img](/notes-assets/Games101/assets/8917c4fd77444d6b990743a4de64e3fbb8818d5f.jpg%40686w_!web-note.webp)

- 顶点处理

将三维空间的点投影在平面上

- 三角形处理

将这些点连接形成三角形

- 光栅化

将三角形离散成为屏幕上的Fragment（未经处理的像素）

- 着色

给像素上色

- 后处理

深度缓冲-处理遮挡关系，MSAA等抗锯齿

（以上操作都在硬件中处理好了，也就是gpu工作流程）



实际例子



Lecture 08 Shading 2 (Shading, Pipeline and Texture Mapping) P8 - 37:22



- MVP变换 --- 顶点处理

MVP变换本质上就是将不同的顶点进行变换

![img](/notes-assets/Games101/assets/eb2327edf3f30d8f4e636bf8a1e5b2af1c251671.jpg%40686w_!web-note.webp)

- 对像素采样 --- 光栅化

![img](/notes-assets/Games101/assets/031da91247a22435292fcf959c38e85e97df46d6.jpg%40686w_!web-note.webp)

- 判定fragment是否可见 --- Fragment处理

Z-Buffer 深度测试

![img](/notes-assets/Games101/assets/446c04a0e77b4f29983aa7e92c78bd8a4fa06127.jpg%40686w_!web-note.webp)

- Shading --- 顶点 或 像素处理

如果用的是GouraudShading，那么进行的就是顶点处理

如果用的是PhongShading，那么进行的就是像素处理

![img](/notes-assets/Games101/assets/ae72a206e553d78b66ab6fef3f48b6312354d903.jpg%40686w_!web-note.webp)



**Shader**

现代GPU中，这套渲染管线某些部分是可编程的，可以由开发者去定义顶点/像素如何着色

也就是用代码控制如何着色

这部分代码就叫Shader



Lecture 08 Shading 2 (Shading, Pipeline and Texture Mapping) P8 - 40:33



Shader指定的是每一个像素/顶点如何着色，所以不能也不用去指定某一个像素如何着色

如果写的是顶点操作，这个shader就叫做VertexShader（顶点着色器）

如果写的是像素操作，这个shader就叫做FragmentShader（片段/片元着色器）/PixelShader（像素着色器）

![img](/notes-assets/Games101/assets/3f98826daefbb60655a3699218b1d1fb955a4c3a.jpg%40686w_!web-note.webp)



**TextureMapping --- 纹理映射**

我们希望得到一个三角形，三角形里面映射了一张图片，怎么得到？ 



Lecture 08 Shading 2 (Shading, Pipeline and Texture Mapping) P8 - 54:46



以球来说，我们发现不同位置有不同颜色，球整体其实公用同一个着色模型，唯一区别就是漫反射系数Kd不同

（Kd忘了的话看Lecture7末尾）

我们希望有一种方法，可以定义一个物体上任意一点的基本属性

![img](/notes-assets/Games101/assets/49e882f862715d322d7fa241422d3226aba1f91d.jpg%40686w_!web-note.webp)



Lecture 08 Shading 2 (Shading, Pipeline and Texture Mapping) P8 - 56:44



3D物体的表面其实都是2D的，比如地球仪，将地球仪上的图撕下来，可以平铺成一张2D的图

物体的表面，通过这种方式可以和一张图有一一对应的关系，这张图就叫纹理

将这张图平铺/裁剪/拉伸到任何物体表面，就叫纹理映射

![img](/notes-assets/Games101/assets/9eadbb2853f9522fa16967bc99d5d3c41a97de60.jpg%40686w_!web-note.webp)

空间上模型的三角形怎么对应到纹理上的三角形？

由美术同学提供

![img](/notes-assets/Games101/assets/8e1fec79310e5a513e620d0d5636ed9b51acdab3.jpg%40686w_!web-note.webp)

纹理上的坐标系通常以UV来表示

通常约定U和V的范围[0,1]

![img](/notes-assets/Games101/assets/06c0ad82956feeb7c96c36826dbacf4a0d8794ef.jpg%40686w_!web-note.webp)

当纹理不断重复贴到模型上，可以得到不错的效果，虽然看纹理效果可以看到两张纹理之间有很明显的变化，但是在场景中很自然的无缝衔接

![img](/notes-assets/Games101/assets/3d8ee361a7883405183edc17089bf92f4e282d59.jpg%40686w_!web-note.webp)



![img](/notes-assets/Games101/assets/7adf4956b0dea475ca8baae50f427afaa431ef8a.jpg%40686w_!web-note.webp)

说明这个纹理本身设计的好，这种纹理叫TilableTextures

这种纹理的设计也是很值得研究的

\-----------------------------------------------------------------------------------------------------------------------------

**Lecture9 Shading -- 纹理处理**

**重心坐标**



Lecture 09 Shading 3 (Texture Mapping Cont.) P9 - 04:50



已知三角形顶点的属性，如何在三角形内部进行任何属性的插值？

![img](/notes-assets/Games101/assets/05b989bba9e0d4ec9dae21cb800eb65adc9b7f1b.jpg%40686w_!web-note.webp)

- **在三角形ABC所在的平面中任意一点（x，y），都可以用三角形三个顶点的线性组合来表示**
- **ABC顶点前面的系数α + β + γ = 1****，（α ， β ， γ）就是用来描述****此三角形****的重心坐标**
- **如果点在三角形内α  β  γ都必须 ≥ 0**

（α + β + γ = 1，是为了限制要求的点在平面内）

![img](/notes-assets/Games101/assets/e28f48b0d850351eab4ad73d8b825d96af6c8005.jpg%40686w_!web-note.webp)

根据上述定理可得

A点的重心坐标就是（1，0，0）



![img](/notes-assets/Games101/assets/ad9f8da5894a6619057334e48d9c26b355e2d733.jpg%40686w_!web-note.webp)

设三角形内一点，点P，连接PA，PB，PC，会形成三个小三角形Aa，Ab，Ac，P的重心坐标就是小三角形面积占大三角形面积的比

α = Aa/(Aa + Ab + Ac)

所以可以求一个特殊的点，三角形重心，三角形重心将三角形划分为三个等面积的小三角形。

所以三角形重心的重心坐标为

![img](/notes-assets/Games101/assets/285089c809beaa57287c0a04bb3262e61befd506.png%40682w_!web-note.webp)



**对于三维空间中的点，不能保证其被投影后的重心坐标不变**



Lecture 09 Shading 3 (Texture Mapping Cont.) P9 - 18:00



如果想插值三维空间中的属性，就应该插值三维空间中的坐标。

因为在做光栅化时，需要知道像素中心在三角形的什么位置，此时不能直接求重心坐标进行插值

需要将该点重新投影回三维空间中，在三维空间中计算重心坐标插值



**应用纹理**



Lecture 09 Shading 3 (Texture Mapping Cont.) P9 - 20:49





![img](/notes-assets/Games101/assets/aed9f8d60ff8bc414e94e96b6cb3511625856dbc.jpg%40686w_!web-note.webp)

屏幕上的采样点（x,y）可以用重心坐标算出在纹理中采样的uv，得到对应纹理



**纹理放大**

当低分辨率纹理应用到高分辨率的屏幕上，纹理就会被拉大。

![img](/notes-assets/Games101/assets/54c5b57606dc0fa18933d159c7589d2929971a33.jpg%40686w_!web-note.webp)

对于任意一点，可以找到对应纹理上的位置，位置可能不是整数，将位置坐标四舍五入，然后取纹理上的值

这样的话，一个texel就可能会被映射到多个pixel上，也就说可能在3*3的像素内用了同一个纹理的元素（texel）

这样就会产生马赛克效果如**图Nearest**

**双线性插值**

![img](/notes-assets/Games101/assets/51f4f37ba8bc92c0bc23c66adc371758d4ccf32f.jpg%40686w_!web-note.webp)

先用U01  U11插值出来U1

再用U00 U10插值出来U0

再把U0和U1进行插值，得到红点的最终值，即为双线性插值

得到**图Bilinear**

**图Bicubic**是将周围16个进行立方插值



**纹理缩小**



Lecture 09 Shading 3 (Texture Mapping Cont.) P9 - 34:18



![img](/notes-assets/Games101/assets/74177a639edb6b2b80738560261f331500dbcb63.jpg%40686w_!web-note.webp)

如果直接简单的使用线性插值进行采样会得到右图，远处有摩尔纹近处有锯齿

远处的一个像素就会覆盖很大一片的纹理区域，单纯以像素的中心是标准取纹理的值是不对的

这其实就是转变为了采样率不足的问题，之前解决采样率不足的问题我们可以使用SSAA，每个像素内分为若干小像素进行采样。

以512个小像素为例，得到的结果如下图

![img](/notes-assets/Games101/assets/3d7b8e3ef008b3f76d58e43406415b01d2a1994a.jpg%40686w_!web-note.webp)

正确，但花费了512倍的性能



既然采样有问题，那我们如果可以直接查询而不采样呢？



**Mipmap**



Lecture 09 Shading 3 (Texture Mapping Cont.) P9 - 43:20



纹理缩小时，一个屏幕上的像素对应了纹理上的多个纹素，使图像看起来就变得模糊。

所以引出了**Mipmap（多级渐远纹理）**技术

将原纹理提前用滤波处理得到很多更小的图像，当物体远离相机时，直接查询较小的纹理，得到正确的结果像素

Mipmap就可以实现我们需要的查询，但仅仅是近似的、正方形的查询

![img](/notes-assets/Games101/assets/48bad73a93f410a285ac270ad624d980c254c291.jpg%40686w_!web-note.webp)



因为生成了多个较小的图像，需要额外储存生成的小图像

- 所以Mipmap占用的额外空间是原来的1/3

这是一种典型的空间换时间的思想

![img](/notes-assets/Games101/assets/3130a7bfeb87c87249586f755a86ea0df0a140e3.png%40686w_!web-note.webp)



要查询在屏幕空间内的某像素，映射在纹理空间内占多大区域

可以将自己中心和邻居的中心分别投影到纹理空间内，这样就能知道在纹理空间中，该点和邻居点之间的距离L，要求的区域可以近似为以L为边长的正方形区域

![img](/notes-assets/Games101/assets/1d5f478f1a45a638b8b8ed13f0cadbcfbd84e863.jpg%40686w_!web-note.webp)



但是会出现不连续的纹理映射，因为查的纹理都是整数层，比如我们无法直接查询1.5层的Mipmap

![img](/notes-assets/Games101/assets/dd3889333e6a9366727f321f2d9e06dc91c182fd.jpg%40686w_!web-note.webp)

所以需要在两层之间进行插值，称为**三线性插值**

![img](/notes-assets/Games101/assets/1dc0538a2d8849189c5af723f07e19df0b3b3951.jpg%40686w_!web-note.webp)



![img](/notes-assets/Games101/assets/bb33e62c294ed72df6335a2d5ff926929087dbd0.jpg%40686w_!web-note.webp)







**各向异性过滤**

运用上述Mipmap后，在远处产生的图像很模糊，因为Mipmap是近似的、正方形的查询

只能查询正方形区域，而且三线性插值也是近似



![img](/notes-assets/Games101/assets/9334cc95601be3f24be02b84c54e227b29dd72f9.jpg%40686w_!web-note.webp)

屏幕上的像素映射到纹理上不一定是正方形，对于不是正方形的Mipmap就无法处理。

如下图，对于右边不是正方形但是是比较规则的矩形，我们可以用其他方法提供查询

![img](/notes-assets/Games101/assets/391dc54569b7eae109d99de55ff7b82d4da73000.png%40686w_!web-note.webp)

将原图宽度不变长度压缩，长度不变宽度压缩就可以提供矩形的查找，即为各向异性过滤

经常看到的各向异性过滤x2x4等，指的是要生成多少层的压缩图，x2就是一层，x4就是两层。占用的空间逐渐向三倍靠拢

![img](/notes-assets/Games101/assets/4a05849bfe775a3c9200935426a1795ad879b317.png%40670w_!web-note.webp)

但各向异性过滤也只是能解决映射在纹理空间是比较规则的矩形的情况，当出现不规则矩形的时候也无法处理

![img](/notes-assets/Games101/assets/886a9f8e78a5bc9cbda306d054009d178e3b2c23.png%40448w_!web-note.webp)



所以又引出了**EWA过滤**，EWA过滤可以将任意形状拆分为很多大小不同的椭圆，经过多次查询，就能查询出最终的结果。

但是代价也是需要多次查询的时间



\----------------------------------------------------------------------------------------------------------------------------------------------

**Lecture10 Geometry -- 几何介绍**



**EnvironmentMap -- 环境光贴图**

纹理本质上就是提供了一个快捷的查询，不只局限于图像，光照也能同理进行查询

![img](/notes-assets/Games101/assets/8aad2a1659b9602edd3864c6e3a0ede16f951210.jpg%40686w_!web-note.webp)

光照贴图认为光照是无限远的，忽略了光的位置信息



怎样描述环境光？

![img](/notes-assets/Games101/assets/8e02b03a4d51d592a8fe187825bc0acae9e29cec.jpg%40686w_!web-note.webp)

如果在房间中有一光滑的金属球，我们观察他就会发现它反射出来的就是环境光。

那我们就可以把环境光储存在球上面，并且也能把它展开成平面

但展开后发现球形图的上下会扭曲。

虽然我们能描述球上不同的位置，但无法均匀的描述

![img](/notes-assets/Games101/assets/ba8bb1ceeb7e8885b4dccdf325d73796cbe3e2cc.jpg%40686w_!web-note.webp)

所以我们可以将信息记录在这个球的外接立方体，这样信息就变得均匀了--CubeMap

![img](/notes-assets/Games101/assets/598306bc27d54492f6cdecea6da4ed293935040f.jpg%40686w_!web-note.webp)



![img](/notes-assets/Games101/assets/7b401962c1d59130de2cde900b00b6aade6b6f4c.jpg%40686w_!web-note.webp)

**BumpMapping -- 法线贴图**

法线贴图是为了在不增加三角形面数的情况下，在着色时显示更多细节

对某一点进行着色时，需要判断该点的法线方向，从而计算光照和颜色

需要从原本的模型表面映射到法线贴图中，查询新的法线位置

![img](/notes-assets/Games101/assets/cf331e7fc7801f13cd17caf6e6ce85bf77fb272f.jpg%40686w_!web-note.webp)

法线贴图如何知道法线的方向呢？

先看一维中的简单示例

-  先算该点切线
- 切线可以用该点与下一个点的位置差计算出来
- 将切线逆时针旋转90°，求归一化，得到法线

![img](/notes-assets/Games101/assets/4a9f47f6283b87b31b2092bfdb2c362c7215c3b7.jpg%40686w_!web-note.webp)

二维的贴图（3D空间）中如何求法线？

对u、v坐标分别求导，算出切线，旋转得到法线

![img](/notes-assets/Games101/assets/39f49f4bf8e4264e4ae7636b12883c72d2399907.jpg%40686w_!web-note.webp)



**位移贴图**



Lecture 10 Geometry 1 (Introduction) P10 - 29:07





![img](/notes-assets/Games101/assets/bb05071bd3cbaf73d749f1eb880acffcd719d53a.jpg%40686w_!web-note.webp)

环境光遮蔽也能预先计算好，存储到纹理中

![img](/notes-assets/Games101/assets/37228fdb37642a01e69f526dcf2f880453089bfa.jpg%40686w_!web-note.webp)



**几何**



**隐式几何**



Lecture 10 Geometry 1 (Introduction) P10 - 46:32



隐式几何用来表达该几何点之间的关系

隐式表达的函数f（x,y,z）很难从函数看出函数形成的面是什么形状的

但可以轻松的知道某一点是否在这个平面上,或物体内外

![img](/notes-assets/Games101/assets/8573a75ca9881b8ff4a87150a23e9f91376028a8.jpg%40686w_!web-note.webp)

显式表达



Lecture 10 Geometry 1 (Introduction) P10 - 51:00



给定:点的空间坐标uv,遍历所有点就可以在空间中画出该物体

用平面中的uv去映射到空间中，表示空间上的面

优点就是可以看出函数形成的面是什么形状的

但无法轻松的知道某一点是否在这个平面上

![img](/notes-assets/Games101/assets/2a6e322398eb6bd4bcb0d6580d2b804064eb7710.jpg%40686w_!web-note.webp)



![img](/notes-assets/Games101/assets/ec162020ae19166c494305b3fd291162186ff6b6.jpg%40686w_!web-note.webp)



两种表达各有各的用途，没有好坏之分，根据需要选择



**Constructive Solid Geometry - CSG**



Lecture 10 Geometry 1 (Introduction) P10 - 58:10



隐式几何 

通过基本几何的布尔运算，得到新的几何

![img](/notes-assets/Games101/assets/09f7555007b3b820d2f6e9351755af626cb59673.jpg%40686w_!web-note.webp)





Lecture 10 Geometry 1 (Introduction) P10 - 01:00:57



DistanceFunctions （距离函数）

不直接描述几何表面,描述空间中的每一点到几何表面的最短距离

![img](/notes-assets/Games101/assets/647629b2bd212ce6c84e64762bd7a4936cb9e0e6.jpg%40686w_!web-note.webp)

\------------------------------------------------------------------------------------------------------

blend 是混合, 这里是想将 A 与 B 混合为一体.

阴影处是物体, 阴影与留白一起, 构成物体所处的空间

A 与 B 的混合, 不仅混合了物体(1/3+2/3=1), 还混合了空间(1+1=2), 最终效果应该是混合后的物体在混合后的空间中的占比是 1/2

例示中比较反直觉的是, blend(A, B) 所处空间的大小, 看起来依旧是 1

![img](/notes-assets/Games101/assets/a9e3dee08cafdfbbf2e84fafd79c3e22d77dd83b.jpg%40686w_!web-note.webp)

对于SDF(有向距离场)的具体知识可以单独学习

可以参考 BV1Qz4y1p7CE



对于两个物体，Blend两个物体的距离函数即可得到如下效果

![img](/notes-assets/Games101/assets/15f2f41d451cf485090e405e09d7e69a704b3fe5.jpg%40686w_!web-note.webp)



SDF很难用式子表达出来，那如何把SDF恢复成表面呢？

**水平集 -- LevelSet**

将函数的表述写在格子上

只要找到所有f（x）= 0的地方就能尝试描述这个物体的表面

概念等同于地理上的等高线

![img](/notes-assets/Games101/assets/b375988cd08e44ee430d269375979e66eb6c8a7b.jpg%40686w_!web-note.webp)
