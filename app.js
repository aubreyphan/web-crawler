// var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var start_url = 'https://accelerateokanagan.com/';
var url = new URL(start_url);
var json =  {
        url: '',
        assets: []
};
var pages = [];
var attr = [];
var base_url = url.protocol + '//' + url.hostname;

//App starts
request(start_url, function(error, response, html) {
    if (error) {
        console.log("Error:" + error);
    }
    console.log('Status code: ' + response.statusCode );
    if (response.statusCode === 200) {
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
        pages.map(function(val) {
            json.url = val;
            console.log(json);
        })
        // pages.map(function(val) {
        //     console.log('On page: ' + val);
        //     //Getting static assets
        //     var sub_links = $("img[src^='/']");
        //     getLinks(sub_links, attr, 'src', $);
        // });              
    }
});     


// function getLinks(arr1, arr2, n, $) {
//     arr1.each(function() {
//         let href = base_url + $(this).attr(n);
//         //filter duplicates        
//         arr2.push(href);
//         arr2 = arr2.filter(function(item, k, arr) {
//             return k == arr.indexOf(item);
//         });
//     });
//     console.log(arr2);
    
//     add static assets to json.assets
//     arr2.map(function(val) {
//         console.log('On page: ' + val);
//         //Getting static assets
//         var sub_links = $("img[src^='/']");
//         getLinks(sub_links, attr, 'src', $);
//     });
// }
