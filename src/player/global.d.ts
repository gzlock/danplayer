/// <reference path="dash.d.ts">
import * as Hls from 'hls.js'
// import * as dashjs from 'dashjs'

declare global {
  const Hls: typeof Hls
  const dashjs: typeof dashjs
}
