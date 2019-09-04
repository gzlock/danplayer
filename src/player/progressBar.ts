import { Player } from '@/player/player'
import { UI } from '@/player/UI'

export class ProgressBar {
  private player: Player
  private ui: UI
  private $root: HTMLElement
  private $controller: HTMLElement
  private $current: HTMLElement
  private $buffer: HTMLElement

  private barWidth!: number
  private _currentTime = 0
  private percent = 0
  private offsetWidth = 0

  constructor (ui: UI) {
    this.player = ui.player
    this.ui = ui
    this.$root = this.player.$root.querySelector('.progress-bar') as HTMLElement
    this.$controller = this.$root.querySelector('.bar-controller') as HTMLElement
    this.$current = this.$root.querySelector('.bar-current') as HTMLElement

    this.$controller.style.background = this.$current.style.background = this.player.options.color

    this.$buffer = this.$root.querySelector('.bar-buffer') as HTMLElement
    this.player.$video.addEventListener('timeupdate', () => {
      this._currentTime = this.player.$video.currentTime
      this.percent = this._currentTime / this.player.$video.duration
      this.update()
    })
    this.player.$video.addEventListener('progress', () => {
      this.updateBufferBar()
    })

    const mouseMoveChangeTime = (e: MouseEvent) => {
      const barRect = this.$root.getBoundingClientRect()
      this.percent = (e.pageX - barRect.left) / barRect.width
      if (e.pageX < barRect.left) {
        this.player.$video.currentTime = 0
      } else if (e.pageX > barRect.right) {
        this.player.$video.currentTime = this.player.$video.duration
      } else {
        this.player.$video.currentTime = this.percent * this.player.$video.duration
      }
      this.update()
      this.ui.isMouseInUI = true
    }
    const mouseup = () => {
      document.removeEventListener('mousemove', mouseMoveChangeTime)
      document.removeEventListener('mouseup', mouseup)
    }
    this.$root.addEventListener('mousedown', () => {
      document.addEventListener('mousemove', mouseMoveChangeTime)
      document.addEventListener('mouseup', mouseup)
    })

    this.$root.addEventListener('click', mouseMoveChangeTime)

    this.offsetWidth = this.player.width - this.$root.clientWidth
    this.resize()
  }

  resize () {
    this.barWidth = this.player.width - this.offsetWidth
    console.log('进度条 长度', this.barWidth, this.$root)
    this.update()
    this.updateBufferBar()
  }

  update () {
    const x = this.barWidth * this.percent
    this.$current.style.width = x + 'px'
    this.$controller.style.transform = `translateX(${x}px)`
  }

  updateBufferBar () {
    for (let i = 0; i < this.player.$video.buffered.length; i++) {
      const start = this.player.$video.buffered.start(i)
      const end = this.player.$video.buffered.end(i)
      if (start < this._currentTime && this._currentTime < end) {
        this.$buffer.style.width = end / this.player.$video.duration * this.barWidth + 'px'
      }
    }
  }
}
