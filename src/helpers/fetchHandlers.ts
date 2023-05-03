import MiscService from '../services/misc';

export default class FetchHandler {
  private static sourceHandlerMap: Map<string, any> = new Map();

  private static destHandlerMap: Map<string, any> = new Map();

  private static deletionHandlerMap: Map<string, any> = new Map();

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

  public static getSourceHandler(source: string, version: string) {
    let sourceHandler: any;
    if (this.sourceHandlerMap.has(source)) {
      sourceHandler = this.sourceHandlerMap.get(source);
    } else {
      sourceHandler = MiscService.getSourceHandler(source, version);
      this.sourceHandlerMap.set(source, sourceHandler);
    }
    return sourceHandler;
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
