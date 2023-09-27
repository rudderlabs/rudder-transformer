export const networkCallsData = [
  {
    httpReq: {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: 'grant_type=client_credentials&scope=dsp-api-access&realm=dsp&client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer&client_assertion=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkLmIyYi55YWhvb2luYy5jb20vaWRlbnRpdHkvb2F1dGgyL2FjY2Vzc190b2tlbj9yZWFsbT1kc3AiLCJzdWIiOiJhYmNkZWY4LWY0OS00Y2Q2LWI0YzUtOTU4YjNkNjZkNDMxIiwiaXNzIjoiYWJjZGVmOC1mNDktNGNkNi1iNGM1LTk1OGIzZDY2ZDQzMSIsImV4cCI6MTY5NTMwODk5MCwiaWF0IjoxNjk1MzA1MzkwfQ.HdBZJ0PoI8L0LRRdfbYtbJbmtrOAQmfu2APbuIQguIA',
      method: 'POST',
      url: 'https://id.b2b.yahooinc.com/identity/oauth2/access_token',
    },
    httpRes: {
      data: {
        access_token: 'testAuthToken',
        expires_in: 3599,
        scope: 'dsp-api-access',
        token_type: 'Bearer',
      },
      status: 200,
    },
  },
];
