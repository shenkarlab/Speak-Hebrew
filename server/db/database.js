'use strict';
//------------Connect tomongodbonmLabvia Mongoose--------------
var flagIsConnection =  false;
var mongoose = require('mongoose');
var config = require('./../config.json');

var mongoUrl = 'mongodb://'+config.username+':'+config.password+'@ds133418.mlab.com:33418/speakhebrewdb';

//The server optionauto_reconnectis defaulted to true
var options = {
    server: {
        auto_reconnect:true
    }
};
mongoose.Promise = global.Promise;
mongoose.connect(mongoUrl, options);
var db = mongoose.connection;// a global connection variable

// Event handlers for Mongoose
db.on('error', function (err) {
    console.error('Mongoose: Error: ' + err);
});
db.on('open', function(){
    flagIsConnection = true;
    console.info('Mongoose: Connection established');
});
db.on('disconnected', function(){
    flagIsConnection = false;
    console.info('Mongoose: Connection stopped,recconect');
    mongoose.connect(config.mongoUrl, options);
});
db.on('reconnected', function (){
    flagIsConnection = true;
    console.info('Mongoose reconnected!');
});

exports.isConnectedToDB = function () {
    return flagIsConnection
};