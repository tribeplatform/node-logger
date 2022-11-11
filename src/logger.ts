import { AxiosError } from 'axios'
import { createLogger, Logger as WinstonLogger } from 'winston'

import { getLoggerConfig } from './formatters'
import { LoggerInput } from './interface'

export class Logger {
  private readonly logger: WinstonLogger
  context?: string

  constructor(options: LoggerInput) {
    this.logger = createLogger(getLoggerConfig(options))
    this.context = options?.context
  }

  setContext(context: string) {
    this.context = context
  }

  static getCleanedMeta(meta: any[], extraMeta: Record<string, any>): any[] {
    const cleanedMeta = [...meta]
    if (cleanedMeta[0]) {
      switch (typeof cleanedMeta[0]) {
        case 'string':
          cleanedMeta[0] = { ...extraMeta, context: cleanedMeta[0] }
          break
        case 'object':
          cleanedMeta[0] = { ...extraMeta, ...cleanedMeta[0] }
          break
      }
    } else {
      cleanedMeta[0] = { ...extraMeta }
    }
    return cleanedMeta
  }

  static getCleanedError(error: Error): {
    message: string
    stack?: string
    errorDetail: Record<string, any>
  } {
    let errorDetail: Record<string, any>
    if (error['isAxiosError']) {
      const axiosError = error as AxiosError
      errorDetail = {
        code: axiosError.code,
        response: {
          status: axiosError?.response?.status,
          statusText: axiosError?.response?.statusText,
          data: axiosError?.response?.data,
        },
        config: {
          url: axiosError.config.url,
          method: axiosError.config.method,
          baseURL: axiosError.config.baseURL,
          timeout: axiosError.config.timeout,
        },
      }
    } else {
      let actualError = error['actualError']
      if (actualError) {
        actualError = this.getCleanedError(error['actualError'])
      }

      let response = error['response']
      if (response) {
        let errorsList = response['errorsList']
        if (errorsList) {
          errorsList = errorsList.map(error => this.getCleanedError(error))
        }
        response = { ...response, errorsList }
      }

      errorDetail = {
        ...error,
        response,
        actualError,
        message: undefined,
        stack: undefined,
      }
    }
    return {
      message: error.message,
      stack: error.stack,
      errorDetail,
    }
  }

  static getCleanedMessage(
    message: any,
    meta: any[],
    context?: string,
  ): { cleanedMessage: any; cleanedMeta: any[] } {
    let cleanedMessage = message
    let cleanedMeta = meta
    let extraMeta: Record<string, any> = { context }

    if (typeof message === 'function') {
      cleanedMessage = message()
    }
    if (!cleanedMessage) {
      cleanedMessage = ''
    } else if (!(cleanedMessage instanceof Error) && typeof cleanedMessage === 'object') {
      cleanedMeta = [cleanedMessage, ...cleanedMeta]
      cleanedMessage = ''
    } else if (cleanedMessage instanceof Error) {
      const error = this.getCleanedError(cleanedMessage)
      extraMeta = {
        ...extraMeta,
        stack: error.stack,
        errorDetail: error.errorDetail,
      }
      cleanedMessage = error.message
    }

    return {
      cleanedMessage,
      cleanedMeta: this.getCleanedMeta(cleanedMeta, extraMeta),
    }
  }

  verbose(message: any, ...meta: any[]): void {
    const { cleanedMessage, cleanedMeta } = Logger.getCleanedMessage(
      message,
      meta,
      this.context,
    )
    this.logger.verbose(cleanedMessage, ...cleanedMeta)
  }

  debug(message: any, ...meta: any[]): void {
    const { cleanedMessage, cleanedMeta } = Logger.getCleanedMessage(
      message,
      meta,
      this.context,
    )
    this.logger.debug(cleanedMessage, ...cleanedMeta)
  }

  log(message: any, ...meta: any[]): void {
    const { cleanedMessage, cleanedMeta } = Logger.getCleanedMessage(
      message,
      meta,
      this.context,
    )
    this.logger.info(cleanedMessage, ...cleanedMeta)
  }

  info(message: any, ...meta: any[]): void {
    this.log(message, ...meta)
  }

  warn(message: any, ...meta: any[]): void {
    const { cleanedMessage, cleanedMeta } = Logger.getCleanedMessage(
      message,
      meta,
      this.context,
    )
    this.logger.warn(cleanedMessage, ...cleanedMeta)
  }

  error(message: any, ...meta: any[]): void {
    const { cleanedMessage, cleanedMeta } = Logger.getCleanedMessage(
      message,
      meta,
      this.context,
    )
    this.logger.error(cleanedMessage, ...cleanedMeta)
  }
}
