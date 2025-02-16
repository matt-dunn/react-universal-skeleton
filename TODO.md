# TODO:

- [X] Compress SSR html
- [ ] Globalization - i18n + l10n
    - best practices
    - l18next?
    - runtime replacement vs build time
- [ ] Project organisation options
    - look at create-react-app and other bootstraps
    - redux
    - ducks
- [X] Look into full HMR again...
    - issue previously with lazy loaded components? or using hashes in dev?
        - FIXED - the loadable factory was returning a new version each HR which caused infinite loop - hoisted into constants in App.jsx
- [ ] Optimise build / webpack config to increase performance
- [ ] devServer config - watch options?
- [ ] Source maps
    - [ ] Server
    - [X] Client
    - [ ] Debugging and getting the correct line for styles server + client fot JS (e.g. errors) and CSS
- [ ] HardSourceWebpackPlugin
    - can this also be used and is it worth it?
    - is it still properly supported and/or are there alternatives
- [ ] How efficient is express + react render?
    - Would a more robust / scalable solution need to be used in a mid/high traffic env? e.g https://github.com/airbnb/hypernova
    - Scalable server rendering




#### Hot SSR

- [X] sass-loader (Error: Module did not self-register) when updating SASS with HR - fixed by explicitly setting the 'implementation' options on sass-loader
- [X] Refactor to remove hard-coded public protocol / host / port in configs and universal-hot-reload
- [X] Review package scripts to optimise for:
    - Dev client only with HR
    - Dev client/server with HR
    - Server without HR
    - Prod with br/gzip assets and static server
- [X] Use hash for output when prod
- [X] Use dist/client/index.html for prod (as it's processed fully) OR can I use the dist version as before if the HTML loader
    can always write to disk? (https://github.com/jantimon/html-webpack-harddisk-plugin) - outputed index.html for both client _and_ server
- [X] Can use helmet in server/index.js? - in production build



#### Webpack
- [ ] Manifest
- [ ] Include bundle manifest in tarball?
- [X] Optimising webpack config shared across dev/prod + client/server
- [X] remove hardcoded 'dist'
- [X] lazy loading
    - components
    - show loading/error
- [ ] hot reload issues + better/faster support for server
    - [X] reload
    - [ ] reload keeping app state
- [X] @loadable/component TS issue - loadable is changed during transpile which means it does not work directly with TS
    - just use babel to transform TS instead of ts-loader

#### Styled components
- [X] Integration with CSS frameworks
- [X] vs SASS
- [X] Extracting into external CSS files (at least for global styles) and is this desirable?
- [ ] Performance
    * production build has pre-compiled CSS?
    * how much JS is needed in production and what impact will it have if other styling libraries have also been used?
- [X] Style reuse / sharing

#### Parcel
- [ ] Comparison to other bundlers
- [X] Configure aliases which work client and server
    - use babel-plugin-module-resolver
    - how to get it to work with IDE...?
- [=] maps and debug lines
- [=] babelrc config issues
    * Does not pick up the correct env config from BABEL_ENV in dev??
- [=] Hot-reloading
    * Does not seem to work correctly with TS files?
    * When running in server mode?

#### SSR
- [X] API calls on server options
- [X] https://github.com/ctrlplusb/react-tree-walker instead of a render?
- [X] Use https://github.com/smooth-code/loadable-components instead

#### Build
- [X] Setup linting
- [X] Run tests with coverage as part of production build

#### Routing with react-router
- [X] 404
- [X] Handle redirects to login when auth fails
- [X] 403

#### Features
- [ ] Suspense
    - With action promises
- [ ] Error boundaries
    - With action promises
        


##### Priority:

- [ ] Understand the magic of useEffect
    - it seems to call the cb every time until the promise has fullfilled?
- [ ] Error boundaries
    - use for authentication and for handing server errors and redirects (e.g. 401)?
    - SSR?
- [ ] Suspense
    - Use cases and does it _really_ expect promises to be thrown instead of errors??
  
    
    
    
