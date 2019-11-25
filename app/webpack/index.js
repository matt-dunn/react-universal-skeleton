const UniversalHotReload = require('../../components/universal-hot-reload').default;

const serverConfig = require('./server.config');
const clientConfig = require('./client.config');

UniversalHotReload({ serverConfig, clientConfig });
