import { Player } from '@/player/player'
import { VolumeLayer } from '@/player/volumeLayer'
import { QualitySelector } from '@/player/qualitySelector'
import { ProgressBar } from '@/player/progressBar'
import { DanmakuLayer } from '@/player/danmaku/danmakuLayer'
import { DanmakuStyleLayer } from '@/player/danmaku/danmakuStyleLayer'
import { DanmakuForm } from '@/player/danmaku/danmakuForm'
import { IconButton } from '@/player/IconButton'

export class UI {
  qualitySelector: QualitySelector

  private _isMouseInUI: boolean = false
  danmakuLayer: DanmakuLayer
  player: Player
  isShow: boolean = false

  private $root: HTMLElement

  // 控制器按钮
  private btnPlay: IconButton
  private btnFullScreen: IconButton
  private btnShowDanmaku: IconButton
  private $gradientBG: HTMLElement
  private extraButtons: Element[] = []

  volume: VolumeLayer
  progressBar: ProgressBar
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

    this.btnFullScreen = new IconButton(this.$root.querySelector('.button.full-screen') as HTMLElement)
    this.btnFullScreen.$root.addEventListener('click', async () => {
      await this.player.toggleFullScreen()
      this.updateFullScreenButton()
    })

    this.btnPlay = new IconButton(this.$root.querySelector('.button.play') as HTMLElement)
    this.btnPlay.$root.addEventListener('click', () => {
      this.player.toggle()
      this.updatePlayButton()
    })

    this.btnShowDanmaku = new IconButton(this.$root.querySelector('.button.toggle-danamaku') as HTMLElement)
    this.btnShowDanmaku.$root.addEventListener('click', () => {
      this.danmakuLayer.toggle()
      this.updateDanmakuButton()
    })

    this.danmakuLayer = new DanmakuLayer(player)

    this.insertExtraButtons()
  }

  set isMouseInUI (val: boolean) {
    this._isMouseInUI = val
    this.cancelHideUIDelay()
  }

  get isMouseInUI () {
    return this._isMouseInUI
  }

  show () {
    this.isShow = true
    this.$root.classList.add('show')
    this.$gradientBG.classList.add('show')
    this.progressBar.resize()
  }

  hide () {
    this.isShow = false
    this.$root.classList.remove('show')
    this.$gradientBG.classList.remove('show')
    this.qualitySelector.hideLayer()
    this.volume.hideLayer()
    this.danmakuForm.styleLayer.hideLayer()
    this.player.$root.focus()
  }

  hideUIDelay () {
    this.cancelHideUIDelay()
    return new Promise(resolve => {
      this.hideTimeout = window.setTimeout(() => {
        this.hide()
        resolve()
      }, this.player.options.uiFadeOutDelay)
    })
  }

  cancelHideUIDelay () {
    clearTimeout(this.hideTimeout)
  }

  clearExtraButtons () {
    this.extraButtons.forEach($btn => $btn.remove())
    this.extraButtons.length = 0
  }

  insertExtraButtons () {
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

  update () {
    this.updateDanmakuButton()
    this.updateFullScreenButton()
    this.updatePlayButton()
    this.danmakuForm.update()
    this.progressBar.update()
    this.volume.update()
  }

  updatePlayButton () {
    if (this.player.paused) {
      this.btnPlay.switch('data-on', 'data-on-title')
    } else {
      this.btnPlay.switch('data-off', 'data-off-title')
    }
  }

  updateFullScreenButton () {
    if (this.player.isFullScreen) {
      this.btnFullScreen.switch('data-off', 'data-off-title')
    } else {
      this.btnFullScreen.switch('data-on', 'data-on-title')
    }
  }

  updateDanmakuButton () {
    let attr: string
    let title: string
    if (this.danmakuLayer.isShow) {
      attr = 'data-off'
      title = 'data-off-title'
    } else {
      attr = 'data-on'
      title = 'data-on-title'
    }
    this.btnShowDanmaku.switch(attr, title)
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
