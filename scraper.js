var path = require('path');
var scraper = require('website-scraper');
var fs = require('fs');

var mapFilePath = path.resolve('map-file.json');
var mapFile = require(mapFilePath);

console.log(mapFile);

// The scraper below copies an entire site according to the given specifications
// and writes to an output dir. That dir can't be overwriting another dir, so we
// must remove /webflow before running each time

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

// Get site by page url from mapFile
var mapFileUrls = mapFile.pages.map(function(page) {
  return { url: page.url, filename: page.filename };
});

// scrape each url and write to webflow/
scraper.scrape({
  urls: mapFileUrls,
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
