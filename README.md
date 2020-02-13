# Universal Skeleton Stack

Example skeleton app using Webpack for build with SSR support and server side asyc API calls.

## Features

- Building with **Webpack 4**, app versioning and tarball
    * **gzip** / **brotli** bundles statically generated
- **es6+** (*babel*), **typescript**
- Typescript / ES6+ linting using **eslint** and plugins
- **React** with functional components and hooks
- Testing + coverage with junit reports using **Jest** and **Enzyme**
- **Redux** with action creators and status decoration for async action creators using **Redux-Saga**
- **React router** with error hooks and rewrite and redirect and authentication
- Styling with **SASS** / **CSS** / styled components using **Emotion** with source maps
- SSR
    * **@loadable** for lazy loading and code splitting
    * Serve statically generated compressed assets if available
    * **Helmet** for securing server
    * Routing with rewrite and redirect
    * Async data fetching and processing
    * **HTTPS**
    * **HTTP/2**
    * Collect styles
- PWA service worker using **workbox** for offline (configured ```passing env.PWA=true```), manifest generation using ebpack
- Progressive enhanced schema generated forms (extending *Formik*), processed and validated on the client and server (using *Yup*)
- i18n / l10n
    * *react-intl* with translation workflow using babel plugin and custom webpack plugin and cli tools
- Responsive layouts
- First class React portals
    * Modals
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

#### Include Wireframes in the build

Prefix the command with ```WIREFRAME```, e.g.

```bash
WIREFRAME=true yarn dev:client
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



## Translations

Translations are extracted from the source, managed and reported as part of the build.

A customised version of ```react-intl``` is used to extract translations from the source. For example:

```jsx
<FormattedMessage
    defaultMessage="REF: {reference}"
    description="Success message when getting an example item"
    values={{reference}}
/>
```

or

```jsx
const messages = defineMessages({
    submit: {
        defaultMessage: "Submit Form",
        description: "The submit button"
    },
});
```

The ```id``` property does not need to be specified as it is automatically generated based on path/filename using ```react-intl-auto```.


### Configuration

Translations are configured via the ```i18n.config.json``` in the root directory.

```json
{
    "config": "app/webpack/metadata",
    "languages": ["en-GB", "de", "fr", "es", "it"]
}
```

* ```config``` - An object literal or a relative path to a javascript file which exports an object literal with the schema:
    * ```i18nMessagesPath``` - Output path of generated translation files
    * ```i18nLocalePath``` - Application path to the i18n files 
    * ```reportsPath``` - Build output report path
    * ```version``` - Application version - used for reporting and generated filenames
* ```languages``` - Array of BCP 47 language tags

### Stats

To view the latest stats from the command line:

```bash
yarn translations:manage
```

To generate a set of files for each configured language containing outstanding translations:
 
```bash
yarn translations:manage --gen
```

If you need to integrate report into other tooling you can fail with an exit code of 3: 

```bash
yarn translations:manage --status
```


### Updating translations

To update a language translation at the ```i18nLocalePath```:

```bash
yarn translations:update --src <filename>
```

where ```filename``` is the translated version of a file created with ```yarn translations:manage --gen```.


### Example workflow

* Add language(s) to ```i18n.config.json```
* Run the build
    * The defaultMessages are extracted from the source
    * The report is updated to reflect the new languages(s) and will show 0% translated
* Translated the generated translation files for each language (this could be manually sending the file to a translator or integrating with a translation tool API)
* Once translation files(s) have been translated, update the source using the ```translations:update``` command or integrate with a translation tool API to perform the source updates(s)
    * The updated language file(s) are committed to source control
* Re-build
    * The report will be updated to reflect the new translation state
