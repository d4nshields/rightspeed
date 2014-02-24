chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request == 'getPREF') {
        chrome.cookies.getAll ({domain: 'youtube.com', name: 'PREF'}, function (cookies) {
            sendResponse (cookies);
        });
    }
});
