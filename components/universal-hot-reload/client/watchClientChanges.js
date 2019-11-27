import url from "url";
import webpack from "webpack";
import webpackDevServer from "webpack-dev-server";

/**
 * Start webpack dev server for hmr
 */
const watchClientChanges = clientConfig => {
  const { publicPath } = clientConfig.output;

  if (!publicPath) {
    throw new Error("Missing publicPath config, e.g. 'process.env.PUBLIC_PATH=https://0.0.0.0:1234/'");
  }

  const { protocol, host, port, hostname } = url.parse(publicPath);
  const webpackDevServerUrl = `${protocol}//${host}`;

  const { entry, plugins } = clientConfig;
  const hmrEntries = [
    `${require.resolve("webpack-dev-server/client/")}?${webpackDevServerUrl}`,
    require.resolve("webpack/hot/dev-server"),
  ];
  if (entry.push) {
    clientConfig.entry = entry.concat(hmrEntries); // eslint-disable-line
  } else {
    clientConfig.entry = [entry, ...hmrEntries]; // eslint-disable-line
  }

  const hmrPlugin = new webpack.HotModuleReplacementPlugin();
  if (!plugins) {
    clientConfig.plugins = [hmrPlugin]; // eslint-disable-line
  } else {
    plugins.push(hmrPlugin);
  }

  const compiler = webpack(clientConfig);
  const devServerOptions = clientConfig.devServer || {
    quiet: false, // don’t output anything to the console.
    noInfo: false, // suppress boring information
    lazy: false, // no watching, compiles on request
    publicPath,
    stats: "errors-only",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    hot: true,
    sockPort: port,
  };

  const server = new webpackDevServer(compiler, devServerOptions);
  server.listen(port, hostname, () => {
    console.log(`Starting webpack-dev-server on ${webpackDevServerUrl}`);
  });
};

export default watchClientChanges;
