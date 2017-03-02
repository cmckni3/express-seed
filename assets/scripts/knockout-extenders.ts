ko.extenders.subscribe = function (target, fn) {
  target.subscribe(fn);
  return target;
};

//######################
//########### Validation
ko.extenders.required = function (target, message) {
  //add some sub-observables to our observable
  target.hasError = ko.observable();
  target.validationMessage = ko.observable();

  //define a function to do validation
  let validate = function (newVal) {
    if (newVal != null && newVal !== '') {
      target.hasError(false);
      target.validationMessage("");
    } else {
      target.hasError(true);
      target.validationMessage(message || "This field is required");
    }
  };

  //initial validation
  validate(target());

  //validate whenever the value changes
  target.subscribe(validate);

  //return the original observable
  return target;
};

ko.extenders.email = function (target, message) {
  target.hasError = ko.observable();
  target.validationMessage = ko.observable();
  let re = new RegExp(/^\S+@\S+\.\S+$/);

  let validate = function (newVal) {
    if (newVal != null && newVal !== '') {
      if (re.test(newVal)) {
        target.hasError(false);
        target.validationMessage("");
      } else {
        target.hasError(true);
        target.validationMessage(message || "Invalid email address. Must be of the form 'john@website.com'");
      }
    } else {
      target.hasError(false);
      target.validationMessage("");
    }
  };

  validate(target());

  target.subscribe(validate);

  return target;
};

ko.extenders.phone = function (target, message) {
  target.hasError = ko.observable();
  target.validationMessage = ko.observable();
  let re = new RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);

  let validate = function (newVal) {
    if (newVal != null && newVal !== '') {
      if (re.test(newVal)) {
        target.hasError(false);
        target.validationMessage("");
      } else {
        target.hasError(true);
        target.validationMessage(message || "Invalid phone number. Must be of the form '555-555-5555'");
      }
    } else {
      target.hasError(false);
      target.validationMessage("");
    }
  };

  validate(target());

  target.subscribe(validate);

  return target;
};

ko.extenders.unique = function (target, ...rest) {
  let [unique_in_ko_array, ko_attribute_name, message] = Array.from(rest[0]);
  target.hasError = ko.observable();
  target.validationMessage = ko.observable();

  let validate = function (newVal) {
    if (newVal != null && newVal !== '') {
      let attrs = unique_in_ko_array().map(obj => obj[ko_attribute_name]());
      if (attrs.filter(attr => attr === newVal).length > 1) {
        target.hasError(true);
        target.validationMessage(message || "Must be unique.");
      } else {
        target.hasError(false);
        target.validationMessage("");
      }
    } else {
      target.hasError(false);
      target.validationMessage("");
    }
  };

  validate(target());

  target.subscribe(validate);

  return target;
};

//######################
//######################

//######################
//################# Misc
ko.extenders.numeric = function (target, qualifier) {
  let precision, sign;
  if ('number' === typeof qualifier) {
    precision = qualifier;
  }
  if ('string' === typeof qualifier) {
    sign = qualifier;
  }
  // create a writable computed observable to intercept writes to our observable
  let result = ko.pureComputed({
    read: target, // always return the original observables value
    write(newValue) {
      let valueToWrite;
      let current = target();
      if (precision) {
        let roundingMultiplier = Math.pow(10, precision);
        let newValueAsNum = isNaN(newValue) ? 0 : parseFloat(+newValue);
        valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;
      } else {
        valueToWrite = isNaN(newValue) ? 0 : parseFloat(+newValue);
      }

      if (sign && (sign === 'positive' && valueToWrite < 0 || sign === 'negative' && valueToWrite > 0)) {
        valueToWrite *= -1;
      }
      // only write if it changed
      if (valueToWrite !== current) {
        target(valueToWrite);
      } else {
        // if the rounded value is the same, but a different value was written, force a notification for the current field
        if (newValue !== current) {
          target.notifySubscribers(valueToWrite);
        }
      }
    }
  }).extend({ notify: "always" });

  //initialize with current value to make sure it is rounded appropriately
  result(target());

  //return the new computed observable
  return result;
};

//######################
//######################
