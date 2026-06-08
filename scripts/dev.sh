#!/usr/bin/env bash
# 启动开发服务器（后台运行），日志统一输出到 logs/。
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p logs

if [ -f logs/dev.pid ] && kill -0 "$(cat logs/dev.pid)" 2>/dev/null; then
  echo "dev server already running (pid $(cat logs/dev.pid))"
  exit 0
fi

npm run dev >logs/dev.out.log 2>logs/dev.err.log &
echo $! >logs/dev.pid
echo "next dev started, pid $(cat logs/dev.pid), logs: logs/dev.out.log"
