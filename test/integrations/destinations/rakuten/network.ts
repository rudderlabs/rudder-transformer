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
      data: '<!doctype html><html lang="en"><head><title>HTTP Status 400 – Bad Request</title><style type="text/css">h1 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:22px;} h2 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:16px;} h3 {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;font-size:14px;} body {font-family:Tahoma,Arial,sans-serif;color:black;background-color:white;} b {font-family:Tahoma,Arial,sans-serif;color:white;background-color:#525D76;} p {font-family:Tahoma,Arial,sans-serif;background:white;color:black;font-size:12px;} a {color:black;} a.name {color:black;} .line {height:1px;background-color:#525D76;border:none;}</style></head><body><h1>HTTP Status 400 – Bad Request</h1></body></html>',
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
