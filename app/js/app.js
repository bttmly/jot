"use strict";

var extend = require( "extend" );
var EventEmitter = require( "events" ).EventEmitter;
var $ = require( "jquery" );

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
    dirtyRemote: false,
  },
  repo: null,
  ui: {
    commitOnSave: function() {
      return $( "#commitOnSave" ).is( ":checked" );
    },
    pushOnCommit: function() {
      return $( "#pushOnCommit" ).is( ":checked" );
    }
  }
});

var updateIndicators = function( fileStatus ) {
  $( "#localIndicator" ).toggleClass( "dirty", fileStatus.dirtyLocal );
  $( "#gitIndicator" ).toggleClass( "dirty", fileStatus.dirtyGit );
  $( "#remoteIndicator" ).toggleClass( "dirty", fileStatus.dirtyRemote );
};


app.currentFile.on( "fileClosed", function() {
  app.fileStatus.dirtyLocal = false;
  app.trigger( "statusChange" );
});

app.editor.on( "text-change", function() {
  if ( app.fileStatus.dirtyLocal ) {
    app.fileStatus.dirtyLocal = true;
    app.trigger( "statusChange" );
  }
});

app.currentFile.on( "fileSaved", function() {
  if ( app.fileStatus.dirtyLocal ) {
    app.fileStatus.dirtyLocal = false;
    app.trigger( "statusChange" );
  }
  if ( !app.fileStatus.dirtyGit ) {
    app.fileStatus.dirtyGit = true;
    app.trigger( "statusChange" );
  }
  if ( app.ui.commitOnSave() ) {
    app.actions.commit();
  }
});

app.on( "commit", function() {
  if ( app.fileStatus.dirtyGit ) {
    app.fileStatus.dirtyGit = false;
    app.trigger( "statusChange" );
  }
  if ( !app.fileStatus.dirtyRemote ) {
    app.fileStatus.dirtyRemote = true;
    app.trigger( "statusChange" );
  }
  if ( app.ui.pushOnCommit() ) {
    app.actions.push();
  }
});

app.on( "push", function() {
  if ( app.fileStatus.dirtyRemote ) {
    app.fileStatus.dirtyRemote = false;
    app.trigger( "statusChange" );
  }
});

app.on( "statusChange", updateIndicators.bind( null, app.fileStatus ) );

// pass app through other modules...
require( "../js/file-input-reader.js" )( app );

module.exports = app;