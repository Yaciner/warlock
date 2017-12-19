const path = require(`path`);
const webpack = require(`webpack`);
const CopyWebpackPlugin = require(`copy-webpack-plugin`);
const {UglifyJsPlugin} = webpack.optimize;
const ExtractTextWebpackPlugin = require(`extract-text-webpack-plugin`);
const extractCSS = new ExtractTextWebpackPlugin(`css/style.css`);

const copy = new CopyWebpackPlugin([{
  from: `./src/assets`,
  to: `./assets`
}, {
  from: `./src/**.html`,
  to: `./`,
  flatten: true
}, {
  from: `./src/css/**.css`,
  to: `./css`,
  flatten: true
},
{
  from: `./src/js/lib`,
  to: `./js/lib`
}], {
  ignore: [
    `.DS_Store`
  ]
});

module.exports = {
  entry: {
    script: `./src/js/script.js`,
    controller: `./src/js/controller.js`
    // style: `./src/css/style.css`
  },

  resolve: {
    extensions: [
      `.js`
      // `.css`
    ]
  },

  output: {
    path: path.resolve(`./server/public`),
    filename: `js/[name].js`
  },

  devtool: `inline-source-map`,

  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: `babel-loader`
      },
      {
        test: /\.html$/,
        loader: `html-loader`,
        options: {
          attrs: [
            `audio:src`,
            `img:src`,
            `video:src`,
            `source:srcset`
          ]
        }
      },
      {
        test: /\.css$/,
        loader: extractCSS.extract([
          {
            loader: `css-loader`,
            options: {
              importLoaders: 1
            }
          },
          {
            loader: `postcss-loader`
          }
        ])
      },
      {
        test: /\.(svg|png|jpe?g|gif|webp)$/,
        loader: `url-loader`,
        options: {
          limit: 1000, // inline if < 1 kb
          context: `./src`,
          name: `[path][name].[ext]`
        }
      }

    ]
  },

  plugins: [
    copy,
    new UglifyJsPlugin({
      sourceMap: true,
      comments: false
    }),
    extractCSS
  ]
};
