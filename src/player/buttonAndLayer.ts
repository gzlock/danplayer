import { Player } from './player'

export class ButtonAndLayer {
  player!: Player
  $btn!: HTMLElement
  $layer!: HTMLElement

  protected layerHideDelay = 200
  protected bottomOffset = 40
  private hideTimeout = -1
  private _isShow: boolean = false

  // 不让layer隐藏
  protected holdLayer = false

  get isShow (): boolean {
    return this._isShow
  }

  constructor (player: Player) {
    this.player = player
  }

  protected init () {
    const mouseenterShowLayer = () => {
      clearTimeout(this.hideTimeout)
      this.showLayer()
    }
    const mouseleaveHideLayer = () => {
      clearTimeout(this.hideTimeout)
      this.hideTimeout = setTimeout(() => {
        this.hideLayer()
      }, this.layerHideDelay)
    }
    this.$btn.addEventListener('mouseenter', mouseenterShowLayer)
    this.$btn.addEventListener('mouseleave', mouseleaveHideLayer)

    this.$layer.addEventListener('mouseenter', mouseenterShowLayer)
    this.$layer.addEventListener('mouseleave', mouseleaveHideLayer)
  }

  showLayer () {
    this._isShow = true
    this.$layer.style.display = 'block'
    this.updateLayerPosition()
  }

  hideLayer () {
    this._isShow = false
    this.$layer.style.display = ''
  }

  toggleLayer () {
    if (this._isShow) {
      this.hideLayer()
    } else {
      this.showLayer()
    }
  }

  updateLayerPosition () {
    if (!this._isShow) return
    const rootRect = this.player.$root.getBoundingClientRect()
    const rect = this.$btn.getBoundingClientRect()
    const layerRect = this.$layer.getBoundingClientRect()
    const left = rect.left + (rect.width / 2) - rootRect.left - layerRect.width / 2

    this.$layer.style.left = left + 'px'
    this.$layer.style.bottom = this.bottomOffset + 'px'
    console.log('update', { left })
  }
}
