import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';

import { User } from '/imports/api/users';

import './Playback.scss';

class Playback extends Component {
  constructor(props) {
    super(props);

    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
  }

  play() {
    fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + _.get(this.props.user, 'services.spotify.accessToken', '') },
      json: true
    });
  }

  pause() {
    fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + _.get(this.props.user, 'services.spotify.accessToken', '') },
      json: true
    });
  }

  render() {
    return (
      <div className="t-playback">
        <button className="uk-button uk-button-primary" onClick={this.play}>Play</button>
        <button className="uk-button uk-button-primary" onClick={this.pause}>Pause</button>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('user');

  return {
    user: User.findOne({ _id: Meteor.userId() })
  };
})(Playback);
