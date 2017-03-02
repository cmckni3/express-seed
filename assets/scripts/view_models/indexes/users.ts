class User {
  private _id;
  editUrl;
  role;
  username;

  constructor(public view, user) {
    this._id = user._id;
    this.username = user.username;
    this.role = user.role;

    this.editUrl = ko.computed(() => `/users/${this._id}`);
  }

  del() {
    return bootbox.confirm('Are you sure you want to permenantly delete this user?', confirmed => {
      if (confirmed) {
        let req = $.delete(`/api/users/${this._id}/delete_user`);
        return req.done(response => {
          if (__guard__(response, x => x.error) != null) {
            return errorMessage('Unable to delete user.');
          } else {
            successMessage("User deleted.");
            return this.view.table.rows.remove(this);
          }
        });
      }
    });
  }
}

export let UsersView = class UsersView {
  table;

  constructor() {
    this.table = new DataTable([], {
      recordWord: 'user',
      sortDir: 'asc',
      sortField: 'name',
      perPage: 50
    });

    this.table.loading(true);

    let req = $.getJSON('/api/users');

    req.done(users => {
      if (users.error != null) {
        return errorMessage('Unable to retrieve users.');
      } else {
        this.table.rows(users.map(user => new User(this, user)));
        return this.table.loading(false);
      }
    });

    ko.applyBindings(this, document.getElementById('main'));
  }
};

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}
