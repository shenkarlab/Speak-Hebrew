var margin,width,height,xScale,yScale,xAxis,yAxis,svgContainer,xAxis_g;
var numberOfWords = 15;
var apiCall = "getStatisticsTopSwitchedWords";
var domain = "https://speak-hebrew-lab-project.herokuapp.com";
var dataFromServer = null;

function  getData() {
    var myXMLhttpReq=new XMLHttpRequest(),
        method = "GET",
        url= domain+"/"+apiCall+"/"+numberOfWords;
        myXMLhttpReq.open(method, url, true);
        myXMLhttpReq.onreadystatechange = function() {
            if (myXMLhttpReq.readyState == XMLHttpRequest.DONE) {
                serverResponse = JSON.parse(myXMLhttpReq.responseText);
                if(serverResponse.result === "ok"){
                    dataFromServer = serverResponse.data;
                    dataFromServer = dataFromServer.sort(sortJson("translationCount"));
                    buildGraph("translationCount","word");
                }
                else{ //error in response from the server
                    console.log("Error on response");
                    console.log(serverResponse);
                }
            }
        };
        myXMLhttpReq.send();
}

function buildGraph(number,wordToShow) {
    var graphData = [];
    var lengthOfData = dataFromServer.length;
    for(var i = 0; i < lengthOfData; i++){
        graphData.push({
            y:dataFromServer[i][number],
            indexLabel:dataFromServer[i][wordToShow],
            color:"rgba(0, 0, 0, 0)",
            lineColor:"rgba(0, 0, 0, 0)"
        });
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
        lineColor:"#f7be64",
        tickLength: 0,
     },
      data: [
      {
       indexLabelPlacement: "outside",
       indexLabelBackgroundColor: "#f7be64",
       indexLabelFontColor: "#ffffff",
       markerSize: 100,
       type: "line",
       axisYType: "secondary",
       dataPoints:graphData
     }

     ]
 });

    chart.render();
  }

getData();


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