<template>
    <div>
        <el-card id="app">
            <!--   标题   -->
            <div slot="header" class="title">
                <div class="left">
                    <img src="@/assets/logo.png" title="logo" alt="logo"/>
                    <div class="text">DanPlayer v{DanPlayerVersion}</div>
                </div>
                <div class="right">
                    <el-link type="primary" href="https://github.com/gzlock/danplayer" target="_blank">Github</el-link>
                    <el-link href="https://github.com/gzlock/danplayer/blob/master/src/App.vue" target="_blank">本页代码
                    </el-link>
                </div>
            </div>

            <div id="player"></div>

            <h3>功能调试区域</h3>
            <el-tabs value="player">
                <!--    播放器相关    -->
                <el-tab-pane label="播放器相关" name="player">
                    <el-form size="mini" label-width="140px">
                        <el-form-item label="Player Language">
                            <el-radio-group v-model="settings.isChinese">
                                <el-radio-button :label="true">中文</el-radio-button>
                                <el-radio-button :label="false">English</el-radio-button>
                            </el-radio-group>
                        </el-form-item>
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
                            <el-input placeholder="输入网址" v-model="form.videoSrc"/>
                            <el-button @click="setSrc">播放器自定义资源</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <!--    弹幕相关    -->
                <el-tab-pane label="弹幕相关" name="danmaku_layer">
                    <el-form size="mini" label-width="140px">
                        <el-form-item label="弹幕">
                            <el-radio-group v-model="settings.danmaku">
                                <el-radio-button :label="true">启用</el-radio-button>
                                <el-radio-button :label="false">禁用</el-radio-button>
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
                            <el-radio-group v-model="form.type" ref="danmaku-type">
                                <el-radio-button :label="0">顶部</el-radio-button>
                                <el-radio-button :label="1">流动</el-radio-button>
                                <el-radio-button :label="2">底部</el-radio-button>
                            </el-radio-group>
                            <el-input @keypress.enter="sendDanmaku" placeholder="回车发送" v-model="form.danmaku">
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
                <!--    事件相关    -->
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
                    <div>DanPlayer支持的事件：
                        <ul>
                            <li>使用player.on('事件名称',player=>void)绑定事件</li>
                            <li>optionChanged：当player的options即设置改变时触发，传入当前的player实例。</li>
                            <li>toggleFullscreen：当player切换全屏状态时触发，并传入当前的player实例<br>可以使用player.isFullScreen查询是否处于全屏状态。
                            </li>
                        </ul>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <div class="debug-info">
            <div>
                <el-checkbox v-model="debug">Debug信息</el-checkbox>
            </div>
            <pre></pre>
        </div>
    </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'
  import { ForceUse, Player } from '@/player/player'
  import { Danmaku } from '@/player/danmaku/danmaku'
  import { LimitType } from './player/danmaku/danmakuLayer'
  import { UiString } from './player'

  let player: Player
  let updateInterval

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
      danmakuLimit: Object.keys(LimitType)[0],
      isChinese: true,
    }

    private random = { count: 100, timeRange: 10 }
    private form = { type: 1, danmaku: '', videoSrc: '' }
    private debug = false

    sendDanmaku () {
      if (this.form.danmaku) {
        player.sendDanmaku(new Danmaku(this.form.danmaku, {
          type: Number(this.form.type),
          borderColor: 'red',
          currentTime: player.currentTime,
          id: 'myself',
        }))
      }
    }

    @Watch('settings', { deep: true })
    formChanged () {
      const ui = this.settings.isChinese ? new UiString() : {
        volume: 'Volume',
        live: 'Live',
        play: 'Play',
        pause: 'Pause',
        copy: 'Copy',
        danmakuSend: 'Send',
        danmakuInputHint: 'Input Danmaku Content',
        autoQualitySelect: 'Auto',
        danmakuType: 'Type',
        danmakuColor: 'Color',
        danmakuTypeFlow: 'Flow',
        danmakuTypeTopFixed: 'Top',
        danmakuTypeBottomFixed: 'Bottom',
        fullscreen: 'Fullscreen',
        cancelFullscreen: 'Cancel Fullscreen',
        showDanmaku: 'Show Danmaku',
        hideDanmaku: 'Hide Danmaku',
        loading: 'Loading',
      }
      player.set({
        color: this.settings.color,
        fullScreen: this.settings.fullscreen,
        danmakuForm: this.settings.danmakuForm,
        live: this.settings.live,
        volume: this.settings.volume,
        ui,
        danmaku: {
          alpha: this.settings.alpha,
          fadeoutDuration: this.settings.fadeoutDuration,
          flowDuration: this.settings.flowDuration,
          enable: this.settings.danmaku,
          limit: LimitType[this.settings.danmakuLimit],
        },
      })
    }

    @Watch('form.type')
    formType () {
      console.log(this.form)
    }

    @Watch('debug')
    debugSwitch () {
      const $debug = document.querySelector('.debug-info pre') as HTMLPreElement
      if (this.debug) {
        updateInterval = setInterval(() => {
          $debug.innerText = JSON.stringify(player.debug, null, 2)
        }, 100)
      } else {
        clearInterval(updateInterval)
        $debug.innerText = ''
      }
    }

    setSrc () {
      if (this.form.videoSrc) {
        player.set({ live: this.settings.live, src: this.form.videoSrc })
      }
    }

    playMp4 () {
      player.set({ src: 'https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1280_10MG.mp4' })
    }

    playMpd () {
      player.set({ src: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd' })
    }

    playHls () {
      player.set({ src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', forceUse: ForceUse.Hls })
    }

    sendRandomDanmaku () {
      const array = []
      for (let i = 0; i < this.random.count; i++) {
        const randomTime = Math.random() * this.random.timeRange
        const currentTime = player.currentTime + randomTime
        const randomType = [0, 1, 2].indexOf(Math.round(Math.random() * 3))
        const danmaku = new Danmaku('弹幕 ' + i, { currentTime, type: randomType })
        array.push(danmaku)
      }
      player.fillDanmakus(array)
    }

    mounted () {
      const $e = document.getElementById('player') as HTMLVideoElement
      if ($e) {
        player = new Player($e, {
          src: 'https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1280_10MG.mp4',
          color: '#ea3bf1',
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
            },
          },
          async beforeSendDanmaku (danmaku) {
            danmaku.id = 'myself'
            return true
          },
        })
        // 扩展按钮
        player.set({ extraButtons: { 扩展按钮: () => alert('点击了扩展按钮') } })
        this.settings.flowDuration = player.options.danmaku.flowDuration
        this.settings.fadeoutDuration = player.options.danmaku.fadeoutDuration
        this.settings.alpha = player.options.danmaku.alpha
        this.settings.color = player.options.color
        this.settings.volume = player.options.volume
        this.settings.danmakuLimit = Object.keys(LimitType)[Object.values(LimitType).indexOf(player.options.danmaku.limit)]

        window.player = player
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
        max-width: 800px;
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
                display: flex;
                flex-wrap: wrap;

                .el-link + .el-link {
                    margin-left: 20px;
                }
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
        padding: 4px;
        background: #e7e7e7;
        overflow: auto;
        max-width: 100vw;
        z-index: 999;
    }
</style>
