# 无名播放器

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

## 配置

### 自动播放
    依赖<video autoplay>属性，有autoplay属性就自动播放，没有autoplay就不会自动播放

### 添加扩展按钮(放置在控制栏右方区域，画质选项按钮 或 全屏按钮的左侧)

```typescript
import Player from './src/player/player'
const $video = document.querySelector('video')
const $btn: HTMLElement = document.createElement('div')
$btn.classList.add('extra-button')
$btn.innerHTML = '自定义按钮1'
$btn.onclick = () => { alert('hello world 1!') }
const $btn2: HTMLElement = document.createElement('div')
$btn2.classList.add('extra-button')
$btn2.innerHTML = '自定义按钮2'
$btn2.onclick = () => { alert('hello world 2!') }
new Player($video, {extraButtons: [$btn, $btn2]})
```
