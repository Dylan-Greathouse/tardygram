const { Router } = require('express');
const ensureAuth = require('../middleware/ensureAuth.js');
const Comment = require('../Models/Comment.js');

module.exports = Router()
  .post('/', ensureAuth, async (req, res, next) => {
    try {
      const username = req.user.username;
      const comment = await Comment.insert({ ...req.body, username });

      res.send(comment);
    } catch(err) {
      next(err);
    }
  })

  .delete('/:id', ensureAuth, async (req, res, next) => {
    try {
      const removeComment = await Comment.remove(req.params.id);
      res.send(removeComment);
    } catch (err) {
      next(err);
    }
  });
