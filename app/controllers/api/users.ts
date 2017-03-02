let appdir = `${process.cwd()}/app`;
import * as ff from 'ff';

let User = require(`${appdir}/models/user`);

// TODO: Implement schema validation

// get /api/users/admins
let listAdmins = (req, res, next) => User.where({ role: 'admin' }).find(function (err, admins) {
  if (err) {
    return next(err);
  }
  return res.send(admins);
});

// get /api/users
let listUsers = (req, res, next) => User.find(function (err, users) {
  if (err) {
    return next(err);
  }
  return res.send(users);
});

// get /api/users/:id
let showUser = (req, res, next) => User.findById(req.params.id, function (err, user) {
  if (err) {
    return next(err);
  }
  if (user == null) {
    return next();
  }
  return res.send(user);
});

// post /api/users/create_user
let createUser = (req, res, next) => User.isUsernameAvailable(req.body.username, function (err, available) {
  if (err) {
    return next(err);
  }
  if (!available) {
    return next({ invalid_message: "Username already taken" });
  }
  return User.create(req.body, function (err, user) {
    if (err) {
      return next(err);
    }
    res.status(201);
    return res.send(user);
  });
});

// patch /api/users/:id/update_user
let updateUser = function (req, res, next) {
  let f;
  (f = ff()).next(() => User.findById(req.params.id, f.slot()));

  f.next(function (user) {
    f.pass(user);
    if (user == null) {
      return f.fail(404);
    }
    if ('undefined' !== typeof req.body.username && user.username !== req.body.username) {
      return User.isUsernameAvailable(req.body.username, f.slot());
    } else {
      return f.pass(true);
    }
  });

  f.next(function (user, available) {
    if (available) {
      return user.applyUpdates(req.body, f.slot());
    } else {
      return f.fail({ invalid_message: 'Username already taken' });
    }
  });

  f.onSuccess(user => res.send(user));

  return f.onError(function (err) {
    if (err === 404) {
      return next();
    } else {
      return next(err);
    }
  });
};

// delete /api/users/:id/delete_user
let deleteUser = (req, res, next) => User.findById(req.params.id, function (err, user) {
  if (err) {
    return next(err);
  }
  if (user == null) {
    return next();
  }
  return user.remove(function (err) {
    if (err) {
      return next(err);
    }
    return res.sendStatus(204);
  });
});

const users_api = {
  listAdmins: [listAdmins],
  listUsers: [listUsers],
  showUser: [showUser],
  createUser: [createUser],
  updateUser: [updateUser],
  deleteUser: [deleteUser]
};

export { users_api };
export default users_api;
