<template>
  <div id="app">
    <video id="player" autoplay
           src="https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4"></video>

    <h3>功能调试区域</h3>
    <div>
      <div>
        流动 弹幕的速度
        <input v-model="flowSpeed" type="number" placeholder="速率"/>
        秒
        <button @click="setSpeed">设置</button>
      </div>
      <div>
        顶部 / 底部 弹幕的隐藏时间
        <input v-model="fadeoutSpeed" type="number" placeholder="时间"/>
        秒
        <button @click="setSpeed">设置</button>
      </div>
      <div>
        <select v-model="typeValue">
          <option :value="0">顶部</option>
          <option :value="1">流动</option>
          <option :value="2">底部</option>
        </select>
        <input v-model="danmaku" placeholder="弹幕内容" type="text"/>
        <button @click="sendDanmaku">发送弹幕</button>
      </div>
      <div>
        <input v-model="randomTime" type="number" placeholder="几秒内"/>秒内
        随机填入
        <input v-model="randomCount" type="number" placeholder="弹幕数量"/>
        条弹幕
        <button @click="sendRandomDanmaku">装填</button>
      </div>
    </div>
    <h3>Debug信息</h3>
    <pre>{{info}}</pre>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Player } from '@/player/player'
import { Danmaku, DanmakuOptions, DanmakuType } from '@/player/danamku'

let player: Player
const min = parseInt('4E00', 16)
const max = parseInt('9FA5', 16)
let updateInterval: number = -1
  @Component
export default class App extends Vue {
    private danmaku = ''
    private flowSpeed = 1
    private fadeoutSpeed = 1
    private randomCount = 100
    private randomTime = 10
    private info = ''
    private typeValue = DanmakuType.Flow

    sendDanmaku () {
      if (this.danmaku) {
        player.sendDanmaku(new Danmaku(this.danmaku, {
          type: this.typeValue, borderColor: 'white', currentTime: player.currentTime
        }))
      }
    }

    setSpeed () {
      if (player.options.danmaku) {
        player.options.danmaku.flowDuration = this.flowSpeed
        player.options.danmaku.fadeoutDuration = this.fadeoutSpeed
      }
    }

    sendRandomDanmaku () {
      const array = []
      for (let i = 0; i < this.randomCount; i++) {
        const randomTime = Math.random() * this.randomTime
        const currentTime = player.currentTime + randomTime
        const text = this.randomChinese(8)
        const randomType = [0, 1, 2].indexOf(Math.round(Math.random() * 3))
        const danmaku = new Danmaku(text, { currentTime, type: randomType })
        array.push(danmaku)
      }
      player.fillDanmakus(array)
    }

    // 随机汉字，范围16进制 4E00-9FA5
    randomChinese (count = 0) {
      count = count > 0 ? count : Math.round(Math.random() * 10)
      let str: string = ''
      for (let i = 0; i < count; i++) {
        str += '\\u' + Math.floor(Math.random() * (max - min + 1) + min)
      }
      return unescape(str.replace(/\\/g, '%'))
    }

    mounted () {
      const $e = document.getElementById('player') as HTMLVideoElement
      if ($e) {
        // 扩展按钮
        const $btn: HTMLElement = document.createElement('div')
        $btn.classList.add('extra-button')
        $btn.innerHTML = '自定义按钮1'
        $btn.onclick = () => { alert('hello world 1!') }
        const $btn2: HTMLElement = document.createElement('div')
        $btn2.classList.add('extra-button')
        $btn2.innerHTML = '自定义按钮2'
        $btn2.onclick = () => { alert('hello world 2!') }
        player = new Player($e, {
          width: 1024,
          volume: 0,
          // src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          extraButtons: [$btn, $btn2]
        })
        console.log('player 配置', player.options)
        if (player.options.danmaku) {
          this.flowSpeed = player.options.danmaku.flowDuration
          this.fadeoutSpeed = player.options.danmaku.fadeoutDuration
        }
        updateInterval = setInterval(() => {
          this.info = JSON.stringify(player.debug, null, 4)
        }, 100)
      }
    }

    beforeDestroy () {
      console.log('beforeDestroy')
      player.pause()
      clearInterval(updateInterval)
    }
}
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;

    input[type='number'] {
      width: 50px;
    }

    input[type='text'] {
      width: 150px;
    }
  }

  .extra-button {
    font-size: 1.5rem;
  }
</style>
