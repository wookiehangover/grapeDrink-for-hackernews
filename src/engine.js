(function($){
console.profile('g');
$.fn.konami = function(callback, code) {
  var c = code || "38,38,40,40,37,39,37,39,66,65";

  return this.each(function() {
    var kkeys = [];
    $(this).keydown(function(e){
      kkeys.push( e.keyCode );
      if ( kkeys.toString().indexOf( c ) >= 0 ){
        $(this).unbind('keydown', arguments.callee);
        callback(e);
      }
    }, true);
  });
};

var HK = (function HK() {
  var unicron, ut, timer, header = $('table:first > tbody:first-child > tr:first-child > td:first'),
      table = $('center > table:first'),
      karma = header.find('td:last-child > span'),
      logo = $('img[width="18"]'),
      comments = $('.subtext  a:last-child'),

  fn = {

    init: function() {
            // Invoke our other functions from fn namespace
      fn.weightComments( comments );
      fn.externalLinks( );
      fn.changeKarma( karma );

      // Change the theme a bit
      // TODO break out into separate funciton
      logo.css('opacity', '0.5');
      table.attr('bgcolor', '#eaeaea')
      header.attr('bgcolor', '#ff00ff');
      comments.css({ 'padding': '0 2px 2px 2px'});

      // Recursive timeout for added Unicorns
      unicron = function (){
        cornify_add();
        ut = setTimeout(unicron, 1000);
      };

      fn.setTimer();

      // Konami code enables moar awesome
      $(window).konami(unicron).keyup(function(e){(e.keyCode==27 && !!ut) && clearTimeout(ut); });

      // Show the updated table >_<
      $('table > tbody:first-child').fadeIn();
      console.profileEnd('g');
    },

    longPoll: function longPoll() {
      
      window.location.reload();

    },

    setTimer: function() {
      if( /new/.test(window.location.pathname) ) {
        timer = setTimeout(fn.longPoll, 60e3);
      }
    },

    getTimer: function() {
      return timer;
    },

    flash: function() {
      var flash = $('#flash');

      if( !!flash.length ) {
        flash = $('div', { id: 'flash' }).before('center:first');
      }

      console.debug(flash);
    },

    // Highlights comments by order weight.
    // Takes a jq element
    weightComments: function( elem ) {
      try {
        var i, j, scale,
            f = 0,
            comments = elem,
            comment_count = [];

        // Iterate through list of comments
        comments.each(function(i, elem){
          var text = $(elem).text();
          // Scrub out comment text to get count
          text = text.replace(/^discuss$/, "0");
          text = text.replace(/.comments$/, "");

          // Push jq selector and numeric count into comment_cout
          comment_count.push({
            'jq': $(elem),
            'count': parseInt(text)
          });
        });

        // Sort decs by number of comments
        comment_count.sort(function(a, b) { return a.count - b.count });

        i = comment_count.length;
        // Set an RGB color scale multiplier
        // This makes changing our our numeric rank f to an RBG value easier
        scale = 200 / i;
        // Inverted while loops are fast. really fast.
        while(i--){
          j = ~~(f*scale);
          if(comment_count[i]["count"] > 75 ) { 
            comment_count[i]["jq"].css({'background': "rgb(255, 0, 0)", color: "#fff"});
          } else {
            comment_count[i]["jq"].css({'background': "rgb("+ j +", "+ j +", "+ j +")", color: "#fff"});
          }
          f++;
        }
      } catch(e) {
        console.error("Holy fucking shit there's an error:\n"+e);
      }
    },

    // Add over 9000 points to your karma score
    changeKarma: function( elem ){
      try{
        this.over9000 = function(anything){
          // Match comments text in *entire* table head
          var under9000 = anything.html().match(/\(+.+\)/)[0]+"",
          // Then strip out the karma # and add 9000
            over9000 = parseInt(under9000.match(/[0-9]+[0-9]/)[0]) + 9000,
          // Hacker news is a table because???
            almost9000 = anything.html().replace(/\(+.+\)/, "("+over9000+")");
          // Stick our crap back into the STFU table
          anything.html(almost9000);
        };

        return this.over9000(elem)
      } catch(e) {
          console.error("Holy fucking shit there's an error:\n"+e);
      }
    },

    // Makes all outbound links open in new tabs
    externalLinks: function( ){
      $('body').delegate('a','click', function(e){
        if(this.href.indexOf('news.ycombinator') < 0) {
          e.preventDefault();
          window.open(this.href);
        }
      });

    }
  };

  return fn;

})();

window.HK = HK;
$(document).ready(HK.init);

})(jQuery);
