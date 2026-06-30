# Raman / PL / SHG 模块化光路系统 Web 开发指引

> 用途：本文件用于直接指导 Codex / AI 编程助手开发一套科研教学用的 Web 光路展示系统。系统重点展示 Raman、PL、SHG 以及线偏振、圆偏振测试光路。实现原则是：**模块化、HTML 优先、SVG 精确绘制、界面美观清晰、元器件简洁规范、无需拖拽、基于虚拟坐标系统进行布局**。

---

## 1. 项目目标

开发一套可在浏览器中运行的光路系统，用于展示二维材料、光谱学与非线性光学实验中的典型测试光路。系统应能够清晰呈现以下内容：

1. **Raman 光路**  
   - 激光器、线偏振控制、显微物镜、样品、瑞利滤波、光谱仪、探测器。
   - 支持平行偏振 Raman 与交叉偏振 Raman。
   - 支持入射偏振旋转、检偏器选择与角度标注。

2. **PL 光路**  
   - 激发光路与发光收集光路。
   - 显示泵浦激光、二向色镜 / 长通滤光片、样品发光、光谱仪、CCD。
   - 支持低温、磁场、偏振分辨 PL 的扩展标注。

3. **SHG 光路**  
   - 飞秒激光或脉冲激光、偏振控制、样品、二倍频信号、短通 / 带通滤波、PMT / CCD。
   - 强调入射光频率 \(\omega\) 与二倍频 \(2\omega\) 信号。
   - 支持 SHG 偏振依赖测试。

4. **线偏振测试光路**  
   - Polarizer、Half-wave plate、Analyzer。
   - 显示平行偏振、交叉偏振、旋转入射偏振、旋转检偏偏振。

5. **圆偏振测试光路**  
   - Quarter-wave plate、Circular polarization analyzer。
   - 显示 \(\sigma^+\)、\(\sigma^-\)、DOCP、valley PL 等光谱测试场景。

最终系统应形成一个**可扩展的模块化光路编辑/展示框架**：虽然当前版本不需要拖拽，但所有元器件、光束、标签、说明面板都应该通过数据驱动生成，方便后续扩展到交互式拖拽或参数化编辑。

---

## 2. 总体技术路线

### 2.1 推荐技术栈

系统尽量使用原生 Web 技术，不依赖重型框架。

建议采用：

```text
HTML5 + CSS3 + JavaScript ES Modules + SVG
```

可选增强：

```text
Vite               用于本地开发与打包
TypeScript         用于后续大型工程维护
CSS Variables      用于统一主题
SVG <g>            用于元器件分组
SVG <path>         用于光束传播路径
SVG <marker>       用于光束箭头
localStorage       用于保存用户选择的光路模式
```

不建议初版使用：

```text
Canvas 主绘制       不利于后续编辑与矢量导出
Three.js            当前是二维光路图，没必要引入 3D 复杂度
大型 UI 框架         容易让系统风格失控
拖拽库              当前版本明确不需要拖拽
```

### 2.2 渲染策略

采用 **HTML 布局 + SVG 光路画布** 的组合：

- HTML：负责顶部导航栏、侧边说明栏、模式切换按钮、参数面板、图例说明。
- SVG：负责光学元器件、光束路径、坐标标尺、偏振态图标、角度标注。
- CSS：统一视觉风格，控制玻璃拟态、卡片边框、阴影、光束颜色、字体层级。
- JS：根据光路配置对象自动渲染不同实验系统。

核心思想：

```text
不同光路 = 不同配置文件
相同器件 = 同一套 SVG 组件函数
相同视觉 = 同一套 CSS Design Tokens
```

---

## 3. 虚拟坐标系统设计

### 3.1 画布尺寸

为保证跨设备显示稳定，统一使用虚拟坐标系：

```text
viewBox = "0 0 1600 900"
```

含义：

- 横向 1600 个虚拟单位。
- 纵向 900 个虚拟单位。
- 浏览器中自适应缩放，但 SVG 内部所有坐标保持一致。

建议默认光轴：

```text
main optical axis y = 430
```

建议样品中心：

```text
sample center = (760, 430)
```

建议光谱仪入口：

```text
spectrometer entrance = (1320, 430)
```

### 3.2 坐标语义

```text
x 方向：光路主要传播方向，从左到右。
y 方向：光路上下分支方向，用于分束、反射、探测臂。
z 方向：不直接显示，可用样品处的法向箭头表示。
```

### 3.3 网格与对齐

所有元器件放置在 20 或 40 的整数倍坐标上，以保证排版整齐。

推荐网格：

```text
base grid = 20
major grid = 80
component spacing = 120 ~ 180
```

元器件位置应遵循：

```text
laser         x = 120
polarizer     x = 280
waveplate     x = 420
beam splitter x = 580
objective     x = 680
sample        x = 760
filter        x = 1000
analyzer      x = 1120
spectrometer  x = 1320
ccd           x = 1480
```

### 3.4 图层顺序

SVG 内部建议分为以下图层：

```html
<g id="layer-grid"></g>
<g id="layer-background-panels"></g>
<g id="layer-beams"></g>
<g id="layer-components"></g>
<g id="layer-polarization"></g>
<g id="layer-labels"></g>
<g id="layer-annotations"></g>
```

图层规则：

1. 光束应在元器件下方，避免遮挡器件边框。
2. 偏振箭头应在光束上方。
3. 标签和角度标注应在最上方。
4. 网格默认低透明度，可通过 UI 开关隐藏。

---

## 4. 页面信息架构

### 4.1 页面布局

推荐采用三栏结构：

```text
┌─────────────────────────────────────────────────────────────┐
│ Top Bar: 系统标题 + 光路模式切换 + 导出按钮                  │
├───────────────┬───────────────────────────────┬─────────────┤
│ Left Panel    │ SVG Optical Canvas             │ Right Panel │
│ 光路目录       │ 主光路图                         │ 参数与说明    │
│ Raman / PL    │                                │             │
│ SHG / Pol.    │                                │             │
└───────────────┴───────────────────────────────┴─────────────┘
```

建议尺寸：

```css
.app {
  display: grid;
  grid-template-rows: 64px 1fr;
  height: 100vh;
}
.main {
  display: grid;
  grid-template-columns: 260px 1fr 320px;
  gap: 16px;
  padding: 16px;
}
```

### 4.2 导航模式

左侧提供以下光路模式：

```text
1. Raman Standard
2. Raman Parallel Polarization
3. Raman Cross Polarization
4. PL Standard
5. Polarization-resolved PL
6. Circular PL / Valley PL
7. SHG Standard
8. Polarization-resolved SHG
9. Custom Teaching Overview
```

切换模式时，仅替换配置对象，不重写绘制逻辑。

### 4.3 右侧说明面板

右侧面板应显示：

- 当前光路名称。
- 实验目的。
- 光束颜色含义。
- 核心元器件说明。
- 偏振配置。
- 可调参数。
- 实验注意事项。

示例：

```text
当前模式：Cross-polarized Raman
入射偏振：Vertical
检偏方向：Horizontal
常用符号：VV / VH
适用场景：低对称晶体偏振 Raman、Raman 张量分析、剪切模角分辨测试。
```

---

## 5. 视觉设计规范

### 5.1 总体风格

目标风格：

```text
现代、简洁、科研级、清晰、低噪声、高可读性
```

不应出现：

```text
过度拟物化
复杂渐变
杂乱阴影
过多颜色
器件比例不统一
标签遮挡光路
```

### 5.2 主题色

建议采用深浅结合的专业风格：

```css
:root {
  --bg-page: #f5f7fb;
  --bg-card: rgba(255, 255, 255, 0.86);
  --text-main: #152033;
  --text-muted: #637083;
  --line-soft: #d9e0ea;
  --component-fill: #ffffff;
  --component-stroke: #405064;
  --laser-red: #e53935;
  --pl-green: #26a269;
  --shg-blue: #2563eb;
  --infrared: #b45309;
  --purple: #7c3aed;
  --warning: #f59e0b;
}
```

光束颜色建议：

| 光束类型 | 颜色 | 含义 |
|---|---:|---|
| Raman excitation | 红色 | 激发激光 |
| Raman signal | 橙红 / 紫色 | Stokes / anti-Stokes 或散射信号 |
| PL excitation | 蓝紫色 | 激发光 |
| PL emission | 绿色 | 样品发光 |
| SHG fundamental | 深红 / 近红外 | \(\omega\) 基频光 |
| SHG signal | 蓝色 | \(2\omega\) 二倍频信号 |
| blocked beam | 灰色虚线 | 被滤除或阻挡的光 |

### 5.3 字体规范

推荐：

```css
font-family: Inter, "SF Pro Display", "Segoe UI", "Noto Sans SC", sans-serif;
```

层级：

```text
H1: 22–26 px, 700
H2: 18 px, 700
Panel title: 14 px, 700
Component label: 12–13 px, 600
Annotation: 11–12 px, 500
```

### 5.4 元器件尺寸规范

统一元器件宽高，避免大小不协调。

| 元器件 | 推荐尺寸 | 说明 |
|---|---:|---|
| Laser | 110 × 54 | 带出射口 |
| Polarizer | 64 × 84 | 竖直矩形，内部透射轴 |
| HWP / QWP | 70 × 84 | 圆角矩形 + 角度弧线 |
| Mirror | 64 × 64 | 45° 反射面 |
| Dichroic mirror | 76 × 76 | 倾斜半透明镜面 |
| Beam splitter | 76 × 76 | 半透镜，双通道 |
| Objective | 92 × 90 | 透镜组 + NA 标注 |
| Sample | 110 × 42 | 基底 + 2D flake |
| Filter | 72 × 84 | 窄矩形，多层滤片 |
| Analyzer | 64 × 84 | 与 Polarizer 同风格 |
| Spectrometer | 150 × 86 | 入射狭缝 + 光栅图标 |
| CCD / PMT | 94 × 70 | 探测器模块 |

---

## 6. 光学元器件组件库设计

所有元器件都应实现为 JavaScript 函数，返回 SVG 字符串或 DOM 节点。

### 6.1 组件基础数据结构

```js
const component = {
  id: "hwp-1",
  type: "waveplate",
  subtype: "HWP",
  x: 420,
  y: 430,
  rotation: 0,
  label: "HWP",
  params: {
    angleDeg: 22.5,
    function: "Rotate incident linear polarization"
  }
};
```

### 6.2 通用组件接口

建议所有组件遵守统一接口：

```js
function renderComponent(component) {
  switch (component.type) {
    case "laser": return renderLaser(component);
    case "polarizer": return renderPolarizer(component);
    case "waveplate": return renderWaveplate(component);
    case "mirror": return renderMirror(component);
    case "dichroic": return renderDichroic(component);
    case "beamsplitter": return renderBeamSplitter(component);
    case "objective": return renderObjective(component);
    case "sample": return renderSample(component);
    case "filter": return renderFilter(component);
    case "analyzer": return renderAnalyzer(component);
    case "spectrometer": return renderSpectrometer(component);
    case "detector": return renderDetector(component);
    default: return renderUnknown(component);
  }
}
```

### 6.3 Laser 组件

视觉要求：

- 左侧为圆角矩形主体。
- 右侧为小出射口。
- 内部显示波长，例如 532 nm、633 nm、800 nm。
- 激光颜色应与光束颜色一致。

组件参数：

```js
{
  type: "laser",
  label: "Laser",
  params: {
    wavelength: "532 nm",
    mode: "CW",
    color: "red"
  }
}
```

### 6.4 Polarizer 组件

视觉要求：

- 竖直矩形。
- 内部一条透射轴线。
- 角度用小弧线标出。
- 显示 P 或 Polarizer。

参数：

```js
{
  type: "polarizer",
  params: {
    angleDeg: 0,
    axisLabel: "V"
  }
}
```

### 6.5 Half-wave plate / Quarter-wave plate

HWP 视觉要求：

- 圆角矩形或圆形透明片。
- 内部双箭头表示快轴。
- 标注 \(\lambda/2\)。
- 角度标注 \(\theta/2\) 或 \(\theta\)。

QWP 视觉要求：

- 与 HWP 风格统一。
- 标注 \(\lambda/4\)。
- 显示用于线偏振与圆偏振转换。

参数：

```js
{
  type: "waveplate",
  subtype: "HWP",
  params: {
    angleDeg: 22.5,
    fastAxis: "diagonal"
  }
}
```

### 6.6 Mirror 组件

视觉要求：

- 45° 斜线镜面。
- 背面可添加短刻线表示反射镀膜。
- 用于折转光路。

### 6.7 Dichroic mirror 组件

视觉要求：

- 45° 倾斜半透明板。
- 一种光透过，另一种光反射。
- 必须在图中用不同颜色光束显示。

典型用于 PL：

```text
激发光反射到物镜 / 样品
PL 发光透过进入光谱仪
```

### 6.8 Objective 组件

视觉要求：

- 使用两到三片透镜曲线表示显微物镜。
- 标注 Objective、50×、NA 0.75 或 NA 0.81。
- 物镜和样品之间应有聚焦锥形光束。

### 6.9 Sample 组件

视觉要求：

- 基底为灰色薄片。
- 上方用小型彩色二维材料片表示样品。
- 显示 x′ / y′ 晶体坐标轴。
- 可标注 TMD、CIPS、ReS₂、MoS₂ 等。

参数：

```js
{
  type: "sample",
  params: {
    material: "2D material",
    substrate: "SiO₂/Si",
    temperature: "300 K",
    field: "B = 0 T"
  }
}
```

### 6.10 Filter 组件

类型包括：

```text
Notch filter
Long-pass filter
Short-pass filter
Band-pass filter
Edge filter
```

视觉要求：

- 矩形滤片。
- 内部多层线条。
- 被阻挡的光束用灰色虚线终止。

### 6.11 Spectrometer 组件

视觉要求：

- 方形或长方形仪器外壳。
- 左侧入射狭缝。
- 内部用简单光栅线条表示色散。
- 右侧连接 CCD。

### 6.12 Detector 组件

支持：

```text
CCD
PMT
APD
Camera
Power meter
```

视觉要求：

- 小型仪器模块。
- 与 Spectrometer 风格统一。

---

## 7. 光束系统设计

### 7.1 光束对象

```js
const beam = {
  id: "beam-excitation",
  type: "excitation",
  color: "var(--laser-red)",
  width: 5,
  path: [
    [120, 430],
    [280, 430],
    [420, 430],
    [580, 430],
    [680, 430],
    [760, 430]
  ],
  arrow: true,
  label: "532 nm"
};
```

### 7.2 SVG Path 生成

光束路径建议使用折线转 path：

```js
function beamPath(points) {
  return points.map((p, i) => {
    const [x, y] = p;
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(" ");
}
```

### 7.3 光束样式

```css
.beam {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 4px rgba(255, 0, 0, 0.18));
}
.beam.blocked {
  stroke-dasharray: 8 8;
  opacity: 0.42;
}
```

### 7.4 聚焦光束

物镜到样品之间建议使用锥形光束：

```text
objective → sample: 使用两条半透明边界线 + 中心线
sample → objective: 发光或散射信号使用反向锥形收集光束
```

---

## 8. 偏振态可视化规范

### 8.1 线偏振

线偏振用双向箭头表示：

```text
Vertical:   ↕
Horizontal: ↔
Diagonal:   ↗↙
```

SVG 中建议绘制：

```html
<g class="polarization linear" transform="translate(x y) rotate(angle)">
  <line x1="-18" y1="0" x2="18" y2="0" />
  <path d="M 18 0 L 11 -5 L 11 5 Z" />
  <path d="M -18 0 L -11 -5 L -11 5 Z" />
</g>
```

### 8.2 圆偏振

圆偏振用螺旋箭头或圆形箭头表示：

```text
σ+：顺时针或右旋，标注 σ+
σ−：逆时针或左旋，标注 σ−
```

建议在光束旁绘制小圆箭头，并标注：

```text
σ⁺ excitation
σ⁻ detection
```

### 8.3 椭圆偏振

椭圆偏振可选：

- 用倾斜椭圆 + 单向箭头表示。
- 用于说明 QWP 角度不完全为 45° 时的状态。

### 8.4 偏振符号

系统中必须统一显示常用符号：

| 符号 | 含义 | 对应配置 |
|---|---|---|
| VV | Vertical in / Vertical out | 平行偏振 |
| VH | Vertical in / Horizontal out | 交叉偏振 |
| HH | Horizontal in / Horizontal out | 平行偏振 |
| HV | Horizontal in / Vertical out | 交叉偏振 |
| XX | Lab x in / Lab x out | 平行偏振 |
| XY | Lab x in / Lab y out | 交叉偏振 |
| \(\sigma^+\) | 右旋圆偏振 | 圆偏振激发或探测 |
| \(\sigma^-\) | 左旋圆偏振 | 圆偏振激发或探测 |
| co-circular | 同手性圆偏振 | \(\sigma^+ / \sigma^+\) 或 \(\sigma^- / \sigma^-\) |
| cross-circular | 异手性圆偏振 | \(\sigma^+ / \sigma^-\) 或 \(\sigma^- / \sigma^+\) |

---

## 9. Raman 光路设计

### 9.1 标准 Raman 光路

核心逻辑：

```text
Laser → Polarizer → HWP → Beam splitter / Mirror → Objective → Sample
Sample Raman scattering → Objective → Edge / Notch filter → Analyzer → Spectrometer → CCD
```

推荐坐标：

```js
components: [
  { id: "laser", type: "laser", x: 120, y: 430, label: "532 nm Laser" },
  { id: "p1", type: "polarizer", x: 280, y: 430, label: "Polarizer" },
  { id: "hwp1", type: "waveplate", subtype: "HWP", x: 420, y: 430, label: "HWP" },
  { id: "bs1", type: "beamsplitter", x: 580, y: 430, label: "Beam splitter" },
  { id: "obj", type: "objective", x: 700, y: 430, label: "Objective" },
  { id: "sample", type: "sample", x: 800, y: 430, label: "Sample" },
  { id: "nf", type: "filter", subtype: "notch", x: 1000, y: 430, label: "Notch filter" },
  { id: "analyzer", type: "analyzer", x: 1130, y: 430, label: "Analyzer" },
  { id: "spec", type: "spectrometer", x: 1310, y: 430, label: "Spectrometer" },
  { id: "ccd", type: "detector", subtype: "CCD", x: 1480, y: 430, label: "CCD" }
]
```

### 9.2 平行偏振 Raman

显示重点：

```text
Incident polarization: V
Analyzer polarization: V
Notation: VV
```

光路说明：

- 入射激光经 Polarizer 定义为竖直偏振。
- HWP 可旋转样品坐标系下的入射偏振角。
- Analyzer 设置为竖直方向，仅收集与入射偏振平行的 Raman 信号。

右侧说明面板应显示：

```text
Parallel Raman Geometry
e_i ∥ e_s
Notation: VV or XX
Application: Raman tensor extraction, angular Raman mapping, symmetry analysis.
```

### 9.3 交叉偏振 Raman

显示重点：

```text
Incident polarization: V
Analyzer polarization: H
Notation: VH
```

光路说明：

- 入射偏振保持竖直。
- Analyzer 设置为水平。
- 用于增强各向异性分量或抑制强背景。

右侧说明面板应显示：

```text
Cross Raman Geometry
e_i ⟂ e_s
Notation: VH or XY
Application: low-symmetry crystals, shear-mode Raman, polarization selection rules.
```

### 9.4 Raman 可调参数

```js
params: {
  laserWavelength: ["488 nm", "514 nm", "532 nm", "633 nm", "785 nm"],
  polarizationMode: ["VV", "VH", "HH", "HV", "rotating incident", "rotating analyzer"],
  hwpAngle: 0,
  analyzerAngle: 0,
  notchFilter: true,
  objectiveNA: 0.81,
  sampleAngle: 0
}
```

---

## 10. PL 光路设计

### 10.1 标准 PL 光路

核心逻辑：

```text
Laser → Excitation filter → Dichroic mirror → Objective → Sample
Sample PL emission → Objective → Dichroic mirror transmission → Long-pass filter → Spectrometer → CCD
```

推荐显示：

- 激发光：蓝紫色或绿色，标注 \(h\nu_{exc}\)。
- PL 发光：绿色 / 橙色，标注 \(h\nu_{PL}\)。
- 二向色镜处显示激发光反射、PL 透射。

### 10.2 偏振分辨 PL

光路：

```text
Sample PL → QWP/HWP → Analyzer → Spectrometer → CCD
```

线偏振分辨 PL：

```text
Sample PL → HWP → Analyzer → Spectrometer
```

圆偏振分辨 PL：

```text
Sample PL → QWP → Analyzer → Spectrometer
```

显示重点：

```text
DOCP = (Iσ+ - Iσ-) / (Iσ+ + Iσ-)
DOLP = (I∥ - I⊥) / (I∥ + I⊥)
```

右侧面板说明：

```text
Polarization-resolved PL
Purpose: analyze exciton polarization, valley polarization, linear anisotropy, and spin-valley selection rules.
```

### 10.3 低温磁场 PL 扩展

可加入样品周围的扩展模块：

```text
Cryostat
Magnet B-field
Objective window
Sample stage
```

视觉建议：

- 样品外绘制半透明低温腔体。
- 用上下箭头表示 Faraday geometry 中的磁场方向。
- 标注 \(B \parallel z\)。

---

## 11. SHG 光路设计

### 11.1 标准 SHG 光路

核心逻辑：

```text
Femtosecond Laser → Polarizer → HWP → Objective → Sample
Sample SHG signal → Objective → Short-pass filter / Band-pass filter → Analyzer → Detector
```

关键显示：

```text
Incident: ω
SHG: 2ω
```

建议：

- 基频光 \(\omega\)：深红或近红外色。
- 二倍频 \(2\omega\)：蓝色或紫色。
- 在样品处显示非线性转换图标：\(\omega + \omega \rightarrow 2\omega\)。

### 11.2 反射式 SHG

用于二维材料表征的典型配置：

```text
Laser → Polarizer → HWP → Beam splitter / Dichroic → Objective → Sample
SHG reflection → Objective → Filter set → Analyzer → PMT / Spectrometer
```

显示重点：

- 入射基频光进入样品。
- 样品反射或产生二倍频信号。
- 滤光片滤除基频，仅保留 \(2\omega\)。

### 11.3 透射式 SHG

可作为扩展模式：

```text
Laser → Polarizer → HWP → Objective → Sample → Collection objective → Filters → Detector
```

建议初版先实现反射式 SHG，透射式作为后续模式。

### 11.4 偏振 SHG

配置：

```text
Rotating HWP controls incident linear polarization.
Analyzer selects SHG polarization component.
```

面板公式：

```text
I₂ω(θ) ∝ |e_out · χ^(2) : e_in e_in|²
```

说明：

```text
Polarization-resolved SHG is used to determine crystal symmetry, domain orientation, inversion symmetry breaking, and nonlinear optical tensor elements.
```

---

## 12. 线偏振与圆偏振模块

### 12.1 线偏振模块

应支持以下配置：

```text
Input linear polarization generated by Polarizer.
HWP rotates linear polarization by 2θ.
Analyzer selects projection component.
```

显示规则：

- HWP 角度为 \(\theta\)，输出偏振方向旋转 \(2\theta\)。
- 在光束旁显示输入与输出双向箭头。
- 支持实时更新标签：

```text
HWP = 22.5° → polarization rotation = 45°
```

### 12.2 圆偏振模块

应支持以下配置：

```text
Linear polarization + QWP at ±45° → σ+ / σ−
```

圆偏振检测：

```text
Emission → QWP → Analyzer → Spectrometer
```

右侧公式：

```text
Iσ+ = intensity measured in σ+ channel
Iσ− = intensity measured in σ− channel
DOCP = (Iσ+ - Iσ-) / (Iσ+ + Iσ-)
```

### 12.3 模块组合

线偏振模块和圆偏振模块不要单独写死在 Raman/PL/SHG 中，而应该作为可插入模块：

```js
const modules = {
  linearPolarizationInput: ["polarizer", "hwp"],
  linearPolarizationDetection: ["hwp", "analyzer"],
  circularPolarizationInput: ["polarizer", "qwp"],
  circularPolarizationDetection: ["qwp", "analyzer"]
};
```

---

## 13. 数据驱动配置系统

### 13.1 光路配置对象

每一种光路都应由一个配置对象描述。

```js
const opticalLayouts = {
  ramanVV: {
    title: "Parallel-polarized Raman",
    category: "Raman",
    viewBox: "0 0 1600 900",
    components: [],
    beams: [],
    annotations: [],
    parameters: {},
    theory: []
  },
  plCircular: {
    title: "Circularly polarized PL",
    category: "PL",
    components: [],
    beams: [],
    annotations: [],
    parameters: {},
    theory: []
  }
};
```

### 13.2 组件数据

```js
{
  id: "qwp-detection",
  type: "waveplate",
  subtype: "QWP",
  x: 1080,
  y: 430,
  rotation: 0,
  label: "QWP",
  params: {
    angleDeg: 45,
    role: "Circular polarization analyzer"
  }
}
```

### 13.3 光束数据

```js
{
  id: "pl-emission",
  type: "emission",
  colorToken: "--pl-green",
  width: 5,
  points: [[800,430],[700,430],[580,430],[1000,430],[1130,430],[1320,430]],
  label: "PL emission",
  arrow: true
}
```

### 13.4 注释数据

```js
{
  id: "eq-docp",
  type: "formula",
  x: 1180,
  y: 220,
  text: "DOCP = (Iσ+ − Iσ−)/(Iσ+ + Iσ−)"
}
```

---

## 14. 推荐工程目录结构

```text
optical-path-system/
├── index.html
├── package.json
├── README.md
├── src/
│   ├── main.js
│   ├── app.js
│   ├── state.js
│   ├── styles/
│   │   ├── base.css
│   │   ├── theme.css
│   │   ├── layout.css
│   │   └── components.css
│   ├── data/
│   │   ├── layouts.raman.js
│   │   ├── layouts.pl.js
│   │   ├── layouts.shg.js
│   │   ├── layouts.polarization.js
│   │   └── componentPresets.js
│   ├── render/
│   │   ├── renderCanvas.js
│   │   ├── renderComponent.js
│   │   ├── renderBeam.js
│   │   ├── renderAnnotation.js
│   │   └── svgUtils.js
│   ├── components/
│   │   ├── Laser.js
│   │   ├── Polarizer.js
│   │   ├── Waveplate.js
│   │   ├── Mirror.js
│   │   ├── Dichroic.js
│   │   ├── BeamSplitter.js
│   │   ├── Objective.js
│   │   ├── Sample.js
│   │   ├── Filter.js
│   │   ├── Spectrometer.js
│   │   └── Detector.js
│   └── utils/
│       ├── geometry.js
│       ├── opticsMath.js
│       └── exportSvg.js
└── assets/
    └── icons/
```

如果希望更简单，可以先做单文件版本：

```text
index.html
```

但推荐 Codex 最终整理为模块化目录结构。

---

## 15. 核心 HTML 骨架

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Modular Optical Path System</title>
  <link rel="stylesheet" href="./src/styles/base.css" />
  <link rel="stylesheet" href="./src/styles/theme.css" />
  <link rel="stylesheet" href="./src/styles/layout.css" />
</head>
<body>
  <div id="app" class="app">
    <header class="topbar">
      <div>
        <h1>Modular Optical Path System</h1>
        <p>Raman · PL · SHG · Linear / Circular Polarization</p>
      </div>
      <div class="toolbar">
        <button id="toggle-grid">Grid</button>
        <button id="export-svg">Export SVG</button>
      </div>
    </header>

    <main class="main">
      <aside class="sidebar" id="layout-list"></aside>
      <section class="canvas-card">
        <svg id="optical-canvas" viewBox="0 0 1600 900" role="img"></svg>
      </section>
      <aside class="info-panel" id="info-panel"></aside>
    </main>
  </div>

  <script type="module" src="./src/main.js"></script>
</body>
</html>
```

---

## 16. 核心渲染流程

### 16.1 main.js

```js
import { opticalLayouts } from "./data/layouts.js";
import { renderCanvas } from "./render/renderCanvas.js";
import { renderLayoutList } from "./app.js";
import { renderInfoPanel } from "./render/renderInfoPanel.js";

const state = {
  currentLayoutId: "ramanVV",
  showGrid: true
};

function setLayout(id) {
  state.currentLayoutId = id;
  const layout = opticalLayouts[id];
  renderCanvas(document.querySelector("#optical-canvas"), layout, state);
  renderInfoPanel(document.querySelector("#info-panel"), layout);
}

renderLayoutList(document.querySelector("#layout-list"), opticalLayouts, setLayout);
setLayout(state.currentLayoutId);
```

### 16.2 renderCanvas.js

```js
import { renderComponent } from "./renderComponent.js";
import { renderBeam } from "./renderBeam.js";
import { renderAnnotation } from "./renderAnnotation.js";
import { renderGrid } from "./svgUtils.js";

export function renderCanvas(svg, layout, state) {
  svg.innerHTML = "";

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = createMarkersAndFilters();
  svg.appendChild(defs);

  if (state.showGrid) {
    svg.appendChild(renderGrid(1600, 900, 20, 80));
  }

  const beamLayer = group("layer-beams");
  layout.beams.forEach(beam => beamLayer.appendChild(renderBeam(beam)));
  svg.appendChild(beamLayer);

  const componentLayer = group("layer-components");
  layout.components.forEach(component => componentLayer.appendChild(renderComponent(component)));
  svg.appendChild(componentLayer);

  const annotationLayer = group("layer-annotations");
  layout.annotations.forEach(annotation => annotationLayer.appendChild(renderAnnotation(annotation)));
  svg.appendChild(annotationLayer);
}

function group(id) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("id", id);
  return g;
}
```

---

## 17. Raman VV 配置示例

```js
export const ramanVV = {
  id: "ramanVV",
  title: "Parallel-polarized Raman",
  subtitle: "VV geometry for Raman tensor and symmetry analysis",
  category: "Raman",
  components: [
    { id: "laser", type: "laser", x: 120, y: 430, label: "532 nm Laser", params: { wavelength: "532 nm" } },
    { id: "polarizer", type: "polarizer", x: 280, y: 430, label: "Polarizer", params: { angleDeg: 90, axisLabel: "V" } },
    { id: "hwp", type: "waveplate", subtype: "HWP", x: 420, y: 430, label: "HWP", params: { angleDeg: 0 } },
    { id: "bs", type: "beamsplitter", x: 580, y: 430, label: "BS" },
    { id: "objective", type: "objective", x: 700, y: 430, label: "Objective", params: { magnification: "50×", NA: "0.75" } },
    { id: "sample", type: "sample", x: 800, y: 430, label: "2D Sample" },
    { id: "notch", type: "filter", subtype: "notch", x: 1000, y: 430, label: "Notch" },
    { id: "analyzer", type: "analyzer", x: 1130, y: 430, label: "Analyzer", params: { angleDeg: 90, axisLabel: "V" } },
    { id: "spectrometer", type: "spectrometer", x: 1310, y: 430, label: "Spectrometer" },
    { id: "ccd", type: "detector", subtype: "CCD", x: 1480, y: 430, label: "CCD" }
  ],
  beams: [
    {
      id: "excitation",
      type: "excitation",
      colorToken: "--laser-red",
      width: 5,
      points: [[120, 430], [280, 430], [420, 430], [580, 430], [700, 430], [800, 430]],
      label: "532 nm excitation"
    },
    {
      id: "raman-signal",
      type: "signal",
      colorToken: "--purple",
      width: 4,
      points: [[800, 430], [700, 430], [580, 430], [1000, 430], [1130, 430], [1310, 430], [1480, 430]],
      label: "Raman scattering"
    }
  ],
  annotations: [
    { id: "vv", type: "badge", x: 1130, y: 300, text: "VV: eᵢ ∥ eₛ" },
    { id: "formula", type: "formula", x: 920, y: 230, text: "I ∝ |eₛᵀ R eᵢ|²" }
  ],
  info: {
    purpose: "Parallel-polarized Raman geometry for extracting Raman tensor elements and crystal symmetry.",
    polarization: "Incident: V, Analyzer: V, notation: VV.",
    notes: [
      "Use HWP to rotate incident linear polarization.",
      "Use analyzer to select the scattered Raman polarization.",
      "Notch or edge filter removes Rayleigh scattering before the spectrometer."
    ]
  }
};
```

---

## 18. PL 圆偏振配置示例

```js
export const plCircular = {
  id: "plCircular",
  title: "Circularly polarized PL",
  subtitle: "σ⁺ / σ⁻ resolved photoluminescence for valley polarization",
  category: "PL",
  components: [
    { id: "laser", type: "laser", x: 120, y: 430, label: "Excitation Laser", params: { wavelength: "633 nm" } },
    { id: "polarizer", type: "polarizer", x: 260, y: 430, label: "Polarizer", params: { angleDeg: 0 } },
    { id: "qwp-in", type: "waveplate", subtype: "QWP", x: 400, y: 430, label: "QWP", params: { angleDeg: 45, role: "σ⁺ excitation" } },
    { id: "dichroic", type: "dichroic", x: 570, y: 430, label: "Dichroic" },
    { id: "objective", type: "objective", x: 700, y: 430, label: "Objective" },
    { id: "sample", type: "sample", x: 800, y: 430, label: "TMD Sample", params: { temperature: "1.7 K", field: "B ∥ z" } },
    { id: "lp", type: "filter", subtype: "long-pass", x: 1000, y: 430, label: "Long-pass" },
    { id: "qwp-out", type: "waveplate", subtype: "QWP", x: 1120, y: 430, label: "QWP" },
    { id: "analyzer", type: "analyzer", x: 1240, y: 430, label: "Analyzer" },
    { id: "spectrometer", type: "spectrometer", x: 1400, y: 430, label: "Spectrometer" },
    { id: "ccd", type: "detector", subtype: "CCD", x: 1540, y: 430, label: "CCD" }
  ],
  beams: [
    {
      id: "excitation",
      type: "excitation",
      colorToken: "--shg-blue",
      width: 5,
      points: [[120,430],[260,430],[400,430],[570,430],[700,430],[800,430]],
      label: "σ⁺ excitation"
    },
    {
      id: "pl",
      type: "emission",
      colorToken: "--pl-green",
      width: 5,
      points: [[800,430],[700,430],[570,430],[1000,430],[1120,430],[1240,430],[1400,430],[1540,430]],
      label: "PL emission"
    }
  ],
  annotations: [
    { id: "docp", type: "formula", x: 1040, y: 240, text: "DOCP = (Iσ⁺ − Iσ⁻)/(Iσ⁺ + Iσ⁻)" },
    { id: "sigma", type: "badge", x: 430, y: 300, text: "QWP @ 45° → σ⁺" }
  ],
  info: {
    purpose: "Circularly polarized PL for exciton valley polarization and spin-valley optical selection rules.",
    polarization: "Input or detection channel can be switched between σ⁺ and σ⁻.",
    notes: [
      "QWP before the sample generates circular excitation.",
      "QWP plus analyzer after the sample resolves circularly polarized emission.",
      "The same rendering module can support co-circular and cross-circular configurations."
    ]
  }
};
```

---

## 19. SHG 配置示例

```js
export const shgPolar = {
  id: "shgPolar",
  title: "Polarization-resolved SHG",
  subtitle: "ω excitation and 2ω detection for nonlinear tensor analysis",
  category: "SHG",
  components: [
    { id: "laser", type: "laser", x: 120, y: 430, label: "fs Laser", params: { wavelength: "800 nm", mode: "fs" } },
    { id: "polarizer", type: "polarizer", x: 280, y: 430, label: "Polarizer" },
    { id: "hwp", type: "waveplate", subtype: "HWP", x: 420, y: 430, label: "HWP" },
    { id: "bs", type: "beamsplitter", x: 580, y: 430, label: "BS" },
    { id: "objective", type: "objective", x: 700, y: 430, label: "Objective" },
    { id: "sample", type: "sample", x: 800, y: 430, label: "Nonlinear Sample" },
    { id: "sp", type: "filter", subtype: "short-pass", x: 1000, y: 430, label: "Short-pass" },
    { id: "bp", type: "filter", subtype: "band-pass", x: 1120, y: 430, label: "2ω Filter" },
    { id: "analyzer", type: "analyzer", x: 1240, y: 430, label: "Analyzer" },
    { id: "pmt", type: "detector", subtype: "PMT", x: 1420, y: 430, label: "PMT" }
  ],
  beams: [
    {
      id: "fundamental",
      type: "fundamental",
      colorToken: "--infrared",
      width: 5,
      points: [[120,430],[280,430],[420,430],[580,430],[700,430],[800,430]],
      label: "ω"
    },
    {
      id: "shg",
      type: "shg",
      colorToken: "--shg-blue",
      width: 5,
      points: [[800,430],[700,430],[580,430],[1000,430],[1120,430],[1240,430],[1420,430]],
      label: "2ω"
    },
    {
      id: "blocked-fundamental",
      type: "blocked",
      colorToken: "--line-soft",
      width: 3,
      points: [[1000,450],[1080,500]],
      label: "blocked ω",
      blocked: true
    }
  ],
  annotations: [
    { id: "nonlinear", type: "badge", x: 760, y: 300, text: "ω + ω → 2ω" },
    { id: "chi2", type: "formula", x: 920, y: 220, text: "I₂ω ∝ |eout · χ(2) : ein ein|²" }
  ],
  info: {
    purpose: "Polarization-resolved SHG for crystal symmetry, domain orientation, and inversion-symmetry breaking.",
    polarization: "HWP controls incident polarization; analyzer selects SHG output polarization.",
    notes: [
      "Use short-pass and band-pass filters to suppress the fundamental beam.",
      "Use PMT or spectrometer depending on signal strength and spectral resolution needs.",
      "Mark the generated 2ω beam with a distinct color from the incident ω beam."
    ]
  }
};
```

---

## 20. 交互功能设计

### 20.1 必须实现

```text
1. 光路模式切换
2. 显示 / 隐藏网格
3. 显示 / 隐藏理论公式
4. 切换光束颜色图例
5. 导出 SVG
6. 右侧说明面板动态更新
```

### 20.2 建议实现

```text
1. HWP 角度滑条
2. QWP 角度滑条
3. Analyzer 角度滑条
4. 入射偏振与出射偏振图标实时更新
5. 暗色 / 亮色主题切换
6. 画布缩放适配
```

### 20.3 暂不实现

```text
1. 拖拽元器件
2. 复杂光线追迹
3. 3D 光路
4. 后端数据库
5. 用户登录
```

---

## 21. 导出功能

### 21.1 SVG 导出

实现：

```js
function exportSVG() {
  const svg = document.querySelector("#optical-canvas");
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "optical-path.svg";
  a.click();
  URL.revokeObjectURL(url);
}
```

### 21.2 PNG 导出

后续可实现 SVG → Canvas → PNG：

```text
serialize SVG → image → canvas → toBlob → download PNG
```

初版只要求 SVG 导出。

---

## 22. Codex 实现任务拆解

### Phase 1：单文件原型

目标：快速得到可运行界面。

任务：

1. 创建 `index.html`。
2. 内联 CSS 和 JS。
3. 实现顶部栏、左侧菜单、右侧面板、SVG 画布。
4. 实现 5 个基础组件：Laser、Polarizer、Waveplate、Objective、Sample。
5. 实现 Raman VV 光路。
6. 实现光束 path 与箭头。
7. 实现模式切换的基本框架。

验收标准：

```text
打开 index.html 后能看到完整 Raman VV 光路。
界面不凌乱，器件大小协调，标签清晰。
```

### Phase 2：模块化重构

目标：把单文件拆成工程结构。

任务：

1. 使用 Vite 或原生 ES Modules。
2. 拆分组件文件。
3. 拆分光路配置文件。
4. 建立统一的 renderCanvas。
5. 实现 Raman VV、Raman VH、PL standard。

验收标准：

```text
新增一种光路只需要新增一个 layout 配置对象。
组件渲染逻辑不需要复制粘贴。
```

### Phase 3：PL / SHG / 偏振模块完善

任务：

1. 加入 Dichroic、Filter、Spectrometer、Detector、Analyzer。
2. 实现 PL standard。
3. 实现 Circular PL。
4. 实现 SHG standard。
5. 实现 Polarization-resolved SHG。
6. 加入公式和图例。

验收标准：

```text
Raman、PL、SHG、线偏振、圆偏振五类核心系统均可展示。
```

### Phase 4：美化与教学增强

任务：

1. 统一 Design Tokens。
2. 优化卡片布局、阴影、圆角、标签位置。
3. 加入光束图例。
4. 加入器件说明卡片。
5. 加入 SVG 导出。
6. 加入暗色模式。

验收标准：

```text
整体视觉达到科研报告 / 课程演示 / 论文示意图草图级别。
```

### Phase 5：可扩展能力

任务：

1. 支持自定义材料名、温度、磁场、激光波长。
2. 支持 HWP/QWP/Analyzer 角度滑条。
3. 支持显示偏振箭头实时旋转。
4. 支持保存当前模式到 localStorage。
5. 支持一键复制当前 layout JSON。

验收标准：

```text
系统可作为后续光路教学平台的基础框架。
```

---

## 23. Codex 开发提示词

下面这段可直接复制给 Codex：

```text
请你基于 HTML5、CSS3、原生 JavaScript ES Modules 和 SVG，开发一个模块化科研教学光路展示系统。系统用于展示 Raman、PL、SHG、线偏振和圆偏振测试光路。要求尽量使用 HTML/SVG 实现，不使用拖拽，不使用复杂框架。

请先建立一个虚拟坐标系统，SVG viewBox 使用 0 0 1600 900，主光轴 y=430。所有元器件都通过配置对象定义坐标、类型、标签和参数，再由统一的 renderCanvas 渲染。

系统界面采用三栏布局：顶部导航栏，左侧光路模式菜单，中间 SVG 光路画布，右侧实验说明与参数面板。要求界面现代、简洁、专业、美观、清晰，元器件大小协调，风格统一。

请实现以下内容：
1. Raman VV 光路。
2. Raman VH 光路。
3. 标准 PL 光路。
4. 圆偏振 PL 光路。
5. 标准 SHG 光路。
6. 偏振分辨 SHG 光路。

请建立组件库：Laser、Polarizer、HWP、QWP、Mirror、Dichroic mirror、Beam splitter、Objective、Sample、Filter、Analyzer、Spectrometer、CCD/PMT detector。每个组件以 SVG <g> 形式绘制，支持 label、坐标、旋转和基础参数。

光束使用 SVG path 绘制，并用不同颜色区分：Raman excitation、Raman signal、PL excitation、PL emission、SHG fundamental ω、SHG signal 2ω。光束需要箭头和标签。被滤除光束使用灰色虚线。

偏振状态需要用小型图标表示：线偏振用双向箭头，圆偏振用圆形箭头并标注 σ+ / σ−。Raman 中标注 VV/VH，PL 中标注 DOCP，SHG 中标注 I₂ω ∝ |eout·χ(2):einein|²。

请先给出可以直接运行的版本。如果工程较大，可以先做 index.html 单文件原型，然后再拆分为 src/components、src/render、src/data、src/styles 的模块化结构。
```

---

## 24. 质量验收清单

### 24.1 视觉验收

- [ ] 元器件比例统一。
- [ ] 光束颜色清晰且不刺眼。
- [ ] 标签不遮挡元器件和光束。
- [ ] Raman、PL、SHG 使用不同但协调的颜色体系。
- [ ] 整体风格符合科研教学演示。
- [ ] 不出现廉价卡通风或杂乱图标。

### 24.2 工程验收

- [ ] 新增光路只需要新增配置对象。
- [ ] 新增元器件只需要新增一个组件函数。
- [ ] 渲染函数不依赖具体实验名称。
- [ ] CSS 主题变量统一。
- [ ] 无全局大量硬编码。
- [ ] SVG 导出正常。

### 24.3 光学逻辑验收

- [ ] Raman 光路包含激发、样品散射、滤波、检偏、光谱仪。
- [ ] PL 光路包含激发与发光收集的颜色区分。
- [ ] SHG 光路清楚区分 \(\omega\) 与 \(2\omega\)。
- [ ] 线偏振测试包含 Polarizer / HWP / Analyzer。
- [ ] 圆偏振测试包含 QWP / Analyzer。
- [ ] VV/VH、\(\sigma^+\)/\(\sigma^-\)、DOCP 等符号解释清晰。

---

## 25. 推荐初版开发顺序

建议按以下顺序执行，避免一开始就陷入复杂组件细节：

```text
1. 建立页面布局。
2. 建立 SVG 坐标系统和网格。
3. 实现 Laser、Sample、Spectrometer 三个基础组件。
4. 实现 beam path 和箭头。
5. 完成 Raman VV。
6. 加入 Polarizer、HWP、Analyzer，完成 Raman VH。
7. 加入 Dichroic、Filter，完成 PL。
8. 加入 QWP，完成 Circular PL。
9. 加入 SHG 的 ω / 2ω 双光束系统。
10. 统一美化所有器件。
11. 拆分模块化代码。
12. 加入导出和交互。
```

---

## 26. 科研表达细节建议

### 26.1 Raman

Raman 图中应突出：

```text
入射偏振 eᵢ
散射偏振 eₛ
Raman tensor R
光谱仪采集 Raman shift
Rayleigh line 被 notch/edge filter 滤除
```

建议标注：

```text
I_Raman ∝ |eₛᵀ R eᵢ|²
```

### 26.2 PL

PL 图中应突出：

```text
excitation photon hν_exc
emission photon hν_PL
long-pass filter removes excitation laser
spectrometer records emission spectrum
```

偏振 PL 建议标注：

```text
DOLP = (I∥ − I⊥)/(I∥ + I⊥)
DOCP = (Iσ+ − Iσ−)/(Iσ+ + Iσ−)
```

### 26.3 SHG

SHG 图中应突出：

```text
ω fundamental beam
2ω nonlinear signal
χ(2) tensor
filter removes residual ω
```

建议标注：

```text
I₂ω ∝ |eout · χ(2) : ein ein|²
```

---

## 27. 统一命名规范

### 27.1 组件 ID

```text
laser-main
polarizer-input
hwp-input
qwp-input
beam-splitter-main
objective-main
sample-main
filter-notch
filter-longpass
analyzer-output
spectrometer-main
detector-ccd
```

### 27.2 光束 ID

```text
beam-excitation
beam-raman-signal
beam-pl-emission
beam-fundamental-omega
beam-shg-2omega
beam-blocked
```

### 27.3 CSS 类名

```text
.component
.component-laser
.component-waveplate
.component-sample
.beam
.beam-excitation
.beam-emission
.beam-shg
.annotation
.annotation-formula
.annotation-badge
```

---

## 28. 后续可扩展方向

1. 加入 Raman / PL / SHG 光谱示意图，与光路联动。
2. 加入二维材料样品库：MoS₂、WSe₂、MoSe₂、ReS₂、CrSBr、CIPS。
3. 加入低温磁场模块：cryostat、superconducting magnet、Faraday geometry。
4. 加入偏振角扫描动画。
5. 加入光谱峰位标注，如 A exciton、B exciton、trion、Raman modes、SHG resonance。
6. 加入教学模式：点击元器件显示功能解释。
7. 加入论文示意图导出模板：白底、透明底、深色底。
8. 加入可编辑 JSON 配置导入导出。

---

## 29. 最小可行产品定义

MVP 必须实现：

```text
1. 一个漂亮的 Web 页面。
2. 一个 1600×900 的 SVG 光路画布。
3. 至少六种光路模式：Raman VV、Raman VH、PL、Circular PL、SHG、Polarized SHG。
4. 至少十二种标准元器件。
5. 不同颜色光束。
6. 偏振符号和公式标注。
7. 右侧说明面板。
8. SVG 导出。
```

MVP 不要求：

```text
1. 拖拽。
2. 后端。
3. 用户登录。
4. 真实光线追迹。
5. 复杂物理仿真。
```

---

## 30. 一句话开发原则

> 把每一种光路看作一个由标准元器件、标准光束、标准偏振模块和标准说明面板组合而成的配置对象；把所有视觉表达交给统一 SVG 组件库；把所有布局交给 1600×900 虚拟坐标系统。这样系统既美观、清晰，又容易扩展到 Raman、PL、SHG、线偏振、圆偏振和更多二维材料光谱测试场景。
