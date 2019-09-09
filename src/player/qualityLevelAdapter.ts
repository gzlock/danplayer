import { EventEmitter } from 'eventemitter3'

const AdapterEvents = {
  OnLoad: 'OnLoaded',
  OnChanged: 'OnChanged'
}

interface OnLoadEvent {
  type: string,
  levels: QualityLevel[]
}

interface OnChangedEvent {
  type: string,
  level: QualityLevel
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
    const name = item.height + 'p'
    if (levels[name] && levels[name].bitrate > item.bitrate) return
    levels[name] = {
      selected: false,
      name,
      index: item.level as number,
      bitrate: item.bitrate
    }
  })
  return Object.values(levels)
}

function createLevelsFromDash (dash: dashjs.MediaPlayerClass): QualityLevel[] {
  const levels: { [key: string]: QualityLevel } = {}
  const list = dash.getBitrateInfoListFor('video')
  list.forEach((item: dashjs.BitrateInfo, index) => {
    const name = item.height + 'p'
    if (levels[name] && levels[name].bitrate > item.bitrate) return
    levels[name] = {
      selected: false,
      name,
      index: item.qualityIndex,
      bitrate: item.bitrate
    }
  })
  return Object.values(levels)
}

export class QualityLevelAdapter extends EventEmitter {
  static Events = AdapterEvents
  private hls?: Hls
  private dash?: dashjs.MediaPlayerClass

  constructor () {
    super()
    console.log('event', QualityLevelAdapter.Events)
  }

  useHls (hls: Hls) {
    this.hls = hls

    hls.on(Hls.Events.LEVEL_LOADED, () => {
      this.emit(QualityLevelAdapter.Events.OnLoad, createLevelsFromHls(hls))
    })
  }

  useDash (dash: dashjs.MediaPlayerClass) {
    this.dash = dash
    dash.on('streamInitialized', () => {
      this.emit(QualityLevelAdapter.Events.OnLoad, createLevelsFromDash(dash))
    })
  }

  trigger (event: string, ...data: Array<any>) {
    this.emit(event, event, ...data)
  }
}
