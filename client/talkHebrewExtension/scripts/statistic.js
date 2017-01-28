'use strict';
/**
 * Created by orami on 1/4/2017.
 */
var userClickStatistic;

window.onload = function(){
    chrome.storage.local.get(["userClickStatistic"], function(items){
        if(items.userClickStatistic === undefined){
            userClickStatistic = [];
        }
        else{
            userClickStatistic = items.userClickStatistic;
        }
        var statisticsArray =getUserClickStatistic(5);
        var statisticData = [];
        var maxNumber = 0;
        statisticsArray.forEach(function (wordInStatistic) {
            if(maxNumber < wordInStatistic.clicked){
                maxNumber =  wordInStatistic.clicked;
            }
            statisticData.push({
                y:wordInStatistic.clicked,
                indexLabel:wordInStatistic.latinWord,
                indexLabelHebrewWord:wordInStatistic.hebrewWord,
                indexLabel3:wordInStatistic.hebrewWord,
                indexLabel4Explenation:wordInStatistic.explenation,
                color:"rgba(0, 0, 0, 0)",
                lineColor:"rgba(0, 0, 0, 0)"
            })
        });
        console.log(statisticData);
        var chart = new CanvasJS.Chart("chartContainer",
            {
                backgroundColor: "#f8f9fd",
                axisX:{
                    lineThickness:0,
                    tickThickness:0,
                    valueFormatString:" "//space

                },
                axisY2:{
                    interval: Math.floor(maxNumber/10),
                    gridColor:"#2cbad0",
                    gridThickness: 1,
                    lineColor:"rgba(0, 0, 0, 0)",
                    margin: 20,
                    tickLength: 25,
                    tickColor:"rgba(0, 0, 0, 0"
                },
                toolTip:{
                    backgroundColor: "#EBF2FA"
                },
                data: [
                    {
                        indexLabelPlacement: "outside",
                        indexLabelBackgroundColor: "#f7be64",
                        indexLabelFontColor: "#ffffff",
                        markerSize: 100,
                        type: "line",
                        axisYType: "secondary",
                        toolTipContent: "<section class='toolPopUp'><span class='latinWordsInPopUp'>{y}</span> <span class='latinWordsInPopUp'>{indexLabelHebrewWord}</span><span class='hebrewWords'>{indexLabel}</span><br><section class='explenation'>{indexLabel4Explenation}</section></section>",
                        dataPoints:statisticData
                    }
                ]
            });
        chart.render();
    });
};

function getUserClickStatistic(numberOfWords) {
    var result;
    console.log(userClickStatistic);
    userClickStatistic = userClickStatistic.sort(sortJson("clicked"));
    console.log(userClickStatistic);
    if(userClickStatistic.length <=  numberOfWords){
        result = userClickStatistic;
    }
    else{
        result = [];
        var userClickStatisticLength = userClickStatistic.length;
        for(var i = 0; i < numberOfWords;i++){
            result[i] = userClickStatistic[i];
        }
    }
    return result;
}

function sortJson(prop){
    return function(objectA,objectB){
        if( objectA[prop] > objectB[prop]){
            return -1;
        }else if( objectA[prop] < objectB[prop] ){
            return 1;
        }
        return 0;
    }
}