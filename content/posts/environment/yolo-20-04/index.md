---
title: "YOLO 目标检测环境搭建"
date: "2020-04-20T00:00:00+08:00"
tags: ["YOLO", "深度学习", "环境配置"]
categories: ["environment"]
draft: false
comments: true
showToc: true
TocOpen: false
description: "从零开始搭建 YOLO 目标检测环境，包含 CUDA、cuDNN、Darknet 的安装与配置。"
---

## 环境概述

本文记录在 Ubuntu 系统上搭建 YOLO 目标检测环境的完整过程。

### 准备工作

- **操作系统**: Ubuntu 18.04 / 20.04
- **GPU**: NVIDIA GTX 1060 及以上
- **Python**: 3.7+

---

## 1. 安装 NVIDIA 驱动

首先检查显卡型号：

```bash
lspci | grep -i nvidia
```

安装推荐驱动：

```bash
sudo apt update
sudo ubuntu-drivers autoinstall
sudo reboot
```

验证安装：

```bash
nvidia-smi
```

---

## 2. 安装 CUDA

下载 CUDA Toolkit 10.2：

```bash
wget https://developer.download.nvidia.com/compute/cuda/10.2/Prod/local_installers/cuda_10.2.89_440.33.01_linux.run
sudo sh cuda_10.2.89_440.33.01_linux.run
```

添加到环境变量：

```bash
echo 'export PATH=/usr/local/cuda-10.2/bin:$PATH' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH=/usr/local/cuda-10.2/lib64:$LD_LIBRARY_PATH' >> ~/.bashrc
source ~/.bashrc
```

---

## 3. 安装 cuDNN

从 NVIDIA 官网下载 cuDNN，解压并复制文件：

```bash
tar -xzvf cudnn-10.2-linux-x64-v7.6.5.32.tgz
sudo cp cuda/include/cudnn*.h /usr/local/cuda/include
sudo cp cuda/lib64/libcudnn* /usr/local/cuda/lib64
sudo chmod a+r /usr/local/cuda/include/cudnn*.h /usr/local/cuda/lib64/libcudnn*
```

---

## 4. 编译 Darknet

```bash
git clone https://github.com/AlexeyAB/darknet.git
cd darknet

# 修改 Makefile，启用 GPU 和 CUDNN
sed -i 's/GPU=0/GPU=1/' Makefile
sed -i 's/CUDNN=0/CUDNN=1/' Makefile
sed -i 's/OPENCV=0/OPENCV=1/' Makefile

make -j$(nproc)
```

---

## 5. 下载 YOLOv4 权重

```bash
wget https://github.com/AlexeyAB/darknet/releases/download/darknet_yolo_v3_optimal/yolov4.weights
```

---

## 6. 测试运行

```bash
./darknet detector test cfg/coco.data cfg/yolov4.cfg yolov4.weights data/dog.jpg
```

如果一切顺利，会在当前目录生成 `predictions.jpg`，标出了检测到的目标。

---

## 常见问题

| 问题 | 解决方案 |
|------|---------|
| `nvidia-smi` 找不到 | 重启系统，确认 Secure Boot 已关闭 |
| CUDA 编译失败 | 确认 gcc 版本兼容 (gcc-7 或 gcc-8) |
| 显存不足 | 减小 `cfg/yolov4.cfg` 中的 `batch` 和 `subdivisions` |

---

> 本文参考了 [AlexeyAB/darknet](https://github.com/AlexeyAB/darknet) 项目文档。
