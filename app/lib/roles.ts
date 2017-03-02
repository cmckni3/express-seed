let appdir = `${process.cwd()}/app`;

import * as ConnectRoles from 'connect-roles';

let roles = new ConnectRoles({

  failureHandler(req, res, action) {
    if (req.isAuthenticated()) {
      res.status(403);

      switch (req.accepts(['html', 'json', 'text'])) {

        case 'html':
          return res.render('errors/403', { action });

        case 'json':
          return res.send({ error: '403 Forbidden', action });

        case 'text':
          res.set('content-type', 'text/plain');
          return res.send(`403 Forbidden.\nYou don't have permission to ${action}.`);

        default:
          res.status(406); // not acceptable
          return res.end();
      }
    } else {
      res.status(401);

      switch (req.accepts(['html', 'json', 'text'])) {

        case 'html':
          // either redirect to the login page, or respond with 401.
          return res.render('errors/401');
        // req.session.returnTo = req.originalUrl
        // res.redirect '/users/login'

        case 'json':
          return res.send({ error: '401 Unauthorized' });

        case 'text':
          res.set('content-type', 'text/plain');
          return res.send("401 Unauthorized.");

        default:
          res.status(406); // not acceptable
          return res.end();
      }
    }
  }
});

// Authorization strategies are checked in order.
// The first one to return true or false results in "allowed" or "denied" respectively.
// Returning null results in the next strategy being tried.

let actionsAllowedByAnyone = ['logout', 'view users', 'create users', 'edit users'];

// checked for all actions
roles.use(function (req, action) {
  if (!req.isAuthenticated()) {
    // if you're not authenticated
    return false; //   then you're not allowed.
  } else if (actionsAllowedByAnyone.indexOf(action) >= 0) {
    // if you're trying to do any action that any authenticated user can do
    return true; //   then you're allowed.
  } else if (req.user.roles.indexOf(action) >= 0) {
    // if the action you're performing is a role name you have
    return true; //   then you're allowed.
  } else {
    // otherwise
    return null;
  }
}); //   move on to the next strategy

// checked for specific actions
roles.use('view secret', function (req) {
  if (req.user.roles.indexOf('user') >= 0) {
    return true;
  } else {
    return null;
  }
});

// all else fails, are they an admin?
roles.use(req => req.user.roles.indexOf('admin') >= 0);

export { roles };
export default roles;
