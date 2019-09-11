import { Player } from '@/player/player'
import { Ui } from '@/player/ui'
import { SecondsToString } from '@/player/utils'

export class ProgressBar {
  private player: Player
  private ui: Ui
  private readonly $root: HTMLElement
  private $controller: HTMLElement
  private $current: HTMLElement
  private $buffer: HTMLElement
  private $time: HTMLElement

  private barWidth: number = 0
  private _currentTime = 0
  private percent = 0
  private offsetWidth = 0

  constructor (ui: Ui) {
    this.player = ui.player
    this.ui = ui
    this.$root = this.player.$root.querySelector('.progress-bar') as HTMLElement
    this.$controller = this.$root.querySelector('.bar-controller') as HTMLElement
    this.$current = this.$root.querySelector('.bar-current') as HTMLElement
    this.$time = this.player.$root.querySelector('.controller-bottom-bar .time') as HTMLElement

    this.$buffer = this.$root.querySelector('.bar-buffer') as HTMLElement
    this.player.$video.addEventListener('timeupdate', () => {
      this._currentTime = this.player.$video.currentTime
      this.percent = this._currentTime / this.player.$video.duration
      this.time()
      this.update()
    })
    this.player.$video.addEventListener('progress', () => {
      this.updateBufferBar()
      this.time()
    })
    const mouseMoveChangeTime = (e: MouseEvent) => {
      const playerRect = this.player.$root.getBoundingClientRect()
      let x = e.pageX - playerRect.left - this.offsetWidth / 2
      if (x < 0) {
        x = 0
      } else if (x > this.barWidth) {
        x = this.barWidth
      }
      this.percent = x / this.barWidth
      this.player.$video.currentTime = this.percent * this.player.$video.duration
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
    this.resize()
  }

  private time () {
    if (this.player.options.live) return
    this.$time.innerText = SecondsToString(this.player.$video.currentTime) +
      ' / ' + SecondsToString(this.player.$video.duration)
  }

  resize () {
    this.offsetWidth = this.player.width - this.$root.offsetWidth
    this.barWidth = this.player.width - this.offsetWidth
    console.warn('reset', this.player.width, this.$root.clientWidth, this.$root)
    this.update()
    this.updateBufferBar()
  }

  update () {
    const x = this.barWidth * this.percent
    this.$current.style.width = x + 'px'
    this.$controller.style.transform = `translateX(${x}px)`
    this.$controller.style.background = this.player.options.color
    this.$current.style.background = this.player.options.color
  }

  resetTimeZone () {
    if (this.player.options.live) {
      this.$time.innerText = '直播'
    } else {
      this.$time.innerText = ''
    }
  }

  updateBufferBar () {
    console.log('updateBufferBar', this.barWidth)
    for (let i = 0; i < this.player.$video.buffered.length; i++) {
      const start = this.player.$video.buffered.start(i)
      const end = this.player.$video.buffered.end(i)
      if (start < this._currentTime && this._currentTime < end) {
        this.$buffer.style.width = end / this.player.$video.duration * this.barWidth + 'px'
      }
    }
  }
}
