exports.getTranslatableWords = function(url,dictionary){
    var jsdom = require("jsdom");

    jsdom.env(
        url,
        ["http://code.jquery.com/jquery.js"],
        function (err, window) {
            if(err){
                console.error(err);
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
                console.log("Hebrew words found:"+hebrewWords.length);
                console.log("-----------------------------------");

                var jsonObj = dictionary;
                var changedJson = {
        
                 };

                var shareInfoLen = Object.keys(jsonObj).length;
                console.log("Size of origen JSON file is: " + shareInfoLen);

                for(i = 0; i < hebrewWords.length; i++) {
                      for(j=0; j< shareInfoLen; j++){
                         if(hebrewWords[i] == jsonObj[j].words[0].word){
                            var translationWord = [];
                            jsonObj[j].words_translation.forEach(function (word) {
                            translationWord.push(word.word);  
                          });

                            var changedWord = ({ word_hebrew: translationWord, explanation: jsonObj[j].explanation });
                            changedJson[hebrewWords[i]] = changedWord ;
                      }
                       else{
                         continue;
                       }
                    }
                }
            }
            JSON.stringify(changedJson); 
            console.log(changedJson);

        });



    var resultData = [];
    //temporary hardcodet result for testing
    resultData.push({
        word: "אימפוטנצייה",
        translation: ["אין-אונות"],
        explanation: null
    });
    resultData.push({
        word: "אינדיקציה",
        translation: ["אות","הוריה","ציון"],
        explanation: "אפשר להשתמש גם בחלופות 'סימן', 'עדות'."
    });
    return resultData;
    

};