'use strict';
var utilitiesController = require('./utilitiesController');
var statisticsController = require('./statisticsController');
var jsdom = require("jsdom");

exports.getTranslatableWords = function(url,dictionary,res,isNewUrl){
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
                for(var i = 0; i < str.length;i++){
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
                var changedJson = [];
                var shareInfoLen = Object.keys(jsonObj).length;
                var changedWord;
                for(i = 0; i < hebrewWords.length; i++) {
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
           // JSON.stringify(changedJson);
            statisticsController.updateStatistics(url,isNewUrl,changedJson);
            utilitiesController.returnResponse(res,200,true,changedJson);
        });
};