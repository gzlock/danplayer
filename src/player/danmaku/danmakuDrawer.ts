import { Danmaku } from '@/player/danmaku/danmaku'
import { Canvas } from '@/player/danmaku/canvas'

export class DanmakuDrawer {
  static canvas: Canvas
  danmaku!: Danmaku
  top: number = 0
  left: number = 0
  width: number = 0
  height: number = 0

  enable: boolean = false
}

export class DanmakuFlowDrawer extends DanmakuDrawer {
  set (danmaku: Danmaku, left: number, top: number) {
    this.danmaku = danmaku
    this.enable = true
    this.left = left
    this.top = top
    this.width = DanmakuDrawer.canvas.fontWidth(this)
    this.height = DanmakuDrawer.canvas.fontHeight(this)
  }

  update (canvasWidth: number, duration: number, lastFrameTime: number) {
    const speed = (canvasWidth + this.width) / duration * lastFrameTime
    this.left = this.left - speed
    this.enable = this.left > -this.width
  }
}

export class DanmakuFixedDrawer extends DanmakuDrawer {
  timeout: number = 0

  set (danmaku: Danmaku, timeout: number, left: number, top: number) {
    this.danmaku = danmaku
    this.timeout = timeout
    this.enable = true
    this.left = left
    this.top = top
    this.width = DanmakuDrawer.canvas.fontWidth(this)
    this.height = DanmakuDrawer.canvas.fontHeight(this)

    this.update(0)
  }

  update (lastFrameTime: number) {
    this.timeout -= lastFrameTime
    this.enable = this.timeout > 0
  }
}
