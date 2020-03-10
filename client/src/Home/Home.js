import React, { Component } from 'react';

import LaunchpadView from 'LaunchpadView/LaunchpadView';
import Library from 'Library/Library';
import SpotifySearch from 'SpotifySearch/SpotifySearch';
import Playback from 'Playback/Playback';

import './Home.scss';

export default class Home extends Component {
  render() {
    return (
      <div className="t-home">
        <SpotifySearch />
        <Library />
        <LaunchpadView />
        <Playback />
      </div>
    );
  }
}
