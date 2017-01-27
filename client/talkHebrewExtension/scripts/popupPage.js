'use strict';
/*this js file thats connacted to the popUpPage when click on  the extension button*/

var talkUser;
var currenntUserSpan_element=document.getElementsByClassName("currentUser")[0]; //in order to show the current user in the menu
var enableAutoReplaceWordsBool;

function cheackAutoReplaceSettings(){
    console.log("cheackAutoReplaceSettings function");
    var autoSwap=document.getElementById("automaticallySwap2");

    chrome.storage.local.get(["enableAutoReplaceWords"], function(items){
        enableAutoReplaceWordsBool=items.enableAutoReplaceWords;
        if(enableAutoReplaceWordsBool==undefined){
            console.log("enableAutoReplaceWordsBool is: UNDEFINED");
            enableAutoReplaceWordsBool=true;
            chrome.storage.local.set({ "enableAutoReplaceWords": enableAutoReplaceWordsBool }, function(){});
            autoSwap.checked = true;
        }
        //updating the autoPressed button in the extension menu to look like he is pressed.
        else if(enableAutoReplaceWordsBool==true){
            console.log("enableAutoReplaceWordsBool is: TRUE");
            // autoSwap.style.backgroundColor="#2cbad0";
            // autoSwap.style.color="#ffffff";
            //autoSwap.input=innerHTML('"type="checkbox" checked"');
            autoSwap.checked = true;
        }
        else{ //button not pressed.
            console.log("enableAutoReplaceWordsBool is: FALSE");
            // autoSwap.style.backgroundColor="#ffffff";
            // autoSwap.style.color="#2cbad0";

            autoSwap.checked = false;
        }
    });
}
cheackAutoReplaceSettings();

 // document.getElementById("changeUserReq").addEventListener("click", function() {
 //     document.getElementById("popUpChangeUserForm").style.display="inline";
 //     document.getElementById("changeUserReq").style.visibility = "hidden";
 // });

//  function showCurrentUser(){
//      document.getElementById("popUpChangeUserForm").style.display = 'none';
//      document.getElementById("changeUserReq").style.visibility = "visible";
//
//      chrome.storage.local.get(["talkHebrewUser"], function(items){
//          talkUser=items.talkHebrewUser;
//          if(talkUser==undefined){
//              currenntUserSpan_element.innerHTML="לא מוגדר משתמש";
//          }
//          else {
//              currenntUserSpan_element.innerHTML="שלום: "+talkUser;
//          }
//      });
//  }
// showCurrentUser();

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

// document.getElementById("changeUser").addEventListener("click", function() {
//     var newUser=document.getElementById("newUserName").value;
//     chrome.storage.local.set({ "talkHebrewUser": newUser }, function(){
//         showCurrentUser();
//     });
// });

document.getElementById("automaticallySwap").addEventListener("click", function(){
    console.log("pressing oto replace button");
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



