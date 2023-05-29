//this is the webpack config file, this file needs to be created to tell webpack what to do

const path = require('path');

module.exports = {
  entry: './index.js', //our actual (javascript) entry point is index.js
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'), // bundled script is set to output to bundle.js in public folder, this single script is called by index.html. express has been set up to provide static files so server provides bundle.js to client
    // exclude bundle.js in gitignore since it is an everchanging file
  },
};

//step 3: is to run > npx webpack
//this will have webpack parse the project and generate the bundle.js
//nodemon also takes care of automatically parsing any changes for webpack.
//wait a moment after it says 'Listening to server at port'.
//it will print webpack results, then execute localhost in browser to run app

