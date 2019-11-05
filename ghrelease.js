var ghRelease = require('gh-release')

// all options have defaults and can be omitted
var options = {
  tag_name: 'v0.1.1',
  target_commitish: 'master',
  name: 'v0.1.1',
  draft: false,
  prerelease: false,
  repo: 'rudder-transformer',
  owner: 'RudderLabs',
  endpoint: 'https://api.github.com' // for GitHub enterprise, use http(s)://hostname/api/v3
}


// or an API token
options.auth = {  
  token: process.env.GH_TOKEN
}

ghRelease(options, function (err, result) {
  if (err) throw err
  console.log(result) // create release response: https://developer.github.com/v3/repos/releases/#response-4
})

