import './style.scss'
import { EventEmitter } from 'eventemitter3'
import { Danmaku } from '@/player/danmaku/danmaku'
import { Ui, UiString } from '@/player/ui'
import { DanmakuLayerOptions, MakeDanmakuLayerOptions, } from '@/player/danmaku/danmakuLayer'
import { QualityLevel, QualityLevelAdapter } from '@/player/qualityLevelAdapter'
import { Hash, RandomID } from '@/player/utils'

const DanPlayerVersion = '{DanPlayerVersion}'

const icon = '//at.alicdn.com/t/font_1373341_m9a3piei0s.js'

const defaultColor = '#00a1d6'

export enum ForceUse {
  Hls = 1,
  Dash
}

interface PlayerOptions {
  live: boolean

  volume: number

  autoplay: boolean

  uiFadeOutDelay: number

  width: number | string
  height: number | string

  src: string

  iconSrc: string

  forward: number
  backward: number

  extraButtons: HTMLElement[] | { [name: string]: () => void }

  danmaku: DanmakuLayerOptions

  fullScreen: boolean

  danmakuForm: boolean

  unique: boolean

  color: string

  beforeSendDanmaku?: (danmaku: Danmaku) => Promise<boolean>

  forceUse?: ForceUse

  ui: UiString

  preload: 'auto' | 'metadata' | 'none'
}

export interface PlayerPublicOptions {

  // 是否启用直播模式，没有进度条，没有播放时间
  live: boolean

  // 音量，0~1，默认为0.7
  volume: number

  // 自动播放，根据浏览器的差异不一定有效
  autoplay: boolean

  // ui 的隐藏时间，毫秒
  uiFadeOutDelay: number

  // 视频寸尺
  width: number | string
  height: number | string

  // 视频来源，也可以在<video src=""></video>的src设置
  src: string

  iconSrc: string

  // 前进的秒数，毫秒
  forward: number
  // 倒退的秒数，毫秒
  backward: number

  // 扩展按钮
  // extraButtons: { [name: string | HTMLElement]: () => void }

  extraButtons: HTMLElement[]

  // 弹幕层的配置 DanmakuLayerOptions
  danmaku: Partial<DanmakuLayerOptions>

  // 是否需要全屏
  fullScreen: boolean

  // 是否显示播放器底部中间的弹幕输入框
  danmakuForm: boolean

  // 唯一播放的播放器
  unique: boolean

  // 播放器的亮色，包括：进度条、进度滑块、音量滑块、音量条
  color: string

  // 发送弹幕前的事件
  beforeSendDanmaku?: (danmaku: Danmaku) => Promise<boolean>

  // 强制启用hls.js或者dash.js
  // 多数用于移动平台，因为Android webview支持hls，导致不会使用hls.js
  // 丢失了hls.js提供的画质选项
  forceUse?: ForceUse

  // ui 界面 多语言支持
  ui?: UiString

  preload?: 'auto' | 'metadata' | 'none'

}

enum VideoType {
  Normal = 'native',
  Hls = 'hls.js',
  Dash = 'dash.js',
}

function MakeDefaultOptions ({
  autoplay = false,
  color = defaultColor,
  live = false,
  volume = 0.7,
  width = 600,
  height = 350,
  uiFadeOutDelay = 3000,
  extraButtons = [],
  src = '',
  iconSrc = icon,
  danmakuForm = true,
  fullScreen = true,
  beforeSendDanmaku = undefined,
  danmaku = {},
  forward = 5,
  backward = 5,
  unique = false,
  forceUse = undefined,
  ui = undefined,
  preload = 'none',
}: Partial<PlayerPublicOptions>): PlayerOptions {
  if (volume < 0 || volume > 1) {
    volume = 0.7
  }
  const _ui = Object.assign(new UiString(), ui || {})
  return {
    autoplay,
    color,
    live,
    height,
    danmaku: MakeDanmakuLayerOptions(danmaku),
    danmakuForm,
    fullScreen,
    src,
    iconSrc,
    forward,
    backward,
    uiFadeOutDelay,
    extraButtons,
    unique,
    volume,
    beforeSendDanmaku,
    width,
    forceUse,
    ui: _ui,
    preload,
  }
}

const template = `{video-layer}
<div class="interactive-layer">
  <canvas class="danmaku-layer"></canvas>

  <div class="bg-gradient show"></div>


  <div class="float danmaku-style-layer"></div>

  <div class="float volume-bar">
    <div class="volume-num-label"></div>
    <div class="volume-column-bar">
      <div class="bar-ui bar-full"></div>
      <div class="bar-ui bar-current"></div>
      <div class="bar-controller"></div>
    </div>
  </div>

  <div class="float quality-menu"></div>
  
  <div class="float loading show"></div>

  <div class="controller-bottom-bar">
    <div class="progress-bar live-hide">
      <div class="bar-full"></div>
      <div class="bar-buffer"></div>
      <div class="bar-current"></div>
      <div class="bar-controller"></div>
    </div>

    <div class="buttons">
      <div class="left">
        <div class="button intern-button play" data-on="danplayer-bofang" data-off="danplayer-zanting"
          data-on-title="{play}" data-off-title="{pause}">
          <svg class="icon" aria-hidden="true"><use xlink:href="#danplayer-bofang"></use></svg>
        </div>
        <div class="time"></div>
      </div>

      <div class="middle danmaku-form">
        <div class="button intern-button danmaku-style">
          <svg class="icon"><use xlink:href="#danplayer-style"></use></svg>
        </div>
        <input placeholder="{danmakuInputHint}" tabindex="1">
        <div class="send">{danmakuSend}</div>
      </div>
      <div class="right">

        <div class="button intern-button volume" data-on="danplayer-yinliang" data-off="danplayer-jingyin" title="{volume}">
          <svg class="icon"><use xlink:href="#danplayer-yinliang"></use></svg>
        </div>

        <div class="button intern-button toggle-danamaku" title="隐藏弹幕"
          data-on="danplayer-danmuguan" data-off="danplayer-danmukai"
          data-on-title="{showDanmaku}" data-off-title="{hideDanmaku}">
          <svg class="icon"><use xlink:href="#danplayer-danmukai"></use></svg>
        </div>

        <div class="button quality" title="{switchQuality}"></div>

        <div class="button intern-button full-screen" data-on="danplayer-quanping" data-off="danplayer-zuixiaohua"
        data-on-title="{fullscreen}" data-off-title="{cancelFullscreen}">
          <svg class="icon"><use xlink:href="#danplayer-quanping"></use></svg>
        </div>
      </div>
    </div>
  </div>
</div>`

export class Player extends EventEmitter {
  private static instances: Player[] = []
  $root: HTMLElement
  $video: HTMLVideoElement
  type = VideoType.Normal
  private readonly id: string
  private hls?: Hls
  private dash?: dashjs.MediaPlayerClass

  public ui: Ui

  clickEvent: 'touchstart' | 'click' = ('ontouchstart' in document.documentElement ? 'touchstart' : 'click')

  private adapter: QualityLevelAdapter

  private $style!: HTMLStyleElement

  // 尺寸
  private _width: string = ''
  private _height: string = ''

  get width () {
    return this.$root.clientWidth
  }

  get height () {
    return this.$root.clientHeight
  }

  get isFullScreen () {
    return this._isFullScreen
  }

  private _duration: number = 0
  private _loading = true
  private _paused = true
  private _isFullScreen: boolean = false

  get loading () {
    return this._loading
  }

  public options: PlayerOptions

  constructor ($e: HTMLElement, options?: Partial<PlayerPublicOptions>) {
    super()

    console.info(`DanPlayer v${DanPlayerVersion}`)
    options = options || {}
    this.options = MakeDefaultOptions(options)

    const hash = Hash(icon)
    if (!document.querySelector('script#danplayer-icon' + hash)) {
      const $icon = document.createElement('script')
      $icon.src = icon
      $icon.id = 'danplayer-icon'
      document.body.append($icon)
    }
    Player.instances.push(this)
    const parent = $e.parentElement as Element
    this.$root = document.createElement('div')
    this.id = RandomID()
    this.$root.setAttribute('data-style', this.id)
    this.$root.setAttribute('tabIndex', '0')
    this.$root.classList.add('danplayer')
    parent.insertBefore(this.$root, $e)

    let videoLayer
    if ($e.tagName.toLowerCase() === 'video') {
      $e.classList.add('video-layer')
      $e.removeAttribute('id')
      videoLayer = $e.outerHTML
      if (options && !('src' in options)) {
        options.src = $e.getAttribute('src') as string
      }
    } else {
      videoLayer = '<video class="video-layer"></video>'
    }
    this.$root.innerHTML = template.replace('{video-layer}', videoLayer)
      .replace('{volume}', this.options.ui.volume)
      .replace('{showDanmaku}', this.options.ui.showDanmaku)
      .replace('{hideDanmaku}', this.options.ui.hideDanmaku)
      .replace('{play}', this.options.ui.play)
      .replace('{pause}', this.options.ui.pause)
      .replace('{danmakuInputHint}', this.options.ui.danmakuInputHint)
      .replace('{danmakuSend}', this.options.ui.danmakuSend)
      .replace('{fullscreen}', this.options.ui.fullscreen)
      .replace('{cancelFullscreen}', this.options.ui.cancelFullscreen)
      .replace('{switchQuality}', this.options.ui.switchQuality)
    $e.remove()

    this.$root.addEventListener('contextmenu', (e: MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
    })

    this.$root.addEventListener('keypress', (e: KeyboardEvent) => {
      console.log('keypress', e.key)
      if (e.key === 'Enter') {
        this.ui.show()
        this.ui.danmakuForm.focus()
      } else if (e.key === ' ') {
        this.toggle()
        e.stopPropagation()
        e.preventDefault()
      }
    })
    this.$root.addEventListener('keydown', (e: KeyboardEvent) => {
      console.warn('keydown 1', e.key)
      const stop = e.key.startsWith('Arrow')
      if (!this.options.live) {
        if (e.key === 'ArrowLeft') {
          this.$video.currentTime -= this.options.backward
        } else if (e.key === 'ArrowRight') {
          this.$video.currentTime += this.options.forward
        }
      }
      if (e.key === 'ArrowUp') {
        this.ui.volume.up()
      } else if (e.key === 'ArrowDown') {
        this.ui.volume.down()
      }
      // console.warn('keydown 2', stop)
      if (stop) {
        e.stopPropagation()
        e.preventDefault()
      }
    })

    document.addEventListener('fullscreenchange', () => {
      this._isFullScreen = document.fullscreenElement === this.$root
      this.ui.updateFullScreenButton()
    })

    this.$root.addEventListener('mousemove', () => {
      this.$root.classList.remove('mouse-idle')
      if (!this.ui.isShow) {
        this.ui.show()
        this.ui.cancelHideUIDelay()
      }
      if (!this.paused && !this.ui.isMouseInUI) {
        this.ui.hideUIDelay().then(() => {
          this.$root.classList.add('mouse-idle')
        })
      }
    })

    this.$root.addEventListener('touchstart', () => {
      this.ui.show()
      this.ui.cancelHideUIDelay()
    })
    this.$root.addEventListener('touchend', () => {
      this.ui.hideUIDelay()
    })

    this.$root.addEventListener('mouseover', () => {
      if (this.ui.isShow) return
      this.$root.classList.remove('mouse-idle')
      this.ui.show()
      this.ui.cancelHideUIDelay()
    })
    this.$root.addEventListener('mouseleave', () => {
      if (!this.ui.isShow) return
      this.ui.hide()
      this.ui.cancelHideUIDelay()
    })

    this.$video = this.$root.querySelector('.video-layer') as HTMLVideoElement
    this.$video.removeAttribute('controls')
    this.$video.addEventListener('durationchange', () => {
      // console.log('视频长度', this.$video.duration)
      this._duration = this.$video.duration
    })
    this.$video.setAttribute('preload', this.options.preload)

    this.$video.addEventListener('playing', () => this.ui.hideUIDelay())

    this.$video.addEventListener('play', () => this.ui.updatePlayButton())
    this.$video.addEventListener('pause', () => this.ui.updatePlayButton())

    this.$video.addEventListener('error', () => this.errorHandler())

    this.$video.addEventListener('loadedmetadata', () => {
      console.log('loadedmetadata')
      if (this.type === VideoType.Normal) {
        this.ui.qualitySelector.hideButton()
      } else {
        this.ui.qualitySelector.showButton()
      }
    })

    if (!('width' in options)) {
      options.width = this.$video.clientWidth as number
    }
    if (!('height' in options)) {
      options.width = this.$video.clientHeight as number
    }
    if (!('autoplay' in options)) {
      options.autoplay = this.$video.hasAttribute('autoplay')
    }

    window.addEventListener('resize', () => this.resizeEvt(1000))

    this.adapter = new QualityLevelAdapter()
    this.ui = new Ui(this)
    this.ui.show()
    this.ui.progressBar.init()
    this.ui.hideUIDelay()

    this.adapter.on(QualityLevelAdapter.Events.OnLoad,
      (levels: QualityLevel[]) => {
        this.ui.qualitySelector.updateLevel(levels)
      })
    this.ui.qualitySelector.on('selectLevel', (level: QualityLevel) => {
      console.log('选择画质级别', level)
      this.ui.progressBar.resetProgressBar()
      this.adapter.changeLevelTo(level)
    })

    this.updateUI()
    this.updateSrc().then()

    if (options?.forceUse) {
      this.errorHandler()
    }
  }

  private async updateSrc () {
    this.type = VideoType.Normal

    this.$video.src = this.options.src

    console.log('_set',
      {
        autoplay: this.options.autoplay,
        paused: this._paused,
      })
    if (this.options.autoplay || !this.paused) {
      console.log('_set 播放')
      this.play()
    }
  }

  private updateUI () {
    this.ui.string = this.options.ui

    this.ui.insertExtraButtons()

    this.ui.update()

    this.ui.progressBar.resize()

    this.resize()

    if (this.$style) {
      this.$style.remove()
    }
    if (this.options.color !== defaultColor) {
      this.$style = document.createElement('style') as HTMLStyleElement
      this.$style.innerHTML = `
.danplayer[data-style="${this.id}"] .colors .selected{border-color:${this.options.color} !important}
.danplayer[data-style="${this.id}"] .types .selected{color:${this.options.color} !important}
.danplayer[data-style="${this.id}"] .quality-menu .current{color:${this.options.color} !important}

.danplayer[data-style="${this.id}"] .volume-bar .bar-controller{background:${this.options.color} !important}
.danplayer[data-style="${this.id}"] .volume-bar .bar-current{background:${this.options.color} !important}

.danplayer[data-style="${this.id}"] .progress-bar .bar-controller{background:${this.options.color} !important}
.danplayer[data-style="${this.id}"] .progress-bar .bar-current{background:${this.options.color} !important}
`
      this.$root.append(this.$style)
    }
    this.ui.qualitySelector.update()

    if (this.options.live) {
      this.$root.classList.add('live')
    } else {
      this.$root.classList.remove('live')
    }
    this.$video.volume = this.options.volume
  }

  set (options: Partial<PlayerPublicOptions>) {
    const srcHasChanged = options.src !== this.options.src
    options.ui = Object.assign({}, new UiString(), options.ui)
    options.danmaku = Object.assign({}, this.options.danmaku, options.danmaku)
    const newOptions = Object.assign({}, this.options, options)
    console.log('set', newOptions)
    const optionsHasChanged = JSON.stringify(newOptions) ===
      JSON.stringify(this.options)
    if (srcHasChanged) {
      if (!options.forceUse) newOptions.forceUse = undefined
    }
    this.options = newOptions
    this.$video.setAttribute('preload', this.options.preload)
    if (srcHasChanged) {
      if (this.hls) {
        this.hls.detachMedia()
        this.hls = undefined
      }
      if (this.dash) {
        this.dash.reset()
        this.dash = undefined
      }
      this.ui.progressBar.reset()
      this.ui.qualitySelector.reset()
      this.updateSrc().then()
    }
    this.updateUI()

    if (optionsHasChanged) {
      this.emit('optionChanged', this)
    }

    console.log('set', options)
    if (options?.forceUse) {
      this.errorHandler()
    }
  }

  resize () {
    if (this.options.width) {
      if (typeof this.options.width === 'number' ||
        parseInt(this.options.width).toString() === this.options.width) {
        this._width = this.options.width + 'px'
      } else {
        this._width = this.options.width
      }
    }
    if (this.options.height) {
      if (typeof this.options.height === 'number' ||
        parseInt(this.options.height).toString() === this.options.height) {
        this._height = this.options.height + 'px'
      } else {
        this._height = this.options.height
      }
    }
    // console.log('resize options', this.options, { width: this._width, height: this._height })
    if (!this._isFullScreen) {
      this.$root.style.width = this._width
      this.$root.style.height = this._height
    }
    this.ui.resize()
  }

  private delayResize: number = -1

  private resizeEvt (ms: number) {
    window.clearTimeout(this.delayResize)
    this.delayResize = window.setTimeout(() => {
      this.resize()
    }, ms)
  }

  /**
   * 批量填充弹幕
   */
  fillDanmakus (array: Danmaku[]) {
    this.ui.danmakuLayer.danmakus.push(...array)
  }

  get currentTime () {
    return this.$video.currentTime
  }

  sendDanmaku (danmaku: Danmaku) {
    this.ui.danmakuLayer.send(danmaku)
  }

  clearDanmaku () {
    this.ui.danmakuLayer.clear()
  }

  get paused () {
    return this._paused
  }

  toggle () {
    if (this.paused) {
      this.play()
    } else {
      this.pause()
    }
  }

  play () {
    this._paused = false
    this.$video.play().then()
    if (this.options.unique) {
      Player.instances.forEach(player => {
        if (player !== this) {
          player.pause()
        }
      })
    }
  }

  pause () {
    this._paused = true
    this.$video.pause()
  }

  /**
   * 当播放视频错误时
   */
  private async errorHandler () {
    console.error('video 视频资源 错误', this.$video.error)
    // if (!this.$video.error || this.$video.error.code !== 4) return
    console.log('errorHandler')
    if (this.options.forceUse === ForceUse.Hls ||
      this.options.src.match(/\.m3u[8]/)) {
      console.log('errorHandler', 'hls.js')
      this.type = VideoType.Hls
      if (this.hls) this.hls.destroy()
      this.hls = new Hls()
      this.hls.attachMedia(this.$video)
      this.hls.loadSource(this.options.src)
      this.hls.config.capLevelToPlayerSize = true
      this.adapter.useHls(this.hls)
    } else if (this.options.forceUse === ForceUse.Dash ||
      this.options.src.match(/\.mpd/)) {
      this.type = VideoType.Dash
      if (this.dash) this.dash.reset()
      this.dash = dashjs.MediaPlayer().create()
      this.dash.initialize(this.$video, this.options.src, !this.$video.paused)
      const setting = this.dash.getSettings()
      if (setting.streaming?.abr) setting.streaming.abr.limitBitrateByPortal = true
      this.dash.updateSettings(setting)
      this.adapter.useDash(this.dash)
    }

    if (!this.$video.paused) {
      this.$video.setAttribute('autoplay', '')
      this.$video.play()
    }
  }

  /**
   * 切换全屏模式
   */
  async toggleFullScreen () {
    if (!this.options.fullScreen) return
    this._isFullScreen = !this._isFullScreen
    if (this._isFullScreen) {
      this.$root.classList.add('full-screen')

      if (this.$root.requestFullscreen) {
        await this.$root.requestFullscreen()
      } else {
        // @ts-ignore
        if (this.$root.webkitRequestFullscreen) {
          // @ts-ignore
          await this.$root.webkitRequestFullscreen()
        }
        // @ts-ignore
        if (this.$root.mozRequestFullScreen) {
          // @ts-ignore
          await this.$root.mozRequestFullScreen()
        }
        // @ts-ignore
        if (this.$root.mozRequestFullScreen) {
          // @ts-ignore
          await this.$root.mozRequestFullScreen()
        }
        // @ts-ignore
        if (this.$root.msRequestFullscreen) {
          // @ts-ignore
          await this.$root.msRequestFullscreen()
        }
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else {
        // @ts-ignore
        if (document.mozCancelFullScreen) {
          // @ts-ignore
          await document.mozCancelFullScreen()
        }
        // @ts-ignore
        if (document.webkitCancelFullScreen) {
          // @ts-ignore
          await document.webkitCancelFullScreen()
        }
        // @ts-ignore
        if (document.msExitFullscreen) {
          // @ts-ignore
          await document.msExitFullscreen()
        }
      }

      this.$root.classList.remove('full-screen')
    }
    this.resize()
    this.emit('toggleFullscreen')
  }

  /**
   * 销毁
   */
  destroy () {
    Player.instances.splice(Player.instances.indexOf(this), 1)
    this.ui.destroy()
    if (this.hls) {
      this.hls.detachMedia()
    }
    if (this.dash) {
      this.dash.reset()
    }
    if (this.$style) {
      this.$style.remove()
    }
    this.$root.remove()
  }

  get debug (): Object {
    let quality = '默认'
    const src = this.options.src
    if (this.type !== VideoType.Normal) {
      if (this.adapter.currentLevel) {
        quality = this.adapter.currentLevel.name
      } else {
        quality = '自动'
      }
    }
    return {
      id: this.id,
      width: this.width,
      height: this.height,
      type: this.type,
      src,
      quality,
      ui: this.ui.debug,
    }
  }
}
