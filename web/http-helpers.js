var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var _ = require('underscore');

var headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

// As you progress, keep thinking about what helper functions you can put here!
exports.sendResponse = function(response, data, statusCode, extraHeaders){
  
  var sentHeaders = {};

  _.extend(sentHeaders,headers,extraHeaders);

  response.writeHead(statusCode,sentHeaders);
  console.log('sending with headers',sentHeaders);
  response.end(JSON.stringify(data));

}

exports.serveAssets = function(response, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  

  console.log('serving assets');

  response.writeHead(200,headers);
  var readStream = fs.createReadStream(asset)

  readStream.on('error', function(err) {
    console.log('error serving file ' + asset);
    exports.sendResponse(response,err,404);
  });

  readStream.on('open', function () {
    console.log('serving file!');
    readStream.pipe(response);
  });
  
};

exports.saveAssets = function(response, asset, callback) {

  if(!callback){
    callback = function(){};
  }
  
  console.log("Saving Asssest:", JSON.stringify(asset) + "\n", "to: ", archive.paths.archivedList, archive.paths.test);

  fs.appendFile(archive.paths.test, asset.url + "\n", function (err) {

    fs.appendFile(archive.paths.archivedList, asset.url + "\n", function (err) {

        if (err) {
          console.log('oh shit!', archive.paths.archivedList, asset.url + "\n");
          console.log(err);
        } else {
          console.log('The "data to append" was appended to file!');
        }
        callback();
    });
  
  });

}


  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)

