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
                    if(str.length > 0){
                        hebrewWords.push(str);
                    }
                });
                console.log("Hebrew words find:"+hebrewWords.length);
                console.log("-----------------------------------");

                var jsonObj = dictionary;
                console.log(jsonObj[2]);
               // console.log(jsonObj[2].words[0]);
                var shareInfoLen = Object.keys(jsonObj).length;
                console.log("Size of origen JSON file is: " + shareInfoLen);
                //console.log(hebrewWords[0]);
                console.log("-----------------------");
                console.log(hebrewWords[0]);
                console.log(jsonObj[0].words[0].word);
                console.log("-----------------------");
                for(i = 0; i < hebrewWords.length; i++) {
                      for(j=0; j< shareInfoLen; j++){
                         if(hebrewWords[i] == jsonObj[j].words[0].word){

                         // console.log("Article:    " +hebrewWords[i]);
                         // console.log("Dictionary:    " +jsonObj[j].words[0].word );
                         // console.log("Explanation:     "+ jsonObj[j].explanation);
                         console.log("Found:" + jsonObj[j].words[0].word +"   ======>   "+ "Changing to:" + jsonObj[j].words_translation[0].word);
                //          //  console.log("****************************************" +'\n')
                //          //  var changedWord = ({ word_hebrew: jsonObj[j].word_hebrew, explanation: jsonObj[j].explanation });
                //          // // console.log(changedJson);
                //          //  changedJson[jsonObj[j].word] = changedWord ;
                //         //  console.log(changedJson);
                      }
                       else{

                //       // console.log("continue....");
                         continue;
                       }
                //     //   JSON.stringify(changedJson); 
                //     // console.log(changedJson);
                    }
                     }

            }

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