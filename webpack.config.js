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
    hot: false,
    inline: false,
    liveReload: false,
    disableHostCheck: true,
    port: process.env.PORT,
    public: "camogen.glitch.me",
    // https: true,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
};
