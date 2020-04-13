import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

import './Login.scss';

export default class Login extends Component {
  onLogin() {
    Meteor.loginWithSpotify({
      requestPermissions: [
        'user-library-read',
        'user-modify-playback-state',
        'user-read-private',
        'user-read-email'
      ],
      showDialog: true
    });
  }

  render() {
    const body = (navigator.requestMIDIAccess)
      ? <button className="uk-button uk-button-default t-spotify-login" onClick={this.onLogin}>
          <img src="/img/spotify-logo-black.png" alt="Spotify Logo" />
          Login with Spotify
        </button>
      : <p>MIDI isn't supported or allowed on this browser.</p>;

    return (
      <div className="t-login">
        <h1>Welcome to Troubadour</h1>
        {body}
      </div>
    );
  }
}
