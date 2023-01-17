import MiscService from "../services/misc";

export default class FetchHandler {
  private static sourceHandlerMap: Map<string, any> = new Map();
  private static destHandlerMap: Map<string, any> = new Map();

  public static getDestHandler(dest: string, version: string) {
    let destinationHandler: any;
    if (this.destHandlerMap.get(dest)) {
      destinationHandler = this.destHandlerMap.get(dest);
    } else {
      destinationHandler = MiscService.getDestHandler(dest, version);
      this.destHandlerMap.set(dest, destinationHandler);
    }
    return destinationHandler;
  }

  public static getSourceHandler(source: string, version: string) {
    let sourceHandler: any;
    if (this.sourceHandlerMap.get(source)) {
      sourceHandler = this.sourceHandlerMap.get(source);
    } else {
      sourceHandler = MiscService.getSourceHandler(source, version);
      this.sourceHandlerMap.set(source, sourceHandler);
    }
    return sourceHandler;
  }
}
