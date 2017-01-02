'use strict';
var urlsSchema = require('./../db/urlsSchema');
var globalStatisticsSchema = require('./../db/globalStatisticsSchema');

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
};

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