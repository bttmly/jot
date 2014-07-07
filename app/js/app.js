var extend = require( "extend" );
var EventEmitter = require( "events" ).EventEmitter;
var app = Object.create( EventEmitter.prototype );

module.exports = ( function( window ) {
  "use strict";

  extend( app, {
    currentFile: require( "../js/file.js" ),
    octonode: require( "../js/as-promised.js" )( "octonode" ),
    git: require( "../js/as-promised.js" )( "gift" ),
    editor: window.quillInstance,
    githubClient: null,
    fileState: {
      dirtyLocal: false,
      dirtyGit: false,
    },
    log: []
  });

  if ( window.app == null ) {
    window.app = app;
  }

  require( "../js/file-input-reader.js" )( app );

  return app;

})( window );
