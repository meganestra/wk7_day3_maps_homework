// -----------------------
// window.onload is the function that invokes when the browser window is loaded.  It requests and parses the countries API data and invokes the main function in this script.
// -----------------------

window.onload = function () {
    var url = 'https://restcountries.eu/rest/v1'
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function () {
        if (request.status === 200) {
            var jsonString = request.responseText;
            var countries = JSON.parse(jsonString);
            main(countries);
        };
    };
    clickButton(map);
    request.send();
};

// -----------------------
// main function takes the countries from the window.onload anonymous function as an argument and invokes the populateSelect function.  It retrieves the selected country from the local storage.
// -----------------------

var main = function (countries) {
    populateSelect(countries);
    var cached = localStorage.getItem("selectedCountry");
    var selected = countries[0];
    if(cached){
        selected = JSON.parse(cached);
        document.querySelector('#countries').selectedIndex = selected.index;
    };
    updateDisplay(selected);
    document.querySelector('#info').style.display = 'block';
};

// -----------------------
// populateSelect function also takes the countries from the window.onload anonymous function as an argument, it references a select html object in the index.html via the query selector and it creates the options to appear in this select object by iterating over the countries.  It has an event listener that, when the country in the select dropdown is changed, it invokes a function that invokes the updateDisplay function with the selected country, and it stores the selected country in the local storage.
// -----------------------

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
};

// -----------------------
// updateDisplay method take the selected country as an argument, and is invoked in the populateSelect function.  It presents additional information when a country has been selected.  It references the google map object.
// -----------------------

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
};

// -----------------------
// Map is a constructor function that takes the latLng and zoom as arguments.  It uses the google maps transacript API which is required in the index.html.  It has an addMarker function and an addInfoWindow (to the marker) function.  The map and addInfoWindow are both invoked in the updateDisplay so that they appear for a selected country.
// -----------------------

var Map = function(latLng, zoom) {
    this.googleMap = new google.maps.Map(document.getElementById('map'), {
        center: latLng,
        zoom: zoom
    });

    this.addMarker = function(latLng, title) {
        var marker = new google.maps.Marker({
            position: latLng,
            map: this.googleMap,
            title: title
        });
        return marker;
    };

    this.addInfoWindow = function(latLng, title) {
        var marker = this.addMarker(latLng, title);
        marker.addListener('click', function() {
            var infoWindow = new google.maps.InfoWindow({
                content: this.title
            });
            infoWindow.open(this.map, marker);
        });
    };
};

// -----------------------
    // add a find my country button using the user's geolocation
    // find user geolocation
    // have geolocation look up against the countries' api coordinates and if match return select the country
    // create button to access functionality
// -----------------------

var GeoLocator = function() {
    this.map = new Map({lat: 0, lng: 0}, 15);
    this.setCenter = function() {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {lat: position.coords.latitude, lng: position.coords.longitude}
            this.map.googleMap.panTo(pos);
        }.bind(this));
    };
};

function clickButton(map) {
    var button = document.getElementById('button');
    button.onclick = function() {
        var location = new GeoLocator(map)
        location.setCenter();
    };
};














