import { Player } from '@/player/player'
import { fabric } from 'fabric'
import { Danmaku, DanmakuType } from '@/player/danamku'
import { sortBy, groupBy } from 'lodash'

export class DanmakuLayerOptions extends Object {
  enable: boolean = true
  flowDuration: number = 8
  fadeoutDuration: number = 5
}

const defaultOptions = {
  fontSize: 24,
  strokeWidth: 1,
  stroke: 'black',
  fontFamily: 'SimHei',
  fontWeight: 'normal',
  selectable: false,
  paintFirst: 'stroke'
}

class Label extends fabric.Text {
  static type = 'Label'
  width: number = 0
  height: number = 0
  left: number = 0
  top: number = 0

  constructor (text: string) {
    super(text, defaultOptions)
  }

  _render (ctx: CanvasRenderingContext2D): void {
    super._render(ctx)
    if (this.borderColor) {
      const w = this.width + 4
      const h = this.height + 4
      ctx.strokeStyle = this.borderColor
      ctx.strokeRect(-w / 2, -h / 2, w, h)
    }
  }

  toJSON (propertiesToInclude?: string[]): any {
    return {}
  }
}

// @ts-ignore
fabric.Label = Label

class LabelBox extends fabric.Textbox {
  static type = 'LabelBox'
  width: number = 0
  height: number = 0
  left: number = 0
  top: number = 0

  editable = false
  textAlign = 'center'

  constructor (text: string) {
    super(text, defaultOptions)
  }

  _render (ctx: CanvasRenderingContext2D): void {
    super._render(ctx)
    if (this.borderColor) {
      const w = this.width + 4
      const h = this.height + 4
      ctx.strokeStyle = this.borderColor
      ctx.strokeRect(-w / 2, -h / 2, w, h)
    }
  }
}

// @ts-ignore
fabric.LabelBox = LabelBox

class DanmakuDrawer {
  danmaku!: Danmaku
  label!: Label | LabelBox
  width: number = 0
  height: number = 0

  get left () {
    return this.label.left
  }

  get top () {
    return this.label.top
  }

  enable: boolean = false
}

class DanmakuFlowDrawer extends DanmakuDrawer {
  constructor () {
    super()
    this.label = new Label('')
    this.height = this.label.getHeightOfLine(0)
  }

  set (danmaku: Danmaku, left: number, top: number) {
    this.danmaku = danmaku
    this.label.borderColor = undefined
    this.label.set(Object.assign({}, danmaku, { left, top }))
    this.width = this.label.getLineWidth(0)
    this.enable = true
  }

  update (canvasWidth: number, duration: number, lastFrameTime: number) {
    const speed = (canvasWidth + this.width) / duration * lastFrameTime
    this.label.left = this.label.left - speed
    this.enable = this.label.left > -this.width
  }
}

class DanmakuFixedDrawer extends DanmakuDrawer {
  timeout: number = 0

  constructor () {
    super()
    this.label = new LabelBox('')
  }

  set (danmaku: Danmaku, timeout: number, maxWidth: number, top: number) {
    this.danmaku = danmaku
    this.timeout = timeout
    this.label.borderColor = undefined
    this.label.set(Object.assign({}, danmaku, { top }))
    this.width = this.label.width
    this.label.left = (maxWidth - this.width) / 2
    this.height = this.label.height as number
    this.enable = true

    this.update(maxWidth, 0)
  }

  update (maxWidth: number, lastFrameTime: number) {
    this.timeout -= lastFrameTime
    if (this.label.width > maxWidth) {
      this.label.set({ width: maxWidth })
      this.height = this.label.height as number
    }
    this.enable = this.timeout > 0
  }
}

export class DanmakuLayer {
  private player: Player
  private canvas: fabric.Canvas
  private $root: HTMLElement

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
  // 最后一帧
  private lastFrame: number = Date.now()

  isShow = true

  option: DanmakuLayerOptions

  private width = 0
  private height = 0
  private calcTopInterval: number = -1
  private destroied: boolean = false

  constructor (player: Player) {
    this.player = player
    this.option = this.player.options.danmaku as DanmakuLayerOptions
    console.log('弹幕设置', this.option)
    const $canvas = this.player.$root.querySelector('.danmaku-layer') as HTMLCanvasElement
    this.canvas = new fabric.Canvas($canvas, {
      selection: false,
      hoverCursor: 'default',
      moveCursor: 'default'
    })
    // @ts-ignore
    window.canvas = this.canvas

    this.$root = this.player.$root.querySelector('.canvas-container') as HTMLElement
    this.player.$video.addEventListener('seeked', () => {
      // console.log('video seeked 事件')
      this.clear()
    })

    if (this.option.enable) {
      this.show()
    } else {
      this.hide()
    }
    // 每秒12次计算top坐标
    // this.calcTopInterval = setInterval(() => { this.calcTop() }, 1000 / 12)
    this.loop()
  }

  show () {
    this.isShow = true
    this.$root.style.display = ''
  }

  hide () {
    this.isShow = false
    this.$root.style.display = 'none'
  }

  clear () {
    this.showed.length = 0
    this.canvas.clear()
    this.topAndBottomDisables.push(...this.topEnables)
    this.topEnables.length = 0
    this.flowDisables.push(...this.flowEnables)
    this.flowEnables.length = 0
  }

  resize () {
    this.width = this.player.$root.clientWidth
    this.height = this.player.$root.clientHeight
    this.canvas.setDimensions({ width: this.width, height: this.height })
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

  private addDanmakuToCanvas () {
    let hasChange = false
    for (let i = 0; i < this.danmakus.length; i++) {
      const danmaku = this.danmakus[i]
      const time = Math.abs(this.player.currentTime - danmaku.currentTime)
      if (this.showed.includes(danmaku)) continue
      if (time > 0.1) continue
      hasChange = true
      this.showed.push(danmaku)

      let drawer: DanmakuFixedDrawer | DanmakuFlowDrawer
      if (danmaku.type === DanmakuType.Flow) {
        this.calcFlowTop()
        drawer = this.flowDisables.shift() || new DanmakuFlowDrawer()
        drawer.set(danmaku, this.width, this.flowTop)
        // this.calcFlowTopFromDrawer(drawer)
        this.flowEnables.push(drawer)
      } else {
        drawer = this.topAndBottomDisables.shift() || new DanmakuFixedDrawer()
        if (danmaku.type === DanmakuType.Top) {
          drawer.set(danmaku, this.option.fadeoutDuration, this.width, this.topTop)
          this.calcTopTop(drawer)
          this.topEnables.push(drawer)
        } else {
          drawer.set(danmaku, this.option.fadeoutDuration, this.width, this.bottomTop)
          this.calcBottomTop(drawer)
          this.bottomEnables.push(drawer)
        }
      }
      this.canvas.add(drawer.label)
    }

    if (this.player.paused && hasChange) {
      this.canvas.renderAll()
    }
  }

  private calcFlowTopFromDrawer (drawer: DanmakuFlowDrawer) {
    this.calcFlowTop()
    if (drawer.enable) {
      const height = drawer.label.top + drawer.height
      if (height > this.height) {
        this.flowTop = drawer.label.top = 0
      } else {
        if ((drawer.label.left + drawer.label.width) < this.width) {
          this.flowTop = drawer.label.top
        } else {
          this.flowTop = height
        }
      }
    } else if (drawer.label.top < this.flowTop) {
      this.flowTop = drawer.label.top
    }
  }

  private calcFlowTop () {
    if (this.flowEnables.length === 0) {
      this.flowTop = 0
      return
    }
    let top = 0
    const lines = groupBy<DanmakuFlowDrawer>(this.flowEnables, (item) => Math.floor(item.top))
    const lineHeight = this.flowEnables[0].height
    for (let key in lines) {
      const drawers: DanmakuFlowDrawer[] = sortBy(lines[key], 'top')
      const drawer: DanmakuFlowDrawer = drawers[drawers.length - 1]
      console.log({ key, drawer })
      if ((drawer.left + drawer.width) < this.width) {
        top = drawer.top
        break
      } else {
        top += drawer.height
      }
    }
    if (top + lineHeight > this.height) {
      console.log('高度超出画布')
      top = 0
    }
    console.log({ lineHeight, top, flowTop: this.flowTop })
    this.flowTop = top
  }

  private calcTopTop (drawer: DanmakuFixedDrawer) {
    if (drawer.enable) {
      const height = drawer.label.top + drawer.height
      if (height > this.height) {
        this.topTop = drawer.label.top = 0
      } else {
        this.topTop = height
      }
    } else if (drawer.label.top < this.topTop) {
      this.topTop = drawer.label.top
    }
  }

  private calcBottomTop (drawer: DanmakuFixedDrawer) {
    if (drawer.enable) {
      if (drawer.label.top <= 0) {
        drawer.label.top = this.height - drawer.height
      }
      this.bottomTop = drawer.label.top - drawer.label.height
    } else if (drawer.label.top > this.bottomTop) {
      this.bottomTop = drawer.label.top
    }
  }

  /**
   * 绘制弹幕
   */
  private drawDanmaku () {
    this.topEnables = this.topEnables.filter(drawer => {
      if (drawer.enable) {
        drawer.update(this.width, this.frameTime)
        return true
      } else {
        this.topAndBottomDisables.push(drawer)
        this.canvas.remove(drawer.label)
        drawer.danmaku.type === DanmakuType.Top ? this.calcTopTop(drawer) : this.calcBottomTop(drawer)
        return false
      }
    })

    this.bottomEnables = this.bottomEnables.filter(drawer => {
      if (drawer.enable) {
        drawer.update(this.width, this.frameTime)
        return true
      } else {
        this.topAndBottomDisables.push(drawer)
        this.canvas.remove(drawer.label)
        drawer.danmaku.type === DanmakuType.Top ? this.calcTopTop(drawer) : this.calcBottomTop(drawer)
        return false
      }
    })

    this.flowEnables = this.flowEnables.filter(drawer => {
      if (drawer.enable) {
        drawer.update(this.width, this.option.flowDuration, this.frameTime)
        return true
      } else {
        this.flowDisables.push(drawer)
        this.canvas.remove(drawer.label)
        this.calcFlowTopFromDrawer(drawer)
        return false
      }
    })

    if (this.isShow) {
      this.canvas.renderAll()
    }
  }

  private loop () {
    if (this.destroied) return
    this.addDanmakuToCanvas()
    if (!this.player.paused) {
      this.drawDanmaku()
    }
    this.frameTime = (Date.now() - this.lastFrame) / 1000
    this.lastFrame = Date.now()

    window.requestAnimationFrame(() => { this.loop() })
  }

  destroy () {
    this.destroied = true
    clearInterval(this.calcTopInterval)
  }

  get debug (): Object {
    return {
      isShow: this.isShow,
      all: this.danmakus.length,
      showed: this.showed.length,
      canvasItems: this.canvas._objects.length,
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
