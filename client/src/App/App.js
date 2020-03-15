import React, { Component } from 'react';
import Cookies from 'universal-cookie';
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
    this.getAccessToken = this.getAccessToken.bind(this);
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
      userData: {}
    };
  }

  componentDidMount() {
    if (!this.state.accessToken) {
      // Go fetch a token if we just got through authorization
      const queryString = new URLSearchParams(window.location.search);
      const code = queryString.get('code'),
            state = queryString.get('state');
      if (code && state) {
        this.getAccessToken(code, state);
      }
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

  async getAccessToken(code, state) {
    const response = await fetch(process.env.REACT_APP_SERVER_URI + '/get_token', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
        state: state
      })
    });

    const json = await response.json();
    if (json.access_token && json.refresh_token && json.user_id) {
      // Clear querystring
      if (window.history.pushState) {
        const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.pushState({path:newurl}, '', newurl);
      }

      this.setState({
        accessToken: json.access_token,
        refreshToken: json.refresh_token,
        userId: json.user_id
      });
    }
  }

  async fetchUserData() {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + this.state.accessToken },
      json: true
    });

    const json = await response.json();
    this.setState({ userData: json });
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
