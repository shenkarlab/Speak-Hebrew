exports.getTranslatableWords = function(url,dictionary){
    var jsdom = require("jsdom");

    jsdom.env(
        url,
        ["http://code.jquery.com/jquery.js"],
        function (err, window) {
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
            console.log(hebrewWords);
            console.log("-----------------------------------");
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