## 一、修正并明确实验参数

请在光路图和参数说明中准确体现以下实验条件：

1. **Raman 测试**
   - 激发光源：532 nm 连续激光。
   - 光谱仪光栅：1800 lines/mm。
   - 主要用于高光谱分辨率 Raman 峰位、低频 Raman、偏振 Raman 等测试。
   - 在 Raman 模块中补充一个“标准强度 Raman 测试光路”，即不引入偏振调制，仅展示常规 Raman 强度采集流程。
2. **PL 测试**
   - 激发光源：532 nm 连续激光。
   - 光谱仪光栅：150 lines/mm。
   - 主要用于光致发光强度、发光峰位、激子 / trion / 缺陷态发光分析。
3. **SHG 测试**
   - 激发光源：1064 nm 激光。
   - 光谱仪光栅：150 lines/mm。
   - 需要体现 SHG 的二倍频信号采集，即 1064 nm 激发对应 532 nm 二次谐波信号。
   - SHG 模块中应突出非线性光学、晶体对称性、偏振依赖测试等特点。

## 二、增加标准 Raman 强度测试示意图

在 Raman 光路系统中新增一个“标准 Raman 强度测试”模块，区别于偏振 Raman：

- 光路流程建议为：

532 nm 激光器 → 激光清洁滤光片 → 反射镜 → 分束镜 / 二向色镜 → 显微物镜 → 样品 → Raman 散射信号返回 → 边缘滤光片 / 陷波滤光片 → 光谱仪 → CCD 探测器。

- 该模块不需要加入半波片、偏振片、检偏器等复杂偏振器件。
- 图中需要清楚区分：
  - 入射激光路径；
  - Raman 散射收集路径；
  - 瑞利散射滤除；
  - 光谱仪采集。
- 视觉上应作为 Raman 系统中的基础测试模式，和偏振 Raman 模块并列展示。

## 三、在侧边栏补充圆偏振测试的四种模式

请在系统侧边栏或参数说明区中新增“圆偏振测试模式”模块，展示四种圆偏振激发 / 探测组合：

1. σ⁺ excitation / σ⁺ detection
2. σ⁺ excitation / σ⁻ detection
3. σ⁻ excitation / σ⁺ detection
4. σ⁻ excitation / σ⁻ detection

同时需要标注其物理含义：

- σ⁺/σ⁺：同手性圆偏振，co-circular configuration；
- σ⁺/σ⁻：交叉圆偏振，cross-circular configuration；
- σ⁻/σ⁺：交叉圆偏振，cross-circular configuration；
- σ⁻/σ⁻：同手性圆偏振，co-circular configuration。

在图形设计上，可以使用四个小卡片展示，每个卡片包含：

- 入射圆偏振图标；
- 探测圆偏振图标；
- 模式名称；
- 应用说明，例如 valley polarization、valley coherence、circular dichroism、magneto-PL 等。

## 四、系统光路目录中增加“激光器介绍”

请在系统光路目录中新增一个“Laser Source / 激光器介绍”页面或章节，内容包括：

1. **连续激光器 CW Laser**
   - 常用于 Raman、PL、常规显微光谱测试。
   - 示例波长：532 nm。
   - 特点：功率稳定、谱线窄、适合稳态光谱。
2. **皮秒激光器 Picosecond Laser**
   - 脉宽通常为 ps 量级。
   - 可用于时间分辨 PL、寿命测试、泵浦-探测实验等。
   - 相比飞秒激光，时间分辨能力较高，同时谱宽相对较窄。
3. **飞秒激光器 Femtosecond Laser**
   - 脉宽通常为 fs 量级。
   - 常用于超快光谱、非线性光学、SHG、泵浦-探测等实验。
   - 需要体现其高峰值功率、短脉冲、宽谱特性。
4. **波长选择**
   - 532 nm：常用于 Raman 和 PL 激发；
   - 1064 nm：常用于 SHG 激发；
   - 可扩展 405 nm、633 nm、785 nm 等常用激光波长。

页面中需要使用表格或卡片形式展示：

- 激光类型；
- 典型波长；
- 脉冲宽度；
- 主要用途；
- 适用光路模块。

## 五、系统光路目录中增加“光谱仪介绍”

请在系统光路目录中新增一个“Spectrometer / 光谱仪介绍”页面或章节，内容包括：

1. **光谱仪基本组成**
   - 入射狭缝；
   - 准直镜；
   - 光栅；
   - 聚焦镜；
   - CCD / EMCCD / InGaAs 探测器。
2. **光栅参数**
   - 150 lines/mm：色散较小、光谱范围宽、适合 PL 和 SHG；
   - 1800 lines/mm：色散较大、光谱分辨率高、适合 Raman，尤其是低频 Raman 或精细峰位分析。
3. **光谱分辨率与光谱范围**
   - 光栅刻线数越高，分辨率通常越高，但可覆盖波长范围变窄；
   - 光栅刻线数越低，光谱范围更宽，但分辨率降低。
4. **不同测试对应的光栅选择**
   - Raman：1800 lines/mm；
   - PL：150 lines/mm；
   - SHG：150 lines/mm。

请使用清晰的示意图展示光进入光谱仪后经过光栅分光并到达 CCD 的过程。

## 六、增加寿命测量光路

请新增一个“Lifetime Measurement / 寿命测量”光路模块，用于展示时间分辨 PL 或荧光寿命测试。

1. **脉冲激光器**
   - 可为皮秒或飞秒激光器；
   - 用于提供时间零点。
2. **单光子探测器**
   - APD、SPAD 或 PMT；
   - 用于记录单个光子到达时间。
3. **TCSPC 模块**
   - Time-Correlated Single Photon Counting；
   - 用于统计光子到达时间分布，得到 PL 衰减曲线。
4. **输出结果**
   - 显示典型指数衰减曲线：
     I(t) = I₀ exp(-t/τ)
   - 标注寿命 τ；
   - 可扩展单指数、双指数、多指数拟合说明。

1. - 关键实验参数；
   - 输出信号类型。

## 八、目录结构建议

请将系统目录调整为以下结构：

1. Overview / 系统总览
2. Standard Raman / 标准 Raman 强度测试
3. Polarization Raman / 偏振 Raman 测试
4. Photoluminescence / PL 测试
5. Polarization PL / 偏振 PL 测试
6. Circular Polarization / 圆偏振测试
7. SHG / 二次谐波测试
8. Lifetime Measurement / 寿命测量
9. Laser Source / 激光器介绍
10. Spectrometer / 光谱仪介绍
11. Optical Components / 光学元器件库
12. Signal Flow / 信号流与数据采集

## 九、显示每一个器件后的光偏振态

请在所有光路模块中增加“偏振态追踪 / Polarization State Tracking”功能，要求在光经过每一个关键光学器件之后，都实时标注当前光的偏振态。该功能不仅用于偏振 Raman、偏振 PL、圆偏振和 SHG，也应在标准 Raman、PL、寿命测量等模块中保留基础偏振状态说明。

### 1. 基本要求

在每一个光学器件后方，沿光传播方向标注当前光的偏振状态，例如：

- Linear-H / 水平线偏振；
- Linear-V / 垂直线偏振；
- Linear-θ / 任意角度线偏振；
- σ⁺ / 右旋圆偏振；
- σ⁻ / 左旋圆偏振；
- Elliptical / 椭圆偏振；
- Unpolarized / 非偏振；
- Partially polarized / 部分偏振；
- Mixed / 混合偏振态。

### 2. 器件后偏振态变化逻辑

请根据不同光学器件建立偏振态变化规则：

#### Polarizer / 起偏器

入射光经过起偏器后，应被转换为特定方向的线偏振光：

```text
Before: Unpolarized or arbitrary polarization
After: Linear-V or Linear-H or Linear-θ
```

示例标注：

```text
After Polarizer: Linear-V, 532 nm excitation
```

#### Half-wave Plate / 半波片

半波片用于旋转线偏振方向。若入射偏振方向与半波片快轴夹角为 α，则出射线偏振方向旋转 2α。

```text
Before: Linear-θ
After: Linear-(2α rotation)
```

示例标注：

```text
After HWP: Linear-θ, rotated by 2α
```

#### Quarter-wave Plate / 四分之一波片

四分之一波片用于在线偏振和圆偏振 / 椭圆偏振之间转换。

典型规则：

```text
Linear-45° + QWP → σ⁺
Linear--45° + QWP → σ⁻
Circular + QWP → Linear
Other angles → Elliptical polarization
```

示例标注：

```text
After QWP: σ⁺ circular polarization
After QWP: σ⁻ circular polarization
After QWP: Elliptical polarization
```

#### Analyzer / 检偏器

检偏器用于选择特定方向的散射光偏振分量：

```text
Before: Mixed / Linear / Circular / Elliptical
After: Linear-H or Linear-V or Linear-θ selected component
```

示例标注：

```text
After Analyzer: Linear-H Raman signal
```

#### Dichroic Mirror / 二向色镜

二向色镜主要改变光传播方向和筛选波长，通常不主动改变偏振态，但需要保留当前偏振状态：

```text
Before: Linear-V, 532 nm
After: Linear-V, 532 nm reflected
```

对于斜入射情况下，可在说明中注明：

```text
Polarization may be slightly modified due to s/p reflection difference.
```

#### Mirror / 反射镜

反射镜通常保持线偏振方向的实验室投影，但需要提示相位可能改变，尤其对圆偏振：

```text
Linear polarization: generally preserved
Circular polarization: handedness may be reversed depending on reflection geometry
```

示例标注：

```text
After Mirror: Linear-V retained
After Mirror: σ⁺ may transform to σ⁻ after reflection
```

#### Objective / 显微物镜

显微物镜通常聚焦光束，不主动设定偏振态，但高 NA 物镜可能引入纵向场分量或轻微偏振混合：

```text
Before: Linear-V
After Objective: Focused Linear-V with possible longitudinal field component
```

示例标注：

```text
After Objective: focused Linear-V excitation
```

#### Sample / 样品

样品之后的信号偏振态取决于具体测试模式：

Raman：

```text
Incident: Linear-V
Scattered Raman: Linear-H / Linear-V / Mixed, depending on Raman tensor
```

PL：

```text
Incident: 532 nm Linear-V
Emission: partially polarized PL or unpolarized PL
```

SHG：

```text
Incident: 1064 nm Linear-θ
Output: 532 nm SHG with polarization determined by nonlinear susceptibility tensor χ(2)
```

圆偏振 PL：

```text
Incident: σ⁺ or σ⁻
Emission: σ⁺ / σ⁻ components collected separately
```

#### Filter / 滤光片

滤光片主要筛选波长，不主动改变偏振态，但需要保留偏振状态：

```text
Before: Raman + Rayleigh mixed signal
After Edge Filter: Raman signal, polarization retained
```

#### Spectrometer / 光谱仪

光谱仪主要进行色散分光，进入光谱仪之前应显示最终被采集的偏振态：

```text
Before Spectrometer: Linear-H Raman signal
Detected: Spectrum under Linear-H analysis
```

#### APD / SPAD / PMT / TCSPC

寿命测量中，探测器前应显示被探测发光信号的偏振状态。如果没有偏振选择，则标注：

```text
Detected PL: polarization-integrated lifetime signal
```

如果加入检偏器，则标注：

```text
Detected PL: Linear-H selected lifetime signal
Detected PL: σ⁺ selected lifetime signal
```