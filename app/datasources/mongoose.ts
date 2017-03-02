let mongoose;
export default mongoose = require('mongoose');
import * as util from 'util';

import { log4js } from '../lib/logger';
let logger = log4js.getLogger('mongoose');

// connect to mongo
import mongo_config from '../config/mongo';
mongoose.connect(mongo_config.uri, mongo_config.options, function (err) {
  if (err != null) {
    logger.fatal('unable to connect');
    throw err;
  } else {
    return logger.info('connected');
  }
});

mongoose.set('debug', (collectionName, method, query, doc, options) => logger.debug(`${collectionName}.${method}(${util.inspect(query, false, Infinity)})`));

mongoose.connection.on('error', err => logger.error(err));
