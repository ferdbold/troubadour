const mongoose = require('mongoose');
const t = mongoose.Schema.Types;

module.exports = new mongoose.Schema({
  label:        t.String,
  type:         t.String,
  external_id:  t.String
});
