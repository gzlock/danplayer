import { fabric } from 'fabric'
import { Danmaku } from '@/player/danmaku/danmaku'

export const defaultOptions = {
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
      const h = this.height
      ctx.strokeStyle = this.borderColor
      ctx.strokeRect(-w / 2, -h / 2, w, h)
    }
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
      const h = this.height
      ctx.strokeStyle = this.borderColor
      ctx.strokeRect(-w / 2, -h / 2, w, h)
    }
  }
}

// @ts-ignore
fabric.LabelBox = LabelBox

export class DanmakuDrawer {
  danmaku!: Danmaku
  label!: Label | LabelBox
  width: number = 0
  height: number = 0
  enable: boolean = false

  get left () {
    return this.label.left
  }

  get top () {
    return this.label.top
  }
}

export class DanmakuFlowDrawer extends DanmakuDrawer {
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

export class DanmakuFixedDrawer extends DanmakuDrawer {
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
