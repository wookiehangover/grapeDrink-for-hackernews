var request = require('request'),
    sys = require('sys'),
    http = require('http'),
    static = require('node-static'),
    URI = 'http://news.ycombinator.com/',


TT = (function TT( ) {
  var scrape = function ( callback ){
    var pageContent;
    // Make a request for some hackernews
    request({ uri: URI }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        pageContent = body;
      }
    });

    // Define a listenr that waits for the response 
    this.listen = function( ){
      if( !pageContent ) {
        setTimeout( this.listen, 500 );
      } else {
        callback( pageContent );
      }
    };
    // Make a call to our listener
    this.listen();
  },

  staticServer = function(){
    var file = new(static.Server)('../src');

    require('http').createServer(function (request, response) {
      request.addListener('end', function () {
        file.serve(request, response);
      });
    }).listen(9001);

    console.log("Starting static file server.....");
  };

  return TT.fn = TT.prototype = {

    init: function( ) {
      staticServer();
      scrape( TT.fn.onLoaded );
    },

    onLoaded: function( body ) {
      var css = "<link rel='stylesheet' type='text/css' href='http://localhost:9001/s.css' /> ",
          scripts = "<script src='http://localhost:9001/jquery-latest.js'></script>" +
                    "<script src='http://localhost:9001/cornify.js'></script>" +
                    "<script src='http://localhost:9001/engine.js'></script>";

      console.log( "Injecting plugin scripts" );
      body = body.replace(/\<\/head>/, css+"</head>" );
      body = body.replace(/\<\/body>/, scripts+"</body>" );

      console.log( "Starting zombie server.....");
      http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(body);
      }).listen(9000, "localhost");

    }
  };
})();

TT.init();

