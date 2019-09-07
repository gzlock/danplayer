import { expect } from 'chai'

const fontSize = 28
const window = { screen: { width: 1920, height: 1080 } }
describe('固定顶部的弹幕', () => {
  it('测试', async () => {
    // 初始化
    const lineHeight = Math.floor(fontSize * 1.2)
    const lines: { [key: string]: string | null } = {}

    let maxLine = 0
    for (; maxLine < window.screen.height; maxLine++) {
      const height = maxLine * lineHeight
      if (height > window.screen.height) break
      if (lines.hasOwnProperty(height)) continue
      lines[height] = null
    }

    expect(maxLine).to.equal(Object.keys(lines).length)
    console.log(maxLine, '行')

    let topTop = 0

    function calcTop (): number {
      return 0
    }

    for (let i = 0; i < maxLine + 10; i++) {
      let top = -1
    }
    const start = Date.now()
    await new Promise(resolve => { setTimeout(resolve, 5000) })

    console.log('结束', (Date.now() - start) / 1000)

    // 期望结果
    // expect(wrapper.text()).to.include(msg)
  })
})
