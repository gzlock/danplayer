<p align="center">
<img src="./logo.png" alt="DanPlayer" width="100">
</p>


# DanPlayer 弹幕播放器 [Demo体验](https://gzlock.github.io/danplayer)
[![Build Status](https://www.travis-ci.org/gzlock/danplayer.svg?branch=master)](https://www.travis-ci.org/gzlock/danplayer) [![](https://data.jsdelivr.com/v1/package/npm/danplayer/badge)](https://www.jsdelivr.com/package/npm/danplayer)

<p align="center">
<img src="./images/screenshot.png" alt="screenshot">
</p>

* 请以最终实际使用效果为准。
* Vue只是用来做Demo页面，播放器本身的代码没有使用到Vue相关的代码

### 功能简介：

- 使用Canvas绘制弹幕
- 支持的自定义设置
    - 播放器的高亮颜色
    - 播放器右下角的功能按钮
    - 弹幕右键菜单的功能按钮
    - 普通/直播 视频模式
    - 开/关 全屏功能
    - 开/关 底部控制栏中间的发弹幕功能区域
    - 显示/隐藏 全部弹幕
    - 弹幕全局透明度
    - 弹幕的全局字体大小
    - 流动式弹幕的移动速度(从右到左移动的弹幕)
    - 固定式弹幕的隐藏时间(固定在视频顶部和底部的弹幕)
    - 限制弹幕的显示区域，效果接近B站的相关设置
    - 控制栏发弹幕的[发送]按钮，点击后会触发传给player参数的beforeSendDanmaku**异步函数**字段 [详情](https://github.com/gzlock/danplayer/wiki/%E5%AE%8C%E6%95%B4%E7%9A%84%E5%8F%82%E6%95%B0%E5%AD%97%E6%AE%B5%E8%A1%A8)
        * 函数逻辑自由实现，可以是提交弹幕内容到服务器
        * 返回true，会渲染这次发送的弹幕到屏幕
        * 返回false，则不渲染这次发送的弹幕到屏幕
    - **HLS和MPD支持选择画质级别**
- 支持的视频格式：
    - 优先检测浏览器能否原生支持播放，例如mp4视频文件，mp3音频文件
    - 当浏览器不支持HLS视频，则使用[hls.js](https://github.com/video-dev/hls.js)
    - 当浏览器不支持MPD视频，则使用[dash.js](https://github.com/Dash-Industry-Forum/dash.js)
    
- 版本历史：
    - 0.0.32 
        * 弹幕右键菜单的'复制'按钮适配语言文本设置，优化'复制'按钮的功能逻辑
        * 增加Loading提示
    - 0.0.31 优化画质级别逻辑
    - 0.0.30 继续优化画质级别的逻辑
    - 0.0.29 优化Hls.js和Dash.js的画质级别逻辑，增加界面文本的配置，具体说明请浏览Wiki
    - 0.0.28 更新依赖，增加forceUse配置项，具体说明请浏览Wiki
    - 0.0.25 增加快进(forward)/倒退(backward)时间的自定义设置，默认为5秒
    - 0.0.24 增加Toast显示一些操作的提示，例如键盘上下键加减音量时的提示，拖动进度条时的时间提示等

# [使用指南请参阅Wiki](https://github.com/gzlock/danplayer/wiki)

# 特别鸣谢
暂无

#### 播放器中的图标来自 [iconfont.cn](https://www.iconfont.cn/collections/detail?cid=5375)

