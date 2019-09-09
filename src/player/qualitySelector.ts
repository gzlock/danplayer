import { ButtonAndLayer } from '@/player/buttonAndLayer'
import { UI } from '@/player/UI'
import { QualityLevel } from '@/player/qualityLevelAdapter'

export class QualitySelector extends ButtonAndLayer {
  private readonly autoLevel: QualityLevel = { selected: false, name: '自动', index: -1, bitrate: 0 }
  private readonly levels: QualityLevel[] = []
  currentLevel = -1

  constructor (ui: UI) {
    super(ui)
    this.$btn = this.player.$root.querySelector('.button.quality') as HTMLElement
    this.$layer = this.player.$root.querySelector('.float.quality-menu') as HTMLElement
    this.init()
    this.$layer.addEventListener('click', (e: MouseEvent) => {
      if (e.target) {
        const $item = e.target as HTMLElement
        if ($item.hasAttribute('data-value')) {
          const value = parseInt($item.getAttribute('data-value') as string)
          console.log('level click', value)
          this.levels.forEach(level => {
            level.selected = level.index === value
          })
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
    this.updateButton()
  }

  updateButton () {
    this.levels.every(level => {
      if (level.selected) {
        this.$btn.innerText = level.name
      }
      return !level.selected
    })
  }

  reset () {
    this.currentLevel = -1
    this.$layer.innerHTML = ''
  }

  private _updateLevel () {
    // 清空菜单内容
    this.$layer.innerHTML = ''
    this.levels.forEach((level: QualityLevel, index: number) => {
      const $item = document.createElement('div') as HTMLElement

      if (index === this.currentLevel) {
        $item.classList.add('current')
      }
      $item.innerText = level.name
      $item.setAttribute('data-value', level.index.toString())
      this.$layer.append($item)
    })
  }

  updateLevel (levels: QualityLevel[]) {
    console.log('update level', levels)
    this.levels.length = 0
    this.autoLevel.selected = true
    this.levels.push(...levels, this.autoLevel)
    this._updateLevel()
    this.updateLayerPosition()
    this.updateButton()
  }
}
