#!/bin/bash

# 1. Start the Node.js server in the background
node ./src/index.js &
NODE_PID=$!

# 2. Wait for server to be up (max 10s)
timeout=10
echo "Waiting for server to be healthy at http://localhost:9090/health ..."
for i in $(seq 1 $timeout); do
  if curl -sf http://localhost:9090/health > /dev/null; then
    echo "Server is healthy!"
    break
  fi
  sleep 1
done

if ! curl -sf http://localhost:9090/health > /dev/null; then
  echo "Server did not become healthy within $timeout seconds."
  kill $NODE_PID
  exit 1
fi

# 3. Kill the node server with SIGINT
kill -SIGINT $NODE_PID

# 4. Wait until /health no longer responds, up to 10 seconds
echo "Waiting for server to stop..."
stoptimeout=10
for i in $(seq 1 $stoptimeout); do
  if ! curl -sf http://localhost:9090/health > /dev/null; then
    echo "Server has stopped."
    exit 0
  fi
  sleep 1
done

echo "Server did not stop within $stoptimeout seconds."
exit 1