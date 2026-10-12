import { requireLiveField } from '@rudderstack/integrations-lib/build/live-test';
import type { LiveSecret } from './types';

/** A mandatory `secret` entry: a credential the transform (or an SDK) reads at run time. */
export const requiredSecretField = (
  secret: LiveSecret,
  destination: string,
  field: string,
  mustBe: string,
): string =>
  requireLiveField(secret.secret?.[field], {
    name: destination,
    path: `secret.${field}`,
    mustBe,
  });

/** A mandatory `resourceIds` entry: an account-scoped id the scenarios target. */
export const requiredResourceId = (
  secret: LiveSecret,
  destination: string,
  key: string,
  mustBe: string,
): string =>
  requireLiveField(secret.resourceIds?.[key], {
    name: destination,
    path: `resourceIds.${key}`,
    mustBe,
  });
