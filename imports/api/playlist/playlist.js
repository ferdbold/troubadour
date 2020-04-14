import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';

import { Track } from '/imports/api/track';

const PlaylistCollection = new Mongo.Collection('playlists');
PlaylistCollection.allow({
  update(userId, playlist) {
    console.log('voyons calisse');
    return playlist.owner_id === userId;
  }
});

export const Playlist = Class.create({
  name: 'Playlist',
  collection: PlaylistCollection,

  fields: {
    name:         { type: String, default: 'New playlist' },
    tracks:       { type: [Track], default: [] },
    owner_id:     { type: String,
                    immutable: true,
                    default: () => { return Meteor.userId(); }},
    updatedAt:    { type: Date, default: () => { return new Date(); } }
  }
});
