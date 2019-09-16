import NP from 'number-precision'
import { ButtonAndLayer } from '@/player/buttonAndLayer'
import { Ui } from '@/player/ui'
import { IconButton } from '@/player/IconButton'
import { Toast } from '@/player/toast'

NP.enableBoundaryChecking(false)

export class VolumeLayer extends ButtonAndLayer {
  $video: HTMLVideoElement
  $valueLabel: HTMLElement
  $dragArea: HTMLElement
  $controller: HTMLElement
  btn: IconButton

  $current: HTMLElement
  volumeValue: number = 0
  private areaHeight: number = 0
  private toast: Toast
  private hideToast: number = -1

  constructor (ui: Ui) {
    super(ui)
    this.$video = this.player.$video
    this.toast = new Toast(ui)
    this.$video.addEventListener('volumechange', () => this.updateController())
    this.$layer = this.player.$root.querySelector('.interactive-layer .volume-bar') as HTMLElement
    this.$valueLabel = this.$layer.querySelector('.volume-num-label') as HTMLElement
    this.$btn = this.player.$root.querySelector('.interactive-layer .buttons .button.volume') as HTMLElement
    this.btn = new IconButton(this.$btn)
    this.$btn.addEventListener('click', () => this.toggleMuted())
    this.$dragArea = this.$layer.querySelector('.volume-column-bar') as HTMLElement
    this.$controller = this.$dragArea.querySelector('.bar-controller') as HTMLElement
    this.$current = this.$dragArea.querySelector('.bar-current') as HTMLElement
    this.volumeValue = this.$video.volume = this.player.options.volume

    if (this.volumeValue === 0) {
      this.volumeValue = 0.7
    }

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

    this.init()
    this.updateController()
  }

  up () {
    if (this.$video.volume <= 0.9) {
      this.$video.volume = NP.plus(this.$video.volume, 0.1)
    } else {
      this.$video.volume = 1
    }
    this.volumeValue = this.$video.volume
    this.showToast()
  }

  down () {
    if (this.$video.volume >= 0.1) {
      this.$video.volume = NP.minus(this.$video.volume, 0.1)
    } else {
      this.$video.volume = 0
    }
    this.volumeValue = this.$video.volume
    this.showToast()
  }

  showToast () {
    if (this.isShow) return
    this.toast.show()
    this.toast.text = '音量：' + NP.round(this.$video.volume * 100, 0)
    clearTimeout(this.hideToast)
    this.hideToast = setTimeout(() => {
      this.toast.hide()
    }, 2000)
    this.updateToastPosition()
  }

  updateToastPosition () {
    this.toast.x = (this.player.width - this.toast.width) / 2
    this.toast.y = (this.player.height - this.toast.height) / 2
  }

  toggleMuted () {
    if (this.$video.volume > 0) {
      this.$video.volume = 0
    } else {
      if (this.volumeValue === 0) {
        this.$video.volume = 1
      } else {
        this.$video.volume = this.volumeValue
      }
    }
    this.updateButton()
  }

  updateButton () {
    let attr
    // console.log('音量', this.$video.volume)
    if (this.$video.volume > 0) {
      attr = 'data-on'
    } else {
      attr = 'data-off'
    }
    this.btn.switch(attr)
  }

  updateController () {
    const value = NP.round(this.$video.volume * 100, 0)
    this.$valueLabel.innerText = value.toString()
    let y = this.$video.volume * this.areaHeight
    this.$current.style.height = y + 'px'
    y = this.areaHeight - y
    this.$controller.style.transform = `translateY(${y}px)`
    this.updateButton()
  }

  showLayer () {
    super.showLayer()
    this.areaHeight = this.$dragArea.clientHeight
    this.updateController()
  }

  update () {
    this.$controller.style.background = this.$current.style.background = this.player.options.color
    if (this.toast.isShow) this.updateToastPosition()
    if (this.isShow) this.updateLayerPosition()
  }
}
