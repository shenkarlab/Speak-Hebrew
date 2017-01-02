'use strict';
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var speakHebrewAction = require('./controllers/speakHebrewActionsController');


app.set('port',port);
app.use('/',express.static('./public'));
app.use(function (req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("cAccess-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


/*
 @param url - url string to web site
 @param documentObjectModel (in query param)
 @param userId - user id
 @return json:
 result:"ok"/'fail',
 data:  arrya of objects
        object:
        word - string
        translation -  array of string
        explanation - string
 */
app.get('/getUrlHebrewWords',speakHebrewAction.getUrlHebrewWords);
app.get('/userClickedOnTranslatedWord/:word',speakHebrewAction.userClickedOnTranslatedWord);
app.get('/getAllUsersClickedTranslatedWords/:numberOfWords',speakHebrewAction.getAllUsersClickedTranslatedWords);
app.get('/getAllUserSwitchedTranslatedWords/:numberOfWords',speakHebrewAction.getAllUserSwitchedTranslatedWords);

app.listen(port, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});



