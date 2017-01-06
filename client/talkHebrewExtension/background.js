'use strict';
/*this js file runs on the background- the main purpose is to send requast
 to the server, get the relevant words to the page, and switch them*/
var userClickStatistic = null; //will hold the user pressed words statistics.
var enableAutoReplaceWordsBool = true; //if true- replace the latin words
var pageUrl=window.location.href;

/*save the current number of words that were replaces in the locally in chrome cash
(present the numbers in extension menu= popupPge.html)*/
function updateNumberOfWordsThatAutoReplace(numOfWords){
    var totalUserAmounth;

    /*updating the numner of words that were switched on the current page*/
    chrome.storage.local.set({ "numOfAutoReplaceWordsInPage": numOfWords }, function(){});

    /*updating the totla numner of words that were switched until now*/
    chrome.storage.local.get(["totalNumberOfUserWords"], function(items){
        totalUserAmounth=items.totalNumberOfUserWords;
        if(totalUserAmounth==undefined){ //first time the user use the extension.
            totalUserAmounth=numOfWords;
            chrome.storage.local.set({ "totalNumberOfUserWords": totalUserAmounth }, function(){});
        }
        else{//adding the current page amount of replacements to the total user replacements number.
            totalUserAmounth+=numOfWords;
            chrome.storage.local.set({ "totalNumberOfUserWords": totalUserAmounth }, function(){});
        }
    });
}

/*making the current replacements words clickable, and define the relevant function*/
function setClickebleFuncionToAllElements(){
    var latinWordsArray = document.getElementsByClassName('latinWords');
    var latinWordsAmounth=latinWordsArray.length;
    //adding event listener "click" to all the words-  to show popUp when user clicks on a word.
    for(var i=0;i<latinWordsAmounth;i++){
        latinWordsArray[i].addEventListener('click', function(){
            //show the popUp near the relevant word with translation and explanation
            this.childNodes[1].classList.toggle('show');
            //update word click statistic
            userClickOnWord(this.childNodes[1].childNodes[0].innerHTML,this.childNodes[1].childNodes[1].innerHTML);
        });
    }
}

/*the main function that switch the latin word in the html page to the relevant hebrew word*/
function  switchWords(){
    var myHtml=document.body.innerHTML; //get the current html
    var wordToSearch;   //the latin word in the page.
    var wordToSearchReg;//the latin word in the page in regular expression format.
    var hebrewWord;     //the hebrew translation of the latin word. (comes from the server who hold the dictionary).
    var explanation;    //the explanation of the word.
    //server response variables
    var wordsToReplace; //list of words (array) that comes from the server in order to switch them in the page.
    var serverResponse;
    //sanding request to the server in order to bring the relevant words list that fit the current page.
    var myXMLhttpReq=new XMLHttpRequest(),
    method = "GET",
    url="https://speak-hebrew-lab-project.herokuapp.com/getUrlHebrewWords?url="+pageUrl;
    myXMLhttpReq.open(method, url, true);
    myXMLhttpReq.onreadystatechange = function() {
        if (myXMLhttpReq.readyState == XMLHttpRequest.DONE) {
            serverResponse=JSON.parse(myXMLhttpReq.responseText);
            if(serverResponse.result==="ok"){
                wordsToReplace=serverResponse.data;
                var numOfWordsToSwitch=wordsToReplace.length;
                updateNumberOfWordsThatAutoReplace(numOfWordsToSwitch);//update local statistic
                //replace each one of the words in the page
                for(var i=0;i<numOfWordsToSwitch;i++){
                     wordToSearch=wordsToReplace[i].word; //the latin word
                     //create regular expression
                     wordToSearchReg = new RegExp(wordToSearch, "g");
                     //get the hebrew word
                     hebrewWord=wordsToReplace[i].translation[0];//the hebrew word
                     //get the explanation
                     explanation=wordsToReplace[i].explanation;
                     if(explanation==null){
                         explanation="";
                     }
                     var newPage; //the new html after the replace
                     //replacing the latin word in hebrew word- with different style.
                     newPage = myHtml.replace(wordToSearchReg, "<span class='latinWords'>"
                                                                        +"<span>"+hebrewWord+"</span>"
                                                                        +"<span class='popuptext' id='myPopup'>"
                                                                                +"<span class='latinWords'>"+hebrewWord+"</span>"
                                                                                +"<span class='hebrewWords'>"+wordToSearch+"</span>"
                                                                                +"<span class='explenation'><br>"+explanation+"</span>"
                                                                        +"</span>"
                                                                +"</span>");
                     //update the page with the new page
                     document.body.innerHTML = newPage;
                     myHtml=newPage;
                 }
                //Passing on any of the words in order that they will be clickable.
                setClickebleFuncionToAllElements();
            }
            else{ //error in response from the server
                console.log("Error on response");
                console.log(serverResponse);
            }
        }
    };
    myXMLhttpReq.send();
}

function userClickOnWord(hebrewWord,latinWord){
    //updating the statistic of the word
    var statisticArrayLength =  userClickStatistic.length;
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
            clicked:1
        });
    }
    chrome.storage.local.set({ "userClickStatistic": userClickStatistic }, function(){});
    updateGlobalClickStatistic(latinWord);
}

function updateGlobalClickStatistic(word) {
    var myXMLhttpReq=new XMLHttpRequest(),
        method = "GET",
        url="https://speak-hebrew-lab-project.herokuapp.com/userClickedOnTranslatedWord/"+word;
    myXMLhttpReq.open(method, url, true);
    myXMLhttpReq.onreadystatechange = function() {
        if (myXMLhttpReq.readyState == XMLHttpRequest.DONE) {
            var serverResponse=JSON.parse(myXMLhttpReq.responseText);
            if(serverResponse.result!=="ok"){  //error in response from the server
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
        enableAutoReplaceWordsBool=items.enableAutoReplaceWords;
        if(enableAutoReplaceWordsBool==true){
            switchWords();
        }
    });
}

checkAutoReplaceSettings();
loadStatisticOnStart();