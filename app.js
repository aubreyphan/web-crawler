var fs = require('fs')
, request = require('request')
, cheerio = require('cheerio')
, URL = require('url-parse');

var start_url = 'https://accelerateokanagan.com/';
var url = new URL(start_url);
var base_url = url.protocol + '//' + url.hostname;

var json  = []
, pages   = []
, attr    = [];

//Read website from input.txt
function readFile(callback) {
    fs.readFile('input.txt', 'utf-8', function(err, data) {
        if (err) throw err;
        callback(null, data);
    });
}
readFile(function(err, data) {
    start_url = data;
    console.log('Crawling website: ' + start_url);
})

//App starts
request(start_url, function(error, response, html) {
    if (!error) {
        //Parse the document body
        var $ = cheerio.load(html);
        //collect links of same domain
        var links = $("a[href^='/']");
        //add links to json.url
        links.each(function() {
            let href = base_url + $(this).attr('href');
            //filter duplicates        
            pages.push(href);
            pages = pages.filter(function(item, k, arr) {
                return k == arr.indexOf(item);
            });
        });
        
        pages.map(function(page, index) {
            request(page, function (err, res, body) {
                if (!error) {
                    var $ = cheerio.load(body);
                    var sub_links1 = $("link[href^='/']");
                    var sub_links2 = $("script[src^='/']");
                    var sub_links3 = $("img[src^='/']");

                    sub_links1.each(function() {
                        let href1 = base_url + $(this).attr('href');
                        //filter duplicates        
                        attr.push(href1);
                        attr = attr.filter(function(item, k, arr) {
                            return k == arr.indexOf(item);
                        });
                    });
                    
                    sub_links2.each(function() {
                        let href2 = base_url + $(this).attr('src');
                        //filter duplicates        
                        attr.push(href2);
                        attr = attr.filter(function(item, k, arr) {
                            return k == arr.indexOf(item);
                        });
                    });

                    sub_links3.each(function() {
                        let href3 = base_url + $(this).attr('src');
                        //filter duplicates        
                        attr.push(href3);
                        attr = attr.filter(function(item, k, arr) {
                            return k == arr.indexOf(item);
                        });
                    });

                    json.push(
                        {
                            url: page,
                            assets: attr
                        }
                    );
                }
                fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {
                    if (err) throw err;
                });
            });
        });                                          
    }
    console.log('Successfully written into output.json');
});     




