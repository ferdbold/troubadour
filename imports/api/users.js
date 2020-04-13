import { Meteor } from 'meteor/meteor';
import { Class } from 'meteor/jagi:astronomy';

export const User = Class.create({
  name: 'User',
  collection: Meteor.users,

  fields: {
    name: {
      type: String,
      default: ''
    },

    profile: {
      type: Object
    },

    services: {
      type: Object
    }
  }
});

if (Meteor.isServer) {
  Meteor.publish('user', () => {
    const options = {
      fields: {
        'name': 1,
        'services.spotify': 1
      }
    };

    return User.find({ _id: Meteor.userId() }, options);
  });
}
