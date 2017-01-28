'use strict';
/*this js file runs on the background- the main purpose is to send request
 to the server, get the relevant words to the page, and switch them*/
var userClickStatistic = null; //will hold the user pressed words statistics.
var enableAutoReplaceWordsBool = true; //if true- replace the latin words
var pageUrl = window.location.href;
/*save the current number of words that were replaces in the locally in chrome cash
(present the numbers in extension menu= popupPge.html)*/
var wordsToReplace; //list of words (array) that comes from the server in order to switch them in the page.
var domain = "https://speak-hebrew-lab-project.herokuapp.com";
var apiCall = "getUrlHebrewWords?url=";
/*the main function that switch the latin word in the html page to the relevant hebrew word*/
getSwitchWords();
function  getSwitchWords(){
    var serverResponse;
    //sanding request to the server in order to bring the relevant words list that fit the current page.
    var myXMLhttpReq=new XMLHttpRequest(),
        method = "GET",
        url=domain+"/"+apiCall+pageUrl;

    myXMLhttpReq.open(method, url, true);
    myXMLhttpReq.onreadystatechange = function() {
        if (myXMLhttpReq.readyState == XMLHttpRequest.DONE) {
            serverResponse = JSON.parse(myXMLhttpReq.responseText);
            if(serverResponse.result === "ok"){
                wordsToReplace = serverResponse.data;
                console.log(wordsToReplace);
            }
            else{ //error in response from the server
                console.log("Error on response");
                console.log(serverResponse);
            }
        }
    };
    myXMLhttpReq.send();
}


function updateNumberOfWordsThatAutoReplace(numOfWords){
    var totalUserAmount;
    /*updating the number of words that were switched on the current page*/
    chrome.storage.local.set({ "numOfAutoReplaceWordsInPage": numOfWords }, function(){});
    /*updating the total number of words that were switched until now*/
    chrome.storage.local.get(["totalNumberOfUserWords"], function(items){
        totalUserAmount = items.totalNumberOfUserWords;
        if(totalUserAmount === undefined){ //first time the user use the extension.
            totalUserAmount = numOfWords;
            chrome.storage.local.set({ "totalNumberOfUserWords": totalUserAmount }, function(){});
        }
        else{//adding the current page amount of replacements to the total user replacements number.
            totalUserAmount += numOfWords;
            chrome.storage.local.set({ "totalNumberOfUserWords": totalUserAmount }, function(){});
        }
    });
}

/*making the current replacements words clickable, and define the relevant function*/
function setClickebleFuncionToAllElements(){
    var latinWordsArray = document.getElementsByClassName('latinWords');
    //var latinWordsArray = document.getElementsByClassName('hebWord');
    var latinWordsAmount = latinWordsArray.length;
    //adding event listener "click" to all the words-  to show popUp when user clicks on a word.
    for(var i=0;i<latinWordsAmount;i++){
        latinWordsArray[i].addEventListener('click', function(){

            //show the popUp near the relevant word with translation and explanation
            this.childNodes[1].classList.toggle('show');


            //update word click statistic
            var hebrew=this.childNodes[1].childNodes[0].childNodes[0].innerHTML;
            var latin=this.childNodes[1].childNodes[0].childNodes[1].innerHTML;

            var explenation=this.childNodes[1].childNodes[1].childNodes[1].innerHTML;
            //console.log("hebrew issssss;"+hebrew+"latin isss:"+latin);
            //console.log("------------------------")
            //console.log("exple issss: "+explenation);
            //console.log("------------------------")
            userClickOnWord(hebrew,latin,explenation);
        });
    }
}

/*the main function that switch the latin word in the html page to the relevant hebrew word*/
function  switchWords(){
    console.log("back.js: switchWords().");
    //console.log("url is: ");
    //console.log(pageUrl);

    var myHtml=document.body.innerHTML; //get the current html

    var wordToSearch;   //the latin word in the page.
    var wordToSearchReg;//the latin word in the page in regular expression format.
    var hebrewWord;     //the hebrew translation of the latin word. (comes from the server who hold the dictionary).
    var explanation;    //the explanation of the word.

                var numOfWordsToSwich = wordsToReplace.length;
                updateNumberOfWordsThatAutoReplace(numOfWordsToSwich);
                //replace each one of the words in the page
                for(var i=0;i<numOfWordsToSwich;i++){
                    wordToSearch = wordsToReplace[i].word; //the latin word
                    //create regular expression
                    wordToSearchReg = new RegExp(wordToSearch, "g");
                    //get the hebrew word
                    hebrewWord = wordsToReplace[i].translation[0];//the hebrew word
                    //get the explanation
                    explanation = wordsToReplace[i].explanation;
                    if(explanation==null){
                        explanation="";
                    }
                    var newPage; //the new html after the replace
                    //replacing the latin word in hebrew word- with different style.
                    newPage = myHtml.replace(wordToSearchReg, "<span class='latinWords'>"
                                                                        +"<span class='hebWord'>"+hebrewWord+"</span>"
                                                                        +"<span class='popuptext' id='myPopup'>"
                                                                                +"<span class='makeBorderToPopUpHebrewAndLatinWords'>"
                                                                                    +"<span class='latinWordsInPopUp'>"+hebrewWord+"</span>"
                                                                                    +"<span class='hebrewWords'>"+wordToSearch+"</span>"
                                                                                +"</span>"
                                                                                +"<span class='explenation'><span><br></span><span>"+explanation+"</span></span>"
                                                                        +"</span>"
                                                            +"</span>");
                    //update the page with the new page
                    document.body.innerHTML = newPage;
                    myHtml = newPage;
                }
                //Passing on any of the words in order that they will be clickable.
                setClickebleFuncionToAllElements();
}


function userClickOnWord(hebrewWord,latinWord,explenation){
    console.log("hebrewWord");
    console.log(hebrewWord);
    console.log("latinWord");
    console.log(latinWord);
    console.log("explenation");
    console.log(explenation);
    if(!containNotHebrewChar(hebrewWord) && !containNotHebrewChar(latinWord)){
        var statisticArrayLength = userClickStatistic.length;
        var isFind = false;
        for(var i = 0;i < statisticArrayLength; i++){
            if(userClickStatistic[i].latinWord === latinWord){
                if(userClickStatistic[i].hebrewWord === hebrewWord){
                    isFind = true;
                    userClickStatistic[i].clicked++;
                }
            }
        }
        if(!isFind){
            userClickStatistic.push({
                latinWord:latinWord,
                hebrewWord:hebrewWord,
                explenation:explenation,
                clicked:1
            });
        }
        chrome.storage.local.set({ "userClickStatistic": userClickStatistic }, function(){});
        updateGlobalClickStatistic(latinWord);
        console.log("Add to statistic done");
    }
    else{
        console.log("Add to statistic fail");
    }
    //updating the statistic of the word

}

function updateGlobalClickStatistic(word) {
    console.log("updateGlobalClickStatistic, word is:");
    console.log(word);
    var myXMLhttpReq = new XMLHttpRequest(),
        method = "GET",
        url = "https://speak-hebrew-lab-project.herokuapp.com/userClickedOnTranslatedWord/"+word;
    myXMLhttpReq.open(method, url, true);
    myXMLhttpReq.onreadystatechange = function() {
        if (myXMLhttpReq.readyState == XMLHttpRequest.DONE) {
            var serverResponse = JSON.parse(myXMLhttpReq.responseText);
            if(serverResponse.result !== "ok"){  //error in response from the server
                console.log("Error on response:");
                console.log(serverResponse);
            }
        }
    };
    myXMLhttpReq.send();
}

function loadStatisticOnStart() {
    chrome.storage.local.get(["userClickStatistic"], function(items){
        if(items.userClickStatistic === undefined){
            userClickStatistic = [];
        }
        else{
            userClickStatistic = items.userClickStatistic;
        }
    })
}

//checking if the "auto replaced words button" in the extension menu is pressed= if so- replace the words.
function checkAutoReplaceSettings(){
    chrome.storage.local.get(["enableAutoReplaceWords"], function(items){
        enableAutoReplaceWordsBool = items.enableAutoReplaceWords;
        if(enableAutoReplaceWordsBool == true){
            console.log("enable oto replace is: TRUE");
            switchWords();
        }
        else{
            console.log("enable oto replace is FALSE. dont replace the words.");
        }
    });
}

function containNotHebrewChar(word) {
        var result = false;
        var wordLength = word.length;
        for(var i = 0; i < wordLength ; i++){
            if (!(word.charCodeAt(i) >= 0x590 && word.charCodeAt(i) <= 0x5FF)){
                if(word[i]!== " "){
                    result = true;
                    break;
                }
            }
        }
        return result;
}

document.onreadystatechange = function () {
    startMainScript();
};

function startMainScript() {
    if (document.readyState === "complete" && wordsToReplace !== undefined) {
        console.log("script start:");
        checkAutoReplaceSettings();
        loadStatisticOnStart();
    }
    else{
        setTimeout(function(){
            startMainScript()
        }, 1000);
    }
}