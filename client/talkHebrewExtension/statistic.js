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
        var statisticsArray =getUserClickStatistic(3);
        var statisticData = [];
        statisticsArray.forEach(function (wordInStatistic) {
            statisticData.push({
                y:wordInStatistic.clicked,
                label:wordInStatistic.latinWord
            })
        });
        CanvasJS.addColorSet("redBars",
            [//colorSet Array- red color only according to the design
                "#e73739"
            ]);
        var chart = new CanvasJS.Chart("chartContainer",
            {
                colorSet: "redBars",
                theme: "theme4",
                title:{
                    text: "המילים הכי נפוצות"
                },
                axisX:{
                    lineThickness: 0,
                    labelFontColor: "white",
                    lineColor: "white",
                    tickLength: 0
                },
                axisY:{
                    lineThickness: 0,
                    labelFontColor: "white",
                    lineColor: "white",
                    tickLength: 0,
                    display:false
                },
                data: [
                    {
                        type:"column",
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