'use strict';
var utilitiesController = require('./utilitiesController');
var statisticsController = require('./statisticsController');
var responseMessage = require('./../responseMessage.json');
var jsdom = require("jsdom");

exports.getTranslatableWords = function(url,dictionary,res,isNewUrl){
    if(!contentsHebrewSymbols(url)){
        var changedJson = [];
        jsdom.env(
            url,
            ["http://code.jquery.com/jquery.js"],
            function (err, window) {
                if(err){
                    console.error(err);
                    utilitiesController.returnResponse(res,500,false,err);
                }
                else{
                    var str = (window.$("body").text());
                    str = JSON.stringify(str);
                    var result = "";
                    var strLength =  str.length;
                    for(var i = 0; i < strLength;i++){
                        if (str.charCodeAt(i) >= 0x590 && str.charCodeAt(i) <= 0x5FF){
                            result+=str[i];
                        }
                        else{
                            result+=" ";
                        }
                    }
                    var resultArray = result.split(" ");
                    var hebrewWords = [];
                    resultArray.forEach(function (str) {
                        if(str.length > 0 && hebrewWords.indexOf(str) === -1){
                            hebrewWords.push(str);
                        }
                    });
                    var jsonObj = dictionary;
                    var shareInfoLen = Object.keys(jsonObj).length;
                    var changedWord;
                    var hebrewWordsLength =  hebrewWords.length;
                    for(i = 0; i < hebrewWordsLength; i++) {
                        for(var j=0; j< shareInfoLen; j++){
                            if(hebrewWords[i] == jsonObj[j].words[0].word){
                                var translationWord = [];
                                jsonObj[j].words_translation.forEach(function (word) {
                                    translationWord.push(word.word);
                                });
                                changedWord = ({
                                    word:hebrewWords[i],
                                    translation: translationWord,
                                    explanation: jsonObj[j].explanation
                                });
                                changedJson.push(changedWord) ;
                            }
                        }
                    }
                }
                if(changedJson.length > 0){
                    statisticsController.updateStatistics(url,isNewUrl,changedJson);
                }
                else{
                    utilitiesController.returnResponse(res,200,true,changedJson);
                }
            });
    }
    else{
        utilitiesController.returnResponse(res, 400, false, responseMessage.illegalArgument);
    }
};

function contentsHebrewSymbols(url) {
    var result = false;
    var urlLength = url.length;
    for(var i = 0; i < urlLength ; i++){
        if (url.charCodeAt(i) >= 0x590 && url.charCodeAt(i) <= 0x5FF){
            result = true;
            break;
        }
    }
    return result;
}