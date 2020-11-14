const path = require("path");
const HTMLwebpackplugin = require("html-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, "src", "index.js"),
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "build")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/i,
        // exclude: /node_modules/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new HTMLwebpackplugin({
      template: "./public/index.html"
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, "public"),
    publicPath: "/",
    overlay: true,
    compress: true,
    // noInfo: true,
    hot: true,
    disableHostCheck: true,
    port: process.env.PORT,
    public: "0.0.0.0:" + process.env.PORT
  }
};
