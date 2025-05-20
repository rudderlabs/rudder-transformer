#!/usr/bin/env bash

set -e # stops the script immediately if a command exits with a non-zero status

# Get rudder-load container IP dynamically
RUDDER_LOAD_IP=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' rudder-load)

# Verify the IP
if [ -z "$RUDDER_LOAD_IP" ]; then
    echo "Failed to retrieve IP for rudder-load container."
    exit 1
fi

# Variables
METRICS_ENDPOINT="http://$RUDDER_LOAD_IP:9102/metrics"
INTERVAL=${INTERVAL:-5}   # in seconds, default is 5s
OUTFILE=${OUTFILE:-test-results/stats.csv}
CONTAINERS=${CONTAINERS:-user-transformer rudder-load}

# Ensure the directory exists
echo "Output file: $OUTFILE"
mkdir -p "$(dirname "$OUTFILE")"

echo "Will run with interval ${INTERVAL}..."

# Add CSV header
echo "Time,Container,CPU_Percentage,Mem_Usage,Net_IO,BLOCK_IO,Events_per_second" > "$OUTFILE"

# Infinite loop
while true; do
    # Get events per second from rudder-load metrics
    events_per_second=$(curl -s "$METRICS_ENDPOINT" | grep '^rudder_load_publish_rate_per_second' | awk '{print $2}' || echo "N/A")

    docker stats --no-stream --format "{{.Name}},{{.CPUPerc}},{{.MemUsage}},{{.NetIO}},{{.BlockIO}}" $CONTAINERS |
    while IFS= read -r line
    do
        CONTAINER=$(echo "$line" | cut -d',' -f1)
        CPU=$(echo "$line" | cut -d',' -f2)
        MEM_USAGE=$(echo "$line" | cut -d',' -f3 | awk '{print $1}')
        NET_IO=$(echo "$line" | cut -d',' -f4)
        BLOCK_IO=$(echo "$line" | cut -d',' -f5)

        # Only rudder-load container has events_per_second, other containers have N/A
        if [ "$CONTAINER" = "rudder-load" ]; then
            EVENTS_PER_SECOND="$events_per_second"
        else
            EVENTS_PER_SECOND="N/A"
        fi

        echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ"),$CONTAINER,$CPU,$MEM_USAGE,$NET_IO,$BLOCK_IO,$EVENTS_PER_SECOND" >> "$OUTFILE"
    done
    sleep "$INTERVAL"
done