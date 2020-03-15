const fetch = require('node-fetch');
const mongoose = require('mongoose');
const querystring = require('querystring');

const UserSchema = require('./schemas/User');

module.exports = class AuthRoutes {
  static STATE_KEY = 'spotify_auth_state';

  static generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  constructor(server) {
    this.onLogin = this.onLogin.bind(this);
    this.onGetToken = this.onGetToken.bind(this);

    this._server = server;

    server._express.get('/login', this.onLogin);
    server._express.post('/get_token', this.onGetToken);
  }

  // Login the user to Spotify and get an auth token
  onLogin(req, res) {
    const state = AuthRoutes.generateRandomString(16);
    res.cookie(AuthRoutes.STATE_KEY, state);

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
  async onGetToken(req, res) {
    const code = req.body.code || null;
    const state = req.body.state || null;
    const storedState = req.cookies ? req.cookies[AuthRoutes.STATE_KEY] : null;

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

    res.clearCookie(AuthRoutes.STATE_KEY);

    let body = new URLSearchParams();
    body.append('code', code);
    body.append('grant_type', 'authorization_code');
    body.append('redirect_uri', process.env.REDIRECT_URI);

    const authResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: body,
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
      },
      json: true
    });

    // Early return on bad auth
    if (authResponse.status !== 200) {
      res.redirect(process.env.REDIRECT_URI + '?' +
        querystring.stringify({
          error: 'invalid_token'
        })
      );
      return;
    }

    const authResponseJson = await authResponse.json();
    const accessToken = authResponseJson.access_token,
          refreshToken = authResponseJson.refresh_token;

    // Store user in users if it doesn't exist
    const userInfoResponse = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + accessToken },
      json: true
    });

    const User = mongoose.model('User', UserSchema);
    let user = await User.findOne({ spotify_id: userInfoResponse.body.id });

    // Create user if it doesn't exist
    if (user === null) {
      user = await new User({
        spotify_id: body.id,
        name: body.display_name
      }).save();
    }

    res.send({
      access_token: accessToken,
      refresh_token: refreshToken,
      user_id: user.id
    });
  }
}
