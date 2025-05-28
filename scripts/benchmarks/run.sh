#!/usr/bin/env bash

set -euo pipefail

if ! command -v yq &> /dev/null
then
    echo "yq CLI is needed but not installed. Install it first. (https://github.com/mikefarah/yq)"
    exit 1
fi

CONFIG=${1:-config.yaml}

TEST_COUNT=$(yq '.tests | length' "$CONFIG")

# Array of optional UT environment variables
OPTIONAL_VARS=(
    "UT_IMAGE"
    "UT_PROF"
    "UT_CPU_PROF"
    "UT_PERF"
    "UT_TRACE_SYNC_IO"
    "UT_MAX_SEMI_SPACE_SIZE"
    "UT_MAX_OLD_SPACE_SIZE"
    "UT_MAX_HEAP_SIZE"
    "UT_NUM_PROCS"
    "UT_MAX_THREADS"
    "UT_MIN_THREADS"
    "UT_WORKER_IDLE_TIMEOUT"
    "UT_CONCURRENT_TASKS_PER_WORKER"
    "UT_TRANSFORMATION"
    "UT_POOLING"
    "UT_USE_ATOMICS"
    "UT_IVM_MEMORY"
    "UT_USE_EXPRESS"
    "UT_USE_KOA"
    "UT_SHARE_ISOLATE"
    "UT_IVM_CACHE"

    "RL_MODE"
    "RL_BATCH_SIZES"
    "RL_COMPRESSION"
)

# Get the image values from config
RL_IMAGE=$(yq -r '.rl_image // "fracasula/rudder-load:latest"' "$CONFIG")
STATS_COLLECTION_INTERVAL=$(yq '.stats_collection_interval' "$1")
DURATION_SECS=$(yq '.duration_seconds' "$1")

# Ensure test-results and profiles directories exist
mkdir -p ./test-results/profiles/prof/default
mkdir -p ./test-results/profiles/cpuprof/default
mkdir -p ./test-results/profiles/perf/default
mkdir -p ./test-results/profiles/tracesyncio/default

for ((i=0; i<TEST_COUNT; i++)); do
    # Reset values for each test
    UT_PROF_VALUE=""
    UT_TRACE_SYNC_IO=""

    NAME=$(yq -r ".tests[$i].name" "$1")
    echo "Starting test: $NAME"
    docker-compose -f bench-compose.yml down

    # Build docker-compose command
    CMD="RL_IMAGE=$RL_IMAGE"

    # Add all optional variables to command
    for VAR in "${OPTIONAL_VARS[@]}"; do
        # Check if the variable exists in the config
        VALUE=$(yq -r ".tests[$i].$VAR" "$CONFIG")
        # If value is not empty or it's "false", add it to the command
        # This handles both missing variables and explicitly set "false" variables
        if [[ -n "$VALUE" && "$VALUE" != "null" ]]; then
            CMD="$CMD $VAR=$VALUE"
            if [[ "$VAR" == "UT_PROF" ]]; then
                mkdir -p ./test-results/profiles/prof/$VALUE
                rm -f ./test-results/profiles/prof/$VALUE/*
                # Save the UT_PROF value for later processing
                UT_PROF_VALUE=$VALUE
            elif [[ "$VAR" == "UT_CPU_PROF" ]]; then
                mkdir -p ./test-results/profiles/cpuprof/$VALUE
                rm -f ./test-results/profiles/cpuprof/$VALUE/*
            elif [[ "$VAR" == "UT_PERF" ]]; then
                mkdir -p ./test-results/profiles/perf/$VALUE
                rm -f ./test-results/profiles/perf/$VALUE/*
            elif [[ "$VAR" == "UT_TRACE_SYNC_IO" ]]; then
                mkdir -p ./test-results/profiles/tracesyncio/$VALUE
                rm -f ./test-results/profiles/tracesyncio/$VALUE/*
                UT_TRACE_SYNC_IO=./test-results/profiles/tracesyncio/$VALUE/trace.log
                echo "Trace Sync IO activated. Output will be saved into $UT_TRACE_SYNC_IO"
            fi
        fi
    done

    # Complete the command
    CMD="$CMD docker-compose -f bench-compose.yml up -d --build"

    # Print the command for debugging
    echo "Executing: $CMD"

    # Execute the command
    eval "$CMD"

    echo "Waiting a bit for containers to be ready..."
    sleep 15 # TODO replace this with a call to the health endpoint of the user transformer

    if [[ -n "${UT_TRACE_SYNC_IO:-}" ]]; then
        docker logs user-transformer -f > "$UT_TRACE_SYNC_IO" 2>&1 &
    fi

    echo "Collecting stats (duration: ${DURATION_SECS}s) into ${NAME}-stats.csv"
    export INTERVAL=${STATS_COLLECTION_INTERVAL};
    export OUTFILE=./test-results/"${NAME}"-stats.csv;
    timeout ${DURATION_SECS} ./scripts/benchmarks/collect-stats.sh || true

    echo "Test $NAME completed. Stopping containers..."
    mkdir -p ./test-results/logs
    docker logs user-transformer &> ./test-results/logs/${NAME}.log
    # Kill the node process in user-transformer container
    docker exec user-transformer kill $(docker exec user-transformer ps aux | grep "node.*index\.js" | head -n 1 | awk '{print $1}') || true
    docker stop rudder-load || true
    sleep 5 # to give time for profiling files to be created

    # Process profiling files if UT_PROF was set
    if [[ -n "${UT_PROF_VALUE:-}" ]]; then
        echo "Processing V8 profiling files in ./test-results/profiles/prof/$UT_PROF_VALUE/"
        PROFILE_DIR="./test-results/profiles/prof/$UT_PROF_VALUE"

        # Count total files to process more efficiently (only .log files)
        total_files=$(ls -lah "$PROFILE_DIR" | grep "isolate-.*\.log" | wc -l)

        echo "Detected a total of $total_files profile files..."

        # Process each log file with node --prof-process
        current_file=0
        for file in "$PROFILE_DIR"/isolate-*.log; do
            if [[ -f "$file" ]]; then
                # Increment counter and calculate percentage
                current_file=$((current_file+1))
                percentage=$((current_file * 100 / total_files))

                # Use --no-warnings to suppress the ExperimentalWarning
                node --no-warnings --prof-process $file > ${file}-v8.txt

                # Print progress on the same line
                printf "\rProcessing files: %d%% complete (%d/%d)" "$percentage" "$current_file" "$total_files"
            fi
        done

        # Print newline after progress is complete
        echo ""

        # Combine all processed files into one
        cat "$PROFILE_DIR"/isolate-*.log-v8.txt > "$PROFILE_DIR/combined-profile.txt"

        # Clean up individual files, keeping only the combined profile
        rm -f "$PROFILE_DIR"/isolate-*.log "$PROFILE_DIR"/isolate-*.log-v8.txt

        echo "V8 profiling files processed and combined into $PROFILE_DIR/combined-profile.txt"
    fi

    docker-compose -f bench-compose.yml down || true
done

make report > ./test-results/${DURATION_SECS}s-report.txt
