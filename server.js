const express = require('express');
const app = express();
const port = 3000;

//declare webpacks
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');

// the following line needs to be put before any route definitions to enable webpack middleware
//TODO:  see if this line is required only here since this is the first code that get's executed, or if this line is required before every route definition file
app.use(webpackMiddleware(webpack(webpackConfig)));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
