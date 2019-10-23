module.exports =
    process.browser
        ? require('./Grid.client')
        : require('./Grid.server');
