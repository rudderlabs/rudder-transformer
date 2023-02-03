# DeleteUsers Tests

All the tests data for deleteUsers are to be present in **tests**/data/deleteUsers/${destination}/

### Files and their significance

- **`handler_input.json`** - Input data for `handleDeletionOfUsers` function in `versionedRouter.js`(alias for `_deleteUsers_proxy_input.json`)
- **`handler_output.json`** - Output of `handleDeletionOfUsers` function in `versionedRouter.js`(alias for `_deleteUsers_proxy_output.json`)
- **`nw_client_data.json`** - the mock http responses(An example can be seen in the case of `ga`)

### Fields in new files

#### nw_client_data.json

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
    - We would `recommend` to also add this as part of your `nw_client_data.json`
  - response:
    - Type: object
    - Required
    - The response that needs to be returned from the http client
