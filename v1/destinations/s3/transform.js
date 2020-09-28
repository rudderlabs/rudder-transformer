const S3 = require("./data/s3");

function process(event) {
  return new S3(event).response;
}

exports.process = process;
