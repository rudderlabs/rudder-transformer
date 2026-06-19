// Regression test for the SSRF-via-redirect fix. Uses the REAL node-fetch (not
// mocked) so that node-fetch actually re-invokes the per-hop agent function on the
// redirect target — that per-hop call is the entire protection. If `agent` is ever
// reverted to a single Agent instance, the redirect hop stops being validated and
// these tests fail.
//
// Loopback is allow-listed so the local test server (acting as the "external"
// redirector) is reachable; the redirect TARGET (169.254.169.254 cloud metadata)
// is NOT allow-listed and must be blocked on the redirect hop, before any connect.
process.env.ALLOW_IP_RANGES = '127.0.0.0/8';
// The blocked-redirect test aborts mid-hop; without this, node-fetch can return
// the initial hop's keep-alive socket to the shared agent pool in a bad state and
// the next test's redirect follow fails with "Premature close".
process.env.SHARED_HTTP_AGENT_DISABLE_KEEP_ALIVE = 'true';

jest.resetModules();
const http = require('http');
const { fetchWithDnsWrapper } = require('./utils');

describe('fetchWithDnsWrapper redirect SSRF guard (real node-fetch)', () => {
  let server;
  let base;
  const sockets = new Set();

  beforeAll((done) => {
    server = http.createServer((req, res) => {
      if (req.url === '/redirect-internal') {
        res.writeHead(302, { Location: 'http://169.254.169.254/latest/meta-data/' });
        res.end();
      } else if (req.url === '/redirect-ok') {
        res.writeHead(302, { Location: `${base}/final` });
        res.end();
      } else if (req.url === '/final') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
      } else {
        res.writeHead(404);
        res.end();
      }
    });
    // Track sockets so keep-alive connections can be torn down at teardown.
    server.on('connection', (socket) => {
      sockets.add(socket);
      socket.on('close', () => sockets.delete(socket));
    });
    server.listen(0, '127.0.0.1', () => {
      base = `http://127.0.0.1:${server.address().port}`;
      done();
    });
  });

  afterEach(() => {
    sockets.forEach((socket) => socket.destroy());
  });

  afterAll((done) => {
    sockets.forEach((socket) => socket.destroy());
    server.close(done);
  });

  it('blocks a 3xx redirect whose target is an internal address (the reported exploit)', async () => {
    await expect(fetchWithDnsWrapper({}, `${base}/redirect-internal`)).rejects.toThrow(
      'blocked request to non-public address: 169.254.169.254',
    );
  });

  it('still follows a redirect to an allowed target', async () => {
    const res = await fetchWithDnsWrapper({}, `${base}/redirect-ok`);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('OK');
  });
});
