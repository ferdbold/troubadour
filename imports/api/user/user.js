import { Meteor } from 'meteor/meteor';
import { Class } from 'meteor/jagi:astronomy';

export const User = Class.create({
  name: 'User',
  collection: Meteor.users,

  fields: {
    name:       { type: String, default: '' },
    services:   Object
  }
});
