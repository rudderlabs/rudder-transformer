import {logger} from '@rudderstack/workflow-engine';
import {ServerUnaryCall} from "@grpc/grpc-js";
import {ProcessorTransformationRequest} from "../types";
import {UserTransformService} from "../services/userTransform";
import {Struct} from 'google-protobuf/google/protobuf/struct_pb';

const grpc = require('@grpc/grpc-js');
const {TransformerServiceService} = require('../proto/transform_grpc_pb');
const {HealthService} = require('../proto/health_grpc_pb');


async function transform(call: ServerUnaryCall<proto.proto.TransformRequest, proto.proto.TransformResponse>, callback) {
    const events: ProcessorTransformationRequest[] = call.request.getEventsList().map((event) => event.toObject());
    const response = await UserTransformService.transformRoutine(events, {}, 0)
    const protoResponse = new proto.proto.TransformResponse();
    protoResponse.setResponseList(response.transformedEvents.map((event) => {
        const pm = new proto.proto.Metadata();
        pm.setSourceId(event.metadata.sourceId);
        pm.setWorkspaceId(event.metadata.workspaceId);
        pm.setNamespace(event.metadata.namespace);
        pm.setInstanceId(event.metadata.instanceId);
        pm.setSourceType(event.metadata.sourceType);
        pm.setSourceCategory(event.metadata.sourceCategory);
        pm.setTrackingPlanId(event.metadata.trackingPlanId);
        pm.setTrackingPlanVersion(event.metadata.trackingPlanVersion);
        // pm.setMergedTpConfig(JSON.stringify(event.metadata.mergedTpConfig));
        pm.setDestinationId(event.metadata.destinationId);
        pm.setSourceJobId(event.metadata.jobRunId);
        pm.setJobId(event.metadata.jobId);
        pm.setSourceJobId(event.metadata.sourceJobId);
        pm.setSourceJobRunId(event.metadata.sourceJobRunId);
        pm.setSourceTaskRunId(event.metadata.sourceTaskRunId);
        pm.setRecordid(JSON.stringify(event.metadata.recordId));
        pm.setDestinationType(event.metadata.destinationType);
        pm.setMessageId(event.metadata.messageId);
        pm.setOauthAccessToken(event.metadata.oauthAccessToken);
        pm.setMessageIdsList(event.metadata.messageIds);
        pm.setRudderId(event.metadata.rudderId);
        pm.setReceivedAt(event.metadata.receivedAt);
        pm.setEventName(event.metadata.eventName);
        pm.setEventType(event.metadata.eventType);
        pm.setSourceDefinitionId(event.metadata.sourceDefinitionId);
        pm.setDestinationDefinitionId(event.metadata.destinationDefinitionId);
        pm.setTransformationId(event.metadata.transformationId);

        const protoEvent = new proto.proto.Response();
        protoEvent.setOutput(proto.google.protobuf.Struct());
        protoEvent.setMetadata(pm);
        protoEvent.setStatusCode(event.statusCode);
        protoEvent.setError(event.error || '');
        return protoEvent;
    }));

    callback(
        null,
        protoResponse,
    );
}

function health(call, callback) {
    callback(
        {
            message: 'SERVING',
            code: grpc.status.OK
        },
        null,
    );
}

function startGRPCServer() {
    const server = new grpc.Server();
    server.addService(TransformerServiceService, {transform});
    server.addService(HealthService, {check: health});
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            logger.error('Failed to bind server:', err);
        } else {
            logger.info(`gRPC server running on port ${port}`);
            server.start();
        }
    });
}

export {startGRPCServer};
