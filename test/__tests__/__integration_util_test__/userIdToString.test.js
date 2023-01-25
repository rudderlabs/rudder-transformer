const fs = require("fs");
const path = require("path");
const { checkAndCorrectUserId } = require("../../../src/v0/util/index");


// Test file
const testDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/userIdToString.json`)
);
const testData = JSON.parse(testDataFile);

describe("userIdCheckandCorrect util test", () => {
    testData.forEach(async (dataPoint, index) => {
        it(`Test Case ${index}.: ${dataPoint.description}`, async () => {
            const outputArray = checkAndCorrectUserId(dataPoint.input.statusCode, dataPoint.input.userId);
            expect(outputArray).toEqual(dataPoint.output);
        });
    });
});
