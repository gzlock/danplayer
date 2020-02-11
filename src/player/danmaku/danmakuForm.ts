import { Ui } from '@/player/ui'
import { DanmakuStyleLayer } from '@/player/danmaku/danmakuStyleLayer'
import { Danmaku } from '@/player/danmaku/danmaku'

export class DanmakuForm {
  ui: Ui
  $root: HTMLElement
  $btn: HTMLElement
  $input: HTMLInputElement
  isShow = false
  styleLayer: DanmakuStyleLayer

  constructor (ui: Ui) {
    this.ui = ui
    this.styleLayer = new DanmakuStyleLayer(ui)

    this.$root = ui.player.$root.querySelector('.danmaku-form') as HTMLElement
    this.$input = this.$root.querySelector('input') as HTMLInputElement
    this.$btn = this.$root.querySelector('.send') as HTMLElement
    this.$btn.addEventListener('click', () => this.send())

    // 停止一切按键冒泡
    this.$input.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && this.ui.isShow) {
        this.send()
        this.ui.hide()
        this.$root.focus()
      }
      e.stopPropagation()
    })
    this.$input.addEventListener('keyup', (e: KeyboardEvent) => {
      e.stopPropagation()
    })
    this.$input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.$root.focus()
        this.ui.hide()
      }
      e.stopPropagation()
    })

    this.$input.addEventListener('focus', () => { this.ui.isMouseInUI = true })
    this.$input.addEventListener('blur', () => { this.ui.isMouseInUI = false })
  }

  async send () {
    const text = this.$input.value.trim()
    if (!text) return
    const options = this.styleLayer.getStyle()
    options.currentTime = this.ui.player.currentTime

    const danmaku = new Danmaku(text, options)
    if (this.ui.player.options.beforeSendDanmaku) {
      const success = await Promise.resolve(this.ui.player.options.beforeSendDanmaku(danmaku))
      if (!success) {
        return
      }
    }
    this.ui.danmakuLayer.send(danmaku)
    this.$input.value = ''
  }

  show () {
    this.isShow = true
    this.$root.style.display = ''
  }

  hide () {
    this.isShow = false
    this.$root.style.display = 'none'
  }

  update () {
    this.$btn.innerText = this.ui.string.danmakuSend
    this.$input.placeholder = this.ui.string.danmakuInputHint
    if (this.ui.player.options.danmakuForm) {
      this.show()
    } else {
      this.hide()
    }
  }

  focus () {
    this.$input.focus()
  }
}
