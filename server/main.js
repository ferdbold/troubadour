const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');

const auth = require('./auth');

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

module.exports = () => {
  const app = express();
  app.use(cookieParser());

  // Only used in production, makes the server serve React files
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.set('port', process.env.PORT || 3001);

  // AUTH
  app.get('/login', auth.onLogin);
  app.get('/get_token', auth.onGetToken);

  // Catchall handler: makes the server serve React whenever we don't
  // match a route
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });

  return app;
};
