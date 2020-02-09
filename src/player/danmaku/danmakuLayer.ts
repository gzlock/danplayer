import { Player } from '@/player/player'
import { Danmaku, DanmakuType } from '@/player/danmaku/danmaku'
import {
  DanmakuDrawer,
  DanmakuFixedDrawer,
  DanmakuFlowDrawer,
} from './danmakuDrawer'
import { EventEmitter } from 'events'
import { Canvas } from '@/player/danmaku/canvas'

export enum LimitType {
  UnLimited = 'unLimited', // 不限
  UnOverlap = 'unOverlap', // 防重叠
  Percent25 = 'percent25', // 25%屏显示弹幕
  Half = 'half', // 50%屏显示弹幕
  Percent75 = 'percent75', // 75%屏显示弹幕
}

export interface DanmakuLayerOptions {
  // 弹幕层的弹幕文字透明度，0~1，默认为1
  alpha: number
  // 是否显示弹幕层，默认为true
  enable: boolean
  // 流式弹幕的时间，毫秒
  flowDuration: number
  // 固定式弹幕的时间，毫秒
  fadeoutDuration: number,
  // 弹幕的字体大小
  fontSize: number,
  // 弹幕的显示区域限制
  limit: LimitType // 防重叠选项
  // 弹幕的右键菜单
  contextMenu: ((danmaku: Danmaku) => { [name: string]: () => void }) | undefined
}

export function MakeDanmakuLayerOptions ({
  alpha = 1,
  enable = true,
  flowDuration = 8,
  fadeoutDuration = 5,
  fontSize = 28,
  limit = LimitType.UnOverlap,
  contextMenu = undefined,
}: Partial<DanmakuLayerOptions> = {}): DanmakuLayerOptions {
  return {
    alpha,
    enable,
    flowDuration,
    fontSize,
    limit,
    fadeoutDuration,
    contextMenu,
  }
}

const template = '<div class="content"></div><div class="buttons"><span class="copy">复制</span></div>'

function MakeDanmakuDrawerMenu (
  d: DanmakuDrawer, menus: { [p: string]: () => void },
  copyFn: (text: string) => void): HTMLDivElement {
  const $div = document.createElement('div')
  $div.innerHTML = template
  const $content = $div.querySelector('.content') as HTMLElement
  $content.innerText = d.danmaku.text
  const $buttons = $div.querySelector('.buttons') as HTMLDivElement
  for (const key in menus) {
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
  private readonly bottomLines: { [height: string]: DanmakuDrawer | null } = {}
  private readonly flowLines: { [height: string]: DanmakuDrawer | null } = {}
  private displayArea: number = 0

  private topLineIndex = 0
  private flowY = 0
  private bottomY = 0

  // 上一帧的生成时间
  private frameTime: number = 0
  // 计算弹幕坐标的时间
  private updateDanmakuTime: number = 0

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
    // @ts-ignore
    window.danmaku = this
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
    this.$menu.classList.add('danplayer-danmaku-context-menu')
    for (let i = 0; i < drawers.length; i++) {
      const drawer = drawers[i]
      if (this.player.options.danmaku.contextMenu) {
        const $menu = MakeDanmakuDrawerMenu(drawer,
          this.player.options.danmaku.contextMenu(drawer.danmaku),
          text => this.copyText(text))
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
  }

  clear () {
    this.showed.length = 0
    this.canvas.clear()
    this.canvas.clearCache()
    this.topAndBottomDisables.push(...this.topEnables)
    this.topAndBottomDisables.push(...this.bottomEnables)
    this.topEnables.length = 0
    this.bottomEnables.length = 0
    this.flowDisables.push(...this.flowEnables)
    this.flowEnables.length = 0
    for (const key in this.flowLines) this.flowLines[key] = null
    for (const key in this.topLines) this.topLines[key] = null
    for (const key in this.bottomLines) this.bottomLines[key] = null
  }

  resize () {
    this.width = this.player.$root.clientWidth
    this.height = this.player.$root.clientHeight
    this.lineHeight = Math.round(
      this.canvas.fontHeight(this.player.options.danmaku.fontSize))

    this.lineHeights.length = 0
    // 每次resize都计算屏幕最大行数，因为有可能在多个不同分辨率的屏幕切换
    for (let y = 0; y < window.screen.height; y++) {
      const height = y * this.lineHeight
      if (height > window.screen.height) break
      this.lineHeights.push(height)

      if (!Object.prototype.hasOwnProperty.call(this.topLines, height)) {
        this.topLines[height] = null
      }
      if (!Object.prototype.hasOwnProperty.call(this.bottomLines, height)) {
        this.bottomLines[height] = null
      }
      if (!Object.prototype.hasOwnProperty.call(this.flowLines, height)) {
        this.flowLines[height] = null
      }
    }

    this.canvas.resize()

    // 检查限高
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
    console.log('弹幕层 displayArea', this.displayArea)

    this.canvas.alpha = this.player.options.danmaku.alpha
    this.canvas.clear()
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
      ...this.flowEnables.filter(drawer => DanmakuLayer.find(e, drawer)),
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

  private createDrawer (danmaku: Danmaku) {
    let top
    if (danmaku.type === DanmakuType.Flow) {
      const drawer = this.flowDisables.shift() || new DanmakuFlowDrawer()
      top = this.calcFlowY()
      if (top > -1) {
        drawer.enable = true
        drawer.set(danmaku, this.width, top)
        drawer.update(this.width, this.player.options.danmaku.flowDuration, 0)
        this.flowEnables.push(drawer)
        this.flowLines[top] = drawer
        this.canvas.addDrawer(drawer)
      } else {
        this.flowDisables.push(drawer)
      }
    } else {
      const drawer = this.topAndBottomDisables.shift() ||
        new DanmakuFixedDrawer()
      if (danmaku.type === DanmakuType.Top) {
        top = this.calcTopY()
        if (top > -1) {
          drawer.enable = true
          drawer.set(danmaku, this.player.options.danmaku.fadeoutDuration,
            this.width, top)
          this.topLines[top] = drawer
          console.log('渲染', top, danmaku.text)
          drawer.update(0)
          this.topEnables.push(drawer)
          this.canvas.addDrawer(drawer)
        } else {
          this.topAndBottomDisables.push(drawer)
        }
      } else {
        let top = this.calcBottomY()
        if (top > -1) {
          drawer.enable = true
          this.bottomLines[top] = drawer
          top = this.height - (top + this.lineHeight)
          drawer.set(danmaku, this.player.options.danmaku.fadeoutDuration,
            this.width, top)
          this.bottomEnables.push(drawer)
          drawer.update(0)
          this.canvas.addDrawer(drawer)
        } else {
          this.topAndBottomDisables.push(drawer)
        }
      }
    }
  }

  private addDanmakuToCanvas () {
    if (this.danmakus.length === 0 ||
      !this.player.options.danmaku.enable) return
    // 直播
    if (this.player.options.live) {
      this.danmakus.forEach(danmaku => {
        this.createDrawer(danmaku)
      })
      this.danmakus.length = 0
    } else { // VOD
      for (let i = 0; i < this.danmakus.length; i++) {
        const danmaku = this.danmakus[i]
        if (this.showed.includes(danmaku)) continue
        const time = Math.abs(this.player.currentTime - danmaku.currentTime)
        if (time > 0.1) continue
        this.showed.push(danmaku)
        this.createDrawer(danmaku)
      }
    }
    this.canvas.renderAll()
  }

  $input!: HTMLInputElement

  copyText (text: string) {
    if (!this.$input) {
      this.$input = this.player.$root.querySelector(
        'input.copy-tool') as HTMLInputElement
    }
    this.$input.value = text
    this.$input.select()
    document.execCommand('copy')
  }

  private calcFlowY (): number {
    for (const key in this.flowLines) {
      const _d = this.flowLines[key]

      if (_d && _d.enable) {
        const right = _d.left + _d.width
        if (right > this.width) continue
      }

      const height = Number(key)
      if (height > this.displayArea) break
      console.log('发现空行', key)
      this.flowY = height
      return height
    }
    if (this.player.options.danmaku.limit !== LimitType.UnLimited) {
      return -1
    }
    // 无限制，就可以重复将新的弹幕显示到屏幕上
    this.flowY += this.lineHeight
    if (this.flowY > this.displayArea) this.flowY = 0
    return this.flowY
  }

  private calcTopY (): number {
    for (const key in this.topLines) {
      const _d = this.topLines[key]
      const height = Number(key)
      if (_d && _d.enable) continue
      if (height > this.displayArea) break
      this.topLineIndex = height
      return height
    }
    if (this.player.options.danmaku.limit !== LimitType.UnLimited) {
      return -1
    }
    // 无限制，就可以重复将新的弹幕显示到屏幕上
    this.topLineIndex += this.lineHeight
    if (this.topLineIndex > this.displayArea) {
      this.topLineIndex = 0
    }
    return this.topLineIndex
  }

  private calcBottomY (): number {
    if (this.player.options.danmaku.limit === LimitType.Percent25 ||
      this.player.options.danmaku.limit === LimitType.Half ||
      this.player.options.danmaku.limit === LimitType.Percent75) {
      return -1
    }
    for (const key in this.bottomLines) {
      const _d = this.bottomLines[key]
      const height = Number(key)
      if (_d && _d.enable) continue
      if (height > this.displayArea) break
      console.log('发现空行', key)
      this.bottomY = height
      return height
    }
    if (this.player.options.danmaku.limit !== LimitType.UnLimited) {
      return -1
    }
    // 无限制，就可以重复将新的弹幕显示到屏幕上
    this.bottomY += this.lineHeight
    if (this.bottomY > this.displayArea) {
      this.bottomY = 0
    }
    return this.bottomY
  }

  /**
   * 绘制弹幕
   */
  private updateDanmaku () {
    this.topEnables = this.topEnables.filter(drawer => {
      if (drawer.enable) {
        drawer.update(this.frameTime)
        return true
      } else {
        console.log('topLines', drawer.height, this.topLines[drawer.height],
          this.topLines[drawer.height] === drawer)
        if (this.topLines[drawer.height] === drawer) {
          this.topLines[drawer.height] = null
        }
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
        if (this.bottomLines[drawer.height] === drawer) {
          this.bottomLines[drawer.height] = null
        }
        this.canvas.removeDrawer(drawer)
        this.topAndBottomDisables.push(drawer)
        return false
      }
    })

    this.flowEnables = this.flowEnables.filter(drawer => {
      if (drawer.enable) {
        drawer.update(this.width, this.player.options.danmaku.flowDuration,
          this.frameTime)
        return true
      } else {
        if (this.flowLines[drawer.height] === drawer) {
          this.flowLines[drawer.height] = null
        }
        this.canvas.removeDrawer(drawer)
        this.flowDisables.push(drawer)
        return false
      }
    })
  }

  update () {
    if (this.player.options.danmaku.enable) {
      console.log('显示弹幕')
      this.show()
    } else {
      console.log('隐藏弹幕')
      this.hide()
    }
  }

  private loop () {
    if (this.destroied) return
    this.addDanmakuToCanvas()
    this.addDanmakuToCanvasTime = (Date.now() - this.lastFrame) / 1000
    this.canvas.clear()

    if (!this.player.paused) {
      this.updateDanmaku()
      this.updateDanmakuTime = (Date.now() - this.lastFrame) / 1000
    }
    if (this.player.options.danmaku.enable && this.isShow) {
      this.canvas.renderAll()
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
      enable: this.player.options.danmaku.enable,
      isShow: this.isShow,
      all: this.danmakus.length,
      showed: this.showed.length,
      // 耗时
      time: {
        addDanmakuToCanvas: this.addDanmakuToCanvasTime,
        drawDanmaku: this.updateDanmakuTime,
        frameTime: this.frameTime,
      },
      'on screen danmakus': {
        top: this.topEnables.length,
        bottom: this.bottomEnables.length,
        flow: this.flowEnables.length,
      },
      'danmaku pool': {
        fixed: this.topAndBottomDisables.length,
        flow: this.flowDisables.length,
      },
      positionY: {
        top: this.topLineIndex,
        flow: this.flowY,
        bottom: this.bottomY,
      },
    }
  }
}
