<template>
  <el-card id="app">
    <video id="player"
           src="https://api.dogecloud.com/player/get.mp4?vcode=5ac682e6f8231991&userId=17&ext=.mp4"></video>

    <h3>功能调试区域</h3>
    <el-form label-position="top">
      <el-form-item>
        <div slot="label">流动式弹幕的速度: {{form.flowDuration}} 值越大速度越慢</div>
        <el-slider v-model="flowDuration" :min="1" :max="20"/>
      </el-form-item>
      <el-form-item>
        <div slot="label">顶部 / 底部弹幕的隐藏时间: {{form.fadeoutDuration}} 秒</div>
        <el-slider v-model="form.fadeoutDuration" :min="1" :max="20"/>
      </el-form-item>
      <el-form-item label="发弹幕">
        <el-select v-model="form.type" placeholder="请选择" :value="form.type">
          <el-option label="顶部" :value="0">顶部</el-option>
          <el-option label="流动" :value="1">流动</el-option>
          <el-option label="底部" :value="2">底部</el-option>
        </el-select>
        <el-input v-model="form.danmaku" @keypress.enter.native="sendDanmaku" placeholder="回车发送">
          <el-button slot="append" @click="sendDanmaku" type="primary">发送</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="随机填充大量弹幕">
        <div>
          <el-input v-model="random.timeRange"><span slot="append">秒内</span></el-input>
          <el-input v-model="random.count"><span slot="append">条弹幕</span></el-input>
        </div>
        <el-button @click="sendRandomDanmaku" type="primary">填充弹幕！</el-button>
      </el-form-item>
    </el-form>
    <h3>Debug信息</h3>
    <pre>{{info}}</pre>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Player } from '@/player/player'
import { Danmaku } from '@/player/danmaku/danmaku'
import { MakeDanmakuLayerOptions } from '@/player/danmaku/danmakuLayer'

let player: Player
const min = parseInt('4E00', 16)
const max = parseInt('9FA5', 16)
let updateInterval: number = -1

  @Component
export default class App extends Vue {
    private form = { danmaku: '', flowDuration: 1, fadeoutDuration: 1, type: 1 }
    private random = { count: 100, timeRange: 10 }
    private info = ''

    sendDanmaku () {
      if (this.form.danmaku) {
        player.sendDanmaku(new Danmaku(this.form.danmaku, {
          type: this.form.type, borderColor: 'white', currentTime: player.currentTime
        }))
      }
    }

    get flowDuration () {
      return this.form.flowDuration
    }

    set flowDuration (val: number) {
      this.form.flowDuration = val
      player.options.danmaku.flowDuration = val
    }

    sendRandomDanmaku () {
      const array = []
      for (let i = 0; i < this.random.count; i++) {
        const randomTime = Math.random() * this.random.timeRange
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
        player = new Player($e, {
          width: 600,
          volume: 0,
          danmaku: MakeDanmakuLayerOptions({})
          // src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        })
        console.log('player 配置', player.options)
        this.form.flowDuration = player.options.danmaku.flowDuration
        this.form.fadeoutDuration = player.options.danmaku.fadeoutDuration

        updateInterval = setInterval(() => {
          this.info = JSON.stringify(player.debug, null, 2)
        }, 100)
      }
    }

    beforeDestroy () {
      console.log('beforeDestroy')
      player.destroy()
      clearInterval(updateInterval)
    }
}
</script>

<style lang="scss">
  html, body {
    padding: 0;
    margin: 0;
    height: 100vh;
    background: #2c3e50;
  }

  #app {
    color: #2c3e50;
    width: 800px;
    margin: 0 auto;
    -webkit-font-smoothing: subpixel-antialiased;

    .video-player {
      display: block;
      margin: 0 auto;
    }

    .el-slider {
      width: 150px;
    }
  }

  .extra-button {
    font-size: 1.5rem;
  }

  .el-form-item__content {
    display: flex;
    align-items: center;
  }
</style>
