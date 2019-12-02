import { expect } from 'chai'
import { SecondsToString } from '../../src/player/utils'

describe('时间格式化测试', () => {
  it('0秒等于00:00', async () => {
    const str = SecondsToString(0)
    expect(str).eq('00:00')
  })
  it('1秒等于00:01', async () => {
    const str = SecondsToString(1)
    expect(str).eq('00:01')
  })
  it('355秒等于05:55', async () => {
    const str = SecondsToString(355)
    expect(str).eq('05:55')
  })
  // 6小时
  const seconds = 6 * 3600 + 11
  it(`${seconds}秒等于360:11`, async () => {
    const str = SecondsToString(seconds)
    expect(str).eq('360:11')
  })
})
