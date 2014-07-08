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
var pushButton = $( "#pushButton" );

// var githubLoginButton = $( "#githubLoginButton" );
// var ghUser = $( "#githubUsername" );
// var ghPass = $( "#githubPassword" );

// var githubRepoSelect = $( "#githubRepoSelect" );
// var githubRepoButton = $( "#githubRepoButton" );

var saveFile = $( "#saveFile" );
var openFile = $( "#openFile" ); 

var console = window.console;

openButton.click( function() {
  openFile.click();
});

var buildRepoOptions = function( repos ) {
  return repos.map( function( repo ) {
    var str = "";
    str += "<option value='" + repo.name + "'>";
    str += repo.name;
    str += "</option>";
    return str;
  });
};

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
      return app.currentFile.open( path ).then( function() {
        var contents = htmlize( app.currentFile.contents );
        app.editor.setHTML( contents );
        return path;
      }).then( function( path ) {
        var dir = path.split( "/" ).slice( 0, -1 ).join( "/" );
        var repo = git( dir );
        repo.commits( function( err, commits ) {
          // err if dir isn't a git repo
          if ( err ) {
            git.init( dir, function( err, _repo ) {
              if ( err ) {
                console.warn( "Failed to initialize repo in " + dir );
              }
              app.repo = _repo;
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
      var contents = markdownize( app.editor.getHTML() );
      var actualContents = $( "<div></div>" ).append( $( app.editor.getHTML() ).filter( function( el ) {
        // remove stupid <p><br></p>
        return !( $( this ).children().length === 1 && $( this ).children().first().is( "br" ) );
      }) ).html();

      console.log( actualContents );

      // working on an existing file
      if ( app.currentFile.path ) {
        return app.currentFile.save( contents ).then( function() {
          app.trigger( "fileSaved" );
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
      app.editor.setHTML( "" );
      // app.editor.trigger( "content-changed" );
    },
    commit: function() {
      if ( !app.currentFile.path || !app.repo ) {
        console.warn( "No file or repo!" );
        return;
      }
      var commitMessage = window.prompt( "Please enter a commit message" );
      app.repo.add( app.currentFile.path, function( err ) {
        if ( err ) {
          window.alert( "git add failed! " + err );
          app.trigger( "commitFail" );
          return;
        }
        app.repo.commit( commitMessage, {}, function( err ) {
          if ( err ) {
            window.alert( "git commit failed! " + err );
            app.trigger( "commitFail" );
          } else {
            app.trigger( "commit" );
          }
        });
      });
    },
    push: function() {
      app.repo.remote_push( "origin", "master", function( err, data ) {
        if ( err ) {
          console.warn( "Git push failed." );
          return;
        }
        console.log( "Successful push." );
        app.trigger( "push" );
      });
    }
  });

  app.editor.on( "content-changed", function() {
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
  
  commitButton.click( function() {
    app.actions.commit();
  });

  pushButton.click( function() {
    app.actions.push();
  });

  return app;
};