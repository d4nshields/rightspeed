var sites = {
  'coursera': {
    name: 'Coursera',
    url: 'www.coursera.org'
  },
  'youtube': {
    name: 'YouTube',
    url: 'www.youtube.com'
  }
};

function setPreference( pref, runFunc) {
    chrome.tabs.getSelected( null, function( tab) {
      chrome.storage.local.set( pref);
      if( "undefined" !== typeof pref.site) {
        chrome.storage.local.set( sites[ pref.site]);
      }
      runFunc();
    });
}

function getPreference( runFunc) {
    chrome.tabs.getSelected( null, function( tab) {
      chrome.storage.local.get( null, function( items) {
        runFunc( items);
      });
    })
}

function checkboxChanged() {
    setPreference( {
        'isActive': $('input[name=isActive]').prop('checked')
    });
}

function siteChanged() {
    $('input[name=site]:checked').each( function() {
      setPreference( {
        'site': $('input[name=site]:checked').val()
      }, render);
    });
}

function render() {
  getPreference( function( any) {
    if( "undefined" !== typeof any) {
      var siteDefs = sites[ any.site];
      $('input[id=site-'+any.site).prop( 'checked', true);
      $('input[name=isActive]').prop( 'checked', any.isActive);
      $('label[for=isActive]').removeClass( 'disabled');
      if( any.site === 'youtube') {
        if( !any.html5enabled) {
          $('#html5enabled-message').html( "<blockquote style='text-align:justify;line-height:7mm;'>\
            YouTube HTML5 Player Status:<img src='xcheck.png' style='height:6.5mm;vertical-align:bottom;'><br><b>YouTube prefers to use the Flash player when unconfigured.</b>\
          Please visit <a id='spdr-popup-link' href='http://youtube.com/html5' window='_blank'>\
          HTML5 Preferences</a> and click 'Request the HTML5 player'.\
          </blockquote>");
        } else {
          $('#html5enabled-message').html( "<blockquote style='line-height:7mm;'>\
            YouTube HTML5 Player Status:<img src='checkmark.png' style='height:7mm;vertical-align:bottom;'><br><b>Will use HTML5 player when possible.</b><br>\
            <a id='spdr-popup-link' href='http://youtube.com/' window='_blank'>Open YouTube</a>.\
            </blockquote>");
        }
      } else {
        $('#html5enabled-message').html( "<blockquote style='line-height:7mm;'>\
          Coursera HTML5 Player Status:<img src='checkmark.png' style='height:7mm;vertical-align:bottom;'><br><b>Ready to go.</b><br>\
          <a id='spdr-popup-link' href='http://www.coursera.org' window='_blank'>Open Coursera</a>.\
          </blockquote>");
      }
    } else {
      $('input[name=isActive]').prop( 'disabled', true);
      $('label[for=isActive]').addClass( 'disabled');
        $('#html5enabled-message').html( "<blockquote>\
          To get started, <a id='spdr-popup-link' href='"+siteDefs.url+"'>open a "+siteDefs.name+" window</a>\
          </blockquote>");
    }
    $('#spdr-popup-link').click( function() {
      chrome.tabs.create({url: $(this).attr('href')});
    });
  });
}

$( function() {
  var preferences = {
    'isActive': true,
    'html5enabled': false,
    'site': 'youtube'       // either youtube or coursera
  };
  getPreference( function( prefs) {
    if( "undefined" == typeof prefs.site) {
      setPreference( preferences);
    }  
  });

  $('input[name=site]').change( siteChanged);
  $('input[name=isActive]').change( checkboxChanged);    

  render();
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-48191515-2']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
