const prometheusClient = require('prom-client');
const logger = require('../logger');
const { MetricsAggregator } = require('./metricsAggregator');

const clusterEnabled = process.env.CLUSTER_ENABLED !== 'false';
const useMetricsAggregator = process.env.USE_METRICS_AGGREGATOR === 'true';
const instanceID = process.env.INSTANCE_ID || 'localhost';
const prefix = 'transformer';
const defaultLabels = { instanceName: instanceID };

function appendPrefix(name) {
  return `${prefix}_${name}`;
}

class Prometheus {
  constructor(enableSummaryMetrics = true) {
    if (clusterEnabled && useMetricsAggregator) {
      this.metricsAggregator = new MetricsAggregator(this);
    }
    this.prometheusRegistry = new prometheusClient.Registry();
    this.prometheusRegistry.setDefaultLabels(defaultLabels);
    prometheusClient.collectDefaultMetrics({
      register: this.prometheusRegistry,
    });

    prometheusClient.AggregatorRegistry.setRegistries(this.prometheusRegistry);
    this.aggregatorRegistry = new prometheusClient.AggregatorRegistry();

    this.createMetrics(enableSummaryMetrics);
  }

  async metricsController(ctx) {
    ctx.status = 200;
    if (clusterEnabled) {
      if (useMetricsAggregator) {
        ctx.type = this.prometheusRegistry.contentType;
        ctx.body = await this.metricsAggregator.aggregateMetrics();
      } else {
        ctx.type = this.aggregatorRegistry.contentType;
        ctx.body = await this.aggregatorRegistry.clusterMetrics();
      }
    } else {
      ctx.type = this.prometheusRegistry.contentType;
      ctx.body = await this.prometheusRegistry.metrics();
    }
    return ctx.body;
  }

  async resetMetricsController(ctx) {
    ctx.status = 200;
    if (clusterEnabled && useMetricsAggregator) {
      this.metricsAggregator.resetMetrics();
    }
    ctx.body = 'Metrics reset';
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

  newSummaryStat(
    name,
    help,
    labelNames,
    percentiles = [0.5, 0.9, 0.99],
    maxAgeSeconds = 300,
    ageBuckets = 5,
  ) {
    // we enable a 5 minute sliding window and calculate the 50th, 90th, and 99th percentiles by default
    const summary = new prometheusClient.Summary({
      name,
      help,
      labelNames,
      percentiles,
      maxAgeSeconds,
      ageBuckets,
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

  summary(name, value, tags = {}) {
    try {
      let metric = this.prometheusRegistry.getSingleMetric(appendPrefix(name));
      if (!metric) {
        logger.warn(
          `Prometheus: Summary metric ${name} not found in the registry. Creating a new one`,
        );
        metric = this.newSummaryStat(name, name, Object.keys(tags));
      }
      metric.observe(tags, value);
    } catch (e) {
      logger.error(`Prometheus: Summary metric ${name} failed with error ${e}`);
    }
  }

  timing(name, start, tags = {}) {
    try {
      let metric = this.prometheusRegistry.getSingleMetric(appendPrefix(name));
      if (!metric) {
        logger.warn(
          `Prometheus: Timing metric ${name} not found in the registry. Creating a new one`,
        );
        metric = this.newHistogramStat(name, name, Object.keys(tags));
      }
      metric.observe(tags, (new Date() - start) / 1000);
    } catch (e) {
      logger.error(`Prometheus: Timing metric ${name} failed with error ${e}`);
    }
  }

  timingSummary(name, start, tags = {}) {
    try {
      let metric = this.prometheusRegistry.getSingleMetric(appendPrefix(name));
      if (!metric) {
        logger.warn(
          `Prometheus: summary metric ${name} not found in the registry. Creating a new one`,
        );
        metric = this.newSummaryStat(name, name, Object.keys(tags));
      }
      metric.observe(tags, (new Date() - start) / 1000);
    } catch (e) {
      logger.error(`Prometheus: Summary metric ${name} failed with error ${e}`);
    }
  }

  histogram(name, value, tags = {}) {
    try {
      let metric = this.prometheusRegistry.getSingleMetric(appendPrefix(name));
      if (!metric) {
        logger.warn(
          `Prometheus: Histogram metric ${name} not found in the registry. Creating a new one`,
        );
        metric = this.newHistogramStat(name, name, Object.keys(tags));
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
      let metric = this.prometheusRegistry.getSingleMetric(appendPrefix(name));
      if (!metric) {
        logger.warn(
          `Prometheus: Counter metric ${name} not found in the registry. Creating a new one`,
        );
        metric = this.newCounterStat(name, name, Object.keys(tags));
      }
      metric.inc(tags, delta);
    } catch (e) {
      logger.error(`Prometheus: Counter metric ${name} failed with error ${e}. Value: ${delta}`);
    }
  }

  gauge(name, value, tags = {}) {
    try {
      let metric = this.prometheusRegistry.getSingleMetric(appendPrefix(name));
      if (!metric) {
        logger.warn(
          `Prometheus: Gauge metric ${name} not found in the registry. Creating a new one`,
        );
        metric = this.newGaugeStat(name, name, Object.keys(tags));
      }
      metric.set(tags, value);
    } catch (e) {
      logger.error(`Prometheus: Gauge metric ${name} failed with error ${e}. Value: ${value}`);
    }
  }

  async shutdown() {
    if (this.metricsAggregator) {
      await this.metricsAggregator.shutdown();
    }
  }

  createMetrics(enableSummaryMetrics) {
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
        name: 'event_transform_success',
        help: 'event_transform_success',
        type: 'counter',
        labelNames: [
          'destType',
          'module',
          'destinationId',
          'workspaceId',
          'feature',
          'implementation',
        ],
      },
      {
        name: 'event_transform_failure',
        help: 'event_transform_failure',
        type: 'counter',
        labelNames: [
          'destType',
          'module',
          'destinationId',
          'workspaceId',
          'feature',
          'implementation',
        ],
      },
      {
        name: 'dest_transform_requests',
        help: 'dest_transform_requests',
        type: 'counter',
        labelNames: ['destination', 'version', 'sourceType', 'destinationType', 'k8_namespace'],
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
        labelNames: ['status', 'state', 'requestTime'],
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
        name: 'regulation_worker_user_deletion_failure',
        help: 'regulation_worker_user_deletion_failure',
        type: 'counter',
        labelNames: ['destType', 'module', 'implementation', 'feature'],
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
        name: 'redis_error',
        help: 'redis_error',
        type: 'counter',
        labelNames: ['operation'],
      },
      {
        name: 'shopify_redis_failures',
        help: 'shopify_redis_failures',
        type: 'counter',
        labelNames: ['type', 'writeKey', 'source'],
      },
      {
        name: 'shopify_anon_id_resolve',
        help: 'shopify_anon_id_resolve',
        type: 'counter',
        labelNames: ['method', 'writeKey', 'shopifyTopic', 'source'],
      },
      {
        name: 'shopify_redis_calls',
        help: 'shopify_redis_calls',
        type: 'counter',
        labelNames: ['type', 'writeKey', 'source', 'field'],
      },
      {
        name: 'shopify_redis_no_val',
        help: 'shopify_redis_no_val',
        type: 'counter',
        labelNames: ['writeKey', 'source', 'event'],
      },
      {
        name: 'invalid_shopify_event',
        help: 'invalid_shopify_event',
        type: 'counter',
        labelNames: ['writeKey', 'source', 'shopifyTopic'],
      },
      {
        name: 'shopify_pixel_cart_token_not_found',
        help: 'shopify_pixel_cart_token_not_found',
        type: 'counter',
        labelNames: ['event', 'writeKey'],
      },
      {
        name: 'shopify_pixel_cart_token_set',
        help: 'shopify_pixel_cart_token_set',
        type: 'counter',
        labelNames: ['event', 'writeKey'],
      },
      {
        name: 'shopify_pixel_cart_token_redis_error',
        help: 'shopify_pixel_cart_token_redis_error',
        type: 'counter',
        labelNames: ['event', 'writeKey'],
      },
      {
        name: 'shopify_pixel_id_stitch_gaps',
        help: 'shopify_pixel_id_stitch_gaps',
        type: 'counter',
        labelNames: ['event', 'reason', 'source', 'writeKey'],
      },
      {
        name: 'shopify_pixel_userid_mapping',
        help: 'shopify_pixel_userid_mapping',
        type: 'counter',
        labelNames: ['action', 'operation'],
      },
      {
        name: 'shopify_pixel_cart_token_mapping',
        help: 'shopify_pixel_cart_token_mapping',
        type: 'counter',
        labelNames: ['action', 'operation'],
      },
      {
        name: 'outgoing_request_count',
        help: 'Outgoing HTTP requests count',
        type: 'counter',
        labelNames: [
          'feature',
          'destType',
          'endpointPath',
          'success',
          'statusCode',
          'requestMethod',
          'module',
          'workspaceId',
          'destinationId',
          'module',
          'implementation',
          'sourceId',
        ],
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
      {
        name: 'braze_batch_attributes_pack_size',
        help: 'braze_batch_attributes_pack_size',
        type: 'gauge',
        labelNames: ['destination_id'],
      },
      {
        name: 'braze_batch_events_pack_size',
        help: 'braze_batch_events_pack_size',
        type: 'gauge',
        labelNames: ['destination_id'],
      },
      {
        name: 'braze_batch_purchase_pack_size',
        help: 'braze_batch_purchase_pack_size',
        type: 'gauge',
        labelNames: ['destination_id'],
      },
      {
        name: 'braze_alias_failure_count',
        help: 'braze_alias_failure_count',
        type: 'counter',
        labelNames: ['destination_id'],
      },
      {
        name: 'braze_alias_missconfigured_count',
        help: 'braze_alias_missconfigured_count',
        type: 'counter',
        labelNames: ['destination_id'],
      },
      {
        name: 'braze_batch_subscription_size',
        help: 'braze_batch_subscription_size',
        type: 'gauge',
        labelNames: ['destination_id'],
      },
      {
        name: 'braze_batch_subscription_combined_size',
        help: 'braze_batch_subscription_combined_size',
        type: 'gauge',
        labelNames: ['destination_id'],
      },
      {
        name: 'mailjet_packing_size',
        help: 'mailjet_packing_size',
        type: 'gauge',
        labelNames: ['group'],
      },
      {
        name: 'hs_batch_size',
        help: 'hs_batch_size',
        type: 'gauge',
        labelNames: ['destination_id'],
      },
      {
        name: 'mixpanel_batch_engage_pack_size',
        help: 'mixpanel_batch_engage_pack_size',
        type: 'gauge',
        labelNames: ['destination_id'],
      },
      {
        name: 'mixpanel_batch_group_pack_size',
        help: 'mixpanel_batch_group_pack_size',
        type: 'gauge',
        labelNames: ['destination_id'],
      },
      {
        name: 'mixpanel_batch_import_pack_size',
        help: 'mixpanel_batch_import_pack_size',
        type: 'gauge',
        labelNames: ['destination_id'],
      },

      // Histograms
      {
        name: 'outgoing_request_latency',
        help: 'Outgoing HTTP requests duration in seconds',
        type: 'histogram',
        labelNames: [
          'feature',
          'destType',
          'endpointPath',
          'requestMethod',
          'module',
          'workspaceId',
          'destinationId',
          'module',
          'implementation',
          'sourceId',
        ],
      },
      {
        name: 'http_request_duration',
        help: 'Incoming HTTP requests duration in seconds',
        type: 'histogram',
        labelNames: ['method', 'route', 'code', 'destType'],
      },
      {
        name: 'cdk_events_latency',
        help: 'cdk_events_latency',
        type: 'histogram',
        labelNames: ['destination', 'sourceType', 'destinationType', 'k8_namespace'],
      },
      {
        name: 'regulation_worker_requests_dest_latency',
        help: 'regulation_worker_requests_dest_latency',
        type: 'histogram',
        labelNames: ['feature', 'implementation', 'destType'],
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
        name: 'braze_partial_failure',
        help: 'braze_partial_failure',
        type: 'counter',
        labelNames: [],
      },
      {
        name: 'braze_deduped_users_count',
        help: 'braze deduped users count',
        type: 'counter',
        labelNames: ['destination_id'],
      },
      {
        name: 'braze_dedup_and_drop_count',
        help: 'braze dedup and drop count',
        type: 'counter',
        labelNames: ['destination_id'],
      },
      {
        name: 'braze_user_store_update_count',
        help: 'braze user store update count',
        type: 'counter',
        labelNames: ['identifier_type', 'destination_id'],
      },
      {
        name: 'braze_lookup_failure_count',
        help: 'braze look-up failure count',
        type: 'counter',
        labelNames: ['http_status', 'destination_id'],
      },
      {
        name: 'marketo_bulk_upload_upload_file_succJobs',
        help: 'marketo_bulk_upload_upload_file_succJobs',
        type: 'counter',
        labelNames: [],
      },
      {
        name: 'marketo_bulk_upload_upload_file_unsuccJobs',
        help: 'marketo_bulk_upload_upload_file_unsuccJobs',
        type: 'counter',
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
        name: 'fb_custom_audience_event_having_all_null_field_values_for_a_user',
        help: 'fbcustomaudience event having all null field values for a user',
        type: 'counter',
        labelNames: ['destinationId', 'nullFields'],
      },
      {
        name: 'fb_custom_audience_event_having_all_null_field_values_for_all_users',
        help: 'fbcustomaudience event having all null field values for all users',
        type: 'counter',
        labelNames: ['destinationId'],
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
        name: 'marketo_bulk_upload_create_header_time',
        help: 'marketo_bulk_upload_create_header_time',
        type: 'histogram',
        labelNames: [],
      },
      {
        name: 'marketo_bulk_upload_fetch_job_time',
        help: 'marketo_bulk_upload_fetch_job_time',
        type: 'histogram',
        labelNames: [],
      },
      {
        name: 'marketo_bulk_upload_fetch_job_create_response_time',
        help: 'marketo_bulk_upload_fetch_job_create_response_time',
        type: 'histogram',
        labelNames: [],
      },
      {
        name: 'marketo_bulk_upload_create_file_time',
        help: 'marketo_bulk_upload_create_file_time',
        type: 'histogram',
        labelNames: [],
      },
      {
        name: 'marketo_bulk_upload_upload_file_time',
        help: 'marketo_bulk_upload_upload_file_time',
        type: 'histogram',
        labelNames: [],
      },
      {
        name: 'marketo_bulk_upload_create_csvloop_time',
        help: 'marketo_bulk_upload_create_csvloop_time',
        type: 'histogram',
        labelNames: [],
      },
      // tracking plan metrics:
      // counter
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
      // histogram
      {
        name: 'tp_batch_size',
        help: 'Size of batch of events for tracking plan validation',
        type: 'histogram',
        buckets: [
          1024, 102400, 524288, 1048576, 10485760, 20971520, 52428800, 104857600, 209715200,
          524288000,
        ],
        labelNames: [
          'sourceType',
          'destinationType',
          'k8_namespace',
          'workspaceId',
          'trackingPlanId',
        ],
      },
      {
        name: 'tp_event_validation_latency',
        help: 'Latency of validating tracking plan at event level',
        type: 'histogram',
        labelNames: [
          'sourceType',
          'destinationType',
          'k8_namespace',
          'workspaceId',
          'trackingPlanId',
          'status',
          'exception',
        ],
      },
      {
        name: 'tp_batch_validation_latency',
        help: 'Latency of validating tracking plan at batch level',
        type: 'histogram',
        labelNames: [
          'sourceType',
          'destinationType',
          'k8_namespace',
          'workspaceId',
          'trackingPlanId',
        ],
      },
      {
        name: 'tp_event_latency',
        help: 'tp_event_latency',
        type: 'histogram',
        labelNames: ['sourceType', 'destinationType', 'k8_namespace'],
      },
      { name: 'get_tracking_plan', help: 'get_tracking_plan', type: 'histogram', labelNames: [] },
      // User transform metrics
      // counter
      {
        name: 'user_transform_input_events',
        help: 'Number of input events to user transform',
        type: 'counter',
        labelNames: ['workspaceId'],
      },
      {
        name: 'user_transform_output_events',
        help: 'user_transform_output_events',
        type: 'counter',
        labelNames: ['workspaceId'],
      },
      {
        name: 'user_transform_function_group_size',
        help: 'user_transform_function_group_size',
        type: 'counter',
        labelNames: [],
      },
      {
        name: 'user_transform_errors',
        help: 'user_transform_errors',
        type: 'counter',
        labelNames: [
          'workspaceId',
          'transformationId',
          'status',
          'sourceType',
          'destinationType',
          'k8_namespace',
        ],
      },
      {
        name: 'user_transform_test_count_total',
        help: 'user_transform_test_count_total',
        type: 'counter',
        labelNames: ['workspaceId', 'transformationId', 'status'],
      },
      {
        name: 'user_transform_requests',
        help: 'user_transform_requests',
        type: 'counter',
        labelNames: [],
      },
      {
        name: 'credential_error_total',
        help: 'Error in fetching credentials count',
        type: 'counter',
        labelNames: ['identifier', 'transformationId', 'workspaceId'],
      },
      {
        name: 'user_transform_function_input_events',
        help: 'user_transform_function_input_events',
        type: 'counter',
        labelNames: [
          'identifier',
          'testMode',
          'sourceType',
          'destinationType',
          'k8_namespace',
          'errored',
          'statusCode',
          'transformationId',
          'workspaceId',
        ],
      },
      // histogram
      {
        name: 'creation_time',
        help: 'creation_time',
        type: 'histogram',
        labelNames: ['transformationId', 'identifier', 'testMode'],
      },
      {
        name: 'createivm_duration',
        help: 'createivm_duration',
        type: 'histogram',
        labelNames: ['identifier', 'transformationId', 'workspaceId'],
      },
      {
        name: 'fetchV2_call_duration',
        help: 'fetchV2_call_duration',
        type: 'histogram',
        labelNames: ['identifier', 'transformationId', 'workspaceId'],
      },
      {
        name: 'fetch_call_duration',
        help: 'fetch_call_duration',
        type: 'histogram',
        labelNames: ['identifier', 'transformationId', 'workspaceId'],
      },
      {
        name: 'fetch_dns_resolve_time',
        help: 'fetch_dns_resolve_time',
        type: 'histogram',
        labelNames: ['identifier', 'transformationId', 'workspaceId', 'error', 'cacheHit'],
      },
      {
        name: 'geo_call_duration',
        help: 'geo_call_duration',
        type: 'histogram',
        labelNames: ['identifier', 'transformationId', 'workspaceId'],
      },
      // summary
      {
        name: 'user_transform_request_latency_summary',
        help: 'user_transform_request_latency_summary',
        type: 'summary',
        labelNames: [
          'workspaceId',
          'transformationId',
          'sourceType',
          'destinationType',
          'k8_namespace',
        ],
      },
      {
        name: 'user_transform_batch_size_summary',
        help: 'user_transform_batch_size_summary',
        type: 'summary',
        labelNames: [
          'workspaceId',
          'transformationId',
          'sourceType',
          'destinationType',
          'k8_namespace',
        ],
      },
      {
        name: 'user_transform_function_latency_summary',
        help: 'user_transform_function_latency_summary',
        type: 'summary',
        labelNames: [
          'identifier',
          'testMode',
          'sourceType',
          'destinationType',
          'k8_namespace',
          'errored',
          'statusCode',
          'transformationId',
          'workspaceId',
        ],
      },
      {
        name: 'user_transform_used_heap_size',
        help: 'user_transform_used_heap_size',
        type: 'summary',
        labelNames: [
          'identifier',
          'testMode',
          'sourceType',
          'destinationType',
          'k8_namespace',
          'errored',
          'statusCode',
          'transformationId',
          'workspaceId',
        ],
      },
      {
        name: 'user_transform_reconcile_function',
        help: 'user_transform_reconcile_function',
        type: 'counter',
        labelNames: ['transformationId', 'workspaceId'],
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
        } else if (metric.type === 'summary') {
          if (enableSummaryMetrics) {
            this.newSummaryStat(
              appendPrefix(metric.name),
              metric.help,
              metric.labelNames,
              metric.percentiles,
              metric.maxAge,
              metric.ageBuckets,
            );
          }
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
