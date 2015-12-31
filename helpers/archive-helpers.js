var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http-request');


/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  index: path.join(__dirname, '../web/public/index.html'),
  test: path.join(__dirname, '../test/testdata/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!
var urls = [];


exports.readListOfUrls = function(callback){

  if(!callback){
    callback = function(){};
  }
  
  console.log('reading list of URLS');

  fs.readFile(exports.paths.test, function read(err, data) {
    if (err) {
      console.log("Error reading sites.txt file:", exports.paths.test);
    }
    console.log("this is the data:",data.toString());
    urls = data.toString().split('\n');

    console.log("Reading Data from the file: ", urls);
    callback(urls);
  });

  
};

exports.isUrlInList = function(url,callback){
  
  if(!callback){
    callback = function(){};
  }  
  
  exports.readListOfUrls();

  for (var i=0; i<urls.length;i++) {
    if(url === urls[i]){
      callback(true);
    }
  }
  callback(false);
};


exports.addUrlToList = function(url, callback){

  if(!callback){
    callback = function(){};
  }

  fs.appendFile(exports.paths.test, url + "\n", function (err) {

    if (err) {
      console.log(err);
    } else {
      console.log('The "data to append" was appended to file!');
      callback();
    }
  });
};

exports.isUrlArchived = function(url, callback){
    
  if(!callback){
    callback = function(){};
  }

  fs.stat(path.join(exports.paths.archivedSites,url),function(err,stats){
    if(err){
      console.log(err);
      callback(false);
    }else{
      console.log(stats.isFile());
      callback(true);  
    }
  });

};

exports.downloadUrls = function(urlArray){

  for (var i = 0; i < urlArray.length; i++) {

    console.log("Downloading .... ", urlArray[i]);

    // Solution
    // request('http://' + url[i]).pipe(fs.createWriteStream(exports.paths.archivedSites + "/" + url[i]));

    http.get(urlArray[i], function (err, res) {
      
      var url = this.toString();

      if (err) {
        console.error(err);
        return;
      }      
      console.log("urlArray=",urlArray[i]);

      //console.log("here is all the data:",res,err);
      //console.log("this",this.toString());
      console.log(res.buffer.toString());
      console.log('got site, saving to', path.join(exports.paths.archivedSites,url));

      fs.writeFile(path.join(exports.paths.archivedSites,url), res.buffer.toString(), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
      }); 

    }.bind(urlArray[i]));

  }

}