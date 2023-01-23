import { Logger as WinstonLogger } from 'winston'

export declare type LogLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug'
export declare type LogFormat = 'pretty' | 'json'

export interface LoggerConfig {
  level: LogLevel
  overrideTypeOrmLogger: boolean
  prettyPrint: boolean
}

export declare type LoggerInput = {
  applicationName: string
  level?: LogLevel
  format?: LogFormat
  context?: string
  logger?: WinstonLogger
}
