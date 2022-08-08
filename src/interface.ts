export declare type LoggerLevel =
  | 'error'
  | 'warn'
  | 'info'
  | 'verbose'
  | 'debug'

export interface LoggerConfig {
  level: LoggerLevel
  overrideTypeOrmLogger: boolean
  prettyPrint: boolean
}

export declare type LogFormat = {
  pid?: boolean,
  prefix?: string,
}