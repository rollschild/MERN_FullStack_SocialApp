const validator = require('validator');
const isEmpty = require('./is_empty');


module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';

  if (validator.isEmpty(data.school)) {
    errors.school = 'School name is required!';
  }

  if (validator.isEmpty(data.fieldOfStudy)) {
    errors.fieldOfStudy = 'You major is required!';
  }

  if (validator.isEmpty(data.from)) {
    errors.from = 'Beginng date cannot be empty!';
  }

  if (validator.isEmpty(data.degree)) {
    errors.degree = 'Degree is required!';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};