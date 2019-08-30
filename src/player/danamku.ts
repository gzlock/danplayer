import { fabric } from 'fabric'
import { TextOptions } from 'fabric/fabric-impl'

export const enum DanmakuType {
  Top,
  Flow,
  Bottom
}

export interface DanmakuOption extends TextOptions {
  duration?: number
  showType?: DanmakuType
}

export class Danmaku extends fabric.Text {
  public type = 'Danmaku'
  public duration: number = 0
  public showType: DanmakuType = DanmakuType.Flow

  constructor (text: string, options?: DanmakuOption) {
    super(text, options as TextOptions)
    if (options) {
      this.duration = options.duration as number
      this.showType = options.showType as DanmakuType
    }
  }

  _render (ctx: CanvasRenderingContext2D): void {
    const x = this.left as number
    const y = this.top as number
    const w = this.width as number
    const h = this.height as number
    console.log('_render', { x, y, w, h })
    ctx.strokeStyle = this.borderColor as string
    ctx.strokeRect(-w / 2, -h / 2, w, h)

    super._render(ctx)
  }
}

// @ts-ignore
fabric.Danmaku = Danmaku
