var github = require( "octonode" );
var Bluebird = require( "bluebird" );
Bluebird.promisifyAll( github );
module.exports = github;