/**
 * Created by orami on 1/4/2017.
 */
console.log("statistic.js");

//static array for testing
var statArr=[
    {
        latinWord:"ג'קוזי",
        hebrewWord:"אמבט עיסוי",
        clicked:4
    },
    {
        latinWord:"זיגזג",
        hebrewWord:"סכסך",
        clicked:8
    },
    {
        latinWord:"מגזין",
        hebrewWord:"עיתון",
        clicked:3
    },
];



window.onload = function () {
    CanvasJS.addColorSet("redBars",
        [//colorSet Array- red color only according to the design
            "#e73739",
        ]);
    var chart = new CanvasJS.Chart("chartContainer",
        {
            colorSet: "redBars",
            theme: "theme4",
            title:{
                text: "שלושת המילים הכי נפוצות"
            },
            axisX:{
                lineThickness: 0,
                labelFontColor: "white",
                lineColor: "white",
                tickLength: 0,
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
                    dataPoints: [
                        {  y: 4,  label: statArr[0].latinWord},
                        {  y: 8,  label: statArr[1].latinWord},
                        {  y: 3,  label: statArr[2].latinWord}

                    ]
                }
            ]
        });
    chart.render();
}
