const get = require("get-value");

function getDynamicConfig(event) {
  const { Config } = event.destination;

  Object.keys(Config).forEach(field => {
    let value = Config[field].toString();
    if (value.startsWith("{{") && value.endsWith("}}")) {
      value = value.replace("{{", "");
      value = value.replace("}}", "").trim();
      if (value.includes("||")) {
        const path = value.split("||")[0].trim();
        const getFieldVal = get(event, path);
        if (getFieldVal) {
          Config[field] = getFieldVal;
        } else {
          Config[field] = JSON.parse(value.split("||")[1].trim());
        }
      }
    }
  });
  return event;
}
function processDynamicConfig(event, type) {
  if (type === "router") {
    const eventRetArr = [];
    event.forEach(e => {
      const newEvent = getDynamicConfig(e);
      eventRetArr.push(newEvent);
    });
    return eventRetArr;
  }
  return getDynamicConfig(event);
}

exports.processDynamicConfig = processDynamicConfig;
