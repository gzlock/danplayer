import { expect } from 'chai'

import { SecondsToString } from '../../src/player/utils'

describe('时间格式化测试', () => {
  it('0秒等于00:00:00', async () => {
    const str = SecondsToString(0, undefined)
    expect(str).eq('00:00:00')
  })
  it('0秒等于0:0:0', async () => {
    expect(SecondsToString(0, 'h:m:s')).eq('0:0:0')
  })
  it('1秒等于00:00:01', async () => {
    expect(SecondsToString(1, undefined)).eq('00:00:01')
  })
  it('355秒', async () => {
    expect(SecondsToString(355, 'm:s')).eq('5:55')
    expect(SecondsToString(355, 'mm:s')).eq('05:55')
    expect(SecondsToString(355, 'h:mm:s')).eq('0:05:55')
    expect(SecondsToString(355, 'hh:mm:s')).eq('00:05:55')
    expect(SecondsToString(355, 's')).eq('355')
  })

  it('6小时1秒', async () => {
    const seconds = 6 * 3600 + 1
    expect(SecondsToString(seconds)).eq('06:00:01')
    expect(SecondsToString(seconds, 'm:ss')).eq('360:01')
    expect(SecondsToString(seconds, 'mm:s')).eq('360:1')
    expect(SecondsToString(seconds, 's')).eq(seconds.toString())
  })

  // 2小时5分钟1秒
  it('2小时5分1秒', async () => {
    const seconds = 2 * 3600 + 5 * 60 + 1
    expect(SecondsToString(seconds, 'hh:ss')).eq('02:301')
    expect(SecondsToString(seconds, 'm:ss')).eq('125:01')
    expect(SecondsToString(seconds, 'm:s')).eq('125:1')
    expect(SecondsToString(seconds, 's')).eq(seconds.toString())
  })
})
