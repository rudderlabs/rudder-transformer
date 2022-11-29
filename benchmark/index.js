/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable func-names */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const Benchmark = require("benchmark-suite");
const fs = require("fs");
const path = require("path");
const Commander = require("commander");
const logger = require("./metaLogger");
const versionedRouter = require("../versionedRouter");
const cdkV2Handler = require("../cdk/v2/handler");
const { TRANSFORMER_METRIC } = require("../v0/util/constant");

const supportedDestinations = ["algolia", "pinterest_tag"];

logger.info();

const command = new Commander.Command();
command
  .allowUnknownOption()
  .option(
    "-d, --destinations <string>",
    "Enter destination names separated by comma",
    supportedDestinations.toString()
  )
  .option(
    "-bt, --benchmarktype <string>",
    "Enter the benchmark type (Operations or Memory)",
    "Operations"
  )
  .parse();

const testDataDir = path.join(__dirname, "./../__tests__/data");
const getTestData = (intgList, fileNameSuffixes) => {
  const intgTestData = {};
  intgList.forEach(intg => {
    // Use the last valid test data file
    fileNameSuffixes.forEach(fileNameSuffix => {
      try {
        intgTestData[intg] = JSON.parse(
          fs.readFileSync(
            path.join(testDataDir, `${intg}${fileNameSuffix}.json`),
            {
              encoding: "utf-8"
            }
          )
        );
      } catch (err) {
        // logger.error(
        //   `Unable to load the data for: "${intg}" suffix: "${fileNameSuffix}"`
        // );
        // logger.error(`Raw error: "${err}"`);
      }
    });
  });
  return intgTestData;
};

const cmdOpts = command.opts();

// Initialize data for destinations
const destinationsList = cmdOpts.destinations
  .split(",")
  .map(x => x.trim())
  .filter(x => x !== "");
logger.info("Destinations selected: ", destinationsList);
logger.info();
const destDataset = getTestData(destinationsList, ["_input", ""]);

const nativeDestHandlers = {};
const destCdKWorkflowEngines = {};

const benchmarkType = cmdOpts.benchmarktype.trim();

async function initializeHandlers() {
  for (const idx in destinationsList) {
    const dest = destinationsList[idx];

    // Native destination handler
    nativeDestHandlers[dest] = versionedRouter.getDestHandler(
      "v0",
      dest
    ).process;

    // Get the CDK 2.0 workflow engine instance
    destCdKWorkflowEngines[dest] = await cdkV2Handler.getWorkflowEngine(
      dest,
      TRANSFORMER_METRIC.ERROR_AT.PROC
    );
  }
}

async function runDataset(suitDesc, input, intg, params) {
  logger.info("==========================================");
  logger.info(suitDesc);
  logger.info("==========================================");

  const results = {};
  const suite = new Benchmark(suitDesc, benchmarkType);

  Object.keys(params).forEach(opName => {
    suite.add(opName, async function() {
      try {
        await params[opName].caller(
          ...params[opName].argsResolver(intg, input)
        );
      } catch (err) {
        // logger.info(err);
        // Do nothing
      }
    });
  });

  suite
    .on("cycle", function(result) {
      results[result.end.name] = { stats: result.end.stats };
    })
    .on("complete", function(result) {
      logger.info(
        benchmarkType === "Operations" ? "Fastest: " : "Memory intensive: ",
        `"${result.end.name}"`
      );
      logger.info();
      Object.keys(results).forEach(impl => {
        logger.info(`"${impl}" - `, suite.formatStats(results[impl].stats));

        if (result.end.name !== impl) {
          if (benchmarkType === "Operations") {
            logger.info(
              `-> "${result.end.name}" is faster by ${(
                result.end.stats.n /
                result.end.stats.mean /
                (results[impl].stats.n / results[impl].stats.mean)
              ).toFixed(1)} times to "${impl}"`
            );
          } else {
            logger.info(
              `-> "${result.end.name}" consumed ${(
                result.end.stats.mean / results[impl].stats.mean
              ).toFixed(1)} times memory compared to "${impl}"`
            );
          }
        }

        logger.info();
      });
    });

  await suite.run({ time: 1000 });
}

async function runIntgDataset(dataset, type, params) {
  for (const intg in dataset) {
    for (const tc in dataset[intg]) {
      const curTcData = dataset[intg][tc];
      let tcInput;
      let tcDesc;
      // New test data file structure
      if (
        "description" in curTcData &&
        "input" in curTcData &&
        "output" in curTcData
      ) {
        tcInput = curTcData.input;
        tcDesc = `${type} - ${intg} - "${curTcData.description}"`;
      } else {
        tcInput = curTcData;
        tcDesc = `${type} - ${intg} - "${tc}"`;
      }

      await runDataset(tcDesc, tcInput, intg, params);
    }
  }
}

async function run() {
  // Initialize CDK and native handlers
  await initializeHandlers();

  // Destinations
  await runIntgDataset(destDataset, "Destination", {
    native: {
      caller: versionedRouter.handleV0Destination,
      argsResolver: (intg, input) => [
        nativeDestHandlers[intg],
        intg,
        input,
        TRANSFORMER_METRIC.ERROR_AT.PROC
      ]
    },
    "CDK 2.0": {
      caller: cdkV2Handler.process,
      argsResolver: (intg, input) => [destCdKWorkflowEngines[intg], input]
    }
  });
}

// Start suites
run();
