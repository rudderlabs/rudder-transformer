#!/usr/bin/env bash

set -e

# Build Node.js memory arguments
NODE_ARGS=""

if [ -n "$UT_MAX_SEMI_SPACE_SIZE" ]; then
  NODE_ARGS="$NODE_ARGS --max-semi-space-size=$UT_MAX_SEMI_SPACE_SIZE"
fi

if [ -n "$UT_MAX_OLD_SPACE_SIZE" ]; then
  NODE_ARGS="$NODE_ARGS --max-old-space-size=$UT_MAX_OLD_SPACE_SIZE"
fi

if [ -n "$UT_MAX_HEAP_SIZE" ]; then
  NODE_ARGS="$NODE_ARGS --max-heap-size=$UT_MAX_HEAP_SIZE"
fi

echo "Starting WebServer with arguments: $NODE_ARGS"
cd dist && NODE_OPTIONS="--no-node-snapshot" node $NODE_ARGS ./src/index.js && cd ..
