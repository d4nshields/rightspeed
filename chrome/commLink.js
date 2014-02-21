function setPreference( pref) {
    chrome.tabs.getSelected( null, function( tab) {
        chrome.tabs.sendMessage( tab.id, {
            'call': 'set',
            'prefs': pref
            });
    })
}

function getPreference( prefId, runFunc) {
    chrome.tabs.getSelected( null, function( tab) {
        chrome.tabs.sendMessage( tab.id, {
            'call': 'get',
            'prefId': prefId
            }, runFunc);
    })
}

function checkboxChanged() {
    setPreference( {
        'isActive': $('input[name=isActive]').prop('checked')
    });
}

$( function() {
    console.log( "running init()");
    getPreference( 'isActive', function( any) {
      if( "undefined" !== typeof any) {
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
      } else {
        $('input[name=isActive]').prop( 'disabled', true);
        $('label[for=isActive]').addClass( 'disabled');
          $('#html5enabled-message').html( "<blockquote>\
            To get started, <a id='spdr-popup-youtube' href='http://www.youtube.com/'>open a YouTube window</a>\
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
