let alert_html = '<div class="alert" role="alert">' + '<button class="close" type="button" data-dismiss="alert">' + '<span aria-hidden="true">&times</span>' + '<span class="sr-only">Close</span>' + '</button>' + '<strong class="alert-title"></strong>' + '<div class="alert-text"></div>' + '</div>';

window.clearAllMessages = function () {
  $('.error-alert').empty();
  $('.general-alert').empty();
  return $('.success-alert').empty();
};

window.errorMessage = function (...messages) {
  clearAllMessages();
  $('.error-alert').html(alert_html);
  $('.error-alert .alert').addClass("alert-danger");
  $('.error-alert .alert .alert-title').text("Error!");
  return $('.error-alert .alert .alert-text').html(messages.join(' '));
};

window.alertMessage = function (...messages) {
  clearAllMessages();
  $('.general-alert').html(alert_html);
  $('.general-alert .alert').addClass("alert-info");
  $('.general-alert .alert .alert-title').text("Heads up!");
  return $('.general-alert .alert .alert-text').html(messages.join(' '));
};

window.successMessage = function (...messages) {
  clearAllMessages();
  $('.success-alert').html(alert_html);
  $('.success-alert .alert').addClass("alert-success");
  $('.success-alert .alert .alert-title').text("Success!");
  return $('.success-alert .alert .alert-text').html(messages.join(' '));
};
