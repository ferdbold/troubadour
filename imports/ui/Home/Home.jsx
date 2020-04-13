import React, { Component } from 'react';

import LaunchpadView from '/imports/ui/LaunchpadView/LaunchpadView.jsx';
import Library from '/imports/ui/Library/Library.jsx';
import Playback from '/imports/ui/Playback/Playback.jsx';
import SpotifySearch from '/imports/ui/SpotifySearch/SpotifySearch.jsx';

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
