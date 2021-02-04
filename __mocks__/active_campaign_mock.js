const urlDirectoryMap = {
  "active.campaigns.rudder.com": "active_campaigns"
};

const fs = require("fs");
const path = require("path");
let id = 0;

const getData = url => {
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
    return data[url];
  }
  return {};
};

const id_generator = () => {
  id++;
  return id;
};

const acPostRequestHandler = (url, payload) => {
  const mockData = getData(url);
  switch (url) {
    case "https://active.campaigns.rudder.com/api/3/contact/sync":
      //resolve with status 201 and response data contains value for contact created
      return { data: mockData, status: 201 };
    case "https://active.campaigns.rudder.com/api/3/tags":
      //resolve with status 201 and the response data contains the created tag
      mockData.tag["tag"] = payload.tag.tag;
      mockData.tag["description"] = payload.tag.description;
      mockData.tag["tagType"] = payload.tag.tagType;
      mockData.tag["id"] = id_generator();
      return { data: mockData, status: 201 };
    case "https://active.campaigns.rudder.com/api/3/contactTags":
      //resolve with status 201 and the response data containing the created contact tags
      mockData.contactTag.contact = payload.contactTag.contact;
      mockData.contactTag.id = id_generator();
      mockData.tag = payload.contactTag.tag;
      return { data: mockData, status: 201 };
    case "https://active.campaigns.rudder.com/api/3/fields":
      //resolve with status 200 and the response data containing the stored fields
      return { data: mockData, status: 200 };
    case "https://active.campaigns.rudder.com/api/3/fieldValues":
      //resolve with status 200 and the response data containing the creted Contactfield
      mockData.fieldValue["contact"] = payload.fieldValue.contact;
      mockData.fieldValue["field"] = payload.fieldValue.field;
      mockData.fieldValue["value"] = payload.fieldValue.value;
      mockData.fieldValue["id"] = id_generator();
      return { data: mockData, status: 200 };
    case "https://active.campaigns.rudder.com/api/3/eventTrackingEvents":
      //resolve with status 201 and the response data containing the created event
      return { data: payload, status: 201 };
    case "https://active.campaigns.rudder.com/api/3/contactLists":
      //resolve with status 201 and the response data containing the created event
      return { data: payload, status: 200 };
    default:
      return new Promise((resolve, reject) => {
        if (mockData) {
          resolve({ data: mockData });
        } else {
          resolve({ error: "Request failed" });
        }
      });
  }
};

module.exports = acPostRequestHandler;
