var fs = require('fs')
, request = require('request')
, cheerio = require('cheerio')
, URL = require('url-parse');
//Input URL to crawl in var start_url
var start_url = 'https://www.accelerateokanagan.com/'; 
var url = new URL(start_url);
var base_url = url.protocol + '//' + url.hostname;

var json  = []; //final obj to print into output.json
var pagesVisited = {} //used to avoid link duplicates 
,   pagesToVisit = [] //before filtering link duplicates
,   assets = [];

pagesToVisit.push(start_url);
crawl();
console.log('Crawling website: ' + start_url);
console.log('Written into output.json');

function crawl() {
    var nextPage = pagesToVisit.shift(); 
    if (nextPage in pagesVisited) {
        crawl();
    } else {
        visitPage(nextPage, crawl);
    }
}

function visitPage(url, callback) {
    pagesVisited[url] = true;
    request(url, function(error, response, html) {
        if (!error) {
            //Parse the document body
            var $ = cheerio.load(html);
            collectLinks($);
            json.push(
                {
                    url: url,
                    assets: assets
                }
            );
            //Write obj json to output.json
            fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {
                if (err) throw err;
            });
            //clear assets of previous page
            assets = [];
            callback();
        }
    });
}

function collectLinks($) {
    //collect links of the same domain
    var links = $("a[href^='/']");
    links.each(function() {
        pagesToVisit.push(base_url + $(this).attr('href'));
    });
    //Get static assets of that link
    var sub_links = [];
    sub_links[0] = $("script[src^='/']");
    sub_links[1] = $("img[src^='/']");
    sub_links[2] = $("link[rel^='stylesheet']");

    for(var i=0; i<sub_links.length-1; i++) {
        sub_links[i].each(function(){
            assets.push(base_url + $(this).attr('src'));
        });
    }
    sub_links[2].each(function(){
        assets.push(base_url + $(this).attr('href'));
    });
    //filter duplicated assets
    assets = assets.filter(function(item, k, arr) {
        return k == arr.indexOf(item);
    });
}
