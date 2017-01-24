'use strict';
var mongoose = require('mongoose');
var wordsSchema = require('./../db/wordsSchema');
var urlsSchema = require('./../db/urlsSchema');
var DB = require('./../db/database');
var conf =  require('./../config.json');
var responseMessage = require('./../responseMessage.json');
var preprocessingController = require('./preprocessingController');
var textualLogicController = require('./textualLogicController');
var utilitiesController = require('./utilitiesController');
var statisticsController = require('./statisticsController');

var dictionary;

exports.getUrlHebrewWords = function(req,res) {
        var userId = req.params.userId;
        var url = req.query.url;
        var query = urlsSchema.findOne().where({
            url:url
        });
        query.exec(function (err,doc) {
            if(err) {
                console.error(err);
                utilitiesController.returnResponse(res,500,false,responseMessage.dbError)
            }
            else{
                var isNewUrl = (doc === null);
                var result = textualLogicController.getTranslatableWords(url,dictionary,res,isNewUrl);
                statisticsController.updateStatistics(url,isNewUrl,result)
            }
        });
};

exports.userClickedOnTranslatedWord = function(req,res) {
    var word = req.params.word;
    statisticsController.updateClickedStatistics(res,word);
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
            console.error(err);
        }
        dictionary = data;
        console.log("Dictionary OK.")
    });
}

if (conf.preprocessingMode) {
    preprocessingMode();
}

setTimeout(function () {    //wait for mongoose connection established
    console.info("Load dictionary....");
    var count = 1;
    console.info('Attempt number  '+count);
    getDictionaryFromDb();
    setTimeout(function () {    //wait for get data from mongo db + calculate map
        if (dictionary !== undefined) {
            console.info('Server ready to work.');
            return;
        }
        var intervalObject = setInterval(function () {  // try again if attempt fail
            getDictionaryFromDb();
            count++;
            console.log('Attempt number  ' + count);
            if (dictionary !== undefined) {
                console.info('Server ready to work.');
                clearInterval(intervalObject);
            }
        },10000);
    },3000);
},3000);
