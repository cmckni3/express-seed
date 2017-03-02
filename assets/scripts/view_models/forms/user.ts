export let UserFormView = class UserFormView {
  prototype;
  attr;
  num_errors;
  errors;
  attempted;
  roles_immybox;
  role;
  username;
  private _id;
  blank_user;

  static initClass() {

    this.prototype.blank_user = { username: '', role: 'user' };
  }

  serialize() {
    return {
      username: this.username(),
      roles: [this.role()]
    };
  }

  constructor(id) {
    if (id != null) {
      let user_req = $.getJSON(`/api/users/${id}`);
      user_req.done(user => {
        return this.init(user);
      });
    } else {
      this.init(this.blank_user);
    }
  }

  init(user) {
    this._id = user._id;
    this.username = ko.observable(user.username).extend({ required: "Username cannot be blank" });
    this.role = ko.observable(user.roles[0]).extend({ required: 'Role cannot be blank' });

    this.roles_immybox = ['admin', 'user'].map(role => ({ text: role, value: role }));

    this.attempted = ko.observable(false);

    this.errors = ko.observable({});
    this.num_errors = ko.observable();

    ko.computed(() => {
      let [errors, num_errors] = Array.from([{}, 0]);
      ['username', 'role'].filter(attr => {
        return this[attr].hasError();
      }).forEach(attr => {
        errors[attr] = this[attr].validationMessage();
        return num_errors += 1;
      });

      this.errors(errors);
      this.num_errors(num_errors);
      if (this.attempted()) {
        if (num_errors === 0) {
          return clearAllMessages();
        } else {
          return errorMessage("Some fields require attention before this form can be submitted");
        }
      }
    });

    $('.cloak').removeClass('cloak');

    return ko.applyBindings(this);
  }

  save() {
    this.attempted(true);
    if (this.num_errors() === 0) {
      let req;
      if (this._id) {
        req = $.patchJSON(`/api/users/${this._id}/update_user`, this.serialize());
        return req.done(function (user) {
          if (user.error != null) {
            return errorMessage('Failed to save user');
          } else {
            return successMessage('User saved');
          }
        });
      } else {
        req = $.postJSON('/api/users/create_user', this.serialize());
        return req.done(function (user) {
          if (user.error != null) {
            return errorMessage('Failed to create new user');
          } else {
            successMessage("User created");
            return window.location = '/users';
          }
        });
      }
    }
  }
};
undefined.initClass();
