/*this js file runs on the background- the main purpose is to send requast
 to the server, get the relevant words to the page, and switch them*/
console.log("back.js file EXE!");

//static local words for testing
// var wordsToreplace1=[
//     {   "latin":"ג'קוזי",
//         "hebrew":"אמבט עיסוי"
//     },
//     {   "latin":"ltn2",
//         "hebrew":"waise"
//     },
//     {   "latin":"פיגוע",
//         "hebrew":"change!!!!!"
//     },
//     {   "latin":"אימפוטנציה",
//         "hebrew":"change!!"
//     }
// ];

var userClickStatistic = null; //will hold the user pressed words statistics.

var enableAutoReplaceWordsBool //if true- replace the latin words
var pageUrl=window.location.href;

/*save the current number of words that were replaces in the locally in chrome cash
(present the numbers in extension menu= popupPge.html)*/
function updateNumberOfWordsThatAutoReplace(numOfWords){
    var totalUserAmounth;

    /*updating the numner of words that were switched on the current page*/
    console.log("the number of words in the page to save is: "+numOfWords);
    chrome.storage.local.set({ "numOfAutoReplaceWordsInPage": numOfWords }, function(){
        console.log("saved in storage. number of words is:"+numOfWords);
    });

    /*updating the totla numner of words that were switched until now*/
    chrome.storage.local.get(["totalNumberOfUserWords"], function(items){
        totalUserAmounth=items.totalNumberOfUserWords;
        if(totalUserAmounth==undefined){ //first time the user use the extension.
            totalUserAmounth=numOfWords;
            chrome.storage.local.set({ "totalNumberOfUserWords": totalUserAmounth }, function(){
                console.log("total amounth saved: "+totalUserAmounth);
            });
        }
        else{//adding the current page amount of replacements to the total user replacements number.
            totalUserAmounth+=numOfWords;
            chrome.storage.local.set({ "totalNumberOfUserWords": totalUserAmounth }, function(){
                console.log("total amounth is is:"+totalUserAmounth);
            });
        }
    });
}


/*making the current replacements words clickable, and define the relevant function*/
function setClickebleFuncionToAllElements(){
    console.log("back.js: setClickebleFuncionToAllElements");
    var latinWordsArray = document.getElementsByClassName('latinWords');
    console.log("number of words that was switched:" +((latinWordsArray.length)/2));

    var latinWordsAmounth=latinWordsArray.length;
    updateNumberOfWordsThatAutoReplace(latinWordsAmounth/2);

    var i;
    //adding event listener "click" to all the words-  to show popUp when user clicks on a word.
    for(i=0;i<latinWordsAmounth;i++){
        latinWordsArray[i].addEventListener('click', function(){
            //console.log("num of children "+this.childNodes.length);

            //show the popUp near the relevant word with translation and explanation
            this.childNodes[1].classList.toggle('show');
            //update word click statistic
            userClickOnWord(this.childNodes[1].childNodes[0].innerHTML,this.childNodes[1].childNodes[1].innerHTML);
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

    //server response variables
    var wordsToreplace2; //list of words (array) that comes from the server in order to switch them in the page.
    var serverResponse;

    //sanding request to the server in order to bring the relevant words list that fit the current page.
    var myXMLhttpReq=new XMLHttpRequest(),
    method = "GET",
    url="https://speak-hebrew-lab-project.herokuapp.com/getUrlHebrewWords?url="+pageUrl;


    myXMLhttpReq.open(method, url, true);
    myXMLhttpReq.onreadystatechange = function() {
        if (myXMLhttpReq.readyState == XMLHttpRequest.DONE) {
            //console.log(serverResponse);
            serverResponse=JSON.parse(myXMLhttpReq.responseText);
            if(serverResponse.result==="ok"){
                console.log("Response is: ");
                console.log(serverResponse.data);
                wordsToreplace2=serverResponse.data;

                var numOfWordsToSwich=wordsToreplace2.length;
                console.log("***printing the  words in the page: ***");

                //replace each one of the words in the page
                for(var i=0;i<numOfWordsToSwich;i++){

                     wordToSearch=wordsToreplace2[i].word; //the latin word
                     console.log("the latin word: "+wordToSearch);

                     //create regular expression
                     wordToSearchReg = new RegExp(wordToSearch, "g");

                     //get the hebrew word
                     hebrewWord=wordsToreplace2[i].translation[0];//the hebrew word
                     console.log("the hebrew word: "+hebrewWord);

                     //get the explanation
                     explanation=wordsToreplace2[i].explanation;
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
    chrome.storage.local.set({ "userClickStatistic": userClickStatistic }, function(){
        console.log("Statistic saved");
    });
    updateGlobalClickStatistic(latinWord);
}

function updateGlobalClickStatistic(word) {
    var myXMLhttpReq=new XMLHttpRequest(),
        method = "GET",
        url="https://speak-hebrew-lab-project.herokuapp.com/userClickedOnTranslatedWord/"+word;
    myXMLhttpReq.open(method, url, true);
    myXMLhttpReq.onreadystatechange = function() {
        if (myXMLhttpReq.readyState == XMLHttpRequest.DONE) {
            serverResponse=JSON.parse(myXMLhttpReq.responseText);
            if(serverResponse.result!=="ok"){  //error in response from the server
                console.log("Error on response");
                console.log(serverResponse);
            }
        }
    };
    myXMLhttpReq.send();
}

function loadStatisticOnStart() {
    chrome.storage.local.get(["userClickStatistic"], function(items){
        console.log("items");
        console.log(items);
        if(items.userClickStatistic === undefined){
            userClickStatistic = [];
        }
        else{
            userClickStatistic = items.userClickStatistic;
        }
    })
}



//checking if the "auto replaced words button" in the extension menu is pressed= if so- replace the words.
function cheackAutoReplaceSettings(){
    chrome.storage.local.get(["enableAutoReplaceWords"], function(items){
        enableAutoReplaceWordsBool=items.enableAutoReplaceWords;
        console.log("back.js-enableAutoReplaceWordsBool is: "+enableAutoReplaceWordsBool);
        if(enableAutoReplaceWordsBool==true){
            switchWords();
        }
    });
}

cheackAutoReplaceSettings();
loadStatisticOnStart();