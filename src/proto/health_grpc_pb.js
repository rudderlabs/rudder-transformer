// GENERATED CODE -- DO NOT EDIT!

const grpc = require('grpc');
const src_proto_health_pb = require('./health_pb.js');

function serialize_grpc_health_v1_HealthCheckRequest(arg) {
  if (!(arg instanceof src_proto_health_pb.HealthCheckRequest)) {
    throw new Error('Expected argument of type grpc.health.v1.HealthCheckRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grpc_health_v1_HealthCheckRequest(buffer_arg) {
  return src_proto_health_pb.HealthCheckRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grpc_health_v1_HealthCheckResponse(arg) {
  if (!(arg instanceof src_proto_health_pb.HealthCheckResponse)) {
    throw new Error('Expected argument of type grpc.health.v1.HealthCheckResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grpc_health_v1_HealthCheckResponse(buffer_arg) {
  return src_proto_health_pb.HealthCheckResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

const HealthService = (exports.HealthService = {
  check: {
    path: '/grpc.health.v1.Health/Check',
    requestStream: false,
    responseStream: false,
    requestType: src_proto_health_pb.HealthCheckRequest,
    responseType: src_proto_health_pb.HealthCheckResponse,
    requestSerialize: serialize_grpc_health_v1_HealthCheckRequest,
    requestDeserialize: deserialize_grpc_health_v1_HealthCheckRequest,
    responseSerialize: serialize_grpc_health_v1_HealthCheckResponse,
    responseDeserialize: deserialize_grpc_health_v1_HealthCheckResponse,
  },
});

exports.HealthClient = grpc.makeGenericClientConstructor(HealthService);
