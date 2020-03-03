const querystring = require('querystring');
const request = require('request');

const generateRandomString = function(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = 'spotify_auth_state';

// Login the user to Spotify and get an auth token
exports.onLogin = (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = [
    'user-library-read',
    'user-modify-playback-state',
    'user-read-private',
    'user-read-email'
  ].join(' ');

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: scope,
      redirect_uri: process.env.REDIRECT_URI,
      state: state
    })
  );
};

// Convert the Spotify auth token to an access token
exports.onGetToken = (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

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
};
