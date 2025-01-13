# GO libraries

## webhook/testdata

To generate the test files use:

```bash
go generate ./...
```

Work against local rudder-server:

```bash
go work init
go work use .
go work use ../../rudder-server
```

Then run the webhook tests:

```bash
go test github.com/rudderlabs/rudder-server/gateway/webhook -count 1 -timeout 2m
```
