"use strict";

var $ = require( "jquery" );
var extend = require( "extend" );

var saveButton = $( "#saveButton" );
var openButton = $( "#openButton" );
var saveFile = $( "#saveFile" );
var openFile = $( "#openFile" );

openButton.click( function() {
  console.log( "open button click" );
  openFile.click();
});

saveButton.click( function() {});

module.exports = function( app ) {

  if ( app.actions == null ) {
    app.actions = {};
  }

  extend( app.actions, {
    open: function( path ) {
      return app.currentFile.open( path ).then( function() {
        return app.editor.setHTML( app.currentFile.contents );
      }).then( function() {
        console.log( "Should go find the git repo here" );
      });
    },
    save: function() {
      var contents = app.editor.getHTML();
      return app.currentFile.save( contents ).then( function() {
        console.log( "Saved." );
      });
    }
  });

  openFile.change( function() {
    app.actions.open( this.value );
  });

  saveFile.click( function() {
    app.actions.save();
  });

  return app;
};