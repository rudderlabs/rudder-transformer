import { RouterIntegrationConstructor } from '../services/destination/routerIntegration';
import { Hydrator, MiscService } from '../services/misc';

export class FetchHandler {
  private static sourceHandlerMap: Map<string, any> = new Map();

  private static sourceHydrateHandlerMap: Map<string, Hydrator> = new Map();

  private static destHandlerMap: Map<string, any> = new Map();

  private static deletionHandlerMap: Map<string, any> = new Map();

  private static routerTransformHandlerMap: Map<string, RouterIntegrationConstructor> = new Map();

  public static getDestHandler(dest: string, version: string) {
    let destinationHandler: any;
    if (this.destHandlerMap.has(dest)) {
      destinationHandler = this.destHandlerMap.get(dest);
    } else {
      destinationHandler = MiscService.getDestHandler(dest, version);
      this.destHandlerMap.set(dest, destinationHandler);
    }
    return destinationHandler;
  }

  public static getSourceHandler(source: string) {
    let sourceHandler: any;
    if (this.sourceHandlerMap.has(source)) {
      sourceHandler = this.sourceHandlerMap.get(source);
    } else {
      sourceHandler = MiscService.getSourceHandler(source);
      this.sourceHandlerMap.set(source, sourceHandler);
    }
    return sourceHandler;
  }

  public static getSourceHydrateHandler(source: string): Hydrator {
    const sourceHydrateHandler = this.sourceHydrateHandlerMap.get(source);
    if (sourceHydrateHandler) {
      return sourceHydrateHandler;
    }
    const newSourceHydrateHandler = MiscService.getSourceHydrateHandler(source);
    this.sourceHydrateHandlerMap.set(source, newSourceHydrateHandler);
    return newSourceHydrateHandler;
  }

  public static getRouterTransformHandler(dest: string): RouterIntegrationConstructor {
    const key = dest.toLowerCase();
    const routerTransformHandler = this.routerTransformHandlerMap.get(key);
    if (routerTransformHandler) {
      return routerTransformHandler;
    }
    const handler = MiscService.getRouterTransformHandler(key);
    this.routerTransformHandlerMap.set(key, handler);
    return handler;
  }

  public static getDeletionHandler(dest: string, version: string) {
    let deletionHandler: any;
    if (this.deletionHandlerMap.has(dest)) {
      deletionHandler = this.deletionHandlerMap.get(dest);
    } else {
      deletionHandler = MiscService.getDeletionHandler(dest, version);
      this.deletionHandlerMap.set(dest, deletionHandler);
    }
    return deletionHandler;
  }
}
