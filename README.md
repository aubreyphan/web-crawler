﻿# web-crawler
Crawling a desired URL and returning every reachable page under that domain. For each page, it determines the URL of every static assets (images, scripts, stylesheets). The result is written in JSON format into file output.json. 

Installation: 

- After cloning this project, make sure you have Node.js installed, go to the project folder and  install the required node modules in this app with "npm install" in the console. 
- In file "app.js", you can modify variable "start_url" to any URL you wish. 
- In the console, type in "node app" to run the app
- Check out file "output.json" to see the URLs and static assets returned

