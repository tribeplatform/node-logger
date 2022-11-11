import { Format, format } from 'logform'
import { LoggerOptions, transports } from 'winston'

import { LogFormat, LoggerInput, LogLevel } from './interface'
import { getColorizedText } from './utils'

export const WINSTON_MODULE_PROVIDER = 'winston'

export const FORMATTERS: Record<LogFormat, Format> = {
  pretty: format.combine(
    format.timestamp({
      format: 'MM/DD/YYYY, h:mm:ss A',
    }),
    format.errors({ stack: true }),
    format.metadata(),
    format.printf(function (info) {
      const level = info.level as LogLevel
      const label = info.metadata.context ? `[${info.metadata.context}] ` : ''
      const processInfo = getColorizedText(`${label}(${level}) -`, level)

      const metadata = JSON.stringify(
        {
          ...info.metadata,
          timestamp: undefined,
          context: undefined,
          dd: undefined,
          stack: undefined,
        },
        null,
        2,
      )
      const message = getColorizedText(
        `${info.metadata.stack ? info.metadata.stack : info.message}`,
        level,
      )
      const detail = getColorizedText(
        `${metadata === '{}' ? '' : ` ${metadata}`}`,
        'meta',
      )

      return `${processInfo} ${info.metadata.timestamp}  ${message}${detail}`
    }),
  ),
  json: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
}

export const getLoggerConfig = (options: LoggerInput): LoggerOptions => {
  const { level = options?.level || 'info', format = options?.format || 'pretty' } =
    options
  return {
    level,
    format: FORMATTERS[format],
    transports: [new transports.Console()],
    exceptionHandlers: [new transports.Console()],
  }
}
