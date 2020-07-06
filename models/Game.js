const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Game = new Schema({
  name: {
    type: String,
    required: true
  },
  name_en: String,
  release_date: {
    type: Date,
    default: Date.now
  },
  platforms: {
    ps4: {type: Boolean, default: false},
    ps3: {type: Boolean, default: false},
    psv: {type: Boolean, default: false},
    steam: {type: Boolean, default: false},
    switch: {type: Boolean, default: false},
    xbox: {type: Boolean, default: false},
  },
  ps4: String,
  steam: String,
  img_url: {
    type: String
  },
  completed: {type: Boolean, default: false}
}, {
  collection: 'games'
});

module.exports = mongoose.model('Game', Game);
