const passport = require('passport');
import { Strategy as LocalStrategy } from 'passport-local';

import User from '../models/user';

passport.use(new LocalStrategy((username, password, done) => User.findOne().where('username').equals(username).exec(function (err, user) {
  if (err != null) {
    return done(err);
  }
  if (user == null) {
    return done(null, false);
  }
  return user.validPassword(password, function (err, valid) {
    if (err != null) {
      return done(err);
    }
    return done(null, valid ? user : false);
  });
})));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((userId, done) => User.findById(userId).select('-password').exec(function (err, user) {
  if (err != null) {
    return done(err);
  }
  return done(null, user);
}));

export { passport };
export default passport;
