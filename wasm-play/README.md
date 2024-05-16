# WASM experiment

## Compile JS to WASM

```bash
npx javy-cli@latest compile samples/hello.js -o samples/hello.wasm  --wit samples/index.wit -n index-world
```

## Executing

using wasmtime cli:
install cli:

```bash
curl https://wasmtime.dev/install.sh -sSf | bash
```

```bash
echo '{"foo": "bar"}' | wasmtime --invoke run samples/hello.wasm  
```

using Go:

```bash
echo '{}' |  go run main.go
```
