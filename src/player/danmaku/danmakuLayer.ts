import { Player } from '@/player/player'
import { fabric } from 'fabric'
import { Danmaku, DanmakuType } from '@/player/danmaku/danmaku'
import { sortBy, groupBy } from 'lodash'
import { DanmakuDrawer, DanmakuFlowDrawer, DanmakuFixedDrawer } from './danmaku_drawer'

export interface DanmakuLayerOptions {
  enable: boolean
  flowDuration: number
  fadeoutDuration: number
}

export function MakeDanmakuLayerOptions ({
  enable = true,
  flowDuration = 8,
  fadeoutDuration = 5
}: Partial<DanmakuLayerOptions> = {}): DanmakuLayerOptions {
  return { enable, flowDuration, fadeoutDuration }
}

export class DanmakuLayer {
  private player: Player
  private canvas: fabric.Canvas
  private $root: HTMLElement
  private $menu: HTMLElement

  // 弹幕内容池
  danmakus: Danmaku[] = []
  showed: Danmaku[] = []

  // 池
  topEnables: DanmakuFixedDrawer[] = []
  topAndBottomDisables: DanmakuFixedDrawer[] = []
  bottomEnables: DanmakuFixedDrawer[] = []
  flowEnables: DanmakuFlowDrawer[] = []
  flowDisables: DanmakuFlowDrawer[] = []

  private topTop = 0
  private flowTop = 0
  private bottomTop = 0

  // 上一帧的生成时间
  private frameTime: number = 0
  // 最后一帧
  private lastFrame: number = Date.now()

  isShow = true

  private width = 0
  private height = 0
  private calcTopInterval: number = -1
  private destroied: boolean = false

  constructor (player: Player) {
    this.player = player
    const $canvas = this.player.$root.querySelector('.danmaku-layer') as HTMLCanvasElement

    this.canvas = new fabric.Canvas($canvas, {
      selection: false,
      hoverCursor: 'default',
      moveCursor: 'default'
    })
    // @ts-ignore
    window.canvas = this.canvas
    this.canvas.defaultCursor = 'pointer'
    this.canvas.on('mouse:up', (e: fabric.IEvent) => {
      if (e.target === null) {
        this.player.toggle()
      }
    })
    const canvas = player.$root.querySelector('.upper-canvas') as HTMLCanvasElement
    this.$menu = player.$root.querySelector('.float.danmaku-context-menu') as HTMLElement

    const hideMenu = (e: MouseEvent) => {
      if (this.$menu === e.currentTarget || this.$menu.contains(e.currentTarget as Element)) {
        console.log()
      }
      this.$menu.classList.remove('show')
      document.removeEventListener('click', hideMenu)
      document.removeEventListener('contextmenu', hideMenu)
    }
    canvas.addEventListener('contextmenu', (e: MouseEvent) => {
      const found = this.findDrawers(e)
      if (found.length > 0) {
        console.log('found', found)
        this.$menu.classList.add('show')
        this.$menu.innerHTML = ''
        for (let i = 0; i < found.length; i++) {
          const item = document.createElement('div') as HTMLDivElement
          item.innerText = found[i].danmaku.text
          this.$menu.append(item)
        }
        this.$menu.style.left = e.offsetX + 'px'
        this.$menu.style.top = e.offsetY + 'px'
        this.$menu.focus()
        document.addEventListener('click', hideMenu)
        document.addEventListener('contextmenu', hideMenu)
      } else {
        this.$menu.classList.remove('show')
      }
      e.preventDefault()
      e.stopPropagation()
      return false
    })

    this.$root = this.player.$root.querySelector('.canvas-container') as HTMLElement
    this.player.$video.addEventListener('seeked', () => {
      // console.log('video seeked 事件')
      this.clear()
    })

    if (this.player.options.danmaku.enable) {
      this.show()
    } else {
      this.hide()
    }
    this.loop()
  }

  show () {
    this.isShow = true
    this.$root.style.display = ''
  }

  hide () {
    this.isShow = false
    this.$root.style.display = 'none'
  }

  clear () {
    this.showed.length = 0
    this.canvas.clear()
    this.topAndBottomDisables.push(...this.topEnables)
    this.topEnables.length = 0
    this.flowDisables.push(...this.flowEnables)
    this.flowEnables.length = 0
  }

  resize () {
    this.width = this.player.$root.clientWidth
    this.height = this.player.$root.clientHeight
    this.canvas.setDimensions({ width: this.width, height: this.height })
  }

  toggle (): void {
    if (this.isShow) {
      this.hide()
    } else {
      this.show()
    }
  }

  send (d: Danmaku) {
    this.danmakus.push(d)
  }

  private findDrawers (e: MouseEvent): DanmakuDrawer[] {
    return [
      ...this.topEnables.filter(drawer => DanmakuLayer.find(e, drawer)),
      ...this.bottomEnables.filter(drawer => DanmakuLayer.find(e, drawer)),
      ...this.flowEnables.filter(drawer => DanmakuLayer.find(e, drawer))
    ]
  }

  private static find (e: MouseEvent, drawer: DanmakuDrawer): boolean {
    if (e.offsetX > drawer.left && e.offsetX < (drawer.left + drawer.width)) {
      if (e.offsetY > drawer.top && e.offsetY < (drawer.top + drawer.height)) {
        return true
      }
    }
    return false
  }

  private addDanmakuToCanvas () {
    let hasChange = false
    for (let i = 0; i < this.danmakus.length; i++) {
      const danmaku = this.danmakus[i]
      const time = Math.abs(this.player.currentTime - danmaku.currentTime)
      if (this.showed.includes(danmaku)) continue
      if (time > 0.1) continue
      hasChange = true
      this.showed.push(danmaku)

      let drawer: DanmakuFixedDrawer | DanmakuFlowDrawer | undefined
      if (danmaku.type === DanmakuType.Flow) {
        this.calcFlowTop()
        drawer = this.flowDisables.shift()
        if (!drawer) {
          drawer = new DanmakuFlowDrawer()
        }
        drawer.set(danmaku, this.width, this.flowTop)
        // this.calcFlowTopFromDrawer(drawer)
        this.flowEnables.push(drawer)
      } else {
        drawer = this.topAndBottomDisables.shift()
        if (!drawer) {
          drawer = new DanmakuFixedDrawer()
        }
        if (danmaku.type === DanmakuType.Top) {
          drawer.set(danmaku, this.player.options.danmaku.fadeoutDuration, this.width, this.topTop)
          this.calcTopTop(drawer)
          this.topEnables.push(drawer)
        } else {
          drawer.set(danmaku, this.player.options.danmaku.fadeoutDuration, this.width, this.bottomTop)
          this.calcBottomTop(drawer)
          this.bottomEnables.push(drawer)
        }
      }
      this.canvas.add(drawer.label)
    }

    if (this.player.paused && hasChange) {
      this.canvas.renderAll()
    }
  }

  private calcFlowTop () {
    if (this.flowEnables.length === 0) {
      this.flowTop = 0
      return
    }
    const lineHeight = this.flowEnables[0].height
    // 按top坐标分组
    const lines = groupBy<DanmakuFlowDrawer>(this.flowEnables, (item) => Math.floor(item.top))
    let top = 0

    for (let key in lines) {
      const drawers: DanmakuFlowDrawer[] = sortBy(lines[key], drawer => drawer.left + drawer.width)
      const drawer: DanmakuFlowDrawer = drawers[drawers.length - 1]
      if ((drawer.left + drawer.width) < this.width) {
        top = drawer.top
        break
      } else {
        top += drawer.height
      }
    }
    if (top + lineHeight > this.height) {
      console.log('高度超出画布')
      top = 0
    }
    console.log({ lineHeight, top, flowTop: this.flowTop })
    this.flowTop = top
  }

  private calcTopTop (drawer: DanmakuFixedDrawer) {
    if (drawer.enable) {
      const height = drawer.label.top + drawer.height
      if (height > this.height) {
        this.topTop = drawer.label.top = 0
      } else {
        this.topTop = height
      }
    } else if (drawer.label.top < this.topTop) {
      this.topTop = drawer.label.top
    }
  }

  private calcBottomTop (drawer: DanmakuFixedDrawer) {
    if (drawer.enable) {
      if (drawer.label.top <= 0) {
        drawer.label.top = this.height - drawer.height
      }
      this.bottomTop = drawer.label.top - drawer.label.height
    } else if (drawer.label.top > this.bottomTop) {
      this.bottomTop = drawer.label.top
    }
  }

  /**
   * 绘制弹幕
   */
  private drawDanmaku () {
    this.topEnables = this.topEnables.filter(drawer => {
      if (drawer.enable) {
        drawer.update(this.width, this.frameTime)
        return true
      } else {
        this.topAndBottomDisables.push(drawer)
        this.canvas.remove(drawer.label)
        this.calcTopTop(drawer)
        return false
      }
    })

    this.bottomEnables = this.bottomEnables.filter(drawer => {
      if (drawer.enable) {
        drawer.update(this.width, this.frameTime)
        return true
      } else {
        this.topAndBottomDisables.push(drawer)
        this.canvas.remove(drawer.label)
        this.calcBottomTop(drawer)
        return false
      }
    })

    this.flowEnables = this.flowEnables.filter(drawer => {
      if (drawer.enable) {
        drawer.update(this.width, this.player.options.danmaku.flowDuration, this.frameTime)
        return true
      } else {
        this.flowDisables.push(drawer)
        this.canvas.remove(drawer.label)
        return false
      }
    })

    if (this.isShow) {
      this.canvas.renderAll()
    }
  }

  private loop () {
    if (this.destroied) return
    this.addDanmakuToCanvas()
    if (!this.player.paused) {
      this.drawDanmaku()
    }
    this.frameTime = (Date.now() - this.lastFrame) / 1000
    this.lastFrame = Date.now()

    window.requestAnimationFrame(() => { this.loop() })
  }

  destroy () {
    this.destroied = true
    clearInterval(this.calcTopInterval)
  }

  get debug (): Object {
    return {
      isShow: this.isShow,
      all: this.danmakus.length,
      showed: this.showed.length,
      canvasItems: this.canvas._objects.length,
      fixed: {
        top: this.topEnables.length,
        bottom: this.bottomEnables.length,
        disabled: this.topAndBottomDisables.length
      },
      flow: {
        enables: this.flowEnables.length,
        disabled: this.flowDisables.length
      },
      top: {
        top: this.topTop,
        flow: this.flowTop,
        bottom: this.bottomTop
      }
    }
  }
}
