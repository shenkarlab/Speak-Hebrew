/**
 * Created by orami on 12/25/2016.
 */
var talkUser;
var currenntUserP_element=document.getElementsByClassName("currentUser")[0];
console.log("kermit1");

 document.getElementById("changeUserReq").addEventListener("click", function() {
     document.getElementById("popUpChangeUserForm").style.visibility = "visible";
     document.getElementById("changeUserReq").style.visibility = "hidden";
 });


 function showCureentUser(){
     document.getElementById("popUpChangeUserForm").style.visibility = 'hidden';
     document.getElementById("changeUserReq").style.visibility = "visible";
     chrome.storage.local.get(["talkHebrewUser"], function(items){
         console.log("kermit22");
         console.log("test3: user is  "+items.talkHebrewUser);
         talkUser=items.talkHebrewUser;
         if(talkUser==undefined){
             currenntUserP_element.innerHTML="current user undefined";

         }
         else {
             currenntUserP_element.innerHTML="loged user: "+talkUser;
         }

     });
 }
showCureentUser();



var newUser;
document.getElementById("changeUser").addEventListener("click", function() {
    var newUser=document.getElementById("newUserName").value;
    console.log("got new user from form: "+newUser);
    chrome.storage.local.set({ "talkHebrewUser": newUser }, function(){
        console.log("data saved in chrome storage:"+newUser);
        showCureentUser();

    });
});


//document.getElementsByClassName("currentUser")[0].innerHTML="OMG";