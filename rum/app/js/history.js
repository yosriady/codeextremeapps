var RUM = RUM || {};

RUM.History = (function(window, document, $, _) {

    var DATA_URL = "https://rum.firebaseio.com/events";
    var END_TIME = moment().unix();
    var START_TIME = moment().subtract('hours', 2).unix();

    var dataRef = new window.Firebase(DATA_URL);


    function init() {
        window.google.load("visualization", "1", {packages:["corechart", "timeline"]});
        window.google.setOnLoadCallback(drawChart);
    };

    function drawChart() {
        dataRef.startAt(START_TIME)
        .endAt(END_TIME)
        .once('value', function(snap) {
            var events = snap.val();
            var timeLineContainer = document.getElementById('timeline');
            var scatterContainer = document.getElementById('scatter');
            var timeLineChart = new google.visualization.Timeline(timeLineContainer);
            var scatterChart = new google.visualization.ScatterChart(scatterContainer);
        });
    };

    function getData(){
        dataRef.startAt(START_TIME).endAt(END_TIME).once("value", function(snapshot) {
            console.log(snapshot.val());
        });
    }

    var HISTORY = {
        init: init
    };
    return HISTORY;

})(window, document, window.jQuery, window._);
