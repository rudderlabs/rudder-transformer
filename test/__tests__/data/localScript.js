const fs = require('fs');

function parseJSONFile(integration) {
    try {
        const inputFilePath = `${integration}_input.json`
        const outputFiltPath = `${integration}_output.json`

        // Read the JSON file synchronously
        const inputJsonData = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));
        const outputJsonData = JSON.parse(fs.readFileSync(outputFiltPath, 'utf8'));

        const finalData = [];
        // Parse the JSON data
        const size = inputJsonData.length;

        for(let i=0;i<size;i++){
            const input = inputJsonData[i];
            const output = outputJsonData[i];
            finalData.push({input: input, output: output})
        }
        fs.writeFileSync(`${integration}.json`, JSON.stringify(finalData), 'utf8');

    } catch (error) {
        console.error('Error parsing JSON file:', error);
        return null;
    }
}

parseJSONFile('splitio');