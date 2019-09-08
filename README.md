<p align="center">
<img src="./logo.png" alt="DanPlayer" width="100">
</p>

# 弹幕播放器

- 使用Canvas绘制弹幕
- 丰富的自定义选项

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
    
1. video元素的autoplay属性 `<video autoplay>`
2. 配置参数的autoplay字段
    
### 配置播放资源网址
    
1. video元素的src属性 `<video src="">`
2. 配置参数的src字段
3. 1和2都有的情况下，会使用参数的src资源

### 添加自定义按钮(放置在控制栏右方区域，画质选项按钮 或 全屏按钮的左侧)

```html
<script land="ts"></script>
```
```typescript
import Player from './src/player/player'
// 选取<video>元素
const $video = document.querySelector('video')

// 创建两个按钮
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

### 自定义弹幕的鼠标右键菜单按钮(默认只有"复制"一个按钮)
```typescript
import Player from './src/player/player'
import { DanmakuDrawer } from './src/player/danmaku/danmakuDrawer'
import { Danmaku, DanmakuType } from './src/player/danmaku/danmaku' 

// 选取<video>元素
const $video = document.querySelector('video')

// 创建一条弹幕，用 id属性 标记弹幕的发送人，模拟是自己发的弹幕
const danmaku = new Danmaku('我发送的弹幕', {id:'myself'})
// 再创建一条弹幕，模拟是别人发的
const danmaku1 = new Danmaku('其他人发送的弹幕', {id:'other',type:DanmakuType.Top})

const player = new Player($video, {
          width: 600,
          volume: 0,
          danmaku: {
            contextMenu: (drawer: DanmakuDrawer) => {
              const items: any = {}
              if (drawer.danmaku.id === 'myself') { // 自己的弹幕，添加【撤回】按钮，按钮的逻辑需要你自己实现
                items['撤回'] = () => {
                  alert('撤回的弹幕内容：\n' + drawer.danmaku.text)
                }
              } else { // 别人的弹幕，添加【举报】按钮，按钮的逻辑需要你自己实现
                items['举报'] = () => {
                  alert('举报的弹幕内容：\n' + drawer.danmaku.text)
                }
              }
              return items
            }
          }
        })

// 一次填充多条弹幕
player.fillDanmakus([danmaku,danmaku1])
```

# 特别鸣谢
暂无

