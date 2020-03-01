import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Track.scss';

export default class Track extends Component {

  render() {
    const artistNames = this.props.info.track.artists.map((artist) => {
      return artist.name;
    });

    return (
      <div className="sp-track">
        <img src={this.props.info.track.album.images[2].url} alt="" />
        <div className="sp-track-artist">{artistNames.join(', ')}</div>
        <div className="sp-track-title">{this.props.info.track.name}</div>
      </div>
    );
  }
}

Track.propTypes = {
  info: PropTypes.shape({
    track: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};
