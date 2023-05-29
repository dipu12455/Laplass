const express = require('express');
const app = express();
const port = 3000;

//step1:  we are using a webpack middleware
// ran into problems with how to have client download pixijs files instead of using CDN
// using webpack, this middleware will scan all imports required then bundle them together in a single javascript file called bundle.js
// the index.html, which is the page that client browser opens first, references this bundle.js.
// there is such a thing called a javascript entry-point index.js. Think of it as the first javascript file needed to be opened after index.html is loaded.
// if webpack was out of the picture, index.html would have referenced index.js code instead.
// webpack sees that index.js contains import from pixi.js
// even though pixi.js resides in node_modules, the server side js file would have seen that with just 'pixi.js' without requiring any ./ or /
// after webpack sees that import, then it knows what needs to be bundled and provided to client
// so now, index.html on client side has all necessary js libraries to render anything, libraries from pixi.js to game engines to game class, etc.

//declare webpacks
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');

// the following line needs to be put before any route definitions to enable webpack middleware
//TODO:  see if this line is required only here since this is the first code that get's executed, or if this line is required before every route definition file
app.use(webpackMiddleware(webpack(webpackConfig)));
//step 2 of webpack, goto webpack.config.js

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
