import { Meteor } from 'meteor/meteor';

if (Meteor.isServer()) {
  Meteor.methods({

    /**
     * Login to the Spotify API
     */
    loginToSpotify() {
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
    }

  });
}
