const express = require('express');
const cookieParser = require('cookie-parser');
const auth = require('./controller/auth.js');

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use('/api/v1/auth', auth);
app.use('/api/v1/grams');

app.use(require('./middleware/not-found.js'));
app.use(require('./middleware/error.js'));

module.exports = app;
