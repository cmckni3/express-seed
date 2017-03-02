$(document).ajaxError(function (event, response) {
  let error, json;
  if (json = response.responseJSON) {
    ({ error } = json);
  } else {
    error = "An unknown error occurred";
  }
  if (error) {
    return errorMessage(error);
  }
});
