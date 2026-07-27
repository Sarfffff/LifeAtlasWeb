---
title: 分治法
date: 2026-06-27 03:18:00
categories:
  - 算法与数据结构
tags:
  - Algorithm
  - 笔记
---
## 分治法

思想：分+治+分（将一个大规模的问题分成若干块小问题去求解，如果小问题也不好直接解决，则继续分成更小的问题）

![image-20241121181928484](/notes-assets/Algorithm/.assets/image-20241121181928484.png)



分治法：

​	(1)分治法产生的子问题是原问题的较小模式.
​	(2)反复应用分治手段，可以使子问题规模不断缩小，
​	(3)最终使子问题缩小到很容易直接求出其解。
​	(4)将规模较小问题的答案逐级向上合并，可得大问题答案

​	分治法解决问题通常使用递归算法
​	直接或间接地调用自身的算法称为递归算法，

##### 例题1：Fibonnacci数列

​		斐波那契数列Q(Fibonacclsequence)，又称“黄金分割”数列，比如这样一个数列:1，1，2，3，5，8，13，21，34，55，89....数列从第3项开始，每一项都等于前两项之和。递归定义为如下：

![image-20241121182747866](/notes-assets/Algorithm/.assets/image-20241121182747866.png)

```c++
int Fibonacci(int n){
    if(n<=1)
        return 1;
    else
        return Fibonacci(n-1) + Fibonacci(n-2);
}
```

##### 例题2：Ackerman函数

​		一个函数及它的一个变量是由函数自身定义时当称这个函数是双递归函数。
Ackerman函数A(n，m)定义如下：

![image-20241121183857110](/notes-assets/Algorithm/.assets/image-20241121183857110.png)

```c++
int Ackerman(int m,int n){
	if (m == 0)
		return n + 1;
	else if (m > 0 && n == 0)
		return ackermann(m - 1, 1);
	else // else if (m > 0 && n > 0)
		return ackermann(m - 1, ackermann(m, n - 1));
}
```

##### 例题3：排列问题

​	设计一个递归算法生成n个元素{r,r.…,rn}的全排列。设R={r,r.…rn}是要进行排列的n个元素，R;=R-{ri}。集合X中元素的全排列记为perm(X)。(r)perm(X)表示在全排列perm(X)的每一个排列前加上前缀得到的排列。R的全排列归纳定义如下：

当n=1时，perm(R)=(r)，其中r是集合R中唯一的元素
当n>1时，perm(R)由(r1)perm(R1),(r2)perm(R2),.,(rn)perm(Rn)构成。

例如：1 2 3全排列先把1放在首位，然后剩下的有两种情况，2或3放在第二位，剩下的那个数放在第三位，这样就遍历了所有1在首位的情况；然后同第一步，依次把2、3放在首位，求出剩余元素的排列情况；

```c++
void Perm(Type list[],int a,int b){//Type为模板类型的数组，接受int 等类型
//a代表头，b代表尾、
    if(a==b)//为真即表示剩余最后一个元素，此时输出排列情况
    {
        for(int i=0;i<=b;i++)
            cout<<List[i];
    }
    else
    { 	for(int i=a;i<=b;i++){
	 		swap(list[a],list[i]);//将当前范围内（从a到b）的第i个元素与第a个元素进行交换，这样就相当于把第i个元素放到了当前所有剩余元素的首位
    		Perm(list,a+1,b);//此时将起始索引更新为a + 1，表示接下来要对除了已经放在首位的那个元素之外的剩余元素（也就是索引从a + 1到b的元素）进行全排列操作，通过不断地递归调用，索引不断+1b会逐步深入到更小规模的剩余元素集合中去生成它们的全排列情况，层层嵌套构建出所有完整的全排列。
			swap(list[a],list[i]);//在完成一次递归调用（也就是完成了以当前交换后的顺序对剩余元素的全排列生成操作之后，执行swap(list[a],list[i])语句，把之前交换到首位的元素再交换回去，恢复到交换前的原始顺序
    	}
    }
}
```

##### 例题4：Hanoi塔问题

设a,b,c是3个塔座。要求由a移动到b。移动圆盘时遵守以下移动规则
规则1:每次只能移动1个圆盘;
规则2:任何时刻都不允许较大的圆盘压在较小的圆盘之上:
规则3:在满足移动规则1和2的前提下，可将圆盘移至a,b,c中任一塔座上，

![image-20241122145623939](/notes-assets/Algorithm/.assets/image-20241122145623939.png)

```c++
//将A柱的盘子移动到B柱
void Move(int a,int b){
    std::cout<<a"->"<<b<<std::endl;  //用于输出一个柱子到另一个柱子的操作
}
void Hanoi(int n ,int a,int b,int c){
    if(n==1)
        Move(a,b);
    else{
        Hanoi(n-1,a,c,b);
        Move(a,b);
        Hanoi(n-1,c,a,b);
        
	}  
}
```

##### 例题5：二分法查找

​	非递减序的n个元素a[0:n-1]，现要在这n个元素中找出一特定元素x。

分析:设在a[l:r]中找x，mid=(l+r)/2
（0）如果 x==a[mid]，则找到;
（1）如果x<a[mid]，则继续在a[i,mid-1]中找x即可
（2）如果x>a[mid]，则继续在a[mid+1,j]中找x即可子问题答案就是大问题的答案

![在这里插入图片描述](/notes-assets/Algorithm/.assets/20210606165954759.gif%23pic_center%23pic_center)

```c++
void binarySearch(Type List[],int n,int target){
	int left = 0;//最左边
	int right = n-1;//最右边
	int mid = (left + right)/2;
    while(left<=right){
		if(target==List[mid]){
            return mid;
        };
        else if(target<List[mid]){  //目标值小于中间值
            right = mid -1;
            
        }
        else {   //目标值大于中间值
            left = mid + 1;  
        }
    }
    return -1;//没有找到
}
//时间复杂性 O（logn）
```

##### 例题6：快速幂算法

![image-20241122153819454](/notes-assets/Algorithm/.assets/image-20241122153819454.png)

1、当指数是偶数时，我们可以让指数除以2，底数乘以底数
2、当指数是奇数时，我们可以将指数变为偶数

![image-20241122153810407](/notes-assets/Algorithm/.assets/image-20241122153810407.png)

```c++
//递归算法
int fastPower(int a, int b) {//a是底数，b是指数
    if (b == 0) {
        return 1;
    }
    if (b % 2 == 1) {	//指数是奇数
        return a * fastPower(a, b - 1);
    }
   // a^b 转化为 (a^(b / 2))^2
    int temp = fastPower(a, b / 2);  //先通过递归调用 fastPower 函数求出 a 的 b / 2 次幂（将其保存在变量 temp 中），然后返回 temp 的平方（temp * temp）     
    return temp * temp;
}
```

```c++
//非递归
int fastPower(int a, int b) {//a是底数，b是指数
    int result = 1;
    int base = a;
    while (b > 0) {
        // 判断当前指数的最低位是否为1（相当于b & 1操作）
        if (b % 2 == 1) {//指数为奇数
            result = (result * base) ;//额外乘以自身一次
        }
        base = (base * base) ;
        // 相当于右移一位（去除已经处理过的最低位），这里用整除2来模拟
        b /= 2;
    }
    return result;
}
```

##### 例题7：棋盘覆盖

​		给定一个大小为（为正整数）的棋盘，其中有一个方格被损坏（或特殊标记），要求用形的骨牌（由三个方格组成）覆盖剩下的所有方格。例如n = 2，当时，棋盘是一个的方阵。

​	解决思路：

- 对于的棋盘，我们可以将其划分为四个大小为的子棋盘。
- 那个特殊方格（被损坏的方格）必定落在这四个子棋盘中的一个。我们可以在没有特殊方格的子棋盘中放置一个形骨牌，使得这三个子棋盘都有一个 “特殊方格”（这个特殊方格是我们放置形骨牌后新产生的）。
- 然后，我们可以递归地对这四个子棋盘进行棋盘覆盖操作。

```c++
// 棋盘的大小（假设最大为2的幂次方大小，这里示例最大支持8x8，可根据需要调整）
const int MAX_SIZE = 8;
int board[MAX_SIZE][MAX_SIZE];
int tile = 0;  // 用于记录L形骨牌的编号

// 棋盘覆盖函数
void chessBoard(int tr, int tc, int dr, int dc, int size) { //初始化为（0，0，dr，dc，size）特殊方格自定义
    if (size == 1) return;  // 棋盘大小为1时，无需继续划分，直接返回

    int t = ++tile;
    int s = size / 2;

    // 处理左上角子棋盘
    if (dr < tr + s && dc < tc + s) {
        chessBoard(tr, tc, dr, dc, s);
    } else {
        // 如果特殊方格不在左上角子棋盘，在左上角子棋盘的右下角放置L形骨牌
        board[tr + s - 1][tc + s - 1] = t;
        chessBoard(tr, tc, tr + s - 1, tc + s - 1, s);
    }

    // 处理右上角子棋盘
    if (dr < tr + s && dc >= tc + s) {
        chessBoard(tr, tc + s, dr, dc, s);
    } else {
        // 如果特殊方格不在右上角子棋盘，在右上角子棋盘的左下角放置L形骨牌
        board[tr + s - 1][tc + s] = t;
        chessBoard(tr, tc + s, tr + s - 1, tc + s, s);
    }

    // 处理左下角子棋盘
    if (dr >= tr + s && dc < tc + s) {
        chessBoard(tr + s, tc, dr, dc, s);
    } else {
        // 如果特殊方格不在左下角子棋盘，在左下角子棋盘的右上角放置L形骨牌
        board[tr + s][tc + s - 1] = t;
        chessBoard(tr + s, tc, tr + s, tc + s - 1, s);
    }

    // 处理右下角子棋盘
    if (dr >= tr + s && dc >= tc + s) {
        chessBoard(tr + s, tc + s, dr, dc, s);
    } else {
        // 如果特殊方格不在右下角子棋盘，在右下角子棋盘的左上角放置L形骨牌
        board[tr + s][tc + s] = t;
        chessBoard(tr + s, tc + s, tr + s, tc + s, s);
    }
}
时间复杂度 O（n*n）
```

##### 例题8：排序算法  

- 归并排序的核心是分治策略。它将一个数组分成两个子数组，然后递归地对这两个子数组进行排序，最后将排好序的子数组合并成一个完整的排序数组。

![请添加图片描述](/notes-assets/Algorithm/.assets/fdc8887e8db44e3faa2799579ee50bf2.gif)

```c++
// 合并函数，将两个有序数组合并为一个有序数组
void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    int L[n1], R[n2];

    // 把原数组对应区间数据拷贝到临时数组L和R
    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;
    // 比较并合并临时数组元素到原数组
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }
    // 把剩余的L数组元素放入原数组
    while (i < n1) arr[k++] = L[i++];
    // 把剩余的R数组元素放入原数组
    while (j < n2) arr[k++] = R[j++];
}

// 归并排序主函数
void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        int mid = (left + right) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}
c
```

- 任取待排序元素序列中的某元素作为基准值，按照该排序码将待排序集合分割成两子序列，左子序列中所有元素均小于基准值，右子序列中所有元素均大于基准值，然后最左右子序列重复该过程，直到所有元素都排列在相应位置上为止。

![在这里插入图片描述](/notes-assets/Algorithm/.assets/304b584963e658f1cb3302ba46d58fa9.gif)

```c++
void QuickSort(int a[], int left, int right) {
    if (left >= right) {
        return;
    }
    int pivot = a[left];  // 定义基准元素，选取子数组最左边的元素
    int i = left, j = right;  // 使用i和j作为移动指针，等同于left和right，但让代码逻辑更清晰些
    while (i < j) {
        // 从右往左找小于等于基准元素的数来填坑
        while (i < j && a[j] >= pivot) {
            j--;
        }
        a[i] = a[j];
        // 从左往右找大于等于基准元素的数来填新坑
        while (i < j && a[i] <= pivot) {
            i++;
        }
        a[j] = a[i];
    }
    // 当i和j相遇时，将基准元素放入最终的坑位置
    a[i] = pivot;
    int pivotIndex = i;  // 获取基准元素的索引位置
    // 对基准元素左边的子数组进行快速排序
    QuickSort(a, left, pivotIndex - 1);
    // 对基准元素右边的子数组进行快速排序
    QuickSort(a, pivotIndex + 1, right);
}
//不稳定 平均时间复杂度 O（logn），最坏 O（n*n）
```


