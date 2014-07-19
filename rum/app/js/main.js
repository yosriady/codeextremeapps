var RUM = RUM || {};
RUM.Home = (function(window, document, $, _) {

    var CHART_ID = "event-chart";
    var TRACKING_URL = "https://rum.firebaseio.com/events";
    var DELAY = 100;
    var TIME_INTERVAL = 1000;

    var trackingRef = new window.Firebase(TRACKING_URL);
    var eventCount = 0;

    var init = function() {
        // setup firebase child_added listener
        trackingRef.once("value", function(oldSnap) {

            var oldTimeStamps = [];
            _.each(oldSnap.val(), function(event) {
                oldTimeStamps.push(event.time);
            });

            trackingRef.on('child_added', function(snapshot) {
                var newData = snapshot.val();
                if (_.indexOf(oldTimeStamps, newData.time) === -1) {
                    eventCount++;
                }
            });
        });
        // setup chart
        var chart = document.getElementById(CHART_ID);
        var smoothie = new SmoothieChart({grid:{fillStyle:'#4d4d4d'}});
        smoothie.streamTo(chart, DELAY);
        var timeLine = new TimeSeries();

        setInterval(function() {
            timeLine.append(new Date().getTime(), eventCount);
            eventCount = 0;
        }, TIME_INTERVAL);

        smoothie.addTimeSeries(timeLine, {lineWidth:3,strokeStyle:'#00ff00'});

    }
    var oPublic = {
        init: init
    };

    return oPublic;

})(window, document, window.jQuery, window._);
