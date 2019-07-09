const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
/*var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
     })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
     });*/

module.exports = {
  entry: path.resolve(__dirname, 'src') + '/app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist') + '/bundled',
    filename: 'bundle.js',
    //publicPath: '/bundled/'
  },
  //  externals: nodeModules,
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react', ['es2015', { "modules": false }]],
              plugins: ['transform-class-properties']
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader','sass-loader']
        })
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
      {
      test: /\.woff$/,
      loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]"
    }, {
      test: /\.woff2$/,
      loader: "url-loader?limit=10000&mimetype=application/font-woff2&name=[path][name].[ext]"
    }, {
      test: /\.(eot|ttf|svg|gif|png)$/,
      loader: "file-loader"
    }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Chat Application',
      hash: true,
      template: './src/index_chat.ejs'
      /*minify: {
          collapseWhitespace: true
      }*/
    }),
    new ExtractTextPlugin('style.css')
  ]
};
