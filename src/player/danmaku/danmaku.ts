export const enum DanmakuType {
  Top,
  Flow,
  Bottom
}

interface iDanmakuContextMeuEvent {
  readonly danmaku: Danmaku
}

declare var DanmakuContextMeuEvent: {
  prototype: iDanmakuContextMeuEvent;
  new (type: string, eventInitDict?: MouseEventInit): MouseEvent;
}

export interface DanmakuOptions {
  // 视频进度
  currentTime: number
  type: DanmakuType
  borderColor: string
  fill: string
}

export function MakeDanmakuOptions ({
  currentTime = 0,
  borderColor = '',
  fill = 'white',
  type = DanmakuType.Flow
}: Partial<DanmakuOptions>): DanmakuOptions {
  return { currentTime, type, borderColor, fill }
}

export class Danmaku implements DanmakuOptions {
  text: string
  borderColor!: string
  currentTime!: number
  fill!: string
  type!: DanmakuType

  constructor (text: string, options?: Partial<DanmakuOptions>) {
    this.text = text
    Object.assign(this, MakeDanmakuOptions(options || {}))
  }
}
