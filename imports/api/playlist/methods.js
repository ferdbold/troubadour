import _ from 'lodash';
import fetch from 'node-fetch';

import { Playlist } from '/imports/api/playlist/playlist';

import { Track, TrackSource, TrackSourceType } from '/imports/api/track';
import { User } from '/imports/api/user/user';

Playlist.extend({
  events: {
    beforeSave(e) {
      e.currentTarget.updatedAt = new Date();
    }
  },

  meteorMethods: {
    insert() {
      return this.save();
    },

    async addSpotifyTrack(spotifyID) {
      const user = User.findOne({ _id: Meteor.userId() });

      const response = await fetch('https://api.spotify.com/v1/tracks/' + spotifyID, {
        method: 'GET',
        headers: {
          authorization: 'Bearer ' + _.get(user, 'services.spotify.accessToken', '')
        }
      });
      const json = await response.json();
      const artistNames = json.artists.map((artist) => {
        return artist.name;
      });

      const track = new Track({
        title: json.name,
        artist: artistNames.join(', '),
        artworkURL: json.album.images[2].url,
        source: new TrackSource({
          type: TrackSourceType.SPOTIFY,
          externalID: spotifyID
        })
      });

      this.tracks.push(track);
      return this.save();
    },

    removeSpotifyTrack(spotifyID) {
      const index = _.findIndex(this.tracks, (track) => { return track.source.externalID === spotifyID });

      this.tracks.splice(index, 1);
      return this.save();
    }
  }
});
