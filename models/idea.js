const mongoose = require('mongoose');
const { Schema } = mongoose;

const IdeaSchema = new Schema({
  kind : String,
  content : {type : String},
  key : String,
  creator : {type : String, default : 'James'},
  dimension : String,
  isPrivate : {type : Boolean, default : false},
  editors : Array
});

const Idea = mongoose.model('Idea', IdeaSchema);

module.exports = Idea;
