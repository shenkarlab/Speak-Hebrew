exports.getTranslatableWords = function(documentObjectModel,dictionary){
    console.log("dom:");
    console.log(documentObjectModel);
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