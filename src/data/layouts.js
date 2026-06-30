/* src/data/layouts.js */

/**
 * Data configurations for the 12 optical presets in a "T"-shape configuration.
 * Horizontal axis at y = 350, vertical microscope axis at x = 700.
 */
export const opticalLayouts = {
  // 1. Overview Page
  overview: {
    id: "overview",
    title: "系统总览",
    subtitle: "Confocal Platform Overview",
    category: "Overview",
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

  // 2. Standard Raman
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

  // 3. Polarization Raman
  ramanPolarized: {
    id: "ramanPolarized",
    title: "偏振 Raman 测试",
    subtitle: "Polarization-resolved Raman Geometry",
    category: "Raman",
    components: [
      { id: "laser-main", type: "laser", x: 160, y: 350, rotation: 0, label: "532nm 激发激光", params: { wavelength: "532 nm", mode: "CW" } },
      { id: "polarizer-input", type: "polarizer", x: 420, y: 350, rotation: 0, label: "起偏器 (P)", params: { angleDeg: 90, axisLabel: "V" } },
      { id: "beam-splitter-main", type: "beamsplitter", x: 700, y: 350, rotation: 0, label: "分束镜 (BS)" },
      { id: "hwp-input", type: "waveplate", subtype: "HWP", x: 700, y: 470, rotation: 0, label: "旋转 HWP", params: { angleDeg: 0, isInteractive: true, sliderId: "hwpAngle" } },
      { id: "objective-main", type: "objective", x: 700, y: 580, rotation: 0, label: "物镜 (50×)", params: { NA: "0.75" } },
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
      { id: "hwp-rotator", type: "rotator", x: 740, y: 470, text: "HWP 自动转台 (镜头-分束镜间)" },
      { id: "analyzer-rotator", type: "rotator", x: 1200, y: 270, text: "检偏器转台 (平行/正交)" }
    ],
    info: {
      purpose: "T型偏振分辨拉曼光谱。半波片 HWP 位于显微镜头与二向色镜/分束镜之间，为激光激发和拉曼散射信号双路共用（复用结构）。",
      polarization: "起偏器 P 过滤线偏振（V, 90°），HWP 旋转激发线极化角。双通回程导致 A1g 声子无各向异性（恒定），E' 剪切声子显示 4-fold 四瓣偏振花形。",
      notes: [
        "激光器使用 532 nm 稳态连续激发源。",
        "光谱仪使用 1800 lines/mm 高分辨衍射光栅，以捕获微弱声子频移。",
        "半波片转台和检偏器转台可在右侧面板控制，在线测量拉曼晶格对称性与散射强度各向异性。"
      ]
    }
  },

  // 4. Photoluminescence
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
        "激发光源：532 nm 连续激光，具有极高的激子共振功率密度。",
        "分光光栅：150 lines/mm 低色散宽谱光栅，可一次性宽波段记录 600 - 800 nm 荧光包络。",
        "二向色镜 (DM)：高效率截断 532nm 激发，高透射样品产生的光致发光波段。"
      ]
    }
  },

  // 5. Polarization PL
  plPolarized: {
    id: "plPolarized",
    title: "偏振 PL 测试",
    subtitle: "Polarization-resolved PL Geometry",
    category: "PL",
    components: [
      { id: "laser-main", type: "laser", x: 160, y: 350, rotation: 0, label: "532nm 激发激光", params: { wavelength: "532 nm", mode: "CW" } },
      { id: "polarizer-input", type: "polarizer", x: 420, y: 350, rotation: 0, label: "起偏器 (P)", params: { angleDeg: 90 } },
      { id: "dichroic-main", type: "dichroic", x: 700, y: 350, rotation: 0, label: "二向色镜 (DM)" },
      { id: "hwp-output", type: "waveplate", subtype: "HWP", x: 700, y: 470, rotation: 0, label: "旋转 HWP", params: { angleDeg: 0, isInteractive: true, sliderId: "hwpAngle" } },
      { id: "objective-main", type: "objective", x: 700, y: 580, rotation: 0, label: "物镜" },
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
      { id: "hwp-rotator", type: "rotator", x: 740, y: 470, text: "HWP 自动转台 (共享复用)" },
      { id: "analyzer-rotator", type: "rotator", x: 1200, y: 270, text: "检偏器转台" }
    ],
    info: {
      purpose: "T型线偏振分辨发光测试（Polarization PL）。利用镜头与二向色镜之间共用的 HWP 调节激发和发射线极化，探测低对称晶体激子辐射各向异性。",
      polarization: "共享 HWP 复用偏振调控。激发光与返回 PL 光双路穿过 HWP，由右侧检偏器解析各向异性分量。光谱仪使用 150 lines/mm 光栅。",
      notes: [
        "常用于测量二维各项异性半导体（如 ReS₂、黑磷 BP）的偏振依赖激子发射。",
        "可以通过偏振度 DOLP 来表征发光的偏振各向异性强度。"
      ]
    }
  },

  // 6. Circular Polarization PL (Valley PL)
  plValley: {
    id: "plValley",
    title: "圆偏振测试",
    subtitle: "Circular Polarization Valley PL",
    category: "PL",
    components: [
      { id: "laser-main", type: "laser", x: 160, y: 350, rotation: 0, label: "532nm 连续激光器", params: { wavelength: "532 nm", mode: "CW" } },
      { id: "polarizer-input", type: "polarizer", x: 420, y: 350, rotation: 0, label: "起偏器 (P)", params: { angleDeg: 90 } },
      { id: "dichroic-main", type: "dichroic", x: 700, y: 350, rotation: 0, label: "二向色镜" },
      { id: "qwp-input", type: "waveplate", subtype: "QWP", x: 700, y: 470, rotation: 0, label: "共享显微臂 QWP", params: { angleDeg: 45, isInteractive: true, sliderId: "qwpAngle" } },
      { id: "objective-main", type: "objective", x: 700, y: 580, rotation: 0, label: "物镜" },
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
      { id: "qwp-rotator", type: "rotator", x: 740, y: 470, text: "QWP 自动转台 (1/4波片复用)" },
      { id: "analyzer-rotator", type: "rotator", x: 1200, y: 270, text: "检偏器转台" }
    ],
    info: {
      purpose: "T型圆偏振/谷分辨 PL 光致发光测试。1/4波片 (QWP) 置于镜头与二向色镜之间共用，实现双路（激发+返回收集）圆偏振状态调制与解析。",
      polarization: "起偏线偏振光经 QWP (快轴 ±45°) 转换为左/右旋圆偏振 (σ⁻/σ⁺) 注入样品。返回发光再次经过该 QWP 转换为线偏振，由检偏器分析极化比例。",
      notes: [
        "样品放置于 1.7K 低温、强垂直超导磁场 (B_z) 环境中，以诱导 Zeeman 分裂和增强自旋谷寿命。",
        "光谱仪使用 150 lines/mm 低色散光栅。",
        "本模式主要展示和仿真 valley polarization (谷偏振) 和 valley coherence (谷相干) 现象。"
      ]
    }
  },

  // 8. SHG
  shgPolarized: {
    id: "shgPolarized",
    title: "二次谐波测试",
    subtitle: "Polarization-resolved SHG Anisotropy",
    category: "SHG",
    components: [
      { id: "laser-main", type: "laser", x: 160, y: 350, rotation: 0, label: "1064nm fs飞秒激光", params: { wavelength: "1064 nm" } },
      { id: "polarizer-input", type: "polarizer", x: 420, y: 350, rotation: 0, label: "起偏器 (P)", params: { angleDeg: 90 } },
      { id: "beam-splitter-main", type: "beamsplitter", x: 700, y: 350, rotation: 0, label: "分束镜 (BS)" },
      { id: "hwp-input", type: "waveplate", subtype: "HWP", x: 700, y: 470, rotation: 0, label: "共享旋转 HWP", params: { angleDeg: 0, isInteractive: true, sliderId: "hwpAngle" } },
      { id: "objective-main", type: "objective", x: 700, y: 580, rotation: 0, label: "物镜" },
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
      { id: "hwp-rotator", type: "rotator", x: 740, y: 470, text: "HWP 自动转台 (共享复用)" },
      { id: "analyzer-rotator", type: "rotator", x: 1200, y: 270, text: "检偏器转台" }
    ],
    info: {
      purpose: "T型极角分辨二次谐波发生 (SHG) 测试几何。利用 fs 飞秒 1064 nm 脉冲激发，在镜头与二向色镜间复用 HWP 进行双通极化调控，在探测端用 PMT 记录 532 nm 处的二倍频强度。",
      polarization: "半波片在显微臂上共享。激发光在样品生成 -4*θ_hwp 的极化方向，散射信号再次过该 HWP，被分析过滤成 6-fold（六瓣花）极角偏振图样，强烈体现晶体对称性（如 D_3h 结构的单层 MoS₂）。",
      notes: [
        "激发波长：1064 nm fs 飞秒脉冲激光，具有高峰值能量密度。",
        "光谱仪及探测器：PMT 通道配合 150 lines/mm 光栅。",
        "滤光片阻断：短通波片 (SP) 和 532nm 窄带带通片在水平收集端彻底滤除残留的强 1064nm 基频散射激光。"
      ]
    }
  },

  // 9. Lifetime Measurement
  lifetime: {
    id: "lifetime",
    title: "寿命测量",
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

  // 10. Laser Source Explanation
  laserIntro: {
    id: "laserIntro",
    title: "激光器介绍",
    subtitle: "Laser Source & Selection",
    category: "Basics",
    type: "info-page",
    components: [],
    beams: [],
    info: {
      purpose: "连续激光器 (CW)、皮秒激光器 (ps) 与飞秒激光器 (fs) 性能指标及波长匹配说明。",
      polarization: "激发源提供高消光比线偏振光，用作精密偏振光谱学的初态极化准备。",
      notes: [
        "连续激光常用于稳态光谱（Raman、PL）。",
        "脉冲激光常用于动力学测试（SHG、荧光寿命）。"
      ]
    }
  },

  // 11. Spectrometer Explanation
  spectrometerIntro: {
    id: "spectrometerIntro",
    title: "光谱仪介绍",
    subtitle: "Spectrometer & Grating",
    category: "Basics",
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

  // 12. Component Library Explanation
  componentLib: {
    id: "componentLib",
    title: "光学元器件库",
    subtitle: "Confocal Optics Library",
    category: "Basics",
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

  // 13. Signal Flow Explanation
  signalFlow: {
    id: "signalFlow",
    title: "信号流与数据采集",
    subtitle: "Signal Flow & DAQ",
    category: "Basics",
    type: "info-page",
    components: [],
    beams: [],
    info: {
      purpose: "显微共焦光谱测试的闭环硬件采集流程与时钟触发时序图。",
      polarization: "数据采集是对偏振解析后能量投射分量的数模数字化读取与分析。",
      notes: [
        "包含光子收集、色散分光、电荷积攒、A/D量化和上位机分析过程。",
        "提供高效稳健的时钟脉冲和软件采集控制模型。"
      ]
    }
  }
};
