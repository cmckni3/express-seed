/// <reference path="../custom-typings.d.ts" />

let start = new Date();

import 'sugar';
import './lib/process';

import * as fs from 'fs';

import { log4js } from './lib/logger';
let logger = log4js.getLogger('server');

import config from './config/app';

if (config.socket != null) {
  require('./lib/socket');
}

// create and configure the express app
import { app } from './lib/express';
const { env } = app.settings;

// create the http server
let server = require('http').createServer(app);

// delete the socket file if it exists (from a previous crash)
if (config.socket != null && fs.existsSync(config.socket)) {
  fs.unlinkSync(config.socket);
}

// start server
server.listen(app.settings.port, function () {
  const port = app.settings.port;
  if (config.socket !== null && fs.existsSync(config.socket)) {
    fs.chmodSync(config.socket, '777');
  }

  let portType = config.socket !== null ? 'socket' : 'port';
  let time = (new Date()).valueOf() - start.valueOf();
  return logger.info(`${config.appName} started${port ? ` on ${portType} ${port}` : ''} (${env} mode) in ${time}ms`);
});

export default app;
