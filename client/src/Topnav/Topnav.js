import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './Topnav.scss';
import imgSpotifyLogo from 'spotify-logo-black.png';

export default class Topnav extends Component {
  render() {
    const name = (this.props.userData) ? this.props.userData.display_name : '';
    const avatar = (_.has(this.props, 'userData.images') && !_.isEmpty(this.props.userData.images))
      ? this.props.userData.images[0].url
      : '';

    const spotifyLogin = (
      <a href={process.env.REACT_APP_SERVER_URI + '/login'} className="uk-button sp-spotify-login">
        <img src={imgSpotifyLogo} alt="Spotify Logo" />
        <span>Login with Spotify</span>
      </a>
    );

    const userBadge = (
      <div className="sp-user-badge">
        <img className="sp-user-avatar" src={avatar} alt={name + ' avatar'} />
        <span>{name}</span>
      </div>
    );

    return (
      <nav className="uk-navbar sp-topnav">
        <div className="uk-navbar-left">

        </div>
        <div className="uk-navbar-center">
          Spotpad
        </div>
        <div className="uk-navbar-right">
          {!_.isEmpty(this.props.userData) ? userBadge : spotifyLogin}
        </div>
      </nav>
    );
  }
}

Topnav.propTypes = {
  userData: PropTypes.object.isRequired
};
