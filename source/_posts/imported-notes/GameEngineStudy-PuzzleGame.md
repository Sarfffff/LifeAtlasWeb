---
title: PuzzleGame
date: 2026-06-27 03:40:00
categories:
  - 图形与引擎
tags:
  - GameEngineStudy
  - 笔记
---
**BUG ：生成数字的颜色不一致，无法正确区分答案的颜色和题目数字的颜色**

# SudoKu（数独）

## 🎯 核心任务

- [x] 数独游戏基础逻辑实现

1.数独游戏的算法实现，回溯法实现数独，不继承MonoBehavior，使用静态方法创建。因为数独的逻辑判定是纯数据逻辑，与GameObject无关，不依赖于游戏对象。

核心思想：关于数独算法的实现，使用回溯法去实现，所有可能的候选解，并在发现当前选择无法导致最终解时进行回溯，撤销上一步的选择并尝试其他可能性。在数独求解中，该算法从第一个空白格子开始，依次尝试填入数字1到9，并通过递归处理后续的空格。如果某个数字的填入导致后续无法合法填充，算法会回溯到上一个空格，尝试其他数字，直到找到解或确定无解。

算法详解：

- 遍历数独数组，寻找值为0（表示空白）的单元格。对于找到的空白值，尝试找到从 1 - 9的每个值，在填入数字前，使用`IsValid`方法检查该数字在当

前行、当前列以及所在的3x3子网格中是否已经存在。如果存在重复，则尝试下一个数字。（**遍历指定行，确保没有重复数字，遍历指定列，确保没有重复数字，计算当前单元格所在的3x3子网格的起始位置，然后遍历该子网格内的所有单元格，检查是否有重复数字**）。如果该数字有效，使用BackTrack方法处理下一个空白单元格。如果在递归过程中发现当前数字的填入导致后续无解，则将当前单元格重置为0（`EMPTY_CELL`），并尝试下一个数字。如果所有数字（1-9）都尝试过后仍无法找到解，则方法返回`false`，触发上一层的回溯，当算法处理完所有单元格（即`row`达到`BOARD_SIZE`）时，意味着找到了一个有效解，返回`true`。

- 唯一解检测：首先遍历数独板，找到第一个空白单元格，对于找到的空白格，尝试填入数字1到9。每当填入一个有效数字后，就递归调用HasUniqueSolution本身来检查剩余的空格能否形成有效解。每次递归调用成功（即找到一种解）时，解的数量`solutionCount`增加1，无论递归调用结果如何，在尝试下一个数字前，都必须将当前单元格重置为`EMPTY_CELL`，以确保不会影响后续的尝试。最后，如果解的数量`solutionCount`恰好为1，则返回`true`，表示有唯一解；否则返回`false`

**Solve类**

```C#
public class Solve//不继承MonoBehaviour
{
    public const int BOARD_SIZE = 9; //数独的边长 9*9
    public const int SUBGRID_SIZE = 3;//每个子网格的边长 3*3
    public const int EMPTY_CELL = 0;//空白单元格的值
    
     //传入一个未解的数独，返回一个解的数独

    public static int[,] SolveSudoku(int[,] unSolvedBoard){  //未解数独
        int[,] solvedBoard = new int[BOARD_SIZE, BOARD_SIZE];  // 解数独的结果

        Array.Copy(solvedBoard, unSolvedBoard, unSolvedBoard.Length); // 将未解数独复制到解数独
        
        //求解方法回溯法，传入解数独和当前行列
        BackTrack(solvedBoard, 0, 0);
        return solvedBoard;

    }


    public static bool BackTrack(int[,] board, int row, int col){

        if(row == BOARD_SIZE)//如果已经到了最后一行，则返回true
            return true;

        if(col == BOARD_SIZE)//如果已经到了最后一列，则转到下一行
            BackTrack(board, row + 1, 0);
        
        if(board[row, col] != 0)//如果当前单元格不为空(当前列已经填完了)，则转到下一列
            return BackTrack(board, row, col + 1);
        
        for(int i = 1; i <= BOARD_SIZE; i++){  
            if(IsValid(board, row, col, i)){  //如果当前单元格填入i后，数独是有效的，则填入i，并转到下一列
                board[row, col] = i;

                if(BackTrack(board, row, col + 1))
                    return true;

                board[row, col + 1] = 0;//如果当前单元格填入i后，数独不是有效的，则填入0，并转到下一列
            }
        }
        
        return false;
    }

    //循环遍历整个数组，判断数组是否存在唯一解
    public static bool HasUniqueSolution(int[,] board){
        int solutionCount = 0;
        int row = -1;
        int col = -1;

        //用于找到未填入的单元格，并存储到row和col中，判断数组是否存在唯一解
        for(int r = 0; r < BOARD_SIZE; r++){
            for(int c = 0; c < BOARD_SIZE; c++){
                if(board[r, c] == EMPTY_CELL){   //判断数组是否存在空单元格，如果存在，说明数组还未填完，则将当前单元格的行列存储到row和col中，并跳出循环
                    row = r;
                    col = c;
                    break;
                }
            }
            if(row != -1)//
                break;
        }

        if(row == -1) //数组没有空白单元格，说明数组存在唯一解，则返回true
            return true;

        //对于找到的空白格，尝试填入1-9，判断是否有唯一解
        for(int i = 1; i <= BOARD_SIZE; i++){
            if(IsValid(board, row, col, i)){  //如果当前单元格填入i后，数独是有效的
                board[row, col] = i;          //则填入i

                if(HasUniqueSolution(board))  //当前空白格填入，递归找到下一个空白格
                    solutionCount++;

                board[row, col] = EMPTY_CELL;//无论递归调用结果如何，之后都会进行回溯：
                //将当前单元格重置为EMPTY_CELL，以尝试下一个可能的数字i
            }
        }
        return solutionCount == 1;  //如果尝试填入1-9后，数独只有一个解，则返回true，否则返回false
    }
    
    //判断当前单元格填入val后，数独是否有效。
    //每行不能有重复的数字，每列不能有重复的数字，每个子网格不能有重复的数字。 
    public static bool IsValid(int[,] board, int row, int col, int val){
        
        for(int i = 0; i < BOARD_SIZE; i++){//遍历当前行，判断是否有重复的数字

            if(board[row, i] == val)  //如果当前行中的已经存在val，则返回false
                return false;
        }   
        for(int i = 0; i < BOARD_SIZE; i++){//遍历当前列，判断是否有重复的数字

            if(board[i, col] == val)  //如果当前列中的已经存在val，则返回false
                return false;
        }

        //计算当前子网格的行列,用于判断每个子网格中是否有重复的数字 
        int subgridRow = row / SUBGRID_SIZE * SUBGRID_SIZE; //第几个子网格的行数
        int subgridCol = col / SUBGRID_SIZE * SUBGRID_SIZE; //第几个子网格的列数

        for(int r = subgridRow; r < subgridRow + SUBGRID_SIZE; r++){
            for(int c = subgridCol; c < subgridCol + SUBGRID_SIZE; c++){
                if(board[r, c] == val)
                    return false;
            }
        }
    return true;
    }
}
```

**GeneratorSudoku**

1. **生成完整数独（`InitBoard`和 `FillGrid`方法）**：
   - **初始化第一行**：使用 `Shuffle`方法随机排列数字1-9，并填入数独板的第一行。
   - **回溯填充剩余部分**：从第二行第一列（索引 [1, 0]）开始，调用 `FillGrid`方法。该方法为每个空白单元格（初始时除第一行外均为空）随机尝试数字1-9（使用 `Shuffle`打乱尝试顺序），并通过 `IsValid`方法检查其有效性（即行、列、3x3宫内无重复）。如果数字有效则填入，并递归地填充下一个单元格。如果后续填充失败（`FillGrid`返回 `false`），则回溯，将当前单元格重置为 `EMPTY_CELL`(0)，并尝试下一个候选数字。当成功填充完所有单元格（`row`达到 `BOARD_SIZE`）时，返回 `true`，表示生成了一个完整的有效数独。
2. **按难度挖空（`RemoveSquares`方法）**：
   - **确定挖空数量**：根据传入的 `Difficulty`枚举（Easy, Medium, Hard），使用 `Random.Range`在特定范围内随机确定要移除的数字数量 `squareToRemove`。
   - **随机选择并安全移除**：在一个 `while`循环中，随机选择一个非空单元格，临时保存其值后将其设为 `EMPTY_CELL`。然后调用 `Solve.HasUniqueSolution`（此处 `Solve`类未提供，但应是判断唯一解的关键）来检查移除该数字后，整个数独板是否仍然有且只有一个解。
   - **确认移除或回溯**：如果仍有唯一解，则确认此次移除，并减少 `squareToRemove`计数。如果导致多解，则将该单元格的值恢复（回溯），继续尝试移除其他单元格，直到移除足够数量的数字。
3. **有效性验证（`IsValid`方法）**：
   - 检查目标单元格所在**行**、**列**以及**3x3子网格（宫）**中是否已存在待填入的数字 `val`。这通过遍历行、列，以及计算当前单元格所在宫的起始位置（`subgridRow = row / SUBGRID_SIZE * SUBGRID_SIZE`, `subgridCol = col / SUBGRID_SIZE * SUBGRID_SIZE`）并遍历该宫来实现。只要在任何一处发现 `val`已存在，则返回 `false`，否则返回 `true`。
4. **辅助方法（`Shuffle`方法）**：
   - 使用 **Fisher-Yates** 洗牌算法随机打乱给定泛型列表 `List<T>`的元素顺序。这用于为第一行生成随机排列，以及为回溯填充过程提供随机的数字尝试顺序，增加生成数独的随机性。该算法遍历列表，每次循环中随机选择一个元素（索引 `k`）与当前未处理部分的最后一个元素交换

```C#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GeneratorSudoku 
{
    public enum Difficulty  //数组难度
    {
        Easy,
        Medium,
        Hard
    }
    private const int BOARD_SIZE = 9; //数独的边长 9*9
    private const int SUBGRID_SIZE = 3; //每个子网格的边长 3*3
    private const int MIN_SQUARE_COUNT = 30; //最少方格数
    private const int MAX_SQUARE_COUNT = 50; //最多方格数
    private const int EMPTY_CELL = 0; //空白单元格的值

/// <summary>
/// 生成数独
/// </summary>
/// <param name="difficulty"> 传入枚举难度，根据难度生成数独</param>
/// <returns></returns>
    public static int[,] GenerateSudoku(Difficulty difficulty){
        int[,] grid = new int[BOARD_SIZE,BOARD_SIZE];
        int squareToRemove = 0;
        switch(difficulty){
            case Difficulty.Easy:
                squareToRemove = Random.Range(MIN_SQUARE_COUNT, MAX_SQUARE_COUNT + 5);
                break;
            case Difficulty.Medium:
                squareToRemove = Random.Range(MIN_SQUARE_COUNT + 5, MIN_SQUARE_COUNT + 10);
                break;
            case Difficulty.Hard:
                squareToRemove = Random.Range(MIN_SQUARE_COUNT + 10, MAX_SQUARE_COUNT);
                break;
        }
        InitBoard(grid);
        RemoveSquares(grid, squareToRemove);
        return grid;
    }

/// <summary>
/// 初始化数独，随机生成一个数独
/// </summary>
/// <param name="grid"></param>
    public static void InitBoard(int[,] grid){
        List<int> number = new List<int>{1,2,3,4,5,6,7,8,9};
        Shuffle(number);
        for(int i = 0;i < BOARD_SIZE;i++){ //第一行填入随机生成的数
            grid[0,i] = number[i];
        }
        FillGrid(grid, 1, 0); //从第二行开始，填入随机生成的数
    }


/// <summary>
/// 填入数独，从第二行开始，填入随机生成的数
/// </summary>
/// <param name="grid"></param>
/// <param name="row"></param>
/// <param name="col"></param>
/// <returns></returns>
    public static bool FillGrid(int[,] grid, int row, int col){

        if(row == BOARD_SIZE){
            return true;	
        }
        if(col == BOARD_SIZE){
            return FillGrid(grid, row + 1, 0);
        }

        List<int> number = new List<int>{1,2,3,4,5,6,7,8,9};
        Shuffle(number);
        foreach(int num in number){  //从1-9中随机选择一个数，判断是否有效
            if(IsValid(grid, row, col, num)){ 
                grid[row,col] = num;
                if(FillGrid(grid, row, col + 1)){  //如果填入num后，数独是有效的，则填入num，并转到下一列
                    return true;
                }

            }
        }
        grid[row,col] = EMPTY_CELL;
        return false;
    }

/// <summary>
/// 根据难度，随机删除数独中的方格
/// </summary>
/// <param name="grid"></param>
/// <param name="squareToRemove"></param>
    public static void RemoveSquares(int[,] grid, int squareToRemove){
        while(squareToRemove > 0){
            int row = Random.Range(0, BOARD_SIZE);
            int col = Random.Range(0, BOARD_SIZE);

            if(grid[row,col] != EMPTY_CELL){//随机得到一个方格，判断是否可以删除

                int temp = grid[row,col];
                grid[row,col] = EMPTY_CELL;
                if(Solve.HasUniqueSolution(grid)){//如果删除后，数独有唯一解，则删除该方格（删除没有问题）
                    squareToRemove--;
                }
                else{
                    grid[row,col] = temp;  //如果删除后，数独有多个解，则不删除该方格（删除有误）
                }
            }
            
        }
    }




/// <summary>
/// 判断当前单元格填入val后，数独是否有效。
/// 每行不能有重复的数字，每列不能有重复的数字，每个子网格不能有重复的数字。 
/// </summary>
/// <param name="board"></param>
/// <param name="row"></param>
/// <param name="col"></param>
/// <param name="val"></param>
/// <returns></returns>
    public static bool IsValid(int[,] board,int row,int col,int val){
        for(int i = 0;i < BOARD_SIZE;i++){
            if(board[row,i] == val)
                return false;
        }
        for(int i = 0;i < BOARD_SIZE;i++){
            if(board[i,col] == val)
                return false;
        }
        int subgridRow = row / SUBGRID_SIZE * SUBGRID_SIZE;
        int subgridCol = col / SUBGRID_SIZE * SUBGRID_SIZE;
        for(int r = subgridRow;r < subgridRow + SUBGRID_SIZE;r++){
            for(int c = subgridCol;c < subgridCol + SUBGRID_SIZE;c++){
                if(board[r,c] == val)
                    return false;
            }
        }
        return true;
    }


    /// <summary>
    /// 洗牌算法，从列表中随机选择一个元素，并将其与列表中的最后一个元素交换
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="list"></param>
    public static void Shuffle<T>(List<T> list){
        int n = list.Count;  
        while(n > 1){  //当列表的长度大于1时，打乱列表中的元素
            int k = Random.Range(0, n);  //随机一个索引
            T temp = list[n - 1];  
            list[n - 1] = list[k];  
            list[k] = temp;  
            n--;
        }
    }
}

```

**Cell类**

**核心属性与状态管理**

- **位置信息**：`row`和 `col`记录单元格在数独网格中的位置。
- **数值与状态**：`value`存储单元格的数字，`IsLocked`标识单元格是否可编辑（通常题目给定的数字会被锁定），`IsCorrect`标识玩家输入的数字是否正确。
- **视觉组件**：通过 SerializeField 私有的 `_BgSprite`(SpriteRenderer) 和 `_valueText`(TMP_Text) 分别控制单元格的背景和数字显示。

这些状态在 `Init(int value)`方法中进行初始化。该方法根据传入的 `value`设置单元格的初始状态：若值为 0，则单元格为空白、未锁定且可编辑；若值非 0，则单元格被锁定，显示给定的数字，玩家无法修改

**多层次的颜色反馈系统**

- **基础颜色 (Basic Colors)**：定义了单元格初始状态的颜色，包括解锁状态（空白格）和锁定状态（题目给定数字）的背景色与文字色。
- **高亮颜色 (Highlight Colors)**：用于提示用户当前操作相关的单元格（如相同数字、同行列等），区分了锁定格、解锁格、正确输入和错误输入的不同高亮效果。
- **选中颜色 (Selected Colors)**：当单元格被玩家直接选中时使用的特定颜色，同样区分了正确和错误的状态。
- **重置颜色 (Reset Colors)**：用于将单元格视觉状态重置到其当前逻辑状态对应的颜色。

这种多层次的颜色系统极大地增强了游戏的交互性和可玩性，让玩家能够清晰地掌握游戏状态。

**状态控制与视觉更新方法**

该类提供了多个公共方法来改变单元格的状态并同步更新其视觉表现：

- `SetHighlight()`: 根据单元格的锁定状态和答案正确性，应用不同的高亮颜色组合。这对于提示玩家非常有用，例如高亮所有相同数字或冲突数字。
- `SetSelected()`: 当单元格被玩家选中时调用，使用特定的选中颜色，使其从界面中凸显出来。
- `Reset()`: 将单元格的视觉外观重置为其当前逻辑状态（锁定/解锁，正确/错误）所对应的“基础”颜色，通常在高亮或选中状态结束后调用。
- `updateValue(int value)`: 这是玩家与单元格交互的核心方法。它首先检查单元格是否被锁定（题目给定数字不可修改）。然后更新单元格的值和显示文本。最后，根据新值更新视觉状态：如果值为 0（清空），则恢复为未锁定的基础状态；如果输入了数字，则使用特定的颜色（代码中注释表明意图是使用不同颜色区分，但当前实现仍使用了锁定状态的颜色，这可能需要根据实际需求调整）。
- `updateWin()`: 一个特殊的方法，可能在游戏胜利时被调用，将单元格设置为统一的胜利状态颜色。

**GameManager类**

**游戏初始化与棋盘生成 (Start 和 GenerateBoard 方法)**

- **Start()**: 游戏入口点，初始化游戏状态（`hasGameFinished = false`），创建 9x9 单元格数组，并调用 `GenerateBoard()`生成游戏界面。
- **GenerateBoard()**: 核心初始化方法。从 PlayerPrefs 读取或创建新关卡数据，计算 9 个子网格的精确位置（基于 `_StartPos`和偏移量），实例化子网格预制体。为每个单元格设置正确的行列坐标和初始值，并建立完整的单元格引用矩阵 `_cells[,]`。



**用户交互处理 (Update 和 UpdateValue 方法)**

- **Update()**: 每帧检测鼠标点击。通过射线检测获取点击的单元格，校验是否可操作（非锁定状态），然后设置选中状态并触发高亮效果。
- **UpdateValue(int value)**: 处理数字输入。更新选中单元格的值，触发高亮效果，并立即检查游戏是否胜利。



**游戏状态验证与胜利检测 (CheckWin 和 IsValid 方法)**

- **CheckWin()**: 胜利条件检测。遍历所有单元格，要求每个单元格都有非零值且通过 `IsValid`验证（`IsCorrect = true`）。胜利后触发胜利视觉效果并安排进入下一关。
- **IsValid(Cell cell, Cell[,] cells)**: 数独规则验证器。检查指定单元格的值在行、列和 3x3 宫格内是否重复。采用临时清空策略避免自比较问题。



**视觉反馈系统 (Highlight 和 ResetGrid 方法)**

- **Highlight()**: 多层次高亮系统。首先设置所有单元格的正确性状态，然后高亮当前选中单元格的关联区域（同行、同列、同宫格），最后对选中单元格应用特殊选中效果。
- **ResetGrid()**: 重置所有单元格的视觉状态到基础外观，清除之前的高亮和选中效果。

关卡管理与持久化 (CreatAndStoreLevel 和 GetCurrentLevel 方法)

- **CreatAndStoreLevel(int[,] board, int level)**: 关卡生成器。根据难度级别生成数独题目，将棋盘数据转换为字符串格式，并使用 PlayerPrefs 进行持久化存储。
- **GetCurrentLevel(int[,] board)**: 关卡加载器。从 PlayerPrefs 读取存储的关卡数据，解析字符串并填充到棋盘数组中。

```C#
using UnityEngine;
using TMPro;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
public class GameManager : MonoBehaviour
{
    [Header("Board Settings")]
    [SerializeField ] private Vector3 _StartPos;//什么位置开始
    [SerializeField ] private float _offsetX,_offsetY;//偏移量
    [SerializeField ] private SubGrid _subGridPrefab;//子网格预制体
    [SerializeField ] private TMP_Text _LevelText;//关卡文本


    private bool hasGameFinished;//是否游戏结束
    private Cell[,] _cells;//所有单元格
    private Cell selectedCell;//选中的单元格

    private const int BOARD_SIZE = 9;
    private const int SUBGRID_SIZE = 3;
     
    public void Start(){
        hasGameFinished = false;
        _cells = new Cell[BOARD_SIZE, BOARD_SIZE];
        selectedCell = null;
        
        
        GenerateBoard();
        //初始化网格，设置高亮状态
        ResetGrid();
    }
    
    public void GenerateBoard(){

        int[,] board = new int[BOARD_SIZE, BOARD_SIZE];
        int level = PlayerPrefs.GetInt("Level", 0);  //持久化
        if(level == 0){
            CreatAndStoreLevel(board,1); //创建并存储关卡
            level = 1;
        }
        else{
            GetCurrentLevel(board);//获取当前关卡
        }
        _LevelText.text = "Level: " + level.ToString(); //在UI显示当前关卡


        for(int i = 0; i < BOARD_SIZE; i++){
            //计算每个单元格的位置 
            Vector3 pos = _StartPos + i % 3 * _offsetX * Vector3.right + i / 3 * _offsetY * Vector3.up;   
            SubGrid subGrid = Instantiate(_subGridPrefab, pos, Quaternion.identity);//实例化子网格

            List<Cell> subGridCells = subGrid._cells;//将实例化的子网格的cells赋值给cells

            int startRow = i / 3 * SUBGRID_SIZE;//第几个子网格的行数
            int startCol = i % 3 * SUBGRID_SIZE;//第几个子网格的列数

            for(int j = 0; j < BOARD_SIZE; j++){
                subGridCells[j].row = startRow + j / 3;
                subGridCells[j].col = startCol + j % 3;

                int cellValue = board[startRow + j / 3, startCol + j % 3];//第几个子网格的值
                subGridCells[j].Init(cellValue);

                _cells[subGridCells[j].row, subGridCells[j].col] = subGridCells[j];//将第几个子网格的值赋值给cells
            }     
        }
    }
    public void Update()
    {
        if(hasGameFinished || !Input.GetMouseButtonDown(0))//如果游戏结束或没有点击鼠标，则返回
            return;
        //获取鼠标位置
        Vector3 mousePos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        //将鼠标位置转换为2D位置
        Vector2 mousePos2D = new Vector2(mousePos.x, mousePos.y);
        //射线检测
        RaycastHit2D hit = Physics2D.Raycast(mousePos2D, Vector2.zero);
        //获取射线检测到的单元格
        Cell tempCell;
        //如果射线检测到的单元格不为空，并且单元格不为空，并且单元格不为锁定
        if(!(hit && hit.collider.TryGetComponent(out tempCell) && tempCell != selectedCell && !tempCell.IsLocked))
        {
            return;
        }
        else{
            ResetGrid();//设置选中状态
            selectedCell = tempCell;//选中单元格        
            Highlight();//设置高亮状态
        }
    }
    /// <summary>
    /// 更新单元格的值
    /// </summary>
    /// <param name="value"></param>
    public void UpdateValue(int value){
        if(hasGameFinished || selectedCell == null)
            return;
        selectedCell.updateValue(value);//调用cell的updateValue方法（其他类），更新单元格的值
        Highlight();//调用Highlight方法，设置高亮状态
        CheckWin();
    }
    /// <summary>
    /// 检查是否游戏胜利
    /// </summary>
    private void CheckWin(){
        //遍历每一个单元格，如果单元格的值为0或IsCorrect为true，则返回，未完成游戏
        for(int i = 0; i < BOARD_SIZE; i++){
            for(int j = 0; j < BOARD_SIZE; j++){
                if(_cells[i,j].IsCorrect||_cells[i,j].value == 0)
                    return;
            }
        }
        //上述循环遍历完了，代表游戏胜利
        hasGameFinished = true;
        //遍历每一个单元格，调用cell的updateWin方法（其他类），更新单元格的胜利状态
        for(int i = 0; i < BOARD_SIZE; i++){
            for(int j = 0; j < BOARD_SIZE; j++){
                _cells[i,j].updateWin();//调用cell的updateWin方法（其他类），更新单元格的胜利状态
            }
        }
        Invoke("ToNextLevel", 2f);
    }
    /// <summary>
    /// 重置网格,遍历每一个单元格，重置单元格，包括颜色和文字
    /// </summary>
    public void ResetGrid(){
       for(int i = 0; i < BOARD_SIZE; i++){
            for(int j = 0; j < BOARD_SIZE; j++){
                _cells[i,j].Reset();
            }
       }
    }
    /// <summary>
    /// 设置高亮状态,遍历每一个单元格，判断单元格是否正确
    /// </summary>
    private void Highlight(){
        for(int i = 0; i < BOARD_SIZE; i++){
            for(int j = 0; j < BOARD_SIZE; j++){
                _cells[i,j].IsCorrect = !IsValid(_cells[i,j],_cells);
                //如果单元格的值正确，则IsCorrect为true，否则为false
            }
        }
        //找到选中的单元格的行列和子网格的行列
        int currentRow = selectedCell.row;
        int currentCol = selectedCell.col;
        int subGridRow = currentRow / SUBGRID_SIZE * SUBGRID_SIZE;
        int subGridCol = currentCol / SUBGRID_SIZE * SUBGRID_SIZE;

        //遍历当前选中格的所在的行列，以及子网格全部设置为高亮状态   
        for(int i = 0; i < BOARD_SIZE; i++){
            _cells[i,currentCol].SetHighlight();
            _cells[currentRow,i].SetHighlight();
            _cells[subGridRow + i % 3,subGridCol + i / 3].SetHighlight();
        }
       
        _cells[currentRow,currentCol].SetSelected();//将选中的单元格设置为选中状态
    }
/// <summary>
/// 判断单元的值是否正确有效，每行不能有重复的数字，每列不能有重复的数字，每个子网格不能有重复的数字。
/// 比较传入的cell的值与数组中的其他单元格的值是否重复
/// </summary>
/// <param name="cell"> 传入的选中的单元格的行列和值 </param>
/// <param name="cells"> 传入的数组，用于判断单元格是否正确 </param>
/// <returns></returns>
    private bool IsValid(Cell cell,Cell[,] cells){
        //得到传入的单元格的行列和值
        int row = cell.row;
        int col = cell.col;
        int value = cell.value;

        cell.value = 0; //将单元格的值设置为0，用于判断单元格是否正确

        if(value == 0)
            return true;

        for(int i = 0; i < BOARD_SIZE; i++){
            if(cells[row,i].value == value)return false; //每行，每列不允许重复数字
            if(cells[i,col].value == value)return false;
        }
        
        //得到传入的单元格的子网格的行列，判断是否重复，每个小SubGrid
        int subgridRow = row / SUBGRID_SIZE * SUBGRID_SIZE;
        int subgridCol = col / SUBGRID_SIZE * SUBGRID_SIZE;

        for(int i = subgridRow; i < subgridRow + SUBGRID_SIZE; i++){
            for(int j = subgridCol; j < subgridCol + SUBGRID_SIZE; j++){
                if(cells[i,j].value == value)return false;
            }
        }

        cell.value = value; //将单元格的值设置为原来的值
        return true;
    }



    // 重新开始游戏
    public void Restart(){
       SceneManager.LoadScene(0);//就只有一个场景，所以直接加载0
    }

    // 下一关
    public void CreatAndStoreLevel(int[,] board,int level){
        //根据关卡level生成不同难度的数独（创建一个数独）
        int[,] tempBoard = GeneratorSudoku.GenerateSudoku((GeneratorSudoku.Difficulty)(level / 100));
        string arrayString = "";
        //将数独转换为字符串
        for(int i = 0; i < BOARD_SIZE; i++){
            for(int j = 0; j < BOARD_SIZE; j++){
                arrayString += tempBoard[i,j].ToString() + ",";//使用字符串将数独题目添加到字符串中
                board[i,j] = tempBoard[i,j];//将数独赋值给board，让玩家填写
            }
            
        }
        arrayString = arrayString.TrimEnd(',');//去掉字符串末尾的逗号
        //存储关卡和数独到PlayerPrefs
        PlayerPrefs.SetInt("Level", level);
        PlayerPrefs.SetString("grid" ,arrayString);
    }
    public void GetCurrentLevel(int[,] board){
        //获取关卡和数独从PlayerPrefs
        string arrayString = PlayerPrefs.GetString("grid");
        //将字符串转换为数组
        string[] arrayValue = arrayString.Split(',');
        int index = 0;

        for(int i = 0; i < BOARD_SIZE; i++){
            for(int j = 0; j < BOARD_SIZE; j++){
                board[i,j] = int.Parse(arrayValue[index]);
                //因为值存储在字符串中，所以需要转换为int，并且需要创建一个索引来移动字符串的下标
                index++;
            }
        }
    }
    public void ToNextLevel(){
        int level = PlayerPrefs.GetInt("Level", 0);
        CreatAndStoreLevel(new int[BOARD_SIZE, BOARD_SIZE],level + 1);//创建并存储下一关
        Restart();

    }
}



```

**SubGrid类**

```C#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SubGrid : MonoBehaviour
{
    [SerializeField] public List<Cell> _cells;
}

```

# Solitaire（纸牌游戏）

## 游戏的基础数据结构

```C#
namespace SolitaireGame
{
    //扑克牌花色    
    public enum Suit{
		Hearts,    // 红心 - 红色
        Diamonds,  // 方块 - 红色  
        Clubs,     // 梅花 - 黑色
        Spades     // 黑桃 - 黑色
    }
    //扑克牌的点数
	public enum Rank{
        Ace = 1, Two, Three, Four, Five, Six, Seven, 
        Eight, Nine, Ten, Jack, Queen, King
    }
    //单张扑克牌类
    public class Card{
        public Suit Suit{get;set;}
        public Rank Rank{get;set;}
        public bool IsFaceUp { get; set; } // 是否正面朝上
        
    }
    public Card(Suit suit, Rank rank, bool isFaceUp = false)
    {
        Suit = suit;
        Rank = rank;
        IsFaceUp = isFaceUp;
    }
    public bool IsBlack(){
        if(Suit == Suit.Clubs||Suit == Suit.Spades)
        	return true;
    }
}
```



## 随机化洗牌算法

### 旧Fisher-Yates算法

| 步骤          | 牌堆数组 (Deck)         | 抽取卡牌数组 (Drawn Pile) | 操作描述                                                   |
| :------------ | :---------------------- | :------------------------ | :--------------------------------------------------------- |
| **初始状态**  | `[C1, C2, C3, ..., Cn]` | `[]`                      | 牌堆包含所有卡牌，抽取堆为空。                             |
| **第1次抽取** | `[C1, C3, ..., Cn]`     | `[C2]`                    | 从牌堆**随机移除**一张牌（如C2），**添加**到抽取堆。       |
| **第2次抽取** | `[C1, ..., Cn]`         | `[C2, Cx]`                | 从剩余牌堆随机移除一张新牌（如Cx），**追加**到抽取堆末尾。 |
| **... 重复**  | 逐渐变少                | 逐渐增多                  | 每次迭代都从剩余牌堆中随机抽取一张，移入抽取堆。           |
| **最终状态**  | `[]`                    | `[C2, Cx, ..., Cy]`       | 牌堆为空，所有卡牌以随机顺序转移至抽取堆，洗牌完成。       |

**随机性保证**：每次从剩余牌堆中**等概率**地随机选择一张牌，这保证了每种可能的排列顺序出现的概率是相等的。

**时间复杂度**：由于每次牌堆数组每次弹出卡牌的复杂度为O(n)，整个算法的时间复杂度为O(n²)。

```C#
class Program
{
    static List<string> DrawShuffle(List<string> deck)
    {
        List<string> drawnPile = new List<string>();
        Random random = new Random();
  		// 循环直到原牌堆为空
        while (deck.Count > 0)
        {
            // 随机选择一个索引
            int index = random.Next(0, deck.Count);
            // 将对应位置的牌取出并添加到抽取堆
            drawnPile.Add(deck[index]);
            deck.RemoveAt(index);
        }
        
        return drawnPile;
    }
    static void Main(){
        // 初始化一副牌
        List<string> originalDeck = new List<string>
        {
            "A♠", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", 
            "8♠", "9♠", "10♠", "J♠", "Q♠", "K♠"
        };
        
        // 执行洗牌（使用副本以避免修改原列表）
        List<string> shuffledDeck = DrawShuffle(new List<string>(originalDeck));
        
        // 输出洗牌结果
        Console.Write("洗牌结果: ");
        Console.WriteLine(string.Join(", ", shuffledDeck));
    }
} 
```

### 新Fisher-Yates算法

**后向遍历**：

从牌堆数组末尾开始往前遍历，设置一个变量`i`用于维护已洗牌和未洗牌区的边界，从n - 1开始，再未洗牌区设置一个随机索引`j`，交换数组第 `i`个元素和第 `j`个元素,此时`i` - 1,循环往复，直到`i`为0,代表洗牌完毕

| 步骤          | 变量 i (当前边界) | 变量 j (随机索引) | 牌堆数组状态（示例: [A, B, C, D, E]） | 操作描述                                               |
| :------------ | :---------------- | :---------------- | :------------------------------------ | :----------------------------------------------------- |
| **初始状态**  | `n - 1`(4)        | -                 | `[A, B, C, D, E]`                     | `i`指向数组末尾，划分整个数组为“未洗牌区”。            |
| **第1次循环** | 4                 | 随机生成 (如: 1)  | `[A, E, C, D, B]`                     | 交换 `i=4`(E) 和 `j=1`(B) 的元素。`i`减1。             |
| **第2次循环** | 3                 | 随机生成 (如: 0)  | `[D, E, C, A, B]`                     | 交换 `i=3`(此时是D) 和 `j=0`(A) 的元素。`i`减1。       |
| **第3次循环** | 2                 | 随机生成 (如: 2)  | `[D, E, C, A, B]`                     | 交换 `i=2`(C) 和 `j=2`(C) 的元素（自身交换）。`i`减1。 |
| **第4次循环** | 1                 | 随机生成 (如: 0)  | `[E, D, C, A, B]`                     | 交换 `i=1`(D) 和 `j=0`(E) 的元素。`i`减1。             |
| **循环结束**  | 0                 | -                 | `[E, D, C, A, B]`                     | `i`为0，循环终止，洗牌完成。                           |

**无偏性与高效性**：Fisher-Yates 算法能够等概率地生成所有可能的排列，确保洗牌的公平性。它的时间复杂度是 O(n)，空间复杂度是 O(1)（原地操作），效率非常高

**随机索引的范围**：这是实现中的关键。随机索引 `j`必须在 `[0, i]`的闭区间内选取。如果错误地选成了 `[0, n-1]`，会导致洗牌结果出现偏差。

```C#
using System;

public class FisherYatesShuffle
{
    // 使用静态Random实例以避免重复创建
    private static Random rng = new Random();

    public static void Shuffle<T>(T[] array)
    {
        // 参数检查
        if (array == null || array.Length <= 1)
            return;

        int n = array.Length;
        // 变量 i 从数组末尾开始，向前遍历到第二个元素（索引1）
        for (int i = n - 1; i > 0; i--)
        {
            // 在未洗牌区（索引0到i）中随机选择一个位置j
            int j = rng.Next(0, i + 1); // Random.Next(minValue, maxValue) 的上限是互斥的，所以需要 i+1

            // 交换数组第 i 个元素和第 j 个元素
            T temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            // 交换后，i 索引位置的元素进入“已洗牌区”，i 自减，边界前移
        }
        // 当 i 为 0 时，循环结束，洗牌完成
    }
}
class Program
{
    static void Main(string[] args)
    {
        // 模拟一副牌（这里用数字1-52代表）
        int[] deck = new int[52];
        for (int i = 0; i < deck.Length; i++)
        {
            deck[i] = i + 1;
        }

        Console.WriteLine("洗牌前: " + string.Join(", ", deck));
        FisherYatesShuffle.Shuffle(deck);
        Console.WriteLine("洗牌后: " + string.Join(", ", deck));
    }
}
```

## 发牌和牌面生成算法

**纸牌接龙**

```C#

```

