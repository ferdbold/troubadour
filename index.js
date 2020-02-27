const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const querystring = require('querystring');
const request = require('request');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const generateRandomString = function(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

/** SERVER CONFIGURATION */
const app = express();
app.use(cookieParser());

// Only used in production, makes the server serve React files
app.use(express.static(path.join(__dirname, 'client/build')));

app.set('port', process.env.PORT || 3001);

app.get('/login', (req, res) => {
  let state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  let scope = 'user-read-private user-read-email user-modify-playback-state';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: scope,
      redirect_uri: process.env.REDIRECT_URI,
      state: state
    })
  );
});

app.get('/get_token', (req, res) => {
  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  // Early return if state is mismatched
  if (state === null || state !== storedState) {
    console.log('STATE MISMATCH');
    res.redirect(process.env.REDIRECT_URI + '?' +
      querystring.stringify({
        error: 'state_mismatch'
      })
    );
    return;
  }

  res.clearCookie(stateKey);
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.REDIRECT_URI
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {

      const access_token = body.access_token,
            refresh_token = body.refresh_token;

      res.redirect(process.env.REDIRECT_URI + '?' +
        querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token
        })
      );
    }

    // Bad auth
    else {
      res.redirect(process.env.REDIRECT_URI + '?' +
        querystring.stringify({
          error: 'invalid_token'
        })
      );
    }
  });
});

// Catchall handler: makes the server serve React whenever we don't
// match a route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
