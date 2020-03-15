import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import request from 'request';
import _ from 'lodash';

import Footer from 'Footer/Footer';
import Header from 'Header/Header';
import Home from 'Home/Home';
import LaunchpadAgent from 'LaunchpadAgent/LaunchpadAgent';
import Login from 'Login/Login';

import ApiContext from './ApiContext';
import './App.scss';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.onDeviceConnected = this.onDeviceConnected.bind(this);
    this.onLaunchpadButtonPressed = this.onLaunchpadButtonPressed.bind(this);
    this.checkSpotifyConnection = this.checkSpotifyConnection.bind(this);
    this.fetchUserData = this.fetchUserData.bind(this);

    this._cookies = new Cookies();

    if (navigator.requestMIDIAccess) {
      this._launchpadAgent = new LaunchpadAgent();
      this._launchpadAgent._onDeviceConnectedCB = this.onDeviceConnected;
      this._launchpadAgent._onButtonPressedCB = this.onLaunchpadButtonPressed;
    }

    this.state = {
      deviceName: '',
      accessToken: '',
      userId: '',
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

  checkSpotifyConnection() {
    console.log('Checking connection to Spotify...');

    // Fetch access token from either cookies or URL param
    const queryString = new URLSearchParams(window.location.search);
    let accessToken = queryString.get('access_token');
    const userId = queryString.get('user_id');
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

      this.setState({
        accessToken: accessToken,
        userId: userId
      });

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
    return (
      <div className="t-app">
        <Header userData={this.state.userData} />

        {(!this.state.accessToken)
          ? <Login />
          : <ApiContext.Provider
              value={{
                accessToken: this.state.accessToken,
                userId: this.state.userId
              }}
            >
              <Home />
            </ApiContext.Provider>}

        <Footer />
      </div>
    );
  }
};
