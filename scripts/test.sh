#!/usr/bin/env bash
# 类型检查 + 逻辑测试，日志输出到 logs/test.log。
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p logs
npm test 2>&1 | tee logs/test.log
