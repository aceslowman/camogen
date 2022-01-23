const express = require("express");
const path = require("path");
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require("fs");
const dirTree = require('directory-tree');
const app = express(); 
const { nanoid } = require('nanoid');
 
let shader_collection;   
  
/* TODO: should rely on camo.collection files */
function preloadDefaultShaders() {
  const shader_path = path.resolve(__dirname, '../shaders');
   
  shader_collection = dirTree(shader_path, {}, 
    file => {    // files    
      file.id = nanoid();
      fs.readFile(file.path, 'utf8', (err, data) => {        
        if(err) {
          console.error(err);  
        } else {  
          file.data = JSON.parse(data);
        } 
      })       
    },
    dir => {    // directories
      dir.id = nanoid(); 
    },
  );  
   
  shader_collection.id = 'default-collection_'+nanoid();
}   

preloadDefaultShaders();

// function checkHttps(req, res, next){
//   // protocol check, if http, redirect to https
//   if(req.get('X-Forwarded-Proto').indexOf("https")!=-1){
//     return next()
//   } else {
//     res.redirect('https://' + req.hostname + req.url);
//   }
// }

// app.all("*", checkHttps);

app.get("/api/shaders", (request, response) => {
  response.json(shader_collection);
});

port = 3001;

const listener = app.listen(port, () => {
  console.log("camogen server is running on port", listener.address().port);
});
