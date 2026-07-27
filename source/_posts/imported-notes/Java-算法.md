---
title: 算法
date: 2026-06-27 03:58:00
categories:
  - 编程语言
tags:
  - Java
  - 笔记
---
杨辉三角

```java
import java.util.Scanner;

public class pro1 {
    public static void main(String[] args) {     
	Scanner myScan = new Scanner(System.in);
        int [][]arr = new int [10][];
        for(int i = 0;i < arr.length;i++){
            arr[i] = new int [i+1];
            for(int j = 0;j < arr[i].length;j++){
                if(j==0||j==arr[i].length - 1){
                    arr[i][j] = 1;
                }
                else{
                    arr[i][j] = arr[i-1][j]+arr[i-1][j-1];
                }
            }
        }
        for(int i = 0;i<arr.length;i++){
            for(int j =0;j<arr[i].length;j++){
                System.out.println(arr[i][j]);
            }
        }
    }
}
```

