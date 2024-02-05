export const networkCallsData = [
  {
    description: 'When mid is invalid',
    httpReq: {
      url: 'https://track.linksynergy.com/ep',
      params: {
        mid: 'invalid_mid',
        xml: 1,
        amtlist: '12500|12500',
        qlist: '|5',
        ord: 'SampleOrderId',
        tr: 'SampleRanSiteID',
        land: '20240129_1200',
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    },
    httpRes: {
      status: 400,
      data: '<!doctype html><html lang="en"><head><title>HTTP Status 400 – Bad Request</title></head><body><h1>HTTP Status 400 – Bad Request</h1></body></html>',
    },
  },
  {
    description: 'When mid is valid but there is no access',
    httpReq: {
      url: 'https://track.linksynergy.com/ep',
      params: {
        mid: 'access_denied_for_mid',
        xml: 1,
        amtlist: '12500|12500',
        qlist: '|5',
        ord: 'SampleOrderId',
        tr: 'SampleRanSiteID',
        land: '20240129_1200',
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    },
    httpRes: {
      status: 200,
      data: '<response><error>Access denied</error></response>',
    },
  },
  {
    description: 'When record along with mid is valid',
    httpReq: {
      url: 'https://track.linksynergy.com/ep',
      params: {
        mid: 'valid_mid_with_good_records',
        xml: 1,
        amtlist: '12500|12500',
        qlist: '|5',
        ord: 'SampleOrderId',
        tr: 'SampleRanSiteID',
        land: '20240129_1200',
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    },
    httpRes: {
      status: 200,
      data: '<response><unique_id>uniqueId</unique_id><summary><transactions><good>3</good><bad>0</bad></transactions></summary></response>',
    },
  },
  {
    description: 'When records are invalid and mid is valid',
    httpReq: {
      url: 'https://track.linksynergy.com/ep',
      params: {
        mid: 'valid_mid_with_bad_records',
        xml: 1,
        amtlist: '12500|12500',
        qlist: '|5',
        ord: 'SampleOrderId',
        tr: 'SampleRanSiteID',
        land: '20240129_1200',
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'GET',
    },
    httpRes: {
      status: 200,
      data: '<response><unique_id>uniqueId</unique_id><summary><transactions><good>0</good><bad>3</bad></transactions></summary></response>',
    },
  },
];
