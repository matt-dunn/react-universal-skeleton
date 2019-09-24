# Parcel Stack

Example using Parcel to bundle app with SSR and server side API calls.


#### TODO:

* Styled components
    [ ] Integration with CSS frameworks
    [ ] vs SASS
    [ ] Extracting into external CSS files (at least for global styles) and is this desirable?
    [ ] Performance
        * production build has pre-compiled CSS?
        * how much JS is needed in production and what impact will it have if other styling libraries have also been used?
    [ ] Debugging and getting the correct line for styles
    [ ] Style reuse / sharing
* Parcel
    [ ] Comparison to other bundlers
    [*] Configure aliases which work client and server
        - use babel-plugin-module-resolver
    [ ] maps and debug lines
    [ ] babelrc config issues
        * Does not pick up the correct env config from BABEL_ENV in dev??
    [ ] Hot-reloading
        * Does not seem to work correctly with TS files?
        * When running in server mode?
* SSR
    [ ] API calls on server options
    [ ] Use https://github.com/smooth-code/loadable-components instead
    [ ] How efficient is express + react render? Would a more robust / scalable solution need to be used in a mid/high traffic env? e.g https://github.com/airbnb/hypernova
* Build
    [ ] Setup linting
    [ ] Run tests with coverage as part of production build
    [ ] 
* Routing with react-router
    [ ] 404
    [ ] Handle redirects to login when auth fails
    [ ] 403
    
        
    
    
    
    
