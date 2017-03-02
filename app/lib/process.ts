import { log4js } from '../lib/logger';
let logger = log4js.getLogger('process');

process.on('uncaughtException', function (err) {
  logger.fatal(`Uncaught Exception [${err.toString()}]\n${err.stack}`);
  process.emit('cleanup');
  return setTimeout(() => process.exit(1), 500);
});

process.on('SIGTERM', function () {
  logger.info('caught SIGTERM');
  process.emit('cleanup');
  return setTimeout(() => process.exit(0), 500);
});

process.on('SIGINT', function () {
  logger.info('caught SIGINT');
  process.emit('cleanup');
  return setTimeout(() => process.exit(0), 500);
});

process.on('cleanup', () => logger.info('cleanup signal detected, exiting in .5 seconds...'));
