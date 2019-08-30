import { Player } from '@/player/player'
import { UI } from '@/player/UI'

export class ProgressBar {
  private player: Player
  private ui: UI
  private $bar: HTMLElement
  private $controller: HTMLElement

  private barWidth!: number
  private current = 0

  constructor (ui: UI) {
    this.player = ui.player
    this.ui = ui
    this.$bar = this.player.$root.querySelector('.progress-bar') as HTMLElement
    this.$controller = this.$bar.querySelector('.bar-controller') as HTMLElement
    this.resize()
    this.player.$video.addEventListener('timeupdate', () => {
      this.duration = this.player.$video.currentTime
    })
  }

  set duration (duration: number) {
    this.current = duration
    this.updateController()
  }

  get duration () { return this.current }

  resize () {
    this.barWidth = this.$bar.clientWidth
    console.log('进度条', this.barWidth)
  }

  updateController () {

  }
}
