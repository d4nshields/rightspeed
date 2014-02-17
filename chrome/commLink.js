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
        $('input[name=isActive]').prop( 'checked', any.isActive);
        if( !any.html5enabled) {
          $('#html5enabled-message').html( "<blockquote>\
          ATTENTION: You have not setup the HTML5 player in YouTube.\
          Not all videos will work properly with the SpeederUpper add-on.   Please visit <a href='http://youtube.com/html5' window='_blank'>\
          HTML5 Preferences</a> and be sure to click on 'Request the HTML5 player'.\
          </blockquote>");
        }
    })
    $('input[name=isActive]').change( checkboxChanged);    
});
