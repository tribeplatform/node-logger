import { Format, format } from 'logform'
import { LoggerOptions, transports } from 'winston'

import { LogFormat, LoggerInput, LogLevel } from './interface'
import { getColorizedText, getContextText } from './utils'

export const WINSTON_MODULE_PROVIDER = 'winston'

export const FORMATTERS: Record<LogFormat, (name: string) => Format> = {
  pretty: name =>
    format.combine(
      format.timestamp({
        format: 'MM/DD/YYYY, h:mm:ss A',
      }),
      format.errors({ stack: true }),
      format.metadata(),
      format.printf(function (info) {
        const level = info.level as LogLevel
        const context = `${getContextText(info.metadata.context)}`
        const applicationName = getColorizedText(`[${name}] -`, level)
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
          `${context}${info.metadata.stack ? info.metadata.stack : info.message}`,
          level,
        )
        const detail = getColorizedText(
          `${metadata === '{}' ? '' : ` ${metadata}`}`,
          'meta',
        )

        return `${applicationName} ${info.metadata.timestamp}  ${message}${detail}`
      }),
    ),
  json: () =>
    format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
}

export const getLoggerConfig = (options: LoggerInput): LoggerOptions => {
  const {
    applicationName,
    level = options?.level || 'info',
    format = options?.format || 'pretty',
  } = options
  return {
    level,
    format: FORMATTERS[format](applicationName),
    transports: [new transports.Console()],
    exceptionHandlers: [new transports.Console()],
  }
}
