/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable func-names */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const Benchmark = require('benchmark-suite');
const fs = require('fs');
const path = require('path');
const Commander = require('commander');
const logger = require('./metaLogger');
const versionedRouter = require('../src/versionedRouter');
const cdkV2Handler = require('../src/cdk/v2/handler');

const supportedDestinations = ['algolia', 'pinterest_tag'];

logger.info();

const command = new Commander.Command();
command
  .allowUnknownOption()
  .option(
    '-d, --destinations <string>',
    'Enter destination names separated by comma',
    supportedDestinations.toString(),
  )
  .option(
    '-bt, --benchmarktype <string>',
    'Enter the benchmark type (Operations or Memory)',
    'Operations',
  )
  .option('-f, --feature <string>', 'Enter feature name (proc or rt)', 'proc')
  .parse();

const getTestFileName = (intg, testSufix) => {
  const featureSufix = cmdOpts.feature === 'rt' ? '_router' : '';
  return `${intg}${featureSufix}${testSufix}.json`;
};

const testDataDir = path.join(__dirname, '../test/__tests__/data');
const getTestData = (intgList, fileNameSuffixes) => {
  const intgTestData = {};
  intgList.forEach((intg) => {
    // Use the last valid test data file
    fileNameSuffixes.forEach((fileNameSuffix) => {
      try {
        intgTestData[intg] = JSON.parse(
          fs.readFileSync(path.join(testDataDir, getTestFileName(intg, fileNameSuffix)), {
            encoding: 'utf-8',
          }),
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
  .split(',')
  .map((x) => x.trim())
  .filter((x) => x !== '');
logger.info('Destinations:', destinationsList, 'feature:', cmdOpts.feature);
logger.info();
const destDataset = getTestData(destinationsList, ['_input', '']);

const nativeDestHandlers = {};
const destCdKWorkflowEngines = {};

const benchmarkType = cmdOpts.benchmarktype.trim();

const getNativeHandleName = () => {
  let handleName = 'process';
  if (cmdOpts.feature === 'rt') {
    handleName = 'processRouterDest';
  }
  return handleName;
};

async function initializeHandlers() {
  for (const idx in destinationsList) {
    const dest = destinationsList[idx];

    // Native destination handler
    nativeDestHandlers[dest] = versionedRouter.getDestHandler('v0', dest)[getNativeHandleName()];

    // Get the CDK 2.0 workflow engine instance
    destCdKWorkflowEngines[dest] = await cdkV2Handler.getWorkflowEngine(dest, cmdOpts.feature);
  }
}

async function runDataset(suitDesc, input, intg, params) {
  logger.info('==========================================');
  logger.info(suitDesc);
  logger.info('==========================================');

  const results = {};
  const suite = new Benchmark(suitDesc, benchmarkType);

  Object.keys(params).forEach((opName) => {
    const handler = params[opName].handlerResolver(intg);
    const args = params[opName].argsResolver(intg, input);
    suite.add(opName, async () => {
      try {
        await handler(...args);
      } catch (err) {
        // logger.info(err);
        // Do nothing
      }
    });
  });

  suite
    .on('cycle', (result) => {
      results[result.end.name] = { stats: result.end.stats };
    })
    .on('complete', (result) => {
      logger.info(
        benchmarkType === 'Operations' ? 'Fastest: ' : 'Memory intensive: ',
        `"${result.end.name}"`,
      );
      logger.info();
      Object.keys(results).forEach((impl) => {
        logger.info(`"${impl}" - `, suite.formatStats(results[impl].stats));

        if (result.end.name !== impl) {
          if (benchmarkType === 'Operations') {
            logger.info(
              `-> "${result.end.name}" is faster by ${(
                results[impl].stats.mean / result.end.stats.mean
              ).toFixed(1)} times to "${impl}"`,
            );
          } else {
            logger.info(
              `-> "${result.end.name}" consumed ${(
                result.end.stats.mean / results[impl].stats.mean
              ).toFixed(1)} times memory compared to "${impl}"`,
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
      let tcInput = curTcData;
      let tcDesc = `${type} - ${intg} - ${cmdOpts.feature} - ${tc}`;
      // New test data file structure
      if ('description' in curTcData && 'input' in curTcData && 'output' in curTcData) {
        tcInput = curTcData.input;
        tcDesc += ` - "${curTcData.description}"`;
      }

      await runDataset(tcDesc, tcInput, intg, params);
    }
  }
}

async function run() {
  // Initialize CDK and native handlers
  await initializeHandlers();

  // Destinations
  await runIntgDataset(destDataset, 'Destination', {
    native: {
      handlerResolver: (intg) => nativeDestHandlers[intg],
      argsResolver: (_intg, input) => [input],
    },
    'CDK 2.0': {
      handlerResolver: () => cdkV2Handler.process,
      argsResolver: (intg, input) => [destCdKWorkflowEngines[intg], input],
    },
  });
}

// Start suites
run();
