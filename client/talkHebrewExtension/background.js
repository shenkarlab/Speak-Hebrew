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
var userClickStatistic = null;

console.log("back.js file EXE!");
var enableAutoReplaceWordsBool;
var pageUrl=window.location.href;
console.log('url is'+pageUrl);





function updateNumberOfWordsThatAutoReplace(numOfWords){
    var totalUserAmounth;
    console.log("the number of words in the page to save is: "+numOfWords);
    chrome.storage.local.set({ "numOfAutoReplaceWordsInPage": numOfWords }, function(){
        console.log("saved in storage. number of words is:"+numOfWords);

    });

    chrome.storage.local.get(["totalNumberOfUserWords"], function(items){
        totalUserAmounth=items.totalNumberOfUserWords;
        if(totalUserAmounth==undefined){
            console.log("total isnt deined");
            totalUserAmounth=numOfWords;
            chrome.storage.local.set({ "totalNumberOfUserWords": totalUserAmounth }, function(){
                console.log("total amounth saved: "+totalUserAmounth);

            });

        }
        else{
            console.log("total is defined");
            totalUserAmounth+=numOfWords;
            chrome.storage.local.set({ "totalNumberOfUserWords": totalUserAmounth }, function(){
                console.log("total amounth is is:"+totalUserAmounth);

            });

        }
        //document.getElementById("numberOfWordsInPage").innerHTML=numOfWords+" ";

        // talkUser=items.talkHebrewUser;
        // if(talkUser==undefined){
        //     currenntUserSpan_element.innerHTML="לא מוגדר משתמש";
        //
        // }
        // else {
        //     currenntUserSpan_element.innerHTML="שלום: "+talkUser;
        // }
    });

}

function setClickebleFuncionToAllElements(){
    console.log("back.js: setClickebleFuncionToAllElements");
    var latinWordsArray = document.getElementsByClassName('latinWords');
    //var myPoUpArr=document.getElementsByClassName('popuptext');
    // onClick's logic below:
    console.log("number of words that was swicheddddd:" +latinWordsArray.length);
    //console.log("number of popUps:" +myPoUpArr.length);

    var latinWordsAmounth=latinWordsArray.length;
    updateNumberOfWordsThatAutoReplace(latinWordsAmounth/2);

    var i;
    for(i=0;i<latinWordsAmounth;i++){
        latinWordsArray[i].addEventListener('click', function(){
            //console.log("num of children "+this.childNodes.length);
            this.childNodes[1].classList.toggle('show');
            userClickOnWord(this.childNodes[1].childNodes[0].innerHTML,this.childNodes[1].childNodes[1].innerHTML);
        });
    }
}


var user;
function  switchWords(){
    console.log("back.js: switchWords(). the user is"+user);
    var myHtml=document.body.innerHTML; //the current html

    var wordToSearch;   //the latin word in the page.
    var wordToSearchReg;//the latin word in the page in regular expression.
    var hebrewWord;     //the hebrew translation of the latin word.
    var explanation;    //the explanation of the word..

    //server response variables
    var wordsToreplace2; //list of words that comes from the server in order to switch them in the page.
    var serverResponse;

    var myXMLhttpReq=new XMLHttpRequest(),
    method = "GET",
    url="https://speak-hebrew-lab-project.herokuapp.com/getUrlHebrewWords?url="+pageUrl;
            //url="localhost:3000/getUrlHebrewWords/pageUrl/oramit88@gmail.com?documentObjectModel="+myHtml;
            //to test the console.log with or amit server, change url to:
            //url="https://circlews.herokuapp.com/getAllCategories";
            console.log("testttttt:");
            console.log(url);
            myXMLhttpReq.open(method, url, true);
            myXMLhttpReq.onreadystatechange = function() {
                if (myXMLhttpReq.readyState == XMLHttpRequest.DONE) {
                    console.log("Response is: ");
                    console.log(serverResponse);
                    serverResponse=JSON.parse(myXMLhttpReq.responseText);
                    if(serverResponse.result==="ok"){
                        //console.log(serverResponse.data);
                         wordsToreplace2=serverResponse.data;

                         var numOfWordsToSwich=wordsToreplace2.length;
                         for(var i=0;i<numOfWordsToSwich;i++){

                             wordToSearch=wordsToreplace2[i].word; //the latin word
                             //console.log("the latin word: "+wordToSearch);

                             //create regular expression
                             wordToSearchReg = new RegExp(wordToSearch, "g");

                             //get the hebrew word
                             hebrewWord=wordsToreplace2[i].translation[0];//the hebrew word

                             //get thr explanation
                             explanation=wordsToreplace2[i].explanation;
                             if(explanation==null){
                                 explanation="";
                             }

                             var newPage; //the new html after the replace

                             //repacing the latin word in hebrew words with diffrent style and set them as clickable elements to show popUp.
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
                    else{ //error in response from the serber
                        console.log("Error on response");
                        console.log(serverResponse);
                    }
                }
            };
            myXMLhttpReq.send();
}




//not used for now
function checkConnectedUser(){
    //window.onload = function () {
            chrome.storage.local.get(["talkHebrewUser"], function(items){
                console.log("cheackConnectedUser().  user is  "+items.talkHebrewUser);
                user=items.talkHebrewUser;
                if(user==undefined){
                    console.log("the user is: "+user);
                    console.log("no user loged to the system");
                }
                else{ //user exsist
                    console.log("the user is: "+user);
                    if (document.readyState === 'complete') {
                        console.log("document ready!");
                        console.log("start processing..");
                        switchWords();
                    }
                }
            });
}

function userClickOnWord(hebrewWord,latinWord){
    console.log("userClickOnWord");
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

    chrome.storage.local.get(["userClickStatistic"], function(items){
        console.log("Statistik:");
        if(items.userClickStatistic === undefined){
            console.log("undefined");
        }
        else{
            console.log(userClickStatistic)
        }
    });
    getUserClickStatistic(2);
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

function getUserClickStatistic(numberOfWords) {
    var result;
    userClickStatistic = sortByKey(userClickStatistic);
    if(userClickStatistic.length <=  numberOfWords){
        result = userClickStatistic;
    }
    else{
        result = [];
        var userClickStatisticLength = userClickStatistic.length;
        for(var i = 0; i < numberOfWords;i++){
            result[i] = userClickStatistic[userClickStatisticLength - i - 1];
        }
    }
    console.log("result:");
    console.log(result);
    return result;
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function cheackAutoReplaceSettings(){
    console.log("back.js checking AutoReplaceSettings");
    chrome.storage.local.get(["enableAutoReplaceWords"], function(items){
        enableAutoReplaceWordsBool=items.enableAutoReplaceWords;
        console.log("back.js-enableAutoReplaceWordsBool is: "+enableAutoReplaceWordsBool);
        if(enableAutoReplaceWordsBool==true){
            //if (document.readyState === 'complete') {
                console.log("document ready!");
                console.log("start processing..");
                switchWords();
            //}
        }
    });
}
cheackAutoReplaceSettings();
loadStatisticOnStart();
