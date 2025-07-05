# Metrics Aggregator

The Metrics Aggregator is responsible for collecting and aggregating Prometheus metrics from multiple worker processes in a clustered environment.

## Features

### Incremental Metrics Updates

The metrics aggregator now supports incremental updates to reduce network overhead and improve performance. Instead of sending all metrics from each worker to the master on every request, the system tracks metric changes and only sends updated metrics.

#### How it works

1. **Change Detection**: Each worker's Prometheus wrapper maintains a snapshot of the last sent values for each metric/label combination
2. **Incremental Requests**: When the master requests metrics, workers check if their metrics have changed since the last request
3. **Selective Transmission**: Only workers with changed metrics send their updated metrics data
4. **Aggregation**: The master aggregates only the updated metrics from workers

#### Benefits

- **Reduced Network Traffic**: Workers with unchanged metrics don't send data
- **Improved Performance**: Faster metrics collection, especially in stable systems
- **Backward Compatibility**: Can be disabled via environment variable
- **Granular Tracking**: Tracks changes at the individual metric/label level, not just overall changes

#### Configuration

The incremental updates feature is enabled by default. To disable it, set the environment variable:

```bash
METRICS_AGGREGATOR_INCREMENTAL_UPDATES=false
```

#### Environment Variables

| Variable                                             | Default | Description                                |
| ---------------------------------------------------- | ------- | ------------------------------------------ |
| `METRICS_AGGREGATOR_INCREMENTAL_UPDATES`             | `true`  | Enable/disable incremental metrics updates |
| `METRICS_AGGREGATOR_REQUEST_TIMEOUT_SECONDS`         | `10`    | Timeout for metrics requests in seconds    |
| `METRICS_AGGREGATOR_PERIODIC_RESET_ENABLED`          | `false` | Enable periodic metrics reset              |
| `METRICS_AGGREGATOR_PERIODIC_RESET_INTERVAL_SECONDS` | `1800`  | Interval for periodic reset in seconds     |

#### Message Types

The system uses the following message types for communication:

- `GET_METRICS_REQ`: Request all metrics from worker (legacy mode)
- `GET_METRICS_RES`: Response with all metrics from worker
- `GET_UPDATED_METRICS_REQ`: Request only updated metrics from worker
- `GET_UPDATED_METRICS_RES`: Response with updated metrics status
- `AGGREGATE_METRICS_REQ`: Request to aggregate metrics in worker thread
- `AGGREGATE_METRICS_RES`: Response with aggregated metrics
- `RESET_METRICS_REQ`: Request to reset metrics in worker

#### Implementation Details

1. **Prometheus Wrapper Integration**: Uses the Prometheus wrapper's `getChangedMetricsAsJSON()` method
2. **Stable Key Generation**: Uses `fast-json-stable-stringify` for consistent metric/label key generation
3. **Per-Metric Tracking**: Tracks changes at the individual metric/label combination level
4. **Memory Management**: Clears snapshots on metrics reset to ensure fresh state

#### Performance Considerations

- **Memory Usage**: Snapshots are stored in the Prometheus wrapper (minimal overhead)
- **CPU Usage**: Change detection adds minimal computational overhead
- **Network Efficiency**: Significant reduction in network traffic for stable metrics
- **Latency**: Faster response times due to reduced data transmission
- **Granularity**: Only changed metric values are sent, not entire metric objects

#### Monitoring

The system logs debug information about:

- Metrics change detection
- Worker response status (changed/unchanged)
- Number of changed metrics being sent
- Network request types (full vs incremental)

Enable debug logging to monitor the incremental updates behavior:

```javascript
logger.setLogLevel('debug');
```

#### Troubleshooting

If you experience issues with incremental updates:

1. **Disable the feature**: Set `METRICS_AGGREGATOR_INCREMENTAL_UPDATES=false`
2. **Check logs**: Look for debug messages about metrics changes
3. **Verify snapshots**: Ensure snapshots are being cleared on reset
4. **Monitor performance**: Compare network usage with feature enabled/disabled
