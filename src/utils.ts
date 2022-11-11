import * as chalk from 'chalk'
import { LogLevel } from './interface'

export const getContextText = (context: string): string => {
  if (!context) {
    return ''
  }
  return `[${context}] `
}

export const getLevelText = (level: LogLevel): string => {
  return `(${level.toUpperCase()})`
}

export const getColorizedText = (text: string, level: LogLevel | 'meta') => {
  switch (level) {
    case 'debug':
      return chalk.magenta(text)
    case 'verbose':
      return chalk.cyan(text)
    case 'info':
      return chalk.green(text)
    case 'warn':
      return chalk.yellow(text)
    case 'error':
      return chalk.red(text)
    case 'meta':
      return chalk.gray(text)
    default:
      return chalk.green(text)
  }
}
