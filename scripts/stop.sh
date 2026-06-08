#!/usr/bin/env bash
# 停止由 dev.sh / start.sh 启动的后台服务器。
set -euo pipefail
cd "$(dirname "$0")/.."

for name in dev start; do
  pidfile="logs/$name.pid"
  if [ -f "$pidfile" ]; then
    pid="$(cat "$pidfile")"
    if kill -0 "$pid" 2>/dev/null; then
      kill "$pid" && echo "stopped $name server (pid $pid)"
    fi
    rm -f "$pidfile"
  fi
done
