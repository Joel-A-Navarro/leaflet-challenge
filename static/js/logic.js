// create map object
var map = L.map('map').setView([31.96, 99.90], 2.5);

// add tile layer
var street = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});
street.addTo(map)

// link to GeoJSON data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

// get GeoJSON data
d3.json(queryUrl).then(function (data) {
    console.log(data);
  });

// marker size
function markerSize(mag){
    return mag * 5;
}

// marker colors based on depth
function markerColors(i) {
  return i > 50 ? '#f06b6b' :
        i > 40 ? '#f0936b' :
        i > 30 ? '#f3ba4e' :
        i > 20 ? '#f3db4c' :
        i > 10 ? '#e1f34c' :
                  '#b7f34d';
};

// marker formatting 
function marker(feature, latlng){
      let mformat = {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColors(feature.geometry.coordinates[2]),
        color: "black",
        weight: 1,
        opacity: 2,
        fillOpacity: .75
      }
      return L.circleMarker(latlng, mformat);
    };

// map legend
function Legend(map) {
      var leg = L.control({ position: "bottomright"});
      leg.onAdd = function (map) {
          var i = L.DomUtil.create("div", "legend");
          i.innerHTML += '<h3>Depth</h3>';
          i.innerHTML += '<i style="background: #b7f34d"></i><span>0 - 10</span><br>';
          i.innerHTML += '<i style="background: #e1f34c"></i><span>10 - 20</span><br>';
          i.innerHTML += '<i style="background: #f3db4c"></i><span>20 - 30</span><br>';
          i.innerHTML += '<i style="background: #f3ba4e"></i><span>30 - 40</span><br>';
          i.innerHTML += '<i style="background: #f0936b"></i><span>40 - 50</span><br>';
          i.innerHTML += '<i style="background: #f06b6b"></i><span>50+</span><br>';
          return i;
      };
    leg.addTo(map);
  };
  Legend(map);

// data call
d3.json(queryUrl).then(function(res){
    console.log(res)
  
    let quakedata = res.features
        console.log(quakedata)
        
// data loop
        quakedata.forEach(function(res2){
            L.geoJSON(res2,{
              pointToLayer: marker

// tool tip
            }).bindPopup("<br>Location: " + res2.properties.place + "<br>Magnitude: " + res2.properties.mag + "<br>Depth: " + res2.geometry.coordinates[2]).addTo(map)
          })
        });