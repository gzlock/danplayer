import { Player } from '@/player/player'
import { fabric } from 'fabric'
import { Danmaku } from '@/player/danamku'

export class DanmakuLayerOptions extends Object {
  flowDuration: number = 8
  fadeoutDuration: number = 5
}

export class DanmakuLayer {
  private player: Player
  private canvas: fabric.Canvas
  private $root: HTMLElement

  // 要显示的弹幕
  private danmakus: Danmaku[] = []

  // 复用的弹幕库
  private danmakuPool: Danmaku[] = []

  // 批量填充的弹幕将会填充到这里，等待时机 转移到 danmakus
  public waitToShow: Danmaku[] = []

  // 上一帧的生成时间
  private frameTime: number = 0
  private lastFrame: number = 0

  private _defaultFlowDuration: number = 10
  private _defaultFadeOutDuration: number = 5

  isShow = true

  option: DanmakuLayerOptions

  constructor (player: Player) {
    this.player = player
    this.option = this.player.options.danmaku as DanmakuLayerOptions
    const $canvas = this.player.$root.querySelector('.danmaku-layer') as HTMLCanvasElement
    this.canvas = new fabric.Canvas($canvas)

    this.$root = this.player.$root.querySelector('.canvas-container') as HTMLElement
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

  resize () {
    const width = this.player.$root.clientWidth
    const height = this.player.$root.clientHeight
    this.canvas.setDimensions({ width, height })
  }

  toggle (): void {
    if (this.isShow) {
      this.hide()
    } else {
      this.show()
    }
  }

  send (text: string, color: string) {
    if (!text) { return }
    let item = this.danmakuPool.shift() || new Danmaku(text)
    item.set({
      text,
      left: this.canvas.getWidth(),
      fill: color,
      borderColor: '#ff0000'
    })
    if (!this.player.options.live) {
      item.duration = this.player.$video.currentTime
    }
    this.canvas.add(item)
    this.danmakus.push(item)
  }

  /**
   * 绘制弹幕
   */
  private drawDanmaku () {
    let speed: number = this.player.options.danmaku ? this.player.options.danmaku.flowDuration : this._defaultFlowDuration
    speed = this.canvas.getWidth() / speed
    console.debug('speed', { speed, frame: this.frameTime, length: this.danmakus.length })
    const disableItems: Danmaku[] = []
    this.danmakus = this.danmakus.filter(danmaku => {
      const x = this.drawFlowDanmaku(danmaku, speed)
      if (x < 0) {
        disableItems.push(danmaku)
        return false
      }
      return true
    })
    this.danmakuPool.push(...disableItems)
    this.canvas.renderAll()
  }

  /**
   * 绘制流动的弹幕
   * @param danmaku
   * @param speed
   * @return {number} 返回 x 坐标，检测是否超出屏幕
   */
  private drawFlowDanmaku (danmaku: Danmaku, speed: number): number {
    const left = danmaku.left as number - speed * this.frameTime
    const width = danmaku.width as number
    danmaku.left = left
    return left + width
  }

  private checkWait () {
    if (this.waitToShow.length === 0) { return }
    const pickUp: Danmaku[] = []
    const currentTime = this.player.currentTime * 1000
    this.waitToShow = this.waitToShow.filter(danmaku => {
      if (danmaku.duration <= currentTime) {
        pickUp.push(danmaku)
        return false
      }
      return true
    })
    this.danmakus.push(...pickUp)
  }

  private loop () {
    this.checkWait()
    if (!this.player.paused) {
      this.drawDanmaku()
    }
    this.frameTime = (Date.now() - this.lastFrame) / 1000
    this.lastFrame = Date.now()
    window.requestAnimationFrame(() => { this.loop() })
  }
}
