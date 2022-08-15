import { format } from "logform";
import { LoggerOptions, transports } from "winston";

import { LogFormat, LoggerLevel } from "./interface";
import { getColorizedText } from "./utils";

export const WINSTON_MODULE_PROVIDER = "winston";

export const prettyFormatter = (options: LogFormat) =>
  format.combine(
    format.timestamp({
      format: "MM/DD/YYYY, h:mm:ss A",
    }),
    format.errors({ stack: true }),
    format.metadata(),
    format.printf(function (info) {
      const label = getColorizedText(`[${info.metadata.context}]`, "warn");
      const loggerLevel = info.level as LoggerLevel;
      const processInfo = getColorizedText(
        `[${options.prefix || "Logger"}] ${
          options?.pid ? process.pid : ""
        }   -`,
        loggerLevel
      );
      const metadata = JSON.stringify(
        {
          ...info.metadata,
          timestamp: undefined,
          context: undefined,
          dd: undefined,
          stack: undefined,
        },
        null,
        2
      );
      const message = getColorizedText(
        `${info.metadata.stack ? info.metadata.stack : info.message}`,
        loggerLevel
      );
      const detail = `${metadata === "{}" ? "" : ` ${metadata}`}`;
      return `${processInfo} ${info.metadata.timestamp}   ${label} ${message}${detail}`;
    })
  );

export const jsonFormatter = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json()
);

export const getLoggerConfig = (options: {
  level?: LoggerLevel;
  pretty?: boolean;
  formatter?: LogFormat;
  debug?: boolean;
}): LoggerOptions => {
  const {
    level = options?.level || "info",
    pretty = options.pretty,
    formatter = {
      pid: true,
      prefix: 'Logger'
    }
  } = options;
  return {
    level,
    format: pretty ? prettyFormatter(formatter) : jsonFormatter,
    transports: [new transports.Console()],
    exceptionHandlers: [new transports.Console()],
  };
};
