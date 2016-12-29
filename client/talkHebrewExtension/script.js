/**
 * Created by orami on 12/14/2016.
 */
console.log("script.js file exeute");
//console.log(document);

var wordsToreplace=[
    {   "latin":"ג'קוזי",
        "hebrew":"אמבט עיסוי"
    },
    {   "latin":"ltn2",
        "hebrew":"waise"
    },
    {   "latin":"ארדן",
        "hebrew":"change!!!!!"
    },
    {   "latin":"latino",
        "hebrew":"change!!"
    }
];

function  switchWords(){
    console.log("switchWords function");
    var myHtml=document.body.innerHTML;
    var wordToSearch;
    var wordToSearchReg;
    var newWord;
    var pos;

    //console.log(wordsToreplace);
    //console.log(wordsToreplace.length);
    for(var i=0;i<wordsToreplace.length;i++){
        //console.log(i);
        //console.log(wordsToreplace[i].latin);
        wordToSearch=wordsToreplace[i].latin;
        wordToSearchReg = new RegExp(wordToSearch, "g");

        newWord=wordsToreplace[i].hebrew;
        //console.log("test:"+newWord);
        pos = myHtml.replace(wordToSearchReg, "<b style='background-color: greenyellow'>"+newWord+"</b>");
        document.body.innerHTML = pos;
        myHtml=pos;
    }

}

window.onload=function () {
    //var docBody = document.getElementsByTagName("BODY")[0];
    //console.log("element's text: " + docBody.innerHTML);
    var myExtensionSection=document.createElement("section");
    myExtensionSection.style.width="100px";
    myExtensionSection.style.height="100px";
    myExtensionSection.style.backgroundColor= " #d6d6c2";

    //document.body.appendChild(myExtensionSection);


    var myBtb=document.createElement("button");
    var myBtbText = document.createTextNode("CLICK ME");
    myBtb.appendChild(myBtbText);
    myBtb.onclick=function(){
        switchWords();
    };
    myExtensionSection.appendChild(myBtb);
    document.body.appendChild(myExtensionSection);


};