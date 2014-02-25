function setPreference( pref, runFunc) {
    chrome.tabs.getSelected( null, function( tab) {
      chrome.storage.local.set( pref);
      if( "undefined" !== typeof pref.site) {
        chrome.storage.local.set( sites[ pref.site]);
      }
      if( "undefined" !== typeof runFunc)
        runFunc();
    });
}

function getPreference( runFunc) {
    chrome.tabs.getSelected( null, function( tab) {
      chrome.storage.local.get( null, function( items) {
        runFunc( items);
      });
    })
}

function checkboxChanged() {
    setPreference( {
        'isActive': $('input[name=isActive]').prop('checked')
    });
}

$( function() {
  var html5enabled = false;
  chrome.extension.sendRequest( "getPREF", function( c) {
    var k = c[0].value;
    var prefs = ("undefined" != typeof k ? k.split( '&') : []);

    getPreference( function( any) {
      for( var i=0; i<prefs.length; i++) {
        var pref = prefs[i];
        if( pref.indexOf( 'f2=') == 0) {
          html5enabled = (pref.substr( 3, 1) & 4);
        }
      }
      any['html5enabled'] = html5enabled;

      setPreference( any, function() {});

      $('input[name=isActive]').prop( 'checked', any.isActive);
      $('label[for=isActive]').removeClass( 'disabled');
      if( !any.html5enabled) {
        $('#html5enabled-message').html( "<blockquote style='text-align:justify;line-height:7mm;'>\
          YouTube HTML5 Player Status:<img src='xcheck.png' style='height:6.5mm;vertical-align:bottom;'><br><b>YouTube prefers to use the Flash player when unconfigured.</b>\
        Please visit <a id='spdr-popup-youtube' href='http://youtube.com/html5' window='_blank'>\
        HTML5 Preferences</a> and click 'Request the HTML5 player'.\
        </blockquote>");
      } else {
        $('#html5enabled-message').html( "<blockquote style='line-height:7mm;'>\
          YouTube HTML5 Player Status:<img src='checkmark.png' style='height:7mm;vertical-align:bottom;'><br><b>Will use HTML5 player when possible.</b><br>\
          <a id='spdr-popup-youtube' href='http://youtube.com/' window='_blank'>Open YouTube</a>.\
          </blockquote>");
      }
      $('#spdr-popup-youtube').click( function() {
        chrome.tabs.create({url: $(this).attr('href')});
      });
      $('input[name=isActive]').change( checkboxChanged);    
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
