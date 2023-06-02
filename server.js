const express = require('express');
const app = express();
const port = 3000;

//declare webpacks
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');

app.use(webpackMiddleware(webpack(webpackConfig)));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
