const yahooDspPostRequestHandler = (url, payload) => {
    if(url === "https://id.b2b.yahooinc.com/identity/oauth2/access_token"){
        return {response: payload,  status:200};
    }
  };
module.exports = yahooDspPostRequestHandler;
