"use strict";

var $ = require( "jquery" );
var extend = require( "extend" );
var git = require( "gift" );
var toMarkdown = require( "to-markdown" ).toMarkdown;
var Showdown = require( "showdown" );

var saveButton = $( "#saveButton" );
var openButton = $( "#openButton" );
var closeButton = $( "#closeButton" );
var commitButton = $( "#commitButton" );
var githubButton = $( "#githubButton" );

var ghUser = $( "#githubUsername" );
var ghPass = $( "#githubPassword" );

var saveFile = $( "#saveFile" );
var openFile = $( "#openFile" ); 

var console = window.console;

openButton.click( function() {
  openFile.click();
});

module.exports = function( app ) {

  if ( app.actions == null ) {
    app.actions = {};
  }

  var markdownize = function( content ) {
    var html = content
      .split( "\n" )
      .map( function( line ) {
        return ( line.trim() ) || line;
      })
      .filter( function( line ) { 
        return !!line;
      })
      .join( "\n" );
    return toMarkdown( html );
  };

  var converter = new Showdown.converter();
  var htmlize = function( content ) {
    return converter.makeHtml( content );
  };

  extend( app.actions, {

    open: function( path ) {
      console.log( "Opening: " + path );
      return app.currentFile.open( path ).then( function() {
        var contents = htmlize( app.currentFile.contents );
        app.editor.html( contents );
        app.editor.trigger( "hallomodified", { contents: contents } );
        return path;
      }).then( function( path ) {
        
        console.log( path );

        var dir = path.split( "/" ).slice( 0, -1 ).join( "/" );
        var repo = git( dir );

        console.log( repo );

        repo.commits( function( err, commits ) {
          // err if dir isn't a git repo
          if ( err ) {
            git.init( dir, function( err, _repo ) {
              if ( err ) {
                console.warn( "Failed to initialize repo in " + dir );
              }
              app.repo = _repo;
              console.log( "repo set!" );
            });
          // dir is a git repo.
          } else {
            app.repo = repo;
            console.log( "repo set!" );
          }
        });


      });
    },
    save: function() {
      var contents = markdownize( app.editor.html() );
      
      // working on an existing file
      if ( app.currentFile.path ) {
        return app.currentFile.save( contents ).then( function() {
          app.fileStatus.dirtyLocal = false;
          app.fileStatus.dirtyGit = true;
          app.trigger( "statusChange" );
          console.log( "Saved." );
        });
      }
      // working on a new file
      else {
        saveFile.click();
      }
    },
    close: function() {
      if ( app.fileStatus.dirtyLocal ) {
        if ( !window.confirm( "You have unsaved changes. Close anyway?" ) ) {
          return;
        }
      }
      app.currentFile.close();
      app.repo = null;
      app.editor.html( "" );
      app.editor.trigger( "hallomodified", { contents: "" } );
    }
  });

  app.editor.on( "hallomodified", function() {
    app.fileStatus.dirtyLocal = true;
    app.trigger( "statusChange" );
  });

  openFile.change( function() {
    app.actions.open( this.value );
    this.value = "";
  });

  saveFile.change( function() {
    app.currentFile.path = this.value;
    app.actions.save();
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

  // logic for commit.
  commitButton.click( function() {
    if ( !app.currentFile.path || !app.repo ) {
      console.warn( "No file or repo!" );
      return;
    }

    var commitMessage = window.prompt( "Please enter a commit message" );

    app.repo.add( app.currentFile.path, function( err ) {
      if ( err ) {
        window.alert( "git add failed! " + err );
        return;
      }
      app.repo.commit( commitMessage, {}, function( err ) {
        if ( err ) {
          window.alert( "git commit failed! " + err );
        } else {
          console.log( "Successful commit" );
          app.fileStatus.dirtyGit = false;
          app.trigger( "statusChange" );
        }
      });
    });


  });

  return app;
};