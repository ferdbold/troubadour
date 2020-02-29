import React, { Component } from 'react';

import imgSpotifyLogo from 'spotify-logo-black.png';

import './Login.scss';

export default class Login extends Component {
  render() {
    const body = (navigator.requestMIDIAccess)
      ? <a className="uk-button uk-button-default sp-spotify-login" href={process.env.REACT_APP_SERVER_URI + '/login'}>
          <img src={imgSpotifyLogo} alt="Spotify Logo" />
          Login with Spotify
        </a>
      : <p>MIDI isn't supported or allowed on this browser.</p>;

    return (
      <div className="sp-login">
        <h1>Welcome to Spotpad</h1>
        {body}
      </div>
    );
  }
}
