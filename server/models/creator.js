const mongoose = require('mongoose');

const { Schema } = mongoose;

const creatorSchema = new Schema({
  name: String,
  ranking: Number,
});

module.exports = mongoose.model('Creator', creatorSchema);
