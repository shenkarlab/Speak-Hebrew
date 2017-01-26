var margin,width,height,xScale,yScale,xAxis,yAxis,svgContainer,xAxis_g;
var numberOfWords = 15;
//var apiCall = "getStatisticsTopSwitchedWords";
var domain = "https://speak-hebrew-lab-project.herokuapp.com";
var dataFromServer = null;


function buildGraphClicked(){
    document.getElementById("gclick").style.backgroundColor = "#EEC166";
    document.getElementById("gswitch").style.backgroundColor="#FFFFFF";
    var apiCall = "getStatisticsTopSwitchedWords";
    var numberArgumentName  =  "translationCount";
    getData(apiCall,numberArgumentName);
}

function buildGraphSwitched() {
    document.getElementById("gswitch").style.backgroundColor="#EEC166";
    document.getElementById("gclick").style.backgroundColor="#FFFFFF";
    var apiCall = "getStatisticsTopClickedWords";
    var numberArgumentName = "clickCount";
    getData(apiCall,numberArgumentName);
}

function getData(apiCall,numberArgumentName) {
    var wordToShowName = "word";
    var hebrewWordName = "words_translation";
    var explanationWord = "explanation";
    var myXMLhttpReq=new XMLHttpRequest(),
        method = "GET",
        url= domain+"/"+apiCall+"/"+numberOfWords;
        myXMLhttpReq.open(method, url, true);
        myXMLhttpReq.onreadystatechange = function() {
            if (myXMLhttpReq.readyState == XMLHttpRequest.DONE) {
                serverResponse = JSON.parse(myXMLhttpReq.responseText);
                if(serverResponse.result === "ok"){
                    dataFromServer = serverResponse.data;
                    dataFromServer = dataFromServer.sort(sortJson(numberArgumentName));
                    buildGraph(numberArgumentName,wordToShowName,hebrewWordName,explanationWord);
                }
                else{ //error in response from the server
                    console.log("Error on response");
                    console.log(serverResponse);
                }
            }
        };
        myXMLhttpReq.send();
}

function buildGraph(number,wordToShow,hebWord,explanationWord) {
    var graphData = [];
    var lengthOfData = dataFromServer.length;
    for(var i = 0; i < lengthOfData; i++){
      if(dataFromServer[i][explanationWord] != null){
          graphData.push({
            y:dataFromServer[i][number],
            indexLabel:dataFromServer[i][wordToShow],
            name:dataFromServer[i][hebWord],
            indexLableExp:dataFromServer[i][explanationWord],
            color:"rgba(0, 0, 0, 0)",
            lineColor:"rgba(0, 0, 0, 0)"
        });
      }
      else{
          graphData.push({
            y:dataFromServer[i][number],
            indexLabel:dataFromServer[i][wordToShow],
            name:dataFromServer[i][hebWord],
            indexLableExp:"No explanation",
            color:"rgba(0, 0, 0, 0)",
            lineColor:"rgba(0, 0, 0, 0)"
        });
      }

    }
    var chart = new CanvasJS.Chart("chartContainer",
    {
        backgroundColor: "#f8f9fd",
        
        axisX:{
        lineThickness:0,
        tickThickness:0,
        valueFormatString:" "//space

      },
        axisY2:{
        interval: 2,
        gridColor:"#2cbad0",
        gridThickness: 1,
        lineColor:"rgba(0, 0, 0, 0)",
        margin: 20,
        tickLength: 25,
        tickColor:"rgba(0, 0, 0, 0)",
        labelFontColor: "#A1CAC9"
     },
     toolTip:{ 
        backgroundColor: "#EBF2FA"
     },
      data: [
      {
       indexLabelBackgroundColor: "#f7be64",
       indexLabelFontColor: "#ffffff",
       indexLabelFontFamily: 'NarkisBlock-Regular',
       markerSize: 100,
       type: "line",
       axisYType: "secondary",
       toolTipContent: "<div class='toolPopUp'> {y}<span class='wordPopup'>{indexLabel}</span><p class='wordFont'>{name}</p><div class='wordExplanation'>{indexLableExp}</div></div>",
       dataPoints:graphData
     }

     ]
 });

    chart.render();
  }

 buildGraphClicked();


function sortJson(prop){
    return function(objectA,objectB){
        if( objectA[prop] > objectB[prop]){
            return 1;
        }else if( objectA[prop] < objectB[prop] ){
            return -1;
        }
        return 0;
    }
}