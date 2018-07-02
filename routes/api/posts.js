const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const validatePostInput = require('../../validation/post');
const Profile = require('../../models/Profile');
// @route GET api/posts/test
// @desc Tests posts route
// @access Public
router.get('/test', (req, res) => res.json({
  msg: 'Posts works'
}));

// @route POST api/posts
// @desc Create post
// @access Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const {errors, isValid} = validatePostInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const newPost = new Post ({
    text: req.body.text,
    name: req.body.name,
    avatar: req.user.avatar,
    user: req.user.id,
  });

  newPost.save().then(post => res.json(post));
});

// @route GET api/posts
// @desc Get posts
// @access Public
router.get('/', (req, res) => {
  Post.find()
    .sort({date: -1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({
    posts: 'No posts were found!'
    }));
});

// @route GET api/posts/:id
// @desc Get posts
// @access Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({post: 'No post was found with that ID!'}));
});

// @route DELETE api/posts/:id
// @desc Delete post
// @access Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({NotAuthorized: 'User not authorized!'});
          }
          post.remove().then(() => res.json({success: 'Removed!'}));
        })
        .catch(err => res.status(404).json({post: 'Post not found!'}));
    });
});

// @route POST api/posts/like/:post_id
// @desc Like a post
// @access Private
router.post('/like/:post_id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOne({
      user: req.user.id
    })
    .then((profile) => {
      Post.findById(req.params.post_id)
        .then((post) => {
          // check to see if the user already liked the post
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({like: 'User already liked this post'});
          }
          // add to the beginning
          post.likes.unshift({user: req.user.id});
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({
          post: 'Post not found!'
        }));
    });
});

// @route POST api/posts/unlike/:post_id
// @desc Unlike a post
// @access Private
router.post('/unlike/:post_id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Profile.findOne({
      user: req.user.id
    })
    .then((profile) => {
      
      Post.findById(req.params.post_id)
        .then((post) => {
          // check to see if the user already liked the post
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({
              like: 'You have not yet liked this post!'
            });
          }
          // remove the like
          // console.log(post.likes);
          /*
          post.likes.pull({user: req.user.id})
            .save().then(post => res.json(post));
          */
          const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);

          post.likes.splice(removeIndex, 1);
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({
          post: 'Post not found!'
        }));
        
      /*
      Post.update({id: req.params.post_id}, {'likes': {"$pull": {user: req.user.id}}})
        .then(() => res.json({success: 'Unliked!'}));
      */
    });
});

// @route POST api/posts/comment/:post_id
// @desc Post a comment
// @access Private
router.post('/comment/:post_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  const {errors, isValid} = validatePostInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Post.findById(req.params.post_id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.user.avatar,
        user: req.user.id,
      };
      post.comments.unshift(newComment);
      post.save().then(post => res.json(post));
    })
    .catch((err) => {
      res.status(404).json({comment: 'Post not found!'});
    });
});

// @route DELETE api/posts/comment/:post_id
// @desc Delete a comment from a post
// @access Private
router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Post.findById(req.params.post_id)
    .then(post => {
      // check to see if comment exists
      if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
        return res.status(404).json({comment: 'Comment does not exist!'});
      }
      // Remove
      const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);
      post.comments.splice(removeIndex, 1);
      post.save().then(post => res.json(post));
    })
    .catch((err) => {
      res.status(404).json({
        comment: 'Post not found!'
      });
    });
});

module.exports = router;