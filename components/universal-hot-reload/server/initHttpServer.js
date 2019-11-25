/**
 * Starts express, caches and deletes socket references. Does not close the sockets themselves!
 * This is done by the consumer of this function in this case the watchServerChanges function.
 * Returns the httpServer object and all sockets in a Map.
 * @param serverBundlePath Path to the server bundle file where the express server was started by calling .listen().
 * @returns {{httpServer: *, sockets: Map}} when server bundle has no errors. Returns null when server bundle contains errors.
 */
const initHttpServer = serverBundlePath => {
  let httpServer;

  try {
    httpServer = require(serverBundlePath).default; //eslint-disable-line
  } catch (e) {
    console.log(e);
    return null;
  }

  const sockets = new Map();
  let nextSocketId = 0;

  // Inspired by Golo Roden's answer in:
  // http://stackoverflow.com/questions/14626636/how-do-i-shutdown-a-node-js-https-server-immediately
  httpServer.on('connection', socket => {
    const socketId = nextSocketId++;
    sockets.set(socketId, socket);

    socket.on('close', () => {
      sockets.delete(socketId);
    });
  });

  return { httpServer, sockets };
};

export default initHttpServer;
