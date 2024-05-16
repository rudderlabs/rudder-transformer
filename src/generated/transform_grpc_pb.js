// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var transform_pb = require('./transform_pb.js');
var google_protobuf_struct_pb = require('google-protobuf/google/protobuf/struct_pb.js');

function serialize_proto_TransformRequest(arg) {
  if (!(arg instanceof transform_pb.TransformRequest)) {
    throw new Error('Expected argument of type proto.TransformRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_proto_TransformRequest(buffer_arg) {
  return transform_pb.TransformRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_proto_TransformResponse(arg) {
  if (!(arg instanceof transform_pb.TransformResponse)) {
    throw new Error('Expected argument of type proto.TransformResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_proto_TransformResponse(buffer_arg) {
  return transform_pb.TransformResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var TransformerServiceService = exports.TransformerServiceService = {
  transform: {
    path: '/proto.TransformerService/Transform',
    requestStream: false,
    responseStream: false,
    requestType: transform_pb.TransformRequest,
    responseType: transform_pb.TransformResponse,
    requestSerialize: serialize_proto_TransformRequest,
    requestDeserialize: deserialize_proto_TransformRequest,
    responseSerialize: serialize_proto_TransformResponse,
    responseDeserialize: deserialize_proto_TransformResponse,
  },
};

exports.TransformerServiceClient = grpc.makeGenericClientConstructor(TransformerServiceService);
