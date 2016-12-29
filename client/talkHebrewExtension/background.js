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

var wordsToreplace2;

function setClickebleFuncionToAllElements(){
    var latinWordsArray = document.getElementsByClassName('press');
    // onClick's logic below:
    console.log("number of words that was swiched" +latinWordsArray.length);
    var latinWordsAmounth=latinWordsArray.length;
    for(var i=0;i<latinWordsAmounth;i++){
        latinWordsArray[i].addEventListener('click', function () {
            console.log('clickedMe');
        });
    }
}



var user;
function  switchWords(){
    console.log("switchWords(). the user is"+user);
    var myHtml=document.body.innerHTML;
    var wordToSearch;
    var wordToSearchReg;
    var newWord;

    console.log("---------------------");
    console.log(myHtml);
    console.log("---------------------");



            var serverResponse;
            var myXMLhttpReq=new XMLHttpRequest(),
            method = "GET",
            url="https://speak-hebrew-lab-project.herokuapp.com/getUrlHebrewWords/pageUrl/oramit88@gmail.com?documentObjectModel="+myHtml;
            //to test the console.log with or amit server, change url to:
            //url="https://circlews.herokuapp.com/getAllCategories";

            //dima
            myXMLhttpReq.open(method, url, true);
            myXMLhttpReq.onreadystatechange = function() {
                console.log("on ready state change");
                if (myXMLhttpReq.readyState == XMLHttpRequest.DONE) {
                    console.log("Response is: ");
                    serverResponse=JSON.parse(myXMLhttpReq.responseText);
                    if(serverResponse.result==="ok"){
                        console.log(serverResponse.data);
                        wordsToreplace2=serverResponse.data;

                        //words from Dima from server

                         for(var i=0;i<wordsToreplace2.length;i++){
                             //console.log(i);
                             //console.log(wordsToreplace2[i].latin);
                             wordToSearch=wordsToreplace2[i].word; //the latin word
                             console.log("the latin word: "+wordToSearch);
                             wordToSearchReg = new RegExp(wordToSearch, "g");

                             newWord=wordsToreplace2[i].translation[0];//the hebrew word
                             console.log("the hebrew word: "+newWord);
                             newPage = myHtml.replace(wordToSearchReg, "<span ><b class='press' style='background-color: greenyellow'>"+newWord+"</b></span>");
                             document.body.innerHTML = newPage;
                             myHtml=newPage;
                             setClickebleFuncionToAllElements();
                         }



                        //words from ors static dictionary
                        /*
                        for(var i=0;i<wordsToreplace1.length;i++){
                            //console.log(i);

                            wordToSearch=wordsToreplace1[i].latin; //the latin word
                            console.log("the latin word: "+wordToSearch);
                            wordToSearchReg = new RegExp(wordToSearch, "g");

                            newWord=wordsToreplace1[i].hebrew;//the hebrew word
                            console.log("the hebrew word: "+newWord);
                            newPage = myHtml.replace(wordToSearchReg, "<span ><b class='press' style='background-color: greenyellow'>"+newWord+"</b></span>");
                            document.body.innerHTML = newPage;
                            myHtml=newPage;
                            setClickebleFuncionToAllElements();
                        }
                        */

                    }
                    else{
                        console.log("Error on responce");
                    }
                }
            };
            myXMLhttpReq.send();
            //dima
}




function checkConnectedUser(){
    //window.onload = function () {
            chrome.storage.local.get(["talkHebrewUser"], function(items){
                console.log("cheackConnectedUser().  user is  "+items.talkHebrewUser);
                user=items.talkHebrewUser;
                if(user==undefined){
                    console.log("the user is: "+user);
                    console.log("no user loged to the system");
                }
                else{
                    console.log("the user is: "+user);
                    if (document.readyState === 'complete') {
                        console.log("document ready!");
                        console.log("start processing..");
                        switchWords();

                    }
                    switchWords();
                }

            });
   // }
}

checkConnectedUser();
