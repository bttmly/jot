"use strict";

var extend = require( "extend" );
var EventEmitter = require( "events" ).EventEmitter;

var app = Object.create( EventEmitter.prototype );

app.trigger = function() {
  app.emit.apply( app, arguments );
};

extend( app, {
  currentFile: require( "../js/file.js" ),
  octonode: require( "../js/as-promised.js" )( "octonode" ),
  git: require( "../js/as-promised.js" )( "gift" ),
  editor: window.editor,
  fileStatus: {
    dirtyLocal: false,
    dirtyGit: false,
  },
  repo: null,
  log: function( str ) {
    this.logs.push( str );
  },
  logs: []
});

app.currentFile.on( "fileSaved", function() {
  app.fileStatus.dirtyLocal = false;
  app.trigger( "statusChange" );
});

app.currentFile.on( "fileClosed", function() {
  app.fileStatus.dirtyLocal = false;
  app.trigger( "statusChange" );
});

app.editor.on( "text-change", function() {
  app.fileStatus.dirtyLocal = true;
  app.trigger( "statusChange" );
});

// pass app through other modules...
require( "../js/file-input-reader.js" )( app );

module.exports = app;