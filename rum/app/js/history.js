var RUM = RUM || {};
RUM.History = (function(window, document, $, _) {


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
        var DATA_URL = "https://rum.firebaseio.com/events";
        var dataRef = new window.Firebase(DATA_URL);
        var startTime = moment().subtract('2', 'hours').unix();
        var endTime = moment().unix();
        dataRef.startAt(startTime).endAt(endTime).once("value", function(snapshot) {
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
