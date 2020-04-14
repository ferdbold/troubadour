import { Meteor } from 'meteor/meteor';

import { User } from '/imports/api/user/user';

Meteor.publish('user', () => {
  const options = {
    fields: {
      'name': 1,
      'services.spotify': 1
    }
  };

  return User.find({ _id: Meteor.userId() }, options);
});
