
// create a map and add functionality to it
// when a country is selected, center the map on the country co-ords
// when a country is selected, show a marker on the country
// add a info window to the marker and show the country stats
// add a find my country button using the user's geolocation
    // find user geolocation
    // have geolocation look up against the countries' api coordinates and if match return select the country
    // create button to access functionality

// --------------------------------------------------------------------------------------------


window.onload = function () {
    var url = 'https://restcountries.eu/rest/v1'
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function () {
        if (request.status === 200) {
            var jsonString = request.responseText;
            var countries = JSON.parse(jsonString);
            main(countries);
        }
    }
    request.send();
};

function handleClick() {
    var button = document.getElementById('button');
    button.onclick = function(){
        var location = new GeoLocator(map);
        location.setCenter;
    }
}

var Map = function( latLng, zoom ) {
  this.googleMap = new google.maps.Map(document.getElementById('map'), {
    center: latLng,
    zoom: zoom
});

  this.addMarker = function( latLng, title) {
    var marker = new google.maps.Marker({
        position: latLng,
        map: this.googleMap,
        title: title
    })
    return marker
}

this.addInfoWindow = function( latLng, title ) {
    var marker = this.addMarker(latLng, title);
    marker.addListener('click', function() {
        var infoWindow = new google.maps.InfoWindow({
            content: this.title
        })
        infoWindow.open(this.map, marker);
    })

}

var GeoLocator = function(map) {
  this.map = map;
  this.setCenter = function() {
    navigator.geolocation.getCurrentPosition(function(position){
      var pos = {lat: position.coords.latitude, lng: position.coords.longitude}
      this.map.googleMap.panTo(pos)
  }.bind(this))
    return pos;
}
}

var main = function (countries) {
    populateSelect(countries);
    var cached = localStorage.getItem("selectedCountry");
    var selected = countries[0];
    if(cached){
        selected = JSON.parse(cached);
        document.querySelector('#countries').selectedIndex = selected.index;
    }
    updateDisplay(selected);
    document.querySelector('#info').style.display = 'block';
}

var populateSelect = function (countries) {
    var parent = document.querySelector('#countries');
    countries.forEach(function (item, index) {
        item.index = index;
        var option = document.createElement("option");
        option.value = index.toString();
        option.text = item.name;
        parent.appendChild(option);
    });
    parent.style.display = 'block';
    parent.addEventListener('change', function (e) {
        var index = this.value;
        var country = countries[index];
        updateDisplay(country);
        localStorage.setItem("selectedCountry",JSON.stringify(country));
    });
}

var updateDisplay = function (country) {
    var tags = document.querySelectorAll('#info p');
    tags[0].innerText = country.name;
    tags[1].innerText = country.population;
    tags[2].innerText = country.capital;
    var countryLat = country.latlng[0];
    var countryLng = country.latlng[1];
    var center = {lat: countryLat, lng: countryLng}
    var map = new Map(center, 8);
    // map.addMarker(center, country.name);
    var contentString = "<p>" + "Country: " + country.name + "</p>" + "<p>" + "Population: " + country.population + "</p>" + "<p>" + "Capital city: " + country.capital + "</p>";
    map.addInfoWindow(center, contentString );
}



