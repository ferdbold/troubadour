import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';

import { User } from '/imports/api/user/user';

import Footer from '/imports/ui/Footer/Footer.jsx';
import Header from '/imports/ui/Header/Header.jsx';
import Home from '/imports/ui/Home/Home.jsx';
import Login from '/imports/ui/Login/Login.jsx';

import LaunchpadAgent from '/imports/ui/LaunchpadAgent/LaunchpadAgent';

import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);

    this.onDeviceConnected = this.onDeviceConnected.bind(this);
    this.onLaunchpadButtonPressed = this.onLaunchpadButtonPressed.bind(this);

    if (navigator.requestMIDIAccess) {
      this._launchpadAgent = new LaunchpadAgent();
      this._launchpadAgent._onDeviceConnectedCB = this.onDeviceConnected;
      this._launchpadAgent._onButtonPressedCB = this.onLaunchpadButtonPressed;
    }

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
    if (_.isEqual(coords, [0, 0])) {
      this.play();
    }
    else if (_.isEqual(coords, [0, 1])) {
      this.pause();
    }
  }

  render() {
    const accessToken = _.get(this.props.user, 'services.spotify.accessToken', '');

    return (
      <div className="t-app">
        <Header />
        {(!accessToken) ? <Login /> : <Home />}
        <Footer />
      </div>
    );
  }
};

export default withTracker(() => {
  Meteor.subscribe('user');

  return {
    user: User.findOne({ _id: Meteor.userId() })
  };
})(App);
