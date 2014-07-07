var nodegit = require( "nodegit" );
var Bluebird = require( "bluebird" );
Bluebird.promisifyAll( nodegit );
module.exports = nodegit;