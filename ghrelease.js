const ghRelease = require("gh-release");
const homedir = require("os").homedir();
const fs = require("fs");

// all options have defaults and can be omitted
const options = {
  tag_name: "v0.1.2",
  name: "v0.1.2",
  draft: false,
  prerelease: false,
  repo: "rudder-transformer",
  owner: "RudderLabs",
  endpoint: "https://api.github.com" // for GitHub enterprise, use http(s)://hostname/api/v3
};

let token = fs.readFileSync(homedir + "/.gh_token", "utf8");
token = token.replace(/\n/g, "");

options.auth = {
  token
};

ghRelease(options, function(err, result) {
  if (err) throw err;
  console.log(result); // create release response: https://developer.github.com/v3/repos/releases/#response-4
});
