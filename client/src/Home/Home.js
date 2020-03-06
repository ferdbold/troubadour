import React, { Component } from 'react';

import Deck from 'Deck/Deck';
import LaunchpadView from 'LaunchpadView/LaunchpadView';
import SpotifySearch from 'SpotifySearch/SpotifySearch';
import Playback from 'Playback/Playback';

import './Home.scss';

export default class Home extends Component {
  render() {
    return (
      <div className="sp-home">
        <SpotifySearch />
        <Deck />
        <LaunchpadView />
        <Playback />
      </div>
    );
  }
}
