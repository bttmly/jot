"use strict";

var P = require( "bluebird" );
var fs = require( "fs" );
var $ = require( "jquery" );

P.promisifyAll( fs );

var File = Object.create( require( "events" ).EventEmitter.prototype );

File.path = null;
File.contents = null;

File.open = function( path ) {
  this.path = path;
  this.contents = null;
  return fs.readFileAsync( this.path, "utf-8" ).then( function( contents ) {
    this.contents = contents;
    this.emit( "fileReady" );
  }.bind( this ) );
};

File.save = function( contents ) {
  if ( this.path ) {
    return fs.writeFileAsync( this.path, contents ).then( function() {
      this.emit( "fileSaved" );
    }.bind( this ) );
  } else {
    $( "#saveFile" ).click();
  }
};

File.close = function() {
  this.path = null;
  this.contents = null;
};

module.exports = File;