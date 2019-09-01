export const enum DanmakuType {
  Top,
  Flow,
  Bottom
}

export class DanmakuOptions extends Object {
  // 视频进度
  currentTime?: number
  type?: DanmakuType = DanmakuType.Flow
  borderColor?: string
  fill?: string
}

export class Danmaku extends Object {
  text: string
  borderColor?: string
  currentTime: number = 0
  fill: string = 'white'
  type: DanmakuType = DanmakuType.Flow

  constructor (text: string, options?: DanmakuOptions) {
    super()
    this.text = text
    if (options) {
      Object.assign(this, options)
    }
  }
}
