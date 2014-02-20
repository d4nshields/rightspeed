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
          $('#html5enabled-message').html( "<blockquote style='text-align:justify;'>\
          ATTENTION: You have not setup the HTML5 player in YouTube.\
          Not all videos will work properly with the SpeederUpper add-on.   Please visit <a id='spdr-popup-youtube' href='http://youtube.com/html5' window='_blank'>\
          HTML5 Preferences</a> and be sure to click on 'Request the HTML5 player'.\
          </blockquote>");
          $('#spdr-popup-youtube').click( function() {
            chrome.tabs.create({url: $(this).attr('href')});
          });
        } else {
          $('#html5enabled-message').html( "<blockquote>\
            <b>HTML5 Player is configured.</b>\
            </blockquote>");
        }
      } else {
        $('input[name=isActive]').prop( 'disabled', true);
        $('label[for=isActive]').addClass( 'disabled');
      }
    })
    $('input[name=isActive]').change( checkboxChanged);    
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-48191515-2']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
