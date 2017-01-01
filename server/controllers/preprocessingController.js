'use strict';
var wordsSchema = require('./../db/wordsSchema');
exports.preprocessing = function() {    //return map data ( not calculate map)
    var preprocessingData = require('./../words.json');
    var wordsList = preprocessingData.words;
    console.log("Start preprocessing");
    wordsSchema.remove({}, function(err) {
            if (err) {
                console.log(err);
            } else {
                wordsList.forEach(function (word) {
                    var category = getCategoryIfExist(word.word);
                    var words = getWordsArray(word.word);
                    var wordsTranslation = getWordsArray(word.word_hebrew);
                    var wordObject = new wordsSchema(
                        {
                            words:words,
                            words_translation:wordsTranslation,
                            explanation:word.explanation,
                            category:category
                        });
                    wordObject.save();
                });
                console.log("Preprocessing successful complete");
                wordsList = null;
            }
        }
    );
};

function getWordsArray(str) {
    str = str.replace(',',';');
    str = clearFromBrackets(str,"]","[");
    str = clearFromBrackets(str,")","(");
    str = str.replace(',',";");
    var strArray = str.split(";");
    var wordArray = [];
    strArray.forEach(function (word){
        wordArray.push({
            word:word
        })
    });
    return wordArray;
}

function clearFromBrackets(str,BracketsStart,BracketsEnd){
    var startOfBrackets = str.indexOf(BracketsStart);
    if(startOfBrackets!= -1){
        var endOfBracket = str.indexOf(BracketsEnd);
        str = str.replace(str.substring(startOfBrackets + 1, endOfBracket  - 1), "");
    }
    return str;
}

function getCategoryIfExist(str) {
    var startOfBrackets = str.indexOf(")");
    if(startOfBrackets!= -1){
        var endOfBracket = str.indexOf("(");
        str = str.substring(startOfBrackets, endOfBracket + 1);
        return str;
    }
   else{
       return null;
    }
}