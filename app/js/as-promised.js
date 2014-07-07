"use strict";

var Bluebird = require( "bluebird" );

module.exports = function( moduleToPromisify ) {
  var importedModule;
  if ( typeof moduleToPromisify === "string" ) {
    importedModule = require( moduleToPromisify );
  } else {
    importedModule = moduleToPromisify;
  }
  return Bluebird.promisifyAll( importedModule );
};