// Define all the modules that we will be using in this file.
const { Server } = require('rjweb-server')
require('dotenv').config();

// Define Routes for the web server
const server = new Server({
  port: process.env.SERVER_PORT,
  compression: 'gzip',
  proxy: true
})

server.prefix('/') //*1
  .add('GET', '/', (ctr) => {
    ctr.print('Hello world!')
  })
  .loadCJS('./routes') // This will load all Routes from the Routes folder and add the prefix / (*1) to them

server.prefix('/api')
  .validate((ctr) => { // This will validate routes that are defined below
    if (!ctr.queries.has('auth')) return ctr.status(422).print('Auth Query (?auth=) is missing!')
    if (ctr.queries.get('auth') !== '123') return ctr.status(401).print('Auth Query (?auth=) is not 123')

    return ctr.status(200) // If everything is valid, return 200 status (ok)
  })
  .add('GET', '/', (ctr) => { // This will be available on /api since it combines every prefix to the top
    ctr.print('Welcome to the API!')
  })
  .prefix('/user')
    .validate((ctr) => { // Requires Additional Validation, not just the one above
      if (!ctr.queries.has('user')) return ctr.status(422).print('User Query (?user=) is missing!')

      return ctr.status(200) // If everything is valid, return 200 status (ok)
    })
    .add('GET', '/infos', (ctr) => {
      ctr.print({
        username: ctr.queries.get('user'),
        password: '123'
      })
    })

server.prefix('/homepage')
  .static('./static', {
    hideHTML: true, // This will automatically hide the .html extension from pages, so /index.html -> /, /blog.html -> /blog
    addTypes: true // This will automatically add Content-Types for Javascript, etc
  })

server.event('notfound', (ctr) => {
  ctr.status(404)
  ctr.print('This page was not found!')
})

server.event('request', (ctr) => {
  console.log(`${ctr.url.method} Request made to ${ctr.url.href} by ${ctr.client.ip}`)
})

server.start().then((res) => {
  console.log(`server listening on port ${res.port}`)
})