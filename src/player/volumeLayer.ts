import { Player, PlayerOptions } from '@/player/player'
import NP from 'number-precision'
import { ButtonAndLayer } from '@/player/buttonAndLayer'
import { UI } from '@/player/UI'

NP.enableBoundaryChecking(false)

export class VolumeLayer extends ButtonAndLayer {
  $video: HTMLVideoElement
  $valueLabel: HTMLElement
  $dragArea: HTMLElement
  $controller: HTMLElement

  $current: HTMLElement
  volumeValue: number = 0
  private areaHeight: number = 0

  constructor (ui: UI) {
    super(ui)
    this.$video = this.player.$video
    this.$video.addEventListener('volumechange', () => this.updateController())
    this.$layer = this.player.$root.querySelector('.controller-layer .volume-bar') as HTMLElement
    this.$valueLabel = this.$layer.querySelector('.volume-num-label') as HTMLElement
    this.$btn = this.player.$root.querySelector('.controller-layer .buttons .button.volume') as HTMLElement
    this.$btn.addEventListener('click', () => this.toggleMuted())
    this.$dragArea = this.$layer.querySelector('.volume-column-bar') as HTMLElement
    this.$controller = this.$dragArea.querySelector('.bar-controller') as HTMLElement
    this.$current = this.$dragArea.querySelector('.bar-current') as HTMLElement
    this.$video.volume = this.player.options.volume as number

    const mousemoveControlVolume = (e: MouseEvent) => {
      // console.log({ y })
      let y = e.pageY
      const rect = this.$dragArea.getBoundingClientRect()
      if (y < rect.top) {
        this.$video.volume = 1
      } else if (y > rect.bottom) {
        this.$video.volume = 0
      } else {
        const range = rect.bottom - rect.top
        y -= rect.top
        const value = y / range
        this.$video.volume = NP.round(1 - value, 2)
      }
      this.volumeValue = this.$video.volume
      this.updateController()
    }
    const mouseupReleaseControl = (e: MouseEvent) => {
      document.removeEventListener('mousemove', mousemoveControlVolume)
      document.removeEventListener('mouseup', mouseupReleaseControl)
      mousemoveControlVolume(e)
    }
    this.$dragArea.addEventListener('mousedown', () => {
      document.addEventListener('mousemove', mousemoveControlVolume)
      document.addEventListener('mouseup', mouseupReleaseControl)
    })
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        if (this.$video.volume < 1) {
          this.$video.volume += 0.1
        } else {
          this.$video.volume = 1
        }
      } else if (e.key === 'ArrowDown') {
        if (this.$video.volume > 0) {
          this.$video.volume -= 0.1
        } else {
          this.$video.volume = 0
        }
      }
    })

    this.init()
    this.updateController()
  }

  toggleMuted () {
    let attr
    if (this.$video.volume > 0) {
      this.$video.volume = 0
      attr = 'data-off'
    } else {
      this.$video.volume = this.volumeValue
      attr = 'data-on'
    }
    this.$btn.innerHTML = this.$btn.getAttribute(attr) as string
  }

  updateController () {
    const value = NP.round(this.$video.volume * 100, 0)
    this.$valueLabel.innerText = value.toString()
    let y = this.$video.volume * this.areaHeight
    this.$current.style.height = y + 'px'
    y = this.areaHeight - y
    this.$controller.style.transform = `translateY(${y}px)`
  }

  showLayer () {
    super.showLayer()
    this.areaHeight = this.$dragArea.clientHeight
    this.updateController()
  }
}
