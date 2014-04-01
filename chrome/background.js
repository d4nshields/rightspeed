chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request == 'getYoutubeCookies') {
        chrome.cookies.getAll ({domain: 'youtube.com', name: 'PREF'}, function (cookies) {
            sendResponse (cookies);
        });
    }
});
chrome.storage.sync.get( 'hasSeenIntro', function( items) {
	if( !items['hasSeenIntro']) {
		chrome.storage.sync.set( { 'hasSeenIntro': 'yep'}, function() {
		});
		chrome.tabs.create( {
			url: 'https://github.com/d4nshields/rightspeed/blob/master/README.md'
		});
	}
});
