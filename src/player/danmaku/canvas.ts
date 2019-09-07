import Player from '@/player/player'
import { DanmakuDrawer } from '@/player/danmaku/danmakuDrawer'
import { Danmaku } from '@/player/danmaku/danmaku'

const font = 'px "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif'

export class Canvas {
  private player: Player
  $canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  private caches: DanmakuDrawer[] = []

  constructor (player: Player) {
    this.player = player
    this.$canvas = player.$root.querySelector('canvas') as HTMLCanvasElement
    this.ctx = this.$canvas.getContext('2d') as CanvasRenderingContext2D

    this.$canvas.addEventListener('click', () => {
      player.toggle()
    })
  }

  addDrawer (drawer: DanmakuDrawer) {
    this.caches.push(drawer)
  }

  removeDrawer (drawer: DanmakuDrawer) {
    const index = this.caches.indexOf(drawer)
    if (index > -1) this.caches.splice(index, 1)
  }

  renderAll () {
    this.clear()
    if (this.caches.length > 0) {
      for (let i = 0; i < this.caches.length; i++) {
        const drawer = this.caches[i]
        this.ctx.drawImage(drawer.selfCanvas, drawer.left, drawer.top)
      }
    }
  }

  clear () {
    this.ctx.clearRect(0, 0, this.player.width, this.player.height)
  }

  clearCache () {
    this.caches.length = 0
  }

  set alpha (val: number) {
    this.ctx.globalAlpha = val
  }

  fontHeight (fontSize: number): number {
    this.ctx.font = fontSize + font
    const size = this.ctx.measureText('M')
    return size.width * 1.2
  }

  fontWidth (drawer: DanmakuDrawer): number {
    this.ctx.font = drawer.danmaku.fontSize + font
    const size = this.ctx.measureText(drawer.danmaku.text)
    return size.width
  }

  resize () {
    this.$canvas.setAttribute('width', this.player.width + 'px')
    this.$canvas.setAttribute('height', this.player.height + 'px')
  }
}
