/**
 * Secret-path manifest: which fields of the outbound request a destination builds must be
 * masked before that request is shown in a destination live event.
 *
 * The manifest is derived, not authored. `test/secret-paths/generate.ts` runs every
 * destination's transform twice over the component-test corpus - once with the real config,
 * once with format-preserving decoys substituted for the values named by the destination
 * definition's `secretKeys` - and records which output fields moved.
 *
 * The contract is deliberately minimal: a list of paths. The consumer replaces the value at
 * each path and is not asked to know why the field is sensitive, to resolve config values, or
 * to reason about how a credential was encoded on its way into the field.
 */

/**
 * `null` means "mask everything maskable": every header and param value, and the body. Emitted
 * when the derivation could not produce an answer for a destination.
 *
 * `null` rather than a sentinel path such as `["*"]` because the fail-closed case is the absence
 * of an answer, not a path, and giving it a path-shaped spelling invites it to be used as one:
 * `*` is a gjson wildcard, so passing it to sjson.Set replaces the first top-level key of the
 * payload and returns no error - masking nothing and destroying the payload. `null` cannot be
 * iterated by mistake, and it makes a destination that is absent from the map and one that is
 * present-but-uncomputable the same case, which is what they always were.
 *
 * It does NOT cover the endpoint: that field is excluded from masking everywhere, including here
 * (see ENDPOINT_FIELD in ./path), so that a URL stays readable in live events even for a
 * destination that failed closed.
 */

/** Why a destination has no derived entry, so gaps are countable rather than invisible. */
export type UnresolvedReason =
  /** No component-test fixtures to diff. */
  | 'no-fixtures'
  /**
   * Neither secret source had anything to offer: the destination declares no `secretKeys` (or an
   * empty list), and no fixture in its corpus carries a `metadata.secret` bag either. Both are
   * checked, so this is not "nothing was declared" but "nothing was declared and nothing was
   * handed over at runtime".
   */
  | 'no-declared-secrets'
  /** The transform emits no HTTP request (streaming / object-storage destinations). */
  | 'no-http-request'
  /** Substituting a decoy changed the output's shape, so the diff is not trustworthy. */
  | 'unstable-under-substitution'
  /**
   * A request was built, but nothing from either secret source reached it in any fixture. Still
   * fail-closed: an unexercised branch is indistinguishable from a destination that sends no
   * credential.
   *
   * Reached more often now that the runtime bag is a source, because the corpus over-reports who
   * has one: `generateMetadata` attaches a `secret` object to every case it builds, so a
   * destination that never reads one is still measured against it and correctly finds nothing.
   */
  | 'no-secret-located'
  /**
   * A credential lands in a family of dynamically-numbered keys whose size varies per request -
   * AWIN emits one `bd[N]` param per product. gjson/sjson cannot address such a family
   * (`params.bd*` masks only the first match), and pinning the indices a fixture happened to
   * contain would leak every key beyond them.
   *
   * Normally the containing object is masked instead, which does cover the family. This reason
   * is only reached when the family sits at the top level of the request, where there is no
   * containing object to name.
   */
  | 'dynamic-key-family'
  /**
   * No destination definition could be read at all.
   *
   * Kept distinct from `no-declared-secrets` - which is the positive statement that a definition
   * was read and declared none - so the two are countable separately, but it masks the same:
   * a destination with no definition cannot be configured in the control plane, so it holds no
   * customer credentials to expose. Both destinations in this state today are internal
   * (a test-only destination, and a proxy-only variant that ships no transform).
   *
   * The risk this accepts is a real destination whose definition disappears upstream - a rename,
   * say - quietly becoming unmasked. `--check` is what catches that: the derived paths change,
   * CI fails, and the diff shows `["headers.Authorization"] -> []` for review rather than the
   * change landing silently.
   */
  | 'no-definition'
  /**
   * The derivation could not run: a fixture would not load, or the harness threw. A corpus or
   * generator defect rather than evidence about where a credential lands - kept distinct so a
   * build problem is not filed as a security finding.
   */
  | 'harness-error'
  /**
   * Every field that carried a declared secret was the endpoint, which is excluded from masking
   * by decision (see ENDPOINT_FIELD in ./path). The empty list is therefore a policy outcome,
   * not a finding that nothing was there - a distinction the list alone cannot express, and the
   * reason this has its own entry rather than collapsing into `no-secret-located`.
   */
  | 'endpoint-only';

/**
 * What each reason implies for masking. Kept beside the reasons themselves so a new reason is a
 * compile-time decision about its consequence, rather than a condition to remember to add in
 * the generator. Only the two reasons that mean "nothing reached the request" clear the list.
 */
export const MASKING_FOR_REASON: Record<UnresolvedReason, string[] | null> = {
  // Nothing to mask: no config field is declared a credential and no runtime credential bag was
  // ever handed over, so there is no secret for this destination to put anywhere;
  // `no-http-request` builds no request to show in the first place. Widening the configured half
  // is done by populating `secretKeys` in rudder-integrations-config, not by second-guessing it
  // here. The runtime half needs no declaration - but it does need a fixture, which is the gap
  // this reason still covers for an OAuth destination whose corpus carries no `metadata.secret`.
  'no-declared-secrets': [],
  'no-http-request': [],
  // Also nothing to mask: the destination declares credentials, and perturbing every one of them
  // moved nothing in the request. Usually the declared key belongs to a different flow - AM
  // declares `apiSecret` and MP `gdprApiToken`, both of which serve the deletion API, and
  // deletion never records a destination live event (rudder-server records them from the
  // processor, the router and the batch router; regulation-worker does not). So the declared
  // credential cannot appear on the surface this list protects.
  'no-secret-located': [],
  // See the reason's own note: no definition means the destination is not configurable, so there
  // are no configured credentials. A definition that vanishes upstream surfaces via `--check`.
  'no-definition': [],
  // Nothing *maskable*: the credential was located, in the one field the contract excludes. The
  // generator reports these separately so the exclusion stays visible rather than reading as an
  // absence of secrets.
  'endpoint-only': [],
  // Fail closed. These declare credentials the derivation could not place *and* could not rule
  // out - an unexercised branch is indistinguishable from a destination that sends nothing.
  'no-fixtures': null,
  'unstable-under-substitution': null,
  'dynamic-key-family': null,
  'harness-error': null,
};

export interface SecretPathsManifest {
  /**
   * Schema version. Bumped when the consumer contract changes.
   *
   * Deliberately the only non-derived field. The artifact holds no build stamp and no content
   * hash, so the same code and the same `secretKeys` produce the same bytes everywhere - which
   * is what lets `--check` be a plain byte comparison rather than a set of exemptions for the
   * fields that would otherwise vary.
   */
  version: number;
  /**
   * destType -> every path in its outbound request that must be masked. Authoritative: an
   * empty list means nothing to mask, and `null` means mask everything maskable. A destType
   * absent from this map is the same case as `null`.
   *
   * The consumer-facing contract - path notation, the `#` array rule, the sjson caveats - is
   * declared once in swagger/components/schemas/features.yaml. Do not restate it here.
   */
  destinations: Record<string, string[] | null>;
  /**
   * Why a destination got `null` or an empty list. Diagnostics only - the masking decision is
   * already expressed in `destinations`, so a consumer never needs to read this.
   */
  unresolved: Record<string, UnresolvedReason>;
  /**
   * destType -> how its endpoint carries a credential, for the destinations where one reached the
   * excluded field. Diagnostics only.
   *
   * `url` is a webhook whose URL *is* the shared secret, with no separable parameter - knowingly
   * unmasked. `query` is a credential that belongs in `params`, where it would be masked, but
   * that the destination concatenated into the endpoint string instead; each of those is fixable
   * in the destination's transform without changing anything on the wire.
   *
   * Recorded in the artifact rather than only printed, so the set is diffable in review and a
   * newly-added `query` exposure is visible instead of scrolling past in a generator log.
   */
  endpointExposures: Record<string, EndpointExposure>;
}

/** Where in an excluded endpoint a credential sits. See `SecretPathsManifest.endpointExposures`. */
export type EndpointExposure = 'query' | 'url';
