# Chrome 插件安装说明

本项目已经封装为 Chrome Manifest V3 插件。插件不会访问外部网络，点击浏览器扩展图标后会在新标签页打开完整光路系统。

## 本地安装

1. 打开 Chrome，进入 `chrome://extensions/`。
2. 打开右上角“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择本项目根目录 `D:\Dev Studio\Optical V2`。
5. 点击工具栏中的“光路模块化分析系统”图标即可打开。

## 打包发布

在 `chrome://extensions/` 中点击“打包扩展程序”，扩展程序根目录选择本项目根目录即可生成 `.crx` 和 `.pem` 文件。

## 文件入口

- `manifest.json`：Chrome 插件配置。
- `extension/background.js`：点击插件图标时打开 `index.html`。
- `index.html`：完整应用入口。
