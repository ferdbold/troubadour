import React, { Component } from 'react';

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
    fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + this.context.accessToken },
      json: true
    });
  }

  pause() {
    fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + this.context.accessToken },
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
