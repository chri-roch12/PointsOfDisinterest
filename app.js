var app = new Vue({
  el: '#app',
  data: {
    message: 'Points of Disinterest'
  }
})

results = new Vue({
  el: "#results",
  data: {
    items: ['hello']
  }
})

tomtom.key('xmAGh1TQiNYjuwZsDOJL4SpOjhVdWns7');
var map = tomtom.map("map");
map.zoomControl.setPosition('topright');
var unitSelector = tomtom.unitSelector.getHtmlElement(tomtom.globalUnitService);
var languageSelector = tomtom.languageSelector.getHtmlElement(tomtom.globalLocaleService, 'search');
var unitRow = document.createElement('div');
var unitLabel = document.createElement('label');
unitLabel.innerHTML = 'Unit of measurement';
unitLabel.appendChild(unitSelector);
unitRow.appendChild(unitLabel);
unitRow.className = 'input-container';
var langRow = document.createElement('div');
var langLabel = document.createElement('label');
langLabel.innerHTML = 'Search language';
langLabel.appendChild(languageSelector);
langRow.appendChild(langLabel);
langRow.className = 'input-container';
tomtom.controlPanel({
    position: 'bottomright',
    title: 'Settings',
    collapsed: true
})
    .addTo(map)
    .addContent(unitRow)
    .addContent(langRow);
// Relocating zoom buttons
map.zoomControl.setPosition('bottomleft');
// Adding the route widget
var routeOnMapView = tomtom.routeOnMap({
    // Options for the route start marker
    startMarker: {
        icon: tomtom.L.icon({
            iconUrl: 'jssdk-4/images/start.png',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    },
    // Options for the route end marker
    endMarker: {
        icon: tomtom.L.icon({
            iconUrl: 'jssdk-4/images/end.png',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }
}).addTo(map);
// Creating route inputs widget
var routeInputsInstance = tomtom.routeInputs({location: false})
    .addTo(map);
// Connecting the route inputs widget with the route widget
routeInputsInstance.on(routeInputsInstance.Events.LocationsFound, function(eventObject) {
    routeOnMapView.draw(eventObject.points);
});
routeInputsInstance.on(routeInputsInstance.Events.LocationsCleared, function(eventObject) {
    routeOnMapView.draw(eventObject.points);
});
