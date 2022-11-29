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
const versionedRouter = require("../versionedRouter");
const cdkV2Handler = require("../cdk/v2/handler");
const logger = require("./metaLogger");
const { TRANSFORMER_METRIC } = require("../v0/util/constant");

const command = new Commander.Command();
command
  .allowUnknownOption()
  .option(
    "-d, --destinations <string>",
    "Enter destination names separated by comma",
    "algolia,pinterest_tag"
  )
  .option("-s, --sources <string>", "Enter source names separated by comma", "")
  .parse();

const cmdOpts = command.opts();

const testDataDir = path.join(__dirname, "./../__tests__/data");
const getTestData = (intgList, fileNameSuffix) => {
  const intgTestSet = {};
  intgList.forEach(intg => {
    try {
      intgTestSet[intg] = JSON.parse(
        fs.readFileSync(
          path.join(testDataDir, `${intg}${fileNameSuffix}.json`),
          {
            encoding: "utf-8"
          }
        )
      );
    } catch (err) {
      logger.error(`Unable to load the data for: ${intg}`);
      logger.error(`Raw error: ${err}`);
    }
  });
  return intgTestSet;
};

const destinationsList = cmdOpts.destinations
  .split(",")
  .map(x => x.trim())
  .filter(x => x !== "");
logger.info("Destinations selected: ", destinationsList);
const destTestSet = getTestData(destinationsList, "_input");

const nativeDestHandlers = {};
const destCdKWorkflowEngines = {};


const sourcesList = cmdOpts.sources
  .split(",")
  .map(x => x.trim())
  .filter(x => x !== "");
logger.info("Sources selected: ", sourcesList);
const srcTestSet = getTestData(sourcesList, "_source");

async function initializeHandlers() {
  for (const idx in destinationsList) {
    const dest = destinationsList[idx];
    nativeDestHandlers[dest] = versionedRouter.getDestHandler("v0", dest);
    destCdKWorkflowEngines[dest] = await cdkV2Handler.getWorkflowEngine(
      dest,
      TRANSFORMER_METRIC.ERROR_AT.PROC
    );
  }
}

async function run() {
  await initializeHandlers();

  for (const dest in destTestSet) {
    for (const td in destTestSet[dest]) {
      const curTcData = destTestSet[dest][td];
      let tcInput;
      let tcDesc;
      if (
        "description" in curTcData &&
        "input" in curTcData &&
        "output" in curTcData
      ) {
        tcInput = curTcData.input;
        tcDesc = `Destination - ${dest} - "${curTcData.description}"`;
      } else {
        tcInput = curTcData;
        tcDesc = `Destination - ${dest} - "${td}"`;
      }

      await runDataset(tcDesc, tcInput, dest);
    }
  }

  for (const src in srcTestSet) {
    for (const td in srcTestSet[src]) {
      const curTcData = srcTestSet[src][td];
      let tcInput;
      let tcDesc;
      if (
        "description" in curTcData &&
        "input" in curTcData &&
        "output" in curTcData
      ) {
        tcInput = curTcData.input;
        tcDesc = `Source - ${src} - "${curTcData.description}"`;
      } else {
        tcInput = curTcData;
        tcDesc = `Source - ${src} - "${td}"`;
      }

      await runDataset(tcDesc, tcInput, src);
    }
  }
}

async function runDataset(desc, input, intg) {
  const suiteName = desc;
  logger.info("==========================================");
  logger.info(suiteName);
  logger.info("==========================================");
  const results = {};
  const suite = new Benchmark(suiteName, "Operations");

  suite.add("native", async function() {
    try {
      await versionedRouter.handleV0Destination(
        nativeDestHandlers[intg].process,
        intg,
        input,
        TRANSFORMER_METRIC.ERROR_AT.PROC
      );
    } catch (err) {
      // logger.info(err);
      // Do nothing
    }
  });

  suite.add("CDK 2.0", async function() {
    try {
      await cdkV2Handler.process(destCdKWorkflowEngines[intg], input);
    } catch (err) {
      // logger.info(err);
      // Do nothing
    }
  });

  suite
    .on("cycle", function(result) {
      results[result.end.name] = { stats: result.end.stats };
    })
    .on("complete", function(result) {
      logger.info(
        "Fastest: ",
        result.end.name,
        result.end.stats.n,
        result.end.stats.mean.toFixed(4)
      );
      logger.info();
      Object.keys(results).forEach(impl => {
        logger.info(
          impl,
          results[impl].stats.n,
          results[impl].stats.mean.toFixed(4)
        );
       if(result.end.name !==  results[impl].name){
          logger.info(
            `"${result.end.name}" is faster by ${(
              result.end.stats.n / results[impl].stats.n
            ).toFixed(1)} times to "${impl}"`
          );
        }
        logger.info();
      });
    });

  await suite.run({ time: 1000 });
}

// Start suites
run();
