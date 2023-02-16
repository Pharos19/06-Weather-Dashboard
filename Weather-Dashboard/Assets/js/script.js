// api key = df2e9a434e3478cdfaae84165503d8aa
var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector(".city-search");
var cityCardEl = document.querySelector("#city-card");

// hero variables
var searchedCity = document.querySelector("#searched-city");
var cityTemp = document.querySelector("#city-temp");
var cityWind = document.querySelector("#city-wind");
var cityHumidity = document.querySelector("#city-humidity");
var cityUv = document.querySelector("#city-uv");

var cityArr = [];

// API request
var getCityWeather = function (city) {
    var apiUr1 =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=df2e9a434e3478cdfaae84165503d8aa";

    fetch(apiUr1)
     .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // get lat and lon for getForecast
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                getForecast(lat,lon);
                // input city name
                searchedCity.textContent = city;
            });
        } else {
            alert("Could not find city, please try again");
        }
     })
     .catch(function (error) {
        alert("Unable to connect to OpenWeather");
     });
};

var getForecast