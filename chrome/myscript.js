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
var timestampParam = undefined;

function getYouTubeURL() {
  var urlparts = document.location.href.slice(0).split("?");
  var baseUrl = urlparts[0];
  var params = (urlparts ? urlparts[1].split("&") : []);
  var videoId = '';
  for( var i=0; i < params.length; i++) {
    if( params[i].toLowerCase().indexOf( 'v=') === 0) {
      videoId = params[i].substr( 2);
    } else if( params[i].toLowerCase().indexOf( 'rightspeed:speed=') === 0) {
      defaultSpeed = +parseFloat( params[i].substr( 17));
    }
  }
  //return baseUrl+'?v='+videoId;
  return 'http://youtu.be/'+videoId;
}
function toMinSecs( secs) {
  secs = Math.floor( secs);
  var mins = Math.floor(secs / 60);
  secs = secs % 60;
  return mins+'m'+secs+'s'
}
function updateRightSpeedURL() {
  try {
    var ts_str = '';
    if( "undefined" != typeof timestampParam) {
      ts_str = '&t='+toMinSecs( timestampParam);
    }
    var newval = getYouTubeURL()+'?RightSpeed='+$("#spdr-slider").slider("value").toFixed(2)+'x'+ts_str;
    if( newval != $('#spdr .spdr-share-box .spdr-input').val()) {
      $('#spdr .spdr-share-box .spdr-input').val( newval);
      $('#spdr .spdr-share-box .spdr-input').select();
    }
  } catch( exception) {
    // not inited yet
  }
}

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

      $("<div id='spdr'>\
          <img id='spdr-image' >\
          <div class='spdr-col1' >\
          </div>\
          <div id='spdr-slider' ></div>\
          <div class='spdr-buttons' >\
           <div class='share_button' >share</div>\
           <div class='spdr-share-box' style='display:none;'>\
            <input class='spdr-input'></input>\
            <div class='close_button'>x</div>\
            <div class='addtime_button'>Set Timestamp</div>\
           </div>\
           <button id='spdr-reset'>1.0</button>\
          </div>\
        </div>").insertBefore("#player-api").find("#spdr-reset").click(function(e) {
            defaultSpeed = getDefaultSpeed( defaultSpeed);
            updateVideoElement(1.0);
            e.preventDefault();
        });

        $("#spdr .spdr-buttons .share_button").click( function(e) {
          console.log( 'SHARE BUTTON CLICKED');
          $('#spdr .spdr-share-box').css({
            'display': 'block'
          });

          $('#spdr .spdr-share-box .spdr-input').bind( "focus", function() {
            this.select();
          });
          $('#spdr .spdr-share-box .spdr-input').focus();
          updateRightSpeedURL();
        });
        function hideShareBox() {
          $('#spdr .spdr-share-box').css({
            'display': 'none'
          });
          timestampParam = undefined;
        }

        $('#player-api video').bind( "loadstart", hideShareBox);
        $('#spdr .spdr-share-box .close_button').click( hideShareBox);
        $('#spdr .spdr-share-box .addtime_button').click( function() {
          timestampParam = $('#player-api video')[0].currentTime;
          updateRightSpeedURL();
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
          $amounts += '<span id="spdr-label' + i + '" class="spdr-amount" style="position:absolute;bottom:' + (1.0 + (97 * (val - MIN) / (MAX - MIN))) + '%">' + val.toFixed(2) + 'x--</span>';
      }
      $amounts += '<span class="spdr-moving-label" style="position:absolute;">'+defaultSpeed.toFixed(2) + 'x--</span>';
      $('.spdr-col1').append($amounts);

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
    try {
      if( rate !== $("#spdr-slider").slider("value"))
        $("#spdr-slider").slider("value", rate);
    } catch( exception) {
      // not inited yet
    }
    if( rate < 0.5)
      rate = 0.5;
    $('#spdr .spdr-moving-label').html( ''+rate.toFixed(2) + 'x--').css({
        'position': 'absolute',
        'bottom': (1.0 + (97 * (rate - MIN) / (MAX - MIN))) + '%'
    });
    updateRightSpeedURL();
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
    if( "undefined" === typeof time_offset) {
      time_offset = 0;
    }
    time_offset++;
    var speed;
    try {
      speed = $("#spdr-slider").slider("value");
    } catch( exception) {
      // not inited yet
    }
    updateVideoElement( ( speed > 0 ? speed : 0));
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
  chrome.extension.sendRequest( "getYoutubeCookies", function( c) {
    var k = c[0].value;
    var prefs = ("undefined" != typeof k ? k.split( '&') : []);

    getPreferences( function( p) {
      for( var i=0; i<prefs.length; i++) {
        var pref = prefs[i];
        if( pref.indexOf( 'f2=') === 0) {
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

