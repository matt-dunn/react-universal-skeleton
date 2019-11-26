/**
 * Clear bundled server cache
 * @param serverBundlePath Path to the server bundle file.
 */
const clearRequireCache = serverBundlePath => {
  const cacheIds = Object.keys(require.cache);

  // eslint-disable-next-line no-restricted-syntax
  for (const id of cacheIds) {
    // if (id === serverBundlePath || id.indexOf("/dist/") !== -1) {
    //   delete require.cache[id];
    //   // return;
    // }
    delete require.cache[id];
  }
};

export default clearRequireCache;
