const { transformSubEventTypeProfiles } = require('./transform');

// {
//     "type": "record",
//     "action": "delete", /* insert, delete */
//     "channel": "sources",
//     "context": {
//         "sources": {
//             "job_id": "2QZYNmlpjxJIoxywM1m2obqFyi7",
//             "version": "v1.32.0",
//             "job_run_id": "ck0c6g0u5hotr621tqu0",
//             "task_run_id": "ck0c6g0u5hotr621tqug"
//             "profiles_model": "some-model",
//             "profiles_entity": "some-entity"
//             "profiles_id_type": "some-id-type"
//         },
//     "externalId": [
//       {
//         "type": "FB_CUSTOM_AUDIENCE-21304823048",
//         "identifierType": "EMAIL"
//       }
//     ],
//     },
//     "recordId": "a111",
//     "messageId": "260f9a8d-91a7-46b0-9199-6da961dd6109",
//     "fields": {
//        MODEL_ID: '1691755780',
//        VALID_AT: '2023-08-11T11:32:44.963062Z',
//        USER_MAIN_ID: 'rid5530313526204a95efe71d98cd17d5a1',
//        CHURN_SCORE_7_DAYS: 0.027986,
//        PERCENTILE_CHURN_SCORE_7_DAYS: 0,
//     },
// }

function handleRecordEventsForRedis(message, destination, metadata) {
  // fields -> traits
  // metadata -> metadata
  // context.sources.profiles_<$$$> -> context.sources.profiles_<$$$>
  const { workspaceId } = metadata;
  const destinationId = destination.ID;

  return transformSubEventTypeProfiles(message, workspaceId, destinationId);
}

module.exports = { handleRecordEventsForRedis };
