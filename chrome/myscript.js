var preferences = {
    'isActive': true
};
var MIN = 0.5,
    MAX = 4.0;

chrome.runtime.onMessage.addListener(

function(message, sender, sendResponse) {
    switch (message.call) {
    case 'set':
        for (var k in message.prefs)
        if (message.prefs.hasOwnProperty(k)) {
            preferences[k] = message.prefs[k];
        }
        break;
    case 'get':
        sendResponse(preferences);
        break;
    }
    // now that preferences are set, let's set the visibility of #spdr based on what we have
    if (!preferences.isActive) {
        $('#spdr').css('display', 'none');
    }
    else {
        $('#spdr').css('display', 'block');
    }
});

var spdrPosID;

function setupSPDR() {
    if ($("#spdr").length < 1) {
        $("<div id='spdr' style='width:49px;height:510px;position:absolute;top:15px;\
          background-color: rgba( 200, 200, 200, 0.5);\
          border:1px solid #cccccc;border-radius:4px;padding:4px 4px 4px 4px;'>\
            <div id='spdr-col1' style='color:black;float:left;height:100%'>\
            </div>\
            <div id='spdr-slider' style='float:right;height:502px;vertical-align:middle;'></div>\
            <button id='spdr-reset' style='position:relative;top:3px;left:2px;background-color: #999999;border:1px solid #999999;border-radius:4px;'>RESET</button>\
          </div>").insertBefore("#player-api");
        // add labels
        var labels = [
        0.5, 1, 2, 3, 4];
        var $amounts = "";
        for (var i = 0; i < labels.length; i++) {
            var val = labels[i];
            $amounts += '<span id="spdr-label' + i + '" class="spdr-amount" style="color:black;position:absolute;bottom:' + (1.5+(96 * (val - MIN) / (MAX-MIN))) + '%">' + val.toFixed(1) + '--</span>';
        }
        $('#spdr #spdr-col1').append($amounts);
    }
}

function updateVideoElement(rate) {
    if ("undefined" !== typeof document.getElementsByTagName("video")[0]) {
        document.getElementsByTagName("video")[0].playbackRate = rate;
    }
    $('#spdr #spdr-amount').html("<h6>" + rate + "</h6>");
    $('#spdr #spdr-amount').css({
        'position': 'absolute',
        'bottom': $('#spdr .ui-slider-handle').css('bottom')
    });

}

function spdrPositioner() {
    var playerApiPosition = document.getElementById("player-api").getBoundingClientRect().left;
    if (playerApiPosition < 0) {
        return;
    }
    $("#spdr").css("left", (document.getElementById("player-api").getBoundingClientRect().left - 60) + 'px');
}

function spdrPositionerScheduler() {
    if ("undefined" !== typeof spdrPosID) {
        window.clearTimeout(spdrPosID);
    }
    spdrPosID = window.setInterval(spdrPositioner, 500);
}

setupSPDR();
$(window).resize(spdrPositionerScheduler);
spdrPositionerScheduler();
$("#spdr #spdr-amount").html("<h6>1.00</h6>");
$("#spdr #spdr-reset").click(function(e) {
    $("#spdr #spdr-slider").slider("value", 1.0);
    updateVideoElement(1.0);
    e.preventDefault();
});
$("#spdr #spdr-slider").slider({
    value: 1.0,
    min: MIN,
    max: MAX,
    step: 0.01,
    orientation: "vertical",
    slide: function(event, ui) {
        updateVideoElement(ui.value);
        $('video').first().bind('play', function(e) {
            updateVideoElement($("#spdr #spdr-slider").slider("value"));
        });
    }
});
updateVideoElement(1.0);
$("#spdr #spdr-slider").slider("value", 1.0);
