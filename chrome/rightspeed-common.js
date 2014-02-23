function setPreference( pref, runFunc) {
  chrome.storage.local.set( pref);
  if( "undefined" !== typeof runFunc)
    runFunc();
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


if ("undefined" !== typeof chrome) {
  chrome.storage.onChanged.addListener( function( changes, namespace) {
    getPreferences( function( prefs) {
      if (!prefs.isActive) {
          $spdrBase.css('display', 'none');
      } else {
          $spdrBase.css('display', 'block');
      }
    });
  });
}

var spdrPosID;
var $spdrBase;
var $docBase;

function setupSPDR() {
  getPreferences( function( prefs) {

    var playFrame;
    var isSpdr;
    if( "youtube" === prefs.site) {
      $docBase = $(document);
      playFrame = $docBase.find('#player-api');
    } else if( "coursera" === prefs.site) {
      $docBase = $('iframe').contents();
      playFrame = $docBase.find( '#QL_player_container_first');
    }
    isSpdr = ($docBase.find( '#spdr').length > 0);
    if( (playFrame.length > 0) && !isSpdr) {
        $("<div id='spdr' style='z-index:1500000;width:49px;height:510px;position:absolute;top:15px;\
          background-color: rgba( 200, 200, 200, 0.5);\
          border:1px solid #d22e2e;border-radius:4px;padding:4px 4px 4px 4px;'>\
            <img id='spdr-image' style='position:absolute;top:-22px;left:0px;width:100%'>\
            <div id='spdr-col1' style='color:black;float:left;height:100%'>\
            </div>\
            <div id='spdr-slider' style='float:right;height:502px;vertical-align:middle;'></div>\
            <div class='spdr-buttons' style='position:absolute;top:510px;left:1px;height:20px;width:55px;'>\
             <button id='spdr-reset' style='position:absolute;left:4px;background-color: #999999;border:1px solid #d22e2e;border-radius:4px;'>RESET</button>\
            </div>\
          </div>").insertBefore( playFrame);
        // load the image(s)
        $spdrBase = $docBase.find( '#spdr');
        var imgURL = chrome.extension.getURL("stopwatch-top.png");
        $spdrBase.find("#spdr-image").prop('src', imgURL);
        // add labels
        var labels = [
        0.5, 1, 2, 3, 4];
        var $amounts = "";
        for (var i = 0; i < labels.length; i++) {
            var val = labels[i];
            $amounts += '<span id="spdr-label' + i + '" class="spdr-amount" style="color:black;position:absolute;bottom:' + (1.5 + (96 * (val - MIN) / (MAX - MIN))) + '%">' + val.toFixed(1) + 'x--</span>';
        }
        $spdrBase.find('#spdr-col1').append($amounts);
        $spdrBase.find("#spdr-slider").slider({
            value: 1.0,
            min: MIN,
            max: MAX,
            step: 0.01,
            orientation: "vertical",
            slide: function(event, ui) {
                updateVideoElement(ui.value);
                $docBase.find('video').first().bind('play', function(e) {
                    updateVideoElement($spdrBase.find("#spdr-slider").slider("value"));
                });
            }
        });
    }
  });
}

function updateVideoElement(rate) {
    if ("undefined" !== typeof document.getElementsByTagName("video")[0]) {
      $docBase.find( "video")[0].playbackRate = rate;
    }
    $spdrBase.find('#spdr-amount').css({
        'position': 'absolute',
        'bottom': $spdrBase.find('.ui-slider-handle').css('bottom')
    });

}

function spdrPositioner() {
  setPreference( {
    'isActive': ($docBase.find('video').length > 0)
  }, function() {
    getPreferences( function( prefs) {
      if( ("undefined" === typeof $spdrBase) || ($spdrBase.length < 1)) {
        setupSPDR();
      }
      if( $docBase.find('video').length > 0) {
        $spdrBase.find('#spdr-overlay').remove();
        $spdrBase.find('#spdr-slider').slider( "enable");
        //
        if( "youtube" === prefs.site) {
          playFrame = $( '#player-api');
        } else {
          playFrame = $('iframe').contents().find( '#QL_player_container_first');
        }

        var playerApiPosition = playFrame.offset().left;
        if (playerApiPosition < 0) {
            return;
        }
        var left = (playFrame.offset().left - 60);
        if( $spdrBase.offset().left !== left)
          $spdrBase.css("left", left + 'px');
        $spdrBase.find("#spdr-slider").slider("value", $docBase.find( "video")[0].playbackRate);
      } else {
        if( $spdrBase.find('#spdr-overlay').length < 1)
          $spdrBase.append( '<div id="spdr-overlay" style="position:absolute; top:0; left:-1px; width:59px;height:529px; background-color: rgba( 255,255,255,0.75)">');
        $spdrBase.find('#spdr-slider').slider( "disable");
      }
    });
  });
}

function spdrPositionerScheduler() {
    if ("undefined" !== typeof spdrPosID) {
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
    var prefs = ("undefined" !== typeof k ? k.split( '&') : []);

    $docBase = $(document);     // default value
    getPreferences( function( p) {
      for( var i=0; i<prefs.length; i++) {
        var pref = prefs[i];
        if( pref.indexOf( 'f2=') == 0) {
          html5enabled = (pref.substr( 3, 1) & 4);
        }
      }
      p['html5enabled'] = html5enabled;

      if( ("undefined" === typeof p.site) || ("youtube" === p.site)) {
        $docBase = $(document);
      } else if( "coursera" === p.site) {
        $docBase = $('iframe').contents();
      }
      p['isActive']  = ($docBase.find('video').length > 0);
      setPreference( p, function() {
        setupSPDR();
        $(window).resize(spdrPositionerScheduler);
        spdrPositionerScheduler();
        $spdrBase.find("#spdr-reset").click(function(e) {
            $spdrBase.find("#spdr-slider").slider("value", 1.0);
            updateVideoElement(1.0);
            e.preventDefault();
        });
      });
    });
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-48191515-2']);
  _gaq.push(['_trackPageview']);

  (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = 'https://ssl.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
});

