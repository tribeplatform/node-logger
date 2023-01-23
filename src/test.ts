import { Logger } from './logger'

const logger = new Logger({ applicationName: 'aragorn', level: 'debug' })

// Test EventEmitter memory leak issue
const loggers = []
for (let i = 0; i < 100; i++) {
  loggers.push(logger.setContext('Server'))
}

const serverLogger = logger.setContext('Server')
const unknownLogger = logger.setContext('Unknown 2')
const unknown2Logger = logger.setContext('Unknown Foo')
const webhookLogger = logger.setContext('WebhookController')
const infoLogger = logger.setContext('InfoService')
const contextLogger = logger.setContext(
  'This is some random context to check if the context is being set correctly',
)

logger.log('hello world')
serverLogger.debug('Hello world!')
unknownLogger.verbose('Hello world!')
unknown2Logger.verbose('Hello world!')
webhookLogger.info('Hello world!')
webhookLogger.warn('Hello world!')
const err = new Error('Hello world!')
infoLogger.error(err, { foo: 'bar' })
contextLogger.info('Hello world!')
