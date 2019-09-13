// Type definitions for danplayer 0.1.0
// Project: https://github.com/gzlock/danplayer
// Definitions by: gzlock <https://github.com/gzlock>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.4

/// <reference types="hls.js" />
/// <reference types="dashjs" />

declare namespace danplayer {
  export enum VideoType {
    Normal = 'native',
    Hls = 'hls.js',
    Dash = 'dash.js'
  }

  export enum LimitType {
    UnLimited = 'unLimited', // 不限
    UnOverlap = 'unOverlap', // 防重叠
    Percent25 = 'percent25', // 25%屏显示弹幕
    Half = 'half', // 50%屏显示弹幕
    Percent75 = 'percent75', // 75%屏显示弹幕
  }

  export interface DanmakuLayerOptions {
    alpha: number
    enable: boolean
    flowDuration: number
    fadeoutDuration: number,
    fontSize: number,
    limit: LimitType // 防重叠选项
    contextMenu: ((danmaku: Danmaku) => { [name: string]: () => void }) | undefined
  }

  interface PlayerOptions {
    live: boolean

    volume: number

    autoplay: boolean,

    fontSize: number,

    uiFadeOutDelay: number

    width: number | string
    height: number | string

    src: string

    iconSrc: string

    extraButtons: { [name: string]: () => void }

    danmaku: DanmakuLayerOptions

    fullScreen: boolean

    danmakuForm: boolean

    unique: boolean

    color: string

    beforeSendDanmaku?: (danmaku: Danmaku) => Promise<boolean>
  }

  export interface PlayerPublicOptions {
    live: boolean

    volume: number

    autoplay: boolean,

    fontSize: number,

    uiFadeOutDelay: number

    width: number | string
    height: number | string

    src: string

    iconSrc: string

    extraButtons: { [name: string]: () => void }

    danmaku: Partial<DanmakuLayerOptions>

    fullScreen: boolean

    danmakuForm: boolean

    unique: boolean

    color: string

    beforeSendDanmaku?: (danmaku: Danmaku) => Promise<boolean>
  }

  export class Player {
    public $root: HTMLElement
    public $video: HTMLVideoElement
    public dash: dashjs.MediaPlayerClass
    public hls: Hls
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

    public sendDanmkau (danmaku: Danmaku): void

    public clearDanmaku (): void

    public destroy (): void

    public set (options: Partial<PlayerPublicOptions>): void

    public on (event: string, listener: (player: Player) => void): void

    public fillDanmakus (array: Danmaku[]): void

    public toggle (): void

    public toggleFullScreen (): void

    constructor (options: Partial<PlayerPublicOptions>)
  }

  export enum DanmakuType {
    Top,
    Flow,
    Bottom
  }

  export interface DanmakuOptions {
    currentTime: number
    type: DanmakuType
    borderColor: string
    fill: string
    id: string | number
    fontSize: string | number,
  }

  export class Danmaku implements DanmakuOptions {
    text: string
    borderColor: string
    currentTime: number
    fill: string
    type: DanmakuType
    id: string
    fontSize: string | number

    constructor (text: string, options?: Partial<DanmakuOptions>)
  }
}
