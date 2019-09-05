import { Player } from '@/player/player'
import { ButtonAndLayer } from '@/player/buttonAndLayer'
import { UI } from '@/player/UI'

export class QualitySelector extends ButtonAndLayer {
  hls!: Hls
  private readonly $autoLevel: Element
  currentLevel = -1

  constructor (ui: UI) {
    super(ui)
    this.$btn = this.player.$root.querySelector('.button.quality') as HTMLElement
    this.$layer = this.player.$root.querySelector('.float.quality-menu') as HTMLElement
    this.$autoLevel = document.createElement('div')
    this.$autoLevel.innerHTML = '自动'
    this.$autoLevel.setAttribute('data-value', (-1).toString())
    this.init()
    this.$layer.addEventListener('click', (e: MouseEvent) => {
      if (e.target) {
        const $item = e.target as HTMLElement
        if ($item.hasAttribute('data-value')) {
          const value = parseInt($item.getAttribute('data-value') as string)
          console.log('click', value)
          if (this.player.hls) {
            this.player.hls.currentLevel = this.player.hls.loadLevel = value
            this.currentLevel = value
          }
        }
      }
      this.updateButton()
      this.hideLayer()
    })
  }

  showButton () {
    this.$btn.style.display = ''
  }

  hideButton () {
    this.$btn.style.display = 'none'
  }

  showLayer () {
    super.showLayer()
    this._updateLevel()
    this.updateLayerPosition()
  }

  updateButton () {
    let name = '自动'
    if (this.currentLevel > -1 && this.hls.levels[this.hls.loadLevel]) {
      name = this.hls.levels[this.hls.loadLevel].name + 'p'
    }
    this.$btn.innerText = name
  }

  private _updateLevel () {
    this.$layer.innerHTML = ''
    this.hls.levels.forEach((level, index) => {
      if (!level.name) return
      const $item = document.createElement('div') as HTMLElement

      if (index === this.currentLevel) {
        $item.classList.add('current')
      }
      $item.innerText = level.name + 'P'
      $item.setAttribute('data-value', index.toString())
      this.$layer.append($item)
    })
    if (this.currentLevel === -1) {
      this.$autoLevel.classList.add('current')
    } else {
      this.$autoLevel.classList.remove('current')
    }
    this.$layer.append(this.$autoLevel)
  }

  updateLevel (video: Hls) {
    this.hls = video
    this._updateLevel()
    this.updateLayerPosition()
    this.updateButton()
  }
}
