const mongoose = require('mongoose');
const t = mongoose.Schema.Types;

const Track = require('./Track');

module.exports = new mongoose.Schema({
  title:      t.String,
  owner_id:   t.ObjectId,
  tracks:     [Track]
});
