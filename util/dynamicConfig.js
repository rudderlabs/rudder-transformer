function dotNotate(obj, target, prefix) {
  (target = target || {}), (prefix = prefix || "");

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      dotNotate(obj[key], target, prefix + key + ".");
    } else {
      return (target[prefix + key] = obj[key]);
    }
  });

  return target;
}

function getDynamicConfig(event) {
  const dotEvent = dotNotate(event);
  const { Config } = event.destination;

  Object.keys(Config).forEach(field => {
    let value = Config[field].toString();
    if (value.startsWith("{{") && value.endsWith("}}")) {
      value = value.replace("{{", "");
      value = value.replace("}}", "").trim();
      if (value.includes("||")) {
        const path = value.split("||")[0].trim();
        if (dotEvent[path]) {
          Config[field] = dotEvent[path];
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
