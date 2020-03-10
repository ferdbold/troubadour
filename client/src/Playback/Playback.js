import React, { Component } from 'react';
import request from 'request';

import ApiContext from 'App/ApiContext';

import './Playback.scss';

export default class Playback extends Component {
  static contextType = ApiContext;

  constructor(props) {
    super(props);

    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
  }

  play() {
    const params = {
      url: 'https://api.spotify.com/v1/me/player/play',
      headers: { 'Authorization': 'Bearer ' + this.context.accessToken },
      json: true
    };

    request.put(params);
  }

  pause() {
    const params = {
      url: 'https://api.spotify.com/v1/me/player/pause',
      headers: { 'Authorization': 'Bearer ' + this.context.accessToken },
      json: true
    };

    request.put(params);
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
