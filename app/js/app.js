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
    gh: {
      client: null,
      user: null,
      repos: null
    },
    fileStatus: {
      dirtyLocal: false,
      dirtyGit: false,
    },
    log: []
  });

  if ( window.app == null ) {
    window.app = app;
  }

  app.currentFile.on( "fileSaved", function() {
    app.fileStatus.dirtyLocal = false;
  });

  app.currentFile.on( "fileClosed", function() {
    app.fileStatus.dirtyLocal = false;
  });

  app.editor.on( "text-change", function() {
    app.fileStatus.dirtyLocal = true;
  });

  require( "../js/file-input-reader.js" )( app );

  return app;

})( window );
