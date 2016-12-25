exports.getTranslatableWords = function(documentObjectModel,dictionary){
    console.log("dom:");
    console.log(documentObjectModel);
    var resultData = [];
    //temporary hardcodet result for testing
    resultData.push({
        word: "קוֹנְסְפִּירַצְיָה",
        translation: ["קֶשֶׁר"],
        explanation: "קשר הוא התארגנות חשאית של אנשים במטרה למרוד בשלטון או לבצע מזימה נגד השלטון."
    });
    resultData.push({
        word: "קוֹנְפוֹרְמִיזְם",
        translation: ["הֲלִיכָה בַּתֶּלֶ","תּוֹאֲמָנוּת"],
        explanation: null
    });
    return resultData;
};