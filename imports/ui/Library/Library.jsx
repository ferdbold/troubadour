import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';

import { Playlist } from '/imports/api/playlist/playlist';
import { User } from '/imports/api/users';

import './Library.scss';

class Library extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePlaylist: ''
    };

    this.createPlaylist = this.createPlaylist.bind(this);
    this.switchToPlaylist = this.switchToPlaylist.bind(this);
  }

  createPlaylist() {
    const playlist = new Playlist();

    playlist.insert((error) => {
      if (error === undefined) {
        this.switchToPlaylist(playlist);
      }
    });
  }

  switchToPlaylist(playlist) {
    this.setState({ activePlaylist: playlist._id });
  }

  getActivePlaylist() {
    return _.find(this.props.playlists, (playlist) => { return playlist._id === this.state.activePlaylist; });
  }

  render() {
    const GetTab = (playlist) => {
      const isActive = (this.state.activePlaylist === playlist._id);
      return (
        <li key={'playlist-' + playlist._id} className={(isActive) ? 'uk-active' : ''}>
          <a href="#" onClick={() => { this.switchToPlaylist(playlist); }}>
            {playlist.name}
          </a>
        </li>
      );
    }

    const GetBody = () => {
      const activePlaylist = this.getActivePlaylist();
      return (activePlaylist) ? <p>{activePlaylist.name}</p> : '';
    };

    return (
      <div className="t-library">
        <h2>Library</h2>
        <ul data-uk-tab>
          {this.props.playlists.map((playlist) => {
            return GetTab(playlist);
          })}
          <li><a href="#" onClick={() => { this.createPlaylist(); }}>+ Add</a></li>
        </ul>

        <div className="t-library-body">
          {GetBody()}
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('user');
  Meteor.subscribe('playlists');

  return {
    user: User.findOne({ _id: Meteor.userId() }),
    playlists: Playlist.find({ owner_id: Meteor.userId() }).fetch()
  };
})(Library);
