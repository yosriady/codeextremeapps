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
            var pieContainer = document.getElementById('pie');
            var scatterContainer = document.getElementById('scatter');
            var pieChart = new google.visualization.Timeline(pieContainer);
            var scatterChart = new google.visualization.ScatterChart(scatterContainer);

            // scatter char
            var data = new google.visualization.DataTable();
            data.addColumn('number', 'Time');
            data.addColumn('number', 'Motion');
            data.addColumn('number', 'Camera');

            for (var i=0; i<events.length; i++) {
                if (events.type == "motion"){
                    data.addRow([events.time, 1, null])
                } else if (events.type == "camera"){
                    data.addRow([events.time, null, 1])
                }
            }
            scatterChart.draw(data, {title: 'Number of Events over Time',
                      width: 600, height: 400,
                      vAxis: {title: "Number of Events", titleTextStyle: {color: "green"}},
                      hAxis: {title: "Time", titleTextStyle: {color: "green"}}}
            );

            // pie chart
            var typeCount = _.countBy(events, function(event) {
                return event.type;
            });

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
