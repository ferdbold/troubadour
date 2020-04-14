import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';

import { Track } from '/imports/api/playlist/track';

export const Playlist = Class.create({
  name: 'Playlist',
  collection: new Mongo.Collection('playlists'),

  fields: {
    name:         { type: String, default: 'New playlist' },
    tracks:       { type: [Track], default: [] },
    owner_id:     { type: String,
                    immutable: true,
                    default: () => { return Meteor.userId(); }},
    updatedAt:    { type: Date, default: () => { return new Date(); } }
  },

  events: {
    beforeSave(e) {
      e.currentTarget.updatedAt = new Date();
    }
  },

  meteorMethods: {
    insert() {
      return this.save();
    }
  }
});

if (Meteor.isServer) {
  Meteor.publish('playlists', () => {
    const options = {
      fields: {
        'name': 1,
        'tracks' : 1,
        'owner_id': 1,
        'updatedAt' : 1
      }
    };

    return Playlist.find({ owner_id: Meteor.userId() }, options);
  });
}
