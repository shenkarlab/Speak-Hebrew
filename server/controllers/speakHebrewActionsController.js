'use strict';
var mongoose = require('mongoose');
var wordsSchema = require('./../db/wordsSchema');
var urlsSchema = require('./../db/urlsSchema');
var globalStatisticsSchema = require('./../db/globalStatisticsSchema');
var DB = require('./../db/database');
var conf =  require('./../config.json');
var preprocessingController = require('./preprocessingController');
var errorStr = "An server error occurred.Error code:";

exports.getUrlHebrewWords = function(req,res) { //todo
    var url = req.params.url;
    var userId = req.params.userId;
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
                var result = getHebrewWords(url);
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

function getHebrewWords(url) {  //todo
    var resultData = [];
    //temporary hardcodet result for testing
        resultData.push({
            word: "קוֹנְסְפִּירַצְיָה",
            translation: ["קֶשֶׁר"],
            explanation: "קשר הוא התארגנות חשאית של אנשים במטרה למרוד בשלטון או לבצע מזימה נגד השלטון."
        });
        resultData.push({
            word: "קוֹנְפוֹרְמִיזְם",
            translation: ["הֲלִיכָה בַּתֶּלֶ,","תּוֹאֲמָנוּת"],
            explanation: null
        });
    return resultData;
}

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
}

if (conf.preprocessingMode) {
    preprocessingMode();
}
