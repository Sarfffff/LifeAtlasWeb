---
title: 数组
date: 2026-06-27 03:56:00
categories:
  - 编程语言
tags:
  - Java
  - 笔记
---
#   5 数组、排序和查找

> 数组：可以存放多个同一类型的数据。数组也是一种数据，是引用类型。
>
> 即：数组就是一组数据。

## 5.1 一维数组

> 数组可以是多个相同类型数据的组合，实现对这些数据的统一管理。
>
> 数组中的元素可以是任何数据类型。包括基本类型和引用类型。
>
> 数组的下标从 0 开始。且必须在指定范围内使用，否则报错。
>
> 数组属于 引用类型，数组型数据是 对象（Object）
>

**数组的构造方法：**

使用数组的步骤：1.声明数组并开辟空间 2.给数组各个元素赋值 3.使用数组

- 构造方式1：动态初始化

  ```java
  int[] name = new int[5];				// 创建了数组 name，存放5个int
  int ints2[] = new int[1];				// 这种写法也行
  ints[2] = 15;							// 访问数组第3个数
  ```

- 构造方式2：动态初始化

  ```java
  char[] arry;							// 先声明数组 name，此时数组是 null
  arry = new char[2];					// 分配内存空间，可以存放数据了
  chars[1] = '\t';
  ```

- 构造方式3：静态初始化

  ```java
  boolean[] bools = {true, false, true, false};
  String[] strs = new String[]{"阿伟，你又在打电动噢", "烦啦"};
  ```

  确切知道数组每个元素的场合可以用这个方法。

  **java中可以使用.length获取到数组的长度**

**数组的使用方法：**   

- 访问数组元素：`数组名[元素下标]`

  其中，元素下标从 0 开始编号。如：访问 `strs` 数组的第一个元素 `strs[0]`

- 数组也同数据类型一样可以进行自动的数据类型转换`int`-->`double`

- 数组长度：`数组名.length`

  是一个 `int `值。不能通过试图改变该值来改变数组容量
  
- 数组创建后，如果没有赋值，有默认值：`int（0），short（0），byte（0），long（0L），float（0.0F），double（0.0），char（\u0000），boolean（false），String（null），Object（null）`

### 5.1.1 数组赋值机制

1. 基本数据类型赋值，赋值方式是值拷贝。这个值就是具体的数据，且互不影响

2. 数组在默认情况下是引用传递，赋的值是地址，赋值方式为引用传达。

   ```java
   int[] array1 = {0, 0, 0};
   int[] array2 = array1;  //此时把array1的首地址赋给array2 
   array2[0] = 100;   //array1[0] = 100,此时array1，array2都可以访问100，
   ```

   上述情况下，`array1[0]` 也会变成 `100`。因为数组在` JVM` 的 栈 里是一个地址，指向 堆 里的一个空间。这两个数组在上述情况下指向同一空间,类似于指针，传递的是地址。

   ```java
   int[] array1 = {0, 0, 0};
   int[] array2 = new int[array1.length];
   for (int i = 0;i < array1.length;i++) {
       array2[i] = array1[i];
   }
   ```

   上述方式拷贝后，两数组相互独立。

### 5.1.2 数组的扩容

当数组达到上限时，创建一个容量更大的新数组。将旧数组的元素依次放入，之后替换旧数组。

最基础的扩容方法：

```java
int[] arr1 = {1, 2, 3};	
int[] arrNew = new int[arr1.length + 1];
for(int i = 0;i<arrl.length;i++){
arrNew[i] = arr1[i];
}
arrNew[arr1.length-1] = 4;
arr1 = arrNew //此时arr1完成扩容
    
```

以下是一个扩容方法：

```java
import java.util.Scanner;
public class Code5_1_3{

	public static void main(String[] args){

		Scanner inP = new Scanner(System.in);
		int[] arr1 = {1, 2, 3};		// 这是原数组
		int add = 0;				// 这个变量记录输入的新元素的值
		int count = arr1.length;	// 这个变量是新数组的长度
		char yN = 'a';				// 记录询问继续与否时用户的输入字符

		do{
       	/* 创建多一位的新数组，把新元素赋给新数组的最后一位 */
				System.out.println("请输入添加数字：");
				add = inP.nextInt();
				int[] tem = new int[arr1.length + 1];
				tem[count] = add;

       	/* 把旧数组的值全部赋给新数组 */
				for(int i = 0; i < arr1.length; i++){
					tem[i] = arr1[i];
				} //数组arr1的值全部复制给tem

       	/* 把新数组保存下来，输出现在的数组 */
				arr1 = tem;
				count++;
				System.out.println("\n\n当前数组为：");

				for(int i = 0; i < arr1.length; i++){
					System.out.print(arr1[i] + " ");
				}

       	/* 询问是否继续添加，输入n跳出，否则循环 */
				System.out.println("\n\n是否继续添加？（Y/N）");
				yN = inP.next().charAt(0);

		}while(yN != 'N' && yN != 'n');

	}
}
```

## 5.2 二维数组

```java
int[][] ints;					// 声明一个二维数组
int[] ints2[];					// 也能这样声明
int ints3[][];					// 这样也行
int[] x,y[];					// 声明了两个数组，一个是 int[] x 一个是 int[][] y
								// 把 int[] 视作一个类型，就能很好地理解这个写法
```

二维数组实际是由多个一维数组组成的，它的各个元素的长度可以相同，也可以不同。

数组是一个对象，所以二维数组的元素存放的是一维数组的地址,线性连续的地址块  。

**二维数组的输出**

- ```java
  for(int i = 0;i<arr.length;i++){
      for(int j = 0;j<arr[i].length;j++){ //arr[i].length得到对应的每个一维数组的长度
          System.out.println(arr[i][j ]);
      }
  }
  ```

  

**二维数组构造方法：**

- 构造方法1：动态初始化

  ```java
  int[][] many_ints = new int[3][4]	// 创建 有3个 包含4个元素的一维数组 的二维数组
  
  ```

- 构造方法2：动态初始化

  ```java
  double[][] many_doubles;			// 先声明变量
  many_doubles = new double[3][4];	// 再开辟空间
  ```

- 构造方法3：动态初始化-列数不确定

  ```java
  char[][] many_chars = new char[3][];	// 创建一个三行列数不确定的二维数组
  for (int i = 0; i < 3; i++) {
      many_chars[i] = new char[i + 1];	// 此时，每个数组空间依次增大
  }
  ```

- 构造方法4：静态初始化

  ```java
  int[][] many_many = {{1, 3}, {4, 10, 2}, {95}};
  
  ```

**二维数组使用方法：**

- `ints.length`：该二维数组的长度，这里是 3
- `ints[0]`：该二维数组的第一个子数组
- `ints[0].length`：该二维数组的第一个子数组的长度，这里是 4
- `ints[1][0]`：该二维数组第二个子数组的第一个元素的值，这里是 21



## 5.3 查找算法

在 Java 中，常用的查找有 4 种：

- 顺序查找（遍历）
- 二分查找
- 插值查找
- 斐波那契查找

### 5.3.1 线性查找

逐一比对，直到发现目标值

```java
public static int seqSearch(int[] array, int target) {
    for (int i = 0; i < array.length; i++) {
        if (array[i] == target) return i;
    }
    return -1;
}
```

### 5.3.2 二分查找

二分查找要求数组必须是有序数组。

每次取出那个中位数。目标值小于中位数的场合，则在较小一侧的范围内继续二分查找。否则在那个较大一侧查找。

递归方式二分查找：

```java
public static int binarySearch(int[] array, int target) {
    return binarySearch(array, target, 0, array.length);
}

public static int binarySearch(int[] array, int target, int l, int r) {
    if (l >= r) return -l - 1;
    int p = (l + r) / 2;
    if (target == array[p]) return p;
    else if (target > array[p]) {
        return binarySearch(array, target, p + 1, r);
    } else return binarySearch(array, target, l, p - 1);
}
```

非递归方式二分查找：

```java
public static int binarySearch2(int[] array, int target) {
    int l = 0;
    int r = array.length;
    while (r > l) {
        int p = (r + l) / 2;
        if (target == array[p]) return p;
        else if (target > array[p]) l = p + 1;
        else r = p - 1;
    }
    return -l - 1;
}
```

### 5.3.3 插值查找

插值查找类似于二分查找，但其不是取出中位数，而是从自适应的位置取出一个元素

那个自适应的取出位置 𝑝𝑜𝑠=𝑙𝑜𝑤+(ℎ𝑖𝑔ℎ−𝑙𝑜𝑤)×𝑡𝑎𝑟𝑔𝑒𝑡−𝑎𝑟𝑟[𝑙𝑜𝑤]𝑎𝑟𝑟[ℎ𝑖𝑔ℎ]−𝑎𝑟𝑟[𝑙𝑜𝑤]*p**os*=*l**o**w*+(*hi**g**h*−*l**o**w*)×*a**rr*[*hi**g**h*]−*a**rr*[*l**o**w*]*t**a**r**g**e**t*−*a**rr*[*l**o**w*]

上面的 𝑙𝑜𝑤*l**o**w* 是查找范围的下界，ℎ𝑖𝑔ℎ*hi**g**h* 是查找范围的上界，𝑡𝑎𝑟𝑔𝑒𝑡*t**a**r**g**e**t* 是目标值，𝑎𝑟𝑟[𝑖]*a**rr*[*i*] 是数组第 𝑖*i* 个元素的值

可见，如若那个目标值更靠近某一端，这个自适应的取出位置也会更接近那一端

```java
public static int insertSearch(int[] array, int target) {
    if (target > array[array.length - 1]) return -array.length;
    else if (target < array[0]) return 0;
    int l = 0;
    int r = array.length;
    int p = 0;
    while (r >= l) {
        p = l + (target - array[l]) * (r - 1 - l) / (array[r - 1] - array[l]);
        if (target == array[p]) return p;
        else if (target > array[p]) l = p + 1;
        else r = p - 1;
    }
    return -p;
}
```

### 5.3.4 斐波那契查找

斐波那契查找原理与前两种类似，仅仅改变了中间节点的位置。

其中间节点不是中位或插值，而是位于黄金分割点附近。

……是黄金分割，真好呀！

## 5.4 排序算法

> 排序也叫排序算法。是将一组数据，依指定的顺序进行排列的过程

排序分为两类：

- 内部排序：将所有要处理的数据加载到内部存储器中进行排序

  内部排序主要有以下几种：

  - 插入排序：直接插入排序、希儿排序
  - 选择排序：简单选择排序、堆排序
  - 交换排序：冒泡排序、快速排序
  - 归并排序
  - 基数排序

- 外部排序：数据量庞大，无法全部加载到内存中，需要借助外部存储进行排序

  如：合并排序法、直接合并排序法

#### #排序算法的时间复杂度

| 排序法     | 平均时间 | 最差情形  | 稳定性 | 额外空间 | 说明               |
| ---------- | -------- | --------- | ------ | -------- | ------------------ |
| 冒泡排序   | O(n2)    | O(n2)     | 稳定   | O(1)     | n 小时较好         |
| 交换排序   | O(n2)    | O(n2)     | 不稳定 | O(1)     | n 小时较好         |
| 选择排序   | O(n2)    | O(n2)     | 不稳定 | O(1)     | n 小时较好         |
| 插入排序   | O(n2)    | O(n2)     | 稳定   | O(1)     | 大部分已排序时较好 |
| 基数排序   | O(n × k) | O(n × k)  | 稳定   | O(n)     | k 是 “桶” 的个数   |
| Shell 排序 | O(n㏒2n) | O(n㏒22n) | 不稳定 | O(1)     | n 大时较好         |
| 快速排序   | O(n㏒2n) | O(n2)     | 不稳定 | O(n㏒n)  | n 大时较好         |
| 归并排序   | O(n㏒2n) | O(n㏒2n)  | 稳定   | O(1)     | n 小时较好         |
| 堆排序     | O(n㏒2n) | O(n㏒2n)  | 不稳定 | O(1)     | n 大时较好         |

**稳定性：**排序后，那些原本相等元素的相对顺序不改变

***—— 时间复杂度，见 [26.1.1 时间复杂度]***

### 5.4.1 冒泡排序

**冒泡排序：**通过对 待排序序列 从后向前遍历，依次比较相邻元素的值。若发现 逆序 则交换。

![image-20240724131523797](/notes-assets/Java/.assets/image-20240724131523797.png)

如此，各元素不断接近自己的位置。值较大的元素逐渐向后移动，就像水下的气泡一样逐渐上浮。

特别地：如果在某次排序中没有发生过任何交换，则此时是已完成排序，可提前结束排序过程。

```java
import java.util.Scanner;

public class pro1 {
    public static void main(String[] args) {
        Scanner myScan = new Scanner(System.in);
        System.out.println("请输入的数组的元素 ");
        int[] arr = new int [10];
        for(int i = 0;i < 10;i++){
            arr[i] = myScan.nextInt();
        }
        int tmp ;
        for(int i = 0;i < arr.length-1;i++){   //n个元素，只需要n-1次排序
            for(int j = 0;j<arr.length-1-i;j++){ //每次排序，都已经将最大元素排在后面，所以每次比较次数减一
                if(arr[j]>arr[j+1]) {
                     tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                }
            }
        }
        for (int j : arr) System.out.println(j);
    }
}
```

### 5.4.2 选择排序

**选择排序：**从 待排序序列 中，按指定规则选出某一元素，再依照规定交换位置后达到排序目的。

![image-20241218143443091](/notes-assets/Java/.assets/image-20241218143443091.png)

从 待排序序列 中找出 最小值，与下标 0 位置元素 交换。之后在剩余元素中找出 最小值，与下标 1 元素 交换。以此类推，直到完成。

<iframe src="https://player.bilibili.com/player.html?aid=641228181&amp;bvid=BV1CY4y1t7TZ&amp;cid=588763198&amp;page=3&amp;autoplay=0" scrolling="no" width="400" height="300" style="box-sizing: border-box; color: rgb(44, 62, 80); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, &quot;Liberation Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: 0.32px; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(240, 240, 240); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"></iframe>



上面是 b 站大佬 [**说数人**](https://space.bilibili.com/418025703) 制作的动画，演示了选择排序的工作原理

```java
public static void choice_sort(int[] array) {
    for (int p = 0; p < array.length - 1; p++) {
        int min_index = p;		// loc 指向那个当前找到的最小值的下标
        /* 找出当前剩余元素中的最小值 */
        for (int n = p + 1; n < array.length; n++) {
            if (array[n] < array[min_index]) min_index = n;
        }
        /* 将找到的最小值与对应位置元素交换 */
        if (min_index != p) {
            int temp = array[min_index];
            array[min_index] = array[p];
            array[p] = temp;
        }
    }
}
```

如果有 *n* 个元素，就进行 *n*−1 轮选择，第 k* 轮选择要比较n*−*k* 个元素，并进行 1 次交换。时间复杂度为 O*(*n*2)

对随机数组 int[] array（array.length = 80000；array[i] ∊ [0, 107)）进行选择排序。
那个统计时间是：1616 ms

### 5.4.3 插入排序

**插入排序：**在 待排序序列 中的元素，以插入的方式找寻该元素的适当位置，以达到排序目的。

![image-20241218143612911](/notes-assets/Java/.assets/image-20241218143612911.png)

将 待排序序列 的元素视为一个 有序表 和一个 无序表。起初， 有序表 中只有一个元素， 无序表 中有 n - 1 个元素。

排序过程中每次从 无序表 中取出第一个元素，把它依次与 有序表 元素进行比较，确定其在 有序表 的位置，将其插入 有序表 ，成为新的 有序表 。

<iframe src="https://player.bilibili.com/player.html?aid=641228181&amp;bvid=BV1CY4y1t7TZ&amp;cid=588760371&amp;page=1&amp;autoplay=0" scrolling="no" width="400" height="300" style="box-sizing: border-box; color: rgb(44, 62, 80); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, &quot;Liberation Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: 0.32px; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(240, 240, 240); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"></iframe>



上面是 b 站大佬 [**说数人**](https://space.bilibili.com/418025703) 制作的动画，演示了插入排序的工作原理

```java
public static void insert_sort(int[] array) {
    /* 数组的前一部分视为有序表，后一部分视为无序表 */
    for (int p = 1; p < array.length; p++) {
        int temp = array[p];	// 那个 无序表首元素 的值
        int insertPos = p;		// 那个 无序表首元素 在有序表的位置
        
        /* 逆向遍历那个有序表，以确定该无序表首元素在有序表的位置。
        	到达位置前，将有序表的插入位置后的元素后移 */
        for (int n = p - 1; n >= 0; n--) {
            if (array[n] < temp) break;
            array[n + 1] = array[n];
            insertPos--;
        }
        /* 将该元素插入指定位置 */
        array[insertPos] = temp;
    }
}
```

如果有 n*n* 个元素，就进行 n−1*n*−1 轮插入，第 k*k* 轮插入需要进行 k*k* 次比较、移动和交换，平均每轮需要 n22*n* 次操作。时间复杂度为 O(n2)*O*(*n*2)

对随机数组 int[] array（array.length = 80000；array[i] ∊ [0, 107)）进行插入排序。
那个统计时间是：423 ms

### 5.4.4 希尔排序

![image-20241218143745840](/notes-assets/Java/.assets/image-20241218143745840.png)

希尔排序也是一种插入排序，是简单插入排序的高效改进版。也称为：缩小增量排序。

希尔排序是把 待排序序列 按下标的一定 步长 进行 分组，对每组使用 插入排序法。随着 步长 逐渐减少，每组包含的 元素个数 也越来越多。

当 步长 减至 1 时，整个 待排序序列 恰被分为 1 组，算法便中止。

<iframe src="https://player.bilibili.com/player.html?aid=641228181&amp;bvid=BV1CY4y1t7TZ&amp;cid=588765535&amp;page=20&amp;autoplay=0" scrolling="no" width="400" height="300" style="box-sizing: border-box; color: rgb(44, 62, 80); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, &quot;Liberation Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: 0.32px; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(240, 240, 240); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"></iframe>



上面是 b 站大佬 [**说数人**](https://space.bilibili.com/418025703) 制作的动画，演示了希尔排序的工作原理

```Java
public static void seele_sort(int[] array) {
    int step = array.length / 2;		// 步长。该值等于分组数量
    
    /* 初始将数组为 2 数一组，那么每组的步长就是 array.length / 2
    	步长是那个分组中，相邻两个数的下标间隔。步长的值也等于组数
    	直到那个分组大小等于原序列，也就是步长 == 1 时，进行最后一次排序 */
    while (step >= 1) {
        
        /* 一共有 step 组，对每一组都进行一次完整的插入排序 */
        for (int group = 0; group < step; group++) {
            
            /* 每一组中，下一个元素的下标是：当前下标 + step
            	每组的起始下标是 group，根据插入排序法，将每组视为有序表和无序表
            	那个无序表从每组第二个元素开始计数，也就是下标 group + step */
            for (int toSort = group + step; toSort < array.length; toSort += step) {
                int insertPos = toSort;
                int temp;
                /* 已经有序时直接 continue */
                if ((temp = array[toSort]) >= array[toSort - step]) continue;
                /* 寻找插入位置。在找到位置前，移动那些有序表元素 */
                for (int exPos = toSort - step; exPos >= group; exPos -= step) {
                        if (array[exPos] < temp) break;
                        array[exPos + step] = array[exPos];
                        insertPos -= step;
                    }
                /* 执行插入 */
                array[insertPos] = temp;
            }
        }
        /* 每轮循环后，分组容量变为 2 倍，那么步长就会变为一半 */
        step /= 2;
    }
}
```

希尔排序的增量元素不互质，极端情况下增量不起作用，于是最坏情况可能达到 O(n2)*O*(*n*2)。

为解决该问题，提出了 **Hibbard 增量序列**。其增量的步长 D**k* 改为 2*k*−1。这样，保证了相邻两个元素互质。这种情况下，最坏情况达到了 O*(*n*23)

对随机数组 int[] array（array.length = 80000；array[i] ∊ [0, 107)）进行希尔排序。
那个统计时间是：11 ms

### 5.4.5 快速排序

**快速排序：**是对冒泡排序的一种改进。通过一趟排序，将 待排序序列 分割 成独立的两部分，其中一部分的所有数据都比另一部分小，再按此方法对这两部分数据 分别进行快速排序。

![image-20241218143847489](/notes-assets/Java/.assets/image-20241218143847489.png)

整个排序过程可以 递归进行，最终使整个数据变成有序序列。

<iframe src="https://player.bilibili.com/player.html?aid=641228181&amp;bvid=BV1CY4y1t7TZ&amp;cid=588764662&amp;page=13&amp;autoplay=0" scrolling="no" width="400" height="300" style="box-sizing: border-box; color: rgb(44, 62, 80); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, &quot;Liberation Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: 0.32px; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(240, 240, 240); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"></iframe>



上面是 b 站大佬 [**说数人**](https://space.bilibili.com/418025703) 制作的动画，演示了快速排序的工作原理

```java
public static void quick_sort(int[] array) {
    quick_sort(array, 0, array.length - 1);
}

private static void quick_sort(int[] array, int start, int end) {
    if (start >= end) return;
    /* 将（左端点、右端点、中间点）中的[中位数]作为比较值 */
    int mid = (start + end) >> 1;
    if (array[start] > array[mid]) swap(array, start, mid);
    if (array[start] > array[end]) swap(array, start, end);
    if (array[mid] > array[end]) swap(array, mid, end);
    int key = array[mid];

    if (end <= start + 2) return;

    swap(array, mid, end - 1);
    /* 遍历指定区间，将那些较小值放到左侧，较大值放到右侧 */
    int l = start + 1, r = end - 2;
    while (l <= r) {
        while (l <= r && array[l] < key) l++;
        while (l <= r && array[r] > key) r--;
        if (l <= r) swap(array, l++, r--);
    }

    swap(array, end - 1, l);
    quick_sort(array, start, r);          // 对那个较小侧区间再进行快速排序
    quick_sort(array, l + 1, end);            // 对那个较大测区间再进行快速排序
}

private static void swap(int[] array, int x, int y) {
    int temp = array[x];
    array[x] = array[y];
    array[y] = temp;
}
```

如果有 *n* 个元素，则最多进行 log2*n*（每轮都选到中位数时）至 n*（每轮都选到极值时）轮分组。任意一轮分组中最多有 n* 次比较、n* 次交换。因此，时间复杂度为 O*(*n*log*n*)，最差情况为 O*(*n*2)

对随机数组 int[] array（array.length = 80000；array[i] ∊ [0, 107)）进行快速排序。
那个统计时间是：16 ms

### 5.4.6 归并排序

**归并排序：**利用归并的思想实现的排序方法。该算法采用经典的分治策略（将问题分解成几个小问题，然后分而治之）。

![image-20241218143926944](/notes-assets/Java/.assets/image-20241218143926944.png)

对 2 个元素进行比较、排序，是很容易的。对 2 个有序序列，将其合并为新的有序序列，也是容易的。

因此，我们把 待排序序列 分成许多 组，每组包含 2 个元素，并对每组进行排序。再逐渐 合并 那些组，最终就能得到一个完整的有序序列。

<iframe src="https://player.bilibili.com/player.html?aid=641228181&amp;bvid=BV1CY4y1t7TZ&amp;cid=588763441&amp;page=4&amp;autoplay=0" scrolling="no" width="400" height="300" style="box-sizing: border-box; color: rgb(44, 62, 80); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, &quot;Liberation Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: 0.32px; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(240, 240, 240); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"></iframe>



上面是 b 站大佬 [**说数人**](https://space.bilibili.com/418025703) 制作的动画，演示了归并排序的工作原理

```java
public static void merger_sort(int[] array) {
    int tl = (int) Math.ceil(array.length / 2.0);
    int[][] temp = new int[tl][];
    for (int i = 0; ; i += 2) {
        if (i == array.length) {
            if (i == array.length + 1) temp[i / 2] = new int[]{array[i - 1]};
            break;
        } else {
            if (array[i] > array[i + 1]) {
                temp[i / 2] = new int[]{array[i + 1], array[i]};
            } else {
                temp[i / 2] = new int[]{array[i], array[i + 1]};
            }
        }
    }
    while (temp.length != 1) {
        temp = combine(temp);
    }
    System.arraycopy(temp[0], 0, array, 0, array.length);
}

private static int[][] combine(int[][] temp) {
    int tl = (int) Math.ceil(temp.length / 2.0);
    int[][] tt = new int[tl][];
    for (int i = 0; i < tt.length; i++) {
        int tp = 2 * i;
        if (tp + 1 >= temp.length) tt[i] = temp[tp];
        else tt[i] = combine(temp[tp], temp[tp + 1]);
    }
    return tt;
}

private static int[] combine(int[] a, int[] b) {
    int[] ret = new int[a.length + b.length];
    int ap = 0;
    int bp = 0;
    int rp = 0;
    while (true) {
        if (ap >= a.length) {
            while (bp < b.length) {
                ret[rp++] = b[bp++];
            }
            break;
        } else if (bp >= b.length) {
            while (ap < a.length) {
                ret[rp++] = a[ap++];
            }
            break;
        } else if (a[ap] > b[bp]) {
            ret[rp++] = b[bp++];
        } else {
            ret[rp++] = a[ap++];
        }
    }
    return ret;
}
```

如果有 *n* 个元素，则发生log2*n* 轮合并。每轮排序最多进行 *n* 次比较与 n* 次插入。因此，时间复杂度为O*(*n*log*n*)

对随机数组 int[] array（array.length = 80000；array[i] ∊ [0, 107)）进行归并排序。
那个统计时间是：15 ms

### 5.4.7 基数排序

**基数排序：**属于分配式排序（又称 “桶排序”。顾名思义，通过键值各个位的值，将 待排序序列 的元素分配至某些 桶 中，达到排序的作用）。基数排序是经典的空间换时间的算法

![image-20241218143955985](/notes-assets/Java/.assets/image-20241218143955985.png)

基数排序法是桶排序的扩展。将整数 按照位数切割成不同数字，然后 按照每个位数分别比较。

该方法只能用于比较正数。你非要比较负数？咱也不说不行，你自己看着办吧

<iframe src="https://player.bilibili.com/player.html?aid=641228181&amp;bvid=BV1CY4y1t7TZ&amp;cid=588764948&amp;page=15&amp;autoplay=0" scrolling="no" width="400" height="300" style="box-sizing: border-box; color: rgb(44, 62, 80); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, &quot;Liberation Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: 0.32px; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(240, 240, 240); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"></iframe>



上面是 b 站大佬 [**说数人**](https://space.bilibili.com/418025703) 制作的动画，演示了基数排序的工作原理

```java
public static void radix_sort(int[] array) {
    int[][] bucket = new int[10][array.length];
    int sub = 1;
    int border = 9;
    int[] p = new int[10];
    while (true) {
        boolean noMore = true;
        for (int i :array) {
            int pos = (i / sub) % 10;
            bucket[pos][p[pos]++] = i;
            if (i > border) noMore = false;
        }
        int n = 0;
        for (int i = 0; i < 10; i++) {
            int j = 0;
            while (p[i] > 0) {
                array[n++] = bucket[i][j++];
                --p[i];
            }
        }
        sub *= 10;
        border = 10 * sub - 1;
        if (noMore) break;
    }
}
```

若桶数为 R*，最大值为 B*，则需要进行 log*R**B* 轮排序。每轮排序进行 n* 次计算、插入。因此，时间复杂度是O*(*n*log*R**B*)

对随机数组 int[] array（array.length = 80000；array[i] ∊ [0, 107)）进行基数排序。
那个统计时间是：15 ms

### 5.4.8 堆排序

**堆排序：**利用 **堆** 数据结构而设计的一种排序算法。堆排序是一种选择排序，也是一种不稳定排序。

**堆** 是具有以下性质的二叉树：

- 大顶堆：每个节点的值都大于等于其子节点的值

  即，对于任意节点 $ arr[i]$都有 $arr[i] >=ge arr[2i + 1]$ 并且 $arr[i]>=arr[2i+2]$

- 小顶堆：每个节点的值都小于等于其子节点的值

  即，对于任意节点 $ arr[i]$都有$arr[i] <=ge arr[2i + 1]$ 并且 $arr[i]<=arr[2i+2]$

  ***——见 [[14.1.1 顺序存储二叉树\]](https://i-melody.github.io/2022/06/02/Java/入门阶段/14 树/#14-1-1-顺序存储二叉树)***

![image-20241218144036801](/notes-assets/Java/.assets/image-20241218144036801.png)

1. 将 待排序序列 构成一个 大顶堆（数组形式）

   从最后一个非叶节点开始，从左至右，从下至上进行调整。

   调整时如果乱序，则将子节点中较大方的值与该节点交换即可。交换后，那些子节点乱序的场合也要依次调整。

   调整完成后，就得到了一个 大顶堆。

2. 此时，堆顶元素即整个序列的最大值。将其 与队列末尾元素交换。

3. 对剩余元素进行调整，使其恢复成 大顶堆。

4. 重复上述步骤，就得到了有序序列。

<iframe src="https://player.bilibili.com/player.html?aid=641228181&amp;bvid=BV1CY4y1t7TZ&amp;cid=588764772&amp;page=11&amp;autoplay=0" width="400" height="300" name="ttttar" style="box-sizing: border-box; color: rgb(44, 62, 80); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, &quot;Liberation Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: 0.32px; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(240, 240, 240); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"></iframe>



| [什么是堆](https://player.bilibili.com/player.html?aid=641228181&bvid=BV1CY4y1t7TZ&cid=588764006&page=8&autoplay=0) | [生成大顶堆](https://player.bilibili.com/player.html?aid=641228181&bvid=BV1CY4y1t7TZ&cid=588764284&page=9&autoplay=0) | [维护大顶堆](https://player.bilibili.com/player.html?aid=641228181&bvid=BV1CY4y1t7TZ&cid=588764425&page=10&autoplay=0) | [堆排序](https://player.bilibili.com/player.html?aid=641228181&bvid=BV1CY4y1t7TZ&cid=588764772&page=11&autoplay=0) |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
|                                                              |                                                              |                                                              |                                                              |

上面是 b 站大佬 [**说数人**](https://space.bilibili.com/418025703) 制作的动画，演示了堆排序的工作原理

```java
public static void heap_sort(int[] array) {
    int len = array.length;
    for (int j = array.length / 2 + 1; j >= 0; j--) {
        heap_help(array, j, len);
    }
    heap_swap(array, --len);
    while (len > 1) {
        int tar = len;
        while (tar > 0) {
            tar = (tar - 1) / 2;
            heap_help(array, tar, len);
        }
        heap_swap(array, --len);
    }
}

private static void heap_help(int[] array, int tar, int length) {
    int temp = array[tar];
    for (int i = tar * 2 + 1; i < length; i = i * 2 + 1) {
        if (i < length - 1 && array[i] < array[i + 1]) i++;
        if (array[i] > temp) {
            array[tar] = array[i];
            tar = i;
        } else {
            break;
        }
    }
    array[tar] = temp;
}

private static void heap_swap(int[] array, int index) {
    int temp = array[0];
    array[0] = array[index];
    array[index] = temp;
}
```

构建堆时，若有 n* 个元素，即进行 n* 次整理。每次整理最多进行log2*n* 次比较 。之后，每次取出堆顶元素后，需进行一次整理。故时间复杂度是 O*(*n*log*n*)

对随机数组 int[] array（array.length = 80000；array[i] ∊ [0, 107)）进行堆排序。
那个统计时间是：16 ms






































