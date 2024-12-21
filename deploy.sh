#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 构建
npm run build

# 进入构建输出目录
cd dist

git init
git add -A
git commit -m 'deploy'

# 使用 HTTPS URL 并确保分支名称正确
git push -f https://github.com/helpfulcraft/helpfulcraft.github.io.git main:main

cd -