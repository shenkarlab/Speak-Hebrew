'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var globalStatistics = new Schema({
    word:String,
    words_translation:String,
    explanation:String,
    translationCount:Number,
    clickCount:Number
},{collection:'globalStatistic'});

var globalStatisticsSchema = mongoose.model('globalStatistics', globalStatistics);
module.exports  = globalStatisticsSchema;
