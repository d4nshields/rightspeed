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
		var _gaq = _gaq || [];
		_gaq.push(['_setAccount', 'UA-48191515-2']);
		_gaq.push(['_trackEvent', 'install']);

		(function() {
		    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		    ga.src = 'https://ssl.google-analytics.com/ga.js';
		    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		} )();
	}
});
