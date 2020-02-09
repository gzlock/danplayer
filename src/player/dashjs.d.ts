declare enum VideoType {
  Normal = 'native',
  Hls = 'hls.js',
  Dash = 'dash.js'
}

declare enum ForceUse {
  Hls = 1,
  Dash = 2,
}

declare enum LimitType {
  UnLimited = 'unLimited', // 不限
  UnOverlap = 'unOverlap', // 防重叠
  Percent25 = 'percent25', // 25%屏显示弹幕
  Half = 'half', // 50%屏显示弹幕
  Percent75 = 'percent75', // 75%屏显示弹幕
}

declare interface DanmakuLayerOptions {
  alpha: number
  enable: boolean
  flowDuration: number
  fadeoutDuration: number,
  fontSize: number,
  limit: LimitType // 防重叠选项
  contextMenu: ((danmaku: Danmaku) => { [name: string]: () => void }) | undefined
}

declare interface PlayerOptions {
  live: boolean

  volume: number

  autoplay: boolean,

  fontSize: number,

  uiFadeOutDelay: number

  width: number | string
  height: number | string

  src: string

  iconSrc: string

  // 快进时间
  forward: number,
  // 倒退时间
  backward: number,

  extraButtons: { [name: string]: () => void }

  danmaku: DanmakuLayerOptions

  fullScreen: boolean

  danmakuForm: boolean

  unique: boolean

  color: string

  beforeSendDanmaku?: (danmaku: Danmaku) => Promise<boolean>

  forceUser?: ForceUse
}

declare interface PlayerPublicOptions {
  live: boolean

  volume: number

  autoplay: boolean,

  fontSize: number,

  uiFadeOutDelay: number

  width: number | string
  height: number | string

  src: string

  iconSrc: string

  // 快进时间
  forward: number,
  // 倒退时间
  backward: number,

  extraButtons: { [name: string]: () => void }

  danmaku: Partial<DanmakuLayerOptions>

  fullScreen: boolean

  danmakuForm: boolean

  unique: boolean

  color: string

  beforeSendDanmaku?: (danmaku: Danmaku) => Promise<boolean>

  forceUser?: ForceUse
}

declare class Player {
  public $root: HTMLElement
  public $video: HTMLVideoElement
  public options: PlayerOptions
  public type: VideoType

  public get currentTime (): number

  public get height (): number

  public get width (): number

  public get isFullScreen (): boolean

  public get debug (): Object

  public get paused (): boolean

  public get loading (): boolean

  public pause (): void

  public play (): void

  public resize (): void

  public sendDanmaku (danmaku: Partial<Danmaku>): void

  public clearDanmaku (): void

  public destroy (): void

  public set (options: Partial<PlayerPublicOptions>): void

  public on (event: string, listener: (player: Player) => void): void

  public fillDanmakus (array: Danmaku[]): void

  public toggle (): void

  public toggleFullScreen (): void

  constructor ($video: HTMLElement, options?: Partial<PlayerPublicOptions>)
}

declare enum DanmakuType {
  Top,
  Flow,
  Bottom
}

declare interface DanmakuOptions {
  currentTime: number
  type: DanmakuType
  borderColor: string
  fill: string
  id: string | number
  fontSize: string | number,
}

declare class Danmaku implements DanmakuOptions {
  text: string
  borderColor: string
  currentTime: number
  fill: string
  type: DanmakuType
  id: string
  fontSize: string | number

  constructor (text: string, options?: Partial<DanmakuOptions>)
}

export {
  Player,
  PlayerPublicOptions,
  Danmaku,
  DanmakuType,
  DanmakuLayerOptions,
  DanmakuOptions,
}
