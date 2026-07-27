---
title: Unity组件
date: 2026-06-27 03:47:00
categories:
  - 图形与引擎
tags:
  - GameEngineStudy
  - 笔记
---
## Hinge Joint组件

铰链组件（Hinge Joint）是一种关节组件，主要用于模拟物体间像门、秋千这类具有铰链连接的运动。铰链默认施加位置在物体的正中心，即（0，0，0）

#### 作用

- **模拟铰链运动**：让游戏对象能够绕指定轴做类似门开合、秋千摆动的旋转运动。
- **施加物理效果**：配合物理引擎，让物体的运动符合物理规律，比如物体在重力作用下的自然摆动。

#### 主要属性

- **Connected Body**：指定与当前物体通过铰链连接的另一个刚体。若不指定，默认连接到世界坐标系。
- **Anchor**：铰链在当前物体局部坐标系中的位置。
- **Axis**：物体绕着旋转的轴，在当前物体局部坐标系中定义。
- **Use Limits**：启用角度限制，开启后可设置物体旋转的最小和最大角度。
- **Min** 和 **Max**：当 `Use Limits` 启用时，这两个属性分别定义物体旋转的最小和最大角度。
- **Use Motor**：启用电机驱动，开启后物体可在电机的作用下主动旋转。
- **Target Velocity**：电机驱动时的目标旋转速度。
- **Force**：电机施加的力大小。

#### 使用步骤

1. **创建游戏对象**：创建两个或多个带有刚体组件（Rigidbody）的游戏对象，例如一个代表门，一个代表门框。
2. **添加铰链组件**：选中要添加铰链的游戏对象，在 `Inspector` 面板中点击 `Add Component`，搜索并添加 `Hinge Joint` 组件。
3. **配置属性**：根据需求设置 `Connected Body`、`Anchor`、`Axis` 等属性。

```c#
using UnityEngine;

public class HingeMotorControl : MonoBehaviour
{
    public HingeJoint hinge;
    public float targetVelocity = 100f;
    public float motorForce = 1000f;

    void Start()
    {
        // 获取铰链组件
        hinge = GetComponent<HingeJoint>();

        // 配置电机
        JointMotor motor = hinge.motor;
        motor.targetVelocity = targetVelocity;
        motor.force = motorForce;
        motor.freeSpin = false;

        // 应用电机配置
        hinge.motor = motor;
        hinge.useMotor = true;
    }
}
```

## Spring Joint组件

Spring Joint（弹簧关节）组件是一种非常有用的工具，用于模拟两个物体之间类似弹簧连接的物理效果。

#### 作用

Spring Joint 组件的主要作用是在两个刚体之间创建一个弹性连接，使得它们之间产生类似弹簧的作用力。当两个物体之间的距离发生变化时，弹簧会产生拉力或推力，使它们趋向于回到初始的相对位置。这种效果常用于模拟各种弹性连接的场景，如绳子、弹簧等。

#### 主要属性

- **Connected Body**：指定与当前物体通过弹簧连接的另一个刚体。如果不指定，默认连接到世界坐标系。
- **Anchor**：弹簧在当前物体局部坐标系中的连接点。
- **Connected Anchor**：弹簧在连接物体局部坐标系中的连接点。如果未指定连接物体，则该点是在世界坐标系中的位置。
- **Spring**：弹簧的弹性系数，值越大，弹簧越 “硬”，物体之间的拉力或推力就越强。
- **Damper**：阻尼系数，用于控制弹簧运动的衰减程度。值越大，弹簧的振动就越快停止。
- **Min Distance** 和 **Max Distance**：分别指定弹簧允许的最小和最大长度。当物体之间的距离超出这个范围时，弹簧会产生相应的力来将它们拉回或推开。
- **Auto Configure Connected Anchor**：自动根据当前物体和连接物体的位置来配置连接锚点。

#### 使用步骤

1. **创建游戏对象**：创建两个带有刚体组件（Rigidbody）的游戏对象，例如两个立方体，作为弹簧连接的两端。
2. **添加 Spring Joint 组件**：选中其中一个游戏对象，在 `Inspector` 面板中点击 `Add Component`，搜索并添加 `Spring Joint` 组件。
3. 配置属性：
   - 在 `Connected Body` 字段中选择另一个游戏对象的刚体。
   - 根据需要调整 `Spring`、`Damper`、`Min Distance` 和 `Max Distance` 等属性。

```c#
using UnityEngine;

public class SpringJointController : MonoBehaviour
{
    public SpringJoint springJoint;
    public float newSpringValue = 100f;
    public float newDamperValue = 10f;

    void Start()
    {
        // 获取 Spring Joint 组件
        springJoint = GetComponent<SpringJoint>();

        // 动态调整弹簧和阻尼系数
        springJoint.spring = newSpringValue;
        springJoint.damper = newDamperValue;
    }
}
```

## Nav Mesh Agent

### 组件作用

`NavMeshAgent` 组件为游戏对象赋予了在导航网格所定义的可行走区域内自动寻路和移动的能力。当为游戏对象添加该组件后，对象就能够智能地避开障碍物，自动规划到达目标位置的路径，并按照规划好的路径移动。

### 主要属性

- **Base Offset**：对象的垂直偏移量，可调整对象在导航网格上方或下方的位置。
- **Speed**：代理的移动速度，单位通常是米 / 秒，可根据需要调整角色的移动快慢。
- **Angular Speed**：代理转向时的角速度，即每秒转动的角度，控制角色转向的速度。
- **Acceleration**：代理的加速度，决定了代理达到最大速度的快慢程度。
- **Stopping Distance**：代理与目标位置保持的最小距离，当接近目标时，在该距离处停止移动。
- **Auto Braking**：是否启用自动刹车功能。启用后，代理接近目标时会自动减速停止；禁用则会持续移动。
- **Radius**：代理的半径，用于定义代理的碰撞范围，避免与其他代理或障碍物发生碰撞。
- **Height**：代理的高度，同样用于碰撞检测，确保代理在高度方向上不会与其他物体重叠。
- **Quality**：路径搜索的质量，有不同的预设选项，质量越高，寻路计算越精确，但可能会增加性能开销。
- **Priority**：代理的优先级，当多个代理在路径上发生冲突时，优先级高的代理会优先通过。

### 主要方法

- **SetDestination(Vector3 target)**：设置代理的目标位置，代理会自动计算并开始移动到该目标位置。

- **ResetPath()**：清除当前正在使用的路径，停止代理的移动。

- **isOnNavMesh**：一个布尔属性，用于检查代理是否在导航网格上。

- **hasPath**：一个布尔属性，用于检查代理是否有有效的路径。

- **remainingDistance**：代理到目标位置的剩余距离。

  ```c#
  using UnityEngine;
  using UnityEngine.AI;
  
  public class NavMeshAgentExample : MonoBehaviour
  {
      public Transform target; // 目标位置的 Transform
      private NavMeshAgent agent;
  
      void Start()
      {
          agent = GetComponent<NavMeshAgent>();
      }
  
      void Update()
      {
          if (target != null)
          {
              // 设置目标位置
              agent.SetDestination(target.position);
          }
      }
  }
  /*导航网格烘焙：在使用 NavMeshAgent 之前，需要确保场景中的导航网格已经正确烘焙，否则代理可能无法找到有效的路径。
  性能优化：在大型场景中，过多的 NavMeshAgent 可能会导致性能下降。可以通过合理设置代理的属性、优化导航网格的复杂度等方式来提高性能。
  动态障碍物处理：如果场景中有动态障碍物，需要使用 NavMeshObstacle 组件来处理，确保代理能够实时避开这些障碍物。*/                                 
  ```

  
