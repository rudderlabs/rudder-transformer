# DeleteUsers Tests

All the tests data for deleteUsers are to be present in __tests__/data/deleteUsers/${destination}/

### Files and their significance
  - __`handler_input.json`__ - Input data for  `handleDeletionOfUsers` function in `versionedRouter.js`(alias for `_deleteUsers_proxy_input.json`)
  - __`handler_output.json`__ - Output of `handleDeletionOfUsers` function in `versionedRouter.js`(alias for `_deleteUsers_proxy_output.json`)
  - __`prepare_req_input.json`__ - Input data for `prepareDeleteRequest` function exported from the destination's `deleteUsers.js` (An example can be seen in the case of `ga`)
  - __`prepare_req_output.json`__ - Output of `prepareDeleteRequest` function exported from the destination's `deleteUsers.js` (An example can be seen in the case of `ga`)
  - __`http_response.json`__ - the mock http responses(An example can be seen in the case of `ga`)

### Fields in new files

#### prepare_req_input.json

- Type: Array<object>
- Each object contains below fields
  - userAttributes
    - This will be sent by the caller of `/deleteUsers` endpoint
    - Contains the user details whose details are to be delete or suppressed
  - config
    - This will be sent by the caller of `/deleteUsers` endpoint
    - Contains the destination configuration
  - rudderDestInfo
    - This will be sent by the caller of `/deleteUsers` endpoint
    - Contains the extra information needed by the destination to send user deletion request
    - *Note*: Currently this field is being used in destination which require OAuth in user-deletion


#### http_response.json

- Type: Array<Array<object>>
- The array of object is how many responses have to be sent back
- Each of the object contains below mentioned fields
   - type:
     - Indicates what type of http client invocation it is
     - Recommended to be sent
     - Supported values: 
       - post
       - get
       - delete
       - constructor
     - if nothing is mentioned, `post` is considered by default
   - reqParams:
     - Type: Array<any>
     - Optional
     - Indicates the expected arguments that are to be sent to the http client instance
     - We would `recommend` to also add this as part of your `http_response.json`
   - response:
     - Type: object
     - Required
     - The response that needs to be returned from the http client