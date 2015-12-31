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

    request.on('end', function() {
      
      completeData = JSON.parse(completeData);

      console.log("***********", completeData);
      
      //TO PASS TESTS, UNCOMMENT
      // http.saveAssets(request, completeData,function(){
      //   http.sendResponse(response,'Saved file url and downloading your requested url', 302);
      // });

      // BELOW IS CODE FOR REDIRECTING IN BASIC REQUIREMENTS
      // COMMENT BELOW DATA, TO GET THE TESTS TO PASS
      archive.isUrlArchived(completeData.url, function(fileExists) {
          
          if (fileExists) {
            console.log("URL exists in Archive");
            http.sendResponse(response,'Redirect', 307,{Location: 'http://127.0.0.1:8080' + completeData.url});
          }else{
            console.log('URL does NOT exist in Archive');

            http.saveAssets(request, completeData,function(){
              archive.downloadUrls([completeData.url]);
              http.sendResponse(response,'Saved file url and downloading your requested url', 302);

            });
          }
      });


    });

  } else {

    http.serveAssets(response, path.join(archive.paths.archivedSites, request.url), function(){
      console.log('not found');
      http.sendResponse(response,'Not found!',404);
    }); 
  }
    console.log(request.url); 
};
