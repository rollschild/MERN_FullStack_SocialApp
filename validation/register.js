const validator = require('validator');
const isEmpty = require('./is_empty');


module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password_confirmed = !isEmpty(data.password_confirmed) ? data.password_confirmed : '';

  if (validator.isEmpty(data.name)) {
    errors.name = 'Name field cannot be empty!';
  }

  if (validator.isEmpty(data.email)) {
    errors.email = 'Email is required!';
  }

  if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid!';
  }

  if (validator.isEmpty(data.password)) {
    errors.password = 'Password cannot be empty!';
  }

  if (!validator.isLength(data.password, {min: 6, max: 30})) {
    errors.password = 'Password must be at least 6 characters and at most 30 characters!';
  }

  if (validator.isEmpty(data.password_confirmed)) {
    errors.password_confirmed = 'Confirm password please!';
  }

  if (!validator.equals(data.password, data.password_confirmed)) {
    errors.password_confirmed = 'Password must match!';
  }

  if (!validator.isLength(data.name, {min: 2, max: 30})) {
    errors.name = 'Name must be between 2 and 30 characters!';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};