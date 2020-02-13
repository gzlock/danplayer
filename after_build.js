const fs = require('fs')
const path = require('path')

const version = JSON.parse(fs.readFileSync('./package.json')).version

const files = [
  './dist/danplayer.common.js',
  './dist/danplayer.common.js.map',
  './dist/danplayer.umd.js',
  './dist/danplayer.umd.js.map',
  './dist/danplayer.umd.min.js',
  './dist/danplayer.umd.min.js.map',
]
files.push(...(fs.readdirSync('./docs/js').map((p) => path.join('./docs/js', p))))
console.log('将下列文件', files)
console.log('的 {DanPlayerVersion} 替换为', version)
files.forEach((path) => {
  fs.writeFileSync(path, fs.readFileSync(path).toString('utf-8').replace(/{DanPlayerVersion}/g, version))
})
