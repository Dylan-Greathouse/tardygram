const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const{ session } = req.cookies;
    req.user = jwt.verify(session, process.env.APP_SECRET);

    console.log('AT ENSURE AUTH', req.user);
    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
};
