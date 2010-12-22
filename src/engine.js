(function($){

$('center > table').attr('bgcolor', '#eaeaea');
$('img[width="18"]').css('opacity', '0.5');
$('td[bgcolor="#ff6600"]').attr('bgcolor', '#ff00ff');

var over9000 = function(anything){
  var under9000 = anything.html().match(/\(+.+\)/)[0]+"",
      over9000 = parseInt(under9000.match(/[0-9]+[0-9]/)[0]) + 9000,
      almost9000 = anything.html().replace(/\(+.+\)/, "("+over9000+")");

  anything.html(almost9000);
};

var karma = $('td[bgcolor="#ff00ff"] td:last-child > span');

over9000(karma);


$('a').click(function(e){
  cornify_add();

	if(this.href.indexOf('news.ycombinator') < 0) {
		e.preventDefault();
		window.open(this.href);
	}
});

var comments = $('.subtext  a:last-child'),
    comment_count = [];

comments.css({ 'padding': '0 2px 2px 2px'});

comments.each(function(i, elem){
  var text = $(elem).text();

  text = text.replace(/^discuss$/, "0");
  text = text.replace(/.comments$/, "");

  var c = {
    'jq': $(elem),
    'count': parseInt(text)
  }

  comment_count.push(c);
});

comment_count.sort(function(a, b) { return a.count - b.count });

var f = 0;
var i = comment_count.length;

var j, scale = 200 / i;
while(i--){
  j = ~~(f*scale);
  if(comment_count[i]["count"] > 75 ) { 
    comment_count[i]["jq"].css({'background': "rgb(255, 0, 0)", color: "#fff"});
  } else {
    comment_count[i]["jq"].css({'background': "rgb("+ j +", "+ j +", "+ j +")", color: "#fff"});
  }
  f++;
}

$('table > tbody:first-child').fadeIn();

})(jQuery);
