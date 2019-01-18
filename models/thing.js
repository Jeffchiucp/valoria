const mongoose = require('mongoose');
const { Schema } = mongoose;

const ThingSchema = new Schema({
  kind : String,
  content : {type : String, default : '{}'},
  key : String,
  creator : {type : String, default : 'James'},
  dimension : String
});

const Thing = mongoose.model('Thing', ThingSchema);

module.exports = Thing;
