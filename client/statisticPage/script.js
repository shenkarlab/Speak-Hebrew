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
            color:"rgba(0, 0, 0, 0)"
        });
    }
    var chart = new CanvasJS.Chart("chartContainer",
    {
        axisX:{
        lineThickness:0,
        tickThickness:0,
        valueFormatString:" ",//space
      },
        axisY2:{
        interval: 2,
        margin: 60,
     },
      data: [
      {
       indexLabelPlacement: "outside",
       indexLabelBackgroundColor: "yellow",
       indexLabelFontColor: "red",
       type: "line",
       lineColor: "rgba(0, 0, 0, 0)",
       axisYType: "secondary",
       dataPoints:graphData
     }

     ]
 });

    chart.render();
  }

getData();
