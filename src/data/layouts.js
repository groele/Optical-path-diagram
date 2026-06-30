/* src/data/layouts.js */

/**
 * Data configurations for the 15 optical presets in a "T"-shape configuration.
 * Horizontal axis at y = 350, vertical microscope axis at x = 700.
 */
export const opticalLayouts = {
  // 1. Overview Page
  overview: {
    id: "overview",
    title: "系统总览",
    subtitle: "Confocal Platform Overview",
    category: "Intro",
    type: "info-page",
    components: [],
    beams: [],
    info: {
      purpose: "多功能共焦显微光谱系统总揽。集成式 Raman / PL / SHG 显微测试平台，包括激发、分束、收集和多种探测分析通道。",
      polarization: "偏振态在各个通道中被起偏器、波片和检偏器精准调控。",
      notes: [
        "激光器模块在左侧提供多波长激发源。",
        "共焦显微主臂垂直分布于中间，样品位于最下方。",
        "分光及光谱采集模块分布在右侧检测臂。"
      ]
    }
  },

  // 2. Laser Source Intro
  laserIntro: {
    id: "laserIntro",
    title: "激发光源与激光器介绍",
    subtitle: "Laser Source & Selection",
    category: "Intro",
    type: "info-page",
    components: [],
    beams: [],
    info: {
      purpose: "连续激光器 (CW)、皮秒激光器 (ps) 与飞秒激光器 (fs) 性能指标及波长匹配说明。",
      polarization: "激发源提供高消光比线偏振光，用作精密偏振光谱学的初态极化准备。",
      notes: [
        "连续激光常用于稳态光谱（Raman、PL）。",
        "脉冲激光常用于时间分辨动力学测试（SHG、荧光寿命）。"
      ]
    }
  },

  // 3. Spectrometer Intro
  spectrometerIntro: {
    id: "spectrometerIntro",
    title: "光谱仪结构与光栅分光",
    subtitle: "Spectrometer & Grating",
    category: "Intro",
    type: "info-page",
    components: [],
    beams: [],
    info: {
      purpose: "经典反射式 Czerny-Turner 色散光谱仪内部原理介绍。展示狭缝、准直镜、反射光栅、聚焦镜与 CCD 探测器的组成。",
      polarization: "进入光谱仪的偏振态由前端检偏器决定，体现出信号分析极向。",
      notes: [
        "1800 lines/mm 光栅适合高分辨拉曼光谱分析。",
        "150 lines/mm 光栅适合宽谱 PL 激发和 SHG 的捕获。"
      ]
    }
  },

  // 4. Component Lib Intro
  componentLib: {
    id: "componentLib",
    title: "精密光学元器件库",
    subtitle: "Confocal Optics Library",
    category: "Intro",
    type: "info-page",
    components: [],
    beams: [],
    info: {
      purpose: "精密显微光谱测试所使用的 12 种核心光学元器件库详细说明。",
      polarization: "点击或悬浮各元件可查看其光学常数、偏振调制矩阵或透过谱线说明。",
      notes: [
        "包括有源激发、被动相位延迟、滤波偏振滤除等类别。",
        "每个元器件内置标准工业级指标参数。"
      ]
    }
  },

  // 5. Raman Intro Page
  ramanIntro: {
    id: "ramanIntro",
    title: "拉曼光谱测试原理",
    subtitle: "Raman Scattering Theory",
    category: "Raman",
    type: "info-page",
    components: [],
    beams: [],
    info: {
      purpose: "显微共焦拉曼光谱 (Raman) 测试原理。通过入射激光与晶格声子发生非弹性碰撞，产生带有能量频移的色散光子信号，揭示材料的振动能级与结构特征。",
      polarization: "偏振拉曼根据 Raman 张量选择定则，选择性探测平行或垂直偏振的声子模式强度。",
      notes: [
        "激发光源：532 nm 连续激光，具有极高的光子截面。",
        "散射类型：斯托克斯 (Stokes) 散射产生能量降低的光子；反斯托克斯 (Anti-Stokes) 产生能量升高的光子。",
        "选择定则：振动引起的极化率变化决定了拉曼模式是否活跃。"
      ]
    }
  },

  // 6. Standard Raman
  ramanStandard: {
    id: "ramanStandard",
    title: "标准拉曼光谱测试",
    subtitle: "Standard Raman Intensity Setup",
    category: "Raman",
    components: [
      { id: "laser-main", type: "laser", x: 160, y: 350, rotation: 0, label: "532nm 激发激光器", params: { wavelength: "532 nm", mode: "CW" } },
      { id: "filter-excitation", type: "filter", subtype: "band-pass", x: 420, y: 350, rotation: 0, label: "激光净化滤光片 (BP)" },
      { id: "beam-splitter-main", type: "beamsplitter", x: 700, y: 350, rotation: 0, label: "分束镜 (BS)" },
      { id: "objective-main", type: "objective", x: 700, y: 580, rotation: 0, label: "物镜 (50×)", params: { NA: "0.75" } },
      { id: "sample-main", type: "sample", x: 700, y: 720, rotation: 0, label: "2D 样品 (MoS₂)", params: { material: "MoS₂", temperature: "300 K" } },
      { id: "filter-notch", type: "filter", subtype: "notch", x: 980, y: 350, rotation: 0, label: "陷波滤光片" },
      { id: "spectrometer-main", type: "spectrometer", x: 1260, y: 350, rotation: 0, label: "高分辨光谱仪" },
      { id: "detector-ccd", type: "detector", subtype: "CCD", x: 1420, y: 350, rotation: 0, label: "CCD 探测器" }
    ],
    beams: [
      {
        id: "beam-excitation",
        type: "excitation",
        colorToken: "var(--laser-green)",
        width: 4,
        points: [[160, 350], [700, 350], [700, 720]],
        label: "532nm 激发光",
        hasPolarization: true,
        polarizationPoints: [[260, 350], [560, 350], [700, 410], [700, 520], [700, 650]]
      },
      {
        id: "beam-raman-signal",
        type: "signal",
        colorToken: "var(--beam-raman)",
        width: 3.5,
        points: [[700, 720], [700, 350], [1420, 350]],
        label: "Raman 散射信号",
        hasPolarization: true,
        polarizationPoints: [[700, 650], [700, 520], [700, 410], [840, 350], [1090, 350], [1280, 350]]
      }
    ],
    annotations: [
      { id: "ann-standard", type: "badge", x: 1040, y: 270, text: "强度光谱测量 (非偏振)" },
      { id: "ann-formula", type: "formula", x: 1060, y: 180, text: "I_Raman ∝ σ_eff · I_laser" }
    ],
    info: {
      purpose: "T型标准拉曼光谱测试几何（非偏振）。激发波长为 532 nm 连续激光，分色镜/分束镜 DM 在中心反射激光向下，聚焦并收集拉曼散射信号，透射向右进入高分辨光谱仪。",
      polarization: "非偏振测量。沿光路追踪显示基础偏振状态（起偏与检偏均无，入射激光保持原偏振）。",
      notes: [
        "激发光源：532 nm 连续激光，提供高激发效率。",
        "光谱仪光栅：1800 lines/mm 高色散光栅，实现高精细光谱分辨率，用于分析拉曼峰位。",
        "陷波滤光片 (Notch)：有效滤除 532nm 瑞利散射背景光，防止光谱仪饱和。"
      ]
    }
  },



  // 8. Raman VV (Parallel Polarized)
  ramanVV: {
    id: "ramanVV",
    title: "平行偏振拉曼测试 (VV)",
    subtitle: "Parallel Polarized Raman Geometry",
    category: "Raman",
    components: [
      { id: "laser-main", type: "laser", x: 160, y: 350, rotation: 0, label: "532nm 激发激光器", params: { wavelength: "532 nm", mode: "CW" } },
      { id: "polarizer-input", type: "polarizer", x: 420, y: 350, rotation: 0, label: "起偏器 (P: V)", params: { angleDeg: 90 } },
      { id: "beam-splitter-main", type: "beamsplitter", x: 700, y: 350, rotation: 0, label: "分束镜 (BS)" },
      { id: "objective-main", type: "objective", x: 700, y: 580, rotation: 0, label: "物镜 (50×)" },
      { id: "sample-main", type: "sample", x: 700, y: 720, rotation: 0, label: "MoS₂ 晶体", params: { material: "MoS₂", crystalAngle: 0, isInteractive: true, sliderId: "sampleAngle" } },
      { id: "filter-notch", type: "filter", subtype: "notch", x: 980, y: 350, rotation: 0, label: "陷波滤光片" },
      { id: "analyzer-output", type: "analyzer", x: 1180, y: 350, rotation: 0, label: "检偏器 (A: V)", params: { angleDeg: 90 } },
      { id: "spectrometer-main", type: "spectrometer", x: 1380, y: 350, rotation: 0, label: "高分辨光谱仪" },
      { id: "detector-ccd", type: "detector", subtype: "CCD", x: 1500, y: 350, rotation: 0, label: "CCD 探测器" }
    ],
    beams: [
      {
        id: "beam-excitation",
        type: "excitation",
        colorToken: "var(--laser-green)",
        width: 4,
        points: [[160, 350], [700, 350], [700, 720]],
        label: "垂直起偏激发 (V)",
        hasPolarization: true,
        polarizationPoints: [[260, 350], [560, 350], [700, 520], [700, 650]]
      },
      {
        id: "beam-raman-signal",
        type: "signal",
        colorToken: "var(--beam-raman)",
        width: 3.5,
        points: [[700, 720], [700, 350], [1500, 350]],
        label: "平行收集信号 (V)",
        hasPolarization: true,
        polarizationPoints: [[700, 650], [700, 520], [840, 350], [1080, 350], [1280, 350]]
      }
    ],
    annotations: [
      { id: "ann-vv", type: "badge", x: 1040, y: 270, text: "VV 平行偏振测试几何" },
      { id: "ann-formula", type: "formula", x: 1060, y: 180, text: "A₁g 模 (全对称): I ∝ a²" }
    ],
    info: {
      purpose: "T型平行偏振拉曼光谱测量 (VV)。激发偏振方向为垂直 (V, 90°)，检偏过滤方向同样固定在垂直 (V, 90°)。**中间光路无旋转 HWP**，直接测定固定轴平行偏振分量。",
      polarization: "固定 V 线极化激发与 V 检偏。1800 g/mm 色散光栅。",
      notes: [
        "激发光源使用 532 nm 连续激光器。",
        "全对称声子模式 (如 MoS₂ 的 A₁g 模式，~408 cm⁻¹) 在 VV 平行极化配置下具有极大强度响应。",
        "此测试不使用波片，仅依靠起偏与检偏器固定偏振轴测量平行分量。"
      ]
    }
  },

  // 9. Raman VH (Cross Polarized)
  ramanVH: {
    id: "ramanVH",
    title: "正交偏振拉曼测试 (VH)",
    subtitle: "Cross Polarized Raman Geometry",
    category: "Raman",
    components: [
      { id: "laser-main", type: "laser", x: 160, y: 350, rotation: 0, label: "532nm 激发激光器", params: { wavelength: "532 nm", mode: "CW" } },
      { id: "polarizer-input", type: "polarizer", x: 420, y: 350, rotation: 0, label: "起偏器 (P: V)", params: { angleDeg: 90 } },
      { id: "beam-splitter-main", type: "beamsplitter", x: 700, y: 350, rotation: 0, label: "分束镜 (BS)" },
      { id: "objective-main", type: "objective", x: 700, y: 580, rotation: 0, label: "物镜" },
      { id: "sample-main", type: "sample", x: 700, y: 720, rotation: 0, label: "MoS₂ 晶体", params: { material: "MoS₂", crystalAngle: 0, isInteractive: true, sliderId: "sampleAngle" } },
      { id: "filter-notch", type: "filter", subtype: "notch", x: 980, y: 350, rotation: 0, label: "陷波滤光片" },
      { id: "analyzer-output", type: "analyzer", x: 1180, y: 350, rotation: 0, label: "检偏器 (A: H)", params: { angleDeg: 0 } },
      { id: "spectrometer-main", type: "spectrometer", x: 1380, y: 350, rotation: 0, label: "高分辨光谱仪" },
      { id: "detector-ccd", type: "detector", subtype: "CCD", x: 1500, y: 350, rotation: 0, label: "CCD" }
    ],
    beams: [
      {
        id: "beam-excitation",
        type: "excitation",
        colorToken: "var(--laser-green)",
        width: 4,
        points: [[160, 350], [700, 350], [700, 720]],
        label: "垂直起偏激发 (V)",
        hasPolarization: true,
        polarizationPoints: [[260, 350], [560, 350], [700, 520], [700, 650]]
      },
      {
        id: "beam-raman-signal",
        type: "signal",
        colorToken: "var(--beam-raman)",
        width: 3.5,
        points: [[700, 720], [700, 350], [1500, 350]],
        label: "正交收集信号 (H)",
        hasPolarization: true,
        polarizationPoints: [[700, 650], [700, 520], [840, 350], [1080, 350], [1280, 350]]
      }
    ],
    annotations: [
      { id: "ann-vh", type: "badge", x: 1040, y: 270, text: "VH 交叉偏振测试几何" },
      { id: "ann-formula", type: "formula", x: 1060, y: 180, text: "E' 模 (剪切): I ∝ d²" }
    ],
    info: {
      purpose: "T型正交/交叉偏振拉曼光谱测量 (VH)。起偏器固定于垂直 (V, 90°)，检偏器固定于水平 (H, 0°)。**中间光路无旋转 HWP**，直接测定固定轴正交极化分量。",
      polarization: "固定 V 线极化激发与 H 检偏。1800 g/mm 色散光栅。",
      notes: [
        "激发光源使用 532 nm 连续激光器。",
        "非全对称的 E' 剪切模 (~383 cm⁻¹) 在 VH 交叉偏振几何下会有强度的贡献（当晶轴与极化成夹角时）。",
        "此测试不使用波片，仅靠起偏与检偏器固定正交偏振轴进行测定。"
      ]
    }
  },

  // 10. Polarization Raman (Polarized scan)
  ramanPolarized: {
    id: "ramanPolarized",
    title: "极分辨拉曼偏振扫查",
    subtitle: "Polarization-resolved Raman Geometry",
    category: "Raman",
    components: [
      { id: "laser-main", type: "laser", x: 160, y: 350, rotation: 0, label: "532nm 激发激光", params: { wavelength: "532 nm", mode: "CW" } },
      { id: "polarizer-input", type: "polarizer", x: 420, y: 350, rotation: 0, label: "起偏器 (P)", params: { angleDeg: 90, axisLabel: "V" } },
      { id: "beam-splitter-main", type: "beamsplitter", x: 700, y: 350, rotation: 0, label: "分束镜 (BS)" },
      { id: "hwp-input", type: "waveplate", subtype: "HWP", x: 700, y: 450, rotation: 0, label: "旋转 HWP", params: { angleDeg: 0, isInteractive: true, sliderId: "hwpAngle" } },
      { id: "objective-main", type: "objective", x: 700, y: 610, rotation: 0, label: "物镜 (50×)", params: { NA: "0.75" } },
      { id: "sample-main", type: "sample", x: 700, y: 720, rotation: 0, label: "2D 样品 (MoS₂)", params: { material: "MoS₂", crystalAngle: 0, isInteractive: true, sliderId: "sampleAngle" } },
      { id: "filter-notch", type: "filter", subtype: "notch", x: 980, y: 350, rotation: 0, label: "陷波滤光片" },
      { id: "analyzer-output", type: "analyzer", x: 1180, y: 350, rotation: 0, label: "检偏器 (A)", params: { angleDeg: 90, isInteractive: true, sliderId: "analyzerAngle" } },
      { id: "spectrometer-main", type: "spectrometer", x: 1380, y: 350, rotation: 0, label: "光谱仪" },
      { id: "detector-ccd", type: "detector", subtype: "CCD", x: 1500, y: 350, rotation: 0, label: "CCD 探测器" }
    ],
    beams: [
      {
        id: "beam-excitation",
        type: "excitation",
        colorToken: "var(--laser-green)",
        width: 4,
        points: [[160, 350], [700, 350], [700, 720]],
        label: "532nm 激发光",
        hasPolarization: true,
        polarizationPoints: [[260, 350], [560, 350], [700, 410], [700, 520], [700, 650]]
      },
      {
        id: "beam-raman-signal",
        type: "signal",
        colorToken: "var(--beam-raman)",
        width: 3.5,
        points: [[700, 720], [700, 350], [1500, 350]],
        label: "Raman 散射信号",
        hasPolarization: true,
        polarizationPoints: [[700, 650], [700, 520], [700, 410], [840, 350], [1080, 350], [1280, 350]]
      }
    ],
    annotations: [
      { id: "ann-prrs", type: "badge", x: 1040, y: 270, text: "极分辨偏振拉曼扫描" },
      { id: "ann-formula", type: "formula", x: 1060, y: 180, text: "E' 剪切模: I ∝ cos²(4θ_hwp - θ_A)" },
      {
        id: "hwp-rotator",
        type: "rotator",
        x: 740,
        y: 450,
        targetX: 700,
        targetY: 450,
        labelWidth: 238,
        text: "HWP 自动转台 (镜头-分束镜间)",
        title: "电动旋转台",
        detail: "双通极化调制"
      },
      {
        id: "analyzer-rotator",
        type: "rotator",
        x: 1200,
        y: 210,
        targetX: 1180,
        targetY: 350,
        labelWidth: 246,
        text: "检偏器转台 (平行/正交)",
        title: "检偏器旋转座",
        detail: "声子极化各向异性"
      }
    ],
    info: {
      purpose: "T型偏振分辨拉曼光谱。半波片 HWP 位于显微镜头与二向色镜/分束镜之间，为激光激发和拉曼散射信号双路共用（复用结构）。",
      polarization: "起偏器 P 过滤线偏振（V, 90°），旋转的 HWP 提供高精度、自动化的偏振极角依赖扫描。双通回程导致 A1g 声子恒定，E' 剪切声子显示 4-fold 四瓣偏振花形。",
      notes: [
        "激光器使用 532 nm 稳态连续激发源。",
        "光谱仪使用 1800 lines/mm 高分辨衍射光栅，以捕获微弱声子频移。",
        "半波片转台和检偏器转台可在右侧面板控制，在线测量拉曼晶格对称性与散射强度各向异性。"
      ]
    }
  },

  // 11. PL Intro Page
  plIntro: {
    id: "plIntro",
    title: "光致发光测试原理",
    subtitle: "Photoluminescence Theory",
    category: "PL",
    type: "info-page",
    components: [],
    beams: [],
    info: {
      purpose: "光致发光 (PL) 测试原理。物质吸收光子后，物质内部电子跃迁至激发态，经过非辐射弛豫后受激跃迁返回低能态，在此过程中辐射释放出新光子，表现出自发辐射发光。",
      polarization: "线偏振 PL 用于分析晶体结构低对称激子各向异性；圆偏振 PL 用于分析 TMDs 二维半导体的自旋谷偏振定则。",
      notes: [
        "激发光源已全系统统一为：532 nm 稳态连续激发源。",
        "带隙限制：吸收的光子能量必须大于半导体的带隙宽度（Eg），即 hν_exc > Eg。",
        "弛豫发射：电子受激跃迁到导带（CB），释放热量弛豫到导带底，再与价带（VB）顶的空穴复合，释放荧光（PL）。"
      ]
    }
  },

  // 12. Photoluminescence
  plStandard: {
    id: "plStandard",
    title: "PL 测试",
    subtitle: "Standard Photoluminescence Setup",
    category: "PL",
    components: [
      { id: "laser-main", type: "laser", x: 160, y: 350, rotation: 0, label: "532nm 激发激光器", params: { wavelength: "532 nm", mode: "CW" } },
      { id: "filter-excitation", type: "filter", subtype: "band-pass", x: 420, y: 350, rotation: 0, label: "激发滤光片 (BP)" },
      { id: "dichroic-main", type: "dichroic", x: 700, y: 350, rotation: 0, label: "二向色镜 (DM)" },
      { id: "objective-main", type: "objective", x: 700, y: 580, rotation: 0, label: "物镜 (50×)", params: { NA: "0.75" } },
      { id: "sample-main", type: "sample", x: 700, y: 720, rotation: 0, label: "单层 MoS₂ 样品", params: { material: "MoS₂", temperature: "300 K" } },
      { id: "filter-longpass", type: "filter", subtype: "long-pass", x: 980, y: 350, rotation: 0, label: "长通滤光片 (LP)" },
      { id: "spectrometer-main", type: "spectrometer", x: 1260, y: 350, rotation: 0, label: "色散光谱仪" },
      { id: "detector-ccd", type: "detector", subtype: "CCD", x: 1440, y: 350, rotation: 0, label: "CCD 探测器" }
    ],
    beams: [
      {
        id: "beam-excitation",
        type: "excitation",
        colorToken: "var(--laser-green)",
        width: 4.5,
        points: [[160, 350], [700, 350], [700, 720]],
        label: "532nm 激发光",
        hasPolarization: true,
        polarizationPoints: [[260, 350], [560, 350], [700, 410], [700, 520], [700, 650]]
      },
      {
        id: "beam-pl-emission",
        type: "signal",
        colorToken: "var(--beam-pl)",
        width: 5,
        points: [[700, 720], [700, 350], [1440, 350]],
        label: "PL 荧光信号",
        hasPolarization: true,
        polarizationPoints: [[700, 650], [700, 520], [700, 410], [840, 350], [1060, 350], [1260, 350]]
      }
    ],
    annotations: [
      { id: "ann-ex", type: "badge", x: 700, y: 270, text: "反射 532nm 激发光" },
      { id: "ann-em", type: "badge", x: 840, y: 290, text: "透射 600-800nm 发光" },
      { id: "ann-formula", type: "formula", x: 1060, y: 180, text: "PL激子能量: hν_PL < hν_exc" }
    ],
    info: {
      purpose: "T型标准光致发光 (PL) 测试系统。主要用于激子、Trion 及缺陷态发光强度与峰位谱线分析。",
      polarization: "非偏振发光测试。入射偏振被二向色镜反射保留；收集的自发辐射 PL 信号通常呈部分偏振或非偏振状态。",
      notes: [
        "激发光源已全系统统一为：532 nm 稳态连续激发源。",
        "分光光栅：150 lines/mm 低色散宽谱光栅，可一次性宽波段记录 600 - 800 nm 荧光包络。",
        "二向色镜 (DM)：高效率截断 532nm 激发，高透射样品产生的光致发光波段。"
      ]
    }
  },

  // 13. Polarization PL
  plPolarized: {
    id: "plPolarized",
    title: "线偏振分辨 PL 光谱",
    subtitle: "Polarization-resolved PL Geometry",
    category: "PL",
    components: [
      { id: "laser-main", type: "laser", x: 160, y: 350, rotation: 0, label: "532nm 激发激光", params: { wavelength: "532 nm", mode: "CW" } },
      { id: "polarizer-input", type: "polarizer", x: 420, y: 350, rotation: 0, label: "起偏器 (P)", params: { angleDeg: 90 } },
      { id: "dichroic-main", type: "dichroic", x: 700, y: 350, rotation: 0, label: "二向色镜 (DM)" },
      { id: "hwp-output", type: "waveplate", subtype: "HWP", x: 700, y: 450, rotation: 0, label: "旋转 HWP", params: { angleDeg: 0, isInteractive: true, sliderId: "hwpAngle" } },
      { id: "objective-main", type: "objective", x: 700, y: 610, rotation: 0, label: "物镜" },
      { id: "sample-main", type: "sample", x: 700, y: 720, rotation: 0, label: "各向异性 2D 样品", params: { material: "ReS₂", temperature: "300 K" } },
      { id: "filter-longpass", type: "filter", subtype: "long-pass", x: 960, y: 350, rotation: 0, label: "长通滤光片" },
      { id: "analyzer-output", type: "analyzer", x: 1180, y: 350, rotation: 0, label: "检偏器 (A)", params: { angleDeg: 90, isInteractive: true, sliderId: "analyzerAngle" } },
      { id: "spectrometer-main", type: "spectrometer", x: 1360, y: 350, rotation: 0, label: "光谱仪" },
      { id: "detector-ccd", type: "detector", subtype: "CCD", x: 1480, y: 350, rotation: 0, label: "CCD" }
    ],
    beams: [
      {
        id: "beam-excitation",
        type: "excitation",
        colorToken: "var(--laser-green)",
        width: 4,
        points: [[160, 350], [700, 350], [700, 720]],
        label: "线偏振激发",
        hasPolarization: true,
        polarizationPoints: [[260, 350], [560, 350], [700, 410], [700, 520], [700, 650]]
      },
      {
        id: "beam-pl-emission",
        type: "signal",
        colorToken: "var(--beam-pl)",
        width: 4.5,
        points: [[700, 720], [700, 350], [1480, 350]],
        label: "发光收集臂",
        hasPolarization: true,
        polarizationPoints: [[700, 650], [700, 520], [700, 410], [840, 350], [1060, 350], [1270, 350]]
      }
    ],
    annotations: [
      { id: "ann-dolp", type: "formula", x: 1060, y: 180, text: "DOLP = (I_∥ - I_⟂) / (I_∥ + I_⟂)" },
      {
        id: "hwp-rotator",
        type: "rotator",
        x: 740,
        y: 450,
        targetX: 700,
        targetY: 450,
        labelWidth: 238,
        text: "HWP 自动转台 (共享复用)",
        title: "电动旋转台",
        detail: "线偏振角扫描"
      },
      {
        id: "analyzer-rotator",
        type: "rotator",
        x: 1200,
        y: 210,
        targetX: 1180,
        targetY: 350,
        labelWidth: 246,
        text: "检偏器转台",
        title: "检偏器旋转座",
        detail: "线偏振解析角"
      }
    ],
    info: {
      purpose: "T型线偏振分辨发光测试（Polarization PL）。利用镜头与二向色镜之间共用的 HWP 调节激发和发射线极化，探测低对称晶体激子辐射各向异性。",
      polarization: "共享 HWP 复用偏振调控。激发光与返回 PL 光双路穿过 HWP，由右侧检偏器解析各向异性分量。光谱仪使用 150 lines/mm 光栅。",
      notes: [
        "激发光源统一为 532 nm 稳态连续激发源。",
        "常用于测量二维各项异性半导体（如 ReS₂、黑磷 BP）的偏振依赖激子发射。",
        "可以通过偏振度 DOLP 来表征发光的偏振各向异性强度。"
      ]
    }
  },

  // 14. Circular Polarization PL (Valley PL)
  plValley: {
    id: "plValley",
    title: "谷分辨/圆偏振 PL 测试",
    subtitle: "Circular Polarization Valley PL",
    category: "PL",
    components: [
      { id: "laser-main", type: "laser", x: 160, y: 350, rotation: 0, label: "532nm 连续激光器", params: { wavelength: "532 nm", mode: "CW" } },
      { id: "polarizer-input", type: "polarizer", x: 420, y: 350, rotation: 0, label: "起偏器 (P)", params: { angleDeg: 90 } },
      { id: "dichroic-main", type: "dichroic", x: 700, y: 350, rotation: 0, label: "二向色镜" },
      { id: "qwp-input", type: "waveplate", subtype: "QWP", x: 700, y: 450, rotation: 0, label: "共享显微臂 QWP", params: { angleDeg: 45, isInteractive: true, sliderId: "qwpAngle" } },
      { id: "objective-main", type: "objective", x: 700, y: 610, rotation: 0, label: "物镜" },
      { id: "sample-main", type: "sample", x: 700, y: 720, rotation: 0, label: "TMD 样品 (低温强磁腔)", params: { material: "WSe₂", temperature: "1.7 K", field: "B = 0 T", hasCryostat: true, hasBField: true } },
      { id: "filter-longpass", type: "filter", subtype: "long-pass", x: 960, y: 350, rotation: 0, label: "长通滤光片" },
      { id: "analyzer-output", type: "analyzer", x: 1180, y: 350, rotation: 0, label: "检偏器 (A)", params: { angleDeg: 90 } },
      { id: "spectrometer-main", type: "spectrometer", x: 1340, y: 350, rotation: 0, label: "光谱仪" },
      { id: "detector-ccd", type: "detector", subtype: "CCD", x: 1480, y: 350, rotation: 0, label: "CCD" }
    ],
    beams: [
      {
        id: "beam-excitation",
        type: "excitation",
        colorToken: "var(--laser-green)",
        width: 4,
        points: [[160, 350], [700, 350], [700, 720]],
        label: "σ⁺ 圆偏振激发",
        hasPolarization: true,
        polarizationPoints: [[260, 350], [560, 350], [700, 410], [700, 520], [700, 650]]
      },
      {
        id: "beam-pl-emission",
        type: "signal",
        colorToken: "var(--beam-pl)",
        width: 4.5,
        points: [[700, 720], [700, 350], [1480, 350]],
        label: "圆偏振发光收集",
        hasPolarization: true,
        polarizationPoints: [[700, 650], [700, 520], [700, 410], [840, 350], [1060, 350], [1270, 350]]
      }
    ],
    annotations: [
      { id: "ann-docp", type: "formula", x: 1060, y: 180, text: "DOCP = (I_σ⁺ - I_σ⁻) / (I_σ⁺ + I_σ⁻)" },
      { id: "ann-valley", type: "badge", x: 700, y: 270, text: "自旋谷定则保护" },
      {
        id: "qwp-rotator",
        type: "rotator",
        x: 740,
        y: 450,
        targetX: 700,
        targetY: 450,
        labelWidth: 250,
        text: "QWP 自动转台 (1/4波片复用)",
        title: "电动旋转台",
        detail: "σ⁺/σ⁻ 圆偏振切换"
      },
      {
        id: "analyzer-rotator",
        type: "rotator",
        x: 1200,
        y: 210,
        targetX: 1180,
        targetY: 350,
        labelWidth: 254,
        text: "检偏器转台",
        title: "检偏器旋转座",
        detail: "QWP 后线偏振读出"
      }
    ],
    info: {
      purpose: "T型圆偏振/谷分辨 PL 光致发光测试。1/4波片 (QWP) 置于镜头与二向色镜之间共用，实现双路（激发+返回收集）圆偏振状态调制与解析。",
      polarization: "起偏线偏振光经 QWP (快轴 ±45°) 转换为左/右旋圆偏振 (σ⁻/σ⁺) 注入样品。返回发光再次经过该 QWP 转换为线偏振，由检偏器分析极化比例。",
      notes: [
        "激发光源已统一为：532 nm 稳态激发激光，激发光束呈现绿色。",
        "样品放置于 1.7K 低温、强垂直超导磁场 (B_z) 环境中，以诱导 Zeeman 分裂 and 增强自旋谷寿命。",
        "光谱仪使用 150 lines/mm 低色散光栅并仿真谷极化效应。"
      ]
    }
  },

  // 15. Lifetime Measurement
  lifetime: {
    id: "lifetime",
    title: "时间分辨荧光寿命测量",
    subtitle: "Time-Resolved Lifetime TRPL",
    category: "Lifetime",
    components: [
      { id: "laser-main", type: "laser", x: 160, y: 350, rotation: 0, label: "532nm ps脉冲激光器", params: { wavelength: "532 nm", mode: "ps" } },
      { id: "filter-excitation", type: "filter", subtype: "band-pass", x: 420, y: 350, rotation: 0, label: "激发滤光片 (BP)" },
      { id: "dichroic-main", type: "dichroic", x: 700, y: 350, rotation: 0, label: "二向色镜 (DM)" },
      { id: "objective-main", type: "objective", x: 700, y: 580, rotation: 0, label: "物镜" },
      { id: "sample-main", type: "sample", x: 700, y: 720, rotation: 0, label: "TMD 发光薄膜", params: { material: "WS₂", temperature: "300 K" } },
      { id: "filter-longpass", type: "filter", subtype: "long-pass", x: 960, y: 350, rotation: 0, label: "长通滤光片 (LP)" },
      { id: "detector-spad", type: "detector", subtype: "PMT", x: 1180, y: 350, rotation: 0, label: "SPAD 单光子探测器" },
      { id: "tcspc-main", type: "detector", subtype: "PowerMeter", x: 1380, y: 350, rotation: 0, label: "TCSPC 电子计时卡", params: { isInteractive: true, sliderId: "tauValue" } },
      { id: "detector-ccd", type: "detector", subtype: "CCD", x: 1520, y: 350, rotation: 0, label: "数据采集终端 (PC)" }
    ],
    beams: [
      {
        id: "beam-excitation",
        type: "excitation",
        colorToken: "var(--laser-green)",
        width: 4,
        points: [[160, 350], [700, 350], [700, 720]],
        label: "532nm ps激发光",
        hasPolarization: true,
        polarizationPoints: [[260, 350], [560, 350], [700, 410], [700, 520], [700, 650]]
      },
      {
        id: "beam-pl-emission",
        type: "signal",
        colorToken: "var(--beam-pl)",
        width: 4.5,
        points: [[700, 720], [700, 350], [1520, 350]],
        label: "TRPL 收集发光",
        hasPolarization: true,
        polarizationPoints: [[700, 650], [700, 520], [700, 410], [840, 350], [1070, 350], [1280, 350]]
      }
    ],
    annotations: [
      { id: "ann-lifetime", type: "badge", x: 1040, y: 270, text: "荧光寿命测量 (时间分辨 TRPL)" },
      { id: "ann-decay-formula", type: "formula", x: 1060, y: 180, text: "I(t) = I_0 · exp(-t/τ)" }
    ],
    info: {
      purpose: "时间分辨发光光谱 (TRPL) 荧光寿命测量光路。通过 ps 皮秒脉冲激光器激发样品，并由 SPAD 配合 TCSPC 采集卡统计单个光子相对于激发源的时序分布，以生成指数衰减寿命曲线。",
      polarization: "检测线偏振集成发光，追踪偏振状态在通过 LP 与 SPAD 之间的投影变化。探测发光为积分后的寿命衰减物理信号。",
      notes: [
        "脉冲激光器：532 nm ps 脉冲激光器，时间宽度 ~50 ps，用于确立时间零轴 (Start 信号)。",
        "SPAD 单光子雪崩二极管：具有高灵敏度和极低的时间抖动，单光子检测率高 (Stop 信号)。",
        "TCSPC 系统：时间相关单光子计数，利用精密时间-振幅转换器统计差值并绘制直方图。"
      ]
    }
  },

  // 16. SHG Intro Page
  shgIntro: {
    id: "shgIntro",
    title: "二次谐波测量原理",
    subtitle: "Second Harmonic Theory",
    category: "SHG",
    type: "info-page",
    components: [],
    beams: [],
    info: {
      purpose: "非线性光学二次谐波发生 (SHG) 测试原理。当强激光入射非中心对称晶体时，晶格非线性极化导致两个基频光子 (ω) 被同时相干吸收，融合成一个二倍频信号光子 (2ω)。",
      polarization: "极角分辨 SHG 能够精确测量晶体对称性（如 D3h 群单层 MoS₂ 的六角晶格），体现为偏振扫查图样中典型的六瓣花形。",
      notes: [
        "激发光源：1064 nm 飞秒超快红外脉冲激光，提供极高的瞬时峰值功率。",
        "信号波长：1064 nm 基频激发在样品处倍频，产生 532 nm 的绿光二倍频信号。",
        "材料要求：材料必须具有非中心对称性（如单数层 TMDs），偶数层对称中心消除会导致 SHG 淬灭。"
      ]
    }
  },

  // 17. Standard SHG (non-polarized intensity)
  shgStandard: {
    id: "shgStandard",
    title: "标准二次谐波测试 (SHG)",
    subtitle: "Standard SHG Intensity Setup",
    category: "SHG",
    components: [
      { id: "laser-main", type: "laser", x: 160, y: 350, rotation: 0, label: "1064nm fs飞秒激光", params: { wavelength: "1064 nm" } },
      { id: "beam-splitter-main", type: "beamsplitter", x: 700, y: 350, rotation: 0, label: "分束镜 (BS)" },
      { id: "objective-main", type: "objective", x: 700, y: 580, rotation: 0, label: "物镜" },
      { id: "sample-main", type: "sample", x: 700, y: 720, rotation: 0, label: "2D 样品 (MoS₂)", params: { material: "MoS₂", crystalAngle: 0 } },
      { id: "filter-shortpass", type: "filter", subtype: "short-pass", x: 980, y: 350, rotation: 0, label: "短通滤片 (SP)" },
      { id: "filter-bandpass", type: "filter", subtype: "band-pass", x: 1140, y: 350, rotation: 0, label: "532nm 窄带滤片" },
      { id: "detector-pmt", type: "detector", subtype: "PMT", x: 1360, y: 350, rotation: 0, label: "PMT 探测器" }
    ],
    beams: [
      {
        id: "beam-fundamental-omega",
        type: "excitation",
        colorToken: "var(--laser-ir)",
        width: 5,
        points: [[160, 350], [700, 350], [700, 720]],
        label: "1064nm 基频光 (ω)",
        hasPolarization: true,
        polarizationPoints: [[260, 350], [560, 350], [700, 520], [700, 650]]
      },
      {
        id: "beam-shg-2omega",
        type: "signal",
        colorToken: "var(--laser-green)",
        width: 3.5,
        points: [[700, 720], [700, 350], [1360, 350]],
        label: "532nm 二倍频信号 (2ω)",
        hasPolarization: true,
        polarizationPoints: [[700, 650], [700, 520], [860, 350], [1060, 350], [1250, 350]]
      },
      {
        id: "beam-blocked-omega",
        type: "blocked",
        colorToken: "var(--beam-blocked)",
        width: 4,
        points: [[980, 350], [1010, 400]],
        label: "blocked 1064nm",
        hasPolarization: false
      }
    ],
    annotations: [
      { id: "ann-shg-intensity", type: "badge", x: 1040, y: 270, text: "二倍频强度测量 (非偏振)" },
      { id: "ann-formula", type: "formula", x: 1060, y: 180, text: "I(2ω) ∝ (χ⁽²⁾)² · I(ω)²" }
    ],
    info: {
      purpose: "T型标准二次谐波发生 (SHG) 测试几何。利用 1064 nm 飞秒超快脉冲激发样品，不进行偏振扫描，直接在探测端用 PMT 记录 532 nm 处的二倍频强度。",
      polarization: "非偏振依赖性强度测量。激发源提供基础线偏振，收集到的二倍频绿光直接被 PMT 探测。",
      notes: [
        "激发光源使用 1064 nm fs 飞秒激光器提供高峰值能量密度。",
        "短通滤片和 532nm 窄带滤片用于彻底滤除 1064nm 的基频散射背噪。",
        "探测器使用高灵敏度的光电倍增管 (PMT)。"
      ]
    }
  },

  // 18. SHG Polarized
  shgPolarized: {
    id: "shgPolarized",
    title: "极角分辨 SHG 偏振光谱",
    subtitle: "Polarization-resolved SHG Anisotropy",
    category: "SHG",
    components: [
      { id: "laser-main", type: "laser", x: 160, y: 350, rotation: 0, label: "1064nm fs飞秒激光", params: { wavelength: "1064 nm" } },
      { id: "polarizer-input", type: "polarizer", x: 420, y: 350, rotation: 0, label: "起偏器 (P)", params: { angleDeg: 90 } },
      { id: "beam-splitter-main", type: "beamsplitter", x: 700, y: 350, rotation: 0, label: "分束镜 (BS)" },
      { id: "hwp-input", type: "waveplate", subtype: "HWP", x: 700, y: 450, rotation: 0, label: "共享旋转 HWP", params: { angleDeg: 0, isInteractive: true, sliderId: "hwpAngle" } },
      { id: "objective-main", type: "objective", x: 700, y: 610, rotation: 0, label: "物镜" },
      { id: "sample-main", type: "sample", x: 700, y: 720, rotation: 0, label: "2D 样品 (MoS₂)", params: { material: "MoS₂", crystalAngle: 0, isInteractive: true, sliderId: "sampleAngle" } },
      { id: "filter-shortpass", type: "filter", subtype: "short-pass", x: 980, y: 350, rotation: 0, label: "短通波片" },
      { id: "filter-bandpass", type: "filter", subtype: "band-pass", x: 1140, y: 350, rotation: 0, label: "532nm 窄带滤片" },
      { id: "analyzer-output", type: "analyzer", x: 1280, y: 350, rotation: 0, label: "检偏器 (A)", params: { angleDeg: 90, isInteractive: true, sliderId: "analyzerAngle" } },
      { id: "detector-pmt", type: "detector", subtype: "PMT", x: 1440, y: 350, rotation: 0, label: "PMT 探测器" }
    ],
    beams: [
      {
        id: "beam-fundamental-omega",
        type: "excitation",
        colorToken: "var(--laser-ir)",
        width: 5,
        points: [[160, 350], [700, 350], [700, 720]],
        label: "1064nm 基频光 (ω)",
        hasPolarization: true,
        polarizationPoints: [[260, 350], [560, 350], [700, 410], [700, 520], [700, 650]]
      },
      {
        id: "beam-shg-2omega",
        type: "signal",
        colorToken: "var(--laser-green)",
        width: 3.5,
        points: [[700, 720], [700, 350], [1440, 350]],
        label: "532nm 二倍频信号 (2ω)",
        hasPolarization: true,
        polarizationPoints: [[700, 650], [700, 520], [700, 410], [840, 350], [1060, 350], [1200, 350]]
      },
      {
        id: "beam-blocked-omega",
        type: "blocked",
        colorToken: "var(--beam-blocked)",
        width: 4,
        points: [[980, 350], [1010, 400]],
        label: "blocked 1064nm",
        hasPolarization: false
      }
    ],
    annotations: [
      { id: "ann-flower", type: "badge", x: 700, y: 270, text: "六瓣花形偏振各向异性" },
      { id: "ann-formula", type: "formula", x: 1060, y: 180, text: "I_2ω ∝ cos²(3θ_in)" },
      {
        id: "hwp-rotator",
        type: "rotator",
        x: 740,
        y: 450,
        targetX: 700,
        targetY: 450,
        labelWidth: 238,
        text: "HWP 自动转台 (共享复用)",
        title: "电动旋转台",
        detail: "双通极化调控"
      },
      {
        id: "analyzer-rotator",
        type: "rotator",
        x: 1200,
        y: 210,
        targetX: 1280, // Target analyzer coordinate in SHG is 1280!
        targetY: 350,
        labelWidth: 246,
        text: "检偏器转台",
        title: "检偏器旋转座",
        detail: "六瓣花偏振解析"
      }
    ],
    info: {
      purpose: "T型极角分辨二次谐波发生 (SHG) 测试几何。利用 fs 飞秒 1064 nm 脉冲激发，在镜头与二向色镜间复用 HWP 进行双通极化调控，在探测端用 PMT 记录 532 nm 处的二倍频强度。",
      polarization: "半波片在显微臂上共享。激发光在样品生成 -4*θ_hwp 的极化方向，散射信号再次过该 HWP，被分析过滤成 6-fold（六瓣花）极角偏振图样，强烈体现晶体对称性（如 D_3h 结构的单层 MoS₂）。",
      notes: [
        "激发波长：1064 nm fs 飞秒脉冲激光，具有高峰值能量密度。",
        "光谱仪及探测器：PMT 通道配合 150 lines/mm 光栅。",
        "阻断配置：短通波片 (SP) 和 532nm 窄带带通片在收集端彻底滤除残留的 1064nm 基频散射激光。"
      ]
    }
  },

  // 18. Signal Flow Intro
  signalFlow: {
    id: "signalFlow",
    title: "信号流向与数据采集",
    subtitle: "Signal Flow & DAQ",
    category: "Intro",
    type: "info-page",
    components: [],
    beams: [],
    info: {
      purpose: "显微共焦光谱测试的闭环硬件采集流程与时钟触发时序图。",
      polarization: "数据采集是对偏振解析后能量投射分量的数模数字化读取与分析。",
      notes: [
        "包含光子收集、色散分光、电荷积攒、A/D量化和上位机分析过程。",
        "提供高效稳健的时钟脉冲 and 软件采集控制模型。"
      ]
    }
  }
};
