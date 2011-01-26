(function($){
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
  var unicron, ut, timer, int, header = $('table:first > tbody:first-child > tr:first-child > td:first'),
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
      logo.css('opacity', '0.5');
      table.attr('bgcolor', '#eaeaea');
      header.attr('bgcolor', '#ff00ff');
      comments.css({ 'padding': '0 2px 2px 2px'});
      $('div', { id: 'flash' }).appendTo('body');
      // Recursive timeout for added Unicorns
      unicron = function (){
        cornify_add();
        ut = setTimeout(unicron, 1000);
      };


      // Konami code enables moar awesome
      $(window).konami(unicron);

      $(window).keyup(function(e){
        if( e.keyCode == 27 && !!timer )  {
          $('#timer').trigger('click');
        }
      });

      $('body').prepend($('<div>', { id: "flash" }));
      $('body').prepend($('<div>', { id: "timer" }));

      $('#timer').live('click', function(e){
          if( !!timer === true ){
            clearTimeout(timer);
            clearInterval(int);
            timer = null;
            int = null;
            fn.flash('Timer Cancelled');
          } else {
            fn.longPoll();
            fn.flash('Timer Resumed');
          }
      });

      if( /new/.test(window.location.pathname) || window.location.pathname == "/" ) {
        fn.longPoll();
      }

      // Show the updated table >_<
      $('table > tbody:first-child').fadeIn();
    },

    longPoll: function() {
      var t = function(){
            window.location.reload();
          },
          i = 120,
          c = $('#timer'),

          countdown = function(){
            c.text(i--);
          };

      timer = setTimeout(t, 120e3);
      int = setInterval(countdown, 1000);
    },

    flash: function(msg, timeout) {
      var flash = $('#flash'),
          t = timeout || 2000;

      if( !!msg ) {
        flash.html(msg).slideDown(400).delay(t).slideUp(400);
      }
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
            'count': parseInt(text, 10)
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
