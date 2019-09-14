import './style.scss'
import { EventEmitter } from 'eventemitter3'
import { Danmaku } from '@/player/danmaku/danmaku'
import { Ui } from '@/player/ui'
import { DanmakuLayerOptions, MakeDanmakuLayerOptions } from '@/player/danmaku/danmakuLayer'
import { QualityLevel, QualityLevelAdapter } from '@/player/qualityLevelAdapter'
import { LoadMimeType } from '@/player/utils'

const icon = '//at.alicdn.com/t/font_1373341_m9a3piei0s.js'

const template = `{video-layer}
<input class="copy-tool" />
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
          data-on-title="播放视频" data-off-title="暂停播放">
          <svg class="icon" aria-hidden="true"><use xlink:href="#danplayer-bofang"></use></svg>
        </div>
        <div class="time"></div>
      </div>
      
      <div class="middle danmaku-form">
        <div class="button intern-button danmaku-style">
          <svg class="icon"><use xlink:href="#danplayer-style"></use></svg>
        </div>
        <input placeholder="输入弹幕内容" tabindex="1">
        <div class="send">发送</div>
      </div>
      <div class="right">
      
        <div class="button intern-button volume" data-on="danplayer-yinliang" data-off="danplayer-jingyin" title="音量">
          <svg class="icon"><use xlink:href="#danplayer-yinliang"></use></svg>
        </div>
        
        <div class="button intern-button toggle-danamaku" title="隐藏弹幕"
          data-on="danplayer-danmukai" data-off="danplayer-danmuguan" 
          data-on-title="显示弹幕" data-off-title="隐藏弹幕">
          <svg class="icon"><use xlink:href="#danplayer-danmukai"></use></svg>
        </div>
        
        <div class="button quality" title="切换画质"></div>
        
        <div class="button intern-button full-screen" data-on="danplayer-quanping" data-off="danplayer-zuixiaohua"
        data-on-title="全屏观看" data-off-title="取消全屏">
          <svg class="icon"><use xlink:href="#danplayer-quanping"></use></svg>
        </div>
      </div>
    </div>
  </div>
</div>`

interface PlayerOptions {
  /**
   * 直播模式
   * 没有进度条
   */
  live: boolean

  // 音量
  volume: number

  autoplay: boolean,

  // ui 的隐藏时间
  uiFadeOutDelay: number

  // 视频寸尺
  width: number | string
  height: number | string

  // 视频来源，也可以在<video src=""></video>的src设置
  src: string

  // iconfont Symbol方式 代码
  iconSrc: string

  // 扩展按钮
  extraButtons: { [name: string]: () => void }

  // 弹幕层的配置
  danmaku: DanmakuLayerOptions

  fullScreen: boolean

  danmakuForm: boolean

  unique: boolean

  color: string

  beforeSendDanmaku?: (danmaku: Danmaku) => Promise<boolean>
}

export interface PlayerPublicOptions {
  /**
   * 直播模式
   * 没有进度条
   */
  live: boolean

  // 音量
  volume: number

  autoplay: boolean,

  fontSize: number,

  // ui 的隐藏时间
  uiFadeOutDelay: number

  // 视频寸尺
  width: number | string
  height: number | string

  // 视频来源，也可以在<video src=""></video>的src设置
  src: string

  iconSrc: string

  // 扩展按钮
  extraButtons: { [name: string]: () => void }

  // 弹幕层的配置
  danmaku: Partial<DanmakuLayerOptions>

  fullScreen: boolean

  danmakuForm: boolean

  unique: boolean

  color: string

  beforeSendDanmaku?: (danmaku: Danmaku) => Promise<boolean>
}

enum VideoType {
  Normal = 'native',
  Hls = 'hls.js',
  Dash = 'dash.js'
}

function MakeDefaultOptions ({
  autoplay = false,
  color = '#00a1d6',
  live = false,
  volume = 0.7,
  width = 600,
  height = 350,
  uiFadeOutDelay = 3000,
  extraButtons = {},
  src = '',
  iconSrc = icon,
  danmakuForm = true,
  fullScreen = true,
  beforeSendDanmaku = undefined,
  danmaku = {},
  unique = false
}: Partial<PlayerOptions> | Partial<PlayerPublicOptions>): PlayerOptions {
  if (volume < 0 || volume > 1) {
    volume = 0.7
  }
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
    uiFadeOutDelay,
    extraButtons,
    unique,
    volume,
    beforeSendDanmaku,
    width
  }
}

export class Player extends EventEmitter {
  private static instances: Player[] = []
  $root: HTMLElement
  $video: HTMLVideoElement
  type = VideoType.Normal
  hls?: Hls
  dash?: dashjs.MediaPlayerClass

  public ui: Ui

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

  constructor ($e: HTMLVideoElement, options?: Partial<PlayerPublicOptions>) {
    super()
    if (!document.querySelector('script#danplayer-icon')) {
      const $icon = document.createElement('script')
      $icon.src = icon
      $icon.id = 'danplayer-icon'
      document.body.append($icon)
    }
    Player.instances.push(this)
    const parent = $e.parentElement as Element
    this.$root = document.createElement('div')
    this.$root.setAttribute('tabIndex', '0')
    this.$root.classList.add('video-player')
    parent.insertBefore(this.$root, $e)
    $e.classList.add('video-layer')
    $e.removeAttribute('id')
    this.$root.innerHTML = template.replace('{video-layer}', $e.outerHTML)
    $e.remove()

    this.$root.addEventListener('keypress', (e: KeyboardEvent) => {
      // console.log('keypress', e.key)
      let stop = true
      if (e.key === 'Enter') {
        this.ui.show()
        this.ui.danmakuForm.focus()
      } else if (e.key === ' ') {} else { stop = false }
      if (stop) {
        e.stopPropagation()
        e.preventDefault()
      }
    })
    this.$root.addEventListener('contextmenu', (e: MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
    })
    this.$root.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.key === ' ') {
        this.toggle()
        e.stopPropagation()
        e.preventDefault()
      }
    })
    document.addEventListener('fullscreenchange', () => {
      this._isFullScreen = document.fullscreenElement === this.$root
      this.ui.updateFullScreenButton()
    })

    this.$root.addEventListener('keydown', (e: KeyboardEvent) => {
      // console.log('keydown', e.key)
      let stop = true
      if (e.key === 'ArrowLeft' && !this.options.live) {
        this.$video.currentTime -= 5
      } else if (e.key === 'ArrowRight' && !this.options.live) {
        this.$video.currentTime += 5
      } else if (e.key === 'ArrowUp') {
        this.ui.volume.up()
      } else if (e.key === 'ArrowDown') {
        this.ui.volume.down()
      } else { stop = false }
      if (stop) {
        e.stopPropagation()
        e.preventDefault()
      }
    })

    this.$root.addEventListener('mousemove', () => {
      this.$root.classList.remove('mouse-idle')
      if (this.paused) {

      } else {
        if (this.ui.isMouseInUI) return
        this.ui.hideUIDelay().then(() => {
          this.$root.classList.add('mouse-idle')
        })
      }
    })

    this.$root.addEventListener('mouseover', () => {
      if (this.ui.isShow) return
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
    this.$video.setAttribute('preload', '')

    this.$video.addEventListener('playing', () => this.ui.hideUIDelay())

    this.$video.addEventListener('play', () => this.ui.updatePlayButton())
    this.$video.addEventListener('pause', () => this.ui.updatePlayButton())

    options = options || {}

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

    this.options = MakeDefaultOptions(options)

    this.adapter = new QualityLevelAdapter()
    this.ui = new Ui(this)
    this.ui.show()
    this.ui.progressBar.init()
    this.ui.hideUIDelay()

    this.adapter.on(QualityLevelAdapter.Events['OnLoad'], (levels: QualityLevel[]) => {
      this.ui.qualitySelector.updateLevel(levels)
    })
    this.ui.qualitySelector.on('selectLevel', (level: QualityLevel) => {
      console.log('选择画质级别', level)
      this.adapter.changeLevelTo(level)
    })

    this.updateUI()
    this.updateSrc().then()
  }

  private async updateSrc () {
    await this.getContentType()

    if (this.hls) {
      this.adapter.useHls(this.hls)
    } else if (this.dash) {
      this.adapter.useDash(this.dash)
    }

    if (this.type === VideoType.Normal) {
      this.ui.qualitySelector.hideButton()
    } else {
      this.ui.qualitySelector.showButton()
    }

    console.log('_set', { autoplay: this.options.autoplay, paused: this._paused })
    if (this.options.autoplay || !this.paused) {
      console.log('_set 播放')
      this.play()
    }
  }

  private updateUI () {
    this.ui.insertExtraButtons()

    this.ui.update()

    this.ui.progressBar.resize()

    this.resize()

    if (this.$style) {
      this.$style.remove()
    }
    this.$style = document.createElement('style') as HTMLStyleElement
    this.$style.innerHTML = `.video-player .colors .selected{border-color:${this.options.color} !important}
.video-player .types .selected{color:${this.options.color} !important}
.video-player .quality-menu .current{color:${this.options.color} !important}`
    document.body.append(this.$style)
    this.ui.qualitySelector.reset()

    if (this.options.live) {
      this.$root.classList.add('live')
    } else {
      this.$root.classList.remove('live')
    }
    this.$video.volume = this.options.volume
  }

  set (options: Partial<PlayerPublicOptions>) {
    options.danmaku = Object.assign({}, this.options.danmaku, options.danmaku)
    const newOptions = Object.assign({}, this.options, options)
    const optionsHasChanged = JSON.stringify(newOptions) === JSON.stringify(this.options)
    const srcHasChanged = newOptions.src !== this.options.src
    this.options = newOptions
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
      this.updateSrc().then()
    }
    this.updateUI()

    if (optionsHasChanged) {
      this.emit('optionChanged', this)
    }
  }

  resize () {
    if (this.options.width) {
      if (typeof this.options.width === 'number' || parseInt(this.options.width).toString() === this.options.width) {
        this._width = this.options.width + 'px'
      } else {
        this._width = this.options.width
      }
    }
    if (this.options.height) {
      if (typeof this.options.height === 'number' || parseInt(this.options.height).toString() === this.options.height) {
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

  private async getContentType () {
    let src: string
    if (this.options.src) {
      src = this.options.src
    } else if (this.$video.hasAttribute('src')) {
      src = this.$video.getAttribute('src') as string
    } else {
      return
    }
    console.log('视频网址', src)
    this.type = VideoType.Normal
    const contentType = await LoadMimeType(src)
    if (this.hls) this.hls.destroy()
    if (this.dash) this.dash.reset()

    // 浏览器原生支持播放
    if (this.$video.canPlayType(contentType)) {
      this.$video.src = src
    } else {
      if (src) {
        this.options.src = src
        if (src.match(/\.m3u[8]/)) {
          this.type = VideoType.Hls
        } else if (src.match(/\.mpd/)) this.type = VideoType.Dash
      }
      if (this.type === VideoType.Hls) {
        console.log('使用Hls.js')
        if (!Hls) {
          throw Error('播放Hls视频资源请加载hls.js的代码')
        }
        if (Hls.isSupported()) {
          this.hls = new Hls()
          this.hls.config.capLevelToPlayerSize = true
          this.hls.attachMedia(this.$video)
          this.hls.loadSource(src)
        }
      } else if (this.type === VideoType.Dash) {
        console.log('使用dash.js')
        if (!dashjs) {
          throw Error('播放MPD视频资源前加载dash.js的代码')
        }
        this.dash = dashjs.MediaPlayer().create()
        this.dash.initialize(this.$video, src, !this.$video.paused)
        const setting = this.dash.getSettings()
        setting.streaming.abr.limitBitrateByPortal = true
        this.dash.updateSettings(setting)
      }
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
  }

  get debug (): Object {
    let quality = '默认'
    let src = this.options.src
    if (this.type !== VideoType.Normal) {
      if (this.adapter.currentLevel) {
        quality = this.adapter.currentLevel.name
      } else {
        quality = '自动'
      }
    }
    return {
      width: this.width,
      height: this.height,
      type: this.type,
      src,
      quality,
      ui: this.ui.debug
    }
  }
}
