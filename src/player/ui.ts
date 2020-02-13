import { Player } from '@/player/player'
import { VolumeLayer } from '@/player/volumeLayer'
import { QualitySelector } from '@/player/qualitySelector'
import { ProgressBar } from '@/player/progressBar'
import { DanmakuLayer } from '@/player/danmaku/danmakuLayer'
import { DanmakuStyleLayer } from '@/player/danmaku/danmakuStyleLayer'
import { DanmakuForm } from '@/player/danmaku/danmakuForm'
import { IconButton } from '@/player/IconButton'

export class UiString {
  live = '直播'
  play = '播放'
  pause = '暂停'
  volume = '音量'
  danmakuInputHint = '输入弹幕内容'
  danmakuSend = '发送'
  danmakuType = '类型'
  danmakuTypeFlow = '流动'
  danmakuTypeTopFixed = '顶部'
  danmakuTypeBottomFixed = '底部'
  danmakuColor = '颜色'
  fullscreen = '全屏观看'
  cancelFullscreen = '取消全屏'
  switchQuality = '切换画质'
  showDanmaku = '显示弹幕'
  hideDanmaku = '隐藏弹幕'
  autoQualitySelect = '自动'
  copy = '复制'
}

export class Ui {
  qualitySelector: QualitySelector

  private _isMouseInUI: boolean = false
  danmakuLayer: DanmakuLayer
  player: Player
  isShow: boolean = false

  $root: HTMLElement
  $controlBar: HTMLElement

  string: UiString

  // 控制器按钮
  private btnPlay: IconButton
  private btnFullScreen: IconButton
  private btnShowDanmaku: IconButton
  private $gradientBG: HTMLElement
  private extraButtons: Element[] = []

  volume: VolumeLayer
  progressBar: ProgressBar
  danmakuStyleLayer: DanmakuStyleLayer
  danmakuForm: DanmakuForm

  // 右边按钮区别
  private $controllerButtonsRightLayout: Element

  private hideTimeout = -1

  constructor (player: Player) {
    this.player = player
    this.$root = player.$root.querySelector('.interactive-layer') as HTMLElement
    this.$controlBar = player.$root.querySelector(
      '.interactive-layer .controller-bottom-bar') as HTMLElement
    this.$controlBar.addEventListener('mouseenter', () => {
      this.isMouseInUI = true
    })
    this.$controlBar.addEventListener('mouseleave', () => {
      this.isMouseInUI = false
    })
    this.$gradientBG = player.$root.querySelector('.bg-gradient') as HTMLElement

    this.string = player.options.ui
    this.volume = new VolumeLayer(this)
    this.qualitySelector = new QualitySelector(this)
    this.progressBar = new ProgressBar(this)
    this.danmakuStyleLayer = new DanmakuStyleLayer(this)
    this.danmakuForm = new DanmakuForm(this)

    this.$controllerButtonsRightLayout = this.$controlBar.querySelector(
      '.buttons .right') as Element

    this.btnFullScreen = new IconButton(
      this.$controlBar.querySelector('.button.full-screen') as HTMLElement)
    this.btnFullScreen.$root.addEventListener('click', async () => {
      await this.player.toggleFullScreen()
      this.updateFullScreenButton()
    })

    this.btnPlay = new IconButton(
      this.$controlBar.querySelector('.button.play') as HTMLElement)
    this.btnPlay.$root.addEventListener('click', () => {
      this.player.toggle()
      this.updatePlayButton()
    })

    this.btnShowDanmaku = new IconButton(
      this.$controlBar.querySelector('.button.toggle-danamaku') as HTMLElement)
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
    this.$controlBar.classList.add('show')
    this.$gradientBG.classList.add('show')
    this.progressBar.resize()
  }

  hide () {
    this.isShow = false
    this.$controlBar.classList.remove('show')
    this.$gradientBG.classList.remove('show')
    this.qualitySelector.hideLayer()
    this.volume.hideLayer()
    this.danmakuForm.styleLayer.hideLayer()
    this.player.$root.focus()
    this.progressBar.update()
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
      for (const name in this.player.options.extraButtons) {
        const $btn = document.createElement('div') as HTMLElement
        $btn.innerText = name
        $btn.addEventListener('click', this.player.options.extraButtons[name])
        $btn.classList.add('button')
        this.$controllerButtonsRightLayout.prepend($btn)
        this.extraButtons.push($btn)
      }
    }
  }

  update () {
    this.updateDanmakuButton()
    this.updateFullScreenButton()
    this.updatePlayButton()
    this.danmakuForm.update()
    this.progressBar.update()
    this.volume.update()
    this.danmakuLayer.update()
    this.danmakuStyleLayer.update()
    this.qualitySelector.update()
  }

  updatePlayButton () {
    this.btnPlay.$root.setAttribute('data-on-title', this.string.play)
    this.btnPlay.$root.setAttribute('data-off-title', this.string.pause)
    if (this.player.paused) {
      this.btnPlay.switch('data-on', 'data-on-title')
    } else {
      this.btnPlay.switch('data-off', 'data-off-title')
    }
  }

  updateFullScreenButton () {
    this.btnFullScreen.$root.setAttribute('data-on-title', this.string.fullscreen)
    this.btnFullScreen.$root.setAttribute('data-off-title', this.string.cancelFullscreen)
    this.btnFullScreen.$root.style.display = this.player.options.fullScreen
      ? ''
      : 'none'
    if (this.player.isFullScreen) {
      this.btnFullScreen.switch('data-off', 'data-off-title')
    } else {
      this.btnFullScreen.switch('data-on', 'data-on-title')
    }
  }

  updateDanmakuButton () {
    this.btnShowDanmaku.$root.setAttribute('data-on-title', this.string.showDanmaku)
    this.btnShowDanmaku.$root.setAttribute('data-off-title', this.string.hideDanmaku)
    if (this.player.options.danmaku.enable) {
      let attr: string
      let title: string
      if (this.danmakuLayer.isShow) {
        attr = 'data-on'
        title = 'data-on-title'
      } else {
        attr = 'data-off'
        title = 'data-off-title'
      }
      this.btnShowDanmaku.switch(attr, title)
      this.btnShowDanmaku.show()
    } else {
      this.btnShowDanmaku.hide()
    }
  }

  resize () {
    if (this.qualitySelector.isShow) this.qualitySelector.updateLayerPosition()
    this.volume.update()
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
      danmakuLayer: this.danmakuLayer.debug,
    }
  }
}
