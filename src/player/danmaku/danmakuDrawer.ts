import { Danmaku } from '@/player/danmaku/danmaku'
import { Canvas } from '@/player/danmaku/canvas'

const font = 'px "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif'

export class DanmakuDrawer {
  static drawCanvas: Canvas
  selfCanvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  danmaku!: Danmaku
  top: number = 0
  left: number = 0
  width: number = 0
  height: number = 0

  enable: boolean = false

  constructor () {
    this.selfCanvas = document.createElement('canvas')
    this.ctx = this.selfCanvas.getContext('2d') as CanvasRenderingContext2D
  }

  protected draw () {
    const width = this.width + 4
    const height = this.height
    this.selfCanvas.width = width
    this.selfCanvas.height = height
    this.ctx.textBaseline = 'top'
    this.ctx.textAlign = 'left'
    this.ctx.font = this.danmaku.fontSize + font
    this.ctx.clearRect(0, 0, width, height)
    if (this.danmaku.borderColor) {
      this.ctx.strokeStyle = this.danmaku.borderColor
      this.ctx.strokeRect(1, 1, width - 4, height - 4)
    }
    this.ctx.strokeStyle = '#000000'
    this.ctx.strokeText(this.danmaku.text, 1, 1)
    this.ctx.fillStyle = this.danmaku.fill
    this.ctx.fillText(this.danmaku.text, 1, 1)
  }
}

export class DanmakuFlowDrawer extends DanmakuDrawer {
  set (danmaku: Danmaku, left: number, top: number) {
    this.danmaku = danmaku
    this.enable = true
    this.left = left
    this.top = top
    this.width = DanmakuDrawer.drawCanvas.fontWidth(this)
    this.height = DanmakuDrawer.drawCanvas.fontHeight(this)
    this.draw()
  }

  update (canvasWidth: number, duration: number, lastFrameTime: number) {
    const speed = (canvasWidth + this.width) / duration * lastFrameTime
    this.left = this.left - speed
    this.enable = this.left > -this.width
  }
}

export class DanmakuFixedDrawer extends DanmakuDrawer {
  timeout: number = 0

  set (danmaku: Danmaku, timeout: number, canvasWidth: number, top: number) {
    this.danmaku = danmaku
    this.timeout = timeout
    this.enable = true
    this.width = DanmakuDrawer.drawCanvas.fontWidth(this)
    this.height = DanmakuDrawer.drawCanvas.fontHeight(this)
    this.left = (canvasWidth - this.width) / 2
    this.top = top
    this.draw()
    this.update(0)
  }

  update (lastFrameTime: number) {
    this.timeout -= lastFrameTime
    this.enable = this.timeout > 0
  }
}
