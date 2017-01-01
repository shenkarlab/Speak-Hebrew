'use strict';
var mongoose = require('mongoose');
var wordsSchema = require('./../db/wordsSchema');
var urlsSchema = require('./../db/urlsSchema');
var DB = require('./../db/database');
var conf =  require('./../config.json');
var preprocessingController = require('./preprocessingController');
var textualLogicController = require('./textualLogicController');
var utilitiesController = require('./utilitiesController');
var statisticsController = require('./statisticsController');
var errorStr = "An server error occurred.Error code:";
var dictionary;

exports.getUrlHebrewWords = function(req,res) {
        var userId = req.params.userId;
        var url = req.query.url;
        var query = urlsSchema.findOne().where({
            url:url
        });
        query.exec(function (err,doc) {
            if(err) {
                console.log(err);
                returnResponse(res,500,false,error)
            }
            else{
                var isNewUrl = (doc === null);
                var result = textualLogicController.getTranslatableWords(url,dictionary,res,isNewUrl);
            }
        });
};
exports.getNumberOfChangedWords = function (req,res) {
    var userId = req.params.userId;
    var number = Math.floor((Math.random() * 100) + 1);
    var data = {
        numberOfChangedWord:number
    };
    utilitiesController.returnResponse(res, 200, true, data);
};

exports.userClickedOnTranslatedWord = function(req,res) { //todo
    var word = req.params.word;
    var userId = req.params.userId;
    updateClickedStatistics(word,userId);
    utilitiesController.returnResponse(res, 200, true, "ok");
};

exports.getUserSwitchedTranslatedWords = function(req,res) { //todo
    var userId = req.params.userId;
    var numberOfWords = req.params.numberOfWords;
    utilitiesController.returnResponse(res, 200, true, "ok");
};

exports.getUserClickedTranslatedWords = function(req,res) { //todo
    var userId = req.params.userId;
    var numberOfWords = req.params.numberOfWords;
    utilitiesController.returnResponse(res, 200, true, "ok");
};

exports.getAllUsersClickedTranslatedWords = function(req,res) {//todo
    var numberOfWords = req.params.numberOfWords;
    utilitiesController.returnResponse(res, 200, true, "ok");
};

exports.getAllUserSwitchedTranslatedWords = function(req,res) {//todo
    var numberOfWords = req.params.numberOfWords;
    utilitiesController.returnResponse(res, 200, true, "ok");
};

function preprocessingMode(){
    setTimeout(function () {
        if (DB.isConnectedToDB()) {
            preprocessingController.preprocessing();
        }
        else{
            console.log("Error. No conection to db. Can't preprocessing");
        }
    },5000);
}

function getDictionaryFromDb(){
    if(!DB.isConnectedToDB()){
        dictionary = undefined;
        console.error("No connected to db. Can't get dictionary!")
    }
    wordsSchema.find({},function (err,data) {
        if(err){
            console.log(err);
        }
        dictionary = data;
        console.log("Dictionary OK.")
    });
}

if (conf.preprocessingMode) {
    preprocessingMode();
}

setTimeout(function () {    //wait for mongoose connection established
    console.log("Load dictionary....");
    var count = 1;
    console.log('Attempt number  '+count);
    getDictionaryFromDb();
    setTimeout(function () {    //wait for get data from mongo db + calculate map
        if (dictionary !== undefined) {
            console.log('Server ready to work.');
            return;
        }
        var intervalObject = setInterval(function () {  // try again if attempt fail
            getDictionaryFromDb();
            count++;
            console.log('Attempt number  ' + count);
            if (dictionary !== undefined) {
                console.log('Server ready to work.');
                clearInterval(intervalObject);
            }
        },10000);
    },3000);
},3000);
