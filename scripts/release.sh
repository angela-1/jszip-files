#! /bin/bash

# publish new version to npmjs

VERSION=0.0.1

yarn build

npm config set registry http://registry.npmjs.org

echo "release new version" $VERSION
npm version $VERSION --allow-same-version=true --no-git-tag-version

echo "publish..."

npm publish --access public

npm config set registry https://registry.npm.taobao.org

echo "done"