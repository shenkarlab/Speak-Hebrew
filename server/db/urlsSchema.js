'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urls = new Schema({
    url:{type:String,required:true,unigue:true}
},{collection:'urls'});

var urlsSchema = mongoose.model('urls', urls);
module.exports  = urlsSchema;
