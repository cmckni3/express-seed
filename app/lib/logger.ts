import config from '../config/logger';
import app_config from '../config/app';
const log4js = require('log4js');

let appenders: any[] = [{
  type: 'file',
  filename: config.file,
  backups: config.backups,
  maxLogSize: config.max_size,
  layout: { type: 'colored'
  }
}];
if (app_config.env === 'development') {
  appenders.push({ type: 'console' });
}

log4js.configure({ appenders });

// set log levels from config
for (let logger in config.levels) {
  let level = config.levels[logger];
  log4js.getLogger(logger).setLevel(level);
}

export { log4js };
export default log4js;
