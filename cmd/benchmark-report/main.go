package main

import (
	"encoding/csv"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"

	"gopkg.in/yaml.v3"
)

type config struct {
	Tests []map[string]any `yaml:"tests"`
}

type ioMetric struct {
	Input  float64
	Output float64
}

type testMetrics struct {
	CPUUserTransformer     []float64
	CPURudderLoad          []float64
	MemoryUserTransformer  []float64
	EventsRudderLoad       []float64
	NetIOUserTransformer   []ioMetric
	BlockIOUserTransformer []ioMetric
}

type testResult struct {
	Name    string
	Config  map[string]any
	Metrics *testMetrics
	AvgEPS  float64
}

func main() {
	// define your command-line flag
	resultsDirRaw := flag.String("p", "test-results", "folder containing test results")

	// parse the command-line arguments
	flag.Parse()

	// Checking for resultsDir existence
	wd, err := os.Getwd()
	if err != nil {
		panic(fmt.Errorf("failed to get current working directory: %w", err))
	}
	resultsDir, err := filepath.Abs(filepath.Join(wd, "..", "..", *resultsDirRaw))
	if err != nil {
		panic(fmt.Errorf("failed to get absolute path of resultsDir (%q): %w", *resultsDirRaw, err))
	}
	if _, err := os.Stat(resultsDir); os.IsNotExist(err) {
		panic(fmt.Errorf("resultsDir does not exist (%q): %w", resultsDir, err))
	}

	cfg, err := readYaml("../../scripts/benchmarks/config.yaml")
	if err != nil {
		panic(err)
	}

	var allResults []testResult

	for _, testCfg := range cfg.Tests {
		testName := testCfg["name"].(string)
		csvFile := filepath.Join(resultsDir, testName+"-stats.csv")

		metrics, err := parseCSVMetrics(csvFile)
		if err != nil {
			fmt.Printf("Could not read CSV file '%s': %s\n", csvFile, err)
			continue
		}

		avgEPS := calculateAverage(metrics.EventsRudderLoad)

		allResults = append(allResults, testResult{
			Name:    testName,
			Config:  testCfg,
			Metrics: metrics,
			AvgEPS:  avgEPS,
		})
	}

	// Sort results by AvgEPS descending
	sort.Slice(allResults, func(i, j int) bool {
		return allResults[i].AvgEPS > allResults[j].AvgEPS
	})

	// Display results in sorted order
	for _, result := range allResults {
		fmt.Printf("\n===== TEST: %s =====\n", result.Name)
		fmt.Printf("Average EPS: %.2f\n", result.AvgEPS)
		fmt.Println("Configuration:")
		for k, v := range result.Config {
			if k != "name" {
				fmt.Printf("  %s: %v\n", k, v)
			}
		}
		displayMetrics(result.Metrics)
	}
}

func calculateAverage(values []float64) float64 {
	if len(values) == 0 {
		return 0
	}
	sum := 0.0
	for _, val := range values {
		sum += val
	}
	return sum / float64(len(values))
}

func readYaml(path string) (*config, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var cfg config
	err = yaml.Unmarshal(data, &cfg)
	return &cfg, err
}

func parseCSVMetrics(path string) (*testMetrics, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer func() { _ = file.Close() }()

	reader := csv.NewReader(file)
	rows, err := reader.ReadAll()
	if err != nil {
		return nil, err
	}

	header := rows[0]
	idxContainer, idxCPU, idxMem, idxEvents, idxNetIO, idxBlockIO := -1, -1, -1, -1, -1, -1
	for i, h := range header {
		switch strings.TrimSpace(h) {
		case "Container":
			idxContainer = i
		case "CPU_Percentage":
			idxCPU = i
		case "Mem_Usage":
			idxMem = i
		case "Events_per_second":
			idxEvents = i
		case "Net_IO":
			idxNetIO = i
		case "BLOCK_IO":
			idxBlockIO = i
		}
	}

	if idxContainer < 0 || idxCPU < 0 || idxMem < 0 || idxEvents < 0 || idxNetIO < 0 || idxBlockIO < 0 {
		return nil, fmt.Errorf("missing important CSV columns")
	}

	metrics := &testMetrics{}

	for _, row := range rows[1:] {
		container := row[idxContainer]
		cpu, _ := strconv.ParseFloat(strings.TrimSuffix(row[idxCPU], "%"), 64)

		if container == "user-transformer" {
			metrics.CPUUserTransformer = append(metrics.CPUUserTransformer, cpu)

			mem, err := parseMemoryToMiB(row[idxMem])
			if err == nil {
				metrics.MemoryUserTransformer = append(metrics.MemoryUserTransformer, mem)
			}

			netIO, err := parseIOPair(row[idxNetIO])
			if err == nil {
				metrics.NetIOUserTransformer = append(metrics.NetIOUserTransformer, netIO)
			}

			blockIO, err := parseIOPair(row[idxBlockIO])
			if err == nil {
				metrics.BlockIOUserTransformer = append(metrics.BlockIOUserTransformer, blockIO)
			}
		} else if container == "rudder-load" {
			metrics.CPURudderLoad = append(metrics.CPURudderLoad, cpu)

			eventStr := row[idxEvents]
			if eventStr != "N/A" {
				event, err := strconv.ParseFloat(eventStr, 64)
				if err == nil {
					metrics.EventsRudderLoad = append(metrics.EventsRudderLoad, event)
				}
			}
		}
	}

	return metrics, nil
}

func toMB(val string) (float64, error) {
	val = strings.TrimSpace(val)
	switch {
	case strings.HasSuffix(val, "GB"):
		f, err := strconv.ParseFloat(strings.TrimSuffix(val, "GB"), 64)
		return f * 1024, err
	case strings.HasSuffix(val, "MB"):
		f, err := strconv.ParseFloat(strings.TrimSuffix(val, "MB"), 64)
		return f, err
	case strings.HasSuffix(val, "kB"):
		f, err := strconv.ParseFloat(strings.TrimSuffix(val, "kB"), 64)
		return f / 1024, err
	case strings.HasSuffix(val, "B"):
		f, err := strconv.ParseFloat(strings.TrimSuffix(val, "B"), 64)
		return f / (1024 * 1024), err
	default:
		return -1, fmt.Errorf("unknown IO unit in %s", val)
	}
}

func parseMemoryToMiB(val string) (float64, error) {
	val = strings.TrimSpace(val)
	if strings.HasSuffix(val, "GiB") {
		f, err := strconv.ParseFloat(strings.TrimSuffix(val, "GiB"), 64)
		return f * 1024, err
	} else if strings.HasSuffix(val, "MiB") {
		f, err := strconv.ParseFloat(strings.TrimSuffix(val, "MiB"), 64)
		return f, err
	}
	return 0, fmt.Errorf("unknown memory unit in %s", val)
}

func formatMemory(val float64) string {
	units := []string{"MB", "GB", "TB", "PB"}
	unitIdx := 0
	for val >= 1024 && unitIdx < len(units)-1 {
		val /= 1024
		unitIdx++
	}
	return fmt.Sprintf("%.2f%s", val, units[unitIdx])
}

func formatEvents(val float64) string {
	units := []string{"", "K", "M", "B"}
	unitIdx := 0
	for val >= 1000 && unitIdx < len(units)-1 {
		val /= 1000
		unitIdx++
	}
	return fmt.Sprintf("%.2f%s", val, units[unitIdx])
}

func printMinAvgMax(metricName string, values []float64, format string, fmtFuncs ...func(float64) string) {
	if len(values) == 0 {
		fmt.Printf("%-30s N/A\n", metricName)
		return
	}

	minValue, maxValue, sum := values[0], values[0], 0.0
	for _, v := range values {
		if v < minValue {
			minValue = v
		}
		if v > maxValue {
			maxValue = v
		}
		sum += v
	}
	avgValue := sum / float64(len(values))

	var formattedValues []string
	toFormat := []float64{minValue, avgValue, maxValue}
	for _, v := range toFormat {
		if len(fmtFuncs) > 0 {
			formattedValues = append(formattedValues, fmtFuncs[0](v))
		} else {
			formattedValues = append(formattedValues, fmt.Sprintf(format, v))
		}
	}

	fmt.Printf("%-30s min:%-10s avg:%-10s max:%-10s\n",
		metricName, formattedValues[0], formattedValues[1], formattedValues[2])
}

func parseIOPair(val string) (ioMetric, error) {
	parts := strings.Split(val, "/")
	if len(parts) != 2 {
		return ioMetric{}, fmt.Errorf("invalid IO format")
	}
	input, err1 := toMB(strings.TrimSpace(parts[0]))
	output, err2 := toMB(strings.TrimSpace(parts[1]))
	if err1 != nil || err2 != nil {
		return ioMetric{}, fmt.Errorf("failed to parse IO values: %v, %v", err1, err2)
	}
	return ioMetric{Input: input, Output: output}, nil
}

func displayIOPairMetrics(metricName string, values []ioMetric) {
	if len(values) == 0 {
		fmt.Printf("%-30s N/A\n", metricName)
		return
	}

	var minInput, maxInput, sumInput float64 = values[0].Input, values[0].Input, 0
	var minOutput, maxOutput, sumOutput float64 = values[0].Output, values[0].Output, 0

	for _, v := range values {
		if v.Input < minInput {
			minInput = v.Input
		}
		if v.Input > maxInput {
			maxInput = v.Input
		}
		sumInput += v.Input

		if v.Output < minOutput {
			minOutput = v.Output
		}
		if v.Output > maxOutput {
			maxOutput = v.Output
		}
		sumOutput += v.Output
	}

	avgInput := sumInput / float64(len(values))
	avgOutput := sumOutput / float64(len(values))

	fmt.Printf("%-30s min:%-10s avg:%-10s max:%-10s\n",
		metricName+" (IN)",
		formatMemory(minInput),
		formatMemory(avgInput),
		formatMemory(maxInput),
	)
	fmt.Printf("%-30s min:%-10s avg:%-10s max:%-10s\n",
		metricName+" (OUT)",
		formatMemory(minOutput),
		formatMemory(avgOutput),
		formatMemory(maxOutput),
	)
}

func displayMetrics(metrics *testMetrics) {
	fmt.Println("Metrics:")

	printMinAvgMax("EPS", metrics.EventsRudderLoad, "%s", formatEvents)
	printMinAvgMax("UT CPU (%)", metrics.CPUUserTransformer, "%.2f%%")
	printMinAvgMax("RL CPU (%)", metrics.CPURudderLoad, "%.2f%%")
	printMinAvgMax("UT Memory", metrics.MemoryUserTransformer, "%s", formatMemory)

	displayIOPairMetrics("UT Net", metrics.NetIOUserTransformer)
	displayIOPairMetrics("UT Block", metrics.BlockIOUserTransformer)
}
