import { LimitType } from './player/danmaku/danmakuLayer'
<template>
  <div>
    <el-card id="app">
      <div slot="header" class="title">
        <div class="left">
          <img src="@/assets/logo.png" title="logo" alt="logo"/>
          <div class="text">DanPlayer</div>
        </div>
        <div class="right">
          <a class="el-button el-button--text" href="https://github.com/gzlock/danplayer" target="_blank">Github</a>
        </div>
      </div>
      <video id="player"
             src="https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1280_10MG.mp4">
      </video>
      <h3>功能调试区域</h3>
      <el-tabs value="player">
        <!--    播放器相关    -->
        <el-tab-pane label="播放器相关" name="player">
          <el-form size="mini" label-width="140px">
            <el-form-item label="播放器形态">
              <el-radio-group v-model="settings.live">
                <el-radio-button :label="false">普通视频</el-radio-button>
                <el-radio-button :label="true">直播</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="全屏功能">
              <el-radio-group v-model="settings.fullscreen">
                <el-radio-button :label="true">允许</el-radio-button>
                <el-radio-button :label="false">不允许</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="控制栏发弹幕功能">
              <el-radio-group v-model="settings.danmakuForm">
                <el-radio-button :label="true">开启</el-radio-button>
                <el-radio-button :label="false">关闭</el-radio-button>
              </el-radio-group>
              <div>
                关闭发弹幕的功能区域后，如果仍然需要支持观众发弹幕，则需要自行实行相关的功能
              </div>
            </el-form-item>
            <el-form-item label="音量">
              <div>
                范围 0~1
              </div>
              <el-slider v-model="settings.volume" :min="0" :max="1" :step="0.1"></el-slider>
            </el-form-item>
            <el-form-item label="颜色">
              <el-color-picker v-model="settings.color"></el-color-picker>
              <div>视频进度条滑块，音量滑块，设置选项的高亮颜色</div>
            </el-form-item>
            <el-form-item label="视频网址">
              <div>
                <el-button @click="playMp4">播放Mp4视频资源(浏览器原生支持)</el-button>
              </div>
              <div>
                <el-button @click="playHls">播放Hls视频资源(使用hls.js)</el-button>
              </div>
              <div>
                <el-button @click="playMpd">播放MPD视频资源(使用dash.js)</el-button>
              </div>
              <br>
              <el-input placeholder="输入网址" v-model="videoSrc"/>
              <el-button @click="setSrc">播放器自定义资源</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!--    弹幕相关    -->
        <el-tab-pane label="弹幕相关" name="danmaku_layer">
          <el-form size="mini" label-width="140px">
            <el-form-item label="弹幕">
              <el-radio-group v-model="settings.danmaku">
                <el-radio-button :label="true">显示</el-radio-button>
                <el-radio-button :label="false">隐藏</el-radio-button>
              </el-radio-group>
              <div>提示：弹幕的逻辑还是在运作的，只是不渲染弹幕</div>
            </el-form-item>
            <el-form-item label="弹幕显示">
              <el-radio-group v-model="settings.danmakuLimit">
                <el-radio-button label="UnLimited">不作限制</el-radio-button>
                <el-radio-button label="UnOverlap">防止重叠</el-radio-button>
                <el-radio-button label="Percent25">25%屏幕显示</el-radio-button>
                <el-radio-button label="Half">50%屏幕显示</el-radio-button>
                <el-radio-button label="Percent75">75%屏幕显示</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="流动式弹幕的时间">
              <div>以秒单位，值越大速度越慢：{{settings.flowDuration}}秒</div>
              <div>从右到左在屏幕的逗留时间，所以时间越小，弹幕的速度越快</div>
              <el-slider v-model="settings.flowDuration" :min="1" :max="20"/>
            </el-form-item>
            <el-form-item label="固定式弹幕的时间">
              <div>以秒单位：{{settings.fadeoutDuration}}秒</div>
              <el-slider v-model="settings.fadeoutDuration" :min="1" :max="20"/>
            </el-form-item>
            <el-form-item label="弹幕透明度">
              <div>范围在 0 ~ 1：{{settings.alpha}}</div>
              <el-slider v-model="settings.alpha" :min="0.1" :max="1.0" :step="0.1"/>
            </el-form-item>
            <el-form-item label="发弹幕">
              <el-select placeholder="请选择" ref="danmaku-type" :value="1">
                <el-option label="顶部" :value="0">顶部</el-option>
                <el-option label="流动" :value="1">流动</el-option>
                <el-option label="底部" :value="2">底部</el-option>
              </el-select>
              <el-input @keypress.enter="sendDanmaku" placeholder="回车发送" v-model="danmaku">
                <el-button slot="append" @click="sendDanmaku" type="primary">发送</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="发随机弹幕">
              <div style="width: 200px">
                <el-input v-model="random.timeRange"><span slot="append">秒内</span></el-input>
                <el-input v-model="random.count"><span slot="append">条弹幕</span></el-input>
              </div>
              <el-button @click="sendRandomDanmaku" type="primary">填充弹幕</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!--    事件香港    -->
        <el-tab-pane label="事件相关" name="player_event">
          <p>DanPlayer暴露了video元素(player.$video)，所以涉及到原生的视频事件需求，大家可以继续绑定到player.$video<br>例如：播放进度、音量的变化。</p>
          <p>由于"弹幕发送前"事件较为特殊，因此设置在player的参数里，请看代码：</p>
          <pre>
async function beforeSendDanmaku(danmaku){
  return true 通知player可以将这次发送的弹幕显示到屏幕上
  return false 通知player不要将这次发送的弹幕显示到屏幕上
}
new danmaku.Player({beforeSendDanmaku})
player.set({beforeSendDanmaku})
          </pre>
          <p>DanPlayer支持的事件：
          <ul>
            <li>使用player.on('事件名称',player=>void)绑定事件</li>
            <li>optionChanged：当player的options即设置改变时触发，传入当前的player实例。</li>
            <li>toggleFullscreen：当player切换全屏状态时触发，并传入当前的player实例<br>可以使用player.isFullScreen查询是否处于全屏状态。</li>
          </ul>
          </p>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <div class="debug-info">
      <h3>
        Debug信息
      </h3>
      <pre></pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Player } from '@/player/player'
import { Danmaku } from '@/player/danmaku/danmaku'
import { LimitType } from './player/danmaku/danmakuLayer'

let player: Player
const min = parseInt('4E00', 16)
const max = parseInt('9FA5', 16)
let updateInterval: number = -1

  @Component
export default class App extends Vue {
    private settings = {
      danmaku: true,
      danmakuForm: true,
      flowDuration: 1,
      fadeoutDuration: 1,
      volume: 0.7,
      alpha: 1,
      live: false,
      color: '',
      fullscreen: true,
      danmakuLimit: Object.keys(LimitType)[0]
    }
    private danmaku = ''
    private videoSrc = ''
    private random = { count: 100, timeRange: 10 }

    sendDanmaku () {
      const $danmakuType = this.$refs['danmaku-type'] as HTMLInputElement
      if (this.danmaku) {
        player.sendDanmaku(new Danmaku(this.danmaku, {
          type: Number($danmakuType.value),
          borderColor: 'white',
          currentTime: player.currentTime,
          id: 'myself'
        }))
      }
    }

    @Watch('settings', { deep: true })
    formChanged () {
      player.set({
        color: this.settings.color,
        fullScreen: this.settings.fullscreen,
        danmakuForm: this.settings.danmakuForm,
        live: this.settings.live,
        volume: this.settings.volume,
        danmaku: {
          alpha: this.settings.alpha,
          fadeoutDuration: this.settings.fadeoutDuration,
          flowDuration: this.settings.flowDuration,
          enable: this.settings.danmaku,
          limit: LimitType[this.settings.danmakuLimit]
        }
      })
    }

    setSrc () {
      if (this.videoSrc) {
        player.set({ live: this.settings.live, src: this.videoSrc })
      }
    }

    playMp4 () {
      player.set({ src: 'https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1280_10MG.mp4' })
    }

    playMpd () {
      player.set({ src: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd' })
    }

    playHls () {
      player.set({ src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' })
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
          // live: true,
          color: '#f1f0cf',
          width: 600,
          volume: 0.7,
          danmaku: {
            contextMenu: (danmaku: Danmaku) => {
              const items: any = {}
              if (danmaku.id === 'myself') { // 自己的弹幕
                items['撤回'] = () => {
                  alert('弹幕内容：' + danmaku.text)
                }
              } else { // 别人的弹幕
                items['举报'] = () => {
                  alert('举报内容：' + danmaku.text)
                }
              }
              return items
            }
          }
        })
        console.log('player 配置', player.options)
        // 扩展按钮
        player.set({ extraButtons: { '扩展按钮': () => alert('扩展按钮') } })
        this.settings.flowDuration = player.options.danmaku.flowDuration
        this.settings.fadeoutDuration = player.options.danmaku.fadeoutDuration
        this.settings.alpha = player.options.danmaku.alpha
        this.settings.color = player.options.color
        this.settings.volume = player.options.volume
        this.settings.danmakuLimit = Object.keys(LimitType)[Object.values(LimitType).indexOf(player.options.danmaku.limit)]

        const $debug = document.querySelector('.debug-info pre') as HTMLPreElement
        updateInterval = setInterval(() => {
          $debug.innerText = JSON.stringify(player.debug, null, 2)
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

    .title {
      display: flex;
      justify-content: space-between;

      .left {
        display: flex;

        img {
          height: 50px;
        }

        .text {
          display: inline-block;
          margin-left: 20px;
          font-size: 40px;
          font-weight: 100;
          line-height: 50px;
        }
      }

      .right {
      }
    }

  }

  .extra-button {
    font-size: 1.5rem;
  }

  .debug-info {
    position: fixed;
    right: 0;
    bottom: 0;
    background: #e7e7e7;
    overflow: auto;
    width: 300px;
  }
</style>
