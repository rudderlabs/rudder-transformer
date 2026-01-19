#!/bin/bash
set -e

# Usage:
#   ./benchmark.sh              # defaults to MODE=simple
#   MODE=stress ./benchmark.sh  # stress mode (constant 200 rps)
#   MODE=exhaust ./benchmark.sh    # exhaust mode (2m)
#
# Produces: results_<scenario>_<mode>.json

MODE="${MODE:-simple}"

# Function to kill server on ports
kill_server() {
  lsof -t -i:9091 | xargs kill -9 2>/dev/null || true
  lsof -t -i:9190 | xargs kill -9 2>/dev/null || true
}

# Function to run benchmark
run_benchmark() {
  SCENARIO=$1
  echo "========================================"
  echo "Running Benchmark: $SCENARIO (MODE=$MODE)"
  echo "========================================"

  kill_server

  # Start Server (Background)
  echo "Starting Server..."
  TRANSFORMER_TEST_MODE=true npm run start:dev > /dev/null 2>&1 &

  # Wait for server to be ready
  echo "Waiting 10s for server..."
  sleep 10s

  # Run k6
  echo "Running k6..."
  OUTFILE="results_${SCENARIO}_${MODE}.json"
  rm -f "$OUTFILE"

  # Run k6 and ignore exit code to ensure we proceed to comparison even if one fails thresholds
  k6 run -e SCENARIO="$SCENARIO" -e MODE="$MODE" loadtest.js --summary-export="$OUTFILE" || true

  # Kill Server
  echo "Stopping Server..."
  kill_server
  echo "Run Complete."
  sleep 2s
}

# Run all 3
run_benchmark "new"
run_benchmark "legacy"

echo ""
echo "========================================"
echo "       BENCHMARK RESULTS (MODE=$MODE)"
echo "========================================"
# Use node to parse JSON and print a clean markdown table
node -e '
const fs = require("fs");

const scenarios = ["legacy", "new"];
const MODE = process.env.MODE || "simple";

function fmt(n, digits = 2) {
  return (typeof n === "number") ? n.toFixed(digits) : "NA";
}

const results = {};

const printResults = (header,valueRows,result) => {
  const allRows = [header, ...valueRows,result];

  const whiteSpacePerCol = allRows.reduce((maxes, row) => {
    row.forEach((cell, colIndex) => {
      const len = String(cell).length;
      maxes[colIndex] = Math.max(maxes[colIndex] ?? 0, len);
    });
    return maxes;
  }, []);
  const printRow = (row) => {
    const text = row.map((s, i) => {
        const whitespace = whiteSpacePerCol[i] - String(s).length;
        return `${" ".repeat(Math.floor(whitespace/2))}${s}${" ".repeat(Math.ceil(whitespace/2))}`;
    }).join(" | ");
    console.log(text);
  }
allRows.forEach(row => printRow(row));
};
const valueRows = [];
scenarios.forEach(sc => {
  try {
    const file = `results_${sc}_${MODE}.json`;
    if (!fs.existsSync(file)) {
      console.log(`${sc} ${file} not found`);
      return;
    }

    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    const httpReq = data.metrics.http_req_duration;

    const metrics = {
      avg: httpReq.avg,
      med: httpReq.med,
      p90: httpReq["p(90)"],
      p95: httpReq["p(95)"],
      max: httpReq.max,
      rps: data.metrics.http_reqs?.rate,
      vusMax: (data.metrics.vus && typeof data.metrics.vus.max === "number") ? data.metrics.vus.max : null,
      dropped: data.metrics.dropped_iterations ? data.metrics.dropped_iterations.count : 0
    };
    results[sc] = metrics;
    valueRows.push([sc,...Object.values(metrics).map(v => fmt(v, 2))]);
  } catch (e) {
    console.log(`| ${sc} | ERROR | ${String(e.message).slice(0, 40)} | - | - | - | - | - |`);
  }
});

const header=["Scenario", "Average (ms)", "Median (ms)", "P90 (ms)", "P95 (ms)", "Max (ms)", " RPS ", "VUs(max)", "Dropped"];

// Calculate Comparison
if (results.legacy && results.new) {
  const diff = (n, l) => {
    if (typeof n !== "number" || typeof l !== "number" || l === 0){ return "NA";}
    const d = Math.abs(((n - l) / l) * 100);
    return d.toFixed(2) + "%";
  };

  const getWinner = (n, l, type) => {
    let winner;

    if (typeof n !== "number" || typeof l !== "number") { return "-"; }
    if (Math.abs(n - l) < 0.001) { return "Tie"; }
    if (type === "lower") { winner = n < l ? "New" : "Legacy" };
    if (type === "higher") { winner = n > l ? "New" : "Legacy" };
    const percentDiff = diff(n, l);
    return `${winner} (${percentDiff})`;
  };

  const l = results.legacy;
  const n = results.new;

  const compareValues = [
    "Winners",
    getWinner(n.avg, l.avg,"lower"),
    getWinner(n.med, l.med,"lower"),
    getWinner(n.p90, l.p90,"lower"),
    getWinner(n.p95, l.p95,"lower"),
    getWinner(n.max, l.max,"lower"),
    getWinner(n.rps, l.rps,"higher"),
    getWinner(n.vusMax, l.vusMax,"lower"),
    getWinner(n.dropped, l.dropped,"lower")
  ];
  printResults(header,valueRows,compareValues);
}


console.log("\n");
'