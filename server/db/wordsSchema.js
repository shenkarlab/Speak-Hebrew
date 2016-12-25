'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var words = new Schema({
    words:[{
      word:String
    }],
    words_translation:[{
      word:String
    }],
    explanation:{type:String,required:false},
    category:{type:String,required:false}
    },{collection:'words'});

var wordsSchema = mongoose.model('words', words);
module.exports  = wordsSchema;
