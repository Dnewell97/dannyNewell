$('#placeNameBtn').click(function(){

    $.ajax({
        url:"libs/php/placeName.php",
        type: 'POST',
        dataType :'json',
        data: {
            longitude: $('#long').val(),
            latitude: $('#lat').val()
      },
        success:function(result){
            
            console.log(JSON.stringify(result['data']['geonames']));
            
            if (result.status.name =="ok") {
            
                var firstResult = result['data']['geonames'][0]; // Accessing the first object in the array
                var countryName = firstResult.countryName;
                var toponym = firstResult.toponymName;
                $('#countryName').html(countryName);
                $('#toponym').html(toponym);

            } else {
              console.log("error")
          }

        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("longitude or latitude out of range")
        }
    })

});

$('#wikiBtn').click(function(){

  $.ajax({
      url:"libs/php/wikiResults.php",
      type: 'POST',
      dataType :'json',
      data: {
          q: $('#placename').val(),
    },
      success:function(result){
        $('#results').html('');
        console.log(JSON.stringify(result));
          console.log();

          if (result.status.name == "ok"){
            $('#placenameEntered').html(result['data']['geonames'][0]['title']);
            $('#summary').html(result['data']['geonames'][0]['summary']);
            $('#wikiUrl').attr("href", "https://"+result['data']['geonames'][0]['wikipediaUrl']);
            


          }
          

       }
   })

});

$('#weatherBtn').click(function(){

  $.ajax({
      url:"libs/php/weather.php",
      type: 'POST',
      dataType :'json',
      data: {
          lat: $('#long1').val(),
          lng: $('#lat1').val()
    },
      success:function(result){
          
          console.log(JSON.stringify(result['data']['weatherObservation']));
          
          if (result.status.name =="ok") {
            $('#nameOfStation').html(result['data']['weatherObservation']['stationName']);
            $('#currentTemp').html(result['data']['weatherObservation']['temperature']);
            $('#cloudCoverage').html(result['data']['weatherObservation']['clouds']);
              

          } else{
            console.log("error");
          }

      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log("error");
      }
  })
});