'use strict';
var mongoose = require('mongoose');
var wordsSchema = require('./../db/wordsSchema');
var urlsSchema = require('./../db/urlsSchema');
var globalStatisticsSchema = require('./../db/globalStatisticsSchema');
var DB = require('./../db/database');
var conf =  require('./../config.json');
var preprocessingController = require('./preprocessingController');
var textualLogicController = require('./textualLogicController');
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
                var result = textualLogicController.getTranslatableWords(url,dictionary);
                updateStatistics(userId,url,isNewUrl,result);
                returnResponse(res,200,true,result);
            }
        });
};

exports.userClickedOnTranslatedWord = function(req,res) { //todo
    var word = req.params.word;
    var userId = req.params.userId;
    updateClickedStatistics(word,userId);
    returnResponse(res, 200, true, "ok");
};

exports.getUserSwitchedTranslatedWords = function(req,res) { //todo
    var userId = req.params.userId;
    var numberOfWords = req.params.numberOfWords;
    returnResponse(res, 200, true, "ok");
};

exports.getUserClickedTranslatedWords = function(req,res) { //todo
    var userId = req.params.userId;
    var numberOfWords = req.params.numberOfWords;
    returnResponse(res, 200, true, "ok");
};

exports.getAllUsersClickedTranslatedWords = function(req,res) {//todo
    var numberOfWords = req.params.numberOfWords;
    returnResponse(res, 200, true, "ok");
};

exports.getAllUserSwitchedTranslatedWords = function(req,res) {//todo
    var numberOfWords = req.params.numberOfWords;
    returnResponse(res, 200, true, "ok");
};

function updateStatistics(userId,url,isNewUrl,result){
    if(true === isNewUrl){
        createUrlInDb(url);
    }
    result.forEach(function (word) {
        if(isNewUrl){
            updateGlobalStatisticsForWord(word);
        }
        updateUserStatisticsForWord(userId,word.word);
    });
}

function createUrlInDb(url) {
    var urlObject = new urlsSchema(
        {
            url:url
        });
    urlObject.save();
}

function updateGlobalStatisticsForWord(word){
    var query  = globalStatisticsSchema.findOne().where({
        word:word.word
    });
    query.exec(function (err,doc) {
        if(err){
            console.log(err);
        }
        else{
          if(doc){
              incrementCountForStatisticDoc(doc)
          }
          else{
              createStatisticDocForWord(word)
          }
        }
    });
}

function incrementCountForStatisticDoc(doc){
    doc.translationCount =  doc.translationCount +1;
    doc.save();
}

function createStatisticDocForWord(word){
    var globalStatisticObject = new globalStatisticsSchema(
        {
            word:word.word,
            words_translation:word.translation,
            translationCount:1,
            clickCount:0
        });
    globalStatisticObject.save();
}

function updateUserStatisticsForWord(userId,word){

}

function updateClickedStatistics(word,userId){
    updateGlobalClickStatistics(word);
    updateUserClickStatistics(word,userId)
}

function updateGlobalClickStatistics(word){
    var query  = globalStatisticsSchema.findOne().where({
        word:word.word
    });
    query.exec(function (err,doc) {
        if(err){
            console.log(err);
        }
        else{
            if(doc){
                doc.clickCount =  doc.clickCount +1;
                doc.save();
            }
            else{
                console.error("Error! No such doc to update click statistic. Word is a:"+word);
            }
        }
    });
}

function updateUserClickStatistics(word,userId){

}

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

function getDictionaryFromDb(){ // get data from DB and calculate map
    if(!DB.isConnectedToDB()){
        dictionary = undefined;
        console.error("No connected to db. Can't get dictionary!")
    }
    wordsSchema.find({},function (err,data) {
        if(err){
            console.log(err);
            res.status(500).send(errorStr+"0");
        }
        dictionary = data;
        console.log("Dictionary OK.")
    });
}


function returnResponse(res,status,isSuccessful,data){
    if(isSuccessful){
        res.status(200).send({
            result:"ok",
            data:data
        });
    }
    else{
        res.status(200).send({
            result:"fail",
            error:data
        });
    }
    console.info("Response status:"+status+" Successful:"+isSuccessful + " Data:");
    console.info(data);
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
