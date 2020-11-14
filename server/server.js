const express = require("express");
const app = express();
const path = require("path");

// // make all the files in 'public' available
// // https://expressjs.com/en/starter/static-files.html1
// app.use(express.static("public"));

// // https://expressjs.com/en/starter/basic-routing.html
// app.get("/", (request, response) => {
//   response.sendFile(__dirname + "/views/index.html");
// });

// // send the default array of dreams to the webpage
app.get("/api/data", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json({"message": "hello world"});
});

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

const listener = app.listen(port, () => {
  console.log("❇️ Express server is running on port", listener.address().port);
});