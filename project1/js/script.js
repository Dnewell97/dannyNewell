$(window).on("load", function () {
    if ($("#loader").length) {
      $("#loader")
        .delay(1000)
        .fadeOut("slow", function () {
          $(this).remove();
        });
    }
  });

$(document).ready(function() {
    // Initialize the map
    var map = L.map("map").setView([51.4702, 0.1922], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 16,
        attribution: "© OpenStreetMap"
    }).addTo(map);
    map.eachLayer(function (layer) {
        if (layer instanceof L.markerClusterGroup) {
            map.removeLayer(layer)
        }
    })

    const markers = L.markerClusterGroup();
    

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

    L.easyButton('<i class="fa fa-info fa-xl" aria-hidden="true"></i>', function () {
        $("#countryModal").modal("show");
    }).addTo(map);

    L.easyButton('<i class="fa fa-thermometer-full fa-xl" aria-hidden="true"></i>', function() {
        $("#weatherModal").modal("show");
    }).addTo(map);

    L.easyButton('<i class="fa-solid fa-xl fa-arrow-right-arrow-left"></i>', function() {
        $("#currencyDataModal").modal("show");
    }).addTo(map);

    // L.easyButton('<i class="fa-brands fa-xl fa-wikipedia-w"></i>' , (btn, map) => {
    //     if ($("#selectCountries").val() === "") {
    //       alert("Please Select a Country");}
    //     else {$("#wikiModal").modal("show");}
    //     $("#wikiModal").modal("show");
    // }).addTo(map);    

    L.easyButton('<i class="fa-solid fa-xl fa-futbol"></i>', function() {
        $("#sportsDataModal").modal("show");
    }).addTo(map);

    L.easyButton('<i class="fa-brands fa-xl fa-wikipedia-w"></i>', function() {
            $("#wikiModal").modal("show");
    }).addTo(map);
    

    // Function to remove existing borders
    const removeBordersAndMarkers = () => {
        // Remove GeoJSON layers (borders)
        map.eachLayer((layer) => {
            if (layer instanceof L.GeoJSON) {
                map.removeLayer(layer);
            }
        });
    
        // Clear markers from the markers layer group
        // markers.clearLayers();
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
            // Sorting the countries array alphabetically by country name
            countries.sort((a, b) => {
                if (a.name.toString().toLowerCase() < b.name.toString().toLowerCase()) {
                    return -1;
                }
                if (a.name.toString().toLowerCase() > b.name.toString().toLowerCase()) {
                    return 1;
                }
                return 0;
            });
    
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
        removeBordersAndMarkers();  // Clear existing borders
        markers.clearLayers(); // Clear markers

        $.ajax({
            url: "php/getCountryBorder.php",
            type: "GET",
            data: { countryCode: countryCode },
            dataType: "json",
            success: function (result) {
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
        data: { countryCode }
    });
};

getCities(countryCode).done((result) => { 
    if (result.data && Array.isArray(result.data)) {
        result.data.forEach(element => {
            if (element.lat && element.lng) {
                let cityMarker = L.marker([element.lat, element.lng], {icon: cityIcon});
                let popupContent = `<strong>${element.name}</strong><br>`;
                popupContent += `${element.adminName1}<br>`;
                popupContent += `${element.countryName}<br>`;
                popupContent += `Population: ${element.population.toLocaleString()}`;
                cityMarker.bindPopup(popupContent);
                markers.addLayer(cityMarker); // Add to the marker cluster group
            }
        });
        map.addLayer(markers); // Add the cluster group to the map
    } else {
        console.error('No cities data available or invalid data structure');
    }
}).fail(function(jqXHR, textStatus, errorThrown) {
    console.error('Error fetching cities:', textStatus, errorThrown);
});
    }


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

    // Display the default country (UK) border on initial load
    // getCountryBorder('GB');

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
            url:"php/wikiResults.php",
            type: 'POST',
            dataType :'json',
            data: {
                selectCountryName: selectCountryName,
          },
            success:function(result){
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
                    console.log('No data available for United Kingdom.');
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
    
    // Example usage of getCountryName
    // getCountryName("US").then(countryName => {
    //     console.log(countryName); // Log the country name
    // }).catch(error => {
    //     console.error(error); // Log any errors
    // });

    const populateModal = (data) => {
        $('#teamStadiumThumb').attr('src', data.strStadiumThumb);
        $('#teamName').text(data.strTeam);
        $('#teamFormedYear').text(data.intFormedYear);
        $('#teamStadium').text(data.strStadium);
        $('#teamKeywords').text(data.strKeywords);
        $('#teamDescription').text(data.strDescriptionEN);
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
                // console.log('AJAX Response:', response); // Log the entire response
                    if (response && response.data && response.data.teams && response.data.teams.length > 0) {
                        populateModal(response.data.teams[0]);
                    } else {
                        console.log('No data available for this country.');
                    }
                }
                
            ,
            error: function(xhr, status, error) {
                console.error("Error fetching data: ", error);
            }
        });
    };
    


    // Function to get country code by coordinates
    const getCountryByCoord = (lat, lng) => {
        $.ajax({
            type: "GET",
            url: "php/getCountryByLatLng.php",
            data: {
                lat: lat,
                lng: lng
            },
            dataType: "json",
            success: function(response) {
                let country = response.data.results[0].components["ISO_3166-1_alpha-2"];
                $("#selectCountries").val(country).change();
            },
            error: function(xhr, status, error) {
                console.error("AJAX request failed:", status, error);
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

    $('#convertCurrency').click(function() {
        var baseCurrency = $('#baseCurrencySelect').val();
        var targetCurrency = $('#targetCurrencySelect').val();
        var amountToConvert = $('#amountToConvert').val();
    
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
        success: function (result) {
            
            $("#countryName").html(result.data.name);
            $("#capitalCity").html(result.data.capital.name);

            let objects = Object.values(result.data.languages);
            $.each(objects, function (i, language) {
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
                console.error('Currency code not found in base currency dropdown');
            }
            $.ajax({
                url: "php/getCurrency.php",
                type: "GET",
                dataType: "json",
                data: {
                    currency: currencyCode 
                    },
                    success: function (result) {
                        // console.log("Currency data received:", result);
                            if (result && result.data && result.data.rates) {
                                populateCurrencyModal(currencyCode, result.data.rates);
                            } else {
                                // console.error('Failed to fetch exchange rates');
    } 
  },
                error: function (xhr, status, error) {
                  console.error('Error fetching currency data:', error);
                } 
                
              });
              
            $.ajax({
                url: "php/getCountryByLatLng.php",
                type: "GET",
                dataType: "json",
                data: {
                    country: result.data.capital.name
                },
                    success: function (response) {
                        if (response.data.results && response.data.results.length > 0 && response.data.results[0].geometry) {
                            var lat = response.data.results[0].geometry.lat;
                            var lng = response.data.results[0].geometry.lng;
                            getCurrentWeatherData(lat, lng);
                            getNearbyWeatherStation(lat,lng)
                            
                        } else {
                            console.error('No geometry data available');
                        }

                    }
                    
            })
        }
    });

}
const getNearbyWeatherStation = (lat, lon) => {
    $.ajax({
        url: "php/findWeatherStation.php",
        type: "POST", 
        dataType: "json",
        data: { lat: lat, lon: lon },
        success: function(response) {
            if (response && response.data) {
                let weatherData = response.data;
                if (weatherData.lat && weatherData.lng) {
                    let weatherMarker = L.marker([weatherData.lat, weatherData.lng], {icon: weatherIcon});
                    let popupContent = `<strong>${weatherData.stationName}</strong><br>`;
                    popupContent += `Temperature: ${weatherData.temperature}°C<br>`;
                    popupContent += `Clouds: ${weatherData.clouds}<br>`;
                    weatherMarker.bindPopup(popupContent);
                    markers.addLayer(weatherMarker); // Add to the marker cluster group
                }
            } else {
                console.error('No weather data available');
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
        success: function (result) {
            setCurrentWeatherData(result)
        }
    });

}

const setCurrentWeatherData = (result) => {
    let description = result.data.current.weather[0].description;
    description = description.charAt(0).toUpperCase() + description.slice(1);
    let temp = Math.round(result.data.current.temp);
    let pressure = result.data.current.pressure;
    let humidity = result.data.current.humidity;

    $("#wrapper-description").html(description);
    $("#wrapper-temp").html(temp + "°C");
    $("#wrapper-pressure").html(pressure);
    $("#wrapper-humidity").html(humidity + "%");

    // hourly temp
   
    // Weather daily data
    let tomorrowTemp = Math.round(result.data.daily[0].temp.day);
    let dATTemp = Math.round(result.data.daily[1].temp.day);

    $("#wrapper-forecast-temp-today").html(temp + "°C");
    $("#wrapper-forecast-temp-tomorrow").html(tomorrowTemp + "°C");
    $("#wrapper-forecast-temp-dAT").html(dATTemp + "°C");


}

   

    navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        // console.log(lat, lng)

        map.setView([lat, lng], 16);

        // Fetch Wikipedia data and country code by current position
        fetchWikiData(lat, lng);
        getCountryByCoord(lat, lng);
    });
});

