const { Router } = require('express');
const ensureAuth = require('../middleware/ensureAuth.js');
const UserService = require('../service/UserService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&scopes=read:user`
    );
  })

  .get('/login/callback', async (req, res, next) => {
    try {
      const user = await UserService.create(req.query.code);
      console.log('USER AT AUTH', user);
      
      res.cookie('COOKIE', user.authToken(), {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
        secure: true
      });
      res.send(user);
    } catch (err) {
      next(err);
    }
  })

  .get('/verify', ensureAuth, (req, res, next) => {
    try {
      res.send(req.user);
    } catch(err) {
      next(err);
    }
  });
