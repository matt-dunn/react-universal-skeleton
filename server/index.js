import path from 'path'
import express from 'express'
import log from 'llog'
import ssr from './lib/ssr'
import bodyParser from 'body-parser'
import helmet from 'helmet'

const app = express()// Expose the public directory as /dist and point to the browser version
app.use(helmet())
app.use('/', express.static(path.resolve(process.cwd(), 'dist', 'client')));// Anything unresolved is serving the application and let
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
// react-router do the routing!
app.get('/*', ssr)
app.post('/*', ssr)
// Check for PORT environment variable, otherwise fallback on Parcel default port
const port = process.env.PORT || 1234;
app.listen(port, () => {
    log.info(`Listening on port ${port}...`);
});
