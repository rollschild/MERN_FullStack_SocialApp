const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// load profile
const Profile = require("../../models/Profile");
// load user
const User = require("../../models/User");
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// @route GET api/profiles/test
// @desc Tests profiles route
// @access Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Profiles works."
  })
);

// @route GET api/profiles
// @desc Get current user's profile
// @access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          // put errors into the errors object
          errors.noProfile = "There is no profile for this user!";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  }
);

// @route GET api/profiles/all
// @desc Get ALL profiles
// @access Public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noProfile = "No profiles at all!";
        res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => {
      res.status(404).json({ profiles: "No profiles at all!" });
    });
});

// @route GET api/profiles/handle/:handle
// @desc Get profile by handle
// @access Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noProfile = "No profile for this handle!";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      res.status(404).json(errors);
    });
});

// @route GET api/profiles/user/:user_id
// @desc Get profile by user_id
// @access Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  // It treats it differently when we search by ID
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noProfile = "No profile for this user_id!";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      // res.status(404).json(err);
      res.status(404).json({ profile: "No profile for this user_id!" });
    });
});

// @route POST api/profiles
// @desc Create current user's profile
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

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
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    if (req.body.skills !== "undefined")
      profileFields.skills = req.body.skills.split(", ");
    profileFields.social = {}; // we need to do this step
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Now user does not have a profile yet

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists!";
            // 400: bad request
            res.status(400).json(errors);
          }

          // new Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route POST api/profiles/experience
// @desc Add experience to profile
// @access Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const newExperience = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };
        // Add to experience array
        profile.experience.unshift(newExperience);
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
);

// @route DELETE api/profiles/experience
// @desc Delete experience from profile
// @access Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // get remove index
        /*
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);
    

      // splice out of array
      profile.experience.splice(removeIndex, 1);
      */
        profile.experience.remove({ _id: req.params.exp_id });
        // .then(profile => res.json(profile.experience))
        // .catch(err => res.status(404).json(err));
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route POST api/profiles/education
// @desc Add education to profile
// @access Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({
      user: req.user.id
    })
      .then(profile => {
        const newEducation = {
          school: req.body.school,
          fieldOfStudy: req.body.fieldOfStudy,
          from: req.body.from,
          degree: req.body.degree,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        };
        // Add to experience array
        profile.education.unshift(newEducation);
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
);

// @route DELETE api/profiles/education
// @desc Add education to profile
// @access Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // I don't quite understand this
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        // Add to experience array
        profile.education.splice(removeIndex, 1);
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
);

// @route DELETE api/profiles
// @desc Delete user and profile
// @access Private
router.delete(
  "/",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user._id }).then(() => {
      User.findOneAndRemove({ _id: req.user._id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);
module.exports = router;
