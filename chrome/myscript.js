//

function setPreference( pref, runFunc) {
  chrome.storage.local.set( pref, runFunc);
}

function getPreferences( runFunc) {
  chrome.storage.local.get( null, runFunc);
}

var MIN = 0.5,
    MAX = 4.0;

var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('jquery-ui.css');
(document.head||document.documentElement).appendChild(style);
var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('spdr-styles.css');
(document.head||document.documentElement).appendChild(style);


//chrome.storage.onChanged.addListener( function( changes, namespace) {
//  if( "undefined" != typeof changes.isActive) {
//    if (changes.isActive.newValue) {
//        $('#spdr').css('display', 'none');
//    } else {
//        $('#spdr').css('display', 'block');
//    }
//  }
//});

var spdrPosID;
var defaultSpeed = 1.0;

function setupSPDR() {
  getPreferences( function( prefs) {
    if ($("#spdr").length < 1) {

      if( $('#player-api video').length > 0) { 
        defaultSpeed = $('#player-api video')[0].playbackRate;
      }

      function getDefaultSpeed( defaultSpeed) {
        var urlparts = document.location.href.slice(0).split("?");
        var params = (urlparts ? urlparts[1].split("&") : []);
        for( var i=0; i < params.length; i++) {
          if( params[i].toLowerCase().indexOf( 'rightspeed=') === 0) {
            defaultSpeed = +parseFloat( params[i].substr( 11));
          } else if( params[i].toLowerCase().indexOf( 'rightspeed:speed=') === 0) {
            defaultSpeed = +parseFloat( params[i].substr( 17));
          }
        }
        return defaultSpeed;
      }
      defaultSpeed = getDefaultSpeed( defaultSpeed);

      $("<div id='spdr' style='display:none;width:49px;height:510px;position:absolute;top:15px;\
        background-color: rgba( 200, 200, 200, 0.5);z-index:1999999999;\
        border:1px solid #d22e2e;border-radius:4px;padding:4px 4px 4px 4px;'>\
          <img id='spdr-image' style='position:absolute;top:-22px;left:0px;width:100%'>\
          <div id='spdr-col1' style='color:black;float:left;height:100%'>\
          </div>\
          <div id='spdr-slider' style='float:right;height:502px;vertical-align:middle;'></div>\
          <div class='spdr-buttons' style='position:absolute;top:510px;left:1px;height:20px;width:55px;'>\
           <button id='spdr-reset' style='z-index:1999999999;position:absolute;left:4px;background-color: #999999;border:1px solid #d22e2e;border-radius:4px;'>RESET</button>\
          </div>\
        </div>").insertBefore("#player-api").find("#spdr-reset").click(function(e) {
            defaultSpeed = getDefaultSpeed( defaultSpeed);
            $("#spdr-slider").slider("value", defaultSpeed);
            updateVideoElement(defaultSpeed);
            e.preventDefault();
        });
      // load the image(s)
      var imgURL = chrome.extension.getURL("stopwatch-top.png");
      $("#spdr #spdr-image").prop('src', imgURL);
      // add labels
      var labels = [
      0.5, 1, 2, 3, 4];
      var $amounts = "";
      for (var i = 0; i < labels.length; i++) {
          var val = labels[i];
          $amounts += '<span id="spdr-label' + i + '" class="spdr-amount" style="position:absolute;bottom:' + (1.0 + (97 * (val - MIN) / (MAX - MIN))) + '%">' + val.toFixed(1) + 'x--</span>';
      }
      $amounts += '<span class="spdr-moving-label" style="position:absolute;">'+defaultSpeed.toFixed(1) + 'x--</span>';
      $('#spdr-col1').append($amounts);

      $("#spdr-slider").slider({
        value: defaultSpeed,
        min: MIN,
        max: MAX,
        step: 0.001,
        orientation: "vertical",
        slide: function(event, ui) {
          updateVideoElement(ui.value);
          $('#player-api video').first().bind('play', function(e) {
              updateVideoElement($("#spdr-slider").slider("value"));
          });
        },
        stop: function( event, ui) {
          console.log( 'trackEvent playbackRate='+ui.value.toFixed(1));
          _gaq.push(['_trackEvent', 'playbackRate='+ui.value.toFixed(1)]);
        },
        create: function( event, ui) {
          updateVideoElement( defaultSpeed);
        }
      });
    }
  });
}

function updateVideoElement(rate) {
    if($('#player-api video').length > 0) {
        if( rate !== $('#player-api video')[0].playbackRate) {
          $('#player-api video')[0].playbackRate = rate;
        }
    }
    $('#spdr .spdr-moving-label').html( ''+rate.toFixed(1) + 'x--').css({
        'position': 'absolute',
        'bottom': (1.0 + (97 * (rate - MIN) / (MAX - MIN))) + '%'
    });
    $("#spdr-slider").slider("value", rate);
}

function spdrPositioner() {
  var numVideoElems = $('#player-api video').length;  // <= this isn't working

  setPreference( {
    'isActive': (numVideoElems > 0)
  }, function() {});

  if( $('#spdr').length < 1) {
    setupSPDR();
  }
  if( $('#player-api video').length > 0) {
    $('#spdr-overlay').remove();
    if( $('#spdr-slider .ui-slider-handle').length > 0)
      $('#spdr-slider').slider( "enable");
    var playerApiPosition = $("#player-api").offset().left;
    if (playerApiPosition < 0) {
        return;
    }
    var left = $("#player-api").offset().left - 60;
    if( $('#spdr').offset().left !== left)
      $("#spdr").css({
        "left": left + 'px',
        "display": "block"
      });
    updateVideoElement( $("#spdr-slider").slider("value"));
  } else {
    if( $('#spdr-overlay').length < 1)
      $('#spdr').append( '<div id="spdr-overlay" style="position:absolute; top:0; left:-1px; width:59px;height:529px; background-color: rgba( 255,255,255,0.75)">');
    if( $('#spdr-slider .ui-slider-handle').length > 0)
      $('#spdr-slider').slider( "disable");
  }
}

function spdrPositionerScheduler() {
    if ("undefined" != typeof spdrPosID) {
        window.clearTimeout(spdrPosID);
    }
    spdrPosID = window.setInterval(spdrPositioner, 500);
}

$(function() {

  console.log( 'initializing RightSpeed');
  var html5enabled = false;
  chrome.extension.sendRequest( "getPREF", function( c) {
    var k = c[0].value;
    var prefs = ("undefined" != typeof k ? k.split( '&') : []);

    getPreferences( function( p) {
      for( var i=0; i<prefs.length; i++) {
        var pref = prefs[i];
        if( pref.indexOf( 'f2=') == 0) {
          html5enabled = (pref.substr( 3, 1) & 4);
        }
      }
      p['html5enabled'] = html5enabled;

      p['isActive']  = ($('#player-api video').length > 0);

      setPreference( p, function() {
        setupSPDR();
        $(window).resize(spdrPositionerScheduler);
        spdrPositionerScheduler();
      });
    });
  });

});

