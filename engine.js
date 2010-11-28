(function($){
$('a').click(function(e){
	if(this.href.indexOf('news.ycombinator') < 0) {
		e.preventDefault();
		window.open(this.href);
	} 
});
})(jQuery);
