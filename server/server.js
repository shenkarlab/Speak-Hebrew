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

app.get('/getUrlHebrewWords',speakHebrewAction.getUrlHebrewWords);
app.get('/userClickedOnTranslatedWord/:word',speakHebrewAction.userClickedOnTranslatedWord);
app.get('/getStatisticsTopClickedWords/:numberOfWords',speakHebrewAction.getStatisticsTopClickedWords);
app.get('/getStatisticsTopSwitchedWords/:numberOfWords',speakHebrewAction.getStatisticsTopSwitchedWords);
app.listen(port, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});