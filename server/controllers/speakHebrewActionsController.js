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
                utilitiesController.returnResponse(res,500,false,err)
            }
            else{
                var isNewUrl = (doc === null);
                var result = textualLogicController.getTranslatableWords(url,dictionary,res,isNewUrl);
            }
        });
};

exports.userClickedOnTranslatedWord = function(req,res) {
    var word = req.params.word;
    statisticsController.updateClickedStatistics(word);
    utilitiesController.returnResponse(res, 200, true, "ok");
};

exports.getStatisticsTopClickedWords = function(req, res) {
    var numberOfWords = req.params.numberOfWords;
    statisticsController.getStatisticsTopClickedWords(res,numberOfWords)
};

exports.getStatisticsTopSwitchedWords = function(req, res) {
    var numberOfWords = req.params.numberOfWords;
    statisticsController.getStatisticsTopSwitchedWords(res,numberOfWords)
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
