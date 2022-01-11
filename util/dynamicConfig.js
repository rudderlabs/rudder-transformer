/* eslint-disable no-param-reassign */
const get = require("get-value");
const unset = require("unset-value");

function setDynamicConfigValue(event, value, config, field) {
  value = value.replace("{{", "").replace("}}", "");
  if (value.includes("||")) {
    const path = value.split("||")[0].trim();
    const getFieldVal = get(event, path);
    if (getFieldVal) {
      config[field] = getFieldVal;
      unset(event, path);
    } else {
      config[field] = JSON.parse(value.split("||")[1].trim()).toString();
    }
  }
}

function getVal(value, event) {
  if (Array.isArray(value)) {
    value.forEach(key => {
      getVal(key, event);
    });
  } else if (typeof value === "object") {
    Object.keys(value).forEach(obj => {
      // first checking whether the value is array/object -> in that case we recurse and send that object/array as value
      if (typeof value[obj] === "object") {
        getVal(value[obj], event);
      } // if we encounter string (actual values), then we start configuring it
      else if (typeof value[obj] === "string") {
        let val = value[obj];
        // we need to configure the value here itself else we will not have path
        if (val && val.startsWith("{{") && val.endsWith("}}")) {
          val = val.replace("{{", "").replace("}}", "");
          if (val.includes("||")) {
            const path = val.split("||")[0].trim();
            const getFieldVal = get(event, path);
            if (getFieldVal) {
              value[obj] = getFieldVal;
              unset(event, path);
            } else {
              value[obj] = JSON.parse(val.split("||")[1].trim()).toString();
            }
          }
        }
      }
    });
  }
}

function getDynamicConfig(event) {
  const { Config } = event.destination;
  if (Config) {
    Object.keys(Config).forEach(field => {
      // let value = Config[field].toString().trim();
      let value = Config[field];
      if (Array.isArray(value)) {
        // console.log(value);
        value.forEach(obj => {
          getVal(obj, event);
          // console.log(valArr);
          // if (valArr.length > 0) {
          //   valArr.forEach(val => {
          //     if (val && val.startsWith("{{") && val.endsWith("}}")) {
          //       setDynamicConfigValue(event, val, Config, field);
          //     }
          //   });
          // }
        });
      } else {
        value = value.toString().trim();
        if (value.startsWith("{{") && value.endsWith("}}")) {
          setDynamicConfigValue(event, value, Config, field);
        }
      }
    });
  }
  return event;
}
// function getDynamicConfig(event) {
//   const { Config } = event.destination;
//   if (Config) {
//     Object.keys(Config).forEach(field => {
//       // let value = Config[field].toString().trim();
//       let value = Config[field];
//       if (typeof value === "object") {
//         value.forEach(obj => {
//           Object.keys(obj).forEach(key => {
//             const val = obj[key];
//             if (val.startsWith("{{") && val.endsWith("}}")) {
//               setDynamicConfigValue(event, val, Config, field);
//             }
//           });
//         });
//       } else {
//         value = value.toString().trim();
//         if (value.startsWith("{{") && value.endsWith("}}")) {
//           setDynamicConfigValue(event, value, Config, field);
//         }
//       }
//     });
//   }
//   return event;
// }

function processDynamicConfig(event, type) {
  if (type === "router" || type === "batch") {
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
