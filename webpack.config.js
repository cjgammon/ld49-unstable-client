const path = require('path');
var webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const autoprefixer = require('autoprefixer');
var WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;
const Dotenv = require('dotenv-webpack');

let config = {
  context: __dirname,
  entry: './src/scripts/index.tsx',
  devServer: {
    https: true,
    port: 9000,
    host: 'localhost',
    historyApiFallback: true,
  },
  devtool: "source-map",
  module: {
      rules: [
        {
          test: /\.worker\.ts$/,
          use: 'worker-loader'
        },
        {
          test: /\.html$/,
          use: [{
            loader: 'html-loader',
            options: {
              interpolate: true
            }
          }],
          exclude: /node_modules/
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.ganvas$/i,
          use: 'json-loader',
        },
        {
          test: /\.gv$/i,
          use: 'json-loader',
        },
        {
          test: /\.css$/,
          use: [{
              loader: 'style-loader'
          }, {
              loader: 'css-loader',
              options: { 
                sourceMap: true, 
                importLoaders: 1 
              }
          }, {
              loader: 'postcss-loader',
              options: { plugins: [ autoprefixer({Browserslist: 'last 2 versions'}) ] }
          }]
        },
        {
          test: /\.less$/,
          use: [{
              loader: 'style-loader'
          }, {
              loader: 'css-loader',
              options: { 
                sourceMap: true, 
                importLoaders: 1,
                modules: true
              }
          }, {
              loader: 'postcss-loader',
              options: { 
                sourceMap: true, 
                plugins: [ autoprefixer({Browserslist: 'last 2 versions'}) ] 
              }
          }, {
              loader: 'less-loader',
              options: { 
                sourceMap: true,
              }
          }, {
            loader: 'typed-css-modules-loader'
          }] 
        },
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader'
        }
      ],
  },
  resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        src: path.resolve(__dirname, './src/'),
        assets: path.resolve(__dirname, './src/assets/'),
        scripts: path.resolve(__dirname, './src/scripts/'),
        ccLibraries: path.resolve(__dirname, './src/scripts/lib/cc-libraries-api.js')
      },
      fallback: {
        stream: require.resolve("stream-browserify"),
        crypto: require.resolve("crypto-browserify"),
        https: require.resolve("https-browserify"),
        http: require.resolve("stream-http"),
      }
  },
  output: {
      filename: '[name].min.js',
      path: path.resolve(__dirname, '../ld49-unstable/public/'),
      publicPath: '/'
  }
}

module.exports = environment => {

  //let env = environment ? environment.name || 'dev' : 'dev';
  let env = 'dev';
  config.mode = env == 'dev' ? 'development' : 'production';
  //config.mode = 'development'; //NOTE:: production fails??
  console.log('ENV:', env);

  config.plugins = [
    new Dotenv(),
    new WebpackBundleSizeAnalyzerPlugin('./reports/plain-report.txt'),
    new HtmlWebpackPlugin({
      title: 'LDJAM',
      template: path.resolve(__dirname, 'src', 'index.ejs'),
      env: env
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/assets',
        to: 'assets'
      },   
      {
        from: 'src/favicon.ico',
        to: 'favicon.ico'
      }
    ])
  ];
  
  if (env !== 'dev') {
    config.optimization = {
      splitChunks: {
        chunks: 'all',
      },
      minimize: true,
      minimizer: [new TerserPlugin()]
    };
  }
  
  return config;
}
