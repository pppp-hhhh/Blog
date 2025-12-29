# 使用DISM++安装Windows系统的方法

## 第一步：下载DISM++和Windows镜像

* **Dism++：https://github.com/Chuyu-Team/Dism-Multi-language**
  ![Dism++下载](https://cdn.jsdelivr.net/gh/pppp-hhhh/blogimage@main/1.png)
* **Windows10镜像推荐前往[MSDN](https://msdn.itellyou.cn/)下载**
  ![MSDN官网](https://cdn.jsdelivr.net/gh/pppp-hhhh/blogimage@main/2.png)

## 第二步：使用DISM++安装Windows系统

### 打开DISM++
![Dism++打开](https://cdn.jsdelivr.net/gh/pppp-hhhh/blogimage@main/3.png)

### 点击左上角的文件，选择释放镜像（快捷键：Ctrl+N）

![Dism++释放镜像](https://cdn.jsdelivr.net/gh/pppp-hhhh/blogimage@main/4.png)
![Dism++释放镜像](https://cdn.jsdelivr.net/gh/pppp-hhhh/blogimage@main/7.png)

### 点击浏览，选中下载好的Windows镜像，点击确定
![Dism++释放镜像](https://cdn.jsdelivr.net/gh/pppp-hhhh/blogimage@main/5.png)

### 选择要安装的版本，点击确定
![Dism++释放镜像](https://cdn.jsdelivr.net/gh/pppp-hhhh/blogimage@main/9.png)

### 选择安装位置，点击确定
注意：安装位置选择你要安装的磁盘，一般是C盘
![Dism++释放镜像](https://cdn.jsdelivr.net/gh/pppp-hhhh/blogimage@main/6.png)

### 勾选添加引导和格式化
![Dism++释放镜像](https://cdn.jsdelivr.net/gh/pppp-hhhh/blogimage@main/8.png)

### 点击确认，然后点击更多，选择你的启动磁盘
![Dism++释放镜像](https://cdn.jsdelivr.net/gh/pppp-hhhh/blogimage@main/10.png)

### 再点击确认，静待安装完成

## 第三步：重启电脑，进入BIOS设置

### 重启电脑，进入BIOS设置
注意：不同品牌的电脑进入BIOS设置的方法不同，一般是在开机时按下F2、F10、F12、Delete等键，具体方法请参考你的电脑说明书。

### 设置启动顺序
注意：将启动顺序设置为UEFI模式，然后将Windows Boot Manager设置为第一启动项。

### 保存设置并重启电脑
注意：在BIOS设置中，一般有一个保存设置的选项，点击它保存设置并重启电脑。

## 进入Windows安装界面
注意：电脑会自动重启，进入Windows安装界面。