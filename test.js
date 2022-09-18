const axios = require("axios");

const data = JSON.stringify({
  identity: ["18911", "18910", "18909"]
});

const config = {
  method: "post",
  url: "https://api.clevertap.com/1/delete/profiles.json",
  headers: {
    "X-CleverTap-Account-Id": "R76-69Z-9Z6Z",
    "X-CleverTap-Passcode": "EFC-SUD-WHUL",
    "Content-Type": "application/json"
  },
  data
};

async function main() {
  const resp = await axios.post(config.url, config.data, {
    headers: config.headers
  });
  console.log(resp);
}

main()
  .then(function(response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function(error) {
    console.log(error);
  });
