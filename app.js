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
var routeInputsInstance = tomtom.routeInputs({location: tomtom.routeInputs.Location.Start})
    .addTo(map);
// Connecting the route inputs widget with the route widget
routeInputsInstance.on(routeInputsInstance.Events.LocationsFound, function(eventObject) {
    routeOnMapView.draw(eventObject.points);
});
routeInputsInstance.on(routeInputsInstance.Events.LocationsCleared, function(eventObject) {
    routeOnMapView.draw(eventObject.points);
});
var results = new Vue({
  el: "#results",
  data: {
    items: []
  },
  methods: {
    addRoute : function(e){
      for(let i=0; i < $('#results li').length; i++){
        if(e.srcElement.parentElement == $('#results li')[i]){
          addPoint(i);
        }
      }
    }
  }
});

function appendResults(response) {
  results.items = [];
  for (let place of response.results) {
    let name = place.poi.name;
    let address = place.address.freeformAddress;
    let url = place.poi.url || 'default_url';
    let category = place.poi.categories[0];
    let position = place.position
    let item = {
      'name': name,
      'address': address,
      'url' : url,
      'category' : category,
      'position' : position,
      'id' : place.id
    }
    results.items.push(item)
  }
};

var search = new Vue({
  el: "#search",
  methods: {
    searchPOI : function(e){
      e.preventDefault();
      if (!routeInputsInstance.searchBoxes[0].input.value) {
        return alert("Please enter a start point and destination");
      }
      tomtom.alongRouteSearch({
        limit: 20,
        maxDetourTime: 120,
        query: 'food',
        route: [
          {
            "lat": routeInputsInstance.searchBoxes[0].selectedLocation.lat,
            "lon":routeInputsInstance.searchBoxes[0].selectedLocation.lon
          },
          {
            "lat": routeInputsInstance.searchBoxes[1].selectedLocation.lat,
            "lon": routeInputsInstance.searchBoxes[1].selectedLocation.lon
          },
          [routeInputsInstance.searchBoxes[0].selectedLocation.lat, routeInputsInstance.searchBoxes[0].selectedLocation.lon],
          [routeInputsInstance.searchBoxes[1].selectedLocation.lat, routeInputsInstance.searchBoxes[1].selectedLocation.lon]
        ]
      }).go().then(appendResults);
    }
  }
});

addPoint = function(index){

  routeInputsInstance.addInput()
  let box = routeInputsInstance.searchBoxes[routeInputsInstance.searchBoxes.length - 2]

  let resultData = {
    address: {freeformAddress: results.items[index].address},
    poi: { name: results.items[index].name }
  }
  box.setResultData(resultData);
  box.selectedLocation = results.items[index].position
  locations = []
  for (let box of routeInputsInstance.searchBoxes) {
    locations.push(box.selectedLocation)
  }
  routeOnMapView.draw(locations)
}