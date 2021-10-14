const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // grab the session cookie from the request
    const { session } = req.cookies;

    // verify the cookie is a valid JWT, returning the payload of the JWT
    const user = jwt.verify(session, process.env.APP_SECRET);

    // assign the payload to req.user (so it can be used in our route handlers)
    req.user = user;

    // move along to the next piece of middleware
    next();
  } catch (error) {
    error.status = 401;
    error.message = 'You must be signed in to continue.';
    next(error);
  }
};
