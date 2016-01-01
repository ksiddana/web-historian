var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var http = require('./http-helpers.js');
// require more modules/folders here!


//request handler does not serve stlyes.css or loading.html!!!


exports.handleRequest = function (request, response) {

  console.log("Request Method, ", request.method);
  
  //handle requests from the index file
  if ( (request.url === '/' || request.url === '/index.html') && request.method === 'POST') {

    console.log("Recieving POST Request");
    var completeData = '';
    
    request.on('data', function(data) {
      console.log("Reciving Data:", data);
      completeData += data;
    });

    request.on('end', function() {
      
      //console.log("***********", completeData, request.headers);

      if(request.headers['content-type'] === 'application/x-www-form-urlencoded'){
        var formData = completeData.toString().split("=");
        console.log('received a form submission!',formData)
        completeData =  {url:formData[1]};
      }else{
        completeData = JSON.parse(completeData);
      }

      
      //TO PASS TESTS, UNCOMMENT
      // http.saveAssets(request, completeData,function(){
      //   http.sendResponse(response,'Saved file url and downloading your requested url', 302);
      // });

      // BELOW IS CODE FOR REDIRECTING IN BASIC REQUIREMENTS
      // COMMENT BELOW DATA, TO GET THE TESTS TO PASS
      archive.isUrlArchived(completeData.url, function(fileExists) {
          
          if (fileExists) {
            console.log("URL exists in Archive. Redirecting to", 'http://127.0.0.1:8080/' + completeData.url);
            http.sendResponse(response,'Redirect', 307,{Location: 'http://127.0.0.1:8080/' + completeData.url});
          }else{
            console.log('URL does NOT exist in Archive');

            http.saveAssets(request, completeData,function(){
              archive.downloadUrls([completeData.url]);
              //http.sendResponse(response,'Saved file url and downloading your requested url', 302);
              http.sendResponse(response,'Redirect', 307,{Location: 'http://127.0.0.1:8080/loading.html'});

            });
          }
      });


    });

  } else {
    //handle any other request, to serve a file
    console.log('dropped through!');

    //site asset folder

    if(request.url === '/' ){
      http.serveAssets(response, path.join(archive.paths.index), function(){
        console.log('not found');
        http.sendResponse(response,'Not found!',404);
      });
    }
    else if(request.url === '/index.html' || request.url === '/loading.html' || request.url === '/styles.css'){
      http.serveAssets(response, path.join(archive.paths.siteAssets, request.url), function(){
        console.log('not found');
        http.sendResponse(response,'Not found!',404);
      });
    }else{
      //archived sites
      http.serveAssets(response, path.join(archive.paths.archivedSites, request.url), function(){
        console.log('not found');
        http.sendResponse(response,'Not found!',404);
      }); 
    }
  }
    console.log(request.url); 
};
