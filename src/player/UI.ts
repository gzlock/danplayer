import { Player } from '@/player/player'
import { VolumeLayer } from '@/player/volumeLayer'
import { QualitySelector } from '@/player/qualitySelector'
import { ProgressBar } from '@/player/progressBar'
import { DanmakuLayer } from '@/player/danmaku/danmakuLayer'
import { DanmakuStyleLayer } from '@/player/danmaku/danmakuStyleLayer'
import { DanmakuForm } from '@/player/danmaku/danmakuForm'

export class UI {
  qualitySelector: QualitySelector

  private _isMouseInUI: boolean = false
  danmakuLayer: DanmakuLayer

  set isMouseInUI (val: boolean) {
    this._isMouseInUI = val
    this.cancelHideUIDelay()
  }

  get isMouseInUI () {
    return this._isMouseInUI
  }

  player: Player
  isShow: boolean = false

  private $root: HTMLElement

  // 控制器按钮
  private $btnPlay: Element
  private $btnFullScreen: Element
  private $btnShowDanmaku: Element
  private $gradientBG: HTMLElement
  private extraButtons: Element[] = []

  private volume: VolumeLayer
  private progressBar: ProgressBar
  styleLayer: DanmakuStyleLayer
  danmakuForm: DanmakuForm

  // 右边按钮区别
  private $controllerButtonsRightLayout: Element

  private hideTimeout = -1

  constructor (player: Player) {
    this.player = player
    this.$root = player.$root.querySelector('.interactive-layer .controller-bottom-bar') as HTMLElement
    this.$root.addEventListener('mouseenter', () => {
      this.isMouseInUI = true
    })
    this.$root.addEventListener('mouseleave', () => {
      this.isMouseInUI = false
    })
    this.$gradientBG = player.$root.querySelector('.bg-gradient') as HTMLElement

    this.volume = new VolumeLayer(this)
    this.qualitySelector = new QualitySelector(this)
    this.progressBar = new ProgressBar(this)
    this.styleLayer = new DanmakuStyleLayer(this)
    this.danmakuForm = new DanmakuForm(this)

    this.$controllerButtonsRightLayout = this.$root.querySelector('.buttons .right') as Element
    this.$btnFullScreen = this.$root.querySelector('.button.full-screen') as Element
    this.$btnFullScreen.addEventListener('click', async () => {
      await this.player.toggleFullScreen()
      this.updateFullScreenButton()
    })

    this.$btnPlay = this.$root.querySelector('.button.play') as Element
    this.$btnPlay.addEventListener('click', () => {
      this.player.toggle()
      this.updatePlayButton()
    })

    this.$btnShowDanmaku = this.$root.querySelector('.button.toggle-danamaku') as Element
    this.$btnShowDanmaku.addEventListener('click', () => {
      this.danmakuLayer.toggle()
      this.updateDanmakuButton()
    })

    this.danmakuLayer = new DanmakuLayer(player)

    this.insertExtraButtons()
  }

  public show () {
    this.isShow = true
    this.$root.style.display = ''
    this.$gradientBG.classList.add('show')
  }

  public hide () {
    this.isShow = false
    this.$root.style.display = 'none'
    this.$gradientBG.classList.remove('show')
  }

  public hideUIDelay () {
    this.cancelHideUIDelay()
    return new Promise(resolve => {
      this.hideTimeout = window.setTimeout(() => {
        this.hide()
        this.volume.hideLayer()
        this.qualitySelector.hideLayer()
        resolve()
      }, this.player.options.uiFadeOutDelay)
    })
  }

  public cancelHideUIDelay () {
    clearTimeout(this.hideTimeout)
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

  updatePlayButton () {
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
    if (this.danmakuLayer.isShow) {
      attr = 'data-off'
      title = 'data-off-title'
    } else {
      attr = 'data-on'
      title = 'data-on-title'
    }
    this.$btnShowDanmaku.innerHTML = this.$btnShowDanmaku.getAttribute(attr) as string
    this.$btnShowDanmaku.setAttribute('title', this.$btnShowDanmaku.getAttribute(title) as string)
  }

  resize () {
    if (this.volume.isShow) this.volume.updateLayerPosition()
    if (this.qualitySelector.isShow) this.qualitySelector.updateLayerPosition()
    this.progressBar.resize()
    this.danmakuLayer.resize()
  }

  destroy () {
    clearTimeout(this.hideTimeout)
    this.danmakuLayer.destroy()
    this.qualitySelector.destroy()
    this.volume.destroy()
  }

  get debug (): Object {
    return {
      isShow: this.isShow,
      isMouseInUI: this._isMouseInUI,
      danmakuLayer: this.danmakuLayer.debug
    }
  }
}
