/*this js file thats connacted to the popUpPage when click on  the extension button*/
console.log("popUpage.js");

var talkUser;
var currenntUserSpan_element=document.getElementsByClassName("currentUser")[0]; //in order to show the current user in the menu
var enableAutoReplaceWordsBool;

function cheackAutoReplaceSettings(){
    console.log("checking AutoReplaceSettings");
    var autoSwap=document.getElementById("automaticallySwap");
    chrome.storage.local.get(["enableAutoReplaceWords"], function(items){
        enableAutoReplaceWordsBool=items.enableAutoReplaceWords;
        if(enableAutoReplaceWordsBool==undefined){
            console.log("aoto isnt deined");
            enableAutoReplaceWordsBool=true;
            chrome.storage.local.set({ "enableAutoReplaceWords": enableAutoReplaceWordsBool }, function(){
                console.log("enableAutoReplaceWords set to: "+enableAutoReplaceWordsBool);
            });
        }
        //updating the autoPressed button in the extension menu to look like he is pressed.
        else if(enableAutoReplaceWordsBool==true){
            autoSwap.style.backgroundColor="#2cbad0";
            autoSwap.style.color="#ffffff";
        }
        else{ //button not pressed.
            console.log("it is false");
            autoSwap.style.backgroundColor="#ffffff";
            autoSwap.style.color="#2cbad0";

        }
    });
}
cheackAutoReplaceSettings();

 document.getElementById("changeUserReq").addEventListener("click", function() {
     document.getElementById("popUpChangeUserForm").style.display="inline"
     document.getElementById("changeUserReq").style.visibility = "hidden";
 });

 function showCureentUser(){
     document.getElementById("popUpChangeUserForm").style.display = 'none';
     document.getElementById("changeUserReq").style.visibility = "visible";

     chrome.storage.local.get(["talkHebrewUser"], function(items){
         console.log("test3: user is  "+items.talkHebrewUser);
         talkUser=items.talkHebrewUser;
         if(talkUser==undefined){
             currenntUserSpan_element.innerHTML="לא מוגדר משתמש";

         }
         else {
             currenntUserSpan_element.innerHTML="שלום: "+talkUser;
         }
     });
 }
showCureentUser();


 //showing the number of words that were Replaced in the extension menu
function showNumberOfWords(){
    var numOfWords;
    chrome.storage.local.get(["numOfAutoReplaceWordsInPage"], function(items){
        numOfWords=items.numOfAutoReplaceWordsInPage;
        console.log("test: magic number is  "+numOfWords);
        document.getElementById("numberOfWordsInPage").innerHTML=numOfWords+" ";
   });
    var totalAmounth;
    chrome.storage.local.get(["totalNumberOfUserWords"], function(items){
        totalAmounth=items.totalNumberOfUserWords;
        console.log("the total is:  "+totalAmounth);
        document.getElementById("numberOfWordsInTotal").innerHTML=totalAmounth+" ";
    });
}
showNumberOfWords();

document.getElementById("changeUser").addEventListener("click", function() {
    var newUser=document.getElementById("newUserName").value;
    console.log("got new user from form: "+newUser);
    chrome.storage.local.set({ "talkHebrewUser": newUser }, function(){
        console.log("data saved in chrome storage:"+newUser);
        showCureentUser();
    });
});

document.getElementById("automaticallySwap").addEventListener("click", function(){
    console.log("test");
    if(enableAutoReplaceWordsBool==true){
        chrome.storage.local.set({ "enableAutoReplaceWords": false }, function(){
            console.log("enableAutoReplaceWords set to: "+false);
            cheackAutoReplaceSettings()
        });
    }
    else{
        chrome.storage.local.set({ "enableAutoReplaceWords": true }, function(){
            console.log("enableAutoReplaceWords set to: "+true);
            cheackAutoReplaceSettings()
        });
    }
});

document.getElementById("turnOfOnThisPage").addEventListener("click", function(){

});



