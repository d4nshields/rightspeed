    var spdrPosID;
    function setupSPDR() {
	if( $("#spdr").length < 1) {
          $("<div id='spdr' style='width:41px;height:510px;position:absolute;top:15px;'>\
            <div id='spdr-col1' style='color:black;float:left;'>\
            <span id='spdr-amount'><h6>1.00</h6></span><br/>\
            </div>\
            <div id='spdr-slider' style='float:right;height:510px;'></div>\
            <button id='spdr-reset' style='background-color: #999999;'>RESET</button>\
          </div>").insertBefore("#player-api");
	}
    }
    function updateVideoElement( rate) {
        if( "undefined" !== typeof document.getElementsByTagName("video")[0]) {
          document.getElementsByTagName("video")[0].playbackRate = rate;
        }
        $('#spdr #spdr-amount').html(  "<h6>"+rate+"</h6>");
        $('#spdr #spdr-amount').css( {
		'position': 'absolute',
		'bottom': $( '#spdr .ui-slider-handle').css('bottom')
	});
	
    }
    function spdrPositioner() {
	var playerApiPosition = document.getElementById( "player-api").getBoundingClientRect().left;
	if( playerApiPosition < 0) {
		return;
	}
        $("#spdr").css( "left", (document.getElementById( "player-api").getBoundingClientRect().left-47)+'px');
    }
    function spdrPositionerScheduler() {
	if( "undefined" !== typeof spdrPosID) {
		window.clearTimeout( spdrPosID);
	}
	spdrPosID = window.setInterval( spdrPositioner, 500);
    }

    setupSPDR();
    $(window).resize( spdrPositionerScheduler);
    spdrPositionerScheduler();
    $("#spdr #spdr-amount").html( "<h6>1.00</h6>");
    $("#spdr #spdr-reset").click( function(e) {
      $("#spdr #spdr-slider").slider( "value", 1.0);
      updateVideoElement( 1.0);
      e.preventDefault();
    });
    $("#spdr #spdr-slider").slider({
            value: 1.0,
            min: 0.25,
            max: 4.0,
            step: 0.01,
            orientation: "vertical",
            slide: function( event, ui) {
                updateVideoElement( ui.value);
                $('video').first().bind( 'play', function(e) {
                  updateVideoElement( $("#spdr #spdr-slider").slider( "value"));
                });
          }
    });
    updateVideoElement( 1.0);
    $("#spdr #spdr-slider").slider( "value", 1.0);
