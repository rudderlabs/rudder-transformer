#!/usr/bin/env bash

set -e

# Build Node.js memory arguments
NODE_APP=/home/node/app
PROFILES=$NODE_APP/profiles
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
  mkdir -p $PROFILES/prof/$UT_PROF
  #--no-logfile-per-isolate
  NODE_ARGS="$NODE_ARGS --prof --logfile=$PROFILES/prof/$UT_PROF/prof.log"
fi

if [ -n "$UT_CPU_PROF" ]; then
  mkdir -p $PROFILES/cpuprof/$UT_CPU_PROF
  NODE_ARGS="$NODE_ARGS --cpu-prof --cpu-prof-dir=$PROFILES/cpuprof/$UT_CPU_PROF"
fi

if [ -n "$UT_TRACE_SYNC_IO" ]; then
  NODE_ARGS="$NODE_ARGS --trace-sync-io"
fi

echo "Running with node version: $(node --version)"
echo "Starting WebServer with arguments: $NODE_ARGS"

cd dist

if [ -n "$UT_PERF" ]; then
  echo "Starting with perf profiling enabled"
  perf record -o $PROFILES/perf/$UT_PERF/perf.log -g -F 99 --no-inherit -- node $NODE_ARGS ./src/index.js
else
  node $NODE_ARGS ./src/index.js
fi
