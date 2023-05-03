const prometheusClient = require('prom-client');
const logger = require('../logger');

const clusterEnabled = process.env.CLUSTER_ENABLED !== 'false';
const instanceID = process.env.INSTANCE_ID || 'localhost';
const prefix = 'transformer';
const defaultLabels = { instanceName: instanceID };

function appendPrefix(name) {
  return `${prefix}_${name}`;
}

class Prometheus {
  constructor() {
    this.prometheusRegistry = new prometheusClient.Registry();
    this.prometheusRegistry.setDefaultLabels(defaultLabels);
    prometheusClient.collectDefaultMetrics({
      register: this.prometheusRegistry,
    });

    prometheusClient.AggregatorRegistry.setRegistries(this.prometheusRegistry);
    this.aggregatorRegistry = new prometheusClient.AggregatorRegistry();

    this.createMetrics();
  }

  async metricsController(ctx) {
    ctx.status = 200;
    if (clusterEnabled) {
      ctx.type = this.aggregatorRegistry.contentType;
      ctx.body = await this.aggregatorRegistry.clusterMetrics();
    } else {
      ctx.type = this.prometheusRegistry.contentType;
      ctx.body = await this.prometheusRegistry.metrics();
    }
    return ctx.body;
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

  newHistogramStat(name, help, labelNames, buckets) {
    let histogram;
    if (buckets) {
      histogram = new prometheusClient.Histogram({
        name,
        help,
        labelNames,
        buckets,
      });
    } else {
      histogram = new prometheusClient.Histogram({
        name,
        help,
        labelNames,
      });
    }

    this.prometheusRegistry.registerMetric(histogram);
    return histogram;
  }

  timing(name, start, tags = {}) {
    try {
      const metric = this.prometheusRegistry.getSingleMetric(appendPrefix(name));
      if (!metric) {
        logger.error(`Prometheus: Timing metric ${name} not found in the registry`);
        return;
      }
      metric.observe(tags, (new Date() - start) / 1000);
    } catch (e) {
      logger.error(`Prometheus: Timing metric ${name} failed with error ${e}`);
    }
  }

  histogram(name, value, tags = {}) {
    try {
      const metric = this.prometheusRegistry.getSingleMetric(appendPrefix(name));
      if (!metric) {
        logger.error(`Prometheus: Histogram metric ${name} not found in the registry`);
        return;
      }
      metric.observe(tags, value);
    } catch (e) {
      logger.error(`Prometheus: Histogram metric ${name} failed with error ${e}`);
    }
  }

  increment(name, tags = {}) {
    this.counter(name, 1, tags);
  }

  counter(name, delta, tags = {}) {
    try {
      const metric = this.prometheusRegistry.getSingleMetric(appendPrefix(name));
      if (!metric) {
        logger.error(`Prometheus: Counter metric ${name} not found in the registry`);
        return;
      }
      metric.inc(tags, delta);
    } catch (e) {
      logger.error(`Prometheus: Counter metric ${name} failed with error ${e}. Value: ${delta}`);
    }
  }

  gauge(name, value, tags = {}) {
    try {
      const metric = this.prometheusRegistry.getSingleMetric(appendPrefix(name));
      if (!metric) {
        logger.error(`Prometheus: Gauge metric ${name} not found in the registry`);
        return;
      }
      metric.set(tags, value);
    } catch (e) {
      logger.error(`Prometheus: Gauge metric ${name} failed with error ${e}. Value: ${value}`);
    }
  }

  createMetrics() {
    const metrics = [
      // Counters
      {
        name: 'cdk_live_compare_test_failed',
        help: 'cdk_live_compare_test_failed',
        type: 'counter',
        labelNames: ['destType', 'feature'],
      },
      {
        name: 'cdk_live_compare_test_success',
        help: 'cdk_live_compare_test_success',
        type: 'counter',
        labelNames: ['destType', 'feature'],
      },
      {
        name: 'cdk_live_compare_test_errored',
        help: 'cdk_live_compare_test_errored',
        type: 'counter',
        labelNames: ['destType', 'feature'],
      },
      {
        name: 'hv_violation_type',
        help: 'hv_violation_type',
        type: 'counter',
        labelNames: ['violationType', 'sourceType', 'destinationType', 'k8_namespace'],
      },
      {
        name: 'hv_propagated_events',
        help: 'hv_propagated_events',
        type: 'counter',
        labelNames: ['sourceType', 'destinationType', 'k8_namespace'],
      },
      {
        name: 'hv_errors',
        help: 'hv_errors',
        type: 'counter',
        labelNames: ['sourceType', 'destinationType', 'k8_namespace'],
      },
      {
        name: 'hv_events_count',
        help: 'hv_events_count',
        type: 'counter',
        labelNames: ['sourceType', 'destinationType', 'k8_namespace'],
      },
      {
        name: 'user_transform_function_group_size',
        help: 'user_transform_function_group_size',
        type: 'counter',
        labelNames: ['processSessions'],
      },
      {
        name: 'user_transform_function_input_events',
        help: 'user_transform_function_input_events',
        type: 'counter',
        labelNames: ['processSessions', 'sourceType', 'destinationType', 'k8_namespace'],
      },
      {
        name: 'user_transform_errors',
        help: 'user_transform_errors',
        type: 'counter',
        labelNames: ['l1', 'l2'],
      },
      {
        name: 'c2',
        help: 'h2',
        type: 'counter',
        labelNames: [
          'transformationVersionId',
          'processSessions',
          'sourceType',
          'destinationType',
          'k8_namespace',
        ],
      },
      {
        name: 'dest_transform_requests',
        help: 'dest_transform_requests',
        type: 'counter',
        labelNames: ['destination', 'version', 'sourceType', 'destinationType', 'k8_namespace'],
      },
      {
        name: 'user_transform_requests',
        help: 'user_transform_requests',
        type: 'counter',
        labelNames: ['processSessions'],
      },
      {
        name: 'source_transform_requests',
        help: 'source_transform_requests',
        type: 'counter',
        labelNames: ['source', 'version'],
      },
      {
        name: 'source_transform_input_events',
        help: 'source_transform_input_events',
        type: 'counter',
        labelNames: ['source', 'version'],
      },
      {
        name: 'source_transform_output_events',
        help: 'source_transform_output_events',
        type: 'counter',
        labelNames: ['source', 'version'],
      },
      {
        name: 'tf_proxy_dest_resp_count',
        help: 'tf_proxy_dest_resp_count',
        type: 'counter',
        labelNames: ['destination', 'success'],
      },
      {
        name: 'marketo_bulk_upload_upload_file_jobs',
        help: 'marketo_bulk_upload_upload_file_jobs',
        type: 'counter',
        labelNames: ['success'],
      },
      {
        name: 'create_zip_error',
        help: 'create_zip_error',
        type: 'counter',
        labelNames: ['fileName'],
      },
      {
        name: 'delete_zip_error',
        help: 'delete_zip_error',
        type: 'counter',
        labelNames: ['functionName'],
      },
      {
        name: 'hv_metrics',
        help: 'hv_metrics',
        type: 'counter',
        labelNames: [
          'destination',
          'version',
          'sourceType',
          'destinationType',
          'k8_namespace',
          'dropped',
          'violationType',
        ],
      },
      {
        name: 'events_into_vm',
        help: 'events_into_vm',
        type: 'counter',
        labelNames: [
          'transformerVersionId',
          'version',
          'sourceType',
          'destinationType',
          'k8_namespace',
        ],
      },
      {
        name: 'missing_handle',
        help: 'missing_handle',
        type: 'counter',
        labelNames: [
          'transformerVersionId',
          'language',
          'sourceType',
          'destinationType',
          'k8_namespace',
        ],
      },
      {
        name: 'proxy_test_error',
        help: 'proxy_test_error',
        type: 'counter',
        labelNames: ['destination'],
      },
      {
        name: 'proxy_test_payload_match',
        help: 'proxy_test_payload_match',
        type: 'counter',
        labelNames: ['destination'],
      },
      {
        name: 'tf_proxy_err_count',
        help: 'tf_proxy_err_count',
        type: 'counter',
        labelNames: ['destination'],
      },
      {
        name: 'tf_proxy_resp_handler_count',
        help: 'tf_proxy_resp_handler_count',
        type: 'counter',
        labelNames: ['destination'],
      },
      {
        name: 'tf_proxy_proc_ax_response_count',
        help: 'tf_proxy_proc_ax_response_count',
        type: 'counter',
        labelNames: ['destination'],
      },
      {
        name: 'tf_proxy_dest_req_count',
        help: 'tf_proxy_dest_req_count',
        type: 'counter',
        labelNames: ['destination'],
      },
      {
        name: 'source_transform_errors',
        help: 'source_transform_errors',
        type: 'counter',
        labelNames: ['source', 'version'],
      },
      {
        name: 'marketo_bulk_upload_get_job_status',
        help: 'marketo_bulk_upload_get_job_status',
        type: 'counter',
        labelNames: ['status', 'state'],
      },
      {
        name: 'marketo_bulk_upload_upload_file',
        help: 'marketo_bulk_upload_upload_file',
        type: 'counter',
        labelNames: ['status', 'state'],
      },
      {
        name: 'marketo_bulk_upload_polling',
        help: 'marketo_bulk_upload_polling',
        type: 'counter',
        labelNames: ['status', 'state'],
      },
      {
        name: 'marketo_fetch_token',
        help: 'marketo_fetch_token',
        type: 'counter',
        labelNames: ['status'],
      },
      { name: 'marketo_activity', help: 'marketo_activity', type: 'counter', labelNames: [] },
      {
        name: 'marketo_lead_lookup',
        help: 'marketo_lead_lookup',
        type: 'counter',
        labelNames: ['type', 'action'],
      },
      {
        name: 'dest_transform_invalid_dynamicConfig_count',
        help: 'dest_transform_invalid_dynamicConfig_count',
        type: 'counter',
        labelNames: ['destinationType', 'destinationId'],
      },
      {
        name: 'shopify_client_side_identifier_event',
        help: 'shopify_client_side_identifier_event',
        type: 'counter',
        labelNames: ['writeKey', 'timestamp'],
      },
      {
        name: 'shopify_server_side_identifier_event',
        help: 'shopify_server_side_identifier_event',
        type: 'counter',
        labelNames: ['writeKey', 'timestamp'],
      },
      {
        name: 'fb_pixel_timestamp_error',
        help: 'fb_pixel_timestamp_error',
        type: 'counter',
        labelNames: ['destinationId'],
      },
      {
        name: 'get_eventSchema_error',
        help: 'get_eventSchema_error',
        type: 'counter',
        labelNames: [],
      },
      {
        name: 'get_tracking_plan_error',
        help: 'get_tracking_plan_error',
        type: 'counter',
        labelNames: [],
      },

      // Gauges
      {
        name: 'v0_transformation_time',
        help: 'v0_transformation_time',
        type: 'gauge',
        labelNames: ['destType', 'feature'],
      },
      {
        name: 'cdk_transformation_time',
        help: 'cdk_transformation_time',
        type: 'gauge',
        labelNames: ['destType', 'feature'],
      },

      // Histograms
      {
        name: 'http_request_duration',
        help: 'Summary of HTTP requests duration in seconds',
        type: 'histogram',
        labelNames: ['method', 'route', 'code'],
      },
      {
        name: 'hv_request_size',
        help: 'hv_request_size',
        type: 'histogram',
        labelNames: ['sourceType', 'destinationType', 'k8_namespace'],
      },
      {
        name: 'hv_request_latency',
        help: 'hv_request_latency',
        type: 'histogram',
        labelNames: ['sourceType', 'destinationType', 'k8_namespace'],
      },
      {
        name: 'cdk_events_latency',
        help: 'cdk_events_latency',
        type: 'histogram',
        labelNames: ['destination', 'sourceType', 'destinationType', 'k8_namespace'],
      },
      {
        name: 'hv_event_latency',
        help: 'hv_event_latency',
        type: 'histogram',
        labelNames: ['sourceType', 'destinationType', 'k8_namespace'],
      },
      {
        name: 'dest_transform_request_latency',
        help: 'dest_transform_request_latency',
        type: 'histogram',
        labelNames: ['destination', 'version', 'sourceType', 'destinationType', 'k8_namespace'],
      },
      {
        name: 'user_transform_request_latency',
        help: 'user_transform_request_latency',
        type: 'histogram',
        labelNames: ['processSessions'],
      },
      {
        name: 'user_transform_function_latency',
        help: 'user_transform_function_latency',
        type: 'histogram',
        labelNames: [
          'transformationVersionId',
          'processSessions',
          'sourceType',
          'destinationType',
          'k8_namespace',
        ],
      },
      {
        name: 'source_transform_request_latency',
        help: 'source_transform_request_latency',
        type: 'histogram',
        labelNames: ['source', 'version'],
      },
      {
        name: 'transformer_proxy_time',
        help: 'transformer_proxy_time',
        type: 'histogram',
        labelNames: ['destination'],
      },
      {
        name: 'transformer_total_proxy_latency',
        help: 'transformer_total_proxy_latency',
        type: 'histogram',
        labelNames: ['destination', 'version'],
      },
      {
        name: 'creation_time',
        help: 'creation_time',
        type: 'histogram',
        labelNames: ['transformerVersionId', 'language', 'identifier', 'publish', 'testMode'],
      },
      {
        name: 'run_time',
        help: 'run_time',
        type: 'histogram',
        labelNames: [
          'transformerVersionId',
          'language',
          'identifier',
          'publish',
          'testMode',
          'sourceType',
          'destinationType',
          'k8_namespace',
        ],
      },
      { name: 'get_tracking_plan', help: 'get_tracking_plan', type: 'histogram', labelNames: [] },
      { name: 'createivm_duration', help: 'createivm_duration', type: 'histogram', labelNames: [] },
      {
        name: 'fetchV2_call_duration',
        help: 'fetchV2_call_duration',
        type: 'histogram',
        labelNames: ['versionId'],
      },
      {
        name: 'fetch_call_duration',
        help: 'fetch_call_duration',
        type: 'histogram',
        labelNames: ['versionId'],
      },
      {
        name: 'get_transformation_code_time',
        help: 'get_transformation_code_time',
        type: 'histogram',
        labelNames: ['versionId', 'version'],
      },
      {
        name: 'get_transformation_code',
        help: 'get_transformation_code',
        type: 'histogram',
        labelNames: ['versionId', 'version', 'success'],
      },
      {
        name: 'get_libraries_code_time',
        help: 'get_libraries_code_time',
        type: 'histogram',
        labelNames: ['libraryVersionId', 'versionId', 'type'],
      },
      {
        name: 'get_libraries_code',
        help: 'get_libraries_code',
        type: 'histogram',
        labelNames: ['libraryVersionId', 'version', 'type', 'success'],
      },
      {
        name: 'isolate_cpu_time',
        help: 'isolate_cpu_time',
        type: 'histogram',
        labelNames: [
          'transformerVersionId',
          'version',
          'sourceType',
          'destinationType',
          'k8_namespace',
        ],
      },
      {
        name: 'isolate_wall_time',
        help: 'isolate_wall_time',
        type: 'histogram',
        labelNames: [
          'transformerVersionId',
          'version',
          'sourceType',
          'destinationType',
          'k8_namespace',
        ],
      },
      {
        name: 'lambda_test_time',
        help: 'lambda_test_time',
        type: 'histogram',
        labelNames: ['transformerVersionId', 'language', 'publish'],
      },
      {
        name: 'lambda_invoke_time',
        help: 'lambda_invoke_time',
        type: 'histogram',
        labelNames: [
          'transformerVersionId',
          'language',
          'sourceType',
          'destinationType',
          'k8_namespace',
        ],
      },
      {
        name: 'marketo_bulk_upload_process_time',
        help: 'marketo_bulk_upload_process_time',
        type: 'histogram',
        labelNames: ['action'],
      },
      {
        name: 'marketo_bulk_upload_upload_file_size',
        help: 'marketo_bulk_upload_upload_file_size',
        type: 'histogram',
        labelNames: [],
      },
      {
        name: 'braze_lookup_time',
        help: 'braze look-up time',
        type: 'histogram',
        labelNames: ['destination_id'],
      },
      {
        name: 'braze_lookup_count',
        help: 'braze look-up count',
        type: 'histogram',
        labelNames: ['destination_id'],
        buckets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      {
        name: 'braze_lookup_user_count',
        help: 'braze look-up user count',
        type: 'histogram',
        labelNames: ['destination_id'],
        buckets: [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400,
          500, 600, 700, 800, 900, 1000,
        ],
      },
      {
        name: 'http_request_size',
        help: 'http_request_size',
        type: 'histogram',
        labelNames: ['method', 'route', 'code'],
        buckets: [
          1000, 10000, 100000, 500000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000,
          4000000, 4500000, 5000000, 10000000, 15000000, 20000000, 25000000, 30000000, 35000000,
          40000000, 45000000, 50000000,
        ],
      },
      {
        name: 'http_response_size',
        help: 'http_response_size',
        type: 'histogram',
        labelNames: ['method', 'route', 'code'],
        buckets: [
          1000, 10000, 100000, 500000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000,
          4000000, 4500000, 5000000, 10000000, 15000000, 20000000, 25000000, 30000000, 35000000,
          40000000, 45000000, 50000000,
        ],
      },
      {
        name: 'dest_transform_input_events',
        help: 'dest_transform_input_events',
        type: 'histogram',
        labelNames: ['destination', 'version', 'sourceType', 'destinationType', 'k8_namespace'],
        buckets: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200],
      },
      {
        name: 'dest_transform_output_events',
        help: 'dest_transform_output_events',
        type: 'histogram',
        labelNames: ['destination', 'version', 'sourceType', 'destinationType', 'k8_namespace'],
        buckets: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200],
      },
      {
        name: 'user_transform_input_events',
        help: 'Number of input events to user transform',
        type: 'histogram',
        labelNames: ['processSessions'],
        buckets: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200],
      },
      {
        name: 'user_transform_output_events',
        help: 'user_transform_output_events',
        type: 'histogram',
        labelNames: ['processSessions'],
        buckets: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200],
      },
    ];

    metrics.forEach((metric) => {
      try {
        if (metric.type === 'counter') {
          this.newCounterStat(appendPrefix(metric.name), metric.help, metric.labelNames);
        } else if (metric.type === 'gauge') {
          this.newGaugeStat(appendPrefix(metric.name), metric.help, metric.labelNames);
        } else if (metric.type === 'histogram') {
          this.newHistogramStat(
            appendPrefix(metric.name),
            metric.help,
            metric.labelNames,
            metric.buckets,
          );
        } else {
          logger.error(
            `Prometheus: Metric creation failed. Name: ${metric.name}. Invalid type: ${metric.type}`,
          );
        }
      } catch (e) {
        logger.error(`Prometheus: Metric creation failed. Name: ${metric.name}. Error ${e}`);
      }
    });
  }
}

module.exports = {
  Prometheus,
};
