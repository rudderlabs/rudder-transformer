#!/usr/bin/env bash

set -e

# Build Node.js memory arguments
NODE_ARGS="--no-node-snapshot"

if [ -n "$UT_MAX_SEMI_SPACE_SIZE" ]; then
  NODE_ARGS="$NODE_ARGS --max-semi-space-size=$UT_MAX_SEMI_SPACE_SIZE"
fi

if [ -n "$UT_MAX_OLD_SPACE_SIZE" ]; then
  NODE_ARGS="$NODE_ARGS --max-old-space-size=$UT_MAX_OLD_SPACE_SIZE"
fi

if [ -n "$UT_MAX_HEAP_SIZE" ]; then
  NODE_ARGS="$NODE_ARGS --max-heap-size=$UT_MAX_HEAP_SIZE"
fi

if [ -n "$UT_PROF" ]; then
  NODE_ARGS="$NODE_ARGS --prof --no-logfile-per-isolate --logfile=/home/node/app/prof-$UT_PROF.log"
fi

echo "Running with node version: $(node --version)"
echo "Starting WebServer with arguments: $NODE_ARGS"

if [ -n "$UT_PERF" ]; then
  echo "Starting with perf profiling enabled"
  cd dist
  perf record -o /home/node/app/perf-$UT_PERF.log -g -F 99 --no-inherit -- node $NODE_ARGS ./src/index.js
  cd ..
else
  cd dist && NODE_OPTIONS="--no-node-snapshot" node $NODE_ARGS ./src/index.js && cd ..
fi
