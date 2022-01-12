const path = require('path');
 
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'www'),
    filename: 'js/index.bundle.js',
  },
  devtool: 'inline-source-map',
};