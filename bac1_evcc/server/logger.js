import * as winston from 'winston'
import 'winston-daily-rotate-file'
import * as path from 'path'

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

//Log Levels are: Info, Error, Warn, Debug

const { createLogger, format, transports } = winston

const loggingFormat = format.printf(({  level, message, label, timestamp, }) => `${timestamp} [${label}] ${level}: ${message}`)

const myFormat = format.printf( ({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });

export const logger = createLogger({
  level: 'debug',  //default log level is 'info'
  format: format.combine(
    format.splat(), // formats level.message based on Node's util.format().
    format.label({ label: "DISTRIBUTOR" }),
    format.colorize(),
    format.timestamp(),
    loggingFormat
   
  ),
  
  transports: [
    //
    // - Write to all logs with level `info` and below to `app-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.File({ filename: __dirname + '/log/surplus_distributor/surplus_distributor-error.log', level: 'error' }),
    new transports.File({ filename: __dirname + '/log/surplus_distributor/surplus_distributor-combined.log' }),
    new transports.DailyRotateFile({
      filename: __dirname+ '/log/surplus_distributor/surplus_distributor-combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '1m',

    }),
  ]
});


//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      loggingFormat
    )
  }));
}

logger.info("Surplus_Distributor started/restarted");
