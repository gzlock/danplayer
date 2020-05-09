import { Ui } from '@/player/ui'

export class Toast {
  readonly $root: HTMLElement
  isShow: boolean = false

  constructor (ui: Ui) {
    this.$root = document.createElement('div')
    this.$root.classList.add('toast')
    ui.$root.append(this.$root)
  }

  get width () { return this.$root.clientWidth }

  get height () { return this.$root.clientHeight }

  show () {
    this.isShow = true
    this.$root.classList.add('show')
  }

  hide () {
    this.isShow = false
    this.$root.classList.remove('show')
  }

  set text (text: string) {
    this.$root.innerText = text
  }

  get text () {
    return this.$root.innerText
  }

  get x () { return parseInt(this.$root.style.left || '0') }

  set x (x: number) { this.$root.style.left = x + 'px' }

  get y () { return parseInt(this.$root.style.top || '0') }

  set y (y: number) { this.$root.style.top = y + 'px' }
}
