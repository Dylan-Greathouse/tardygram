const { Router } = require('express');
const ensureAuth = require('../middleware/ensureAuth.js');
const Post = require('../Models/Post.js');

module.exports = Router()
  .post('/', ensureAuth, async (req, res, next) => {
    try {
      const username = req.user.username;
      const post = await Post.insert({ ...req.body, username });
      res.send(post);
    } catch (err) {
      next(err);
    }
  })

  .get('/', async (req, res, next) => {
    try {
      const getPosts = await Post.select(req.body);
      res.json(getPosts);
    } catch (err) {
      next (err);
    }
  })

  .get('/popular', async (req, res, next) => {
    try {
      const getPostsPop = await Post.selectPop(req.body);
      res.json(getPostsPop);
    } catch (err) {
      next (err);
    }
  })

  .get('/:id', async(req, res, next) => {
    try {
      const getPost = await Post.selectId(req.params.id);
      res.send(getPost);
    } catch (err) {
      next(err);
    }
  })

  .patch('/:id', ensureAuth, async(req, res, next) => {
    try{
      const patchPost = await Post.update(req.params.id, req.body);
      res.send(patchPost);
    } catch(err) {
      next(err);
    }
  })

  .delete('/:id', ensureAuth, async(req, res, next) => {
    try {
      const removePost = await Post.remove(req.params.id);
      res.send(removePost);
    } catch (err) {
      next(err);
    }
  });
