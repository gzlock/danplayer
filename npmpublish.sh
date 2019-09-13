#!/bin/bash

echo "publish to npm, version:$1"

cd ./dist/

rm demo.html

cp ../src/player/danplayer.d.ts ./
cp ../src/player/global.d.ts ./

npm init --yes

yarn add -g json

json -I -f package.json -e \
"this.author='gzlock <gzlock88@gmail.com>'
this.name='danplayer'
this.version='$1'
this.types='danplayer.d.ts'
this.license='MIT'
delete this.scripts
this.devDependencies={
'@types/hls.js': '^0.12.4',
'hls.js': '^0.12.4',
'dashjs': '^3.0.0',
}
"

echo "# Danplayer
### [Github Project HomePage](https://github.com/gzlock/danplayer)
### [Demo page](https://gzlock.github.io/danplayer)
" > readme.md

#npm publish
