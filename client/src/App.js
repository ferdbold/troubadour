import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import request from 'request';
import _ from 'lodash';

import LaunchpadAgent from './LaunchpadAgent/LaunchpadAgent';

import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.onDeviceConnected = this.onDeviceConnected.bind(this);
    this.onLaunchpadButtonPressed = this.onLaunchpadButtonPressed.bind(this);
    this.checkSpotifyConnection = this.checkSpotifyConnection.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);

    this._cookies = new Cookies();
    this._launchpadAgent = new LaunchpadAgent();
    this._launchpadAgent._onDeviceConnectedCB = this.onDeviceConnected;
    this._launchpadAgent._onButtonPressedCB = this.onLaunchpadButtonPressed;

    this.state = {
      deviceName: '',
      accessToken: ''
      // TODO: fix caching issue
      // accessToken: this._cookies.get('access_token') || ''
    };
  }

  componentDidMount() {
    if (!this.state.accessToken) {
      this.checkSpotifyConnection();
    }
  }

  play() {
    const params = {
      url: 'https://api.spotify.com/v1/me/player/play',
      headers: {
        'Authorization': 'Bearer ' + this.state.accessToken
      },
      json: true
    };

    request.put(params, (error, response, body) => {
      console.log(error);
    });
  }

  pause() {
    const params = {
      url: 'https://api.spotify.com/v1/me/player/pause',
      headers: {
        'Authorization': 'Bearer ' + this.state.accessToken
      },
      json: true
    };

    request.put(params, (error, response, body) => {
      console.log(error);
    });
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
    let code = queryString.get('code'),
        state = queryString.get('state');
    if (code && state) {
      window.location = 'http://' + process.env.REACT_APP_SERVER_URI +
                        '/get_token?code=' + code + '&state=' + state;
    }
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

    const loginLink = (!this.state.accessToken)
      ? <a href={'http://' + process.env.REACT_APP_SERVER_URI + '/login'}>Log in with Spotify</a>
      : null;

    const playbackButtons = (this.state.accessToken)
      ? <span>
          <button onClick={this.play}>Play</button>
          <button onClick={this.pause}>Pause</button>
        </span>
      : null;

    return (
      <div className="sp-app">
        <header className="sp-app-header">
          <h1>Spotpad</h1>
          {deviceNameTag}
          {loginLink}

          {playbackButtons}
        </header>
      </div>
    );
  }
};
