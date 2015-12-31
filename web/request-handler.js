var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var http = require('./http-helpers.js');
// require more modules/folders here!

exports.handleRequest = function (request, response) {
  // res.end(archive.paths.index);
  console.log("Request Method, ", request.method);
  if (request.url === '/' && request.method === 'GET') {

    http.serveAssets(response, archive.paths.index);
    // var readStream = fs.createReadStream(archive.paths.index);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    
  }
  else if ( request.url === '/' && request.method === 'POST') {
    console.log("Recieving POST Request");
    var completeData = '';
    
    request.on('data', function(data) {
      console.log("Reciving Data:", data);
      completeData += data;
    });


    archive.isUrlArchived(request.url, function(fileExists) {
      if (fileExists) {
        // archive.TO DO://
      }
    })

    request.on('end', function() {
      http.saveAssets(request, JSON.parse(completeData));
      http.sendResponse(response,'Saved file url', 302);

    });

  } else {

    http.serveAssets(response, path.join(archive.paths.archivedSites, request.url), function(){
      console.log('not found');
      http.sendResponse(response,'Not found!',404);
    }); 
  }
    console.log(request.url); 
};
