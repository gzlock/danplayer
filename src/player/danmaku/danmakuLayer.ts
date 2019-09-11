import { Player } from '@/player/player'
import { Danmaku, DanmakuType } from '@/player/danmaku/danmaku'
import { DanmakuDrawer, DanmakuFixedDrawer, DanmakuFlowDrawer } from './danmakuDrawer'
import { EventEmitter } from 'events'
import { Canvas } from '@/player/danmaku/canvas'

export enum LimitType {
  UnLimited = 0, // 不限
  UnOverlap = 1, // 防重叠
  Percent25 = 1 / 4, // 25%屏显示弹幕
  Half = 0.5, // 50%屏显示弹幕
  Percent75 = 1 / 4, // 75%屏显示弹幕
}

export interface DanmakuLayerOptions {
  alpha: number
  enable: boolean
  flowDuration: number
  fadeoutDuration: number,
  fontSize: number,
  limit: LimitType // 防重叠选项
  contextMenu: ((danmaku: Danmaku) => { [name: string]: () => void }) | undefined
}

export function MakeDanmakuLayerOptions ({
  alpha = 1,
  enable = true,
  flowDuration = 8,
  fadeoutDuration = 5,
  fontSize = 28,
  limit = LimitType.UnOverlap,
  contextMenu = undefined
}: Partial<DanmakuLayerOptions> = {}): DanmakuLayerOptions {
  return { alpha, enable, flowDuration, fontSize, limit, fadeoutDuration, contextMenu }
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
  private readonly lineHeights: number[] = []
  private readonly topLines: { [height: string]: DanmakuDrawer | null } = {}
  private readonly bottomLines: any = {}
  private readonly flowLines: any = {}
  private displayArea: number = 0

  private topY = 0
  private flowY = 0
  private bottomY = 0

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
  private lineHeight!: number

  constructor (player: Player) {
    this.player = player
    this.event = new EventEmitter()

    this.canvas = new Canvas(player)

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
    this.canvas.$canvas.addEventListener('dblclick', () => {
      this.player.toggleFullScreen()
    })

    this.player.$video.addEventListener('seeked', () => {
      this.clear()
    })

    this.loop()
  }

  private createDanmakuMenu (drawers: DanmakuDrawer[]) {
    if (this.$menu) this.$menu.remove()
    this.$menu = document.createElement('div')
    this.$menu.className = 'float show danmaku-context-menu'
    for (let i = 0; i < drawers.length; i++) {
      const drawer = drawers[i]
      if (this.player.options.danmaku.contextMenu) {
        const $menu = MakeDanmakuDrawerMenu(drawer, this.player.options.danmaku.contextMenu(drawer.danmaku), text => this.copyText(text))
        this.$menu.append($menu)
      }
    }
    document.body.append(this.$menu)
  }

  show () {
    this.isShow = true
  }

  hide () {
    this.canvas.clear()
    this.isShow = false
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
    this.lineHeight = Math.round(this.canvas.fontHeight(this.player.options.danmaku.fontSize))

    this.lineHeights.length = 0
    // 每次resize都计算屏幕最大行数，因为有可能在多个不同分辨率的屏幕切换
    for (let y = 0; y < window.screen.height; y++) {
      const height = y * this.lineHeight
      if (height > window.screen.height) break
      this.lineHeights.push(height)

      if (!this.topLines.hasOwnProperty(height)) {
        this.topLines[height] = null
      }
      if (!this.bottomLines.hasOwnProperty(height)) {
        this.bottomLines[height] = []
      }
      if (!this.flowLines.hasOwnProperty(height)) {
        this.flowLines[height] = []
      }
    }

    this.canvas.resize()
    const limit = this.player.options.danmaku.limit
    if (limit === LimitType.Percent75) {
      this.displayArea = this.player.height * 0.75
    } else if (limit === LimitType.Half) {
      this.displayArea = this.player.height * 0.5
    } else if (limit === LimitType.Percent25) {
      this.displayArea = this.player.height * 0.25
    } else {
      this.displayArea = this.player.height
    }
    this.canvas.alpha = this.player.options.danmaku.alpha
    this.canvas.renderAll()
  }

  toggle (): void {
    if (this.isShow) {
      this.hide()
    } else {
      this.show()
    }
  }

  send (d: Danmaku) {
    d.text = d.text.trim()
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
    if (this.danmakus.length === 0) return
    for (let i = 0; i < this.danmakus.length; i++) {
      const danmaku = this.danmakus[i]
      const time = Math.abs(this.player.currentTime - danmaku.currentTime)
      if (this.showed.includes(danmaku)) continue
      if (time > 0.1) continue
      this.showed.push(danmaku)

      let top
      if (danmaku.type === DanmakuType.Flow) {
        let drawer = this.flowDisables.shift() || new DanmakuFlowDrawer()
        drawer.enable = true
        drawer.set(danmaku, this.width, this.calcFlowTop(drawer))
        drawer.update(this.width, this.player.options.danmaku.flowDuration, 0)
        this.flowEnables.push(drawer)
        this.canvas.addDrawer(drawer)
      } else {
        let drawer = this.topAndBottomDisables.shift() || new DanmakuFixedDrawer()
        drawer.enable = true
        if (danmaku.type === DanmakuType.Top) {
          drawer.set(danmaku, this.player.options.danmaku.fadeoutDuration, this.width, this.calcTopTop(drawer))
          this.topEnables.push(drawer)
        } else {
          let top = this.calcBottomTop(drawer) + this.lineHeight
          top = this.height - top
          drawer.set(danmaku, this.player.options.danmaku.fadeoutDuration, this.width, top)
          this.bottomEnables.push(drawer)
        }
        drawer.update(0)
        this.canvas.addDrawer(drawer)
      }
      this.canvas.renderAll()
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

  private calcFlowTop (drawer: DanmakuFlowDrawer): number {
    for (let key in this.flowLines) {
      const _d: DanmakuDrawer = this.flowLines[key]
      const height = Number(key)
      const right = _d.left + _d.width
      if (_d && _d.enable && right > this.width) continue
      if (height > this.displayArea) break
      console.log('发现空行', key)
      this.flowLines[key] = drawer
      this.flowY = height
      return height
    }
    this.flowY += this.lineHeight
    if (this.flowY > this.displayArea) this.flowY = 0
    this.flowLines[this.flowY] = drawer
    return this.flowY
  }

  private calcTopTop (drawer: DanmakuFixedDrawer): number {
    for (let key in this.topLines) {
      const _d = this.topLines[key]
      const height = Number(key)
      if (_d && _d.enable) continue
      if (height > this.displayArea) break
      console.log('发现空行', key)
      this.topLines[key] = drawer
      this.topY = height
      return height
    }
    this.topY += this.lineHeight
    if (this.topY > this.displayArea) this.topY = 0
    this.topLines[this.topY] = drawer
    return this.topY
  }

  private calcBottomTop (drawer: DanmakuFixedDrawer): number {
    for (let key in this.bottomLines) {
      const _d = this.bottomLines[key]
      const height = Number(key)
      if (_d && _d.enable) continue
      if (height > this.displayArea) break
      console.log('发现空行', key)
      this.bottomLines[key] = drawer
      this.bottomY = height
      return height
    }
    this.bottomY += this.lineHeight
    if (this.bottomY > this.displayArea) this.bottomY = 0
    this.bottomLines[this.bottomY] = drawer
    return this.bottomY
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

  update () {
    if (this.player.options.danmaku.enable) {
      this.show()
    } else {
      console.log('隐藏弹幕')
      this.hide()
      this.hide()
    }
  }

  private loop () {
    if (this.destroied) return
    this.addDanmakuToCanvas()
    this.addDanmakuToCanvasTime = (Date.now() - this.lastFrame) / 1000
    if (!this.player.paused) {
      this.drawDanmaku()
      this.calcDanmakuTime = (Date.now() - this.lastFrame) / 1000

      if (this.isShow) {
        this.canvas.renderAll()
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
      'on screen danmakus': {
        top: this.topEnables.length,
        bottom: this.bottomEnables.length,
        flow: this.flowEnables.length
      },
      'danmaku pool': {
        fixed: this.topAndBottomDisables.length,
        flow: this.flowDisables.length
      },
      positionY: {
        top: this.topY,
        flow: this.flowY,
        bottom: this.bottomY
      }
    }
  }
}
