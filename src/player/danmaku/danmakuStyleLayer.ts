import { ButtonAndLayer } from '@/player/buttonAndLayer'
import { Ui } from '@/player/ui'
import { DanmakuOptions, DanmakuType } from '@/player/danmaku/danmaku'

const template =
  `<div><span class="danmaku-type"></span>
<div class="types">
  <div class="type" data-type="1">
    <div>
        <svg class="icon"><use xlink:href="#danplayer-danmugundongkai"></use></svg>
    </div>
    <span class="danmaku-type-flow"></span>
  </div>
  <div class="type" data-type="0">
    <div>
        <svg class="icon"><use xlink:href="#danplayer-danmudingbukai"></use></svg>
    </div>
    <span class="danmaku-type-top"></span>
  </div>
  <div class="type" data-type="2">
    <div>
        <svg class="icon"><use xlink:href="#danplayer-danmudibukai"></use></svg>
    </div>
    <span class="danmaku-type-bottom"></span>
  </div>
</div>
</div>
<div><span class="danmaku-color"></span>
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

  constructor (ui: Ui) {
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

    this.update()
  }

  public getStyle (): Partial<DanmakuOptions> {
    return { fill: this.fill, type: this.type, borderColor: 'white' }
  }

  public update () {
    const $type = this.$layer.querySelector('.danmaku-type') as HTMLElement
    const $typeFlow = this.$layer.querySelector('.danmaku-type-flow') as HTMLElement
    const $typeTop = this.$layer.querySelector('.danmaku-type-top') as HTMLElement
    const $typeBottom = this.$layer.querySelector('.danmaku-type-bottom') as HTMLElement
    const $color = this.$layer.querySelector('.danmaku-color') as HTMLElement

    $color.innerText = this.ui.string.danmakuColor
    $type.innerText = this.ui.string.danmakuType
    $typeFlow.innerText = this.ui.string.danmakuTypeFlow
    $typeTop.innerText = this.ui.string.danmakuTypeTopFixed
    $typeBottom.innerText = this.ui.string.danmakuTypeBottomFixed

    console.log('update style layer', $color)
  }
}
