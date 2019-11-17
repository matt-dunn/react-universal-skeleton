# Parcel Stack

Example using Parcel to bundle app with SSR and server side API calls.

## Commands

Run *client* with hot re-loading

```
yarn client
```

Run with SSR and reloading with full re-load without compressed assets (gzip/br)
```
yarn server
```

Just run the SSR server without build
```
yarn server:run
```

Full production build, running all production tasks with compressed assets (gzip/br)

```
yarn prod
```

Lint CSS/JS

```
yarn lint
```

Typescript

```
yarn type-check
```

Run all tests

```
yarn test
```

Run single/specific tests

```
yarn test -t '<match>'
```

Run all tests with coverage

```
yarn coverage
```


### TODO:

#### Webpack
- [ ] Source maps
    [ ] Server
    [X] Client
- [ ] Optimising webpack config shared across dev/prod + client/server
- [ ] remove hardcoded 'dist'
- [X] lazy loading
    - components
    - show loading/error
- [ ] hot reload issues + better/faster support for server
    - [X] reload
    - [ ] reload keeping app state
- [X] @loadable/component TS issue - loadable is changed during transpile which means it does not work directly with TS
    - just use babel to transform TS instead of ts-loader

#### Styled components
- [ ] Integration with CSS frameworks
- [ ] vs SASS
- [ ] Extracting into external CSS files (at least for global styles) and is this desirable?
- [ ] Performance
    * production build has pre-compiled CSS?
    * how much JS is needed in production and what impact will it have if other styling libraries have also been used?
- [ ] Debugging and getting the correct line for styles
- [ ] Style reuse / sharing

#### Parcel
- [ ] Comparison to other bundlers
- [*] Configure aliases which work client and server
    - use babel-plugin-module-resolver
    - how to get it to work with IDE...?
- [ ] maps and debug lines
- [ ] babelrc config issues
    * Does not pick up the correct env config from BABEL_ENV in dev??
- [ ] Hot-reloading
    * Does not seem to work correctly with TS files?
    * When running in server mode?

#### SSR
- [ ] API calls on server options
- [ ] https://github.com/ctrlplusb/react-tree-walker instead of a render?
- [ ] Use https://github.com/smooth-code/loadable-components instead
- [ ] How efficient is express + react render? Would a more robust / scalable solution need to be used in a mid/high traffic env? e.g https://github.com/airbnb/hypernova

#### Build
- [ ] Setup linting
- [ ] Run tests with coverage as part of production build

#### Routing with react-router
- [ ] 404
- [ ] Handle redirects to login when auth fails
- [ ] 403

#### Features
- [ ] Suspense
    - With action promises
- [ ] Error boundaries
    - With action promises
        


##### Priority:

1. Understand the magic of useEffect
    - it seems to call the cb every time until the promise has fullfilled?
2. Error boundaries
    - use for authentication and for handing server errors and redirects (e.g. 401)?
3. Suspense
    - Use cases and does it _really_ expect promises to be thrown instead of errors??
4. Hot-reloading (above)
5. Scalable server rendering (above)
  
    
    
    
