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


rm -rf ./ts_out
tsc
cd ./ts_out

npm init --yes

npm install -g json

json -I -f package.json -e \
"this.author='gzlock <gzlock88@gmail.com>'
this.name='danplayer'
this.main='index.js'
this.version='$TRAVIS_TAG'
this.types='index.d.ts'
this.license='MIT'
delete this.scripts"
#this.dependencies={
#'@types/hls.js': '^0.12.4',
#'hls.js': '^0.12.4',
#}
#"

echo "# Danplayer v$TRAVIS_TAG
### [Github Project HomePage](https://github.com/gzlock/danplayer)
### [Demo page](https://gzlock.github.io/danplayer)
" > readme.md

echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc

npm publish
