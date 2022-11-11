import * as chalk from 'chalk'
import { LogLevel } from './interface'

export const getContextText = (context: string): string => {
  let whiteSpaces = ''
  if (context.length < 10) {
    whiteSpaces = ' '.repeat(10 - context.length)
  } else if (context.length < 20) {
    whiteSpaces = ' '.repeat(20 - context.length)
  } else if (context.length < 30) {
    whiteSpaces = ' '.repeat(30 - context.length)
  }

  return chalk.yellow(`[${context}]${whiteSpaces}`)
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
