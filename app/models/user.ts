import NodePbkdf2 from '../lib/node-pbkdf2';
let hasher = new NodePbkdf2();

import mongoose from '../datasources/mongoose';
let { Schema } = mongoose;

let RoleSchema = {
  type: String,
  enum: ['user', 'admin']
};

let UserSchema = new Schema({
  username: String,
  password: String,
  roles: { type: [RoleSchema], default: ['user']
  } });

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  return hasher.hashPassword(this.password, (err, hashedPassword) => {
    if (err) {
      return next(err);
    }

    this.password = hashedPassword;
    return next();
  });
});

UserSchema.virtual('name').get(function () {
  return this.username;
});

UserSchema.methods.validPassword = function (password, cb) {
  return hasher.checkPassword(password, this.password, function (err, valid) {
    if (err) {
      return cb(err);
    }
    return cb(null, valid);
  });
};

UserSchema.statics.isUsernameAvailable = function (username, cb) {
  return this.findOne().where('username').equals(username).exec(function (err, user) {
    if (err) {
      return cb(err);
    }
    return cb(null, user == null);
  });
};

// map nulls on the object to undefineds in the db, don't updated undefineds on the object
UserSchema.methods.applyUpdates = function (user, cb) {
  let self = this;
  for (let col in this.schema.paths) {
    if ('undefined' !== typeof user[col]) {
      if (user[col] === null) {
        self[col] = undefined;
      } else {
        self[col] = user[col] || null;
      }
    }
  }
  return this.save(function (err, newUser) {
    if (err) {
      return cb(err);
    }
    return cb(null, newUser);
  });
};

export default mongoose.model('User', UserSchema);
