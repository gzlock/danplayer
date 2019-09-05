import { UI } from '@/player/UI'
import { DanmakuStyleLayer } from '@/player/danmaku/danmakuStyleLayer'
import { Danmaku } from '@/player/danmaku/danmaku'

export class DanmakuForm {
  ui: UI
  $root: HTMLElement
  $btn: HTMLElement
  $input: HTMLInputElement
  isShow = false
  styleLayer: DanmakuStyleLayer

  constructor (ui: UI) {
    this.ui = ui
    this.styleLayer = new DanmakuStyleLayer(ui)

    this.$root = ui.player.$root.querySelector('.danmaku_form') as HTMLElement
    this.$input = this.$root.querySelector('input') as HTMLInputElement
    this.$btn = this.$root.querySelector('button') as HTMLElement
    this.$btn.addEventListener('click', () => {
      this.send()
    })
    this.$input.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        this.send()
      }
      if (e.key === ' ') {
        e.stopPropagation()
        return false
      }
    })
  }

  send () {
    if (this.$input.value) {
      const options = this.styleLayer.getStyle()
      options.currentTime = this.ui.player.currentTime
      this.ui.danmakuLayer.send(new Danmaku(this.$input.value, options))
      this.$input.value = ''
    }
  }

  toggle () {
    if (this.isShow) {
      this.hide()
    } else {
      this.show()
    }
  }

  show () {
    this.isShow = true
    this.$root.style.display = ''
  }

  hide () {
    this.isShow = false
    this.$root.style.display = 'none'
  }
}
