import { Player } from '@/player/player'
import { Volume } from '@/player/volume'
import { QualitySelector } from '@/player/qualitySelector'

export class Controller {
  qualitySelector: QualitySelector
  private $bar: HTMLElement
  private player: Player
  private isBarShow: boolean = false

  // 控制器按钮
  private $btnPlay: Element
  private $btnFullScreen: Element
  private $btnShowDanmaku: Element
  private $gradientBG: HTMLElement
  private extraButtons: Element[] = []

  private volume: Volume

  // 右边按钮区别
  private $controllerButtonsRightLayout: Element

  constructor (player: Player) {
    this.$bar = player.$root.querySelector('.controller-layer .controller-bottom-bar') as HTMLElement
    this.$gradientBG = player.$root.querySelector('.bg-gradient') as HTMLElement
    this.player = player

    player.$root.addEventListener('mouseenter', () => {
      this.showBar()
    })
    player.$root.addEventListener('mouseleave', () => {
      this.hideBar()
    })

    player.$video.addEventListener('play', () => this.updatePlayButton())
    player.$video.addEventListener('pause', () => this.updatePlayButton())

    this.volume = new Volume(player)
    this.qualitySelector = new QualitySelector(player)

    this.$controllerButtonsRightLayout = this.$bar.querySelector('.buttons .right') as Element
    this.$btnFullScreen = this.$bar.querySelector('.button.full-screen') as Element
    this.$btnFullScreen.addEventListener('click', async () => {
      await this.player.toggleFullScreen()
      this.updateFullScreenButton()
    })

    this.$btnPlay = this.$bar.querySelector('.button.play') as Element
    this.$btnPlay.addEventListener('click', () => {
      this.player.play()
      this.updatePlayButton()
    })

    this.$btnShowDanmaku = this.$bar.querySelector('.button.toggle-danamaku') as Element
    this.$btnShowDanmaku.addEventListener('click', () => {
      this.player.danmakuLayer.toggle()
      this.updateDanmakuButton()
    })

    this.insertExtraButtons()
  }

  public showBar () {
    this.isBarShow = true
    this.$bar.style.display = ''
    this.$gradientBG.classList.add('show')
  }

  public hideBar () {
    this.isBarShow = false
    this.$bar.style.display = 'none'
    this.$gradientBG.classList.remove('show')
  }

  public clearExtraButtons () {
    this.extraButtons.forEach($btn => $btn.remove())
    this.extraButtons.length = 0
  }

  public insertExtraButtons () {
    this.clearExtraButtons()
    if (this.player.options.extraButtons) {
      this.player.options.extraButtons.forEach($btn => {
        $btn.classList.add('button')
        $btn.classList.remove('intern-button')
      })
      this.$controllerButtonsRightLayout.prepend(...this.player.options.extraButtons)
      this.extraButtons.push(...this.player.options.extraButtons)
    }
  }

  private updatePlayButton () {
    let attr: string
    let attrTitle: string
    if (this.player.paused) {
      attr = 'data-on'
      attrTitle = 'data-on-title'
    } else {
      attr = 'data-off'
      attrTitle = 'data-off-title'
    }
    this.$btnPlay.innerHTML = this.$btnPlay.getAttribute(attr) as string
    this.$btnPlay.setAttribute('title', this.$btnPlay.getAttribute(attrTitle) as string)
  }

  private updateFullScreenButton () {}

  private updateDanmakuButton () {
    let attr: string
    let title: string
    if (this.player.danmakuLayer.isShow) {
      attr = 'data-off'
      title = 'data-off-title'
    } else {
      attr = 'data-on'
      title = 'data-on-title'
    }
    this.$btnShowDanmaku.innerHTML = this.$btnShowDanmaku.getAttribute(attr) as string
    this.$btnShowDanmaku.setAttribute('title', this.$btnShowDanmaku.getAttribute(title) as string)
  }
}
