/* eslint-disable global-require, import/no-dynamic-require */
import fs from 'fs';
import path from 'path';
import { Context } from 'koa';
import { DestHandlerMap } from '../constants/destinationCanonicalNames';
import { ErrorDetailer, LoggableExtraData, Metadata } from '../types';
import { getCPUProfile, getHeapProfile } from '../middleware';
import customLogger from '@rudderstack/integrations-lib';

export class MiscService {
  public static getDestHandler(dest: string, version: string) {
    if (DestHandlerMap.hasOwnProperty(dest)) {
      return require(`../${version}/destinations/${DestHandlerMap[dest]}/transform`);
    }
    return require(`../${version}/destinations/${dest}/transform`);
  }

  public static getSourceHandler(source: string, version: string) {
    return require(`../${version}/sources/${source}/transform`);
  }

  public static getDeletionHandler(dest: string, version: string) {
    return require(`../${version}/destinations/${dest}/deleteUsers`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getRequestMetadata(ctx: Context) {
    // TODO: Parse information such as
    // cluster, namespace, etc information
    // from the request
    return {
      namespace: 'Unknown',
      cluster: 'Unknown',
      features: ctx.state?.features || {},
      serviceContext: {},
    };
  }

  public static getMetaTags(metadata: Metadata) {
    if (!metadata) {
      return {};
    }
    return {
      sourceType: metadata.sourceType,
      destinationType: metadata.destinationType,
      k8_namespace: metadata.namespace,
    };
  }

  public static getHealthInfo() {
    const { git_commit_sha: gitCommitSha, transformer_build_version: imageVersion } = process.env;
    return {
      service: 'UP',
      ...(imageVersion && { version: imageVersion }),
      ...(gitCommitSha && { gitCommitSha }),
    };
  }

  public static getBuildVersion() {
    return process.env.transformer_build_version || 'Version Info not found';
  }

  public static getVersion() {
    return process.env.npm_package_version || 'Version Info not found';
  }

  public static getFetaures() {
    const obj = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../features.json'), 'utf8'));
    return JSON.stringify(obj);
  }

  public static async getCPUProfile(seconds: number) {
    return getCPUProfile(seconds);
  }

  public static async getHeapProfile() {
    return getHeapProfile();
  }

  public static getLoggableData(errorDetailer: ErrorDetailer): Partial<LoggableExtraData> {
    return {
      ...(errorDetailer?.destinationId && { destinationId: errorDetailer.destinationId }),
      ...(errorDetailer?.sourceId && { sourceId: errorDetailer.sourceId }),
      ...(errorDetailer?.workspaceId && { workspaceId: errorDetailer.workspaceId }),
      ...(errorDetailer?.destType && { destType: errorDetailer.destType }),
      module: errorDetailer.module,
      implementation: errorDetailer.implementation,
    };
  }

  public static logError(errorMessage: string, errorDetailer: ErrorDetailer) {
    const loggableExtraData: Partial<LoggableExtraData> = this.getLoggableData(errorDetailer);
    customLogger.errorw(errorMessage || '', loggableExtraData);
  }
}
