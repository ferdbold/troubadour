import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';

import { User } from '/imports/api/user/user';

import './SpotifyTrack.scss';

class SpotifyTrack extends Component {
  constructor(props) {
    super(props);

    this.onTogglePlaylist = this.onTogglePlaylist.bind(this);
  }

  onTogglePlaylist(playlist, add) {
    (add)
      ? playlist.addSpotifyTrack(this.props.info.track.id)
      : playlist.removeSpotifyTrack(this.props.info.track.id);
  }

  render() {
    const dropdown =
      <div className="t-spotify-track-add-dropdown" data-uk-dropdown="mode: click; pos: bottom-right">
        <ul className="uk-list">
          {this.props.playlists.map((playlist) => {
            const checked = (_.find(playlist.tracks, (track) => { return track.source.externalID === this.props.info.track.id }) !== undefined);

            return (
              <li key={'playlist-add-' + playlist._id}>
                <label>
                  <input type="checkbox" className="uk-checkbox" checked={checked} onChange={(e) => { this.onTogglePlaylist(playlist, !checked); }}></input>
                  {playlist.name}
                </label>
              </li>
            );
          })}
        </ul>
      </div>;

    const artistNames = this.props.info.track.artists.map((artist) => {
      return artist.name;
    });

    return (
      <div className="t-spotify-track" onClick={this.onAddToLibrary}>
        <button className="uk-badge uk-badge-success t-spotify-track-add"><span data-uk-icon="plus" /> Add</button>
        {dropdown}

        <img src={this.props.info.track.album.images[2].url} alt="" />
        <div className="t-spotify-track-artist">{artistNames.join(', ')}</div>
        <div className="t-spotify-track-title">{this.props.info.track.name}</div>
      </div>
    );
  }
}

SpotifyTrack.propTypes = {
  info: PropTypes.shape({
    track: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  playlists: PropTypes.arrayOf(PropTypes.object)
};

export default withTracker(() => {
  Meteor.subscribe('user');

  return {
    user: User.findOne({ _id: Meteor.userId() })
  };
})(SpotifyTrack);
