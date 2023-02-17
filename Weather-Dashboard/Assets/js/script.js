var APIkey = "df2e9a434e3478cdfaae84165503d8aa"
var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector(".city-search");
var cityCardEl = document.querySelector("#city-card");

// hero variables
var searchedCity = document.querySelector("#searched-city");
var cityTemp = document.querySelector("#city-temp");
var cityWind = document.querySelector("#city-wind");
var cityHumidity = document.querySelector("#city-humidity");

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
                console.log(data);
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

var getForecast = function (lat, lon) {
    var forecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat="+lat+"&lon="+lon+"&units=imperial&appid=df2e9a434e3478cdfaae84165503d8aa";

    fetch(forecastUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data)
                    displayForecast(data);
                });
            }
        })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        });
};

var displayForecast = function (data) {
    console.log(data);
    cityTemp.textContent = data.list[0].main.temp;
    cityWind.textContent = data.list[0].wind.speed;
    cityHumidity.textContent = data.list[0].main.humidity;

    // empty div before appending info
    $(".forecast-container").empty();

    for(var i = 1; i < 6; i++) {
        //console.log(data.daily[i]);
        var dateDisplay = moment.unix(data.list[i].dt).format("ddd, MMM, Do");
        //console.log(dateDisplay);
        var forecastCol = $("<div>").addClass("col-2");
        var forecastCard = $("<div>").addClass("card forecast-card forecast-text");
        var cardBody = $("<div>").addClass("card-body");
        //
        var forecastDate = $("<div>")
            .attr("id", "forecast-date")
            .addClass("card-title")
            .text(dateDisplay);
        var forecastTemp = $("<p>")
            .addClass("card-text")
            .text(
                "Temp" +
                    Math.round(data.list[i].main.temp) +
                    String.fromCharCode(186) +
                    "F"
            );
        var forecastWind = $("<p>")
            .addClass("card-text")
            .text(data.list[i].wind.speed);
        var forecastHumidity = $("<p>")
            .addClass("card-text")
            .text(data.list[i].main.humidity);

        // append variables to container
        $(".forecast-container").append(
            forecastCol.append(
                forecastCard.append(
                    cardBody.append(
                        forecastDate,
                        forecastTemp,
                        forecastWind,
                        forecastHumidity,
                    )
                )
            )
        );
    }
};

// search bar
    var fromSubmitHandler = function (event) {
        event.preventDefault();
        var cityName = cityInputEl.value.trim();

        if (cityName) {
            getCityWeather(cityName);
            saveCity(cityName);
            cityInputEl.value = "";
        } else {
            alert("Please enter valid city name");
        }
    };

    var saveCity = function (cityName) {
        if (cityArr.lenth < 5) {
            cityArr.push(cityName);
            localStorage.setItem("city", cityArr);
            // create button
        var cityBtn = $("<button>")
            .addClass("btn btn-light city-btn")
            .text(cityName);
        $(".save-container").append(cityBtn);
        } else {
            console.log("function to replace cityArr[0]");
        }
    };

    // click saved city button to display city weather
    $(document).on("click", ".city-btn", function () {
        var cityText = $(this).text();
        getCityWeather(cityText);
    });

    // load last city and buttons from localStorage
    var loadCities = function () {
        // if local storage is not empty
        if (localStorage.getItem("city") !== null) {
            var retrievedCities = localStorage.getItem("city").split(".");

            for (var i = 0; i < retrievedCities.length; i++) {
                var cityName = retrievedCities[i];
                var cityBtn = $("<button>")
                    .addClass("btn btn-light city-btn")
                    .text(cityName);
                $(".save-container").append(cityBtn);
                cityArr.push(cityName);
            }
            // if local storage is empty
        } else {
            console.log("no cities saved");
        }
        console.log(cityArr);
    };

    // add limit to how many cities can be stores
    loadCities();

    userFormEl.addEventListener("submit", fromSubmitHandler);
