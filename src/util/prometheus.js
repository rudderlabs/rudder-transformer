const prometheusClient = require('prom-client');

const prometheusRegistry = new prometheusClient.Registry();
prometheusClient.collectDefaultMetrics({ register: prometheusRegistry });

// TODO handle this
// const enableStats = process.env.ENABLE_STATS !== 'false';
// const instanceID = process.env.INSTANCE_ID || 'localhost';
// prefix: 'transformer',

const newCounterStat = (name, help, labelNames) => {
  const counter = new prometheusClient.Counter({
    name,
    help,
    labelNames,
  });
  prometheusRegistry.registerMetric(counter);
  return counter;
};

const newGaugeStat = (name, help, labelNames) => {
  const gauge = new prometheusClient.Gauge({
    name,
    help,
    labelNames,
  });
  prometheusRegistry.registerMetric(gauge);
  return gauge;
};

const newSummaryStat = (name, help, labelNames) => {
  const summary = new prometheusClient.Summary({
    name,
    help,
    labelNames,
  });
  prometheusRegistry.registerMetric(summary);
  return summary;
};

const newHistogramStat = (name, help, labelNames) => {
  const histogram = new prometheusClient.Histogram({
    name,
    help,
    labelNames,
  });
  prometheusRegistry.registerMetric(histogram);
  return histogram;
};

let metrics;
function createMetrics() {
  // TODO
  // 1. cluster mode
  // 2. clear registry?

  metrics = {
    // Counters
    counter: newCounterStat('counter', 'Counter', ['label']),

    userTransformInputEvents: newCounterStat(
      'user_transform_input_events',
      'Number of input events to user transform',
      ['processSessions'],
    ),

    cdkLiveCompareTestFailed: newCounterStat(
      'cdk_live_compare_test_failed',
      'cdk_live_compare_test_failed',
      ['destType', 'feature'],
    ),

    cdkLiveCompareTestSuccess: newCounterStat(
      'cdk_live_compare_test_success',
      'cdk_live_compare_test_success',
      ['destType', 'feature'],
    ),

    cdkLiveCompareTestErrored: newCounterStat(
      'cdk_live_compare_test_errored',
      'cdk_live_compare_test_errored',
      ['destType', 'feature'],
    ),

    hvViolationType: newCounterStat('hv_violation_type', 'hv_violation_type', [
      'violationType',
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),

    hvPropagatedEvents: newCounterStat('hv_propagated_events', 'hv_propagated_events', [
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),

    hvErrors: newCounterStat('hv_errors', 'hv_errors', [
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),

    hvEventsCount: newCounterStat('hv_events_count', 'hv_events_count', [
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),

    hvRequestSize: newCounterStat('hv_request_size', 'hv_request_size', [
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),

    userTransformFunctionGroupSize: newCounterStat(
      'user_transform_function_group_size',
      'user_transform_function_group_size',
      ['processSessions'],
    ),

    userTransformFunctionInputEvents: newCounterStat(
      'user_transform_function_input_events',
      'user_transform_function_input_events',
      ['processSessions', 'sourceType', 'destinationType', 'k8_namespace'],
    ),

    userTransformErrors: newCounterStat('user_transform_errors', 'user_transform_errors', [
      'transformationVersionId',
      'processSessions',
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),

    destTransformRequests: newCounterStat('dest_transform_requests', 'dest_transform_requests', [
      'destination',
      'version',
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),

    destTransformInputEvents: newCounterStat(
      'dest_transform_input_events',
      'dest_transform_input_events',
      ['destination', 'version', 'sourceType', 'destinationType', 'k8_namespace'],
    ),

    destTransformOutputEvents: newCounterStat(
      'dest_transform_output_events',
      'dest_transform_output_events',
      ['destination', 'version', 'sourceType', 'destinationType', 'k8_namespace'],
    ),

    userTransformRequests: newCounterStat('user_transform_requests', 'user_transform_requests', [
      'processSessions',
    ]),

    userTransformOutputEvents: newCounterStat(
      'user_transform_output_events',
      'user_transform_output_events',
      ['processSessions'],
    ),

    sourceTransformRequests: newCounterStat(
      'source_transform_requests',
      'source_transform_requests',
      ['source', 'version'],
    ),
    sourceTransformInputEvents: newCounterStat(
      'source_transform_input_events',
      'source_transform_input_events',
      ['source', 'version'],
    ),
    sourceTransformOutputEvents: newCounterStat(
      'source_transform_output_events',
      'source_transform_output_events',
      ['source', 'version'],
    ),

    tfProxyDestRespCount: newCounterStat('tf_proxy_dest_resp_count', 'tf_proxy_dest_resp_count', [
      'destination',
      'success',
    ]),

    marketoBulkUploadUploadFileJobs: newCounterStat(
      'marketo_bulk_upload_upload_file_jobs',
      'marketo_bulk_upload_upload_file_jobs',
      ['success'],
    ),

    createZipError: newCounterStat('create_zip_error', 'create_zip_error', ['fileName']),
    deleteZipError: newCounterStat('delete_zip_error', 'delete_zip_error', ['functionName']),

    hvMetrics: newCounterStat('hv_metrics', 'hv_metrics', [
      'destination',
      'version',
      'sourceType',
      'destinationType',
      'k8_namespace',
      'dropped',
      'violationType',
    ]),
    eventsIntoVm: newCounterStat('events_into_vm', 'events_into_vm', [
      'transformerVersionId',
      'version',
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),
    missingHandle: newCounterStat('missing_handle', 'missing_handle', [
      'transformerVersionId',
      'language',
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),
    proxyTestError: newCounterStat('proxy_test_error', 'proxy_test_error', ['destination']),
    proxyTestPayloadMatch: newCounterStat('proxy_test_payload_match', 'proxy_test_payload_match', [
      'destination',
    ]),
    tfProxyErrCount: newCounterStat('tf_proxy_err_count', 'tf_proxy_err_count', ['destination']),
    tfProxyRespHandlerCount: newCounterStat(
      'tf_proxy_resp_handler_count',
      'tf_proxy_resp_handler_count',
      ['destination'],
    ),
    tfProxyProcAxResponseCount: newCounterStat(
      'tf_proxy_proc_ax_response_count',
      'tf_proxy_proc_ax_response_count',
      ['destination'],
    ),
    tfProxyDestReqCount: newCounterStat('tf_proxy_dest_req_count', 'tf_proxy_dest_req_count', [
      'destination',
    ]),
    sourceTransformErrors: newCounterStat('source_transform_errors', 'source_transform_errors', [
      'source',
      'version',
    ]),
    marketoBulkUploadGetJobStatus: newCounterStat(
      'marketo_bulk_upload_get_job_status',
      'marketo_bulk_upload_get_job_status',
      ['status', 'state'],
    ),
    marketoBulkUploadUploadFile: newCounterStat(
      'marketo_bulk_upload_upload_file',
      'marketo_bulk_upload_upload_file',
      ['status', 'state'],
    ),
    marketoBulkUploadPolling: newCounterStat(
      'marketo_bulk_upload_polling',
      'marketo_bulk_upload_polling',
      ['status', 'state'],
    ),
    marketoFetchToken: newCounterStat('marketo_fetch_token', 'marketo_fetch_token', ['status']),
    marketoActivity: newCounterStat('marketo_activity', 'marketo_activity', []),
    marketoLeadLookup: newCounterStat('marketo_lead_lookup', 'marketo_lead_lookup', [
      'type',
      'action',
    ]),
    destTransformInvalidDynamicConfigCount: newCounterStat(
      'dest_transform_invalid_dynamicConfig_count',
      'dest_transform_invalid_dynamicConfig_count',
      ['destinationType', 'destinationId'],
    ),
    shopifyClientSideIdentifierEvent: newCounterStat(
      'shopify_client_side_identifier_event',
      'shopify_client_side_identifier_event',
      ['writeKey', 'timestamp'],
    ),
    shopifyServerSideIdentifierEvent: newCounterStat(
      'shopify_server_side_identifier_event',
      'shopify_server_side_identifier_event',
      ['writeKey', 'timestamp'],
    ),
    fbPixelTimestampError: newCounterStat('fb_pixel_timestamp_error', 'fb_pixel_timestamp_error', [
      'destinationId',
    ]),
    getEventSchemaError: newCounterStat('get_eventSchema_error', 'get_eventSchema_error', []),
    getTrackingPlanError: newCounterStat('get_tracking_plan_error', 'get_tracking_plan_error', []),
    // Gauges
    gauge: newGaugeStat('gauge', 'Gauge', ['label']),

    v0TransformationTimeGauge: newGaugeStat('v0_transformation_time', 'v0_transformation_time', [
      'destType',
      'feature',
    ]),

    cdkTransformationGauge: newGaugeStat('cdk_transformation_time', 'cdk_transformation_time', [
      'destType',
      'feature',
    ]),

    // Summaries
    summary: newSummaryStat('summary', 'Summary', ['label']),

    // Histograms
    httpRequestDurationSummary: newHistogramStat(
      'http_request_duration',
      'Summary of HTTP requests duration in seconds',
      ['method', 'route', 'code'],
    ),

    hvRequestLatency: newHistogramStat('hv_request_latency', 'hv_request_latency', [
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),

    cdkEventsLatency: newHistogramStat('cdk_events_latency', 'cdk_events_latency', [
      'destination',
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),

    hvEventLatency: newHistogramStat('hv_event_latency', 'hv_event_latency', [
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),

    destTransformRequestLatency: newHistogramStat(
      'dest_transform_request_latency',
      'dest_transform_request_latency',
      ['destination', 'version', 'sourceType', 'destinationType', 'k8_namespace'],
    ),

    userTransformRequestLatency: newHistogramStat(
      'user_transform_request_latency',
      'user_transform_request_latency',
      ['processSessions'],
    ),

    userTransformFunctionLatency: newHistogramStat(
      'user_transform_function_latency',
      'user_transform_function_latency',
      [
        'transformationVersionId',
        'processSessions',
        'sourceType',
        'destinationType',
        'k8_namespace',
      ],
    ),

    sourceTransformRequestLatency: newHistogramStat(
      'source_transform_request_latency',
      'source_transform_request_latency',
      ['source', 'version'],
    ),

    transformerProxyTime: newHistogramStat('transformer_proxy_time', 'transformer_proxy_time', [
      'destination',
    ]),

    transformerTotalProxyLatency: newHistogramStat(
      'transformer_total_proxy_latency',
      'transformer_total_proxy_latency',
      ['destination', 'version'],
    ),
    creationTime: newHistogramStat('creation_time', 'creation_time', [
      'transformerVersionId',
      'language',
      'identifier',
      'publish',
      'testMode',
    ]),
    runTime: newHistogramStat('run_time', 'run_time', [
      'transformerVersionId',
      'language',
      'identifier',
      'publish',
      'testMode',
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),

    getTrackingPlan: newHistogramStat('get_tracking_plan', 'get_tracking_plan', []),
    createivmDuration: newHistogramStat('createivm_duration', 'createivm_duration', []),
    fetchV2CallDuration: newHistogramStat('fetchV2_call_duration', 'fetchV2_call_duration', [
      'versionId',
    ]),
    fetchCallDuration: newHistogramStat('fetch_call_duration', 'fetch_call_duration', [
      'versionId',
    ]),
    getTransformationCodeTime: newHistogramStat(
      'get_transformation_code_time',
      'get_transformation_code_time',
      ['versionId', 'version'],
    ),

    getTransformationCode: newCounterStat('get_transformation_code', 'get_transformation_code', [
      'versionId',
      'version',
      'success',
    ]),
    getLibrariesCodeTime: newHistogramStat('get_libraries_code_time', 'get_libraries_code_time', [
      'libraryVersionId',
      'versionId',
      'type',
    ]),

    getLibrariesCode: newCounterStat('get_libraries_code', 'get_libraries_code', [
      'libraryVersionId',
      'version',
      'type',
      'success',
    ]),
    isolateCpuTime: newHistogramStat('isolate_cpu_time', 'isolate_cpu_time', [
      'transformerVersionId',
      'version',
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),
    isolateWallTime: newHistogramStat('isolate_wall_time', 'isolate_wall_time', [
      'transformerVersionId',
      'version',
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),
    lambdaTestTime: newHistogramStat('lambda_test_time', 'lambda_test_time', [
      'transformerVersionId',
      'language',
      'publish',
    ]),
    lambdaInvokeTime: newHistogramStat('lambda_invoke_time', 'lambda_invoke_time', [
      'transformerVersionId',
      'language',
      'sourceType',
      'destinationType',
      'k8_namespace',
    ]),
    marketoBulkUploadProcessTime: newHistogramStat(
      'marketo_bulk_upload_process_time',
      'marketo_bulk_upload_process_time',
      ['action'],
    ),
    marketoBulkUploadUploadFileSize: newHistogramStat(
      'marketo_bulk_upload_upload_file_size',
      'marketo_bulk_upload_upload_file_size',
      [],
    ),
  };

  return metrics;
}

function getMetrics() {
  if (!metrics) {
    metrics = createMetrics();
  }
  return metrics;
}

module.exports = {
  prometheusRegistry,
  getMetrics,
};
