// Define all the modules that we will be using in this file.
const webserver = require('rjweb-server')
require('dotenv').config();

// Define Routes for the web server
const routes = new webserver.routeList()

routes.routeBlock('/') //*1
  .add('GET', '/', (ctr) => {
    ctr.print('Hello world!')
  })
  .loadCJS('./routes') // This will load all Routes from the Routes folder and add the prefix / (*1) to them

routes.routeBlock('/api')
  .auth((ctr) => { // This will authenticate routes that are defined below
    if (!ctr.queries.has('auth')) return ctr.status(422).print('Auth Query (?auth=) is missing!')
    if (ctr.queries.get('auth') !== '123') return ctr.status(401).print('Auth Query (?auth=) is not 123')

    return ctr.status(200) // If everything is valid, return 200 status (ok)
  })
  .add('GET', '/', (ctr) => { // This will be available on /api since it combines every prefix to the top
    ctr.print('Welcome to the API!')
  })

routes.routeBlock('/homepage')
  .static('./static', {
    hideHTML: true, // This will automatically hide the .html extension from pages, so /index.html -> /, /blog.html -> /blog
    addTypes: true // This will automatically add Content-Types for Javascript, etc
  })

routes.event('notfound', (ctr) => {
  ctr.status(404)
  ctr.print('This page was not found!')
})

routes.event('request', (ctr) => {
  console.log(`${ctr.url.method} Request made to ${ctr.url.href} by ${ctr.client.ip}`)
})

const controller = webserver.initialize({
  port: process.env.SERVER_PORT,
  compression: 'gzip',
  proxy: true
})

controller.setRoutes(routes)
controller.start().then((res) => {
  console.log(`server listening on port ${res.port}`)
})