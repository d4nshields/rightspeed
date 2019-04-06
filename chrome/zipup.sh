#!/bin/sh
rm -f chrome.zip
zip chrome.zip manifest.json background.js background.html popup.html \
 BTTF.ttf *.png jquery-ui.css spdr-styles.css \
 stopwatch-top.png button_instant_replay.png images/* \
 jquery.min.js jquery-ui.js \
 myscript.js commLink.js ga-config.js

