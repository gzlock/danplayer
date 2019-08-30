import './style.scss'
import { fabric } from 'fabric'
import Hls from 'hls.js'
import { Danmaku, DanmakuOption } from '@/player/danamku'
import { Volume } from '@/player/volume'
import { Controller } from '@/player/controller'
import { DanmakuLayer } from '@/player/danmakuLayer'

const template = `<canvas class="danmaku-layer"></canvas>
{video-layer}
<div class="controller-layer">
  <div class="float volume-bar">
    <div class="volume-num-label"></div>
    <div class="volume-column-bar">
      <div class="bar-ui bar-full"></div>
      <div class="bar-ui bar-current"></div>
      <div class="bar-controller"></div>
    </div>
  </div>
  <div class="float quality-menu">
  
  </div>
  <div class="bg-gradient"></div>
  <div class="controller-bottom-bar">
    <div class="controller-container">
      <div class="progress-bar live-hide">
        <div class="bar-full"></div>
        <div class="bar-buffer"></div>
        <div class="bar-controller"></div>    
      </div>
      <div class="buttons">
        <div class="left">
          <div class="button intern-button play" data-on="&#xe6a4;" data-off="&#xe6a5;"
            data-on-title="播放视频" data-off-title="暂停播放">&#xe6a4;</div>
          <div class="button intern-button volume" data-on="&#xe63d;" data-off="&#xe63e;" title="音量">&#xe63d;</div>
          <div class="button intern-button toggle-danamaku" title="隐藏弹幕"
            data-on="&#xe697;" data-off="&#xe696;" 
            data-on-title="显示弹幕" data-off-title="隐藏弹幕">&#xe696;</div>
        </div>
        <div class="middle danmaku_form">
          <input>
          <button>发送</button>
        </div>
        <div class="right">
          <div class="button quality" title="切换画质"></div>
          <div class="button intern-button full-screen" data-on="&#xe6d9;" data-off="&#xe6e8;">&#xe6d9;</div>
        </div>
      </div>  
    </div>
  </div>
</div>`

export class DanmakuOptions extends Object {
  flowDuration: number = 8
  fadeoutDuration: number = 5
}

export class PlayerOptions extends Object {
  /**
   * 直播模式
   * 弹幕使用 {@link Danmaku} 不携带发视频当前的播放进度
   *
   * 普通视频模式
   * 弹幕使用 {@link Danmaku} 携带弹幕视频当前的播放进度 {@see DanmakuOption#duration}
   */
  live?: boolean = false

  // 音量
  volume?: number = 0.7

  // 视频控制条隐藏的时间
  uiFadeOutDelay?: number = 3000

  width?: number | string
  height?: number | string

  // 视频来源，也可以在<video src=""></video>的src设置
  src?: string

  // 扩展按钮
  extraButtons?: Element[]
  danmaku?: DanmakuOptions = new DanmakuOptions()

  only?: boolean = false
}

export class Player {
  private static instances: Player[] = []
  $root: HTMLElement
  $video: HTMLVideoElement
  video?: Hls
  private _speed: number = 1
  private _fontSize: number = 16
  public danmakuLayer: DanmakuLayer
  public controller: Controller

  // 尺寸
  private _width: string = ''
  private _height: string = '300px'

  get width () {
    return this.$root.clientWidth
  }

  get height () {
    return this.$root.clientHeight
  }

  private isFullScreen: boolean = false

  private _duration: number = 0

  public options: PlayerOptions

  constructor ($e: HTMLVideoElement, options?: PlayerOptions) {
    Player.instances.push(this)
    this.options = Object.assign(new PlayerOptions(), options)
    const parent = $e.parentElement as Element
    this.$root = document.createElement('div')
    this.$root.classList.add('video-player')
    parent.insertBefore(this.$root, $e)
    $e.classList.add('video-layer')
    $e.removeAttribute('id')
    this.$root.innerHTML = template.replace('{video-layer}', $e.outerHTML)
    $e.remove()

    this.$video = this.$root.querySelector('.video-layer') as HTMLVideoElement
    this.$video.removeAttribute('controls')
    if (this.options.src) {
      this.$video.setAttribute('src', this.options.src)
    }
    this.$video.addEventListener('loadedmetadata', () => {
      console.log('视频长度', this.$video.duration)
      this._duration = this.$video.duration
    })

    this.controller = new Controller(this)
    this.danmakuLayer = new DanmakuLayer(this)

    this.getContentType().then(() => {
      if (this.video) {
        this.video.on(Hls.Events.LEVEL_LOADED, () => {
          this.controller.qualitySelector.updateLevel(this.video as Hls)
        })
      }
    })

    window.addEventListener('resize', () => this.resizeEvt(1000))

    this.controller.insertExtraButtons()

    this.resize()
  }

  set (options: PlayerOptions) {
    this.options = options
    this.resize()
    this.controller.insertExtraButtons()
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
    console.log('resize options', this.options, { width: this._width, height: this._height })
    if (!this.isFullScreen) {
      this.$root.style.width = this._width
      this.$root.style.height = this._height
    }
    this.danmakuLayer.resize()
  }

  private delayResize: number = -1

  private resizeEvt (ms: number) {
    window.clearTimeout(this.delayResize)
    this.delayResize = window.setTimeout(() => {
      this.resize()
      this.danmakuLayer.resize()
    }, ms)
  }

  /**
   * 批量填充弹幕
   */
  fillDanmakus (array: Danmaku[]) {
    this.danmakuLayer.waitToShow.push(...array)
  }

  get currentTime () {
    return this.$video.currentTime
  }

  sendDanmaku (text: string, color: string = 'white') {
    this.danmakuLayer.send(text, color)
  }

  get paused () {
    return this.$video.paused
  }

  play () {
    if (this.paused) {
      this.$video.play().then()
      if (this.options.only) {
        Player.instances.forEach(player => {
          if (player !== this) {
            player.pause()
          }
        })
      }
    } else {
      this.$video.pause()
    }
  }

  pause () {
    this.$video.pause()
  }

  private async getContentType () {
    let useHLS = false
    const src = this.$video.getAttribute('src') as string
    console.log('视频网址', src)
    if (src) {
      useHLS = !!src.match(/\.m3u[8]/)
    }
    if (useHLS) {
      console.log('使用Hls.js')
      if (Hls.isSupported()) {
        this.video = new Hls()
        this.video.attachMedia(this.$video)
        this.video.loadSource(src)
      } else {
        const http = new XMLHttpRequest()
        http.open('Get', src)
        http.send()
        const contentType: string | null = await new Promise(resolve => {
          http.onreadystatechange = () => {
            if (http.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
              if (http.status === 200) {
                resolve(http.getResponseHeader('Content-Type') as string)
              } else {
                resolve(null)
              }
              http.abort()
            }
          }
        })
        console.log({ contentType })
        if (contentType && this.$video.canPlayType(contentType)) {
          this.$video.src = src
        }
      }
    }
  }

  speed (speed: number) {
    if (speed >= 0 && speed <= 1) {
      this._speed = speed
    }
  }

  /**
   * 切换全屏模式
   */
  async toggleFullScreen () {
    this.isFullScreen = !this.isFullScreen
    if (this.isFullScreen) {
      await this.$root.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
    this.resize()
  }
}
