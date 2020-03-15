import React, { Component } from 'react';
import request from 'request';

import ApiContext from 'App/ApiContext';
import SpotifyTrack from 'SpotifyTrack/SpotifyTrack';

import './SpotifySearch.scss';

export default class SpotifySearch extends Component {
  static contextType = ApiContext;

  static Tabs = Object.freeze({ SavedTracks: 0, Playlists: 1, Search: 2 });
  static TabLabels = ['Saved Tracks', 'Playlists', 'Search'];

  constructor(props) {
    super(props);

    this.switchTabTo = this.switchTabTo.bind(this);

    this.state = {
      activeTab: SpotifySearch.Tabs.SavedTracks,
      savedTracks: []
    };
  }

  async componentDidMount() {
    const response = await fetch('https://api.spotify.com/v1/me/tracks', {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + this.context.accessToken
      }
    });

    const json = await response.json();
    this.setState({ savedTracks: json.items });
  }

  switchTabTo(newTab) {
    this.setState({ activeTab: newTab });
  }

  render() {
    const GetTab = (tab) => {
      const isActive = (this.state.activeTab === tab);
      /* eslint-disable */
      return (
        <li className={(isActive) ? 'uk-active' : ''}>
          <a href="#" onClick={() => { this.switchTabTo(tab) }}>
            {SpotifySearch.TabLabels[tab]}
          </a>
        </li>
      );
      /* eslint-enable */
    };

    const GetBody = () => {
      switch(this.state.activeTab) {
        case SpotifySearch.Tabs.SavedTracks:
          return (
            <ul className="uk-list">
              {this.state.savedTracks.map((track, i) => {
                return (
                  <li key={'track-' + i}>
                    <SpotifyTrack info={track} />
                  </li>
                );
              })}
            </ul>
          );

        case SpotifySearch.Tabs.Playlists:
          return(
            <div>Playlists (coming soon!)</div>
          );

        case SpotifySearch.Tabs.Search:
          return (
            <div>Search (coming soon!)</div>
          );

        default: return null;
      }
    };

    return (
      <div className="t-spotify-search">
        <h2>Spotify</h2>
        <ul data-uk-tab>
          {GetTab(SpotifySearch.Tabs.SavedTracks)}
          {GetTab(SpotifySearch.Tabs.Playlists)}
          {GetTab(SpotifySearch.Tabs.Search)}
        </ul>

        <div className="t-spotify-search-body">
          {GetBody()}
        </div>
      </div>
    );
  }
}
