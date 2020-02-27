import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import request from 'request';
import _ from 'lodash';

import LaunchpadAgent from 'LaunchpadAgent/LaunchpadAgent';
import Topnav from 'Topnav/Topnav';

import './App.scss';
import imgSpotifyLogo from 'spotify-logo-black.png';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.onDeviceConnected = this.onDeviceConnected.bind(this);
    this.onLaunchpadButtonPressed = this.onLaunchpadButtonPressed.bind(this);
    this.checkSpotifyConnection = this.checkSpotifyConnection.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);

    this._cookies = new Cookies();

    if (navigator.requestMIDIAccess) {
      this._launchpadAgent = new LaunchpadAgent();
      this._launchpadAgent._onDeviceConnectedCB = this.onDeviceConnected;
      this._launchpadAgent._onButtonPressedCB = this.onLaunchpadButtonPressed;
    }

    this.state = {
      deviceName: '',
      accessToken: '',
      // TODO: fix caching issue
      // accessToken: this._cookies.get('access_token') || '',
      userData: {}
    };
  }

  componentDidMount() {
    if (!this.state.accessToken) {
      this.checkSpotifyConnection();
    }
    else {
      this.fetchUserData();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevState.accessToken && this.state.accessToken) {
      this.fetchUserData();
    }
  }

  play() {
    const params = {
      url: 'https://api.spotify.com/v1/me/player/play',
      headers: { 'Authorization': 'Bearer ' + this.state.accessToken },
      json: true
    };

    request.put(params);
  }

  pause() {
    const params = {
      url: 'https://api.spotify.com/v1/me/player/pause',
      headers: { 'Authorization': 'Bearer ' + this.state.accessToken },
      json: true
    };

    request.put(params);
  }

  checkSpotifyConnection() {
    console.log('Checking connection to Spotify...');

    // Fetch access token from either cookies or URL param
    const queryString = new URLSearchParams(window.location.search);
    let accessToken = queryString.get('access_token');
    const accessTokenCookie = '';
    // TODO: fix caching issue
    // const accessTokenCookie = this._cookies.get('access_token');
    if (accessToken || accessTokenCookie) {
      if (accessToken !== null && accessTokenCookie !== accessToken) {
        // TODO: fix caching issue
        // this._cookies.set('access_token', accessToken);
      }
      else {
        accessToken = accessTokenCookie;
      }

      this.setState({ accessToken: accessToken });
      return;
    }

    // Go fetch a token if we just got through authorization
    const code = queryString.get('code'),
          state = queryString.get('state');
    if (code && state) {
      window.location = process.env.REACT_APP_SERVER_URI +
                        '/get_token?code=' + code + '&state=' + state;
    }
  }

  fetchUserData() {
    const params = {
      url: 'https://api.spotify.com/v1/me',
      headers: { 'Authorization': 'Bearer ' + this.state.accessToken },
      json: true
    };

    request.get(params, (error, response, body) => {
      this.setState({ userData: body });
    });
  }

  onDeviceConnected(name) {
    this.setState({
      deviceName: name
    });
  }

  onLaunchpadButtonPressed(coords) {
    // TODO: Implement
    if (_.isEqual(coords, [0, 0])) {
      this.play();
    }
    else if (_.isEqual(coords, [0, 1])) {
      this.pause();
    }
  }

  render() {
    const deviceNameTag = (this.state.deviceName) ? <p>{this.state.deviceName} connected</p> : null;

    const loginForm = (!this.state.accessToken)
      ? <div>
          <h1>Welcome to Spotpad</h1>
          <a className="uk-button uk-button-default sp-spotify-login" href={process.env.REACT_APP_SERVER_URI + '/login'}>
            <img src={imgSpotifyLogo} alt="Spotify Logo" />
            Login with Spotify
          </a>
        </div>
      : null;

    const playbackButtons = (this.state.accessToken)
      ? <span>
          <button className="uk-button uk-button-primary" onClick={this.play}>Play</button>
          <button className="uk-button uk-button-primary" onClick={this.pause}>Pause</button>
        </span>
      : null;

    const body = (navigator.requestMIDIAccess)
      ? <div>
          {deviceNameTag}
          {loginForm}

          {playbackButtons}
        </div>
      : <p>MIDI isn't supported or allowed on this browser.</p>;

    return (
      <div className="sp-app">
        <Topnav userData={this.state.userData} />
        <header className="sp-app-header">
          {body}
        </header>
      </div>
    );
  }
};
