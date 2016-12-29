/**
 * Created by orami on 12/23/2016.
 */

console.log("options.js file11");
chrome.storage.local.get(["talkHebrewUser"], function(items){
    console.log("data is "+items.talkHebrewUser);
});

document.getElementById("myButton").addEventListener("click", function(){
    var usName=document.getElementById("userName").value;
    console.log(usName);

    document.getElementById("form").style.display="none";
    //localStorage.setItem("talkHebrewUser", usName);
    chrome.storage.local.set({ "talkHebrewUser": usName }, function(){
        //  Data's been saved boys and girls, go on home
        console.log("data saved");
        chrome.storage.local.get(["talkHebrewUser"], function(items){

            console.log("data is "+items.talkHebrewUser);
        });

    });
    // var savedUser=localStorage.getItem("talkHebrewUser");
    // console.log("user is: "+savedUser);
});



