var extend = require( "extend" );

var app = window.app;

module.exports = ( function( document ) {
  "use strict";
  extend( app, {
    currentFile: require( "../js/file.js" ),
    octonode: require( "../js/as-promised.js" )( "octonode" ),
    nodegit: ( "nodegit" ),
    githubClient: null
  });

  return app;

})( window.document );
