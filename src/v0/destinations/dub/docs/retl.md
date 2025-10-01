# RETL Functionality

## RETL Support

**RETL is NOT supported** for the Dub destination.

### Reason for No RETL Support

The Dub destination configuration shows that `warehouse` is missing from the `supportedSourceTypes` array in `db-config.json`. The supported source types are limited to:

- android
- ios
- web
- unity
- amp
- cloud
- reactnative
- flutter
- cordova
- shopify

### Alternative Approaches

Since RETL is not supported, conversion tracking data must be sent to Dub through:

1. **Event Streams**: Use supported source types (web, mobile, server-side) to send track events
2. **Cloud Mode**: Send events through RudderStack's cloud infrastructure
3. **Direct API**: Use Dub's conversion API directly for warehouse-based data

### Future Considerations

**NEEDS REVIEW** - Consider whether RETL support should be added for the Dub destination to enable warehouse-to-Dub conversion tracking workflows.

If RETL support were to be added:

- **JSON Mapper**: Would be supported by default unless explicitly disabled
- **VDM Support**: Would require `supportsVisualMapper: true` in db-config.json
- **VDM V2 Support**: Would require both VDM support and `record` message type support
- **Connection Config**: Would need warehouse-specific configuration parameters
- **Record Event Handling**: Would require implementation logic for `record` event type processing
