---
title: SurviveShootGame
date: 2026-06-27 03:41:00
categories:
  - 图形与引擎
tags:
  - GameEngineStudy
  - 笔记
---
### 角色移动

通过RigidBody组件，Capsule Collider组件角色添加碰撞器以刚体组件，通过Player Movement脚本挂载到人物的模型上移动

```c#
using UnityEngine;

public class PlayerMovement : MonoBehaviour
{
    public float MoveSpeed = 6f;
    private Rigidbody rb;
    //private CharacterController player;
    private void Awake()
    {
       rb = GetComponent<Rigidbody>();
       //player = GetComponent<CharacterController>();
    }
    private void FixedUpdate()
    {
        float x = Input.GetAxisRaw("Horizontal");   //水平轴
        float y = Input.GetAxisRaw("Vertical");     //垂直轴
     	Move(x,y);
	
    }
    void Move(float h,float v)
    {//在同时按下两个移动键是将速度置为最基础的速度
        Vector3 Movement = new Vector3(h, 0, v);
        Movement = Movement.normalized * MoveSpeed * Time.deltaTime;
        rb.MovePosition(transform.position + Movement);
    }
}
```

###  相机跟随

通过玩家最开始的时候记录相机与玩家之间的距离差，当玩家进行移动的时候，用玩家当前的这个位置加上距离差得到相机的位置

（物体和组件的关系） 物体通过GetComponent<>得到组件，组件可以挂载物体

```C#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CraemaFollow : MonoBehaviour
{
    private float Smoothing = 5f;
    private GameObject player;
    private Vector3 offset;  //三维向量
    private void Awake()
    {
        player = GameObject.FindGameObjectWithTag("Player");
    }
    private void Start()   //开始的时候找到相机与玩家的距离差值
    {
        offset = transform.position - player.transform.position;   //相机的位置 - 玩家当前的位置(向量间的)

    }
    private void FixedUpdate()
    {
        transform.position = Vector3.Lerp(transform.position,offset + player.transform.position,Smoothing*Time.deltaTime);    //相机的位置 = 差值 + 玩家当前的位置，相机跟随
    }
}
```

首先创建空物体，采用FindGameObjectWithTag("Player")函数找到player组件，在计算相机当前的位置与玩家位置的差值，因为玩家在不断移动，位置不断变化，要保证相机跟随，所以相机的位置为 固定的差值 + 玩家移动每帧移动的位置，并且使用Vector3.lerp函数保证两者间存在延后的跟随；

### 角色旋转

在unity中创造一个空物体，将其拉伸与地面平行，并创建floor图层。通过玩家发射射线，检测地面是否为floor图层，得到玩家需要的朝向，最后进行旋转。

```c#
public class PlayerMovement : MonoBehaviour
{
    public float MoveSpeed = 6f;
    private Rigidbody rb;
    private Animator anim;
    //private CharacterController player;
    private void Awake()
    {
       rb = GetComponent<Rigidbody>();
       anim = GetComponent<Animator>();
       //player = GetComponent<CharacterController>();
    }
    private void FixedUpdate()
    {
        float x = Input.GetAxisRaw("Horizontal");   //水平轴
        float y = Input.GetAxisRaw("Vertical");     //垂直轴

        Turning();
    }    
    void Turning()
    {
        //创建相机（鼠标位置)
        Ray cameraRay = Camera.main.ScreenPointToRay(Input.mousePosition);//从主相机向鼠标所在屏幕位置发射一条射线。
        int floorLayer = LayerMask.GetMask("floor");//获取floor的图层掩码，用于射线检测时在检测该图层的物体
        RaycastHit floorHit;
        //射线检测
       bool isTouchfloor = Physics.Raycast(cameraRay,out floorHit, 100,floorLayer);
        //进行射线检测，检查射线是否击中了 "Floor" 图层的物体，检测距离为 100 个单位
       
        
        if (isTouchfloor) {//射线是否击中floor
            Vector3 v3 = floorHit.point - transform.position;//角色当前位置到射线击中地面点的向量 v3。这个向量表示了角色需要朝向的方向
            v3.y = 0;        
            Quaternion quaternion = Quaternion.LookRotation(v3);
                // 使用刚体的 MoveRotation 方法设置旋转
            rb.MoveRotation(quaternion);
            
        }
    }
}
```

### 玩家射击

想要玩家进行射击，首先需要获取玩家的开火键，在获取开火键后，调用shoot函数之后，实现shoot里面的函数功能，包括开枪音效以及开枪的粒子特效，以及开枪的射线（类似于瞄准），为了可玩性，子弹的发射需要存在间隔

```c#
public class Playershooting : MonoBehaviour
{
    float time = 0f;
    float timeBetweenBullets = 0.15f;//射击时间的间隔
    private AudioSource gunAudio;
    private Light gunlight;
    // 定义一个计时器变量，用于控制闪烁间隔
    private float effectLightTime = 0.2f;
    private ParticleSystem gunParticl;
    private LineRenderer gunLine;


    private Ray shootRay;
    private RaycastHit shoothit;
    private int shootMask;
    private void Start()
    {
        gunAudio = GetComponent<AudioSource>();
        gunlight = GetComponent<Light>();
        gunLine = GetComponent<LineRenderer>();
        gunParticl = GetComponent<ParticleSystem>();
        shootMask = LayerMask.GetMask("Enemy");
    }
    void Update()
    {
        time += Time.deltaTime;

        //获取玩家的开火箭
        //if (Input.GetButton("Fire1") && time >= timeBetweenBullets)//当冷却时间大于射击间隔是即可发射下一次
        //{
           
        //    //射击
        //    shoot();
        
        //}
        if (Input.GetKeyDown(KeyCode.Mouse0) && time >= timeBetweenBullets)//当冷却时间大于射击间隔是即可发射下一次
        {   //射击
            shoot();//得到开火键后调用shoot函数
        }
        if (time >= effectLightTime * timeBetweenBullets)
        {
            gunlight.enabled = false;   //枪口灯光消失
            gunLine.enabled = false;    //枪口射线消失
        }
    }
    void shoot()
    {
        gunlight.enabled =true;   //开枪光效
        time = 0f;					//每次调用shoot函数后将开枪的间隔置为0，在下次time>timeBetweenBullets后进行下一次开火
        gunLine.SetPosition(0, transform.position);  //两个点
        gunLine.enabled = true;

        gunParticl.Play();
        gunAudio.Play();


        //定义一个图层enemy，定义一个射线
        shootRay.origin = transform.position;   //射线发射的原点（从该位置发射）
        shootRay.direction = transform.forward;  //射线发射的方向

        //发射一条射线并检测它是否与场景中的碰撞体相交。
        				//起点以及方向				射线长度  图层
        if (Physics.Raycast(shootRay, out shoothit, 100, shootMask))   
            						//输出射线与碰撞体相交的信息
        {
            gunLine.SetPosition(1,shoothit.point);
            MyenemyHealth enemyHealth = shoothit.collider.GetComponent<MyenemyHealth>();  //射击射线检测到敌人，血量 - 10
            enemyHealth.TakeDamage(10,shoothit.point);
        }
        else
        {
            gunLine.SetPosition(1, transform.position+transform.forward*100);
        }

    }
}
```

### 添加AI敌人（自动寻找player）

通过导入AI Navigation这个资源包，是生成的敌人具备自动导航的功能.定义了一个名为 `Myenemy` 的类，它继承自 `MonoBehaviour`，这意味着它可以作为一个脚本挂载到 Unity 游戏中的游戏对象上，用于控制敌人的行为。其主要功能是让敌人对象通过 `NavMeshAgent` 组件实现导航并跟随玩家，同时会根据敌人自身和玩家的存活状态来决定是否继续跟随。

```c#
public class Myenemy : MonoBehaviour
{
    private NavMeshAgent nav;
    private GameObject player;
    private MyenemyHealth myEnemyhealth;
    private MyPlayerHealth myPlayerhealth;
    private void Awake()
    {
        player = GameObject.FindGameObjectWithTag("Player"); //玩家组件，获取玩家
        nav = GetComponent<NavMeshAgent>();  
        myEnemyhealth = GetComponent<MyenemyHealth>();  
        myPlayerhealth = player.GetComponent<MyPlayerHealth>();
    }
     void Update()//每帧调用，每帧更新玩家的位置寻找玩家
    {
        //检查玩家是否存活或者敌人是否存活，如果玩家和敌人都死亡，则自动寻找player的功能不启用
        if(!myEnemyhealth.isDead&&!myPlayerhealth.isPlayerDead)
            nav.SetDestination(player.transform.position);   //SetDestination()导航到目标的位置
        else
            nav.enabled = false;
        
    }
    
}
```

### 攻击敌人

管理游戏中敌人的生命值、受伤和死亡逻辑。敌人可以受到伤害，当生命值降为 0 时会死亡，死亡后会播放死亡动画、音效，同时会给玩家增加分数，最后尸体逐渐消失。

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

public class MyenemyHealth : MonoBehaviour
{
    private int EnemyScores = 10;//击杀敌人得到的分数
    
    //敌人死亡和受伤的音效，通过GetComponent组件得到
    private AudioSource audi;
    public AudioClip AudioClip;  //切片，切换audiosource的音效
    
    //动画播放控制器，管理敌人的死亡等等动画
    private Animator anim;
    
    private ParticleSystem enemyParticle;
    public int StartHealth = 100;  //血量自定义
   
    //碰撞器，给敌人上碰撞器
    private CapsuleCollider enemyCapsuleCollider;
    
    public  bool isDead = false;//是否死亡
    private bool isSiking = false;  //判断死亡动画中是否降落的一帧
    private void Awake()
    {
        audi = GetComponent<AudioSource>();
        enemyParticle = GetComponentInChildren<ParticleSystem>();
        anim = GetComponent<Animator>();
        enemyCapsuleCollider = GetComponentInChildren<CapsuleCollider>();
    }
    void Update()  
    {
        if (isSiking)  //如果isSiking = true 表示敌人正在下沉 （死亡）
        {
            transform.Translate(-transform.up * Time.deltaTime*5f);//死亡动画，尸体向下消失
        }
    }
    public void TakeDamage(int amount,Vector3 hitPoint)
    {
        //判断敌人是否死亡，如果死亡，则return
        if(isDead==true) 
            return;
        //中弹音效
        audi.Play();
		
        
        //受伤掉血
        StartHealth -= amount;
        enemyParticle.transform.position = hitPoint;  //射击命中后只在爆炸的哪一点进行效果的爆炸
        enemyParticle.Play();
        
        
        if(StartHealth <= 0)
        {
            Death();//血量<=0死亡
        }
    }
    public void Death()
    {
        isDead = true;
        anim.SetTrigger("Death");
        enemyCapsuleCollider.enabled = false;
        GetComponent<NavMeshAgent>().enabled = false;  //禁用NavMeshAgent
        GetComponent<Rigidbody>().isKinematic = true;
        audi.clip = AudioClip;//死亡时切换死亡音效
        audi.Play();


        //让玩家计分类型下面的静态变量+分数
        MyPlayerScore.Scores += EnemyScores;
    }
    public void StartSinking()
    {
        isSiking = true;
        Destroy(gameObject,2f);
    }
}

```

### 玩家血量

管理游戏中玩家的生命值、受伤和死亡逻辑。玩家受伤时屏幕会闪烁红色，生命值降为 0 时玩家会死亡，播放死亡动画和音效，同时禁止玩家移动和射击，还提供了重新加载关卡的功能。

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class MyPlayerHealth : MonoBehaviour
{
    //玩家血量Text控件  Ui界面，左下角的人物血量
    public Text PlayerHealthUi;
    
    
    //玩家受伤，遮挡层 每次受伤界面闪烁红色
    public Image DamageImage;
    private bool Isdamaged = false ;
    public Color FlashColor = new Color (1f,0f,0f,1f);//红色

    //player受伤音效以及死亡音效，还有动画
    public AudioClip Ac_playerDeath;
    private Animator anim;
    private AudioSource Au_playerHurt;
    
    //人物血量 以及判断是否死亡
    public int PlayerHealth = 100;
    public bool isPlayerDead = false;

	//得到玩家移动和攻击的组件，在玩家死亡后调用组件，使其功能变成enable = false 
    private PlayerMovement playerMovement;
    private Playershooting playershooting;
    
    
    private void Awake()
    {
        Au_playerHurt = GetComponent<AudioSource>();
        anim = GetComponent<Animator>();
        playerMovement = GetComponent<PlayerMovement>();
        playershooting = GetComponentInChildren<Playershooting>();  
        
    }
    
    void Update()
    {
        if (Isdamaged)//每帧检查玩家是否受伤
        {
            DamageImage.color = FlashColor;//受到伤害    Isdamaged画布变红
        }
        else
        {	
            DamageImage.color =Color.Lerp(DamageImage.color,Color.clear,5f*Time.deltaTime);
        }
        Isdamaged = false;//默认为原始颜色
    }
    
    public void TakeDamage(int PlayerHurt)  //传入敌人造成的伤害
    {
        Isdamaged = true ; 
        if(isPlayerDead) 
            return;

        Au_playerHurt.Play();  
        PlayerHealth = PlayerHealth - PlayerHurt;  //受伤血量扣除
        if(PlayerHealth <= 0 )
        {
            Death();  //血量<=0死亡
        }
        //更新玩家血量UI
        PlayerHealthUi.text = PlayerHealth.ToString();  //每次受伤更新UI
       
    }
    void Death()
    {

        //播放死亡动画
        anim.SetTrigger("Dead");
        isPlayerDead = true;
        //播放死亡音效
        Au_playerHurt.clip = Ac_playerDeath;
        Au_playerHurt.Play();


        //死亡后禁止移动和射击
        playerMovement.enabled = false;
        playershooting.enabled = false;
        
    }
    public void RestartLevel()   //死亡后重启场景
    {
        SceneManager.LoadScene(0);

    }
}
```

```
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MyEnemyAttack : MonoBehaviour
{
    public int EnemyAttackDamage = 20;  //enemy的攻击力
    private MyPlayerHealth Myplayerhealth;  
    private bool playerInRange;  //判断玩家是否在enemy的触发器中
    private  GameObject player;
    private float Timer = 0;//敌人攻击的时间间隔

    private Animator anim;
    private void Awake()
    {
        player = GameObject.FindGameObjectWithTag("Player");
        Myplayerhealth = player.GetComponent<MyPlayerHealth>();
        anim = GetComponent<Animator>();
    }
  
    // Update is called once per frame
    void Update()
    {
        Timer += Time.deltaTime;
        if (playerInRange&&Timer >0.5f&&!Myplayerhealth.isPlayerDead)
        {
            //敌人如果离player很近造成伤害
            Attack();
        }
        if (Myplayerhealth.isPlayerDead)//如果player死亡（isPlayerDead = true)，enemy静止不动
        {
            anim.SetTrigger("PlayerDead");//播放enemy的静止动画
        }
    }


    private void Attack()
    {
        Timer = 0;
        //获取玩家组件 
        Myplayerhealth.TakeDamage(EnemyAttackDamage);


    }
    private void OnTriggerEnter(Collider other)//enemy的敌人触发器（相当于攻击范围）
    {
        if (other.gameObject == player)
        {
            playerInRange = true;
        }
    }
    private void OnTriggerExit(Collider other)
    {
        if (other.gameObject == player)
        {
            playerInRange = false;
        }
    }
}

```



### 敌人生成

游戏中定时生成敌人。

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MyEnemyManager : MonoBehaviour
{
    public GameObject Enemy;
    public float creatEnemyTime = 3f; // 间隔生成时间，默认 3 秒
    public GameObject CreatEnemyPoint;
    public float FirstEnemyTime = 1f; // 第一次生成的延迟时间，默认 1 秒

    void Start()
    {
        // 检查 Enemy 和 CreatEnemyPoint 是否为空
        if (Enemy == null || CreatEnemyPoint == null)
        {
            Debug.LogError("Enemy 或 CreatEnemyPoint 未赋值，请在 Unity 编辑器中进行设置。");
            return;
        }

        InvokeRepeating("Spawn", FirstEnemyTime, creatEnemyTime);//第一次生成是1s，后面没3s生成怪我
    }

    private void Spawn()
    {
        Instantiate(Enemy, CreatEnemyPoint.transform.position, CreatEnemyPoint.transform.rotation);
        ////实例化物体以相同的角度，位置
    }
}
```

