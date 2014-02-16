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
    })
    $('input[name=isActive]').change( checkboxChanged);    
});
