<template>
  <div id="app">
    <video id="player" autoplay
           src="https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4"></video>
    <div>
      <div>
        <input v-model="speed" type="number" placeholder="速率"/>
        <button @click="setSpeed">设置弹幕速度</button>
      </div>
      <div>
        <input v-model="danmaku" placeholder="弹幕内容"/>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Player } from '@/player/player'
import { Danmaku } from '@/player/danamku'

let player: Player
const min = parseInt('4E00', 16)
const max = parseInt('9FA5', 16)

  @Component
export default class App extends Vue {
    private danmaku = ''
    private speed = 1
    private randomCount = 100
    private randomTime = 5

    sendDanmaku () {
      player.sendDanmaku(this.danmaku)
    }

    setSpeed () {
      player.speed(this.speed)
    }

    sendRandomDanmaku () {
      const array = []
      for (let i = 0; i < this.randomCount; i++) {
        const duration = (player.currentTime + Math.random() * this.randomTime) * 1000
        const text = this.randomChinese()
        array[i] = new Danmaku(text, { duration })
      }
      player.fillDanmakus(array)
    }

    // 随机汉字，范围16进制 4E00-9FA5
    randomChinese (count = 0) {
      count = count > 0 ? count : Math.round(Math.random() * 10) + 5
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
          src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          extraButtons: [$btn, $btn2]
        })
        console.log('player 配置', player.options)
        if (player.options.danmaku) {
          this.speed = player.danmakuLayer.option.flowDuration
        }
      }
    }

    beforeDestroy () {
      console.log('beforeDestroy')
      player.pause()
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
  }

  .extra-button {
    font-size: 1.5rem;
  }
</style>
