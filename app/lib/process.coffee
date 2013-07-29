log4js = require '../lib/logger'
logger = log4js.getLogger 'process'

process.on 'uncaughtException', (err) ->
  logger.fatal "Uncaught Exception [#{err.toString()}]\n#{err.stack}"
  process.emit 'cleanup'
  process.nextTick ->
    process.exit 1

process.on 'SIGTERM', ->
  logger.info 'caught SIGTERM'
  process.emit 'cleanup'
  process.nextTick ->
    process.exit 0

process.on 'SIGINT', ->
  logger.info 'caught SIGINT'
  process.emit 'cleanup'
  process.nextTick ->
    process.exit 0

process.on 'cleanup', ->
  logger.info 'exiting...'