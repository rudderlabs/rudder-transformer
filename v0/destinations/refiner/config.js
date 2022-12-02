const BASE_ENDPOINT = "https://api.refiner.io/v1";

const CONFIG_CATEGORIES = {
  IDENTIFY_USER: {
    endpoint: `${BASE_ENDPOINT}/identify-user`
  },
  TRACK_EVENT: {
    endpoint: `${BASE_ENDPOINT}/track`
  },
  GROUP_USERS: {
    endpoint: `${BASE_ENDPOINT}/identify-user`
  }
};

module.exports = {
  BASE_ENDPOINT,
  CONFIG_CATEGORIES,
  DESTINATION: "REFINER"
};
