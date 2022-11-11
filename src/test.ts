import { Logger } from './logger'

const logger = new Logger({ applicationName: 'aragorn', level: 'debug' })

logger.log('hello world')

logger.setContext('Server')

logger.debug('Hello world!')

logger.setContext('Unknown 2')

logger.verbose('Hello world!')

logger.setContext('Unknown Foo')

logger.verbose('Hello world!')

logger.setContext('WebhookController')

logger.info('Hello world!')
logger.warn('Hello world!')

logger.setContext('InfoService')

const err = new Error('Hello world!')
logger.error(err, { foo: 'bar' })

logger.setContext(
  'This is some random context to check if the context is being set correctly',
)

logger.info('Hello world!')
