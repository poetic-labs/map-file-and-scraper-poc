var path = require('path');
var mapFilePath = path.resolve('map-file.json');
var mapFile = require(mapFilePath);
var url = 'http://app-ypo-v3.webflow.io/';
var scraper = require('website-scraper');
var fs = require('fs');

console.log(typeof mapFile);
console.log(mapFile.URLS);

// be very careful with this function
var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;

      if(fs.lstatSync(curPath).isDirectory()) { // recursion
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });

    fs.rmdirSync(path);
  }
};

deleteFolderRecursive('./webflow');

// Downloads all the crawlable files of example.com.
// The files are saved in the same structure as the structure of the website, by using the `bySiteStructure` filenameGenerator.
// Links to other websites are filtered out by the urlFilter

// scraper.scrape({
  // urls: [url],
  // urlFilter: function(url){
      // return url.indexOf(url) === 0;
  // },
  // recursive: true,
  // maxDepth: 100,
  // prettifyUrls: true,
  // filenameGenerator: 'bySiteStructure',
  // directory: './webflow'
// }).then(console.log).catch(console.log);

// Get site by page name
scraper.scrape({
  urls: [
    url,   // Will be saved with default filename 'index.html'
    {url: url + '/about-developer', filename: 'about-developer.html'},
    {url: url + '/users', filename: 'users.html'},
    {url: url + '/events', filename: 'events.html'},
  ],
  urlFilter: function(url){
      return url.indexOf(url) === 0;
  },
  directory: './webflow',
  subdirectories: [
    {directory: 'img', extensions: ['.jpg', '.png', '.svg']},
    {directory: 'js', extensions: ['.js']},
    {directory: 'css', extensions: ['.css']}
  ],
  sources: [
    {selector: 'img', attr: 'src'},
    {selector: 'link[rel="stylesheet"]', attr: 'href'},
    {selector: 'script', attr: 'src'}
  ],
  request: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 4 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19'
    }
  }
}).then(function (result) {
  console.log(result);
}).catch(function(err){
  console.log(err);
});
