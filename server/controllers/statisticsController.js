'use strict';
var urlsSchema = require('./../db/urlsSchema');
var globalStatisticsSchema = require('./../db/globalStatisticsSchema');
var utilitiesController = require('./utilitiesController');

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

exports.updateClickedStatistics = function(word){
    var query  = globalStatisticsSchema.findOne().where({
        word:word
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
};

exports.getStatisticsTopClickedWords = function (res, numberOfWords) {
    getStatisticByCriteria(res, numberOfWords,"clickCount");
};

exports.getStatisticsTopSwitchedWords = function (res, numberOfWords) {
    getStatisticByCriteria(res, numberOfWords,"translationCount")
};

function getStatisticByCriteria(res,numberOfWords,criteria) {

    var sortBy;
    if(criteria === "clickCount"){
         sortBy = {
            clickCount:-1
        };
    }
    else{
         sortBy = {
             translationCount:-1
        };
    }
    var query  = globalStatisticsSchema.find().sort(sortBy).limit(parseInt(numberOfWords));
    query.exec(function (err,data) {
        if(err){
            console.log(err);
        }
        else{
            utilitiesController.returnResponse(res, 200, true, data);
        }
    });
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
            translationCount:1,
            clickCount:0
        });
    globalStatisticObject.save();
}