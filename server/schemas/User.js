const mongoose = require('mongoose');
const t = mongoose.Schema.Types;

module.exports = new mongoose.Schema({
  name:         t.String,
  spotify_id:   t.String,
});
