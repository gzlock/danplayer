import { Player } from '@/player/player'
import { UI } from '@/player/UI'

export class ProgressBar {
  private player: Player
  private ui: UI
  private $bar: HTMLElement
  private $controller: HTMLElement
  private $current: HTMLElement
  private $buffer: HTMLElement

  private barWidth!: number
  private _currentTime = 0
  private percent = 0

  constructor (ui: UI) {
    this.player = ui.player
    this.ui = ui
    this.$bar = this.player.$root.querySelector('.progress-bar') as HTMLElement
    this.$controller = this.$bar.querySelector('.bar-controller') as HTMLElement
    this.$current = this.$bar.querySelector('.bar-current') as HTMLElement
    this.$buffer = this.$bar.querySelector('.bar-buffer') as HTMLElement
    this.resize()
    this.player.$video.addEventListener('timeupdate', () => {
      this._currentTime = this.player.$video.currentTime
      this.percent = this._currentTime / this.player.$video.duration
      this.update()
    })
    this.player.$video.addEventListener('progress', () => {
      this.updateBufferBar()
    })

    const mouseMoveChangeTime = (e: MouseEvent) => {
      const barRect = this.$bar.getBoundingClientRect()
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
    this.$bar.addEventListener('mousedown', () => {
      document.addEventListener('mousemove', mouseMoveChangeTime)
      document.addEventListener('mouseup', mouseup)
    })

    this.$bar.addEventListener('click', mouseMoveChangeTime)
  }

  set currentTime (duration: number) {
    this._currentTime = duration
    this.update()
  }

  get currentTime () {
    return this._currentTime
  }

  resize () {
    this.barWidth = this.$bar.clientWidth
    console.log('进度条', this.barWidth)
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
