var Openstreet = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 16,
    attribution: "© OpenStreetMap"
});

var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var basemaps = {
    "Open Streets": Openstreet,
    "Satellite": satellite
};

var map = L.map('map', {
    layers: [Openstreet]
}).setView([54.5, -4], 6);

var cities = L.markerClusterGroup({
    polygonOptions: {
        fillColor: '#fff',
        color: '#000',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.5
    }
}).addTo(map);

var weather = L.markerClusterGroup({
    polygonOptions: {
        fillColor: '#fff',
        color: '#000',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.5
    }
});

var overlays = {
    "Cities": cities,
    "Weather": weather
};

var layerControl = L.control.layers(basemaps, overlays, {
    position: 'topright'
}).addTo(map);

const cityIcon = L.ExtraMarkers.icon({
    icon: 'fa-building',
    markerColor: 'blue',
    shape: 'circle',
    prefix: 'fa'
});

const weatherIcon = L.ExtraMarkers.icon({
    icon: 'fa-cloud',
    markerColor: 'cyan',
    shape: 'circle',
    prefix: 'fa'
});

L.easyButton('<i class="fa fa-info fa-xl" aria-hidden="true"></i>', function() {
    $("#countryModal").modal("show");
}).addTo(map);

L.easyButton('<i class="fa fa-thermometer-full fa-xl" aria-hidden="true"></i>', function() {
    $("#weatherModal").modal("show");
}).addTo(map);

L.easyButton('<i class="fa-solid fa-xl fa-arrow-right-arrow-left"></i>', function() {
    $("#currencyDataModal").modal("show");
}).addTo(map);

L.easyButton('<i class="fa-solid fa-xl fa-newspaper"></i>', function() {
    $("#newsModal").modal("show");
}).addTo(map);

L.easyButton('<i class="fa-solid fa-xl fa-futbol"></i>', function() {
    $("#sportsDataModal").modal("show");
}).addTo(map);

L.easyButton('<i class="fa-brands fa-xl fa-wikipedia-w"></i>', function() {
    $("#wikiModal").modal("show");
}).addTo(map);

$(window).on("load", function() {
    if ($("#loader").length) {
        $("#loader")
            .delay(2000)
            .fadeOut("slow", function() {
                $(this).remove();
            });
    }
});

let chosenValue;

$(document).ready(function() {
    // Initialize the map
    // Function to remove existing borders
    const removeBordersAndMarkers = () => {
        // Remove GeoJSON layers (borders)
        map.eachLayer((layer) => {
            if (layer instanceof L.GeoJSON) {
                map.removeLayer(layer);
            }
        });
        cities.clearLayers();
        weather.clearLayers();
    };

    // Function to fetch and populate select field with countries
    const selectCountries = () => {
        return $.ajax({
            url: "php/selectCountries.php",
            type: "GET",
            dataType: "json"
        });
    };


    // Populate country select field
    selectCountries().done((result) => {
        var countries = result.data;
        typeof countries;
        if (result && result.data) {
            var selectField = $("#selectCountries");
            result.data.forEach(country => {
                selectField.append($("<option></option>")
                    .text(country.name)
                    .attr("value", country.code));
            });
        } else {
            console.error("Invalid or empty data");
        }
    });

    // Function to get and display country border
    const getCountryBorder = (countryCode) => {
        removeBordersAndMarkers();

        $.ajax({
            url: "php/getCountryBorder.php",
            type: "GET",
            data: {
                countryCode: countryCode
            },
            dataType: "json",
            success: function(result) {
                if (result && result.data) {
                    let border = L.geoJSON(result.data, {
                        color: "#0489B1",
                        weight: 5,
                        opacity: 0.65
                    }).addTo(map);
                    map.fitBounds(border.getBounds());
                } else {
                    console.error("Invalid or missing data structure in the response.");
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX request failed:", status, error);
            }
        });

        const getCities = (countryCode) => {
            return $.ajax({
                url: "php/getCities.php",
                type: "GET",
                dataType: "json",
                data: {
                    countryCode
                }
            });
        };
        getCities(countryCode).done((result) => {
            // console.log("Cities data for " + countryCode, result.data);
            if (result.data && Array.isArray(result.data)) {
                cities.clearLayers(); // Clear existing city markers
                result.data.forEach(element => {
                    if (element.lat && element.lng) {
                        let cityMarker = L.marker([element.lat, element.lng], {
                            icon: cityIcon
                        });
                        let popupContent = `<strong>${element.name}</strong><br>`;
                        // popupContent += `${element.adminName1}<br>`;
                        // popupContent += `${element.countryName}<br>`;
                        popupContent += `<em>(${element.population.toLocaleString()})</em>`;
                        cityMarker.bindPopup(popupContent);
                        cities.addLayer(cityMarker);
                    }
                });
            } else {
                console.error('No cities data available or invalid data structure');
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching cities:', textStatus, errorThrown);
        });
    }

    const getLocalNews = (countryCode) => {
        $.ajax({
            type: "GET",
            url: "php/getLocalNews.php",
            data: {
                countryCode
            }, 
            dataType: "json",
            success: function(response) {
                // console.log("Response Data:", response); // Log the response data
                if (response && response.data && response.data.results) {
                    displayNews(response.data.results);
                } else {
                    console.log('No news data available or invalid data structure');
                }
            },
            error: function(xhr, status, error) {
                console.error("Error fetching data: ", error);
            }
        });
    };
    const displayedHeadlines = new Set();

    const displayNews = (newsData) => {
        const newsContainer = $('#news-content');
        newsContainer.empty();

        if (newsData.length === 0) {
            newsContainer.append('<p>No news available for this country.</p>');
            return;
        }

        let uniqueHeadlinesCount = 0;
        for (let i = 0; i < newsData.length && uniqueHeadlinesCount < 5; i++) {
            const newsItem = newsData[i];
            const title = newsItem.title;
            const link = newsItem.link;
            const imageUrl = newsItem.image_url || 'css/images/news.png'; // Use a default image if none is provided

            // Check if the headline has already been displayed
            if (!displayedHeadlines.has(title)) {
                displayedHeadlines.add(title); // Add the headline to the set
                uniqueHeadlinesCount++; // Increment the count of unique headlines

                const newsElement = `
                    <div class="news-item mb-3">
                        <div class="d-flex align-items-center">
                            <img src="${imageUrl}" alt="News Image" class="img-fluid rounded me-3" style="max-width: 100px; height: auto;">
                            <div>
                                <h5 class="news-title">${title}</h5>
                                <a href="${link}" target="_blank" class="stretched-link">Read more</a>
                            </div>
                        </div>
                    </div>
                `;
                newsContainer.append(newsElement);
            }
        }
    };



    function mapCountryForAPI(countryName) {
        if (countryName === "United Kingdom") {
            return "England";
        } else {
            return countryName;
        }
    }

    // Event handler for country selection
    $('#selectCountries').on('change', function() {
        var chosenValue = $(this).val();
        getLocalNews(chosenValue);
        getCountryBorder(chosenValue);
        getCountryData(chosenValue);
        getCountryName(chosenValue).then(selectCountryName => {
            fetchWikiData(selectCountryName);
            getSportData(mapCountryForAPI(selectCountryName));
        }).catch(error => {
            console.error(error);
        });
        $('#conversionResult').html('');
    });

    const populateWikiModal = (data) => {
        let summaryText = data.summary.split(' ').slice(0, 100).join(' ') + '...';

        $('#wikiModalTitle').text(data.title);
        $('#wikiThumbnail').attr('src', data.thumbnailImg);
        $('#wikiSummary').text(summaryText);
        $('#wikiLink').attr('href', 'https://' + data.wikipediaUrl);
    }

    // Geolocation to set map view and fetch Wikipedia data
    const fetchWikiData = (selectCountryName) => {
        $.ajax({
            url: "php/wikiResults.php",
            type: 'POST',
            dataType: 'json',
            data: {
                selectCountryName: selectCountryName,
            },
            success: function(result) {
                $('#results').html('');
                //   console.log(JSON.stringify(result));
                //     console.log();

                if (result && result.data && result.data.geonames && result.data.geonames.length > 0) {
                    populateWikiModal(result.data.geonames[0]);
                    // Find the entry for the United Kingdom as another option often shows
                    const ukEntry = result.data.geonames.find(entry => entry.countryCode === "GB" && entry.feature === "country");
                    if (ukEntry) {
                        populateWikiModal(ukEntry);
                    } else {
                        // console.log('No data available for United Kingdom.');
                    }

                } else {
                    // console.log('No data available for this country.');
                }

            }
        })
    };
    const getCountryName = (code) => {
        return new Promise((resolve, reject) => {
            fetch('json/countryCodes.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const countryName = data[code];
                    if (countryName) {
                        resolve(countryName); // Resolve with the country name
                    } else {
                        reject(`Country code ${code} not found.`); // Reject if code not found
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    reject(`Error: ${error}`); // Reject on fetch error
                });
        });
    };


    const populateModal = (data) => {
        if (data) {
            $('#teamName').text(data.strTeam || 'N/A');
            $('#teamFormedYear').text(data.intFormedYear || 'N/A');
            $('#teamStadium').text(data.strStadium || 'N/A');
            $('#teamKeywords').text(data.strKeywords || 'N/A');
            $('#teamDescription').text(data.strDescriptionEN || 'N/A');

            // Check if there's an image URL, and if not, display a default image
            if (data.strStadiumThumb) {
                $('#teamStadiumThumb').attr('src', data.strStadiumThumb);
            } else {
                $('#teamStadiumThumb').attr('src', 'css/images/no-image.png');
            }
        } else {
            console.log('No data available for this country.');
        }
    };

    const getSportData = (selectCountryName) => {
        $.ajax({
            type: "GET",
            url: "php/getSportData.php",
            data: {
                selectCountryName: selectCountryName
            },
            dataType: "json",
            success: function(response) {
                if (response && response.data && response.data.teams && response.data.teams.length > 0) {
                    populateModal(response.data.teams[0]);
                } else {
                    // console.log('No data available for this country.');
                }
            },
            error: function(xhr, status, error) {
                console.error("Error fetching data: ", error);
            }
        });
    };
    // Function to get country code by coordinates
    const getCountryByCoord = (lat, lng) => {

        return $.ajax({
            url: "php/getCountryByLatLng.php",
            type: "GET",
            dataType: "json",
            data: {
                lat: lat,
                lng: lng
            }
        });
    };
    const populateCurrencyDropdowns = () => {
        return $.ajax({
            url: "php/getCurrency.php",
            type: "GET",
            dataType: "json",
            success: function(result) {
                if (result && Array.isArray(result)) {
                    var baseCurrencySelect = $("#baseCurrencySelect").val("USD");
                    var targetCurrencySelect = $("#targetCurrencySelect");
                    result.forEach(currency => {
                        baseCurrencySelect.append($("<option></option>").text(currency.name).attr("value", currency.symbol));
                        targetCurrencySelect.append($("<option></option>").text(currency.name).attr("value", currency.symbol));
                    });
                } else {
                    console.error("Invalid or empty data");
                }
            },
            error: function(xhr, status, error) {
                console.error("Error fetching currency data:", error);
            }
        });
    };
    populateCurrencyDropdowns();

    function convertCurrency() {
        var baseCurrency = $('#baseCurrencySelect').val();
        var targetCurrency = $('#targetCurrencySelect').val();
        var amountToConvert = $('#amountToConvert').val();

        // Ensure amount is not empty or invalid
        if (!amountToConvert || isNaN(amountToConvert) || amountToConvert <= 0) {
            $('#conversionResult').html('Please enter a valid amount');
            return;
        }

        $.ajax({
            url: 'php/getExchangeRate.php',
            type: 'GET',
            data: {
                from: baseCurrency,
                to: targetCurrency,
                amount: amountToConvert
            },
            success: function(response) {
                if (typeof response === "string") {
                    try {
                        response = JSON.parse(response);
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                        $('#conversionResult').html('Error parsing server response');
                        return;
                    }
                }

                if (response.success) {
                    var convertedAmount = response.result.convertedAmount;
                    $('#conversionResult').html(`${amountToConvert} ${baseCurrency} = ${convertedAmount} ${targetCurrency}`);
                } else {
                    console.error('Conversion failed or invalid data');
                    $('#conversionResult').html('Conversion failed or invalid data');
                }
            },
            error: function(xhr, status, error) {
                console.error("Error in currency conversion: ", error);
                $('#conversionResult').html(`Error in conversion: ${error}`);
            }
        });
    }
    $('#currencyDataModal').on('shown.bs.modal', function() {
        convertCurrency(); // Automatically convert when the modal opens
    });

    $('#baseCurrencySelect, #targetCurrencySelect, #amountToConvert').on('change', function() {
        convertCurrency(); // Convert on any change in selections or amount
    });
    // getCountryData Function
    const getCountryData = (chosenValue) => {
        $.ajax({
            url: "php/getCountryData.php",
            type: "GET",
            dataType: "json",
            data: {
                country: chosenValue
            },
            success: function(result) {

                $("#countryName").html(result.data.name);
                $("#capitalCity").html(result.data.capital.name);

                let objects = Object.values(result.data.languages);
                $.each(objects, function(i, language) {
                    $("#countryLanguages").append(language + ", ");
                });
                $("#countryPopulation").html(result.data.population.toLocaleString("en-US"));
                $("#countryTimezone").html(result.data.timezone.timezone + " Code: " + result.data.timezone.code);
                $("#countryWiki").html(`<a href=${
                result.data.wiki_url
            } target=_blank> More Info </a>`);
                $("#countryCurrency").html(result.data.currency.code);
                var currencyCode = result.data.currency.code;
                if ($("#targetCurrencySelect option[value='" + currencyCode + "']").length) {
                    $("#targetCurrencySelect").val(result.data.currency.code);;
                } else {
                    // console.error('Currency code not found in base currency dropdown');
                }
                $.ajax({
                    url: "php/getCurrency.php",
                    type: "GET",
                    dataType: "json",
                    data: {
                        currency: currencyCode
                    },
                    success: function(result) {
                        // console.log("Currency data received:", result);
                        if (result && result.data && result.data.rates) {
                            populateCurrencyModal(currencyCode, result.data.rates);
                        } else {
                            // console.error('Failed to fetch exchange rates');
                        }
                    },
                    error: function(xhr, status, error) {
                        // console.error('Error fetching currency data:', error);
                    }

                });

                $.ajax({
                    url: "php/getCountryByLatLng.php",
                    type: "GET",
                    dataType: "json",
                    data: {
                        country: result.data.capital.name
                    },
                    success: function(response) {
                        if (response && response.data && response.data.results && response.data.results.length > 0 && response.data.results[0].geometry) {
                            var lat = response.data.results[0].geometry.lat;
                            var lng = response.data.results[0].geometry.lng;
                            getCurrentWeatherData(lat, lng);
                            getNearbyWeatherStation(lat, lng);
                        } else {
                            // Handle the case when the expected data is not available
                        }
                    },
                    error: function(xhr, status, error) {
                        // Handle AJAX errors here
                        console.error("Error fetching data: ", error);
                    }
                });
                
            }
        });

    }
    const getNearbyWeatherStation = (lat, lon) => {
        $.ajax({
            url: "php/findWeatherStation.php",
            type: "POST",
            dataType: "json",
            data: {
                lat: lat,
                lon: lon
            },
            success: function(response) {
                if (response && response.data) {
                    let weatherData = response.data;
                    if (weatherData.lat && weatherData.lng) {
                        let weatherMarker = L.marker([weatherData.lat, weatherData.lng], {
                            icon: weatherIcon
                        });
                        let popupContent = `<strong>${weatherData.stationName}</strong><br>`;
                        popupContent += `<em>${weatherData.temperature}°C</em><br>`;
                        popupContent += `<em>${weatherData.clouds}</em><br>`;
                        weatherMarker.bindPopup(popupContent);
                        weather.addLayer(weatherMarker);
                    }
                } else {
                    // console.error('No weather data available');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error fetching weather data:', error);
            }
        });
    };


    const getCurrentWeatherData = (lat, lon) => {
        $.ajax({
            url: "php/getCurrentWeatherData.php",
            type: "POST",
            dataType: "json",
            data: {
                lat,
                lon
            },
            success: function(result) {
                setCurrentWeatherData(result)
            }
        });

    }

    const weatherEmojis = {
        'Clouds': '☁️',
        'Clear': '☀️',
        'Snow': '❄️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️'
    };


    const formatDate = (date) => {
        const options = {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString("en-US", options);
    };

    const setCurrentWeatherData = (result) => {
        // Extracting the city name from the timezone
        let city = result.data.timezone.split('/')[1].replace(/_/g, ' ');

        // Setting the modal title
        $("#weatherModalTitle").html(city + " Weather");

        // Formatting the current weather data
        let description = result.data.current.weather[0].description;
        description = description.charAt(0).toUpperCase() + description.slice(1);
        let mainWeather = result.data.current.weather[0].main;
        let emoji = weatherEmojis[mainWeather] || '';
        let temp = Math.round(result.data.current.temp);
        let pressure = result.data.current.pressure;
        let humidity = result.data.current.humidity;

        $("#wrapper-description").html(description);
        $("#wrapper-temp").html(temp + "°C " + "<span class='weather-emoji'>" + emoji + "</span>");
        $("#wrapper-pressure").html(pressure + " hPa");
        $("#wrapper-humidity").html(humidity + "%");

        $("#forecast-table-body").empty();

        // Set the forecast with dates, start from index 1 to skip today
        for (let i = 1; i < 8; i++) {
            let forecastDate = new Date();
            forecastDate.setDate(forecastDate.getDate() + i);

            let dailyWeather = result.data.daily[i];
            let dailyTemp = Math.round(dailyWeather.temp.day);
            let dailyMainWeather = dailyWeather.weather[0].main;
            let dailyEmoji = weatherEmojis[dailyMainWeather] || '';

            // Create a table row for each day's forecast
            let forecastRow = `
            <tr>
                <td>${formatDate(forecastDate)}</td>
                <td>${dailyTemp}°C <span class='weather-emoji'>${dailyEmoji}</span></td>
            </tr>
        `;
            $("#forecast-table-body").append(forecastRow);
        }
    };

    navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;

        getCountryByCoord(lat, lng).done((response) => {
            if (response && response.data) {
                let countryCode = response.data.results[0].components["ISO_3166-1_alpha-2"];
                if ($("#selectCountries").val() !== countryCode) {
                    $("#selectCountries").val(countryCode).change(); // Update and trigger change only if different
                } else {
                    getCountryBorder(countryCode); // Fetch and display country border
                }
            }
        }).fail((xhr, status, error) => {
            console.error("Error fetching country by coordinates:", error);
        });
    });


});