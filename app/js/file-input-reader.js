"use strict";

var app = require( "../js/app.js" );

var $ = require( "jquery" );

var saveButton = $( "#saveButton" );
var openButton = $( "#openButton" );
var saveFile = $( "#saveFile" );
var openFile = $( "#openFile" );

var editor = $( "#editor" );

openButton.click( function() {
  openFile.click();
});

saveButton.click( function() {
  saveFile.click();
});

openFile.change( function() {
  $( "#path" ).html( this.value );
  app.currentFile.open( this.value ).then( function() {
    $( "#editor" ).html( app.currentFile.contents );
  });
});


