'use strict';
/*this js file thats connacted to the popUpPage when click on  the extension button*/

var talkUser;
var currenntUserSpan_element=document.getElementsByClassName("currentUser")[0]; //in order to show the current user in the menu
var enableAutoReplaceWordsBool;

function cheackAutoReplaceSettings(){
    var autoSwap=document.getElementById("automaticallySwap2");

    chrome.storage.local.get(["enableAutoReplaceWords"], function(items){
        enableAutoReplaceWordsBool=items.enableAutoReplaceWords;
        if(enableAutoReplaceWordsBool==undefined){
            enableAutoReplaceWordsBool=true;
            chrome.storage.local.set({ "enableAutoReplaceWords": enableAutoReplaceWordsBool }, function(){});
            autoSwap.checked = true;
        }
        //updating the autoPressed button in the extension menu to look like he is pressed.
        else if(enableAutoReplaceWordsBool==true){
            autoSwap.checked = true;
        }
        else{ //button not pressed.
            autoSwap.checked = false;
        }
    });
}
cheackAutoReplaceSettings();

 //showing the number of words that were Replaced in the extension menu
function showNumberOfWords(){
    var numOfWords;
    chrome.storage.local.get(["numOfAutoReplaceWordsInPage"], function(items){
        if(items.numOfAutoReplaceWordsInPage === undefined){
            numOfWords = 0;
        }
        else{
            numOfWords=items.numOfAutoReplaceWordsInPage;
        }
        document.getElementById("numberOfWordsInPage").innerHTML=numOfWords+" ";
   });
    var totalAmount;
    chrome.storage.local.get(["totalNumberOfUserWords"], function(items){
        if(items.totalNumberOfUserWords === undefined){
            totalAmount=0;
        }else{
            totalAmount=items.totalNumberOfUserWords;
        }

        document.getElementById("numberOfWordsInTotal").innerHTML=totalAmount+" ";
    });
}

showNumberOfWords();

document.getElementById("automaticallySwap").addEventListener("click", function(){
    if(enableAutoReplaceWordsBool==true){
        chrome.storage.local.set({ "enableAutoReplaceWords": false }, function(){
            cheackAutoReplaceSettings()
        });
    }
    else{
        chrome.storage.local.set({ "enableAutoReplaceWords": true }, function(){
            cheackAutoReplaceSettings()
        });
    }
});

document.getElementById("turnOfOnThisPage").addEventListener("click", function(){});