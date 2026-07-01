/* eslint-disable global-require, import/no-dynamic-require */
import { Context } from 'koa';
import defaultFeaturesConfig, { getDestinationHandlerName } from '../features';
import { Metadata, SourceHydrationRequest, SourceHydrationOutput } from '../types';
import { BatchDestinationConstructor } from './destination/nativeBatching/batchDestination';

export interface Hydrator {
  hydrate(input: SourceHydrationRequest): Promise<SourceHydrationOutput>;
}

export class MiscService {
  public static getDestHandler(dest: string, version: string) {
    const handlerName = getDestinationHandlerName(dest);
    return require(`../${version}/destinations/${handlerName}/transform`);
  }

  public static getSourceHandler(source: string) {
    return require(`../sources/${source}/transform`);
  }

  public static getSourceHydrateHandler(source: string): Hydrator {
    return require(`../sources/${source}/hydrate`);
  }

  public static getDeletionHandler(dest: string, version: string) {
    const handlerName = getDestinationHandlerName(dest);
    return require(`../${version}/destinations/${handlerName}/deleteUsers`);
  }

  public static getBatchDestinationHandler(dest: string): BatchDestinationConstructor {
    const handlerName = getDestinationHandlerName(dest);
    return require(`../v0/destinations/${handlerName}/routerTransform`).Integration;
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
    };
  }

  public static getMetaTags(metadata?: Metadata) {
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

  public static getFeatures() {
    return JSON.stringify(defaultFeaturesConfig);
  }
}
