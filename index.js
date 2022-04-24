const axios = require("axios");

let counter = 1;
const promisesArr = [];
while (counter <= 150) {
  console.log("in index", counter);
  promisesArr.push(
    axios.post(
      "https://utsabc.api-us1.com/api/3/fields",
      {
        field: {
          type: "text",
          title: `Field${counter}`,
          descript: "Field description",
          visible: 1,
          ordernum: 1
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Token":
            "f8baf195ec086ba82509f15b53573e3735dde071f445250ab611dd72a756f2a84340e3cb"
        }
      }
    )
  );
  counter += 1;
}

Promise.all(promisesArr);
