var margin,width,height,xScale,yScale,xAxis,yAxis,svgContainer;
var numberOfWords = 15;
var apiCall = "getStatisticsTopSwitchedWords";
var domain = "https://speak-hebrew-lab-project.herokuapp.com";
var data = null;

function  getData() {
    var myXMLhttpReq=new XMLHttpRequest(),
        method = "GET",
        url= domain+"/"+apiCall+"/"+numberOfWords;
        myXMLhttpReq.open(method, url, true);
        myXMLhttpReq.onreadystatechange = function() {
            if (myXMLhttpReq.readyState == XMLHttpRequest.DONE) {
                serverResponse = JSON.parse(myXMLhttpReq.responseText);
                if(serverResponse.result === "ok"){
                    data = serverResponse.data;
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
     margin = {top:10, right:10, bottom:90, left:10};

     width = 960 - margin.left - margin.right;

     height = 500 - margin.top - margin.bottom;

     xScale = d3.scale.ordinal().rangeRoundBands([0, width], .03);

     yScale = d3.scale.linear()
        .range([height, 0]);

     xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

     yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

     svgContainer = d3.select("#chartID").append("svg")
        .attr("width", width+margin.left + margin.right)
        .attr("height",height+margin.top + margin.bottom)
        .append("g").attr("class", "container")
        .attr("transform", "translate("+ margin.left +","+ margin.top +")");

    xScale.domain(data.map(function(d) { return d[wordToShow]; }));
    yScale.domain([0, d3.max(data, function(d) { return d[number]; })]);

    var xAxis_g = svgContainer.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(xAxis)
        .selectAll("text");

    svgContainer.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d[wordToShow]); })
        .attr("width", xScale.rangeBand())
        .attr("y", function(d) { return yScale(d[number]); })
        .attr("height", function(d) { return height - yScale(d[number]); });

    // Controls the text labels at the top of each bar.
    svgContainer.selectAll(".text")
        .data(data)
        .enter()
        .append("text")
        .attr("class","label")
        .attr("x", (function(d) { return xScale(d[wordToShow]) + xScale.rangeBand() / 2 ; }  ))
        .attr("y", function(d) { return yScale(d[number]) + 1; })
        .attr("dy", ".75em")
        .text(function(d) { return d[wordToShow]; });

    var ticks = document.getElementsByClassName("tick");
    var ticksNumber = ticks.length;
    for(var i = 0; i < ticksNumber;i++){
        ticks[i].removeChild(ticks[i].lastChild);
    }
}

getData();
