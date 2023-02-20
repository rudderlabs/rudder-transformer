This folder is necessary for performing proxy mocking for destinations which have to be migrated to transformerProxy

Example:
```json
{
  "response": {
    "data": "ok",
    "status": 200
  },
  "success": true
}
```
The object returned from `httpSend` located at `src/adapters/network.js ` should be put in `mocks/{destType}/response.json`

We need to make sure that the object structure looks like below

#### response.json
The structure looks like below
- response
  - Information about the whole axios response object(AxiosResponse)
  - Type: axios.AxiosResponse
  - We usually make use of `data`, `status` & `statusText`
  - Sent from `httpSend`
- success
  - Contains information if the request is successful or not
  - Type: Boolean
  - Usually when the status-code is `2xx`, the success-flag is set as `true`
  - Sent from `httpSend`
- sleep
  - Indicates if the request should sleep for sometime before sending a response
  - Type: Object{ timeoutInMs: Number }
  - Not sent from `httpSend` but useful for mocking some delay in response

**NOTES**:
- This folder is to be used during `development`