const { processAxiosResponse } = require('./networkUtils');

describe('processAxiosResponse with no HTTP response', () => {
  const cases = [
    ['EMFILE', 500, '[EMFILE] :: Too many open files in system'],
    ['ENFILE', 500, '[ENFILE] :: File table overflow'],
    ['EPIPE', 500, '[EPIPE] :: Broken pipe'],
    ['EHOSTUNREACH', 500, '[EHOSTUNREACH] :: Host is unreachable'],
    ['ENETUNREACH', 500, '[ENETUNREACH] :: Network is unreachable'],
    ['ENETDOWN', 500, '[ENETDOWN] :: Network is down'],
    ['EADDRNOTAVAIL', 500, '[EADDRNOTAVAIL] :: Address not available'],
    [
      'ERR_SOCKET_CONNECTION_TIMEOUT',
      500,
      '[ERR_SOCKET_CONNECTION_TIMEOUT] :: Could not connect to any resolved address in time',
    ],
    ['ECONNRESET', 500, '[ECONNRESET] :: Connection reset by peer'],
    ['ENOTFOUND', 400, '[ENOTFOUND] :: DNS lookup failed'],
    ['EACCES', 400, '[EACCES] :: Permission denied'],
    ['EPERM', 400, '[EPERM] :: Operation not permitted'],
    ['ENOENT', 400, '[ENOENT] :: No such file or directory'],
    ['EFOO', 400, '[EFOO]'],
  ];

  it.each(cases)('classifies %s as %s', (code, status, message) => {
    expect(processAxiosResponse({ success: false, response: { code } })).toEqual({
      status,
      response: message,
    });
  });
});
