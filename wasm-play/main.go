package main

import (
	"log"
	"os"

	"github.com/bytecodealliance/wasmtime-go"
)

func main() {
	engine := wasmtime.NewEngine()
	// Almost all operations in wasmtime require a contextual `store`
	// argument to share, so create that first
	store := wasmtime.NewStore(engine)

	wasm, err := os.ReadFile("./samples/hello.wasm")
	check(err)
	// Once we have our binary `wasm` we can compile that into a `*Module`
	// which represents compiled JIT code.
	module, err := wasmtime.NewModule(engine, wasm)
	check(err)

	// Create a linker with WASI functions defined within it
	linker := wasmtime.NewLinker(engine)
	check(err)

	err = linker.DefineWasi()
	check(err)

	// Configure WASI imports to write stdout into a file, and then create
	// a `Store` using this wasi configuration.
	wasiConfig := wasmtime.NewWasiConfig()
	wasiConfig.InheritStdout()
	wasiConfig.InheritStderr()
	wasiConfig.InheritStdin()
	store.SetWasi(wasiConfig)

	instance, err := linker.Instantiate(store, module)
	if err != nil {
		log.Fatal(err)
	}

	// After we've instantiated we can lookup our `run` function and call
	// it.
	run := instance.GetFunc(store, "run")
	if run == nil {
		panic("not a function")
	}
	_, err = run.Call(store)
	check(err)

}

func check(e error) {
	if e != nil {
		panic(e)
	}
}
