#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 构建
npm run build

# 进入构建输出目录
cd dist

# 初始化 git
git init

# 添加所有文件
git add -A

# 提交
git commit -m 'deploy'

# 推送到 master 分支（注意：这里使用 master 而不是 main）
git push -f https://github.com/helpfulcraft/helpfulcraft.github.io.git master:master

cd -