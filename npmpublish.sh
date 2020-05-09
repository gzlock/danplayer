#!/bin/bash

exit_script(){
    exit 0
}

if [ $TRAVIS_TAG ];then
	echo "有版本号，发布到npm：$TRAVIS_TAG"
else
	echo "没有版本号，退出脚本"
	exit_script
fi

cd ./dist


cp ../src/player/danplayer.d.ts ./
rm -r ./demo.html

npm init --yes

npm install -g json

json -I -f package.json -e \
"this.author='gzlock <gzlock88@gmail.com>'
this.name='danplayer'
this.main='danplayer.common.js'
this.version='$TRAVIS_TAG'
this.types='danplayer.d.ts'
this.license='MIT'
this.homepage='https://github.com/gzlock/danplayer'
delete this.scripts
this.dependencies={
'@types/hls.js': '^0.12.6',
'hls.js': '^0.13.2',
'dashjs': '^3.1.0',
'eventemitter3': '^4.0.0'
}
"

echo "# Danplayer v$TRAVIS_TAG
### [Github Project HomePage](https://github.com/gzlock/danplayer)
### [Document](https://github.com/gzlock/danplayer/wiki)
### [Demo page](https://gzlock.github.io/danplayer)
### [CDN](https://www.jsdelivr.com/package/npm/danplayer)
" > readme.md

if [ $NPM_TOKEN ];then
	echo "发布到npm"
  echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc
  npm publish
fi

