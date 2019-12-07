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
- [X] i18n / l10n
    * *react-intl* with translation workflow using babel plugin
- [X] Responsive layouts
- [X] Accessibility including semantic markup and aria
- [X] Client and server HMR using custom component to watch for changes and optimised build for client and server bundles






## Scripts

### Setup

```bash
yarn install
```


### Run development *client* with HMR

```bash
yarn dev:client
```


### Run development _SSR_ with with HMR

```bash
yarn dev:server
```


### Full production build, running all production tasks

```bash
yarn build
```


### Full production build, running all production tasks + compressed assets (gzip/br), managed versioning and tarball

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


### Run production build from tarball

NOTE: ```yarn build``` must be run first to create the production bundle.

Installs production dependencies and starts production build from tarball

```bash
yarn start
```

### Other Tasks

#### Lint CSS/JS

```bash
yarn lint
```


#### Typescript

```bash
yarn type-check
```


#### Run all tests

```bash
yarn test
```

##### Run single/specific tests

```bash
yarn test -t '<match>'
```


#### Run all tests with coverage

```bash
yarn coverage
```


#### Find duplicate modules from webpack stats

```bash
yarn stats:duplicates
```
