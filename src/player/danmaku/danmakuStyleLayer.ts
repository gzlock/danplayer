import { ButtonAndLayer } from '@/player/buttonAndLayer'
import { UI } from '@/player/UI'
import { DanmakuOptions, DanmakuType, MakeDanmakuOptions } from '@/player/danmaku/danmaku'

const template =
  `<div>类型
<div class="types">
  <div class="type" data-type="1"><div><icon>&#xe69f;</icon></div>流动</div>
  <div class="type" data-type="0"><div><icon>&#xe69b;</icon></div>顶部</div>
  <div class="type" data-type="2"><div><icon>&#xe69d;</icon></div>底部</div>
</div>
</div>
<div>颜色
<div class="colors">
{colors}
</div>
</div>`

export class DanmakuStyleLayer extends ButtonAndLayer {
  private readonly $types: Element[]
  private readonly $colors: Element[]
  fill: string = '#ffffff'
  type: DanmakuType = DanmakuType.Flow
  static readonly colors = [
    '#FE0302', '#FF7204', '#FFAA02', '#FFD302', '#FFFF00', '#A0EE00', '#00CD00',
    '#019899', '#4266BE', '#89D5FF', '#CC0273', '#222222', '#9B9B9B', '#FFFFFF'
  ]

  constructor (ui: UI) {
    super(ui)
    this.$layer = this.player.$root.querySelector('.float.danmaku-style-layer') as HTMLElement
    this.$btn = this.player.$root.querySelector('.intern-button.danmaku-style') as HTMLElement
    this.$layer.innerHTML = template.replace('{colors}',
      DanmakuStyleLayer.colors.map(color => `<span style="background: ${color}" data-color="${color}"></span>`).join(''))
    this.init()
    this.$types = Array.from(this.$layer.querySelectorAll<Element>('.types > .type'))
    this.$colors = Array.from(this.$layer.querySelectorAll<Element>('.colors > span'))

    this.$types.forEach($dom => $dom.addEventListener('click', () => {
      this.$types.forEach($dom => $dom.classList.remove('selected'))
      $dom.classList.add('selected')
      this.type = Number($dom.getAttribute('data-type'))
    }))

    this.$colors.forEach($dom => $dom.addEventListener('click', () => {
      this.$colors.forEach($dom => $dom.classList.remove('selected'))
      $dom.classList.add('selected')
      this.fill = $dom.getAttribute('data-color') as string
    }))

    this.$types[0].classList.add('selected')
    this.$colors[this.$colors.length - 1].classList.add('selected')
  }

  public getStyle (): Partial<DanmakuOptions> {
    return { fill: this.fill, type: this.type, borderColor: 'white' }
  }
}
