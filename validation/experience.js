const validator = require('validator');
const isEmpty = require('./is_empty');


module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (validator.isEmpty(data.title)) {
    errors.title = 'Job title is required!';
  }

  if (validator.isEmpty(data.company)) {
    errors.company = 'Company is required!';
  }

  if (validator.isEmpty(data.from)) {
    errors.from = 'Beginng date cannot be empty!';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};