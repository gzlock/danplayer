### 添加自定义按钮(放置在控制栏右方区域，画质选项按钮 或 全屏按钮的左侧)

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

