const ghRelease = require("gh-release");
const homedir = require("os").homedir();
const fs = require("fs");

// all options have defaults and can be omitted
const options = {
  tag_name: "v0.1.1",
  target_commitish: "master",
  name: "v0.1.1",
  draft: false,
  prerelease: false,
  repo: "rudder-transformer",
  owner: "RudderLabs",
  endpoint: "https://api.github.com" // for GitHub enterprise, use http(s)://hostname/api/v3
};

const token = fs.readFileSync(homedir + "/.gh_token", "utf8");
options.auth = {
  token
};

ghRelease(options, function(err, result) {
  if (err) throw err;
  console.log(result); // create release response: https://developer.github.com/v3/repos/releases/#response-4
});
