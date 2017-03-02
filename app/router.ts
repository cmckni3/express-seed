let rootdir = `${process.cwd()}`;
let appdir = `${rootdir}/app`;
import app from './app';
import user from './lib/roles';
import passport from './lib/passport';
import { log4js } from './lib/logger';
let logger = log4js.getLogger('server');

// API Routes

const { users_api } = require(`${appdir}/controllers/api/users`);

// Users
app.get('/api/users', ...users_api.listUsers);
app.get('/api/users/:id', ...users_api.showUser);
app.post('/api/users/create_user', ...users_api.createUser);
app.patch('/api/users/:id/update_user', ...users_api.updateUser);
app.delete('/api/users/:id/delete_user', ...users_api.deleteUser);

// View Routes
import index from './controllers/index';
import users from './controllers/users';

app.get('*', function (req, res, next) {
  let name;
  res.locals.server_messages = req.isAuthenticated() ? (name = req.user.name) && name !== '' ? { info: `Welcome, ${name}` } : { info: `Welcome, ${req.user.username}` } : { warning: "You must log in to continue" };
  return next();
});

//# Auth
app.get('/login', users.login);
app.post('/login', passport.authenticate('local', { successRedirect: '/users/secret', failureRedirect: '/login' }));
app.post('/logout', users.logout);

// Index

app.get('/', index.main);
app.get('/errors', index.errors);
app.get('/401', user.can('view secret'), index.unauthorized);
app.get('/403', user.can('do this'), index.forbidden);
app.get('/500', index.serverError);
app.get('/502', index.badGateway);

//# Users
app.get('/users', ...users.list);
app.get('/users/secret', ...users.secret);
app.get('/users/admin-secret', ...users.adminSecret);
app.get('/users/new', ...users.newUser);
app.get('/users/:id', ...users.editUser);

// catch errors and respond with 500
app.use(function (err, req, res, next) {
  res.status(500);

  logger.error(`\n${err.stack}`);

  return res.format({

    html() {
      return res.render('errors/500', { error: err, stack: err.stack });
    },

    json() {
      return res.send({ error: err.toString(), stack: err.stack });
    },

    text() {
      res.set('content-type', 'text/plain');
      return res.send(`500 Internal server error.\n${err.toString()}\n${err.stack}`);
    },

    default() {
      return res.sendStatus(406);
    }
  });
});

// everything else is a 404
app.use(function (req, res) {
  res.status(404);

  return res.format({

    html() {
      return res.render('errors/404', { url: req.url });
    },

    json() {
      return res.send({ error: '404 Not found', url: req.url });
    },

    text() {
      res.set('content-type', 'text/plain');
      return res.send(`404 Not found.\nThe requested URL '${req.url}' was not found on this server.`);
    },

    default() {
      return res.sendStatus(406);
    }
  });
});
