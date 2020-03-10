import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './SpotifyTrack.scss';

export default class SpotifyTrack extends Component {
  constructor(props) {
    super(props);

    this.onAddToLibrary = this.onAddToLibrary.bind(this);
  }

  onAddToLibrary() {
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'spotify',
        id: this.props.info.track.id
      })
    };

    fetch(process.env.REACT_APP_SERVER_URI + '/add', params)
    .then((response) => {
      // TODO: Implement this
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  render() {
    const artistNames = this.props.info.track.artists.map((artist) => {
      return artist.name;
    });

    return (
      <button className="t-spotify-track" onClick={this.onAddToLibrary}>
        <span className="uk-badge uk-badge-success t-spotify-track-add"><span data-uk-icon="plus" /> Add</span>
        <img src={this.props.info.track.album.images[2].url} alt="" />
        <div className="t-spotify-track-artist">{artistNames.join(', ')}</div>
        <div className="t-spotify-track-title">{this.props.info.track.name}</div>
      </button>
    );
  }
}

SpotifyTrack.propTypes = {
  info: PropTypes.shape({
    track: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};
