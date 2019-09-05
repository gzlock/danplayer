import { Player } from '@/player/player'
import { Danmaku, DanmakuType } from '@/player/danmaku/danmaku'
import { sortBy, groupBy } from 'lodash'
import { DanmakuDrawer, DanmakuFlowDrawer, DanmakuFixedDrawer } from './danmakuDrawer'
import { EventEmitter } from 'events'
import { Canvas } from '@/player/danmaku/canvas'

export interface DanmakuLayerOptions {
  alpha: number
  enable: boolean
  flowDuration: number
  fadeoutDuration: number
  contextMenu: ((d: DanmakuDrawer) => { [name: string]: () => void }) | undefined
}

const template = '<div class="content"></div><div class="buttons"><span class="copy">复制</span></div>'

function MakeDanmakuDrawerMenu (d: DanmakuDrawer, menus: { [p: string]: () => void }, copyFn: (text: string) => void): HTMLDivElement {
  const $div = document.createElement('div')
  $div.innerHTML = template
  const $content = $div.querySelector('.content') as HTMLElement
  $content.innerText = d.danmaku.text
  const $buttons = $div.querySelector('.buttons') as HTMLDivElement
  for (let key in menus) {
    const $span = document.createElement('span')
    $span.innerText = key
    $span.onclick = menus[key]
    $buttons.prepend($span)
  }
  const $copy = $div.querySelector('.copy') as HTMLElement
  if ($copy) {
    $copy.addEventListener('click', () => copyFn(d.danmaku.text))
  }

  return $div
}

export function MakeDanmakuLayerOptions ({
  alpha = 1,
  enable = true,
  flowDuration = 8,
  fadeoutDuration = 5,
  contextMenu = undefined
}: Partial<DanmakuLayerOptions> = {}): DanmakuLayerOptions {
  return { alpha, enable, flowDuration, fadeoutDuration, contextMenu }
}

export class DanmakuLayer {
  private player: Player
  private readonly canvas: Canvas
  private $menu!: HTMLElement

  // 弹幕内容池
  danmakus: Danmaku[] = []
  showed: Danmaku[] = []

  // 池
  topEnables: DanmakuFixedDrawer[] = []
  topAndBottomDisables: DanmakuFixedDrawer[] = []
  bottomEnables: DanmakuFixedDrawer[] = []
  flowEnables: DanmakuFlowDrawer[] = []
  flowDisables: DanmakuFlowDrawer[] = []

  private topTop = 0
  private flowTop = 0
  private bottomTop = 0

  // 上一帧的生成时间
  private frameTime: number = 0
  // 计算弹幕坐标的时间
  private calcDanmakuTime: number = 0

  isShow = true

  private width = 0
  private height = 0
  private calcTopInterval: number = -1
  private destroied: boolean = false

  private event: EventEmitter
  private addDanmakuToCanvasTime: number = 0
  private lastFrame: number = 0

  constructor (player: Player) {
    this.player = player
    this.event = new EventEmitter()

    this.canvas = new Canvas(player)

    DanmakuDrawer.drawCanvas = this.canvas

    const hideMenu = () => {
      document.removeEventListener('click', hideMenu)
      document.removeEventListener('contextmenu', hideMenu)
      this.$menu.remove()
    }

    this.canvas.$canvas.addEventListener('contextmenu', (e: MouseEvent) => {
      const found = this.findDrawers(e)
      if (found.length > 0) {
        this.createDanmakuMenu(found)

        let x = e.pageX
        let y = e.pageY
        const right = e.clientX + this.$menu.clientWidth
        const bottom = e.clientY + this.$menu.clientHeight

        if (right > document.body.clientWidth) {
          x -= right - document.body.clientWidth
        }
        if (bottom > document.body.clientHeight) {
          y -= bottom - document.body.clientHeight
        }
        this.$menu.style.left = x + 'px'
        this.$menu.style.top = y + 'px'
        document.addEventListener('click', hideMenu)
        document.addEventListener('touchstart', hideMenu)
        document.addEventListener('contextmenu', hideMenu)
      }
      e.preventDefault()
      e.stopPropagation()
      return false
    })

    this.player.$video.addEventListener('seeked', () => {
      this.clear()
    })

    if (this.player.options.danmaku.enable) {
      this.show()
    } else {
      this.hide()
    }
    this.loop()
  }

  private createDanmakuMenu (drawers: DanmakuDrawer[]) {
    if (this.$menu) this.$menu.remove()
    this.$menu = document.createElement('div')
    this.$menu.className = 'float show danmaku-context-menu'
    for (let i = 0; i < drawers.length; i++) {
      const drawer = drawers[i]
      if (this.player.options.danmaku.contextMenu) {
        const $menu = MakeDanmakuDrawerMenu(drawer, this.player.options.danmaku.contextMenu(drawer), text => this.copyText(text))
        this.$menu.append($menu)
      }
    }
    document.body.append(this.$menu)
  }

  show () {
    this.isShow = true
  }

  hide () {
    this.isShow = false
    this.canvas.clear()
  }

  clear () {
    this.showed.length = 0
    this.canvas.clear()
    this.canvas.clearCache()
    this.topAndBottomDisables.push(...this.topEnables)
    this.topEnables.length = 0
    this.flowDisables.push(...this.flowEnables)
    this.flowEnables.length = 0
  }

  resize () {
    this.width = this.player.$root.clientWidth
    this.height = this.player.$root.clientHeight
    this.canvas.resize()
  }

  toggle (): void {
    if (this.isShow) {
      this.hide()
    } else {
      this.show()
    }
  }

  send (d: Danmaku) {
    this.danmakus.push(d)
  }

  private findDrawers (e: MouseEvent): DanmakuDrawer[] {
    return [
      ...this.topEnables.filter(drawer => DanmakuLayer.find(e, drawer)),
      ...this.bottomEnables.filter(drawer => DanmakuLayer.find(e, drawer)),
      ...this.flowEnables.filter(drawer => DanmakuLayer.find(e, drawer))
    ]
  }

  private static find (e: MouseEvent, drawer: DanmakuDrawer): boolean {
    if (e.offsetX > drawer.left && e.offsetX < (drawer.left + drawer.width)) {
      if (e.offsetY > drawer.top && e.offsetY < (drawer.top + drawer.height)) {
        return true
      }
    }
    return false
  }

  private addDanmakuToCanvas () {
    let hasChange = false
    for (let i = 0; i < this.danmakus.length; i++) {
      const danmaku = this.danmakus[i]
      const time = Math.abs(this.player.currentTime - danmaku.currentTime)
      if (this.showed.includes(danmaku)) continue
      if (time > 0.1) continue
      hasChange = true
      this.showed.push(danmaku)

      let top
      if (danmaku.type === DanmakuType.Flow) {
        top = this.calcFlowTop()
        // 控制弹幕数据，但确保发弹幕的人看到自己的弹幕
        if (top === -1 && !danmaku.borderColor) {
          continue
        }
        let drawer = this.flowDisables.shift()
        if (!drawer) {
          drawer = new DanmakuFlowDrawer()
        }
        drawer.set(danmaku, this.width, this.flowTop)
        this.flowEnables.push(drawer)
        this.canvas.addDrawer(drawer)
        drawer.update(this.width, this.player.options.danmaku.flowDuration, 0)
      } else {
        let drawer = this.topAndBottomDisables.shift()
        if (!drawer) {
          drawer = new DanmakuFixedDrawer()
        }
        if (danmaku.type === DanmakuType.Top) {
          top = this.calcTopTop(drawer)
          if (top === -1 && !danmaku.borderColor) {
            continue
          }
          drawer.set(danmaku, this.player.options.danmaku.fadeoutDuration, this.width, top)
          this.topEnables.push(drawer)
        } else {
          top = this.calcBottomTop(drawer)
          if (top === -1 && !danmaku.borderColor) {
            continue
          }
          drawer.set(danmaku, this.player.options.danmaku.fadeoutDuration, this.width, top)
          this.bottomEnables.push(drawer)
        }
        drawer.update(0)
        this.canvas.addDrawer(drawer)
      }
      this.canvas.renderAll(this.player.options.danmaku.alpha)
    }
  }

  $input!: HTMLInputElement

  copyText (text: string) {
    if (!this.$input) {
      this.$input = this.player.$root.querySelector('input.copy-tool') as HTMLInputElement
    }
    this.$input.value = text
    this.$input.select()
    document.execCommand('copy')
  }

  private calcFlowTop (): number {
    if (this.flowEnables.length === 0) {
      return -1
    }
    const lineHeight = this.flowEnables[0].height
    // 按top坐标分组
    const lines = groupBy<DanmakuFlowDrawer>(this.flowEnables, (item) => Math.floor(item.top))
    let top = 0

    for (let key in lines) {
      const drawers: DanmakuFlowDrawer[] = sortBy(lines[key], drawer => drawer.left + drawer.width)
      const drawer: DanmakuFlowDrawer = drawers[drawers.length - 1]
      if ((drawer.left + drawer.width) < this.width) {
        top = drawer.top
        break
      } else {
        top += drawer.height
      }
    }
    if (top + lineHeight > this.height) {
      console.log('高度超出画布')
      top = -1
    }
    return -1
  }

  private calcTopTop (drawer: DanmakuFixedDrawer): number {
    let top = -1
    if (drawer.enable) {
      const height = drawer.top + drawer.height
      if (height > this.height) {
        this.topTop = drawer.top = 0
      } else {
        top = this.topTop = height
      }
    } else if (drawer.top < this.topTop) {
      top = this.topTop = drawer.top
    }
    return top
  }

  private calcBottomTop (drawer: DanmakuFixedDrawer): number {
    let top = -1
    if (drawer.enable) {
      if (drawer.top <= 0) {
        drawer.top = this.height - drawer.height
      }
      top = this.bottomTop = drawer.top - drawer.height
    } else if (drawer.top > this.bottomTop) {
      top = this.bottomTop = drawer.top
    }
    return top
  }

  /**
   * 绘制弹幕
   */
  private drawDanmaku () {
    this.topEnables = this.topEnables.filter(drawer => {
      if (drawer.enable) {
        drawer.update(this.frameTime)
        return true
      } else {
        this.canvas.removeDrawer(drawer)
        this.topAndBottomDisables.push(drawer)
        this.calcTopTop(drawer)
        return false
      }
    })

    this.bottomEnables = this.bottomEnables.filter(drawer => {
      if (drawer.enable) {
        drawer.update(this.frameTime)
        return true
      } else {
        this.canvas.removeDrawer(drawer)
        this.topAndBottomDisables.push(drawer)
        this.calcBottomTop(drawer)
        return false
      }
    })

    this.flowEnables = this.flowEnables.filter(drawer => {
      if (drawer.enable) {
        drawer.update(this.width, this.player.options.danmaku.flowDuration, this.frameTime)
        return true
      } else {
        this.canvas.removeDrawer(drawer)
        this.flowDisables.push(drawer)
        return false
      }
    })
  }

  private loop () {
    if (this.destroied) return
    this.addDanmakuToCanvas()
    this.addDanmakuToCanvasTime = (Date.now() - this.lastFrame) / 1000
    if (!this.player.paused) {
      this.drawDanmaku()
      this.calcDanmakuTime = (Date.now() - this.lastFrame) / 1000

      if (this.isShow) {
        this.canvas.renderAll(this.player.options.danmaku.alpha)
      } else {
        this.canvas.clear()
      }
    }
    this.frameTime = (Date.now() - this.lastFrame) / 1000
    this.lastFrame = Date.now()
    window.requestAnimationFrame(() => { this.loop() })
  }

  destroy () {
    this.destroied = true
    clearInterval(this.calcTopInterval)
    if (this.$menu) {
      this.$menu.remove()
    }
  }

  get debug (): Object {
    return {
      isShow: this.isShow,
      all: this.danmakus.length,
      showed: this.showed.length,
      // 耗时
      time: {
        addDanmakuToCanvas: this.addDanmakuToCanvasTime,
        drawDanmaku: this.calcDanmakuTime,
        frameTime: this.frameTime
      },
      fixed: {
        top: this.topEnables.length,
        bottom: this.bottomEnables.length,
        disabled: this.topAndBottomDisables.length
      },
      flow: {
        enables: this.flowEnables.length,
        disabled: this.flowDisables.length
      },
      top: {
        top: this.topTop,
        flow: this.flowTop,
        bottom: this.bottomTop
      }
    }
  }
}
