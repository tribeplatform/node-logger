import { Logger } from './logger'

const logger = new Logger({ context: 'Server', level: 'debug' })

logger.debug('Hello world!')
logger.verbose('Hello world!')
logger.info('Hello world!')
logger.warn('Hello world!')
logger.error('Hello world!')
