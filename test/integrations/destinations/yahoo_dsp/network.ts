export const networkCallsData = [
  {
    httpReq: {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: 'grant_type=client_credentials&scope=dsp-api-access&realm=dsp&client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer&client_assertion=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkLmIyYi55YWhvb2luYy5jb20vaWRlbnRpdHkvb2F1dGgyL2FjY2Vzc190b2tlbj9yZWFsbT1kc3AiLCJzdWIiOiJkdW1teUNsaWVudElkIiwiaXNzIjoiZHVtbXlDbGllbnRJZCIsImV4cCI6MTY5NTMwODk5MCwiaWF0IjoxNjk1MzA1MzkwfQ.i_UvrIQ7yqPHopZQQTHrGL_GfuBe9MU937cYfTvWyqA',
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
