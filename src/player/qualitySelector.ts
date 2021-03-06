import { ButtonAndLayer } from '@/player/buttonAndLayer'
import { Ui } from '@/player/ui'
import { VideoType } from '@/player/player'
import { QualityLevel } from '@/player/qualityLevelAdapter'

export class QualitySelector extends ButtonAndLayer {
  private readonly autoLevel: QualityLevel
  private readonly levels: QualityLevel[] = []
  currentLevel = -1

  constructor (ui: Ui) {
    super(ui)
    this.autoLevel = { selected: false, name: ui.string.autoQualitySelect, index: -1, bitrate: 0 }
    this.$btn = this.player.$root.querySelector('.button.quality') as HTMLElement
    this.$layer = this.player.$root.querySelector('.float.quality-menu') as HTMLElement
    this.init()
    this.$layer.addEventListener(this.player.clickEvent, (e: MouseEvent | TouchEvent) => {
      console.log('level click 1', e.target)
      const $item = e.target as HTMLElement
      if ($item.hasAttribute('data-value')) {
        const value = parseInt($item.getAttribute('data-value') as string)
        console.log('level click 2', value)
        this.levels.forEach(level => {
          if (level.selected && level.index === this.currentLevel) return
          level.selected = level.index === value
          if (level.selected) {
            this.emit('selectLevel', level)
            this.currentLevel = value
          }
        })
        this.updateButton()
        this.hideLayer()
      }
    })
  }

  showLayer () {
    super.showLayer()
    this.updateLevelMenu()
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
    // console.error('qualitySelector reset')
    this.levels.length = 0
    this.currentLevel = -1
    this.$layer.innerHTML = ''
  }

  updateLevelMenu () {
    console.warn('updateLevelMenu')
    // 清空菜单内容
    this.$layer.innerHTML = ''
    this.levels.forEach((level: QualityLevel) => {
      const $item = document.createElement('div') as HTMLElement

      if (level.index === this.currentLevel) {
        $item.classList.add('current')
      }
      $item.innerText = level.name
      $item.setAttribute('data-value', level.index.toString())
      this.$layer.append($item)
    })
  }

  updateLevel (levels: QualityLevel[]) {
    this.levels.length = 0
    this.levels.push(...levels.reverse(), this.autoLevel)
    if (this.currentLevel === -1) {
      this.autoLevel.selected = true
    } else {
      this.levels.every((level: QualityLevel) => {
        level.selected = level.index === this.currentLevel
      })
    }
    console.log('update level', this.levels)
    this.updateLevelMenu()
    this.updateLayerPosition()
    this.updateButton()
  }

  update () {
    this.$btn.style.display = this.player.type === VideoType.Normal ? 'none' : ''
    this.autoLevel.name = this.ui.string.autoQualitySelect
    this.updateLevelMenu()
    this.updateButton()
  }
}
