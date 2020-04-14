import { Class, Enum } from 'meteor/jagi:astronomy';

const TrackSourceType = Enum.create({
  name: 'TrackSourceType',
  identifiers: [ 'SPOTIFY', 'YOUTUBE' ]
});

const TrackSource = Class.create({
  name: 'TrackSource',

  fields: {
    type:       { type: TrackSourceType },
    externalID: { type: String, default: '' } // Either Spotify ID or YouTube URL
  }
});

export const Track = Class.create({
  name: 'Track',

  fields: {
    title:      { type: String, default: '' },
    artist:     { type: String, default: '' },
    artworkURL: { type: String, default: '' },
    source:     TrackSource,
  }
});
