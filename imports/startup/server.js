import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

ServiceConfiguration.configurations.update(
  { "service": "spotify" },
  {
    $set: {
      "clientId": Meteor.settings.spotify.clientId,
      "secret": Meteor.settings.spotify.clientSecret
    }
  },
  { upsert: true }
);
