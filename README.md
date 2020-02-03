# Universal Skeleton Stack

Example skeleton app using Webpack for build with SSR support and server side asyc API calls.

## Features

- Building with **Webpack 4**, app versioning and tarball
    * **gzip** / **brotli** bundles statically generated
- **es6+** (*babel*), **typescript**
- Typescript / ES6+ linting using **eslint** and plugins
- **React** with functional components and hooks
- Testing + coverage with junit reports using **Jest** and **Enzyme**
- **Redux** with status decoration for async data state
- **React router** with error hooks and auth redirection
- Styling **SASS** / **CSS** / styled components using **Emotion** with source maps
- SSR
    * **@loadable** for lazy loading
    * **HTTPS**
    * **HTTP/2**
    * statically generated and served by express
    * **Helmet** for securing server
    * Routing
    * Async data fetching and processing
- PWA service worker using **workbox** for offline (configured ```passing env.PWA=true```), manifest generation using ebpack
- Progressive enhanced schema generated forms (extending *Formik*), processed and validated (using *Yup*) on the client and server
- i18n / l10n
    * *react-intl* with translation workflow using babel plugin
- Responsive layouts
- Accessibility including semantic markup and aria
- HMR (client) and HR (server) using custom plugins
- Lazy loaded *Markdown* component integrated with *PrismJS* for code syntax highlighting
- Example of [redux style](/state) state implementation




## Scripts

#### Setup

```bash
yarn install
```


#### Run development *client* with HMR

```bash
yarn dev:client
```


#### Run development _SSR_ with with HMR

```bash
yarn dev:server
```


#### Full production build, running all production tasks

```bash
yarn build
```


#### Full production build, running all production tasks + compressed assets (gzip/br), managed versioning and tarball

```bash
yarn build:prod
```


#### Run production build without re-build

```bash
yarn build:run
```

You can also build and run:

```bash
yarn build && yarn build:run
```


#### Run production build from tarball

NOTE: ```yarn build``` must be run first to create the production bundle.

Installs production dependencies and starts production build from tarball

```bash
yarn start
```

#### Other Tasks

##### Lint CSS/JS

```bash
yarn lint
```


##### Typescript

```bash
yarn type-check
```


##### Tests

```bash
yarn test
```

###### Run single/specific tests

```bash
yarn test -t '<match>'
```


###### Run all tests with coverage

```bash
yarn coverage
```

