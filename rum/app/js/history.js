var RUM = RUM || {};
RUM.History = (function(window, document, $, _) {

    var DATA_URL = "https://rum.firebaseio.com/events";
    var TIME_INTERVAL = 1000;
    var dataRef = new window.Firebase(DATA_URL);

    function init(){
        // TODO
    }

    function search(){
        // TODO
        // Gaoxiang, For filtering, see https://www.firebase.com/docs/queries.html
        // And, https://www.firebase.com/blog/2013-10-01-queries-part-one.html
        // Finally, https://www.firebase.com/blog/2014-01-02-queries-part-two.html
    }

    function getData(){
        dataRef.on("value", function(snapshot) {
            console.log(snapshot.val());
        });
    }

    var HISTORY = {
        init: init,
        search: search,
        getData: getData
    }
    return HISTORY;

})(window, document, window.jQuery, window._);
