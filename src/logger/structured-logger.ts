import { createLogger, transports, format } from 'winston';
import { LoggableExtraData } from '../types';

const { timestamp, combine, metadata, printf, align, errors, json } = format;

const metadataKey = 'extraData';

const logger = createLogger({
  level: 'debug',
  format: combine(
    timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss',
    }),
    errors({ stack: true }),
    align(),
    metadata({
      key: metadataKey,
      fillExcept: [
        'timestamp',
        'level',
        'message',
        'stack',
        'destinationResponse',
        'authErrorCategory',
      ],
    }),
    printf((info) => {
      let extraData = '';
      if (info?.[metadataKey]) {
        extraData += ` ${JSON.stringify(info[metadataKey])}`;
      }
      return `${info.timestamp} ${info.level}: ${info.message}${extraData}`;
    }),
    json(),
  ),
  transports: [new transports.Console()],
});

interface LeveledLogMethod {
  (message: string, extraData?: Partial<LoggableExtraData>): void;
  (infoObject: { message: string } & Partial<LoggableExtraData>): void;
}

interface CustLogger {
  errorw: LeveledLogMethod;
  infow: LeveledLogMethod;
  debugw: LeveledLogMethod;
  warnw: LeveledLogMethod;
}

const objectLogger: CustLogger = Object.entries({
  debugw: 'debug',
  infow: 'info',
  warnw: 'warning',
  errorw: 'error',
}).reduce(
  (agg, curr) => {
    const [custLogMethod, winstonLogLevel] = curr;

    const method = (
      msg: string | ({ message: string } & Partial<LoggableExtraData>),
      ex?: Partial<LoggableExtraData>,
    ) => {
      const loggableExtraData: Partial<LoggableExtraData> = {
        ...(ex?.destinationId && { destinationId: ex.destinationId }),
        ...(ex?.workspaceId && { workspaceId: ex.workspaceId }),
        ...(ex?.destType && { destType: ex.destType }),
        ...(ex?.sourceId && { sourceId: ex.sourceId }),
        ...(ex?.module && { module: ex.module }),
        ...(ex?.implementation && { implementation: ex.implementation }),
      };
      if (typeof msg === 'object') {
        logger.log(winstonLogLevel, msg.message, loggableExtraData);
        return;
      }
      logger.log(winstonLogLevel, msg, loggableExtraData);
    };
    return { ...agg, [custLogMethod]: method };
  },
  { errorw: () => {}, infow: () => {}, debugw: () => {}, warnw: () => {} },
);

const customLogger = Object.assign(logger, objectLogger);

export default customLogger;
