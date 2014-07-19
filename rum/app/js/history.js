var RUM = RUM || {};

RUM.History = (function(window, document, $, _) {

    var DATA_URL = "https://rum.firebaseio.com/events";
    var END_TIME = moment().unix();
    var START_TIME = moment().subtract('hours', 2).unix();
    var dataRef = new window.Firebase(DATA_URL);

    function drawChart() {
        dataRef.startAt(START_TIME)
        .endAt(END_TIME)
        .once('value', function(snap) {
            var events = snap.val();
            var timeLineContainer = document.getElementById('timeline');
            var scatterContainer = document.getElementById('scatter');
            var timeLineChart = new google.visualization.Timeline(timeLineContainer);
            var scatterChart = new google.visualization.ScatterChart(scatterContainer);

            var data = new google.visualization.DataTable();
            data.addColumn('number', 'Time');
            data.addColumn('number', 'Motion');
            data.addColumn('number', 'Camera');

            for (var i=0; i<json_data.length; i++) {
                if (json_data.type == "motion"){
                    data.addRow([json_data.time, 1, null])
                } else if (json_data.type == "camera"){
                    data.addRow([json_data.time, null, 1])
                }
            }
            scatterChart.draw(data, {title: 'Number of Events over Time',
                      width: 600, height: 400,
                      vAxis: {title: "Number of Events", titleTextStyle: {color: "green"}},
                      hAxis: {title: "Time", titleTextStyle: {color: "green"}}}
            );
        });
    };

    function getData(){
        dataRef.startAt(START_TIME).endAt(END_TIME).once("value", function(snapshot) {
            console.log(snapshot.val());
        });
    }

    var HISTORY = {
        init: init,
        drawChart: drawChart
    };
    return HISTORY;

})(window, document, window.jQuery, window._);
