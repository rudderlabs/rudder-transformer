const fs = require("fs");
const path = require("path");
const { getFormData } = require("../../adapters/network");
const utilObj = require("../../v0/util");

const functionsToTest = [
  "handleSourceKeysOperation",
  "getValueFromPropertiesOrTraits"
];

const fnName = "all";

describe("Integration Util Tests", () => {
  functionsToTest.forEach(fn => {
    if (fnName === "all" || fn === fnName) {
      describe(`Test - ${fn}`, () => {
        const fnObj = utilObj[fn];

        // common for all the methods
        it(`${fn} is defined`, () => {
          expect(fnObj).not.toBeNull();
        });

        // get the data file for the function
        const inputFile = fs.readFileSync(
          path.resolve(__dirname, `./data/${fn}.json`)
        );
        const inputData = JSON.parse(inputFile);

        inputData.forEach(dataPoint => {
          const { input, output, description } = dataPoint;
          it(description, () => {
            const result = fnObj({ ...input });
            if (output === null) {
              expect(result).toBeNull();
            } else {
              expect(result).toEqual(output);
            }
          });
        });
      });
    }
  });
});

const formDataEscapeCases = [
  {
    testCase: 'Special characters should escape correctly',
    input: { data: " ?&=#+%!<>#\"{}|\\^[]`☺\t:/@$'()*,;" },
    expected: "data=+%3F%26%3D%23%2B%25%21%3C%3E%23%22%7B%7D%7C%5C%5E%5B%5D%60%E2%98%BA%09%3A%2F%40%24%27%28%29%2A%2C%3B"
  },
  {
    testCase: 'String containing and characters should escape correctly',
    input: { data: "Channel is *san_dev* which is being viewed by `Sank`, you don't have _control_ over\n```This code-snippet does the trick for us```" },
    expected: "data=Channel+is+%2Asan_dev%2A+which+is+being+viewed+by+%60Sank%60%2C+you+don%27t+have+_control_+over%0A%60%60%60This+code-snippet+does+the+trick+for+us%60%60%60"
  },
  {
    testCase: 'String[] containing should escape correctly',
    input: { data: ["{\"user_id\": \"1lknduhkl3nr8skm3hkdkis\"}"] },
    expected: "data=%5B%7B%22user_id%22%3A+%221lknduhkl3nr8skm3hkdkis%22%7D%5D"
  }
]

describe("`FORM` format escape test-cases", () => {
  it.each(formDataEscapeCases)('$testCase', ({input, expected}) => {
    const output = getFormData(input);
    expect(output).toEqual(expected);
  })
})