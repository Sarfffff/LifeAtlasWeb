---
title: 状态机
date: 2026-06-27 04:19:00
categories:
  - Unity/游戏客户端
tags:
  - Unity常见框架学习
  - 笔记
---
# 状态机

关于有限状态机，就是某一时刻只存在一种状态；满足条件时，切换其他状态，当前状态退出，进入新状态。一般用于游戏AI的处理，比如敌人NPC默认时巡逻状态，当发现玩家转变为追击状态，丢失玩家转变为巡逻状态，中间夹杂Idle状态。也可能会切换到攻击状态。

几个关键词：

- **State（状态）**：如 Idle、Run、Jump、Attack…
- **Transition（过渡）**：从一个状态切到另一个状态的“箭头”
- **Condition（条件）**：什么时候走这条箭头，比如速度>0、被击中、按下空格…
- **Parameter（参数）**：可以被脚本修改的值，用来驱动条件，比如 speed、isGround、HP…

对于一般的项目来说可以直接使用简单的条件判断来进行状态的切换。但是对于大型项目来说，使用接口或者类继承可以实现。

如下结构

```css
                   ┌─────────────────────────┐
                   │      StateMachine       │
                   │─────────────────────────│
                   │ + currentState : State  │
                   │─────────────────────────│
                   │ + InitState(State)      │
                   │ + ChangeState(State)    │
                   └───────────┬────────────┘
                               │
                               ▼
                ┌──────────────────────────┐
                │         State             │
                │──────────────────────────│
                │ animName : string        │
                │ player   : Player        │
                │ rb       : Rigidbody2D   │
                │ xInput, yInput : float   │
                │──────────────────────────│
                │ + OnEnter()              │
                │ + OnExit()               │
                │ + Update()               │
                └──────────┬──────────────┘
                           │ (继承)
           ┌───────────────┼────────────────────────┐
           │                                       │
           ▼                                       ▼
┌─────────────────────┐                  ┌─────────────────────┐
│     IdleState        │                  │     MoveState       │
│─────────────────────│                  │─────────────────────│
│ Update():            │                  │ Update():           │
│ if xInput ≠ 0        │                  │ SetVelocity();      │
│   → MoveState        │                  │ if xInput == 0      │
│                      │                  │   → IdleState       │
└─────────────────────┘                  └─────────────────────┘
```

```css
         ┌───────────────────┐
         │      Player       │
         │───────────────────│
         │ moveSpeed          │
         │ rb                 │
         │ anim               │
         │ idleState          │
         │ moveState          │
         │ stateMachine       │
         └───────────┬───────┘
                     │ 调用
                     ▼
     stateMachine.currentState.Update()
```

使用stateMachine来做为创建和管理状态枢纽，在该类中实现了初始化状态类，也就是游戏AI的初始状态，以及状态的切换方法。state则是所有状态的基类，每个类都继承该类，都可以重写父类的方法实现多态，同时都有相同的成员变量。其中Player类则是作为外部控制者，在player中持有一个 StateMachine 用来管理player的状态切换和初始化。以下是具体实现。

**StateMachine类**:创建和管理状态的切换和初始化，提供给所有状态一个公共的切换状态。

```C#
using UnityEngine;

class StateMachine
{
    public State currentState;
    public void InitState(State _startState){
		currentState = _startState;
    	
    }
    public void ChangeState(State _newState){
        currentState.Exit();
        currentState = _newState;
        currentState.Enter();
    }
}
```

**State类**：所有状态的基类，每个状态都继承该类。在该类中定义公有的属性，所有的子类都可以使用。如果有动画效果后，也是在该类中实现。

```C#
using UnityEngine;

class State:MonoBehavior
{
    //公共属性
    public StateMachine stateMachine;
    public Player player;
    public string animName;
    
    ////提供子类检测x方向的输入和输出
    protected float xInput;
    protected float yInput;
    protected Rigidbody2D rb;	
    
    public State(Player _player,StateMachine _stateMachine,string _animName){//初始化构造函数
        stateMachine = _stateMachine;
        animName = _animName;
        player = _player;
 	}
    public virtual void Enter(){
        player.anim.SetBool(animName,true);
    }
    public virtual void Exit(){
        player.anim.SetBool(animName,false);
    }
    public virtual void Update(){
        xInput = Input.GetAxisRaw("Horizontal");  //提供子类检测x方向输入
 		yInput = Input.GetAxisRaw("Vertical");    //提供子类检测y方向输入
    }
}
```

**Player类**：其他的类都是为他服务的，也都是它的状态

```C#
using UnityEngine;

class Player:MonoBehaviour
{
    #region 属性
    public float moveSpeed;
    #endregion

    #region 状态机以及组件 
    public Animator anim { get; private set; }
    public StateMachine stateMachine {  get; private set; }
    public State state {  get; private set; }
    public IdleState idleState { get; private set; }
    public MoveState MoveState { get; private set; }
    public Rigidbody2D rb;
    #endregion
    
    //实例化所有的状态和组件
    public void Awake(){
        stateMachine = new StateMachine();
        idleState = new IdleState(this,stateMachine,"Idle");
        MoveState = new MoveState(this,stateMachine,"Move");
        rb = GetComponent<Rigidbody2D>();
        anim = GetComponent<Animator>();
    }
    //定义初始化状态
    public void Start()
    {
        stateMachine.InitState(idleState);
    }
    //使用状态机进行切换
    public void Update()
    {
        stateMachine.currentState.Update();
    }
    //设置速度
    public void SetVelocity(float xVelocity,float yVelocity)
    {
        rb.velocity = new Vector2 (xVelocity,yVelocity);
    }
}
```

**IdleState类**：状态子类，player的一种状态

```C#
using UnityEngine;

class IdleState : State
{
    public IdleState(Player _player, StateMachine _stateMachine, string _animName) : base(_player, _stateMachine, _animName)
    {
    }

    public override void OnEnter()
    {
        base.OnEnter();
    }

    public override void OnExit()
    {
        base.OnExit();
    }

    public override void Update()
    {
        base.Update();
        if (xInput != 0)
            stateMachine.ChangeState(player.MoveState);
    }
}
```

**MoveState类**：状态子类，player的一种状态

```C#
using UnityEngine;

class MoveState : State
{

    public MoveState(Player _player, StateMachine _stateMachine, string _animName) : base(_player, _stateMachine, _animName)
    {

    }

    public override void OnEnter()
    {
        base.OnEnter();
    }

    public override void OnExit()
    {
        base.OnExit();
    }

    public override void Update()
    {
        base.Update();
        player.SetVelocity(xInput * player.moveSpeed,rb.velocity.y);
        if (xInput == 0)
            stateMachine.ChangeState(player.idleState);
    }
}
```

可扩展，创建不同的类都继承state，在类内部实现特有的方法和属性即可，如果有需要player的属性时，在player中定义属性即可。