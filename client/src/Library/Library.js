import React, { Component } from 'react';
import request from 'request';

import ApiContext from 'App/ApiContext';
import Track from 'Track/Track';

import './Library.scss';

export default class Library extends Component {
  static contextType = ApiContext;

  static Tabs = Object.freeze({ SavedTracks: 0, Playlists: 1, Search: 2 });
  static TabLabels = ['Saved Tracks', 'Playlists', 'Search'];

  constructor(props) {
    super(props);

    this.switchTabTo = this.switchTabTo.bind(this);

    this.state = {
      activeTab: Library.Tabs.SavedTracks,
      savedTracks: []
    };
  }

  componentDidMount() {
    const params = {
      url: 'https://api.spotify.com/v1/me/tracks',
      headers: {
        authorization: 'Bearer ' + this.context.accessToken
      }
    };

    request.get(params, (error, response, body) => {
      if (!error) {
        this.setState({ savedTracks: JSON.parse(body).items });
      }
    });
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
            {Library.TabLabels[tab]}
          </a>
        </li>
      );
      /* eslint-enable */
    };

    const GetBody = () => {
      switch(this.state.activeTab) {
        case Library.Tabs.SavedTracks:
          return (
            <ul className="uk-list">
              {this.state.savedTracks.map((track, i) => {
                if (i === 0) console.log(track);
                return (
                  <li key={'track-' + i}>
                    <Track info={track} />
                  </li>
                );
              })}
            </ul>
          );

        case Library.Tabs.Playlists:
          return(
            <div>Playlists (coming soon!)</div>
          );

        case Library.Tabs.Search:
          return (
            <div>Search (coming soon!)</div>
          );

        default: return null;
      }
    };

    return (
      <div className="sp-library">
        <h2>Library</h2>
        <ul data-uk-tab>
          {GetTab(Library.Tabs.SavedTracks)}
          {GetTab(Library.Tabs.Playlists)}
          {GetTab(Library.Tabs.Search)}
        </ul>

        <div className="sp-library-body">
          {GetBody()}
        </div>
      </div>
    );
  }
}
