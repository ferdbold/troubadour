import React, {Component} from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';

import { User } from '/imports/api/users';

import './Header.scss';

class Header extends Component {
  onLogin() {
    Meteor.loginWithSpotify({
      requestPermissions: [
        'user-library-read',
        'user-modify-playback-state',
        'user-read-private',
        'user-read-email'
      ]
    });
  }

  render() {
    const name = _.get(this.props.user, 'services.spotify.display_name', '');
    const avatar = _.get(this.props.user, 'services.spotify.images[0].url', '');

    const spotifyLogin = (
      <button className="uk-button t-spotify-login" onClick={this.onLogin}>
        <img src="/img/spotify-logo-black.png" alt="Spotify Logo" />
        <span>Login with Spotify</span>
      </button>
    );

    const userBadge = (
      <div className="t-user-badge">
        <img className="t-user-avatar" src={avatar} alt={name + ' avatar'} />
        <span>{name}</span>
      </div>
    );

    return (
      <nav className="uk-navbar t-header">
        <div className="uk-navbar-left">

        </div>
        <div className="uk-navbar-center">
          Troubadour
        </div>
        <div className="uk-navbar-right">
          {_.has(this.props, 'user.services.spotify.accessToken') ? userBadge : spotifyLogin}
        </div>
      </nav>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('user');

  return {
    user: User.findOne({ _id: Meteor.userId() })
  };
})(Header);
