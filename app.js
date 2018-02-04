var app = new Vue({
  el: '#app',
  data: {
    message: 'You should not go here!'
  }
})
tomtom.key("b3ZvXNJXHCtWtPogGdS2eBkWMsXhRG6T");
var map;
var startPos;
var geoSuccess = function(position) {
  map = tomtom.map("map");
  startPos = position;
  map.setView([startPos.coords.latitude, startPos.coords.longitude], 14);

  var marker = tomtom.L.marker([startPos.coords.latitude, startPos.coords.longitude], {
    draggable: true
  }).bindPopup('Current Location').addTo(map);

  marker.on('dragend', function(e) {
    tomtom.reverseGeocode({position: e.target.getLatLng()})
    .go(function(response) {
      if (response && response.address && response.address.freeformAddress) {
        marker.setPopupContent(response.address.freeformAddress);
      } else {
        marker.setPopupContent('No results found');
      }
      marker.openPopup();
    });
  });
};
results = new Vue({
  el: "#results",
  data: {
    items: ['hello']
  }
})
navigator.geolocation.getCurrentPosition(geoSuccess);
    