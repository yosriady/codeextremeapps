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
          console.log(event.graphic.attributes);
          OneMap.map.infoWindow.setTitle("Event");
          OneMap.map.infoWindow.setContent(event.graphic.attributes.content);
          OneMap.map.infoWindow.show(evt.screenPoint,OneMap.map.getInfoWindowAnchor(evt.screenPoint));
        });
    }

    function generateMarker(XY) {
        var coords = new Array();
        coords = XY.split(",")
        var xCord = coords[0]
        var yCord = coords[1]
        var iconURL = "http://i.imgur.com/RfIGKsI.gif";
        var thmSymbol = new esri.symbol.PictureMarkerSymbol(iconURL, 40, 40)
        var PointLocation = new esri.geometry.Point(xCord, yCord, new esri.SpatialReference({ wkid: 3414 }))
        var PointGraphic = new esri.Graphic(PointLocation, thmSymbol);
        return PointGraphic
    }

    function addMarker(svy, json_data){
      var marker = generateMarker(svy);
      marker.attributes = json_data;
      themeGraphicsLayer.add(marker);
    }

    function clearMarkers(){
      themeGraphicsLayer.clear();
    }

    function addNotice(alert_type, address, time){
        var notice = '<li><span><h4>' + alert_type + ' Alert</h4><p>' + address + '</p><em><i class="fa fa-clock-o"></i>' + time + '</em></span></li>';
        $(notice).appendTo("#notifications").toggle("show");
    }

    setTimeout(function(){
        setupMap();
    },1000);

    var MAP = {
        oneMap: OneMap,
        clearMarkers: clearMarkers,
        addMarker: addMarker,
        addNotice: addNotice
    }
    return MAP;

})(window, document, window.jQuery, window._);
