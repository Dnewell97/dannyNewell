let chosenValue;
let map = L.map("map").setView([
    51.4702, 0.1922
], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 16,
    attribution: "© OpenStreetMap"
}).addTo(map);

L.easyButton( '<i class="fa fa-info fa-xl" aria-hidden="true"></i>', function(){
    alert('you just clicked the html entity \&starf;');
  }).addTo(map);

  L.easyButton('<i class="fa fa-thermometer-full fa-xl" aria-hidden="true"></i>', function () {
    $("#weatherModal").modal("show");
}).addTo(map);

L.easyButton('<i class="fa-solid fa-xl fa-arrow-right-arrow-left"></i>', function () {
    $("#weatherModal").modal("show");
}).addTo(map);

L.easyButton('<i class="fa-brands fa-xl fa-wikipedia-w"></i>', function () {
    $("#weatherModal").modal("show");
}).addTo(map);

L.easyButton('<i class="fa-solid fa-xl fa-futbol"></i>', function () {
    $("#weatherModal").modal("show");
}).addTo(map);
let selectField = $("#selectCountries");
window.addEventListener('load',function(){
    document.querySelector('body').classList.add("loaded")  
  });  
// Function to fetch and populate select field with countries
const selectCountries = () => {
    // Making an AJAX call to retrieve country data
    return $.ajax({
        url: "php/selectCountries.php",
        type: "GET",
        dataType: "json"
    });
};

// Using the populateSelectFields function and handling the result
selectCountries().done((result) => {
    // Extracting the array of countries from the AJAX response
    var countries = result.data;

    // Checking the type of 'countries'
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

    // Looping through sorted countries to populate the select field
    $.each(countries, function (i, item) {
        selectField.append($("<option></option>").text(countries[i].name).attr("value", countries[i].iso));
    });
}).then(() => {
    $(document).ready(function () {
        map.locate({setView: true, maxZoom: 20});
        if ("geolocation" in navigator) {

            navigator.geolocation.getCurrentPosition(function (position) {
                map.setView([
                    position.coords.latitude, position.coords.longitude
                ], 13);
                marker = L.marker(location).addTo(map);
            })
        }
    }
    )}
);


const getCountryBorder = (countryCode) => {
    return $.ajax({
        url: "php/getCountryBorder.php",
        type: "GET",
            data: {
                countryCode: countryCode 
            },
        success: function (result) {
            console.log(result);
        }
    });
};

$('#selectCountries').on('change', function(event) {
    var chosenValue = $(this).val(); // This gets the selected country code
    var selectedText = $(this).find(":selected").text();

    if (chosenValue) {
        getCountryBorder(chosenValue).done((result) => {
            // rest of your code
        });
    } else {
        console.error("No option is selected.");
    }
});


getCountryBorder(chosenValue).done((result) => {
    // Check if the result data is valid and contains features
    console.log(result)
    if (result && result.data && result.data.features) {
        // Create a GeoJSON layer for the country feature
        const countryLayer = L.geoJSON(result.data.features[0].geometry, { color: 'purple' }).addTo(map);
        
        // Fit the map bounds to the country's borders
        map.fitBounds(countryLayer.getBounds());
    } else {
        console.error("Invalid or missing data structure in the response.");
    }
});

