import { Meteor } from 'meteor/meteor';

import { Playlist } from '/imports/api/playlist/playlist';

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
