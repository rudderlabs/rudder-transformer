/* eslint-disable global-require, import/no-dynamic-require */
import { Context } from 'koa';
import { DestHandlerMap } from '../constants/destinationCanonicalNames';
import { Metadata, SourceHydrationRequest, SourceHydrationOutput } from '../types';
import defaultFeaturesConfig from '../features';

export interface Hydrator {
  hydrate(input: SourceHydrationRequest): Promise<SourceHydrationOutput>;
}

export class MiscService {
  public static getDestHandler(dest: string, version: string) {
    if (DestHandlerMap.hasOwnProperty(dest)) {
      return require(`../${version}/destinations/${DestHandlerMap[dest]}/transform`);
    }
    return require(`../${version}/destinations/${dest}/transform`);
  }

  public static getSourceHandler(source: string) {
    return require(`../sources/${source}/transform`);
  }

  public static getSourceHydrateHandler(source: string): Hydrator {
    return require(`../sources/${source}/hydrate`);
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
