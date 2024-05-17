import {logger} from "@rudderstack/workflow-engine";

const grpc = require('@grpc/grpc-js');
const {UserTransformService} = require('../services/userTransform');
const {TransformerServiceService} = require('../proto/transform_grpc_pb');


function transform(call, callback) {
    const {events} = call.request;
    const responses = UserTransformService.transformRoutine(events);

    callback(null, {response: responses});
}

function startGRPCServer() {
    const server = new grpc.Server();
    server.addService(TransformerServiceService, {Transform: transform});
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            logger.error('Failed to bind server:', err);
            throw new Error('Failed to bind server on port 50051');
        } else {
            logger.info(`gRPC server running on port ${port}`);
            server.start();
        }
    });
}

export {startGRPCServer};