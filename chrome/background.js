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
			url: 'https://plus.google.com/113013874981087711269/posts'
		});
	}
});
