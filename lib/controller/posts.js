const { Router } = require('express');
const ensureAuth = require('../middleware/ensureAuth.js');
const Post = require('../Models/Post.js');

module.exports = Router()
  .post('/post', ensureAuth, async (req, res, next) => {
    try {
      const username = req.user.username;
      const post = await Post.insert({ ...req.body, username });

      res.send(post);
    } catch (err) {
      next(err);
    }
  });
