var widgets = require("sdk/widget");
var tabs = require("sdk/tabs");
var self = require("sdk/self");

console.log( "RUNNING YouTube SpeederUpper");

        var pm = require("sdk/page-mod").PageMod({
          include: "*.youtube.com",
          attachTo: ["existing", "top"],
          contentScriptFile: [
            self.data.url('jquery.min.js'),
            self.data.url('jquery-ui.js'),
            self.data.url('myscript.js')
          ],
          contentStyleFile: self.data.url('jquery-ui.css')
        });
