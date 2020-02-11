import { EventEmitter } from 'eventemitter3'

const AdapterEvents = {
  OnLoad: 'OnLoaded',
  OnChanged: 'OnChanged',
}

export interface QualityLevel {
  selected: boolean,
  index: number,
  name: string,
  bitrate: number
}

function createLevelsFromHls (hls: Hls): QualityLevel[] {
  const levels: { [key: string]: QualityLevel } = {}
  hls.levels.forEach((item: Hls.Level, index) => {
    if (!('height' in item)) return
    const name = item.name ? item.name : Math.min(item.width, item.height) + 'P'
    if (levels[name] && levels[name].bitrate > item.bitrate) return
    levels[name] = {
      selected: false,
      name,
      index,
      bitrate: item.bitrate,
    }
  })
  return Object.values(levels)
}

function createLevelsFromDash (dash: dashjs.MediaPlayerClass): QualityLevel[] {
  const levels: { [key: string]: QualityLevel } = {}
  const list = dash.getBitrateInfoListFor('video')
  list.forEach((item: dashjs.BitrateInfo, index) => {
    if (!('height' in item)) return
    const name = Math.min(item.width, item.height) + 'P'
    if (levels[name] && levels[name].bitrate > item.bitrate) return
    levels[name] = {
      selected: false,
      name,
      index: item.qualityIndex,
      bitrate: item.bitrate,
    }
  })
  return Object.values(levels)
}

export class QualityLevelAdapter extends EventEmitter {
  static Events = AdapterEvents
  private hls?: Hls
  private dash?: dashjs.MediaPlayerClass
  private _level!: QualityLevel

  get currentLevel () {
    return this._level
  }

  constructor () {
    super()
    console.log('event', QualityLevelAdapter.Events)
  }

  useHls (hls: Hls) {
    this.hls = hls
    this.dash = undefined

    hls.on(Hls.Events.LEVEL_LOADED, () => {
      this.emit(QualityLevelAdapter.Events.OnLoad, createLevelsFromHls(hls))
    })
  }

  useDash (dash: dashjs.MediaPlayerClass) {
    this.dash = dash
    this.hls = undefined
    dash.on('streamInitialized', () => {
      this.emit(QualityLevelAdapter.Events.OnLoad, createLevelsFromDash(dash))
    })
  }

  changeLevelTo (level: QualityLevel) {
    this._level = level
    if (this.hls) {
      this.hls.currentLevel = level.index
    } else if (this.dash) {
      console.log('dash 改变 level', level)
      const setting = this.dash.getSettings()
      if (setting.streaming && setting.streaming.abr) {
        const isAuto = level.index === -1
        if (!isAuto) {
          this.dash.setQualityFor('video', level.index)
        }
        if (setting.streaming.abr.autoSwitchBitrate) setting.streaming.abr.autoSwitchBitrate.video = isAuto
        setting.streaming.abr.limitBitrateByPortal = isAuto
      }
      this.dash.updateSettings(setting)
    }
  }
}
