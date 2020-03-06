const querystring = require('querystring');
const request = require('request');

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
    server._express.get('/get_token', this.onGetToken);
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
  onGetToken(req, res) {
    const code = req.query.code || null;
    const state = req.query.state || null;
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

        const accessToken = body.access_token,
              refreshToken = body.refresh_token;

        const RedirectToHome = () => {
          res.redirect(process.env.REDIRECT_URI + '?' +
            querystring.stringify({
              access_token: accessToken,
              refresh_token: refreshToken
            })
          );
        }

        // Store user in users if it doesn't exist
        const params = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + accessToken },
          json: true
        };

        request.get(params, (error, response, body) => {
          const users = this._server._mongo.collection('users');

          // Create user if it doesn't exist
          users.find({ spotify_id: body.id }).count(true, {}, (err, result) => {
            if (result === 0) {
              const newUser = {
                spotify_id: body.id,
                name: body.display_name
              };

              users.insertOne(newUser, (err, result) => {
                RedirectToHome();
              });
            }

            // Otherwise, redirect directly
            else {
              RedirectToHome();
            }
          });
        });
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
  }
}
