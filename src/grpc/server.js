import {logger} from '@rudderstack/workflow-engine';
import {TransformerServiceService} from '../proto/transform_grpc_pb';
import {UserTransformService} from '../services/userTransform';

const grpc = require('@grpc/grpc-js');
const {Struct, Value} = require('google-protobuf/google/protobuf/struct_pb.js');
const {HealthService} = require('../proto/health_grpc_pb');

// Function to convert Protobuf Struct to JavaScript object
function fromProtoStruct(protoStruct) {
    const result = {};
    const fieldsMap = protoStruct.getFieldsMap();

    fieldsMap.forEach((value, key) => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        result[key] = valueToJs(value);
    });

    return result;
}

// Function to convert Protobuf Value to JavaScript value
function valueToJs(value) {
    const kindCase = value.getKindCase();
    switch (kindCase) {
        case Value.KindCase.NULL_VALUE:
            return null;
        case Value.KindCase.NUMBER_VALUE:
            return value.getNumberValue();
        case Value.KindCase.STRING_VALUE:
            return value.getStringValue();
        case Value.KindCase.BOOL_VALUE:
            return value.getBoolValue();
        case Value.KindCase.STRUCT_VALUE:
            return fromProtoStruct(value.getStructValue()); // Recursively convert structs
        case Value.KindCase.LIST_VALUE:
            return value.getListValue().getValuesList().map(valueToJs);
        default:
            return undefined;
    }
}

async function transform(call, callback) {
    const events = [];
    for (const event of call.request.getEventsList()) {
        const message = fromProtoStruct(event.getMessage());
        const sourceTpConf = {};
        for (const [key, value] of event.getMetadata().getSourceTpConfigMap().entries()) {
            sourceTpConf[key] = fromProtoStruct(value);
        }
        const metadata = {
            sourceId: event.getMetadata().getSourceId(),
            workspaceId: event.getMetadata().getWorkspaceId(),
            namespace: event.getMetadata().getNamespace(),
            instanceId: event.getMetadata().getInstanceId(),
            sourceType: event.getMetadata().getSourceType(),
            sourceCategory: event.getMetadata().getSourceCategory(),
            trackingPlanId: event.getMetadata().getTrackingPlanId(),
            trackingPlanVersion: event.getMetadata().getTrackingPlanVersion(),
            sourceTpConfig: sourceTpConf,
            mergedTpConfig: fromProtoStruct(event.getMetadata().getMergedTpConfig()),
            destinationId: event.getMetadata().getDestinationId(),
            jobId: event.getMetadata().getJobId(),
            sourceJobId: event.getMetadata().getSourceJobId(),
            sourceJobRunId: event.getMetadata().getSourceJobRunId(),
            sourceTaskRunId: event.getMetadata().getSourceTaskRunId(),
            recordId: valueToJs(event.getMetadata().getRecordid()),
            destinationType: event.getMetadata().getDestinationType(),
            messageId: event.getMetadata().getMessageId(),
            oauthAccessToken: event.getMetadata().getOauthAccessToken(),
            messageIds: event.getMetadata().getMessageIdsList(),
            rudderId: event.getMetadata().getRudderId(),
            receivedAt: event.getMetadata().getReceivedAt(),
            eventName: event.getMetadata().getEventName(),
            eventType: event.getMetadata().getEventType(),
            sourceDefinitionId: event.getMetadata().getSourceDefinitionId(),
            destinationDefinitionId: event.getMetadata().getDestinationDefinitionId(),
            transformationId: event.getMetadata().getTransformationId(),
        };
        const transformationList = [];
        for (const transformation of event.getDestination().getTransformationList()) {
            transformationList.push({
                VersionID: transformation.getVersionId(),
                ID: transformation.getId(),
                Config: fromProtoStruct(transformation.getConfig()),
            });
        }
        const destination = {
            ID: event.getDestination().getId(),
            Name: event.getDestination().getName(),
            DestinationDefinition: {
                ID: event.getDestination().getDestinationDefinition().getId(),
                Name: event.getDestination().getDestinationDefinition().getName(),
                DisplayName: event.getDestination().getDestinationDefinition().getDisplayName(),
                Config: fromProtoStruct(event.getDestination().getDestinationDefinition().getConfig()),
            },
            Config: fromProtoStruct(event.getDestination().getConfig()),
            Enabled: event.getDestination().getEnabled(),
            WorkspaceID: event.getDestination().getWorkspaceId(),
            Transformations: transformationList,
            RevisionID: event.getDestination().getRevisionId(),
        };
        const libraries = [];
        for (const library of event.getLibrariesList()) {
            libraries.push({
                VersionID: library.getVersionId(),
            });
        }

        events.push({
            message,
            metadata,
            destination,
            libraries,
        });
    }

    logger.info('Events:', events);
    const response = await UserTransformService.transformRoutine(events, {}, 0);
    logger.info('Response:', response);

    const protoResponse = new proto.proto.TransformResponse();
    protoResponse.setResponseList(
        response.transformedEvents.map((event) => {
            const metadata = new proto.proto.Metadata();
            metadata.setSourceId(event.metadata.sourceId);
            metadata.setWorkspaceId(event.metadata.workspaceId);
            metadata.setNamespace(event.metadata.namespace);
            metadata.setInstanceId(event.metadata.instanceId);
            metadata.setSourceType(event.metadata.sourceType);
            metadata.setSourceCategory(event.metadata.sourceCategory);
            metadata.setTrackingPlanId(event.metadata.trackingPlanId);
            metadata.setTrackingPlanVersion(event.metadata.trackingPlanVersion);
            for (const [key, value] of Object.entries(event.metadata.sourceTpConfig)) {
                metadata.getSourceTpConfigMap().set(key, Struct.fromJavaScript(value));
            }
            metadata.setMergedTpConfig(Struct.fromJavaScript(event.metadata.mergedTpConfig));
            metadata.setDestinationId(event.metadata.destinationId);
            metadata.setJobId(event.metadata.jobId);
            metadata.setSourceJobId(event.metadata.sourceJobId);
            metadata.setSourceJobRunId(event.metadata.sourceJobRunId);
            metadata.setSourceTaskRunId(event.metadata.sourceTaskRunId);
            metadata.setRecordid(Value.fromJavaScript(event.metadata.recordId));
            metadata.setDestinationType(event.metadata.destinationType);
            metadata.setMessageId(event.metadata.messageId);
            metadata.setOauthAccessToken(event.metadata.oauthAccessToken);
            metadata.setMessageIdsList(event.metadata.messageIds);
            metadata.setRudderId(event.metadata.rudderId);
            metadata.setReceivedAt(event.metadata.receivedAt);
            metadata.setEventName(event.metadata.eventName);
            metadata.setEventType(event.metadata.eventType);
            metadata.setSourceDefinitionId(event.metadata.sourceDefinitionId);
            metadata.setDestinationDefinitionId(event.metadata.destinationDefinitionId);
            metadata.setTransformationId(event.metadata.transformationId);

            const protoEvent = new proto.proto.Response();

            protoEvent.setOutput(Struct.fromJavaScript(event.output));
            protoEvent.setMetadata(metadata);
            protoEvent.setStatusCode(event.statusCode);
            protoEvent.setError(event.error || '');
            return protoEvent;
        }),
    );
    callback(null, protoResponse);
}

function health(call, callback) {
    callback(
        {
            message: 'SERVING',
            code: grpc.status.OK,
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
