import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './Header.scss';
import imgSpotifyLogo from 'spotify-logo-black.png';

export default class Header extends Component {
  render() {
    const name = (this.props.userData) ? this.props.userData.display_name : '';
    const avatar = (_.has(this.props, 'userData.images') && !_.isEmpty(this.props.userData.images))
      ? this.props.userData.images[0].url
      : '';

    const spotifyLogin = (
      <a href={process.env.REACT_APP_SERVER_URI + '/login'} className="uk-button t-spotify-login">
        <img src={imgSpotifyLogo} alt="Spotify Logo" />
        <span>Login with Spotify</span>
      </a>
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
          {!_.isEmpty(this.props.userData) ? userBadge : spotifyLogin}
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  userData: PropTypes.object.isRequired
};
