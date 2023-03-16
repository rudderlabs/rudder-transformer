const prometheusClient = require('prom-client');
const logger = require('../logger');

// TODO handle this
// const enableStats = process.env.ENABLE_STATS !== 'false';
// const instanceID = process.env.INSTANCE_ID || 'localhost';
// prefix: 'transformer',

class Prometheus {
  constructor() {
    this.prometheusRegistry = new prometheusClient.Registry();
    prometheusClient.collectDefaultMetrics({ register: this.prometheusRegistry });
    this.createMetrics();
  }

  newCounterStat(name, help, labelNames) {
    const counter = new prometheusClient.Counter({
      name,
      help,
      labelNames,
    });
    this.prometheusRegistry.registerMetric(counter);
    return counter;
  }

  newGaugeStat(name, help, labelNames) {
    const gauge = new prometheusClient.Gauge({
      name,
      help,
      labelNames,
    });
    this.prometheusRegistry.registerMetric(gauge);
    return gauge;
  }

  newSummaryStat(name, help, labelNames) {
    const summary = new prometheusClient.Summary({
      name,
      help,
      labelNames,
    });
    this.prometheusRegistry.registerMetric(summary);
    return summary;
  }

  newHistogramStat(name, help, labelNames) {
    const histogram = new prometheusClient.Histogram({
      name,
      help,
      labelNames,
    });
    this.prometheusRegistry.registerMetric(histogram);
    return histogram;
  }

  timing(name, start, tags = {}) {
    try {
      const metric = this.prometheusRegistry.getSingleMetric(name);
      if (!metric) {
        logger.error(`Prometheus: Timing metric ${name} not found in the registry`);
        return;
      }
      metric.inc(tags, (new Date() - start) / 1000);
    } catch (e) {
      logger.error(`Prometheus: Timing metric ${name} failed with error ${e}`);
    }
  }

  increment(name, delta = 1, tags = {}) {
    this.counter(name, delta, tags);
  }

  counter(name, delta, tags = {}) {
    try {
      const metric = this.prometheusRegistry.getSingleMetric(name);
      if (!metric) {
        logger.error(`Prometheus: Counter metric ${name} not found in the registry`);
        return;
      }
      metric.inc(tags, delta);
    } catch (e) {
      logger.error(`Prometheus: Counter metric ${name} failed with error ${e}`);
    }
  }

  gauge(name, value, tags = {}) {
    try {
      const metric = this.prometheusRegistry.getSingleMetric(name);
      if (!metric) {
        logger.error(`Prometheus: Gauge metric ${name} not found in the registry`);
        return;
      }
      metric.set(tags, value);
    } catch (e) {
      logger.error(`Prometheus: Gauge metric ${name} failed with error ${e}`);
    }
  }

  createMetrics() {
    // TODO
    // 1. cluster mode
    // 2. clear registry?
    this.metrics = new Map();

    // Counter stats
    this.metrics.set(
      'user_transform_input_events',
      this.newCounterStat(
        'user_transform_input_events',
        'Number of input events to user transform',
        ['processSessions'],
      ),
    );

    this.metrics.set(
      'cdk_live_compare_test_failed',
      this.newCounterStat('cdk_live_compare_test_failed', 'cdk_live_compare_test_failed', [
        'destType',
        'feature',
      ]),
    );

    this.metrics.set(
      'cdk_live_compare_test_success',
      this.newCounterStat('cdk_live_compare_test_success', 'cdk_live_compare_test_success', [
        'destType',
        'feature',
      ]),
    );

    this.metrics.set(
      'cdk_live_compare_test_errored',
      this.newCounterStat('cdk_live_compare_test_errored', 'cdk_live_compare_test_errored', [
        'destType',
        'feature',
      ]),
    );

    this.metrics.set(
      'hv_violation_type',
      this.newCounterStat('hv_violation_type', 'hv_violation_type', [
        'violationType',
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'hv_propagated_events',
      this.newCounterStat('hv_propagated_events', 'hv_propagated_events', [
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'hv_errors',
      this.newCounterStat('hv_errors', 'hv_errors', [
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'hv_events_count',
      this.newCounterStat('hv_events_count', 'hv_events_count', [
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'hv_request_size',
      this.newCounterStat('hv_request_size', 'hv_request_size', [
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'user_transform_function_group_size',
      this.newCounterStat(
        'user_transform_function_group_size',
        'user_transform_function_group_size',
        ['processSessions'],
      ),
    );

    this.metrics.set(
      'user_transform_function_input_events',
      this.newCounterStat(
        'user_transform_function_input_events',
        'user_transform_function_input_events',
        ['processSessions', 'sourceType', 'destinationType', 'k8_namespace'],
      ),
    );

    this.metrics.set(
      'user_transform_errors',
      this.newCounterStat('user_transform_errors', 'user_transform_errors', [
        'transformationVersionId',
        'processSessions',
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'dest_transform_requests',
      this.newCounterStat('dest_transform_requests', 'dest_transform_requests', [
        'destination',
        'version',
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'dest_transform_input_events',
      this.newCounterStat('dest_transform_input_events', 'dest_transform_input_events', [
        'destination',
        'version',
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'dest_transform_output_events',
      this.newCounterStat('dest_transform_output_events', 'dest_transform_output_events', [
        'destination',
        'version',
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'user_transform_requests',
      this.newCounterStat('user_transform_requests', 'user_transform_requests', [
        'processSessions',
      ]),
    );

    this.metrics.set(
      'user_transform_output_events',
      this.newCounterStat('user_transform_output_events', 'user_transform_output_events', [
        'processSessions',
      ]),
    );

    this.metrics.set(
      'source_transform_requests',
      this.newCounterStat('source_transform_requests', 'source_transform_requests', [
        'source',
        'version',
      ]),
    );

    this.metrics.set(
      'source_transform_input_events',
      this.newCounterStat('source_transform_input_events', 'source_transform_input_events', [
        'source',
        'version',
      ]),
    );

    this.metrics.set(
      'source_transform_output_events',
      this.newCounterStat('source_transform_output_events', 'source_transform_output_events', [
        'source',
        'version',
      ]),
    );

    this.metrics.set(
      'tf_proxy_dest_resp_count',
      this.newCounterStat('tf_proxy_dest_resp_count', 'tf_proxy_dest_resp_count', [
        'destination',
        'success',
      ]),
    );

    this.metrics.set(
      'marketo_bulk_upload_upload_file_jobs',
      this.newCounterStat(
        'marketo_bulk_upload_upload_file_jobs',
        'marketo_bulk_upload_upload_file_jobs',
        ['success'],
      ),
    );

    this.metrics.set(
      'create_zip_error',
      this.newCounterStat('create_zip_error', 'create_zip_error', ['fileName']),
    );

    this.metrics.set(
      'delete_zip_error',
      this.newCounterStat('delete_zip_error', 'delete_zip_error', ['functionName']),
    );

    this.metrics.set(
      'hv_metrics',
      this.newCounterStat('hv_metrics', 'hv_metrics', [
        'destination',
        'version',
        'sourceType',
        'destinationType',
        'k8_namespace',
        'dropped',
        'violationType',
      ]),
    );

    this.metrics.set(
      'events_into_vm',
      this.newCounterStat('events_into_vm', 'events_into_vm', [
        'transformerVersionId',
        'version',
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'missing_handle',
      this.newCounterStat('missing_handle', 'missing_handle', [
        'transformerVersionId',
        'language',
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'proxy_test_error',
      this.newCounterStat('proxy_test_error', 'proxy_test_error', ['destination']),
    );

    this.metrics.set(
      'proxy_test_payload_match',
      this.newCounterStat('proxy_test_payload_match', 'proxy_test_payload_match', ['destination']),
    );

    this.metrics.set(
      'tf_proxy_err_count',
      this.newCounterStat('tf_proxy_err_count', 'tf_proxy_err_count', ['destination']),
    );

    this.metrics.set(
      'tf_proxy_resp_handler_count',
      this.newCounterStat('tf_proxy_resp_handler_count', 'tf_proxy_resp_handler_count', [
        'destination',
      ]),
    );

    this.metrics.set(
      'tf_proxy_proc_ax_response_count',
      this.newCounterStat('tf_proxy_proc_ax_response_count', 'tf_proxy_proc_ax_response_count', [
        'destination',
      ]),
    );

    this.metrics.set(
      'tf_proxy_dest_req_count',
      this.newCounterStat('tf_proxy_dest_req_count', 'tf_proxy_dest_req_count', ['destination']),
    );

    this.metrics.set(
      'source_transform_errors',
      this.newCounterStat('source_transform_errors', 'source_transform_errors', [
        'source',
        'version',
      ]),
    );

    this.metrics.set(
      'marketo_bulk_upload_get_job_status',
      this.newCounterStat(
        'marketo_bulk_upload_get_job_status',
        'marketo_bulk_upload_get_job_status',
        ['status', 'state'],
      ),
    );

    this.metrics.set(
      'marketo_bulk_upload_upload_file',
      this.newCounterStat('marketo_bulk_upload_upload_file', 'marketo_bulk_upload_upload_file', [
        'status',
        'state',
      ]),
    );

    this.metrics.set(
      'marketo_bulk_upload_polling',
      this.newCounterStat('marketo_bulk_upload_polling', 'marketo_bulk_upload_polling', [
        'status',
        'state',
      ]),
    );

    this.metrics.set(
      'marketo_fetch_token',
      this.newCounterStat('marketo_fetch_token', 'marketo_fetch_token', ['status']),
    );

    this.metrics.set(
      'marketo_activity',
      this.newCounterStat('marketo_activity', 'marketo_activity', []),
    );

    this.metrics.set(
      'marketo_lead_lookup',
      this.newCounterStat('marketo_lead_lookup', 'marketo_lead_lookup', ['type', 'action']),
    );

    this.metrics.set(
      'dest_transform_invalid_dynamicConfig_count',
      this.newCounterStat(
        'dest_transform_invalid_dynamicConfig_count',
        'dest_transform_invalid_dynamicConfig_count',
        ['destinationType', 'destinationId'],
      ),
    );

    this.metrics.set(
      'shopify_client_side_identifier_event',
      this.newCounterStat(
        'shopify_client_side_identifier_event',
        'shopify_client_side_identifier_event',
        ['writeKey', 'timestamp'],
      ),
    );

    this.metrics.set(
      'shopify_server_side_identifier_event',
      this.newCounterStat(
        'shopify_server_side_identifier_event',
        'shopify_server_side_identifier_event',
        ['writeKey', 'timestamp'],
      ),
    );

    this.metrics.set(
      'fb_pixel_timestamp_error',
      this.newCounterStat('fb_pixel_timestamp_error', 'fb_pixel_timestamp_error', [
        'destinationId',
      ]),
    );

    this.metrics.set(
      'get_eventSchema_error',
      this.newCounterStat('get_eventSchema_error', 'get_eventSchema_error', []),
    );

    this.metrics.set(
      'get_tracking_plan_error',
      this.newCounterStat('get_tracking_plan_error', 'get_tracking_plan_error', []),
    );

    // Gauge stats
    this.metrics.set(
      'v0_transformation_time',
      this.newGaugeStat('v0_transformation_time', 'v0_transformation_time', [
        'destType',
        'feature',
      ]),
    );

    this.metrics.set(
      'cdk_transformation_time',
      this.newGaugeStat('cdk_transformation_time', 'cdk_transformation_time', [
        'destType',
        'feature',
      ]),
    );

    // Summary stats
    this.metrics.set(
      'http_request_duration',
      this.newHistogramStat(
        'http_request_duration',
        'Summary of HTTP requests duration in seconds',
        ['method', 'route', 'code'],
      ),
    );

    // Histogram stats
    this.metrics.set(
      'hv_request_latency',
      this.newHistogramStat('hv_request_latency', 'hv_request_latency', [
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'cdk_events_latency',
      this.newHistogramStat('cdk_events_latency', 'cdk_events_latency', [
        'destination',
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'hv_event_latency',
      this.newHistogramStat('hv_event_latency', 'hv_event_latency', [
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'dest_transform_request_latency',
      this.newHistogramStat('dest_transform_request_latency', 'dest_transform_request_latency', [
        'destination',
        'version',
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'user_transform_request_latency',
      this.newHistogramStat('user_transform_request_latency', 'user_transform_request_latency', [
        'processSessions',
      ]),
    );

    this.metrics.set(
      'user_transform_function_latency',
      this.newHistogramStat('user_transform_function_latency', 'user_transform_function_latency', [
        'transformationVersionId',
        'processSessions',
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'source_transform_request_latency',
      this.newHistogramStat(
        'source_transform_request_latency',
        'source_transform_request_latency',
        ['source', 'version'],
      ),
    );

    this.metrics.set(
      'transformer_proxy_time',
      this.newHistogramStat('transformer_proxy_time', 'transformer_proxy_time', ['destination']),
    );

    this.metrics.set(
      'transformer_total_proxy_latency',
      this.newHistogramStat('transformer_total_proxy_latency', 'transformer_total_proxy_latency', [
        'destination',
        'version',
      ]),
    );

    this.metrics.set(
      'creation_time',
      this.newHistogramStat('creation_time', 'creation_time', [
        'transformerVersionId',
        'language',
        'identifier',
        'publish',
        'testMode',
      ]),
    );

    this.metrics.set(
      'run_time',
      this.newHistogramStat('run_time', 'run_time', [
        'transformerVersionId',
        'language',
        'identifier',
        'publish',
        'testMode',
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'get_tracking_plan',
      this.newHistogramStat('get_tracking_plan', 'get_tracking_plan', []),
    );

    this.metrics.set(
      'createivm_duration',
      this.newHistogramStat('createivm_duration', 'createivm_duration', []),
    );

    this.metrics.set(
      'fetchV2_call_duration',
      this.newHistogramStat('fetchV2_call_duration', 'fetchV2_call_duration', ['versionId']),
    );

    this.metrics.set(
      'fetch_call_duration',
      this.newHistogramStat('fetch_call_duration', 'fetch_call_duration', ['versionId']),
    );

    this.metrics.set(
      'get_transformation_code_time',
      this.newHistogramStat('get_transformation_code_time', 'get_transformation_code_time', [
        'versionId',
        'version',
      ]),
    );

    this.metrics.set(
      'get_transformation_code',
      this.newCounterStat('get_transformation_code', 'get_transformation_code', [
        'versionId',
        'version',
        'success',
      ]),
    );

    this.metrics.set(
      'get_libraries_code_time',
      this.newHistogramStat('get_libraries_code_time', 'get_libraries_code_time', [
        'libraryVersionId',
        'versionId',
        'type',
      ]),
    );

    this.metrics.set(
      'get_libraries_code',
      this.newCounterStat('get_libraries_code', 'get_libraries_code', [
        'libraryVersionId',
        'version',
        'type',
        'success',
      ]),
    );

    this.metrics.set(
      'isolate_cpu_time',
      this.newHistogramStat('isolate_cpu_time', 'isolate_cpu_time', [
        'transformerVersionId',
        'version',
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'isolate_wall_time',
      this.newHistogramStat('isolate_wall_time', 'isolate_wall_time', [
        'transformerVersionId',
        'version',
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'lambda_test_time',
      this.newHistogramStat('lambda_test_time', 'lambda_test_time', [
        'transformerVersionId',
        'language',
        'publish',
      ]),
    );

    this.metrics.set(
      'lambda_invoke_time',
      this.newHistogramStat('lambda_invoke_time', 'lambda_invoke_time', [
        'transformerVersionId',
        'language',
        'sourceType',
        'destinationType',
        'k8_namespace',
      ]),
    );

    this.metrics.set(
      'marketo_bulk_upload_process_time',
      this.newHistogramStat(
        'marketo_bulk_upload_process_time',
        'marketo_bulk_upload_process_time',
        ['action'],
      ),
    );

    this.metrics.set(
      'marketo_bulk_upload_upload_file_size',
      this.newHistogramStat(
        'marketo_bulk_upload_upload_file_size',
        'marketo_bulk_upload_upload_file_size',
        [],
      ),
    );
  }
}

module.exports = {
  Prometheus,
};
