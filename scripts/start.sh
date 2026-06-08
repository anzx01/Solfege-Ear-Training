#!/usr/bin/env bash
# 启动生产服务器（后台运行），日志统一输出到 logs/。
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p logs

if [ -f logs/start.pid ] && kill -0 "$(cat logs/start.pid)" 2>/dev/null; then
  echo "production server already running (pid $(cat logs/start.pid))"
  exit 0
fi

npm run start >logs/start.out.log 2>logs/start.err.log &
echo $! >logs/start.pid
echo "next start launched, pid $(cat logs/start.pid), logs: logs/start.out.log"
