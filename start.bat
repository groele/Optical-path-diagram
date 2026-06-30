@echo off
chcp 65001 >nul
title 模块化光路分析系统 - 一键启动器
echo ====================================================
echo         模块化光路分析系统一键启动器
echo ====================================================
echo 正在检测运行环境...

rem 自动打开默认浏览器访问 localhost:8000
start http://localhost:8000

rem 检测是否安装了 Python 并运行
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [环境检测] 成功检测到 Python 运行环境
    echo [本地服务] 正在启动端口为 8000 的本地静态服务...
    echo [提示] 启动成功！请不要关闭此窗口，关闭窗口服务将终止。
    python -m http.server 8000
    goto end
)

rem 检测是否安装了 Node.js / npx 并运行
where npx >nul 2>nul
if %errorlevel% equ 0 (
    echo [环境检测] 未检测到 Python，检测到 Node.js (npx) 运行环境
    echo [本地服务] 正在通过 npx serve 启动端口为 8000 的本地静态服务...
    echo [提示] 启动成功！请不要关闭此窗口，关闭窗口服务将终止。
    npx serve -l 8000 .
    goto end
)

echo ====================================================
echo [错误] 未能在您的系统上检测到 Python 或 Node.js (npx)！
echo 请确认您的电脑上是否已安装以下环境之一：
echo 1. Python (官网: https://www.python.org)
echo 2. Node.js (官网: https://nodejs.org)
echo ====================================================
pause

:end
