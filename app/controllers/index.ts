import User from '../models/user';

// get /
let main = (req, res, next) => User.count(function (err, count) {
  if (err != null) {
    return next(err);
  }
  res.locals.users_count = count;
  return res.render('index');
});

// get /errors
let errors = (req, res, next) => res.render('errors');

// get /401
let unauthorized = (req, res, next) => res.send('You are logged in so I can\'t show you the error.');

// get /403
let forbidden = (req, res, next) => res.send('You are logged in as admin so I can\'t show you the error.');

// get /500
let serverError = (req, res, next) => next(new Error('A wild error appears!'));

// get /502
let badGateway = (req, res, next) => res.render('errors/502');

export default { main, errors, unauthorized, forbidden, serverError, badGateway };
