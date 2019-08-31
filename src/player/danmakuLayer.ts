import { Player } from '@/player/player'
import { fabric } from 'fabric'
import { Danmaku, DanmakuType } from '@/player/danamku'

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
  constructor (text: string) {
    super(text, defaultOptions)
  }

  _render (ctx: CanvasRenderingContext2D): void {
    super._render(ctx)
    if (this.borderColor) {
      const w = this.width as number + 4
      const h = this.height as number + 4
      ctx.strokeStyle = this.borderColor
      ctx.strokeRect(-w / 2, -h / 2, w, h)
    }
  }
}

class LabelBox extends fabric.Textbox {
  editable = false
  textAlign = 'center'

  constructor (text: string) {
    super(text, defaultOptions)
  }

  _render (ctx: CanvasRenderingContext2D): void {
    super._render(ctx)
    if (this.borderColor) {
      const w = this.width as number + 4
      const h = this.height as number + 4
      ctx.strokeStyle = this.borderColor
      ctx.strokeRect(-w / 2, -h / 2, w, h)
    }
  }
}

class DanmakuDrawer {
  danmaku!: Danmaku
  label!: Label | LabelBox
  width: number = 0
  height: number = 0
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

    this.label.cleanStyle('borderColor')
    this.label.set(Object.assign({}, danmaku, { width: left, left, top }))
    this.width = this.label.getLineWidth(0)
    this.enable = true
  }

  update (canvasWidth: number, duration: number, lastFrameTime: number) {
    const speed = (canvasWidth + this.width) / duration * lastFrameTime
    const left = (this.label.left ? this.label.left : canvasWidth) - speed
    this.label.set({ left })
    this.enable = left > -this.width
  }
}

class DanmakuFixedDrawer extends DanmakuDrawer {
  timeout: number = 0

  constructor () {
    super()
    this.label = new LabelBox('')
  }

  set (danmaku: Danmaku, timeout: number, width: number, top: number) {
    this.danmaku = danmaku
    this.timeout = timeout
    this.label.cleanStyle('borderColor')
    this.label.set(Object.assign({}, danmaku, { width, left: 0 }))
    this.width = width
    this.height = this.label.height as number
    if (danmaku.type === DanmakuType.Bottom) { this.label.set({ top: top - this.height }) }
    this.enable = true
  }

  update (lastFrameTime: number) {
    this.timeout -= lastFrameTime
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
  fixedEnables: DanmakuFixedDrawer[] = []
  fixedDisables: DanmakuFixedDrawer[] = []
  flowEnables: DanmakuFlowDrawer[] = []
  flowDisables: DanmakuFlowDrawer[] = []

  // 上一帧的生成时间
  private frameTime: number = 0
  // 最后一帧
  private lastFrame: number = Date.now()

  isShow = true

  option: DanmakuLayerOptions

  private width = 0
  private height = 0

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

    this.$root = this.player.$root.querySelector('.canvas-container') as HTMLElement
    this.player.$video.addEventListener('seeked', () => {
      console.log('video seeked 事件')
      this.clear()
    })

    if (this.option.enable) {
      this.show()
    } else {
      this.hide()
    }
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
    this.fixedDisables.push(...this.fixedEnables)
    this.fixedEnables.length = 0
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

  /**
   * 绘制弹幕
   */
  private drawDanmaku () {
    const width = this.canvas.getWidth()
    for (let i = 0; i < this.danmakus.length; i++) {
      const danmaku = this.danmakus[i]
      const time = this.player.currentTime - danmaku.currentTime
      if (this.showed.includes(danmaku)) continue
      if (time < -0.1 || time > 0.1) continue
      this.showed.push(danmaku)

      let drawer: DanmakuFixedDrawer | DanmakuFlowDrawer
      // todo 防止 重叠算法
      if (danmaku.type === DanmakuType.Flow) {
        drawer = this.flowDisables.shift() || new DanmakuFlowDrawer()
        drawer.set(danmaku, width, 0)
        this.flowEnables.push(drawer)
      } else {
        drawer = this.fixedDisables.shift() || new DanmakuFixedDrawer()
        let top = danmaku.type === DanmakuType.Top ? 0 : this.height
        drawer.set(danmaku, this.option.fadeoutDuration, width, top)
        this.fixedEnables.push(drawer)
      }
      this.canvas.add(drawer.label)
    }

    this.fixedEnables = this.fixedEnables.filter(drawer => {
      if (drawer.enable) {
        drawer.update(this.frameTime)
        return true
      } else {
        this.fixedDisables.push(drawer)
        this.canvas.remove(drawer.label)
        return false
      }
    })

    this.flowEnables = this.flowEnables.filter(drawer => {
      if (drawer.enable) {
        drawer.update(width, this.option.flowDuration, this.frameTime)
        return true
      } else {
        this.flowDisables.push(drawer)
        this.canvas.remove(drawer.label)
        return false
      }
    })

    if (this.isShow) {
      this.canvas.renderAll()
    }
  }

  private loop () {
    if (!this.player.paused) {
      this.drawDanmaku()
    }
    this.frameTime = (Date.now() - this.lastFrame) / 1000
    this.lastFrame = Date.now()
    window.requestAnimationFrame(() => { this.loop() })
  }

  get debug (): Object {
    return {
      isShow: this.isShow,
      all: this.danmakus.length,
      showed: this.showed.length,
      canvasItems: this.canvas._objects.length,
      fixed: {
        enables: this.fixedEnables.length,
        disabled: this.fixedDisables.length
      },
      flow: {
        enables: this.flowEnables.length,
        disabled: this.flowDisables.length
      }
    }
  }
}
