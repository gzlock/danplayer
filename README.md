<p align="center">
<img src="./logo.png" alt="DanPlayer" width="100">
</p>

# 弹幕播放器

- 使用Canvas绘制弹幕
- 丰富的自定义选项

### HTML
```html
<!--如果需要播放HLS格式的视频资源，必须引入hls.js-->
<script src="https://cdn.jsdelivr.net/npm/hls.js@0.12.4/dist/hls.min.js"></script>

<!--如果需要播放MPD格式的视频资源，必须引入dash.js-->
<script src="https://cdn.jsdelivr.net/npm/dashjs@3.0.0/dist/dash.mediaplayer.min.js"></script>

<!--引入DanPlayer的js-->
<script src="//cdn.jsdelivr.net/gh/gzlock/danplayer/dist/danplayer.umd.min.js"></script>

```

### NPM(TODO)
```
npm install danplayer
```

## 全局配置

### 自动播放
    
1. video元素的autoplay属性 `<video autoplay>`
2. 配置参数的autoplay字段
    
### 配置播放资源网址
    
1. video元素的src属性 `<video src="">`
2. 配置参数的src字段
3. 1和2都有的情况下，会使用参数的src资源

[javascript 使用范例](./README.js.md)

[typescript 使用范例](./README.ts.md)

## 安装依赖
```
yarn install
```

### 启动热更新的开发模式
```
yarn run serve
```

### 编译，输出到 ./dist 文件夹
```
yarn run build-lib
```

### 检修代码格式
```
yarn run lint
```

# 特别鸣谢
暂无

