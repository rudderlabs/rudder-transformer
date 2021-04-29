
const { getDataType } = require("../warehouse/index")
const { getDataTypeOverride} = require("../v0/destinations/clickhouse/transform")

var testCases = [
    {
        "name": "normalInt",
        "data": 1,
        "type": "int"
    },
    {
        "name": "normalFloat",
        "data": 2.01,
        "type": "float"
    },
    {
        "name": "normalBoolean",
        "data": true,
        "type": "boolean"
    },
    {
        "name": "normalString",
        "data": "clickhouse transformation[*007}",
        "type": "string"
    },
    {
        "name": "arrayInt",
        "data": [1, 2, 3],
        "type": "array(int)"
    },
    {
        "name": "arrayFloat",
        "data": [1.01, 2.01, 5.09012],
        "type": "array(float)"
    },
    {
        "name": "arrayFloatMixedInt1",
        "data": [1, 2, 5.09012],
        "type": "array(float)"
    },
    {
        "name": "arrayFloatMixedInt2",
        "data": [1.09, 2, 5],
        "type": "array(float)"
    },
    {
        "name": "arrayFloatMixedInt3",
        "data": [1.09, 2.09123, 5, 1],
        "type": "array(float)"
    },
    {
        "name": "arrayBoolean",
        "data": [true, false, true, true, false],
        "type": "array(boolean)"
    },
    {
        "name": "arrayDateTime",
        "data": ["2019-08-12T05:08:30.909Z", "2019-08-12T06:08:30.909Z"],
        "type": "array(datetime)"
    },
    {
        "name": "arrayDateTimeWrongDate",
        "data": ["2019-08-12T05:08:30.909Z", "2019-083-12T06:08:30.909Z"],
        "type": "array(string)"
    },
    {
        "name": "arrayString",
        "data": ["rudderstack", "clickhouse"],
        "type": "array(string)"
    },
    {
        "name": "arrayRandomDataTypes1",
        "data": [1, 1.01, true],
        "type": "array(string)"
    },
    {
        "name": "arrayRandomDataTypes2",
        "data": [1, 1.01, {"a": "random value 1", "b": "random value 2"}],
        "type": "array(string)"
    },
    {
        "name": "arrayRandomIntArrays",
        "data": [[1, 2, 3],[3, 4, 5]],
        "type": "array(string)"
    },
    {
        "name": "arrayRandomArrays",
        "data": [[1, 2, "random"],[2, true, "2019-08-12T05:08:30.909Z"]],
        "type": "array(string)"
    },
    {
        "name": "object",
        "data": {"a": "random value 1","b": "random value 2"},
        "type": "string"
    }
]

describe("ClickHouse data types testing", ()=> {

    options = {}
    options.getDataTypeOverride = getDataTypeOverride
    testCases.forEach((testCase)=>{
            it(`should return data type ${testCase.type} for this input data ${testCase.data} everytime`, ()=> {
                var dataType = getDataType(testCase.data, options)
                expect(dataType).toEqual(testCase.type)
            })
    })


})
