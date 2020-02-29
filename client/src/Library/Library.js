import React, { Component } from 'react';

import './Library.scss';

export default class Library extends Component {
  render() {
    return (
      <div className="sp-library">
        <h2>Library</h2>
        <ul data-uk-tab>
          <li><button>Saved Tracks</button></li>
          <li><button>Playlists</button></li>
          <li className="uk-disabled"><button>Search results</button></li>
        </ul>
      </div>
    );
  }
}
