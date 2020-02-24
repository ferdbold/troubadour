import React, { Component } from 'react';

import LaunchpadAgent from './LaunchpadAgent/LaunchpadAgent';

import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.onDeviceConnected = this.onDeviceConnected.bind(this);
    this.onLaunchpadButtonPressed = this.onLaunchpadButtonPressed.bind(this);

    this._launchpadAgent = new LaunchpadAgent();
    this._launchpadAgent._onDeviceConnectedCB = this.onDeviceConnected;
    this._launchpadAgent._onButtonPressedCB = this.onLaunchpadButtonPressed;

    this.state = {
      deviceName: ''
    };
  }

  onDeviceConnected(name) {
    this.setState({
      deviceName: name
    });
  }

  onLaunchpadButtonPressed(coords) {
    // TODO: Implement
    console.log(coords);
  }

  render() {
    const deviceNameTag = (this.state.deviceName) ? <p>{this.state.deviceName} connected</p> : null;

    return (
      <div className="sp-app">
        <header className="sp-app-header">
          <h1>Spotpad</h1>
          {deviceNameTag}
        </header>
      </div>
    );
  }
};
