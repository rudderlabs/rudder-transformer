/* eslint-disable no-console */
const { performance } = require('perf_hooks');
// Import the util module
const { groupEventsByType } = require('./index');

/**
 * Groups events with the same message type together in batches.
 * Each batch contains events that have the same message type and are from different users.
 * @param {*} inputs - An array of events
 * @returns {*} - An array of batches
 */
const groupEventsByTypeOld = (inputs) => {
  const batches = [];
  let currentInputsArray = inputs;
  while (currentInputsArray.length > 0) {
    const remainingInputsArray = [];
    const userOrderTracker = {};
    const event = currentInputsArray.shift();
    const messageType = event.message.type;
    const batch = [event];
    currentInputsArray.forEach((currentInput) => {
      const currentMessageType = currentInput.message.type;
      const currentUser = currentInput.metadata.userId;
      if (currentMessageType === messageType && !userOrderTracker[currentUser]) {
        batch.push(currentInput);
      } else {
        remainingInputsArray.push(currentInput);
        userOrderTracker[currentUser] = true;
      }
    });
    batches.push(batch);
    currentInputsArray = remainingInputsArray;
  }

  return batches;
};

// Utility function to generate random test data
function generateTestData(count) {
  const messageTypes = ['track', 'identify', 'page', 'screen', 'group', 'alias'];
  const userIds = Array.from({ length: 20 }, (_, i) => `user-${i}`);

  return Array.from({ length: count }, () => {
    const messageType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
    const userId = userIds[Math.floor(Math.random() * userIds.length)];

    return {
      message: {
        type: messageType,
      },
      metadata: {
        userId,
        jobId: Math.floor(Math.random() * 1000),
      },
    };
  });
}

// Generate skewed data - lots of same message types and users
function generateSkewedData(count) {
  const messageTypes = ['track', 'identify'];
  const userIds = Array.from({ length: 5 }, (_, i) => `user-${i}`);

  return Array.from({ length: count }, () => {
    const messageType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
    const userId = userIds[Math.floor(Math.random() * userIds.length)];

    return {
      message: {
        type: messageType,
      },
      metadata: {
        userId,
        jobId: Math.floor(Math.random() * 1000),
      },
    };
  });
}

// Function to run a benchmark
function runBenchmark(fn, input, iterations = 5) {
  // Warm-up run
  fn([...input]);

  let result;
  const times = [];
  for (let i = 0; i < iterations; i += 1) {
    const start = performance.now();
    result = fn([...input]);
    const end = performance.now();
    times.push(end - start);

    // Print info about the result to verify correctness
    if (i === 0) {
      console.log(`${fn.name} generated ${result.length} batches`);
    }
  }

  const average = times.reduce((sum, time) => sum + time, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  return { average, min, max, times, resultLength: result.length };
}

// Run all benchmarks
function runAllBenchmarks() {
  // Generate test data once
  const testData = generateTestData(1000);

  // Run benchmarks
  console.log(`Running benchmarks with ${testData.length} messages...`);

  console.log('\nBenchmarking groupEventsByType:');
  const results = runBenchmark(groupEventsByType, testData);
  console.log(`Average time: ${results.average.toFixed(2)}ms`);
  console.log(`Min time: ${results.min.toFixed(2)}ms`);
  console.log(`Max time: ${results.max.toFixed(2)}ms`);

  console.log('\nBenchmarking groupEventsByTypeOld:');
  const v1Results = runBenchmark(groupEventsByTypeOld, testData);
  console.log(`Average time: ${v1Results.average.toFixed(2)}ms`);
  console.log(`Min time: ${v1Results.min.toFixed(2)}ms`);
  console.log(`Max time: ${v1Results.max.toFixed(2)}ms`);

  // Compare results
  const speedup = v1Results.average / results.average;
  console.log(
    `\nComparison: groupEventsByType is ${speedup.toFixed(2)}x ${speedup > 1 ? 'faster' : 'slower'} than groupEventsByTypeOld`,
  );

  // More detailed comparison with different dataset sizes
  console.log('\n\n===== Testing with different dataset sizes =====');
  [10, 100, 500, 1000, 2000, 5000].forEach((size) => {
    console.log(`\nTesting with ${size} messages:`);
    const data = generateTestData(size);

    const result = runBenchmark(groupEventsByType, data, 3);
    const v1Result = runBenchmark(groupEventsByTypeOld, data, 3);

    const speedupFactor = v1Result.average / result.average;
    console.log(
      `groupEventsByType: ${result.average.toFixed(2)}ms, groupEventsByTypeOld: ${v1Result.average.toFixed(2)}ms`,
    );
    console.log(`Speedup: ${speedupFactor.toFixed(2)}x ${speedupFactor > 1 ? 'faster' : 'slower'}`);
  });

  // Test with skewed data
  console.log('\n\n===== Testing with skewed data (fewer types, more duplicates) =====');
  const skewedData = generateSkewedData(1000);
  console.log(`\nTesting with 1000 skewed messages (fewer types, more duplicates):`);
  const skewedResult = runBenchmark(groupEventsByType, skewedData, 3);
  const v1SkewedResult = runBenchmark(groupEventsByTypeOld, skewedData, 3);

  const skewedSpeedup = v1SkewedResult.average / skewedResult.average;
  console.log(
    `groupEventsByType: ${skewedResult.average.toFixed(2)}ms, groupEventsByTypeOld: ${v1SkewedResult.average.toFixed(2)}ms`,
  );
  console.log(`Speedup: ${skewedSpeedup.toFixed(2)}x ${skewedSpeedup > 1 ? 'faster' : 'slower'}`);
}

// Run the benchmarks
runAllBenchmarks();
