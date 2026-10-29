import { promises as dns } from 'node:dns';
import https from 'node:https';
import { isIP } from 'node:net';
import ipaddr from 'ipaddr.js';
import { ConfigurationError } from '@rudderstack/integrations-lib';

type Address = { address: string; family: number };
type LookupAll = (hostname: string) => Promise<Address[]>;

const systemLookup: LookupAll = (hostname) => dns.lookup(hostname, { all: true, verbatim: true });

export const isPublicAddress = (address: string): boolean => {
  try {
    const parsed = ipaddr.parse(address);
    const normalized =
      parsed instanceof ipaddr.IPv6 && parsed.isIPv4MappedAddress()
        ? parsed.toIPv4Address()
        : parsed;
    return normalized.range() === 'unicast';
  } catch {
    return false;
  }
};

export const resolvePublicAddress = async (
  hostname: string,
  lookupAll: LookupAll = systemLookup,
): Promise<Address> => {
  const addresses = await lookupAll(hostname);
  if (addresses.length === 0 || addresses.some(({ address }) => !isPublicAddress(address))) {
    throw new ConfigurationError('HTTPS target must resolve only to public IP addresses');
  }
  return addresses[0];
};

export const guardedHttpsAgent = (
  target: string,
  allowedOrigin?: string,
  lookupAll: LookupAll = systemLookup,
): https.Agent => {
  let url: URL;
  let saved: URL | undefined;
  try {
    url = new URL(target);
    saved = allowedOrigin ? new URL(allowedOrigin) : undefined;
  } catch {
    throw new ConfigurationError('HTTPS target URL is invalid');
  }
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    (saved &&
      (saved.protocol !== 'https:' ||
        saved.username ||
        saved.password ||
        saved.origin !== url.origin))
  ) {
    throw new ConfigurationError('HTTPS target must match the saved public HTTPS origin');
  }
  const hostname = url.hostname.replace(/^\[/, '').replace(/]$/, '');
  if (isIP(hostname) && !isPublicAddress(hostname)) {
    throw new ConfigurationError('HTTPS target must use a public IP address');
  }

  return new https.Agent({
    keepAlive: false,
    lookup: (host, options, callback) => {
      const done = callback as (
        error: Error | null,
        address?: string | Address[],
        family?: number,
      ) => void;
      resolvePublicAddress(host, lookupAll)
        .then(({ address, family }) => {
          if (options.all) done(null, [{ address, family }]);
          else done(null, address, family);
        })
        .catch((error) => done(error as Error));
    },
  });
};
