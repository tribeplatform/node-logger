import { LogLevel } from './interface'

const NO_COLOR = '\u001b[39m'
const MAGENTA = '\u001b[35m'
const CYAN = '\u001b[36m'
const GREEN = '\u001b[32m'
const YELLOW = '\u001b[33m'
const RED = '\u001b[31m'

const getLevelColor = (level: LogLevel): string => {
  switch (level) {
    case 'debug':
      return MAGENTA
    case 'verbose':
      return CYAN
    case 'info':
      return GREEN
    case 'warn':
      return YELLOW
    case 'error':
      return RED
    default:
      return GREEN
  }
}

export const getColorizedText = (text: string, level: LogLevel) =>
  `${getLevelColor(level)}${text}${NO_COLOR}`
