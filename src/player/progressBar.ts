import { Player } from '@/player/player'
import { Ui } from '@/player/ui'
import { SecondsToString } from '@/player/utils'
import { Toast } from '@/player/toast'

export class ProgressBar {
  private player: Player
  private ui: Ui
  private readonly $root: HTMLElement
  private $controller: HTMLElement
  private $current: HTMLElement
  private $buffer: HTMLElement
  private $time: HTMLElement

  private toast: Toast

  private barWidth: number = 0
  private _currentTime = 0
  private percent = 0
  private offsetWidth = 0

  // 是否正在拖动进度条
  private isDragging = false

  constructor (ui: Ui) {
    this.player = ui.player
    this.ui = ui
    this.toast = new Toast(ui)
    this.$root = this.player.$root.querySelector('.progress-bar') as HTMLElement
    this.$controller = this.$root.querySelector('.bar-controller') as HTMLElement
    this.$current = this.$root.querySelector('.bar-current') as HTMLElement
    this.$time = this.player.$root.querySelector('.controller-bottom-bar .time') as HTMLElement

    this.$buffer = this.$root.querySelector('.bar-buffer') as HTMLElement
    this.player.$video.addEventListener('timeupdate', () => {
      this._currentTime = this.player.$video.currentTime
      if (this.isDragging) return
      this.percent = this._currentTime / this.player.$video.duration
      if (isNaN(this.percent)) this.percent = 0
      this.updateTime()
      this.updateBar()
    })
    this.player.$video.addEventListener('progress', () => {
      this.updateTime()
      this.updateBufferBar()
    })

    this.resize()
    this.initEventAboutController()
    this.initEventAboutToast()
    this.updateTime()
  }

  private initEventAboutController () {
    const mouseMoveChangeTime = (e: MouseEvent) => {
      const rect = this.$root.getBoundingClientRect()
      const x = e.clientX - rect.left
      this.percent = x / this.barWidth
      if (isNaN(this.percent) || this.percent < 0) this.percent = 0
      if (this.percent > 1) this.percent = 1
      this.update()
      this.ui.isMouseInUI = true
    }
    const mouseup = () => {
      document.removeEventListener('mousemove', mouseMoveChangeTime)
      document.removeEventListener('mouseup', mouseup)
      this.isDragging = false
      this.player.$video.currentTime = this.percent * this.player.$video.duration
    }
    this.$root.addEventListener('mousedown', () => {
      this.isDragging = true
      document.addEventListener('mousemove', mouseMoveChangeTime)
      document.addEventListener('mouseup', mouseup)
    })

    this.$root.addEventListener('click', (e: MouseEvent) => {
      mouseMoveChangeTime(e)
      this.player.$video.currentTime = this.percent * this.player.$video.duration
    })
  }

  private initEventAboutToast () {
    let mouseenter = false
    let mousedown = false
    const mouseup = () => {
      document.removeEventListener('mouseup', mouseup)
      mousedown = false
      hideToast()
    }
    const hideToast = () => {
      if (!mouseenter && !mousedown) {
        this.toast.hide()
        document.removeEventListener('mousemove', mousemove)
      }
    }
    const mousemove = (e: MouseEvent) => {
      const playerRect = this.player.$root.getBoundingClientRect()
      const rect = this.$root.getBoundingClientRect()
      let x = e.clientX - rect.left
      if (!this.ui.isShow) x -= this.offsetWidth / 2
      const percent = x / this.barWidth
      if (isNaN(percent) || percent < 0) this.percent = 0
      if (this.percent > 1) this.percent = 1
      this.toast.text = SecondsToString(percent * this.player.$video.duration)
      if (x < 0) {
        x = 0
      } else if (x + this.toast.width > this.player.width) {
        x = this.player.width - this.toast.width
      }

      this.toast.x = x
      this.toast.y = rect.top - playerRect.top - 50
    }

    this.$root.addEventListener('mousedown', () => {
      this.toast.show()
      mousedown = true
      document.addEventListener('mouseup', mouseup)
      document.addEventListener('mousemove', mousemove)
    })

    this.$root.addEventListener('mouseenter', () => {
      this.toast.show()
      mouseenter = true
      document.addEventListener('mousemove', mousemove)
    })
    this.$root.addEventListener('mouseleave', () => {
      mouseenter = false
      hideToast()
    })
  }

  private updateTime () {
    console.warn('updateTime')
    if (!this.player.options.live) {
      this.$time.innerText = SecondsToString(this.player.$video.currentTime) +
        ' / ' + SecondsToString(this.player.$video.duration)
    }
  }

  init () {
    this.offsetWidth = this.player.width - this.$root.offsetWidth
  }

  resize () {
    this.barWidth = this.player.width - this.offsetWidth
    // console.warn('resize', this.player.width, this.offsetWidth, this.barWidth)
    this.updateBar()
    this.updateBufferBar()
  }

  update () {
    console.warn('update')
    // console.warn('进度条 update', this.ui.isShow)
    // this.$controller.style.background = this.player.options.color
    // this.$current.style.background = this.player.options.color
    if (this.player.options.live) {
      this.$time.innerText = this.ui.string.live
    }
  }

  reset () {
    this.resetTimeZone()
    this.resetProgressBar()
  }

  private updateBar () {
    console.warn('updateBar')
    if (this.ui.isShow) {
      this.barWidth = this.player.width - this.offsetWidth
    } else {
      this.barWidth = this.player.width
    }
    const x = this.barWidth * this.percent
    this.$current.style.width = x + 'px'
    this.$controller.style.transform = `translateX(${x}px)`
  }

  resetTimeZone () {
    if (this.player.options.live) {
      this.$time.innerText = '直播'
    } else {
      this.$time.innerText = SecondsToString(0) + ' / ' + SecondsToString(0)
    }
  }

  resetProgressBar () {
    this.percent = 0
    this.$buffer.style.width = 0 + 'px'
    this.update()
  }

  updateBufferBar () {
    console.warn('updateBufferBar')
    for (let i = 0; i < this.player.$video.buffered.length; i++) {
      const start = this.player.$video.buffered.start(i)
      const end = this.player.$video.buffered.end(i)
      // if (start < this._currentTime && this._currentTime < end) {
        this.$buffer.style.width = end / this.player.$video.duration * this.barWidth + 'px'
      // }
    }
  }
}
