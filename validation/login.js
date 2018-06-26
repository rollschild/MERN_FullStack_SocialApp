const validator = require('validator');
const isEmpty = require('./is_empty');


module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (validator.isEmpty(data.email)) {
    errors.email = 'Email is required!';
  }

  if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid!';
  }

  if (validator.isEmpty(data.password)) {
    errors.password = 'Password cannot be empty!';
  }

  /*
  if (!validator.equals(data.password, data.password_confirmed)) {
    errors.password_confirmed = 'Password must match!';
  }
  */
  return {
    errors,
    isValid: isEmpty(errors),
  };
};