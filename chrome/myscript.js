//

function setPreference( pref, runFunc) {
  chrome.storage.local.set( pref);
  if( "undefined" != typeof runFunc) {
    runFunc();
  }
}

function getPreferences( runFunc) {
  chrome.storage.local.get( null, function( items) {
    runFunc( items);
  });
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


chrome.storage.onChanged.addListener( function( changes, namespace) {
  getPreferences( function( prefs) {
    if (!prefs.isActive) {
        $('#spdr').css('display', 'none');
    } else {
        $('#spdr').css('display', 'block');
    }
  });
});

var spdrPosID;

function setupSPDR() {
  getPreferences( function( prefs) {
    if ($("#spdr").length < 1) {
      $("<div id='spdr' style='width:49px;height:510px;position:absolute;top:15px;\
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
            $("#spdr-slider").slider("value", 1.0);
            updateVideoElement(1.0);
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
          $amounts += '<span id="spdr-label' + i + '" class="spdr-amount" style="color:black;position:absolute;bottom:' + (1.5 + (96 * (val - MIN) / (MAX - MIN))) + '%">' + val.toFixed(1) + 'x--</span>';
      }
      $('#spdr-col1').append($amounts);

      $("#spdr-slider").slider({
        value: 1.0,
        min: MIN,
        max: MAX,
        step: 0.01,
        orientation: "vertical",
        slide: function(event, ui) {
          updateVideoElement(ui.value);
          $('video').first().bind('play', function(e) {
              updateVideoElement($("#spdr-slider").slider("value"));
          });
        }
      });
    }
  });
}

function updateVideoElement(rate) {
    if($("video").length > 0) {
        $("video")[0].playbackRate = rate;
    }
    $('#spdr #spdr-amount').css({
        'position': 'absolute',
        'bottom': $('#spdr .ui-slider-handle').css('bottom')
    });

}

function spdrPositioner() {
  setPreference( {
    'isActive': ($('video').length > 0)
  }, function() {
    getPreferences( function( prefs) {
      if( $('#spdr').length < 1) {
        setupSPDR();
      }
      if( $('video').length > 0) {
        $('#spdr-overlay').remove();
        $('#spdr-slider').slider( "enable");
        var playerApiPosition = $("#player-api").offset().left;
        if (playerApiPosition < 0) {
            return;
        }
        var left = $("#player-api").offset().left - 60;
        if( $('#spdr').offset().left !== left)
          $("#spdr").css("left", left + 'px');
        $("#spdr-slider").slider("value", $('video')[0].playbackRate);
      } else {
        if( $('#spdr-overlay').length < 1)
          $('#spdr').append( '<div id="spdr-overlay" style="position:absolute; top:0; left:-1px; width:59px;height:529px; background-color: rgba( 255,255,255,0.75)">');
        $('#spdr-slider').slider( "disable");
      }
    });
  });
}

function spdrPositionerScheduler() {
    if ("undefined" != typeof spdrPosID) {
        window.clearTimeout(spdrPosID);
    }
    spdrPosID = window.setInterval(spdrPositioner, 500);
}

function setCookie(cname,cvalue,exdays)
{
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
      {
          var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
      }
  return "";
}

$(function() {

  var html5enabled = false;
  var k = getCookie( 'PREF');
  var prefs = ("undefined" != typeof k ? k.split( '&') : []);

  getPreferences( function( p) {
    for( var i=0; i<prefs.length; i++) {
      var pref = prefs[i];
      if( pref.indexOf( 'f2=') == 0) {
        html5enabled = (pref.substr( 3, 1) & 4);
      }
    }
    p['html5enabled'] = html5enabled;

    p['isActive']  = ($('video').length > 0);

    setPreference( p, function() {
      setupSPDR();
      $(window).resize(spdrPositionerScheduler);
      spdrPositionerScheduler();
    });
  });

    //var pbRate = document.getElementsByTagName('video')[0].playbackRate;
    //updateVideoElement(pbRate);
    //$("#spdr #spdr-slider").slider("value", pbRate);
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-48191515-2']);
  _gaq.push(['_trackPageview']);

  (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = 'https://ssl.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
});

