const mongoose = require('mongoose');
const { Schema } = mongoose;

const IdeaSchema = new Schema({
  kind : String,
  content : String,
  key : String,
  creator : {type : String, default : 'James'},
  dimension : String
});

const Idea = mongoose.model('Idea', IdeaSchema);

module.exports = Idea;
