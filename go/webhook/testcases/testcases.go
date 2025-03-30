package testcases

import (
	"bytes"
	"embed"
	"encoding/json"
	"io/fs"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

type Setup struct {
	Context Context
	Cases   []Case
}

type Context struct {
	Now       time.Time
	RequestIP string `json:"request_ip"`
}

type Case struct {
	Name        string
	Description string
	Skip        string
	Input       Input
	Output      Output
}

type Input struct {
	Request Request
	Source  Source
}

type Source struct {
	Config string `json:"config"`
}
type Request struct {
	Method   string
	RawQuery map[string][]string `json:"query"`
	Headers  map[string]string
	Body     string
}

type Output struct {
	Response Response
	Queue    []json.RawMessage
	ErrQueue []json.RawMessage `json:"errQueue"`
}

type Response struct {
	Body       json.RawMessage
	StatusCode int `json:"status"`
}

//go:generate npx ts-node ../../../test/scripts/generateJson.ts sources ./testdata/testcases
//go:generate npx prettier --write ./testdata/**/*.json

//go:embed testdata/context.json
var contextData []byte

//go:embed testdata/testcases/**/*.json
var testdata embed.FS

func Load(t *testing.T) Setup {
	t.Helper()

	var tc Context
	err := json.Unmarshal(contextData, &tc)
	require.NoError(t, err)

	var tcs []Case
	err = fs.WalkDir(testdata, ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		if d.IsDir() {
			return nil
		}

		f, err := testdata.Open(path)
		if err != nil {
			return err
		}
		defer f.Close()

		// Read the entire file first
		rawJSON, err := fs.ReadFile(testdata, path)
		if err != nil {
			return err
		}

		// Compact the JSON to remove whitespace
		buffer := new(bytes.Buffer)
		if err := json.Compact(buffer, rawJSON); err != nil {
			return err
		}

		var tc Case
		if err := json.NewDecoder(buffer).Decode(&tc); err != nil {
			return err
		}
		tcs = append(tcs, tc)

		return nil
	})
	require.NoError(t, err)

	return Setup{
		Context: tc,
		Cases:   tcs,
	}
}
