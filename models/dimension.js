const mongoose = require('mongoose');
const { Schema } = mongoose;

const DimensionSchema = new Schema({
  key : String,
  creator : {type : String, default : 'James'},
  ideas : Array,
  things : Array,
  thingCount : {default : 0, type : Number},
  content : String
});

const Dimension = mongoose.model('Dimension', DimensionSchema);

module.exports = Dimension;
