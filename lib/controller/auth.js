const { Router } = require('express');
const fetch = require('cross-fetch');
const User = require('../models/User');

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&scopes=read:user`
    );
  })

  .get('/login/callback', async (req, res, next) => {
    try {
      const tokenRes = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: req.query.code,
          }),
        }
      );
      const tokenBody = await tokenRes.json();
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token${tokenBody.access_token}`,
        },
      });

      const userBody = await userRes.json();
      console.log('OMGG', userBody);

      let user = await User.findByUsername(userBody.login);
      if (!user) {
        user = await User.insert({
          username: userBody.login,
          avatar: userBody.avatar_url,
        });
      }
      res.send(user);
    } catch (err) {
      next(err);
    }
  });
