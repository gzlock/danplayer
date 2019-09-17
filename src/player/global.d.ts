/// <reference path="dashjs.d.ts">
import * as Hls from 'hls.js'
// import * as dashjs from 'dashjs'

declare global {
  const Hls: typeof Hls // eslint-disable-line
  // @ts-ignore
  const dashjs: typeof dashjs // eslint-disable-line
}
