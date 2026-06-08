#!/usr/bin/env bash
# 生产构建，日志输出到 logs/build.log。
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p logs
npm run build 2>&1 | tee logs/build.log
