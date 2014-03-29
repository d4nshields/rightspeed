chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request == 'getYoutubeCookies') {
        chrome.cookies.getAll ({domain: 'youtube.com', name: 'PREF'}, function (cookies) {
            sendResponse (cookies);
        });
    }
});
