const gat = require('../v0/GATransform');

var fs = require('fs');
var jsonQ = require('jsonq');

test('test output', () => {
  console.log(process.cwd())
  const inputDataFile = fs.readFileSync('./tests/GA-data/input.json');
  const outputDataFile = fs.readFileSync('./tests/GA-data/output.json');
  const inputData = JSON.parse(inputDataFile)
  const outputData = JSON.parse(outputDataFile)
  var output = JSON.parse('[' + String(gat.process(jsonQ(inputData))) + ']')
  expect(output).toEqual(outputData);
});
