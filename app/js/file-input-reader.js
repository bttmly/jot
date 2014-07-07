"use strict";

var $ = require( "jquery" );
var extend = require( "extend" );

var saveButton = $( "#saveButton" );
var openButton = $( "#openButton" );
var closeButton = $( "#closeButton" );
var commitButton = $( "#commitButton" );
var githubButton = $( "#githubButton" );

var ghUser = $( "#githubUsername" );
var ghPass = $( "#githubPassword" );

var saveFile = $( "#saveFile" );
var openFile = $( "#openFile" ); 

openButton.click( function() {
  openFile.click();
});

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
    },
    close: function() {
      if ( app.fileStatus.dirtyLocal ) {
        if ( !window.confirm( "You have unsaved changes. Close anyway?" ) ) {
          return;
        }
      }
      app.currentFile.close();
      app.editor.setHTML( "" );
    }

  });

  openFile.change( function() {
    app.actions.open( this.value );
  });

  saveButton.click( function() {
    app.actions.save();
  });

  closeButton.click( function() {
    app.actions.close();
  });

  githubButton.click( function() {
    app.gh.client = require( "octonode" ).client({
      username: ghUser.val(),
      password: ghPass.val()
    });

    app.gh.user = app.gh.client.me();
    
    app.gh.user.repos( function( err, response ) {
      app.gh.repos = response;
      console.log( response );
    });

  });

  return app;
};