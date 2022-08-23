const fs = require("fs");
const path = require("path");

const urlDirectoryMap={
    "muatic.net":"mautic"
}

function getData(url) {
  let directory = "";
  Object.keys(urlDirectoryMap).forEach(key => {
    if (url.includes(key)) {
      directory = urlDirectoryMap[key];
    }
  });
  if (directory) {
    const dataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/${directory}/response.json`)
    );
    const data = JSON.parse(dataFile);
    console.log(data[url]); // Not mapping here
    return data[url];
  }
  return {};
}
const mauticGetRequestHandler=url=> {
    let mockData=getData(url);
    console.log(mockData);  //giving empty always
    if(!mockData){
      mockData={};
    }
    return Promise.resolve({ data: mockData, status: 200 });
  };
module.exports= mauticGetRequestHandler;