#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 构建
npm run build

# 进入构建输出目录
cd dist

# 删除旧的 .git 目录
rm -rf .git

# 初始化 git
git init

# 添加所有文件
git add .

# 提交
git commit -m 'deploy'

# 推送到您的仓库的 master 分支
git push -f git@github.com:helpfulcraft/helpfulcraft.github.io.git master:master

cd -