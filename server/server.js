const express = require("express");
const path = require("path");
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require("fs");
const dirTree = require('directory-tree');

let shader_collection;

function preloadDefaultShaders() {
  const shader_path = path.resolve(__dirname, '../shaders');
  
  shader_collection = dirTree(shader_path, {}, (item, PATH, stats) => {
    if(item.type === 'file') {
      fs.readFile(item.path, 'utf8', (err, data) => {        
        if(err) {
          console.error(err);
        } else {
          // console.log('data', data)
          // item = {...item, data: JSON.parse(data)};
          item.data = JSON.parse(data);
        }
      })
    }
  }); 
    
  console.log('default shaders loaded!', shader_collection)
}

preloadDefaultShaders();

const app = express();

// PWAs want HTTPS!
function checkHttps(request, response, next) {
  // Check the protocol — if http, redirect to https.
  if (request.get("X-Forwarded-Proto").indexOf("https") != -1) {
    return next();
  } else {
    response.redirect("https://" + request.hostname + request.url);
  }
}

app.all("*", checkHttps);

// A test route to make sure the server is up.
app.get("/api/data", (request, response) => {
  console.log("❇️ Received GET request to /api/data");
  response.json({"message": "hello world"});
});

app.get("/api/shaders", (request, response) => {
  response.json({"shader_collection": shader_collection});
});

// Express port-switching logic
let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
}

// proxy is setup both here and in the webpack devServer config
// app.use('/api', createProxyMiddleware(
//   {
//     target: 'http://localhost:3001',
//     changeOrigin: true
//   }
// ));

// Start the listener!
const listener = app.listen(port, () => {
  console.log("❇️ Express server is running on port", listener.address().port);
});
