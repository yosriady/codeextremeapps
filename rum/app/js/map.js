var RUM = RUM || {};
RUM.Map = (function(window, document, $, _) {

    var OneMap = new GetOneMap('map','SM', {center:"28968.103,33560.969", level:3});
    var THEME_NAME = "Museum";
    var themeGraphicsLayer;

    function setupMap(){
        //add graphic layer
        themeGraphicsLayer = new esri.layers.GraphicsLayer();
        themeGraphicsLayer.id=THEME_NAME;
        OneMap.map.addLayer(themeGraphicsLayer);

        //resize info widnow
        OneMap.map.infoWindow.resize(300, 200);
        OneMap.map.infoWindow.hide();

        //set graphic onclick event
        dojo.connect(themeGraphicsLayer, "onClick", function(evt)
        {
            console.log("Clicked infowindow");
            var data = evt.graphic.attributes;
            var datetime = moment.unix(data.timestamp).format('YYYY-MM-DD HH:mm:ss');
            OneMap.map.infoWindow.setTitle(capitaliseFirstLetter(data.type) +" Event ("+ datetime +")");
            var infowindowContent;
            if (data.type == "camera"){
                var oImg=document.createElement("img");
                oImg.setAttribute('src', data["image-url"]);
                infowindowContent = oImg;
            } else {
                infowindowContent = "Value: " + data.value;
            }

            OneMap.map.infoWindow.setContent(infowindowContent);
            OneMap.map.infoWindow.show(evt.screenPoint,OneMap.map.getInfoWindowAnchor(evt.screenPoint));
        });
    }

    function capitaliseFirstLetter(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function generateMarker(XY) {
        var coords = new Array();
        coords = XY.split(",")
        var xCord = coords[0]
        var yCord = coords[1]
        var iconURL = "http://i.imgur.com/5HpJmne.png";
        var thmSymbol = new esri.symbol.PictureMarkerSymbol(iconURL, 40, 40)
        var PointLocation = new esri.geometry.Point(xCord, yCord, new esri.SpatialReference({ wkid: 3414 }))
        var PointGraphic = new esri.Graphic(PointLocation, thmSymbol);
        return PointGraphic
    }

    function addMarker(svy, json_data){
      var marker = generateMarker(svy);
      marker.attributes = json_data;
      console.log(marker);
      themeGraphicsLayer.add(marker);
    }

    function clearMarkers(){
      themeGraphicsLayer.clear();
    }

    function addNotice(alert_type, address, time){
        var notice = '<li><span><h4>' + capitaliseFirstLetter(alert_type) + ' Alert</h4><p>' + address + '</p><em><i class="fa fa-clock-o"></i> ' + time + '</em></span></li>';
        $(notice).appendTo("#notifications").toggle("show");
    }

    function addToCarousel(latlng, datetime, imageurl){
        var carousel_item = '<article class><a href="' + imageurl + '" class="image featured"><img src="' + imageurl + '" alt="" /></a><header><h3>' + datetime + '</h3></header><p>' + latlng + '</p></article>';
        $(carousel_item).appendTo(".carousel .reel").show();
    }

    setTimeout(function(){
        setupMap();
    },1000);


    var TRACKING_URL = "https://rum.firebaseio.com/events";
    var TIME_INTERVAL = 1000;
    var trackingRef = new window.Firebase(TRACKING_URL);

    function listen(){
        trackingRef.once("value", function(oldSnap) {

            var oldTimeStamps = [];
            _.each(oldSnap.val(), function(event) {
                oldTimeStamps.push(event.timestamp);
            });

            trackingRef.on('child_added', function(snapshot) {
                var newData = snapshot.val();
                if (_.indexOf(oldTimeStamps, newData.timestamp) === -1) {
                    console.log("New DATA!~");
                    console.log(newData);
                    var svy = newData.easting + "," + newData.northing;
                    var latlng = newData.lat + "," + newData.lng;
                    var datetime = moment.unix(newData.timestamp).format('YYYY-MM-DD HH:mm:ss');
                    RUM.Map.addMarker(svy, newData);
                    RUM.Map.addNotice(newData.type, latlng, datetime);

                    if (newData.type == "camera"){
                        RUM.Map.addToCarousel(latlng, datetime, newData["image-url"]);
                    }
                }
            });
        });



    }



    var MAP = {
        oneMap: OneMap,
        clearMarkers: clearMarkers,
        addMarker: addMarker,
        addNotice: addNotice,
        addToCarousel: addToCarousel,
        listen: listen
    }
    return MAP;

})(window, document, window.jQuery, window._);
