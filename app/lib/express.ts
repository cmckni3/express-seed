let rootdir = `${process.cwd()}`;
let appdir = `${rootdir}/app`;

import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as compress from 'compression';
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
let MongoStore = require('connect-mongo')(session);
const activeTags = require('active-tags');

let conf = require(`${appdir}/config/app`).default;
let mongo_conf = require(`${appdir}/config/mongo`).default;

import { passport } from './passport';
import { roles } from './roles';
import { log4js } from './logger';
let logger = log4js.getLogger('server');

let app = express();

app.set('env', conf.env);
app.set('port', conf.socket != null ? conf.socket : conf.port);
app.set('views', `${appdir}/views`);
app.set('view engine', 'jade');

app.use(log4js.connectLogger(logger, { level: 'auto', format: ':method :url :status - :response-time ms' }));
app.use(express.static(`${rootdir}/public`));
app.use(favicon(`${rootdir}/assets/img/favicon.ico`));
app.use(compress());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: conf.cookie_secret,
  store: new MongoStore({ db: conf.appName })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(roles.middleware());
app.use(function (req, res, next) {
  res.locals.conf = conf;return next();
});
app.use(activeTags());

export { app };
export default app;
