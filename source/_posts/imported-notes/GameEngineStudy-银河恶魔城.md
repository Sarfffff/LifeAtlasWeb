---
title: 银河恶魔城
date: 2026-06-27 03:51:00
categories:
  - 图形与引擎
tags:
  - GameEngineStudy
  - 笔记
---
# 玩家状态机

采用了状态机模式，将玩家的不同状态（如闲置和移动）封装到不同的类中，通过状态机来管理状态的切换。

### 1. `Player.cs`

#### 内容及作用

- 这是玩家角色的核心脚本，负责管理玩家的基本属性、状态机以及一些基本的行为。
- 属性：
  - `moveSpeed`：玩家的移动速度。
  - `wallCheck`、`wallCheckDistance`、`groundCheck`、`groundCheckDistance`、`whatIsGround`：用于检测碰撞，如墙壁和地面。
  - `facingRight`、`facingDir`：控制玩家的朝向。
  - `anim`、`rb`：分别是玩家的动画控制器和刚体组件。
  - `stateMachine`、`IdleState`、`MoveState`、`jumpState`、`airState`：用于管理玩家的状态。
- 方法：
  - `Awake()`：初始化状态机和各种状态。
  - `Start()`：获取动画控制器和刚体组件，并将玩家初始状态设置为 `IdleState`。
  - `Update()`：每帧更新当前状态。
  - `SetVelocity()`：设置玩家的速度，并根据速度控制玩家的朝向。
  - `IsGroundDetected()`：检测玩家是否在地面上。
  - `Filp()`：翻转玩家的朝向。
  - `FlipController()`：根据玩家的移动方向控制玩家的朝向。

### 2. `PlayerState.cs`

#### 内容及作用

- 这是玩家状态的基类，定义了玩家状态的基本结构和行为。
- 属性：
  - `xInput`、`yInput`：玩家的输入。
  - `rb`：玩家的刚体组件。
  - `stateMachine`：玩家的状态机。
  - `player`：玩家对象。
  - `animBoolName`：动画的布尔参数名称。
- 方法：
  - `PlayerState()`：构造函数，初始化状态机、玩家对象和动画参数名称。
  - `Enter()`：进入状态时调用，设置动画参数并获取刚体组件。
  - `Update()`：每帧更新玩家的输入，并设置动画的速度参数。
  - `Exit()`：退出状态时调用，重置动画参数。

### 3. `PlayerIdleState.cs`

#### 内容及作用

- 继承自 `PlayerGroundState`，表示玩家的空闲状态。
- 方法：
  - `Update()`：如果玩家有水平输入，则切换到 `MoveState`。

### 4. `PlayerMoveState.cs`

#### 内容及作用

- 继承自 `PlayerGroundState`，表示玩家的移动状态。
- 方法：
  - `Update()`：根据玩家的水平输入设置玩家的速度，如果没有水平输入，则切换到 `IdleState`。

### 5. `PlayerJumpState.cs`

#### 内容及作用

- 继承自 `PlayerState`，表示玩家的跳跃状态。
- 方法：
  - `Enter()`：进入跳跃状态时，给玩家一个向上的速度。
  - `Update()`：如果玩家的垂直速度小于 0，则切换到 `airState`。

### 6. `PlayerAirState.cs`

#### 内容及作用

- 继承自 `PlayerState`，表示玩家在空中的状态。
- 方法：
  - `Update()`：如果玩家检测到地面，则切换到 `IdleState`。

### 7. `PlayerGroundState.cs`

#### 内容及作用

- 继承自 `PlayerState`，表示玩家在地面上的状态。
- 方法：
  - `Update()`：如果玩家按下空格键且在地面上，则切换到 `jumpState`。

### 8. `PlayerStateMachine.cs`

#### 内容及作用

- 这是玩家的状态机，负责管理玩家的状态转换。
- 属性：
  - `currentState`：当前状态。
- 方法：
  - `Initialize()`：初始化状态机的初始状态。
  - `ChangeState()`：切换到新的状态。

### 9. `ParallacBackGround.cs`

#### 内容及作用

- 这是用于实现背景视差效果的脚本。
- 属性：
  - `camTF`：主摄像机的变换组件。
  - `lastFrameCameraPos`：上一帧摄像机的位置。
  - `LengthX`、`LengthY`：背景图片的长度。
  - `parallaxFacotr`：视差因子。
  - `lockX`、`lockY`：是否锁定 X 轴和 Y 轴。
- 方法：
  - `Start()`：初始化摄像机的变换组件和上一帧的位置，并计算背景图片的长度。
  - `Update()`：根据摄像机的移动更新背景的位置，并根据锁定条件调整背景的位置。

### 各脚本之间的联系

- `Player.cs` 是核心脚本，它创建并管理 `PlayerStateMachine` 和各种状态对象（`IdleState`、`MoveState` 等）。
- `PlayerStateMachine` 负责管理玩家的状态转换，通过 `Initialize()` 和 `ChangeState()` 方法控制状态的切换。
- `PlayerState` 是所有状态类的基类，定义了状态的基本结构和行为。
- `PlayerIdleState`、`PlayerMoveState`、`PlayerJumpState` 和 `PlayerAirState` 继承自 `PlayerState` 或 `PlayerGroundState`，实现了具体的状态逻辑。
- `ParallacBackGround.cs` 与玩家脚本没有直接的逻辑联系，它是一个独立的脚本，用于实现背景的视差效果

```C#
//PlayerStateMachine  状态机 用于转换玩家的状态
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

//状态机
public class PlayerStateMachine : MonoBehaviour
{
    public PlayerState currentState {  get; private set; }  //可读不可写
    public void Initialize(PlayerState _startState)  //初始化的状态
    {
        currentState = _startState;
        currentState.Enter();

    }
    public void ChangeState(PlayerState _newState) //用于改变状态 ，能在不同的状态下切换
    {
        currentState.Exit();
        currentState = _newState;
        currentState.Enter();
    }
     void Update()
    {
        
    }
}
```

# 相机的视角跟随以及背景无线滚动

# Enemy状态机

# 技能实现

在技能的实现模块，我们使用**Skill类**作为使用技能类的基础，提供了每个技能公共的基本属性（冷却）和行为框架，在通过**SKillManager类**进行全局的管理技能，负责集中管理和协调所有具体技能实例，通过全局访问点，便于技能的管理以及扩展。

**SKill类**

```C#
public class Skill : MonoBehaviour   //所有的技能都继承Skill方法，减少复用的代码，包括冷却时间，以及是否能够使用技能                                 
{                                   //定义了技能的基本属性和行为，为所有具体技能类提供了一个通用的框架。
                                    //通过继承 Skill 类，各个技能类可以复用 Skill 类的基本属性和方法，如冷却时间管理和查找最近敌人的功能。
                                    //这样可以减少代码重复，提高代码的可维护性和可扩展性。当需要添加新的技能时，只需继承 Skill 类并实现自己的 UseSkill() 方法即可。
    [SerializeField] public float cooldown;
    public float cooldownTimer;//冷却时间


    protected Player player;
    protected virtual void Start()
    {
        player = PlayerManager.instance.player;
        CheckUnlock();
    }
    protected virtual void Update()
    {
        cooldownTimer -= Time.deltaTime;
    }

    protected virtual void CheckUnlock()
    {

    }

    public virtual bool CanUseSkill()//提供一个虚函数，子类可以重写
    {
        if (cooldownTimer < 0)   //冷却时间<0
        {
            UseSkill();
            cooldownTimer = cooldown;  //冷却时间重置
            return true;//可以使用技能
        }
        player.playerFx.CreatePopUpText("冷却中");
        return false;
    }
    public virtual void UseSkill()//使用技能，提供接口
    {

    }
    protected virtual Transform FindCloseEnemy(Transform _checkTransform)
    {
        Collider2D[] colliders = Physics2D.OverlapCircleAll(_checkTransform.position, 25);
        float closeDistance = Mathf.Infinity;// 初始化一个无穷大的距离，用于比较找到最近的敌人  
        Transform closestEnemy = null;
        foreach (var hit in colliders)
        {
            if (hit.GetComponent<Enemy>() != null)
            {
                float distanceToEnemy = Vector2.Distance(_checkTransform.position, hit.transform.position);// 计算当前位置与碰撞体位置之间的距离

                if (distanceToEnemy < closeDistance)// 如果计算出的距离小于当前记录的最小距离 
                {
                    closeDistance = distanceToEnemy;// 更新最小距离
                    closestEnemy = hit.transform;   // 记录最近的敌人
                }
            }
        }
        return closestEnemy;
    }
}
```

**SkillManager类**

```C#
public class SkillManager : MonoBehaviour
{//类是一个单例类，负责管理所有技能的实例，并且分别引用不同类型的技能实例。
//SkillManager 类作为单例类，负责管理所有技能的实例。
 //这样可以方便地在其他脚本中访问和调用各个技能，避免了在每个需要使用技能的地方都要手动查找和获取技能组件的麻烦。
 //同时，单例模式确保了 SkillManager 只有一个实例，避免了多个实例带来的冲突和混乱。
    public static SkillManager instance;
    public Dash_Skill dash{  get; private set; }
    public Clone_Skill clone{ get; private set; }
    public Sword_Skill sword{ get; private set; }
    public Blackhole_Skill blackhole{ get; private set; }
    public Crystal_Skill crystal{ get; private set; }
    public Parry_Skill parry{ get; private set; }   
    public Dodge_Skill dodge{ get; private set; }   
    private void Awake()
    {
        if(instance != null)
            Destroy(instance.gameObject);
        else
            instance = this;
    }
    private void Start()
    {
        dash = GetComponent<Dash_Skill>();
        clone = GetComponent<Clone_Skill>();
        sword = GetComponent<Sword_Skill>();
        blackhole = GetComponent<Blackhole_Skill>();
        crystal = GetComponent<Crystal_Skill>();
        parry = GetComponent<Parry_Skill>();
        dodge = GetComponent<Dodge_Skill>();
    }
 
```



![image-20250520201708707](E:\typora_note\GameEngineStudy\assets\image-20250520201708707.png)

## Dash

## Crystal

## BlackHole技能的实现

#### 技能相关类以及功能描述

- Blackhole_Skill类：包含该技能的一系列属性，以及继承自Skill类的方法，负责技能的整体管理，在该类中包含技能是否能够使用的方法（继承自Skill）和能够使用后黑洞预制体的实现，并且技能完成状态的判断

```C#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Blackhole_Skill : Skill
{

    [SerializeField] private float maxSize;//最大尺寸
    [SerializeField] private float growSpeed;//变大速度
    [SerializeField] private float shrinkSpeed;//缩小速度

    [SerializeField] private GameObject blackholePrefab;
    [Space]

    [SerializeField] private float blackholeDuration;
    [SerializeField] int amountOfAttacks = 4;
    [SerializeField] float cloneAttackCooldown = .3f;

    BlackHole_Skill_Controller currentBlackhole;

    public override bool CanUseSkill()
    {
        return base.CanUseSkill();
    }

    public override void UseSkill()
    {
        base.UseSkill();

        GameObject newBlackhole = Instantiate(blackholePrefab, player.transform.position, Quaternion.identity);

        currentBlackhole = newBlackhole.GetComponent<BlackHole_Skill_Controller>();

        currentBlackhole.SetupBlackhole(maxSize, growSpeed, shrinkSpeed, amountOfAttacks, cloneAttackCooldown, blackholeDuration);
    }

    protected override void Start()
    {
        base.Start();
    }

    protected override void Update()
    {
        base.Update();
    }

    public bool SkillCompleted()
    {
        if (currentBlackhole == null)
            return false;
        if (currentBlackhole.playerCanExitState)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    public float GetBlackholeRadius()
    {
        return maxSize / 2;
    }
}
```



![Blackhole 技能实现逻辑](E:\typora_note\GameEngineStudy\assets\Blackhole 技能实现逻辑.jpg)

## Sword技能的实现

![剑技能类型分析](E:\typora_note\GameEngineStudy\assets\剑技能类型分析.jpg)

# 实体属性（PlayerAndEnemy）

在每一个类银河恶魔城中的游戏，都会存在实体属性这个模块，用于实现各种实体的基本属性，包括生命值，力量等等。通过使用Stats类管理所有的数值属性，通过Character_Stats类定义属性作为PlayerStats和EnemyStats类的基类。这个就是基本的属性框架。

##### **Stats类**：

在该类中，我们定义了一个可供Inspector面板进行修改的基础值，同时为这个基础值提供一个列表来在基础值上进行修改值，比如装备提供的属性等等。同时提供2个往列表中进行修改的方法，分别是AddModifier和ReMoveModifier方法，分别往列表添加值，提供GetValue（）方法，在该方法中，使用foreach方法，在基础值上遍历列表查看是否有属性值的修改。总结如下：

1. **基础值**：每个属性有一个在Unity编辑器里可以直接设置的基础数值（比如攻击力基础值是50）
2. **修改列表**：维护一个记录所有临时加减值的列表（比如+10的武器加成，-5的debuff效果都记在这个列表里）
3. **三个核心功能**：
   - `AddModifier`：往列表里加一个数值（比如获得装备+5攻击力）
   - `RemoveModifier`：从列表里移除一个数值（比如卸下装备-5攻击力）
   - `GetValue()`：计算最终数值 = 基础值 + 列表里所有数值的总和

```C#
public class Stat
{
    [SerializeField]  private int baseValue;//基础属性
    public List<int> modifiers;//存储对基础数值的修饰符。这些修饰符可以用来增加或者减少基础数值。
    public int GetValue()
    {
        int finalValue = baseValue;
        foreach (int modifier in modifiers)
        {
            finalValue += modifier;
        }
        return finalValue;
    }
    public void SetDefaultValue(int _value) //
    {
        baseValue = _value;
    }
    public  void AddModifers(int _modifiers)  //往列表添加值，最后遍历列表得到最终值
    {
        modifiers.Add(_modifiers);
    }
    public void RemoveModifers(int _modifiers)//往列表删除值，最后遍历列表得到最终值
    {
        modifiers.Remove(_modifiers);
    }
}
```

##### **Character_Stats类**：

在这个类中，我们定义了Stats类型的属性值，定义Stats类型的属性值我们可以灵活修改属性值，因为Stats类型中，我们定义了提供属性修改的方法，以便装备武器后增加临时的修改值，同时提供了统一的管理属性的方案，在需要进行修改，直接在Stat类进行扩展。

同时在这个类中，不仅提供了基础的属性值，也包括状态异常系统，燃烧，冻结，眩晕。以及核心的战斗系统部分，在战斗系统中，包含不同的伤害，在物理伤害中，我们进行攻击后需要判断是否暴击，如果暴击，则将伤害乘以对于的暴击伤害 -敌人的护甲。没有则直接在基础上减去敌人的护甲。对于魔法伤害，有单独的伤害逻辑，在元素伤害的基础上+智力-目标的魔抗。对于状态异常，我们采用造成的元素伤害类型的最高值施加4s。同时，还提供了特殊的效果，包括无敌的状态，易伤的状态以及攻击闪避机制（基于敏捷和闪避属性）

**属性系统**

- 采用`Stat`类型封装属性值，支持动态修改（装备/技能等临时加成）
- 包含基础四维属性（力量/敏捷/智力/活力）和衍生属性（攻击/防御/魔法）

**战斗系统**

- **物理伤害**：基础伤害+力量，计算暴击（暴击率×暴伤）后扣除目标护甲
- **魔法伤害**：元素伤害+智力扣除目标魔抗，按最高元素类型附加对应异常状态（燃烧/冻结/眩晕）持续4秒

**特殊机制**

- 状态异常：燃烧(持续伤)、冻结(减速降甲)、眩晕(降命中)
- 战斗效果：无敌(免伤)、易伤(承伤+10%)、闪避(基于敏捷/闪避属性)

```C#
using System.Collections;
using System.Collections.Generic;
using Unity.VisualScripting.Antlr3.Runtime.Misc;
using UnityEngine;

// 定义攻击类型枚举
public enum AttackType
{
    Fire,
    Ice,
    Lightning
}

public enum StatType
{
    strength,
    agility,
    intelegence,
    vitality,
    damage,
    critChance,
    critPower,
    health,
    armor,
    evasion,
    magicRes,
    fireDamage,
    iceDamage,
    lightingDamage
}


public class Character_Stats : MonoBehaviour
{
    private EntityFx fx;
    public Vector2 offest = new Vector2(1f, 1f);
    [Header("角色属性")]
    public Stat strength;  //力量   1点力量增加1点伤害和1点暴击伤害
    public Stat agility;//敏捷    提高闪避
    public Stat intelligence;//智慧 增加魔抗和魔法伤害
    public Stat vitality;//生命力  1点生命力提高5点血量

    [Header("防御 ")]//防御
    public Stat maxHealth;
    public Stat armor;//护甲
    public Stat evasion;//闪避
    public Stat magicResistance;//魔抗


    [Header("攻击")]//攻击
    public Stat damage;
    public Stat critChance;//暴击率
    public Stat critPower;//暴击伤害

    [Header("魔法")]
    public Stat iceDamage;
    public Stat fireDamage;
    public Stat lightningDamage;//雷电伤害

    public bool isIgnited;//燃烧  造成一段时间的伤害
    public bool isChilled;//冻结  减少20%的护甲
    public bool isShocked;//眩晕  减少20%的命中率
    //施加负面效果

    [SerializeField] private float ailmentsDuration = 4;//状态异常时间
    private float ignitedTimer;
    private float chilledTimer;
    private float shockedTimer;


    private float ignitedDamageCooldown = .3f;
    private float ignitedDamageTimer;

    [SerializeField] private GameObject shockStrikePrefab;//冲击波
    private int shockDamage;
    private int igniteDamage;


    public System.Action onHealthChanged;//使角色在Stat里调用UI层的函数
    public bool isDead { get; private set; }
    public bool IsInvincible { get; private set; }

    public int currentHealth;
    private bool isVulnerable;//易伤状态
    
  
    protected virtual void Start()
    {
        critPower.SetDefaultValue(150);//爆伤150%
        currentHealth = GetMaxHealthValue();//血量 = 基础血量 + 装备 + 生命力(天赋)
        fx = GetComponent<EntityFx>();

    }

    protected virtual void Update()
    {
        ignitedTimer -= Time.deltaTime; //燃烧持续随桢时间减少
        shockedTimer -= Time.deltaTime;
        chilledTimer -= Time.deltaTime;


        ignitedDamageTimer -= Time.deltaTime;//燃烧造成伤害的施加持续随桢时间减少

        if (ignitedTimer < 0)
        {
            isIgnited = false;
   
        }
        if (chilledTimer < 0)
        {
            isChilled = false;
       
        }
        if (shockedTimer < 0)
        {
            isShocked = false;
         
        }

        if (isIgnited)
            ApplyIgniteDamage();

    }

    public void MakeVulnerableFor(float _duration) => StartCoroutine(VulnerableCorutine(_duration));//易伤状态的协程

    private IEnumerator VulnerableCorutine(float _duration)//易伤状态的协程
    {
        isVulnerable = true;
        yield return new WaitForSeconds(_duration);
        isVulnerable = false;
    }


    //该方法的主要作用是启动一个名为 StatModCorotien 的协程，
    //并将 _modifier、_duration 和 _statToModeify 这三个参数传递给协程，从而开始对指定属性进行临时修改的操作流程。
    public virtual void IncreaseStatBy(int _modifier, float _duration, Stat _statToModeify)
    {  //参数为（增加的值，持续的时间，修改的属性）
        StartCoroutine(StatModCorotien(_modifier, _duration, _statToModeify));
    }

    private IEnumerator StatModCorotien(int _modifier, float _duration, Stat _statToModeify)
    {

        _statToModeify.AddModifers(_modifier);
        yield return new WaitForSeconds(_duration);//等待持续时间结束，返回最开始的状态
        _statToModeify.RemoveModifers(_modifier);
    }
    public virtual void DoDamage(Character_Stats _targetStats)
    {

        bool criticalStrike = false;
        if (canAvoidAttack(_targetStats))
            return;

        if(_targetStats.IsInvincible)
            return;
        _targetStats.GetComponent<Entity>().SetupKnockBackDir(transform);

        int totalDamage = damage.GetValue() + strength.GetValue();//总伤害
        if (CanCrit())  //如果这刀暴击，进入暴击伤害计算 
        {
            totalDamage = CalculateCriticalDamage(totalDamage);
            criticalStrike = true;       
        }
 
        fx.CreateHitFx(_targetStats.transform, criticalStrike);
        totalDamage = CheckTargetArmor(_targetStats, totalDamage);
        _targetStats.TakeDamage(totalDamage);    //选择武器造成伤害

         DoMagicalDamage(_targetStats);           //选择魔法造成伤害

    }

    protected virtual void Die()
    {
        isDead = true;
    }
    public void KillEntity() {
        if (!isDead)
            Die();
    }

    public void MakeInvincible(bool _invincible)
    {
        IsInvincible = _invincible;
    }
    
    public virtual void TakeDamage(int _damage)
    {
        if (IsInvincible)
            return;
        DecreaseHealthy(_damage);

        fx.StartCoroutine("FlashFX");
        GetComponent<Entity>().DamageImapct();
        
        if (currentHealth < 0 && !isDead)
            Die();
    }


    public virtual void IncreaseHealthBy(int _amount)//传入治疗量，供饮血剑使用去增加饮血
    {
        currentHealth += _amount;  //当前的血量 = 当前血量+治疗量
        if (currentHealth > GetMaxHealthValue())  //如果当前血量 大于最大血量  则等于最大血量
            currentHealth = GetMaxHealthValue();
        if (onHealthChanged != null)
            onHealthChanged();
    }
    protected virtual void DecreaseHealthy(int _damage)
    {
        if (isVulnerable)
            _damage = Mathf.RoundToInt(_damage * 1.1f);

        currentHealth -= _damage;

        if(_damage > 0)
        {
            if(CanCrit())
                fx.CreatePopUpText("<color=yellow>" + _damage.ToString() + "</color>");
            else
                fx.CreatePopUpText(_damage.ToString());

        }
            
        if (onHealthChanged != null)
            onHealthChanged();
    }


    #region 魔法伤害和负面效果
    private void ApplyIgniteDamage()  //施加火焰燃烧伤害效果
    {
        if (ignitedDamageTimer < 0 )
        {

            DecreaseHealthy(igniteDamage);//火焰燃烧造成伤害，真伤
            if (currentHealth < 0 && !isDead)
                Die();

            ignitedDamageTimer = ignitedDamageCooldown;
        }
    }


    public virtual void DoMagicalDamage(Character_Stats _targetStats)//造成魔法伤害
    {
        //获取最终伤害值并传入
        int _fireDamage = fireDamage.GetValue();
        int _iceDamage = iceDamage.GetValue();
        int _lightningDamage = lightningDamage.GetValue();


        int totalMagicDamage = _fireDamage + _iceDamage + _lightningDamage + intelligence.GetValue();//总魔法伤害 = 冰+火+雷电+智力天赋
        totalMagicDamage = CheckTargetResistance(_targetStats, totalMagicDamage); //总魔法伤害 = 魔法伤害 - 魔抗
        _targetStats.TakeDamage(totalMagicDamage);  //最后造成伤害

        if (Mathf.Max(_fireDamage, _iceDamage, _lightningDamage) <= 0)//如果所有伤害都是0，退出
            return;


        AttemptToApplyAilments(_targetStats, _fireDamage, _iceDamage, _lightningDamage);
    }
    //将三种负面效果造成的伤害进行比较，那种负面效果强使用哪个，都不满足条件则尝试随机施加一种异常状态
    private void AttemptToApplyAilments(Character_Stats _targetStats, int _fireDamage, int _iceDamage, int _lightningDamage)
    {
        bool canApplyIgnite = _fireDamage > _iceDamage && _fireDamage > _lightningDamage;//燃烧效果
        bool canApplyChill = _iceDamage > _fireDamage && _iceDamage > _lightningDamage;
        bool canApplyShock = _lightningDamage > _fireDamage && _lightningDamage > _iceDamage;

        while (!canApplyChill && !canApplyShock && !canApplyIgnite)  //
        {
            int result = Random.Range(1, 4);
            if (result == 1 && _fireDamage > 0)
            {
                canApplyIgnite = true;
                _targetStats.ApplyAilments(canApplyIgnite, canApplyChill, canApplyShock);
                return;

            }
            if (result == 2 && _iceDamage > 0)
            {
                canApplyChill = true;
                _targetStats.ApplyAilments(canApplyIgnite, canApplyChill, canApplyShock);
                return;
            }
            if (result == 3 && _lightningDamage > 0)
            {
                canApplyShock = true;
                _targetStats.ApplyAilments(canApplyIgnite, canApplyChill, canApplyShock);
                return;
            }

        }
        if (canApplyIgnite)
            _targetStats.SetupIgniteDamage(Mathf.RoundToInt(_fireDamage * .2f));
        if (canApplyShock)
            _targetStats.SetupShockStrikeDamage(Mathf.RoundToInt(_lightningDamage * .1f));


        _targetStats.ApplyAilments(canApplyIgnite, canApplyChill, canApplyShock);
    }


    public void ApplyAilments(bool _ignite, bool _chill, bool _shock)//应用状态效果
    {
        bool canApplyIgnite = !isIgnited && !isChilled && !isShocked;
        bool canApplyChill = !isIgnited && !isChilled && !isShocked;
        bool canApplyShock = !isIgnited && !isChilled;
        if (_ignite && canApplyIgnite)
        {
            isIgnited = _ignite;
            ignitedTimer = ailmentsDuration;//点燃2s
            fx.IgniteFxfor(ailmentsDuration);
            //ShowInjurySprite(AttackType.Fire); // 显示点燃精灵
        }
        if (_chill && canApplyChill)
        {
            chilledTimer = ailmentsDuration;
            isChilled = _chill;
            float slowPercentage = .2f;//减速百分比    m
            GetComponent<Entity>().SlowEntityBy(slowPercentage, ailmentsDuration);
            fx.ChillFxfor(ailmentsDuration);
           // ShowInjurySprite(AttackType.Ice); // 显示冻结精灵
        }
        if (_shock && canApplyShock)
        {
            if (!isShocked)
            {
                ApplyShock(_shock);
               // ShowInjurySprite(AttackType.Lightning); // 显示电击精灵
            }
            else
            {
                if (GetComponent<Player>() != null)
                    return;

                HitNearestTargetWithShockStrike();
            }
        }
    }



    public void ApplyShock(bool _shock)
    {
        if (isShocked)
            return;
        shockedTimer = ailmentsDuration;
        isShocked = _shock;
        fx.ShockFxfor(ailmentsDuration);
    }

    private void HitNearestTargetWithShockStrike()
    {

        Collider2D[] colliders = Physics2D.OverlapCircleAll(transform.position, 25);
        float closeDistance = Mathf.Infinity;// 初始化一个无穷大的距离，用于比较找到最近的敌人  
        Transform closestEnemy = null;
        foreach (var hit in colliders)
        {
            if (hit.GetComponent<Enemy>() != null && Vector2.Distance(transform.position, hit.transform.position) > 1)
            {
                float distanceToEnemy = Vector2.Distance(transform.position, hit.transform.position);// 计算当前位置与碰撞体位置之间的距离

                if (distanceToEnemy < closeDistance)// 如果计算出的距离小于当前记录的最小距离 
                {
                    closeDistance = distanceToEnemy;// 更新最小距离
                    closestEnemy = hit.transform;   // 记录最近的敌人
                }
            }
            if (closestEnemy == null)  //
                closestEnemy = transform;

        }

        if (closestEnemy != null)
        {
            GameObject newShockStrike = Instantiate(shockStrikePrefab, transform.position, Quaternion.identity);
            newShockStrike.GetComponent<ShockStrike_Controller>().SetUp(shockDamage, closestEnemy.GetComponent<Character_Stats>());
        }
    }//雷电一    击

    public void SetupIgniteDamage(int _damage) => igniteDamage = _damage;
    public void SetupShockStrikeDamage(int _damage) => shockDamage = _damage;
    #endregion


    #region Stat calculations

    private int CheckTargetResistance(Character_Stats _targetStats, int totalMagicDamage)
    {
        totalMagicDamage -= _targetStats.magicResistance.GetValue() + (_targetStats.intelligence.GetValue() * 3);
        //总的魔法伤害 = 总的魔法伤害 - （魔抗 + 智力*3）//一点智力 提高3点魔抗
        totalMagicDamage = Mathf.Clamp(totalMagicDamage, 0, int.MaxValue);
        return totalMagicDamage;
    }


    public int CheckTargetArmor(Character_Stats _targetStats, int totalDamage)
    {
        if (_targetStats.isChilled)//被冷冻
            totalDamage -= Mathf.RoundToInt(_targetStats.armor.GetValue() * .8f);
        else
            totalDamage -= _targetStats.armor.GetValue();
        totalDamage -= _targetStats.armor.GetValue(); //从总伤害值（totalDamage）中减去目标护甲值（_targetStats.armor.GetValue()）
                                                      //_targetStats是一个包含目标各种统计信息的对象，armor是其中的一个属性，代表目标的护甲，而GetValue()方法则是用来获取这个护甲值的具体数值

        totalDamage = Mathf.Clamp(totalDamage, 0, int.MaxValue);//Mathf.Clamp方法确保totalDamage的值不会低于0，也不会超过int.MaxValue（
        return totalDamage;
    }
    public virtual void OnEvasion()
    {

    }
    public bool canAvoidAttack(Character_Stats _targetStats)
    {
        int totalEvasion = _targetStats.evasion.GetValue() + _targetStats.agility.GetValue();//总闪避 = 目标开始的闪避值 + 目标开始的敏捷度得到的数值

        if (isShocked)
            totalEvasion += 20;

        if (Random.Range(0, 100) < totalEvasion)
        {
            _targetStats.OnEvasion();
            return true;
        }
        return false;
    }//闪避

    public bool CanCrit()  //暴击
    {
        int totalCritcakChance = critChance.GetValue() + agility.GetValue();//暴击率 = 基础的暴击率+闪避值
        if (Random.Range(0, 100) <= totalCritcakChance)
        {
            return true;
        }
        return false;
    }

    public int CalculateCriticalDamage(int _Damage)//_Damage代表普通攻击的伤害
    {
        float totalCritPower = (critPower.GetValue() + strength.GetValue()) * .01f;//暴击伤害 = 基础爆伤150% + 力量
        float critDamage = _Damage * totalCritPower;//将普通伤害_Damage乘以totalCritPower来得到最终伤害
        return Mathf.RoundToInt(critDamage);  //四舍五入表示整数
    }

    public int GetMaxHealthValue()
    {
        return maxHealth.GetValue() + vitality.GetValue() * 5;

    }//统计生命值函数


    #endregion

    public Stat GetType(StatType _StatType)
    {
        if (_StatType == StatType.strength) return strength;
        else if (_StatType == StatType.agility) return agility;
        else if (_StatType == StatType.intelegence) return intelligence;
        else if (_StatType == StatType.vitality) return vitality;
        else if (_StatType == StatType.damage) return damage;
        else if (_StatType == StatType.critChance) return critChance;
        else if (_StatType == StatType.critPower) return critPower;
        else if (_StatType == StatType.health) return maxHealth;
        else if (_StatType == StatType.armor) return armor;
        else if (_StatType == StatType.evasion) return evasion;
        else if (_StatType == StatType.magicRes) return magicResistance;
        else if (_StatType == StatType.fireDamage) return fireDamage;
        else if (_StatType == StatType.iceDamage) return iceDamage;
        else if (_StatType == StatType.lightingDamage) return lightningDamage;
        return null;
    }


}
```

##### **PlayerStats类**

该类继承Character_Stats类，重写了父类的DoDamage（），Take Damage（），Die（），Decrease Healthy（），OnEvasion（）方法，同时实现了特有的在释放clone后造成的攻击

```C#
public class PlayerStats : Character_Stats
{
    private Player player;

    protected override void Start()
    {
        base.Start();
        player = GetComponent<Player>();
    }
    public override void DoDamage(Character_Stats _targetStats)
    {
        base.DoDamage(_targetStats);
    }

    public override void TakeDamage(int _damage)
    {
        base.TakeDamage(_damage);

    }
    protected override void Die()
    {
        base.Die();
        player.Die();
        GameManager.instance.lostCurrencyAmount = PlayerManager.instance.currency;
        PlayerManager.instance.currency = 0;
        GetComponent<PlayerItemDrop>()?.GenerateDrop();
    }
    protected override void DecreaseHealthy(int _damage)
    {
        base.DecreaseHealthy(_damage);
        if(_damage > GetMaxHealthValue() * .3f)
        {
            player.SetupKnocwbackPower(new Vector2(10, 7));//伤害超过最大的30%，会产生击退
            player.playerFx.ScreenShake(player.playerFx.shakeHighDamage); //受到高额伤害，会产生震动
            int randomSound = Random.Range(31, 32);
            AudioManager.instance.PlaySFX(randomSound, null);
            
        }
        ItemData_Equipment currentArmor = Inventory.Instance.GetEquipment(EquipmentType.armor);
        if (currentArmor != null)
        {
            currentArmor.Effect(player.transform);
        }
    }
    public override void OnEvasion()
    {
        player.skill.dodge.CreateMirageOnDodge();
    }
    public void CloneDoDamage(Character_Stats _targetStats, float _multipie)//幻象造成的伤害为最初伤害  * 倍率
    {
        if (canAvoidAttack(_targetStats))
            return;

        int totalDamage = damage.GetValue() + strength.GetValue();//总伤害
        if(_multipie > 0)
            totalDamage = Mathf.RoundToInt(totalDamage  *_multipie);

        if (CanCrit())  //如果这刀暴击，进入暴击伤害计算 
        {
            totalDamage = CalculateCriticalDamage(totalDamage);
        }

        totalDamage = CheckTargetArmor(_targetStats, totalDamage);

        _targetStats.TakeDamage(totalDamage);    //选择武器造成伤害
        DoMagicalDamage(_targetStats);           //选择魔法造成伤害
    }
}
```

##### **EnemyStats类**

在该类中，实现敌人的属性随level的等级按几何增长的方法，以及重写了DoDamage（），Take Damage（），Die（），以实现enemy独特的攻击以及死亡方法。

```C#
public class EnemyStats : Character_Stats
{
    private Enemy enemy;
    private ItemDrop myDropSystem;
    public Stat soulDropAmout;//掉落数

    [Header("Level details")]
    [SerializeField] private int level = 1;

    [Range(0f, 1f)]//限制percentageModifier
    [SerializeField] private float percentageModifier = .4f;


    protected override void Start()
    {
        soulDropAmout .SetDefaultValue(100);//默认100
        ApplyLevelModifers();
        base.Start();

        enemy = GetComponent<Enemy>();
        myDropSystem = GetComponent<ItemDrop>();

    }

    private void ApplyLevelModifers()
    {

        Modify(strength);
        Modify(agility);
        Modify(intelligence);
        Modify(vitality);

        Modify(damage);
        //Modify(critPower);
        //Modify(critChance);

        Modify(maxHealth);
        Modify(armor);
        Modify(evasion);
        Modify(magicResistance);

        Modify(fireDamage);
        Modify(fireDamage);
        Modify(lightningDamage);
        
        Modify(soulDropAmout);//随等级几何增加
    }

    private void Modify(Stat _stat)
    {
        for (int i = 0; i < level; i++)
        {
            float modifer = _stat.GetValue() * percentageModifier;//modifer = 基础值 * 随机的（0，1）
            _stat.AddModifers(Mathf.RoundToInt(modifer));//将modifer取整添加到AddModifers中，每次循环都改变一次
        }


    }

    public override void DoDamage(Character_Stats _targetStats)
    {
        base.DoDamage(_targetStats);
    }
    public override void TakeDamage(int _damage)
    {
        base.TakeDamage(_damage);

    }
    protected override void Die()
    {
        base.Die();
        enemy.Die();
        PlayerManager.instance.currency += soulDropAmout.GetValue();
        myDropSystem.GenerateDrop();
        Destroy(gameObject,5f);
    }
```

# 背包系统

### 核心数据结构

1. **物品数据（`ItemData` 及子类）**

   - 作为物品的基础数据模板，包含物品 ID（`itemId`）、名称、图标（`icon`）、类型（`itemType`，如装备 / 材料）、掉落概率（`dropChance`）等通用属性。
   - 装备类物品（`ItemData_Equipment`）继承自 `ItemData`，额外包含装备类型（`EquipmentType`：武器 /armor/ 饰品等）、冷却时间（`ItemCooldown`）、效果逻辑（`Effect()`）等。

2. **背包物品实例（`InventoryItem`）**

   - 用于记录背包中实际存在的物品，关联对应的 `ItemData` 模板，并记录堆叠数量（`stackSize`）。
   - 提供堆叠增减方法（`AddStack()`/`RemoveStack()`），处理物品数量变化。

   ```csharp
   public class InventoryItem {
       public ItemData data; // 关联物品模板
       public int stackSize; // 堆叠数量
       public void AddStack() => stackSize++; // 增加数量
       public void RemoveStack() => stackSize--; // 减少数量
   }
   ```

### 背包容器管理（`Inventory` 类）

通过**多个容器**区分物品类型（装备 / 背包 / 仓库），并使用**字典 + 列表**双重结构实现高效查询与遍历：

1. **容器类型**

   - `inventory`/`inventoryDictionary`：玩家背包（装备类物品）。
   - `stash`/`stashDictionary`：仓库（材料类物品）。
   - `equipment`/`equipmentDictionary`：已装备物品（按 `EquipmentType` 区分槽位）。

2. **核心功能**

   - 添加物品（`AddItem()`）：根据物品类型（装备 / 材料）分别加入背包或仓库，支持同类型物品自动堆叠。

     ```csharp
     public void AddItem(ItemData _item) {
         if (_item.itemType == ItemType.Equipment) AddToInventory(_item);
         else if (_item.itemType == ItemType.Material) AddToStash(_item);
     }
     ```

   - **移除物品（`RemoveItem()`）**：减少堆叠数量，数量为 0 时从容器中删除。

   - **装备管理（`EquipItem()`/`UnequipItem()`）**：装备物品时替换同类型旧装备，更新属性（`AddModifiers()`/`RemoveModifiers()`）。

   - **UI 同步（`UpdateSlotUI()`）**：物品变动后刷新背包、仓库、装备槽的 UI 显示。

### UI 交互逻辑

1. **槽位组件**
   - `UI_ItemSlot`：背包 / 仓库的物品槽，负责显示物品图标和堆叠数量（`UpdateSlot()`）。
   - `UI_EquipmentSlot`：装备槽，按 `EquipmentType` 绑定对应装备（如武器槽只显示武器）。
2. **制作系统（`UI_CraftList`）**
   - 通过 `craftEquipment` 列表配置可制作的装备，动态生成制作槽（`UI_CraftSlot`）。
   - 制作时调用 `Inventory.CanCraft()` 检查材料是否充足，消耗材料后添加成品到背包。

### 数据持久化

通过实现 `ISavedManager` 接口，确保背包数据在游戏重启后不丢失：

1. **保存逻辑（`SaveData()`）**

   - 将背包、仓库中物品的 `itemId` 和堆叠数量存入 `GameData.inventory` 字典。
   - 将已装备物品的 `itemId` 存入 `GameData.equipmentId` 列表。

   ```csharp
   public void SaveData(ref GameData gameData) {
       foreach (var pair in inventoryDictionary)
           gameData.inventory.Add(pair.Key.itemId, pair.Value.stackSize);
       foreach (var pair in equipmentDictionary)
           gameData.equipmentId.Add(pair.Key.itemId);
   }
   ```

2. **加载逻辑（`LoadData()`）**

   - 从 `GameData` 中读取物品 ID 和数量，通过 `itemDataBase` 查找对应 `ItemData`，重建背包和装备状态。

### 扩展功能

1. **物品掉落（`ItemDrop`/`PlayerItemDrop`）**
   - 敌人或玩家死亡时，通过 `GenerateDrop()` 随机掉落物品，实例化 `ItemObject` 作为场景中的可拾取物体，手动装入掉落物品，自定义设置。
   - 玩家拾取时调用 `Inventory.AddItem()` 加入背包。
2. **物品使用**
   - 消耗品（如药水 `Flask`）通过 `UsedFlask()` 触发效果，受冷却时间限制。

# 背包系统模块之间的联系

### **与物品数据系统（ItemData 及子类）的连接**

1. **数据关联**

   - 背包系统通过 `itemDataBase` 列表存储所有物品的基础数据模板（`ItemData` 及其子类，如装备 `ItemData_Equipment`、材料等），用于物品实例化和属性查询。
   - 例如：当玩家拾取物品时，`Inventory.AddItem(ItemData)` 会根据物品类型（装备 / 材料）调用不同逻辑，装备类物品存入 `inventory` 列表，材料存入 `stash` 列表。

2. **装备属性联动**

   - 装备类物品（`ItemData_Equipment`）包含属性加成（如攻击力、防御力），背包系统在 `EquipItem()` 时调用 `AddModifiers()` 方法，将属性应用到玩家 stats 系统（`PlayerStats`）；卸载时调用 `RemoveModifiers()` 移除加成。

   ```csharp
   // 装备物品时同步属性
   newEquipment.AddModifiers(); // 来自 ItemData_Equipment 类，修改玩家 stats
   ```

### **与 UI 系统的连接**

1. **槽位组件绑定**
   - 背包系统通过 `inventorySlotParent`、`stashSlotParent`、`equipmentSlotParent` 等变量，绑定 UI 中的物品槽父节点，动态生成或更新槽位显示（`UI_ItemSlot`、`UI_EquipmentSlot`）。
   - 例如：`UpdateSlotUI()` 方法会遍历背包 / 仓库 / 装备列表，调用每个槽位的 `UpdateSlot(InventoryItem)` 方法，刷新图标、数量等显示。
2. **制作系统交互**
   - 制作界面（`UI_CraftList`）通过 `craftEquipment` 列表配置可制作装备，点击制作时调用 `Inventory.CanCraft()` 检查材料是否充足。
   - 材料足够则消耗材料（`RemoveItem()`）并添加成品到背包（`AddItem()`），同时更新制作界面和背包 UI。

### **与玩家系统（Player）的连接**

1. **物品拾取与掉落**
   - 玩家拾取场景中的物品（`ItemObject`）时，`ItemObject.PickUpItem()` 调用 `Inventory.AddItem(itemData)` 将物品加入背包，同时销毁场景中的物品实体。
   - 玩家死亡时，`PlayerItemDrop.GenerateDrop()` 会随机从背包和仓库中掉落物品，通过 `DropItem(item.data)` 实例化场景物品，并从背包中移除（`RemoveItem()` 或 `UnequipItem()`）。
2. **状态与能力影响**
   - 背包中的消耗品（如药水 `Flask`）使用时，`Inventory.UsedFlask()` 会触发玩家状态恢复，并受冷却时间（`flaskCooldown`）限制，冷却状态通过 UI 同步显示。

### **与数据持久化系统（Save And Load）的连接**

1. **数据保存**

   - 背包系统实现 `ISavedManager` 接口，`SaveData()` 方法将物品 ID 和堆叠数量存入 `GameData` 的字典（`inventory`、`equipmentId`），确保关闭游戏后数据不丢失。

   ```csharp
   // 保存物品数据到 GameData
   foreach (var pair in inventoryDictionary)
       gameData.inventory.Add(pair.Key.itemId, pair.Value.stackSize);
   ```

2. **数据加载**

   - 加载游戏时，`LoadData()` 从 `GameData` 读取物品 ID 和数量，通过 `itemDataBase` 查找对应 `ItemData`，重建背包、仓库和装备状态（`AddItem()`、`EquipItem()`）。

### **与技能系统的间接连接**

- 部分技能的解锁或效果可能依赖背包中的物品（如消耗特定材料释放技能），通过 `Inventory` 提供的 `GetStashList()` 或 `CheckItemExists()` 方法（逻辑隐含）检查物品是否存在，实现技能与物品的联动。

# 装备效果

# UI

# SaveManager

在项目中，实现游戏内容的保存使用依赖倒置的设计原则，并且通过不同的类来实现，具体如下。

#### **1.GameData类**

在GameData类中，定义了游戏数据的结构，包括库存，游戏货币，技能树，装备，音量的大小，检查点等字段，对于每种不同的字段类型采取不同的数据结构进行存储。

**值类型存储**：

```C#
public int currency;  //玩家的剩余货币
//灵魂以及玩家死亡的位置坐标
public float lostCurrencyX;
public float lostCurrencyY;
public int lostCurrencyAmount;
public string closetCheckPointId;
```

**列表类型存储**：

```C#
public List<string> equipmentId;  //每件装备的ID
```

**字典类型**

```C#
//保存库存  unity默认不支持字典类型的序列化也就是存储和传输，所以需要写一个脚本序列化字典，或者使用2个列表
public Serializable_Dictionary<string, int> inventory;
public Serializable_Dictionary<string, bool> skillTree;
public Serializable_Dictionary<string, bool> checkpoints;
public Serializable_Dictionary<string, float> volumeSettings;
```

在Unity中，默认是不支持字典类型的序列化的，所以采用Serializable_Dictionary类来实现Unity序列化字典类型。

#### **2.Serializable_Dictionary类**

实现该接口的 `OnBeforeSerialize` 和 `OnAfterDeserialize` 方法，在序列化前后转换字典和列表。**Dictionary<TKey, TValue>**：继承自标准字典类，扩展序列化功能。

在Serializable_Dictionary类，使用2个列表来分别存储字典的Key和Value值，在序列化前，首先清空2个列表的内容，之后使用foreach循环，遍历字典，将字典的Key和Value分别插入不同的列表。在序列化后，首先判断列表的Key和value的长度是否相同，不同则return。判断后，将2个列表的数据通过this关键字，重新构建成字典

```C#
public class Serializable_Dictionary<TKey, TValue> : Dictionary<TKey, TValue>, ISerializationCallbackReceiver
{ //序列化字典，将字典类型变成可以保存和传输的状态
    [SerializeField] private List<TKey> keys = new List<TKey>();  //存储字典键的列表
    [SerializeField] private List<TValue> values = new List<TValue>();  //存储字典值的列表

    public void OnBeforeSerialize()  //在Unity序列化对象之前自动调用
    {
        keys.Clear();
        values.Clear();//清空字典所有的键值对     
        foreach (KeyValuePair<TKey, TValue> kvp in this)  //将字典中的键值对分别添加到对应的列表中
        {
            keys.Add(kvp.Key);
            values.Add(kvp.Value);
        }
    }
    public void OnAfterDeserialize() //在Unity反序列化对象之后自动调用
    {
        this.Clear();// 清空当前字典内容      
        //检查键值列表长度是否一致
        if (keys.Count != values.Count)
        {
            Debug.Log("键数和值数不相等");
            return;
        }        
        for (int i = 0; i < keys.Count; i++)//将列表中的数据重新构建为字典
        {
            this.Add(keys[i], values[i]);
        }
    }
}
```

#### **3.ISaveManager接口**

在 `SaveManager` 和存档组件之间使用 `ISavedManager` 接口，是一种典型的 **依赖倒置原则（Dependency Inversion Principle, DIP）** 的应用，目的是 **降低耦合度**，提高系统的 **可扩展性** 和 **可维护性**。确保每次新增保存或者修改存档的时候，只需要实现这个接口的内容则可以完成功能。在该接口中只存在2个方法，在保存内容和加载内容时，只需要实现接口的方法。



```C#
public interface ISavedManager  //定义存档系统的接口
{
    void LoadData(GameData gameData);
    void SaveData(ref GameData gameData);   
}
```

#### **4.FindDataHandler类**

负责文件的IO操作，包括数据的序列化（保存）和反序列化（加载），以及加密/解密功能。`FindDataHandler` 通过 `Save` 和 `Load` 方法直接操作 `GameData` 对象。`Save` 方法将 `GameData` 序列化为 JSON 并保存到文件；`Load` 方法从文件读取 JSON 并反序列化为 `GameData`。在保存和加载的过程中使用unity提供的 JSON 序列化工具，用于 `GameData` 和 JSON 字符串之间的转换。

在Save方法中，将文件的路径和文件名拼接组成完整的路径，提供path.GetDirectoryName(fullPath)方法创建目录，再将数据转换为Json格式，通过使用IO流将文件存入创建的目录中进行保存。对于Load方法中，直接操控GameData对象，同样拼接完整的路径，打开路径下的文件，使用Io流将文件读取出来，并且将json文件转为gameData格式类型数据进行返回。

```C#
public class FindDataHandler  //负责文件IO操作，处理数据的序列化和反序列化
{
    private string dataDirPath = "";  //路径
    private string dataFileName = ""; //文件名
    //文件加密
    private bool encryptData= false;  //默认不加密
    private string codeWord = "CoderJ"; //密钥

    public FindDataHandler(string _dataDirPath, string _dataFileName,bool _encryptData)
    {
        this.dataDirPath = _dataDirPath;
        this.dataFileName = _dataFileName;
        this.encryptData = _encryptData;
    }
    public void Save(GameData _data)
    {
        string fullPath = Path.Combine(dataDirPath, dataFileName);  //// 组合完整路径 文件地址 + 文件名
        try
        {    //path.GetDirectoryName(fullPath);此方法会从 fullPath 里提取出目录部分,如何创建目录
            Directory.CreateDirectory(Path.GetDirectoryName(fullPath));    

            string dataToStore = JsonUtility.ToJson(_data,true); //// 将数据对象转换为JSON字符串
            
            if(encryptData) //提高外部选择是否加密
                dataToStore = EncryptDescrypt(dataToStore); //将数据传入函数进行加密
            
            using (FileStream stream = new FileStream(fullPath, FileMode.Create)) 
            {  //使用Io流写入数据
                using (StreamWriter writer = new StreamWriter(stream)) { 
                    writer.Write(dataToStore);
                }
            }
        }
        catch (Exception e)
        {
            Debug.LogError("Error on trying to save data to file"  + fullPath + "\n"+e);         
        }
    }
    public GameData Load() {   
        string fullPath = Path.Combine(dataDirPath,dataFileName);
        GameData loadData = null;
        if(File.Exists(fullPath))
        {
            try
            {
                string dataToLoad = "";
                using (FileStream stream = new FileStream(fullPath, FileMode.Open))
                { //使用流式读取
                    using(StreamReader reader = new StreamReader(stream))
                    {
                        dataToLoad = reader.ReadToEnd();
                    }
                }
                loadData = JsonUtility.FromJson<GameData>(dataToLoad); //将读取的json格式的数据转换为Gamedata类型的数据

                if(encryptData)
                    dataToLoad = EncryptDescrypt(dataToLoad);
            }
            catch(Exception e)
            {
                Debug.LogError("Error on trying on load data form file " + fullPath+ "\n"+e);
            }        
        }
        return loadData;
    }
    //快捷删除保存的文件
    public void Delete()
    {
        string fullpath  = Path.Combine(dataDirPath,dataFileName);
        if (File.Exists(fullpath))
            File.Delete(fullpath);
    }

    //数据的加密 ,采用异或的方式
    private string EncryptDescrypt(string _data)
    {
        string modifiedData = "";
        for(int i  =  0; i < _data.Length; i++)
        {
            modifiedData += (char)_data[i]^codeWord[i % codeWord.Length];       
        }
        return modifiedData;
    }
}
```

#### **5.SaveManager类**

存档系统的核心管理类，负责协调数据加载、保存、初始化等流程。保存和加载数据都是通过Sava Manager进行操作，在Awake方法中调用 private List<ISavedManager> FindAllSaveManger()方法，通过反射以及LINQ查找到所有实现 `ISaveManager` 的组件（如背包、技能树等），将其返回实现了`ISavedManager`接口的**组件实例列表**。

在LoadData方法中，直接加载游戏数据，如果游戏数据不为空，证明不存在游戏数据，直接开启新游戏。存在则，则将加载的数据传递给所有已经实现ISaveManager接口的组件的实例（也就是外部的gameobject物体挂载已经实现IsavaManager接口的类）。

在SavaData方法中，将实现ISavaManager接口的组件的存入列表中，使用FindDataHandler类提供的Save方法进行存储

```C#
public class SaveManager : MonoBehaviour  //存档系统的核心管理类
{
    public static SaveManager instance;  //单例模式
    private GameData gameData;//用于存储游戏数据

    [SerializeField] private bool encryptData;
    [SerializeField] private string fileName;  //存档文件名
    private List<ISavedManager> savedManagers = new List<ISavedManager>();  //所有的存档组件
    private FindDataHandler dataHandler;  // 数据处理器

    [ContextMenu("删除已经保存的文件")] 
    public void DeleteSaveData()
    {
        dataHandler = new FindDataHandler(Application.persistentDataPath, fileName, encryptData);
        dataHandler.Delete();
    }
    private void Awake()
    {
        if(instance!=null)
            Destroy(instance.gameObject);
        else
            instance = this;
        dataHandler = new FindDataHandler(Application.persistentDataPath, fileName, encryptData);
        savedManagers = FindAllSaveManger();  //调用函数
        LoadGame();
    }

    public void Start()
    {
    }
    public void NewGame()
    {
        gameData = new GameData();
    }
    public void LoadGame()
    {
        gameData = dataHandler.Load();  //从数据处理器中处理（文件夹）之前保存的存档 赋值给gamedata（数据类型）
        if(this.gameData == null)
        { 
            Debug.Log("无存档数据，创建新游戏");
            NewGame();
        }
        // 通知所有组件加载数据
        foreach (ISavedManager savedManager in savedManagers)
        {
            savedManager.LoadData(gameData);
        }     
    }
    public void SaveGame() {
        // 收集所有组件的数据
        foreach (ISavedManager saveManager in savedManagers)
        {
            saveManager.SaveData(ref gameData);
        }
        //使用数据处理器保存数据
        dataHandler.Save(gameData);
    }
    private void OnApplicationQuit()
    {//退出时自动保存
        SaveGame();
    }
    //使用LINQ查找所有实现ISavedManager的MonoBehaviour     返回组件列表
    private List<ISavedManager> FindAllSaveManger()
    {
        IEnumerable<ISavedManager> savedManagers = FindObjectsOfType<MonoBehaviour>(true).OfType<ISavedManager>();
        return new List<ISavedManager>(savedManagers);
    }
    public bool HasSavedData()
    {
        if(dataHandler.Load()!=null)  //如果保存的场景的里面存在数据，也就是游玩过，return true
            return true;

        return false;
    }
}
```

上述5个类是实现保存的基本模块，如果需要保存数据，则实现ISaveManager接口的方法就可以保存数据，

#### 类关系图（简化）

```
SaveManager (MonoBehaviour)
│
├── Manages → FindDataHandler (文件IO、加密)
│   └── Operates → GameData (游戏数据结构)
│       └── Contains → Serializable_Dictionary (可序列化字典)
│
├── Collects → List<ISavedManager> (存档组件接口)
│   └── Implemented by various MonoBehaviour components
│
└── Uses → JsonUtility, System.IO, LINQ
```

#### 关键交互流程

1. **初始化**：
   - `SaveManager.Awake` 创建 `FindDataHandler`，查找所有 `ISavedManager` 组件，调用 `LoadGame`。
   - `LoadGame` 通过 `dataHandler.Load` 加载 `GameData`，若不存在则调用 `NewGame` 初始化。
   - 加载完成后，通知所有 `ISavedManager` 组件（`savedManager.LoadData`）。
2. **保存游戏**：
   - `SaveManager.SaveGame` 收集所有 `ISavedManager` 组件的数据（`saveManager.SaveData`）。
   - 调用 `dataHandler.Save` 将 `GameData` 序列化为 JSON 并加密（可选），写入文件。
3. **数据序列化**：
   - `Serializable_Dictionary` 在序列化前将字典拆分为两个列表（`OnBeforeSerialize`）。
   - 反序列化后从列表重建字典（`OnAfterDeserialize`）。
4. **加密**：
   - `FindDataHandler.EncryptDescrypt` 在保存/加载时对 JSON 字符串进行异或加密/解密。
   - 

#### 实现的流程

- **数据加载流程**（`LoadGame`）：

  1. `SaveManager` 通过 `FindAllSaveManger()` 找到所有实现 `ISaveManager` 的组件（如背包、技能树等）。
  2. 调用每个组件的 `LoadData(gameData)`，将反序列化后的 `GameData` 分发到各个组件，由组件自行处理数据分配（如更新UI、初始化状态）。

  ```C#
  foreach (ISavedManager savedManager in savedManagers) {
      savedManager.LoadData(gameData);
  }
  ```

- **数据保存流程**（`SaveGame`）：

  1. `SaveManager` 遍历所有 `ISaveManager` 组件，调用其 `SaveData(ref gameData)`。
  2. 每个组件将自身数据写入到传入的 `GameData` 对象中（如更新 `gameData.inventory`）。
  3. 最终由 `FindDataHandler` 将 `GameData` 序列化为JSON并保存到文件。

  ```C#
  foreach (ISavedManager saveManager in savedManagers) {
      saveManager.SaveData(ref gameData);
  }
  dataHandler.Save(gameData);
  ```

# MainScene

在项目，分为Meun场景和Main场景，Menu场景则是用户进入游戏的菜单场景，包括继续游戏，新游戏以及退出的模块。同时在进入主场景的时候采用淡入的方式进入。以下是具体的实现：

在实现进入Menu场景淡入的效果，采用了动画的方式进行，在动画的第一帧打上全黑的图片，将透明度设置为不透明，在动画的最后一帧将全黑的图片的透明度降低为0，则显示Menu场景的内容。同时在玩家死亡，也采用此效果，在玩家死亡后，屏幕逐渐变黑，并且在1s后出现死亡的文本，同时2.5s后出现重新开始的按钮。

**UI_Fade_Scene类**：在此类中，只有Fadeout和FadeIn方法进行动画的播放，如果需要播放则调用

```C#
public class UI_FadeScene : MonoBehaviour
{
    private Animator anim;

    private void Start()
    {
        anim = GetComponent<Animator>();    
    }
    public void FadeOut() => anim.SetTrigger("FadeOut");
    public void FadeIn() => anim.SetTrigger("FadeIn");
}
```

**UI类**：在该类中实现了死亡弹出文本以及重新开始按钮的内容

```C#
public class UI : MonoBehaviour,ISavedManager
{
    [Header("Dead")]
    [SerializeField] private GameObject endText;
    [SerializeField] private UI_FadeScene fadeScene;
    [SerializeField] private GameObject RestartButton;
    [Space]
    private void Awake()
    {
        fadeScene.gameObject.SetActive(true);
    }
     public void SwitchOnEndScreen()
     {

     fadeScene.FadeOut(); //渐入
     StartCoroutine(EndScreenCorutione());
     }

     IEnumerator EndScreenCorutione()//等待1.5s后屏幕出现文本
     {
         yield return new WaitForSeconds(1f);
         endText.SetActive(true);

         yield return new WaitForSeconds(1.5f);
         RestartButton.SetActive(true);
     }
     public void RestartGameButton() =>GameManager.instance.RestartScene();
}
```

**PlayeDeadState类**：在玩家死亡后，调用SwitchOnEndScreen（）方法，实现黑屏以及弹出文本

```C#
public class PlayerDeadState : PlayerState
{
 	  public override void Enter()
    	{
        base.Enter();
        GameObject.Find("Canvas").GetComponent<UI>().SwitchOnEndScreen();//死亡后调用动画
    	}
}
```

在Canvas中，ReStartButton按钮是默认关闭的，在按钮中添加监听事件，当检查到事件触发，则将按钮开启

# CheckPoint模块

CheckPoint也就是复活点，在项目中我们通过采用动画来播放CheckPoint的默认状态，以及点亮后的状态，通过CheckPoint脚本来控制动画。具体实现：首先创建一个空物体，并且挂载上CheckPoint脚本，与此同时给该物体添加BoxColider以及Animator组件，以便通过脚本来实现动画的播放。在CheckPoint脚本中，使用OnTriggerEnter2D来检测与玩家的碰撞，当玩家走到检查点的碰撞器范围时，OnTriggerEnter2D检测到Player，开始点亮CheckPoint，并且播放动画，因为没有退出动画所以一直播放，使用的是Trigger参数，而非bool

```C#
public class CheckPoint : MonoBehaviour
{
    private Animator anim;
    public bool activated;
    private void Awake()
    {
        anim = GetComponent<Animator>();
    }
    private void OnTriggerEnter2D(Collider2D collision)
    {
        if(collision.GetComponent<Player>() != null)
        {
            ActivateCheckPoint();
            SaveManager.instance.SaveGame();//点亮检查点保存游戏
        }
    }
    public void ActivateCheckPoint()
    {
        if (activated == false)
        {
            AudioManager.instance.PlaySFX(5, null);           
        }
        activated = true;
        anim.SetBool("Active", true);
    }
}
```

在实现点亮的基本逻辑后，因为在游戏的给出，肯定不止一个检测点，一般为最近点亮的检测点为复活点，所以为此我们需要给每一个检测点添加一个Id，以便找到最近的检查点。具体逻辑为：采用[ContextMenu("创建复活点Id")]这个属性为脚本中的方法在InSpector中自定义一个上下文菜单项，手动的生成一个随机的Id给检查点。

定义一个FindClosestCheckpoint（）方法来实现寻找最近的检查点，（**前提需要在GameData中定义一个 public Serializable_Dictionary<string, bool> checkpoints 的检查点字典将所有的检查点保存，使用foreach变量字典checkpoints，并且使用自带的Add方法，将每个检查点的Id和激活状态存入 **），定义一个float类型的变量closestDistance以及一个CheckPoint的变量closestCheckpoint来找到最近的距离和检查点，再次去遍历checkpoints，并且在遍历的过程中使用Vector2自带的Distance方法找到每个检查点与玩家间的距离，并且赋值给distanceToCheckpoint这个变量，在通过if判断distanceToCheckpoint是否小于closestDistance 并且 已经激活，如果是则将distanceToCheckpoint赋值给closestDistance，将此检查点赋值给closestCheckpoint。此为最近的检查点并且进行返回，同时将最近的检查点Id赋值给GameData中的closetCheckPointId。

在给每个检测点赋值Id后，开始寻找最近的检查点，实现定义一个能储存CheckPoint类的数组，定义数组后，需要将所有的CheckPoint类进行存入数组，通过实现ISaveManager接口中的SaveData方法（自定义的保存和加载的接口）来实现存入以及保存，保存成功。

下一步加载最近的检查点，使用LoadClosetCheckPoint（）方法加载，首先判断是否存在closetCheckPointId，不存在，则说明不存在最近的检查点。存在则将最近检查点ID存入变量closestCheckpointId（定义在GameManager中），然后变量CheckPoint类数组，判断每一个遍历的检查点的Id是否与最近的Id相同，如果相同，则将最近检查点的Id赋值给玩家（将玩家传送到检查点）

**GameData类**

```C#
public Serializable_Dictionary<string, bool> checkpoints;
public string closetCheckPointId;
```

**GameManager类**

```C#
[SerializeField] private CheckPoint[] checkPoints;
[SerializeField] public string closestCheckpointId;

    public void SaveData(ref GameData gameData)
    {   
        if (FindClosestCheckpoint() != null)//如果最近的检查点不为空
            gameData.closetCheckPointId = FindClosestCheckpoint().Id;//将最近的检查点ID存入数据
        gameData.checkpoints.Clear(); // 清空原有数据
        foreach(CheckPoint checkPoint in checkPoints)
        {
            gameData.checkpoints.Add(checkPoint.Id,checkPoint.activated);///将检查点的ID和激活状态存入数据
        }
    }
    public void LoadCheckpoint(GameData gameData)
    {
        foreach (KeyValuePair<string, bool> pair in gameData.checkpoints)
        //遍历字典，如果字典的键与checkPoints（每个复活点的Id）中的id相符合，并且已经激活，则让复活点的动画播放
        {
            foreach (CheckPoint check in checkPoints)
            {
                if (check.Id == pair.Key)
                {
                    if (pair.Value == true)
                        check.ActivateCheckPoint();
                }
            }
        }
    }

    private void LoadClosetCheckPoint(GameData _data)
    {
        if(_data.closetCheckPointId == null)    
            return;
        closestCheckpointId = _data.closetCheckPointId; ;//将最近检查点ID存入变量
        foreach (CheckPoint checkPoint in checkPoints)
        {
            if (closestCheckpointId == checkPoint.Id)
                player.position = checkPoint.transform.position;
        }
    }
    public CheckPoint FindClosestCheckpoint()//找到最近的检查点
    {
        float closestDistance = Mathf.Infinity;//正无穷
        CheckPoint closestCheckpoint = null;

        foreach (var checkpoint in checkPoints)//遍历所有的检查点
        {
            float distanceToCheckpoint = Vector2.Distance(player.position, checkpoint.transform.position);//计算玩家和检查点之间的距离
            if (distanceToCheckpoint < closestDistance && checkpoint.activated == true)//如果距离小于最近距离且检查点激活
            {
                closestDistance = distanceToCheckpoint;//更新最近距离
                closestCheckpoint = checkpoint;//更新最近检查点
            }
        }
        return closestCheckpoint;
    }
```

**1.检查点ID生成**

- 每个检查点（`CheckPoint`）在Unity编辑器中提供一个按钮，点击后生成一个**唯一ID（GUID）**，用于标识该检查点。
- 这个ID在游戏保存时用于记录检查点的状态（是否激活）。

**2. 检查点激活**

- 当玩家触碰到检查点时：
  - 如果该检查点**未被激活**，则播放音效和动画，并标记为已激活。
  - 立即触发游戏保存，记录当前所有检查点的状态。

**3. 查找最近的检查点**

- 遍历所有**已激活**的检查点，计算它们与玩家当前位置的距离。
- 找出**距离最近**的检查点，并返回该检查点。
- 如果所有检查点均未激活，则返回`null`。

**4. 游戏数据保存**

- 最近检查点：
  - 找到最近的已激活检查点，保存其ID。
- 所有检查点状态：
  - 保存每个检查点的ID及其激活状态（`true`/`false`）。

**5. 游戏数据加载**

- 加载最近检查点：
  - 如果存档中有最近检查点ID，则找到对应的检查点，并将玩家传送至该位置。
  - 如果没有最近检查点（如首次游戏），则不做处理。
- 加载检查点状态：
  - 遍历所有检查点，如果存档中记录为已激活，则播放激活动画。





# AudioManager

## 错误分析

在最开始我准备采用ScriptableObject进行音频的管理，便于扩展，所以需要2个带实现，一个是Audio Setting类，一个是AudioManager类，前者通过继承ScriptableObject类，进行数据的存储管理，后者直接加载和播放音频，包含背景音乐和音效的播放和暂停，采用单例模式提高全局的一个入口进行使用。

**AudioSetting类**

```C#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;


[CreateAssetMenu(fileName = "AudioSettings", menuName = "Audio/Audio Settings", order = 1)]
public class AudioSetting : ScriptableObject
{
    [SerializeField] public float sfxMinimumDistance;   
    [SerializeField] public AudioSource[] sfx;
    [SerializeField] public AudioSource[] bgm;
}

```

**AudioManager类**

```C#
using System.Collections;
using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEngine;

public class AudioManager : MonoBehaviour
{
    public static AudioManager instance;
    public AudioSetting audioSetting;


    public bool playbgm;
    private int bgmIndex;
    private void Awake()
    {
        if (instance != null)
            Destroy(instance.gameObject);
        else
            instance = this;
    }
    private void Update()
    {
        if (!playbgm)
            StopAllBGM();
        else
        {
            if (!audioSetting.bgm[bgmIndex].isPlaying)
                PlayBGM(bgmIndex);
        }
    }
    public void PlaySFX(int _sfxIndex, Transform _source)
    {
        if (audioSetting.sfx[_sfxIndex].isPlaying)
            return;  
        if (_source != null && Vector2.Distance(PlayerManager.instance.player.transform.position, _source.position) > audioSetting.sfxMinimumDistance)
            return;

        if (_sfxIndex < audioSetting.sfx.Length)
        {
            audioSetting.sfx[_sfxIndex].pitch = Random.Range(0.85f, 1.1f);
            audioSetting.sfx[_sfxIndex].Play();
        }
    }
    public void StopSFX(int _sfxIndex) => audioSetting.sfx[_sfxIndex].Stop();



    public void PlayRandomBGM()
    {
        bgmIndex = Random.Range(0, audioSetting.bgm.Length);
        PlayBGM(bgmIndex);
    }
    public void PlayBGM(int _bgmIndex)
    {
        bgmIndex = _bgmIndex;

        StopAllBGM();
        audioSetting.bgm[bgmIndex].Play();

    }
    public void StopAllBGM()
    {
        for (int i = 0; i < audioSetting.bgm.Length; i++)
        {
            audioSetting.bgm[i].Stop();
        }
    }

}
```

**代码完成后，首先在Inspector面板创建一个空的Game object对象，并且挂载相应的脚本，在Asset中创建一个Audio Setting的资产对象，在AudioSetting中存在2个Audio source数组，分别是sfx和bgm，当我从Asset资产直接拖拽音频文件给sfx数组和bgm数组时，发现无法进行拖拽，当我重新创建一个空物体并且给其添加AudioSource组件，在进行拖拽时出现类型不匹配的问题**

*最后的原因如下*：

1. `AudioSource`是一个组件（Component），而音频文件（AudioClip）是资源（Asset），它们是不同的类型。
2. 你的`AudioSetting`脚本中定义的`sfx`和`bgm`数组是`AudioSource[]`类型，但你想拖入的是`AudioClip`类型。

**于是改变Audio Setting中的bgm和sfx的类型为AudioClip，然后在AudioManager中动态创建AudioSource**

具体如下

**AudioSetting**

```C#
[CreateAssetMenu(fileName = "AudioSettings", menuName = "Audio/Audio Settings", order = 1)]
public class AudioSetting : ScriptableObject
{
    // 存储音效最小距离
    [SerializeField] public float sfxMinimumDistance;
    // 存储音效的AudioSource数组
    [SerializeField] public AudioClip[] sfx;
    // 存储背景音乐的AudioSource数组
    [SerializeField] public AudioClip[] bgm;
}
```

**AudioManager**

```C#
using System.Collections;
using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEngine;

public class AudioManager : MonoBehaviour
{
    public static AudioManager instance;

    public AudioSetting audioSetting;


    public bool playbgm;
    private int bgmIndex;

    private AudioSource bgmSource;
    private AudioSource sfxSource;
    private void Awake()
    {
        if (instance != null)
            Destroy(instance.gameObject);
        else
            instance = this;

        bgmSource = gameObject.AddComponent<AudioSource>();
        sfxSource = gameObject.AddComponent<AudioSource>();
    }
    private void Update()
    {
        if (!playbgm)
            StopAllBGM();
        else
        {
            if(!bgmSource.isPlaying&&audioSetting.bgm.Length > 0)
                PlayBGM(bgmIndex);
        }
    }
    public void PlaySFX(int _sfxIndex, Transform _source)
    {
        if (_sfxIndex >= audioSetting.sfx.Length || audioSetting.sfx[_sfxIndex] == null)
            return;  //如果音乐正在播放，则退出，不影响原有的播放
        if (_source != null && Vector2.Distance(PlayerManager.instance.player.transform.position, _source.position) > audioSetting.sfxMinimumDistance)
            return;

        if (_sfxIndex < audioSetting.sfx.Length)
        {
            // 动态设置AudioSource并播放
            sfxSource.pitch = Random.Range(0.85f, 1.1f);
            sfxSource.PlayOneShot(audioSetting.sfx[_sfxIndex]);  // 使用PlayOneShot避免打断其他音效
        }
    }
    public void StopSFX(int _sfxIndex) => sfxSource.Stop();



    public void PlayRandomBGM()
    {
        bgmIndex = Random.Range(0, audioSetting.bgm.Length);
        PlayBGM(bgmIndex);
    }
    public void PlayBGM(int _bgmIndex)
    {
        bgmIndex = _bgmIndex;

        StopAllBGM();
        bgmSource.clip = audioSetting.bgm[bgmIndex];
        bgmSource.loop = true;
        bgmSource.Play();

    }
    public void StopAllBGM()
    {
        for (int i = 0; i < audioSetting.bgm.Length; i++)
        {
            bgmSource.Stop();
        }
    }

}
```

即可成功进行拖拽

## 具体实现

在类银河恶魔城这个项目，采用单例模式进行管理音频，确保全局只存在一个实例 ，在这个项目中存在两组音频，分别是音效以及背景音乐，在Audio Setting类中通过sfx，bgm这两个AudioClip变量进行管理整个音频文件。

```C#
//unity自带的音频组件，使用数组可以在Inspector中方便地拖拽分配音频源
    [SerializeField] public AudioClip[] sfx;
    // 存储背景音乐的AudioSource数组
    [SerializeField] public AudioClip[] bgm;
```

同样使用2组函数进行管理音频的播放和暂停,同时使用int变量bgmIndex 记录当前的播放的bgm，便于管理

- 提供播放/停止音效的方法
- 提供播放/停止背景音乐的方法，包括随机播放功能

```c#
 private void Update()
    {
        if (!playbgm)
            StopAllBGM();
        else
        {
            if(!bgmSource.isPlaying&&audioSetting.bgm.Length > 0)
                PlayBGM(bgmIndex);
        }
    }
    public void PlaySFX(int _sfxIndex, Transform _source)
    {
        if (_sfxIndex >= audioSetting.sfx.Length || audioSetting.sfx[_sfxIndex] == null)
            return;  //如果音乐正在播放，则退出，不影响原有的播放
        if (_source != null && Vector2.Distance(PlayerManager.instance.player.transform.position, _source.position) > audioSetting.sfxMinimumDistance)
            return;

        if (_sfxIndex < audioSetting.sfx.Length)
        {
            // 动态设置AudioSource并播放
            sfxSource.pitch = Random.Range(0.85f, 1.1f);
            sfxSource.PlayOneShot(audioSetting.sfx[_sfxIndex]);  // 使用PlayOneShot避免打断其他音效
        }
    }
    public void StopSFX(int _sfxIndex) => sfxSource.Stop();



    public void PlayRandomBGM()
    {
        bgmIndex = Random.Range(0, audioSetting.bgm.Length);
        PlayBGM(bgmIndex);
    }
    public void PlayBGM(int _bgmIndex)
    {
        bgmIndex = _bgmIndex;

        StopAllBGM();
        bgmSource.clip = audioSetting.bgm[bgmIndex];
        bgmSource.loop = true;
        bgmSource.Play();

    }
    public void StopAllBGM()
    {
        for (int i = 0; i < audioSetting.bgm.Length; i++)
        {
            bgmSource.Stop();
        }
    }
```

在实现音效效果后，同时需要对音频的播放距离进行限制，也就是离人物越远，音效效果越小。这样可以减少混乱，比如给skeleton添加走路音效，但是不进行检查，这样player很远距离就可以听见，造成混乱。在PlaySFX方法添加判断条件，如果玩家当前与目标的距离小于自定义的最小距离值（外部设置），则直接退出播放，不产生声音。同时/如果音乐正在播放，则退出，不影响原有的播放

```C#
//添加变量 
[SerializeField] private float sfxMInimumDistance;

//在播放PlaySFX方法进行修改
 public void PlaySFX(int _sfxIndex, Transform _source)
    {
        if (_sfxIndex >= audioSetting.sfx.Length || audioSetting.sfx[_sfxIndex] == null)
            return;  //如果音乐正在播放，则退出，不影响原有的播放
        if (_source != null && Vector2.Distance(PlayerManager.instance.player.transform.position, _source.position) > audioSetting.sfxMinimumDistance)
            return;

        if (_sfxIndex < audioSetting.sfx.Length)
        {
            // 动态设置AudioSource并播放
            sfxSource.pitch = Random.Range(0.85f, 1.1f);
            sfxSource.PlayOneShot(audioSetting.sfx[_sfxIndex]);  // 使用PlayOneShot避免打断其他音效
        }
    }
```

## 音量保存

##### 音量控制

在此之前，需要在窗口中（Windows）找到音频混合器，并创建一个混合器以及所需要的2个组，在此项目中为SFX和BGM，并将其暴露给脚本进行控制。因为我使用的是AudioClip而非AudioSource，所有需要在AudioManager中进行修改，修改如下

```C#
using UnityEngine.Audio; // 添加这个命名空间

public class AudioManager : MonoBehaviour
{
    // 添加这些变量
    [SerializeField] private AudioMixer mainMixer;
    [SerializeField] private AudioMixerGroup bgmMixerGroup;
    [SerializeField] private AudioMixerGroup sfxMixerGroup;

    private void Awake()
    {
        // ... 原有代码 ...
        
        bgmSource = gameObject.AddComponent<AudioSource>();
        sfxSource = gameObject.AddComponent<AudioSource>();
        
        // 将AudioSource分配到对应的混合器组
        bgmSource.outputAudioMixerGroup = bgmMixerGroup;
        sfxSource.outputAudioMixerGroup = sfxMixerGroup;
    }
    
    // ... 其他原有代码 ...
}
```

##### 绑定slider

并且将创建的Audio Mixer资源拖拽到AudioManager脚本的`mainMixer`字段，将对应的混合器组(BGM和SFX)拖拽到相应的字段。这样即是将音频混合器与项目的音量进行控制。之后通过UI_volumeSlider类实现将UI_Options中的Slider与调动音量的大小进行绑定。将创建好的脚本挂载到Canvas中的SFX和BGM中，并且将相应的资源拖拽到对应脚本的变量中实现滑块控制音量大小

![image-20250508120437864](E:\typora_note\GameEngineStudy\assets\image-20250508120437864.png)

![image-20250508120554390](E:\typora_note\GameEngineStudy\assets\image-20250508120554390.png)

```C#
public class UI_volumeSlider : MonoBehaviour
{
    public Slider slider;
    public string parameter;
    [SerializeField] private AudioMixer audioMixer;
    [SerializeField] private float multiplier;
    public void SliderValue(float _value) =>audioMixer.SetFloat(parameter, Mathf.Log10(_value) * multiplier);

    public void LoadSlider(float _value)
    {
        if (_value >= 0.001f)
        {
            slider.value = _value;
        }
    }
}
```

##### 音量保存

首先理清需要保存的内容，分别是音频混合器组的名字和对应的slider.value，两者是相互对应的，此时需要字典来进行保存，在GameData（游戏数据的结构）中声明

```C#
public class GameData//定义游戏数据的结构
{
    public Serializable_Dictionary<string, float> volumeSettings;  //Serializable_Dictionary类是将字典序列化的类
    public GameData(){
        volumeSettings = new Serializable_Dictionary<string, float>();
	}
}
```

声明完成后，需要实现相应的的保存逻辑，在UI类中首先声明一个UI_volumeSlider类的数组（名字为volumeSettings），在实现保存接口ISaveManager的两个函数，

包括SaveData和LoadData，其中SaveData的逻辑为 使用foreach循环遍历volumeSettings数组的每一个UI_volumeSlider组件实例（包含SFX和BGM），针对每个组件实例，将其parameter字段作为键，slider.value也就就是滑块的大小作为值,添加到gameData.volumeSettings字典中。

而LoadData函数使用嵌套的foreach循环，外层循环遍历gameData.volumeSettings中的每个键值对，也就是保存的音量值和parameter，内层循环遍历volumeSettings数组中的每一个UI_volumeSlider（在项目中总共2个SFX，BGM）,对于每个`UI_volumeSlider`实例，检查其`parameter`字段是否和当前遍历到的键值对的键相等。若相等，就调用`item.LoadSlider(pair.Value)`方法，把对应的音量值加载到该组件上。

```C#
public class UI{
	[SerializeField] private UI_volumeSlider[] volumeSettings;  //保存音量
	public void LoadData(GameData gameData)  //读取保存的音量数据
    {  //定义一个字典的变量去遍历volumeSettings的每一个键值对
        foreach (KeyValuePair<string,float >  pair in gameData.volumeSettings)
        {
            //定义一个UI_volumeSlider类的 变量去遍历 该类下的每一个组件，找到与保存数据中键值相同的parameter值，将key值传入函数中
            foreach (UI_volumeSlider item in volumeSettings)
            {    
                if (item.parameter == pair.Key)
                    item.LoadSlider(pair.Value);
            }
        }
    }
    public void SaveData(ref GameData gameData) //保存音量的数据   
    {
        gameData.volumeSettings.Clear();

        foreach(UI_volumeSlider item in volumeSettings)  //定义一个UI_volumeSlider类的 变量去遍历 该类下的每一个组件
        {
            gameData.volumeSettings.Add(item.parameter, item.slider.value);//将组件中的parameter和滑动条的值添加到字典中
        }
    }
}
```

##### AreaSound

AreaSound区域，在你进入的时候，会播放音效，当你退出区域的范围后，声音会变小，为了实现该功能，需要使用box colider2D这个组件，并且勾选触发器，通过碰撞器检测到Player来管理以及播放声音。定义变量areaSoundIndex

来旋转播放的音效的Id。因为退出的时候声音是逐渐淡出的效果，为了实现这个功能，采用协程控制的方法，并且定义一个变量为声音的初始值，以便退出区域，将声音恢复到最初的强度。使用while循环进行控制，当声音的大小>0.1f时，进入循环，每次基于当前音量减少20%，同时使用 yield return new WaitForSeconds(.25f);  //每0.25秒调整暂停协程，以达到淡出的效果，最后判断声音是否<.1f，如果小于，则直接退出播放，并且将之前以及赋值过的变量 赋值个给声音的大小

**AreaSound类**

```C#
[SerializeField] private int areaSoundIndex;
private bool isPlaying = false;

private void OnTriggerEnter2D(Collider2D collision)
 {
     if (collision.GetComponent<Player>() != null && !isPlaying)
     {
         isPlaying = true;
         AudioManager.instance.PlaySFX(areaSoundIndex,null);
     }
 }

 private void OnTriggerExit2D(Collider2D collision )
 {
     if (collision.GetComponent<Player>() != null && isPlaying)
         isPlaying = false;
         AudioManager.instance.StopSFXwithVolume(areaSoundIndex);
 }
```

**AudioManager类**

```C#
   public void StopSFXwithVolume(int _index)
   {
       sfxSource.clip = audioSetting.sfx[_index];
       StartCoroutine(DecreaseVolume(sfxSource));
   }

    
   private IEnumerator DecreaseVolume(AudioSource audio)//实现areaSound的淡出效果
   {
       float defaultVolum = audio.volume;   
       while(audio.volume > .1f)
       {
           audio.volume -=audio.volume *.2f;   //每次基于当前音量减少20%，实现平滑过渡
           yield return new WaitForSeconds(.25f);  //每0.25秒调整一次音量
           if (audio.volume <= .1f)
           {
               audio.Stop();
               audio.volume = defaultVolum;   //退出后恢复默认声音，下次再次进入则为默认声音
               break;
           }
       }
   }
```

# 粒子系统

# 攻击状态实现

玩家的基础攻击通过状态机管理（如`PlayerPrimaryAttackState`），进入攻击状态时：

- 重置角色速度（`SetZeroVelocity`），确保攻击时不会移动。
- 根据连招计数器（`comboCounter`）播放对应动画（`anim.SetInteger("ComboCounter", comboCounter)`），并设置攻击方向（基于输入或角色朝向）。
- 攻击结束后通过状态机切换回 idle 状态，同时更新连招计时器（`lastTimeAttacked`），控制连招窗口（`comboWindow = 2`秒）
- 在播放攻击的动画时，添加帧事件，这个帧事件用来检测攻击范围（圆形范围检测）内的所有碰撞器，则存入碰撞体数组中，遍历这个碰撞体数组，如果其中的碰撞体携带敌人组件，获取敌人的stat组件（实体属性），调用玩家的dodamage方法，对敌人造成伤害，如果存在武器，则调用武器效果释放，

![image-20250829152128004](/notes-assets/GameEngineStudy/assets/image-20250829152128004.png)

1. **克隆体攻击（Clone Skill）**
   - 克隆体由`Clone_Skill_Controller`控制，通过`SetupClone`初始化位置、攻击目标和持续时间。
   - 攻击时检测范围内敌人，调用`PlayerStats.CloneDoDamage`并可能触发武器特效（`weaponData.Effect`）或克隆体复制（`CreateClone`）。
2. **黑洞技能（BlackHole Skill）**
   - 黑洞检测黑洞范围的碰撞器的所有碰撞体，冻结碰撞器中所有包含enemy的碰撞体，释放时生成克隆体或水晶攻击目标（`CloneAttackLogic`），随机选择目标并生成攻击偏移（`xoffSet`）。
3. **剑技（Sword Skill）**
   - 剑技可反弹攻击多个敌人（`Sword_Skill_Controller`），通过`bounceAmount`控制反弹次数，每次命中后切换目标并减少反弹次数，最终返回玩家。

# 技能树

### 技能树的基础结构

技能树通过`UI_SkillTreeSlot`类实现单个技能节点，每个节点代表一个可解锁的技能或技能强化效果，整体通过 UI 层级组织为树状结构。

- 单个技能节点的属性UI_SkillTreeSlot：
  - 基础信息：技能名称（`skillName`）、描述（`skillDescription`）、解锁消耗（`skillcost`）。
  - 状态标识：`unLocked`（是否已解锁）。
  - 依赖关系：`shouldBeUnlocked`（解锁前需先解锁的前置节点）、`shouldBeLocked`（互斥的技能节点，不能同时解锁）。
  - 视觉反馈：通过`skillImage`颜色区分状态（锁定时为`lockedSkillColor`，解锁后为白色）。

### 技能解锁的核心逻辑

在外部拖入每个技能解锁需要满足的前置条件和互斥技能。

1. **检查前置依赖**
   若当前技能节点存在前置节点（`shouldBeUnlocked`数组），必须所有前置节点均已解锁（`unLocked == true`），否则无法解锁当前技能。

   ```csharp
   // 示例：检查前置技能是否全部解锁
   for (int i = 0; i < shouldBeUnlocked.Length; i++)
   {
       if (shouldBeUnlocked[i].unLocked == false)
           return; // 前置未解锁，终止解锁流程
   }
   ```

2. **检查互斥技能**
   若当前技能节点存在互斥节点（`shouldBeLocked`数组），则所有互斥节点必须处于未解锁状态（`unLocked == false`），否则无法解锁当前技能。

   ```csharp
   // 示例：检查互斥技能是否已解锁
   for (int i = 0; i < shouldBeLocked.Length; i++)
   {
       if (shouldBeLocked[i].unLocked == true)
           return; // 互斥技能已解锁，终止解锁流程
   }
   ```

3. **消耗与状态更新**
   满足依赖条件后，检查玩家是否拥有足够资源（如货币），若满足则标记技能为已解锁（`unLocked = true`），并更新 UI 颜色为白色。

   ```csharp
   // 示例：更新解锁状态
   if (PlayerManager.instance.HaveEnoughMOney(skillcost))
   {
       unLocked = true;
       skillImage.color = Color.white; // 视觉反馈：解锁后变白
   }
   ```

### 技能与技能树的关联

在每个技能类中添加声明一个技能树的变量用于获取UI_SkillTreeSlot，建立技能与技能树节点的关联，技能类通过该变量访问对应 `UI_SkillTreeSlot` 的 `unLocked` 属性，判断技能是否已解锁。技能类会监听该 `UI_SkillTreeSlot` 节点的点击事件（通过 `GetComponent<Button>().onClick.AddListener`），当玩家在技能树中点击解锁该节点时，触发技能的解锁逻辑（如上述 `UnlockBlackHole` 方法）

1. **技能类中的解锁检查**
   技能类（继承自`Skill`）在初始化时（`Start`或`CheckUnlock`），通过读取对应`UI_SkillTreeSlot`的`unLocked`状态，决定是否启用技能功能。
   例如，冲刺技能（`Dash_Skill`）的解锁逻辑：

   ```csharp
   private void UnlockDash()
   {
       if (dashUnlockedButton.unLocked && !dashUnlocked)
           dashUnlocked = true; // 技能可用状态更新
   }
   ```

2. **技能使用权限控制**
   技能使用前会检查解锁状态，例如 UI 中快捷键触发技能时：

   ```csharp
   // 示例：UI中检查技能是否解锁
   if (Input.GetKeyDown(KeyCode.LeftShift) && skills.dash.dashUnlocked)
       SetCooldownOf(dashImage); // 只有解锁后才允许使用
   ```

# ScriptObject

在 Unity 中，使用 **`List`+ `Dictionary`** 的形式管理 `ScriptableObject`武器数据，可以结合 **灵活遍历（List）** 和 **快速查找（Dictionary）** 的优势，特别适合需要频繁按名称或ID查找武器的游戏（如FPS、RPG等）。因为Dictionary的查找效率高

###  **创建 `WeaponSO`类（ScriptableObject）**

首先，定义一个 `WeaponSO`类，用于存储单把武器的配置信息：

```C#
// WeaponSO.cs
using UnityEngine;

[CreateAssetMenu(fileName = "New Weapon", menuName = "Weapons/Weapon Data")]
public class WeaponSO : ScriptableObject
{
    public string weaponID;  // 唯一标识（如 "weapon_pistol"）
    public string weaponName;
    public Sprite icon;
    public int damage = 10;
    public float fireRate = 0.5f;
    // 其他属性...
}
```

**📌 使用方法：**

- •在 Unity 中 **右键 → Create → Weapons → Weapon Data**，即可创建一个新的武器配置（`.asset`文件）。
- •在 Inspector 面板调整数值，如 `damage`、`fireRate`等。

------

### **2. 创建 `WeaponDatabaseSO`存储所有武器（List<WeaponSO>）**

为了管理多个武器，我们可以创建一个 `WeaponDatabaseSO`，用 `List<WeaponSO>`存储所有武器数据：

```c#
// WeaponDatabaseSO.cs
using UnityEngine;
using System.Collections.Generic;

[CreateAssetMenu(fileName = "Weapon Database", menuName = "Weapons/Weapon Database")]
public class WeaponDatabaseSO : ScriptableObject
{
    public List<WeaponSO> weapons = new List<WeaponSO>();
    private Dictionary<string, WeaponSO> _weaponDict;

    // 初始化字典（通常在游戏启动时调用）
    public void Initialize()
    {
        _weaponDict = new Dictionary<string, WeaponSO>();
        foreach (WeaponSO weapon in weapons)
        {
            if (!_weaponDict.ContainsKey(weapon.weaponID))
            {
                _weaponDict.Add(weapon.weaponID, weapon);
            }
            else
            {
                Debug.LogError($"Duplicate weapon ID: {weapon.weaponID}");
            }
        }
    }

    // 通过ID获取武器（O(1)时间复杂度）
    public WeaponSO GetWeaponByID(string weaponID)
    {
        if (_weaponDict == null)
        {
            Debug.LogError("Weapon dictionary not initialized!");
            return null;
        }

        if (_weaponDict.TryGetValue(weaponID, out WeaponSO weapon))
        {
            return weapon;
        }

        Debug.LogError($"Weapon not found: {weaponID}");
        return null;
    }

    // 添加新武器（同时更新字典）
    public void AddWeapon(WeaponSO weapon)
    {
        if (!weapons.Contains(weapon))
        {
            weapons.Add(weapon);
            _weaponDict.Add(weapon.weaponID, weapon);
        }
    }
}
```

**📌 使用方法：**

- •在 Unity 中 **右键 → Create → Weapons → Weapon Database**，创建一个武器数据库。
- •在 Inspector 面板的 `weapons`列表中添加所有武器（如 `Pistol`, `Rifle`, `Shotgun`等）。

------

### **3. 在游戏中使用武器数据**

现在，我们可以创建一个 `WeaponManager`（`MonoBehaviour`）来加载并使用这些武器：

```C#
// WeaponManager.cs
using UnityEngine;

public class WeaponManager : MonoBehaviour
{
    [SerializeField] private WeaponDatabaseSO weaponDatabase;

    private WeaponSO _currentWeapon;

    void Awake()
    {
        // 初始化武器数据库（构建字典）
        weaponDatabase.Initialize();
        
        // 示例：通过ID获取武器
        _currentWeapon = weaponDatabase.GetWeaponByID("weapon_pistol");
        if (_currentWeapon != null)
        {
            Debug.Log($"Equipped: {_currentWeapon.weaponName}");
        }
    }

    public void SwitchWeapon(string weaponID)
    {
        WeaponSO newWeapon = weaponDatabase.GetWeaponByID(weaponID);
        if (newWeapon != null)
        {
            _currentWeapon = newWeapon;
            Debug.Log($"Switched to: {_currentWeapon.weaponName}");
        }
    }
}
```


