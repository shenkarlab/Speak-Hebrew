'use strict';
var urlsSchema = require('./../db/urlsSchema');
var globalStatisticsSchema = require('./../db/globalStatisticsSchema');
var utilitiesController = require('./utilitiesController');
var responseMessage = require('./../responseMessage.json');

exports.updateStatistics = function(url,isNewUrl,result){
    if(true === isNewUrl){
        createUrlInDb(url);
    }
    result.forEach(function (word) {
        if(isNewUrl){
            updateGlobalStatisticsForWord(word);
        }
    });
};

exports.updateClickedStatistics = function(res,word){
    var query  = globalStatisticsSchema.findOne().where({
        word:word
    });
    query.exec(function (err,doc) {
        if(err){
            console.error(err);
            utilitiesController.returnResponse(res, 500, false,responseMessage.dbError);
        }
        else{
            if(doc){
                doc.clickCount =  doc.clickCount +1;
                doc.save();
                utilitiesController.returnResponse(res, 200, true, responseMessage.statisticSaved);
            }
            else{
                err = "Error! No such doc to update click statistic. Word is a:"+word;
                console.error(err);
                utilitiesController.returnResponse(res, 500, true, responseMessage.dbError);
            }
        }
    });
};

exports.getStatisticsTopClickedWords = function (res, numberOfWords) {
    getStatisticByCriteria(res, numberOfWords,"clickCount");
};

exports.getStatisticsTopSwitchedWords = function (res, numberOfWords) {
    getStatisticByCriteria(res, numberOfWords,"translationCount")
};

function getStatisticByCriteria(res,numberOfWords,criteria) {
     if(!isNaN(numberOfWords) && numberOfWords  > 0) {
         var sortBy;
         if (criteria === "clickCount") {
             sortBy = {
                 clickCount: -1
             };
         }
         else {
             sortBy = {
                 translationCount: -1
             };
         }
         var query = globalStatisticsSchema.find().sort(sortBy).limit(parseInt(numberOfWords));
         query.exec(function (err, data) {
             if (err) {
                 console.error(err);
                 utilitiesController.returnResponse(res, 500, false,responseMessage.dbError);
             }
             else {
                 utilitiesController.returnResponse(res, 200, true, data);
             }
         });
     }
     else{
         utilitiesController.returnResponse(res, 400, false,responseMessage.illegalArgument);
     }
}

function updateGlobalStatisticsForWord(word){
    var query  = globalStatisticsSchema.findOne().where({
        word:word.word
    });
    query.exec(function (err,doc) {
        if(err){
            console.error(err);
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

function createUrlInDb(url) {
    var urlObject = new urlsSchema(
        {
            url:url
        });
    urlObject.save();
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
            explanation:word.explanation,
            translationCount:1,
            clickCount:0
        });
    globalStatisticObject.save();
}