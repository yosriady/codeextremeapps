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

    function generatePointGraphic(XY) {
        var ICON_PATH = "http://t1.onemap.sg/icons/MUSEUM/"
        var ICON_NAME = "mr.gif"
        var coords = new Array();
        coords = XY.split(",")
        var xCord = coords[0]
        var yCord = coords[1]
        var iconURL = ICON_PATH + ICON_NAME
        if (iconURL != "") {
            iconURL = iconURL.replace("www.onemap.sg", "www.onemap.sg")
            var thmSymbol = new esri.symbol.PictureMarkerSymbol(iconURL, 20, 20)
        }
        var PointLocation = new esri.geometry.Point(xCord, yCord, new esri.SpatialReference({ wkid: 3414 }))
        var PointGraphic = new esri.Graphic(PointLocation, thmSymbol);
        return PointGraphic
    }

    function addMarker(svy, json_data){
      var marker = generatePointGraphic(svy);
      marker.attributes = json_data;
      themeGraphicsLayer.add(marker);
    }

    function clearMarkers(){
      themeGraphicsLayer.clear();
    }

    setTimeout(function(){
        setupMap();
    },1000);

    var MAP = {
        oneMap: OneMap,
        clearMarkers: clearMarkers,
        addMarker: addMarker
    }
    return MAP;

})(window, document, window.jQuery, window._);
