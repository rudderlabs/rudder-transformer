
const { getDataType } = require("../warehouse/index")
const { getDataTypeOverride} = require("../v0/destinations/clickhouse/transform")

var input = {
    "normalInt": 1,
    "normalFloat": 2.01,
    "normalBoolean": true,
    "normalString":"clickhouse transformation[*007}",
    "object":{
        "a":"random value 1",
        "b":"random value 2"
    },
    "arrayInt" : [1,2,3],
    "arrayFloat": [1.01, 2.01, 5.09012],
    "arrayFloatMixedInt1": [1, 2, 5.09012],
    "arrayFloatMixedInt2": [1.09, 2, 5],
    "arrayFloatMixedInt3": [1.09, 2.09123, 5, 1],
    "arrayBoolean": [true, false, true, true, false],
    "arrayDateTime": ["2019-08-12T05:08:30.909Z","2019-08-12T06:08:30.909Z"],
    "arrayDateTimeWrongDate": ["2019-08-12T05:08:30.909Z","2019-083-12T06:08:30.909Z"],
    "arrayString": ["rudderstack","clickhouse"],
    "arrayRandomDataTypes1": [1,1.01, true],
    "arrayRandomDataTypes2": [1,1.01, {"a":"random value 1","b":"random value 2"}],
    "arrayRandomIntArrays": [[1,2,3],[3,4,5]],
    "arrayRandomArrays": [[1,2,"ganesh"],[2,true,"2019-08-12T05:08:30.909Z"]]
}

const output = {
    "normalInt": "int",
    "normalFloat": "float",
    "normalBoolean": "boolean",
    "normalString":"string",
    "object": "string",
    "arrayInt": "array(int)",
    "arrayFloat": "array(float)",
    "arrayFloatMixedInt1": "array(float)",
    "arrayFloatMixedInt2": "array(float)",
    "arrayFloatMixedInt3": "array(float)",
    "arrayDateTime":"array(datetime)",
    "arrayBoolean":"array(boolean)",
    "arrayString":"array(string)",
    "arrayDateTimeWrongDate": "array(string)",
    "arrayRandomDataTypes1": "array(string)",
    "arrayRandomDataTypes2": "array(string)",
    "arrayRandomIntArrays": "array(string)",
    "arrayRandomArrays": "array(string)"

}
describe("ClickHouse data types testing", ()=> {

    options = {}
    options.getDataTypeOverride = getDataTypeOverride
    Object.keys(input).forEach((key)=>{
            it(`should return data type ${output[key]} for this input data ${input[key]} everytime`, ()=> {
                var dataType = getDataType(input[key], options)
                expect(dataType).toEqual(output[key])
            })
    })


})
