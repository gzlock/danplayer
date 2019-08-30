import { fabric } from 'fabric'
import { TextOptions } from 'fabric/fabric-impl'

export const enum DanmakuType {
  Top,
  Flow,
  Bottom
}

export interface DanmakuOptions extends TextOptions {
  // 视频进度
  duration?: number
  showType?: DanmakuType
  borderColor?: string
  fill?: string
}

export class Danmaku extends fabric.Text implements DanmakuOptions {
  public type = 'Danmaku'

  duration: number = 0
  showType: DanmakuType = DanmakuType.Flow
  borderColor: string = 'white'
  fill: string = 'white'

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

  toObject (propertiesToInclude?: string[]): any {
    const obj = super.toObject()
    obj.styles = fabric.util.object.clone(this.styles)
    return obj
  }
}

// @ts-ignore
fabric.Danmaku = Danmaku
