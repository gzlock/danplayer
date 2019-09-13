#!/bin/bash

echo "publish to npm, version:$1"

cd ./dist/

rm demo.html

cp ../src/player/danplayer.d.ts ./

npm init --yes

json -I -f package.json -e \
"this.author='gzlock <gzlock88@gmail.com>';
this.name='danplayer';
this.version='$1';
this.types='danplayer.d.ts';
this.license='MIT'
delete this.scripts
"

