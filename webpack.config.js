const path = require(`path`);
const webpack = require(`webpack`);
const CopyWebpackPlugin = require(`copy-webpack-plugin`);

const copy = new CopyWebpackPlugin([{
  from: `./src`,
  to: `./`
}], {
  ignore: [
    `.DS_Store`
  ]
});

module.exports = {
  entry: {
    script: './src/js/script.js',
    controller: './src/js/controller.js'
  },

  output: {
    path: path.resolve(`./server/public`),
    filename: `js/[name].js`
  },

  devtool: 'inline-source-map',

  plugins: [
    copy
  ]
};
