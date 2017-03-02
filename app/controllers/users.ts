let appdir = `${process.cwd()}/app`;
let { roles } = require(`${appdir}/lib/roles`);

// get /login
let login = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/users/secret');
  } else {
    return res.render('users/login');
  }
};

// post /logout
let logout = function (req, res) {
  req.logout();
  return res.redirect('/');
};

// get /users
let list = function (req, res) {
  res.pushTag('users');
  res.pushTag('list-users');
  return res.render('users/index');
};

// get /users/new
let newUser = function (req, res) {
  res.pushTag('users');
  res.pushTag('new-user');
  return res.render('users/new');
};

// get /users/:id
let editUser = function (req, res) {
  res.pushTag('users');
  res.pushTag('list-users');
  return res.render('users/edit', { id: req.params.id });
};

// get /users/secret
let secret = (req, res) => res.render('users/secret');

// get /users/admin-secret
let adminSecret = (req, res) => res.render('users/admin-secret');

export default {
  login: [login],
  logout: [roles.can('logout'), logout],
  list: [roles.can('view users'), list],
  newUser: [roles.can('create users'), newUser],
  editUser: [roles.can('edit users'), editUser],
  secret: [roles.can('view secret'), secret],
  adminSecret: [roles.can('view admin secret'), adminSecret]
};
