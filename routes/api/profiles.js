const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// load profile
const Profile = require('../../models/Profile');
// load user
const User = require('../../models/User');
const validateProfileInput = require('../../validation/profile');
// @route GET api/profiles/test
// @desc Tests profiles route
// @access Public 
router.get('/test', (req, res) => res.json({
  msg: 'Profiles works.'
}));

// @route GET api/profiles
// @desc Get current user's profile
// @access Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const errors = {};
  Profile.findOne({user: req.user.id})
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        // put errors into the errors object
        errors.noProfile = 'There is no profile for this user!';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

// @route POST api/profiles
// @desc Create current user's profile
// @access Private
router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const {errors, isValid} = validateProfileInput(req.body);

  if (!isValid) {
    res.status(400).json(errors);
  }
  // Get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubUsername) profileFields.githubUsername = req.body.githubUsername;
  if (req.body.skills !== 'undefined') profileFields.skills = req.body.skills.split(', ');
  profileFields.social = {}; // we need to do this step
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({user: req.user.id})
    .then((profile) => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          {user: req.user.id}, 
          {$set: profileFields}, 
          {new: true}
        ).then(profile => res.json(profile));
      }
      else {
        // Now user does not have a profile yet

        // Check if handle exists
        Profile.findOne({handle: profileFields.handle})
          .then((profile) => {
            if (profile) {
              errors.handle = 'That handle already exists!';
              // 400: bad request
              res.status(400).json(errors);
            }

            // new Profile
            new Profile(profileFields).save()
              .then(profile => res.json(profile));
          });
      }
    });
});

module.exports = router;