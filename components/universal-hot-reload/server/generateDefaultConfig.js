import path from 'path';
import nodeExternals from 'webpack-node-externals';

const defaultServerConfig = (serverEntryPath = './src/server.js') => ({
  mode: 'development',
  devtool: 'source-map',
  entry: ['idempotent-babel-polyfill', serverEntryPath],
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve('dist'),
    filename: 'serverBundle.js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      },
    ],
  },
});

export default defaultServerConfig;
