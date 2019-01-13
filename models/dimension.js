const mongoose = require('mongoose');
const { Schema } = mongoose;

const DimensionSchema = new Schema({
  key : String,
  creator : {type : String, default : 'James'},
  ideas : Array,
  things : Array
});

const Dimension = mongoose.model('Dimension', DimensionSchema);

module.exports = Dimension;
