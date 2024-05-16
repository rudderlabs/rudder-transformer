const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { UserTransformService } = require('../services/userTransform');
const PROTO_PATH = path.join(__dirname, 'transform.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const proto = grpc.loadPackageDefinition(packageDefinition).proto;

function transform(call, callback) {
  const {events} = call.request;
  const responses = UserTransformService.transformRoutine(events);

  callback(null, { response: responses });
}

function main() {
  const server = new grpc.Server();
  server.addService(proto.TransformerService.service, { Transform: transform });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('gRPC server running at http://127.0.0.1:50051');
    server.start();
  });
}

main();
