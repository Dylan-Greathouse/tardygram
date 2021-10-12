const { Router } = require('express');
const fetch = require('cross-fetch');
const User = require('../models/User');


module.exports = Router()
    .get('/login', async (req, res, next) => {
        try {
            res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}&scopes=read:user`)
        }
    })
