const path = require('path');
const nodeExternals = require("webpack-node-externals");
const LicenseWebpackPlugin = require("license-webpack-plugin").LicenseWebpackPlugin;

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    library: 'UJS',
    libraryTarget: 'var',
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist-browser'),
  },
  plugins: [
    new LicenseWebpackPlugin({
      outputFilename: 'licenses.txt'
    })
  ]
};