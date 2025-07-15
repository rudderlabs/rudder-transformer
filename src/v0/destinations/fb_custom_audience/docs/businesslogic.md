# Facebook Custom Audience Business Logic Documentation

## Field Mappings

### Supported Schema Fields

Facebook Custom Audience supports the following user identifier fields:

| Field             | Description                     | Format Requirements              | Hashing |
| ----------------- | ------------------------------- | -------------------------------- | ------- |
| `EMAIL`           | Email address                   | Lowercase, trimmed               | Yes     |
| `PHONE`           | Phone number                    | Numeric only, no leading zeros   | Yes     |
| `GEN`             | Gender                          | 'f' or 'm'                       | Yes     |
| `MADID`           | Mobile Advertising ID           | Lowercase                        | No      |
| `EXTERN_ID`       | External ID                     | As provided                      | No      |
| `DOBY`            | Date of Birth Year              | YYYY format, no dots             | Yes     |
| `DOBM`            | Date of Birth Month             | MM format, zero-padded           | Yes     |
| `DOBD`            | Date of Birth Day               | DD format, zero-padded           | Yes     |
| `LN`              | Last Name                       | Lowercase, special chars removed | Yes     |
| `FN`              | First Name                      | Lowercase, special chars removed | Yes     |
| `FI`              | First Initial                   | Lowercase, limited special chars | Yes     |
| `CT`              | City                            | Lowercase, alphanumeric only     | Yes     |
| `ST`              | State                           | Lowercase, alphanumeric only     | Yes     |
| `ZIP`             | Zip Code                        | Lowercase, no spaces             | Yes     |
| `COUNTRY`         | Country                         | Lowercase                        | Yes     |
| `LOOKALIKE_VALUE` | Value for value-based audiences | Numeric, ≥ 0                     | No      |

### Field Validation Rules

#### EMAIL

- **Input**: Any string
- **Processing**: `trim().toLowerCase()`
- **Output**: Lowercase, trimmed email
- **Hashing**: SHA-256 applied

#### PHONE

- **Input**: Any string with phone number
- **Processing**: Remove non-numeric characters, remove leading zeros
- **Example**: `"+1 (555) 123-4567"` → `15551234567`
- **Hashing**: SHA-256 applied

#### GEN (Gender)

- **Input**: Various gender representations
- **Processing**: Normalize to 'f' or 'm'
- **Logic**: 'f' or 'female' (case-insensitive) → 'f', everything else → 'm'
- **Hashing**: SHA-256 applied

#### Date Fields (DOBY, DOBM, DOBD)

- **DOBY**: Remove dots, keep as-is (e.g., "1990" → "1990")
- **DOBM/DOBD**: Remove dots, zero-pad if single digit (e.g., "5" → "05")
- **Hashing**: SHA-256 applied

#### Name Fields (LN, FN, FI)

- **LN/FN**: Remove special characters except `#$%&'*+/`, convert to lowercase
- **FI**: Remove special characters except `!"#$%&'()*+,-./`, convert to lowercase
- **Hashing**: SHA-256 applied

#### Geographic Fields (CT, ST, ZIP, COUNTRY)

- **CT/ST**: Remove non-alphabetic characters, remove spaces, lowercase
- **ZIP**: Remove spaces, lowercase
- **COUNTRY**: Lowercase
- **Hashing**: SHA-256 applied

#### Special Fields

- **MADID**: Convert to lowercase, no hashing
- **EXTERN_ID**: Use as provided, no hashing
- **LOOKALIKE_VALUE**: Ensure numeric ≥ 0, default to 0 if invalid, no hashing

## Event Type Flows

### Audience List Events

#### Event Structure

```json
{
  "type": "audiencelist",
  "properties": {
    "listData": {
      "add": [
        /* array of user objects */
      ],
      "remove": [
        /* array of user objects */
      ]
    }
  }
}
```

#### Processing Flow

1. **Validation**: Check for required `audienceId` configuration
2. **Schema Validation**: Ensure user schema fields are supported
3. **Data Processing**:
   - Process `add` operations → POST requests
   - Process `remove` operations → DELETE requests
4. **Batching**: Split into chunks of 10,000 users
5. **Payload Generation**: Create Facebook API payloads
6. **Response Building**: Generate transformation responses

### Record Events (RETL)

#### Event Structure

```json
{
  "type": "record",
  "message": {
    "action": "insert|update|delete",
    "fields": {
      /* user identifier fields */
    },
    "identifiers": {
      /* VDM v2 identifiers */
    }
  }
}
```

#### Processing Flow

1. **Flow Detection**: Determine VDM v1 vs VDM v2 flow
2. **Schema Extraction**: Get user schema from fields/identifiers
3. **Action Grouping**: Group records by action type
4. **Action Processing**:
   - `insert`/`update` → 'add' operation (POST)
   - `delete` → 'remove' operation (DELETE)
5. **Batching**: Apply user count and payload size limits
6. **Response Generation**: Create success/error responses

## Data Transformation Pipeline

### Step 1: Input Validation

```javascript
// Check message type
if (message.type.toLowerCase() !== 'audiencelist' && message.type.toLowerCase() !== 'record') {
  throw new InstrumentationError('Unsupported message type');
}

// Validate required configuration
if (!isDefinedAndNotNullAndNotEmpty(audienceId)) {
  throw new ConfigurationError('Audience ID is a mandatory field');
}
```

### Step 2: Schema Processing

```javascript
// Ensure schema is array
if (!Array.isArray(userSchema)) {
  userSchema = [userSchema];
}

// Validate schema fields
if (!checkSubsetOfArray(schemaFields, userSchema)) {
  throw new ConfigurationError('One or more of the schema fields are not supported');
}
```

### Step 3: Data Formatting

```javascript
// Apply formatting rules
if (isHashRequired && !disableFormat) {
  updatedProperty = ensureApplicableFormat(eachProperty, userProperty);
}

// Apply hashing
dataElement = getUpdatedDataElement(dataElement, isHashRequired, eachProperty, updatedProperty);
```

### Step 4: Batching

```javascript
// User count batching
const audienceChunksArray = returnArrayOfSubarrays(userList, MAX_USER_COUNT);

// Payload size batching
const payloadBatches = batchingWithPayloadSize(prepareFinalPayload);
```

### Step 5: Request Generation

```javascript
// Generate API parameters
const prepareParams = {
  access_token: accessToken,
  appsecret_time: Math.floor(dateNow / 1000),
  appsecret_proof: generateAppSecretProof(accessToken, appSecret, dateNow),
};

// Create payload
const payload = {
  schema: userSchema,
  data: processedUserData,
  is_raw: isRaw,
  data_source: { type, sub_type },
};
```

## Validation Logic

### Configuration Validations

1. **Access Token**: Required, must be valid Facebook access token
2. **Audience ID**: Required for event stream mode
3. **Ad Account ID**: Required for RETL warehouse mode
4. **User Schema**: Must be subset of supported schema fields
5. **Value-Based Audiences**: Must include LOOKALIKE_VALUE field

### Data Validations

1. **Field Presence**: Check for null/undefined values
2. **Field Format**: Apply format-specific validation rules
3. **Schema Consistency**: Ensure all records have same schema structure
4. **Batch Limits**: Validate user count and payload size limits

### Runtime Validations

```javascript
// Null data detection
if (nullUserData) {
  stats.increment('fb_custom_audience_event_having_all_null_field_values_for_a_user', {
    destinationId,
    nullFields: userSchema,
  });
}

// Value-based audience validation
if (isValueBasedAudience && !cleanUserSchema.includes('LOOKALIKE_VALUE') && operation === 'add') {
  throw new ConfigurationError(
    'LOOKALIKE_VALUE field is required for Value-Based Custom Audiences.',
  );
}
```

## Error Handling

### Configuration Errors

- **Missing Required Fields**: Audience ID, Access Token
- **Invalid Schema Fields**: Unsupported field names
- **Value-Based Audience Errors**: Missing LOOKALIKE_VALUE

### Data Processing Errors

- **Format Errors**: Invalid data that cannot be normalized
- **Validation Errors**: Data that fails validation rules
- **Batch Size Errors**: Payloads exceeding limits

### API Response Errors

- **Authentication Errors**: Invalid access token
- **Permission Errors**: Insufficient permissions
- **Rate Limit Errors**: Too many requests
- **Audience Errors**: Invalid audience ID or configuration

## Use Cases

### 1. Customer Acquisition

- **Scenario**: Upload customer email lists for lookalike audience creation
- **Fields**: EMAIL, COUNTRY, GEN for better matching
- **Flow**: Audience List events with 'add' operation

### 2. Customer Retention

- **Scenario**: Create audiences of existing customers for retention campaigns
- **Fields**: EMAIL, PHONE, EXTERN_ID for multi-channel matching
- **Flow**: RETL from customer database with insert/update actions

### 3. Customer Suppression

- **Scenario**: Remove churned customers from marketing audiences
- **Fields**: EMAIL, PHONE for accurate removal
- **Flow**: Audience List events with 'remove' operation or RETL with delete action

### 4. Value-Based Targeting

- **Scenario**: Create audiences based on customer lifetime value
- **Fields**: EMAIL, PHONE, LOOKALIKE_VALUE
- **Configuration**: Enable value-based audience mode
- **Flow**: RETL with calculated LOOKALIKE_VALUE field

### 5. Cross-Platform Sync

- **Scenario**: Sync audiences from warehouse to Facebook for unified marketing
- **Fields**: Multiple identifiers for better match rates
- **Flow**: Scheduled RETL sync with VDM v2 mapping

## Performance Optimization

### Batching Strategy

- **User Count**: Process in chunks of 10,000 users
- **Payload Size**: Monitor 60KB payload limit
- **Memory Management**: Use batch processing utilities

### Data Quality

- **Field Selection**: Choose multiple identifiers for better match rates
- **Data Cleansing**: Ensure proper formatting before sending
- **Null Handling**: Monitor and minimize null field values

### Monitoring

- **Statistics**: Track null field occurrences
- **Error Rates**: Monitor configuration and validation errors
- **Performance**: Track batch processing times and payload sizes
