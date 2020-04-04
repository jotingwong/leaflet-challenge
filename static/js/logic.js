// Author: JoTing Wong 
// Note: Worked together with David Johnston 

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    console.log(data.features);
});

// Define streetmap and darkmap layers
// Streetmap layer
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
});
// Darkmap Layer 
// var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.dark",
//     accessToken: API_KEY
// });
  
// Create the map and load the streetmap layer
var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
});
 streetmap.addTo(myMap);


// Perform a GET request to the query URL
d3.json(queryUrl, function(earthquakeData) {

  // set up plot style
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: .5,
      fillColor: circleColor(feature.properties.mag),
      color: "black",
      radius: markerSize(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // set up marker size
  function markerSize(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 3;
  }
  // set up color for different magnitude
  function circleColor(magnitude) {
    if (magnitude <= 1) {
      return "#DEEDCF"
    }
    else if (magnitude <= 2) {
      return "#74C67A"
    }
    else if (magnitude <= 3) {
      return "#39A96B"
    }
    else if (magnitude <= 4) {
      return "#1D9A6C"
    }
    else if (magnitude <= 5) {
      return "#137177"
    }
    else {
      return "#0A2F51"
    }
  }
// plot the map
  L.geoJson(earthquakeData, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using the styleInfo function.
    style: styleInfo,
    // Give each feature a popup describing the place and time of the earthquake
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "<h3>" +
          feature.properties.place +
          "</h3><hr><p>" +
          new Date(feature.properties.time) +
          "</p>" +
          "</h3><hr><p>" +
          ("Magnitude " + feature.properties.mag) +
          "</p>" +
          "</h3><hr><p>" +
          ("Alert " + feature.properties.alert) +
          "</p>"
      );
    }
  }).addTo(myMap);


// set up legend
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function(){
      var div = L.DomUtil.create('div', 'info legend'),
          limit = [0, 1, 2, 3, 4, 5],
          labels = [];
  
      // loop through our density intervals and generate a label for each interval
      for (var i = 0; i < limit.length; i++) {
          div.innerHTML +=
              '<i style="background:' + circleColor(limit[i] + 1) + '"></i> ' +
              limit[i] + (limit[i + 1] ? '&ndash;' + limit[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  legend.addTo(myMap);

})


