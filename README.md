# Parcel Stack

Example using Parcel to bundle app with SSR and server side API calls.

## Features

- [X] Building with *Webpack* 4 and app versioning and tarball
- [X] *es6*+ via *babel* + *typescript*
- [X] *React* with functional components and hooks
- [X] *Redux* with status decoration for async data state
- [X] *React router*
- [X] Styling *SASS* / *CSS* / styled components using *Emotion* with source maps
- [X] SSR
    * *@loadable* for lazy loading
    * *HTTPS*
    * *HTTP/2*
    * *gzip* / *brotli* bundles statically generated and served by express
    * *Helmet* for securing server
    * Routing
    * Async data fetching and processing
- [X] PWA service worker using *workbox* for offline (configured ```passing env.PWA=true```) with manifest generation using webpack
- [X] Progressive enhanced forms based on *Formik*, processed and validated (using *Yup*) on the client and server
- [X] *Markdown* component with *PrismJS* for code syntax highlighting
- [X] Testing with coverage and junit reports using *Jest* and *Enzyme*
- [X] Typescript / ES6+ linting using *eslint*
- [ ] i18n / l10n
- [X] Responsive layouts
- [X] Accessibility including semantic markup and aria
- [X] Client and server HMR using custom component to watch for changes and optimised build for client and server bundles






## Scripts

### Run development _client_ with hot re-loading

```bash
yarn dev:client
```


### Run development _SSR_ with with hot re-load and without compressed assets (gzip/br)

```bash
yarn dev:server
```


### Full production build, running all production tasks

```bash
yarn build
```


### Full production build, running all production tasks with compressed assets (gzip/br), manage versioning and create archive

```bash
yarn build:prod
```


### Run production build without re-build

NOTE: ```yarn build``` must be run first to create the production bundle.

```bash
yarn build:run
```

You can also build and run:

```bash
yarn build && yarn build:run
```


### Install production dependencies and start production build

NOTE: ```yarn build``` must be run first to create the production bundle.

```bash
yarn start
```


### Lint CSS/JS

```bash
yarn lint
```


### Typescript

```bash
yarn type-check
```


### Run all tests

```bash
yarn test
```

#### Run single/specific tests

```bash
yarn test -t '<match>'
```


### Run all tests with coverage

```bash
yarn coverage
```


### Find duplicate modules from webpack stats

```bash
yarn stats:duplicates
```

