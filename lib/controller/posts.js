const { Router } = require('express');
const ensureAuth = require('../middleware/ensureAuth.js');
const Post = require('../Models/Post.js');

module.exports = Router().post('/posts', ensureAuth, async (req, res, next) => {
  try {
    const post = await Post.insert(req.body);

    res.send(post);
  } catch (err) {
    next(err);
  }
});
