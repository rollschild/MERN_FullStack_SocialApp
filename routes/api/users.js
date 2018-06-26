const express = require('express');
const garvatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const User = require('../../models/User');
const keys = require('../../config/keys');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route GET api/users/test
// @desc Tests users route
// @access Public
router.get('/test', (req, res) => res.json({
  msg: 'Users works.'
})); // send json
// automatically serve 200

// @route GET api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
  const {errors, isValid} = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (user) {
        errors.email = 'Email already exists!';
        return res.status(400).json(errors);
      } else {
        const avatar = garvatar.url(req.body.email, {
          s: '200', // size
          r: 'pg', // rating
          d: 'mm' // default
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
});

// @route GET api/users/login
// @desc Login user / Return JWT token
// @access Public
router.post('/login', (req, res)=> {
  const {
    errors,
    isValid
  } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({email}) // this will give us a promise
    .then(user => {
      if (!user) {
        errors.email = 'User not found!!!';
        return res.status(404).json(errors);
      }

      // Check password
      bcrypt.compare(password, user.password)
        .then(isMatched => {
          if (isMatched) {
            // JWT payload
            const payload = {id: user.id, name: user.name, avatar: user.avatar};
            jwt.sign(
              payload, 
              keys.secretOrKey, 
              {expiresIn: 3600}, 
              (err, token) => {
                // we will put this into header
                // ...as an authorization
                res.json({
                  success: true,
                  token: 'Bearer ' + token,
                });
              }
            );
          }
          else {
            errors.password = 'Password incorrect!';
            return res.status(400).json(errors);
          }
        });
    });
});


// @route GET api/users/current
// @desc Return current user
// @access Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    name:req.user.name,
    email: req.user.email,
  });
});

module.exports = router;