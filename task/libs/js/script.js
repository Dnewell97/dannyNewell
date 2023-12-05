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
            
            console.log(JSON.stringify(result));

            if (result.status.name =="ok") {
                // $('#countryName').html(result.data.countryName);
                $('#countryName').html(result['data'][0]['countryName']);

            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
        }
    })

})

$('#buttonrun1').on('click', function() {

    $.ajax({
      url: "libs/php/getTimeZone.php",
      type: 'POST',
      dataType: 'json',
      data: {
        longitude: $('#long').val(),
        latitude: $('#lat').val()
      },
      success: function(result) {
  
        console.log(JSON.stringify(result));
  
        if (result.status.name == "ok") {
  
          $('#sunrise').html(result.data.sunrise);
          $('#sunset').html(result.data.sunset);
          $('#country').html(result.data.countryName);
          $('#timeZone').html(result.data.timezoneId);
          $('#timeNow').html(result.data.time);
  
        }
      
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // your error code
      }
    }); 
  
});